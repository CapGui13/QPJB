/* QPJB AZ — navigateur autonome : vrai moteur V2-F + extension AY.
   Un seul espace de sauvegarde, distinct de V1, du Quiz et de V2-F. */
(function(){
'use strict';
const DATA=JSON.parse(document.getElementById('ay-payload').textContent);
const F=window.AYEngine;
const STORAGE='qpjb-preview-v2-az-01';
const MODELS={seven:7,eight:8};
const MAX_SESSIONS=65;
const byId=new Map(DATA.catalog.map(x=>[x.id,x]));
const addons=new Map(DATA.addons.map(x=>[x.id,x]));
const schedule=new Map(DATA.addons.map(x=>[x.introSession,x]));
const annotations=F.loadAnnotations();
const $=id=>document.getElementById(id);
const esc=s=>String(s===undefined||s===null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>String(s||'').replace(/\s+/g,'').replace(/\uFE0F/g,'').toUpperCase();
let record=null;
let storageWarning='';
let selectedAnswer=null;
function blank(mode='seven'){
 const state=F.newState(13);
 return {schema:1,model:mode,engineState:state,current:null,
  completed:[],addonAnswers:[],nextSession:1,finished:false};
}
function safeStore(){
 try{localStorage.setItem(STORAGE,JSON.stringify(record));storageWarning='';return true}
 catch(_){storageWarning='Le stockage local est inaccessible : la progression risque de disparaître à la fermeture.';return false}
}
function restore(){
 try{
  const raw=localStorage.getItem(STORAGE);
  if(!raw)return null;
  if(raw.length>1500000)throw Error('Taille de sauvegarde anormale');
  const v=JSON.parse(raw);
  if(!v||v.schema!==1||!MODELS[v.model]||
     !Number.isInteger(v.nextSession)||v.nextSession<1||v.nextSession>66||
     !Array.isArray(v.completed)||!Array.isArray(v.addonAnswers)||
     !v.engineState||typeof v.engineState!=='object')throw Error('Structure de sauvegarde invalide');
  if(v.current){
    if(!Number.isInteger(v.current.position)||!Array.isArray(v.current.items)||
       !Array.isArray(v.current.answers)||v.current.items.length!==10||
       v.current.answers.length!==10||v.current.position<0||v.current.position>10)
      throw Error('Session en cours invalide');
    for(const item of v.current.items){
      if(item.origin==='SEF'&&!byId.has(item.id))throw Error('Question manquante');
      if(item.origin!=='SEF'&&!addons.has(item.id))throw Error('Complément manquant');
    }
  }
  return v;
 }catch(e){
  storageWarning='Une sauvegarde AZ existe mais semble incompatible. Elle reste intacte ; le parcours n’y touche pas.';
  return null;
 }
}
function activeAddon(session){
 const a=schedule.get(session);
 return a&&(record.model==='eight'||!a.conditional)?a:null;
}
function currentQuestion(){
 const x=record.current;
 return x?.items[x.position];
}
function startSession(){
 if(record.finished||record.current)return;
 const number=record.nextSession;
 if(number>MAX_SESSIONS){record.finished=true;safeStore();render();return}
 const extra=activeAddon(number);
 const core=F.select(DATA.catalog,record.engineState,annotations,extra?9:10);
 if(core.length!==(extra?9:10))throw Error('Séance incomplète');
 const items=core.map(q=>({origin:'SEF',id:q.id}));
 if(extra)items.splice(4,0,{origin:'ADDON',id:extra.id});
 if(items.length!==10||new Set(items.map(item=>item.origin==='SEF'?
 F.family(byId.get(item.id)):addons.get(item.id).family)).size!==10)
 throw Error('Familles répétées');
 record.current={number,items,position:0,answers:Array(10).fill(null),revealed:false};
 safeStore();
 render();
}
function questionSource(item){
 if(item.origin==='SEF'){
  const q=byId.get(item.id);
  return {...q,kind:'qcm',origin:'SEF',sourceRef:'Quiz SEF · 1 523 QCM'};
 }
 const q=addons.get(item.id);
 return {...q,origin:'ADDON'};
}
function answerCurrent(value){
 const s=record.current,q=questionSource(s.items[s.position]);
 if(s.revealed)return;
 if(!q.choices.includes(value)&&q.kind!=='free')return;
 if(q.kind==='free'&&!String(value).trim())return;
 const correct=normalize(value)===normalize(q.answer);
 s.answers[s.position]={value,correct,sidecar:q.origin==='ADDON'};
 s.revealed=true;safeStore();render();
}
function finishSession(){
 const cur=record.current;
 if(cur.answers.some(v=>!v))throw Error('Dix réponses nécessaires');
 const core=cur.items.filter(item=>item.origin==='SEF').map(item=>byId.get(item.id));
 const answers=cur.items.filter(item=>item.origin==='SEF')
   .map(item=>cur.answers[cur.items.indexOf(item)].correct);
 // Les seules réponses qui alimentent l'algorithme d'espacement sont les 9/10 QCM SEF.
 F.recordSession(record.engineState,core,answers,annotations);
 const addon=cur.items.find(i=>i.origin==='ADDON');
 if(addon){
   const pos=cur.items.indexOf(addon);
   record.addonAnswers.push({session:cur.number,id:addon.id,
     answer:cur.answers[pos].value,matchedSource:cur.answers[pos].correct,
     noMasteryCredit:true});
 }
 record.completed.push({number:cur.number,
   correct:cur.answers.filter(x=>x.correct).length,questions:10,
   supplement:addon?.id||null});
 record.nextSession=cur.number+1;
 record.current=null;
 record.finished=record.nextSession>MAX_SESSIONS;
 safeStore();render();
}
function next(){
 const s=record.current;
 if(!s||!s.revealed)return;
 if(s.position===9){finishSession();return}
 s.position++;s.revealed=false;safeStore();render();
}
function panel(content){$('view').innerHTML=content;$('warning').textContent=storageWarning}
function header(){
 return '<div class="topline"><span class="pill">Version AZ · privée et expérimentale</span>'+
 '<span class="pill">7 ajouts'+(record&&record.model==='eight'?' + cas 2SA conditionnel':'')+'</span></div>';
}
function welcome(){
 const c=record?.completed.length||0;
 const txt=record?.finished?'Parcours terminé (65 séances).':
   record?.current?'Séance '+record.current.number+' en cours, question '+(record.current.position+1)+'/10':
   'Prochaine séance : '+(record?.nextSession||1)+'/65';
 const readonly=!record?'': '<div class="hint">'+esc(txt)+' · '+c+' séance(s) terminée(s)</div>';
 panel('<section class="pane">'+header()+
 '<h2>Parcours guidé adaptatif — test AZ</h2>'+
 '<p>Les réponses aux questions du Quiz SEF influencent les prochaines séances. Les exercices ajoutés sont affichés et corrigés à part, sans devenir des preuves de maîtrise.</p>'+
 readonly+
 (record
 ?'<button id="start" class="primary">'+(record.current?'Reprendre la séance':record.finished?'Voir le bilan':'Commencer la séance')+'</button>'
 :'<label class="field" for="model">Choix du test</label><select id="model"><option value="seven">AY-7 : sans 2SA conditionnel</option><option value="eight">AY-8 : avec 2SA conditionnel</option></select><button id="start" class="primary">Démarrer un nouveau parcours</button>')+
 '<p class="muted">Sauvegarde locale indépendante, aucune connexion au site et aucune synchronisation avec V1/V2-F.</p>'+
 (record?'<button id="erase" class="danger">Réinitialiser uniquement ce prototype AZ</button>':'')+
 '</section>');
 $('start').onclick=()=>{
  if(!record)record=blank($('model').value);
  if(record.current||record.finished){render();return}
  startSession();
 };
 if(record)$('erase').onclick=()=>{
   if(!window.confirm('Effacer uniquement la progression AZ sur cet appareil ?'))return;
   try{localStorage.removeItem(STORAGE)}catch(_){}
   record=null;selectedAnswer=null;render();
 };
}
function player(){
 const s=record.current,q=questionSource(s.items[s.position]);
 const current=s.answers[s.position],cls=q.origin==='ADDON'?'addon':'';
 const label=q.origin==='SEF'?'Question du Quiz SEF':'Complément authentique · validation éditoriale en attente';
 const shape=q.hand.map(x=>Array.isArray(x)?x.length:String(x).trim().split(/\s+/).filter(Boolean).length);
 const hand=q.hand.map((cards,i)=>'<div class="symbol '+([1,2].includes(i)?'red':'')+'">'+['♠','♥','♦','♣'][i]+'</div><div>'+
 esc(Array.isArray(cards)?cards.join(' '):String(cards))+'</div>').join('');
 const auction=(q.auction||[]).map(line=>Array.isArray(line)?
   line.map(x=>x||'—').join(' / '):String(line)).join('\n');
 const choices=q.kind==='free'
 ?'<label class="field" for="free">Ton enchère (réponse libre, comme le sujet BH-035)</label>'+
 '<input id="free" autocomplete="off" placeholder="Ex. 1♥" value="'+esc(current?.value||'')+'" '+(s.revealed?'disabled':'')+'>'
 :'<div class="choices">'+q.choices.map((c,i)=>
   '<label class="choice"><input type="radio" name="bid" value="'+i+'" '+
   (current?.value===c?'checked ':'')+(s.revealed?'disabled':'')+'><span>'+esc(c)+'</span></label>').join('')+'</div>';
 let feedback='';
 if(s.revealed)feedback='<div class="feedback"><strong>'+
 (current?.correct?'Correspondance avec le corrigé d’origine':'Réponse différente du corrigé d’origine')+
 '</strong><p>Réponse publiée : <b>'+esc(q.answer)+'</b></p><p>'+esc(q.explain||'')+'</p>'+
 (q.note?'<p><b>Réserve pédagogique :</b> '+esc(q.note)+'</p>':'')+
 (q.origin==='ADDON'?'<p>Ce résultat ne modifie pas les acquis dans le moteur V2-F.</p>':'')+'</div>';
 panel('<section class="pane '+cls+'">'+header()+
 '<div class="topline"><span class="pill">Séance '+s.number+'/65</span><span class="pill">Question '+(s.position+1)+'/10</span></div>'+
 '<div class="track"><div style="width:'+((s.position+1)*10)+'%"></div></div>'+
 '<div class="hint">'+esc(label)+' · '+esc(q.id)+'</div>'+
 '<h2>Quelle enchère choisis-tu ?</h2><p>'+esc(q.context||'')+'</p>'+
 '<div class="handAndAuction"><div class="hand">'+hand+'</div>'+
 '<div><b>Enchères</b><div class="auction">'+esc(auction||'Aucune enchère précédente')+'</div>'+
 '<div class="hint">Distribution : '+shape.join('-')+'</div></div></div>'+
 choices+feedback+
 (s.revealed?'<button id="next" class="primary">'+(s.position===9?'Terminer la séance':'Question suivante')+'</button>':
 '<button id="answer" class="primary">Valider ma réponse</button>')+
 '<button id="home">Accueil AZ</button></section>');
 $('home').onclick=()=>{const v=record.current;record.current=null; // retain current in memory while showing home
 record.current=v;showHome=true;render()};
 if(s.revealed)$('next').onclick=next;
 else $('answer').onclick=()=>{
   const selected=q.kind==='free'?$('free').value:
     document.querySelector('input[name="bid"]:checked')?.value;
   if(selected===undefined||selected===''){alert('Choisis une enchère pour continuer.');return}
   answerCurrent(q.kind==='free'?selected:q.choices[Number(selected)]);
 };
}
let showHome=false;
function summary(){
 const done=record.completed,latest=done[done.length-1];
 panel('<section class="pane">'+header()+'<h2>'+
 (record.finished?'Parcours de 65 séances terminé':'Bilan de la séance '+latest.number)+'</h2>'+
 '<p>'+latest.correct+' réponses correspondant aux corrigés d’origine sur 10.</p>'+
 (latest.supplement?'<p>Complément authentique inclus : '+esc(latest.supplement)+
 '. Il n’a pas été crédité comme preuve de maîtrise.</p>':'')+
 '<p class="muted">Ces résultats sont locaux et ne constituent ni un classement ni une certification pédagogique.</p>'+
 (record.finished?'':'<button id="nextSession" class="primary">Séance '+record.nextSession+'</button>')+
 '<button id="home">Accueil AZ</button></section>');
 if(!record.finished)$('nextSession').onclick=startSession;
 $('home').onclick=()=>{showHome=true;render()};
}
function render(){
 $('warning').textContent=storageWarning;
 if(showHome||!record){showHome=false;welcome();return}
 if(record.current){player();return}
 if(record.completed.length)summary();else welcome();
}
record=restore();render();
})();