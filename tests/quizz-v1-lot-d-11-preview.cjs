'use strict';
/* Vérification des onze propositions D : lecture seule, aucune mutation du catalogue public. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const doc=JSON.parse(fs.readFileSync(path.join(root,'audits/QPJB_V1_LOT_D_11_CORRECTIONS_CANDIDATES_20261121.json'),'utf8'));
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const start='<script id="training-data" type="application/json">';
const pos=html.indexOf(start);
const stop=html.indexOf('</script>',pos+start.length);
assert.ok(pos>=0&&stop>pos,'Catalogue embarqué introuvable');
const data=JSON.parse(html.slice(pos+start.length,stop));
assert.equal(data.exercises.length,1523,'Ne pas modifier les 1 523 QCM');
assert.equal(data.themes.length,22,'Ne pas modifier les 22 rubriques');
const qcm=new Map(data.exercises.map(q=>[q.id,q]));
const original=JSON.stringify(data.exercises);
assert.equal(doc.status,'APPROUVE_PEDAGOGIQUEMENT_NON_ACTIF');
assert.equal(doc.pedagogicalApproval.approvedCount,11);
assert.equal(doc.pedagogicalApproval.publicationApproval,false);
assert.equal(doc.activationAllowed,false);
assert.equal(doc.publicationAllowed,false);
assert.equal(doc.proposals.length,11);
assert.deepEqual(doc.proposals.filter(q=>q.after.answer!==undefined).map(q=>q.id),['SEF-V44-030'],'Un seul corrigé candidat modifié');
const ids=new Set();
const count={D1_MAINS_A_VALIDER:0,D2_ROUDI:0,D3_TEXAS_TREFLE:0,D4_TEXAS_MAJEUR:0};
const points={A:4,R:3,D:2,V:1};
const hcount=hand=>hand.flat().reduce((v,c)=>v+(points[c]||0),0);
const same=(a,b)=>assert.deepEqual(a,b);
function validHand(hand){
 assert.equal(hand.length,4);
 assert.equal(hand.reduce((n,suit)=>n+suit.length,0),13);
 for(const cards of hand){
  assert.equal(new Set(cards).size,cards.length,'Pas de carte en double dans une couleur');
  for(const c of cards)assert.ok(['A','R','D','V','10','9','8','7','6','5','4','3','2'].includes(c),'Valeur de carte valide');
 }
}
for(const p of doc.proposals){
 assert.ok(!ids.has(p.id),'ID répété : '+p.id);ids.add(p.id);
 assert.ok(Object.hasOwn(count,p.group),'Groupe D inconnu');count[p.group]++;
 const base=qcm.get(p.id);assert.ok(base,'ID absent de V1 : '+p.id);
 assert.equal(p.sourceAnswer,base.answer);
 assert.equal(p.sourceCaseFamily,base.caseFamily);
 const wanted=p.group==='D1_MAINS_A_VALIDER'
  ?['hand','h','context','explain','difficultyReason']
  :p.group==='D3_TEXAS_TREFLE'?['explain','difficultyReason']
  :p.id==='SEF-V44-030'?['context','answer','explain','difficultyReason']:['difficultyReason'];
 same(Object.keys(p.before).sort(),wanted.slice().sort());
 same(Object.keys(p.after).sort(),wanted.slice().sort());
 for(const key of wanted)same(base[key],p.before[key]);
 const after={...base,...p.after};
 if(p.id==='SEF-V44-030'){
  assert.equal(base.answer,'3♥');
  assert.equal(after.answer,'4♥');
  assert.ok(base.choices.includes('4♥'),'L’option 4♥ existait déjà');
  assert.equal(base.h,9);
  assert.equal(base.hand[1].length,6);
  assert.deepEqual(base.hand[1],['A','R','V','7','5','3']);
  assert.equal(base.h+(base.hand[1].length-4),11,'9 H + 2 L = 11 HL');
  assert.match(after.context,/six beaux Cœurs/);
  assert.match(after.explain,/11 HL/);
  assert.match(after.explain,/4♥/);
 }else same(after.answer,base.answer);
 same(after.choices,base.choices);
 same(after.auction,base.auction);
 same(after.id,base.id);
 same(after.caseFamily,base.caseFamily);
 same(after.shape,base.shape);
 same(after.theme,base.theme);
 validHand(after.hand);
 assert.equal(after.h,hcount(after.hand),'Points H calculés : '+p.id);
 if(p.group==='D1_MAINS_A_VALIDER'){
  assert.equal(base.h,5);assert.equal(after.h,6,'Le champ h passe de 5 à 6');
  const changed=[];
  for(let i=0;i<4;i++){
   const was=base.hand[i],now=after.hand[i];
   assert.equal(was.length,now.length,'Distribution inchangée');
   const removed=was.filter(x=>!now.includes(x));
   const added=now.filter(x=>!was.includes(x));
   if(removed.length||added.length){
    assert.equal(removed.length,1);assert.equal(added.length,1);
    assert.equal(added[0],'V','Un seul Valet ajouté');
    assert.ok(['2','3','4','5','6','7','8','9','10'].includes(removed[0]));
    changed.push(i);
   }
  }
  assert.equal(changed.length,1,'Une seule couleur retouchée');
 }else{
  same(after.hand,base.hand);
  assert.equal(after.h,base.h);
 }
}
same(count,{D1_MAINS_A_VALIDER:7,D2_ROUDI:1,D3_TEXAS_TREFLE:1,D4_TEXAS_MAJEUR:2});
const approvals=JSON.parse(fs.readFileSync(path.join(root,'Docs/PARCOURS_V2_DECISIONS_PEDAGOGIQUES_UTILISATRICE_20261120.json'),'utf8'));
const prior=approvals.caseDecisions.find(q=>q.id==='SEF-L25-007');
assert.equal(prior.approval,'APPROVED_BY_USER');
assert.equal(prior.approvedAnswer,'2SA');
const preview=JSON.parse(fs.readFileSync(path.join(root,'Docs/PARCOURS_V2_CORRECTIONS_4_QCM_HOLD_20261120.json'),'utf8'));
const approvedText=preview.proposedPatches.find(q=>q.id==='SEF-L25-007')?.proposedChanges?.explain;
assert.equal(doc.proposals.find(q=>q.id==='SEF-L25-007').after.explain,approvedText,
 'Conserver mot pour mot la formulation déjà approuvée');
assert.equal(JSON.stringify(data.exercises),original,'La revue ne modifie jamais le catalogue');
console.log('PASS LOT D : 11 propositions validées, 7 mains 5→6 H, un corrigé 3♥→4♥ (11 HL) ; 1523 QCM publics inchangés, aucune activation');
