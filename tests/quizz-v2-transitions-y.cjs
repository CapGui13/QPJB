'use strict';
const assert=require('node:assert/strict');
const F=require('../scripts/parcours-v2-pilot.cjs');
const Y=require('../scripts/parcours-v2-transitions-y.cjs');
const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
const sourceById=new Map(catalog.map(q=>[q.id,q]));
const original=JSON.stringify(catalog);
assert.equal(catalog.length,1523);
assert.equal(annotations.size,79);
assert.deepEqual(Object.keys(Y.WATCH).sort(),
  ['chelem','forcing','fortes','michaels','multilandy','rubensohl'].sort());
const sim=F.simulateV2(catalog,annotations,{sessions:45,seed:13,profile:'balanced'});
const ids=sim.sessions.map(d=>d.map(q=>q.id)),state=JSON.stringify(sim.state);
const a=Y.firstEncounter(sim.sessions,catalog);
const b=Y.firstEncounter(sim.sessions,catalog);
assert.deepEqual(a,b);
assert.equal(a.schema,'QPJB_V2_Y_FIRST_TRANSITIONS_1');
assert.equal(a.observations.length,6);
assert.ok(a.observations.every(x=>x.status==='OBSERVEE'));
for(const x of a.observations){
  assert.ok(x.firstSession>=x.eligibleFrom);
  assert.ok(x.firstPosition>=1&&x.firstPosition<=10);
  assert.equal(x.first.theme,x.theme);
  assert.equal(sourceById.get(x.first.id).answer,x.first.answer);
  assert.equal(sourceById.get(x.first.id).explain,x.first.explain);
  assert.equal(x.sameSessionOriginalIds[x.firstPosition-1],x.first.id);
  assert.equal(x.sameSessionOriginalIds.length,10);
  assert.deepEqual(Object.keys(x.priorByTheme),x.sourceCues);
  assert.equal(x.evidenceOnly,true);
  for(const [theme,v] of Object.entries(x.priorByTheme)){
    const previous=sim.sessions.slice(0,x.firstSession-1).flat();
    const recent=sim.sessions.slice(Math.max(0,x.firstSession-1-Y.PREVIOUS_WINDOW),x.firstSession-1).flat();
    assert.equal(v.earlierSessions,previous.filter(q=>q.theme===theme).length);
    assert.equal(v.lastFiveSessions,recent.filter(q=>q.theme===theme).length);
    assert.ok(v.lastFiveSessions<=v.earlierSessions);
  }
}
assert.deepEqual(sim.sessions.map(d=>d.map(q=>q.id)),ids);
assert.equal(JSON.stringify(sim.state),state);
assert.equal(JSON.stringify(catalog),original);
const mini=Y.firstEncounter(sim.sessions.slice(0,5),catalog);
assert.ok(mini.observations.some(x=>x.status==='NON_RENCONTREE'));
assert.throws(()=>Y.firstEncounter([],catalog),/incomplètes/);
const replaced=sim.sessions.map(d=>d.slice());
replaced[39][0]={...replaced[39][0]};
assert.throws(()=>Y.firstEncounter(replaced,catalog),/source recopiée/);
console.log('QPJB V2 Y PASS : first exposures and prior-context evidence, catalogue unchanged');
