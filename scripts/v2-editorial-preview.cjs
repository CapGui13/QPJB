'use strict';
// Revue locale de 4 QCM : visualisation uniquement, aucune écriture des QCM.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');

const root = path.resolve(__dirname,'..');
const publicDir = path.resolve(root,process.env.QPJB_V2_PUBLIC_DIR||'public-main');
const publicSha = process.env.QPJB_V2_PUBLIC_SHA;
assert.match(publicSha||'',/^[a-f0-9]{40}$/,'Commit public épinglé requis');
const actualSha = cp.execFileSync('git',['rev-parse','HEAD'],{cwd:publicDir,encoding:'utf8'}).trim();
assert.equal(actualSha,publicSha,'Le référentiel public a changé');
const quiz = fs.readFileSync(path.join(publicDir,'quizz.html'),'utf8');
const marker = '<script id="training-data" type="application/json">';
const i = quiz.indexOf(marker), end = quiz.indexOf('</script>',i+marker.length);
assert.ok(i>=0&&end>i&&quiz.indexOf(marker,i+marker.length)===-1,'Catalogue JSON absent ou dupliqué');
const items=JSON.parse(quiz.slice(i+marker.length,end)).exercises;
assert.equal(items.length,1523,'Effectif du catalogue public modifié');
assert.equal(new Set(items.map(q=>q.id)).size,1523);
const byId=new Map(items.map(q=>[q.id,q]));
const e=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const checked=[
  {id:'SEF-V416-008',answer:'4♥',choices:['3SA','4♥','4SA','3♥'],h:10},
  {id:'SEF-V416-009',answer:'4♠',choices:['3SA','4♥','4♠','3♠'],h:10},
  {id:'SEF-L25-007',answer:'2SA',choices:['2SA','3♣','3♦','3SA'],h:16},
  {id:'SEF-L06-029',answer:'4♦',choices:['Passe','4♦','4♥','4SA'],h:10}
];
for(const x of checked){
 const q=byId.get(x.id);
 assert.ok(q,'QCM d’origine absent : '+x.id);
 assert.equal(q.answer,x.answer,'Réponse source modifiée : '+x.id);
 assert.deepEqual(q.choices,x.choices,'Options source modifiées : '+x.id);
 assert.equal(q.h,x.h,'Points modifiés : '+x.id);
 assert.equal(q.hand.length,4,'Main incomplète : '+x.id);
 assert.equal(q.hand.reduce((n,s)=>n+s.length,0),13,'13 cartes non trouvées : '+x.id);
}
const proposals=[
 {id:'SEF-V416-008',heading:'Stayman — contrat à Cœur',
  context:'Après 1SA–2♣–2SA (les deux majeures quatrièmes), avec ♥AV83 et 10 H, vous souhaitez jouer 4♥ en faisant déclarer l’ouvreur de 1SA. Quelle enchère de double transfert utilisez-vous ?',
  choices:['3SA','4♥','4♣','3♥'],answer:'4♣',
  explain:'Avec quatre Cœurs, vous avez un fit 4–4 et de quoi jouer la manche. 4♣ transfère l’ouvreur à 4♥ ; c’est lui qui devient déclarant. L’annonce directe de 4♥ ne remplit pas cet objectif.',
  note:'Changement explicite de l’objectif pédagogique et de la bonne réponse, pas correction silencieuse.'},
 {id:'SEF-V416-009',heading:'Stayman — contrat à Pique',
  context:'Après 1SA–2♣–2SA (les deux majeures quatrièmes), avec ♠AD83 et 10 H, vous souhaitez jouer 4♠ en faisant déclarer l’ouvreur de 1SA. Quelle enchère de double transfert utilisez-vous ?',
  choices:['3SA','4♦','4♠','3♠'],answer:'4♦',
  explain:'Avec quatre Piques, vous avez un fit 4–4 et de quoi jouer la manche. 4♦ transfère l’ouvreur à 4♠ ; c’est lui qui devient déclarant. L’annonce directe de 4♠ ne remplit pas cet objectif.',
  note:'A harmoniser avec SEF-L18-007 : même réponse 2SA au Stayman, transfert Cœur à 4♣.'},
 {id:'SEF-L25-007',heading:'Texas Trèfle — gros honneur troisième',
  explain:'Dans l’accord de modulation retenu pour le Texas Trèfle, 2SA indique une acceptation positive avec un gros honneur troisième à Trèfle, comme ♣R103. Ici, avec 16 H, c’est la présence de ce gros honneur troisième qui motive cette modulation ; aucun seuil automatique de 17 H n’est imposé. Sans les conditions retenues pour cette modulation, l’ouvreur rectifie à 3♣.',
  note:'La question, les choix et la réponse 2SA restent identiques ; seule l’explication pourrait changer.'},
 {id:'SEF-L06-029',heading:'3SA gambling — classement',
  category:'Ouvertures conventionnelles / barrages',
  note:'Le contenu et la réponse 4♦ restent identiques. Seule une rubrique d’apprentissage V2 spécifique est proposée ; le thème source sa est conservé.'}
];
assert.equal(proposals.length,4);
const original=proposals.map(p=>byId.get(p.id));
const changed=proposals.map(p=>{
 const q=byId.get(p.id);
 const next={...q};
 for(const key of ['context','choices','answer','explain']) if(p[key]!==undefined)next[key]=p[key];
 return next;
});
assert.equal(changed.filter((q,k)=>q.answer!==original[k].answer).length,2);
assert.equal(changed.filter((q,k)=>q.context!==original[k].context).length,2);
assert.equal(changed.filter((q,k)=>q.choices.join('|')!==original[k].choices.join('|')).length,2);
assert.equal(changed.filter((q,k)=>q.explain!==original[k].explain).length,3);
assert.equal(byId.get('SEF-L06-029').theme,'sa','Le thème gambling d’origine a changé');
for(const [idx,q] of changed.entries()){
 assert.equal(q.id,original[idx].id,'ID modifié');
 assert.equal(q.hand,original[idx].hand,'Main altérée');
 assert.ok(q.choices.includes(q.answer),'Réponse absente des choix');
 assert.equal(new Set(q.choices).size,q.choices.length,'Choix doublonnés');
}

