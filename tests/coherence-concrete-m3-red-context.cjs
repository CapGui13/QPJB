'use strict';
// M3: exploratory context-specific prerequisite; NEVER an activation.
function propose(metadata,exercises){
 const out=[];
 for(const q of exercises){
  const m=metadata[q.id];
  if(q.theme!=='red'||m?.concept!=='red.base'||!m.requires.some(x=>x.concept==='majeur.base')||!m.requires.some(x=>x.concept==='mineur.base'))continue;
  const opener=String(q.auction?.[0]||'').match(/^Vous : 1([♣♦♥♠])$/);
  const partner=(q.auction||[]).find(x=>String(x).startsWith('Partenaire : '));
  const minor=opener&&/[♣♦]/.test(opener[1]),major=opener&&/[♥♠]/.test(opener[1]);
  const remove=minor?'majeur.base':major?'mineur.base':null;
  const simple=!!remove&&!!partner&&q.difficulty<=3&&m.stage<=1;
  out.push({id:q.id,auction:q.auction,answer:q.answer,difficulty:q.difficulty,explain:q.explain,old:m,new:simple?{...m,requires:m.requires.filter(x=>x.concept!==remove)}:m,remove:simple?remove:null,status:'HOLD',reason:simple?'La première réponse appartient au contexte de l’ouverture réellement jouée ; l’autre famille de réponses est une généralisation, pas une condition nécessaire démontrée. Tester sans toucher aux niveaux 4/5.':'Niveau avancé ou contexte non reconnu : aucune proposition.'});
 }
 return out;
}
function run({sources,exercises,metadata,moduleM3,benchmark,horizon=10}){
 const registry=propose(metadata.byId,exercises);
 const candidate=Object.fromEntries(registry.filter(x=>x.remove).map(x=>[x.id,x.new]));
 const M={...moduleM3,applyExperimental:(meta,ex,group)=>group==='context'?{...meta,...candidate}:moduleM3.applyExperimental(meta,ex,'none')};
 const result=benchmark.run({sources,exercises,metadata,moduleM3:M,horizon,groups:['none','context']});
 const pairs=result.trajectories.filter(t=>t.group==='none').map(a=>{
  const b=result.trajectories.find(t=>t.group==='context'&&t.profile===a.profile&&t.seed===a.seed);
  const ids=s=>s.selection.map(q=>q.id);
  const changed=a.trace.flatMap((s,i)=>JSON.stringify(ids(s))===JSON.stringify(ids(b.trace[i]))?[]:[{session:s.session,before:ids(s),after:ids(b.trace[i])}]);
  return {profile:a.profile,seed:a.seed,changed,conceptsBefore:a.concepts,conceptsAfter:b.concepts};
 });
 return {horizon,registry,proposed:Object.keys(candidate).length,pairs,decision:pairs.some(p=>p.changed.length)?'HOLD — changed sessions require full review':'HOLD — no measured composition or order gain'};
}
module.exports={propose,run};
if(require.main===module){
 const cp=require('node:child_process'),path=require('node:path'),root=path.resolve(__dirname,'..'),base='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
 const get=p=>cp.execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const m={exports:{}};new Function('module',get('quizz-prerequis.js'))(m);
 const exercises=JSON.parse(get('quizz.html').split('<script id="training-data" type="application/json">')[1].split('</script>')[0]).exercises;
 const names=['quizz-parcours.js','quizz-session-plan.js','quizz-pedagogie-initiation.js','quizz-pedagogie-intermediaire.js','quizz-pedagogie-avancee.js'];
 console.log(JSON.stringify(run({sources:Object.fromEntries(names.map(n=>[n,get(n)])),exercises,metadata:m.exports,moduleM3:require('../quizz-coherence-m3-prerequis.js'),benchmark:require('./coherence-concrete-m3-benchmark.cjs')})));
}
