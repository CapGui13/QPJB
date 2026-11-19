'use strict';
const assert=require('node:assert/strict');
const F=require('../scripts/parcours-v2-pilot.cjs');
const Y=require('../scripts/parcours-v2-transitions-y.cjs');
const Z=require('../scripts/parcours-v2-intros-z.cjs');
const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
const before=JSON.stringify(catalog), originalById=new Map(catalog.map(q=>[q.id,q]));
assert.equal(catalog.length,1523);
assert.equal(annotations.size,79);
assert.equal(Z.POLICY.activation,'EXPERIMENTAL_TEACHER_REVIEW_ONLY');
assert.equal(Z.POLICY.studentMasteryRecorded,false);
assert.equal(Z.POLICY.originalSelectionChanged,false);
assert.equal(Z.IDS.length,5);
assert.equal(Z.catalogGuard(catalog).checkedIds,5);
for(const id of Z.IDS){
  const item=Z.CARDS[id],q=originalById.get(id);
  assert.equal(q.theme,item.theme);
  assert.equal(item.steps.length,3);
  assert.ok(item.steps.every(x=>x.length>0));
  assert.ok(![item.title,...item.steps].join(' ').toLowerCase().includes(q.answer.toLowerCase()),
    'An unscored prelude cannot literally reveal answer: '+id);
}
const sim=F.simulateV2(catalog,annotations,{sessions:45,seed:13,profile:'balanced'});
const state=JSON.stringify(sim.state);
const chosen=sim.sessions.map(deck=>deck.map(q=>q.id));
const y=Y.firstEncounter(sim.sessions,catalog);
const a=Z.observe(y,catalog),b=Z.observe(y,catalog);
assert.deepEqual(a,b);
assert.equal(a.length,2);
assert.deepEqual(a.map(x=>x.theme),['rubensohl','michaels']);
assert.ok(a.every(x=>x.matched));
for(const x of a){
  const q=originalById.get(x.firstQuestionId),card=x.card;
  assert.equal(card.sourceId,q.id);
  assert.equal(card.theme,q.theme);
  assert.equal(card.sourceFamily,F.family(q));
  assert.equal(card.steps.length,3);
  assert.equal(card.placement,'BEFORE_ORIGINAL_QCM');
  assert.equal(card.presentation,'UNSCORED');
  assert.equal(card.reviewStatus,'VALIDATION_ENSEIGNANTE_REQUISE');
  assert.equal(card.doesNotReplaceOriginal,true);
  assert.equal(card.noMasteryOrProficiencyInferred,true);
  assert.equal(Object.hasOwn(card,'answer'),false);
  assert.equal(Object.hasOwn(card,'explain'),false);
  assert.equal(x.originalAnswerRemains,q.answer);
  assert.equal(x.originalContextRemains,q.context);
  assert.equal(sim.sessions[x.firstSession-1][x.firstPosition-1],q);
}
const tampered=catalog.slice();
const idx=tampered.findIndex(q=>q.id==='SEF-V486-022');
tampered[idx]={...tampered[idx],context:'unrelated'};
assert.throws(()=>Z.catalogGuard(tampered),/source|contexte original/i);
assert.equal(Z.buildCard(y.observations.find(x=>x.theme==='forcing'),catalog),null);
assert.deepEqual(sim.sessions.map(deck=>deck.map(q=>q.id)),chosen);
assert.equal(JSON.stringify(sim.state),state);
assert.equal(JSON.stringify(catalog),before);
const PREVIEW=require('../scripts/parcours-v2-apercu-z.cjs');
const offlineHtml=PREVIEW.render(catalog);
assert.ok(offlineHtml.includes('QPJB — Aperçu expérimental'));
assert.ok(offlineHtml.includes('const CASES = '));
assert.ok(!offlineHtml.includes('__DATA__'));
const payload=/const CASES = (\[.*?\]);\nconst byId/s.exec(offlineHtml);
assert.ok(payload,'Preview embeds bounded local source data');
const items=JSON.parse(payload[1]);
assert.equal(items.length,5);
assert.deepEqual(items.map(x=>x.id),Z.IDS);
for(const item of items){
  const q=originalById.get(item.id);
  assert.equal(item.q.answer,q.answer);
  assert.equal(item.q.explain,q.explain);
  assert.deepEqual(item.q.hand,q.hand);
  assert.deepEqual(item.q.choices,q.choices);
  assert.deepEqual(item.card.steps,Z.CARDS[item.id].steps);
}
assert.ok(offlineHtml.includes('Aucun résultat n&#39;est enregistré')||
  offlineHtml.includes('Aucun résultat n\'est enregistré'));

console.log('QPJB V2 Z PASS : five source-anchored unscored preludes; original sessions, answers and state unchanged');