function hand(q){
 return '<div class="hand">'+q.hand.map((cards,n)=>
   '<span><b class="'+([1,2].includes(n)?'red':'')+'">'+['♠','♥','♦','♣'][n]+'</b> '+e(cards.join(''))+'</span>').join('')+'</div>';
}
function qcard(q,kind,id){
 return '<div class="qcard '+kind+'">'+
  '<div class="tag">'+(kind==='proposed'?'PROPOSITION NON VALIDÉE':'EXERCICE ACTUEL')+'</div>'+
  '<p class="context">'+e(q.context)+'</p>'+
  '<div class="choices">'+q.choices.map(c=>'<span class="'+(c===q.answer?'correct':'')+'">'+e(c)+'</span>').join('')+'</div>'+
  '<details><summary>Afficher la réponse et le corrigé</summary>'+
  '<p><strong>Réponse : '+e(q.answer)+'</strong></p>'+
  '<p>'+e(q.explain)+'</p></details></div>';
}
const rows=proposals.map((p,n)=>{
 const q=original[n],next=changed[n];
 return '<article id="'+e(p.id)+'"><header><div><div class="id">'+e(p.id)+'</div><h2>'+e(p.heading)+'</h2></div><div class="status">À ARBITRER</div></header>'+
 '<div class="info">'+hand(q)+'<p>'+e(q.auction.join(' · '))+'</p><p>'+e(q.h)+' H · source : Quiz SEF public</p></div>'+
 '<div class="pair">'+qcard(q,'current',p.id)+qcard(next,'proposed',p.id)+'</div>'+
 '<p class="note"><strong>Point de décision :</strong> '+e(p.note)+
 (p.category?' <strong>Rubrique envisagée :</strong> '+e(p.category):'')+'</p>'+
 '</article>';
}).join('\n');
const html='<!doctype html><html lang="fr"><head><meta charset="utf-8">'+
 '<meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>QPJB · Revue éditoriale de 4 QCM (HOLD)</title>'+
 '<style>'+
 ':root{color-scheme:light;font:16px system-ui,Segoe UI,sans-serif;background:#f5f7fa;color:#172438}'+
 '*{box-sizing:border-box}body{max-width:1150px;margin:0 auto;padding:24px 15px 70px}h1{font-size:clamp(1.7rem,4vw,2.4rem);margin:.2em 0}'+
 '.intro{color:#405267;line-height:1.55;max-width:950px}.banner{border:1px solid #e7bb75;background:#fff6e8;border-radius:12px;padding:14px 18px;margin:20px 0}'+
 'article{background:white;border:1px solid #dbe3ee;border-radius:16px;margin:24px 0;overflow:hidden;box-shadow:0 3px 16px #233b5310}'+
 'article header{padding:18px 22px 12px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}h2{font-size:1.3rem;margin:4px 0}.id{font-family:monospace;color:#405b86;font-size:.9rem}.status{font-size:.75rem;font-weight:750;color:#925f1a;border:1px solid #d5ad6b;padding:6px 9px;border-radius:50px}'+
 '.info{padding:4px 22px 16px;color:#47566d}.info p{font-size:.9rem;margin:7px 0}.hand{display:flex;flex-wrap:wrap;gap:9px 20px;font-size:1.2rem}.red{color:#d23b45}'+
 '.pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:0 14px}.qcard{border:1px solid #d6dfeb;border-radius:12px;padding:17px 18px}.current{background:#f8fafc}.proposed{background:#f3f7ff;border-color:#bccce8}.tag{font-size:.73rem;font-weight:800;letter-spacing:.035em;color:#435b7b}.context{line-height:1.55;min-height:115px}.choices{display:flex;gap:8px;flex-wrap:wrap}.choices span{padding:7px 11px;background:white;border:1px solid #becbdb;border-radius:8px;font-weight:600}.choices .correct{border-color:#9db8b8;background:#e7f3ed}details{margin-top:16px;border-top:1px solid #d5dfed;padding-top:11px;font-size:.92rem;line-height:1.5}summary{cursor:pointer;color:#2b5e9e;font-weight:600}.note{background:#fef7e9;padding:13px 22px;margin:16px 0 0;font-size:.9rem;line-height:1.5;border-top:1px solid #efddb8}'+
 '@media(max-width:740px){.pair{grid-template-columns:1fr}.context{min-height:0}.hand{gap:7px 12px}article header{padding:15px}.info{padding:4px 15px 15px}body{padding:13px}}'+
 '</style></head><body>'+
 '<h1>QPJB · Revue de 4 QCM</h1>'+
 '<p class="intro">Comparatif fidèle entre le Quiz SEF public et des propositions éditoriales. Les mains et séquences proviennent des questions originales. Ouvre les corrigés pour voir exactement ce qui changerait.</p>'+
 '<div class="banner"><strong>HOLD — document de travail uniquement.</strong> Aucun changement n’a été appliqué aux 1 523 QCM, aux sauvegardes des élèves ou au site QPJB. Ce fichier ne publie ni n’approuve ces propositions.</div>'+
 rows+
 '<footer class="intro"><p>Référence publique (commit figé) : <code>'+e(publicSha)+'</code>.</p><p>Deux propositions modifient l’objectif de l’exercice et sa réponse ; une ne change que son explication ; une ne modifie que la rubrique pédagogique envisagée.</p></footer></body></html>';
const out=path.join(root,'artifacts/v2-revue-editoriale');
fs.mkdirSync(out,{recursive:true});
const filename='QPJB_V2_REVUE_4_QCM_NON_VALIDEE.html';
const bytes=Buffer.from(html,'utf8');
fs.writeFileSync(path.join(out,filename),bytes);
const manifest={schema:'QPJB_V2_EDITORIAL_PREVIEW_1',publicReferenceCommit:publicSha,
  sourceQuestionCount:items.length,reviewedIDs:proposals.map(p=>p.id),
  proposedAnswerChanges:['SEF-V416-008','SEF-V416-009'],
  proposedExplainChanges:['SEF-V416-008','SEF-V416-009','SEF-L25-007'],
  classificationOnly:'SEF-L06-029',sourceEdited:false,teacherApproval:false,
  releaseDecision:'HOLD',sitePublished:false,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),filename};
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('QPJB EDITORIAL REVIEW PREVIEW ONLY '+JSON.stringify(manifest));
