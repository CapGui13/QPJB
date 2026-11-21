'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const ci = read('.github/workflows/training-smoke.yml');
const pages = read('.github/workflows/verified-pages.yml');
const baseline = JSON.parse(read('tests/ci-training-required-tests.json'));
function job(name) {
  const marker = '\n  ' + name + ':\n';
  const at = ci.indexOf(marker);
  assert(at >= 0, 'Missing CI job: ' + name);
  const rest = ci.slice(at + marker.length);
  const next = rest.search(/\n  [a-z0-9_-]+:\n/);
  return next < 0 ? rest : rest.slice(0, next);
}
assert.match(ci, /^name: QPJB Training smoke$/m);
assert.match(ci, /^  push:\s*\n    branches: \[main\]/m);
assert.match(ci, /^  pull_request:\s*\n    branches: \[main\]/m);
const quick = job('integrity');
const long = job('parcours-long');
const chromium = job('smoke');
const webkit = job('webkit');
assert.match(long, /node tests\/quizz-parcours\.cjs/);
assert.doesNotMatch(quick, /node tests\/quizz-parcours\.cjs/);
for (const [name, body] of [['parcours-long', long], ['smoke', chromium], ['webkit', webkit]]) {
  assert.doesNotMatch(body, /^    needs:/m, 'Parallel job incorrectly waits: ' + name);
}
const commands = ci.split(/\r?\n/).map(line => line.trim());
assert(baseline.requiredCommands.length >= 50, 'Incomplete historical baseline');
for (const command of baseline.requiredCommands) {
  assert.equal(commands.filter(line => line === command).length, 1,
    'Missing or duplicate historical CI command: ' + command);
}
const browsers = [
  'training-browser.cjs', 'training-offline.cjs', 'training-visual.cjs',
  'training-lot06-activation-browser.cjs', 'training-lot07-publication-browser.cjs',
  'quizz-browser.cjs', 'quizz-parcours-browser.cjs'
];
for (const [name, body] of [['Chromium', chromium], ['WebKit', webkit]]) {
  for (const test of browsers) assert(body.includes('node tests/' + test),
    name + ' must retain ' + test);
}
assert.match(pages, /workflows: \["QPJB Training smoke"\]/);
assert.match(pages, /workflow_run\.conclusion == 'success'/);
assert.match(pages, /workflow_run\.head_branch == 'main'/);
assert.match(pages, /workflow_run\.event != 'pull_request'/);
assert(pages.includes('ref: ${{ github.event.workflow_run.head_sha }}'),
  'Pages must checkout the exact tested commit');
assert(pages.includes('git merge-base --is-ancestor'),
  'Pages ancestry check missing');
assert(pages.includes('git diff --name-only "$VERIFIED" origin/main'),
  'Pages must reject unvalidated content changes');
console.log('PASS: ' + baseline.requiredCommands.length +
  ' historical CLI tests, 7 browser scripts per engine, independent jobs, guarded Pages.');
