'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {normalize,fixture}=require('./quizz-v4112-approved-revisions.cjs');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Quiz JSON embarqué');
const data=JSON.parse(match[1]);
const items=data.exercises,byId=new Map(items.map(x=>[x.id,x]));
assert.equal(items.length,1253,'1 253 QCM préservés');
assert.equal(byId.size,1253,'Identifiants inchangés et uniques');
assert.equal(data.themes.length,22,'22 rubriques préservées');
assert.equal(fixture.operationCount,22,'22 retouches');
assert.equal(Object.keys(fixture.editsById).length,16,'16 QCM');
let changedFields=0;
for(const [id,fields] of Object.entries(fixture.editsById)){
 const current=byId.get(id);
 assert.ok(current,'QCM présent : '+id);
 assert.ok(Object.keys(fields).every(x=>x==='context'||x==='explain'),'Pas de changement des réponses : '+id);
 const old=normalize(current);
 for(const [field,[before,after]] of Object.entries(fields)){
  assert.equal(old[field],before,id+' ancien '+field);
  assert.equal(current[field],after,id+' nouveau '+field);
  changedFields++;
 }
 assert.deepEqual(old.hand,current.hand,'Main inchangée '+id);
 assert.deepEqual(old.auction,current.auction,'Enchères inchangées '+id);
 assert.deepEqual(old.choices,current.choices,'Choix inchangés '+id);
 assert.equal(old.answer,current.answer,'Bonne réponse inchangée '+id);
 assert.equal(old.difficulty,current.difficulty,'Difficulté inchangée '+id);
}
assert.equal(changedFields,16,'16 champs context/explain changés');
console.log('PASS | V4.112 : 22 retouches sur 16 QCM ; 1 253 QCM / 22 thèmes préservés');
