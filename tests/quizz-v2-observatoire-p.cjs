'use strict';
/* QPJB P — audit qui ne modifie jamais V2-F ni les 1 523 QCM. */
const assert=require('node:assert/strict');
const Pilot=require('../scripts/parcours-v2-pilot.cjs');
const N=require('../scripts/parcours-v2-observatoire-n.cjs');
const P=require('../scripts/parcours-v2-observatoire-p.cjs');
const catalog=Pilot.loadCatalog(),ann=Pilot.loadAnnotations();
const index=N.loadIndex(catalog),overlay=P.load();
assert.equal(catalog.length,1523);
assert.equal(overlay.axes.length,16);
assert.equal(overlay.uniqueCatalogQcm,122);
assert.equal(overlay.proposedAssociations,134);
assert.equal(overlay.publicRuntimeWired,false);
const original=new Map(catalog.map(x=>[x.id,x]));
assert.equal(original.size,1523);
for(const f of overlay.axes)for(const id of f.sourceIds){
  assert.ok(original.has(id),'ID QCM étranger au catalogue: '+id);
}
for(const profile of ['balanced','fragile-mineures']){
  const simulated=Pilot.simulateV2(catalog,ann,{sessions:20,seed:13,profile});
  const snapshot=simulated.sessions.map(d=>d.map(q=>q.id));
  const reviews=JSON.stringify(simulated.state.reviewEvents);
  const a=P.readOnlyAudit(simulated.sessions,simulated.state,catalog,index,overlay);
  const b=P.readOnlyAudit(simulated.sessions,simulated.state,catalog,index,overlay);
  assert.deepEqual(a,b,'L audit doit être reproductible');
  assert.deepEqual(simulated.sessions.map(d=>d.map(q=>q.id)),snapshot,
    'Les tirages V2-F ne doivent pas changer');
  assert.equal(JSON.stringify(simulated.state.reviewEvents),reviews,
    'Les rappels ne doivent pas changer');
  assert.equal(a.candidateAxesTotal,16);
  assert.equal(a.questions,200);
  assert.equal(a.originalScheduledRecalls,simulated.metrics.revision.scheduledDueRecalls);
  assert.equal(a.originalUniqueFamilies,simulated.metrics.uniqueFamilies);
  assert.equal(a.masteryInferred,false);
  assert.equal(a.unlocksEnabled,false);
  assert.equal(a.axes.length,16);
  const old=a.axes.find(x=>x.id==='fondation:intervention');
  const counter=a.axes.find(x=>x.id==='fondation:reponse_contre_adverse');
  assert.ok(old&&counter);
  assert.equal(old.label,'Choisir son intervention sur l’ouverture adverse');
  assert.equal(old.catalogIds,13);
  assert.equal(counter.catalogIds,12);
  assert.equal(counter.catalogFamilies,12);
  for(const f of a.axes){
    assert.equal(f.mastered,false);
    assert.equal(f.reviewNeeded,true);
    assert.ok(f.seenDifferentFamilies<=f.seenDifferentQcm);
    assert.ok(f.seenDifferentQcm<=f.catalogIds);
    assert.ok(f.presentations>=f.seenDifferentQcm);
  }
}
assert.throws(()=>P.readOnlyAudit([],{},catalog,index,{
  ...overlay,masteryInferenceEnabled:true
}));
console.log('QPJB V2 P OBSERVATOIRE PASS : 16 axes, 122 QCM, même V2-F et mêmes rappels, aucune maîtrise ou activation');
