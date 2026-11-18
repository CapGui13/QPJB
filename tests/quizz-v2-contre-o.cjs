'use strict';
/* QPJB O — les comparaisons doivent être descriptives seulement. */
const assert=require('node:assert/strict');
const P=require('../scripts/parcours-v2-pilot.cjs');
const O=require('../scripts/parcours-v2-contre-o.cjs');
const x=O.load();
assert.equal(x.existingEvidenceCount,13);
assert.equal(x.sourceCandidates.length,12);
assert.equal(x.noMasteryInference,true);
assert.equal(x.unlocksEnabled,false);
const q=P.loadCatalog(),a=P.loadAnnotations();
const byId=new Map(q.map(z=>[z.id,z]));
assert.equal(byId.size,1523);
const originalIds=x.proposedSplit[0].originalEvidenceIds;
assert.ok(originalIds.every(id=>byId.get(id)?.theme==='intervenir'));
for(const candidate of x.sourceCandidates) {
  const original=byId.get(candidate.id);
  assert.ok(original);
  assert.equal(original.theme,'apres_inter');
  assert.deepEqual(original.auction,candidate.auction);
  assert.ok(original.auction.some(t=>/^Adversaire\s*:\s*Contre/i.test(t)));
}
for(const profile of ['balanced','fragile-mineures']){
  const r=O.analyze(q,a,{sessions:12,seed:13,profile});
  assert.equal(r.schema,'QPJB_V2_O_EXPOSITION_CONTRE_20261118_1');
  assert.equal(r.sessions,12);
  assert.equal(r.questions,120);
  assert.equal(r.catalogCount,1523);
  assert.equal(r.masteryDeclared,false);
  assert.equal(r.sessionDetails.length,12);
  assert.ok(r.oldDistinctQcm<=13);
  assert.ok(r.genuineAdversaryCounterDistinctQcm<=12);
  assert.ok(r.genuineAdversaryCounterSessions<=12);
  const allOld=r.sessionDetails.flatMap(s=>s.oldInterventionIds);
  const allNew=r.sessionDetails.flatMap(s=>s.realCounterResponseIds);
  assert.equal(allOld.length,r.oldInterventionAppearances);
  assert.equal(allNew.length,r.genuineAdversaryCounterAppearances);
  assert.ok(allOld.every(id=>originalIds.includes(id)));
  assert.ok(allNew.every(id=>x.sourceCandidates.some(y=>y.id===id)));
  const repeated=O.analyze(q,a,{sessions:12,seed:13,profile});
  assert.deepEqual(repeated,r,'Le comparateur doit être déterministe');
}
console.log('QPJB V2 O BENCH PASS : 13 anciennes sources / 12 contre adverse, simulations fictives, aucun changement du moteur');
