'use strict';
// Préparation d'un artefact V2 privé : aucune écriture sur le site QPJB.
// Le fichier livré est une copie binaire exacte de la page élève de la PR #214.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');

const root = path.resolve(__dirname, '..');
const sourceDir = path.resolve(root, process.env.QPJB_V2_SOURCE_DIR || 'source-v2');
const expectedCommit = process.env.QPJB_V2_SOURCE_SHA;
const expectedBlob = process.env.QPJB_V2_EXPECTED_BLOB;
assert.match(expectedCommit || '', /^[0-9a-f]{40}$/, 'Commit source exact requis');
assert.match(expectedBlob || '', /^[0-9a-f]{40}$/, 'Git blob source exact requis');
const currentSourceCommit = cp.execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: sourceDir, encoding: 'utf8'
}).trim();
assert.equal(currentSourceCommit, expectedCommit, 'Le commit V2 téléchargé a changé');

const relative = 'preview/v2-eleve/parcours-sef-65.html';
const htmlBytes = fs.readFileSync(path.join(sourceDir, relative));
const html = htmlBytes.toString('utf8');
const actualBlob = crypto.createHash('sha1')
  .update('blob ' + htmlBytes.length + '\0').update(htmlBytes).digest('hex');
assert.equal(actualBlob, expectedBlob, 'Le fichier élève source a changé');

function embeddedJSON(text, marker) {
  const first = text.indexOf(marker);
  assert.ok(first >= 0, 'Bloc de données introuvable : ' + marker);
  assert.equal(text.indexOf(marker, first + marker.length), -1, 'Bloc de données répété');
  const begin = first + marker.length;
  const end = text.indexOf('</script>', begin);
  assert.ok(end > begin, 'Fin du bloc de données introuvable');
  return JSON.parse(text.slice(begin, end));
}

const student = embeddedJSON(html, '<script id="ay-payload" type="application/json">');
const quiz = fs.readFileSync(path.join(sourceDir, 'quizz.html'), 'utf8');
const original = embeddedJSON(quiz, '<script id="training-data" type="application/json">').exercises;
const review = JSON.parse(fs.readFileSync(path.join(sourceDir,
  'Docs/PARCOURS_V2_PHASE_AL_MANIFESTE_ARBITRAGE_20261119.json'), 'utf8'));

assert.equal(student.schema, 'QPJB_V2_BG_STUDENT_PREVIEW_1');
assert.equal(student.catalog.length, 1523, 'Catalogue SEF incorrect');
assert.equal(new Set(student.catalog.map(q => q.id)).size, 1523, 'ID QCM répété');
assert.deepEqual(student.catalog, original, 'Corpus élève différent du Quiz SEF original');
assert.deepEqual(student.addons, [], 'Ajout expérimental interdit');
assert.equal(student.sourceModified, false);
assert.equal(student.releaseDecision, 'HOLD');
assert.ok(html.includes('const STUDENT_ONLY=true;'), 'Mode élève non imposé');
assert.ok(html.includes('const MAX_SESSIONS=65;'), '65 séances non garanties');
assert.ok(html.includes('qpjb-preview-v2-eleve-01'), 'Sauvegarde isolée absente');
assert.ok(html.includes('function studentProgress()'), 'Suivi de progression absent');
assert.ok(html.includes('id="sef-session-grid"'), 'Grille de progression absente');
assert.equal(review.cases.length, 19, 'Revue des 19 cas incomplète');
assert.ok(review.cases.every(c => c.editorialApproval === 'PENDING'),
  'Statut éditorial inattendu : actualiser le paquet source');
assert.equal(review.teacherApproval, false, 'Approbation enseignante inattendue');
assert.equal(review.releaseDecision, 'HOLD', 'Une décision de publication a changé');

const outputDir = path.join(root, 'artifacts/v2-release-candidate');
fs.mkdirSync(outputDir, {recursive: true});
const fileName = 'QPJB_V2_65_SEANCES_APERCU_NON_PUBLIE.html';
fs.writeFileSync(path.join(outputDir, fileName), htmlBytes);
const manifest = {
  schema: 'QPJB_V2_RELEASE_CANDIDATE_1',
  sourceCommit: expectedCommit,
  sourceBlobSHA1: expectedBlob,
  sha256: crypto.createHash('sha256').update(htmlBytes).digest('hex'),
  file: fileName,
  bytes: htmlBytes.length,
  qcmOriginaux: 1523,
  suppléments: 0,
  séances: 65,
  questionsParSéance: 10,
  sauvegardeLocale: 'qpjb-preview-v2-eleve-01',
  revueÉditoriale: {cas: 19, approuvés: 0},
  statut: 'HOLD',
  publicationAutorisée: false,
  fusionEffectuée: false,
  déploiementEffectué: false
};
fs.writeFileSync(path.join(outputDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2) + '\n');
console.log('QPJB V2 CANDIDATE PREVIEW ONLY ' + JSON.stringify(manifest));
