'use strict';
// Preuve reproductible de JC-BH-060-01. Cartes : S/H/D/C, rangs T=10 J=Valet Q=Dame K=Roi.
const assert=require('node:assert/strict');
const ranks='23456789TJQKA',suits=['S','H','D','C'],rotation=['W','N','E','S'];
const original={
 N:{S:'KQ643',H:'A6',D:'984',C:'Q32'},
 E:{S:'JT7',H:'7543',D:'Q3',C:'JT76'},
 S:{S:'85',H:'982',D:'AK765',C:'AK8'},
 W:{S:'A92',H:'KQJT',D:'JT2',C:'954'}
};
const hypothetical={
 N:{...original.N},
 E:{S:'JT7',H:'T7543',D:'Q',C:'JT76'},
 S:{...original.S},
 W:{S:'A92',H:'KQJ',D:'JT23',C:'954'}
};
const spades=[
 'W HK N HA E H3 S H2','N C2 E C6 S CA W C4','S S5 W SA N S3 E S7',
 'W HQ N H6 E H4 S H8','W HJ N D4 E H5 S H9','W HT N D8 E H7 S D5',
 'W C5 N CQ E C7 S C8','N C3 E CT S CK W C9','S S8 W S2 N SK E ST',
 'N SQ E SJ S D6 W S9','N S6 E D3 S D7 W D2','N S4 E CJ S DK W DT',
 'N D9 E DQ S DA W DJ'
];
const diamonds=[
 'W HK N HA E H3 S H2','N D4 E D3 S DA W D2','S DK W DT N D8 E DQ',
 'S D7 W DJ N D9 E H4','W HQ N H6 E H5 S H8','W HJ N S3 E H7 S H9',
 'W HT N S4 E C6 S D6','W SA N S6 E S7 S S5'
];
const threeFive=[
 'W HK N HA E H3 S H2','N C2 E C6 S CA W C4','S S5 W SA N S3 E S7',
 'W HQ N H6 E H4 S H8','W HJ N D4 E H5 S H9','W D3 N D8 E DQ S DA',
 'S CK W C5 N C3 E C7','S S8 W S2 N SK E ST','N SQ E SJ S D5 W S9',
 'N S6 E H7 S D6 W D2','N S4 E CT S D7 W DT','N CQ E CJ S C8 W C9',
 'N D9 E HT S DK W DJ'
];
function checkDeal(deal){
 const deck=[];
 for(const player of rotation){
  assert.deepEqual(Object.keys(deal[player]).sort(),suits.slice().sort());
  const n=suits.reduce((sum,suit)=>sum+deal[player][suit].length,0);
  assert.equal(n,13,'13 cards per player');
  for(const suit of suits)for(const rank of deal[player][suit]){
   assert.ok(ranks.includes(rank));deck.push(suit+rank);
  }
 }
 assert.equal(deck.length,52);assert.equal(new Set(deck).size,52,'52 distinct cards');
 for(const suit of suits)assert.equal(deck.filter(c=>c[0]===suit).length,13);
}
function checkTricks(deal,lines,declExpected,defExpected){
 checkDeal(deal);
 const hands=Object.fromEntries(rotation.map(player=>[
  player,Object.fromEntries(suits.map(suit=>[suit,new Set([...deal[player][suit]].map(rank=>suit+rank))]))
 ]));
 let leader='W',decl=0,def=0;
 for(let i=0;i<lines.length;i++){
  const pieces=lines[i].split(/\s+/);
  assert.equal(pieces.length,8);
  const plays=[0,2,4,6].map(j=>[pieces[j],pieces[j+1]]);
  assert.equal(plays[0][0],leader,'leader of trick '+(i+1));
  const start=rotation.indexOf(leader);
  assert.deepEqual(plays.map(p=>p[0]),[0,1,2,3].map(n=>rotation[(start+n)%4]));
  const ledSuit=plays[0][1][0];
  for(const [player,card] of plays){
   const suit=card[0],rank=card[1];
   assert.ok(suits.includes(suit)&&ranks.includes(rank)&&card.length===2);
   assert.ok(hands[player][suit].has(card),'unavailable card at trick '+(i+1));
   if(suit!==ledSuit)assert.equal(hands[player][ledSuit].size,0,'renounce at trick '+(i+1));
   hands[player][suit].delete(card);
  }
  leader=plays.filter(p=>p[1][0]===ledSuit).sort((a,b)=>ranks.indexOf(b[1][1])-ranks.indexOf(a[1][1]))[0][0];
  if('NS'.includes(leader))decl++;else def++;
 }
 assert.equal(decl,declExpected);assert.equal(def,defExpected);
 if(lines.length===13)for(const player of rotation)for(const suit of suits)assert.equal(hands[player][suit].size,0);
 return {tricks:lines.length,declarer:decl,defenders:def};
}
const result={
 originalSpades:checkTricks(original,spades,9,4),
 originalDiamonds:checkTricks(original,diamonds,3,5),
 hypotheticalThreeFiveHearts:checkTricks(hypothetical,threeFive,10,3)
};
module.exports=result;
if(require.main===module)console.log(JSON.stringify({status:'PASS',case:'JC-BH-060-01',result}));
