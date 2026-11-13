'use strict';
// BH037, BH039, BH056 et BH057 : donnes originales pages 1 et 2 (PDF Bridge Hebdo).
// Quatre lignes complètes de 13 plis. Les maniements 039 ne montrent QUE 13 Cœurs.
// Le validateur démontre des lignes légales, pas le jeu optimal double-dummy.
const assert=require('node:assert/strict');
const seats='NESW',suits='SHDC',ranks='23456789TJQKA';
function board(src){
 const hands={},all=[];
 for(const [seat,str] of Object.entries(src)){
  const p=str.split('.');assert.equal(p.length,4,seat);
  hands[seat]=new Set(p.flatMap((x,i)=>[...x].map(r=>suits[i]+r)));
  assert.equal(hands[seat].size,13,seat+' 13 cards');all.push(...hands[seat]);
 }
 assert.equal(all.length,52,'52 cartes');assert.equal(new Set(all).size,52,'52 uniques');
 for(const s of suits)assert.equal(all.filter(c=>c[0]===s).length,13,'13 '+s);
 return hands;
}
function trace52(c){
 const hands=board(c.hands),lines=c.lines.trim().split('\n');assert.equal(lines.length,13);
 let previous=null,ns=0,ew=0;
 for(let i=0;i<lines.length;i++){
  const p=lines[i].trim().split(/\s+/),moves=[];
  assert.equal(p.length,8);
  for(let j=0;j<8;j+=2)moves.push([p[j],p[j+1]]);
  const start=seats.indexOf(moves[0][0]);
  assert.deepEqual(moves.map(x=>x[0]),[0,1,2,3].map(k=>seats[(start+k)%4]),'order '+(i+1));
  if(previous)assert.equal(moves[0][0],previous,'leader '+(i+1));
  const lead=moves[0][1][0];let best=-1,winner='';
  for(const [s,card] of moves){
   assert.ok(hands[s].has(card),'absent '+s+card+' trick '+(i+1));
   if(card[0]!==lead)assert.ok(![...hands[s]].some(k=>k[0]===lead),'revoke '+(i+1));
   hands[s].delete(card);
   const score=(card[0]===c.trump?1000:0)+(card[0]===lead?100:0)+ranks.indexOf(card[1]);
   if(score>best){best=score;winner=s;}
  }
  previous=winner;if('NS'.includes(winner))ns++;else ew++;
 }
 assert.equal(ns,c.ns);assert.equal(ns+ew,13);
 assert.ok(Object.values(hands).every(x=>x.size===0));return {tricks:13,declarer:ns,defenders:ew};
}
function traceSuit(h,lines){
 const hands={},all=[];for(const [s,v] of Object.entries(h)){hands[s]=new Set(v);all.push(...v);}
 assert.equal(all.length,13);assert.equal(new Set(all).size,13);
 let prior=null,ns=0,ew=0;
 for(const [i,line] of lines.trim().split('\n').entries()){
  const p=line.trim().split(/\s+/);assert.equal(p.length,8);const a=[];
  for(let j=0;j<8;j+=2)a.push([p[j],p[j+1]]);
  const st=seats.indexOf(a[0][0]);assert.deepEqual(a.map(x=>x[0]),[0,1,2,3].map(j=>seats[(st+j)%4]));
  if(prior)assert.equal(a[0][0],prior);
  let best=-1,winner='';
  for(const [seat,r] of a){
   if(r==='-'){assert.equal(hands[seat].size,0);continue;}
   assert.ok(hands[seat].has(r),seat+r+' trick '+i);
   hands[seat].delete(r);
   if(ranks.indexOf(r)>best){best=ranks.indexOf(r);winner=seat}
  }
  prior=winner;if('NS'.includes(winner))ns++;else ew++;
 }
 assert.ok(Object.values(hands).every(x=>x.size===0));
 return {declarer:ns,defenders:ew};
}
const cases={"BH037-Q01":{"hands":{"N":"KT6.A2.A9753.874","E":"J92.854.KJ2.J953","S":"Q83.KQ7.864.AKQ6","W":"A754.JT963.QT.T2"},"trump":"","ns":9,"lines":"W HJ N H2 E H4 S HQ\nS D4 W DT N D3 E DK\nE H5 S H7 W H9 N HA\nN D5 E D2 S D6 W DQ\nW HT N C4 E H8 S HK\nS D8 W S4 N DA E DJ\nN D9 E C3 S C6 W S5\nN D7 E C5 S S3 W S7\nN C7 E C9 S CA W C2\nS CK W CT N C8 E CJ\nS CQ W H3 N S6 E S2\nS SQ W SA N SK E SJ\nW H6 N ST E S9 S S8"},"BH039-Q01":{"hands":{"N":"KJ4.A2.A84.J7542","E":"6.KT543.JT9.ADT9","S":"AQT9752.76.Q53.6","W":"83.QJ98.K762.K83"},"trump":"S","ns":10,"lines":"W HQ N HA E H3 S H6\nN C2 E CA S C6 W C3\nE HK S H7 W H8 N H2\nE DJ S DQ W DK N DA\nN C4 E CD S S9 W C8\nS S7 W S3 N SJ E S6\nN C5 E C9 S ST W CK\nS S5 W S8 N SK E H4\nN C7 E CT S SQ W H9\nS S2 W D2 N S4 E H5\nN CJ E D9 S D3 W HJ\nN D4 E DT S D5 W D6\nE HT S SA W D7 N D8"},"BH056-P2":{"hands":{"N":"Q6.K652.KQ6.KJT9","E":"T85.QJ8.T842.Q84","S":"K73.A74.A53.A532","W":"AJ942.T93.J97.76"},"trump":"","ns":10,"lines":"W S4 N SQ E S5 S S3\nN CK E C4 S C2 W C6\nN CJ E CQ S CA W C7\nS C3 W S2 N CT E C8\nN C9 E D2 S C5 W S9\nN HK E H8 S H4 W H3\nN DK E D4 S D3 W D7\nN DQ E D8 S D5 W D9\nN D6 E DT S DA W DJ\nS HA W HT N H2 E HJ\nS SK W SA N S6 E ST\nW SJ N H5 E S8 S S7\nW H9 N H6 E HQ S H7"},"BH057-P2":{"hands":{"N":"AK63.82.KT52.K74","E":"Q75.Q973.96.AT82","S":"8.AKJT64.AJ4.653","W":"JT942.5.Q873.QJ9"},"trump":"H","ns":10,"lines":"W CQ N C4 E C2 S C3\nW CJ N C7 E C8 S C5\nW C9 N CK E CA S C6\nE SQ S S8 W S2 N SA\nN H8 E H3 S HT W H5\nS D4 W D3 N DK E D6\nN SK E S5 S DJ W S4\nN H2 E H7 S HJ W S9\nS HA W ST N D2 E H9\nS HK W SJ N D5 E HQ\nS H6 W D7 N DT E D9\nS H4 W D8 N S3 E S7\nS DA W DQ N S6 E CT"}};
const heart39={"N":"A642","E":"T973","S":"KJ85","W":"Q"};
const heartTraces={"correct":"N A E 3 S 5 W Q\nN 2 E 7 S 8 W -\nS J W - N 4 E 9\nS K W - N 6 E T","sacrifice":"N A E 3 S 5 W Q\nN 2 E 7 S J W -\nS K W - N 4 E 9\nS 8 W - N 6 E T"};
const extra={"BH039-M02":{"h":{"N":"KJ62","E":"Q973","S":"AT85","W":"4"},"ns":4,"lines":"N K E 3 S 5 W 4\nN J E Q S A W -\nS 8 W - N 2 E 7\nS T W - N 6 E 9"},"BH039-M03":{"h":{"N":"KT65","E":"3","S":"A742","W":"QJ98"},"ns":3,"lines":"S A W 8 N 5 E 3\nS 2 W 9 N T E -\nN K E - S 4 W J\nN 6 E - S 7 W Q"},"BH039-M04":{"h":{"N":"A963","E":"J","S":"K742","W":"QT85"},"ns":3,"lines":"S K W 5 N 3 E J\nS 2 W 8 N 9 E -\nN A E - S 4 W T\nN 6 E - S 7 W Q"}};
const results={};
for(const [id,c] of Object.entries(cases))results[id]=trace52(c);
results['BH039-M01-8-sur-7']=traceSuit(heart39,heartTraces.correct);
results['BH039-M01-V-sur-7']=traceSuit(heart39,heartTraces.sacrifice);
assert.equal(results['BH039-M01-8-sur-7'].declarer,4);
assert.equal(results['BH039-M01-V-sur-7'].declarer,3);
for(const [id,v] of Object.entries(extra)){
 results[id]=traceSuit(v.h,v.lines);assert.equal(results[id].declarer,v.ns,id);
}
// BH037 pages 2 : seulement deux mains visibles. Pas d'attribution inventée aux défenseurs.
const bh037Visible={M1:['KQJ2','543'],M2:['QJ2','K543'],M3:['KQ93','J542'],M4:['K763','Q542']};
for(const hands of Object.values(bh037Visible)){
 assert.ok([7,8].includes(hands.join('').length));
 assert.equal(new Set(hands.join('')).size,hands.join('').length);
}
if(require.main===module)console.log('BH037-039-056-057: all legal 13-trick and suit examples PASS');
module.exports=results;
