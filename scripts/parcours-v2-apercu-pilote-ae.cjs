'use strict';
/* Offline editable-and-printable blank qualitative pilot sheet (NO storage). */
const fs=require('node:fs');
const path=require('node:path');
const AE=require('./parcours-v2-pilote-ae.cjs');
const F=require('./parcours-v2-pilot.cjs');
const TEMPLATE="<!doctype html>\n<html lang=\"fr\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>QPJB — Essai pilote anonyme, fiche enseignante</title>\n<style>\n:root{font-family:system-ui,-apple-system,\"Segoe UI\",Arial,sans-serif;color:#243247;background:#f5f7fb}\n*{box-sizing:border-box}\nbody{margin:0;padding:20px}main{max-width:900px;margin:auto}\nheader{padding:16px 0 18px}\nh1{font-size:clamp(1.5rem,3vw,2.05rem);line-height:1.2;margin:7px 0}\nh2{font-size:1.28rem;margin:0 0 14px}\nh3{font-size:1.02rem;margin:4px 0 10px}\np,li{line-height:1.55}\n.overline{text-transform:uppercase;letter-spacing:.08em;color:#435f86;font-size:.77rem;font-weight:750}\n.notice{background:#eaf0fa;border-left:4px solid #3d6b9b;border-radius:8px;padding:13px 15px}\n.card{background:#fff;border:1px solid #dae2ed;border-radius:14px;margin:16px 0;padding:18px}\n.card summary{cursor:pointer;line-height:1.5;font-weight:700}\n.steps{counter-reset:step;list-style:none;padding:0}\n.steps li{counter-increment:step;padding:10px 0 10px 40px;position:relative;border-bottom:1px solid #edf0f6}\n.steps li:before{content:counter(step);position:absolute;left:2px;top:12px;width:25px;height:25px;border-radius:50%;background:#dce9f7;text-align:center;line-height:25px;font-size:.82rem}\nnav{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}\nbutton{font:inherit;border:1px solid #a6bad3;border-radius:9px;color:#23446b;padding:10px 12px;background:#fff;cursor:pointer;min-height:44px}\nbutton[aria-pressed=\"true\"]{background:#204879;color:white}\narticle[hidden]{display:none}\n.observation{padding:17px 0;border-top:1px solid #dfe7f1}\n.observation:first-of-type{border-top:none}\n.label{font-size:.83rem;color:#516582}\np.question{font-weight:650}\n.field-title{display:block;font-weight:650;font-size:.91rem;margin:12px 0 7px}\n.choices{display:flex;flex-wrap:wrap;gap:10px 20px}\n.choices label{font-size:.91rem;line-height:1.6}\ntextarea{font:inherit;line-height:1.5;min-height:64px;resize:vertical;width:100%;border:1px solid #b4c7db;border-radius:8px;padding:11px;background:#fff;color:#20364e}\n.foot{font-size:.86rem;color:#596a81}\n.toolrow{display:flex;gap:9px;flex-wrap:wrap;margin:13px 0}\n.teacher-only{margin:12px 0;border:1px solid #c4d4e6;background:#f7faff;border-radius:9px;padding:13px}\n.teacher-only ul{padding-left:22px}\n.tag{font-weight:700;color:#35577d}\nhr{border:0;border-top:1px solid #dce5ef;margin:16px 0}\n@media(max-width:570px){body{padding:11px}.card{padding:14px}.choices{display:block}.choices label{display:block;margin:8px 0}nav button{flex:1}}\n@media print{body{background:white;padding:0}main{max-width:none}\n header{padding:0}.card{border:0;margin:0;padding:7px 0}\n .toolrow,nav,.teacher-only,details.protocol{display:none!important}\n article[hidden]{display:none}.observation{break-inside:avoid}\n textarea{min-height:52px;border-color:#bbb}.notice{border:1px solid #aaa}\n button{display:none}.observation label{color:#111}}\n</style>\n</head>\n<body>\n<main>\n<header>\n<div class=\"overline\">QPJB · Phase AE · Préparation d'essai enseignant</div>\n<h1>Comprendre les difficultés, sans noter les joueurs</h1>\n<p>Fiche d'observation pour un petit essai volontaire de clarté des mini-leçons Rubensohl et Michaels. Une convention par personne, trois reformulations ouvertes.</p>\n<p class=\"notice\"><strong>Aucune donnée réelle incluse dans ce fichier. Aucune note n’est calculée.</strong> Pas de nom, courriel, numéro FFB, enregistrement, transfert réseau, sauvegarde automatique ou notation. Les éventuelles notes saisies restent dans la page ouverte et disparaissent à sa fermeture. Participation facultative.</p>\n</header>\n<section class=\"card\">\n<h2>Préparer la séance</h2>\n<p><strong>Public :</strong> joueur connaissant les bases du bridge, découvrant la convention choisie. <strong>Cadre conseillé :</strong> 4 à 6 volontaires au total, 15 à 20 minutes chacun. Ces effectifs sont indicatifs et non statistiquement représentatifs.</p>\n<details class=\"protocol\"><summary>Déroulé proposé et précautions</summary><ol class=\"steps\">__STEPS__</ol>\n<p class=\"foot\">Demander l'accord de participation ; ne collecter aucune identité ni donnée personnelle. Les observations qualitatives peuvent être notées sur une feuille imprimée, conservée par l'enseignante et jamais publiée sur GitHub.</p></details>\n<p class=\"foot\"><strong>Phrase d'accueil :</strong> __INVITATION__</p>\n</section>\n<nav aria-label=\"Convention observée\">__NAV__</nav>\n<div class=\"toolrow\">\n<button id=\"print\" type=\"button\">Imprimer la fiche sélectionnée</button>\n<button id=\"clear\" type=\"button\">Effacer les notes de la fiche</button>\n</div>\n__ARTICLES__\n<section class=\"card\">\n<h2>Après l'essai : retour libre</h2>\n<p>Ne demander ces précisions qu'une fois les trois reformulations terminées.</p>\n<ul>__EXIT__</ul>\n<label class=\"field-title\" for=\"general-note\">Passage du cours à clarifier (sans identité ni citation personnelle)</label>\n<textarea id=\"general-note\" placeholder=\"Une confusion ou un mot du cours à reformuler ; laisser vide si aucune observation.\"></textarea>\n<p class=\"foot\">Ce texte ne sera ni transmis ni sauvegardé. Si l'enseignante souhaite conserver des constats, elle peut imprimer une feuille de synthèse sans nom, après avoir obtenu l'accord du participant.</p>\n</section>\n<footer class=\"foot\">Document hors Quiz SEF · Aucun élève observé à la création de ce prototype · Aucun classement ou score · PR #214 non déployée.</footer>\n</main>\n<script>\n\"use strict\";\nconst tabs=[...document.querySelectorAll('nav button[data-target]')];\nconst parts=[...document.querySelectorAll('article[data-lesson]')];\nfunction showLesson(id){\n for(const x of tabs)x.setAttribute('aria-pressed',String(x.dataset.target===id));\n for(const x of parts)x.hidden=x.dataset.lesson!==id;\n}\nfor(const tab of tabs)tab.addEventListener('click',()=>showLesson(tab.dataset.target));\ndocument.getElementById('print').addEventListener('click',()=>window.print());\ndocument.getElementById('clear').addEventListener('click',()=>{\n if(!window.confirm('Effacer les notes de la fiche affichée ?'))return;\n const selected=parts.find(x=>!x.hidden);\n if(!selected)return;\n for(const field of selected.querySelectorAll('textarea'))field.value='';\n for(const choice of selected.querySelectorAll('input[type=radio]'))choice.checked=false;\n document.getElementById('general-note').value='';\n});\nshowLesson('rubensohl');\n</script>\n</body>\n</html>";
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
 .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function render(catalog=F.loadCatalog()){
 AE.validate(catalog);
 const nav=['rubensohl','michaels'].map((name,i)=>
  '<button type="button" data-target="'+name+'" aria-pressed="'+(i===0?'true':'false')+
  '">'+(name==='rubensohl'?'Rubensohl':'Michaels précisés')+'</button>').join('');
 const steps=AE.PROTOCOL.procedure.map(x=>'<li><strong>'+esc(x.label)+
  '.</strong> '+esc(x.detail)+'</li>').join('');
 const exit=AE.PROTOCOL.exitQuestions.map(x=>'<li>'+esc(x)+'</li>').join('');
 const articles=['rubensohl','michaels'].map((name,i)=>{
  const q=AE.QUESTIONS.filter(x=>x.lesson===name);
  return '<article class="card" data-lesson="'+name+'"'+(i?' hidden':'')+'>'+
   '<div class="overline">Fiche sans identité · '+esc(name)+'</div>'+
   '<h2>'+esc(name==='rubensohl'?'Rubensohl — reformulations':'Michaels précisés — reformulations')+'</h2>'+
   '<p class="foot">Cours masqué pendant les réponses. Observer des difficultés de formulation : aucune compétence individuelle n’est certifiée.</p>'+
   q.map(x=>{
    const labels=AE.PROTOCOL.qualitativeLabels.map((label,k)=>
     '<label><input type="radio" name="obs-'+esc(x.id)+'" value="'+esc(label)+
     '"> '+esc(label)+'</label>').join('');
    return '<section class="observation">'+
     '<p class="label">'+esc(x.id)+' · '+esc(x.skill)+'</p>'+
     '<p class="question">'+esc(x.question)+'</p>'+
     '<div class="field-title">Observation qualitative (facultative)</div>'+
     '<div class="choices" role="group" aria-label="Observation '+esc(x.id)+'">'+labels+'</div>'+
     '<label class="field-title" for="note-'+esc(x.id)+'">Mot ou passage à clarifier (sans réponse ni nom de joueur)</label>'+
     '<textarea id="note-'+esc(x.id)+'" placeholder="Note sur la clarté du cours…"></textarea>'+
     '<details class="teacher-only"><summary>Repères à lire seulement APRÈS la réponse</summary><ul>'+
     x.reviewAfterResponse.map(item=>'<li>'+esc(item)+'</li>').join('')+
     '</ul><p><strong>Confusion à rechercher :</strong> '+esc(x.possibleConfusion)+'</p></details>'+
     '</section>';
   }).join('')+'</article>';
 }).join('');
 return TEMPLATE.replace('__STEPS__',steps).replace('__INVITATION__',esc(AE.PROTOCOL.invitation))
  .replace('__NAV__',nav).replace('__EXIT__',exit).replace('__ARTICLES__',articles);
}
if(require.main===module){
 const out=process.argv[2]||path.join('artifacts','v2-ae','fiche-essai-pilote.html');
 fs.mkdirSync(path.dirname(out),{recursive:true});
 const content=render();
 fs.writeFileSync(out,content,'utf8');
 console.log('QPJB_AE_PREVIEW '+JSON.stringify({output:out,bytes:Buffer.byteLength(content),
  conventions:2,questions:AE.QUESTIONS.length,offline:true,
  noStorage:true,unsavedNotes:true,noStudentResults:true}));
}
module.exports={render,esc};
