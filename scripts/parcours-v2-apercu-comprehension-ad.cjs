'use strict';
/* Offline teacher-review worksheet, no QCM bodies, persistence, or auto-grade. */
const fs=require('node:fs');
const path=require('node:path');
const F=require('./parcours-v2-pilot.cjs');
const AD=require('./parcours-v2-comprehension-ad.cjs');
const TEMPLATE="<!doctype html>\n<html lang=\"fr\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>QPJB — Atelier de reformulation des conventions</title>\n<style>\n:root{font-family:system-ui,-apple-system,\"Segoe UI\",Arial,sans-serif;color:#20334d;background:#f5f7fb}\n*{box-sizing:border-box}body{margin:0;padding:22px}\nmain{max-width:880px;margin:auto}\nheader{padding:18px 0 24px}h1{font-size:clamp(1.5rem,3.2vw,2.05rem);margin:9px 0}\nh2{font-size:1.35rem;margin:0 0 11px}\nh3{font-size:1.04rem;line-height:1.4;margin:0 0 8px}\np{line-height:1.55}\n.eyebrow{font-weight:700;font-size:.78rem;letter-spacing:.08em;color:#4a6490;text-transform:uppercase}\n.notice{background:#eaf2fd;border-left:4px solid #466998;padding:13px 16px;border-radius:8px}\nnav{display:flex;gap:9px;margin:20px 0;flex-wrap:wrap}\nbutton{font:inherit;cursor:pointer;border:1px solid #adc1d6;background:#fff;border-radius:9px;padding:10px 13px;color:#244778;min-height:44px}\nnav button[aria-pressed=\"true\"]{background:#274f85;color:#fff}\narticle{background:white;border:1px solid #d8e2ee;border-radius:15px;padding:23px;margin:18px 0}\narticle[hidden]{display:none}\n.task{border-top:1px solid #e0e7f1;padding:21px 0}\n.task:first-of-type{margin-top:20px}\n.task .meta{font-size:.82rem;color:#576d82;margin:0 0 9px}\nlabel{display:block;font-weight:600;line-height:1.55;margin:8px 0 10px}\ntextarea{width:100%;min-height:100px;padding:12px;font:inherit;line-height:1.5;resize:vertical;border:1px solid #b3c4d9;border-radius:9px;background:white}\ntextarea:focus-visible,button:focus-visible,summary:focus-visible{outline:3px solid #6e93c5;outline-offset:2px}\ndetails{margin-top:13px;border:1px solid #c4d2e4;border-radius:10px;background:#f7faff;padding:14px 16px}\nsummary{cursor:pointer;font-weight:700;line-height:1.5}\ndetails ul{margin:12px 0;padding-left:23px;line-height:1.68}\n.warning{font-size:.9rem;color:#5a6b80}\n.misconception{font-size:.91rem;font-weight:650;margin-top:12px}\n.clear{font-size:.84rem;margin-top:9px;background:#fff}\nfooter{font-size:.83rem;color:#50627b;margin:24px 0}\n@media(max-width:520px){body{padding:12px}article{padding:16px}nav button{flex:1}}\n@media print{nav,.clear,textarea{display:none}details{display:block!important}article{break-inside:avoid}body{background:white}}\n</style>\n</head>\n<body>\n<main>\n<header>\n<div class=\"eyebrow\">QPJB · Phase AD · Atelier pédagogique expérimental</div>\n<h1>Expliquer une convention avec ses propres mots</h1>\n<p>Six questions ouvertes de reformulation après la lecture des mini-leçons Rubensohl ou Michaels précisés. Ce n'est pas un contrôle noté et il n'y a aucune réponse automatique.</p>\n<p class=\"notice\"><strong>Pour l'enseignant :</strong> proposer d'abord une réponse libre, puis ouvrir les repères pour en discuter. Les réponses sont seulement dans cette page, pendant son ouverture : aucune sauvegarde, aucun envoi, aucun score ni validation de maîtrise. Ne saisis pas de données personnelles.</p>\n</header>\n<nav aria-label=\"Choisir une convention\">__NAV__</nav>\n__ARTICLES__\n<footer>Document pédagogique autonome · Six questions originales de reformulation éditoriale et zéro QCM du catalogue. Contenus liés aux cinq sources QPJB, validation enseignante requise. Aucun déploiement.</footer>\n</main>\n<script>\n\"use strict\";\nconst tabs=[...document.querySelectorAll('nav button[data-target]')];\nconst panels=[...document.querySelectorAll('article[data-lesson]')];\nfunction showLesson(id){\n for(const b of tabs)b.setAttribute('aria-pressed',String(b.dataset.target===id));\n for(const p of panels)p.hidden=p.dataset.lesson!==id;\n}\nfor(const b of tabs)b.addEventListener('click',()=>showLesson(b.dataset.target));\nfor(const b of document.querySelectorAll('button.clear[data-for]')){\n b.addEventListener('click',()=>{\n  const target=document.getElementById(b.dataset.for);\n  if(target){target.value='';target.focus();}\n });\n}\nshowLesson('rubensohl');\n</script>\n</body>\n</html>";
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
 .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function render(catalog=F.loadCatalog()){
 AD.validate(undefined,catalog);
 const nav=['rubensohl','michaels'].map((lesson,i)=>
  '<button type="button" aria-pressed="'+(i===0?'true':'false')+
  '" data-target="'+lesson+'">'+(lesson==='rubensohl'?'Rubensohl':'Michaels précisés')+
  ' · 3 questions</button>').join('');
 const articles=['rubensohl','michaels'].map((lesson,i)=>{
  const questions=AD.PROMPTS.filter(x=>x.lesson===lesson);
  return '<article data-lesson="'+esc(lesson)+'"'+(i?' hidden':'')+'>'+
   '<div class="eyebrow">Reformulation guidée · '+esc(lesson)+'</div>'+
   '<h2>'+esc(lesson==='rubensohl'?'Comprendre le sens des enchères après 1SA':
    'Comprendre un bicolore Michaels précisé')+'</h2>'+
   '<p class="warning">Lis la mini-leçon avant cet atelier. Réponds avec tes propres mots ; aucune réponse n’est enregistrée ou notée.</p>'+
   questions.map(x=>
    '<section class="task">'+
    '<p class="meta">'+esc(x.id)+' · '+esc(x.skill)+'</p>'+
    '<label for="'+esc(x.id)+'">'+esc(x.prompt)+'</label>'+
    '<textarea id="'+esc(x.id)+'" rows="4" aria-label="Réponse libre '+esc(x.id)+
      '" placeholder="Je reformule avec mes mots…"></textarea>'+
    '<button class="clear" type="button" data-for="'+esc(x.id)+'">Effacer ce brouillon</button>'+
    '<details><summary>Repères de discussion pour l’enseignant (après la réponse)</summary><ul>'+
      x.teacherIndicators.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>'+
      '<p class="misconception">Confusion à explorer : '+esc(x.misunderstanding)+'</p>'+
      '<p class="meta">Traçabilité : '+x.sources.map(esc).join(', ')+'</p>'+
    '</details></section>').join('')+
   '</article>';
 }).join('');
 return TEMPLATE.replace('__NAV__',nav).replace('__ARTICLES__',articles);
}
if(require.main===module){
 const output=process.argv[2]||path.join('artifacts','v2-ad','atelier-comprehension.html');
 fs.mkdirSync(path.dirname(output),{recursive:true});
 const out=render();fs.writeFileSync(output,out,'utf8');
 console.log('QPJB_AD_PREVIEW '+JSON.stringify({output,bytes:Buffer.byteLength(out),
  openQuestions:AD.PROMPTS.length,graded:false,offline:true,storage:false}));
}
module.exports={render,esc};
