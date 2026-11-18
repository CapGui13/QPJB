'use strict';
// Aucun exercice, aucun état élève ni fichier du site n'est modifié.
const assert=require('node:assert/strict');
const Pilot=require('../scripts/parcours-v2-pilot.cjs');
const catalog=Pilot.loadCatalog();
const annotations=Pilot.loadAnnotations();
assert.equal(catalog.length,1523);
assert.equal(annotations.size,79);
assert.equal(Pilot.STANDARD_OPENINGS.length,5);
assert.equal(new Set(catalog.map(q=>q.id)).size,catalog.length);
const byId=new Map(catalog.map(q=>[q.id,q]));
for(const [id,metadata] of annotations){
  assert.ok(byId.has(id),'ID de l annotation absent du catalogue: '+id);
  assert.ok(Number.isInteger(metadata.stage)&&metadata.stage>=1&&metadata.stage<=5);
}
const state=Pilot.newState(13);
const first=Pilot.select(catalog,state,annotations);
assert.equal(first.length,10);
assert.ok(first.every(q=>q.theme==='ouv'));
for(const opening of Pilot.STANDARD_OPENINGS)
  assert.ok(new Set(first.map(q=>q.answer)).has(opening),
    'Dès la première séance, ouverture '+opening+' représentée');
assert.equal(new Set(first.map(Pilot.family)).size,10);
Pilot.recordSession(state,first,first.map(()=>true),annotations);
const second=Pilot.select(catalog,state,annotations);
assert.equal(second.length,10);
const contexts=new Set(second.map(Pilot.roleOpening));
for(const k of ['rep:1♣','rep:1♦','rep:1♥','rep:1♠'])
  assert.ok(contexts.has(k),'Varier tôt les quatre réponses: '+k);
assert.equal(new Set(second.map(Pilot.family)).size,10);
const candidate=byId.get('SEF-L18-007');
assert.ok(candidate);
assert.equal(Pilot.available(candidate,1,annotations),false);
assert.equal(Pilot.available(candidate,19,annotations),true,
  'Niveau 4 candidate = introduction expérimentale à la 20e séance seulement');
const old=Pilot.simulateV1(catalog,{sessions:6,seed:13});
assert.equal(old.metrics.questionCount,60);
const pilot=Pilot.simulateV2(catalog,annotations,{sessions:20,seed:13});
const repeat=Pilot.simulateV2(catalog,annotations,{sessions:20,seed:13});
assert.deepEqual(pilot.sessions.map(d=>d.map(x=>x.id)),
  repeat.sessions.map(d=>d.map(x=>x.id)),'Reproductibilité avec même graine');
assert.equal(pilot.metrics.questionCount,200);
assert.equal(pilot.metrics.sessionCount,20);
assert.equal(pilot.metrics.repeatedFamilySessions,0);
assert.ok(pilot.metrics.uniqueFamilies>=150);
assert.ok(pilot.metrics.opening['1♣']>0&&pilot.metrics.opening['1♦']>0);
for(const deck of pilot.sessions){
  assert.equal(deck.length,10);
  assert.equal(new Set(deck.map(q=>q.id)).size,10);
  assert.equal(new Set(deck.map(Pilot.family)).size,10);
  for(const q of deck)assert.ok(byId.has(q.id),'Ne jamais inventer un QCM');
}
const weak=Pilot.simulateV2(catalog,annotations,{
  sessions:16,seed:13,profile:'fragile-mineures'});
assert.equal(weak.metrics.questionCount,160);
assert.equal(weak.metrics.repeatedFamilySessions,0);
for(const [key,data] of Object.entries(weak.state.concepts)){
  assert.ok(data.attempts>=1);
  assert.ok(['correct','wrong'].includes(data.lastResult));
  assert.ok(data.due>=data.lastSession+2);
  assert.ok(!('mastered' in data),'Jamais de preuve de maîtrise fictive');
}
console.log('PARCOURS V2 SIMULATION PASS : catalogue 1523, 79 annotations, 20 séances fictives, sessions complètes, familles uniques.');
