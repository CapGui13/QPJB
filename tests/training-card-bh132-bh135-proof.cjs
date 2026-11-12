'use strict';
// Contre-expertise des pages 2 des fascicules BH132 et BH135 (06/09 et 27/09/2024).
// BH132 : 2 mains connues, exemples du corrigé et dénombrement exact.
// BH135 : source erronée (deux ♣6) ; simulation SUR UNE RÉPARATION HYPOTHÉTIQUE.
const assert=require('node:assert/strict');
const R='23456789TJQKA',SEATS='NESW',SUITS='SHDC';
function hand(str){
 const parts=str.split('.');
 assert.equal(parts.length,4);
 return parts.flatMap((r,i)=>[...r].map(c=>SUITS[i]+c));
}
function makeDeal(hands,valid=true){
 const d={},all=[];
 for(const [s,h] of Object.entries(hands)){
  const cards=hand(h);
  assert.equal(cards.length,13,s);
  assert.equal(new Set(cards).size,13,s);
  d[s]=new Set(cards);all.push(...cards);
 }
 assert.equal(all.length,52);
 if(valid){
  assert.equal(new Set(all).size,52);
  for(const s of SUITS)assert.equal(all.filter(c=>c[0]===s).length,13);
 }
 return {d,all};
}
function verifyThirteen(hands,lines){
 const d=makeDeal(hands).d;
 let last='',ns=0,ew=0;
 assert.equal(lines.length,13);
 lines.forEach((line,i)=>{
  const v=line.trim().split(' ');
  assert.equal(v.length,8);
  const plays=[[v[0],v[1]],[v[2],v[3]],[v[4],v[5]],[v[6],v[7]]];
  const st=SEATS.indexOf(plays[0][0]);
  assert.deepEqual(plays.map(p=>p[0]),[0,1,2,3].map(j=>SEATS[(st+j)%4]));
  if(i)assert.equal(plays[0][0],last,'entame '+(i+1));
  const lead=plays[0][1][0];let best=-1;
  for(const [seat,card] of plays){
   assert.ok(d[seat].has(card),'carte indisponible '+seat+card+' pli '+(i+1));
   if(card[0]!==lead)assert.ok(![...d[seat]].some(c=>c[0]===lead),'renonce '+(i+1));
   d[seat].delete(card);
   const score=(card[0]===lead?100:0)+R.indexOf(card[1]);
   if(score>best){best=score;last=seat;}
  }
  if('NS'.includes(last))ns++;else ew++;
 });
 assert.ok(Object.values(d).every(x=>x.size===0));
 return {tricks:13,ns,ew};
}
// ♣6 figure à la fois au mort et en Sud dans LES DEUX PDF originaux.
const printed135={N:'A43.AQ.863.98642',E:'J972.T9873.T4.Q5',S:'KQ.KJ62.A95.AT63',W:'T865.54.KQJ72.KJ'};
const raw135=makeDeal(printed135,false).all;
assert.equal(new Set(raw135).size,51);
assert.equal(raw135.filter(c=>c==='C6').length,2);
assert.ok(!raw135.includes('C7'));
// Hypothèse technique uniquement : ♣6 de Sud -> ♣7.
// Le jeu de la carte de QPJB doit garder ses mains PARTIELLES sans attribution inventée.
const hypothetical135={...printed135,S:'KQ.KJ62.A95.AT73'};
const trace135=[
 'W DK N D3 E D4 S DA',
 'S SK W S5 N S3 E S2',
 'S SQ W S6 N S4 E S7',
 'S H2 W H4 N HA E H3',
 'N SA E SJ S C7 W S8',
 'N HQ E H7 S H6 W H5',
 'N C2 E C5 S CA W CJ',
 'S HK W D2 N D6 E H8',
 'S HJ W D7 N D8 E H9',
 'S D5 W DQ N C4 E DT',
 'W DJ N C6 E CQ S D9',
 'W ST N C8 E S9 S C3',
 'W CK N C9 E HT S CT'
];
const bh135=verifyThirteen(hypothetical135,trace135);
assert.deepEqual(bh135,{tricks:13,ns:9,ew:4});
// Les probabilités BH132-M02 supposent les 26 cartes inconnues
// distribuées 13 à l'Ouest et 13 à l'Est, toutes équiprobables.
function comb(n,k){
 if(k<0||k>n)return 0;
 let p=1;
 for(let i=1;i<=k;i++)p=p*(n-i+1)/i;
 return Math.round(p);
}
let total=0,finesses=0,probe=0;
const absent='Q87653';
for(let bits=0;bits<64;bits++){
 const west=[...absent].filter((_,i)=>bits&(1<<i)),east=[...absent].filter((_,i)=>!(bits&(1<<i)));
 const wt=comb(20,13-west.length);
 total+=wt;
 // Deux impasses : Dame Ouest avec 1 à 4 Trèfles.
 if(west.includes('Q')&&west.length<=4)finesses+=wt;
 // As au premier tour : Dame Ouest courte au plus troisième,
 // ou Dame sèche Est capturée au coup de sonde.
 if((west.includes('Q')&&west.length<=3)||(east.includes('Q')&&east.length===1))probe+=wt;
}
assert.equal(total,comb(26,13));
const pFinesses=finesses/total,pProbe=probe/total;
assert.equal(Math.round(1000*pFinesses)/10,43.2);
assert.equal(Math.round(1000*pProbe)/10,28.3);
// Dans les exemples imprimés, les Trèfles sont les 13 cartes distinctes.
// Les rentrées EXTERIEURES entre les plis sont stipulées par BH132.
function verifySuit(hands,lines,winners){
 const cards=Object.values(hands).flatMap(x=>[...x]);
 assert.equal(cards.length,13);assert.equal(new Set(cards).size,13);
 const d=Object.fromEntries(Object.entries(hands).map(([s,v])=>[s,new Set(v)]));
 lines.forEach((line,i)=>{
  const v=line.split(' '),plays=[];
  assert.equal(v.length,8);
  for(let j=0;j<8;j+=2)plays.push([v[j],v[j+1]]);
  let win='',best=-1;
  const st=SEATS.indexOf(plays[0][0]);
  assert.deepEqual(plays.map(p=>p[0]),[0,1,2,3].map(j=>SEATS[(st+j)%4]));
  for(const [seat,c] of plays){
   if(c==='-'){assert.equal(d[seat].size,0);continue;}
   assert.ok(d[seat].has(c),'pli '+(i+1)+' '+seat+c);
   d[seat].delete(c);
   if(R.indexOf(c)>best){best=R.indexOf(c);win=seat;}
  }
  assert.equal(win,winners[i]);
 });
 assert.ok(Object.values(d).every(x=>x.size===0));
}
verifySuit({N:'AKJ5',S:'T42',W:'Q8',E:'9763'},[
 'N A E 3 S 2 W 8','S 4 W Q N K E 6','N 5 E 7 S T W -','N J E 9 S - W -'
],['N','N','S','N']);
verifySuit({N:'AKJT9',S:'42',W:'Q875',E:'63'},[
 'S 2 W 5 N J E 3','S 4 W 7 N T E 6','N A E - S - W 8',
 'N K E - S - W Q','N 9 E - S - W -'
],['N','N','N','N','N']);
if(require.main===module)console.log(JSON.stringify({status:'PASS',bh135,pFinesses,pProbe,warning:'BH135: ♣7 = reconstruction hypothétique'}));
module.exports={bh135,pFinesses,pProbe};
