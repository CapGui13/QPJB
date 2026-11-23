'use strict';
// Registre post-lot26 : contrôle l'identité des 22 HOLD restants.
// Aucune écriture, publication ni visa implicite.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const manifest=read('audits/wave2/pedagogie/PACK_VISA_22_RESTANTS_20261123_HOLD.json');
const pack36=read('audits/wave2/pedagogie/PACK_VISA_36_PROPOSITIONS_20261123_HOLD.json');
const decisions=read('audits/wave2/pedagogie/DECISIONS_P20_HOLD.json');
const historic=read('Docs/PARCOURS_V2_DECISIONS_PEDAGOGIQUES_UTILISATRICE_20261120.json');
const {payload,validateApproved}=require('./qpjb-sef-approved-2sa-20261123.cjs');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const data=validateApproved(payload(html)).data;
assert.equal(data.exercises.length,1523);
assert.equal(data.themes.length,22);
assert.equal(manifest.status,'HOLD_22_AFTER_MERGE_26_20261124');
assert.equal(manifest.noQuizMutation,true);
assert.deepEqual(manifest.groupCounts,{A:1,B:11,C:10,total:22});
assert.equal(manifest.items.length,22);
const ids=new Set(manifest.items.map(x=>x.id));
assert.equal(ids.size,22,'Pas de doublons');
const expectedB=new Set(decisions.agreements.map(x=>x.id));
const expectedC=new Map(pack36.editorialCandidates.filter(x=>x.group!=='EDITION_FAIBLE_RISQUE').map(x=>[x.id,x]));
assert.equal(expectedB.size,11);
assert.equal(expectedC.size,10);
assert.equal(manifest.items.filter(x=>x.lot==='A').length,1);
assert.equal(manifest.items.filter(x=>x.lot==='B').length,11);
assert.equal(manifest.items.filter(x=>x.lot==='C').length,10);
const byId=new Map(data.exercises.map(x=>[x.id,x]));
for(const r of manifest.items){
 assert.equal(r.statut,'HOLD','Ne pas introduire de nouvelle approbation');
 const live=byId.get(r.id);
 assert(live,'QCM réel absent : '+r.id);
 if(r.lot==='A'){
  assert.equal(r.id,'SEF-V44-005');
  assert.equal(live.answer,'2SA');
  assert.deepEqual(live.hand,r.hand);
 }else if(r.lot==='B'){
  assert(expectedB.has(r.id),'Accord non répertorié '+r.id);
  const baseline=decisions.agreements.find(x=>x.id===r.id);
  assert.equal(r.question,baseline.reviewQuestion,'Question de convention changée '+r.id);
  assert.equal(r.caveat,baseline.caveat,'Réserve changée '+r.id);
  assert.equal(baseline.decision,'PENDING',"L'archive P20 reste une proposition");
 }else if(r.lot==='C'){
  const p=expectedC.get(r.id);
  assert(p,'Dossier C hors des dix autres '+r.id);
  assert.equal(r.answerUnchanged,live.answer);
  assert.deepEqual(r.old,p.before);
  assert.deepEqual(r.proposed,p.after);
  for(const field of ['context','explain','difficultyReason'])
   assert.equal(live[field],r.old[field],'HOLD du champ '+r.id+' '+field);
 }
}
assert.equal(historic.caseDecisions.find(x=>x.id==='SEF-L25-004').approval,'APPROVED_BY_USER');
assert.equal(historic.caseDecisions.find(x=>x.id==='SEF-L25-004').approvedAnswer,'Passe');
assert.equal(byId.get('SEF-L25-004').answer,'Passe');
assert.equal(byId.get('SEF-V479-004').answer,'2SA');
assert.equal(byId.get('SEF-V479-004').pedagogicalReview20261105V497.answerUnchanged,true);
assert.equal(manifest.priorHumanAnswersNotReopened.length,2);
assert.deepEqual(new Set([...expectedB,...expectedC.keys(),'SEF-V44-005']),ids);
console.log('PASS VISA_22_HOLD : 1 A + 11 B + 10 C, 22 ID réels, 0 décision inventée, historique L25/V479 préservé, 1523 QCM intacts.');
