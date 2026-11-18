'use strict';
/* Garanties de non-régression du banc de comparaison V2-L. */
const assert=require('node:assert/strict');
const P=require('../scripts/parcours-v2-pilot.cjs');
const M=require('../scripts/parcours-v2-mix-l.cjs');
const F=require('../scripts/parcours-v2-fondations.cjs');
const data=F.load(),ext=M.loadExpansion();
const original=P.loadCatalog(),annotations=P.loadAnnotations();
const byId=new Map(original.map(q=>[q.id,q]));
assert.equal(original.length,1523);
assert.equal(byId.size,1523);
assert.equal(data.foundations.length,15);
assert.equal(ext.foundationGroups,11);
assert.equal(ext.additionalAssociations,72);
assert.equal(ext.uniqueNewIds,67);
assert.equal(ext.uniqueCumulativeIds,110);
assert.equal(ext.unlockEngineEnabled,false);
assert.equal(ext.gradingEnabled,false);
assert.equal(ext.masteryInferenceEnabled,false);
const L=M.combinedFoundations(data,ext);
const extraIds=new Set(),allIds=new Set();let links=0;
for(const f of L){
  const inner=new Set();
  for(const e of f.evidence){
    const q=byId.get(e.id);
    assert.ok(q,'QCM inconnu '+e.id);
    assert.equal(q.theme,e.theme,'Rubrique modifiée '+e.id);
    assert.equal(q.answer,e.originalAnswer,'Réponse modifiée '+e.id);
    assert.equal(String(q.caseFamily||q.id),e.caseFamily,'Famille modifiée '+e.id);
    assert.equal(q.difficultyReason,e.editorialReason,'Justification modifiée '+e.id);
    assert.ok(!inner.has(e.id),'Double ID dans une fondation '+f.id);
    inner.add(e.id);allIds.add(e.id);links++;
  }
}
for(const g of ext.groups)for(const e of g.evidence)extraIds.add(e.id);
assert.equal(extraIds.size,67);
assert.equal(allIds.size,110);
assert.equal(links,122);
for(const profile of ['balanced','fragile-mineures']){
  const options={sessions:25,seed:13,profile};
  const baseline=P.simulateV2(original,annotations,options);
  const experimental=M.simulateBlend(original,annotations,options);
  assert.equal(experimental.metrics.sessionCount,25);
  assert.equal(experimental.metrics.questionCount,250);
  assert.equal(experimental.metrics.repeatedFamilySessions,0);
  assert.ok(experimental.blend.injections.length>0,'Aucun mélange de fondations');
  assert.deepEqual(experimental.sessions[0].map(q=>q.id),
    baseline.sessions[0].map(q=>q.id),'Ne pas modifier la première séance');
  const bySession=new Map(experimental.blend.injections.map(x=>[x.session,x]));
  assert.equal(bySession.size,experimental.blend.injections.length,
    'Plus d une substitution par séance');
  for(const x of experimental.blend.injections){
    assert.ok(x.session>=2);
    assert.ok(x.replacedSlot>=6&&x.replacedSlot<=9);
    assert.ok(data.foundations.find(f=>f.id===x.foundation)?.coverageStatus==='CANDIDATE',
      'Fondation insuffisante, indirecte ou non arbitrée injectée');
    assert.ok(byId.has(x.id)&&byId.has(x.replacedId));
  }
  for(let s=0;s<25;s++){
    const deck=experimental.sessions[s];
    assert.equal(deck.length,10);
    assert.equal(new Set(deck.map(q=>q.id)).size,10);
    assert.equal(new Set(deck.map(P.family)).size,10);
    for(const x of deck)assert.ok(byId.has(x.id));
  }
  const windows=M.windowMetrics(experimental.sessions);
  assert.equal(windows.windows.length,5);
  assert.ok(windows.windows.every(w=>w.presentations===50));
  assert.ok(windows.perSession.every(w=>w.differentFamilies===10));
  for(const history of Object.values(experimental.state.concepts))
    assert.ok(!('mastered' in history),'La simulation ne doit valider aucune maîtrise');
}
console.log('QPJB V2 L PASS : 110 QCM, 122 liens candidats, 25 séances × 2 profils, un mélange/ séance maximum, révisions intactes, aucun déploiement');
