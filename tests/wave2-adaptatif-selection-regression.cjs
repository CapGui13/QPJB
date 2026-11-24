#!/usr/bin/env node
'use strict';
// QPJB wave2 M2 — tirages de reference figes avant optimisation du tri.
// L'empreinte porte sur les 120 IDs et leur ordre (12 seances, graine 29).
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const historical=require('./progression-guidee-historical.cjs');
const api=historical.engine();
const html=fs.readFileSync(path.join(__dirname,'../quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert(match,'Catalogue embarque absent');
const data=historical.catalogue(),exercises=data.exercises;
assert.equal(exercises.length,1523);
assert.equal(data.themes.length,22);
const expected={
  autonome:'f40bd476',echecs:'da7b1d3b',modere:'c1f5db5d',
  aides:'bb255024',progression:'30d7b9ff'
};
function rng(seed){let s=seed>>>0;return ()=>((s=(Math.imul(1664525,s)+1013904223)>>>0)/4294967296)}
function fingerprint(str){
 let h=2166136261;
 for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16);
}
function run(profile){
 const state=api.empty(),rand=rng(29),ids=[];
 for(let s=0;s<12;s++){
   const picks=api.start(state,exercises);
   assert.equal(picks.length,10);
   assert.equal(new Set(picks.map(x=>x.id)).size,10);
   assert.deepEqual(state.active.ids,picks.map(x=>x.id));
   assert.equal(state.active.selection.length,10);
   ids.push(picks.map(x=>x.id).join(','));
   picks.forEach((x,i)=>{
     const p=profile==='autonome'?0:profile==='echecs'?.94:
       profile==='modere'?.33:profile==='aides'?.15:Math.max(.07,.83-s*.006);
     const assisted=profile==='aides'&&rand()<.72;
     assert.equal(api.record(state,x,rand()<p?'wrong':'correct',i,null,assisted,false),true);
   });
   assert.equal(api.finish(state,exercises),true);
   assert.equal(state.completed,s+1);
 }
 assert.equal(api.load(JSON.stringify(state)).completed,12);
 return fingerprint(ids.join('|'));
}
for(const [profile,value] of Object.entries(expected))
 assert.equal(run(profile),value,'Changement de tirage du profil '+profile);
console.log('PASS: 5 profils x 12 seances, 600 selections identiques au moteur precedent.');
