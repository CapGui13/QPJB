'use strict';
// LOT08 R8-H : trois QCM validés après triple gel ; prérequis visibles en amont.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const D=JSON.parse(read('entrainement/training-data.js').trim().slice(8,-1));
const specs=[
 {id:'EN-BH-097-02',correct:'2♠',H:12,choices:['2♠','2SA','3♣','3♠']},
 {id:'EN-BH-097-03',correct:'2SA',H:13,choices:['2♦','2♥','2SA','3SA']},
 {id:'EN-BH-097-05',correct:'4♥',H:12,choices:['2♠','3♥','3♠','4♥']}
];
assert.equal(D.bidding.length,638);
assert.equal(D.play.length,188);
assert.equal(new Set([...D.bidding,...D.play].map(x=>x.id)).size,826);
assert.equal(D.categories.reduce((s,c)=>s+c.count,0),638);
assert.equal(D.categories.find(c=>c.id==='redemande').count,87);
const honors={A:4,R:3,D:2,V:1};
for(const s of specs){
 const x=D.bidding.find(y=>y.id===s.id);assert.ok(x,s.id+' missing');
 assert.equal(x.correct,s.correct);assert.equal(x.theme,'redemande');
 assert.equal(x.playerSeat,'Sud');assert.deepEqual(x.choices,s.choices);
 const cards=x.hand.flatMap(h=>h.trim().split(/\s+/));
 assert.equal(cards.length,13);
 assert.equal(cards.reduce((n,c)=>n+(honors[c]||0),0),s.H);
 assert.equal(Object.keys(x.distractorNotes).length,3);
 assert.ok(x.choices.every(b=>b===x.correct||typeof x.distractorNotes[b]==='string'));
 assert.ok(!x.question.includes(x.correct),s.id+' leaks correct answer');
 assert.equal(x.reviewStatus,'valide_edition_lot08_R8H_20261109');
}
const app=read('entrainement/training-app.js');
assert.ok(app.includes('function redemandeCourseNote()'));
assert.ok(app.includes("cat==='redemande'?redemandeCourseNote():''"),'pre-course in redemande list');
assert.ok(app.includes("LOT08_R8H_IDS.has(x.id)?redemandeCourseNote():''"),'pre-course on direct/random question');
for(const phrase of ['16 HL','mini-maxi','fast arrival'])assert.ok(app.includes(phrase),phrase+' missing');
for(const id of ['EN-BH-082-02','EN-BH-139-04','EN-BH-111-01','EN-BH-089-04'])
 assert.ok(!D.bidding.some(x=>x.id===id),id+' intentionally unpublished');
console.log('LOT08 R8-H PASS — 3 V2 QCM, visible course, 826 exercises');
