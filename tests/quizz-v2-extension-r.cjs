'use strict';
/* QPJB V2-R : vérification des 41 QCM source et aucune mutation de V2-F. */
const assert=require('node:assert/strict');
const Pilot=require('../scripts/parcours-v2-pilot.cjs');
const P=require('../scripts/parcours-v2-observatoire-p.cjs');
const R=require('../scripts/parcours-v2-observatoire-r.cjs');
const catalog=Pilot.loadCatalog(),annotations=Pilot.loadAnnotations();
const byId=new Map(catalog.map(q=>[q.id,q]));
const p=P.load(),r=R.load();
assert.equal(catalog.length,1523);assert.equal(byId.size,1523);
assert.equal(p.axes.length,16);
assert.equal(r.originalAxes,16);
assert.equal(r.additionalAxes,5);
assert.equal(r.totalCandidateAxes,21);
assert.equal(r.additionalSourceAssociations,41);
assert.equal(r.newUniqueQcm,41);
assert.equal(r.previousOriginalQcm,122);
assert.equal(r.totalUniqueQcm,163);
assert.equal(r.noQuizModification,true);
assert.equal(r.publicRuntimeWired,false);
assert.equal(r.masteryInferenceEnabled,false);
assert.equal(r.unlockEngineEnabled,false);
assert.equal(r.gradingEnabled,false);
const ids=new Set(p.axes.flatMap(g=>g.sourceIds));
assert.equal(ids.size,122);
const extra=new Set();
const expectedRoles=['ouv:1♣','ouv:1♦','rep:1♣','rep:1♦',
  'special:1SA-stayman-texas-double'];
assert.deepEqual(r.extraAxes.map(g=>g.role),expectedRoles);
for(const group of r.extraAxes){
  assert.equal(group.enforceUnlock,false);
  assert.equal(group.masteryThreshold,null);
  assert.equal(group.requiresTeacherReview,true);
  assert.equal(group.sourceQcmCount,group.source.length);
  const fams=new Set();
  for(const x of group.source){
    const q=byId.get(x.id);
    assert.ok(q,'QCM original absent '+x.id);
    assert.equal(q.theme,x.theme);
    assert.equal(q.answer,x.answer);
    assert.equal(q.caseFamily||q.id,x.family);
    assert.equal(q.difficulty,x.difficulty);
    assert.equal(q.difficultyReason,x.editorialReason);
    assert.deepEqual(q.auction||[],x.auction);
    assert.ok(!extra.has(x.id),'QCM doublé dans R');
    assert.ok(!ids.has(x.id),'QCM déjà dans P');
    extra.add(x.id);fams.add(x.family);
    if(group.role.startsWith('ouv:')||group.role.startsWith('rep:'))
      assert.equal(Pilot.roleOpening(q),group.role);
    else{
      assert.equal(q.theme,'stayman');
      assert.ok(q.auction.some(x=>/Adversaire : Contre \(d'entame/.test(x)));
      assert.ok(q.auction.some(x=>x.startsWith('Partenaire : 2♣')||x.startsWith('Partenaire : 2♦')));
    }
  }
  assert.equal(fams.size,group.sourceFamilyCount);
}
assert.equal(extra.size,41);
assert.equal(new Set([...ids,...extra]).size,163);
for(const profile of ['balanced','fragile-mineures']){
  const run=Pilot.simulateV2(catalog,annotations,{sessions:20,seed:13,profile});
  const snapshot=run.sessions.map(deck=>deck.map(q=>q.id));
  const beforeReview=JSON.stringify(run.state.reviewEvents);
  const observed=R.audit(run.sessions,run.state,catalog,annotations,r);
  const replay=R.audit(run.sessions,run.state,catalog,annotations,r);
  assert.deepEqual(observed,replay,'Observatoire déterministe');
  assert.equal(observed.candidateAxes,21);
  assert.equal(observed.sessions,20);
  assert.equal(observed.questions,200);
  assert.equal(observed.additionalAxes.length,5);
  assert.equal(observed.windows.length,3);
  assert.equal(observed.baselineFamilies,run.metrics.uniqueFamilies);
  assert.equal(observed.baselineRecalls,run.metrics.revision.scheduledDueRecalls);
  assert.equal(observed.masteryInferred,false);
  assert.equal(observed.unlocksEnabled,false);
  assert.deepEqual(run.sessions.map(deck=>deck.map(q=>q.id)),snapshot,'V2-F ne doit pas changer');
  assert.equal(JSON.stringify(run.state.reviewEvents),beforeReview,'Rappels intacts');
  const first=observed.windows[0].fullCatalogRoles;
  for(const x of ['ouv:1♣','ouv:1♦','rep:1♣','rep:1♦'])assert.ok(first[x]>0,'Rôle absent '+x);
  for(const axis of observed.additionalAxes){
    assert.equal(axis.mastered,false);
    assert.ok(axis.seenDifferentFamilies<=axis.seenDifferentIds);
    assert.ok(axis.seenDifferentIds<=axis.catalogQcm);
    assert.ok(axis.seenPresentations>=axis.seenDifferentIds);
  }
}
assert.throws(()=>R.audit([],{},catalog,annotations,{...r,unlockEngineEnabled:true}));
console.log('QPJB V2 R PASS : 21 axes candidats, 163 QCM distincts, 41 sources originales, ouvertures et réponses mineures précoces, aucun tirage modifié');
