'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const approved=require('./quizz-v496-approved-revisions.json');
const {normalizedPrefix}=require('./quizz-v488-approved-revisions.cjs');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const m=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(m,'Embedded quiz data');
const db=JSON.parse(m[1]),xs=db.exercises;
assert.equal(xs.length,1223);assert.equal(db.themes.length,22);
assert.equal(new Set(xs.map(x=>x.id)).size,1223,'Unique QCM identifiers');
assert.deepEqual(Object.keys(approved),['SEF-N108-1','SEF-N114-1','SEF-N116-1','SEF-V3-005-1','SEF-V3-007-4','SEF-V3-009-1','SEF-V3-025-1','SEF-V3-026-1','SEF-V4-045-1']);
for(const [id,row] of Object.entries(approved)){
 const x=xs.find(z=>z.id===id);
 assert.deepEqual(x,row.after,id+' exact approved editorial revision');
 for(const k of ['answer','choices','hand','h','shape','auction','theme','context','difficulty','difficultyReason','caseFamily'])
  assert.deepEqual(x[k],row.before[k],id+' '+k+' unchanged');
 assert.equal(x.sourceOriginalExplain20261105V496,row.before.explain);
 assert.equal(x.hand.flat().reduce((n,c)=>n+({A:4,R:3,D:2,V:1}[c]||0),0),x.h,id+' exact H points');
}
assert.match(xs.find(x=>x.id==='SEF-N108-1').explain,/fit 4–4/);
assert.match(xs.find(x=>x.id==='SEF-N114-1').explain,/trois Cœurs/);
assert.match(xs.find(x=>x.id==='SEF-V3-009-1').explain,/quatre Cœurs et quatre Piques/);
assert.match(xs.find(x=>x.id==='SEF-V3-025-1').explain,/4♥/);
assert.match(xs.find(x=>x.id==='SEF-V3-026-1').explain,/4♠/);
assert.match(xs.find(x=>x.id==='SEF-V4-045-1').explain,/neuf cartes/);
const baseline=require('./quizz-baseline-1223-gitsha.json');
const original=JSON.stringify(normalizedPrefix(xs,baseline.count));
const sha=createHash('sha1').update('blob '+Buffer.byteLength(original,'utf8')+'\0'+original,'utf8').digest('hex');
assert.equal(sha,baseline.gitBlobSha,'1223 historical QCM restored by approved snapshots');
console.log('PASS | V4.96 nine precise explanations, 1223 protected, no answer/hand/choice changes');
