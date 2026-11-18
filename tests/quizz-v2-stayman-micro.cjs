'use strict';
// QPJB Parcours V2-D — annotation candidate du pilotage Stayman/Texas, non active.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(f)=>JSON.parse(fs.readFileSync(path.join(root,'Docs',f),'utf8'));
const families=read('PARCOURS_V2_STAYMAN_65_FAMILLES_REVUE_20261118.json');
const micro=read('PARCOURS_V2_STAYMAN_65_MICRO_OBJECTIFS_CANDIDATS_20261118.json');
assert.equal(families.status,'NON_ACTIVE_DANS_LE_PARCOURS');
assert.equal(micro.status,'NON_ACTIF_DANS_LE_PARCOURS');
assert.equal(micro.skillCount,25);
assert.equal(micro.assignmentCount,65);
assert.equal(micro.skills.length,25);
assert.equal(micro.assignments.length,65);
const bySource=new Map(families.assignments.map(x=>[x.id,x]));
const skills=new Map(micro.skills.map(x=>[x.id,x]));
assert.equal(bySource.size,65);
assert.equal(skills.size,25);
const seen=new Set();
for(const s of micro.skills){
  assert.equal(s.validationStatus,'PROPOSITION_A_VALIDER_MANUELLEMENT');
  assert.equal(s.scoringEnabled,false);
  assert.equal(s.masteryDecisionEnabled,false);
  assert.ok(s.stageCandidate>=1&&s.stageCandidate<=5);
  assert.ok(s.label&&s.teachingTarget);
  assert.equal(s.ids.length,s.exerciseCount);
  assert.equal(new Set(s.ids).size,s.ids.length,'Duplicate in skill '+s.id);
  const unique=new Set();
  for(const id of s.ids){
    const x=bySource.get(id);
    assert.ok(x,'Missing original '+id);
    assert.equal(s.sourceReviewFamily,x.reviewFamily,'Source family '+id);
    unique.add(x.caseFamily);
  }
  assert.equal(s.distinctOriginalFamilies,unique.size);
  assert.equal(s.validationWarning,s.ids.length===1?'CAS_UNIQUE_NE_PROUVE_PAS_MAITRISE':null);
}
for(const a of micro.assignments){
  assert.ok(bySource.has(a.id),'Unrecognized original '+a.id);
  assert.ok(!seen.has(a.id),'Duplicate assignment '+a.id);
  seen.add(a.id);
  const original=bySource.get(a.id),skill=skills.get(a.candidateSkill);
  assert.ok(skill&&skill.ids.includes(a.id),'Wrong skill for '+a.id);
  assert.equal(a.sourceReviewFamily,original.reviewFamily);
  assert.equal(a.caseFamily,original.caseFamily);
  assert.equal(a.originalAnswer,original.originalAnswer);
  assert.equal(a.originalH,original.originalH);
  assert.deepEqual(a.originalAuction,original.originalAuction);
  assert.deepEqual(a.handLengths,{
    spades:original.originalHand[0].length,
    hearts:original.originalHand[1].length,
    diamonds:original.originalHand[2].length,
    clubs:original.originalHand[3].length
  });
  assert.equal(a.classificationStatus,'A_REVOIR_HUMAINEMENT');
}
assert.deepEqual(seen,new Set(bySource.keys()),'Exact coverage of 65 QCM');
assert.equal(micro.skills.reduce((sum,s)=>sum+s.exerciseCount,0),65);
assert.equal(micro.skills.filter(s=>s.exerciseCount===1).length,6);
assert.deepEqual(
  micro.assignments.filter(x=>x.candidateSkill==='stayman_1sa_deux_majeures_manche_directe').map(x=>x.id),
  ['SEF-V416-008','SEF-V416-009']
);
assert.deepEqual(
  micro.assignments.filter(x=>x.candidateSkill==='stayman_1sa_deux_majeures_transfert_manche').map(x=>x.id),
  ['SEF-L18-007']
);
// Cross-check against the embedded catalog, not only the intermediate review export.
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const tag='<script id="training-data" type="application/json">';
const start=html.indexOf(tag),end=html.indexOf('</script>',start+tag.length);
assert.ok(start>=0&&end>start);
const catalog=JSON.parse(html.slice(start+tag.length,end));
const originalMap=new Map(catalog.exercises.map(x=>[x.id,x]));
for(const a of micro.assignments){
  const q=originalMap.get(a.id);
  assert.ok(q&&q.theme==='stayman');
  assert.equal(q.answer,a.originalAnswer);
  assert.equal(q.h,a.originalH);
  assert.deepEqual(q.auction,a.originalAuction);
}
console.log('PARCOURS V2 MICRO OBJECTIFS PASS : 65 QCM / 25 candidats, 6 cas uniques, aucune activation');
