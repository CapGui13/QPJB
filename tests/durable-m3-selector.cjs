'use strict';
// M3: isolated integration experiment. No production files are modified.
const BASE='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
function makeEngine(read,api,clock,candidate){
 const cache=new Map();
 function load(path){
  path=path.replace(/^\.\//,'');
  if(cache.has(path))return cache.get(path).exports;
  let src=read(path);
  if(path==='quizz-parcours.js'){
   const patch=(old,next)=>{if(src.split(old).length!==2)throw Error('anchor changed '+old);src=src.replace(old,next);};
   patch('const previous=state.entries||{};', 'const previous=state.entries||{};');
   // Both variants assert the identical original eligibility and selection checks.
   patch('const ranked=candidates.map(q=>({q,v:score(q,category)+(deltas.get(q.id)||0)}));',
     'const hints=durable&&category==="maintenance"&&!priority&&durableSlots<2?new Map(durable.rank({candidates,selected,category,forcedReason,priority}).map(x=>[x.id,x.delta])):new Map();\n      const ranked=candidates.map(q=>({q,v:score(q,category)+(deltas.get(q.id)||0)+(hints.get(q.id)||0)}));');
   patch('const s=state.completed,limit=clamp(int(n,10),1,20),e=evidence(state,exercises);',
     'const s=state.completed,limit=clamp(int(n,10),1,20),e=evidence(state,exercises);\n    const durable=enabled&&s>=3&&!state.active?mastery.prepareReview({history:state,exercises,nowMs:clock.now}):null;let durableSlots=0;');
   patch('const q=ranked[0].q,m=mOf(q),cat=category||classify(q);',
     'const q=ranked[0].q,m=mOf(q),cat=category||classify(q);\n      if(hints.has(q.id)){durableSlots++;clock.hinted++;}if(durableSlots>2)throw Error("M3 cap");if(!evaluate(q,state,e).eligible)throw Error("ineligible "+q.id);');
  }
  const m={exports:{}};cache.set(path,m);
  new Function('module','exports','require','window','mastery','clock','enabled',src)(m,m.exports,load,undefined,api,clock,candidate);
  return m.exports;
 }
 return load('quizz-parcours.js');
}
function run(read,api,qs,meta,configs){
 const DAY=86400000,HOUR=3600000,T=Date.UTC(2025,0,1);
 const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return(h>>>0)/4294967296};
 const byId=new Map(qs.map(q=>[q.id,q])),key=q=>meta[q.id].concept;
 const results=[];
 let checks=0;const ok=(v,m)=>{checks++;if(!v)throw Error(m)};
 for(const {profile,seed,horizon} of configs){
  const pair=[];
  for(const candidate of [false,true]){
   const clock={now:T,hinted:0},engine=makeEngine(read,api,clock,candidate),state=engine.empty();
   const allFamilies=new Set(),allConcepts=new Set(),last={},answers=[],snapshots=[];
   let dueServed=0,weakDueServed=0,dueOpportunities=0,weakDueOpportunities=0,short=0,dupes=0,violations=0,hard=0,exactRecall=0,elapsed=0,peak=0,previousTime=T,firstThree=[];
   for(let n=1;n<=horizon;n++){
    clock.now+=profile==='grouped'?HOUR:profile==='weekly'?7*DAY:DAY;
    if(profile==='resumption'&&n===91)clock.now+=90*DAY;
    const due=api.assess({history:state,exercises:qs,nowMs:clock.now}).concepts;
    const start=Date.now(),deck=engine.start(state,qs),ms=Date.now()-start;elapsed+=ms;peak=Math.max(peak,ms);
    const ids=deck.map(q=>q.id),families=deck.map(q=>q.caseFamily);
    if(ids.length!==10)short++;if(new Set(families).size!==families.length||new Set(ids).size!==ids.length)dupes++;
    ok(ids.length===10,'short session '+profile+' '+n);ok(new Set(families).size===10&&new Set(ids).size===10,'duplicates '+profile+' '+n);
    if(n<=3)firstThree.push(ids);
    const pass=deck.filter(q=>q.theme==='ouv'&&q.answer==='Passe').length;
    ok(n===1?pass===3&&deck.every(q=>q.theme==='ouv'):n===3?pass<=1:pass<=2,'opening Passe '+n);
    const sel=state.active.selection;
    exactRecall+=sel.filter(x=>x.reason==='rappel_erreur_aide').length;
    const dk=new Set(deck.map(key));
    dueServed+=Array.from(dk).filter(k=>due[k].reviewDue===true).length;
    weakDueServed+=Array.from(dk).filter(k=>due[k].reviewDue===true&&due[k].fragile).length;
    dueOpportunities+=Object.values(due).filter(x=>x.reviewDue===true).length;
    weakDueOpportunities+=Object.values(due).filter(x=>x.reviewDue===true&&x.fragile).length;
    for(let i=0;i<deck.length;i++){
     const q=deck[i],k=key(q),u=hash(profile+':'+seed+':'+n+':'+q.id);
     let result='correct',assisted=false,free=false;
     if(profile==='assisted'){if(u<.20)result='wrong';else if(u<.65)assisted=true;else if(u<.80)free=true;else if(u<.85)result='skipped';}
     if(profile==='forgetting'&&n>=70&&n<=110&&u<.65)result='wrong';
     if(profile==='resumption'&&n>=91&&n<=105&&u<.45)result='wrong';
     if(profile==='weekly'&&u<.12)result='wrong';
     if(profile==='grouped'&&u<.20)result='wrong';
     const choice=result==='correct'?q.answer:result==='skipped'?null:q.choices.find(x=>x!==q.answer);
     ok(engine.record(state,q,result,i,choice,assisted,free),'record');
     allFamilies.add(q.caseFamily);allConcepts.add(k);last[k]=n;hard+=q.difficulty>=4?1:0;
    }
    ok(engine.finish(state,qs),'finish');
    state.journal.at(-1).recordedAt=new Date(clock.now).toISOString();
    if([20,65,90,91,105,153,180,horizon].includes(n)){
     const now=api.assess({history:state,exercises:qs,nowMs:clock.now}).concepts,ss=Object.values(now);
     snapshots.push({session:n,families:allFamilies.size,concepts:allConcepts.size,multi:ss.filter(x=>x.evidence.status==='multi_family_multi_session').length,delayed:ss.filter(x=>x.retention.intervalMs>=DAY).length,fragile:ss.filter(x=>x.fragile).length,due:ss.filter(x=>x.reviewDue===true).length,conceptGapsOver20:Object.values(last).filter(x=>n-x>20).length,dueServed,weakDueServed,dueOpportunities,weakDueOpportunities,hard,exactRecall,hinted:clock.hinted,short,dupes,violations,selectMeanMs:Math.round(elapsed/n*100)/100,selectMaxMs:peak});
    }
   }
   const loaded=engine.load(JSON.stringify(state)),a=JSON.stringify(loaded);
   const started=engine.start(loaded,qs).map(q=>q.id),resumed=engine.start(loaded,qs).map(q=>q.id);
   ok(JSON.stringify(started)===JSON.stringify(resumed),'resume deck');
   pair.push({variant:candidate?'m3':'base',firstThree,snapshots});
  }
  ok(JSON.stringify(pair[0].firstThree)===JSON.stringify(pair[1].firstThree),'S1–3 exact parity');
  results.push({profile,seed,horizon,checks:checks,pair});
 }
 return {checks,results};
}
module.exports={BASE,makeEngine,run};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
 const api=require('../quizz-durable-m3-maitrise.js'),root=path.join(__dirname,'..');
 const read=p=>execFileSync('git',['show',BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});
 const qs=JSON.parse(read('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
 const meta=JSON.parse(read('quizz-prerequis.js').split('return ')[1].split('};});')[0]+'}').byId;
 const profile=process.argv[2],seed=Number(process.argv[3]),horizon=Number(process.argv[4]||180);
 const configs=profile?[{profile,seed,horizon}]:['grouped','daily','weekly','forgetting','assisted','resumption'].flatMap(profile=>[11,47,103].map(seed=>({profile,seed,horizon})));
 console.log(JSON.stringify(run(read,api,qs,meta,configs),null,2));
}
