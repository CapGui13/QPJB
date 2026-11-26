'use strict';
// Recompute a full three-seed calendar comparison from archived V8 runs.
const profiles=['grouped','daily','weekly','forgetting','assisted','resumption'];
const seeds=[11,47,103],metrics=['concepts','families','multi','delayed','fragile','due','dueServed','weakDueServed','exactRecall','conceptGapsOver20'];
function analyze(read){
 let checks=0,rows=[];const ok=(b,m)=>{checks++;if(!b)throw Error(m)};
 for(const profile of profiles)for(const seed of seeds){
  const file='selector-calendar-'+profile+'-'+seed+'.json';
  const data=JSON.parse(read(file)),p=data.results[0];
  ok(data.checks===5043&&data.results.length===1&&p.profile===profile&&p.seed===seed&&p.horizon===180&&p.strategy==='calendar',file+' identity');
  ok(JSON.stringify(p.pair.map(v=>v.variant))==='["base","m3"]',file+' variants');
  ok(JSON.stringify(p.pair[0].firstThree)===JSON.stringify(p.pair[1].firstThree),file+' initial parity');
  for(const v of p.pair){
   ok(JSON.stringify(v.snapshots.map(s=>s.session))===JSON.stringify([20,65,90,91,105,153,180]),file+' checkpoints');
   for(const s of v.snapshots){
    ok(s.short===0&&s.dupes===0&&s.violations===0,file+' invariants');
    ok(s.hinted<=(v.variant==='base'?0:Math.max(0,s.session-3)),file+' cap');
    ok(s.dueServed<=s.dueOpportunities&&s.weakDueServed<=s.weakDueOpportunities,file+' denominator');
    ok(Number.isInteger(s.concepts)&&s.concepts>=0&&s.concepts<=99,file+' coverage bound');
   }
  }
  const [a,b]=p.pair.map(v=>v.snapshots.at(-1));
  const rate=(s,k,d)=>s[d]===0?null:s[k]/s[d];
  const dr=rate(a,'dueServed','dueOpportunities'),cr=rate(b,'dueServed','dueOpportunities');
  const wr=rate(a,'weakDueServed','weakDueOpportunities'),cw=rate(b,'weakDueServed','weakDueOpportunities');
  rows.push({profile,seed,base:a,candidate:b,delta:Object.fromEntries(metrics.map(k=>[k,b[k]-a[k]])),dueRateDelta:dr===null||cr===null?null:cr-dr,weakDueRateDelta:wr===null||cw===null?null:cw-wr});
 }
 const outcomes=Object.fromEntries(metrics.map(k=>[k,{positive:rows.filter(r=>r.delta[k]>0).length,zero:rows.filter(r=>r.delta[k]===0).length,negative:rows.filter(r=>r.delta[k]<0).length}]));
 const coverageAlerts=rows.filter(r=>r.base.concepts<99||r.candidate.concepts<99).map(r=>({profile:r.profile,seed:r.seed,base:r.base.concepts,candidate:r.candidate.concepts}));
 return {schema:'QPJB_M3_CALENDAR_THREE_SEEDS_V1',checks,experiments:rows.length,trajectories:rows.length*2,sessions:rows.length*2*180,responses:rows.length*2*180*10,reportedSelectorAssertions:rows.length*5043,rows,outcomes,coverageAlerts,decision:'HOLD_DEFAULT'};
}
function verify(read){
 const actual=analyze(read),expected=JSON.parse(read('selector-calendar-three-seeds.json'));
 if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('archive analysis mismatch');
 return {checks:actual.checks+1,experiments:actual.experiments,coverageAlerts:actual.coverageAlerts,decision:actual.decision};
}
module.exports={analyze,verify};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path');
 const read=name=>fs.readFileSync(path.join(__dirname,'../audits/apprentissage-durable-20261126/m3',name),'utf8');
 console.log(JSON.stringify(verify(read),null,2));
}
