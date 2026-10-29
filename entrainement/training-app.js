
const PLAY_TOPICS=[{"id":"plan-libre","name":"Construire son plan de jeu","description":"Situations ouvertes : réfléchir au plan complet, puis comparer son analyse au corrigé.","group":"Jeu du déclarant"},{"id":"plan-qcm","name":"Décisions de plan de jeu · QCM","description":"Choisir le meilleur plan parmi plusieurs propositions.","group":"Jeu du déclarant"},{"id":"impasses","name":"Impasses","description":"Placement des honneurs, impasses directes et indirectes.","group":"Jeu du déclarant"},{"id":"maniements","name":"Maniements de couleur","description":"Organiser les honneurs, préserver les fourchettes et jouer les couleurs.","group":"Jeu du déclarant"},{"id":"communications","name":"Communications et blocages","description":"Conserver les reprises et éviter de bloquer une couleur.","group":"Jeu du déclarant"},{"id":"entames","name":"Choisir l’entame","description":"Décider quelle carte entamer selon le contrat et la séquence.","group":"Jeu de la défense"},{"id":"defense","name":"Défense et signalisation","description":"Choisir la bonne carte en défense et coopérer avec son partenaire.","group":"Jeu de la défense"}];
const KEY='QPJB_TRAINING_QCM_V1';let saved={},storageWarning=false;
const SYNC_TAB=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
let syncSeq=0,activeVisitId=null;
function syncId(){return SYNC_TAB+'-'+(++syncSeq)}
function cleanProgress(v){return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}
try{const raw=localStorage.getItem(KEY);saved=raw?cleanProgress(JSON.parse(raw)):{}}
catch(e){saved={};storageWarning=true}
const initialMode=new URLSearchParams(location.search).get('mode');
const integratedMode=initialMode==='bidding'||initialMode==='play';
const embeddedMode=window.parent!==window&&new URLSearchParams(location.search).get('embedded')==='1';
if(embeddedMode)document.documentElement.classList.add('qpjb-embedded');
let view=initialMode==='bidding'?'topics':initialMode==='play'?'playtopics':'home',cat=initialMode==='play'?'play':'',id='',status='all',ptopic='all',sessionIds=[],chosen=null,revealed=false,playSeen=false,redoAttempt=null,redoAnswered=false;
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
// Idempotente et indépendante de l'ordre de réception des événements storage.
function mergeExercise(a,b){
 if(!a||typeof a!=='object'||Array.isArray(a))return b;
 if(!b||typeof b!=='object'||Array.isArray(b))return a;
 if(JSON.stringify(a)===JSON.stringify(b))return a;
 const rev=r=>String(r._syncAt||r.history?.at(-1)?.at||r.lastAttemptAt||'')+'|'+String(r._syncId||'');
 const ra=rev(a),rb=rev(b);
 const preferred=ra===rb?(JSON.stringify(a)>=JSON.stringify(b)?a:b):(ra>rb?a:b);
 const history=new Map();
 for(const h of [...(Array.isArray(a.history)?a.history:[]),...(Array.isArray(b.history)?b.history:[])]){
   if(!h||typeof h!=='object')continue;
   const k=h.syncId?'id:'+h.syncId:'old:'+JSON.stringify([h.at,h.pick,h.ok]);
   if(!history.has(k))history.set(k,h);
 }
 const result={...(preferred===a?b:a),...preferred,history:[...history.values()].sort((x,y)=>
   String(x.at||'').localeCompare(String(y.at||''))||String(x.syncId||'').localeCompare(String(y.syncId||''))).slice(-30)};
 if(a._syncVisits||b._syncVisits){
   const visits=[...new Set([...(Array.isArray(a._syncVisits)?a._syncVisits:[]),...(Array.isArray(b._syncVisits)?b._syncVisits:[])])].sort();
   const base=Math.max(...[a,b].map(r=>Number.isInteger(r._syncBaseAttempts)?r._syncBaseAttempts:(Number.isInteger(r.attempts)?r.attempts:0)));
   result._syncBaseAttempts=base;result._syncVisits=visits;result.attempts=base+visits.length;
 }
 return result;
}
function mergeProgress(a,b){
 a=cleanProgress(a);b=cleanProgress(b);const out={};
 for(const id of [...new Set([...Object.keys(a),...Object.keys(b)])].sort())out[id]=mergeExercise(a[id],b[id]);
 return out;
}
function update(){
 try{
   saved=mergeProgress(saved,cleanProgress(JSON.parse(localStorage.getItem(KEY)||'{}')));
   const raw=JSON.stringify(saved);
   if(localStorage.getItem(KEY)!==raw)localStorage.setItem(KEY,raw);
   if(localStorage.getItem(KEY)!==raw)throw Error('storage readback mismatch');
   storageWarning=false;syncStorageNotice();return true;
 }catch(e){storageWarning=true;syncStorageNotice();return false}
}

// La progression est sauvegardée automatiquement dans ce navigateur.
function storageNotice(){return storageWarning?`<div class="storage-warning" role="alert"><strong>Enregistrement automatique indisponible dans ce navigateur.</strong> Vos résultats pourraient être perdus à la fermeture.</div>`:''}
// Les QCM ne sont plus reconstruits après chaque choix : synchroniser le bandeau localement.
function syncStorageNotice(){
 const root=document.getElementById('root');if(!root)return;
 const notice=root.querySelector('.storage-warning');
 if(storageWarning){if(!notice)root.insertAdjacentHTML('afterbegin',storageNotice())}
 else if(notice)notice.remove();
}

// V7.16: preserve legacy V1 progress. Only attempts observed from now are counted
// on a legacy record; historic first-try status is unknowable, not inferred.
// V7.41 : préserver les résultats des versions antérieures.
 // Statut du dernier premier essai; compatibilité avec les résultats des anciennes versions.
