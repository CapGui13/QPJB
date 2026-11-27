'use strict';
// Post-processing of actual paired CI receipts. No policy activation.
const D=require('../quizz-coherence-m4p-d-lab.js');
function summarize(rows,expert,full=true){
 const expected=D.PROFILES.flatMap(p=>D.SEEDS.map(s=>p+'/'+s));
 const keys=rows.map(r=>r.profile+'/'+r.seed);
 if(new Set(keys).size!==keys.length||keys.some(k=>!expected.includes(k)))throw Error('invalid pair keys');
 if(full&&keys.length!==expected.length)throw Error('incomplete matrix');
 const gate=D.compareCheckpoints(rows.map(r=>({profile:r.profile,seed:r.seed,before:r.models.D.before,after:r.models.D.after,changes:r.models.D.changes,reservations:0})),{fullMatrix:full});
 const models={};
 for(const k of ['M6','D']){
  const debt=(m,arm)=>k==='M6'?m['core'+(arm==='before'?'Before':'After')].at(-1).total:m[arm].at(-1).coreDebt;
  const byProfile={}; const byAlert={};const swaps=[];let direct=0,changed=0,worse=0,better=0,same=0;
  for(const row of rows){
   const m=row.models[k],a=debt(m,'before'),b=debt(m,'after');
   const p=byProfile[row.profile]??={pairs:0,before:0,after:0,direct:0,alerts:0};
   p.pairs++;p.before+=a;p.after+=b;p.direct+=m.direct.length;
   direct+=m.direct.length; changed+=k==='M6'?m.changes.length:m.changes;
   if(b>a)worse++;else if(b<a)better++;else same++;
   const alerts=k==='M6'?m.strict:m.regressions.filter(x=>x.metric!=='latency-observation');
   p.alerts+=alerts.length;
   for(const v of alerts)byAlert[v.metric]=(byAlert[v.metric]||0)+1;
   for(const e of m.direct){const x=e.reprise6C,decision=expert.byId[x.oldId]?.decision||'non_classé';
    swaps.push({profile:row.profile,seed:row.seed,session:e.session,oldId:x.oldId,id:x.id,decision,gap:x.gap,concept:x.concept,donorConcept:x.donorConcept,contrast:/contrast|sequence|miroir_utile/i.test(decision)});
   }
  }
  models[k]={direct,changed,changedMeaning:k==='M6'?'changed deck sets':'direct event journal',debt:[Object.values(byProfile).reduce((a,p)=>a+p.before,0),Object.values(byProfile).reduce((a,p)=>a+p.after,0)],pairs:{better,worse,same},alerts:Object.values(byAlert).reduce((a,n)=>a+n,0),byAlert,byProfile,expertContrastDonors:swaps.filter(s=>s.contrast).length,swaps};
 }
 return {pairs:rows.length,presentations:rows.length*7200,full,models,gate};
}
module.exports={summarize};
if(require.main===module){
 const fs=require('node:fs');const a=JSON.parse(fs.readFileSync(process.argv[2],'utf8')),expert=JSON.parse(fs.readFileSync('audits/coherence-concrete-20261126/m4/parallel/c/statuts.json','utf8'));console.log(JSON.stringify(summarize(a.rows,expert,!process.argv.includes('--partial')),null,2));
}
