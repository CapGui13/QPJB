'use strict';
/* QPJB V2-Q : vérifie un plan de progression éditorial sans activation,
 * ainsi que deux risques de taxonomie conventionnelle déjà présents dans J.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const doc=name=>JSON.parse(fs.readFileSync(path.join(ROOT,'Docs',name),'utf8'));
const P=doc('PARCOURS_V2_PHASE_P_AXES_SEMANTIQUES_20261118.json');
const Q=doc('PARCOURS_V2_PHASE_Q_PROGRESSION_CANDIDATE_20261118.json');
const J=doc('PARCOURS_V2_PREREQUIS_CANDIDATS_20261118.json');
assert.equal(Q.schema,'QPJB_V2_Q_PARCOURS_CONCEPTUEL_NON_ACTIF_20261118_1');
assert.equal(Q.status,'PROPOSITION_EDITORIALE_NON_ACTIVE');
assert.equal(Q.axesCount,16);
assert.equal(Q.groupsCount,5);
assert.equal(Q.conceptualEdgesCount,15);
assert.equal(Q.selectionUnaffected,true);
assert.equal(Q.publicRuntimeWired,false);
assert.equal(Q.unlockEngineEnabled,false);
assert.equal(Q.masteryInferenceEnabled,false);
assert.equal(Q.exposureIsNotMastery,true);
assert.equal(Q.groupOrderNotEnforced,true);
assert.equal(Q.teacherReviewRequired,true);
const known=new Set(P.axes.map(x=>x.id));
assert.equal(known.size,16);
const assignments=Q.groups.flatMap(x=>x.axes);
assert.equal(assignments.length,16,'Chaque axe appartient à un groupe');
assert.equal(new Set(assignments).size,16,'Un axe dans deux groupes');
assert.deepEqual(new Set(assignments),known);
const neighbours=new Map([...known].map(x=>[x,[]]));
const seen=new Set();
for(const e of Q.edges){
  assert.ok(known.has(e.from)&&known.has(e.to),'Fondation inconnue');
  assert.notEqual(e.from,e.to);
  assert.equal(e.kind,'LIEN_CONCEPTUEL_POUR_REVUE');
  assert.equal(e.teacherReviewRequired,true);
  assert.equal(e.isHardPrerequisite,false);
  assert.equal(e.preventsPresentation,false);
  assert.equal(e.proofOfMastery,false);
  const key=e.from+'>'+e.to;
  assert.ok(!seen.has(key),'Lien dupliqué '+key);
  seen.add(key);
  neighbours.get(e.from).push(e.to);
}
assert.equal(seen.size,15);
const visiting=new Set(),visited=new Set();
function visit(k){
  if(visiting.has(k))throw Error('Cycle de progression '+k);
  if(visited.has(k))return;
  visiting.add(k);
  for(const to of neighbours.get(k))visit(to);
  visiting.delete(k);visited.add(k);
}
for(const id of known)visit(id);
assert.ok(!Q.edges.some(e=>e.from==='fondation:intervention'&&e.to==='fondation:reponse_contre_adverse'),
  'Intervenir soi-même ne doit pas devenir un prérequis sur un Contre adverse');
assert.ok(!Q.edges.some(e=>e.from==='fondation:reponse_contre_adverse'&&e.to==='fondation:intervention'),
  'Les deux rôles ne doivent pas être implicitement inversés');
assert.equal(Q.unmappedContexts.length,3);
assert.ok(Q.unmappedContexts.every(x=>x.needsCatalogReview===true));
assert.ok(Q.unmappedContexts.some(x=>x.id==='ouvertures_mineures'));
assert.ok(Q.unmappedContexts.some(x=>x.id==='reponses_aux_mineures'));
assert.ok(Q.unmappedContexts.some(x=>x.id==='contre_sur_enchere_conventionnelle'));
assert.equal(J.candidateSkills.length,33);
assert.equal(Q.specializedCounterSkillWarnings.length,2);
const html=fs.readFileSync(path.join(ROOT,'quizz.html'),'utf8');
const tag='<script id="training-data" type="application/json">';
const a=html.indexOf(tag),b=html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a);
const exercises=JSON.parse(html.slice(a+tag.length,b)).exercises;
const byId=new Map(exercises.map(x=>[x.id,x]));
assert.equal(exercises.length,1523);
const expected=new Set([
  'stayman:stayman_1sa_contre_choisir_reponse',
  'stayman:texas_majeur_1sa_contre_choisir_reponse'
]);
assert.deepEqual(new Set(Q.specializedCounterSkillWarnings.map(x=>x.id)),expected);
for(const warning of Q.specializedCounterSkillWarnings){
  const skill=J.candidateSkills.find(x=>x.id===warning.id);
  assert.ok(skill,'Micro-objectif J non trouvé');
  assert.equal(warning.oldFoundationId,'fondation:intervention');
  assert.equal(warning.autoRetarget,false);
  assert.deepEqual(warning.sourceIds,skill.sourceExerciseIds);
  assert.ok(skill.foundationCandidates.includes('fondation:intervention'));
  assert.equal(warning.sourceIds.length,3);
  for(const id of warning.sourceIds){
    const q=byId.get(id);
    assert.ok(q,'Source du cas contré non trouvée '+id);
    assert.equal(q.theme,'stayman');
    assert.ok(q.auction.some(x=>x.includes('Adversaire : Contre (d\'entame')),
      'Cas de contre d entame non trouvé '+id);
    assert.ok(q.auction.some(x=>x.startsWith('Partenaire : 2♣')||x.startsWith('Partenaire : 2♦')));
    assert.ok(q.auction.some(x=>x.startsWith('Vous : 1SA')));
  }
}
assert.ok(P.axes.find(x=>x.id==='fondation:reponse_contre_adverse').sourceIds.every(
  id=>byId.get(id)?.theme==='apres_inter'));
console.log('QPJB V2 Q PASS : 16 axes, 5 groupes, 15 relations sans verrou ni cycle, 2 micro-objectifs de conventions contrées isolés');