function validatedState(r){
 if(!r||r.done!==true)return null;
 if(typeof r.validated==='boolean')return r.validated;
 if(r.reviewMastered===true||r.needsReview===false)return true;
 if(r.needsReview===true)return false;
 if(typeof r.firstTryOk==='boolean')return r.firstTryOk;
 return r.ok===true;
}
// Une visite sur la fiche = une nouvelle tentative. Seul son premier choix
// (ou l'autoévaluation explicite) détermine le statut validé/non validé.
function persistResult(exId,choice,correct,first){
 const prev=(saved[exId]&&typeof saved[exId]==='object')?saved[exId]:{};
 const at=new Date().toISOString();
 if(first||!activeVisitId)activeVisitId=syncId();
 const changeId=syncId(),history=Array.isArray(prev.history)?prev.history.slice(-29):[];
 history.push({pick:choice===undefined?null:choice,ok:correct,at,syncId:changeId});
 // La base historique est inchangée ; les nouvelles visites ont des identifiants stables.
 const base=Number.isInteger(prev._syncBaseAttempts)?prev._syncBaseAttempts:(Number.isInteger(prev.attempts)?prev.attempts:0);
 const visits=Array.isArray(prev._syncVisits)?prev._syncVisits.slice():[];
 if(first&&!visits.includes(activeVisitId))visits.push(activeVisitId);
 const result={...prev,done:true,ok:correct,attempts:base+visits.length,history,
   _syncBaseAttempts:base,_syncVisits:visits,_syncAt:at,_syncId:changeId};
 if(choice!==null&&choice!==undefined)result.pick=choice;
 if(first){result.validated=correct;result.lastAttemptAt=at;}
 saved[exId]=result;update();return saved[exId];
}
function recordAnswer(exId,choice,correct){
 const first=!redoAnswered;
 redoAnswered=true;
 redoAttempt={done:true,ok:correct,pick:choice};
 const record=persistResult(exId,choice,correct,first);
 return {changed:true,record};
}
// N'utiliser JAMAIS le choix de la visite précédente pour dessiner la fiche.
function visibleAnswer(exId){return redoAttempt}
function restoreChoiceFocus(kind,choiceIndex,ok){
 const el=document.querySelector(`${kind==='bid'?'.choice':'.cq-option'}[data-answer-index="${choiceIndex}"]`);
 if(el&&typeof el.focus==='function')el.focus({preventScroll:true});
 let live=document.getElementById('qpjb-answer-announcement');
 if(!live){live=document.createElement('div');live.id='qpjb-answer-announcement';live.className='sr-only';live.setAttribute('role','status');live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');document.body.appendChild(live)}
 live.textContent='';live.textContent=ok?'Bonne réponse. Vous pouvez encore changer de choix.':'Réponse incorrecte. Vous pouvez sélectionner une autre proposition.';
}

function quitTraining(){if(embeddedMode){window.parent.postMessage({type:'qpjb-training-exit'},location.origin);return}location.assign('../')}
let trainingNavSeq=0,trainingPendingNav=null,trainingQueuedNav=null;
let trainingListScroll=0,trainingListScope='';
function trainingScope(){return cat+'|'+ptopic+'|'+status}
function trainingNavigate(action){
 if(!embeddedMode){action();return}
 if(trainingPendingNav){trainingQueuedNav=action;return}
 const seq=++trainingNavSeq;
 trainingPendingNav={seq,action};
 window.parent.postMessage({type:'qpjb-training-nav-request',seq},location.origin);
}
// Annoncer les changements d'écran aux lecteurs d'écran sans décaler la page.
// Le <main> a tabindex=-1, et Tab retourne dans l'ordre normal des contrôles.
function focusTrainingPage(){
 if(typeof document==='undefined')return;
 const root=document.getElementById('root');if(!root)return;
 const label=view==='quiz'&&current()
   ?'Exercice '+seqNum(current())+' — '+title()
   :view==='list'||view==='plays'?'Liste des exercices — '+title()
   :view==='topics'?'Thèmes des enchères'
   :view==='playtopics'?'Thèmes du jeu de la carte':'Accueil de l’entraînement';
 root.setAttribute('aria-label',label);
 root.focus({preventScroll:true});
}
function trainingApplyPage(next,restoreList=false,recordRoute=true){
 // An old browser route must never reopen a quarantined or unknown exercise.
 if(next==='quiz'&&!availableExercise(id)){next='list';id='';sessionIds=[];}
 view=next;redoAttempt=null;redoAnswered=false;activeVisitId=null;chosen=null;revealed=false;playSeen=false;
 render();
 if(restoreList&&trainingListScope===trainingScope()){
   requestAnimationFrame(()=>window.scrollTo(0,trainingListScroll));
 }else window.scrollTo(0,0);
 requestAnimationFrame(focusTrainingPage);
 if(recordRoute&&embeddedMode){
   window.parent.postMessage({type:'qpjb-training-route',route:{
     view,cat,id,status,ptopic,sessionIds:sessionIds.slice()
   }},location.origin);
 }
}
function go(v){
 if(v==='home'&&integratedMode){quitTraining();return}
 const restore=v==='list'&&view==='quiz';
 trainingNavigate(()=>trainingApplyPage(v,restore));
}
function typ(v,immediate=false){
 const apply=()=>{
   cat=v;status='all';ptopic='all';sessionIds=[];
   trainingApplyPage(v==='play'?'playtopics':'topics',false,!immediate);
 };
 if(immediate)apply();else trainingNavigate(apply);
}
function topic(v){
 trainingNavigate(()=>{cat=v;status='all';sessionIds=[];trainingApplyPage('list')});
}
function playTopic(v){
 trainingNavigate(()=>{cat='play';ptopic=v;status='all';sessionIds=[];trainingApplyPage('list')});
}
function playTopicId(x){if(x.exerciseFormat!=='carte_qcm')return x.type==='defense'?'defense':'plan-libre';return {'Plan de jeu':'plan-qcm','Impasses':'impasses','Maniements de couleur':'maniements','Communications':'communications','Entame':'entames','Défense':'defense'}[x.topic]||'plan-qcm'}
function item(v){
 // Lists are filtered, but old routes and direct navigation can still carry an ID.
 if(!availableExercise(v))return;
 const fromList=view==='list'||view==='plays';
 if(fromList){trainingListScroll=window.scrollY;trainingListScope=trainingScope()}
 trainingNavigate(()=>{
   if(fromList)sessionIds=filtered().map(x=>x.id);
   id=v;trainingApplyPage('quiz');
 });
}
function availableExercise(v){
 const x=(cat==='play'?D.play:D.bidding).find(x=>x.id===v);
 return x&&x.reviewStatus!=='a_verifier'?x:null;
}
function current(){return availableExercise(id)}
function byDifficulty(arr){return arr.slice().sort((a,b)=>(Number(a.level)||1)-(Number(b.level)||1))}
function rel(){if(cat==='play')return byDifficulty(D.play.filter(x=>x.reviewStatus!=='a_verifier'&&(ptopic==='all'||playTopicId(x)===ptopic)));if(cat==='all')return D.categories.flatMap(c=>counted(c.id));return counted(cat)}
function seqNum(x){return String(rel().findIndex(a=>a.id===x.id)+1).padStart(2,'0')}
function progress(arr){return arr.filter(x=>x.reviewStatus!=='a_verifier'&&saved[x.id]?.done).length}
function validatedCount(arr){return arr.filter(x=>validatedState(saved[x.id])===true).length}
function counted(k){return byDifficulty(D.bidding.filter(x=>x.reviewStatus!=='a_verifier'&&x.theme===k))}
function title(){return cat==='all'?'Toutes les enchères':cat==='play'?(PLAY_TOPICS.find(x=>x.id===ptopic)?.name||'Tout le jeu de la carte'):(D.categories.find(x=>x.id===cat)?.name||'Enchères')}
function stat(x){const s=validatedState(saved[x.id]);return s===null?'→':s?'✓':'✕'}
function filtered(){return rel().filter(x=>{const s=validatedState(saved[x.id]);return status==='all'||(status==='todo'&&s===null)||(status==='ok'&&s===true)||(status==='failed'&&s===false)})}
function pageHome(){const nb=D.bidding.filter(x=>x.reviewStatus!=='a_verifier').length;return `<section class="hero"><span class="badge">QPJB · Entraînement · Bêta V7.43</span><h1>À vous de jouer !</h1><p>Choisissez l'un des <strong>deux espaces d'entraînement indépendants</strong> ci-dessous : les <strong>enchères</strong> ou le <strong>jeu de la carte</strong>.</p><p class="muted" style="font-size:12px;margin-bottom:0">Les exercices sont transposés à partir de leurs documents d’origine.</p></section><div class="home-intro"><strong>Choisissez votre entraînement</strong><span>Deux parcours distincts, dans l’esprit du QPJB.</span></div><div class="grid2 home-choices"><button type="button" class="tile home-tile home-bidding" aria-label="Enchères : choisir un thème parmi les ${D.categories.length} thématiques" onclick="typ('bidding')"><span class="home-kicker">ESPACE 1 · ENCHÈRES</span><span class="home-tile-title" style="color:#292244 !important;display:block !important;font-weight:850 !important;font-size:27px !important;line-height:1.2 !important">Enchères</span><span class="home-description">Entraînez-vous aux enchères avec <strong>${nb} QCM</strong> classés par thème : réponses à l'ouverture, interventions, redemandes, etc.</span><span class="home-action">Choisir un thème d’enchères <span aria-hidden="true">→</span></span></button><button type="button" class="tile home-tile home-play" aria-label="Jeu de la carte : accéder aux ${D.play.filter(x=>x.reviewStatus!=='a_verifier').length} exercices" onclick="typ('play')"><span class="home-kicker">ESPACE 2 · JEU DE LA CARTE</span><span class="home-tile-title" style="color:#292244 !important;display:block !important;font-weight:850 !important;font-size:27px !important;line-height:1.2 !important">Jeu de la carte</span><span class="home-description">Travaillez <strong>${D.play.filter(x=>x.reviewStatus!=='a_verifier').length} situations</strong> de jeu du déclarant et de défense : étudiez les mains, réfléchissez, puis découvrez l’analyse.</span><span class="home-action">Choisir un thème de carte <span aria-hidden="true">→</span></span></button></div>`}
function trainingOverview(kind){
 const isPlay=kind==='play',arr=(isPlay?D.play:D.bidding).filter(x=>x.reviewStatus!=='a_verifier'),ok=validatedCount(arr);
 return `<section class="training-overview"><div class="training-overview-kicker">${isPlay?'Jeu de la carte':'Enchères'}</div><h1>Choisir un thème</h1><p>${isPlay?'Plans de jeu, défense, communications et maniements : choisissez un domaine pour vous entraîner.':'Ouvertures, réponses et enchères compétitives : progressez thème par thème, à votre rythme.'}</p><div class="training-overview-stats"><span>${ok}/${arr.length} validés</span><span>${isPlay?PLAY_TOPICS.length:D.categories.length} thèmes</span></div></section>`
}
function pageTopics(){const groups=[...new Set(D.categories.map(c=>c.group))];const section=groups.map(g=>`<section class="topic-group"><h2>${esc(g)}</h2><div class="grid2">${D.categories.filter(c=>c.group===g).map(c=>{const a=counted(c.id),ok=validatedCount(a);return `<button class="tile" onclick="topic('${c.id}')"><div class="topic-meta"><span class="badge">${a.length} exercices</span><span class="badge topic-validated">${ok}/${a.length} validés</span></div><span class="topic-title">${esc(c.name)}</span><span class="topic-description">${esc(c.description)}</span><div class="topic-progress-track" aria-hidden="true"><div style="width:${a.length?100*ok/a.length:0}%"></div></div></button>`}).join('')}</div></section>`).join('');return `${embeddedMode?trainingOverview('bidding'):`<button class="back" onclick="go('home')">← Accueil</button><h1>Enchères · Choisir un thème</h1><p class="muted">Progressez des ouvertures et premières réponses vers les développements, les enchères compétitives, puis les barrages.</p>`}${section}<p style="margin-top:18px"><button class="btn training-all-button" onclick="topic('all')">Toutes les enchères →</button></p>`}
function pagePlayTopics(){const gs=[...new Set(PLAY_TOPICS.map(t=>t.group))];const sections=gs.map(g=>`<section class="topic-group"><h2>${esc(g)}</h2><div class="grid2">${PLAY_TOPICS.filter(t=>t.group===g).map(t=>{const all=D.play.filter(x=>x.reviewStatus!=='a_verifier'&&playTopicId(x)===t.id),ok=validatedCount(all);return `<button class="tile" onclick="playTopic('${t.id}')"><div class="topic-meta"><span class="badge">${all.length} exercices</span><span class="badge topic-validated">${ok}/${all.length} validés</span></div><span class="topic-title">${esc(t.name)}</span><span class="topic-description">${esc(t.description)}</span><div class="pbar"><div style="width:${all.length?100*ok/all.length:0}%"></div></div></button>`}).join('')}</div></section>`).join('');return `${embeddedMode?trainingOverview('play'):`<button class="back" onclick="go('home')">← Accueil</button><h1>Jeu de la carte · Choisir un thème</h1><p class="muted">Les plans ouverts sont distingués des QCM. Les situations de défense, d'entame et de maniement se travaillent indépendamment.</p>`}${sections}<p style="margin-top:18px"><button class="btn training-all-button" onclick="playTopic('all')">Tous les exercices de carte →</button></p>`}
function miniAuction(x){const items=(x.auction||[]).flat().filter(v=>v&&v!=='?');return items.length?'Séquence : '+items.slice(0,7).join(' · '):'Quelle enchère choisir ?'}
function pageList(){let arr=filtered(), all=rel();return `<button class="back" onclick="go('${cat==='play'?'playtopics':'topics'}')">← ${cat==='play'?'Thèmes de carte':'Toutes les thématiques'}</button><section class="hero"><span class="badge">${all.length} exercices</span><h1>${esc(title())}</h1><p>${cat==='play'?'Étudiez les situations de jeu, de défense et d’entame avant de découvrir l’analyse.':'Choisissez une proposition, puis découvrez l’explication. Vous pouvez réessayer.'}</p><div class="list-progress">${validatedCount(all)}/${all.length} validés</div></section><div class="tools"><select class="field" aria-label="Progression" onchange="status=this.value;redrawList()"><option value="all">Tous les exercices</option><option value="todo" ${status==='todo'?'selected':''}>À faire</option><option value="ok" ${status==='ok'?'selected':''}>Validés</option><option value="failed" ${status==='failed'?'selected':''}>Non validés</option></select></div><div id="count" class="muted" style="font-size:12px;margin-bottom:7px">${arr.length} exercice(s)</div><p class="muted" style="font-size:12px;margin:0 0 9px">✓ Validé · ✕ Non validé · → Pas encore fait</p><div id="entries" class="list">${rows(arr)}</div>`}
const LEGACY_SVG_CONTRACTS={"JC-BH-100-01":"3SA","JC-BH-060-01":"3SA","JC-BH-120-01":"3SA","JC-BH-044-01":"3SA","JC-BH-045-01":"4♥","JC-BH-046-01":"6♥","JC-BH-047-01":"4♠"};
function neutralPlayListTitle(x){
  const direct=String(x.contract||'').trim();
  if(direct)return 'Contrat : '+direct;
  if(LEGACY_SVG_CONTRACTS[x.id])return 'Contrat : '+LEGACY_SVG_CONTRACTS[x.id];
  const m=String(x.questionText||'').match(/Contrat\s*:\s*([1-7])\s*(Sans[- ]?Atout|SA|Piques?|Cœurs?|Coeurs?|Carreaux?|Trèfles?)/i);
  return m?'Contrat : '+m[1]+' '+m[2]:'Situation à analyser';
}
function rows(arr){const numbers=new Map(rel().map((x,i)=>[x.id,String(i+1).padStart(2,'0')]));return arr.map(x=>`<button class="item" onclick="item('${x.id}')"><span class="num">Ex. ${numbers.get(x.id)||seqNum(x)}</span><span class="desc"><span class="exercise-title">${cat==='play'?esc(neutralPlayListTitle(x)):esc(x.question||miniAuction(x))}</span></span><span class="state ${validatedState(saved[x.id])===true?'ok':validatedState(saved[x.id])===false?'no':''}" title="${validatedState(saved[x.id])===null?'Pas encore fait':validatedState(saved[x.id])?'Validé':'Non validé'}">${stat(x)}</span></button>`).join('')||'<div class="panel" style="padding:18px">Aucun exercice ne correspond à ces filtres.</div>'}
function redrawList(){
 // Le filtre ne change que la liste : conserver le select, le focus et le défilement.
 const entries=document.getElementById('entries'),count=document.getElementById('count');
 if(!entries||!count){render();return}
 const arr=filtered();
 entries.innerHTML=rows(arr);
 count.textContent=arr.length+' exercice(s)';
 colorAllSuits(entries);
}
function auction(x){let a=x.auction||[];return a.length?`<table class="auc"><thead><tr><th>Sud</th><th>Ouest</th><th>Nord</th><th>Est</th></tr></thead><tbody>${a.map(r=>'<tr>'+r.map(t=>`<td class="${t.includes('?')?'ask':''}">${esc(t||'—')}</td>`).join('')+'</tr>').join('')}</tbody></table>`:''}
function hand(x){return `<div class="suits">${x.hand.map((s,i)=>`<div class="suit"><span class="sym ${i===1||i===2?'red':'black'}">${'♠♥♦♣'[i]}</span><span>${esc(s)}</span></div>`).join('')}</div>`}
/* Actualiser uniquement les réponses : préserver la main, les enchères et le défilement. */
function updateBiddingAnswer(x,guided=false){
 const quiz=document.querySelector('.qpjb-bid-quiz');
 const group=quiz?.querySelector('.choices');
 if(!group||!Array.isArray(x?.choices))return false;
 const p=visibleAnswer(id);
 const selected=guided?chosen:(p?.done?p.pick:chosen);
 for(const button of group.querySelectorAll('.choice[data-answer-index]')){
  const b=x.choices[Number(button.dataset.answerIndex)];
  const active=b===selected;
  button.classList.toggle('selected',active);
  button.classList.toggle('correct',!guided&&!!p?.done&&active&&!!p.ok);
  button.classList.toggle('wrong',!guided&&!!p?.done&&active&&!p.ok);
  button.setAttribute('aria-pressed',String(active));
 }
 let area=quiz.querySelector('.qpjb-answer-area');
 if(!area){
  area=document.createElement('div');
  area.className='qpjb-answer-area';
  area.innerHTML='<div class="qpjb-answer-content"></div>';
  group.insertAdjacentElement('afterend',area);
 }
 const selectedNow=selected!==null&&selected!==undefined;
 if(!selectedNow){
  // Conserver le contenu masqué pendant l'animation inverse : pas de saut brutal.
  area.dataset.openRequested='no';
  area.classList.remove('is-open');
  area.setAttribute('aria-hidden','true');
  area.inert=true;
  return true;
 }
 area.dataset.openRequested='yes';
 const answerContent=area.querySelector('.qpjb-answer-content');
 answerContent.innerHTML=guided?sourceCorrection(x):correctDisplay(x);
 // Le corrigé est injecté après render() : coloriser aussi ce nouveau DOM.
 // Ne traiter que le fragment ajouté, sans reconstruire la page ni l'animation.
 colorAllSuits(answerContent);
 area.removeAttribute('aria-hidden');
 area.inert=false;
 if(!area.classList.contains('is-open')){
  // Vérifier l'état au prochain frame : un second clic rapide peut avoir décoché.
  requestAnimationFrame(()=>{
   if(area.isConnected&&area.dataset.openRequested==='yes')area.classList.add('is-open');
  });
 }
 return true;
}
/* Recliquer sur le choix actif revient à l'écran vierge, sans recharger l'exercice. */
function uncheckBiddingAnswer(x,guided=false){
 // Décocher masque la réponse, sans créer une nouvelle visite ni un nouveau premier essai.
 redoAttempt=null;chosen=null;revealed=false;playSeen=false;
 if(!updateBiddingAnswer(x,guided))render();
 const status=document.getElementById('source-answer-status');
 if(status)status.textContent='';
 const live=document.getElementById('qpjb-answer-announcement');
 if(live)live.textContent='';
}
function respond(b){
 const x=current();if(!x||!x.choices.includes(b))return;
 if(visibleAnswer(id)?.done&&visibleAnswer(id).pick===b){uncheckBiddingAnswer(x);return}
 chosen=b;const idx=x.choices.indexOf(b),ok=b===x.correct;
 recordAnswer(id,b,ok);
 if(!updateBiddingAnswer(x))render();
 restoreChoiceFocus('bid',idx,ok);
}
const REVIEWED_PRETRY_DISTRACTORS={"EN-1m-005":{"2♠":"Vous n’avez que deux Piques : cette enchère ne décrit ni une couleur ni un soutien utile."},"EN-1m-014":{"3♠":"Vous n’avez que trois Piques : cette enchère ne décrit pas votre main."},"EN-1m-017":{"Passe":"Vous êtes trop fort pour passer après l’ouverture du partenaire."},"EN-1m-024":{"2♥":"Deux Cœurs ne permettent pas d’annoncer cette majeure."},"EN-1m-026":{"2♠":"Vous n’avez que trois Piques : cette enchère décrit une couleur absente."},"EN-1M-001":{"2♠":"Votre singleton Pique ne constitue pas un soutien de la majeure ouverte par le partenaire.","2SA":"Cette main faible n’a pas la force pour inviter à Sans-Atout."},"EN-1M-002":{"2SA":"La main est trop faible pour suggérer les Sans-Atout au palier de 2.","3♠":"Le saut à 3♠ serait excessif avec seulement deux cartes à Pique et une faible force."},"EN-1M-003":{"4♣":"Vous ne disposez pas d’une couleur à Trèfle justifiant cette enchère."},"EN-1M-004":{"3♥":"Vos deux Cœurs ne permettent pas de soutenir la deuxième couleur du partenaire."},"EN-1sa-006":{"7SA":"Vous n’avez pas de garantie suffisante pour imposer le grand chelem."},"EN-1sa-009":{"3SA":"Avec une invitation et seulement 8–9 HL, vous ne pouvez pas imposer la manche à Sans-Atout."},"EN-intervention-002":{"1SA":"Cette main de 8H n’a ni la force ni la distribution requises pour une intervention à 1SA.","2♠":"Un saut à 2♠ ne peut être envisagé avec une couleur aussi faible et seulement cinq cartes."},"EN-intervention-003":{"2♣":"Vous ne détenez que deux Trèfles : cette couleur n’est pas annonçable naturellement.","2SA":"Vous n’avez ni les valeurs ni la structure pour une intervention à Sans-Atout."},"EN-intervention-005":{"1SA":"Votre main est trop forte et trop irrégulière pour une intervention par 1SA."},"EN-intervention-008":{"2SA":"La main n’est pas régulière et ne possède pas la force nécessaire à une intervention par Sans-Atout."},"EN-intervention-014":{"1♠":"Une intervention naturelle à 1♠ n’est pas fondée sur seulement quatre Piques."},"EN-intervention-015":{"2♦":"En mineure au palier de 2, votre couleur cinquième n’a pas une qualité suffisante pour intervenir."},"EN-intervention-020":{"1♥":"La main ne comporte que trois Cœurs, insuffisants pour intervenir naturellement."},"EN-intervention-021":{"1♠":"Vous ne possédez que deux Piques : une intervention naturelle à 1♠ est exclue."},"EN-intervention-024":{"1♥":"Avec seulement trois Cœurs, vous ne pouvez pas intervenir naturellement à 1♥."},"EN-intervention-028":{"1SA":"La force et la distribution ne correspondent pas à une intervention à 1SA.","1♥":"La majeure Cœur n’est que quatrième, avec une force trop faible et une main trop régulière pour une intervention naturelle."},"EN-redemande-002":{"2♠":"Vous n’avez que deux Piques : ne soutenez pas la majeure du partenaire sans fit."},"EN-redemande-003":{"2SA":"La main est irrégulière et trop limitée pour une redemande quantitative à Sans-Atout."},"EN-redemande-004":{"3SA":"La main de l’ouvreur est minimale : le partenaire n’a proposé que la manche, il ne l’a pas imposée."},"EN-redemande-018":{"3SA":"Vous n’avez ni répartition régulière ni arrêts suffisants pour choisir 3SA à ce stade.","3♥":"La répétition des Cœurs avec seulement quatre cartes risquerait d’induire le partenaire en erreur."},"EN-redemande-023":{"2♠":"Vous n’avez qu’un Pique : il n’y a pas de fit à exprimer."},"EN-redemande-024":{"2♠":"Vous ne détenez que deux Piques : ce n’est pas un soutien de la majeure du répondant."},"EN-suite-repondant-002":{"4♠":"Vous n’avez ni fit déclaré à Pique ni assez de force pour imposer une autre manche majeure."},"EN-suite-repondant-006":{"3♥":"Avec cette main faible, monter au palier de 3 serait excessif."},"EN-barrage-001":{"3♥":"Le singleton Cœur n’est pas une couleur d’ouverture possible."},"EN-barrage-002":{"1♠":"Le doubleton Pique ne constitue pas une couleur d’ouverture."},"EN-barrage-004":{"3♣":"Avec cette force en honneurs, l’ouverture de barrage à 3♣ ne convient pas."},"EN-bicolore-004":{"3♦":"Avec seulement deux Carreaux, il serait faux d’annoncer cette couleur."},"EN-BH-100-01":{"3SA":"3SA impose une manche avec une force combinée trop faible."},"EN-BH-100-02":{"2♣":"Le Stayman n’est pas indiqué sans majeure quatrième."},"EN-BH-100-03":{"2SA":"2SA ne convient pas à une main aussi forte : c’est une simple invitation à la manche."},"EN-BH-120-01":{"3SA":"Sans arrêt fiable des couleurs adverses ni jeu régulier, 3SA n’est pas indiqué."},"EN-BH-013-03":{"4♠":"4♠ imposerait la manche avec seulement une force invitante."},"EN-BH-044-01":{"2SA":"2SA est une invitation trop optimiste avec cette main sans plus-value.","2♣":"Sans majeure quatrième, un Stayman à 2♣ n’a pas d’objectif."},"EN-BH-044-02":{"2♣":"Un Stayman n’est pas utile en l’absence de majeure quatrième."},"EN-BH-044-04":{"2SA":"2SA est une invitation à la manche trop faible."},"EN-BH-047-02":{"1SA":"1SA ne convient pas automatiquement à toute main régulière riche en points après intervention adverse."},"EN-BH-065-02":{"1SA":"1SA est trop faible pour une réponse d’environ 10 beaux ou 11 H.","2♠":"Avec seulement trois Piques, pas de fit majeur garanti."},"EN-BH-071-01":{"4♠":"4♠ impose une manche trop élevée pour la force réévaluée."},"EN-BH-050-04":{"2♠":"2♠ donnerait un soutien à la majeure que le répondant n’a pas annoncée."},"EN-BH-051-01":{"2♥":"2♥ serait un soutien avec seulement trois Cœurs."},"EN-BH-051-03":{"1SA":"1SA annoncerait seulement la première zone."},"EN-BH-053-01":{"3♦":"3♦ est un saut trop élevé pour la force de cette ouverture."},"EN-BH-075-02":{"Passe":"Passe n’est pas justifié dès lors que le répondant possède les valeurs pour agir."},"EN-BH-093-02":{"Passe":"Passe n’est pas indiqué avec ces valeurs permettant une réponse."},"EN-BH-093-05":{"1SA":"1SA exprime une zone trop faible."},"EN-BH-108-01":{"2SA":"2SA inviterait à la manche avec trop peu de points."},"EN-BH-108-02":{"2♠":"2♠ ne convient pas avec seulement quatre Piques."},"EN-BH-122-01":{"3SA":"3SA imposerait la manche avec trop peu de points."},"EN-BH-122-02":{"4SA":"4SA quantitatif inviterait au chelem avec un total trop faible."},"EN-BH-122-03":{"2♣":"2♣ n’est pas indiqué sans majeure quatrième à rechercher."},"EN-BH-122-06":{"5SA":"5SA n’est pas la conclusion naturelle du petit chelem accepté."},"EN-BH-049-02":{"3♠":"Avec seulement deux Piques, annoncer un barrage à 3♠ décrirait une longueur inexistante."},"EN-BH-055-02":{"2♥":"L’As de Cœur troisième ne constitue pas une véritable couleur d’intervention à 2♥."},"EN-BH-056-01":{"3♠":"Trois Piques seulement : le saut à 3♠ ne décrit ni la distribution régulière ni une couleur naturelle suffisamment longue."},"EN-BH-056-02":{"1♠":"Deux Piques seulement : vous ne pouvez pas répondre naturellement dans cette majeure."},"EN-BH-056-03":{"1♠":"Seulement trois Piques : n’inventez pas une majeure quatrième."},"EN-BH-057-05":{"3♠":"Vous n’avez que quatre Piques, donc les répéter ne décrit pas une longue couleur autonome."},"EN-BH-057-06":{"2SA":"La main est trop faible pour une proposition à Sans-Atout."},"EN-BH-058-05":{"1♥":"Deux Cœurs ne permettent pas de rechercher naturellement un fit à Cœur."},"EN-BH-058-06":{"3♠":"Vous n’avez que trois Piques, insuffisants pour les proposer comme couleur naturelle à ce palier."},"EN-BH-067-01":{"1♠":"Deux Piques seulement : cette ouverture ne décrit pas une couleur cinquième."},"EN-BH-067-02":{"1♠":"Seulement deux Piques : une ouverture naturelle à 1♠ ne convient pas."},"EN-BH-073-01":{"3SA":"Vous n’avez pas les valeurs permettant d’imposer la manche à Sans-Atout."},"EN-BH-073-02":{"2SA":"Vous n’avez pas la force invitante demandée pour une proposition de manche."},"EN-BH-073-03":{"2♠":"Vous n’avez que trois Piques : ne soutenez pas cette majeure comme si le fit était acquis."},"EN-BH-073-04":{"2♠":"Votre singleton Pique ne constitue pas un soutien à la deuxième couleur annoncée par l’ouvreur."},"EN-BH-073-06":{"2SA":"La main est trop faible pour faire une proposition de manche à 2SA dans cette séquence."},"EN-BH-074-03":{"3♠":"Votre main ne possède que deux Piques : l’annonce de 3♠ suggérerait une couleur ou un fit majeur que vous n’avez pas.","3♥":"Avec 6-4 à Cœur, vous n’avez pas de couleur majeure à proposer naturellement au palier de 3."},"EN-BH-077-03":{"3♥":"Avec seulement deux Cœurs à la Dame, cette enchère ne décrit ni une longue couleur ni un fit."},"EN-BH-078-01":{"3♦":"Trois Carreaux à la Dame ne permettent pas d’ouvrir d’un barrage dans cette couleur."},"EN-BH-081-02":{"2♣":"Un soutien libre à 2♣ avec seulement trois Trèfles et un jeu faible ne décrit pas un soutien suffisant à l'ouverture du partenaire.","2♦":"Vous n'avez que quatre Carreaux peu solides et trop peu de force pour changer de couleur librement au palier de 2."},"EN-BH-081-05":{"2♣":"La présence de cinq Trèfles ne suffit pas : un changement de couleur libre au palier de 2 demanderait davantage de force."},"EN-BH-086-01":{"2♠":"Deux Piques seulement : pas d’ouverture naturelle majeure au palier de 2."},"EN-BH-087-01":{"3♥":"Vous n'avez que deux petits Cœurs : annoncer cette majeure inventerait une nouvelle couleur."},"EN-BH-096-02":{"1♠":"Trois Piques seulement : pas d’ouverture majeure cinquième."},"EN-BH-096-04":{"1♥":"Quatre Cœurs seulement et une main trop faible pour ouvrir naturellement de 1♥."},"EN-BH-098-03":{"1♠":"Vous n’avez que trois Piques : pas de nouvelle majeure quatrième à montrer.","1♥":"Trois Cœurs seulement : pas de fit majeur à explorer par cette réponse."},"EN-BH-098-05":{"2♠":"Trois Piques seulement : ce palier ne constitue pas une réponse naturelle adaptée.","2♥":"Trois Cœurs seulement : vous n’avez pas la majeure annoncée."},"EN-BH-099-03":{"1♦":"Trois Carreaux A-D-2 ne permettent pas d’intervenir naturellement à 1♦ malgré les honneurs."},"EN-BH-101-02":{"2♦":"Le soutien de Carreau n’est que troisième (7-5-4) et votre main est trop faible pour cette action dans la séquence proposée."},"EN-BH-102-04":{"1SA":"Le bicolore 5–5 majeur n’est pas une main à masquer par une réponse à Sans-Atout."},"EN-BH-103-01":{"2♦":"Vous ne détenez que trois petits Carreaux et trop peu de force pour un changement de couleur."},"EN-BH-113-05":{"2♣":"Trois Trèfles ne suffisent pas pour une intervention naturelle à 2♣. Votre distribution ne convient pas davantage au contre d'appel."},"EN-BH-116-06":{"3♥":"Vous ne possédez que deux Cœurs et votre partenaire n'a pas montré de longueur Cœur."},"EN-BH-117-06":{"3♠":"Avec un singleton Pique, vous n’êtes pas fitté : le soutien à 3♠ serait inapproprié."},"EN-BH-118-01":{"2♦":"Vous n’avez que trois Carreaux : les annoncer comme une seconde couleur de l’ouvreur créerait une distribution fictive."},"EN-BH-119-04":{"2♥":"Vous n’avez que deux Cœurs et votre partenaire n’en a pas annoncé : ce n’est pas votre couleur naturelle."},"EN-BH-119-05":{"3♥":"Vos trois Cœurs ne permettent pas de proposer un nouveau contrat naturel à Cœur au palier de 3."},"EN-BH-119-06":{"4♠":"Vous détenez un singleton Pique : cette couleur ne constitue pas un contrat naturel possible."},"EN-BH-123-01":{"1♠":"Trois Piques seulement ne constituent pas une vraie couleur d'intervention naturelle."},"EN-BH-123-06":{"2♣":"Avec quatre Trèfles D-V-8-3 seulement, une intervention naturelle au palier de 2 ne décrit pas une vraie longue couleur."},"EN-BH-125-04":{"1♥":"Vos deux Cœurs ne permettent pas une intervention naturelle et empêchent aussi un contre d'appel classique."},"EN-BH-125-06":{"1SA":"Cette main régulière de force modeste n'a pas les 15–18 H normalement demandés pour une intervention directe à 1SA."},"EN-BH-061-02":{"1♦":"Vos trois Carreaux R-V-9 sont insuffisants pour une intervention naturelle : ce n'est pas votre couleur longue."},"EN-BH-064-02":{"1♥":"A-4 à Cœur représente seulement deux cartes, trop peu pour une intervention naturelle dans cette majeure."},"EN-BH-068-02":{"2♣":"Avec seulement trois Trèfles et une main trop faible, soutenir l'ouverture à ce niveau serait un engagement excessif."},"EN-BH-088-04":{"1♠":"Trois Piques seulement excluent une intervention naturelle à 1♠."},"EN-BH-088-05":{"1SA":"La main est bicolore 5–5, trop faible et très irrégulière pour une intervention à Sans-Atout."},"EN-BH-088-06":{"2♦":"R-D-9-7 à Carreau est également quatrième, et ne suffit pas à justifier une intervention naturelle au palier de 2 malgré votre force."}};

// V7.31 — Nettoyage éditorial de présentation, sans modification des PDF/source.
function pedagogicText(value,x){
  let t=String(value||'').trim();
  // Une référence à une ancienne numérotation n'a plus de sens après le reclassement.
  if(x?.id==='EN-BH-086-06' && /[Qq]uestion\s*N[°ºo.]?\s*5/.test(t)){
    return 'Un jeu tricolore comporte trois couleurs d’au moins quatre cartes (4441 ou 5440). Avec deux mineures quatrièmes et un singleton, on ouvre de la mineure la plus chère.';
  }
  // Les explications destinées aux élèves ne citent pas la provenance du corrigé.
  t=t.replace(/\bDans le système du corrigé,?\s*/gi,'');
  t=t.replace(/\bdans le système du corrigé/gi,'');
  t=t.replace(/\bselon le (?:traitement pédagogique du |traitement du |cadre du )?corrigé/gi,'');
  t=t.replace(/\bdans le cadre du corrigé/gi,'');
  t=t.replace(/\bdans le système utilisé par le corrigé/gi,'dans cette séquence');
  t=t.replace(/\ble système du corrigé prévoit\b/gi,'les conventions utilisées prévoient');
  t=t.replace(/\bdans le système de ce corrigé/gi,'dans cette séquence');
  t=t.replace(/\b(?:retenue?s?|présentée?s?) dans le corrigé/gi,'');
  // Répare les séparations laissées par des incises éditoriales.
  t=t.replace(/\s+([,.!?])/g,'$1').replace(/,\s*;/g,';').replace(/\s{2,}/g,' ').trim();
  t=t.replace(/,\s*\./g,'.').replace(/\s+\)/g,')').replace(/,\s*\)/g,')').replace(/\(\s*\)/g,'');
  return t;
}
function displayConventionWarning(x){
  if(x?.id==='EN-BH-050-05')return 'Le sens de 3♥ après un soutien simple dépend des accords de la paire.';
  if(x?.id==='EN-BH-109-03')return 'Le sens de 3♠ après un soutien simple dépend des accords de la paire.';
  return pedagogicText(x?.conventionWarning||'',x);
}

