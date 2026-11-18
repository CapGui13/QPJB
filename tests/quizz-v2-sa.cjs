'use strict';
// Phase V2-B : garder les propositions de compétences SA ancrées dans les QCM.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const tag='<script id="training-data" type="application/json">';
const start=html.indexOf(tag),end=html.indexOf('</script>',start+tag.length);
assert.ok(start>=0&&end>start,'Embedded Quiz catalogue');
const data=JSON.parse(html.slice(start+tag.length,end));
const P=require('../quizz-parcours.js');
const proposed=JSON.parse(fs.readFileSync(path.join(root,'Docs',
  'PARCOURS_V2_SA_14_PRECLASSIFICATION_20261118.json'),'utf8'));
assert.equal(proposed.status,'NON_ACTIVE_DANS_LE_PARCOURS');
assert.equal(proposed.totalExercices,14);
assert.equal(proposed.totalCompetencesCandidates,8);
assert.equal(proposed.skills.length,8);
assert.equal(proposed.assignments.length,14);
const byId=new Map(data.exercises.map(x=>[x.id,x]));
const missing=data.exercises.filter(x=>x.theme==='sa'&&!P.microKey(x));
assert.equal(missing.length,14);
const pendingIds=new Set(missing.map(x=>x.id));
const used=new Set(),skillMap=new Map(proposed.skills.map(x=>[x.id,x]));
assert.equal(skillMap.size,8);
for(const skill of proposed.skills){
  assert.equal(skill.status,'A_VALIDER_PEDAGOGIQUEMENT');
  assert.equal(skill.scoringEnabled,false);
  assert.ok(Array.isArray(skill.ids)&&skill.ids.length>=1);
  assert.ok(skill.label&&skill.reviewNote);
  assert.ok(Array.isArray(skill.prerequisites)&&skill.prerequisites.length);
}
for(const item of proposed.assignments){
  assert.ok(pendingIds.has(item.id),'Unclassified SA QCM expected '+item.id);
  assert.ok(!used.has(item.id),'Duplicate proposed assignment '+item.id);
  assert.equal(item.assignmentStatus,'PROPOSITION_A_VALIDER_PAR_ENSEIGNANT');
  const source=byId.get(item.id),skill=skillMap.get(item.candidateSkill);
  assert.ok(skill&&skill.ids.includes(item.id),'Skill and QCM must agree');
  assert.equal(item.theme,source.theme);
  assert.equal(item.caseFamily,source.caseFamily||source.id);
  assert.equal(item.originalAnswer,source.answer,'Do not rewrite an original answer');
  assert.deepEqual(item.originalAuction,source.auction,'Keep actual bidder roles');
  assert.equal(item.originalDifficultyReason,source.difficultyReason,
    'Original editorial source must match exactly');
  used.add(item.id);
}
assert.deepEqual(used,pendingIds,'All and only the 14 unclassified SA QCM proposed');
assert.equal(proposed.skills.reduce((n,s)=>n+s.ids.length,0),14);
assert.equal(proposed.skills.find(s=>s.id==='sa:stayman_2sa_reponses').ids.length,4);
assert.ok(proposed.skills.filter(x=>x.ids.length<4).length>=1,
  'Do not infer that each candidate skill has sufficient evidence to be mastered');
const before=P.start(P.empty(),data.exercises).map(x=>x.id).join('|');
const after=P.start(P.empty(),data.exercises).map(x=>x.id).join('|');
assert.equal(after,before,'Proposals do not alter the production engine');
console.log('PARCOURS V2 SA PILOT PASS : 14 / 14 QCM ancrés, 8 compétences candidates, zéro activation');
