'use strict';
// Trois entames selectionnees du Lot 07 V3 ; aucun QCM ajoute.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const raw=read('entrainement/training-data.js').trim();
assert.ok(raw.startsWith('const D=')&&raw.endsWith(';'));
const D=JSON.parse(raw.slice(8,-1));
const ids=['JC-BH-079-03','JC-BH-091-03','JC-BH-091-04'];
assert.equal(D.bidding.length,635);assert.equal(D.play.length,188);
assert.equal(new Set([...D.bidding,...D.play].map(x=>x.id)).size,823);
for(const id of ['EN-BH-042-P2-04','JC-BH-132-Q03','JC-BH-080-04'])
 assert.ok(![...D.bidding,...D.play].some(x=>x.id===id),id+' is excluded');
const props={'JC-BH-079-03':['S','♥7'],'JC-BH-091-03':['W','♦R'],'JC-BH-091-04':['W','♦8']};
for(const id of ids){
 const x=D.play.find(v=>v.id===id);
 assert.ok(x,id);assert.equal(x.type,'defense');assert.equal(x.topic,'Entame');
 assert.equal(x.reviewStatus,'valide_edition_lot07_v3_20261108');
 assert.equal(x.playEditorialStatus,'lot07_v3_entames_publication_20261108');
 assert.equal(x.sourceFormat,'entame_une_main_connue_lot07_20261107');
 assert.equal(x.holdings.length,1);assert.equal(x.holdings[0].seat,props[id][0]);
 assert.equal(x.lead,'');assert.ok(x.prompt.startsWith('Accord de la paire'));
 assert.ok(x.answerText.includes(props[id][1]));
 assert.equal(x.holdings[0].rows.reduce((n,r)=>n+r.ranks.replace(/10/g,'T').length,0),13,id);
 assert.match(x.sourceAudit.sha256_sujet,/^[a-f0-9]{64}$/);
 assert.match(x.sourceAudit.sha256_corrige,/^[a-f0-9]{64}$/);
 assert.equal(x.sourceAudit.known_hands_only,true);
 assert.equal(x.sourceAudit.private_opponent_hands_not_shown,true);
 assert.ok(!JSON.stringify(x).includes('non_publie'));
}
assert.match(D.play.find(x=>x.id==='JC-BH-091-03').answerText,/♣D/);
assert.match(D.play.find(x=>x.id==='JC-BH-091-04').answerText,/1SA/);
assert.match(D.play.find(x=>x.id==='JC-BH-079-03').answerText,/As latéral/);
assert.ok(read('entrainement/training-app.js').includes("x.sourceFormat==='entame_une_main_connue_lot07_20261107'"));
console.log('LOT07 V3 SELECTIVE PASS — 3 leads; 635 enchères + 188 cartes = 823');