function safeDistractorNote(x,choice){
  const enriched=x.pretryHints?.[choice];
  if(typeof enriched==='string' && enriched.trim())return pedagogicText(enriched,x);
  const note=x.distractorNotes&&x.distractorNotes[choice];
  const expected=REVIEWED_PRETRY_DISTRACTORS[x.id]?.[choice];
  // Fail closed: not displayed before success unless exactly present in our curated list.
  return typeof note==='string' && note===expected ? pedagogicText(note,x) : '';
}
function togglePostsolution(button){
 const block=button?.closest('.postsolution-notes');
 if(!block)return;
 const open=block.classList.toggle('is-open');
 button.setAttribute('aria-expanded',String(open));
}
function postSolutionAlternatives(x){
  // Même commentaire court pendant l'essai et après la réussite ;
  // les anciennes notes restent intactes dans D et servent de repli
  // pour les rubriques qui n'ont pas encore été retravaillées.
  const entries=(x.choices||[]).filter(choice=>choice!==x.correct).map(choice=>{
    const short=x.pretryHints?.[choice];
    const legacy=x.distractorNotes?.[choice];
    const note=typeof short==='string'&&short.trim()?short:legacy;
    return [choice,pedagogicText(note,x)];
  }).filter(([choice,note])=>typeof note==='string'&&note.trim());
  if(!entries.length)return '';
  return `<div class="postsolution-notes"><button type="button" class="postsolution-trigger" aria-expanded="false" onclick="togglePostsolution(this)">Pourquoi les autres propositions ne conviennent pas</button><div class="postsolution-body"><div class="postsolution-body-inner"><div class="postsolution-grid">${entries.map(([choice,note])=>`<div class="postsolution-item"><strong>Pourquoi pas ${esc(choice)} ?</strong><p>${esc(note)}</p></div>`).join('')}</div></div></div></div>`;
}
function correctDisplay(x){const p=visibleAnswer(id);if(!p?.done)return '';
  if(!p.ok){const note=safeDistractorNote(x,p.pick);return `<div class="feedback qcm-feedback" role="status" aria-live="polite"><h3 class="feedno">✕ Mauvaise réponse !</h3><p>${note?esc(note):'Ce choix ne correspond pas au corrigé retenu. Essayez une autre proposition.'}</p></div>`}
  return `<div class="feedback qcm-feedback" role="status" aria-live="polite"><h3 class="feedok">✓ Bonne réponse !</h3><p>${esc(pedagogicText(x.explanation||'Comparez votre raisonnement avec la réponse attendue.',x))}</p>${x.conventionWarning?`<p class="convention-note"><strong>Cadre conventionnel :</strong> ${esc(displayConventionWarning(x))}</p>`:''}${postSolutionAlternatives(x)}</div>`
}
function candidateHands(x){if(!x.handOptions)return '';return `<div class="compare-hands">${x.handOptions.map((h,i)=>`<div class="candidate-hand"><strong>Main ${i+1}</strong><div class="candidate-suits">${h.map((v,j)=>`<div><b class="${j===1||j===2?'red':'black'}">${'♠♥♦♣'[j]}</b> ${esc(v)}</div>`).join('')}</div></div>`).join('')}</div>`}

