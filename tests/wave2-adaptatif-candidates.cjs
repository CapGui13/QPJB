#!/usr/bin/env node
'use strict';
// QPJB wave2 M2 — banc d'essais sur des copies temporaires du moteur.
// Ne modifie ni le moteur de production, ni les QCM, ni les sauvegardes.
// Utilisation : node tests/wave2-adaptatif-candidates.cjs --variant foundation --json [--horizon 65] [--seed 11]
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=require('./progression-guidee-historical.cjs').source();
const {simulate,profiles,horizons,seeds,exercises}=require('./wave2-adaptatif-benchmark.cjs');
function patchOnce(text,needle,replacement){
 const first=text.indexOf(needle);
 assert(first>=0,'Point de patch introuvable: '+needle);
 assert.equal(text.indexOf(needle,first+needle.length),-1,'Patch non unique');
 return text.slice(0,first)+replacement+text.slice(first+needle.length);
}
function modified(variant){
 if(variant==='score-cache'){
   // Essai technique uniquement : le SHA du moteur original est un contrat CI.
   return patchOnce(source,
     "ranked.sort((a,b)=>score(b)-score(a)||hash(a.id+'#'+s)-hash(b.id+'#'+s));\n      const winner=ranked[0];",
     "const scored=ranked.map(x=>({exercise:x,value:score(x),tie:hash(x.id+'#'+s)}));\n"+
     "      scored.sort((a,b)=>b.value-a.value||a.tie-b.tie);\n"+
     "      const winner=scored[0].exercise;");
 }
 if(variant==='foundation'){
   return patchOnce(source,'?(severeStruggling?-250:-110):0;',
     '?(severeStruggling?-520:-220):0;');
 }
 if(variant==='overdue'){
   // Prioriser l'ancienneté parmi les revisions faibles déjà dues.
   // Deux positions par séance : aucun quota supplémentaire.
   return patchOnce(source,
     "        const review=kind==='revision'\n"+
     "          ?(previous[x.id]?.result==='wrong'?40:previous[x.id]?.result==='skipped'?30:previous[x.id]?.assisted?20:0)\n"+
     "          :0;",
     "        const old=previous[x.id];\n"+
     "        const late=kind==='revision'&&old&&\n"+
     "          (old.result!=='correct'||old.assisted)\n"+
     "          ?Math.min(240,Math.max(0,s-old.due)*4):0;\n"+
     "        const review=(kind==='revision'\n"+
     "          ?(old?.result==='wrong'?40:old?.result==='skipped'?30:old?.assisted?20:0)\n"+
     "          :0)+late;");
 }
 if(variant==='recall'){
   let text=patchOnce(source,
     'Math.min(weakDueCandidates.length?2:1,Math.floor(limit/4),due.length)',
     'Math.min(weakDueCandidates.length?3:1,Math.floor(limit/3),due.length)');
   return patchOnce(text,"i===3||i===7?'revision':'nouveau'",
     "i===3||i===7||i===9?'revision':'nouveau'");
 }
 throw Error('Candidat inconnu: '+variant);
}
function option(name){
 const i=process.argv.indexOf('--'+name);
 return i<0?null:process.argv[i+1];
}
const variant=option('variant');
assert(['foundation','recall','overdue','score-cache'].includes(variant),'--variant foundation|recall|overdue|score-cache obligatoire');
const candidateSource=modified(variant);
const candidateModule={exports:{}};
new Function('module',candidateSource)(candidateModule);
const results=[];
for(const profile of profiles.filter(x=>!option('profile')||x===option('profile')))
 for(const horizon of horizons.filter(x=>!option('horizon')||x===Number(option('horizon'))))
  for(const seed of seeds.filter(x=>!option('seed')||x===Number(option('seed'))))
   results.push(simulate(profile,horizon,seed,candidateModule.exports));
const data={catalogue:exercises.length,results};
assert(data.results.length>=1);
assert(data.results.every(row=>row.uniqueThemes===22&&row.questions===row.horizon*10));
process.stdout.write(JSON.stringify({variant,description:
 variant==='score-cache'?'Optimisation neutre du tri, seulement en copie experimentale':
 variant==='foundation'?'Renforcer la penalite des cas difficiles en fragilite averee':
 variant==='overdue'?'Favoriser les rappels faibles les plus en retard a quota inchange':
 'Tester trois rappels planifies au lieu de deux, sans inventer de preuve',
 catalogue:data.catalogue,results:data.results},null,2)+'\n');
