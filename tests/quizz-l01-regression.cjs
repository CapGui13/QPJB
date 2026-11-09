'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'training-data present');
const data=JSON.parse(match[1]);
const exercises=data.exercises;
assert.ok(exercises.length>=1253,'Lot L01: 1223 anciens + 30 nouveaux préservés');
assert.match(data.description,new RegExp(String(exercises.length)+' QCM'),'Affichage du total actuel');
const byId=new Map(exercises.map(x=>[x.id,x]));
assert.equal(byId.size,exercises.length,'IDs uniques');
const lote=exercises.filter(x=>/^SEF-L01-[A-F]-\d\d$/.test(x.id));
assert.equal(lote.length,30,'30 identifiants L01');
const categories={A:'chelem',B:'chelem',C:'rubensohl',D:'rubensohl',E:'ouv',F:'drury'};
const ranks=new Set(['A','R','D','V','10','9','8','7','6','5','4','3','2']);
const val={A:4,R:3,D:2,V:1};
const fp=x=>x.hand.map(cards=>cards.slice().sort().join(',')).join('|');
const oldHands=new Set(exercises.slice(0,1223).map(fp));
for(const x of lote){
 const m=x.id.match(/^SEF-L01-([A-F])-(\d\d)$/);
 assert.ok(m,'Format ID '+x.id);
 assert.equal(x.theme,categories[m[1]],'Thème '+x.id);
 assert.equal(x.hand.length,4,'4 couleurs '+x.id);
 assert.equal(x.hand.flat().length,13,'13 cartes '+x.id);
 assert.deepEqual(x.hand.map(c=>c.length),x.shape,'Distribution '+x.id);
 for(const cards of x.hand){
  assert.ok(cards.every(c=>ranks.has(c)),'Rangs '+x.id);
  assert.equal(new Set(cards).size,cards.length,'Cartes distinctes '+x.id);
 }
 assert.equal(x.hand.flat().reduce((sum,c)=>sum+(val[c]||0),0),x.h,'Points H '+x.id);
 assert.equal(x.choices.length,4,'4 réponses '+x.id);
 assert.equal(new Set(x.choices).size,4,'Réponses distinctes '+x.id);
 assert.ok(x.choices.includes(x.answer),'Bonne réponse présente '+x.id);
 assert.ok([1,2,3,4,5].includes(x.difficulty),'Difficulté '+x.id);
 assert.ok(x.explain.trim().length>15,'Corrigé '+x.id);
 assert.ok(!oldHands.has(fp(x)),'Main nouvelle '+x.id);
 if(x.id!=='SEF-L01-E-02')assert.ok(!x.context.includes(x.answer),'Pas de fuite de réponse '+x.id);
 for(const part of [x.context,x.explain]){
  assert.doesNotMatch(part,/accord de paire|accords SEF retenus|dans cet accord|dans ce système|^accord Walsh/i,'Référence SEF '+x.id);
 }
}
assert.equal(lote.filter(x=>x.theme==='chelem').length,12);
assert.equal(lote.filter(x=>x.theme==='rubensohl').length,8);
assert.equal(lote.filter(x=>x.theme==='ouv').length,4);
assert.equal(lote.filter(x=>x.theme==='drury').length,6);
console.log('L01 regression: PASS : 1223 historiques + 30 nouveaux = 1253');
