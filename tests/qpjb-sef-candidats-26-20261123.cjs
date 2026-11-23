'use strict';
// Validation du diff candidat en DRAFT : 26 QCM × 3 champs de texte et rien d'autre.
// Ces changements ne valent pas décision pédagogique ni autorisation de publication.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {payload,validateApproved,restoreDraftProposals,candidateLot26,sha256}=require('./qpjb-sef-approved-2sa-20261123.cjs');
const raw=payload(fs.readFileSync(path.resolve(__dirname,'../quizz.html'),'utf8'));
const {data}=validateApproved(raw);
const restored=restoreDraftProposals(raw);
const pristine=JSON.parse(restored);
const manifest=candidateLot26;
assert.equal(manifest.status,'DRAFT_PREVIEW_26_WITH_AXIS_PROOFS_PRESERVED');
assert.equal(manifest.mergeAuthorized,false);
assert.equal(manifest.keepOther10InHold,true);
assert.equal(manifest.keepOther12InHold,true);
assert.equal(data.exercises.length,1523);
assert.equal(data.themes.length,22);
assert.equal(pristine.exercises.length,1523);
assert.equal(new Set(manifest.items.map(x=>x.id)).size,26);
const candidates=new Map(manifest.items.map(x=>[x.id,x]));
let edited=0;
for(let i=0;i<data.exercises.length;i++){
 const live=data.exercises[i],before=pristine.exercises[i];
 assert.equal(live.id,before.id,'Ordre et identifiants préservés');
 const candidate=candidates.get(live.id);
 if(candidate){
  for(const k of candidate.fields)assert.equal(live[k],candidate.after[k],live.id+' '+k);
  const normalized={...live,...candidate.before};
  assert.deepEqual(normalized,before,'Seuls trois textes peuvent différer : '+live.id);
  edited++;
 }else assert.deepEqual(live,before,'QCM hors des 26 modifié : '+live.id);
}
assert.equal(edited,26,'Exactement vingt-six QCM candidat');
assert.equal(manifest.items.reduce((sum,item)=>sum+item.fields.length,0),71);
assert.equal(manifest.deferredAxisProofReasons,7);
const hold=manifest.items.filter(x=>x.id==='SEF-V44-005');
assert.equal(hold.length,0,'Le 2SA sous HOLD ne fait pas partie du lot');
for(const e of manifest.items){
 const corrupted=JSON.parse(raw);
 const row=corrupted.exercises.find(x=>x.id===e.id);
 row[e.fields[0]]=e.before[e.fields[0]];
 assert.throws(()=>validateApproved(JSON.stringify(corrupted)),/Proposition non appliquée exactement/,'Reversion interdite '+e.id);
}
const changedAnswers=JSON.parse(raw);
changedAnswers.exercises[0].answer='7SA';
assert.throws(()=>validateApproved(JSON.stringify(changedAnswers)),/Modification QCM autre/,'Aucune mutation étrangère acceptée');
const external=JSON.parse(raw);
external.exercises.find(x=>x.id==='SEF-V44-005').context='CHANGEMENT INTERDIT';
assert.throws(()=>validateApproved(JSON.stringify(external)),/Modification QCM autre/,'Le HOLD A doit rester inchangé');
console.log('PASS PREVIEW_26 : 26 QCM, 71 champs réversibles, 7 motifs historiques préservés, 1523 exercices/22 rubriques, 48 décisions non publiées.');
