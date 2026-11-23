'use strict';
/* QPJB V2 M3 : garde-fous sans dépendance externe. Exécuter : node tests/wave2-ux-contract.cjs */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const cp=require('node:child_process');
const path=require('node:path');
const crypto=require('node:crypto');
const {restoreApprovedContexts,validateApproved}=require('./qpjb-sef-approved-2sa-20261123.cjs');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const embedded=source=>{
 const match=source.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
 assert.ok(match,'Catalogue JSON embarqué introuvable');
 return match[1];
};
validateApproved(embedded(html));
const data=JSON.parse(embedded(html));
assert.equal(data.exercises.length,1523,'1523 QCM préservés');
assert.equal(data.themes.length,22,'22 rubriques préservées');
assert.equal(new Set(data.exercises.map(x=>x.id)).size,1523,'IDs uniques');
const expectedCatalogueSha256='22ddda0e121684be446439914852637513d691258cc0c564aeffa7fc09f5a54a';
const actualCatalogueSha256=crypto.createHash('sha256').update(restoreApprovedContexts(embedded(html)),'utf8').digest('hex');
assert.equal(actualCatalogueSha256,expectedCatalogueSha256,
 'Le JSON training-data doit rester octet pour octet celui de la base figée, même si Git est indisponible');
console.log('PASS catalogue SHA-256 base figée '+expectedCatalogueSha256);
const preservedStorageContracts=[
 ['clé sauvegarde du Quiz',"const saveKey='qpjb-sef-entrainement-01'"],
 ['clé sauvegarde du parcours',"const parcoursKey='qpjb-sef-parcours-01'"],
 ['écriture de progression guidée','localStorage.setItem(parcoursKey,JSON.stringify(parcoursState))'],
 ['réinjection des réponses sauvegardées','for(const [index,value] of Object.entries(a.answers))'],
 ['enregistrement des tentatives','QPJBParcours.record(parcoursState,x,result,position,choice,assisted,meta.hadFreeError)']
];
for(const [label,fragment] of preservedStorageContracts){
 assert.ok(html.includes(fragment),'Contrat de sauvegarde/reprise manquant : '+label);
}
const base='2d0ac8489ecf97c3232e9e5132060bbe8cdbd71a';
try{
 const original=cp.execFileSync('git',['show',base+':quizz.html'],{encoding:'utf8',maxBuffer:10*1024*1024});
 assert.equal(restoreApprovedContexts(embedded(html)),embedded(original),'Catalogue identique hors les deux contextes approuvés');
 console.log('PASS catalogue strictement identique à '+base);
}catch(e){
 if(e.code==='ERR_ASSERTION'||e.name==='AssertionError')throw e;
 if(!/fatal:|not a git repository|unknown revision/.test(String(e.stderr||e.message)))throw e;
 console.log('NOTE commit Git de base indisponible : SHA-256 du catalogue de base vérifié directement');
}
const checks=[
 ['navigation directe',/class="qpjb-quiz-skip" href="#parcours-start"/],
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
 ['retour visible clavier',/\.qpjb-quiz-skip:focus-visible/],
 ['saut contextuel',/function setQuizSkipTarget\(target,label\)/],
 ['bilan cible accessible',/setQuizSkipTarget\('session-summary-title','Aller directement au bilan'\)/],
 ['retour préparation',/setQuizSkipTarget\('parcours-start','Aller directement à la préparation'\)/],
 ['erreur saisie effacée',/field\.addEventListener\('input',e=>\{stage\.draft=e\.target\.value;if\(stage\.error\)/],
 ['erreur clavier effacée',/field\.removeAttribute\('aria-describedby'\)/],
 ['main énoncée fidèlement',/aria-label="Votre main : \$\{x\.hand/],
 ['focus retour accueil',/sessionType==='parcours'\?\$\('parcours-start'\):\$\('new'\)/],
 ['reprise annoncée',/if\(resuming\)announceQuizChange\('Séance reprise/],
 ['progression descriptive',/\$\('session-progress-label'\)\.textContent=deck\.length\?'Question '/],
 ['position explicite',/Math\.min\(position\+1,deck\.length\)/],
 ['main mobile deux colonnes',/@media\(max-width:390px\)\{\s*#body \.hand\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/],
 ['zoom reflow une colonne',/@media\(max-width:270px\)\{/],
 ['clavier au zoom',/#body \.bid-key-levels\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/],
 ['focus titre',/#body #question-heading:focus,#body #answer-feedback:focus/],
 ['contraste cellule vide',/#body \.auc td\.auction-empty\{color:#c0b2ce;opacity:1\}/],
 ['focus retour sans scroll',/sessionType==='parcours'\?\$\('parcours-start'\):\$\('new'\)\)\?\.focus\(\{preventScroll:true\}\)/],
 ['sélection vide focus',/else \{setQuizSkipTarget\('back-home','Retour aux paramètres de séance'\);\$\('back-home'\)\?\.focus\(\{preventScroll:true\}\)\}/]
];
for(const [label,pattern] of checks)assert.match(html,pattern,label);
console.log('PASS '+checks.length+' garde-fous UI/ARIA et catalogue '+data.exercises.length+'/'+data.themes.length);
