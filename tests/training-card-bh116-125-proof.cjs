'use strict';
// Audit des fascicules BH-116, 119, 123 et 125 : 52 cartes originales.
// Preuves de lignes légales, non de jeu optimal double-dummy.
// Les mains E/O de BH-122 ne sont PAS dans le PDF : pas de simulation attribuée à la source.
const assert=require('node:assert/strict');
const rank='23456789TJQKA',seats='NESW';
function build(n,e,s,w){
 const hands={N:n,E:e,S:s,W:w},d={};
 for(const [seat,str] of Object.entries(hands)){
  const parts=str.split('.');
  assert.equal(parts.length,4);
  d[seat]=new Set(parts.flatMap((cards,i)=>[...cards].map(c=>'SHDC'[i]+c)));
  assert.equal(d[seat].size,13,seat);
 }
 const all=Object.values(d).flatMap(x=>[...x]);
 assert.equal(new Set(all).size,52,'pas de doublon');
 for(const suit of 'SHDC')assert.equal(all.filter(c=>c[0]===suit).length,13);
 return d;
}
function verify(item){
 const d=build(item.n,item.e,item.s,item.w),h=Object.fromEntries(Object.entries(d).map(([k,v])=>[k,new Set(v)]));
 assert.equal(item.lines.length,13);
 let winner=null,ns=0,ew=0;
 item.lines.forEach((line,i)=>{
  const t=line.split(' ');assert.equal(t.length,8,'4 cartes '+i);
  const moves=[[t[0],t[1]],[t[2],t[3]],[t[4],t[5]],[t[6],t[7]]];
  const start=seats.indexOf(moves[0][0]);
  assert.deepEqual(moves.map(m=>m[0]),[0,1,2,3].map(k=>seats[(start+k)%4]),'ordre '+i);
  if(i>0)assert.equal(moves[0][0],winner,'entame suivante '+i);
  const suit=moves[0][1][0];
  for(const [seat,card] of moves){
   assert.ok(h[seat].has(card),item.id+': carte indisponible '+(i+1)+' '+seat+card);
   if(card[0]!==suit)assert.ok(![...h[seat]].some(c=>c[0]===suit),'renonce '+(i+1));
   h[seat].delete(card);
  }
  let score=-1;
  for(const [seat,card] of moves){
   const v=(card[0]===item.trump?1000:0)+(card[0]===suit?100:0)+rank.indexOf(card[1]);
   if(v>score){score=v;winner=seat}
  }
  if('NS'.includes(winner))ns++;else ew++;
 });
 assert.ok(Object.values(h).every(v=>v.size===0));
 assert.equal(ns,item.ns,item.id+' N/S');assert.equal(ew,item.ew,item.id+' E/O');
 return {tricks:13,declarer:ns,defenders:ew};
}
const cases=[{"id":"BH116","n":"KQJ8.J9.K753.JT4","e":"A64.A8652.4.9863","s":"T972.T74.AQJ.AKQ","w":"53.KQ3.T9862.752","trump":"S","ns":9,"ew":4,"lines":["W HK N H9 E HA S H4","E D4 S DA W D2 N D3","S ST W S3 N SJ E SA","E H2 S H7 W HQ N HJ","W D6 N DK E S4 S DQ","E S6 S S2 W S5 N S8","N SQ E H5 S S7 W H3","N SK E H6 S S9 W D8","N D5 E H8 S DJ W D9","S HT W DT N D7 E C3","S CQ W C2 N C4 E C6","S CK W C5 N CT E C8","S CA W C7 N CJ E C9"]},{"id":"BH119","n":"KJ3.T865.8754.Q5","e":"T6.QJ7.AT3.K9643","s":"AQ754.A3.KQ62.A8","w":"982.K942.J9.JT72","trump":"S","ns":10,"ew":3,"lines":["W CJ N CQ E CK S CA","S SA W S2 N S3 E S6","S S4 W S8 N SK E ST","N D4 E D3 S DK W D9","S S5 W S9 N SJ E H7","N D5 E DT S DQ W DJ","S D2 W H2 N D7 E DA","E HQ S HA W H4 N H5","S SQ W C2 N C5 E HJ","S S7 W C7 N H6 E C3","S D6 W HK N D8 E C4","N H8 E C6 S H3 W H9","W CT N HT E C9 S C8"]},{"id":"BH123-retour-Dame","n":"AJ54.542.982.J54","e":"762.A3.T63.KQ983","s":"83.KQJT98.AKJ.A7","w":"KQT9.76.Q754.T62","trump":"H","ns":11,"ew":2,"lines":["W SK N S4 E S2 S S3","W SQ N SA E S6 S S8","N SJ E S7 S C7 W S9","N H2 E HA S H8 W H6","E C3 S CA W C2 N C4","S HK W H7 N H4 E H3","S HQ W D4 N H5 E C8","S HJ W D5 N D2 E D3","S HT W D7 N D8 E D6","S H9 W DQ N D9 E DT","S DA W ST N C5 E C9","S DK W CT N CJ E CQ","S DJ W C6 N S5 E CK"]},{"id":"BH125","n":"Q752.AQ82.J7.QJT","e":"8.T654.9632.A654","s":"KJT9643.J.A54.93","w":"A.K973.KQT8.K872","trump":"S","ns":10,"ew":3,"lines":["W DK N D7 E D2 S DA","S HJ W H3 N HQ E H4","N HA E H5 S C3 W H7","N S2 E S8 S SK W SA","W CK N CQ E CA S C9","E D3 S D4 W DQ N DJ","W C8 N CJ E C4 S S3","S D5 W DT N SQ E D6","N S7 E HT S SJ W C2","S ST W C7 N S5 E C5","S S9 W D8 N H2 E D9","S S6 W H9 N H8 E C6","S S4 W HK N CT E H6"]}];
const results=Object.fromEntries(cases.map(item=>[item.id,verify(item)]));
const case123=cases.find(x=>x.id==='BH123-retour-Dame');
assert.equal(case123.lines[0],'W SK N S4 E S2 S S3');
assert.equal(case123.lines[1],'W SQ N SA E S6 S S8');
assert.equal(case123.lines[2],'N SJ E S7 S C7 W S9');
// La troisième levée de la variante ♠D montre : ♠V encaissé, ♣7 défaussé.
const north122=new Set('S6 S4 HJ H6 H3 DA DT D8 D7 D2 CA C6 C4'.split(' '));
const south122=new Set('SK SJ HA HK H4 DK DQ D9 D5 D3 C8 C7 C5'.split(' '));
assert.equal(north122.size,13);assert.equal(south122.size,13);
assert.equal(new Set([...north122,...south122]).size,26);
assert.equal([...north122,...south122].filter(c=>c[0]==='D').length,10);
assert.ok(north122.has('HJ')&&south122.has('HA')&&south122.has('HK')&&north122.has('CA'));
if(require.main===module)console.log('BH116/119/122/123/125 audit: 4 donnes originales validées + 122 deux mains, aucune correction requise');
module.exports={results};
