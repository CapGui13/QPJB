'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const approved=require('./quizz-v4101-approved-revisions.json');
const {normalizedPrefix}=require('./quizz-v488-approved-revisions.cjs');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const m=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(m);
const db=JSON.parse(m[1]),xs=db.exercises;
assert.ok(xs.length>=1223);assert.equal(db.themes.length,22);
assert.equal(new Set(xs.map(x=>x.id)).size,xs.length);
assert.equal(Object.keys(approved).length,9);
const expected={'SEF-V3-051-1':'1♠','SEF-V3-051-3':'1♠','SEF-V3-052-1':'2♥','SEF-V3-052-2':'2♥','SEF-V3-053-1':'1♠','SEF-V3-053-3':'1♠','SEF-V3-054-1':'1♥','SEF-V3-054-2':'1♥','SEF-V3-056-4':'2♦'};
assert.deepEqual(Object.keys(approved),Object.keys(expected));
for(const [id,row] of Object.entries(approved)){
 const x=xs.find(y=>y.id===id);
 assert.deepEqual(x,row.after,'Approved version for '+id);
 for(const k of ['answer','hand','h','shape','auction','theme','context','caseFamily'])
  assert.deepEqual(x[k],row.before[k],id+' '+k+' unchanged');
 assert.equal(x.answer,'Passe');assert.equal(x.choices.length,4);
 assert.equal(new Set(x.choices).size,4);assert.ok(x.choices.includes(expected[id]));
 assert.ok(!x.choices.includes('2♣'));
 assert.deepEqual(x.sourceOriginalChoices20261105V4101,row.before.choices);
 assert.equal(x.sourceOriginalExplain20261105V4101,row.before.explain);
 assert.equal(x.hand.flat().length,13);assert.deepEqual(x.hand.map(z=>z.length),x.shape);
 assert.equal(x.hand.flat().reduce((s,c)=>s+({A:4,R:3,D:2,V:1}[c]||0),0),x.h);
}
for(const id of ['SEF-V3-051-3','SEF-V3-052-1']){
 const x=xs.find(y=>y.id===id);
 assert.equal(x.difficulty,2);assert.equal(x.sourceOriginalDifficulty20261105V4101,3);
}
for(const id of Object.keys(expected).filter(x=>!['SEF-V3-051-3','SEF-V3-052-1'].includes(x)))assert.equal(xs.find(x=>x.id===id).difficulty,3);
const baseline=require('./quizz-baseline-1223-gitsha.json');
const original=JSON.stringify(normalizedPrefix(xs,baseline.count));
const sha=createHash('sha1').update('blob '+Buffer.byteLength(original,'utf8')+'\0'+original,'utf8').digest('hex');
assert.equal(sha,baseline.gitBlobSha,'1223 historical exercises fully restored');
console.log('PASS | V4.101: 9 credible intervention distractors, two difficulty adjustments, 1223 protected');
