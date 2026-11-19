'use strict';
const assert=require('node:assert/strict');
const F=require('../scripts/parcours-v2-pilot.cjs');
const AB=require('../scripts/parcours-v2-lecons-ab.cjs');
const PREVIEW=require('../scripts/parcours-v2-apercu-lecons-ab.cjs');
const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
const before=JSON.stringify(catalog),originalIds=catalog.map(q=>q.id);
const originalAnswers=catalog.map(q=>q.answer);
assert.equal(catalog.length,1523);
assert.equal(annotations.size,79);
const checked=AB.validate(catalog);
assert.equal(checked.schema,'QPJB_AB_SOURCE_VALIDATION_1');
assert.equal(checked.lessons,2);
assert.equal(checked.sourceQuestions,5);
assert.equal(checked.policy.graded,false);
assert.equal(checked.policy.questionsIncluded,false);
assert.equal(checked.policy.answersRecorded,false);
assert.equal(checked.policy.externalSefCertified,false);
assert.equal(checked.policy.publicRuntimeWired,false);
assert.equal(checked.policy.teacherApprovalRequired,true);
assert.deepEqual(AB.LESSONS.map(x=>x.id),['rubensohl','michaels']);
assert.deepEqual(AB.LESSONS.map(x=>x.sourceIds.length),[2,3]);
const ids=AB.LESSONS.flatMap(x=>x.sourceIds);
assert.equal(new Set(ids).size,5);
for(const lesson of AB.LESSONS){
 assert.equal(lesson.blocks.length,4);
 assert.equal(lesson.contrast.length,2);
 assert.ok(lesson.boundary.includes('QPJB')||lesson.boundary.includes('exemples'));
 for(const block of lesson.blocks){
  if(block.evidence)assert.ok(lesson.sourceIds.includes(block.evidence));
  assert.ok(!block.choices&&!block.hand&&!block.answer);
 }
}
const rub=AB.LESSONS[0],mich=AB.LESSONS[1];
const rubText=rub.blocks.map(x=>x.body).join(' ');
assert.ok(rubText.includes('3♣')&&rubText.includes('Texas pour les Carreaux'));
assert.ok(rubText.includes('Stayman forcing de manche'));
const michText=mich.blocks.map(x=>x.body).join(' ');
assert.ok(michText.includes('deux majeures'));
assert.ok(michText.includes('Cœurs et cinq Trèfles'));
assert.ok(michText.includes('vulnérabilité'));
const tampered=catalog.slice();
const idx=tampered.findIndex(q=>q.id==='SEF-V486-022');
tampered[idx]={...tampered[idx],explain:'accord différent'};
assert.throws(()=>AB.validate(tampered),/accord source changé/);
const out=AB.outline();
assert.equal(out.lessons.length,2);
assert.equal(out.originalCatalogEdited,false);
const html=PREVIEW.render(catalog);
assert.ok(html.startsWith('<!doctype html>'));
assert.equal((html.match(/<article data-lesson=/g)||[]).length,2);
assert.ok(html.includes('data-lesson="rubensohl"'));
assert.ok(html.includes('data-lesson="michaels"'));
assert.ok(html.includes('Leçon de découverte'));
assert.ok(html.includes('aucun résultat enregistré')||html.includes('aucun résultat de maîtrise'));
assert.ok(!html.includes('__NAV__')&&!html.includes('__LESSONS__'));
assert.ok(!html.includes('type="radio"'));
assert.ok(!html.includes('<form'));
assert.ok(!html.includes('type="submit"'));
assert.ok(!html.includes('localStorage'));
assert.ok(!html.includes('fetch('));
assert.ok(!html.includes('<script src='));
for(const id of ids)assert.ok(html.includes(id));
for(const q of catalog.filter(q=>ids.includes(q.id))){
 // A lesson must never silently reproduce the original question or answer choices.
 assert.ok(!html.includes(q.context),'The original QCM prompt must not be in lesson '+q.id);
 assert.ok(!html.includes(q.explain),'The original QCM correction must not be in lesson '+q.id);
}
const scriptStart=html.lastIndexOf('<script>')+'<script>'.length;
const scriptEnd=html.indexOf('</script>',scriptStart);
assert.ok(scriptStart>7&&scriptEnd>scriptStart);
assert.doesNotThrow(()=>new Function(html.slice(scriptStart,scriptEnd)));
assert.equal(PREVIEW.esc('<script>&"'), '&lt;script&gt;&amp;&quot;');
assert.deepEqual(catalog.map(q=>q.id),originalIds);
assert.deepEqual(catalog.map(q=>q.answer),originalAnswers);
assert.equal(JSON.stringify(catalog),before);
console.log('QPJB AB PASS : 2 non-graded source-anchored lessons, no QCM reuse, offline HTML, 0 mutation');
