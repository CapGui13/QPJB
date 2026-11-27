'use strict';
// Reprise 6 B: source loader can be Node or an in-memory connector runtime.
// All response rules and comparators are original. No production changes.
const B=require('../quizz-coherence-reprise6-b-transitions.js'),P=require('../quizz-coherence-m3-prerequis.js'),O=require('../quizz-coherence-m2-ordre.js'),T=require('../quizz-coherence-m6-traces.js'),D=require('../quizz-coherence-m4p-d-lab.js'),F=require('../quizz-coherence-m4-diversite.js');
const BASE='13966e475cf986c6f76e7faf870377fdf4ef99aa';
const check=(x,m)=>{if(!x)throw Error(m)};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const order={coherenceM2:O,coherenceFullOrder:true,transitionGroups:[{simple:P.TEXAS_ELEMENTARY,complex:P.TEXAS},{simple:P.STAYMAN_SIMPLE,complex:P.STAYMAN_FOURTH}]};
function units(exercises,meta,source){
 check(exercises.length===1915&&Object.keys(meta).length===1915&&new Set(Object.values(meta).map(x=>x.concept)).size===99,'catalogue');
 const by=new Map(exercises.map(q=>[q.id,q]));let n=0;
 for(const [id,spec] of Object.entries(B.specs)){
  const q=by.get(id);check(q&&meta[id].concept===spec.concept,'target '+id);
  check(q.auction.length===3&&q.auction.every(a=>!a.includes('(')),'explicit context '+id);
  const state={completed:10,active:null,entries:{}},e={seen:new Map(),weakConcept:{}};
  const ctx={state,e,metadataById:meta,mode:'SX',limit:1};
  check(!B.assess(q,ctx).allow,'missing source '+id);n++;
  for(const s of B.sources[spec.need]){
   const x=by.get(s);check(x,'source '+s);
   const answer=spec.need==='stayman-2SA'?'2SA':spec.need==='texas-coeur'?'2♦':'2♥';
   check(x.answer===answer,'wrong decision '+s);
   e.seen.set(meta[s].concept,new Set([s]));
   check(B.assess(q,ctx).allow,'source exposure '+s);n++;
   e.seen.clear();
  }
  e.weakConcept[spec.concept]=1;check(B.assess(q,ctx).allow,'weak recall');delete e.weakConcept[spec.concept];n++;
  state.entries[id]={};check(B.assess(q,ctx).allow,'exact recall');delete state.entries[id];n++;
  state.active={};check(B.assess(q,ctx).allow,'active');state.active=null;n++;
  check(B.filter([q],ctx)[0]===q,'small pool fallback');n++;
 }
 for(const id of [...P.TEXAS,...P.TEXAS_ELEMENTARY]){
  check(B.assess(by.get(id),{state:{completed:4},mode:'SX'}).allow,'first transfer must remain accessible');n++;
 }
 check(B.instrument(source)!==source,'anchor');n++;
 return n;
}
function makeEngine(source,requireBase){
 const marker='SELECTION_REASONS,summary,levelFor};';
 check(source.split(marker).length===2,'export anchor');
 source=source.replace(marker,'SELECTION_REASONS,summary,levelFor,metadataForB:metadata,patternForB:decisionPattern,batchForB:(deck,state,exercises)=>{const e=evidence(state,exercises);return deck.map(q=>evaluate(q,state,e))}};');
 let now=Date.UTC(2026,0,1);
 class FixedDate extends Date{constructor(...a){super(...(a.length?a:[now]))}static now(){return now}}
 const mod={exports:{}};
 new Function('module','exports','require','Date',source)(mod,mod.exports,requireBase,FixedDate);
 return {api:mod.exports,clock:s=>now=Date.UTC(2026,0,1)+(s-1)*86400000};
}
function runM6({source,requireBase,exercises,meta,profile,seed,horizon,mode='off',measure=()=>0}){
 const {api,clock}=makeEngine(mode==='off'?source:B.instrument(source),requireBase);
 const state=api.empty(),sessions=[],events=[],settings={...order,observe:x=>events.push(x),...(mode==='off'?{}:{coherenceReprise6B:B.policy(mode)})};
 const effective={byId:Object.fromEntries(exercises.map(q=>[q.id,api.metadataForB(q)]))};
 for(let s=1;s<=horizon;s++){
  clock(s);const at=measure(),deck=api.start(state,exercises,settings),latencyMs=Math.max(0,measure()-at);
  const elig=api.batchForB(deck,state,exercises);
  check(elig.every(x=>x.eligible),'native eligibility');
  const trace=T.traceSession({deck,selection:state.active.selection,meta:effective,rawMeta:{byId:meta},elig,pattern:q=>api.patternForB(q),s,history:sessions,profile,seed,latencyMs});
  check(!D.guard(trace.rows.map(r=>({...r,level:r.difficulty})),s).length,'early guard S'+s);
  for(const [i,q] of deck.entries()){
   const r=trace.rows[i],choice=r.result==='correct'?q.answer:q.choices.find(x=>x!==q.answer);
   check(api.record(state,q,r.result,i,choice,r.assisted,r.hadFreeError),'record');
   r.choice=choice;
   if(i===0&&[1,2,3,5,20,65,153,180].includes(s)){
    for(const restored of [api.load(JSON.stringify(state)),api.importProgress(api.exportProgress(state,exercises,{}))]){
     check(same(restored.active,state.active)&&same(api.start(restored,exercises,settings).map(x=>x.id),deck.map(x=>x.id)),'exact restore S'+s);
    }
   }
  }
  check(api.finish(state,exercises),'finish');
  sessions.push(trace);
 }
 const checkpoints=T.HORIZONS.filter(n=>n<=horizon).map(n=>({session:n,...T.metrics(sessions.slice(0,n))}));
 check(checkpoints.every(x=>!x.violations.length),'M6 structural');
 return {profile,seed,horizon,policy:'fixed-385-395-v1',catalogueKey:'frozen-1915',sessions,checkpoints,events};
}
function runD({source,requireBase,requireTest,originalCampaign,exercises,meta,profile,seed,horizon,mode='off',measure=()=>0}){
 let harness=originalCampaign;
 const replace=(a,b,n=1)=>{check(harness.split(a).length===n+1,'D adapter anchor '+a);harness=harness.replaceAll(a,b)};
 replace('verify=true,measure=()=>0})','verify=true,measure=()=>0,options={}})');
 replace('const api=mod.exports,state=api.empty(),sessions=[]','const settings={...options,observe:r=>changes.push(r)};\n  const api=mod.exports,state=api.empty(),sessions=[]');
 replace('api.start(state,exercises)','api.start(state,exercises,settings)',2);
 const mod={exports:{}};
 new Function('module','exports','require',harness)(mod,mod.exports,requireTest);
 const t=mod.exports.run({source:mode==='off'?source:B.instrument(source),requireBase,exercises,meta,profile,seed,horizon,verify:true,measure,options:{...order,...(mode==='off'?{}:{coherenceReprise6B:B.policy(mode)})}});
 D.analyze(t,{catalogue:exercises,metadata:meta,features:F.features,verifyResponse:true});
 return t;
}
function transition(t){
 const seen=new Set(),violations=[],first=[];
 for(const s of t.sessions){
  for(const r of s.rows){const spec=B.specs[r.id];if(spec&&!seen.has(r.id)){
   const ok=B.sources[spec.need].some(x=>seen.has(x));
   first.push({s:s.session,id:r.id,need:spec.need,prior:ok});
   if(!ok)violations.push({s:s.session,id:r.id,need:spec.need});
  }}
  for(const r of s.rows)seen.add(r.id);
 }
 return {first,violations};
}
function compareD(before,after,exercises,meta){
 const changed=after.sessions.flatMap((s,i)=>{const a=before.sessions[i].rows.map(r=>r.id),b=s.rows.map(r=>r.id);return same(a.slice().sort(),b.slice().sort())?[]:[{session:s.session,removed:a.filter(x=>!b.includes(x)),added:b.filter(x=>!a.includes(x))}];});
 const p=D.comparePair({profile:before.profile,seed:before.seed,horizon:before.horizon,before,after:{...after,changes:changed}},{catalogue:exercises,metadata:meta,features:F.features,verifyResponse:true,legacy:true});
 return {...p,changed,transitionBefore:transition(before),transitionAfter:transition(after),events:after.changes};
}
function compareM6(before,after){
 const result=T.compare(before,after);
 return {changes:result.changes.filter(x=>!x.sameSet),review:result.checkpoints.flatMap(x=>x.review.map(y=>({s:x.session,metric:y}))),transitionBefore:transition(before),transitionAfter:transition(after),events:after.events,checkpoints:result.checkpoints};
}
module.exports={BASE,units,runM6,runD,compareM6,compareD,transition};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),root=path.join(__dirname,'..');
 const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const source=git('show',BASE+':quizz-parcours.js'),html=git('show',BASE+':quizz.html'),oldHtml=git('show',T.BASE+':quizz.html');
 const embedded=x=>x.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
 check(embedded(html)===embedded(oldHtml),'historical catalogue mismatch');
 const exercises=JSON.parse(embedded(html)).exercises,meta=require('../quizz-prerequis.js').byId;
 const requireBase=require('node:module').createRequire(path.join(root,'quizz-parcours.js'));
 const requireTest=require('node:module').createRequire(path.join(root,'tests/coherence-concrete-m4-campaign.cjs'));
 const originalCampaign=git('show',BASE+':tests/coherence-concrete-m4-campaign.cjs');
 const out=process.env.OUT||'reprise6-b-output',horizon=Number(process.env.HORIZON||180),mode=process.env.MODE||'SX',rows=[];
 fs.mkdirSync(out,{recursive:true});
 console.log('UNIT '+units(exercises,meta,source));
 for(const profile of T.PROFILES.filter(p=>!process.env.PROFILE||p===process.env.PROFILE))for(const seed of T.SEEDS.filter(s=>!process.env.SEED||s===Number(process.env.SEED))){
  const ctx={source,requireBase,requireTest,originalCampaign,exercises,meta,profile,seed,horizon,measure:()=>performance.now()};
  const m=runM6(ctx),m1=runM6({...ctx,mode}),d=runD(ctx),d1=runD({...ctx,mode});
  const summary={profile,seed,horizon,mode,M6:compareM6(m,m1),D:compareD(d,d1,exercises,meta)};
  rows.push(summary.D);fs.writeFileSync(path.join(out,profile+'-'+seed+'.json'),JSON.stringify({summary,traces:{m,m1,d,d1}}));
  console.log(JSON.stringify({profile,seed,horizon,mode,changes:summary.D.changed.length,regressions:summary.D.regressions.filter(r=>r.metric!=='latency-observation').length,M6:summary.M6.changes.length}));
 }
 fs.writeFileSync(path.join(out,'gate.json'),JSON.stringify(D.compareCheckpoints(rows,{fullMatrix:rows.length===18&&horizon===180}),null,2));
}
