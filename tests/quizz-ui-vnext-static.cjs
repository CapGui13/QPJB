'use strict';
/* Mission 3 — garde-fou du catalogue et des changements exclusivement UI. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'..','quizz.html'),'utf8');
const embedded=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(embedded,'Catalogue embarqué présent');
const json=embedded[1],data=JSON.parse(json);
function fingerprint(s){
 let hash=0x811c9dc5;
 for(let i=0;i<s.length;i++)hash=Math.imul(hash^s.charCodeAt(i),0x01000193)>>>0;
 return hash.toString(16).padStart(8,'0');
}
assert.equal(json.length,1741625,'Catalogue de référence : longueur identique');
assert.equal(fingerprint(json),'5eba3d0a','Empreinte du catalogue identique au commit source');
assert.equal(data.exercises.length,1523,'Les 1 523 QCM restent présents');
assert.equal(data.themes.length,22,'Les rubriques restent inchangées');
assert.match(html,/id="quizz-ui-vnext"/,'Styles UX dédiés');
assert.match(html,/id="parcours-resume-help"/,'Reprise de séance visible si active');
assert.match(html,/id="question-heading"/,'Question à focus piloté');
assert.match(html,/aria-label="Proposition \$\{i\+1\}/,'Réponses discernables aux lecteurs écran');
assert.match(html,/id="answer-feedback".*?aria-labelledby="answer-verdict"/,'Correction structurée');
assert.match(html,/function focusQuizQuestion\(\)/,'Focus lors de la navigation');
assert.match(html,/function renderChoicesWithFocus\(\)/,'Focus après révélation des propositions');
assert.match(html,/id="session-summary-title"/,'Bilan identifié pour les lecteurs écran');
assert.match(html,/src="\.\/parcours-recommandations\.js\?v=1"/,'Module V1 de conseils indépendant chargé');
assert.match(html,/id="parcours-recommendations"/,'Conseils V1 intégrés à l’accueil');
assert.match(html,/function parcoursRecommendations\(\)/,'Conseils réactualisés à l’ouverture de l’accueil');
assert.match(html,/class="session-summary-stats"/,'Indicateurs déjà calculés, mieux regroupés');
assert.doesNotMatch(html,/quizz-ui-vnext[\s\S]{0,150}localStorage\.setItem/,'Le bloc de styles ne gère aucun stockage');
const inline=html.match(/<script>\s*([\s\S]*?)<\/script>\s*<\/body>/);
assert.ok(inline,'Script de l’interface présent');
assert.doesNotThrow(()=>new Function(inline[1]),'Le script de l’interface compile');
console.log('QUIZZ UI VNEXT STATIC OK — JSON identique, 1523 QCM, DOM sémantique, syntaxe JavaScript');
