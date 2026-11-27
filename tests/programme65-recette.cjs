'use strict';
// Programme #528: targeted 65-session smoke, no optimization objective.
const fs=require('node:fs'),assert=require('node:assert/strict');
const api=require('../quizz-parcours.js'),meta=require('../quizz-prerequis.js').byId;
const data=JSON.parse(fs.readFileSync('quizz.html','utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const plan=JSON.parse(fs.readFileSync('audits/programme-65-20261127/programme-normalise.json','utf8')).sessions;
const by=new Map(data.map(q=>[q.id,q]));
assert.equal(plan.length,65);assert.equal(data.length,1915);
const result=[];
for(const [profile,threshold] of [['autonome',0],['intermediaire',.33],['faible',.75]]){
 let state=api.empty();
 for(let s=1;s<=65;s++){
  const p=plan[s-1],goals=new Set(p.groups.filter(g=>['objectif','transition','réinvestissement','transfert'].includes(g.role)).flatMap(g=>g.ids));
  const deck=api.start(state,data);
  assert.equal(deck.length,10,profile+' S'+s+' length');
  assert.equal(new Set(deck.map(q=>q.id)).size,10,profile+' S'+s+' distinct IDs');
  assert.equal(new Set(deck.map(q=>q.caseFamily||q.id)).size,10,profile+' S'+s+' distinct families');
  assert(deck.every(q=>by.has(q.id)&&api.eligibility(q,state,data).eligible),profile+' S'+s+' eligibility');
  const hash=str=>{let h=2166136261;for(const c of str)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h/4294967296};
  const items=deck.map((q,i)=>({id:q.id,concept:meta[q.id].concept,answer:q.answer,objective:goals.has(q.id),result:hash(q.id+'|'+s+'|11')<threshold?'wrong':'correct'}));
  for(let i=0;i<deck.length;i++){
   const q=deck[i],a=items[i];assert(api.record(state,q,a.result,i,a.result==='correct'?q.answer:q.choices.find(x=>x!==q.answer),false,false));
   if(i===2){const raw=JSON.stringify(state.active),restore=api.load(JSON.stringify(state));assert.equal(JSON.stringify(restore.active),raw);assert.deepEqual(api.start(restore,data).map(x=>x.id),deck.map(x=>x.id));state=restore}
  }
  assert(api.finish(state,data));assert.equal(state.completed,s);
  result.push({profile,session:s,objective:p.objective,objectiveItems:items.filter(x=>x.objective).length,items});
 }
}
fs.mkdirSync('programme-output',{recursive:true});
fs.writeFileSync('programme-output/selection.json',JSON.stringify(result,null,2));
const summary=['# Sélections générées S1–65','Réponses synthétiques, pas preuve d’apprentissage humain.','| Profil | Séance | Objectif | QCM de l’objectif | IDs |','|---|---:|---|---:|---|',...result.map(x=>'| '+[x.profile,x.session,x.objective.replace(/\|/g,'/'),x.objectiveItems,x.items.map(q=>q.id).join(', ')].join(' | ')+' |')];
fs.writeFileSync('programme-output/selection.md',summary.join('\n')+'\n');
console.log('PROGRAMME65_PASS '+JSON.stringify({sessions:result.length,questions:result.length*10,profiles:[...new Set(result.map(x=>x.profile))].map(p=>{const rows=result.filter(x=>x.profile===p);return {p,objectiveItems:rows.reduce((n,x)=>n+x.objectiveItems,0),emptyObjectives:rows.filter(x=>!x.objectiveItems).map(x=>x.session),minimum:Math.min(...rows.map(x=>x.objectiveItems))}})}));
