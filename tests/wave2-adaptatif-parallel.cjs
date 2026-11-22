#!/usr/bin/env node
'use strict';
// M2 : lance les cinq profils indépendants en processus Node distincts.
// Préserve les 30 trajectoires et leurs seeds ; compare tous les résultats au golden P2.
const assert=require('node:assert/strict');
const path=require('node:path');
const {spawn}=require('node:child_process');
const goldenModule=require('./wave2-adaptatif-golden.cjs');
const golden=goldenModule.golden||goldenModule.expected;
const verify=goldenModule.verify;
const profiles=['autonome','echecs','modere','aides','progression'];
const script=path.join(__dirname,'wave2-adaptatif-benchmark.cjs');
function checkBatch(profile,obj){
 assert.equal(obj.catalogue,1523,'Catalogue inattendu pour '+profile);
 assert(Array.isArray(obj.results));
 assert.equal(obj.results.length,6,'Six trajectoires requises pour '+profile);
 const keys=new Set();
 for(const row of obj.results){
   assert.equal(row.profile,profile,'Mélange de profils');
   assert([65,153].includes(row.horizon),'Horizon invalide');
   assert([11,29,47].includes(row.seed),'Graine invalide');
   const key=row.horizon+'/'+row.seed;
   assert(!keys.has(key),'Trajectoire répétée '+profile+'/'+key);
   keys.add(key);
 }
 return obj.results;
}
function singleProfile(profile){
 return new Promise((resolve,reject)=>{
   const start=Date.now();let stdout='',stderr='';
   const child=spawn(process.execPath,[script,'--json','--profile',profile],
     {cwd:path.join(__dirname,'..'),stdio:['ignore','pipe','pipe']});
   child.on('error',reject);
   child.stdout.on('data',chunk=>{
     stdout+=chunk.toString('utf8');
     if(stdout.length>5*1024*1024)child.kill();
   });
   child.stderr.on('data',chunk=>{stderr+=chunk.toString('utf8').slice(0,4096);});
   child.on('close',(code,signal)=>{
     if(code!==0)return reject(Error(profile+' a échoué code '+code+' signal '+signal+': '+stderr.slice(-900)));
     try{
       const results=checkBatch(profile,JSON.parse(stdout));
       console.log('[M2] '+profile+' : 6/6 trajectoires Node, '+((Date.now()-start)/1000).toFixed(1)+' s');
       resolve(results);
     }catch(e){reject(Error(profile+': '+e.message));}
   });
 });
}
async function main(argv=process.argv.slice(2)){
 if(argv.length===1&&argv[0]==='--selftest'){
   assert.equal(profiles.length,5);
   assert.equal(golden.length,30);
   for(const p of profiles){
     const rows=[65,153].flatMap(h=>[11,29,47].map(seed=>({profile:p,horizon:h,seed})));
     assert.equal(checkBatch(p,{catalogue:1523,results:rows}).length,6);
     assert.throws(()=>checkBatch(p,{catalogue:1523,results:[...rows.slice(0,5),rows[0]]}),/répétée/);
   }
   console.log('PASS: 5 processus, 6 trajectoires par profil, doublons détectés');
   return;
 }
 assert.equal(argv.length,0,'Usage : parallel [--selftest]');
 const start=Date.now();
 const batches=await Promise.all(profiles.map(singleProfile));
 const results=batches.flat();
 assert.equal(results.length,30);
 const verified=verify(results);
 console.log('PASS: '+verified+'/30 trajectoires, 32 700 réponses simulées, toutes métriques P2 identiques en '+((Date.now()-start)/1000).toFixed(1)+' s');
}
if(require.main===module)main().catch(e=>{console.error('[M2] ECHEC '+e.stack);process.exitCode=1;});
module.exports={profiles,checkBatch,singleProfile,main};
