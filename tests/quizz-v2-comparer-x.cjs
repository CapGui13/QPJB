'use strict';
/* V2-X: defensive checks on an OFFLINE score-only clone of unchanged V2-F. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const F=require('../scripts/parcours-v2-pilot.cjs');
const X=require('../scripts/parcours-v2-comparer-x.cjs');
const sourceFile=require.resolve('../scripts/parcours-v2-pilot.cjs');
const sourceBefore=fs.readFileSync(sourceFile,'utf8');
const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
const answersBefore=catalog.map(q=>q.answer);
const idsBefore=catalog.map(q=>q.id);
assert.equal(catalog.length,1523);
assert.equal(annotations.size,79);
assert.equal(sourceBefore.split(X.ANCHOR).length,2);
assert.deepEqual(Object.keys(X.TARGETS),['reference','mild','early']);
assert.deepEqual([1,5,6,12,18,22,24,30,34,36,45].map(n=>
  X.targetAt('reference',n-1)),[1,1,1,1,2,2,2,3,3,3,4]);
assert.equal(X.targetAt('mild',5),1);
assert.equal(X.targetAt('mild',6),2);
assert.equal(X.targetAt('early',5),2);
assert.equal(X.targetAt('early',18),3);
assert.equal(X.targetAt('mild',22),3);
assert.equal(X.targetAt('early',30),4);
assert.equal(X.targetAt('reference',48),5);
assert.throws(()=>X.makeEngine('invented'),/Variante inconnue/);
assert.throws(()=>X.targetAt('invented',0),/inconnu/);
const originalSelect=F.select, originalSimulate=F.simulateV2, originalScoreSource=fs.readFileSync(sourceFile,'utf8');
const engines=['reference','mild','early'].map(X.makeEngine);
assert.equal(engines[0],F);
assert.notEqual(engines[1],F);
assert.notEqual(engines[2],F);
for(const e of engines){
  assert.deepEqual(Object.keys(e).sort(),Object.keys(F).sort());
  assert.equal(e.available,F.available===e.available?F.available(e.loadCatalog()[0],0,annotations):e.available(catalog[0],0,annotations));
}
const opts={sessions:12,seed:13,profile:'balanced'};
const a=engines[0].simulateV2(catalog,annotations,opts);
const b=engines[1].simulateV2(catalog,annotations,opts);
const c=engines[2].simulateV2(catalog,annotations,opts);
assert.equal(a.sessions.length,12);
for(const x of [a,b,c]){
 assert.equal(x.metrics.questionCount,120);
 assert.equal(x.metrics.repeatedFamilySessions,0);
 assert.deepEqual(x.sessions.slice(0,5).map(d=>d.map(q=>q.id)),
   a.sessions.slice(0,5).map(d=>d.map(q=>q.id)));
 assert.ok(x.sessions.flat().every(q=>catalog.includes(q)));
}
const before=X.summarize(a,catalog,annotations);
for(const cand of [b,c]){
  const after=X.summarize(cand,catalog,annotations);
  const v=X.compare(before,after,a,cand);
  assert.equal(v.earlyFiveIdentical,true);
  assert.equal(typeof v.guardPass,'boolean');
  assert.equal(v.guardPass,v.guardReasons.length===0);
  assert.ok(Number.isInteger(v.familyDifference));
  assert.ok(Number.isInteger(v.recallDifference));
}
assert.equal(F.select,originalSelect);
assert.equal(F.simulateV2,originalSimulate);
assert.equal(fs.readFileSync(sourceFile,'utf8'),originalScoreSource);
assert.equal(fs.readFileSync(sourceFile,'utf8'),sourceBefore);
assert.deepEqual(catalog.map(q=>q.answer),answersBefore);
assert.deepEqual(catalog.map(q=>q.id),idsBefore);
console.log('QPJB V2 X PASS : exact score-only clones, first 5 sessions identical, 0 source mutation');
