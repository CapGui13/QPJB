'use strict';
// QA des candidats du lot 06, qui restent séparés de D.bidding et D.play.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const project=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(project,p),'utf8');
const staging=JSON.parse(read('entrainement/staging/lot06-candidats.json'));
const master=read('entrainement/training-data.js').trim();
assert(master.startsWith('const D=')&&master.endsWith(';'));
const D=JSON.parse(master.slice(8,-1));
const app=read('entrainement/training-app.js');
const expectedB=['EN-BH-128-02','EN-BH-128-06','EN-BH-129-02','EN-BH-130-06','EN-BH-129-03'];
const expectedP=['JC-BH-127-01','JC-BH-079-02','JC-BH-111-01','JC-BH-118-P2','JC-BH-126-01','JC-BH-058-P2'];
assert.equal(staging.lot,'06');
assert.equal(staging.statut,'quarantaine');
assert.equal(staging.publication_autorisee,false);
assert.deepEqual(staging.bidding.map(x=>x.id),expectedB);
assert.deepEqual(staging.play.map(x=>x.id),expectedP);
assert.equal(D.bidding.length,622);
assert.equal(D.play.length,179);
const all=[...staging.bidding,...staging.play];
const ids=all.map(x=>x.id);
assert.equal(new Set(ids).size,11,'Uniqueness within staged data');
const active=new Set([...D.bidding,...D.play].map(x=>x.id));
assert.ok(ids.every(id=>!active.has(id)),'Staging must not overwrite published IDs');
const rankChars=v=>String(v||'').toUpperCase().replace(/10/g,'T').replace(/\s+/g,'').split('');
const allowed=new Set('ARDVT98765432'.split(''));
for(const x of all){
 assert.equal(x.reviewStatus,'a_verifier',x.id+' must remain quarantined');
 assert.equal(x.publicationAutorisee,false,x.id+' must remain unpublished');
 assert.equal(x.sourceAudit?.known_hands_only,true,x.id+' must preserve source evidence');
 assert.equal(x.sourceAudit?.hidden_defender_hands_not_shown,true,x.id+' must not guess defenders');
 assert.match(x.sourceAudit?.sha256_sujet||'',/^[a-f0-9]{64}$/,x.id+' source hash');
 assert.match(x.sourceAudit?.sha256_corrige||'',/^[a-f0-9]{64}$/,x.id+' correction hash');
 assert.ok(Number.isInteger(x.sourceAudit?.page_sujet)&&Number.isInteger(x.sourceAudit?.page_corrige));
}
for(const x of staging.bidding){
 assert.ok(['Sud','Nord','Est','Ouest'].includes(x.playerSeat));
 assert.equal(x.hand.length,4);
 const cards=x.hand.flatMap(rankChars);
 assert.equal(cards.length,13,x.id+' main has 13 cards');
 assert.ok(cards.every(c=>allowed.has(c)));
 assert.equal(x.choices.length,4);
 assert.equal(new Set(x.choices).size,4);
 assert.ok(x.choices.includes(x.correct));
 assert.equal(Object.keys(x.distractorNotes).length,3);
 assert.ok(x.auction.flat().includes('?'),x.id+' must have a question seat');
}
const qaSeat=staging.bidding.find(x=>x.id==='EN-BH-130-06');
assert.equal(qaSeat.playerSeat,'Nord');
const headStart=app.indexOf('function biddingPlayerHeading('),headEnd=app.indexOf('\nfunction quizB(',headStart);
assert(headStart>=0&&headEnd>headStart);
const heading=new Function(app.slice(headStart,headEnd)+';return biddingPlayerHeading;')();
assert.equal(heading(qaSeat),'Vous êtes en Nord');
for(const x of staging.play){
 assert.ok(['declarant','defense'].includes(x.type));
 assert.ok(['Entame','Défense','Plan de jeu'].includes(x.topic));
 assert.ok(x.holdings.length>=1&&x.holdings.length<=2);
 const present=new Set();
 for(const hand of x.holdings){
  assert.ok(['N','S','E','O'].includes(hand.seat));
  let count=0;
  for(const row of hand.rows){
   assert.ok('♠♥♦♣'.includes(row.suit));
   const ranks=rankChars(row.ranks);
   count+=ranks.length;
   for(const r of ranks){assert(allowed.has(r),x.id+' rank '+r); const k=row.suit+r;assert(!present.has(k),x.id+' repeated '+k);present.add(k)}
  }
  assert.equal(count,13,x.id+' visible source hand');
 }
 assert.ok(x.prompt.trim()&&x.answerText.trim());
}
const solo=staging.play.find(x=>x.id==='JC-BH-079-02');
assert.equal(solo.holdings.length,1);
assert.equal(solo.sourceFormat,'une_main_connue_lot06_20261107');
const renderStart=app.indexOf('function renderLegacyDiagram('),renderEnd=app.indexOf('// Present the unmodified source wording',renderStart);
assert(renderStart>=0&&renderEnd>renderStart);
let observed=null;
const render=new Function('buildCardSeats','dealViewer','playerSeatFromExercise','resolveLeadSeat',
 app.slice(renderStart,renderEnd)+';return renderLegacyDiagram;')(
 x=>Object.fromEntries(x.holdings.map(h=>[{N:'north',S:'south',E:'east',O:'west'}[h.seat],{title:h.label,rows:h.rows}])),
 (seats,meta)=>{observed={seats,meta};return '<div class="deal-viewer"></div>'},
 ()=> 'south',()=> 'west');
assert.match(render(solo),/deal-viewer/,'single-hand lot06 must be rendered');
assert.deepEqual(Object.keys(observed.seats),['south'],'do not synthesize unseen hands');
assert.equal(observed.meta.contract,'2♠');
const sw=read('service-worker.js');
assert.match(sw,/CACHE = 'qpjb-v/);
const boot=read('entrainement/training-data-bootstrap.js');
assert.match(boot,/"bidding":622,"play":179/);
console.log('LOT06 STAGING PASS — 11 independent candidates; no active count change; seat/solo renderer/source proofs OK');