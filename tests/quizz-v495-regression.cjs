'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const approved=require('./quizz-v495-approved-revisions.json');
const {normalizedPrefix}=require('./quizz-v488-approved-revisions.cjs');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const m=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(m,'Embedded quiz data');
const db=JSON.parse(m[1]),xs=db.exercises;
assert.ok(xs.length>=1223);assert.equal(db.themes.length,22);
assert.equal(new Set(xs.map(x=>x.id)).size,xs.length);
assert.deepEqual(Object.keys(approved),['SEF-V4-050-2','SEF-V478-008']);
for(const [id,row] of Object.entries(approved)){
 const x=xs.find(x=>x.id===id);
 assert.deepEqual(x,row.after,id+' exact approved version');
 for(const k of ['answer','choices','hand','h','shape','auction','theme','difficulty','caseFamily'])
  assert.deepEqual(x[k],row.before[k],id+' '+k+' unchanged');
 assert.equal(x.sourceOriginalContext20261105V495,row.before.context);
 assert.equal(x.sourceOriginalExplain20261105V495,row.before.explain);
 assert.equal(x.sourceOriginalDifficultyReason20261105V495,row.before.difficultyReason);
 assert.equal(x.hand.flat().reduce((s,c)=>s+({A:4,R:3,D:2,V:1}[c]||0),0),x.h);
 assert.match(x.context,/tournoi par paires/);
}
const wake=xs.find(x=>x.id==='SEF-V4-050-2');
assert.equal(wake.answer,'1♠');assert.equal(wake.h,9);
assert.deepEqual(wake.shape,[5,3,3,2]);assert.match(wake.context,/rouge/);assert.match(wake.context,/vert/);
assert.match(wake.explain,/partenaire peut avoir du jeu/);assert.match(wake.explain,/même rouge contre vert/);
const michael=xs.find(x=>x.id==='SEF-V478-008');
assert.equal(michael.answer,'Passe');assert.equal(michael.h,3);
assert.deepEqual(michael.shape,[3,4,4,2]);assert.match(michael.context,/non vulnérable \(vert\)/);
assert.match(michael.explain,/neuf atouts/);assert.match(michael.explain,/à toute vulnérabilité/);
const baseline=require('./quizz-baseline-1223-gitsha.json');
const original=JSON.stringify(normalizedPrefix(xs,baseline.count));
const sha=createHash('sha1').update('blob '+Buffer.byteLength(original,'utf8')+'\0'+original,'utf8').digest('hex');
assert.equal(sha,baseline.gitBlobSha,'Historical corpus preserved');
console.log('PASS | V4.95: wake 1S all vulnerabilities; Michael pass all vulnerabilities; 1223 QCM protected');
