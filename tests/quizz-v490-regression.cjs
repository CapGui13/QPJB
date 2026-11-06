'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const {normalizedPrefix}=require('./quizz-v488-approved-revisions.cjs');
const approved=require('./quizz-v490-approved-revisions.json');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const m=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(m,'Quiz JSON embedded');
const db=JSON.parse(m[1]),xs=db.exercises;
assert.ok(xs.length>=1223,'All 1223 QCM retained');
assert.equal(db.themes.length,22,'All 22 themes retained');
const ids=['SEF-007-1','SEF-007-2','SEF-N041-2','SEF-N076-2','SEF-V412-014','SEF-V412-015','SEF-V3-105-3','SEF-V3-108-1'].sort();
assert.deepEqual(Object.keys(approved).sort(),ids);
const hcp={A:4,R:3,D:2,V:1};
for(const id of ids){
 const x=xs.find(e=>e.id===id),a=approved[id];
 assert.ok(x,id+' found');
 assert.deepEqual(x,a.after,id+' exact editorial snapshot');
 for(const k of ['answer','choices','hand','h','shape','auction','context','difficulty','difficultyReason'])
  assert.deepEqual(x[k],a.before[k],id+' '+k+' unchanged');
 assert.equal(x.sourceOriginalExplain20261105V490,a.before.explain,id+' explanation archived');
 assert.ok(x.explain.length>=135,id+' explanation substantial');
 assert.equal(x.hand.flat().length,13,id+' thirteen cards');
 assert.equal(x.hand.flat().reduce((n,r)=>n+(hcp[r]||0),0),x.h,id+' points H');
 assert.deepEqual(x.shape,x.hand.map(s=>s.length),id+' shape');
}
const baseline=require('./quizz-baseline-1223-gitsha.json');
const old=JSON.stringify(normalizedPrefix(xs,baseline.count));
const sha=createHash('sha1').update('blob '+Buffer.byteLength(old,'utf8')+'\0'+old,'utf8').digest('hex');
assert.equal(sha,baseline.gitBlobSha,'Exact historical QCM except authorized V4.88/V4.89/V4.90 changes');
console.log('PASS | V4.90: eight explanations enriched; no answer, hand, choice or sequence changed');
