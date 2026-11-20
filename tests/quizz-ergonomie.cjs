'use strict';
/* Recette reproductible et sans navigateur : progression, répétition, export. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const P=require('../quizz-parcours.js');
const html=fs.readFileSync(path.join(__dirname,'../quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Catalogue embarqué du Quizz original');
const data=JSON.parse(match[1]),catalog=data.exercises;
assert.equal(catalog.length,1523,'Les 1 523 corrigés restent présents');
assert.ok(!html.includes('Les compteurs incluent les dernières réponses'));
assert.ok(!html.includes('100 % algorithmique, sans IA'));
assert.ok(!html.includes('<div class="notice"><strong>Entraînement aux enchères.'));
assert.ok(html.includes('Mon tableau de progression'));
assert.ok(html.includes('id="progress-export"'));
const family=q=>q.caseFamily||q.id;
const s=P.empty(),sessions=[],seen=new Set();
for(let round=0;round<13;round++){
  const deck=P.start(s,catalog);
  assert.equal(deck.length,10,'La séance '+(round+1)+' contient dix QCM');
  assert.equal(new Set(deck.map(q=>q.id)).size,10,'Aucun doublon de question');
  assert.equal(new Set(deck.map(family)).size,10,'Aucune variante de la même famille dans une séance');
  for(let i=0;i<deck.length;i++){
    const q=deck[i];seen.add(q.id);
    assert.ok(P.record(s,q,'correct',i,q.answer,false,false));
  }
  assert.ok(P.finish(s,catalog),'La séance '+(round+1)+' se termine');
  sessions.push(deck.map(q=>q.id));
}
assert.equal(s.completed,13);
assert.equal(s.journal.length,13);
assert.ok(seen.size>=110,'La diversité doit prédominer sur 13 séances : '+seen.size);
assert.ok(s.journal.every((event,i)=>event.session===i+1&&
  event.answers.length===10&&event.answers.every(a=>
    a.id&&a.choice!==null&&a.result==='correct')));
const before=JSON.stringify(s),history=JSON.stringify(s.journal),skills=JSON.stringify(s.skills);
const next=P.start(s,catalog);
assert.equal(next.length,10);
assert.equal(s.completed,13,'Une nouvelle séance ne réinitialise pas les acquis');
assert.equal(JSON.stringify(s.journal),history,'Le journal ne change pas');
assert.equal(JSON.stringify(s.skills),skills,'La maîtrise ne change pas');
assert.deepEqual(P.start(s,catalog).map(q=>q.id),next.map(q=>q.id),
  'Recliquer reprend la séance et non un nouveau tirage');
const roundtrip=P.load(JSON.stringify(s));
assert.equal(roundtrip.completed,13);
assert.deepEqual(roundtrip.active.ids,s.active.ids);
assert.equal(roundtrip.journal.length,13);
assert.equal(roundtrip.difficultyAdjustment,0);
const result=P.exportProgress(s,catalog,{EXAMPLE:{attempts:2,history:[{result:'correct'}]}});
assert.equal(result.summary.completedSessions,13);
assert.equal(result.summary.recordedDetailedSessions,13);
assert.equal(result.limitations.historicalSessionsWithoutDetailedAnswers,0);
assert.equal(result.sessions[0].answers[0].id,sessions[0][0]);
assert.equal(result.quizQuestionHistory.EXAMPLE.attempts,2);
assert.ok(result.mastery.skills&&result.mastery.micros&&result.mastery.dashboard);
assert.deepEqual(JSON.parse(before).journal,s.journal,'Exporter ne modifie pas les réponses');
// Import du même JSON produit par la V1 : progression, séance en cours
// et historique réel conservés, sans écrire dans le Quiz classique.
const imported=P.importProgress(JSON.stringify(result));
assert.equal(imported.completed,13);
assert.deepEqual(imported.journal,s.journal);
assert.deepEqual(imported.active.ids,s.active.ids);
assert.deepEqual(imported.skills,s.skills);
assert.throws(()=>P.importProgress('{}'),/export de progression V1/);
assert.throws(()=>P.importProgress('{'),/JSON valide/);
const corruptExport=JSON.parse(JSON.stringify(result));
corruptExport.summary.completedSessions=99;
assert.throws(()=>P.importProgress(corruptExport),/incohérent/);
const brokenHistory=JSON.parse(JSON.stringify(result));
brokenHistory.algorithmState.journal[0].answers[0].result='invented';
assert.throws(()=>P.importProgress(brokenHistory),/incohérente/);
// Reprise d'une ancienne sauvegarde sans historique détaillé : aucune séance
// inventée, et les compteurs existants demeurent exploitables.
const legacy=JSON.parse(before);
delete legacy.journal;delete legacy.difficultyAdjustment;delete legacy.difficultyFeedback;
const old=P.load(JSON.stringify(legacy));
assert.equal(old.completed,13);
assert.equal(old.journal.length,0);
assert.deepEqual(old.entries,s.entries);
assert.deepEqual(old.skills,s.skills);
const oldExport=P.exportProgress(old,catalog,{});
assert.equal(oldExport.limitations.historicalSessionsWithoutDetailedAnswers,13);
assert.equal(oldExport.sessions.length,0);
assert.ok(oldExport.questions.length>0);
// Ressenti et maîtrise mesurée sont deux dimensions différentes.
const feedback=P.load(JSON.stringify({...legacy,active:null}));
const measured=JSON.stringify({entries:feedback.entries,skills:feedback.skills,
  micros:feedback.micros,axes:feedback.axes,completed:feedback.completed});
assert.equal(P.adjustDifficulty(feedback,'increase'),true);
assert.equal(feedback.difficultyAdjustment,1);
assert.equal(P.adjustDifficulty(feedback,'increase'),true);
assert.equal(feedback.difficultyFeedback.length,1,'Un seul choix par séance');
assert.equal(feedback.difficultyAdjustment,1,'Choix identique idempotent');
assert.equal(P.adjustDifficulty(feedback,'decrease'),true);
assert.equal(feedback.difficultyAdjustment,-1,'Modifier le choix de la même séance');
assert.equal(JSON.stringify({entries:feedback.entries,skills:feedback.skills,
  micros:feedback.micros,axes:feedback.axes,completed:feedback.completed}),measured,
  'La préférence de difficulté ne modifie aucune preuve de maîtrise');
assert.equal(P.load(JSON.stringify(feedback)).difficultyAdjustment,-1);
const hard=P.empty();hard.completed=30;hard.difficultyAdjustment=2;
const easy=P.empty();easy.completed=30;easy.difficultyAdjustment=-2;
const hardDeck=P.select(catalog,hard,10),easyDeck=P.select(catalog,easy,10);
const byId=new Map(catalog.map(q=>[q.id,q]));
const mean=deck=>deck.reduce((n,q)=>n+byId.get(q.id).difficulty,0)/deck.length;
assert.equal(hardDeck.length,10);assert.equal(easyDeck.length,10);
assert.ok(mean(hardDeck)>mean(easyDeck),
  'Le choix doit influencer les QCM : '+mean(hardDeck)+' vs '+mean(easyDeck));
assert.equal(P.adjustDifficulty(s,'increase'),false,'Pas de modification en cours de séance');
// Suivi prospectif des causes du tirage : le même catalogue et les mêmes
// dix questions, mais des explications conservées après rechargement.
// Tests fictifs uniquement ; aucune progression personnelle dans GitHub.
const traced=P.empty();
const tracedDeck=P.start(traced,catalog);
const tracedPlan=traced.active.selection;
assert.equal(tracedPlan.length,10);
assert.deepEqual(tracedPlan.map(x=>x.id),tracedDeck.map(x=>x.id));
assert.ok(tracedPlan.every(x=>P.SELECTION_REASONS.includes(x.reason)));
assert.ok(tracedPlan.every(x=>x.kind==='nouveau'));
assert.ok(tracedPlan.some(x=>x.reason==='equilibre_ouvertures'),
  'The existing opening diversity choice is explicitly traceable');
const priorSelection=JSON.stringify(traced.active.selection);
assert.deepEqual(P.load(JSON.stringify(traced)).active.selection,tracedPlan,
  'The selection motives survive a mid-session reload');
assert.deepEqual(P.start(traced,catalog).map(x=>x.id),tracedDeck.map(x=>x.id),
  'Instrumenting the plan never changes a resumed deck');
for(let i=0;i<tracedDeck.length;i++)
  assert.equal(P.record(traced,tracedDeck[i],'correct',i,tracedDeck[i].answer,false,false),true);
assert.equal(P.finish(traced,catalog),true);
assert.deepEqual(traced.journal[0].answers.map(x=>x.selectionReason),
  JSON.parse(priorSelection).map(x=>x.reason),
  'The original selection reasons are carried into the finished session');
const diag=P.selectionDiagnostics(traced);
assert.equal(diag.observedSessions,1);
assert.equal(diag.knownReasons,10);
assert.equal(diag.unknownReasons,0);
assert.equal(diag.questions,10);
assert.equal(Object.values(diag.themes).reduce((a,b)=>a+b,0),10);
assert.equal(Object.values(diag.reasons).reduce((a,b)=>a+b,0),10);
assert.equal(diag.perSession[0].largestThemeCount,10);
assert.equal(diag.perSession[0].largestThemeShare,1);
const rawBeforeDiagnostic=JSON.stringify(traced);
assert.deepEqual(P.exportProgress(traced,catalog,{}).selectionDiagnostics,diag);
assert.equal(JSON.stringify(traced),rawBeforeDiagnostic,
  'Read-only analysis must never mutate progress');
assert.deepEqual(P.load(rawBeforeDiagnostic).journal,traced.journal,
  'Saving/reloading does not erase selection explanations');
const exportedTraced=P.exportProgress(traced,catalog,{});
assert.deepEqual(P.importProgress(JSON.stringify(exportedTraced)).journal,traced.journal,
  'Existing import remains compatible with the new export');
const unseen=P.selectionDiagnostics({journal:[{mode:'parcours',session:14,
  answers:[{id:'HISTORICAL',theme:'sa',result:'correct'},
    {id:'HISTORICAL-2',theme:'majeur',result:'wrong'}]}]});
assert.equal(unseen.knownReasons,0,'No invented historical explanation');
assert.equal(unseen.unknownReasons,2);
assert.equal(unseen.perSession[0].distinctThemes,2);
assert.equal(unseen.perSession[0].topTwoThemeShare,1);
const balanced=P.selectionDiagnostics({journal:[{mode:'parcours',session:8,
  answers:[...Array(6)].map((_,i)=>({theme:i<4?'mineur':'majeur'}))}]});
assert.equal(balanced.perSession[0].largestThemeShare,0.667);
assert.equal(balanced.perSession[0].topTwoThemeShare,1);
console.log('QPJB ERGONOMIE NODE PASS : 13 séances, journal réel, export, migration, maîtrise et difficulté');