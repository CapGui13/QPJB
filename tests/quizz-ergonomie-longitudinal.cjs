'use strict';
/*
 * Simulation longitudinale sans donnees personnelles : 13 seances fictives,
 * puis 10 seances consecutives sur le moteur et les 1 523 QCM reels.
 * Aucun resultat de joueur n'est envoye ni reconstruit.
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
function run(name, answerFor) {
  const state = P.empty(), rows = [], global = new Set();
  let repetitions = 0, initial = 0, following = 0;
  for (let round = 0; round < 23; round++) {
    const old = new Set(Object.keys(state.entries));
    const picked = P.start(state, exercises);
    assert.equal(picked.length, 10, 'Seance ' + (round + 1));
    assert.equal(new Set(picked.map(q => q.id)).size, 10, 'Unicite des QCM');
    assert.equal(new Set(picked.map(fam)).size, 10, 'Unicite des familles');
    const repeated = picked.filter(q => old.has(q.id));
    const fresh = picked.length - repeated.length;
    const weak = picked.filter(q => {
      const previous = state.entries[q.id];
      return previous && (previous.result !== 'correct' || previous.assisted);
    }).length;
    if (round >= 13) {
      assert.ok(repeated.length <= 2,
        'Au plus deux rappels en seance ' + (round + 1) + ', observe ' + repeated.length);
      assert.ok(fresh >= 8, 'Au moins huit QCM nouveaux en seance ' + (round + 1));
      following += repeated.length;
    } else initial += repeated.length;
    const topics = new Set(picked.map(q => q.theme));
    rows.push({session:round + 1, fresh, repeated:repeated.length,
      weakRecalled:weak, themes:topics.size});
    picked.forEach((q, position) => {
      const result = answerFor({round, position, q, state});
      assert.ok(P.record(state, q, result, position,
        result === 'correct' ? q.answer : null, false, false));
      global.add(q.id);
    });
    assert.ok(P.finish(state, exercises), 'Fin de seance');
    if (round === 12) {
      assert.equal(state.completed, 13);
      assert.equal(state.journal.length, 13);
      repetitions = global.size;
    }
  }
  const recent = rows.slice(13);
  assert.equal(state.completed, 23);
  assert.equal(state.journal.length, 23);
  assert.ok(recent.some(r => r.themes >= 4),
    'Les rappels ne doivent pas remplacer la diversite des notions');
  const report = {
    scenario: name,
    first13: {distinct: repetitions, repeated: initial, total: 130},
    next10: {
      distinctNew: 100 - following,
      repeated: following,
      repeatedPct: following,
      maxRepeatedPerSession: Math.max(...recent.map(r => r.repeated)),
      themesPerSession: recent.map(r => r.themes),
      weakRecallCount: recent.reduce((n, r) => n + r.weakRecalled, 0)
    },
    perSession: recent
  };
  console.log('LONGITUDINAL ' + JSON.stringify(report));
  return report;
}
const fluent = run('reussites-autonomes', () => 'correct');
const mixed = run('erreurs-moderees', ({round, position, q}) =>
  ((round + position) % 7 === 0 && q.difficulty >= 2) ? 'wrong' : 'correct');
const fragile = run('fragilites-persistantes', ({round, position}) =>
  ((round * 3 + position) % 4 === 0) ? 'wrong' : 'correct');
assert.ok(fluent.next10.distinctNew >= 80);
assert.ok(mixed.next10.distinctNew >= 80);
assert.ok(fragile.next10.distinctNew >= 80);
console.log('QPJB LONGITUDINAL PASS : 3 profils x 23 seances, tous les tirages verifies');
