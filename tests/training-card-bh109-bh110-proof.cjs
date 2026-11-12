'use strict';
// Preuve de lignes légales, pas de double-dummy universel.
// Source: PDF Bridge Hebdo 109 et 110, page 2 des solutions (12/11/2026).
const assert=require('node:assert/strict');
const ORDER='NESW', RANK='23456789TJQKA';
function deal(n,e,s,w){
 const d={N:n,E:e,S:s,W:w}, out={};
 for(const [seat,str] of Object.entries(d)){
  const parts=str.split('.'); assert.equal(parts.length,4);
  out[seat]=new Set(parts.flatMap((rs,i)=>[...rs].map(r=>'SHDC'[i]+r)));
  assert.equal(out[seat].size,13,seat);
 }
 const all=Object.values(out).flatMap(x=>[...x]);
 assert.equal(new Set(all).size,52,'52 cartes uniques');
 for(const suit of 'SHDC')assert.equal(all.filter(c=>c[0]===suit).length,13,'13 '+suit);
 return out;
}
function proof(hands,lines,trump){
 const h=Object.fromEntries(Object.entries(hands).map(([k,v])=>[k,new Set(v)]));
 let prev=null, NS=0, EW=0;
 lines.forEach((line,index)=>{
  const a=line.split(' '), play=[];
  assert.equal(a.length,8);
  for(let i=0;i<8;i+=2)play.push([a[i],a[i+1]]);
  const start=ORDER.indexOf(play[0][0]);
  assert.deepEqual(play.map(p=>p[0]),[0,1,2,3].map(j=>ORDER[(start+j)%4]),'ordre '+(index+1));
  if(prev)assert.equal(play[0][0],prev,'entame suivante');
  const suit=play[0][1][0];
  for(const [seat,card] of play){
   assert.ok(h[seat].has(card),card+' non disponible au pli '+(index+1));
   if(card[0]!==suit)assert.ok(![...h[seat]].some(c=>c[0]===suit),'renonce pli '+(index+1));
   h[seat].delete(card);
  }
  let best=-1;
  const winner=play.reduce((acc,p)=>{
   const card=p[1], score=(card[0]===trump?1000:0)+(card[0]===suit?100:0)+RANK.indexOf(card[1]);
   if(score>best){best=score;return p[0]}
   return acc;
  },null);
  prev=winner;
  if('NS'.includes(winner)) NS++; else EW++;
 });
 return {tricks:lines.length,declarer:NS,defenders:EW};
}
const original109=deal(
 'QJ2.JT7.A73.QJ42','T986.964.QJ95.T8','AK3.Q83.K642.A65','754.AK52.T8.K973'
);
const line109=[
 'W HA N H7 E H4 S H3','W HK N HT E H6 S H8',
 'W H5 N HJ E H9 S HQ','S CA W C3 N C2 E C8',
 'S C5 W CK N CQ E CT','W H2 N D3 E D5 S D2',
 'W C9 N CJ E D9 S C6','N SQ E S6 S SA W S4',
 'S SK W S5 N SJ E S8','S DK W D8 N D7 E DJ',
 'S D4 W DT N DA E DQ','N S2 E S9 S S3 W S7',
 'E ST S D6 W C7 N C4'
];
const source109=proof(original109,line109,null);
assert.deepEqual(source109,{tricks:13,declarer:7,defenders:6});
// BH110 : source invalide (♥2 présent deux fois ; ♥4 absent).
// Reconstruction hypothétique : ♥2 Ouest -> ♥4 ; Nord ♣AJ6 du corrigé.
const hypothetical110=deal(
 '8732.AKQ.985.AJ6','QJ5.T6.AK2.T9743','AKT.8532.743.KQ5','964.J974.QJT6.82'
);
const line110=[
 'W DQ N D5 E DK S D3','E DA S D4 W D6 N D8',
 'E D2 S D7 W DT N D9','W DJ N S2 E C3 S C5',
 'W C8 N C6 E C4 S CK','S H2 W H4 N HA E H6',
 'N HK E HT S H3 W H7','N HQ E S5 S H5 W H9',
 'N S3 E SJ S SA W S4','S CQ W C2 N CA E C7',
 'N CJ E C9 S H8 W S6','N S7 E SQ S SK W S9',
 'S ST W HJ N S8 E CT'
];
const reconstructed110=proof(hypothetical110,line110,null);
assert.deepEqual(reconstructed110,{tricks:13,declarer:9,defenders:4});
if(require.main===module)console.log('BH109/BH110: 52 cartes, service, vainqueurs et 13 plis validés');
module.exports={source109,reconstructed110};
