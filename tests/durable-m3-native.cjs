'use strict';
// M3 native acceptance. No production modification; full run is the default.
const BASE='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
const profiles=['grouped','daily','weekly','forgetting','assisted','resumption'];
const seeds=[11,47,103],policies=['broad','calendar'];
function makeCases(exercises,meta){
 const groups=new Map(),DAY=86400000,T=Date.UTC(2025,0,1);
 for(const q of exercises){const k=meta[q.id]?.concept;if(!k)throw Error('missing metadata '+q.id);if(!groups.has(k))groups.set(k,new Map());groups.get(k).set(q.caseFamily,q);}
 if(groups.size!==99||exercises.length!==1915)throw Error('frozen catalogue mismatch');
 const qs=exercises.map(({id,caseFamily,answer})=>({id,caseFamily,answer}));
 const a=(q,kind='clean')=>({id:q.id,result:kind==='wrong'?'wrong':'correct',choice:kind==='wrong'?q.choices.find(x=>x!==q.answer):q.answer,assisted:kind==='assisted',hadFreeError:kind==='corrected',family:q.caseFamily});
 const events=[];
 for(const [concept,pool] of groups){const arr=[...pool.values()];if(arr.length<3)throw Error('insufficient families '+concept);for(const q of arr.slice(0,3)){const session=events.length+1;events.push({mode:'parcours',session,recordedAt:new Date(T+session*DAY).toISOString(),answers:[a(q)]});}}
 const state=journal=>({version:1,completed:journal.length,journal,entries:{},skills:{}});
 const clone=x=>JSON.parse(JSON.stringify(x));
 const mixed=clone(events);for(let i=0;i<mixed.length;i+=9){const q=exercises.find(q=>q.id===mixed[i].answers[0].id);mixed[i].answers=[a(q,i%27===0?'wrong':i%27===9?'assisted':'corrected')];}
 const undated=events.map(e=>({...e,recordedAt:null})),future=clone(events);future[3].recordedAt='2030-01-01T00:00:00.000Z';
 const recent=T+298*DAY,old=T+400*DAY;
 return [{name:'empty',history:state([]),nowMs:recent},{name:'recent',history:state(events),nowMs:recent},{name:'overdue',history:state(events),nowMs:old},{name:'mixed',history:state(mixed),nowMs:old},{name:'undated',history:state(undated),nowMs:old},{name:'future',history:state(future),nowMs:old},{name:'active',history:{...state(events),active:{ids:[qs[0].id]}},nowMs:old}].map(c=>({...c,exercises:qs,candidates:qs,category:'maintenance'}));
}
function inspect(api,input){
 const before=JSON.stringify(input),a=api.assess(input);
 if(Object.keys(a.concepts).length!==99||Object.values(a.concepts).some(s=>s.mastery!=='not_established'))throw Error('evidence invariant '+input.name);
 const ranking={};
 for(const policy of ['broad','calendar']){
  const o={...input,policy},r=api.rankReview(o),prepared=api.prepareReview(o).rank(o);
  if(JSON.stringify(r)!==JSON.stringify(prepared)||r.some(x=>x.delta<=0||x.delta>(policy==='calendar'?12:30)))throw Error('rank invariant '+input.name);
  if(input.name==='active'&&r.length)throw Error('active ranking');
  ranking[policy]=r;
 }
 if(before!==JSON.stringify(input)||JSON.stringify(a)!==JSON.stringify(api.assess(input)))throw Error('purity/determinism '+input.name);
 return {assessment:a,ranking};
}
function stable(x){if(Array.isArray(x))return x.map(stable);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).filter(([k])=>!['selectMeanMs','selectMaxMs'].includes(k)).map(([k,v])=>[k,stable(v)]));return x;}
function normalizeSelector(result){return stable({...result,results:result.results.map(x=>({...x,strategy:x.strategy??'broad'}))});}
async function main(){
 const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
 const root=path.join(__dirname,'..'),dir=path.join(root,'audits','apprentissage-durable-20261126','m3');
 const flags=new Set(process.argv.slice(2));for(const flag of flags)if(!['--quick','--node-only'].includes(flag))throw Error('unknown flag '+flag);
 const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024}).trim();
 const head=git(['rev-parse','HEAD']);git(['cat-file','-e',BASE+'^{commit}']);
 const read=p=>execFileSync('git',['show',BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});
 const child=(file,args=[])=>JSON.parse(execFileSync(process.execPath,[path.join(__dirname,file),...args],{cwd:root,encoding:'utf8',maxBuffer:128*1024*1024,timeout:600000}));
 const log=[],record=(name,result)=>{log.push({name,...result});console.error('PASS '+name);};
 const mainResult=child('durable-m3-maitrise.cjs');assert.ok(mainResult.assertions>=49877);record('mastery',{assertions:mainResult.assertions});
 const calendar=child('durable-m3-calendar-policy.cjs');assert.equal(calendar.scenarios,693);record('calendar-policy',{checks:calendar.checks});
 for(const name of ['selector-review','cross-seed','three-seeds','broad-three-seeds']){const result=child('durable-m3-'+name+'.cjs');assert.ok(result.checks>0);record(name,{checks:result.checks});}
 if(!flags.has('--quick')){
  const coverage=child('durable-m3-coverage-alert.cjs');
  assert.deepEqual(coverage,JSON.parse(fs.readFileSync(path.join(dir,'selector-coverage-alert.json'),'utf8')),'coverage alert native reproduction');
  record('coverage-alert',{target:coverage.target,checks:coverage.reports.reduce((sum,r)=>sum+r.checks,0)});
  for(const policy of policies)for(const profile of profiles)for(const seed of seeds){
   const result=child('durable-m3-selector.cjs',[profile,String(seed),'180',policy]);
   const file='selector-'+(policy==='calendar'?'calendar-':'')+profile+'-'+seed+'.json';
   const archived=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
   assert.deepEqual(normalizeSelector(result),normalizeSelector(archived),file+' native reproduction (excluding timings and historical missing broad tag)');
   record(file,{checks:result.checks});
  }
 }
 if(!flags.has('--node-only')){
  const playwright=require(process.env.QPJB_PLAYWRIGHT_MODULE||'playwright');
  const catalogue=JSON.parse(read('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
  const m={exports:{}};new Function('module','exports','window',read('quizz-prerequis.js'))(m,m.exports,undefined);
  const api=require('../quizz-durable-m3-maitrise.js'),cases=makeCases(catalogue,m.exports.byId),expected=cases.map(c=>inspect(api,c));
  for(const kind of ['chromium','webkit']){
   const browser=await playwright[kind].launch({headless:true});
   try{
    const context=await browser.newContext({offline:true,locale:'en-US'}),page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    await page.setContent('<!doctype html><meta charset="utf-8"><title>M3 native test</title>');
    await page.addScriptTag({path:path.join(root,'quizz-durable-m3-maitrise.js')});
    // Use exact same function in the real browser; no simulated window.
    for(let i=0;i<cases.length;i++){
     const actual=await page.evaluate(({source,input})=>{const inspect=(0,eval)('('+source+')');return inspect(window.QPJBDurableMastery,input);},{source:inspect.toString(),input:cases[i]});
     assert.deepEqual(actual,expected[i],kind+' '+cases[i].name);
    }
    assert.deepEqual(errors,[]);record(kind,{version:browser.version(),scenarios:cases.length,offline:true});await context.close();
   }finally{await browser.close();}
  }
 }
 console.log(JSON.stringify({schema:'QPJB_M3_NATIVE_ACCEPTANCE_V1',head,base:BASE,node:process.version,platform:process.platform,fullSelector:!flags.has('--quick'),browserExecuted:!flags.has('--node-only'),status:flags.size?'PARTIAL_PASS':'PASS',results:log},null,2));
}
module.exports={makeCases,inspect,stable,normalizeSelector};
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
