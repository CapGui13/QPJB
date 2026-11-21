'use strict';
// Complements the original 58-command, seven-browser historical baseline.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ci=read('.github/workflows/training-smoke.yml');
const pages=read('.github/workflows/verified-pages.yml');
const browserScripts=[
 'training-browser.cjs','training-offline.cjs','training-visual.cjs',
 'training-lot06-activation-browser.cjs','training-lot07-publication-browser.cjs',
 'quizz-browser.cjs','quizz-parcours-browser.cjs','quizz-ui-vnext-browser.cjs'
];
function job(source,name){
 const mark='\n  '+name+':\n',at=source.indexOf(mark);
 assert.ok(at>=0,'Missing mandatory job '+name);
 const rest=source.slice(at+mark.length),next=rest.search(/\n  [a-z0-9_-]+:\n/);
 return next<0?rest:rest.slice(0,next);
}
function verify(workflow,publication){
 const quick=job(workflow,'integrity'),long=job(workflow,'parcours-long'),
  chromium=job(workflow,'smoke'),webkit=job(workflow,'webkit');
 assert.ok(long.includes('node tests/quizz-parcours.cjs'),'Missing long profile simulation');
 for(const guard of [
  'node tests/ci-training-workflow-guard.cjs',
  'node tests/wave2-ci-lot07-static.cjs',
  'node tests/wave2-ci-performance.cjs',
  'node tests/wave2-ci-pages-rollback.cjs',
  'node tests/wave2-ci-pages-conditions.cjs',
  'node tests/wave2-ci-coverage.cjs'
 ])assert.equal(quick.split('\n').filter(line=>line.trim()===guard).length,1,
  'Quick audit must execute exactly once '+guard);
 for(const [engine,body] of [['chromium',chromium],['webkit',webkit]]){
  const prefix='PW_BROWSER='+(engine==='chromium'?'$'+'{{ matrix.browser }}':'webkit')+' node tests/';
  for(const name of browserScripts){
   assert.equal(body.split('\n').filter(line=>line.trim()==='run: '+prefix+name).length,1,
    'Missing or duplicated '+engine+' browser run: '+name);
  }
  assert.equal(body.split('\n').filter(line=>line.trim()==='run: '+prefix+'wave2-ci-lot07-diagnostic-probe.cjs').length,1,
   'Missing failure probe '+engine);
  assert.ok(body.includes('artifacts/lot07-publication/'),'Loss of forensic artifacts '+engine);
  assert.ok(body.includes('if: always()'),'Screenshot uploader must run on test failure '+engine);
  assert.doesNotMatch(body,/^\s*continue-on-error:\s*true\s*$/m,'Browser failures must never be ignored');
  assert.doesNotMatch(body,/^\s*needs:/m,'Browser jobs must remain independent');
 }
 assert.ok(publication.includes("workflow_run.conclusion == 'success'"),'Pages success gate removed');
 assert.ok(publication.includes("workflow_run.head_branch == 'main'"),'Pages main branch gate removed');
 assert.ok(publication.includes("workflow_run.event != 'pull_request'"),'PR publication guard removed');
 assert.ok(publication.includes('ref: $'+'{{ github.event.workflow_run.head_sha }}'),
  'Publication exact tested SHA is no longer required');
}
verify(ci,pages);
for(const [brokenCi,brokenPages] of [
 [ci.replace('run: PW_BROWSER=webkit node tests/quizz-ui-vnext-browser.cjs','run: true'),pages],
 [ci.replace('run: PW_BROWSER=webkit node tests/wave2-ci-lot07-diagnostic-probe.cjs','run: true'),pages],
 [ci.replace('      - name: Retain WebKit visual screenshots and timings\n        if: always()',
             '      - name: Retain WebKit visual screenshots and timings\n        if: never()'),pages],
 [ci,pages.replace("workflow_run.event != 'pull_request'","workflow_run.event == 'pull_request'")]
])assert.throws(()=>verify(brokenCi,brokenPages),'Injected coverage regression must be detected');
console.log('WAVE2 CI COVERAGE PASS: 8 browser scripts + probe per engine, 6 quick guards, artifacts and Pages protected; 4 regressions rejected');

