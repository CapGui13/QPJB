'use strict';
/* V2-T : aucune présomption d'absence de concurrence sur un sous-catalogue. */
const assert=require('node:assert/strict');
const F=require('../scripts/parcours-v2-pilot.cjs');
const T=require('../scripts/parcours-v2-audit-competition-t.cjs');
const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
assert.equal(catalog.length,1523);assert.equal(annotations.size,79);
const source=T.sources();
assert.equal(source.our.size,13);assert.equal(source.reply.size,12);
for(const profile of ['balanced','fragile-mineures']){
  const sim=F.simulateV2(catalog,annotations,{sessions:20,seed:13,profile});
  const snapshot=sim.sessions.map(d=>d.map(x=>x.id));
  const reviews=JSON.stringify(sim.state.reviewEvents);
  const a=T.trace(sim.sessions,catalog,source,annotations);
  const b=T.trace(sim.sessions,catalog,source,annotations);
  assert.deepEqual(a,b,'Audit déterministe');
  assert.equal(a.schema,'QPJB_V2_T_FULL_CATALOG_TRACE_20261118_1');
  assert.equal(a.sessions,20);assert.equal(a.questions,200);
  assert.equal(a.wholeCatalogQuestions,1523);
  assert.equal(a.themesSeen,Object.keys(sim.metrics.themes).length);
  assert.equal(a.familiesSeen,sim.metrics.uniqueFamilies);
  assert.equal(a.masteryInferred,false);
  assert.equal(a.originalDecksUnchanged,true);
  assert.deepEqual(sim.sessions.map(d=>d.map(x=>x.id)),snapshot,'Les tirages ne doivent pas changer');
  assert.equal(JSON.stringify(sim.state.reviewEvents),reviews,'Les rappels ne doivent pas changer');
  assert.equal(a.windows[0].from,1);assert.equal(a.windows[0].to,5);
  assert.equal(a.windows[1].from,6);assert.equal(a.windows[1].to,10);
  for(const k of Object.keys(a.totals)){
    assert.equal(a.totals[k],a.windows.reduce((sum,w)=>sum+w.counts[k],0));
    assert.ok(a.first25[k]===a.totals[k],
      'En 20 séances, les valeurs des 25 premières séances sont totales');
    assert.ok(a.totals[k]>=0);
  }
  assert.ok(a.totals.mappedOurIntervention<=a.totals.ourIntervention);
  assert.ok(a.totals.mappedReplyToCounter<=a.totals.replyToAdversaryCounter);
  assert.ok(a.totals.ourIntervention<=a.totals.themeIntervention);
  assert.ok(a.totals.replyToAdversaryCounter<=a.totals.themeAfterIntervention);
  assert.ok(a.firstSession.broadCompetition!==null);
  assert.ok(a.firstSession.broadCompetition>=11);
  if(a.firstSession.replyToAdversaryCounter!==null)
    assert.ok(a.firstSession.replyToAdversaryCounter>=15);
  for(const p of a.eligibleCheckpoints){
    assert.ok(p.session>=11&&p.session<=20);
    for(const n of Object.values(p.eligibleFamilyUpperBound))
      assert.ok(n>=0&&n<=1523);
  }
}
assert.throws(()=>T.trace([],catalog,source,annotations));
console.log('QPJB V2 T PASS : comparaison catalogue entier vs sous-ensemble P, 1523 sources, aucun tirage ni rappel modifié');
