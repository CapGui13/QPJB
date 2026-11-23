'use strict';
// Protection cumulée : les deux champs 2SA approuvés puis trois champs du lot A.
// Nom des fonctions conservé pour compatibilité avec les nombreuses suites historiques.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const approval=require('../audits/pedagogie/validations-2sa-fitte-20261123.json');
const supplement=require('../audits/pedagogie/validations-lot-a-complement-20261123.json');
// Restauration stricte des 26 textes approuvés le 24/11, avec les 7 motifs d'axes préservés.
const {restoreGlobal}=require('./qpjb-sef-global29-normalization.cjs');
const candidateLot26=require('../audits/pedagogie/proposition-26-textes-revue-20261123.json');
const approved=[...approval.approved,...supplement.approved];
const MARK='<script id="training-data" type="application/json">';
function sha256(s){return crypto.createHash('sha256').update(s,'utf8').digest('hex');}
function payload(html){
 const start=html.indexOf(MARK);
 const end=html.indexOf('</script>',start+MARK.length);
 assert(start>=0&&end>start,'JSON QCM training-data absent');
 return html.slice(start+MARK.length,end);
}
function restoreDraftProposals(raw){
 assert.equal(candidateLot26.status,'APPROVED_26_TEXTS_ONLY_20261124');
 assert.equal(candidateLot26.items.length,26);
 assert.equal(candidateLot26.textFields,71);
 assert.equal(candidateLot26.deferredAxisProofReasons,7);
 let data=JSON.parse(restoreGlobal(raw));
 assert.equal(data.exercises.length,1523);
 const byId=new Map(data.exercises.map(q=>[q.id,q]));
 for(const e of candidateLot26.items){
  const q=byId.get(e.id);
  assert(q,'QCM candidat absent : '+e.id);
  assert(e.fields.length===2||e.fields.length===3,'Deux ou trois champs édités par QCM');
  assert.deepEqual(e.fields.slice(0,2),['context','explain']);
  if(e.fields.length===3)assert.equal(e.fields[2],'difficultyReason');
  if(e.reasonPreservedForAxisProof){
   assert.equal(e.fields.length,2);
   assert.equal(q.difficultyReason,e.before.difficultyReason,'Preuve transversale préservée : '+e.id);
  }
  for(const field of e.fields){
   assert.equal(q[field],e.after[field],'Proposition non appliquée exactement : '+e.id+'#'+field);
   q[field]=e.before[field];
  }
  assert.equal(q.answer,e.answerMustStay,'Réponse candidat conservée : '+e.id);
  assert.deepEqual(q.choices,e.choicesMustStay,'Choix candidat conservés : '+e.id);
  assert.deepEqual(q.hand,e.handMustStay,'Main candidat conservée : '+e.id);
  assert.equal(q.difficulty,e.difficultyMustStay,'Niveau candidat conservé : '+e.id);
 }
 return JSON.stringify(data);
}
function restoreApprovedContexts(raw){
 // Inverser les 26 textes du lot approuvé, puis les cinq visas antérieurs, pour prouver le SHA historique.
 raw=restoreDraftProposals(raw);
 assert.equal(approval.approved.length,2,'Les deux premiers contextes 2SA doivent rester inchangés');
 assert.equal(approval.scope,'TWO_CONTEXT_FIELDS_ONLY');
 assert.equal(supplement.approved.length,3,'Exactement trois approbations complémentaires');
 assert.equal(supplement.scope,'THREE_FIELDS_ONLY');
 assert.equal(approved.length,5);
 assert.equal(new Set(approved.map(e=>e.id+'#'+e.field)).size,5,'Approbations sans doublons');
 let restored=raw;
 for(const e of approved){
  assert(['context','explain'].includes(e.field),'Champ interdit : '+e.field);
  const idToken='"id":'+JSON.stringify(e.id);
  const idx=restored.indexOf(idToken);
  assert(idx>=0,'QCM absent : '+e.id);
  assert.equal(restored.indexOf(idToken,idx+idToken.length),-1,'ID en double : '+e.id);
  const nextId=restored.indexOf('"id":',idx+idToken.length);
  const fieldToken='"'+e.field+'":';
  const pos=restored.indexOf(fieldToken,idx+idToken.length);
  assert(pos>idx&&(nextId<0||pos<nextId),'Champ '+e.field+' manquant sur '+e.id);
  const valueAt=pos+fieldToken.length;
  const encodedAfter=JSON.stringify(e.after);
  const encodedBefore=JSON.stringify(e.before);
  assert.equal(restored.slice(valueAt,valueAt+encodedAfter.length),encodedAfter,
   'Texte approuvé non appliqué exactement pour '+e.id);
  restored=restored.slice(0,valueAt)+encodedBefore+
           restored.slice(valueAt+encodedAfter.length);
 }
 return restored;
}
function validateApproved(raw){
 const historical=restoreApprovedContexts(raw);
 assert.equal(sha256(historical),approval.sourceCatalogueSha256Raw,
  'Modification QCM autre que les cinq champs approuvés');
 const data=JSON.parse(restoreGlobal(raw));
 assert.equal(data.exercises.length,1523);
 assert.equal(data.themes.length,22);
 assert.equal(new Set(data.exercises.map(x=>x.id)).size,1523);
 for(const e of approved){
  const row=data.exercises.filter(x=>x.id===e.id);
  assert.equal(row.length,1,'QCM unique : '+e.id);
  assert.equal(row[0][e.field],e.after,'Texte exact '+e.id);
  assert.equal(row[0].answer,e.answer,'Réponse du QCM inchangée : '+e.id);
 }
 // Quatrième cas du lot A, non approuvé : l'intégrité SHA historique le protège.
 assert.equal(supplement.remainingLotAUnapproved.length,1);
 assert.equal(supplement.remainingLotAUnapproved[0],'SEF-V44-005');
 return{data,historical};
}
function test(){
 const raw=payload(fs.readFileSync(path.join(root,'quizz.html'),'utf8'));
 const {data,historical}=validateApproved(raw);
 assert.notEqual(raw,historical,'Cinq corrections réellement présentes');
 for(const e of approved){
  assert.throws(()=>validateApproved(raw.replace(JSON.stringify(e.after),JSON.stringify(e.before))),
   /Texte approuvé non appliqué/,'Réversion interdite '+e.id);
 }
 assert.throws(()=>validateApproved(raw.replace('"answer":"2SA"','"answer":"3SA"')),
  /Modification QCM autre/,'Une réponse corrompue doit être rejetée');
 assert.throws(()=>validateApproved(raw.replace('"id":"SEF-001-1"','"id":"SEF-001-TEST"')),
  /Modification QCM autre/,'Un autre QCM modifié doit être rejeté');
 assert.throws(()=>validateApproved(raw.replace('"id":"SEF-V44-005"','"id":"SEF-V44-TEST"')),
  /Modification QCM autre/,'La correction en HOLD reste protégée');
 assert.equal(data.exercises.length,1523);
 console.log('PASS SEF lot A : 2 contextes 2SA + 3 champs complémentaires = 5 ; 1523 QCM / 22 rubriques ; SHA historique + contre-épreuves');
}
if(require.main===module)test();
module.exports={approval,supplement,approved,candidateLot26,payload,restoreDraftProposals,restoreApprovedContexts,validateApproved,sha256};
