'use strict';
// Consume the exact 18 job summaries, not averaged results. The historical
// D module owns the full gate; the narrow T diagnostic is not a full visa.
const fs=require('node:fs'),assert=require('node:assert/strict'),D=require('../quizz-coherence-m4p-d-lab.js');
function evaluate(rows){
 assert.equal(rows.length,18);
 assert.equal(new Set(rows.map(r=>r.m6.profile+'/'+r.m6.seed)).size,18);
 const out={};
 for(const name of ['T']){
  const pairs=[],alerts=[],transitions=[],m6={sets:0,orders:0,strict:0,review:0,direct:0,near5:[0,0],near20:[0,0],texas:[0,0],stayman:[0,0]};
  for(const {m6:m,d} of rows){
   assert.equal(m.profile,d.profile);assert.equal(m.seed,d.seed);
   const p=d.results[name],a=m.arms.Full,b=m.arms[name],c=m.comparisons['Full-'+name];
   assert.equal(p.before.length,5);assert.equal(p.after.length,5);
   pairs.push({profile:d.profile,seed:d.seed,before:p.before,after:p.after,changes:p.changes,reservations:0});
   for(const r of p.regressions)alerts.push({profile:d.profile,seed:d.seed,...r});
   for(const k of ['texas','stayman']){
    const x=!!a.atomicMetrics.transitions[k].inversion,y=!!b.atomicMetrics.transitions[k].inversion;
    m6[k][0]+=+x;m6[k][1]+=+y;
    if(!x&&y)transitions.push({model:'M6',profile:m.profile,seed:m.seed,transition:k});
    if(!p.transitionsBefore[k]&&p.transitionsAfter[k])transitions.push({model:'D',profile:d.profile,seed:d.seed,transition:k});
   }
   for(const k of ['near5','near20']){m6[k][0]+=a.atomicMetrics[k];m6[k][1]+=b.atomicMetrics[k]}
   m6.sets+=c.changedSets;m6.orders+=c.changedOrders;m6.strict+=c.strict;m6.review+=c.review.length;m6.direct+=b.direct.length;
  }
  const full=D.compareCheckpoints(pairs),narrow=D.compareCheckpoints(pairs,{requireEarly:true,requireDebt:false});
  out[name]={m6,full,narrow,alerts,transitions,
   reviewOnly:narrow.verdict==='CANDIDAT_A_REVOIR'&&!alerts.length&&!transitions.length&&!m6.strict&&!m6.review,
   fullVisa:full.verdict==='CANDIDAT_A_REVOIR'&&!alerts.length&&!transitions.length&&!m6.strict&&!m6.review};
 }
 return out;
}
module.exports={evaluate};
if(require.main===module){
 const input=process.argv.slice(2).flatMap(p=>JSON.parse(fs.readFileSync(p,'utf8')).rows);
 console.log(JSON.stringify(evaluate(input),null,2));
}
