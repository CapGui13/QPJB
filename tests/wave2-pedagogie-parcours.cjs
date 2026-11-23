'use strict';
// QPJB vague 2 M1 : garde-fou documentaire, aucune mutation du catalogue.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const embedded=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert(embedded,'JSON QCM embarqué introuvable');
const data=JSON.parse(embedded[1]);
assert.equal(data.exercises.length,1523,'Le nombre de QCM a changé');
assert.equal(new Set(data.exercises.map(x=>x.id)).size,1523,'IDs non uniques');
assert.equal(data.themes.length,22,'Le nombre de thèmes a changé');
const p1=JSON.parse(fs.readFileSync(path.join(root,'audits/v1-evolutions/pedagogie/propositions-mineures-fit-20.json'),'utf8'));
const p2=JSON.parse(fs.readFileSync(path.join(root,'audits/v1-evolutions/pedagogie/propositions-roudi-conventions-16.json'),'utf8'));
const proposals=[...p1.proposals,...p2.proposals];
assert.equal(proposals.length,36,'Les propositions historiques ont changé');
const excluded=new Set(proposals.map(x=>x.id));
assert.equal(excluded.size,36,'Les propositions historiques ont des IDs répétés');
const allIds=new Set(data.exercises.map(x=>x.id));
for(const id of excluded)assert(allIds.has(id),'ID historique absent : '+id);
const engine=fs.readFileSync(path.join(root,'quizz-parcours.js'),'utf8');
const roadmapSource=engine.match(/const ROADMAP=\[([\s\S]*?)\];/);
assert(roadmapSource,'ROADMAP absente');
const roadmap=[...roadmapSource[1].matchAll(/\['([a-z_]+)',(\d+)\]/g)].map(m=>({theme:m[1],session:Number(m[2])}));
assert.equal(roadmap.length,22,'La ROADMAP doit couvrir 22 thèmes');
assert.equal(new Set(roadmap.map(x=>x.theme)).size,22,'ROADMAP non unique');
for(const t of data.themes)assert(roadmap.some(r=>r.theme===t.id),'Thème sans introduction : '+t.id);
const profiles=[
 {themes:['ouv','majeur','mineur','sa'],min:1,max:2,per:5},
 {themes:['red','second','stayman','apres_fit','intervenir','contre','reponse_inter','apres_inter','barrage','reveil'],min:2,max:3,per:4},
 {themes:['roudi','drury','fortes','forcing','multilandy','rubensohl','michaels','chelem'],min:3,max:5,per:4}
];
const chosen=[];
for(const p of profiles)for(const theme of p.themes){
 const eligible=data.exercises.filter(x=>x.theme===theme&&x.difficulty>=p.min&&x.difficulty<=p.max&&!excluded.has(x.id))
   .sort((a,b)=>a.difficulty-b.difficulty||a.id.localeCompare(b.id));
 const families=new Set(),situations=new Set();let n=0;
 for(const x of eligible){
  const signature=(x.auction||[]).join('>')+'|'+x.answer;
  if(families.has(x.caseFamily)||situations.has(signature))continue;
  families.add(x.caseFamily);situations.add(signature);chosen.push(x.id);
  if(++n===p.per)break;
 }
 assert.equal(n,p.per,'Rubrique sous-remplie : '+theme);
}
assert.equal(chosen.length,92,'Parcours référence changé');
assert.equal(new Set(chosen).size,92,'IDs répétés entre parcours');
for(const id of chosen)assert(!excluded.has(id),'Proposition historique sélectionnée : '+id);
console.log('PASS wave2-pedagogie: 1523 IDs, 22 thèmes, 36 exclusions, 92 sélections distinctes');
