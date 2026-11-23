#!/usr/bin/env node
'use strict';

// Test en lecture seule : node audits/v1-evolutions/pedagogie/verifier-propositions.cjs
// Ne modifie ni le Quiz SEF, ni le moteur V1, ni les fichiers des autres lots.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '../../..');
const {restoreApprovedContexts,validateApproved}=require('../../../tests/qpjb-sef-approved-2sa-20261123.cjs');
const BASE = '1736c99561dd83b0d9e279747066f32274ec8771';
const BLOB = '9497e948792b22249e1eb8db2864972dc38efbab';
const SOURCE_PATHS = [
  'propositions-mineures-fit-20.json',
  'propositions-roudi-conventions-16.json'
];

function loadJson(filename) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, filename), 'utf8'));
}
function loadRootJson(filename) {
  return JSON.parse(fs.readFileSync(path.join(root, filename), 'utf8'));
}
function same(actual, expected, where) {
  assert.deepEqual(actual, expected, where);
}
function pointCount(hand) {
  const values = { A: 4, R: 3, D: 2, V: 1 };
  return hand.flat().reduce((sum, rank) => sum + (values[rank] || 0), 0);
}
function validateHand(hand, id) {
  assert.equal(hand.length, 4, id + ' : quatre couleurs obligatoires');
  const ranks = new Set(['A', 'R', 'D', 'V', '10', '9', '8', '7', '6', '5', '4', '3', '2']);
  const cards = hand.flat();
  assert.equal(cards.length, 13, id + ' : main de treize cartes');
  for (const suit of hand) {
    assert.equal(new Set(suit).size, suit.length, id + ' : doublon dans une couleur');
    for (const rank of suit) assert(ranks.has(rank), id + ' : rang inconnu ' + rank);
  }
}

const html = fs.readFileSync(path.join(root, 'quizz.html'), 'utf8');
// Le SHA du fichier HTML reste une provenance historique des propositions.
 // Pour contrôler le catalogue, comparer seulement le JSON embarqué : la
 // nouvelle interface est autorisée tant que chaque QCM reste identique.
const marker = '<script id="training-data" type="application/json">';
const start = html.indexOf(marker);
assert(start >= 0, 'Source training-data introuvable');
const stop = html.indexOf('</script>', start);
assert(stop > start, 'Fin training-data introuvable');
const json = html.slice(start + marker.length, stop);
validateApproved(json);
const historicalJson=restoreApprovedContexts(json);
const actualQcmBlob = crypto.createHash('sha1')
  .update('blob ' + Buffer.byteLength(historicalJson) + '\0')
  .update(historicalJson)
  .digest('hex');
assert.equal(actualQcmBlob, '75e359c7d91d32212d79a84993f9e55fd514b7dd',
  'Catalogue des 1523 QCM modifié : revoir et valider les propositions avant application.');
const data = JSON.parse(json);
assert.equal(data.exercises.length, 1523, 'Attendu : 1523 QCM au commit imposé');
// Les snapshots V1 doivent être comparés au catalogue historique reconstruit.
// validateApproved() vérifie séparément chaque changement de texte candidat.
const historicalData=JSON.parse(historicalJson);
const liveById = new Map(historicalData.exercises.map(q => [q.id, q]));
assert.equal(liveById.size, data.exercises.length, 'Doublons IDs dans le catalogue de référence');

