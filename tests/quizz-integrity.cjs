'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Quizz JSON data is embedded');
const data=JSON.parse(match[1]);
const exercises=data.exercises;
assert.equal(exercises.length,993,'All 969 previous exercises and 12 curated cases are retained');
assert.equal(data.themes.length,22,'Original 22 topics are retained');
assert.ok(html.includes('id="free-form"'),'A free response form precedes the choices');
assert.ok(html.includes('function normalizeBid('),'Bidding input parser exists');
assert.ok(html.includes('id="show-choices"'),'A reveal-choices button exists');
assert.ok(html.includes('Le SEF est notre référence unique.'),'The SEF is explicitly shown as the single reference system');
for(const x of exercises){
 for(const part of [x.context,x.explain,x.takeaway,x.whyNot?.reason]){
  assert.doesNotMatch(String(part||''),/accord de paire|accords SEF retenus|dans cet accord|dans ce système|^accord Walsh/i,'No pair-specific caveat in '+x.id);
 }
}

const contrasted=exercises.filter(x=>x.whyNot);
assert.ok(contrasted.length>=125,'Pedagogical contrasts from the focused SEF review are retained');
assert.equal(exercises.filter(x=>/^SEF-C-\d{3}$/.test(x.id)).length,12,'Twelve audited C01 situations');
assert.equal(exercises.filter(x=>/^SEF-C2-\d{3}$/.test(x.id)).length,12,'Twelve audited C02 convention situations');
const stayman6=exercises.find(x=>x.id==='SEF-V49-016');
assert.equal(stayman6?.h,6,'Boundary: six H in two four-card majors');
assert.equal(stayman6?.answer,'Passe','Classic SEF Stayman requires at least 8 H');
assert.ok(stayman6.choices.includes('2♣'),'The natural beginner temptation is still offered');
const stayman8=exercises.find(x=>x.id==='SEF-N096-1');
assert.equal(stayman8?.answer,'2♣','Contrasting hand at eight H still uses Stayman');
assert.ok(html.includes('archivedPreRevision:former')&&html.includes('pedagogicalRevision:revisedStaymanCode'),'Prior student progress is archived for corrected exercise');
const revisedRules={
 'SEF-V4-097-1':'2♥',
 'SEF-V4-103-1':'2♠',
 'SEF-V44-067':'2SA',
 'SEF-V44-068':'2SA'
};
for(const [id,bid] of Object.entries(revisedRules)){
 const x=exercises.find(z=>z.id===id);
 assert.equal(x?.answer,bid,'SEF 2024 Drury or 2SA after Passe: '+id);
 assert.ok(x?.whyNot?.reason&&x.takeaway,'SEF 2024 cases explain the tempting alternative: '+id);
}
for(const id of ['SEF-V44-067','SEF-V44-068']){
 const x=exercises.find(z=>z.id===id);
 assert.equal(x.auction.length,4,'Fit with singleton is announced directly by 2SA: '+id);
 assert.equal(x.shape[x.id==='SEF-V44-067'?1:0],4,'Four trump cards: '+id);
 assert.ok(x.shape.includes(1),'Singleton required for 2SA in third seat: '+id);
}
const nonForcing=exercises.filter(x=>/1SA\s*\(?forcing\)?/i.test(
 x.auction.join(' ')+x.context+x.explain+(x.difficultyReason||'')));
