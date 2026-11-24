#!/usr/bin/env node
'use strict';
// Recette du visa global : vraie version intégrée comparée au moteur historique restauré.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),Module=require('node:module');
const root=path.resolve(__dirname,'..');
const {manifest,restoreGlobal,restoreEngine,gitBlob}=require('./qpjb-sef-global29-normalization.cjs');
const {payload,validateApproved}=require('./qpjb-sef-approved-2sa-20261123.cjs');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8'),raw=payload(html);
const data=validateApproved(raw).data,candidate=JSON.parse(raw);
const code=fs.readFileSync(path.join(root,'quizz-parcours.js'),'utf8');
const previousCode=restoreEngine(code);
const oldHtml=html.replace(raw,restoreGlobal(raw));
assert.equal(gitBlob(oldHtml),manifest.sourceQuizBlob,'HTML antérieur restauré bit à bit');
const m=new Module(path.join(root,'quizz-parcours.historique.cjs'),module);
m.filename=path.join(root,'quizz-parcours.historique.cjs');m.paths=module.paths;m._compile(previousCode,m.filename);
const baseline=m.exports,migrated=require('../quizz-parcours.js');
const clone=x=>JSON.parse(JSON.stringify(x));
assert.equal(manifest.status,'APPROVED_INTEGRATION_PENDING_CI');
assert.equal(manifest.approval.phrase,'Go global');
assert.equal(manifest.items.length,21);assert.equal(manifest.retained.length,8);
assert.equal(new Set([...manifest.items,...manifest.retained].map(e=>e.id)).size,29);
assert.equal(data.exercises.length,1523);assert.equal(candidate.exercises.length,1523);
assert.deepEqual(data.themes,candidate.themes);assert.equal(data.themes.length,22);
const changes=new Map(manifest.items.map(e=>[e.id,e]));
const axisChanges=new Map(manifest.items.filter(e=>e.axis).map(e=>[e.id,e]));
const idx=new Map(candidate.exercises.map(q=>[q.id,q]));
assert.equal(axisChanges.size,8);
assert.equal(data.exercises.filter(q=>baseline.axisKey(q)).length,105);
assert.equal(candidate.exercises.filter(q=>baseline.axisKey(q)).length,97);
assert.equal(candidate.exercises.filter(q=>migrated.axisKey(q)).length,105);
let changed=0;
for(let i=0;i<data.exercises.length;i++){
 const q=data.exercises[i],t=candidate.exercises[i],e=changes.get(q.id);
 assert.equal(q.id,t.id);
 assert.equal(migrated.axisKey(t),baseline.axisKey(q),q.id+' axe');
 assert.equal(migrated.microKey(t),baseline.microKey(q),q.id+' micro');
 const restored={...t};
 if(e)for(const k of e.fields){assert.equal(t[k],e.after[k]);assert.equal(q[k],e.before[k]);assert.notEqual(t[k],q[k]);restored[k]=q[k];changed++;}
 assert.deepEqual(restored,q,q.id+' champs non autorisés');
 if(axisChanges.has(q.id)){
  assert.equal(migrated.axisKey({...t,difficultyReason:q.difficultyReason}),null);
  assert.equal(migrated.axisKey({...t,theme:'__test__'}),null);
  assert.equal(migrated.axisKey({...t,id:'__test__'}),null);
 }
}
assert.equal(changed,46);
for(const e of manifest.retained){const q=idx.get(e.id);assert(q);for(const [k,v] of Object.entries(e.current))assert.deepEqual(q[k],v,e.id+' '+k);}
const bad=clone(candidate);bad.exercises.find(q=>q.id===manifest.items[0].id)[manifest.items[0].fields[0]]='INTERDIT';
assert.throws(()=>restoreGlobal(JSON.stringify(bad)));
const badAnswer=clone(candidate);badAnswer.exercises[0].answer='7SA';assert.throws(()=>validateApproved(JSON.stringify(badAnswer)));
assert.throws(()=>restoreEngine(code.replace('proof.axis:null','null:null')));
console.log('PASS intégration : 29 dossiers visés, 21 QCM édités, 8 maintenus, 46 champs, 105 preuves, 1523 QCM intacts hors visa.');
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
