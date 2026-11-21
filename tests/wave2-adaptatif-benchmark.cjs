#!/usr/bin/env node
'use strict';
// QPJB V2 M2 — reproductible deterministic longitudinal benchmark.
// Run: node tests/wave2-adaptatif-benchmark.cjs [--json]
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const api=require('../quizz-parcours.js');
const html=fs.readFileSync(path.join(__dirname,'../quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert(match,'Catalogue embarqué absent');
const data=JSON.parse(match[1]),exercises=data.exercises;
assert.equal(exercises.length,1523);
assert.equal(new Set(exercises.map(x=>x.id)).size,1523);
assert.equal(data.themes.length,22);
const byId=new Map(exercises.map(x=>[x.id,x]));
const profiles=['autonome','echecs','modere','aides','progression'];
const horizons=[65,153],seeds=[11,29,47];
function rng(seed){let s=seed>>>0;return ()=>((s=(Math.imul(1664525,s)+1013904223)>>>0)/4294967296)}
function answer(profile,session,rand){
 const p=profile==='autonome'?0:profile==='echecs'?.94:profile==='modere'?.33:
   profile==='aides'?.15:Math.max(.07,.83-session*.006);
 const assisted=profile==='aides'&&rand()<.72;
 return {result:rand()<p?'wrong':'correct',assisted,hadFreeError:false};
}
function simulate(profile,horizon,seed){
 const state=api.empty(),rand=rng(seed);
 const counts={nouveau:0,revision:0,hard:0,weak:0,assisted:0,foundation:0,weakDueAvailable:0,weakDueSelected:0};
 const themes=new Set(),families=new Set(),contexts=new Set(),decisions=new Set(),ids=new Set();
 const foundations=new Set(['ouv','majeur','mineur','sa','red','second','stayman']);
 const perSession=[],byTheme={};
 for(let s=0;s<horizon;s++){
   const weakDue=new Set(Object.entries(state.entries).filter(([id,r])=>
     (r.result!=='correct'||r.assisted)&&r.due<=s&&r.lastSession<s).map(([id])=>id));
   counts.weakDueAvailable+=weakDue.size;
   const chosen=api.start(state,exercises);
   assert.equal(chosen.length,10,'Séance non remplie : '+s);
   assert.equal(new Set(chosen.map(x=>x.id)).size,10,'Doublon ID');
   const currentThemes=new Set(),currentFamilies=new Set();
   chosen.forEach((x,i)=>{
     const a=answer(profile,s,rand);
     assert.equal(api.record(state,x,a.result,i,null,a.assisted,a.hadFreeError),true);
     const selection=state.active.selection[i];
     assert(['nouveau','revision'].includes(selection.kind));
     counts[selection.kind]++;
     if(weakDue.has(x.id)&&selection.kind==='revision')counts.weakDueSelected++;
     if(foundations.has(x.theme))counts.foundation++;
     byTheme[x.theme]=(byTheme[x.theme]||0)+1;
     if(x.difficulty>=4)counts.hard++;
     if(a.result!=='correct'||a.assisted)counts.weak++;
     if(a.assisted)counts.assisted++;
     themes.add(x.theme);families.add(x.theme+'|'+(x.caseFamily||x.id));
     contexts.add(x.theme+'|'+String(x.auction?.[0]||''));
     decisions.add(x.theme+'|'+String(x.answer||''));ids.add(x.id);
     currentThemes.add(x.theme);currentFamilies.add(x.theme+'|'+(x.caseFamily||x.id));
   });
   perSession.push({themes:currentThemes.size,families:currentFamilies.size});
   assert.equal(api.finish(state,exercises),true);
   assert.equal(state.completed,s+1);
   assert.equal(state.journal.filter(e=>e.mode==='parcours').length,s+1);
 }
 assert.equal(counts.nouveau+counts.revision,horizon*10);
 const summary={
   profile,horizon,seed,questions:horizon*10,uniqueIds:ids.size,
   uniqueThemes:themes.size,uniqueFamilies:families.size,
   uniqueContexts:contexts.size,uniqueDecisions:decisions.size,
   hardShare:counts.hard/(horizon*10),weakShare:counts.weak/(horizon*10),
   helpedShare:counts.assisted/(horizon*10),reviewShare:counts.revision/(horizon*10),
   foundationShare:counts.foundation/(horizon*10),
   weakDueRecallRate:counts.weakDueAvailable?counts.weakDueSelected/counts.weakDueAvailable:null,
   weakDueAvailable:counts.weakDueAvailable,weakDueSelected:counts.weakDueSelected,
   themeCounts:byTheme,
   avgThemesPerSession:perSession.reduce((a,x)=>a+x.themes,0)/horizon,
   avgFamiliesPerSession:perSession.reduce((a,x)=>a+x.families,0)/horizon
 };
 const saved=api.load(JSON.stringify(state));
 assert.equal(saved.completed,horizon,'Sauvegarde: nombre de séances perdu');
 assert.equal(Object.keys(saved.entries).length,Object.keys(state.entries).length);
 assert.equal(saved.active,null);
 return summary;
}
function selected(flag,valid){
 const i=process.argv.indexOf('--'+flag);
 if(i<0)return valid;
 const value=process.argv[i+1],converted=typeof valid[0]==='number'?Number(value):value;
 assert(valid.includes(converted),'Invalid --'+flag+': '+value);
 return [converted];
}
const results=[];
for(const profile of selected('profile',profiles))
 for(const horizon of selected('horizon',horizons))
  for(const seed of selected('seed',seeds))results.push(simulate(profile,horizon,seed));
if(process.argv.includes('--json'))process.stdout.write(JSON.stringify({catalogue:exercises.length,results},null,2)+'\n');
else console.table(results);
