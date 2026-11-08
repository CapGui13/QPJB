'use strict';
// LOT 08 — Test historique d'intégrité, actualisé après PR #113 et audit indépendant R8-C.
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
 assert.equal(Object.keys(x.distractorNotes).length,3,id+' three independent distractor explanations');
 assert.ok(x.choices.every(c=>c===x.correct||typeof x.distractorNotes[c]==='string'),id+' each distractor explained');
 assert.equal(x.reviewStatus,['EN-BH-089-03','EN-BH-097-01'].includes(id)?'valide_contre_expertise_independante_lot08_20261108':'a_relire',id+' correct post-review status');
 assert.equal(x.choiceStatus,['EN-BH-089-03','EN-BH-097-01'].includes(id)?'distracteurs_controles_r8c_20261108':'lot08_r8c_20261108_a_revoir',id+' correct distractor status');
 assert.ok(!x.tags.includes('lot08_candidate_non_publie'),id+' no obsolete unpublished tag');
 assert.ok(x.sourceAuditLot.includes('PR #113 fusionnée'),id+' updated publication provenance');
}
assert.ok(!D.bidding.find(x=>x.id==='EN-BH-089-03').choices.includes('2♣'),'non-unique 2♣ distractor replaced');
assert.ok(D.bidding.find(x=>x.id==='EN-BH-089-03').choices.includes('3♣'),'new 3♣ distractor confirmed');
assert.ok(!D.bidding.some(x=>['EN-BH-111-01','EN-BH-082-04'].includes(x.id)), 'excluded cases still excluded');
assert.match(D.bidding.find(x=>x.id==='EN-BH-097-04').explanation,/16–18 HL/,'097-04 source range clarified');
assert.match(D.bidding.find(x=>x.id==='EN-BH-097-06').distractorNotes['3♠'],/V5/,'097-06 Pique holding corrected');
console.log('LOT08 POSTFUSION PASS — 4 published QCM; 2 validated, 2 still under review; 819 total');
