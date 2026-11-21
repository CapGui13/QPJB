'use strict';
/* QPJB V2 M3 : garde-fous sans dépendance externe. Exécuter : node tests/wave2-ux-contract.cjs */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const cp=require('node:child_process');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const embedded=source=>{
 const match=source.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
 assert.ok(match,'Catalogue JSON embarqué introuvable');
 return match[1];
};
const data=JSON.parse(embedded(html));
assert.equal(data.exercises.length,1523,'1523 QCM préservés');
assert.equal(data.themes.length,22,'22 rubriques préservées');
assert.equal(new Set(data.exercises.map(x=>x.id)).size,1523,'IDs uniques');
const base='2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a';
try{
 const original=cp.execFileSync('git',['show',base+':quizz.html'],{encoding:'utf8',maxBuffer:10*1024*1024});
 assert.equal(embedded(html),embedded(original),'Catalogue strictement inchangé (octet pour octet)');
 for(const anchor of ["const saveKey='qpjb-sef-entrainement-01'","function saveParcours()"]){
  assert.ok(html.includes(anchor),'Sauvegarde manquante : '+anchor);
 }
 console.log('PASS catalogue strictement identique à '+base);
}catch(e){
 if(e.code==='ERR_ASSERTION'||e.name==='AssertionError')throw e;
 if(!/fatal:|not a git repository|unknown revision/.test(String(e.stderr||e.message)))throw e;
 console.log('NOTE base Git indisponible : comparaison catalogue contre SHA différée');
}
const checks=[
 ['navigation directe',/class="qpjb-quiz-skip" href="#question-heading"/],
 ['cible question',/id="question-heading" tabindex="-1"/],
 ['annonces séparées',/id="qpjb-quiz-announcement"[^>]*role="status" aria-live="polite"/],
 ['conteneur non live',/<div id="body"><\/div>/],
 ['erreur associée au champ',/stage\.error\?'aria-describedby="bid-free-error"'/],
 ['corrigé focalisable',/id="answer-feedback" role="region" tabindex="-1"/],
 ['annonce réponse',/announceQuizChange\('Réponse enregistrée\./],
 ['annonce choix',/announceQuizChange\('Quatre propositions disponibles\./],
 ['annonce progression',/announceQuizChange\('Question '/],
 ['largeur mobile 390',/@media\(max-width:390px\)/],
 ['largeur mobile 345',/@media\(max-width:345px\)/],
 ['mouvement réduit',/@media\(prefers-reduced-motion:reduce\)/],
 ['retour visible clavier',/\.qpjb-quiz-skip:focus-visible/]
];
for(const [label,pattern] of checks)assert.match(html,pattern,label);
console.log('PASS '+checks.length+' garde-fous UI/ARIA et catalogue '+data.exercises.length+'/'+data.themes.length);
