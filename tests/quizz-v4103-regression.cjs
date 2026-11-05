'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const approved=require('./quizz-v4103-approved-revisions.json');
const {normalizedPrefix}=require('./quizz-v488-approved-revisions.cjs');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const m=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(m);
const db=JSON.parse(m[1]),xs=db.exercises;
assert.equal(xs.length,1223);assert.equal(db.themes.length,22);
assert.equal(new Set(xs.map(x=>x.id)).size,1223);
assert.equal(Object.keys(approved).length,10,'Ten reviewed minor cases');
const expectedLevels={'SEF-C-008':[3,2],'SEF-V44-002':[1,3],'SEF-V486-011':[2,3]};
for(const [id,row] of Object.entries(approved)){
 const x=xs.find(z=>z.id===id);
 assert.deepEqual(x,row.after,id+' exact updated exercise');
 for(const k of ['answer','choices','hand','h','shape','auction','theme','caseFamily'])
  assert.deepEqual(x[k],row.before[k],id+' '+k+' unchanged');
 assert.equal(x.hand.flat().length,13,id+' 13 cards');
 assert.deepEqual(x.hand.map(s=>s.length),x.shape,id+' distribution');
 assert.equal(x.hand.flat().reduce((n,c)=>n+({A:4,R:3,D:2,V:1}[c]||0),0),x.h,id+' H points');
 for(const key of ['context','explain','difficulty','difficultyReason']){
  const saved='sourceOriginal'+key[0].toUpperCase()+key.slice(1)+'20261105V4103';
  if(JSON.stringify(row.before[key])!==JSON.stringify(row.after[key]))
   assert.deepEqual(x[saved],row.before[key],id+' old '+key+' archived');
 }
 if(expectedLevels[id]){
  assert.equal(row.before.difficulty,expectedLevels[id][0]);
  assert.equal(x.difficulty,expectedLevels[id][1]);
 }else assert.equal(x.difficulty,row.before.difficulty);
}
for(const id of ['SEF-V419-001','SEF-V44-011','SEF-V44-012','SEF-V44-046','SEF-V44-047']){
 const x=xs.find(y=>y.id===id);
 assert.match(x.context,/non vulnérable/);assert.match(x.context,/vulnérable/);
}
assert.match(xs.find(x=>x.id==='SEF-V473-007').context,/14 HLD/);
assert.match(xs.find(x=>x.id==='SEF-V473-007').explain,/10 H/);
assert.match(xs.find(x=>x.id==='SEF-V45-029').explain,/deux mineures/);
assert.equal(xs.find(x=>x.id==='SEF-V44-046').answer,'3♣');
assert.equal(xs.find(x=>x.id==='SEF-V44-047').answer,'3♦');
const baseline=require('./quizz-baseline-1223-gitsha.json');
const original=JSON.stringify(normalizedPrefix(xs,baseline.count));
const sha=createHash('sha1').update('blob '+Buffer.byteLength(original,'utf8')+'\0'+original,'utf8').digest('hex');
assert.equal(sha,baseline.gitBlobSha,'The historical 1223 QCM remain identical after approved reverse patches');
console.log('PASS | V4.103: 10 reviewed minor questions, 3 difficulty calibrations, 1223 QCM protected');
