'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),D=require('../quizz-coherence-m4p-d-lab.js');
function evaluate(rows,{partial=false}={}){
 const keys=new Set();assert(rows.length>0&&rows.length<=18);
 for(const r of rows){const key=r.profile+'/'+r.seed;assert(!keys.has(key)&&D.PROFILES.includes(r.profile)&&D.SEEDS.includes(r.seed));keys.add(key);assert.equal(r.horizon,180);assert.equal(r.base,'13966e475cf986c6f76e7faf870377fdf4ef99aa')}
 assert.equal(new Set(rows.map(r=>r.head)).size,1,'mixed tested SHAs');
 if(!partial)assert.equal(keys.size,18);
 const variants=Object.keys(rows[0].results),out={};
 for(const v of variants){
  const pairs=[],alerts=[],objectives=[],m6={sets:0,strict:0,review:0,historicReview:0,resumes:0,consolidations:0};let objectiveGains=0,objectiveLosses=0;
  for(const row of rows){
   const r=row.results[v];assert(r);const p=r.d,c=r.m6.comparison;
   assert.equal(p.before.length,5);assert.equal(p.after.length,5);
   pairs.push({profile:row.profile,seed:row.seed,before:p.before,after:p.after,changes:p.changes,reservations:p.reservations});
   m6.sets+=c.changes.filter(x=>!x.sameSet).length;m6.strict+=r.m6.strict.length;m6.review+=c.checkpoints.flatMap(x=>x.review).length;m6.historicReview+=r.m6.historic.checkpoints.flatMap(x=>x.review).length;m6.resumes+=r.m6.resumes;m6.consolidations+=r.m6.consolidations;
   const source={profile:row.profile,seed:row.seed};for(const a of r.m6.strict)alerts.push({...source,model:'M6',...a});for(const a of p.regressions.filter(x=>x.metric!=='latency-observation'))alerts.push({...source,model:'D',...a});
   for(const [model,[a,b]] of Object.entries(r.objective)){
    const gained=b.support+b.passFit>a.support+a.passFit&&b.excess2SA<=a.excess2SA&&a.concepts.every(c=>b.concepts.includes(c));
    const lost=b.support<a.support||b.passFit<a.passFit||b.excess2SA>a.excess2SA||a.concepts.some(c=>!b.concepts.includes(c));
    objectiveGains+=+gained;objectiveLosses+=+lost;objectives.push({...source,model,a,b,gained,lost});
   }
  }
  // Original D gate, no dropped thresholds. A partial matrix is diagnostic only.
  const gate=D.compareCheckpoints(pairs,{fullMatrix:!partial});
  out[v]={gate,m6,alerts,objectives,objectiveGains,objectiveLosses,visa:!partial&&gate.verdict==='CANDIDAT_A_REVOIR'&&!alerts.length&&!m6.review&&!objectiveLosses&&objectiveGains>0?'REVIEW':'HOLD'};
 }
 return {partial,cases:rows.length,head:rows[0].head,variants:out};
}
module.exports={evaluate};
if(require.main===module){const args=process.argv.slice(2),partial=args.includes('--partial'),rows=args.filter(p=>p!=='--partial').map(p=>JSON.parse(fs.readFileSync(p,'utf8')));console.log(JSON.stringify(evaluate(rows,{partial}),null,2))}
