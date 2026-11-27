'use strict';
// Reproduce the stage-preserving variant with the existing paired benchmark.
function run({sources,exercises,metadata,moduleM3,benchmark,archive}){
 const variant={...moduleM3,applyExperimental:(meta,ex,group)=>{
  const out=moduleM3.applyExperimental(meta,ex,group);
  if(group==='texas')for(const id of moduleM3.TEXAS)out[id].stage=meta[id].stage;
  return out;
 }};
 const result=benchmark.run({sources,exercises,metadata,moduleM3:variant,horizon:65,groups:['texas'],profiles:['faible','aide','intermediaire'],seeds:[103]});
 return result.trajectories.map(t=>{
  const original=archive.trajectories.find(a=>a.profile===t.profile&&a.seed===t.seed&&a.group==='texas');
  if(!original)throw Error('Missing archived stage1 '+t.profile);
  const trace=t.trace.map(s=>s.selection.map(q=>q.id));
  const changed=trace.flatMap((s,i)=>JSON.stringify(s)===JSON.stringify(original.trace[i])?[]:[i+1]);
  return {profile:t.profile,seed:t.seed,firstStrong:t.firstStrong,checkpoints:t.checkpoints,changed,trace};
 });
}
module.exports={run};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),root=path.resolve(__dirname,'..'),base='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
 const get=p=>cp.execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const m={exports:{}};new Function('module',get('quizz-prerequis.js'))(m);
 const exercises=JSON.parse(get('quizz.html').split('<script id="training-data" type="application/json">')[1].split('</script>')[0]).exercises;
 const names=['quizz-parcours.js','quizz-session-plan.js','quizz-pedagogie-initiation.js','quizz-pedagogie-intermediaire.js','quizz-pedagogie-avancee.js','quizz-durable-integration.js','quizz-durable-m1-adaptation.js','quizz-durable-m2-remediation.js','quizz-durable-m2-data.js','quizz-durable-m3-maitrise.js','quizz-durable-m4-transfert.js','quizz-durable-m5-lecons.js','quizz-durable-m1-guard.js','quizz-professeur.js','quizz-apprentissage-concepts.js','quizz-diagnostic-erreurs.js','quizz-remediation.js'];
 const archive=JSON.parse(fs.readFileSync(path.join(root,'audits/coherence-concrete-20261126/m3/benchmark-s180-seed103.json'),'utf8'));
 console.log(JSON.stringify(run({sources:Object.fromEntries(names.map(n=>[n,get(n)])),exercises,metadata:m.exports,moduleM3:require('../quizz-coherence-m3-prerequis.js'),benchmark:require('./coherence-concrete-m3-benchmark.cjs'),archive})));
}
