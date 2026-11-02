#!/usr/bin/env node
// Audit statique en lecture seule : quatre axes indépendants, sans modèle IA.
// Ne modifie ni le catalogue, ni le site, ni la progression.
const fs=require('node:fs');
const path=require('node:path');
const axis=process.argv[2];
const allowed=['enchere','distracteurs','explications','difficulte'];
if(!allowed.includes(axis))throw Error('Axe inconnu : '+axis);
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\\/json">([\\s\\S]*?)<\\/script>/);
if(!match)throw Error('Catalogue introuvable');
const exercises=JSON.parse(match[1]).exercises;
const findings=[];
for(const x of exercises){
 const issue=(severity,code,detail)=>findings.push({id:x.id,theme:x.theme,severity,code,detail});
 if(axis==='enchere'){
  if(!x.answer||!Array.isArray(x.choices)||!x.choices.includes(x.answer))issue('error','answer','Réponse absente des propositions');
  if(!Array.isArray(x.auction)||!x.auction.length)issue('review','auction','Séquence absente : vérifier le contexte');
 }
 if(axis==='distracteurs'){
  if(!Array.isArray(x.choices)||x.choices.length!==4||new Set(x.choices).size!==4)issue('error','choices','Quatre choix distincts requis');
  if(x.choices?.some(c=>typeof c!=='string'||!c.trim()))issue('error','empty-choice','Proposition vide');
 }
 if(axis==='explications'){
  if(typeof x.explain!=='string'||x.explain.trim().length<35)issue('review','explain','Explication absente ou très courte');
  if(x.whyNot||x.takeaway)issue('error','obsolete','Ancien commentaire comparatif présent');
 }
 if(axis==='difficulte'){
  if(!Number.isInteger(x.difficulty)||x.difficulty<1||x.difficulty>5)issue('error','difficulty','Difficulté hors échelle 1–5');
  if(!x.difficultyReason||x.difficultyReason.trim().length<15)issue('review','reason','Justification de difficulté courte ou absente');
 }
}
const report={axis,kind:'audit-statique-sans-IA',count:exercises.length,findings,summary:{errors:findings.filter(f=>f.severity==='error').length,toReview:findings.filter(f=>f.severity==='review').length},warning:'Les jugements SEF, la plausibilité des pièges et la difficulté réelle nécessitent une revue experte indépendante.'};
fs.mkdirSync('audit-output',{recursive:true});
fs.writeFileSync('audit-output/'+axis+'.json',JSON.stringify(report,null,2)+'\\n');
console.log(JSON.stringify({axis,count:report.count,...report.summary}));
if(report.summary.errors)process.exitCode=1;
