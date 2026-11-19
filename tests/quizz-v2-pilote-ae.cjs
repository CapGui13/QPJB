'use strict';
const assert=require('node:assert/strict');
const F=require('../scripts/parcours-v2-pilot.cjs');
const AB=require('../scripts/parcours-v2-lecons-ab.cjs');
const AD=require('../scripts/parcours-v2-comprehension-ad.cjs');
const AE=require('../scripts/parcours-v2-pilote-ae.cjs');
const HTML=require('../scripts/parcours-v2-apercu-pilote-ae.cjs');

const catalog=F.loadCatalog(),before=JSON.stringify(catalog);
const q=AE.validate(catalog);
assert.equal(catalog.length,1523);
assert.equal(q.schema,'QPJB_AE_CLASSROOM_PILOT_PROTOCOL_1');
assert.equal(q.status,'PROTOCOL_READY_NO_REAL_SESSION_HELD');
assert.equal(q.questions,6);
assert.equal(q.conventions,2);
assert.equal(q.sourceQcm,5);
assert.equal(q.originalCatalog,1523);
assert.equal(q.protocolStages,6);
assert.equal(q.observationSections,6);
assert.equal(q.participantsObserved,0);
assert.equal(q.actualDataCollected,false);
assert.equal(q.noteStored,false);
assert.equal(q.teacherApprovalRequired,true);
assert.equal(q.publicRuntimeWired,false);
assert.equal(q.sourceExercisesUnchanged,true);
assert.equal(AE.POLICY.inventedResults,false);
assert.equal(AE.POLICY.studentMasteryInferred,false);
assert.equal(AE.POLICY.participationVoluntary,true);
assert.equal(AE.POLICY.participantNamesCollected,false);
assert.deepEqual(AE.QUESTIONS.map(x=>x.id),AD.PROMPTS.map(x=>x.id));
assert.deepEqual(AE.QUESTIONS.map(x=>x.question),AD.PROMPTS.map(x=>x.prompt));
assert.deepEqual(AE.QUESTIONS.map(x=>x.reviewAfterResponse),
  AD.PROMPTS.map(x=>x.teacherIndicators));
assert.deepEqual(AE.PROTOCOL.qualitativeLabels,
 ['expliqué clairement','à reformuler','non abordé']);
assert.equal(AE.PROTOCOL.exitQuestions.length,3);
assert.ok(AE.PROTOCOL.observerRules.every(x=>x.length>=30));
const r=AE.report();
assert.equal(r.questions.length,6);
assert.deepEqual(r.observations,[]);
assert.deepEqual(r.qualitativeFindings,[]);
assert.equal(r.studentResultsNotInvented,true);
const tampered=catalog.slice();
const idx=tampered.findIndex(x=>x.id==='SEF-V486-022');
tampered[idx]={...tampered[idx],answer:'2SA'};
assert.throws(()=>AE.validate(tampered),/accord source changé/);
const html=HTML.render(catalog);
assert.ok(html.startsWith('<!doctype html>'));
assert.equal((html.match(/class="observation"/g)||[]).length,6);
assert.equal((html.match(/<textarea /g)||[]).length,7);
assert.equal((html.match(/<input type="radio"/g)||[]).length,18);
assert.equal((html.match(/class="teacher-only"/g)||[]).length,6);
assert.equal((html.match(/<article class="card" data-lesson=/g)||[]).length,2);
assert.ok(html.includes('Aucune donnée réelle incluse dans ce fichier.'));
assert.ok(html.includes('Essai pilote'));
assert.ok(html.includes('facultative'));
assert.ok(html.includes('Aucun élève observé'));
assert.ok(html.includes('Volontaires')||html.includes('volontaires'));
assert.ok(html.includes('window.print()'));
assert.ok(html.includes('Effacer les notes de la fiche'));
assert.ok(html.includes('Repères à lire seulement APRÈS la réponse'));
assert.ok(html.includes('Aucune note')||html.includes('aucune note'));
assert.ok(html.includes('sans identité'));
assert.ok(!html.includes('__STEPS__'));
assert.ok(!html.includes('__INVITATION__'));
assert.ok(!html.includes('__NAV__'));
assert.ok(!html.includes('__ARTICLES__'));
assert.ok(!html.includes('__EXIT__'));
for(const name of ['localStorage','sessionStorage','indexedDB','fetch(', 'XMLHttpRequest',
 'navigator.sendBeacon','<form','type="submit"','<script src=']){
 assert.ok(!html.includes(name),'Forbidden storage/network/submission: '+name);
}
for(const x of AE.QUESTIONS){
 assert.ok(html.includes(x.id));
 assert.ok(html.includes(x.question.replace(/&/g,'&amp;')
  .replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
  .replace(/'/g,'&#39;')));
}
const scriptStart=html.lastIndexOf('<script>')+'<script>'.length;
const scriptEnd=html.indexOf('</script>',scriptStart);
assert.ok(scriptStart>7&&scriptEnd>scriptStart);
assert.doesNotThrow(()=>new Function(html.slice(scriptStart,scriptEnd)));
for(const old of catalog.filter(x=>AB.LESSONS.some(l=>l.sourceIds.includes(x.id)))){
 assert.ok(!html.includes(old.context),'Original QCM context included: '+old.id);
 assert.ok(!html.includes(old.explain),'Original QCM explanation included: '+old.id);
}
assert.equal(JSON.stringify(catalog),before);
console.log('QPJB AE PASS : 6 faithful prompts, 0 students or records, 1 anonymized printable offline sheet');