const approved = loadRootJson('Docs/PARCOURS_V2_DECISIONS_PEDAGOGIQUES_UTILISATRICE_20261120.json');
const approvedIds = new Set(approved.caseDecisions.map(d => d.id));
assert.equal(approvedIds.size, 19, 'Registre des 19 décisions attendues');
const lotD = loadRootJson('audits/QPJB_V1_LOT_D_11_INTEGRATION_20261121.json');
const protectedLotD = new Set(lotD.proposals.map(q => q.id));
assert.equal(protectedLotD.size, 11, '11 décisions Lot D attendues');
const separateClosures = new Set(['SEF-V44-008', 'SEF-V44-054']);
const count = {};
const seen = new Set();
let total = 0;
for (const file of SOURCE_PATHS) {
  const batch = loadJson(file);
  assert.equal(batch.schema, 'QPJB_MISSION1_PROPOSITIONS_SEF_1');
  assert.equal(batch.sourceRef, BASE);
  assert.equal(batch.sourceQuizBlob, BLOB);
  assert.equal(batch.proposals.length, batch.count);
  for (const p of batch.proposals) {
    total++;
    assert(!seen.has(p.id), 'ID en double : ' + p.id);
    seen.add(p.id);
    assert(!approvedIds.has(p.id), 'Cas validé par utilisatrice à préserver : ' + p.id);
    assert(!protectedLotD.has(p.id), 'Lot D déjà décidé : ' + p.id);
    assert(!separateClosures.has(p.id), 'Correction distincte déjà actée : ' + p.id);
    const q = liveById.get(p.id);
    assert(q, 'ID absent du Quiz : ' + p.id);
    const s = p.source;
    same(s.baseCommit, BASE, p.id + ' commit');
    same(s.quizzHtmlBlob, BLOB, p.id + ' blob');
    same(s.caseFamily, q.caseFamily, p.id + ' famille');
    same(s.main, q.hand, p.id + ' main');
    validateHand(s.main, p.id);
    same(s.pointsH, q.h, p.id + ' points affichés');
    same(pointCount(s.main), q.h, p.id + ' recomptage H');
    same(s.distribution, q.shape, p.id + ' distribution');
    same(s.distribution, s.main.map(suit => suit.length), p.id + ' forme/main');
    same(s.sequence, q.auction, p.id + ' séquence');
    same(s.choix, q.choices, p.id + ' choix');
    same(s.corrigeActuel, {
      contexte: q.context,
      bonneReponse: q.answer,
      explication: q.explain,
      motifDifficulte: q.difficultyReason,
      niveau: q.difficulty
    }, p.id + ' corrigé source');
    same(p.theme, q.theme, p.id + ' thème');
    assert.equal(p.statut, 'PROPOSITION_EDITORIALE_NON_VALIDEE');
    assert.equal(p.nouvelleRedactionComplete.bonneReponse, q.answer, p.id + ' réponse non modifiable');
    same(p.nouvelleRedactionComplete.choix, q.choices, p.id + ' distracteurs non modifiables');
    same(p.nouvelleRedactionComplete.niveau, q.difficulty, p.id + ' niveau non modifiable');
    assert.equal(p.alternativesRecevablesParmiChoix.length, 0, p.id + ' alternatives signalées à valider');
    assert.equal(Object.keys(p.analyseAutresChoix).length, 3, p.id + ' trois distracteurs analysés');
    for (const c of q.choices) {
      assert.equal(c === q.answer ? !Object.hasOwn(p.analyseAutresChoix, c) : !!p.analyseAutresChoix[c], true, p.id + ' : analyse de ' + c);
    }
    for (const field of ['contexte', 'explication', 'motifDifficulte']) {
      const newText = p.nouvelleRedactionComplete[field];
      assert(typeof newText === 'string' && newText.length >= (field === 'motifDifficulte' ? 45 : 70), p.id + ' : ' + field + ' doit être individualisé');
      assert.notEqual(newText, s.corrigeActuel[field], p.id + ' : aucun changement réel sur ' + field);
    }
    for (const field of ['problemeDemontre', 'justificationSEF']) {
      assert(typeof p[field] === 'string' && p[field].length >= 55, p.id + ' : justification incomplète ' + field);
    }
    assert(p.nouvelleRedactionComplete.explication.includes(q.answer), p.id + ' : la bonne réponse doit figurer dans l’explication');
    count[q.theme] = (count[q.theme] || 0) + 1;
  }
}
assert(total >= 30 && total <= 40, 'Objectif de la mission : 30 à 40 QCM');
assert.equal(total, 36);
same(count, { mineur: 12, apres_fit: 8, roudi: 9, drury: 3, multilandy: 2, rubensohl: 2 }, 'Répartition cible');
const case053 = loadJson(SOURCE_PATHS[0]).proposals.find(p => p.id === 'SEF-V44-053');
assert.equal(case053?.nouvelleRedactionComplete.bonneReponse, '3♦', 'Ne pas réouvrir le verdict SEF-V44-053');
process.stdout.write('OK : ' + total + ' QCM réels, mains et 13 cartes, points, réponses inchangées, trois distracteurs par QCM, 19 décisions et Lot D préservés.\n');
process.stdout.write('Répartition : ' + JSON.stringify(count) + '\n');
