'use strict';
// LOT 09 — contrôle de publication ciblé, construit à partir des PDF et audits figés.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const txt=fs.readFileSync(path.join(root,'entrainement/training-data.js'),'utf8').trim();
assert.ok(txt.startsWith('const D=')&&txt.endsWith(';'));
const D=JSON.parse(txt.slice(8,-1));
const selected=[
 {id:'EN-BH-111-04',hand:['D 8 6','R 7 5','R D V 10 8','8 2'],H:11,HL:12,correct:'Passe',theme:'forcing',bid:'4♠'},
 {id:'EN-BH-060-04',hand:['D 5 2','R V 10 8 6 3','A 3','7 4'],H:10,HL:12,correct:'3♥',theme:'suite-repondant',bid:'2♣'}
];
assert.equal(D.bidding.length,636);
assert.equal(D.play.length,188);
assert.equal(new Set([...D.bidding,...D.play].map(x=>x.id)).size,824);
assert.equal(D.categories.reduce((sum,c)=>sum+c.count,0),636);
assert.equal(D.categories.find(x=>x.id==='forcing').count,15);
assert.equal(D.categories.find(x=>x.id==='suite-repondant').count,87);
for(const exp of selected){
 const x=D.bidding.find(x=>x.id===exp.id);
 assert.ok(x,'missing '+exp.id);
 assert.deepEqual(x.hand,exp.hand,exp.id+' original subject hand');
 assert.equal(x.correct,exp.correct);
 assert.equal(x.theme,exp.theme);
 assert.equal(x.playerSeat,'Sud');
 assert.equal(x.auction.at(-2)[2],exp.bid,exp.id+' final partner bid');
 assert.deepEqual(x.auction.at(-1),['?','','','']);
 assert.equal(x.choices.length,4);
 assert.equal(new Set(x.choices).size,4);
 assert.equal(x.choices.filter(b=>b===x.correct).length,1);
 assert.equal(Object.keys(x.distractorNotes).length,3);
 assert.equal(Object.keys(x.pretryHints).length,3);
 for(const c of x.choices.filter(c=>c!==x.correct)){
  assert.ok(x.distractorNotes[c]&&x.pretryHints[c],exp.id+' distractor '+c);
 }
 const cards=x.hand.flatMap(c=>c.split(' ').filter(Boolean));
 assert.equal(cards.length,13);
 const H=cards.reduce((sum,r)=>sum+({A:4,R:3,D:2,V:1}[r]||0),0);
 const HL=H+x.hand.reduce((sum,s)=>sum+Math.max(0,s.split(' ').length-4),0);
 assert.equal(H,exp.H);assert.equal(HL,exp.HL);
 assert.ok(x.question.includes('Sud')&&x.explanation.length>80);
 assert.ok(x.sourceAuditLot.includes('non aveugle'));
 assert.ok(!x.reviewStatus.startsWith('a_verifier'));
}
for(const id of ['EN-BH-065-05','EN-BH-098-04','EN-BH-075-06','EN-BH-071-04'])
 assert.ok(!D.bidding.some(x=>x.id===id),id+' must remain outside the catalogue');
console.log('LOT09 PASS — 2 QCM, 636 enchères + 188 cartes = 824 total');