assert.deepEqual(nonForcing.map(x=>x.id),[],'SEF major-opening 1SA must be non forcing');
// V4.36 : 1SA est non forcing ; « Passe » ne doit plus être traité comme un
// distracteur absolument faux pour les onze redemandes à la couleur auditées.
const freeNtRebids={
 'SEF-049-1':['2♥','3♥'], 'SEF-049-2':['2♥','3♥'],
 'SEF-050-2':['2♠','3♠'], 'SEF-N122-1':['2♥','3♥'],
 'SEF-N123-2':['2♠','3♠'], 'SEF-N123-1':['2♠','3♠'],
 'SEF-N127-2':['2♥','3♥'], 'SEF-N128-2':['2♦','3♦'],
 'SEF-N129-2':['2♣','3♣'], 'SEF-N131-1':['2♣','3♣'],
 'SEF-V410-005':['2♦','3♦']
};
for(const [id,[correct,jump]] of Object.entries(freeNtRebids)){
 const x=exercises.find(z=>z.id===id);
 assert.ok(x,'Reviewed opening major rebid exists: '+id);
 assert.equal(x.answer,correct,'Maintain correct SEF economical rebid: '+id);
 assert.ok(x.choices.includes(jump),'The tempting but excessive jump is offered: '+id);
 assert.ok(!x.choices.includes('Passe'),'Nonforcing pass is not falsely presented as categorically illegal: '+id);
 assert.match(x.context,/non forcing/i,'The learner sees the SEF nonforcing rule: '+id);
 assert.ok(x.whyNot?.reason&&x.takeaway,'Explained pedagogical contrast: '+id);
}
// V4.37 : corriger les réponses caricaturales 2SA avec 0 à 4 H après
// intervention adverse. Ne pas déplacer les bonnes réponses ni les IDs.
const reviewedWeakResponses={
 'SEF-V3-085-3':'2♣',
 'SEF-V3-086-1':'2♦','SEF-V3-086-2':'2♦',
 'SEF-V3-087-3':'2♦','SEF-V3-087-2':'2♦',
 'SEF-V3-088-2':'2♥','SEF-V3-088-1':'2♥'
};
const weakReviewIds=[
 'SEF-V3-053-1','SEF-V3-053-3','SEF-V3-080-1','SEF-V3-080-2',
 ...Object.keys(reviewedWeakResponses),
 'SEF-V3-089-2','SEF-V3-089-1','SEF-V3-106-1','SEF-V3-106-2',
 'SEF-V4-065-1','SEF-V4-065-2','SEF-V4-066-1',
 'SEF-V4-067-4','SEF-V4-067-1','SEF-V4-068-2','SEF-V4-068-3'
];
assert.equal(new Set(weakReviewIds).size,22,'Twenty-two distinct reviewed teaching situations');
for(const id of weakReviewIds){
 const x=exercises.find(y=>y.id===id);
 assert.ok(x,'Reviewed low-H exercise remains available: '+id);
 assert.equal(x.answer,id.startsWith('SEF-V3-080-')?'2♠':'Passe','Review retained the original SEF response: '+id);
 assert.ok(x.whyNot?.reason&&x.takeaway,'Explicit alternative and lesson: '+id);
 assert.ok(x.choices.includes(x.whyNot.bid),'Discussed wrong bid is offered: '+id);
 if(id in reviewedWeakResponses){
  assert.ok(x.h<=4,'Corrected 2SA trap applies only to a very weak hand: '+id);
  assert.ok(x.choices.includes(reviewedWeakResponses[id]),'Natural tempting new suit offered: '+id);
  assert.ok(!x.choices.includes('2SA'),'An implausible 2SA is no longer offered: '+id);
 }
}
// V4.38 : revue des 15 situations Stayman/Texas et des 23 deuxièmes
// enchères encore signalées. Les bonnes réponses sont figées.
const reviewedStayman=[
 'SEF-V3-002-1','SEF-V3-004-1','SEF-V3-005-1','SEF-V3-006-3',
 'SEF-V3-007-4','SEF-V3-008-2','SEF-V3-009-1','SEF-V3-010-2',
 'SEF-V3-021-2','SEF-V3-022-1','SEF-V3-024-1','SEF-V3-025-1',
 'SEF-V3-026-1','SEF-V416-012','SEF-V416-013'
];
const reviewedSecond=[
 'SEF-N140-1','SEF-V44-022','SEF-V49-022','SEF-V49-024','SEF-V49-025',
 'SEF-V49-026','SEF-V49-028','SEF-V49-039','SEF-V410-018','SEF-V410-019',
 'SEF-V411-010','SEF-V411-019','SEF-V411-020','SEF-V411-021','SEF-V412-005',
 'SEF-V413-002','SEF-V413-006','SEF-V417-007','SEF-V417-008',
 'SEF-V418-003','SEF-V421-003','SEF-V421-005','SEF-V423-006'
];
assert.equal(reviewedStayman.length,15,'All fifteen indicated Stayman/Texas cases are reviewed');
assert.equal(reviewedSecond.length,23,'All twenty-three second-response cases are reviewed');
assert.equal(new Set([...reviewedStayman,...reviewedSecond]).size,38);
const expectedRevised={
 'SEF-N140-1':['Passe','2♣','3SA'],
 'SEF-V49-026':['Passe','2♦','2SA'],
 'SEF-V410-018':['2♠','2♥','3♠'],
 'SEF-V3-021-2':['3SA','Passe','4SA'],
 'SEF-V3-022-1':['3SA','Passe','4SA']
};
for(const id of [...reviewedStayman,...reviewedSecond]){
 const x=exercises.find(y=>y.id===id);
 assert.ok(x,'SEF exercise not found: '+id);
 assert.ok(x.whyNot?.reason&&x.takeaway,'Explicit comparative teaching for '+id);
 assert.ok(x.choices.includes(x.whyNot.bid)&&x.whyNot.bid!==x.answer,'A genuinely wrong tempting bid is explained: '+id);
 const theme=reviewedStayman.includes(id)?'stayman':'second';
 assert.equal(x.theme,theme,'Exercise family still correct: '+id);
 if(expectedRevised[id]){
  const [correct,added,removed]=expectedRevised[id];
  assert.equal(x.answer,correct,'SEF answer remains the same: '+id);
  assert.ok(x.choices.includes(added),'New tempting answer present: '+id);
  assert.ok(!x.choices.includes(removed),'Obvious or ambiguous old choice removed: '+id);
 }
}
assert.ok(exercises.filter(x=>x.whyNot).length>=191,'All 32 new pedagogical contrasts are preserved');
// V4.39 : distinguer SEF 2024 de la convention « collante » hors SEF.
// Après une mineure et une intervention à 1♦/1♥, le Spoutnik dénie une majeure quatrième.
const naturalMajorSef24={
 'SEF-V410-025':['1♠','1♦','1♥',4],
 'SEF-V418-005':['1♠','1♣','1♥',4],
 'SEF-V420-009':['1♥','1♣','1♦',4]
};
for(const [id,[bid,open,intervention,minLength]] of Object.entries(naturalMajorSef24)){
 const x=exercises.find(v=>v.id===id);
 assert.ok(x,'Corrected SEF natural-major answer exists: '+id);
 assert.equal(x.auction[0],'Partenaire : '+open,'Opening correct: '+id);
 assert.equal(x.auction[1],'Adversaire : '+intervention,'Intervention correct: '+id);
 assert.equal(x.answer,bid,'Natural response, not inverted Spoutnik: '+id);
 assert.ok(x.hand[bid==='1♠'?0:1].length>=minLength,'At least four cards in chosen major: '+id);
 assert.ok(x.choices.includes('Contre')&&x.whyNot?.bid==='Contre',
  'Incorrect Spoutnik retained only as a teaching alternative: '+id);
 assert.ok(x.whyNot?.reason&&x.takeaway,'Corrective pedagogical contrast: '+id);
 const mapEntry=new RegExp("'"+id+"':'sef24-spoutnik-");
 assert.match(html,mapEntry,'Prior progress archived before the corrected answer: '+id);
}
assert.ok(exercises.filter(x=>x.whyNot).length>=221,'All V4.39 Drury and competitive explanations exist');
// V4.39 : diversifier les pièges sans modifier les bonnes réponses des autres cas.
const replacementTraps={
 'SEF-V4-047-1':['4♥','3♥','Passe'],
 'SEF-V4-100-2':['1SA','1♠','3♥'],
 'SEF-V4-100-3':['1SA','2♦','3♥'],
 'SEF-V4-106-1':['1SA','2♦','3♠'],
 'SEF-V4-106-2':['1SA','2♦','3♠'],
 'SEF-V44-041':['1♠','Contre','Passe'],
 'SEF-V44-042':['2♥','3♥','Passe'],
 'SEF-V417-010':['Contre','2♦','1SA'],
 'SEF-V421-007':['Surcontre','2♦','3♠']
};
for(const [id,[correct,pitfall,discarded]] of Object.entries(replacementTraps)){
 const x=exercises.find(y=>y.id===id);
 assert.ok(x,'V4.39 exercise exists: '+id);
 assert.equal(x.answer,correct,'SEF result remains correct: '+id);
 assert.ok(x.choices.includes(pitfall)&&!x.choices.includes(discarded),
  'Replaced a less instructive distractor: '+id);
 assert.ok(x.whyNot?.reason&&x.takeaway,'SEF contrast is explained: '+id);
}
const manualPriorityCases={
 'SEF-V44-045':'Surcontre', 'SEF-V410-027':'Contre',
 'SEF-V413-002':'Passe', 'SEF-V421-003':'Passe',
 'SEF-V421-005':'Passe', 'SEF-V422-002':'Passe',
 'SEF-V423-006':'Passe', 'SEF-V424-007':'Surcontre'
};
for(const [id,bid] of Object.entries(manualPriorityCases)){
 const x=exercises.find(y=>y.id===id);
 assert.equal(x?.answer,bid,'Manual priority review confirms SEF result: '+id);
 assert.ok(x?.whyNot?.reason&&x?.takeaway,'Manual priority review retains teaching context: '+id);
}
// V4.40 : préserver l'audit des réponses « presque plausibles » sans
// présenter le relais 2SA sur un 2 faible comme une faute systématique.
const weakTwoChoiceReview={
 'SEF-V3-108-1':'4♠',
 'SEF-V44-049':'4♠',
 'SEF-V426-004':'Passe'
};
for(const [id,correct] of Object.entries(weakTwoChoiceReview)){
 const x=exercises.find(e=>e.id===id);
 assert.ok(x,'Reviewed weak-two exercise exists: '+id);
 assert.equal(x.answer,correct,'Original SEF answer preserved: '+id);
 assert.ok(!x.choices.includes('2SA'),'Remove ambiguous 2NT game inquiry as a wrong option: '+id);
 assert.ok(x.choices.includes('3♦'),'Require a genuine new-suit length error instead: '+id);
 assert.equal(x.whyNot?.bid,'3♦','Explain the exact replacement: '+id);
 assert.ok(x.takeaway?.includes('2SA'),'Teach the status of the relay: '+id);
}
const detailedReviewIds=[
 'SEF-V3-108-1','SEF-V4-009-1','SEF-V4-010-1',
 'SEF-V4-011-1','SEF-V4-012-1','SEF-V4-021-1','SEF-V4-022-3',
 'SEF-V4-024-2','SEF-V44-002','SEF-V44-007','SEF-V44-013',
 'SEF-V44-014','SEF-V44-015','SEF-V44-016','SEF-V44-049',
 'SEF-V44-063','SEF-V44-065','SEF-V44-066','SEF-V45-013',
 'SEF-V45-014','SEF-V45-016','SEF-V45-017','SEF-V45-018',
 'SEF-V45-019','SEF-V45-022','SEF-V45-025','SEF-V45-037',
 'SEF-V412-016','SEF-V416-006','SEF-V423-003',
 'SEF-V426-004','SEF-V426-006'
];
assert.equal(detailedReviewIds.length,32,'Review includes thirty-two distinct decisions');
assert.equal(new Set(detailedReviewIds).size,32);
for(const id of detailedReviewIds){
 const x=exercises.find(e=>e.id===id);
 assert.ok(x,'Reviewed exercise exists: '+id);
 assert.ok(x.whyNot?.reason&&x.takeaway,'Explanatory contrast is complete: '+id);
 assert.ok(x.choices.includes(x.whyNot.bid),'Discussed alternative is shown: '+id);
 assert.notEqual(x.answer,x.whyNot.bid,'The compared alternative is not the right answer: '+id);
}
assert.ok(exercises.filter(x=>x.whyNot).length>=253,'All 32 new comparative explanations remain present');
// V4.41 : contrôle systématique de toutes les anciennes vigilances
// non expliquées, et remplacement de six « 2SA » caricaturaux en réveil.
const reviewedUnexplained=[
 'SEF-N034-1','SEF-V4-061-2','SEF-V4-062-4','SEF-V4-062-1',
 'SEF-V4-063-1','SEF-V4-064-2','SEF-V4-064-1','SEF-V44-011',
 'SEF-V44-012','SEF-V45-008','SEF-V49-017','SEF-V410-028',
 'SEF-V411-013','SEF-V412-017','SEF-V413-010','SEF-V413-011',
 'SEF-V417-011','SEF-V419-001','SEF-V425-006'
];
assert.equal(new Set(reviewedUnexplained).size,19,'Nineteen unique exercises reviewed');
const revisedBalancingBids={
 'SEF-V4-061-2':['Contre','1♠',4],
 'SEF-V4-062-4':['Contre','1♠',4],
 'SEF-V4-062-1':['Contre','2♣',4],
 'SEF-V4-063-1':['Contre','2♦',4],
 'SEF-V4-064-2':['Contre','2♥',4],
 'SEF-V4-064-1':['Contre','2♥',4]
};
for(const id of reviewedUnexplained){
 const x=exercises.find(y=>y.id===id);
 assert.ok(x,'SEF situation still present: '+id);
 assert.ok(x.whyNot?.reason&&x.takeaway,'Reasoned incorrect answer and takeaway: '+id);
 assert.ok(x.choices.includes(x.whyNot.bid),'Explained incorrect answer must be offered: '+id);
 assert.notEqual(x.answer,x.whyNot.bid,'Do not explain the correct choice as a distractor: '+id);
 if(id in revisedBalancingBids){
  const [correct,temptation,shortLength]=revisedBalancingBids[id];
  assert.equal(x.answer,correct,'Correct balancing double is preserved: '+id);
  assert.ok(x.choices.includes(temptation)&&!x.choices.includes('2SA'),
    'Natural alternative replaces unrealistic 2NT: '+id);
  assert.equal(x.whyNot.bid,temptation,'Explain new natural alternative: '+id);
  const suit={'♠':0,'♥':1,'♦':2,'♣':3}[temptation.slice(-1)];
  assert.equal(x.shape[suit],shortLength,'Four cards, not a natural five-card balancing suit: '+id);
 }
}
// V4.42 : remplacer sept faux pièges 2SA sur des réveils très faibles
// par des annonces naturelles légales mais trop courtes et trop faibles.
const weakBalancingNatural={
 'SEF-V4-065-1':'1♦','SEF-V4-065-2':'1♦',
 'SEF-V4-066-1':'1♥',
 'SEF-V4-067-4':'1♠','SEF-V4-067-1':'1♠',
 'SEF-V4-068-2':'2♣','SEF-V4-068-3':'2♣'
};
assert.equal(Object.keys(weakBalancingNatural).length,7);
for(const [id,temptation] of Object.entries(weakBalancingNatural)){
 const x=exercises.find(y=>y.id===id);
 assert.ok(x,'Réveil très faible encore présent : '+id);
 assert.equal(x.answer,'Passe','Bonne réponse inchangée : '+id);
 assert.ok(x.h<=4,'Petite main de réveil : '+id);
 assert.ok(x.choices.includes(temptation)&&!x.choices.includes('2SA'),
   'Piège naturel à la place de 2SA : '+id);
 const suit={'♠':0,'♥':1,'♦':2,'♣':3}[temptation.slice(-1)];
 assert.equal(x.shape[suit],3,'Seulement trois cartes : '+id);
 assert.equal(x.whyNot?.bid,temptation,'Contraste sur la nouvelle annonce : '+id);
 assert.ok(x.whyNot?.reason&&x.takeaway,'Leçon explicitement justifiée : '+id);
}
// V4.43 : compte HLD après une intervention à la couleur.
const hldFit=exercises.find(x=>x.id==='SEF-V3-075-3');
assert.equal(hldFit?.h,9,'La main reste à neuf points H');
assert.deepEqual(hldFit?.shape,[1,3,5,4],'Singleton Pique, trois atouts Cœur');
assert.deepEqual(hldFit?.auction,['Partenaire : 1♥','Adversaire : 1♠'],'Séquence d’intervention');
assert.equal(hldFit?.answer,'2SA','Douze HLD imposent 2SA fitté en SEF 2024');
assert.ok(hldFit?.choices.includes('2♥'),'Le soutien insuffisant devient un piège instructif');
assert.equal(hldFit?.whyNot?.bid,'2♥','Comparaison sur la vraie ambiguïté 2M / 2SA');
assert.match(hldFit?.explain||'',/9 H.*1 L.*2 D.*12 HLD/i,'Décompte complet avec le cinquième Carreau');
assert.ok(html.includes("'SEF-V3-075-3':'sef24-hld-11-2nt-fit-after-overcall'"),
  'La tentative ancienne est archivée avant remise à travailler');
