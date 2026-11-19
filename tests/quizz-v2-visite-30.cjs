'use strict';
// Regression : faithful 30-session review is generated from the original engine and catalog.
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const V=require('../scripts/parcours-v2-visite-30.cjs');
const F=require('../scripts/parcours-v2-pilot.cjs');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'scripts/parcours-v2-pilot.cjs'),'utf8');
const quizzes=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const report=V.generate();
assert.equal(report.catalogCount,1523);
assert.equal(report.scenarios.length,3);
assert.equal(report.sessionsPerScenario,30);
assert.equal(report.realLearners,false);
assert.equal(report.publicSiteModified,false);
const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
const byId=new Map(catalog.map(x=>[x.id,x]));
for(const s of report.scenarios){
 assert.equal(s.sessions.length,30);
 assert.equal(s.summary.questions,300);
 const original=F.simulateV2(catalog,annotations,
  {sessions:30,seed:s.seed,profile:s.profile});
 assert.deepEqual(s.sessions.map(d=>d.questions.map(q=>q.id)),
   original.sessions.map(d=>d.map(q=>q.id)),
   'Report and real engine must select identical QCM and order');
 for(const d of s.sessions){
  assert.equal(d.questions.length,10);
  assert.equal(new Set(d.questions.map(q=>q.family)).size,10);
  assert.equal(d.scheduledRecalls,d.questions.filter(q=>q.scheduledRecall).length);
  for(const q of d.questions){
   const src=byId.get(q.id);assert.ok(src);
   for(const key of ['answer','context','explain','auction','hand','choices','difficulty'])
    assert.deepEqual(q[key],src[key],'Original field changed '+q.id+' '+key);
  }
 }
}
const page=V.html(report);
assert.ok(page.includes('AUDIT HORS PRODUCTION'));
assert.ok(page.includes('type="application/json" id="dataset"'));
assert.ok(!page.includes('https://'),'Offline standalone report has no network dependencies');
const dataBlock=page.match(/<script type="application\/json" id="dataset">([\s\S]*?)<\/script>/);
assert.ok(dataBlock,'Embedded data missing');
const embedded=JSON.parse(dataBlock[1]);
assert.deepEqual(embedded,report,'HTML and JSON report must match');
const scripts=[...page.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length,2);
new vm.Script(scripts[1][1],{filename:'visite-30-seances.html'});
assert.equal(fs.readFileSync(path.join(root,'scripts/parcours-v2-pilot.cjs'),'utf8'),source);
assert.equal(fs.readFileSync(path.join(root,'quizz.html'),'utf8'),quizzes);
console.log('QPJB V2 VISITE30 PASS — 3 profils × 300 vrais QCM ; identité tirages V2-F, scripts HTML valides, 0 mutation');
