'use strict';
// Lot D : les 11 corrections ne doivent introduire AUCUN autre changement dans le Quiz.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..');
const manifest=require('../audits/QPJB_V1_LOT_D_11_INTEGRATION_20261121.json');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const opening='<script id="training-data" type="application/json">';
const start=html.indexOf(opening),stop=html.indexOf('</script>',start+opening.length);
assert.ok(start>=0 && stop>start,'JSON QCM embarqué');
const data=JSON.parse(html.slice(start+opening.length,stop));
assert.equal(data.exercises.length,1523,'1523 QCM conservés');
assert.equal(data.themes.length,22,'22 rubriques conservées');
assert.equal(manifest.status,'APPLIQUE_EN_BRANCHE_PR_NON_PUBLIE');
assert.equal(manifest.publicationAllowed,false);
assert.equal(manifest.pedagogicalApproval.approvedCount,11);
assert.equal(manifest.proposals.length,11);
assert.deepEqual(manifest.pedagogicalApproval.answerChangedIds,['SEF-V44-030']);

const points={A:4,R:3,D:2,V:1};
const calcH=hand=>hand.flat().reduce((sum,card)=>sum+(points[card]||0),0);
const clone=x=>JSON.parse(JSON.stringify(x));
const idSet=new Set();
let reconstructed=html, altered=0, priorAnswers=0;
const groups={D1_MAINS_A_VALIDER:0,D2_ROUDI:0,D3_TEXAS_TREFLE:0,D4_TEXAS_MAJEUR:0};
for(const p of manifest.proposals){
 assert.ok(!idSet.has(p.id),'QCM dupliqué : '+p.id);idSet.add(p.id);
 assert.ok(Object.hasOwn(groups,p.group),'Groupe connu : '+p.id);groups[p.group]++;
 const question=data.exercises.find(x=>x.id===p.id);
 assert.ok(question,'QCM présent : '+p.id);
 const expectedChanged=Object.keys(p.after).sort();
 assert.deepEqual(expectedChanged,Object.keys(p.before).sort(),'Correspondance des champs : '+p.id);
 for(const [field,value] of Object.entries(p.after)){
  assert.deepEqual(question[field],value,'Valeur approuvée : '+p.id+' '+field);
 }
 const before=clone(question);
 for(const [field,value] of Object.entries(p.before))before[field]=clone(value);
 assert.equal(before.answer,p.sourceAnswer,'Corrigé initial : '+p.id);
 for(const field of ['auction','choices','caseFamily','theme','id','shape']){
  assert.deepEqual(question[field],before[field],'Champ conservé : '+p.id+' '+field);
 }
 assert.equal(question.hand.flat().length,13,'13 cartes : '+p.id);
 assert.deepEqual(question.hand.map(s=>s.length),question.shape,'Distribution : '+p.id);
 assert.equal(new Set(question.choices).size,4,'4 choix distincts : '+p.id);
 assert.ok(question.choices.includes(question.answer),'Bonne réponse proposée : '+p.id);
 assert.equal(calcH(question.hand),question.h,'Total H : '+p.id);
 if(p.group==='D1_MAINS_A_VALIDER'){
  assert.equal(before.h,5);assert.equal(question.h,6);
  assert.deepEqual(question.shape,before.shape);
  const diffs=[];
  for(let suit=0;suit<4;suit++){
   const added=question.hand[suit].filter(c=>!before.hand[suit].includes(c));
   const removed=before.hand[suit].filter(c=>!question.hand[suit].includes(c));
   if(added.length||removed.length){diffs.push(suit);assert.deepEqual(added,['V']);assert.equal(removed.length,1);}
  }
  assert.equal(diffs.length,1,'Un seul Valet ajouté : '+p.id);
 }
 if(p.id==='SEF-V44-030'){
  assert.equal(question.answer,'4♥');
  assert.equal(before.answer,'3♥');
  assert.equal(question.h,9);
  assert.deepEqual(question.hand[1],['A','R','V','7','5','3']);
  assert.equal(question.h + question.hand[1].length - 4,11,'9 H + 2 L = 11 HL');
  assert.ok(question.choices.includes('4♥'),'Option 4♥ préexistante');
  assert.match(question.context,/six beaux Cœurs/);
  assert.match(question.explain,/11 HL/);
  assert.match(question.difficultyReason,/imposer 4♥/);
  priorAnswers++;
 }else assert.equal(question.answer,before.answer,'Autres 10 corrigés inchangés : '+p.id);
 const newText=JSON.stringify(question),oldText=JSON.stringify(before);
 assert.equal(reconstructed.split(newText).length-1,1,'QCM exact et unique : '+p.id);
 reconstructed=reconstructed.replace(newText,oldText);
 altered++;
}
assert.deepEqual(groups,{D1_MAINS_A_VALIDER:7,D2_ROUDI:1,D3_TEXAS_TREFLE:1,D4_TEXAS_MAJEUR:2});
assert.equal(altered,11);
assert.equal(priorAnswers,1);
const gitBlobSha=s=>createHash('sha1').update('blob '+Buffer.byteLength(s,'utf8')+'\\0','utf8').update(s,'utf8').digest('hex');
assert.equal(gitBlobSha(reconstructed),manifest.source.quizzHtmlBlob,
 'Après annulation des 11 corrections, TOUT le fichier quizz.html doit être IDENTIQUE au blob original de main');
assert.notEqual(gitBlobSha(html),manifest.source.quizzHtmlBlob,
 'Les corrections doivent être présentes sur la branche candidate');
console.log('PASS lot D : 11 patchs exacts (7 mains + 4 cas), 10 réponses conservées, 1 corrigé 4♥, 1523 QCM et 22 thèmes ; blob original restauré bit à bit.');
