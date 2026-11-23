'use strict';
// Lecture seule : vérifie la correspondance intégrale du pack de visa aux 36 QCM réels.
// Cette suite ne modifie jamais quizz.html et n'approuve aucun texte.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const pack=JSON.parse(read('audits/wave2/pedagogie/PACK_VISA_36_PROPOSITIONS_20261123_HOLD.json'));
const srcPaths=[
 'audits/v1-evolutions/pedagogie/propositions-mineures-fit-20.json',
 'audits/v1-evolutions/pedagogie/propositions-roudi-conventions-16.json'
];
const proposals=srcPaths.flatMap(x=>JSON.parse(read(x)).proposals);
const html=read('quizz.html'),m='<script id="training-data" type="application/json">';
const i=html.indexOf(m),j=html.indexOf('</script>',i+m.length);
assert(i>=0&&j>i,'Embedded SEF data present');
const originalRaw=html.slice(i+m.length,j);
const data=JSON.parse(originalRaw);
require('./qpjb-sef-approved-2sa-20261123.cjs').validateApproved(originalRaw);
assert.equal(data.exercises.length,1523);
assert.equal(data.themes.length,22);
assert.equal(pack.editorialCandidates.length,36);
assert.equal(proposals.length,36);
assert.equal(pack.totalTextFields,108);
assert.equal(pack.applyToQuiz,false);
assert.equal(pack.authorizedForMergeOfAnyQuizEdits,false);
assert.equal(pack.acceptanceMustBeExplicit,true);
assert.equal(pack.status,'PREPARATION_ONLY_NOT_APPROVED');
const counts={},honors={A:4,R:3,D:2,V:1};
const byId=new Map(data.exercises.map(q=>[q.id,q]));
const proposedById=new Map(proposals.map(q=>[q.id,q]));
assert.equal(new Set(pack.editorialCandidates.map(x=>x.id)).size,36);
let changed=0;
for(const entry of pack.editorialCandidates){
 assert.equal(entry.status,'PENDING_EXPLICIT_HUMAN_VISA',entry.id);
 const current=byId.get(entry.id),source=proposedById.get(entry.id);
 assert(current&&source,entry.id+' absent');
 assert.equal(source.theme,entry.theme,entry.id+' theme');
 assert.deepEqual(current.hand,entry.handMustStay,entry.id+' hand');
 assert.deepEqual(current.auction,entry.auctionMustStay,entry.id+' auction');
 assert.deepEqual(current.choices,entry.choicesMustStay,entry.id+' choices');
 assert.equal(current.answer,entry.answerMustStay,entry.id+' answer');
 assert.equal(current.difficulty,entry.difficultyMustStay,entry.id+' level');
 assert.equal(current.h,entry.pointsH,entry.id+' H');
 assert.equal(current.hand.flat().length,13,entry.id+' cards');
 assert.equal(current.hand.flat().reduce((n,c)=>n+(honors[c]||0),0),entry.pointsH,entry.id+' points');
 assert.deepEqual(entry.fields,['context','explain','difficultyReason']);
 const before=source.source.corrigeActuel,after=source.nouvelleRedactionComplete;
 for(const [key,old,newKey] of [['context','contexte','contexte'],['explain','explication','explication'],['difficultyReason','motifDifficulte','motifDifficulte']]){
  assert.equal(entry.before[key],before[old],entry.id+' source before '+key);
  assert.equal(current[key],entry.before[key],entry.id+' live unchanged '+key);
  const proposed=entry.id==='SEF-V4-082-1'&&key==='context' ? entry.after.context : after[newKey];
  assert.equal(entry.after[key],proposed,entry.id+' proposed exact '+key);
  assert.notEqual(entry.after[key],entry.before[key],entry.id+' effective proposal '+key);
  changed++;
 }
 assert.deepEqual(after.choix,current.choices,entry.id+' options');
 assert.equal(after.bonneReponse,current.answer,entry.id+' answer retained');
 assert.equal(after.niveau,current.difficulty,entry.id+' difficulty retained');
 counts[entry.group]=(counts[entry.group]||0)+1;
}
assert.deepEqual(counts,{
 EDITION_FAIBLE_RISQUE:26,
 REGLE_QPJB_12_HL:2,
 CORRECTION_REDACTION_AVANT_VISA:1,
 ACCORD_CONVENTION_EXPLICITE:7
});
assert.equal(changed,108);
const roudi=pack.editorialCandidates.find(x=>x.id==='SEF-V4-082-1');
assert(roudi.after.context.includes('redemandé 1SA après la réponse de 1♠'));
assert(!roudi.after.context.includes('répondu 1SA sur 1♠'));
const v44=byId.get('SEF-V44-005');
assert.equal(v44.answer,'2SA','V44-005 must remain in HOLD');
assert.equal(pack.editorialCandidates.some(x=>x.id==='SEF-V44-005'),false);
console.log('PASS PACK_VISA_36 : 36 snapshots vrais, 108 textes proposées non appliquées, 26+2+1+7, 0 réponse ou main changée, 1523 QCM protégés.');
