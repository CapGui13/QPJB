'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const approved=require('./quizz-v4100-approved-revisions.json');
const {normalizedPrefix}=require('./quizz-v488-approved-revisions.cjs');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const m=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(m,'Embedded quiz data');
const db=JSON.parse(m[1]),xs=db.exercises;
assert.equal(xs.length,1223,'All QCM retained');
assert.equal(db.themes.length,22,'All rubric entries retained');
assert.equal(new Set(xs.map(x=>x.id)).size,1223,'Unique QCM identifiers');
assert.equal(Object.keys(approved).length,12,'Twelve audited corrections');
for(const [id,row] of Object.entries(approved)){
 const x=xs.find(y=>y.id===id);
 assert.ok(x,id+' exists');
 assert.deepEqual(x,row.after,id+' exact reviewed version');
 for(const k of ['answer','choices','hand','h','shape','auction','theme','difficulty','difficultyReason','caseFamily'])
  assert.deepEqual(x[k],row.before[k],id+' '+k+' unchanged');
 assert.equal(x.sourceOriginalContext20261105V4100,row.before.context);
 assert.equal(x.sourceOriginalExplain20261105V4100,row.before.explain);
 assert.equal(x.hand.flat().length,13,id+' 13 cards');
 assert.deepEqual(x.hand.map(cards=>cards.length),x.shape,id+' shape');
 assert.equal(x.hand.flat().reduce((n,c)=>n+({A:4,R:3,D:2,V:1}[c]||0),0),x.h,id+' H');
 assert.equal(x.pedagogicalReview20261105V4100.answerUnchanged,true);
}
assert.match(xs.find(x=>x.id==='SEF-V3-002-1').explain,/fit 4–4/);
assert.match(xs.find(x=>x.id==='SEF-V3-021-2').explain,/27 à 28 H/);
assert.match(xs.find(x=>x.id==='SEF-V4-073-1').explain,/fit 5–3/);
assert.match(xs.find(x=>x.id==='SEF-V4-076-3').explain,/2♦ nie trois cartes/);
assert.match(xs.find(x=>x.id==='SEF-V4-078-1').explain,/maximum/);
assert.match(xs.find(x=>x.id==='SEF-V3-087-3').explain,/0 H/);
assert.match(xs.find(x=>x.id==='SEF-V410-027').explain,/Contre Spoutnik/);
assert.match(xs.find(x=>x.id==='SEF-V44-045').explain,/Surcontre/);
const baseline=require('./quizz-baseline-1223-gitsha.json');
const original=JSON.stringify(normalizedPrefix(xs,baseline.count));
const sha=createHash('sha1').update('blob '+Buffer.byteLength(original,'utf8')+'\0'+original,'utf8').digest('hex');
assert.equal(sha,baseline.gitBlobSha,'Historical QCM protected by approved snapshots');
console.log('PASS | V4.100: 12 distinct pedagogical explanations and contexts; 1223 QCM protected');
