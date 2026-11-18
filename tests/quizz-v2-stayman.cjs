'use strict';
// QPJB V2-C : contrôler le regroupement documentaire des 65 QCM Stayman/Texas.
// Ne valide ni les réponses, ni une micro-compétence active.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const tag='<script id="training-data" type="application/json">';
const start=html.indexOf(tag),end=html.indexOf('</script>',start+tag.length);
assert.ok(start>=0&&end>start,'Catalogue Quiz SEF présent');
const catalog=JSON.parse(html.slice(start+tag.length,end)).exercises;
const P=require('../quizz-parcours.js');
const proposals=JSON.parse(fs.readFileSync(path.join(root,'Docs','PARCOURS_V2_STAYMAN_65_FAMILLES_REVUE_20261118.json'),'utf8'));
assert.equal(proposals.status,'NON_ACTIVE_DANS_LE_PARCOURS');
assert.equal(proposals.classificationLevel,'FAMILLE_DE_REVUE_AFFINEMENT_REQUIS');
assert.equal(proposals.totalExercices,65);
assert.equal(proposals.totalFamilles,8);
assert.equal(proposals.assignments.length,65);
assert.equal(proposals.families.length,8);
const source=catalog.filter(x=>x.theme==='stayman'&&!P.microKey(x));
assert.equal(source.length,65,'Les 65 QCM sans microKey attendus');
const byId=new Map(source.map(x=>[x.id,x]));
const familyCounts=new Map(proposals.families.map(x=>[x.id,0]));
assert.equal(familyCounts.size,8);
const seen=new Set();
for(const a of proposals.assignments){
  assert.ok(byId.has(a.id),'QCM source existant et sans micro-clé '+a.id);
  assert.ok(!seen.has(a.id),'ID répété '+a.id);
  seen.add(a.id);
  assert.ok(familyCounts.has(a.reviewFamily),'Famille inconnue '+a.id);
  familyCounts.set(a.reviewFamily,familyCounts.get(a.reviewFamily)+1);
  assert.equal(a.reviewStatus,'FAMILLE_DE_REVUE_A_AFFINER');
  const q=byId.get(a.id);
  assert.equal(a.theme,q.theme);
  assert.equal(a.caseFamily,q.caseFamily||q.id);
  assert.deepEqual(a.originalAuction,q.auction);
  assert.deepEqual(a.originalHand,q.hand);
  assert.equal(a.originalH,q.h);
  assert.deepEqual(a.originalShape,q.shape);
  assert.equal(a.originalContext,q.context);
  assert.deepEqual(a.originalChoices,q.choices);
  assert.equal(a.originalAnswer,q.answer);
  assert.equal(a.originalExplain,q.explain);
  assert.equal(a.originalDifficultyReason,q.difficultyReason);
  assert.equal(a.originalEditorialSource,q.editorialSource||null);
}
assert.deepEqual(seen,new Set(byId.keys()),'Couverture exacte des 65 QCM');
const expected={
  stayman_1sa_repondant:18,stayman_1sa_ouvreur:11,
  texas_majeur_1sa_repondant:12,stayman_2sa_repondant:6,
  texas_majeur_2sa_repondant:4,texas_mineur_1sa_repondant:8,
  stayman_1sa_contre:3,texas_majeur_1sa_contre:3
};
for(const f of proposals.families){
  assert.equal(f.reviewStatus,'A_DECUPER_EN_MICRO_COMPETENCES');
  assert.equal(f.count,familyCounts.get(f.id),'Décompte famille '+f.id);
  assert.equal(f.count,expected[f.id],'Décompte attendu '+f.id);
}
assert.equal([...familyCounts.values()].reduce((a,b)=>a+b,0),65);
console.log('PARCOURS V2 STAYMAN PILOTE PASS : 65/65 sources ancrées, 8 familles de revue, aucune activation');
