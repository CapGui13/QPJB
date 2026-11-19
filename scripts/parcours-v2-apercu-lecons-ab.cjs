'use strict';
/* Standalone HTML, no exercise questions and no web/API access. */
const fs=require('node:fs');
const path=require('node:path');
const AB=require('./parcours-v2-lecons-ab.cjs');
const F=require('./parcours-v2-pilot.cjs');
const TEMPLATE="<!doctype html>\n<html lang=\"fr\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<meta name=\"color-scheme\" content=\"light\">\n<title>QPJB — Mini-leçons de découverte des conventions</title>\n<style>\n:root{font-family:system-ui,-apple-system,\"Segoe UI\",Arial,sans-serif;background:#f5f7fc;color:#1a2943}\n*{box-sizing:border-box}\nbody{margin:0;padding:0 20px 45px}\nmain{max-width:860px;margin:0 auto}\nheader{padding:33px 0 23px}\nheader h1{font-size:clamp(1.55rem,4vw,2.25rem);line-height:1.2;margin:8px 0 13px}\np{line-height:1.65;margin:9px 0}\n.kicker{letter-spacing:.09em;font-size:.8rem;font-weight:800;color:#35598f;text-transform:uppercase}\n.context{font-size:.94rem;color:#495e7d}\n.notice{border-left:4px solid #416997;background:#eaf0fa;border-radius:8px;padding:14px 18px}\n.tabs{display:flex;gap:9px;flex-wrap:wrap;margin:23px 0}\n.tabs button{font:inherit;color:#1d3c68;background:white;padding:10px 16px;cursor:pointer;border:1px solid #bfcee1;border-radius:12px;min-height:44px}\n.tabs button[aria-pressed=\"true\"]{background:#244c82;color:#fff;border-color:#244c82}\narticle{background:white;border:1px solid #dae3f1;border-radius:18px;padding:clamp(18px,4vw,30px)}\narticle[hidden]{display:none}\narticle h2{font-size:1.55rem;margin:5px 0 15px;line-height:1.24}\nh3{font-size:1.08rem;margin:0 0 9px}\n.lesson-section{border-top:1px solid #dfe6f0;padding:20px 0 16px}\n.lesson-section:first-of-type{margin-top:18px}\n.auction{font-size:1.02rem;font-weight:700;background:#f1f5fb;border-radius:9px;padding:12px 14px;margin:10px 0;line-height:1.5}\n.aim{padding:15px 16px;border:1px solid #b5c9e4;background:#f4f8fe;border-radius:12px}\n.aim strong{display:block;margin-bottom:4px}\ndetails{border:1px solid #b8cadf;border-radius:12px;padding:16px;margin:12px 0;background:#f6f9fe}\nsummary{font-weight:700;cursor:pointer;min-height:24px}\ndetails ul{margin-bottom:2px;padding-left:20px;line-height:1.7}\n.source{font-size:.8rem;color:#54687f}\n.boundary{font-size:.88rem;color:#566d84;border-top:1px solid #dfe6f0;padding-top:16px}\nfooter{margin-top:26px;font-size:.84rem;color:#53657a}\n@media(max-width:540px){body{padding:0 12px 30px}header{padding-top:20px}.tabs button{flex:1 1 auto}article{border-radius:13px}}\n</style>\n</head>\n<body>\n<main>\n<header>\n<div class=\"kicker\">QPJB · Atelier pédagogique · Prototype AB</div>\n<h1>Deux mini-leçons pour comprendre les conventions</h1>\n<p>Avant de s’exercer : comprendre ce que les enchères promettent et pourquoi leur signification dépend de la séquence.</p>\n<p class=\"notice\"><strong>Hors parcours, sans notation.</strong> Ces leçons sont indépendantes des QCM : aucune main d’exercice, aucune proposition à cocher, aucun résultat enregistré. Leur contenu reprend des accords décrits dans le catalogue QPJB et doit encore être validé pédagogiquement.</p>\n</header>\n<nav class=\"tabs\" aria-label=\"Choisir une mini-leçon\">__NAV__</nav>\n__LESSONS__\n<footer>QPJB · Phase AB · Document local de préparation éditoriale · Aucun déploiement, aucun suivi des utilisateurs, aucun résultat de maîtrise.</footer>\n</main>\n<script>\n\"use strict\";\nconst buttons=[...document.querySelectorAll(\".tabs button[data-target]\")];\nconst lessons=[...document.querySelectorAll(\"article[data-lesson]\")];\nfunction show(id){\n  for(const b of buttons)b.setAttribute(\"aria-pressed\",String(b.dataset.target===id));\n  for(const lesson of lessons)lesson.hidden=lesson.dataset.lesson!==id;\n}\nfor(const button of buttons)button.addEventListener(\"click\",()=>show(button.dataset.target));\nshow(\"rubensohl\");\n</script>\n</body>\n</html>";
function esc(value){
 return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function render(catalog=F.loadCatalog()){
 AB.validate(catalog);
 const nav=AB.LESSONS.map((lesson,i)=>'<button type="button" data-target="'+
  esc(lesson.id)+'" aria-pressed="'+String(i===0)+'">'+esc(lesson.id==='rubensohl'?'Rubensohl':'Michaels précisés')+'</button>').join('');
 const sections=AB.LESSONS.map(lesson=>{
  const blocks=lesson.blocks.map(block=>
   '<section class="lesson-section"><h3>'+esc(block.label)+'</h3>'+
   (block.auction?'<div class="auction">'+esc(block.auction)+'</div>':'')+
   '<p>'+esc(block.body)+'</p>'+
   (block.evidence?'<p class="source">Accord documenté par le QCM source '+esc(block.evidence)+'</p>':'')+
   '</section>').join('');
  const contrast=lesson.contrast.map(item=>'<li>'+esc(item)+'</li>').join('');
  return '<article data-lesson="'+esc(lesson.id)+'"'+(lesson.id!=='rubensohl'?' hidden':'')+'>'+
   '<div class="kicker">Leçon de découverte · '+esc(lesson.id)+'</div>'+
   '<h2>'+esc(lesson.title)+'</h2>'+
   '<p>'+esc(lesson.lead)+'</p>'+
   '<div class="aim"><strong>Objectif</strong>'+esc(lesson.aim)+'</div>'+
   blocks+
   '<details><summary>Comparer les deux contextes</summary><ul>'+contrast+'</ul></details>'+
   '<details><summary>Ce qu’il faut retenir</summary><p>'+esc(lesson.takeaway)+'</p></details>'+
   '<p class="boundary">'+esc(lesson.boundary)+'</p>'+
   '<p class="source">Traçabilité des accords : '+lesson.sourceIds.map(esc).join(', ')+'</p>'+
   '</article>';
 }).join('');
 return TEMPLATE.replace('__NAV__',nav).replace('__LESSONS__',sections);
}
if(require.main===module){
 const output=process.argv[2]||path.join('artifacts','v2-ab','mini-lecons-decouverte.html');
 const content=render();
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.writeFileSync(output,content,'utf8');
 console.log('QPJB_AB_PREVIEW '+JSON.stringify({output,bytes:Buffer.byteLength(content),
  lessons:AB.LESSONS.length,questionCount:0,offline:true,graded:false}));
}
module.exports={render,esc};
