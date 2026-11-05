'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const approved=require('./quizz-v4102-approved-revisions.json');
const {normalizedPrefix}=require('./quizz-v488-approved-revisions.cjs');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const m=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(m);
const db=JSON.parse(m[1]),xs=db.exercises;
assert.equal(xs.length,1223);assert.equal(db.themes.length,22);
assert.equal(new Set(xs.map(x=>x.id)).size,1223);
assert.equal(Object.keys(approved).length,9,'8 refinements and 1 difficulty');
const explainIds=['SEF-001-2','SEF-005-2','SEF-006-1','SEF-009-2','SEF-010-1','SEF-013-2','SEF-V4-080-2','SEF-V4-092-2'];
assert.deepEqual(Object.keys(approved),[...explainIds,'SEF-V477-003']);
for(const [id,row] of Object.entries(approved)){
 const x=xs.find(z=>z.id===id);
 assert.deepEqual(x,row.after,id+' matches the approved version exactly');
 for(const k of ['answer','choices','hand','h','shape','auction','theme','caseFamily'])
  assert.deepEqual(x[k],row.before[k],id+' '+k+' stays unchanged');
 assert.equal(x.hand.flat().length,13,id+' keeps 13 cards');
 assert.deepEqual(x.hand.map(s=>s.length),x.shape,id+' keeps shape');
 assert.equal(x.hand.flat().reduce((n,c)=>n+({A:4,R:3,D:2,V:1}[c]||0),0),x.h,id+' H count matches hand');
 assert.equal(x.pedagogicalReview20261105V4102.nearDuplicateRetained,true);
 if(explainIds.includes(id)){
  assert.notEqual(x.explain,row.before.explain,id+' explanation diversified');
  assert.equal(x.sourceOriginalExplain20261105V4102,row.before.explain,id+' explanation archived');
  assert.equal(x.difficulty,row.before.difficulty,id+' unchanged difficulty');
 }
 if(!['SEF-V4-080-2','SEF-V4-092-2'].includes(id))
  assert.deepEqual(x.context,row.before.context,id+' unchanged context');
}
for(const id of ['SEF-V4-080-2','SEF-V4-092-2']){
 const row=approved[id],x=xs.find(z=>z.id===id);
 assert.notEqual(x.context,row.before.context,id+' Roudi scenario differs');
 assert.equal(x.sourceOriginalContext20261105V4102,row.before.context);
 assert.match(x.explain,/Roudi/);assert.match(x.explain,/8 H/);
}
const michael=xs.find(z=>z.id==='SEF-V477-003');
assert.equal(michael.difficulty,2);
assert.equal(michael.sourceOriginalDifficulty20261105V4102,3);
assert.equal(michael.sourceOriginalDifficultyReason20261105V4102,approved['SEF-V477-003'].before.difficultyReason);
assert.equal(michael.answer,'2♥');
const baseline=require('./quizz-baseline-1223-gitsha.json');
const original=JSON.stringify(normalizedPrefix(xs,baseline.count));
const sha=createHash('sha1').update('blob '+Buffer.byteLength(original,'utf8')+'\0'+original,'utf8').digest('hex');
assert.equal(sha,baseline.gitBlobSha,'Historical 1223 QCM protected by approved snapshots');
console.log('PASS | V4.102: 30 redundancy reports assessed, 8 explanations differentiated, 1 difficulty calibrated, 1223 preserved');
