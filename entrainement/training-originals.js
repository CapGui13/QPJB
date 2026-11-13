'use strict';
// Mission H : exercices originaux F/G en réponse libre. Pas de faux QCM.
const KEY='QPJB_TRAINING_QCM_V1';
const records=Array.isArray(QPJB_ORIGINALS)?QPJB_ORIGINALS:[];
const byId=new Map(records.map(x=>[x.id,x]));
const categories={all:'Toutes les catégories',encheres:'Enchères',jeu_carte:'Jeu de la carte',entame:'Entames',flanc:'Flanc'};
const root=document.getElementById('app');
let category='all',filter='all',search='',active='',revealed=false,error='';
let progress={};
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function safeProgress(v){return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}
function getProgress(){try{return safeProgress(JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){error='Le navigateur ne permet pas de lire la progression.';return safeProgress(progress)}}
function synchronized(){progress=getProgress()}
function markSource(id,ok){
 if(!byId.has(id))return;
 const now=new Date().toISOString();
 const unique='originals-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
 const latest=getProgress(),prior=safeProgress(latest[id]);
 const base=Number.isInteger(prior._syncBaseAttempts)?prior._syncBaseAttempts:(Number.isInteger(prior.attempts)?prior.attempts:0);
 const visits=Array.isArray(prior._syncVisits)?prior._syncVisits.slice():[];
 visits.push(unique);
 const entry={...prior,done:true,ok,validated:ok,attempts:base+visits.length,history:[...(Array.isArray(prior.history)?prior.history:[]).slice(-29),{pick:'auto-évaluation source',ok,at:now,syncId:unique}],_syncBaseAttempts:base,_syncVisits:visits,_syncAt:now,_syncId:unique,lastAttemptAt:now};
 latest[id]=entry;
 try{localStorage.setItem(KEY,JSON.stringify(latest));progress=latest;error=''}
 catch(e){progress=latest;error='L’enregistrement automatique de cet exercice est indisponible.'}
 render();
}
function countDone(){return records.filter(x=>progress[x.id]?.done).length}
function matched(){
 const q=search.toLocaleLowerCase('fr').trim();
 return records.filter(x=>(category==='all'||x.category===category)&&
  (filter==='all'||(filter==='todo'&&!progress[x.id]?.done)||
  (filter==='ok'&&progress[x.id]?.done&&progress[x.id]?.validated===true)||
  (filter==='review'&&progress[x.id]?.done&&progress[x.id]?.validated===false))&&
  (!q||[x.id,x.prompt,x.situation,x.solution,x.pdfSujet].join(' ').toLocaleLowerCase('fr').includes(q)));
}
function state(x){
 const p=progress[x.id];
 return !p?.done?'<span class="status">→ À faire</span>':p.validated===true?
  '<span class="status ok">✓ Validé</span>':'<span class="status no">↻ À retravailler</span>';
}
function renderList(){
 const items=matched();
 root.innerHTML='<section class="intro"><span class="eyebrow">QPJB · Mission H</span><h1>139 exercices originaux complémentaires</h1>'+
  '<p>Exercices supplémentaires attestés dans les fascicules Bridge Hebdo. Réfléchissez à chaque situation, puis découvrez la réponse ou la synthèse contrôlée. Ils sont en <strong>réponse libre</strong> : aucun distracteur ni carte n’a été inventé.</p>'+
  '<p class="muted">Les 826 exercices historiques du QPJB restent disponibles et leur progression est conservée. Ces 139 situations portent le total représenté à <strong>965</strong> dans les trois parcours.</p></section>'+
  '<div class="stats"><span class="stat">'+countDone()+'/139 effectués</span><span class="stat">92 enchères</span><span class="stat">27 jeux de la carte</span><span class="stat">17 entames</span><span class="stat">3 flancs</span></div>'+
  '<div class="filters"><input type="search" id="original-search" placeholder="Rechercher un fascicule ou une situation…" aria-label="Rechercher une situation" value="'+esc(search)+'">'+
  '<select id="original-category" aria-label="Catégorie">'+Object.entries(categories).map(([id,name])=>'<option value="'+id+'" '+(id===category?'selected':'')+'>'+esc(name)+'</option>').join('')+'</select>'+
  '<select id="original-progress" aria-label="Progression">'+[['all','Tous'],['todo','À faire'],['ok','Validés'],['review','À retravailler']].map(([id,label])=>'<option value="'+id+'" '+(id===filter?'selected':'')+'>'+label+'</option>').join('')+'</select></div>'+
  '<p class="muted" role="status">'+items.length+' situation(s) affichée(s)</p>'+
  (items.length?'<div class="list">'+items.map(x=>'<button class="item" data-id="'+esc(x.id)+'" type="button"><span class="small">'+esc(x.sourceId)+' · '+esc(categories[x.category])+'</span><strong>'+esc(x.prompt.slice(0,165))+'</strong>'+state(x)+'</button>').join('')+'</div>':'<div class="empty">Aucun exercice ne correspond aux filtres.</div>')+
  (error?'<p role="alert">'+esc(error)+'</p>':'');
 document.getElementById('original-search').addEventListener('input',e=>{search=e.target.value;renderList();document.getElementById('original-search').focus()});
 document.getElementById('original-category').addEventListener('change',e=>{category=e.target.value;renderList()});
 document.getElementById('original-progress').addEventListener('change',e=>{filter=e.target.value;renderList()});
 root.querySelectorAll('button[data-id]').forEach(b=>b.addEventListener('click',()=>openExercise(b.dataset.id)));
 reportHeight();
}
function openExercise(id,push=true){
 if(!byId.has(id))return;
 active=id;revealed=false;
 if(push)history.pushState({id},'',location.pathname+'?id='+encodeURIComponent(id));
 render();window.scrollTo(0,0);root.focus({preventScroll:true});
}
function showAnswer(){revealed=true;render();document.getElementById('original-analysis')?.focus({preventScroll:true})}
function renderExercise(){
 const x=byId.get(active);
 if(!x){active='';renderList();return}
 const p=progress[x.id],all=records,position=all.findIndex(y=>y.id===x.id);
 const docs='<div class="documents"><div><strong>Sujet original :</strong> '+esc(x.pdfSujet)+' (page '+esc(x.page)+')</div>'+
  '<div><strong>Corrigé original :</strong> '+esc(x.pdfCorrige)+'</div>'+
  '<div><strong>Référence :</strong> '+esc(x.sourceId)+' · décision '+esc(x.origin)+' · SHA-256 sujet : '+esc(x.shaSujet.slice(0,16))+'… · corrigé : '+esc(x.shaCorrige.slice(0,16))+'…</div></div>';
 root.innerHTML='<button id="back-original-list" class="btn" type="button">← Tous les exercices</button>'+
  '<div class="card"><div class="eyebrow">'+esc(x.sourceId)+' · '+esc(categories[x.category])+'</div><h1>À vous de jouer</h1>'+
  '<p class="question">'+esc(x.prompt)+'</p>'+
  (x.situation?'<h2>Éléments du fascicule</h2><div class="source-text">'+esc(x.situation)+'</div>':'')+
  (x.contextSupplement?'<div class="note"><strong>Contexte attesté dans le PDF :</strong><p class="source-text">'+esc(x.contextSupplement)+'</p></div>':'')+
  '<div class="stack"><button type="button" id="reveal" class="btn primary" '+(revealed?'disabled':'')+'>'+(revealed?'Réponse affichée':'Découvrir la réponse et l’analyse')+'</button></div>'+
  (revealed?'<section class="analysis" id="original-analysis" tabindex="-1"><h2>Réponse / synthèse validée</h2>'+
   (x.originalPrintedResponse?'<p><strong>Réponse relevée :</strong> '+esc(x.originalPrintedResponse)+'</p>':'')+
   '<p class="source-text">'+esc(x.solution)+'</p>'+
   (x.correctionNote?'<div class="note"><strong>Précision éditoriale :</strong> '+esc(x.correctionNote)+'</div>':'')+
   (x.originalCorrectionExcerpt?'<details><summary>Voir l’extrait documentaire du corrigé</summary><div class="source-text">'+esc(x.originalCorrectionExcerpt)+'</div></details>':'')+
   '<p class="muted">La synthèse de F/G est distincte d’une reproduction exhaustive du corrigé original. Aucun choix de QCM ni main reconstruite n’est ajouté.</p>'+
   '<p>Votre raisonnement correspondait-il à la réponse ?</p>'+
   '<div class="stack"><button id="mark-yes" class="btn success" type="button">✓ J’avais trouvé</button><button id="mark-no" class="btn warning" type="button">↻ À retravailler</button></div>'+
   (p?.done?'<p class="muted">'+(p.validated?'✓ Exercice déjà validé':'↻ Exercice noté à retravailler')+'</p>':'')+'</section>':'')+
  docs+'</div>'+
  '<div class="stack"><button id="prev-original" class="btn" '+(position===0?'disabled':'')+'>← Précédent</button><button id="next-original" class="btn primary" '+(position+1===all.length?'disabled':'')+'>Suivant →</button></div>'+
  (error?'<p role="alert">'+esc(error)+'</p>':'');
 document.getElementById('back-original-list').addEventListener('click',()=>backToList());
 document.getElementById('reveal').addEventListener('click',showAnswer);
 document.getElementById('prev-original').addEventListener('click',()=>openExercise(all[position-1].id));
 document.getElementById('next-original').addEventListener('click',()=>openExercise(all[position+1].id));
 if(revealed){
   document.getElementById('mark-yes').addEventListener('click',()=>markSource(x.id,true));
   document.getElementById('mark-no').addEventListener('click',()=>markSource(x.id,false));
 }
 reportHeight();
}
function backToList(){active='';revealed=false;history.pushState({},'',location.pathname);render()}
function reportHeight(){
 if(window.parent===window)return;
 const height=Math.max(240,Math.ceil(document.body.scrollHeight+10));
 window.parent.postMessage({type:'qpjb-training-content-height',height},location.origin);
 window.parent.postMessage({type:'qpjb-training-view',quiz:!!active},location.origin);
}
function render(){synchronized();if(active)renderExercise();else renderList()}
window.addEventListener('storage',e=>{if(e.key===KEY)render()});
window.addEventListener('popstate',()=>{const id=new URLSearchParams(location.search).get('id');active=byId.has(id)?id:'';revealed=false;render()});
window.addEventListener('resize',reportHeight);
const initial=new URLSearchParams(location.search).get('id');
if(byId.has(initial))active=initial;
if(records.length!==139||byId.size!==139){root.textContent='Erreur de chargement : le catalogue documentaire n’est pas complet.'}
else render();