function sourceGuided(x){return x?.reviewStatus==='transcrit_source'}
function sourceExplanation(x){const t=x.explanation||'';const clean=x.id==='EN-BH-090-03'?t.replace(' Cette interprétation est celle du corrigé ancien et ne correspond pas au référentiel QPJB retenu : exercice maintenu en quarantaine.',''):t;return pedagogicText(clean,x)}
function chooseSource(i){
 const x=current(),a=Array.isArray(x?.choices)?x.choices:x?.options;
 if(!sourceGuided(x)||!a||!Number.isInteger(i)||i<0||i>=a.length)return;
 const pick=Array.isArray(x.choices)?a[i]:i;
 if(playSeen&&chosen===pick){if(cat==='play'&&x.exerciseFormat==='carte_qcm'){uncheckCardAnswer(x,true);return}if(cat!=='play'){uncheckBiddingAnswer(x,true);return}}
 chosen=pick;playSeen=true;
 if(cat==='play'){if(!updateCardAnswer(x,true))render();}
  else if(!updateBiddingAnswer(x,true))render();
 const elem=document.querySelector(`[data-answer-index="${i}"]`);
 if(elem)elem.focus({preventScroll:true});
 const msg=document.getElementById('source-answer-status');
 if(msg)msg.textContent='Corrigé du document d’origine affiché ci-dessous.';
}
function sourceCorrection(x){const p=visibleAnswer(id),revealed=playSeen||p?.done;if(!revealed)return '';const ans=Array.isArray(x.choices)?x.correct:x.options[x.answerIndex];const explanation=sourceExplanation(x);return `<section class="feedback source-correction"><h3>Réponse du corrigé d’origine</h3><p><strong>${esc(ans)}</strong>${explanation?' — '+esc(explanation):''}</p><p class="muted">Comparez avec votre raisonnement. Il n’y a pas de notation automatique sur cet exercice.</p>${x.exerciseFormat==='carte_qcm'?postPlayAlternatives(x):((x.pretryHints && Object.keys(x.pretryHints).length)?postSolutionAlternatives(x):'')}${p?.done?`<p class="completion-notice">${p.ok?'✓ Exercice terminé — conforme à mon raisonnement':'✓ Exercice terminé — à revoir'}</p>`:`<div class="gamecheck"><button class="btn" onclick="assess(true)">✓ Mon raisonnement correspond</button><button class="btn" onclick="assess(false)">↻ À revoir</button></div>`}</section>`}
function quizBSource(x){const p=visibleAnswer(id),sel=p?.done&&p.pick!==undefined?p.pick:chosen;const special=x.exerciseFormat==='qcm_main'||x.exerciseFormat==='qcm_fit';return `<div class="qpjb-quiz-nav"><button class="back" onclick="go('list')">← ${esc(title())}</button><span class="badge">Exercice ${seqNum(x)}</span></div><div class="quizgrid qpjb-bid-quiz"><section class="panel"><h2>${special?'Analyser la séquence':'Vous êtes en Sud'}</h2>${x.handOptions?candidateHands(x):x.hand&&x.hand.length?hand(x):''}<h3>Séquence d’enchères</h3>${auction(x)}${x.sourceContext?`<p class="source-context">${esc(x.sourceContext)}</p>`:''}</section><section class="panel"><h2>${esc(x.question||'Quelle est votre enchère ?')}</h2><p class="muted">Choisissez votre réponse, puis comparez-la au corrigé du document.</p><div class="choices">${x.choices.map((b,i)=>`<button data-answer-index="${i}" class="choice ${sel===b?'selected':''}" onclick="chooseSource(${i})" aria-pressed="${sel===b}">${esc(b)}</button>`).join('')}</div><div id="source-answer-status" role="status" class="sr-only"></div>${sourceCorrection(x)}</section></div>${nav()}`}
function quizCardSource(x){const p=visibleAnswer(id),sel=p?.done&&p.pick!==undefined?p.pick:chosen;return `<div class="qpjb-quiz-nav"><button class="back" onclick="go('list')">← Jeu de la carte</button><span class="badge">Exercice ${seqNum(x)}</span></div><div class="panel cq-stage"><h2>À vous de jouer</h2><div class="cq-head">${x.contract?`<span class="pill">Contrat : ${esc(x.contract)}</span>`:''}${x.lead?`<span class="pill">Entame : ${esc(x.lead)}</span>`:''}</div><p class="q">${esc(x.prompt)}</p>${cardAuction(x)}${renderCardDiagram(x)}<p class="muted">Sélectionnez une proposition pour découvrir le corrigé d’origine.</p><div class="cq-options">${x.options.map((o,i)=>`<button data-answer-index="${i}" class="cq-option ${sel===i?'selected':''}" onclick="chooseSource(${i})" aria-pressed="${sel===i}">${esc(o)}</button>`).join('')}</div><div id="source-answer-status" role="status" class="sr-only"></div>${cardAnswerArea(x,true)}</div>${nav()}`}