const hldWeak=exercises.find(x=>x.id==='SEF-V3-075-2');
assert.equal(hldWeak?.answer,'2♥','À six H avec un singleton le soutien simple reste correct');
const forcingRoles=exercises.filter(x=>x.theme==='forcing'&&x.auction.some(a=>/^Vous :/.test(a)));
assert.ok(forcingRoles.length>=8,'Huit séquences de forcing décrivent explicitement Sud');
assert.ok(!exercises.some(x=>x.auction.some(a=>/^Réponse :/.test(a))),
  'La rubrique forcing ne présente plus le rôle ambigu « Réponse »');
// V4.44 : régression des 17 soutiens à exactement trois atouts après intervention.
// Les points L d'une couleur secondaire cinquième comptent aussi en HLD.
const fitHldAfterOvercall={
 "SEF-V3-074-3": {
  "h": 6,
  "L": 0,
  "D": 1,
  "hld": 7,
  "answer": "2♥"
 },
 "SEF-V3-074-2": {
  "h": 9,
  "L": 0,
  "D": 1,
  "hld": 10,
  "answer": "2♥"
 },
 "SEF-V3-075-2": {
  "h": 6,
  "L": 1,
  "D": 2,
  "hld": 9,
  "answer": "2♥"
 },
 "SEF-V3-075-3": {
  "h": 9,
  "L": 1,
  "D": 2,
  "hld": 12,
  "answer": "2SA"
 },
 "SEF-V3-076-3": {
  "h": 6,
  "L": 0,
  "D": 1,
  "hld": 7,
  "answer": "2♥"
 },
 "SEF-V3-076-2": {
  "h": 9,
  "L": 0,
  "D": 1,
  "hld": 10,
  "answer": "2♥"
 },
 "SEF-V3-077-2": {
  "h": 8,
  "L": 0,
  "D": 1,
  "hld": 9,
  "answer": "2♥"
 },
 "SEF-V3-078-3": {
  "h": 7,
  "L": 0,
  "D": 1,
  "hld": 8,
  "answer": "2♠"
 },
 "SEF-V3-078-1": {
  "h": 9,
  "L": 0,
  "D": 1,
  "hld": 10,
  "answer": "2♠"
 },
 "SEF-V3-079-2": {
  "h": 6,
  "L": 0,
  "D": 1,
  "hld": 7,
  "answer": "2♠"
 },
 "SEF-V3-079-3": {
  "h": 9,
  "L": 0,
  "D": 1,
  "hld": 10,
  "answer": "2♠"
 },
 "SEF-V3-080-1": {
  "h": 7,
  "L": 0,
  "D": 1,
  "hld": 8,
  "answer": "2♠"
 },
 "SEF-V3-080-2": {
  "h": 9,
  "L": 0,
  "D": 1,
  "hld": 10,
  "answer": "2♠"
 },
 "SEF-V3-081-3": {
  "h": 11,
  "L": 1,
  "D": 2,
  "hld": 14,
  "answer": "2SA"
 },
 "SEF-V3-082-1": {
  "h": 11,
  "L": 0,
  "D": 1,
  "hld": 12,
  "answer": "2SA"
 },
 "SEF-V3-083-1": {
  "h": 11,
  "L": 0,
  "D": 1,
  "hld": 12,
  "answer": "2SA"
 },
 "SEF-V3-084-3": {
  "h": 11,
  "L": 0,
  "D": 1,
  "hld": 12,
  "answer": "2SA"
 }
};
assert.equal(Object.keys(fitHldAfterOvercall).length,17,'Dix-sept cas de soutien revus');
for(const [id,expected] of Object.entries(fitHldAfterOvercall)){
 const x=exercises.find(v=>v.id===id);
 assert.ok(x,'La question de fit existe : '+id);
 const trump=x.auction[0].slice(-1)==='♥'?1:0;
 assert.equal(x.shape[trump],3,'Exactement trois atouts : '+id);
 const L=x.shape.reduce((sum,len,i)=>sum+(i===trump?0:Math.max(0,len-4)),0);
 const D=x.shape.reduce((sum,len,i)=>sum+(i===trump?0:len===0?3:len===1?2:len===2?1:0),0);
 assert.equal(L,expected.L,'Points de longueur : '+id);
 assert.equal(D,expected.D,'Points de courte : '+id);
 assert.equal(x.h+L+D,expected.hld,'Total HLD avec fit : '+id);
 assert.equal(x.answer,expected.answer,'Bon palier de soutien : '+id);
 assert.ok(x.explain.includes(expected.hld+' HLD'),'Valeur HLD expliquée : '+id);
 assert.ok(x.takeaway&&x.takeaway.includes('points L'),'Règle à retenir explicite : '+id);
 assert.ok(x.choices.includes(x.answer),'Bonne réponse proposée : '+id);
}
for(const id of ["SEF-V3-081-3","SEF-V3-082-1","SEF-V3-083-1","SEF-V3-084-3"]){
 const x=exercises.find(z=>z.id===id);
 assert.equal(x.whyNot?.bid,'3'+x.auction[0].slice(-1),'Le piège du soutien à 3M est expliqué : '+id);
}
// V4.45 — soutien avec quatre atouts en compétition selon le SEF 2024.
const fit4Cases={
 'SEF-V419-007':{answer:'3♥',h:8,L:0,D:1,S:2,hld:11},
 'SEF-V420-011':{answer:'2♥',h:7,L:0,D:1,S:2,hld:10,bad:'3♥'},
 'SEF-V421-008':{answer:'2♠',h:7,L:0,D:1,S:2,hld:10,bad:'3♠'},
 'SEF-V425-008':{answer:'3♣',h:9,L:1,D:2,S:2,hld:14,bad:'3♠'}
};
for(const [id,expected] of Object.entries(fit4Cases)){
 const x=exercises.find(e=>e.id===id);
 assert.ok(x,'Soutien à quatre atouts présent : '+id);
 const major=x.auction[0].slice(-1),idx=major==='♥'?1:0;
 assert.equal(x.shape[idx],4,'Quatre atouts : '+id);
 const L=x.shape.reduce((sum,n,i)=>sum+(i===idx?0:Math.max(0,n-4)),0);
 const D=x.shape.reduce((sum,n,i)=>sum+(i===idx?0:n===0?3:n===1?2:n===2?1:0),0);
 const S=2;
 assert.equal(x.h,expected.h,'H conservés ou corrigés : '+id);
 assert.equal(L,expected.L,'Points de longueur : '+id);
 assert.equal(D,expected.D,'Points de courte : '+id);
 assert.equal(S,expected.S,'Neuvième atout : '+id);
 assert.equal(x.h+L+D+S,expected.hld,'Décompte HLD : '+id);
 assert.equal(x.answer,expected.answer,'Décision SEF correcte : '+id);
 assert.ok(x.explain.includes(expected.hld+' HLD'),'Corrigé chiffré : '+id);
 assert.ok(x.choices.includes(x.answer),'Quatre choix incluent la réponse : '+id);
 if(expected.bad)assert.equal(x.whyNot?.bid,expected.bad,'Alternative expliquée : '+id);
}
for(const id of ['SEF-V420-011','SEF-V421-008','SEF-V425-008']){
 assert.ok(html.includes("'"+id+"':'sef24-fit4-"),'Révision de progression non destructive : '+id);
}
const cueCase=exercises.find(x=>x.id==='SEF-V425-008');
assert.ok(cueCase?.choices.includes('3♣')&&!cueCase?.choices.includes('2♦'),
 'Le cue-bid instructif remplace une nouvelle couleur hors sujet');
