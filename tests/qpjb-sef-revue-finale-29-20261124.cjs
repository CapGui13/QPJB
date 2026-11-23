#!/usr/bin/env node
'use strict';
// Expérience en mémoire uniquement : aucun QCM ni moteur de production modifié.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),Module=require('node:module');
const root=path.resolve(__dirname,'..');
const manifest=require('../audits/wave2/pedagogie/REVUE_FINALE_29_20261124_HOLD.json');
const {payload,validateApproved,sha256}=require('./qpjb-sef-approved-2sa-20261123.cjs');
const raw=payload(fs.readFileSync(path.join(root,'quizz.html'),'utf8'));
const data=validateApproved(raw).data;
const baseline=require('../quizz-parcours.js');
const code=fs.readFileSync(path.join(root,'quizz-parcours.js'),'utf8');
const clone=x=>JSON.parse(JSON.stringify(x));
assert.equal(manifest.status,'HOLD_NO_NEW_APPROVAL');
assert.equal(manifest.applyToLive,false);
assert.equal(manifest.editorial.length,17);
assert.equal(manifest.decisions.length,12);
assert.equal(new Set([...manifest.editorial,...manifest.decisions].map(e=>e.id)).size,29);
assert.equal(manifest.editorial.reduce((n,e)=>n+e.fields.length,0),37);
assert.equal(data.exercises.length,1523);
assert.equal(data.themes.length,22);
const byId=new Map(data.exercises.map(q=>[q.id,q]));
const candidate=clone(data),candidateById=new Map(candidate.exercises.map(q=>[q.id,q]));
const changes=new Map(),axisChanges=new Map();
const honor={A:4,R:3,D:2,V:1};
for(const e of manifest.editorial){
 const q=byId.get(e.id),t=candidateById.get(e.id);
 assert(q&&t,e.id+' présent');
 assert.equal(e.decision,'PENDING');
 assert.deepEqual(q.hand,e.hand,e.id+' main');
 assert.deepEqual(q.auction,e.auction,e.id+' enchères');
 assert.deepEqual(q.choices,e.choices,e.id+' choix');
 assert.equal(q.answer,e.answer,e.id+' réponse');
 assert.equal(q.difficulty,e.difficulty,e.id+' niveau');
 assert.equal(q.h,e.h);
 assert.equal(q.hand.flat().length,13);
 assert.equal(q.hand.flat().reduce((n,v)=>n+(honor[v]||0),0),q.h);
 for(const f of e.fields){
  assert(['context','explain','difficultyReason'].includes(f));
  assert.equal(q[f],e.before[f],e.id+' avant '+f);
  assert.equal(typeof e.after[f],'string');
  assert.notEqual(e.after[f],e.before[f]);
  t[f]=e.after[f];
 }
 changes.set(e.id,e);
 if(e.axis){
   assert.equal(baseline.axisKey(q),e.axis.axis);
   assert.equal(e.axis.reason,q.difficultyReason);
   assert.equal(e.axis.theme,q.theme);
   assert.equal(baseline.axisKey(t),null,'Perte effective si texte seul : '+e.id);
   axisChanges.set(e.id,e);
 }
}
for(const e of manifest.decisions){
 assert(byId.has(e.id),e.id+' existe');
 assert.equal(e.decision,'PENDING');
 assert(!changes.has(e.id));
}
assert.equal(axisChanges.size,8);
assert.equal(data.exercises.filter(q=>baseline.axisKey(q)).length,105);
assert.equal(candidate.exercises.filter(q=>baseline.axisKey(q)).length,97);
const sourceRows=baseline.AXIS_AUDIT;
assert.equal(new Set(sourceRows.flatMap(r=>r[3])).size,105);
const nextRows=sourceRows.flatMap(([axis,theme,reason,ids])=>{
 const remaining=ids.filter(id=>!axisChanges.has(id));
 return [
   ...(remaining.length?[[axis,theme,reason,remaining]]:[]),
   ...ids.filter(id=>axisChanges.has(id)).map(id=>[axis,theme,axisChanges.get(id).after.difficultyReason,[id]])
 ];
});
const re=/const AXIS_AUDIT\s*=\s*\[[\s\S]*?\n  \];/g;
assert.equal([...code.matchAll(re)].length,1,'Bloc moteur unique');
const altered=code.replace(re,'const AXIS_AUDIT='+JSON.stringify(nextRows)+';');
const m=new Module(path.join(root,'quizz-parcours.hypothetique.cjs'),module);
m.filename=path.join(root,'quizz-parcours.hypothetique.cjs');
m.paths=module.paths;
m._compile(altered,m.filename);
const migrated=m.exports;
assert.equal(candidate.exercises.filter(q=>migrated.axisKey(q)).length,105);
assert.equal(migrated.VERSION,baseline.VERSION);
assert.deepEqual(migrated.ROADMAP,baseline.ROADMAP);
assert.deepEqual(migrated.AXIS_LABELS,baseline.AXIS_LABELS);
for(const q of data.exercises){
 const t=candidateById.get(q.id),edit=changes.get(q.id);
 assert.equal(migrated.axisKey(t),baseline.axisKey(q),q.id+' axe');
 assert.equal(migrated.microKey(t),baseline.microKey(q),q.id+' micro');
 const restored={...t};
 if(edit)for(const f of edit.fields)restored[f]=edit.before[f];
 assert.deepEqual(restored,q,q.id+' champs non autorisés');
 if(axisChanges.has(q.id)){
  assert.equal(migrated.axisKey({...t,difficultyReason:q.difficultyReason}),null,q.id+' ancien motif rejeté');
  assert.equal(migrated.axisKey({...t,theme:'__test__'}),null);
  assert.equal(migrated.axisKey({...t,id:'__test__'}),null);
 }
}
assert.deepEqual(candidate.themes,data.themes);
assert.equal(sha256(payload(fs.readFileSync(path.join(root,'quizz.html'),'utf8'))),sha256(raw));
assert.equal(fs.readFileSync(path.join(root,'quizz-parcours.js'),'utf8'),code);
console.log('PASS structure : 29 dossiers, 37 champs hypothétiques, 105 -> 97 -> 105 axes, 1523 micro-compétences/axes comparés, aucun fichier modifié.');
const profiles=['autonome','echecs','modere','aides','progression'];
function rng(seed){let s=seed>>>0;return ()=>((s=(Math.imul(1664525,s)+1013904223)>>>0)/4294967296)}
// Les journaux utilisent l'horloge réelle : comparer toutes les données sauf
// la milliseconde d'exécution, en validant chaque horodatage séparément.
function normalizedClock(state){
 const copy=clone(state);
 for(const entry of copy.journal){
   assert.equal(typeof entry.recordedAt,'string');
   assert.equal(new Date(entry.recordedAt).toISOString(),entry.recordedAt);
   entry.recordedAt='CLOCK';
 }
 return copy;
}
function runPair(profile,horizon,seed){
 const a=baseline.empty(),b=migrated.empty(),rand=rng(seed);
 for(let s=0;s<horizon;s++){
  const p=baseline.start(a,data.exercises),q=migrated.start(b,candidate.exercises);
  assert.equal(p.length,10);assert.equal(q.length,10);
  assert.deepEqual(p.map(x=>x.id),q.map(x=>x.id),profile+' séance '+(s+1)+' seed '+seed+' tirage');
  assert.deepEqual(a.active.selection,b.active.selection,profile+' raisons de sélection');
  for(let i=0;i<p.length;i++){
   const chance=profile==='autonome'?0:profile==='echecs'?.94:profile==='modere'?.33:profile==='aides'?.15:Math.max(.07,.83-s*.006);
   const helped=profile==='aides'&&rand()<.72,result=rand()<chance?'wrong':'correct';
   assert.equal(baseline.record(a,p[i],result,i,null,helped,false),true);
   assert.equal(migrated.record(b,q[i],result,i,null,helped,false),true);
  }
  assert.equal(baseline.finish(a,data.exercises),true);
  assert.equal(migrated.finish(b,candidate.exercises),true);
  assert.deepEqual(normalizedClock(a),normalizedClock(b),profile+' séance '+(s+1)+' état hors horloge');
 }
 assert.deepEqual(baseline.dashboard(a,data.exercises),migrated.dashboard(b,candidate.exercises));
 assert.deepEqual(normalizedClock(baseline.load(JSON.stringify(a))),normalizedClock(migrated.load(JSON.stringify(b))));
 return horizon*10;
}
const mode=process.argv[2]||'--quick';
assert(['--quick','--full','--structure'].includes(mode));
let trajectories=0,answers=0;
if(mode!=='--structure'){
 for(const profile of profiles){
  for(const horizon of mode==='--full'?[65,153]:[12]){
   for(const seed of mode==='--full'?[11,29,47]:[29]){
    answers+=runPair(profile,horizon,seed);trajectories++;
   }
  }
  console.log('PASS profil '+profile);
 }
 console.log('PASS '+trajectories+' trajectoires appariées, '+answers+' réponses par version, mêmes tirages et états.');
}
