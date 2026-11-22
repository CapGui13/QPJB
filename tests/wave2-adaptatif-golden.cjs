#!/usr/bin/env node
'use strict';
// M2 P17: verrou longitudinal sur 5 profils x 65/153 séances x 3 graines,
// calculé d'après les neuf rapports de référence P2.
const assert=require('node:assert/strict');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const fields=['profile','horizon','seed','uniqueIds','uniqueThemes','uniqueFamilies','uniqueContexts','uniqueDecisions','hard','weak','helped','review','foundation','weakDueAvailable','weakDueSelected','sessionThemes','sessionFamilies','themeDigest'];
const golden=[["autonome",65,11,650,22,638,151,234,260,0,0,59,188,0,0,451,650,"8ab8ea1b"],["echecs",65,11,523,22,504,99,179,0,600,0,127,479,15445,127,348,650,"b2b9f091"],["modere",65,11,522,22,475,99,179,92,203,0,128,248,2821,128,487,650,"55524658"],["aides",65,11,523,22,491,103,173,2,502,470,127,486,11784,127,401,650,"0e016393"],["progression",65,11,523,22,480,106,208,11,414,0,127,435,11237,127,410,650,"44f2d13d"],["autonome",65,29,650,22,638,151,234,260,0,0,59,188,0,0,451,650,"8ab8ea1b"],["echecs",65,29,523,22,498,96,174,0,617,0,127,494,15614,127,351,650,"cbb60261"],["modere",65,29,522,22,472,111,180,53,218,0,128,267,2534,128,479,650,"cc1e463b"],["aides",65,29,523,22,521,100,178,4,499,475,127,479,12025,127,381,650,"338f2ae4"],["progression",65,29,523,22,481,103,178,9,411,0,127,443,10546,127,424,650,"d0a11d09"],["autonome",65,47,650,22,638,151,234,260,0,0,59,188,0,0,451,650,"8ab8ea1b"],["echecs",65,47,523,22,496,95,174,0,615,0,127,503,15741,127,360,650,"5e0d44fd"],["modere",65,47,522,22,480,100,177,96,218,0,128,256,2918,128,505,650,"c28fb608"],["aides",65,47,523,22,511,104,187,3,502,469,127,491,12373,127,368,650,"1db99b67"],["progression",65,47,523,22,497,101,189,4,425,0,127,461,10928,127,397,650,"02de9fd2"],["autonome",153,11,1523,22,1315,171,298,442,0,0,153,652,0,0,1059,1530,"ce23ce48"],["echecs",153,11,1227,22,1029,152,264,143,1427,0,303,899,85536,303,1007,1530,"c26c4e39"],["modere",153,11,1226,22,1108,165,284,426,481,0,304,548,13727,304,1199,1530,"26f27fee"],["aides",153,11,1227,22,1037,157,267,151,1161,1103,303,883,65772,303,1087,1530,"c7352f50"],["progression",153,11,1227,22,1097,169,292,432,600,0,303,675,39197,303,1158,1530,"f84b8419"],["autonome",153,29,1523,22,1315,171,298,442,0,0,153,652,0,0,1059,1530,"ce23ce48"],["echecs",153,29,1227,22,1027,151,263,142,1452,0,303,890,87517,303,1006,1530,"aa9725e0"],["modere",153,29,1226,22,1097,162,285,396,525,0,304,622,16709,304,1189,1530,"53d6e3ae"],["aides",153,29,1227,22,1036,160,268,151,1179,1120,303,867,66744,303,1091,1530,"3a4b492c"],["progression",153,29,1227,22,1083,167,290,375,594,0,303,684,39008,303,1216,1530,"fe8ebb65"],["autonome",153,47,1523,22,1315,171,298,442,0,0,153,652,0,0,1059,1530,"ce23ce48"],["echecs",153,47,1227,22,1027,153,267,141,1428,0,303,891,86653,303,1020,1530,"c6039f1c"],["modere",153,47,1226,22,1088,161,288,411,520,0,304,560,16550,304,1226,1530,"a71ebf29"],["aides",153,47,1227,22,1034,164,273,148,1178,1112,303,864,67104,303,1084,1530,"cc92a525"],["progression",153,47,1227,22,1095,163,287,359,617,0,303,708,40939,303,1201,1530,"2526560c"]];
function fnv(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),0x01000193)>>>0;return h.toString(16).padStart(8,'0');}
function project(r){let q=r.questions;return [r.profile,r.horizon,r.seed,r.uniqueIds,r.uniqueThemes,r.uniqueFamilies,r.uniqueContexts,r.uniqueDecisions,Math.round(r.hardShare*q),Math.round(r.weakShare*q),Math.round(r.helpedShare*q),Math.round(r.reviewShare*q),Math.round(r.foundationShare*q),r.weakDueAvailable,r.weakDueSelected,Math.round(r.avgThemesPerSession*r.horizon),Math.round(r.avgFamiliesPerSession*r.horizon),fnv(JSON.stringify(r.themeCounts))];}
const key=r=>r.slice(0,3).join('/');
function verifyProjected(actual,reference=golden){
 const exp=new Map(reference.map(r=>[key(r),r]));
 assert.equal(exp.size,reference.length,'Références dupliquées');
 assert.equal(actual.length,reference.length,'Nombre de trajectoires');
 const seen=new Set();
 for(const row of actual){
  const id=key(row);assert(!seen.has(id),'Trajectoire dupliquée '+id);seen.add(id);
  const wanted=exp.get(id);assert(wanted,'Trajectoire inconnue '+id);
  for(let i=0;i<fields.length;i++)assert.deepEqual(row[i],wanted[i],id+' : '+fields[i]);
 }
 return seen.size;
}
function verify(rows,reference=golden){return verifyProjected(rows.map(project),reference);}
function main(argv=process.argv.slice(2)){
 if(argv.length===1&&argv[0]==='--selftest'){
  assert.equal(verifyProjected(golden),30);
  const bad=golden.map(r=>r.slice());bad[0][5]++;assert.throws(()=>verifyProjected(bad),/uniqueFamilies/);
  assert.throws(()=>verifyProjected(golden.slice(1)),/Nombre de trajectoires/);
  const dupe=golden.map(r=>r.slice());dupe[1]=dupe[0];assert.throws(()=>verifyProjected(dupe),/Trajectoire dupliquée/);
  console.log('PASS: 30 références, variations de famille/doublon/absence détectées');
  return;
 }
 const args=['--json'],options={};
 for(const flag of ['profile','horizon','seed']){
  const i=argv.indexOf('--'+flag);
  if(i>=0){assert(i+1<argv.length,flag+' sans valeur');options[flag]=argv[i+1];args.push('--'+flag,options[flag]);}
 }
 assert.equal(argv.length,Object.keys(options).length*2,'Arguments non reconnus');
 const selected=golden.filter(r=>['profile','horizon','seed'].every((name,i)=>!options[name]||String(r[i])===String(options[name])));
 assert(selected.length>0,'Aucune trajectoire');
 const out=spawnSync(process.execPath,[path.join(__dirname,'wave2-adaptatif-benchmark.cjs'),...args],{encoding:'utf8',maxBuffer:5*1024*1024});
 if(out.error||out.status!==0)throw Error(out.error?.message||out.stderr||'Benchmark échoué');
 const d=JSON.parse(out.stdout);assert.equal(d.catalogue,1523);
 console.log('PASS: '+verify(d.results,selected)+' trajectoires Node appariées aux références P2');
}
if(require.main===module)main();
module.exports={golden,fields,fnv,project,verifyProjected,verify};
