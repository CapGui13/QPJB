'use strict';
// Clôture ciblée 2026-11-21 : les neuf indicateurs de publication ne doivent
// pas masquer les réserves pédagogiques ni désynchroniser les jeux de données.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
function parse(name,prefix){
 const src=read('entrainement/'+name).trim();
 assert(src.startsWith(prefix)&&src.endsWith(';'),name+': format inconnu');
 return JSON.parse(src.slice(prefix.length,-1));
}
const master=parse('training-data.js','const D=');
const bid=parse('training-data-bidding.js','D.bidding=');
const play=parse('training-data-play.js','D.play=');
assert.equal(master.bidding.length,638,'Enchères historiques modifiées');
assert.equal(master.play.length,188,'Cartes historiques modifiées');
assert.deepEqual(bid,master.bidding,'Module enchères désynchronisé');
assert.deepEqual(play,master.play,'Module carte désynchronisé');
const expectedBid=[
 'EN-BH-134-03','EN-BH-136-05','EN-BH-139-06',
 'EN-BH-140-01','EN-BH-140-02','EN-BH-140-05'
];
const expectedPlay=[
 'JC-BH-136-01','JC-BH-139-01','JC-BH-140-01'
];
const expected=new Set([...expectedBid,...expectedPlay]);
const all=[...master.bidding,...master.play];
assert.equal(new Set(all.map(x=>x.id)).size,826,'IDs historiques non uniques');
const updated=all.filter(x=>x.sourceAudit?.publication_autorisee===true);
assert.deepEqual(updated.map(x=>x.id).sort(),[...expected].sort(),
 'Seuls les 9 indicateurs validés pour alignement doivent être à true');
assert.equal(all.filter(x=>x.sourceAudit?.publication_autorisee===false).length,0,
 'Ancien drapeau false resté dans les données');
for(const x of updated){
 assert.equal(x.reviewStatus,'a_relire',
  'La publication ne vaut pas validation pédagogique : '+x.id);
 assert(x.sourceAudit?.sujet_pdf&&x.sourceAudit?.corrige_pdf,
  'La provenance originale doit être conservée : '+x.id);
 if(expectedPlay.includes(x.id)){
  assert.equal(x.playEditorialStatus,'plan_libre_pret_a_relire',
   'Prudence du plan de carte supprimée : '+x.id);
  assert(x.pilotNote,'Réserve de plan de carte absente : '+x.id);
 }else assert(x.pilotNote,'Note historique d\'arbitrage absente : '+x.id);
}
console.log('9 indicateurs alignés (6 enchères, 3 cartes), 826 IDs, fichiers synchronisés ; statuts a_relire conservés.');