// V4.46 : 25 nouveaux contrastes documentés dans les quatre familles de conventions.
const newConventionContrasts={
 "SEF-V45-023": {
  "theme": "multilandy",
  "bid": "2♥",
  "answer": "2♣"
 },
 "SEF-V45-024": {
  "theme": "multilandy",
  "bid": "2♦",
  "answer": "2♣"
 },
 "SEF-V45-026": {
  "theme": "multilandy",
  "bid": "2♥",
  "answer": "2♦"
 },
 "SEF-V45-028": {
  "theme": "multilandy",
  "bid": "2♦",
  "answer": "2♠"
 },
 "SEF-V45-031": {
  "theme": "rubensohl",
  "bid": "3♥",
  "answer": "2♠"
 },
 "SEF-V45-032": {
  "theme": "rubensohl",
  "bid": "3♣",
  "answer": "2SA"
 },
 "SEF-V45-033": {
  "theme": "rubensohl",
  "bid": "3♦",
  "answer": "3♣"
 },
 "SEF-V45-034": {
  "theme": "rubensohl",
  "bid": "3♥",
  "answer": "3♦"
 },
 "SEF-V45-035": {
  "theme": "rubensohl",
  "bid": "2♠",
  "answer": "3♥"
 },
 "SEF-V45-036": {
  "theme": "rubensohl",
  "bid": "3♥",
  "answer": "3SA"
 },
 "SEF-V45-038": {
  "theme": "rubensohl",
  "bid": "3♦",
  "answer": "2♥"
 },
 "SEF-V45-039": {
  "theme": "rubensohl",
  "bid": "3♦",
  "answer": "3♣"
 },
 "SEF-V45-041": {
  "theme": "michaels",
  "bid": "1♥",
  "answer": "2♦"
 },
 "SEF-V45-042": {
  "theme": "michaels",
  "bid": "2♥",
  "answer": "2♦"
 },
 "SEF-V45-044": {
  "theme": "michaels",
  "bid": "2♥",
  "answer": "2♠"
 },
 "SEF-V45-045": {
  "theme": "michaels",
  "bid": "1♠",
  "answer": "3♣"
 },
 "SEF-V45-046": {
  "theme": "michaels",
  "bid": "2♥",
  "answer": "3♣"
 },
 "SEF-V45-047": {
  "theme": "michaels",
  "bid": "3♦",
  "answer": "2SA"
 },
 "SEF-V45-048": {
  "theme": "michaels",
  "bid": "3♦",
  "answer": "2SA"
 },
 "SEF-V45-050": {
  "theme": "chelem",
  "bid": "5♦",
  "answer": "5♣"
 },
 "SEF-V45-054": {
  "theme": "chelem",
  "bid": "5♦",
  "answer": "5♣"
 },
 "SEF-V45-055": {
  "theme": "chelem",
  "bid": "5♣",
  "answer": "5♦"
 },
 "SEF-V45-056": {
  "theme": "chelem",
  "bid": "4♠",
  "answer": "4♣"
 },
 "SEF-V45-057": {
  "theme": "chelem",
  "bid": "4♠",
  "answer": "4♥"
 },
 "SEF-V45-058": {
  "theme": "chelem",
  "bid": "4♥",
  "answer": "3♠"
 }
};
assert.equal(Object.keys(newConventionContrasts).length,25,'Vingt-cinq situations de conventions vérifiées');
for(const [id,expected] of Object.entries(newConventionContrasts)){
 const x=exercises.find(z=>z.id===id);
 assert.ok(x,'Exercice de convention disponible : '+id);
 assert.equal(x.theme,expected.theme,'Bonne famille de convention : '+id);
 assert.equal(x.answer,expected.answer,'Bonne réponse inchangée : '+id);
 assert.equal(x.whyNot?.bid,expected.bid,'Mauvaise enchère expliquée : '+id);
 assert.ok(x.choices.includes(x.whyNot.bid),'Piège toujours proposé : '+id);
 assert.ok(x.whyNot.reason.length>45&&x.takeaway.length>35,
    'Comparaison et règle pédagogique précises : '+id);
}
// Contrôle autonome des réponses 30–41 : 4 As + le Roi de l'atout agréé.
const blackwoodKeys={
 'SEF-V45-050':{trump:0,keys:0,queen:false,answer:'5♣'},
 'SEF-V45-051':{trump:0,keys:1,queen:false,answer:'5♦'},
 'SEF-V45-052':{trump:0,keys:2,queen:false,answer:'5♥'},
 'SEF-V45-053':{trump:0,keys:2,queen:true,answer:'5♠'},
 'SEF-V45-054':{trump:0,keys:3,queen:false,answer:'5♣'},
 'SEF-V45-055':{trump:1,keys:1,queen:false,answer:'5♦'},
 'SEF-C2-009':{trump:1,keys:2,queen:false,answer:'5♥'},
 'SEF-C2-010':{trump:1,keys:2,queen:true,answer:'5♠'}
};
const _suitNames=['Pique','Cœur','Carreau','Trèfle'];
for(const [id,expected] of Object.entries(blackwoodKeys)){
 const x=exercises.find(e=>e.id===id);
 assert.ok(x,'Question Blackwood présente : '+id);
 const ases=x.hand.reduce((n,suit)=>n+Number(suit.includes('A')),0);
 const k=ases+Number(x.hand[expected.trump].includes('R'));
 assert.equal(k,expected.keys,'Quatre As plus Roi d’atout : '+id);
 assert.equal(x.hand[expected.trump].includes('D'),expected.queen,
   'Présence de la Dame d’atout : '+id);
 assert.ok(x.context.includes(_suitNames[expected.trump]),'Atout agréé explicite : '+id);
 assert.equal(x.answer,expected.answer,'Blackwood 30–41 : '+id);
}
// Comparaisons Multi-Landy, Rubensohl et Michaels : formes attendues des bicolores.
const _conventionLengths={
 'SEF-V45-023':[5,4,2,2],
 'SEF-V45-024':[4,5,2,2],
 'SEF-V45-026':[2,6,3,2],
 'SEF-V45-028':[5,2,2,4],
 'SEF-V45-031':[5,2,3,3],
 'SEF-V45-032':[2,2,3,6],
 'SEF-V45-033':[2,2,6,3],
 'SEF-V45-034':[4,2,4,3],
 'SEF-V45-035':[5,2,3,3],
 'SEF-V45-038':[3,5,2,3],
 'SEF-V45-039':[4,4,2,3],
 'SEF-V45-041':[5,5,2,1],
 'SEF-V45-042':[5,5,1,2],
 'SEF-V45-044':[1,5,2,5],
 'SEF-V45-045':[5,1,5,2],
 'SEF-V45-046':[1,5,5,2],
 'SEF-V45-047':[1,2,5,5],
 'SEF-V45-048':[2,1,5,5]
};
for(const [id,shape] of Object.entries(_conventionLengths)){
 const x=exercises.find(z=>z.id===id);
 assert.deepEqual(x?.shape,shape,'La distribution conventionnelle est conservée : '+id);
}
assert.ok(exercises.filter(x=>x.whyNot).length>=303,'All revised pedagogical comparisons preserved');
const ntReply=exercises.find(x=>x.id==='SEF-V421-004');
assert.equal(ntReply?.h,10,'Response of 1SA must not be 11 H with a major opening');
assert.ok(html.includes('revisedSefNov2026')&&html.includes('revisedSefProgress'),'Corrected SEF progress is archived without touching unrelated records');
for(const x of contrasted){
 assert.ok(x.whyNot?.bid&&x.whyNot?.reason&&x.takeaway,'Complete teaching contrast '+x.id);
 assert.ok(x.choices.includes(x.whyNot.bid),'Comparison corresponds to an offered option: '+x.id);
 assert.notEqual(x.answer,x.whyNot.bid,'Comparison is not the right answer: '+x.id);
}
const known=new Set();
const themeIds=new Set(data.themes.map(x=>x.id));
const validRanks=new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']);
const hcp={A:4,R:3,D:2,V:1};
for(const x of exercises){
 assert.ok(x.id&&!known.has(x.id),'Unique exercise ID: '+x.id);
 known.add(x.id);
 assert.ok(themeIds.has(x.theme),'Valid topic: '+x.id);
 assert.ok([1,2,3,4,5].includes(x.difficulty),'Valid level: '+x.id);
 assert.equal(x.hand.length,4,'Four suits: '+x.id);
 assert.equal(x.hand.flat().length,13,'Thirteen cards: '+x.id);
 assert.deepEqual(x.hand.map(a=>a.length),x.shape,'Correct shape: '+x.id);
 assert.equal(x.hand.flat().reduce((s,r)=>s+(hcp[r]||0),0),x.h,'Correct HCP: '+x.id);
 for(const suit of x.hand){
  assert.equal(new Set(suit).size,suit.length,'No duplicate rank in a suit: '+x.id);
  assert.ok(suit.every(r=>validRanks.has(r)),'Known cards: '+x.id);
 }
 assert.ok(Array.isArray(x.auction),'Auction is available: '+x.id);
 assert.ok(x.auction.every(c=>/^(Vous|Partenaire|Adversaire|Réponse)\s*:/.test(c)),'Auction speaker labels: '+x.id);
 assert.equal(x.choices.length,4,'Four answers: '+x.id);
 assert.equal(new Set(x.choices).size,4,'Unique answers: '+x.id);
 assert.ok(x.choices.includes(x.answer),'Correct answer is a choice: '+x.id);
 assert.ok(x.explain&&x.explain.trim(),'Explanation: '+x.id);
}
const script=html.match(/<script>\s*([\s\S]*?)<\/script><\/body>/);
assert.ok(script,'Application script is embedded');
new Function(script[1]);
for(const marker of [
 'function conventionNote(', 'function getRecord(', 'function recordAttempt(',
 'function adaptiveLevel(', 'function diverseTake(', 'function stats(',
 'function finishSession(', 'function skipCurrent(',
 'function render(', 'function choose(', 'id="selection-mode"',
 'session-navigation', 'context-note'
])assert.ok(html.includes(marker),'Expected new functionality: '+marker);
const annotated=exercises.filter(x=>x.auction.some(a=>/\([^)]*\)\s*$/.test(a)));
assert.ok(annotated.length>100,'Convention annotations are present in dataset');
console.log('Quizz integrity: PASS | '+exercises.length+' exercises, '+data.themes.length+' topics, '+annotated.length+' annotated situations');
