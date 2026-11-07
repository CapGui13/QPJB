'use strict';
// Contrôle de l'activation des 11 candidats du lot 06, sans altérer les 801 exercices historiques.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const raw=read('entrainement/training-data.js').trim();
assert.ok(raw.startsWith('const D=')&&raw.endsWith(';'));
const D=JSON.parse(raw.slice(8,-1));
const idsB=["EN-BH-128-02","EN-BH-128-06","EN-BH-129-02","EN-BH-130-06","EN-BH-129-03"];
const idsP=["JC-BH-127-01","JC-BH-079-02","JC-BH-111-01","JC-BH-118-P2","JC-BH-126-01","JC-BH-058-P2"];
assert.equal(D.bidding.length,627);
assert.equal(D.play.length,185);
assert.deepEqual(D.bidding.slice(-5).map(x=>x.id),idsB);
assert.deepEqual(D.play.slice(-6).map(x=>x.id),idsP);
const all=[...D.bidding,...D.play];
assert.equal(new Set(all.map(x=>x.id)).size,812);
const chosen=[...D.bidding.slice(-5),...D.play.slice(-6)];
for(const x of chosen){
 assert.equal(x.reviewStatus,'valide_edition_lot06_20261107',x.id);
 assert.equal(x.publicationAutorisee,undefined,x.id+' published flag must not say false');
 if(x.sourceAuditLot)assert.ok(!/non publié|staging de contrôle/.test(x.sourceAuditLot),x.id+' stale staging flag');
 assert.ok(!x.quarantineReason,x.id+' is not quarantined');
 assert.match(x.sourceAudit.sha256_sujet,/^[0-9a-f]{64}$/);
 assert.match(x.sourceAudit.sha256_corrige,/^[0-9a-f]{64}$/);
 assert.equal(x.sourceAudit.known_hands_only,true);
 assert.equal(x.sourceAudit.hidden_defender_hands_not_shown,true);
}
for(const x of D.bidding.slice(-5)){
 assert.equal(x.hand.length,4,x.id);
 assert.equal(x.choices.length,4,x.id);
 assert.equal(new Set(x.choices).size,4,x.id);
 assert.ok(x.choices.includes(x.correct),x.id);
 assert.equal(Object.keys(x.distractorNotes).length,3,x.id);
 assert.ok(x.auction.flat().includes('?'),x.id+' question seat');
 assert.equal(x.auction.flat().findIndex(c=>c==='?')%4,['Sud','Ouest','Nord','Est'].indexOf(x.playerSeat),x.id+' bidder seat');
}
assert.equal(D.bidding.find(x=>x.id==='EN-BH-130-06').playerSeat,'Nord');
const chars=v=>String(v).replace(/10/g,'T').replace(/\s+/g,'').split('');
for(const x of D.play.slice(-6)){
 const seen=new Set();
 assert.ok(x.holdings.length>=1&&x.holdings.length<=2);
 for(const h of x.holdings){
  assert.ok(['N','S','E','O'].includes(h.seat));
  const cards=h.rows.flatMap(r=>chars(r.ranks).map(c=>r.suit+c));
  assert.equal(cards.length,13,x.id+' '+h.seat);
  for(const c of cards){assert(!seen.has(c),x.id+' duplicate '+c);seen.add(c)}
 }
 assert.ok(x.prompt.trim()&&x.answerText.trim());
}
const solo=D.play.find(x=>x.id==='JC-BH-079-02');
assert.equal(solo.holdings.length,1);
assert.equal(solo.sourceFormat,'une_main_connue_lot06_20261107');
for(const id of ['JC-BH-111-01','JC-BH-126-01','JC-BH-058-P2']){
 const x=D.play.find(a=>a.id===id);
 assert.match(x.answerText,/condition|si |selon|répartition|défense/i,id+' must include conditional limits');
}
const boot=read('entrainement/training-data-bootstrap.js');
assert.ok(boot.includes('"bidding":627,"play":185'));
assert.ok(boot.includes('20261107l07'));
assert.ok(read('service-worker.js').includes("CACHE = 'qpjb-v62'"));
const app=read('entrainement/training-app.js');
assert.match(app,/x.playerSeat/);
assert.match(app,/une_main_connue_lot06_20261107/);
console.log('LOT06 ACTIVATION PASS — 627 enchères, 185 cartes; 11 IDs, seats, sources and conditions checked');
