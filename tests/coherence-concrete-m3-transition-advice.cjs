'use strict';
function instrument(source,advice,maxGap){
 const anchor="      // #396: preserve the historical winning pedagogical stratum, not just";
 if(source.split(anchor).length!==2)throw Error('Native ranking anchor drift');
 return source.replace(anchor,"      const adviceM3=("+advice.advise.toString()+")({ranked,selected,hasPriorExposure:e.seen.has('sa1.texas'),category,forcedReason,maxGap:"+maxGap+"});\n      if(adviceM3){const i=ranked.findIndex(x=>x.q.id===adviceM3.id);if(i<1)throw Error('M3 advisory selected outside ranked');const first=ranked.splice(i,1)[0];ranked.unshift(first);}\n"+anchor)
 .replace("function advise(ctx={}){","function advise(ctx={}){const ELEMENTARY="+JSON.stringify(advice.ELEMENTARY)+",STRONG="+JSON.stringify(advice.STRONG)+";");
}
function run({sources,exercises,metadata,moduleM3,benchmark,advice,horizon=20,profiles,seeds}){
 const result=[];
 for(const maxGap of [null,0,48]){
 const variant={...sources,'quizz-parcours.js':maxGap===null?sources['quizz-parcours.js']:instrument(sources['quizz-parcours.js'],advice,maxGap)};
 const t=benchmark.run({sources:variant,exercises,metadata,moduleM3,horizon,groups:['none'],...(profiles?{profiles}:{}),...(seeds?{seeds}:{})});
 result.push({maxGap,trajectories:t.trajectories});
 }
 const first=t=>{for(const s of t.trace)for(const x of s.selection){if(metadata.byId[x.id].concept==='sa1.texas')return {session:s.session,id:x.id,strong:advice.STRONG.includes(x.id)};}return null;};
 const pairs=result.slice(1).map(arm=>({maxGap:arm.maxGap,pairs:arm.trajectories.map(b=>{const a=result[0].trajectories.find(a=>a.profile===b.profile&&a.seed===b.seed);const before=a.trace.map(s=>s.selection.map(x=>x.id)),after=b.trace.map(s=>s.selection.map(x=>x.id));return {profile:b.profile,seed:b.seed,firstBefore:first(a),firstAfter:first(b),firstStrongBefore:a.firstStrong,firstStrongAfter:b.firstStrong,changed:before.flatMap((s,i)=>JSON.stringify(s)===JSON.stringify(after[i])?[]:[i+1]),baseS5:before[4],candidateS5:after[4],conceptsBefore:a.concepts,conceptsAfter:b.concepts,trace:after};})}));
 return {horizon,pairs,baseline:result[0].trajectories.map(t=>({profile:t.profile,seed:t.seed,trace:t.trace.map(s=>s.selection.map(x=>x.id))})),decision:'Experimental adapter only; coordinator owns ranking and order'};
}
module.exports={run,instrument};
if(require.main===module){
 const cp=require('node:child_process'),path=require('node:path'),root=path.resolve(__dirname,'..'),base='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
 const get=p=>cp.execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const m={exports:{}};new Function('module',get('quizz-prerequis.js'))(m);
 const exercises=JSON.parse(get('quizz.html').split('<script id="training-data" type="application/json">')[1].split('</script>')[0]).exercises;
 const names=['quizz-parcours.js','quizz-session-plan.js','quizz-pedagogie-initiation.js','quizz-pedagogie-intermediaire.js','quizz-pedagogie-avancee.js','quizz-durable-integration.js','quizz-durable-m1-adaptation.js','quizz-durable-m2-remediation.js','quizz-durable-m2-data.js','quizz-durable-m3-maitrise.js','quizz-durable-m4-transfert.js','quizz-durable-m5-lecons.js','quizz-durable-m1-guard.js','quizz-professeur.js','quizz-apprentissage-concepts.js','quizz-diagnostic-erreurs.js','quizz-remediation.js'];
 console.log(JSON.stringify(run({sources:Object.fromEntries(names.map(n=>[n,get(n)])),exercises,metadata:m.exports,moduleM3:require('../quizz-coherence-m3-prerequis.js'),benchmark:require('./coherence-concrete-m3-benchmark.cjs'),advice:require('../quizz-coherence-m3-transition-advice.js'),horizon:Number(process.argv[2]||20),seeds:process.argv[3]?.split(',').map(Number)})));
}
