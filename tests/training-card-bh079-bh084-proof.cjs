'use strict';
// Audit Bridge Hebdo 079/080/082/084 du 12/11/2026.
// 079/080 : seuls les 13 Trèfles sont connus ; '-' = défausse non spécifiée.
// 082/084 : 52 cartes du PDF, 13 plis, contrôle strict des règles.
// Une ligne légale n'est pas une certification double-dummy.
const assert=require('node:assert/strict');
const SEATS='NESW',SUITS='SHDC',R='23456789TJQKA';
function run52(src,lines,trump=''){
 const hands={};let all=[];
 for(const [seat,holding] of Object.entries(src)){
  const parts=holding.split('.');assert.equal(parts.length,4);
  const h=new Set(parts.flatMap((p,i)=>[...p].map(c=>SUITS[i]+c)));
  assert.equal(h.size,13,seat);hands[seat]=h;all.push(...h);
 }
 assert.equal(all.length,52);assert.equal(new Set(all).size,52);
 for(const c of SUITS)assert.equal(all.filter(x=>x[0]===c).length,13);
 assert.equal(lines.length,13);let prior=null,ns=0,ew=0;
 for(let i=0;i<13;i++){
  const x=lines[i].split(' ');assert.equal(x.length,8);
  const p=[[x[0],x[1]],[x[2],x[3]],[x[4],x[5]],[x[6],x[7]]];
  const origin=SEATS.indexOf(p[0][0]);
  assert.deepEqual(p.map(x=>x[0]),[0,1,2,3].map(j=>SEATS[(origin+j)%4]),'ordre '+(i+1));
  if(prior)assert.equal(p[0][0],prior,'entame suivante '+(i+1));
  const suit=p[0][1][0];let highest=-1,win='';
  for(const [seat,card] of p){
   assert.ok(hands[seat].has(card),'carte absente '+seat+card+' pli '+(i+1));
   if(card[0]!==suit)assert.ok(![...hands[seat]].some(c=>c[0]===suit),'renonce '+(i+1));
   hands[seat].delete(card);
   const score=(card[0]===trump?1000:0)+(card[0]===suit?100:0)+R.indexOf(card[1]);
   if(score>highest){highest=score;win=seat;}
  }
  prior=win;
  if('NS'.includes(win))ns++;else ew++;
 }
 assert.ok(Object.values(hands).every(h=>h.size===0));
 return {tricks:13,ns,ew};
}
function clubs(holdings,lines,winners){
 const h={},all=[];let prior=null;
 for(const [seat,chars] of Object.entries(holdings)){h[seat]=new Set(chars);all.push(...chars);}
 assert.equal(all.length,13);assert.equal(new Set(all).size,13);
 for(let i=0;i<lines.length;i++){
  const x=lines[i].split(' ');assert.equal(x.length,8);
  const p=[[x[0],x[1]],[x[2],x[3]],[x[4],x[5]],[x[6],x[7]]];
  const origin=SEATS.indexOf(p[0][0]);
  assert.deepEqual(p.map(x=>x[0]),[0,1,2,3].map(j=>SEATS[(origin+j)%4]));
  if(prior)assert.equal(p[0][0],prior);
  let high=-1,win='';
  for(const [seat,card] of p){
   if(card==='-'){assert.equal(h[seat].size,0);continue;}
   assert.ok(h[seat].has(card),seat+card);h[seat].delete(card);
   if(R.indexOf(card)>high){high=R.indexOf(card);win=seat;}
  }
  prior=win;assert.equal(win,winners[i]);
 }
 assert.ok(Object.values(h).every(x=>x.size===0));return lines.length;
}
const h79={N:'AQ63',S:'J742',W:'K8',E:'T95'};
const bh79WestSmall=clubs(h79,[
 'S 2 W 8 N Q E 5','N A E 9 S 4 W K','N 3 E T S J W -','S 7 W - N 6 E -'
],['N','N','S','S']);
const bh79WestKing=clubs(h79,[
 'S 2 W K N A E 5','N Q E 9 S 4 W 8','N 3 E T S J W -','S 7 W - N 6 E -'
],['N','N','S','S']);
const bh80=clubs({N:'AJ42',S:'K65',W:'T873',E:'Q9'},[
 'N A E 9 S 5 W 3','N 4 E Q S K W 7','S 6 W 8 N J E -','N 2 E - S - W T'
],['N','S','N','W']);
const deal82={N:'Q2.K5.QJT2.QJT93',E:'JT96.9873.76.AK2',S:'A43.A2.AK983.875',W:'K875.QJT64.54.64'};
const line82King=[
 'W HQ N H5 E H3 S HA','S S3 W SK N S2 E S6','W HJ N HK E H7 S H2',
 'N DQ E D6 S DA W D4','S S4 W S5 N SQ E S9','N DJ E D7 S DK W D5',
 'S SA W S7 N C3 E ST','S D9 W H4 N DT E C2','N D2 E H8 S D8 W H6',
 'S D3 W HT N C9 E H9','S C8 W C4 N CT E CA','E CK S C7 W C6 N CJ',
 'E SJ S C5 W S8 N CQ'
];
const line82Duck=[
 'W HQ N H5 E H3 S HA','S S3 W S5 N SQ E S6','N DQ E D6 S DA W D4',
 'S SA W SK N S2 E S9','S DK W D5 N DJ E D7','S D9 W H4 N DT E H7',
 'N D2 E H8 S D8 W H6','S D3 W HT N C3 E H9','S H2 W HJ N HK E C2',
 'N C9 E CA S C5 W C4','E CK S C7 W C6 N CT','E SJ S S4 W S7 N CJ',
 'E ST S C8 W S8 N CQ'
];
const bh82King=run52(deal82,line82King),bh82Duck=run52(deal82,line82Duck);
assert.deepEqual([bh82King.ns,bh82Duck.ns],[9,9]);
assert.equal(line82King[1],'S S3 W SK N S2 E S6');
assert.equal(line82King[4],'S S4 W S5 N SQ E S9');
const deal84={N:'Q72.754.A953.853',E:'K653.QT6.KQ72.J9',S:'AJT984.A82.6.AK4',W:'.KJ93.JT84.QT762'};
const line84=[
 'W DJ N DA E D2 S D6','N S7 E S3 S S4 W C2','N SQ E SK S SA W C6',
 'S SJ W C7 N S2 E S5','S ST W CT N H4 E S6','S S9 W H3 N H5 E H6',
 'S S8 W H9 N H7 E HT','S HA W HK N D3 E HQ','S CA W CQ N C3 E C9',
 'S CK W DT N C5 E CJ','S C4 W D8 N C8 E D7','N D5 E DK S H2 W D4',
 'E DQ S H8 W HJ N D9'
];
const bh84=run52(deal84,line84,'S');
assert.equal(bh84.ns,11);
assert.equal(line84[1],'N S7 E S3 S S4 W C2');
const result={bh79WestSmall,bh79WestKing,bh80,bh82King,bh82Duck,bh84};
if(require.main===module)console.log('BH079-084 PASS '+JSON.stringify(result));
module.exports=result;