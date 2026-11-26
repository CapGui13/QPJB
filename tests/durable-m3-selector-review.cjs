'use strict';
// Reproducible independent audit of persisted M3 selector experiments.
const profiles=['grouped','daily','weekly','forgetting','assisted','resumption'];
const strategies=['broad','calendar'];
const metrics=['families','concepts','multi','delayed','fragile','due','conceptGapsOver20','dueServed','weakDueServed','dueOpportunities','weakDueOpportunities','hard','exactRecall','hinted','short','dupes','violations'];
const checkpoints=[20,65,90,91,105,153,180];
function analyze(read){
 let checks=0;const ok=(v,m)=>{checks++;if(!v)throw Error(m)};
 const eq=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),m);
 const rows=[],baselines=new Map();
 let reportedAssertions=0,trajectories=0,completedSessions=0;
 for(const profile of profiles)for(const strategy of strategies){
  const filename='selector-'+(strategy==='calendar'?'calendar-':'')+profile+'-47.json';
  const data=JSON.parse(read(filename));
  ok(data.results.length===1,filename+' single experiment');
  const r=data.results[0];
  eq([r.profile,r.strategy??'broad',r.seed,r.horizon],[profile,strategy,47,180],filename+' identity');
  eq(data.checks,r.checks,filename+' check count');
  eq(data.checks,5043,filename+' reported checks');
  reportedAssertions+=data.checks;
  eq(r.pair.map(x=>x.variant),['base','m3'],filename+' variants');
  eq(r.pair[0].firstThree,r.pair[1].firstThree,filename+' initial decks');
  for(const v of r.pair){
   trajectories++;completedSessions+=r.horizon;
   eq(v.snapshots.map(s=>s.session),checkpoints,filename+' checkpoints');
   ok(v.firstThree.length===3&&v.firstThree.every(a=>a.length===10&&new Set(a).size===10),filename+' early IDs');
   let previous=null;
   for(const s of v.snapshots){
    for(const k of metrics)ok(Number.isSafeInteger(s[k])&&s[k]>=0,filename+' '+s.session+' '+k);
    for(const k of ['short','dupes','violations'])eq(s[k],0,filename+' '+s.session+' '+k);
    for(const k of ['concepts','multi','delayed','fragile','due','conceptGapsOver20'])ok(s[k]<=99,filename+' concept bound '+k);
    ok(s.families<=1556&&s.families<=s.session*10,filename+' family bound');
    ok(s.dueServed<=s.dueOpportunities&&s.weakDueServed<=s.weakDueOpportunities&&s.weakDueServed<=s.dueServed,filename+' denominators');
    ok(s.hinted<=(strategy==='calendar'?1:2)*Math.max(0,s.session-3),filename+' hint cap');
    if(v.variant==='base')eq(s.hinted,0,filename+' no base hints');
    if(previous)for(const k of ['families','concepts','dueServed','weakDueServed','dueOpportunities','weakDueOpportunities','hard','exactRecall','hinted'])ok(s[k]>=previous[k],filename+' monotone '+k);
    previous=s;
   }
   eq(v.snapshots.at(-1).concepts,99,filename+' complete concept coverage');
  }
  const trace=r.pair[0].snapshots.map(s=>metrics.map(k=>s[k]));
  if(baselines.has(profile))eq(trace,baselines.get(profile),profile+' identical baseline excluding timings');
  else baselines.set(profile,trace);
  const a=r.pair[0].snapshots.at(-1),b=r.pair[1].snapshots.at(-1);
  const rate=(s,k,d)=>s[d]===0?null:Math.round(s[k]/s[d]*10000)/100;
  const stats=s=>({...Object.fromEntries(metrics.map(k=>[k,s[k]])),dueServedPct:rate(s,'dueServed','dueOpportunities'),weakDueServedPct:rate(s,'weakDueServed','weakDueOpportunities'),selectMeanMs:s.selectMeanMs,selectMaxMs:s.selectMaxMs});
  rows.push({profile,strategy,seed:r.seed,base:stats(a),candidate:stats(b),delta:Object.fromEntries(metrics.map(k=>[k,b[k]-a[k]])),checkpoints:r.pair[0].snapshots.map((s,i)=>({session:s.session,delta:Object.fromEntries(['concepts','families','multi','delayed','fragile','due','conceptGapsOver20','exactRecall'].map(k=>[k,r.pair[1].snapshots[i][k]-s[k]]))}))});
 }
 const alerts=rows.flatMap(r=>['multi','delayed','fragile','exactRecall','families'].filter(k=>k==='fragile'?r.delta[k]>0:r.delta[k]<0).map(k=>({profile:r.profile,strategy:r.strategy,metric:k,delta:r.delta[k],kind:'directional_observation_not_statistical_test'})));
 return {schema:'QPJB_M3_SELECTOR_REVIEW_V1',sourceCommit:'4d112d1fe3449502c8406ce049dfe60739c507eb',checks,reportedAssertions,trajectories,completedSessions,simulatedResponses:completedSessions*10,distinctProfileSeeds:profiles.length,rows,alerts,decision:{assessment:'eligible_for_coordinator_integration_review',broad:'hold_default',calendar:'experimental_only',reason:'Single seed per profile; heterogeneous outcomes and some lower delayed proof or exact recall counts. Neither ranking policy is established as globally superior. Preserve baseline ranking by default pending multi-seed coordinator validation.'},limits:['Persisted experiment audit, not a new selector execution.','Both strategies repeat the same six baseline scenarios; 24 trajectories are not 24 independent samples.','hinted counts a winner receiving a bonus, not proven counterfactual changes.','Opportunity ratios use trajectory-specific denominators; not causal effects.','Reported violations are backed by the runner throwing on ineligible selections, not independently reconstructed from these summary files.','Native Node and browser execution not established by this audit.']};
}
module.exports={analyze};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path');
 const dir=path.join(__dirname,'..','audits','apprentissage-durable-20261126','m3');
 console.log(JSON.stringify(analyze(p=>fs.readFileSync(path.join(dir,p),'utf8')),null,2));
}
