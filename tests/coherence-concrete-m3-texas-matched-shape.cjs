'use strict';
// A separate, non-activating experimental adapter: change the strength band,
// not the bid, distribution, difficulty or score. Positive H before zero-H
// edge cases. No outcome/seed-dependent decisions.
function advise(ctx){
 const {ranked,selected,hasPriorExposure,category,forcedReason,ELEMENTARY,STRONG}=ctx;
 const winner=ranked[0];
 if(!winner||forcedReason==='rappel_erreur_aide'||category==='weakness'||hasPriorExposure||!STRONG.includes(winner.q.id))return null;
 if(selected.some(x=>ELEMENTARY.includes((x.exercise||x.q||x).id)))return null;
 const shape=JSON.stringify(winner.q.shape);
 const alt=ranked.find(x=>ELEMENTARY.includes(x.q.id)&&x.q.h>0&&x.q.answer===winner.q.answer&&x.q.difficulty===winner.q.difficulty&&x.v===winner.v&&JSON.stringify(x.q.shape)===shape);
 return alt?{id:alt.q.id,replaces:winner.q.id,advisory:true,reason:'Même distribution, même transfert, même niveau et score ; seul le projet de contrat change.'}:null;
}
function instrument(source,A){
 const anchor="      // #396: preserve the historical winning pedagogical stratum, not just";
 if(source.split(anchor).length!==2)throw Error('Native ranking anchor drift');
 return source.replace(anchor,"      const adviceM3=("+advise.toString()+")({ranked,selected,hasPriorExposure:e.seen.has('sa1.texas'),category,forcedReason,ELEMENTARY:"+JSON.stringify(A.ELEMENTARY)+",STRONG:"+JSON.stringify(A.STRONG)+"});\n      if(adviceM3){const i=ranked.findIndex(x=>x.q.id===adviceM3.id);if(i<1)throw Error('Outside ranked');ranked.unshift(ranked.splice(i,1)[0]);}\n"+anchor);
}
function run({sources,exercises,metadata,moduleM3,benchmark,advice,horizon=20,profiles,seeds}){
 const variant={...sources,'quizz-parcours.js':instrument(sources['quizz-parcours.js'],advice)};
 const result=benchmark.run({sources:variant,exercises,metadata,moduleM3,horizon,groups:['none'],...(profiles?{profiles}:{}),...(seeds?{seeds}:{})});
 return result.trajectories.map(t=>({...t,group:'matched-shape',trace:t.trace.map(s=>s.selection.map(q=>q.id))}));
}
module.exports={advise,instrument,run};
if(require.main===module){
 const cp=require('node:child_process'),path=require('node:path'),root=path.resolve(__dirname,'..'),base='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
 const get=p=>cp.execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const m={exports:{}};new Function('module',get('quizz-prerequis.js'))(m);
 const exercises=JSON.parse(get('quizz.html').split('<script id="training-data" type="application/json">')[1].split('</script>')[0]).exercises;
 const names=['quizz-parcours.js','quizz-session-plan.js','quizz-pedagogie-initiation.js','quizz-pedagogie-intermediaire.js','quizz-pedagogie-avancee.js','quizz-durable-integration.js','quizz-durable-m1-adaptation.js','quizz-durable-m2-remediation.js','quizz-durable-m2-data.js','quizz-durable-m3-maitrise.js','quizz-durable-m4-transfert.js','quizz-durable-m5-lecons.js','quizz-durable-m1-guard.js','quizz-professeur.js','quizz-apprentissage-concepts.js','quizz-diagnostic-erreurs.js','quizz-remediation.js'];
 console.log(JSON.stringify(run({sources:Object.fromEntries(names.map(n=>[n,get(n)])),exercises,metadata:m.exports,moduleM3:require('../quizz-coherence-m3-prerequis.js'),benchmark:require('./coherence-concrete-m3-benchmark.cjs'),advice:require('../quizz-coherence-m3-transition-advice.js'),horizon:Number(process.argv[2]||20),seeds:process.argv[3]?.split(',').map(Number)})));
}
