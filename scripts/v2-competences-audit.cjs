'use strict';
// Audit de provenance : aucune classification inférée du texte libre des QCM.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const P=require('../quizz-parcours.js');
const html=fs.readFileSync(path.resolve(__dirname,
  '../preview/v2-eleve/parcours-sef-65-r1.html'),'utf8');
const tag=html.match(/<script id="ay-payload" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(tag,'Source élève V2 non trouvée');
const data=JSON.parse(tag[1]);
const catalog=data.catalog,byId=new Map(catalog.map(x=>[x.id,x]));
assert.equal(catalog.length,1523);
assert.equal(byId.size,1523);
assert.equal(data.addons.length,0,'Aucun QCM expérimental');
const sa=data.docs['PARCOURS_V2_SA_14_PRECLASSIFICATION_20261118.json'];
const stayman=data.docs['PARCOURS_V2_STAYMAN_65_MICRO_OBJECTIFS_CANDIDATS_20261118.json'];
assert.ok(sa&&stayman,'Référentiels sources attendus');
assert.equal(sa.assignments.length,14);
assert.equal(stayman.assignments.length,65);
const proposed=new Map();
for(const [origin,list] of [['SA',sa.assignments],['STAYMAN_TEXAS',stayman.assignments]]){
 for(const entry of list){
  const q=byId.get(entry.id);
  assert.ok(q,'ID proposé absent : '+entry.id);
  assert.ok(!proposed.has(entry.id),'Double classification : '+entry.id);
  // Les deux doubles transferts ont été modifiés et explicitement
  // approuvés le 20/11 : ne pas comparer au vieux corrigé provisoire.
  if(typeof entry.originalAnswer==='string'&&q.answer!==entry.originalAnswer){
    assert.ok(data.editorialPatchIDs.includes(entry.id),
      'Correction sans approbation éditoriale : '+entry.id);
    assert.ok(['SEF-V416-008','SEF-V416-009'].includes(entry.id),
      'Décalage éditorial inédit : '+entry.id);
    assert.equal(q.answer,
      entry.id==='SEF-V416-008'?'4♣':'4♦',
      'Correction pédagogique validée non respectée : '+entry.id);
  }
  assert.ok(typeof entry.candidateSkill==='string'&&entry.candidateSkill,
    'Compétence candidate absente : '+entry.id);
  proposed.set(entry.id,{origin,competence:entry.candidateSkill});
 }
}
assert.equal(proposed.size,79);
const rows=catalog.map(q=>{
 const heuristic=P.microKey(q),candidate=proposed.get(q.id);
 assert.ok(!heuristic||typeof heuristic==='string');
 assert.ok(!(heuristic&&candidate),'Classifications candidates déjà présentes : '+q.id);
 return {id:q.id,theme:q.theme,family:q.caseFamily||q.id,
  status:candidate?'PRECLASSIFICATION_A_VALIDER':
    heuristic?'CONTEXTE_HEURISTIQUE_NON_CONTREEXPERTISE':'NON_CARTOGRAPHIE',
  competence:candidate?candidate.competence:heuristic||null,
  provenance:candidate?candidate.origin:heuristic?'V1_MICRO_KEY':null};
});
const count=status=>rows.filter(x=>x.status===status).length;
const report={
 schema:'QPJB_V2_OBSERVATOIRE_COUVERTURE_1',
 source:'V2 publiée : 1 523 questions / aucun supplément',
 baseDecisions:'19 décisions pédagogiques approuvées : distinctes de la validation des 79 étiquettes candidates',
 total:rows.length,
 themes:new Set(rows.map(x=>x.theme)).size,
 familles:new Set(rows.map(x=>x.family)).size,
 coverage:{
  contextsByDeterministicHeuristic:count('CONTEXTE_HEURISTIQUE_NON_CONTREEXPERTISE'),
  candidateClassificationsNeedingReview:count('PRECLASSIFICATION_A_VALIDER'),
  withoutFineMapping:count('NON_CARTOGRAPHIE')
 },
 pedagogicalSafeguards:{
  certifyMastery:false,manualUnlock:false,hardPrerequisites:false,
  alterQuizAnswers:false,alterSaveSchema:false
 },
 perTheme:Object.entries(rows.reduce((acc,r)=>{
  const v=acc[r.theme]||(acc[r.theme]={total:0,heuristic:0,candidate:0,unmapped:0});
  v.total++;
  v[r.status==='CONTEXTE_HEURISTIQUE_NON_CONTREEXPERTISE'?'heuristic':
    r.status==='PRECLASSIFICATION_A_VALIDER'?'candidate':'unmapped']++;
  return acc;
 },{})).map(([theme,count])=>({theme,...count}))
};
assert.equal(report.themes,22);
assert.equal(report.coverage.contextsByDeterministicHeuristic,903);
assert.equal(report.coverage.candidateClassificationsNeedingReview,79);
assert.equal(report.coverage.withoutFineMapping,541);
assert.equal(report.coverage.contextsByDeterministicHeuristic+
  report.coverage.candidateClassificationsNeedingReview+
  report.coverage.withoutFineMapping,1523);
if(require.main===module){
 console.log(JSON.stringify(report,null,2));
 console.log('QPJB V2 COMPETENCES AUDIT PASS: 903+79+541=1523, aucune maîtrise inventée');
}
module.exports={report,rows};
