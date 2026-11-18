'use strict';
// V2-E: uniquement un rapprochement documentaire, sans prérequis actifs.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../Docs');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const sa=read('PARCOURS_V2_SA_14_PRECLASSIFICATION_20261118.json');
const st=read('PARCOURS_V2_STAYMAN_65_MICRO_OBJECTIFS_CANDIDATS_20261118.json');
const x=read('PARCOURS_V2_SA_STAYMAN_CORRESPONDANCES_79_20261118.json');
assert.equal(x.status,'NON_ACTIF_DANS_LE_PARCOURS');
assert.equal(x.scoringEnabled,false);
assert.equal(x.prerequisiteBlockingEnabled,false);
assert.equal(x.validationStatus,'A_VALIDER_PAR_ENSEIGNANT');
assert.equal(x.totals.saExercises,14);
assert.equal(x.totals.staymanExercises,65);
assert.equal(x.totals.uniqueExercises,79);
assert.equal(x.totals.saSkills,8);
assert.equal(x.totals.staymanSkills,25);
assert.equal(x.totals.reviewLinks,9);
assert.equal(x.links.length,9);
assert.equal(sa.assignments.length,14);
assert.equal(st.assignments.length,65);
const saIds=new Set(sa.assignments.map(v=>v.id));
const stIds=new Set(st.assignments.map(v=>v.id));
assert.equal(saIds.size,14);
assert.equal(stIds.size,65);
for(const id of saIds)assert.ok(!stIds.has(id),'No overlapping QCM IDs');
const saKeys=new Set(sa.skills.map(v=>v.id)),stKeys=new Set(st.skills.map(v=>v.id));
const linkKeys=new Set();
for(const link of x.links){
  assert.ok(saKeys.has(link.fromSA),'Known SA skill '+link.fromSA);
  assert.ok(stKeys.has(link.toStayman),'Known Stayman skill '+link.toStayman);
  assert.ok(['COMPLEMENT_DE_ROLE','COMPLEMENT_DE_ROLE_CONDITIONNEL','SUITE_DE_SEQUENCE'].includes(link.relation));
  assert.equal(link.activationStatus,'NON_ACTIVE');
  assert.equal(link.semanticValidation,'A_REVOIR_PAR_ENSEIGNANT');
  assert.ok(link.reviewNote);
  const key=link.fromSA+'|'+link.toStayman;
  assert.ok(!linkKeys.has(key),'No duplicate crosswalk links');
  linkKeys.add(key);
}
assert.deepEqual(
  new Set(x.saSkillsWithoutCorrespondingStaymanQcm.map(v=>v.saSkill)),
  new Set([...saKeys].filter(id=>!x.links.some(link=>link.fromSA===id)))
);
console.log('PARCOURS V2 CROSSWALK PASS : 79 IDs, 9 liens non actifs entre 8+25 compétences candidates');
