'use strict';
// Contrôle strict des métadonnées de prérequis candidats, sans déblocage V2.
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const root=path.resolve(__dirname,'../Docs');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const g=read('PARCOURS_V2_PREREQUIS_CANDIDATS_20261118.json');
const sa=read('PARCOURS_V2_SA_14_PRECLASSIFICATION_20261118.json');
const st=read('PARCOURS_V2_STAYMAN_65_MICRO_OBJECTIFS_CANDIDATS_20261118.json');
assert.equal(g.status,'REVUE_PAPIER_NON_ACTIVE');
assert.equal(g.unlockEngineEnabled,false);
assert.equal(g.gradingEnabled,false);
assert.equal(g.candidateSkillCount,33);
assert.equal(g.sourceQcmCount,79);
assert.equal(g.foundationCount,15);
assert.equal(g.suggestedCandidateEdges,23);
assert.equal(g.foundations.length,15);
assert.equal(g.candidateSkills.length,33);
assert.equal(g.edges.length,23);
const keys=new Set(g.candidateSkills.map(x=>x.id));
const foundations=new Set(g.foundations.map(x=>x.id));
assert.equal(keys.size,33);
assert.equal(foundations.size,15);
const sourceIds=new Set([...sa.assignments,...st.assignments].map(x=>x.id));
assert.equal(sourceIds.size,79);
const candidateSources=new Set();
for(const s of g.candidateSkills){
  assert.equal(s.status,'NON_ACTIF_A_VALIDER');
  assert.equal(s.enforceUnlock,false);
  assert.equal(s.masteryThreshold,null);
  assert.ok(s.foundationCandidates.length>0);
  assert.ok(s.sourceExerciseIds.length>0);
  assert.ok(s.distinctSourceFamilies>=1);
  assert.ok(s.sourceExerciseIds.length>=s.distinctSourceFamilies);
  assert.equal(s.exercises,s.sourceExerciseIds.length);
  for(const a of s.foundationCandidates)assert.ok(foundations.has(a),'Fondation inconnue '+a);
  for(const a of s.recommendedPriorCandidateSkills)assert.ok(keys.has(a),'Candidate inconnu '+a);
  for(const id of s.sourceExerciseIds){
    assert.ok(sourceIds.has(id),'Question absente '+id);
    assert.ok(!candidateSources.has(id),'Question utilisée deux fois '+id);
    candidateSources.add(id);
  }
}
assert.deepEqual(candidateSources,sourceIds);
for(const f of g.foundations){
  assert.equal(f.status,'NON_CARTOGRAPHIEE_EN_ID_QCM');
  assert.equal(f.mandatoryForActivation,false);
}
const linked=[];
const links=new Set(),adj=new Map(g.candidateSkills.map(x=>[x.id,[]]));
for(const e of g.edges){
  assert.ok(keys.has(e.from)&&keys.has(e.to));
  assert.equal(e.relation,'APPRENDRE_AVANT_SUGGERE');
  assert.equal(e.enforcement,'AUCUN');
  assert.equal(e.reviewStatus,'A_VALIDER');
  assert.notEqual(e.from,e.to);
  const k=e.from+'|'+e.to;
  assert.ok(!links.has(k),'Lien dupliqué');
  links.add(k);
  adj.get(e.from).push(e.to);
}
for(const s of g.candidateSkills)
  for(const from of s.recommendedPriorCandidateSkills)
    assert.ok(links.has(from+'|'+s.id),'Lien liste absent des arcs');
const colors=new Map();
function dfs(key){
  if(colors.get(key)===1)throw Error('Dépendance cyclique autour de '+key);
  if(colors.get(key)===2)return;
  colors.set(key,1);
  for(const child of adj.get(key))dfs(child);
  colors.set(key,2);
}
for(const k of keys)dfs(k);
assert.equal(g.candidateSkills.filter(s=>s.distinctSourceFamilies===1).length,10);
console.log('QPJB V2 PREREQUIS PASS : 33 propositions, 79 QCM uniques, 15 fondations non cartographiées, 23 liens, DAG sans cycle, aucun verrou ni acquis');
