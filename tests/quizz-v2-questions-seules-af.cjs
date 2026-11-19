'use strict';
const assert=require('node:assert/strict');
const F=require('../scripts/parcours-v2-pilot.cjs');
const AF=require('../scripts/parcours-v2-questions-seules-af.cjs');
const P=require('../quizz-parcours.js');
const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
const original=JSON.stringify(catalog);
assert.equal(catalog.length,1523);
assert.equal(annotations.size,79);
assert.equal(AF.POLICY.noLessons,true);
assert.equal(AF.POLICY.defaultAdvancedThemeTaught,false);
assert.equal(AF.POLICY.teacherConfirmationRequired,true);
assert.equal(AF.POLICY.noAutomaticMasteryUnlock,true);
assert.equal(AF.POLICY.publicRuntimeWired,false);
assert.equal(P.INTRO.rubensohl,34);
const excluded=catalog.filter(AF.requiresRubensohl);
assert.ok(excluded.length>0);
assert.ok(excluded.some(q=>q.theme==='rubensohl'));
const lockedPool=AF.visibleQuestions(catalog);
const taughtPool=AF.visibleQuestions(catalog,true);
assert.equal(lockedPool.length+excluded.length,catalog.length);
assert.equal(taughtPool.length,catalog.length);
assert.ok(lockedPool.every(q=>!AF.requiresRubensohl(q)));
for(const q of lockedPool)assert.strictEqual(catalog.find(item=>item.id===q.id),q);
for(const q of taughtPool)assert.strictEqual(catalog.find(item=>item.id===q.id),q);
assert.throws(()=>AF.visibleQuestions(catalog,'yes'),/booléenne/);
assert.throws(()=>AF.run(catalog,annotations,{teacherConfirmedBeforeSession:0}),/séance/);
assert.throws(()=>AF.run(catalog,annotations,{sessions:12,teacherConfirmedBeforeSession:13}),/séance/);

const locked=AF.run(catalog,annotations,{sessions:45,seed:13,profile:'balanced'});
assert.equal(locked.status,'SIMULATED_PATH_ONLY_NO_STUDENT_DATA');
assert.equal(locked.questionsPerSession,10);
assert.equal(locked.lessonsIncluded,0);
assert.equal(locked.originalCatalogSize,1523);
assert.equal(locked.advancedThemeQuestions,0);
assert.deepEqual(locked.teacherConfirmationEvents,[]);
assert.equal(locked.teacherConfirmedBeforeSession,null);
assert.equal(locked.metrics.questionCount,450);
assert.equal(locked.metrics.repeatedFamilySessions,0);
assert.ok(locked.metrics.uniqueFamilies>=430);
assert.ok(locked.sessions.every(deck=>deck.length===10&&
 deck.every(q=>!AF.requiresRubensohl(q))));

const taught=AF.run(catalog,annotations,{
  sessions:45,seed:13,profile:'balanced',teacherConfirmedBeforeSession:40
});
assert.deepEqual(taught.teacherConfirmationEvents,[{
  type:'TEACHER_CONFIRMED_TAUGHT',beforeSession:40
}]);
assert.equal(taught.metrics.questionCount,450);
assert.equal(taught.metrics.repeatedFamilySessions,0);
assert.ok(taught.metrics.uniqueFamilies>=430);
assert.ok(taught.sessions.slice(0,39).flat().every(q=>!AF.requiresRubensohl(q)));
assert.ok(taught.sessions.slice(39).flat().every(q=>catalog.includes(q)));
assert.equal(taught.lessonsIncluded,0);

const earlyConfirm=AF.run(catalog,annotations,{
  sessions:35,seed:13,profile:'balanced',teacherConfirmedBeforeSession:1
});
assert.equal(earlyConfirm.advancedThemeQuestions,
 earlyConfirm.sessions.flat().filter(q=>q.theme==='rubensohl').length);
assert.ok(earlyConfirm.sessions.slice(0,34).flat()
 .every(q=>q.theme!=='rubensohl'));
assert.equal(earlyConfirm.teacherConfirmationEvents[0].beforeSession,1);
assert.equal(JSON.stringify(catalog),original);
console.log('QPJB AF PASS : advanced Rubensohl is locked unless teacher explicitly confirms oral teaching, no QCM/lesson changes');
