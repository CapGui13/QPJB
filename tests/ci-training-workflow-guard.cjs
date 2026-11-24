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
  assert.match(body, /^    needs: plan$/m, 'Parallel job must wait only for plan: ' + name);
  assert.match(body, /needs\.plan\.outputs\.level == 'FULL'/);
}
const archive = read('.github/workflows/quiz-sef-integrite.yml');
assert.match(archive,/if: github\.event_name == 'workflow_dispatch'/);
assert.match(archive,/ref: 287bc05fd77d40fcfb98c5927152093e0555c97c/);
assert.match(quick,/python3 scripts\/verify_quiz_sef\.py --html quizz\.html --min-count 1523/);
assert.match(quick,/node tests\/quizz-catalogue-live\.cjs/);
assert.match(long,/node tests\/quizz-catalogue-live\.cjs --simulate/);
assert.match(job('quick'),/node scripts\/ci-routine\.cjs --qcm/);
assert.match(job('quick'),/node tests\/quizz-catalogue-live\.cjs/);
// QUICK and FULL are mutually exclusive; count each legacy command once in FULL or the manual archive.
const commands = (ci.replace(job('quick'),'')+'\n'+archive).split(/\r?\n/).map(line => line.trim());
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
assert(pages.includes('node scripts/ci-publication-guard.cjs verify'),'Explicit source verdict gate missing');
assert(pages.includes('git/ref/heads/main'),'Exact current main recheck missing');
assert.match(job('integrity'), /needs\.plan\.outputs\.level == 'FULL'/);
assert.match(job('quick'), /python3 scripts\/ci-quick-check\.py --base "\$BASE" --head "\$HEAD"/);
for(const browser of ['chromium','webkit']) {
  assert.match(job('ui-'+browser), /node tests\/ci-ui-targeted\.cjs/);
  assert.match(job('ui-'+browser), /needs\.plan\.outputs\.level == 'UI'/);
}
assert.match(job('verdict'), /if: always\(\)/);
assert.match(job('verdict'), /needs: \[plan, quick, ui-chromium, ui-webkit, integrity, parcours-long, smoke, webkit\]/);
assert.match(job('verdict'), /node scripts\/ci-orchestration-verdict\.cjs/);
assert.match(pages, /needs\.pages-source\.outputs\.publish == 'true'/);
console.log('PASS: ' + baseline.requiredCommands.length +
  ' CLI tests preserved (current or manual historical edition), 7 browser scripts per engine, guarded Pages.');
