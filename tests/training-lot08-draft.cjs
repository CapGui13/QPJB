'use strict';
// LOT 08 — Brouillon d'intégration : 4 QCM, pas de publication avant revue.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const D=JSON.parse(fs.readFileSync(path.join(root,'entrainement/training-data.js'),'utf8').trim().slice(8,-1));
const specs={
 'EN-BH-089-03':{correct:'1♠',theme:'rep1M',level:2},
 'EN-BH-097-01':{correct:'3♦',theme:'redemande',level:3},
 'EN-BH-097-04':{correct:'3♠',theme:'redemande',level:3},
 'EN-BH-097-06':{correct:'2SA',theme:'suite-repondant',level:4}
};
assert.equal(D.bidding.length,631);
assert.equal(D.play.length,188);
assert.equal(new Set([...D.bidding,...D.play].map(x=>x.id)).size,819);
assert.equal(D.categories.reduce((s,c)=>s+c.count,0),631);
for(const [id,s] of Object.entries(specs)){
 const x=D.bidding.find(x=>x.id===id);
 assert.ok(x,'missing '+id);
 assert.equal(x.correct,s.correct,id+' correct');
 assert.equal(x.theme,s.theme,id+' category');
 assert.equal(x.level,s.level,id+' difficulty');
 assert.equal(x.hand.flatMap(s=>s.trim().split(/\s+/)).length,13,id+' cards');
 assert.equal(x.choices.length,4,id+' choice count');
 assert.equal(new Set(x.choices).size,4,id+' distinct choices');
 assert.equal(x.choices.filter(c=>c===x.correct).length,1,id+' exactly one selected answer');
 assert.equal(x.playerSeat,'Sud',id+' player');
 assert.ok(x.question&&x.explanation&&x.distractorNotes&&x.editorialWarnings,id+' pedagogical metadata');
 assert.equal(x.reviewStatus,'a_relire',id+' under review');
}
assert.ok(!D.bidding.some(x=>['EN-BH-111-01','EN-BH-082-04'].includes(x.id)), 'excluded cases still excluded');
console.log('LOT08 DRAFT PASS — 4 QCM candidates; 631 bidding, 188 card, 819 total');
