'use strict';
/* Non-regression : M reste une simulation qui amende F seulement à la marge. */
const assert=require('node:assert/strict');
const P=require('../scripts/parcours-v2-pilot.cjs');
const M=require('../scripts/parcours-v2-mix-m.cjs');
const exercises=P.loadCatalog(),annotations=P.loadAnnotations();
assert.equal(exercises.length,1523);
const known=new Map(exercises.map(q=>[q.id,q]));
for(const profile of ['balanced','fragile-mineures']){
  const opts={profile,seed:13,sessions:22};
  const base=P.simulateV2(exercises,annotations,opts);
  const exp=M.simulate(exercises,annotations,opts);
  assert.equal(exp.sessions.length,22);
  assert.equal(exp.metrics.questionCount,220);
  assert.equal(exp.metrics.repeatedFamilySessions,0);
  assert.deepEqual(exp.sessions[0].map(x=>x.id),base.sessions[0].map(x=>x.id));
  const modified=new Set(exp.meta.injections.map(x=>x.session));
  assert.equal(modified.size,exp.meta.injections.length,'Un maximum d une modification par séance');
  for(const entry of exp.meta.injections){
    assert.ok(entry.session>=2);
    assert.ok(entry.replacedSlot>=6&&entry.replacedSlot<=9);
    assert.equal(entry.themeGain,1);
    assert.notEqual(entry.originalTheme,entry.newTheme);
    assert.ok(known.has(entry.addedId)&&known.has(entry.replacedId));
  }
  for(const deck of exp.sessions){
    assert.equal(deck.length,10);
    assert.equal(new Set(deck.map(P.family)).size,10);
    assert.ok(deck.every(x=>known.has(x.id)));
    const counts=Object.create(null);
    for(const q of deck)counts[q.answer]=(counts[q.answer]||0)+1;
    assert.ok(Math.max(...Object.values(counts))<=3,'4 réponses identiques');
  }
  for(const item of Object.values(exp.state.concepts))
    assert.ok(!('mastered' in item),'Aucune inférence de maîtrise');
  const replay=M.simulate(exercises,annotations,opts);
  assert.deepEqual(replay.sessions.map(deck=>deck.map(q=>q.id)),
    exp.sessions.map(deck=>deck.map(q=>q.id)),'Simulation reproductible');
}
console.log('QPJB V2 M PASS : intégrité des séances, aucune famille doublée, jamais quatre réponses identiques, reproductibilité, aucun acquis');
