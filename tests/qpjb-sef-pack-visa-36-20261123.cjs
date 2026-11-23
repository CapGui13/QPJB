'use strict';
// Contrôle post-PR #276 : 36 propositions documentées, dont 71 champs
// intégrés sur 26 QCM et 37 champs encore différés. Aucun changement apporté.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const pack=read('audits/wave2/pedagogie/PACK_VISA_36_PROPOSITIONS_20261123_HOLD.json');
const approval=read('audits/pedagogie/proposition-26-textes-revue-20261123.json');
const sources=[
 'audits/v1-evolutions/pedagogie/propositions-mineures-fit-20.json',
 'audits/v1-evolutions/pedagogie/propositions-roudi-conventions-16.json'
];
const proposals=new Map(sources.flatMap(p=>read(p).proposals).map(x=>[x.id,x]));
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const {payload,validateApproved}=require('./qpjb-sef-approved-2sa-20261123.cjs');
const catalogue=validateApproved(payload(html)).data;
assert.equal(catalogue.exercises.length,1523);
assert.equal(catalogue.themes.length,22);
assert.equal(pack.status,'PARTIAL_INTEGRATION_26_WITH_10_HOLD_AND_7_DEFERRED_REASONS');
assert.equal(pack.editorialCandidates.length,36);
assert.equal(pack.totalTextFields,108);
assert.equal(pack.applyToQuiz,false,'Le rapport ne modifie rien');
assert.equal(pack.authorizedForMergeOfAnyQuizEdits,false,'Pas de visa des 10 HOLD');
assert.equal(approval.status,'APPROVED_26_TEXTS_ONLY_20261124');
assert.equal(approval.items.length,26);
assert.equal(approval.textFields,71);
assert.equal(pack.approvedIntegrated.appliedTextFields,71);
assert.equal(pack.approvedIntegrated.totalPendingTextFields,37);
const byId=new Map(catalogue.exercises.map(x=>[x.id,x]));
const approved=new Map(approval.items.map(x=>[x.id,x]));
const honor={A:4,R:3,D:2,V:1};
let applied=0,held=0,full=0,part=0,remaining=0;
const counts={};
for(const e of pack.editorialCandidates){
 const p=proposals.get(e.id),q=byId.get(e.id),a=approved.get(e.id);
 assert(p&&q,'QCM ou proposition manquante : '+e.id);
 assert.equal(p.theme,e.theme);
 assert.deepEqual(q.hand,e.handMustStay,e.id+' main');
 assert.deepEqual(q.auction,e.auctionMustStay,e.id+' enchères');
 assert.deepEqual(q.choices,e.choicesMustStay,e.id+' choix');
 assert.equal(q.answer,e.answerMustStay,e.id+' réponse');
 assert.equal(q.difficulty,e.difficultyMustStay,e.id+' niveau');
 assert.equal(q.h,e.pointsH,e.id+' points');
 assert.equal(q.hand.flat().length,13,e.id+' treize cartes');
 assert.equal(q.hand.flat().reduce((n,c)=>n+(honor[c]||0),0),q.h,e.id+' H exacts');
 assert.deepEqual(e.fields,['context','explain','difficultyReason']);
 const map={context:'contexte',explain:'explication',difficultyReason:'motifDifficulte'};
 const active=a?a.fields:[];
 assert.deepEqual(e.appliedFields,active,e.id+' champs appliqués');
 for(const field of e.fields){
  const original=p.source.corrigeActuel[map[field]];
  const proposed=p.nouvelleRedactionComplete[map[field]];
  assert.equal(e.before[field],original,e.id+' archive avant '+field);
  if(e.id!=='SEF-V4-082-1'||field!=='context')
   assert.equal(e.after[field],proposed,e.id+' proposition après '+field);
  else assert.match(e.after.context,/redemandé 1SA après la réponse de 1♠/);
  if(active.includes(field)){
   assert.equal(a.before[field],original,e.id+' source approuvée '+field);
   assert.equal(q[field],a.after[field],e.id+' valeur intégrée '+field);
   assert.equal(q[field],e.after[field],e.id+' valeur proposée '+field);
   applied++;
  }else{
   assert.equal(q[field],original,e.id+' HOLD non modifié '+field);
   held++;
  }
 }
 if(a){
  if(active.length===3){full++;assert.equal(e.status,'INTEGRATED_COMPLETE_PR276_20261124');}
  else{part++;assert.deepEqual(active,['context','explain']);assert.equal(e.status,'INTEGRATED_PARTIAL_REASON_DEFERRED_PR276_20261124');}
 }else{remaining++;assert.equal(e.status,'PENDING_EXPLICIT_HUMAN_VISA');}
 counts[e.group]=(counts[e.group]||0)+1;
}
assert.deepEqual(counts,{EDITION_FAIBLE_RISQUE:26,REGLE_QPJB_12_HL:2,CORRECTION_REDACTION_AVANT_VISA:1,ACCORD_CONVENTION_EXPLICITE:7});
assert.equal(applied,71);
assert.equal(held,37);
assert.equal(full,19);
assert.equal(part,7);
assert.equal(remaining,10);
assert.equal(byId.get('SEF-V44-005').answer,'2SA','QCM 2SA toujours HOLD');
assert.equal(pack.editorialCandidates.some(x=>x.id==='SEF-V44-005'),false);
console.log('PASS PACK_36_POST276 : 19 complets, 7 partiels, 10 HOLD, 71 champs intégrés, 37 différés, 1523 QCM et 105 preuves protégées par validation SHA.');