function quizB(x){if(sourceGuided(x))return quizBSource(x);const p=visibleAnswer(id);let selected=p?.done?p.pick:chosen;const special=!!x.exerciseFormat&&/^qcm_(main|fit)$/.test(x.exerciseFormat);return `<div class="qpjb-quiz-nav"><button class="back" onclick="go('list')">← ${esc(title())}</button><span class="badge">Exercice ${seqNum(x)}</span></div><div class="quizgrid qpjb-bid-quiz"><section class="panel"><h2>${x.exerciseFormat==='qcm_fit'?'Analyser la séquence':x.exerciseFormat==='qcm_main'?'Reconnaître la bonne main':'Vous êtes en Sud'}</h2><p class="muted">${special?'Examinez les informations avant de répondre.':'Étudiez votre main et la séquence.'}</p>${x.handOptions?candidateHands(x):x.hand&&x.hand.length?hand(x):''}<h3>Séquence d’enchères</h3>${auction(x)}</section><section class="panel"><h2>${esc(x.question||'Quelle est votre enchère ?')}</h2><p class="muted">Cliquez sur une réponse pour vérifier. Vous pouvez ensuite changer de choix.</p><div class="choices">${x.choices.map((b,ix)=>`<button data-answer-index="${ix}" class="choice ${selected===b?'selected':''} ${p?.done&&b===p.pick?(p.ok?'correct':'wrong'):''}" onclick="respond('${b}')" aria-pressed="${selected===b}">${esc(b)}</button>`).join('')}</div>${p?.done?`${correctDisplay(x)}`:''}</section></div>${nav()}`}
function revealPlay(){
 playSeen=true;render();
 // La création du corrigé remplace le bouton : conserver le focus clavier.
 const button=document.querySelector('button[onclick="revealPlay()"]');
 if(button)button.focus({preventScroll:true});
}
function assess(ok){
 if(!current()||redoAttempt?.done)return;
 redoAttempt={done:true,ok,pick:chosen};redoAnswered=true;
 persistResult(id,chosen,ok,true);
 if(cat==='play'){if(current()?.exerciseFormat!=='carte_qcm'||!updateCardAnswer(current(),true))render();}
  else if(!updateBiddingAnswer(current(),true))render();
}
function quizAtelier(x){const p=visibleAnswer(id);return `<button class="back" onclick="go('list')">← Ateliers d’enchères</button><div class="quizhead"><span class="badge">Enchères · Atelier ${seqNum(x)}</span></div><section class="panel" style="margin-top:14px"><h2>${esc(x.lessonTitle)}</h2><p>Réfléchissez aux questions. Ce format est en auto-évaluation, et non en QCM.</p><div class="game-img-wrap"><img class="game-img" src="${x.image}" alt="Exercice d’enchères : ${esc(x.lessonTitle)}" /></div>${x.importMethod==='facsimile_exercice_anonyme'?`<button type="button" class="btn document-zoom-button" onclick="toggleDocumentZoom(this)">Agrandir l’énoncé</button>`:''}<div style="margin-top:14px"><button class="btn primary" onclick="revealPlay()">${playSeen||p?.done?'Revoir le corrigé':'Découvrir le corrigé'} →</button></div>${playSeen||p?.done?`<div class="feedback"><h3>Explications</h3><div class="game-solution">${esc(x.answerText)}</div>${p?.done?`<p class="completion-notice">${p.ok?'✓ Atelier terminé — réussi':'✓ Atelier terminé — à revoir'}</p>`:`<p class="muted">Votre raisonnement allait-il dans le bon sens ?</p><div class="gamecheck"><button class="btn" onclick="assess(true)">✓ J’avais bon</button><button class="btn" onclick="assess(false)">↻ À revoir</button></div>`}</div>`:''}</section>${nav()}`}
function seatFromLabel(label,fallback='south'){const v=(label||'').toLowerCase();if(v.includes('nord')||v.includes('mort'))return 'north';if(v.includes('sud'))return 'south';if(v.includes('ouest'))return 'west';if(v.includes('est'))return 'east';if(v.includes('déclarant'))return fallback;if(v.includes('votre main'))return fallback;return fallback}
function suitClass(s){return '♥♦'.includes(s)?'red':'black'}
function prettySeat(pos){return {north:'Nord',south:'Sud',east:'Est',west:'Ouest'}[pos]||''}
function cleanRanks(t){return (t||'').replace(/\s+/g,' ').trim()}
function normRows(arr){return '♠♥♦♣'.split('').map((s,i)=>({suit:s,ranks:cleanRanks((arr||[])[i]||'')})).filter(r=>r.ranks)}

