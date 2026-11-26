'use strict';
// M3: all three seeds for broad policy, plus final baseline parity across policies.
const profiles=['grouped','daily','weekly','forgetting','assisted','resumption'];
const seeds=[11,47,103],metrics=['concepts','families','multi','delayed','fragile','due','dueServed','weakDueServed','exactRecall','conceptGapsOver20'];
function analyze(read){
 let checks=0;const rows=[],ok=(v,m)=>{checks++;if(!v)throw Error(m)};
 const stable=s=>Object.fromEntries(Object.entries(s).filter(([k])=>!['selectMeanMs','selectMaxMs'].includes(k)));
 const ratio=(s,n,d)=>s[d]===0?null:s[n]/s[d];
 const difference=(a,b)=>a===null||b===null?null:b-a;
 const calendar=JSON.parse(read('selector-calendar-three-seeds.json'));
 ok(calendar.rows.length===18,'calendar report coverage');
 for(const profile of profiles)for(const seed of seeds){
  const filename='selector-'+profile+'-'+seed+'.json';
  const data=JSON.parse(read(filename)),p=data.results[0];
  ok(data.checks===5043&&data.results.length===1&&p.profile===profile&&p.seed===seed&&p.horizon===180&&(p.strategy??'broad')==='broad',filename+' identity');
  ok(JSON.stringify(p.pair.map(v=>v.variant))==='["base","m3"]',filename+' variants');
  ok(JSON.stringify(p.pair[0].firstThree)===JSON.stringify(p.pair[1].firstThree),filename+' early parity');
  for(const v of p.pair){
   ok(JSON.stringify(v.snapshots.map(s=>s.session))===JSON.stringify([20,65,90,91,105,153,180]),filename+' checkpoints');
   let prev=null;
   for(const s of v.snapshots){
    ok(s.short===0&&s.dupes===0&&s.violations===0,filename+' invariants');
    ok(s.hinted<=(v.variant==='base'?0:2)*Math.max(0,s.session-3),filename+' cap');
    ok(s.dueServed<=s.dueOpportunities&&s.weakDueServed<=s.weakDueOpportunities&&s.weakDueServed<=s.dueServed,filename+' denominators');
    ok(Number.isInteger(s.concepts)&&s.concepts>=0&&s.concepts<=99&&s.families<=1556,filename+' bounds');
    ok(metrics.every(k=>Number.isSafeInteger(s[k])&&s[k]>=0),filename+' counters');
    if(prev)ok(['concepts','families','dueServed','weakDueServed','exactRecall','hinted'].every(k=>s[k]>=prev[k]),filename+' cumulative');
    prev=s;
   }
  }
  const [a,b]=p.pair.map(v=>v.snapshots.at(-1)),cal=calendar.rows.find(v=>v.profile===profile&&v.seed===seed);
  ok(!!cal&&JSON.stringify(stable(a))===JSON.stringify(stable(cal.base)),filename+' final baseline parity across policies');
  rows.push({profile,seed,base:stable(a),candidate:stable(b),delta:Object.fromEntries(metrics.map(k=>[k,b[k]-a[k]])),dueRateDelta:difference(ratio(a,'dueServed','dueOpportunities'),ratio(b,'dueServed','dueOpportunities')),weakDueRateDelta:difference(ratio(a,'weakDueServed','weakDueOpportunities'),ratio(b,'weakDueServed','weakDueOpportunities'))});
 }
 const outcomes=Object.fromEntries(metrics.map(k=>[k,{positive:rows.filter(r=>r.delta[k]>0).length,zero:rows.filter(r=>r.delta[k]===0).length,negative:rows.filter(r=>r.delta[k]<0).length}]));
 const coverageAlerts=rows.filter(r=>r.base.concepts<99||r.candidate.concepts<99).map(r=>({profile:r.profile,seed:r.seed,base:r.base.concepts,candidate:r.candidate.concepts}));
 return {schema:'QPJB_M3_BROAD_THREE_SEEDS_V1',checks,experiments:rows.length,trajectories:rows.length*2,sessions:rows.length*360,responses:rows.length*3600,reportedSelectorAssertions:rows.length*5043,outcomes,coverageAlerts,rows,calendarOutcomes:calendar.outcomes,decision:'HOLD_DEFAULT'};
}
function verify(read){const actual=analyze(read),expected=JSON.parse(read('selector-broad-three-seeds.json'));if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('archive analysis mismatch');return {checks:actual.checks+1,experiments:actual.experiments,coverageAlerts:actual.coverageAlerts,decision:actual.decision};}
module.exports={analyze,verify};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path');
 const read=name=>fs.readFileSync(path.join(__dirname,'../audits/apprentissage-durable-20261126/m3',name),'utf8');
 console.log(JSON.stringify(verify(read),null,2));
}
