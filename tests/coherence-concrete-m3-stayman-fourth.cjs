'use strict';
// A separate pedagogical experiment: introduce a simple Stayman response
// before the fourth response (2SA = both majors). No change of SEF answer.
const IDS=['SEF-V416-007','SEF-PN26-M1-033'];
function patches(metadata,exercises){
 return IDS.map(id=>{
  const q=exercises.find(q=>q.id===id),old=metadata[id];
  if(!q||q.answer!=='2SA'||q.shape[0]!==4||q.shape[1]!==4||old.concept!=='sa1.stayman.reponse'||old.stage!==1||old.requires.length!==1||old.requires[0].concept!=='sa1.stayman')throw Error('Frozen metadata drift '+id);
  return {id,old,new:{...old,requires:[...old.requires,{concept:'sa1.stayman.reponse',minExposure:1}]},preuve:q.explain,accord:'Réponse SEF inchangée ; variante expérimentale HOLD',status:'HOLD'};
 });
}
function run({sources,exercises,metadata,moduleM3,benchmark,horizon=20}){
 const ps=patches(metadata.byId,exercises),overlay=Object.fromEntries(ps.map(p=>[p.id,p.new]));
 const M={...moduleM3,applyExperimental:(meta,ex,group)=>group==='stayman4'?{...meta,...overlay}:moduleM3.applyExperimental(meta,ex,'none')};
 const result=benchmark.run({sources,exercises,metadata,moduleM3:M,horizon,groups:['none','stayman4']});
 function first(t){for(const s of t.trace)for(const v of s.selection){if(metadata.byId[v.id].concept==='sa1.stayman.reponse')return {session:s.session,id:v.id,fourth:IDS.includes(v.id)};}return null;}
 const pairs=result.trajectories.filter(t=>t.group==='none').map(a=>{const b=result.trajectories.find(t=>t.group==='stayman4'&&t.profile===a.profile&&t.seed===a.seed);
 const ids=s=>s.selection.map(q=>q.id);return {profile:a.profile,seed:a.seed,firstBefore:first(a),firstAfter:first(b),changed:a.trace.flatMap((s,i)=>JSON.stringify(ids(s))===JSON.stringify(ids(b.trace[i]))?[]:[{session:s.session,before:ids(s),after:ids(b.trace[i])}]),beforeConcepts:a.concepts,afterConcepts:b.concepts};});
 return {horizon,patches:ps,pairs,decision:'HOLD — longitudinal and integrated review required'};
}
module.exports={patches,run};
if(require.main===module){
 const cp=require('node:child_process'),path=require('node:path'),root=path.resolve(__dirname,'..'),base='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
 const get=p=>cp.execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const m={exports:{}};new Function('module',get('quizz-prerequis.js'))(m);
 const exercises=JSON.parse(get('quizz.html').split('<script id="training-data" type="application/json">')[1].split('</script>')[0]).exercises;
 const names=['quizz-parcours.js','quizz-session-plan.js','quizz-pedagogie-initiation.js','quizz-pedagogie-intermediaire.js','quizz-pedagogie-avancee.js'];
 console.log(JSON.stringify(run({sources:Object.fromEntries(names.map(n=>[n,get(n)])),exercises,metadata:m.exports,moduleM3:require('../quizz-coherence-m3-prerequis.js'),benchmark:require('./coherence-concrete-m3-benchmark.cjs')})));
}
