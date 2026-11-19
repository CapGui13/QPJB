'use strict';
// QPJB AV — validation structurelle des cinq situations relues dans les originaux.
// Les PDF ne sont pas dans ce dépôt. Le contrôle des SHA-256 des PDF originaux
// a eu lieu séparément lors de leur lecture ; ce test ne prétend PAS les relire.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=JSON.parse(read('Docs/PARCOURS_V2_PHASE_AV_ORIGINAUX_OUVERTURES_20261119.json'));
const training=vm.runInNewContext(read('entrainement/training-data-bootstrap.js')+'\n;\n'+
 read('entrainement/training-data-bidding.js')+'\n;D.bidding',
 {console:{log(){}}},{timeout:30000});
const quizHtml=read('quizz.html'),tag='<script id="training-data" type="application/json">';
const start=quizHtml.indexOf(tag),stop=quizHtml.indexOf('</script>',start+tag.length);
assert.ok(start>=0&&stop>start,'Quiz SEF introuvable');
const quiz=JSON.parse(quizHtml.slice(start+tag.length,stop)).exercises;
const openings=quiz.filter(q=>q.theme==='ouv');
assert.equal(quiz.length,1523);
assert.equal(openings.length,84);
assert.equal(training.length,638);
assert.equal(manifest.cases.length,5);
assert.equal(manifest.releaseDecision,'HOLD');
assert.equal(manifest.changesToQcm,0);
assert.equal(manifest.allTeacherApproved,false);
const faces=['A','R','D','V','10','9','8','7','6','5','4','3','2'];
const hValues={A:4,R:3,D:2,V:1};
function normalized(hand){
 assert.ok(Array.isArray(hand)&&hand.length===4,'Main non structurée');
 const cards=hand.map(s=>Array.isArray(s)?s.slice():String(s).trim().split(/\s+/).filter(Boolean));
 for(const row of cards){
  assert.equal(new Set(row).size,row.length,'Carte répétée dans une couleur');
  assert.ok(row.every(c=>faces.includes(c)),'Rang de carte invalide');
 }
 assert.equal(cards.flat().length,13,'Main non complète');
 return {key:cards.map(row=>row.slice().sort((a,b)=>faces.indexOf(a)-faces.indexOf(b)).join('.')).join('|'),
  h:cards.flat().reduce((n,v)=>n+(hValues[v]||0),0),
  shape:cards.map(row=>row.length)};
}
const seen=new Set();
const out=[];
for(const c of manifest.cases){
 assert.ok(!seen.has(c.id),'ID source en double');seen.add(c.id);
 assert.ok(/^BH-\d{3}-S\d{2}-\d{2}$/.test(c.id),'Référence inventaire erronée');
 assert.equal(c.teacherApproval,'PENDING');
 assert.ok(/^[a-f0-9]{64}$/.test(c.shaSujet)&&/^[a-f0-9]{64}$/.test(c.shaCorrige));
 const hand=normalized(c.subjectHand);
 if(Number.isInteger(c.sourceH))assert.equal(hand.h,c.sourceH,'Points H de la source '+c.id);
 const divergent=c.status==='QUARANTAINE_DIFFERENCE_SUJET_CORRIGE';
 if(divergent){
  assert.ok(c.solutionHand&&c.sourceConflict,'Divergence documentaire non signalée');
  assert.notEqual(normalized(c.solutionHand).key,hand.key,'Pas de divergence réelle');
 }else{
  assert.equal(c.status,'CANDIDAT_FORT_A_VALIDER');
  assert.equal(c.sourceConflict,null);
 }
 const eq=(q)=>{try{return normalized(q.hand).key===hand.key}catch(_){return false}};
 const sameOpening=openings.filter(eq),sameTraining=training.filter(eq);
 const themeKey=String(c.id).slice(0,6);
 const relatedSources=training.filter(q=>
   String(q.sourceRef||'').includes(themeKey)||
   String(q.points||'').includes(themeKey));
 out.push({id:c.id,answer:c.printedAnswer,h:hand.h,shape:hand.shape,
  status:c.status,pdfSubjectVerifiedSeparately:true,
  sameOpeningByCards:sameOpening.map(q=>q.id),
  sameTrainingByCards:sameTraining.map(q=>q.id),
  alreadyRelatedSourceEntries:relatedSources.map(q=>({id:q.id,theme:q.theme,sourceRef:q.sourceRef})),
  namedSkill:c.novelPedagogicalSkill,
  pedagogicalUniqueness:'REQUIRES_HUMAN_REVIEW'});
}
const result={schema:'QPJB_V2_AV_CORPUS_COMPARE_1',
  sourceCatalog:{quiz:quiz.length,openings:openings.length,training:training.length},
  fiveOriginalCases:out,
  noExactMatchSef:out.filter(q=>q.sameOpeningByCards.length===0).length,
  noExactMatchTraining:out.filter(q=>q.sameTrainingByCards.length===0).length,
  approvedForPublication:0,mutations:0};
console.log('QPJB-AV-RESULT '+JSON.stringify(result));
console.log('QPJB-AV-COMPARE PASS — 5 sources contrôlées, aucune modification');
