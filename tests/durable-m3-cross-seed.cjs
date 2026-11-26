'use strict';
// Recheck the archived M3 calendar comparison, independently of native selector runtime.
const profiles={grouped:11,daily:103,weekly:11,forgetting:103,assisted:11,resumption:103};
const metrics=['families','multi','delayed','fragile','due','dueServed','weakDueServed','exactRecall','conceptGapsOver20'];
function run(read){
 let checks=0,rows=[];const ok=(b,m)=>{checks++;if(!b)throw Error(m)};
 for(const [profile,seed2] of Object.entries(profiles))for(const seed of [47,seed2]){
  const file='selector-calendar-'+profile+'-'+seed+'.json';
  const data=JSON.parse(read(file)),p=data.results[0];
  ok(data.checks===5043&&data.results.length===1&&p.profile===profile&&p.seed===seed&&p.horizon===180&&p.strategy==='calendar',file+' identity');
  ok(JSON.stringify(p.pair[0].firstThree)===JSON.stringify(p.pair[1].firstThree),file+' initial parity');
  for(const v of p.pair){
   ok(JSON.stringify(v.snapshots.map(s=>s.session))===JSON.stringify([20,65,90,91,105,153,180]),file+' checkpoints');
   for(const s of v.snapshots){
    ok(s.short===0&&s.dupes===0&&s.violations===0,file+' invariants');
    ok(s.hinted<=Math.max(0,s.session-3),file+' cap');
    ok(s.dueServed<=s.dueOpportunities&&s.weakDueServed<=s.weakDueOpportunities,file+' denominator');
   }
  }
  const [a,b]=p.pair.map(v=>v.snapshots.at(-1));ok(a.concepts===99&&b.concepts===99,file+' coverage');
  rows.push({profile,seed,base:a,candidate:b,delta:Object.fromEntries(metrics.map(k=>[k,b[k]-a[k]]))});
 }
 const report=JSON.parse(read('selector-calendar-cross-seed.json'));
 ok(JSON.stringify(rows)===JSON.stringify(report.rows),'archived rows match');
 ok(report.checks===checks-1,'archived control count');
 ok(report.newAssertions===6*5043&&report.newSessions===6*2*180&&report.newResponses===6*2*180*10,'counts');
 return {checks,experiments:rows.length,decision:report.decision};
}
module.exports={run};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path');
 console.log(JSON.stringify(run(name=>fs.readFileSync(path.join(__dirname,'../audits/apprentissage-durable-20261126/m3',name),'utf8')),null,2));
}
