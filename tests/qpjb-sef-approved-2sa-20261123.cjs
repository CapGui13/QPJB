'use strict';
// Validation différentielle : exactement deux textes de contexte autorisés, aucun autre octet QCM.
// Utilisable par les tests historiques sans modifier les empreintes d'origine.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const approval=require('../audits/pedagogie/validations-2sa-fitte-20261123.json');
const MARK='<script id="training-data" type="application/json">';
function sha256(s){return crypto.createHash('sha256').update(s,'utf8').digest('hex');}
function payload(html){
 const start=html.indexOf(MARK);
 const end=html.indexOf('</script>',start+MARK.length);
 assert(start>=0&&end>start,'JSON QCM training-data absent');
 return html.slice(start+MARK.length,end);
}
function restoreApprovedContexts(raw){
 assert.equal(approval.approved.length,2,'Seulement deux contextes approuvés');
 assert.equal(approval.scope,'TWO_CONTEXT_FIELDS_ONLY');
 let restored=raw;
 for(const e of approval.approved){
  assert.equal(e.field,'context');
  const idToken='"id":'+JSON.stringify(e.id);
  const idx=restored.indexOf(idToken);
  assert(idx>=0,'QCM absent : '+e.id);
  assert.equal(restored.indexOf(idToken,idx+idToken.length),-1,'ID en double : '+e.id);
  const nextId=restored.indexOf('"id":',idx+idToken.length);
  const fieldToken='"context":';
  const pos=restored.indexOf(fieldToken,idx+idToken.length);
  assert(pos>idx&&(nextId<0||pos<nextId),'Champ context manquant sur '+e.id);
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
  'Modification QCM autre que les deux contextes approuvés');
 const data=JSON.parse(raw);
 assert.equal(data.exercises.length,1523);
 assert.equal(data.themes.length,22);
 for(const e of approval.approved){
  const row=data.exercises.filter(x=>x.id===e.id);
  assert.equal(row.length,1,'QCM unique : '+e.id);
  assert.equal(row[0].context,e.after);
  assert.equal(row[0].answer,e.answer,'Réponse du QCM inchangée : '+e.id);
 }
 return{data,historical};
}
function test(){
 const raw=payload(fs.readFileSync(path.join(root,'quizz.html'),'utf8'));
 const {data,historical}=validateApproved(raw);
 assert.notEqual(raw,historical,'Deux corrections réellement présentes');
 const e=approval.approved[0];
 assert.throws(()=>validateApproved(raw.replace(JSON.stringify(e.after),JSON.stringify(e.before))),
  /Texte approuvé non appliqué/);
 assert.throws(()=>validateApproved(raw.replace('"answer":"2SA"','"answer":"3SA"')),
  /Modification QCM autre/, 'Une réponse corrompue doit être rejetée');
 assert.throws(()=>validateApproved(raw.replace('"id":"SEF-001-1"','"id":"SEF-001-TEST"')),
  /Modification QCM autre/, 'Un autre QCM modifié doit être rejeté');
 assert.equal(data.exercises.length,1523);
 console.log('PASS SEF 2SA : 2 champs context exacts, 1523 QCM, 22 thèmes, invariants historiques et contre-épreuves');
}
if(require.main===module)test();
module.exports={approval,payload,restoreApprovedContexts,validateApproved,sha256};