function seatLabel(pos){return {north:'N',south:'S',east:'E',west:'O'}[pos]||''}
// pos = emplacement à l'écran ; physical = vraie place à la table.
function seatBox(pos,data,physical=pos){if(!data||!data.rows||!data.rows.length)return '';return `<section class="deal-seat ${pos}" data-seat="${physical}"><div class="deal-seat-head"><span class="deal-seat-name">${esc(data.title||prettySeat(physical))}</span><span class="deal-seat-pos">${seatLabel(physical)}</span></div><ul class="deal-cards">${data.rows.map(r=>`<li><span class="deal-suit ${suitClass(r.suit)}">${esc(r.suit)}</span><span class="deal-ranks">${esc(cleanRanks(r.ranks)||'—')}</span></li>`).join('')}</ul></section>`}
function parsePlayedCard(value){const raw=cleanRanks(value);if(!raw||raw==='—'||/à vous de choisir/i.test(raw)||/(?:,|;|\bpuis\b)/i.test(raw))return null;const suitmap={pique:'♠',piques:'♠',coeur:'♥',coeurs:'♥',cœur:'♥',cœurs:'♥',carreau:'♦',carreaux:'♦',trèfle:'♣',trèfles:'♣'};let m=raw.match(/(10|[ARDV23456789])\s*([♠♥♦♣])/i);if(m)return {rank:m[1].toUpperCase(),suit:m[2]};m=raw.match(/([♠♥♦♣])\s*(10|[ARDV23456789])/i);if(m)return {rank:m[2].toUpperCase(),suit:m[1]};m=raw.toLowerCase().match(/\b(as|roi|dame|valet|dix|10|[23456789])\s+(?:de\s+|d[’']\s*)?(pique?s?|c[œo]urs?|carreaux?|tr[eè]fles?)\b/i);if(!m)return null;const ranks={as:'A',roi:'R',dame:'D',valet:'V',dix:'10'},rank=ranks[m[1]]||m[1];let suit=(m[2].toLowerCase().replace(/œ/g,'oe').replace(/è/g,'e'));suit=suit.startsWith('piqu')?'♠':suit.startsWith('coeur')?'♥':suit.startsWith('carreau')?'♦':suit.startsWith('trefle')?'♣':null;return suit?{rank,suit}:null}
function resolveLeadSeat(x,context=''){const t=((x?.prompt||'')+' '+(x?.questionText||'')).toLowerCase();if(/\best\s+entame\b|\bentame\s+d[’']?est\b/.test(t))return 'east';if(/\bouest\s+entame\b|\bentame\s+d[’']?ouest\b/.test(t))return 'west';// In these lessons the declarer is South, so the opening leader is West.
if(x?.type==='declarant')return 'west';// The defender in East sees partner's opening lead from West.
if(/vous\s*[·-]\s*est/i.test(x?.southLabel||'')||/\bvous êtes en est\b/i.test(t))return 'west';if(/vous\s*[·-]\s*ouest/i.test(x?.southLabel||''))return 'west';return 'west'}
function playedCard(card,position,caption='Entame',physical=position){const name=prettySeat(physical);return `<div class="deal-played ${position}" data-seat="${physical}" role="img" aria-label="Entame jouée par ${name} : ${esc(card.rank)} de ${esc({'♠':'Pique','♥':'Cœur','♦':'Carreau','♣':'Trèfle'}[card.suit])}"><div class="deal-played-label">${esc(caption)} · ${name}</div><div class="deal-playing-card ${suitClass(card.suit)}"><span class="deal-card-corner">${esc(card.rank)}<small>${esc(card.suit)}</small></span><span class="deal-card-big">${esc(card.suit)}</span><span class="deal-card-corner bottom">${esc(card.rank)}<small>${esc(card.suit)}</small></span></div></div>`}
// Orientation de la table depuis la place du joueur : la main du joueur est
// toujours en bas, ses adversaires et partenaire tournent dans le même repère.
// Sur l'écran : haut, droite, bas, gauche = ordre horaire.
const TABLE_ORDER=['north','east','south','west'];
function screenSeat(physical,perspective='south'){
 const from=TABLE_ORDER.indexOf(physical),at=TABLE_ORDER.indexOf(perspective);
 if(from<0||at<0)return physical;
 return TABLE_ORDER[(from-at+2+4)%4];
}
function playerSeatFromExercise(x,seats={}){
 // Ne déduire le joueur que d'une indication explicite ou d'une main nommée.
 for(const [pos,hand] of Object.entries(seats)){
   if(/^\s*(?:vous|votre main)\s*[·–—-]\s*(?:nord|sud|est|ouest)\b/i.test(hand?.title||''))return pos;
 }
 const label=String(x?.southLabel||'');
 if(/^\s*(?:vous|votre main)\s*[·–—-]\s*(?:nord|sud|est|ouest)\b/i.test(label))
   return seatFromLabel(label,'south');
 const words=String(x?.prompt||'');
 const explicit=words.match(/\bvous\s+[êe]tes\s+en\s+(nord|sud|est|ouest)\b/i)
   ||(x?.type==='defense'?words.match(/^\s*(nord|sud|est|ouest)\s*[:,]/i):null);
 if(explicit)return {nord:'north',sud:'south',est:'east',ouest:'west'}[explicit[1].toLowerCase()];
 return 'south';
}
function seatMarker(pos,physical,data){
 if(data?.rows?.length)return seatBox(pos,data,physical);
 return `<div class="deal-marker ${pos}" data-seat="${physical}" aria-label="${prettySeat(physical)}"><span>${seatLabel(physical)}</span></div>`;
}
function dealCenter(meta){return `<div class="deal-center">${meta.contract?`<span class="deal-contract">Contrat : ${esc(meta.contract)}</span>`:`<span class="deal-contract empty">Donne</span>`}</div>`}
function dealViewer(seats,meta={}){
 const perspective=TABLE_ORDER.includes(meta.perspective)?meta.perspective:'south';
 const rotated=perspective!=='south';
 const projected={};
 for(const physical of TABLE_ORDER)projected[screenSeat(physical,perspective)]={physical,data:seats[physical]};
 const visible=TABLE_ORDER.filter(pos=>projected[pos]?.data?.rows?.length);
 const onlyNS=visible.length>0&&visible.every(pos=>pos==='north'||pos==='south');
 // L'ancienne disposition « défense adjacente » est conservée pour les
 // tables sans rotation. Une table orientée doit avoir le joueur en bas.
 const defenseSide=!rotated&&meta.defense===true&&visible.length===2&&visible.includes('north')
   ?(['west','east'].find(pos=>visible.includes(pos))||null):null;
 const longSide=rotated||defenseSide?null:['west','east'].find(pos=>projected[pos]?.data?.rows?.reduce(
   (n,row)=>n+cleanRanks(row.ranks).replace(/10/g,'T').replace(/[^ARDVT98765432]/gi,'').length,0)>=10);
 const orientedSide=rotated&&visible.includes('south')&&visible.length===2
   ?(['west','east'].find(pos=>visible.includes(pos))||null):null;
 const leadCard=meta.lead?parsePlayedCard(meta.lead):null;
 const cls=['deal-viewer',visible.length<=1?'single':'',onlyNS?'compact':'',
   defenseSide?'defense-adjacent defense-'+defenseSide:'',
   rotated?'player-oriented':'',
   orientedSide?'player-side-'+orientedSide:'',
   (defenseSide||rotated)&&leadCard?'has-lead':'',
   longSide?'has-lateral-hand':''].filter(Boolean).join(' ');
 const actualLead=TABLE_ORDER.includes(meta.leadSeat)?meta.leadSeat:'west';
 const shown=leadCard?playedCard(leadCard,screenSeat(actualLead,perspective),meta.cardCaption||'Entame',actualLead):'';
 const slot=pos=>seatMarker(pos,projected[pos].physical,
   longSide===pos?null:projected[pos].data);
 return `<div class="deal-viewer-wrap"><div class="deal-viewer-shell"><div class="${cls}" data-perspective="${perspective}">${slot('north')}${slot('west')}${dealCenter(meta)}${slot('east')}${slot('south')}${shown}${longSide?`<div class="deal-lateral-hand">${seatBox(longSide,projected[longSide].data,projected[longSide].physical)}</div>`:''}</div></div></div>`;
}
function buildCardSeats(x){const seats={};if(x.holdings){x.holdings.forEach((h,i)=>{const pos=seatFromLabel(h.label,i===0?'north':'south');seats[pos]={title:h.label,rows:(h.rows||[]).map(r=>({suit:r.suit,ranks:cleanRanks(r.ranks||'')})).filter(r=>r.ranks)}})}else{if(x.north)seats.north={title:x.northLabel||'Mort · Nord',rows:normRows(x.north)};if(x.south){const prompt=(x.prompt||'').toLowerCase();const playerPos=/vous êtes en est/.test(prompt)?'east':/vous êtes en ouest/.test(prompt)?'west':/vous êtes en nord/.test(prompt)?'north':'south';const pos=seatFromLabel(x.southLabel,playerPos);seats[pos]={title:x.southLabel==='Votre main'?`Votre main · ${prettySeat(pos)}`:(x.southLabel||'Votre main'),rows:normRows(x.south)}}}return seats}
function renderCardDiagram(x){const choisir=x.topic==='Entame';const after=choisir&&visibleAnswer(x.id)?.done&&visibleAnswer(x.id)?.ok;const wanted=after?x.options[x.answerIndex]:(x.lead&&x.lead!=='À vous de choisir'&&x.lead!=='—'?x.lead:'');const seat=after?(/vous êtes en est/i.test(x.prompt||'')?'east':'west'):resolveLeadSeat(x);const seats=buildCardSeats(x);return dealViewer(seats,{perspective:playerSeatFromExercise(x,seats),defense:x.type==='defense',title:x.type==='defense'?'Situation de défense':'Situation de jeu',contract:x.contract||'',lead:wanted,leadSeat:seat,cardCaption:after?'Entame attendue':'Entame'})}
function stripMeta(line,key){return (line||'').replace(new RegExp('\\s+'+key+'\\s*:\\s*.*$','i'),'').trim()}
function looksLikeHolding(txt){const t=cleanRanks(txt);if(!t)return false;if(/[♠♥♦♣]/.test(t))return false;if(/\b[NOES]\b/.test(t))return false;return /[ARDVX1098765432]/i.test(t)}
function parseLegacyDeal(x){const raw=(x.questionText||'').replace(/\r/g,'');const contract=((raw.match(/Contrat\s*:\s*([^\n]+)/i)||[])[1]||'').trim();const lead=((raw.match(/Entame\s*:\s*([^\n]+)/i)||[])[1]||'').trim();const lines=raw.split('\n');const blocks=[];for(let i=0;i<=lines.length-4;i++){const a=lines[i].match(/^\s*♠\s*(.*)$/),b=lines[i+1].match(/^\s*♥\s*(.*)$/),c=lines[i+2].match(/^\s*♦\s*(.*)$/),d=lines[i+3].match(/^\s*♣\s*(.*)$/);if(!(a&&b&&c&&d))continue;const rows=[a[1].trim(),stripMeta(b[1],'Contrat'),stripMeta(c[1],'Entame'),d[1].trim()];const score=rows.filter(looksLikeHolding).length;if(score>=2){blocks.push(rows.map((r,idx)=>({suit:'♠♥♦♣'[idx],ranks:cleanRanks(r)})))}}const unique=[];for(const rows of blocks){const sig=rows.map(r=>r.ranks).join('|');if(!unique.some(u=>u.sig===sig))unique.push({sig,rows})}const seats={};if(unique[0])seats.north={title:'Mort · Nord',rows:unique[0].rows.filter(r=>r.ranks)};if(unique.length>1)seats.south={title:'Vous · Sud',rows:unique[unique.length-1].rows.filter(r=>r.ranks)};return {seats,contract,lead}}
function decodeInlineSvg(uri){if(!/^data:image\/svg\+xml;base64,/i.test(uri||''))return'';try{const raw=atob(String(uri).split(',')[1]);const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));return new TextDecoder('utf-8').decode(bytes)}catch(e){return''}}
function parseSvgDeal(x){const svg=decodeInlineSvg(x&&x.image);if(!svg)return {seats:{},contract:'',lead:''};const texts=[];for(const m of svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)){const attrs=m[1]||'';const body=(m[2]||'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').trim();const xm=(attrs.match(/\bx="([^"]+)"/)||[])[1]||'';const ym=(attrs.match(/\by="([^"]+)"/)||[])[1]||'';texts.push({x:parseFloat(xm)||0,y:parseFloat(ym)||0,text:body})}if(!texts.length)return {seats:{},contract:'',lead:''};const header=(texts.find(t=>/entame\s*:/i.test(t.text))||{}).text||'';const hm=header.match(/^(.+?)\s*[—-]\s*Entame\s*:\s*(.+)$/i);const contract=cleanRanks(hm?hm[1]:header.split(/\s*[—-]\s*/)[0]||'');const lead=cleanRanks(hm?hm[2]:'');const seats={};for(const [label,pos,title] of [['N','north','Mort · Nord'],['S','south','Vous · Sud'],['E','east','Vous · Est'],['O','west','Vous · Ouest']]){const anchor=texts.find(t=>t.text===label);if(!anchor)continue;const after=texts.filter(t=>t.y>anchor.y+8&&t.y<anchor.y+120).sort((a,b)=>a.y-b.y||a.x-b.x);const rows=[];for(let i=0;i<after.length-1;i++){if('♠♥♦♣'.includes(after[i].text)){rows.push({suit:after[i].text,ranks:cleanRanks(after[i+1].text)})}}if(rows.length)seats[pos]={title,rows}}return {seats,contract,lead}}
function renderLegacyDiagram(x){
 let d=parseLegacyDeal(x);
 let ok=['north','south','east','west'].some(p=>d.seats[p]?.rows?.length);
 if(!ok){
   const svg=parseSvgDeal(x);
   const svgOk=['north','south','east','west'].some(p=>svg.seats[p]?.rows?.length);
   if(svgOk){d=svg;ok=true}
 }
 // Dans les anciennes captures, le texte récupère parfois le mort mais perd
 // la position d'Est/Ouest. Ne jamais présenter ces mains comme Nord/Sud :
 // conserver le dessin source fidèle plutôt que supposer une orientation.
 if(x.type==='defense'&&!['west','east'].some(p=>d.seats[p]?.rows?.length)&&x.image){
   return `<figure class="game-img-wrap legacy-defense-source"><img class="game-img" src="${x.image}" alt="Diagramme original de défense : ${esc(x.prompt)}"><figcaption>Diagramme d’origine — positions des joueurs conservées</figcaption></figure>`;
 }
 if(!ok)return `<div class="game-img-wrap"><img class="game-img" src="${x.image}" alt="Diagramme de cartes : ${esc(x.prompt)}"></div>`;
 return `${dealViewer(d.seats,{perspective:playerSeatFromExercise(x,d.seats),defense:x.type==='defense',title:x.type==='defense'?'Situation de défense':'Plan de jeu',contract:d.contract||'',lead:d.lead||'',leadSeat:resolveLeadSeat(x)})}<details class="play-source"><summary><span class="source-control-icon" aria-hidden="true">▣</span><span class="source-control-text"><span class="source-control-closed">Afficher le visuel source</span><span class="source-control-open">Masquer le visuel source</span></span><span class="source-control-chevron" aria-hidden="true">⌄</span></summary><div class="game-img-wrap"><img class="game-img" src="${x.image}" alt="Diagramme source : ${esc(x.prompt)}"></div></details>`;
}
// Present the unmodified source wording in readable paragraphs.
// Only whitespace between sentences is normalized; no sentence is rephrased.
function formatPlayAnalysis(source){
  const raw=String(source||'').replace(/\s+/g,' ').trim();
  if(!raw)return '';
  // A dash or 'o' after a sentence end introduces a source sub-step.
  const blocks=raw.split(/(?<=[.!?])\s+(?=(?:-|o)\s+[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸ«])/u);
  let pieces=[];
  for(const block of blocks){
    const ss=(typeof Intl!=='undefined'&&Intl.Segmenter)
      ?Array.from(new Intl.Segmenter('fr',{granularity:'sentence'}).segment(block),o=>o.segment.trim())
      :block.split(/(?<=[.!?])\s+(?=[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸ«])/u);
    pieces.push(...ss.filter(Boolean));
  }
  const groups=[];let group=[],length=0;
  function flush(){if(group.length){groups.push(group.join(' '));group=[];length=0}}
  for(const piece of pieces){
    const newSubpoint=/^(?:-\s|o\s)/.test(piece);
    if(group.length && (newSubpoint || group.length>=3 || length+piece.length>320))flush();
    group.push(piece); length+=piece.length+1;
  }
  flush();
  return groups.map(t=>`<p${/^(?:-\s|o\s)/.test(t)?' class="analysis-subpoint"':''}>${esc(t)}</p>`).join(' ');
}
const DEAL_AUCTIONS={"JC-001":{"kind":"seats","rows":[["1SA","Passe","6SA","Fin"]],"note":""},"JC-002":{"kind":"seats","rows":[["1SA","Passe","3SA","Fin"]],"note":""},"JC-003":{"kind":"seats","rows":[["","","1♦","Passe"],["1♥","Passe","2♥","Passe"],["4♥","Fin","",""]],"note":""},"JC-004":{"kind":"seats","rows":[["","","1♣","Passe"],["1♠","Passe","2♠","Passe"],["4♠","Fin","",""]],"note":""},"JC-005":{"kind":"seats","rows":[["","Passe","Passe","Passe"],["4♥","Fin","",""]],"note":""},"JC-006":{"kind":"seats","rows":[["2SA","Passe","3♥","Passe"],["3♠","Passe","3SA","Fin"]],"note":""},"JC-007":{"kind":"seats","rows":[["","","1♣","Passe"],["1♥","Passe","2SA","Passe"],["6♥","Fin","",""]],"note":""},"JC-008":{"kind":"seats","rows":[["1♣","Passe","1♦","Passe"],["2SA","Passe","3SA","Fin"]],"note":""},"JC-009":{"kind":"seats","rows":[["","","","1♥"],["1SA","Passe","3SA","Fin"]],"note":""},"JC-010":{"kind":"seats","rows":[["1SA","Passe","3SA","Fin"]],"note":""},"JC-011":{"kind":"seats","rows":[["1♠","Passe","3♠","Passe"],["4SA","Passe","5♥*","Passe"],["6♠","Fin","",""]],"note":"* 2 As"},"JC-012":{"kind":"seats","rows":[["","","","1♠"],["3♦","Fin","",""]],"note":""},"JC-013":{"kind":"seats","rows":[["","","1♠","Passe"],["2♥","Passe","3♣","Passe"],["4♣","Passe","5♣","Fin"]],"note":""},"JC-014":{"kind":"seats","rows":[["1SA","Passe","3SA","Fin"]],"note":""},"JC-015":{"kind":"seats","rows":[["1♥","Passe","2♥","Passe"],["4♥","Fin","",""]],"note":""},"JC-016":{"kind":"seats","rows":[["","","1♣","Passe"],["1♥","Passe","2♥","Passe"],["4♥","Fin","",""]],"note":""},"JC-017":{"kind":"seats","rows":[["Passe","Passe","1♦","Passe"],["2♣","Passe","2♥","Passe"],["2SA","Passe","3SA","Fin"]],"note":""},"JC-019":{"kind":"seats","rows":[["1SA","Passe","Passe","Passe"]],"note":""},"JC-020":{"kind":"seats","rows":[["","","1♣","Passe"],["1♥","Passe","1SA","Passe"],["4♥","Fin","",""]],"note":""},"JC-021":{"kind":"seats","rows":[["1SA","Passe","3SA","Fin"]],"note":""},"JC-022":{"kind":"seats","rows":[["1♠","Passe","2♠","Passe"],["4♠","Fin","",""]],"note":""},"JC-023":{"kind":"seats","rows":[["1♣","Passe","1♦","Passe"],["2SA","Passe","3SA","Fin"]],"note":""},"JC-BH-020-Q01":{"kind":"inline","text":"Nord : 1SA → Sud : 3SA","context":"Sans intervention adverse"},"JC-BH-020-Q02":{"kind":"inline","text":"Nord : 1SA → Sud : 3SA","context":"Sans intervention adverse"},"JC-BH-020-Q03":{"kind":"inline","text":"Nord : 1SA → Sud : 3SA","context":"Sans intervention adverse"},"JC-BH-020-Q04":{"kind":"inline","text":"Nord : 1SA → Sud : 3SA","context":"Sans intervention adverse"},"JC-BH-020-Q05":{"kind":"inline","text":"Nord : 1SA → Sud : 3SA","context":"Sans intervention adverse"},"JC-BH-020-Q06":{"kind":"inline","text":"Nord : 1SA → Sud : 3SA","context":"Sans intervention adverse"},"JC-BH-021-Q01":{"kind":"inline","text":"1♣ – 1♥ – 2♥ – 4♥","context":"Positions non précisées dans le QCM"},"JC-BH-021-Q02":{"kind":"inline","text":"1♠ – 3♠ – 4♠","context":"Positions non précisées dans le QCM"},"JC-BH-021-Q03":{"kind":"inline","text":"1♠ – 2♠ – 4♠","context":"Positions non précisées dans le QCM"},"JC-BH-021-Q04":{"kind":"inline","text":"1♥ – 2♣ – 2♥ – 4♥","context":"Positions non précisées dans le QCM"},"JC-BH-021-Q05":{"kind":"inline","text":"1♣ – 1♦ – 1♥ – 1♠ – 2♠ – 4♠","context":"Positions non précisées dans le QCM"},"JC-BH-021-Q06":{"kind":"inline","text":"1♥ – 2♣ – 2♥ – 4♣ – 4♥ – 5♣","context":"Positions non précisées dans le QCM"},"JC-BH-023-Q01":{"kind":"inline","text":"1♣ – 1♥ – 2♥ – 4♥","context":"Positions non précisées dans le QCM"},"JC-BH-023-Q02":{"kind":"inline","text":"1♠ – 3♠ – 4♠","context":"Positions non précisées dans le QCM"},"JC-BH-023-Q03":{"kind":"inline","text":"1♠ – 2♠","context":"Positions non précisées dans le QCM"},"JC-BH-023-Q04":{"kind":"inline","text":"1♠ – 2♠ – 4♠","context":"Positions non précisées dans le QCM"},"JC-BH-023-Q05":{"kind":"inline","text":"1♥ – 2♥ – 4♥","context":"Positions non précisées dans le QCM"},"JC-BH-023-Q06":{"kind":"inline","text":"1♣ – 1♥ – 3♥ – 6♥","context":"Positions non précisées dans le QCM"},"JC-BH-034-Q01":{"kind":"inline","text":"1SA – 3SA, sans intervention adverse","context":"Sud–Nord"},"JC-BH-034-Q02":{"kind":"inline","text":"1SA – 3SA, sans intervention adverse","context":"Sud–Nord"},"JC-BH-034-Q03":{"kind":"inline","text":"1SA – 3SA, sans intervention adverse","context":"Sud–Nord"},"JC-BH-034-Q04":{"kind":"inline","text":"1SA – 3SA, sans intervention adverse","context":"Sud–Nord"},"JC-BH-034-Q05":{"kind":"inline","text":"1SA – 2♣ – 2♥ – 3SA, sans intervention adverse","context":"Sud–Nord"},"JC-BH-034-Q06":{"kind":"inline","text":"1SA – 2♥ – 2♠ – 3SA, sans intervention adverse","context":"Sud–Nord"}};

function cardAuction(x){
 const a=DEAL_AUCTIONS[x.id];if(!a)return '';
 if(a.kind==='inline')return `<section class="auction-box" aria-label="Séquence d’enchères"><div class="auction-title">Séquence d’enchères</div><div class="auction-flow">${esc(a.text)}</div>${a.context?`<div class="auction-context">${esc(a.context)}</div>`:''}</section>`;
 const heads=['Sud','Ouest','Nord','Est'];
 const table=`<table class="auction-table"><thead><tr>${heads.map((h,i)=>`<th scope="col" class="${i===0||i===2?'auction-ns':'auction-ew'}">${h}</th>`).join('')}</tr></thead><tbody>${a.rows.map(row=>`<tr>${row.map(v=>`<td class="${v==='Fin'?'auction-end':v===''?'auction-empty':''}">${v?esc(v):'·'}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 return `<section class="auction-box" aria-label="Séquence d’enchères"><div class="auction-title">Séquence d’enchères</div>${table}${a.note?`<div class="auction-context">${esc(a.note)}</div>`:''}</section>`
}
const SOURCE_PLAY_ORIGINAL={"JC-001":{"post":["Bien que le contrat de 6 Carreaux eût été sur table en coupant un Cœur en Sud, vos chances de gagner le petit chelem à Sans-Atout sont bien réelles. Comment devez-vous manœuvrer pour vous donner les meilleures chances ?"]},"JC-002":{"post":["Il vous manque une levée, quelle couleur attaquez-vous ?"]},"JC-003":{"post":["Après avoir réalisé la première levée de l’As de Pique, comment poursuivez-vous ?"]},"JC-004":{"post":["Les adversaires encaissent trois levées de Cœur puis rejouent Trèfle.","Quelle hypothèse devez-vous formuler pour espérer gagner ce contrat ?"]},"JC-005":{"post":["Vous coupez le deuxième tour de Pique et jouez l’As de Cœur, Ouest fournissant le 10 et Est le 5. Comment essayez-vous de gagner ?"]},"JC-006":{"pre":["Vous êtes assis en Sud, en tant que déclarant. Sur l’entame du Roi de Cœur, quel est votre plan de jeu pour réaliser votre contrat ?"]},"JC-007":{"pre":["Comment envisagez-vous de gagner votre contrat ?"]},"JC-008":{"post":["Vous avez huit levées de tête et miserez probablement sur les Carreaux pour la neuvième. Demandez-vous quand même quel est le partage le plus probable du résidu de cette couleur. Ça pourrait vous aider."]},"JC-009":{"post":["Les adversaires vous laissent réaliser la première levée du Roi de Cœur. Comment envisagez-vous la suite ?"]},"JC-010":{"post":["Ouest entame de l’As de Trèfle. Quelle carte fournissez-vous et pourquoi ?","Rappel : sur l’entame de l’As, à Sans-Atout, le partenaire réagit en fonction de son intérêt pour la continuation de la couleur, une grosse carte (inutile) est donc un appel."]},"JC-011":{"post":["Est s’empare de l’entame avec son As de Carreau et rejoue Trèfle, que vous prenez. Quelle carte jouez-vous à la troisième levée ?"]},"JC-012":{"post":["Rappel : Le barrage de Sud montre sept beaux Carreaux dans une main inférieure à 10H, les limites pouvant descendre très bas non vulnérable contre vulnérable.","Vous prenez le Valet du mort de la Dame, Sud fournissant le 6. Quelle carte rejouez-vous ?"]},"JC-013":{"post":["À la suite d’une séquence d’enchères peu orthodoxe, vous avez quand même atteint le bon contrat de 5 Trèfles. Quelle carte du mort jouez-vous à la première levée ?","Indice : comptez vos levées puis essayez de dédoubler vos atouts…"]},"JC-014":{"post":["Vous jouez le contrat de 3 Sans-Atout en Sud sur l’entame de la Dame de Cœur. Quelle couleur jouez-vous à la 2e levée ?"]},"JC-015":{"post":["Vous prenez l’entame de l’As et devez maintenant tenter une impasse. Laquelle choisissez-vous ?"]},"JC-016":{"post":["Vous jouez le contrat de 4 Cœurs en Sud sur l’entame du Roi de Carreau. Quelle carte le déclarant doit-il jouer après l’As de Carreau ?"]},"JC-017":{"post":["Après une séquence d’enchères pour érudits, vous atteignez le contrat de 3 Sans-Atout. Quel est votre plan de jeu sur l’entame de la quatrième meilleure d’Ouest à Pique ?"]},"JC-018":{"post":["Ouest entame du 4 de Trèfle contre votre manche à Sans-Atout. Essayez de mettre le plus de chances de votre côté pour tenter de gagner ce contrat. Une remarque quand même : vous ne pourrez pas rendre deux fois la main à la défense sous peine de concéder au moins trois levées de Trèfle dans la foulée…"]},"JC-019":{"post":["Ouest entame de la Dame de Cœur pour le 10 d’Est et votre Roi. Quelle couleur offre les meilleures chances de procurer le pli manquant ?"]},"JC-020":{"post":["L’entame Carreau vous permet de prendre la main. Mais dès que vous la rendrez, vous serez sous la menace de concéder trois Trèfles. Alors que faire ?"]},"JC-021":{"pre":["Vous êtes assis en Sud, en tant que déclarant. Sur l’entame de la Dame de Pique, quel est votre plan de jeu pour maximiser vos chances de réussir votre contrat ?"]},"JC-022":{"post":["Quel est votre plan de jeu ?"]},"JC-023":{"post":["Quel est votre plan de jeu pour réaliser neuf levées ?"]}};
function sourcePlayParagraphs(x,pos){const p=SOURCE_PLAY_ORIGINAL[x.id];if(!p||!p[pos])return '';return `<div class="play-original-statement">${p[pos].map(t=>`<p>${esc(t)}</p>`).join('')}</div>`}
function quizP(x){const p=visibleAnswer(id);return `<div class="qpjb-quiz-nav"><button class="back" onclick="go('list')">← Jeu de la carte</button><span class="badge">Exercice ${seqNum(x)}</span></div><div class="panel" style="margin-top:13px"><h2>${x.type==='defense'?'À vous de défendre':'À vous de jouer'}</h2>${SOURCE_PLAY_ORIGINAL[x.id]?sourcePlayParagraphs(x,'pre'):`<p>${esc(x.prompt)}</p>`}${cardAuction(x)}${renderLegacyDiagram(x)}${sourcePlayParagraphs(x,'post')}<div style="margin-top:14px"><button class="btn primary" onclick="revealPlay()">${playSeen||p?.done?'Revoir l’analyse':'Découvrir l’analyse'} →</button></div>${playSeen||p?.done?`<div class="feedback"><h3>${x.type==='defense'?'Analyse de la défense':'Analyse du plan de jeu'}</h3><div class="game-solution analysis-body">${formatPlayAnalysis(x.answerText)}</div>${x.keyPoint?`<div class="learning-point"><strong>À retenir</strong><p>${esc(x.keyPoint)}</p></div>`:``}<p class="muted" style="margin-top:15px">Est-ce que votre raisonnement allait dans le bon sens ?</p>${p?.done?`<p class="completion-notice" role="status">${p.ok?"✓ Exercice terminé — réussi":"✓ Exercice terminé — à revoir"}</p>`:`<div class="gamecheck"><button class="btn" onclick="assess(true)">✓ J’avais bon</button><button class="btn" onclick="assess(false)">↻ À revoir</button></div>`}</div>`:''}</div>${nav()}`}
function cardAnswerMarkup(x,guided=false){
 if(guided)return sourceCorrection(x);
 const p=visibleAnswer(id);
 if(!p?.done)return '';
 return `<div class="feedback qcm-feedback" id="feedback" role="status" aria-live="polite"><h3 class="${p.ok?'feedok':'feedno'}">${p.ok?'✓ Bonne réponse !':'✕ Mauvaise réponse !'}</h3><p>${p.ok?esc(x.explanation):(playHint(x,p.pick)?esc(playHint(x,p.pick)):'Réessayez une autre proposition.')}</p>${p.ok?postPlayAlternatives(x):''}</div>`;
}
function cardAnswerArea(x,guided=false){
 const p=visibleAnswer(id),show=guided?(playSeen||!!p?.done):!!p?.done;
 return `<div class="qpjb-answer-area qpjb-card-answer-area${show?' is-open':''}"${show?'':' aria-hidden="true" inert'}><div class="qpjb-answer-content">${show?cardAnswerMarkup(x,guided):''}</div></div>`;
}
function updateCardAnswer(x,guided=false){
 const quiz=document.querySelector('.cq-stage');
 const group=quiz?.querySelector('.cq-options');
 const area=quiz?.querySelector('.qpjb-card-answer-area');
 if(!group||!area||!Array.isArray(x?.options))return false;
 const p=visibleAnswer(id),selected=guided?chosen:(p?.done?p.pick:chosen);
 for(const button of group.querySelectorAll('.cq-option[data-answer-index]')){
  const active=Number(button.dataset.answerIndex)===selected;
  button.classList.toggle('selected',active);
  button.classList.toggle('correct',!guided&&!!p?.done&&active&&!!p.ok);
  button.classList.toggle('wrong',!guided&&!!p?.done&&active&&!p.ok);
  button.setAttribute('aria-pressed',String(active));
 }
 const open=guided?(playSeen||!!p?.done):!!p?.done;
 if(!open){
  area.dataset.openRequested='no';
  area.classList.remove('is-open');
  area.setAttribute('aria-hidden','true');
  area.inert=true;
  return true;
 }
 area.dataset.openRequested='yes';
 const content=area.querySelector('.qpjb-answer-content');
 content.innerHTML=cardAnswerMarkup(x,guided);
 colorAllSuits(content);
 area.removeAttribute('aria-hidden');
 area.inert=false;
 if(!area.classList.contains('is-open')){
  requestAnimationFrame(()=>{
   if(area.isConnected&&area.dataset.openRequested==='yes')area.classList.add('is-open');
  });
 }
 return true;
}
function uncheckCardAnswer(x,guided=false){
 // Le premier choix de la visite reste enregistré après désélection.
 redoAttempt=null;chosen=null;revealed=false;playSeen=false;
 if(!updateCardAnswer(x,guided))render();
 const status=document.getElementById('source-answer-status');
 if(status)status.textContent='';
 const live=document.getElementById('qpjb-answer-announcement');
 if(live)live.textContent='';
}
function pickCard(index){
 const x=current();if(!x||!Number.isInteger(index)||index<0||index>=x.options.length)return;
 if(visibleAnswer(id)?.done&&visibleAnswer(id).pick===index){uncheckCardAnswer(x);return}
 chosen=index;const ok=index===x.answerIndex;
 recordAnswer(id,index,ok);
 if(!updateCardAnswer(x))render();
 restoreChoiceFocus('play',index,ok);
}
function playHint(x,index){
 const m=x?.playPretryHints||{};
 const note=m[String(index)];
 return (typeof note==='string'&&note.trim())?note:'';
}
function postPlayAlternatives(x){
 if(!x?.options||!x.playPretryHints)return '';
 const entries=x.options.map((opt,i)=>({opt,i,note:playHint(x,i)})).filter(e=>e.i!==x.answerIndex&&e.note);
 if(!entries.length)return '';
 return `<div class="postsolution-notes"><button type="button" class="postsolution-trigger" aria-expanded="false" onclick="togglePostsolution(this)">Pourquoi les autres propositions ne conviennent pas</button><div class="postsolution-body"><div class="postsolution-body-inner"><div class="postsolution-grid">${entries.map(e=>`<div class="postsolution-item"><strong>${esc(e.opt)}</strong><p>${esc(e.note)}</p></div>`).join('')}</div></div></div></div>`;
}
function quizCard(x){if(sourceGuided(x))return quizCardSource(x);const p=visibleAnswer(id),picked=p?.done?p.pick:chosen;return `<div class="qpjb-quiz-nav"><button class="back" onclick="go('list')">← Jeu de la carte</button><span class="badge">Exercice ${seqNum(x)}</span></div><div class="panel cq-stage"><h2>À vous de jouer</h2><div class="cq-head">${x.contract?`<span class="pill">Contrat : ${esc(x.contract)}</span>`:''}${x.lead&&x.lead!=='À vous de choisir'?`<span class="pill">Entame : ${esc(x.lead)}</span>`:''}</div><p class="q">${esc(x.prompt)}</p>${cardAuction(x)}${renderCardDiagram(x)}<p class="muted">Cliquez sur une réponse pour vérifier. Vous pouvez ensuite changer de choix.</p><div class="cq-options">${x.options.map((o,i)=>`<button data-answer-index="${i}" class="cq-option ${picked===i?'selected':''} ${p?.done&&i===p.pick?(p.ok?'correct':'wrong'):''}" onclick="pickCard(${i})" aria-pressed="${picked===i}">${esc(o)}</button>`).join('')}</div>${cardAnswerArea(x)}</div>${nav()}`}
function nav(){
 const scope=rel(),deck=sessionIds.length?sessionIds.map(k=>scope.find(x=>x.id===k)).filter(Boolean):scope,pos=deck.findIndex(x=>x.id===id);
 return `<div class="footnav"><button class="btn" onclick="${pos>0?`item('${deck[pos-1].id}')`:`go('list')`}">← ${pos>0?'Précédent':'Liste'}</button><button class="btn primary" onclick="${pos+1<deck.length?`item('${deck[pos+1].id}')`:`go('list')`}">${pos+1<deck.length?'Suivant →':'Retour à la liste'}</button></div>`;
}
function colorAllSuits(root){if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const list=[];let node;while((node=walker.nextNode())){if(!/[♠♥♦♣]/.test(node.nodeValue||''))continue;const el=node.parentElement;if(!el||el.closest('script,style,select,option,textarea,.sym,.symbol-suit,.deal-suit,.deal-playing-card'))continue;list.push(node)}for(const n of list){const frag=document.createDocumentFragment();// Inclure FE0F/FE0E : Safari peut autrement afficher un glyphe emoji monochrome/blanc.
const parts=n.nodeValue.split(/([♠♥♦♣])[\uFE0E\uFE0F]?/g);for(const piece of parts){if(/^[♠♥♦♣]$/.test(piece)){const span=document.createElement('span');span.className='symbol-suit '+(/[♥♦]/.test(piece)?'suit-red':'suit-black');span.textContent=piece+'\uFE0E';frag.appendChild(span)}else if(piece){frag.appendChild(document.createTextNode(piece))}}n.parentNode.replaceChild(frag,n)}}
function render(){document.documentElement.classList.toggle('qpjb-quiz-active',view==='quiz');const root=document.getElementById('root');root.innerHTML=view==='home'?pageHome():view==='topics'?pageTopics():view==='playtopics'?pagePlayTopics():view==='list'||view==='plays'?pageList():view==='quiz'?(cat==='play'?(current().exerciseFormat==='carte_qcm'?quizCard(current()):quizP(current())):quizB(current())):pageHome();if(storageWarning)root.insertAdjacentHTML('afterbegin',storageNotice());colorAllSuits(root);if(embeddedMode)window.parent.postMessage({type:'qpjb-training-view',quiz:view==='quiz'},location.origin)}
// Un autre onglet du même navigateur vient de sauver des réponses.
// L'événement contient aussi les changements perdus lors d'une écriture
// concurrente : les fusionner et réécrire uniquement si nécessaire.
function refreshSharedProgress(){
 if(view==='list'||view==='plays'){
   redrawList();
   const progressLabel=document.querySelector('.list-progress');
   if(progressLabel){const all=rel();progressLabel.textContent=validatedCount(all)+'/'+all.length+' validés'}
 }else if(view==='topics'||view==='playtopics'||view==='home'){
   const activeTiles=[...document.querySelectorAll('.topic-group .tile,.home-tile')];
   const focusIndex=activeTiles.indexOf(document.activeElement),scroll=window.scrollY;
   render();
   if(focusIndex>=0)document.querySelectorAll('.topic-group .tile,.home-tile')[focusIndex]?.focus({preventScroll:true});
   window.scrollTo(0,scroll);
 }
 // Ne pas détruire un QCM pendant la réponse : la progression est déjà à jour.
}
window.addEventListener('storage',event=>{
 if(event.key!==KEY||event.newValue===null)return;
 try{
   const remote=cleanProgress(JSON.parse(event.newValue));
   const merged=mergeProgress(saved,remote);
   const changed=JSON.stringify(merged)!==JSON.stringify(saved);
   saved=merged;
   if(JSON.stringify(merged)!==JSON.stringify(remote))update();
   if(changed)refreshSharedProgress();
 }catch(e){/* Conserver la copie en mémoire si un autre onglet écrit un JSON invalide. */}
});
window.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&view==='quiz')go('list');
 else if(e.key==='Escape'&&integratedMode&&(view==='topics'||view==='playtopics'))quitTraining();
});
if(embeddedMode){
 window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==window.parent)return;
  if(event.data?.type==='qpjb-training-nav-apply'){
   const pending=trainingPendingNav;
   if(!pending||pending.seq!==event.data.seq)return;
   trainingPendingNav=null;
   try{pending.action()}
   finally{window.parent.postMessage({type:'qpjb-training-nav-done',seq:event.data.seq},location.origin)}
   // Conserver le dernier clic exprimé pendant la transition.
   const queued=trainingQueuedNav;trainingQueuedNav=null;
   if(queued)trainingNavigate(queued);
   return;
  }
  if(event.data?.type==='qpjb-training-route-restore'){
   const r=event.data.route;
   const valid=['topics','playtopics','list','plays','quiz','home'];
   if(!r||!valid.includes(r.view))return;
   try{
     trainingPendingNav=null;trainingQueuedNav=null;
     cat=String(r.cat||'');id=String(r.id||'');
     status=String(r.status||'all');ptopic=String(r.ptopic||'all');
     sessionIds=Array.isArray(r.sessionIds)?r.sessionIds.filter(v=>typeof v==='string'):[];
     trainingApplyPage(r.view,r.view==='list'||r.view==='plays',false);
   }finally{
     window.parent.postMessage({type:'qpjb-training-nav-done',seq:event.data.seq},location.origin);
   }
   return;
  }
  if(event.data?.type!=='qpjb-training-select')return;
  if(event.data.mode==='bidding'||event.data.mode==='play'){
   const target=event.data.mode==='bidding'?'topics':'playtopics';
   if(view===target&&(event.data.mode==='play'?cat==='play':cat!=='play')){
    window.parent.postMessage({type:'qpjb-training-view',quiz:false},location.origin);
   }else typ(event.data.mode,true);
  }
 });
}
render();
// Ne révéler l'iframe qu'une fois les polices prêtes : pas de saut de typographie après 600 ms.
if(embeddedMode)document.fonts.ready.then(()=>{
 window.parent.postMessage({type:'qpjb-training-ready'},location.origin);
});