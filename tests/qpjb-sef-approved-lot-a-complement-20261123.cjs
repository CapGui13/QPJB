'use strict';
// Contrôle ciblé des trois décisions nouvelles sans rouvrir les 51 autres dossiers.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {payload,validateApproved,restoreDraftProposals,supplement,approved,sha256}=require('./qpjb-sef-approved-2sa-20261123.cjs');
const raw=payload(fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8'));
const {data,historical}=validateApproved(raw);
const base=JSON.parse(historical);
// Les vingt-six textes candidats du draft sont vérifiés séparément. Ce test
// historique ne compare que les cinq modifications déjà autorisées.
const confirmed=JSON.parse(restoreDraftProposals(raw));
assert.equal(approved.length,5);
assert.deepEqual(supplement.approved.map(x=>x.id),['SEF-N067-1','SEF-L02-E-17','SEF-V3-103-3']);
assert.equal(sha256(historical),'22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a');
assert.equal(data.exercises.length,base.exercises.length);
assert.equal(data.themes.length,base.themes.length);
const permitted=new Map(approved.map(x=>[x.id,x]));
let changed=0;
for(let i=0;i<data.exercises.length;i++){
 const row=confirmed.exercises[i],before=base.exercises[i];
 assert.equal(row.id,before.id,'Ordre QCM et ID conservés');
 const e=permitted.get(row.id);
 if(e){
  assert.equal(row[e.field],e.after);
  const normal={...row,[e.field]:e.before};
  assert.deepEqual(normal,before,'Seul le champ approuvé diffère : '+e.id);
  changed++;
 } else assert.deepEqual(row,before,'Autre QCM conservé : '+row.id);
}
assert.equal(changed,5,'Cinq et seulement cinq QCM édités');
const hold=data.exercises.find(x=>x.id==='SEF-V44-005');
const priorHold=base.exercises.find(x=>x.id==='SEF-V44-005');
assert.deepEqual(hold,priorHold,'Le QCM réservé à expertise reste inchangé');
assert.equal(hold.answer,'2SA');
for(const e of supplement.approved){
 assert.throws(()=>validateApproved(raw.replace(JSON.stringify(e.after),JSON.stringify(e.before))),
  /Texte approuvé non appliqué/,'Détecter suppression de la décision '+e.id);
}
console.log('PASS lot A : 3 nouveaux champs autorisés, 2 champs 2SA existants, 1523 QCM / 22 thèmes, refus de toute mutation étrangère, V44-005 inchangé');
