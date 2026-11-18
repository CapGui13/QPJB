'use strict';
/* Phase Q : preuve que les repères n'altèrent ni les séances, ni les rappels. */
const assert=require('node:assert/strict');
const Pilot=require('../scripts/parcours-v2-pilot.cjs');
const P=require('../scripts/parcours-v2-observatoire-p.cjs');
const Q=require('../scripts/parcours-v2-reperes-q.cjs');
const catalog=Pilot.loadCatalog(),ann=Pilot.loadAnnotations();
const plan=Q.load(),axes=P.load();
assert.equal(catalog.length,1523);
assert.equal(plan.groups.length,5);
assert.equal(plan.unmappedContexts.length,3);
assert.equal(plan.selectionUnaffected,true);
assert.equal(plan.publicRuntimeWired,false);
for(const profile of ['balanced','fragile-mineures']){
  const run=Pilot.simulateV2(catalog,ann,{sessions:20,seed:13,profile});
  const before=run.sessions.map(x=>x.map(q=>q.id));
  const reviews=JSON.stringify(run.state.reviewEvents);
  const r=Q.observations(run.sessions,plan,axes);
  const r2=Q.observations(run.sessions,plan,axes);
  assert.deepEqual(r,r2,'Repères déterministes');
  assert.deepEqual(run.sessions.map(x=>x.map(q=>q.id)),before,'Séances inchangées');
  assert.equal(JSON.stringify(run.state.reviewEvents),reviews,'Rappels inchangés');
  assert.equal(r.sessions,20);
  assert.equal(r.questions,200);
  assert.equal(r.windows.length,3);
  assert.equal(r.observedGroups.length,5);
  assert.equal(r.masteryInferred,false);
  assert.equal(r.unlocksEnabled,false);
  const ids=new Set(run.sessions.flat().map(x=>x.id));
  for(const group of r.observedGroups){
    const source=plan.groups.find(x=>x.id===group.groupId);
    assert.ok(source,'Groupe hors plan');
    const sourceIds=new Set(source.axes.flatMap(id=>axes.axes.find(x=>x.id===id).sourceIds));
    assert.ok(group.exposures>=0);
    assert.ok(group.independentFamiliesSeen<=group.exposures);
    assert.ok(group.sessionsSeen<=20);
    assert.equal(group.firstSession===null,group.exposures===0);
    assert.ok([...sourceIds].some(id=>ids.has(id))||group.exposures===0);
  }
  const first=r.windows[0];
  assert.equal(first.from,1);
  assert.equal(first.end,5);
  assert.equal(first.questions,50);
  assert.ok(first.openings['1♣']>0&&first.openings['1♦']>0);
  assert.ok(first.replies['1♣']>0&&first.replies['1♦']>0);
  assert.ok(first.replies['1♥']>0&&first.replies['1♠']>0);
  assert.ok(r.windows.every(w=>w.questions>0&&w.uniqueFamilies<=w.questions));
}
assert.throws(()=>Q.observations([], {...plan,unlockEngineEnabled:true}, axes));
console.log('QPJB V2 Q REPERES PASS : cinq groupes et ouvertures/réponses mineures précoces, tirages et rappels inchangés');
