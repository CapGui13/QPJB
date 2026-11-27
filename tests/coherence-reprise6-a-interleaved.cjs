'use strict';
// Extra consolidation trajectory, separate from the unchanged M6/D gates.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const C=require('./coherence-concrete-m6-campaign.cjs'),T=require('../quizz-coherence-m6-traces.js'),D=require('../quizz-coherence-m4p-d-lab.js'),L=require('../quizz-coherence-reprise6-a-lookahead.js'),m2=require('../quizz-coherence-m2-ordre.js'),m3=require('../quizz-coherence-m3-prerequis.js'),legacy=require('./durable-m6-campaign.cjs');
const BASE='13966e475cf986c6f76e7faf870377fdf4ef99aa',root=path.resolve(__dirname,'..');
const [profile='autonome',rawSeed='11',rawHorizon='180',dest='interleaved-output']=process.argv.slice(2),seed=Number(rawSeed),horizon=Number(rawHorizon);
assert(T.PROFILES.includes(profile)&&T.SEEDS.includes(seed)&&T.HORIZONS.includes(horizon));
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
const src=Object.fromEntries(git('ls-tree','--name-only',BASE).trim().split('\n').filter(p=>p==='quizz.html'||/^quizz-.*\.js$/.test(p)||p==='parcours-recommandations.js').map(p=>[p,git('show',BASE+':'+p)]));
const full={coherenceM2:m2,coherenceFullOrder:true,transitionGroups:[{simple:m3.TEXAS_ELEMENTARY,complex:m3.TEXAS},{simple:m3.STAYMAN_SIMPLE,complex:m3.STAYMAN_FOURTH}]};
const ids=d=>d.map(q=>q.id);
function resume(api,state,exercises,settings,deck){for(const restored of [api.load(JSON.stringify(state)),api.importProgress(api.exportProgress(state,exercises,{}))]){assert.deepEqual(restored.active,state.active);assert.deepEqual(ids(api.start(restored,exercises,settings)),ids(deck));}}
function run(model,candidate){
 const e=C.engine(src),{api,exercises,meta,effectiveMeta}=e,state=api.empty(),sessions=[],consolidations=[],decisions=[];
 const fingerprint=JSON.stringify(exercises),metafingerprint=JSON.stringify(meta);
 const outcome=(s,q)=>model==='M6'?T.outcome(profile,seed,q,s):D.response(profile,seed,s,{...q,concept:meta.byId[q.id].concept});
 function play(deck,s,settings){
  for(const [i,q] of deck.entries()){
   const r=outcome(s,q),choice=r.result==='correct'?q.answer:q.choices.find(x=>x!==q.answer);
   assert(api.record(state,q,r.result,i,choice,r.assisted,r.hadFreeError));
   if(i===0)resume(api,state,exercises,settings,deck);
  }
  assert(api.finish(state,exercises));
 }
 for(let s=1;s<=horizon;s++){
  e.clock(s*86400000);
  assert.equal(state.completed,s-1);assert.equal(state.active,null);
  const p=candidate?L.prepare({api,state,exercises,metadataById:meta.byId,options:full,variant:'lookahead-context'}):null;
  const settings=p?{...full,coherenceM1:p.policy}:full;
  const deck=api.start(state,exercises,settings);
  legacy.verifyEarly(deck,s);assert.equal(deck.length,10);assert.equal(new Set(ids(deck)).size,10);assert.equal(new Set(deck.map(q=>q.caseFamily||q.id)).size,10);
  assert(api.eligibilityBatch(deck,state,exercises).every(x=>x.eligible));
  if(p?.decision){assert(deck.some(q=>q.id===p.decision.id)&&!deck.some(q=>q.id===p.decision.oldId));decisions.push(p.decision)}
  sessions.push({session:s,ids:ids(deck),roles:s===5?L.profile({session:s,metadataById:meta.byId},deck):null});
  play(deck,s,settings);assert.equal(state.completed,s);
  // Real sessions interleaved into the same state, not probes on a clone.
  if(s%5!==0)continue;
  const plan=api.consolidationPlan(state,exercises),before=state.completed,deckC=api.startConsolidation(state,exercises);
  if(!plan.available){assert.equal(deckC.length,0);continue}
  assert.deepEqual(ids(deckC),plan.items.map(x=>x.id));assert.equal(state.active.mode,'consolidation');
  assert(deckC.length>=4&&deckC.length<=10);assert.equal(new Set(ids(deckC)).size,deckC.length);assert.equal(new Set(deckC.map(q=>q.caseFamily||q.id)).size,deckC.length);
  assert(api.eligibilityBatch(deckC,state,exercises).every(x=>x.eligible));
  play(deckC,s,settings);assert.equal(state.completed,before);assert.equal(state.active,null);
  assert.equal(api.consolidationPlan(state,exercises).available,false);
  consolidations.push({at:s,ids:ids(deckC),targets:plan.items.map(x=>x.target)});
 }
 assert.equal(JSON.stringify(exercises),fingerprint);assert.equal(JSON.stringify(meta),metafingerprint);
 return {sessions,consolidations,decisions,completed:state.completed};
}
const results={};
for(const model of ['M6','D']){
 const before=run(model,false),after=run(model,true);
 assert.deepEqual(before.sessions.slice(0,4),after.sessions.slice(0,4));assert.equal(before.completed,horizon);assert.equal(after.completed,horizon);
 results[model]={before,after,changed:before.sessions.filter((s,i)=>s.ids.slice().sort().join()!==after.sessions[i].ids.slice().sort().join()).length};
}
fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(path.join(dest,'interleaved.json'),JSON.stringify({profile,seed,horizon,results}));
console.log(JSON.stringify({profile,seed,horizon,models:Object.fromEntries(Object.entries(results).map(([m,r])=>[m,{changed:r.changed,consolidations:[r.before.consolidations.length,r.after.consolidations.length],decisions:r.after.decisions.length,completed:[r.before.completed,r.after.completed]}]))}));
