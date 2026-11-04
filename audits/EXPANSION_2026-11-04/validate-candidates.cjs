'use strict';
// Validation structurelle des candidatures ; ceci N'EST PAS une certification SEF.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=path.join(__dirname,'../..');
const html=fs.readFileSync(path.join(base,'quizz.html'),'utf8');
const m=html.match(/<script id="training-data" type="application\\/json">([\\s\\S]*?)<\\/script>/);
assert.ok(m,'Existing embedded quiz must be readable');
const db=JSON.parse(m[1]);
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'candidats-qcm.json'),'utf8'));
const H={A:4,R:3,D:2,V:1};
const existing=new Map(db.exercises.map(x=>[x.id,x]));
const situations=new Set(db.exercises.map(x=>JSON.stringify([x.hand,x.auction])));
const rank=v=>{const m=String(v).match(/^([1-7])(♣|♦|♥|♠|SA)$/);return m?(+m[1]-1)*5+({'♣':0,'♦':1,'♥':2,'♠':3,SA:4})[m[2]]:null};
assert.equal(db.exercises.length,manifest.baseCount,'Do not silently change baseline during review');
assert.equal(manifest.candidateCount,manifest.candidates.length);
assert.equal(new Set(manifest.candidates.map(x=>x.id)).size,manifest.candidateCount);
for(const x of manifest.candidates){
 assert.ok(!existing.has(x.id),x.id+' collides');
 assert.equal(x.hand.length,4,x.id);
 const cards=x.hand.flat();
 assert.equal(cards.length,13,x.id+' must contain 13 cards');
 assert.deepEqual(x.hand.map(s=>s.length),x.shape,x.id+' shape mismatch');
 assert.equal(cards.reduce((n,c)=>n+(H[c]||0),0),x.h,x.id+' H mismatch');
 for(const suit of x.hand){assert.equal(new Set(suit).size,suit.length,x.id+' duplicates');assert.ok(suit.every(c=>['A','R','D','V','10','9','8','7','6','5','4','3','2'].includes(c)),x.id+' unknown card')}
 assert.equal(x.choices.length,4,x.id);
 assert.equal(new Set(x.choices).size,4,x.id);
 assert.ok(x.choices.includes(x.answer),x.id);
 assert.ok(!situations.has(JSON.stringify([x.hand,x.auction])),x.id+' already in Quizz');
 assert.ok(x.contrastWith.every(id=>existing.has(id)),x.id+' comparison ID absent');
 const contracts=x.auction.map(y=>y.split(':').slice(1).join(':').replace(/\\s*\\([^)]*\\).*/,'').trim()).map(rank).filter(n=>n!==null);
 const last=contracts.at(-1);
 for(const bid of x.choices){const n=rank(bid);if(n!==null&&last!==undefined)assert.ok(n>last,x.id+' underbid '+bid)}
 if(x.choices.includes('Surcontre'))assert.equal(x.auction.at(-1),'Adversaire : Contre',x.id+' Surcontre may be illegal');
}
console.log('PASS '+manifest.candidateCount+' draft cases; structural checks only; NO SEF certification or publication');
