'use strict';
/*
 * Benchmark V1 sur le vrai catalogue de 1 523 QCM, sans donnee personnelle.
 * Distinguer une NOUVELLE question de la DECOUVERTE d'une nouvelle notion :
 * un rappel alternatif peut utiliser une question encore jamais vue.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const P = require('../quizz-parcours.js');
const html = fs.readFileSync(path.join(__dirname, '../quizz.html'), 'utf8');
const match = html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match, 'Catalogue QPJB present');
const exercises = JSON.parse(match[1]).exercises;
assert.equal(exercises.length, 1523, 'Le catalogue de reference est intact');
const fam = q => q.caseFamily || q.id;
const add = (rows, key) => rows.reduce((n, row) => n + row[key], 0);
function run(name, answerFor) {
  const state = P.empty(), rows = [], global = new Set();
  let initialRepeated = 0, first13Distinct = 0;
  for (let round = 0; round < 23; round++) {
    const old = new Set(Object.keys(state.entries));
    const picked = P.start(state, exercises);
    assert.equal(picked.length, 10, 'Seance ' + (round + 1));
    assert.equal(new Set(picked.map(q => q.id)).size, 10, 'Unicite des QCM');
    assert.equal(new Set(picked.map(fam)).size, 10, 'Unicite des familles');
    const selection = state.active.selection;
    assert.equal(selection.length, 10, 'Tous les motifs de selection sont tracables');
    assert.deepEqual(selection.map(x => x.id), picked.map(x => x.id));
    assert.ok(selection.every(x => P.SELECTION_REASONS.includes(x.reason)));

    // Une question inconnue peut faire office de RAPPEL d'une notion deja vue.
    // Les anciens chiffres "repeated" ne mesuraient que les IDs reposes.
    const direct = selection.filter(x => x.kind === 'revision' && old.has(x.id)).length;
    const alternate = selection.filter(x => x.kind === 'revision' && !old.has(x.id)).length;
    const discoveries = selection.filter(x => x.kind === 'nouveau' && !old.has(x.id)).length;
    const repeated = picked.filter(q => old.has(q.id));
    assert.equal(direct, repeated.length, 'Un ID deja vu doit etre trace en revision');
    assert.equal(direct + alternate + discoveries, 10,
      'Chaque question est une decouverte ou un type de rappel reel');
    assert.ok(selection.every(x => !old.has(x.id) || x.kind === 'revision'));
    const alternateItems = selection.filter(x => x.kind === 'revision' && !old.has(x.id));
    assert.ok(alternateItems.every(x => x.reason === 'rappel_nouvelle_situation'),
      'Un rappel alternatif doit conserver une provenance explicite');
    const directItems = selection.filter(x => x.kind === 'revision' && old.has(x.id));
    assert.ok(directItems.every(x => x.reason !== 'rappel_nouvelle_situation'),
      'Un rappel direct ne peut pas porter le motif de nouvelle situation');

    for (const q of repeated) {
      const prior = state.entries[q.id], age = round - prior.lastSession;
      assert.ok(prior.due <= round, 'Rappel jamais avant la date prevue : ' + q.id);
      if (prior.result === 'correct' && !prior.assisted) {
        const wait = prior.streak >= 3 ? 19 : prior.streak === 2 ? 11 : 5;
        assert.ok(age >= wait, 'Intervalle autonome respecte pour ' + q.id);
      }
    }
    const weak = repeated.filter(q => {
      const previous = state.entries[q.id];
      return previous.result !== 'correct' || previous.assisted;
    }).length;
    if (round >= 13) {
      assert.ok(direct <= 2, 'Pas plus de deux repetitions directes');
      assert.ok(direct + alternate <= 2, 'Pas plus de deux rappels au total');
      assert.ok(discoveries >= 8, 'Le parcours garde au moins huit decouvertes');
    } else initialRepeated += repeated.length;

    const themes = new Set(picked.map(q => q.theme));
    const reasons = Object.fromEntries(P.SELECTION_REASONS.map(key =>
      [key, selection.filter(x => x.reason === key).length]));
    const row = {session: round + 1, discoveries, alternate, direct, 
      freshIds: 10 - direct, repeated: repeated.length,
      weakRecalled: weak, themes: themes.size, reasons, assistedCorrect: 0};
    picked.forEach((q, position) => {
      const raw = answerFor({round, position, q, state});
      const result = typeof raw === 'string' ? raw : raw.result;
      const assisted = typeof raw === 'object' && !!raw.assisted;
      const hadFreeError = typeof raw === 'object' && !!raw.hadFreeError;
      if (result === 'correct' && (assisted || hadFreeError)) row.assistedCorrect++;
      assert.ok(P.record(state, q, result, position,
        result === 'correct' ? q.answer : null, assisted, hadFreeError));
      global.add(q.id);
    });
    rows.push(row);
    assert.ok(P.finish(state, exercises), 'Fin de seance');
    if (round === 12) {
      assert.equal(state.completed, 13);
      assert.equal(state.journal.length, 13);
      first13Distinct = global.size;
    }
  }
  const recent = rows.slice(13), direct = add(recent, 'direct'),
    alternate = add(recent, 'alternate'), discoveries = add(recent, 'discoveries');
  assert.equal(direct + alternate + discoveries, 100);
  assert.equal(state.completed, 23);
  assert.equal(state.journal.length, 23);
  assert.ok(recent.some(row => row.themes >= 4),
    'Conserver la diversite des themes');
  const reasons = Object.fromEntries(P.SELECTION_REASONS.map(key =>
    [key, recent.reduce((n, row) => n + row.reasons[key], 0)]));
  const report = {
    scenario: name,
    first13: {distinct: first13Distinct, repeatedIds: initialRepeated, total: 130},
    next10: {
      discoveries, alternateReviews: alternate, directReviews: direct,
      trueReviews: direct + alternate,
      freshIds: 100 - direct,
      weakDirectReviews: add(recent, 'weakRecalled'),
      assistedCorrect: add(recent, 'assistedCorrect'),
      reasons,
      themesPerSession: recent.map(row => row.themes)
    },
    perSession: recent.map(({session, discoveries, alternate, direct, themes,
      weakRecalled}) => ({session, discoveries, alternate, direct, themes, weakRecalled}))
  };
  // Aucune retro-inference : ces trois groupes correspondent au plan reel
  // "selection", non a un jugement pedagogique de maitrise.
  console.log('LONGITUDINAL_RECALLS ' + JSON.stringify(report));
  return report;
}
const fluent = run('reussites-autonomes', () => 'correct');
const mixed = run('erreurs-moderees', ({round, position, q}) =>
  ((round + position) % 7 === 0 && q.difficulty >= 2) ? 'wrong' : 'correct');
const fragile = run('fragilites-persistantes', ({round, position}) =>
  ((round * 3 + position) % 4 === 0) ? 'wrong' : 'correct');
const assisted = run('aides-frequentes', ({round, position}) => ({
  result: 'correct', assisted: (round + position) % 5 === 0
}));
assert.ok(fluent.next10.discoveries >= 80,
  'Les reussites laissent de la place a la decouverte');
assert.ok(mixed.next10.discoveries >= 80);
assert.ok(fragile.next10.discoveries >= 80);
assert.ok(assisted.next10.discoveries >= 80);
assert.ok(mixed.next10.directReviews >= fluent.next10.directReviews,
  'Des erreurs doivent favoriser les rappels directs');
assert.ok(fragile.next10.directReviews >= fluent.next10.directReviews);
assert.ok(assisted.next10.directReviews >= fluent.next10.directReviews,
  'Une reussite aidee n'est pas une preuve autonome');
console.log('QPJB LONGITUDINAL RECALLS PASS : 4 profils x 23 seances, rappels reels classes');
