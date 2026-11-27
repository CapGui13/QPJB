/* #506 — T alone: browser bootstrap, original CommonJS engine unchanged except atomic selection hook. */
if(typeof window!=='undefined'){
(function(){
const baseModule={exports:{}};
(function(module,exports,window){
/* QPJB #423 — sélection uniquement ; aucune mutation ni ordre. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.QPJBCoherenceM4=api;
})(typeof window==='undefined'?null:window,function(){
  'use strict';
  const schema='QPJB_COHERENCE_M4_V1';
  const CORE=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
  const natural=new Set(['ouv.majeure','mineur.base','mineur.soutien','majeur.base','majeur.soutien','red.base','red.bicolore','second.base','intervenir.base','apres_inter.base','reponse_inter.base','reveil.base','apres_fit.base','barrage.ouverture','barrage.reponse']);
  const norm=x=>String(x??'').replace(/[\uFE0E\uFE0F]/g,'').trim().replace(/\s+/g,' ');
  const family=q=>String(q?.caseFamily||q?.id||'');
  function features(q,m){
    if(!q||!m?.concept||!Array.isArray(q.auction)||!Array.isArray(q.shape)||q.shape.length!==4||!q.shape.every(Number.isInteger)||!Number.isInteger(q.h))return null;
    const c=m.concept,a=norm(q.answer),shape=q.shape;
    if(!a)return null;
    const sequence=q.auction.map(norm).concat(a).join('|');
    const variants=[{seq:sequence,shape:shape.slice()}];
    // Miroirs structurels seulement. Jamais normaliser une enchère codée.
    if(natural.has(c))for(let mask=1;mask<4;mask++){
      const sh=shape.slice();
      if(mask&1)[sh[0],sh[1]]=[sh[1],sh[0]];
      if(mask&2)[sh[2],sh[3]]=[sh[3],sh[2]];
      variants.push({seq:sequence.replace(/[♥♠♣♦]/g,k=>({'♥':mask&1?'♠':'♥','♠':mask&1?'♥':'♠','♣':mask&2?'♦':'♣','♦':mask&2?'♣':'♦'})[k]),shape:sh});
    }
    variants.sort((x,y)=>x.seq<y.seq?-1:x.seq>y.seq?1:x.shape.join(',').localeCompare(y.shape.join(',')));
    let decision=c+'|'+variants[0].seq,distribution=variants[0].shape.join('-'),force=String(q.h);
    if(c==='ouv.passe'){
      // Ne pas confondre main franchement faible et frontière 11 H.
      force=q.h<=5?'0–5':q.h<=8?'6–8':q.h<=10?'9–10':'11+';
      distribution=shape.slice().sort((x,y)=>y-x).join('-');
    }else if(c==='ouv.mineure'){
      // L'égalité 3–3 / 4–4 et le choix de la plus longue sont des contrastes, pas des miroirs.
      decision=c+'|'+a+'|'+(shape[2]===shape[3]?'egalite-'+shape[2]:'longueur');
    }else if(c==='ouv.sa1'||c==='ouv.sa2'||c==='sa1.seuil'||c==='sa2.seuil'){
      distribution=shape.slice().sort((x,y)=>y-x).join('-');
    }
    return {decision,force,distribution,near:decision+'|'+force+'|'+distribution,criterion:decision+'|'+force};
  }
  const clean=a=>a?.result==='correct'&&!a.assisted&&!a.hadFreeError;
  function rank(ctx={}){
    if(!ctx||!Number.isInteger(ctx.session)||ctx.session<1||!Array.isArray(ctx.candidates)||!ctx.metadataById||ctx.history?.active)return [];
    const {session,metadataById:meta,category}=ctx;
    if(ctx.forcedReason==='rappel_erreur_aide')return [];
    const selected=(ctx.selected||[]).map(x=>x?.exercise||x).filter(Boolean);
    const chosen=selected.map(q=>({q,f:features(q,meta[q.id])})).filter(x=>x.f);
    const lookup=new Map((ctx.exercises||[]).map(q=>[q.id,q]));
    for(const q of ctx.candidates)if(q?.id)lookup.set(q.id,q);
    const recent=[],last=new Map();
    for(const e of ctx.history?.journal||[]){
      if(e.mode!=='parcours'||!Number.isInteger(e.session)||e.session>=session)continue;
      for(const a of e.answers||[]){
        const q=lookup.get(a.id),m=q&&meta[q.id];if(!m)continue;
        last.set(m.concept,Math.max(last.get(m.concept)||0,e.session));
        if(session-e.session<=2&&clean(a)){
          const f=features(q,m);if(f)recent.push({q,f,age:session-e.session});
        }
      }
    }
    // Une entrée ancienne atteste au plus une exposition datée, pas une réussite.
    for(const [id,r] of Object.entries(ctx.history?.entries||{})){
      const m=meta[id],s=r?.assessment?.lastSession;
      if(m&&Number.isInteger(s)&&s>=0&&s+1<session)last.set(m.concept,Math.max(last.get(m.concept)||0,s+1));
    }
    const ids=new Set(),out=[];
    for(const q of ctx.candidates){
      if(!q?.id||ids.has(q.id))continue;ids.add(q.id);
      const m=meta[q.id],f=features(q,m);if(!f)continue;
      let delta=0;const why=[];
      const same=chosen.filter(x=>x.f.decision===f.decision);
      if(same.some(x=>x.f.near===f.near)){delta-=32;why.push('même décision, force et distribution proches dans la séance')}
      else if(same.some(x=>x.f.criterion===f.criterion)){delta-=18;why.push('même décision et zone de force dans la séance')}
      else if(same.length){delta-=5;why.push('même décision mais contraste de force')}
      if(same.length&&same.every(x=>x.f.force!==f.force)){delta+=8;why.push('variation de force pour le même critère')}
      if(category!=='weakness'){
        const r=recent.filter(x=>x.f.near===f.near&&family(x.q)!==family(q));
        if(r.length){delta-=r.some(x=>x.age===1)?12:6;why.push('variante proche réussie sans aide récemment')}
      }
      // Le rappel fondamental ne concerne que la maintenance, jamais une découverte.
      // Bonus interconcept uniquement sur un plan explicite et sans rappel du même concept déjà choisi.
      const objective=ctx.objective;
      const allowed=Array.isArray(objective?.concepts)?objective.concepts:[];
      const gap=last.has(m.concept)?session-last.get(m.concept):0;
      if(category==='maintenance'&&CORE.has(m.concept)&&allowed.includes(m.concept)&&gap>=7&&!chosen.some(x=>meta[x.q.id]?.concept===m.concept)){
        delta+=Math.min(12,gap-5);why.push('rappel fondamental ancien autorisé par le plan');
      }
      // Aucun changement de preuve, de famille, de difficulté ou d'éligibilité.
      out.push({id:q.id,delta:Math.max(-44,Math.min(12,delta)),reason:why.join(' ; ')||'aucun signal de proximité ou dette autorisée'});
    }
    return out;
  }
  return Object.freeze({schema,features,rank});
});

})(baseModule,baseModule.exports,undefined);
const rankModule={exports:{}};
(function(module,exports,require){
'use strict';
// #446: experimental, no production activation. L = within-deck contrasts;
// R = clean recent repetition. Exact native stratum checked by the adapter.
const base=require('./quizz-coherence-m4-diversite.js');
const family=q=>String(q?.caseFamily||q?.id||'');
const clean=a=>a?.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
const protectedConcept=new Set(['ouv.passe','ouv.mineure','majeur.soutien']);
const metaKey=m=>JSON.stringify([m?.concept,m?.stage,m?.minSession,m?.requires]);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function rank(ctx={}){
 const {session,category,metadataById:meta={},baselineId,policy='L'}=ctx;
 if(!Number.isInteger(session)||session<3||session>20||ctx.history?.active||ctx.forcedReason||
 !['discovery','maintenance'].includes(category)||!['L','R','T'].includes(policy))return [];
 const candidates=ctx.candidates||[],lookup=new Map((ctx.exercises||[]).map(q=>[q.id,q]));
 for(const q of candidates)lookup.set(q.id,q);
 const old=lookup.get(baselineId),m=meta[baselineId],f=base.features(old,m);
 if(!f||protectedConcept.has(m.concept)||old.difficulty>3)return [];
 const rest=(ctx.selected||[]).map(x=>x.exercise||x),local=rest.map(q=>base.features(q,meta[q.id])).filter(Boolean);
 const journal=(ctx.history?.journal||[]).filter(e=>e.mode==='parcours'&&e.session>=session-2&&e.session<session);
 if(journal.length!==2||new Set(journal.map(e=>e.session)).size!==2||journal.some(e=>e.answers?.length!==10))return [];
 const history=journal.flatMap(e=>e.answers).map(a=>({a,q:lookup.get(a.id)}));
 if(history.some(x=>!x.q))return [];
 const relevant=history.filter(x=>meta[x.q.id]?.concept===m.concept);
 // Never displace a local consolidation of a failed or assisted concept.
 if(relevant.some(x=>!clean(x.a)))return [];
 const past=relevant.map(x=>base.features(x.q,meta[x.q.id])).filter(Boolean);
 const count=(arr,v)=>arr.filter(x=>x.near===v.near).length;
 // T: evidence-wide guard and same-family substitution. A new ID may still
 // affect future trajectories; the S180 gate is unchanged.
 if(policy==='T'&&!history.every(x=>clean(x.a)))return [];
 const repeated=policy==='L'?count(local,f):policy==='R'?count(past,f):count(local,f)+count(past,f);
 if(!repeated)return [];
 // R only with a real independent success on the same decision. L can
 // contrast a first discovery within a complete deck (no invented mastery).
 if(policy==='R'&&!past.some(x=>x.decision===f.decision))return [];
 const used=new Set(rest.map(family)),out=[];
 for(const q of candidates){
  const v=base.features(q,meta[q.id]);
  if(!v||q.id===old.id||used.has(family(q))||q.theme!==old.theme||q.difficulty!==old.difficulty||
  q.answer!==old.answer||!same(q.auction,old.auction)||metaKey(meta[q.id])!==metaKey(m)||v.decision!==f.decision)continue;
  const localGain=count(local,f)-count(local,v),recentGain=count(past,f)-count(past,v);
  // A real force or shape contrast, not a new hand alone. Do not trade
  // a local repetition against a recent repetition (or vice versa).
  if(policy==='T'&&family(q)!==family(old))continue;
  if(v.near===f.near||localGain<0||recentGain<0||(policy==='L'?localGain:policy==='R'?recentGain:localGain+recentGain)<=0)continue;
  out.push({id:q.id,delta:Math.min(24,8*(localGain+recentGain)),reason:policy==='T'?'contraste au sein de la même famille après deux séances autonomes':policy==='L'?'contraste de force/distribution dans une décision répétée du deck':'contraste de force/distribution après réussite autonome récente',localGain,recentGain});
 }
 return out.sort((a,b)=>b.delta-a.delta||a.id.localeCompare(b.id));
}
module.exports=Object.freeze({schema:'QPJB_M4P_A_V1',rank});

})(rankModule,rankModule.exports,function(name){if(name!=="./quizz-coherence-m4-diversite.js")throw Error(name);return baseModule.exports;});
window.QPJB_M4P_A=rankModule.exports;
})();
/* Reprise 6 D — T seule. Extrait du choix atomique #505, sans autre politique.
 * La logique T est inchangée; aucune activation par ce fichier. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory(require('./quizz-coherence-m4p-a-rank.js'));
 else root.QPJBReprise6D=factory(root.QPJB_M4P_A);
})(typeof window==='undefined'?globalThis:window,function(T){
'use strict';
const schema='QPJB_COORDINATOR_ATOMIC_V1';
const clean=a=>a?.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
const family=q=>String(q.caseFamily||q.id);
const c=(ctx,q)=>ctx.metadataById[q.id]?.concept;
function choose(ctx){
 const mode='T';
 const {session:s,history:h,selected,slots}=ctx;
 if(!Number.isInteger(s)||s<3||s>65||h?.active||selected.length!==10)return null;
 const rows=(h.journal||[]).filter(r=>r.mode==='parcours'&&r.session<s&&r.answers?.length===10);
 const recent=rows.filter(r=>r.session>=s-2);
 const autonomous=recent.length===2&&new Set(recent.map(r=>r.session)).size===2&&recent.every(r=>r.answers.every(clean));
 const exposed=new Set(rows.flatMap(r=>r.answers.map(a=>a.id)));
 const proposals=[];
 for(const slot of slots){
  const old=selected[slot.index]?.exercise;
  if(!old||old!==slot.baseline||!['nouveau_qcm','rappel_nouvelle_situation'].includes(selected[slot.index].reason))continue;
  const rest=selected.filter((_,i)=>i!==slot.index),used=new Set(rest.map(v=>family(v.exercise)));
  const base=slot.rows.find(x=>x.q===old);if(!base)continue;
  const rows=slot.rows.filter(x=>x.q===old||!used.has(family(x.q))&&!rest.some(v=>v.exercise.id===x.q.id));
  const emit=(x,reason,gain)=>proposals.push({index:slot.index,id:x.q.id,oldId:old.id,concept:c(ctx,x.q),oldConcept:c(ctx,old),cost:base.v-x.v,reason,gain,mode});
  if(mode==='T'&&s<=20&&T){
   const ranked=T.rank({...ctx,category:slot.category,priority:slot.priority,baselineId:old.id,selected:rest,candidates:rows.filter(x=>x.key===base.key&&x.v===base.v).map(x=>x.q),policy:'T'});
   for(const v of ranked){const x=rows.find(x=>x.q.id===v.id&&x.key===base.key&&x.v===base.v);if(x)emit(x,v.reason,v.localGain+v.recentGain)}
   continue;
  }
 }
 return proposals.sort((a,b)=>b.gain-a.gain||a.cost-b.cost||a.index-b.index||a.id.localeCompare(b.id))[0]||null;
}

return Object.freeze({schema,mode:'T',choose});
});


}
/* QPJB — parcours algorithmique V1.10 : preuves de maîtrise séparées des entraînements, sans IA ni API. */
(function(root,factory){
  let prerequis=root?.QPJBPrerequis,sessionPlan=root?.QPJBSessionPlan,durable=root?.QPJBDurableIntegration;
  if(typeof module!=='undefined'&&module.exports){
    try{prerequis=require('./quizz-prerequis.js')}
    catch(err){if(err.code!=='MODULE_NOT_FOUND'||!String(err.message).includes("'./quizz-prerequis.js'"))throw err;}
    sessionPlan=require('./quizz-session-plan.js');
    durable=require('./quizz-durable-integration.js');
  }
  if(!sessionPlan||sessionPlan.schema!=='QPJB_SESSION_PLAN_V1')throw Error('QPJB session plan unavailable');
  if(root?.document&&!sessionPlan.pedagogyReady)throw Error('QPJB pedagogical modules unavailable');
  const api=factory(prerequis,sessionPlan,durable);
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root){
    root.QPJBParcours=api;
    // Le gros fichier quizz.html reste intact : la restauration se greffe
    // uniquement à côté du bouton d'export de la V1.
    if(root.document){
      const setupImport=()=>{
        const exportButton=root.document.getElementById('progress-export');
        if(!exportButton||root.document.getElementById('progress-import'))return;
        const button=root.document.createElement('button');
        button.id='progress-import';button.type='button';
        button.textContent='Importer une sauvegarde (JSON)';
        const input=root.document.createElement('input');
        input.type='file';input.id='progress-import-file';
        input.accept='.json,application/json';input.hidden=true;
        exportButton.insertAdjacentElement('afterend',button);
        button.insertAdjacentElement('afterend',input);
        // Explain the revision before a returning learner sees different
        // mastery indicators. Read-only here; the existing save path persists
        // the complete revised state including its archive.
        try{
          const migrated=api.load(root.localStorage.getItem('qpjb-sef-parcours-01'));
          if(migrated.audit3000Archive){
            const notice=root.document.createElement('p');
            notice.id='progress-audit3000-notice';
            notice.textContent='Mise à jour des QCM : vos séances terminées et anciennes réponses sont conservées dans la sauvegarde. Certaines preuves de maîtrise concernées par les corrections doivent être validées à nouveau.';
            input.insertAdjacentElement('afterend',notice);
          }
        }catch(_){/* storage unavailable: keep the existing import controls */}
        button.addEventListener('click',()=>input.click());
        input.addEventListener('change',async()=>{
          const file=input.files&&input.files[0];
          if(!file)return;
          const status=root.document.getElementById('progress-export-status');
          try{
            if(file.size>5_000_000)throw Error('Fichier trop volumineux (5 Mo maximum).');
            const restored=api.importProgress(await file.text());
            const key='qpjb-sef-parcours-01';
            const oldRaw=root.localStorage.getItem(key);
            const current=api.load(oldRaw);
            const msg='Restaurer '+restored.completed+' séance(s) terminée(s) à la place de '+
              current.completed+' ? Une copie locale de la progression actuelle sera conservée. '+
              'Le Quiz SEF classique ne sera pas modifié.';
            if(!root.confirm(msg)){
              if(status)status.textContent='Import annulé : progression actuelle conservée.';
              return;
            }
            // Pas de remplacement destructeur : enregistrer d'abord l'ancien état.
            if(oldRaw!==null){
              const backup=key+'-avant-import-'+new Date().toISOString().replace(/[:.]/g,'-');
              root.localStorage.setItem(backup,oldRaw);
            }
            root.localStorage.setItem(key,JSON.stringify(restored));
            if(status)status.textContent='Sauvegarde restaurée. Rechargement du parcours…';
            root.location.reload();
          }catch(err){
            if(status)status.textContent='Import refusé : '+String(err.message||err);
          }finally{input.value='';}
        });
      };
      if(root.document.readyState==='loading')
        root.document.addEventListener('DOMContentLoaded',setupImport,{once:true});
      else setupImport();
    }
  }
})(typeof window!=='undefined'?window:null,function factory(prerequis,sessionPlan,durable){
  'use strict';
  const VERSION=1;
  // Métadonnées de sélection purement descriptives : aucun changement des
  // poids, de l'éligibilité, de la notation ou des corrigés.
  const SELECTION_REASONS=[
    'equilibre_ouvertures','nouveau_qcm','rappel_erreur_aide',
    'rappel_nouvelle_situation','rappel_question','complement_catalogue','renforcement_lacune','transfert_contexte'
  ];
  const validSelection=(item,id)=>item&&item.id===id&&
    ['nouveau','revision'].includes(item.kind)&&SELECTION_REASONS.includes(item.reason);
  const ROADMAP=[
    ['ouv',0],['majeur',1],['mineur',1],['sa',3],['red',4],
    ['second',6],['stayman',7],['apres_fit',8],['intervenir',10],
    ['contre',12],['reponse_inter',13],['apres_inter',14],
    ['barrage',17],['reveil',19],['roudi',22],['drury',24],
    ['fortes',26],['forcing',28],['multilandy',32],
    ['rubensohl',34],['michaels',36],['chelem',39]
  ];
  const INTRO=Object.fromEntries(ROADMAP);
  const family=x=>String(x.caseFamily||x.id);
  // La bonne enchère est déjà validée dans le catalogue : on n'infère rien
  // de la main. Une même réponse correcte répétée n'est pas une nouvelle notion.
  const bid=x=>String(x.answer||'').replace(/[\uFE0E\uFE0F\s]/g,'').trim();
  // Empreinte contextuelle tirée exclusivement des QCM déjà validés.
  const opener=x=>{
    const first=Array.isArray(x.auction)?String(x.auction[0]||''):'';
    const m=first.match(/:\s*([1-7](?:SA|[♣♦♥♠])|Passe|Contre|Surcontre)/);
    return m?m[1]:'';
  };
  const context=x=>x.theme+'|'+opener(x);
  const situation=x=>context(x)+'|'+bid(x);

  // Taxonomie volontairement prudente : on ne déduit pas une règle pédagogique
  // d'un commentaire libre. Les 903 cas catégorisés sont déterminés par
  // l'ouverture visible et le type d'enchère attendue (seulement à l'ouverture).
  const MICRO_LABELS={
    'ouv:passe':'Décider de passer',
    'ouv:mineure':'Choisir une ouverture mineure',
    'ouv:majeure':'Choisir une ouverture majeure',
    'ouv:sa':'Choisir une ouverture à Sans-Atout',
    'mineur:1♣':'Répondre à 1♣','mineur:1♦':'Répondre à 1♦',
    'majeur:1♥':'Répondre à 1♥','majeur:1♠':'Répondre à 1♠',
    'sa:1SA':'Répondre à 1SA','sa:2SA':'Répondre à 2SA',
    'red:mineure':'Redemander après une ouverture mineure',
    'red:majeure':'Redemander après une ouverture majeure',
    'second:mineure':'Deuxième enchère après une mineure',
    'second:majeure':'Deuxième enchère après une majeure',
    'intervenir:mineure':'Intervenir sur une ouverture mineure',
    'intervenir:majeure':'Intervenir sur une ouverture majeure',
    'intervenir:barrage':'Intervenir sur un deux faible',
    'contre:mineure':'Enchérir après un contre sur une mineure',
    'contre:majeure':'Enchérir après un contre sur une majeure',
    'contre:barrage':'Enchérir après un contre sur un deux faible',
    'apres_inter:mineure':'Répondre après intervention sur une mineure',
    'apres_inter:majeure':'Répondre après intervention sur une majeure',
    'reveil:mineure':'Réveiller après une ouverture mineure',
    'reveil:majeure':'Réveiller après une ouverture majeure',
    'reveil:barrage':'Réveiller après une ouverture au palier de deux'
  };

  // V1.4 : second niveau de suivi, distinct des micro-contextes V1.3.
  // Liste d'IDs figée après audit des justifications éditoriales. Un ID seul
  // ne suffit pas : rubrique et justification doivent toujours correspondre.
  const AXIS_LABELS={
    fit:'Reconnaissance et recherche du fit',
    force:'Évaluation de la force',
    palier:'Choix du palier'
  };
  const AXIS_AUDIT=[
    // Visa global 24/11 : huit motifs individualisés, 105 associations inchangées.
    ["fit","majeur","Soutien simple sur ouverture majeure",["SEF-026-3","SEF-026-1","SEF-027-2","SEF-027-1","SEF-N049-1","SEF-N049-3","SEF-N050-2","SEF-N050-1","SEF-N054-1","SEF-N055-2","SEF-N055-1"]],
    ["fit","mineur","Soutien mineur : différence entre main régulière et main avec singleton.",["SEF-V412-014","SEF-V412-015"]],
    ["fit","mineur","Choisir le soutien mineur faible à 2♣ avec une courte.",["SEF-020-1"]],
    ["fit","mineur","Soutien mineur simple : intégrer le singleton et le seuil de force.",["SEF-N031-2"]],
    ["fit","roudi","Déclencher le Roudi pour rechercher un fit 5-3",["SEF-V4-073-1","SEF-V4-085-3","SEF-V4-091-3"]],
    ["fit","roudi","Déclencher le Roudi à 2♣ avec cinq Piques et une force invitante.",["SEF-V4-079-3"]],
    ["fit","drury","Employer le Drury après un Passe d’entrée et un fit",["SEF-V4-104-1"]],
    ["fit","drury","Déclencher le Drury après Passe d'entrée avec quatre atouts et une force constructive.",["SEF-V4-098-1"]],
    ["fit","reponse_inter","Reconnaître le fit 5-3 après l’intervention du partenaire.",["SEF-V49-032"]],
    ["force","sa","Calcul élémentaire de la zone de manche face à Sans-Atout",["SEF-031-2","SEF-031-1","SEF-032-1","SEF-033-1","SEF-033-2","SEF-041-2","SEF-041-1","SEF-N088-3","SEF-N088-1","SEF-N089-2","SEF-N089-1","SEF-N090-1","SEF-N091-3","SEF-N091-1","SEF-N092-1","SEF-N092-2","SEF-N093-1","SEF-N093-3","SEF-N097-3","SEF-N097-1","SEF-N098-1","SEF-N098-2","SEF-N099-2","SEF-N099-1","SEF-N100-3","SEF-N100-2"]],
    ["force","apres_fit","Refuser tout espoir de manche avec l’ouverture minimale",["SEF-V4-001-1","SEF-V4-003-3","SEF-V4-013-3","SEF-V4-015-3"]],
    ["force","apres_fit","Apprécier une main non minimale pour proposer la manche",["SEF-V4-002-1","SEF-V4-004-1","SEF-V4-014-1","SEF-V4-016-2"]],
    ["force","apres_fit","Réévaluer la force avec une courte et un fit établi",["SEF-V4-007-1","SEF-V4-007-2","SEF-V4-008-1","SEF-V4-019-1","SEF-V4-020-1","SEF-V4-020-3"]],
    ["force","drury","Reconnaître le seuil exact du Drury : 10 HLD ne suffisent pas",["SEF-V4-097-1","SEF-V4-103-1"]],
    ["palier","second","Choix du contrat partiel après la redemande de l’ouvreur",["SEF-052-3","SEF-052-1","SEF-053-2","SEF-053-3","SEF-054-1","SEF-054-2","SEF-055-3","SEF-055-2","SEF-N134-1","SEF-N134-3","SEF-N135-3","SEF-N136-1","SEF-N137-1","SEF-N138-1","SEF-N138-2","SEF-N141-2","SEF-N142-1","SEF-N142-3","SEF-V44-025"]],
    ["palier","apres_fit","Déterminer le bon niveau après découverte du fit",["SEF-V4-012-1","SEF-V4-024-2"]],
    ["palier","apres_fit","Accepter 2SA essai généralisé avec un soutien majeur maximum.",["SEF-V4-010-1"]],
    ["palier","apres_fit","Évaluer le haut de zone du soutien sur 2SA essai après 1♠–2♠.",["SEF-V4-022-3"]],
    ["palier","apres_fit","Distinguer le barrage d’une proposition de manche",["SEF-V4-006-2","SEF-V4-018-1"]],
    ["palier","apres_fit","Distinguer 3♥ préventif de 2SA essai après un fit majeur.",["SEF-V4-005-2"]],
    ["palier","apres_fit","Reconnaître le barrage à 3♠ après 1♠–2♠, distinct d'un essai.",["SEF-V4-017-2"]],
    ["palier","apres_fit","Après 1♥–2♥–2SA, refuser l'essai généralisé avec un soutien minimum de 6 HLD.",["SEF-V4-009-1"]],
    ["palier","apres_fit","Distinguer soutien minimum et acceptation de manche après 1♥–2♥–2SA.",["SEF-V4-011-1"]],
    ["palier","apres_fit","Refuser un essai généralisé de manche avec un fit Pique minimum de 6 HLD.",["SEF-V4-021-1"]],
    ["palier","apres_fit","Ne pas confondre honneurs épars et soutien suffisant pour accepter la manche après 2SA d'essai.",["SEF-V4-023-3"]],
    ["palier","reveil","Distinguer un réveil à saut ou au palier de deux",["SEF-V4-053-4","SEF-V4-054-2","SEF-V4-070-2","SEF-V4-071-2","SEF-V4-072-3"]],
    ["palier","barrage","Évaluer la longueur et la qualité d’un barrage au palier de 3",["SEF-V3-099-3","SEF-V3-099-1","SEF-V3-100-4","SEF-V44-046","SEF-V44-047"]]
  ];
  const AXIS_BY_ID=Object.create(null);
  for(const [axis,theme,reason,ids] of AXIS_AUDIT){
    for(const id of ids)AXIS_BY_ID[id]={axis,theme,reason};
  }
  function axisKey(x){
    const proof=x&&AXIS_BY_ID[x.id];
    return proof&&x.theme===proof.theme&&x.difficultyReason===proof.reason
      ?proof.axis:null;
  }
  function axisWeaknesses(state,max=1){
    return Object.entries(state.axes||{})
      .filter(([key,r])=>Object.hasOwn(AXIS_LABELS,key)&&r&&r.score<=-2&&r.attempts>=2)
      .sort((a,b)=>a[1].score-b[1].score||
        a[1].lastSession-b[1].lastSession||a[0].localeCompare(b[0]))
      .slice(0,Math.max(0,Math.min(3,max)))
      .map(([key,r])=>({key,label:AXIS_LABELS[key],score:r.score}));
  }
  function auctionBid(x,role){
    const bids=Array.isArray(x.auction)?x.auction:[];
    for(const raw of bids){
      const str=String(raw||'');
      if(!str.startsWith(role))continue;
      const match=str.slice(role.length).match(/^\s*:\s*([1-7](?:SA|[♣♦♥♠]))/);
      if(match)return match[1];
    }
    return '';
  }
  const colorOf=b=>/[♣♦]$/.test(b)?'mineure':/[♥♠]$/.test(b)?'majeure':'';
  function microKey(x){
    const t=x.theme,partner=auctionBid(x,'Partenaire'),
      own=auctionBid(x,'Vous'),other=auctionBid(x,'Adversaire');
    let key=null;
    if(t==='ouv'){
      const answer=bid(x);
      if(answer==='Passe')key='ouv:passe';
      else if(/^1[♣♦]$/.test(answer))key='ouv:mineure';
      else if(/^1[♥♠]$/.test(answer))key='ouv:majeure';
      else if(answer==='1SA'||answer==='2SA')key='ouv:sa';
    }else if(t==='mineur'&&/^1[♣♦]$/.test(partner))key='mineur:'+partner;
    else if(t==='majeur'&&/^1[♥♠]$/.test(partner))key='majeur:'+partner;
    else if(t==='sa'&&/^[12]SA$/.test(partner))key='sa:'+partner;
    else if(t==='red'&&/^1[♣♦♥♠]$/.test(own))key='red:'+colorOf(own);
    else if(t==='second'&&/^1[♣♦♥♠]$/.test(partner))key='second:'+colorOf(partner);
    else if((t==='intervenir'||t==='contre'||t==='reveil')&&/^[12][♣♦♥♠]$/.test(other))
      key=t+':'+(other[0]==='2'?'barrage':colorOf(other));
    else if(t==='apres_inter'&&/^1[♣♦♥♠]$/.test(partner))
      key=t+':'+colorOf(partner);
    return key&&Object.hasOwn(MICRO_LABELS,key)?key:null;
  }
  function weaknesses(state,max=2){
    const records=state.micros||{};
    return Object.entries(records)
      .filter(([k,v])=>Object.hasOwn(MICRO_LABELS,k)&&v&&v.score<=-2&&v.attempts>=2)
      .sort((a,b)=>a[1].score-b[1].score||a[1].lastSession-b[1].lastSession||a[0].localeCompare(b[0]))
      .slice(0,Math.max(0,Math.min(5,max)))
      .map(([key,v])=>({key,label:MICRO_LABELS[key],score:v.score}));
  }
  const int=(x,fallback=0)=>Number.isInteger(x)&&x>=0?x:fallback;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  // Les entrées suivent la DERNIÈRE pratique, le champ assessment suit la
  // DERNIÈRE preuve d'une séance ordinaire (et rien d'autre).
  // Pour les anciennes sauvegardes, laisser la lecture historique inchangée :
  // elles ne permettent pas de reconstituer rétroactivement le mode d'origine.
  function assessmentOf(entry){
    if(!entry||typeof entry!=='object')return null;
    if(Object.hasOwn(entry,'assessment'))return entry.assessment;
    if(!['correct','wrong','skipped'].includes(entry.result))return null;
    return {result:entry.result,assisted:!!entry.assisted,
      lastSession:int(entry.lastSession)};
  }
  // Catalogue revision computed from the pinned audit manifests: material
  // changes or changes of concept/theme/family/difficulty/micro/axis.
  // The key list and both aggregate buckets are independently checked in CI.
  const AUDIT3000_REVISION='audit3000-guided-v1';
  const AUDIT3000_RISK=Object.freeze({"SEF-020-1":["mineur","mineur:1♣","fit"],"SEF-N002-1":["ouv","ouv:majeure"],"SEF-N020-1":["ouv","ouv:sa"],"SEF-N031-2":["mineur","mineur:1♣","fit"],"SEF-N041-2":["mineur","mineur:1♦"],"SEF-N049-3":["majeur","majeur:1♥","fit"],"SEF-N050-1":["majeur","majeur:1♥","fit"],"SEF-N054-1":["majeur","majeur:1♠","fit"],"SEF-N055-1":["majeur","majeur:1♠","fit"],"SEF-N067-1":["majeur","majeur:1♥"],"SEF-N091-1":["sa","sa:1SA","force"],"SEF-V3-051-1":["intervenir","intervenir:majeure"],"SEF-V3-052-2":["intervenir","intervenir:majeure"],"SEF-V3-053-1":["intervenir","intervenir:mineure"],"SEF-V3-053-3":["intervenir","intervenir:mineure"],"SEF-V3-054-2":["intervenir","intervenir:mineure"],"SEF-V3-054-1":["intervenir","intervenir:mineure"],"SEF-V3-055-1":["intervenir","intervenir:majeure"],"SEF-V3-055-2":["intervenir","intervenir:majeure"],"SEF-V3-056-4":["intervenir","intervenir:majeure"],"SEF-V3-056-1":["intervenir","intervenir:majeure"],"SEF-V3-086-2":["apres_inter","apres_inter:majeure"],"SEF-V3-107-2":["barrage"],"SEF-V4-050-2":["reveil","reveil:mineure"],"SEF-V4-053-4":["reveil","reveil:majeure","palier"],"SEF-V4-055-3":["reveil","reveil:majeure"],"SEF-V4-056-2":["reveil","reveil:majeure"],"SEF-V4-057-2":["reveil","reveil:mineure"],"SEF-V4-057-4":["reveil","reveil:mineure"],"SEF-V4-058-3":["reveil","reveil:mineure"],"SEF-V4-059-2":["reveil","reveil:majeure"],"SEF-V4-059-1":["reveil","reveil:majeure"],"SEF-V4-060-4":["reveil","reveil:majeure"],"SEF-V4-069-1":["reveil","reveil:mineure"],"SEF-V4-070-2":["reveil","reveil:mineure","palier"],"SEF-V4-071-2":["reveil","reveil:mineure","palier"],"SEF-V4-072-3":["reveil","reveil:mineure","palier"],"SEF-V44-001":["ouv","ouv:mineure"],"SEF-V44-017":["red","red:mineure"],"SEF-V44-018":["red","red:mineure"],"SEF-V44-022":["second","second:mineure"],"SEF-V44-026":["stayman"],"SEF-V44-027":["stayman"],"SEF-V44-031":["stayman"],"SEF-V44-043":["apres_inter","apres_inter:majeure"],"SEF-V44-044":["apres_inter","apres_inter:majeure"],"SEF-V44-058":["reveil","reveil:majeure"],"SEF-V44-059":["reveil","reveil:mineure"],"SEF-V44-061":["reveil","reveil:majeure"],"SEF-V44-064":["roudi"],"SEF-V45-017":["forcing"],"SEF-V411-006":["red","red:mineure"],"SEF-V412-001":["red","red:majeure"],"SEF-V412-015":["mineur","mineur:1♣","fit"],"SEF-V413-012":["apres_inter","apres_inter:majeure"],"SEF-V416-004":["second","second:majeure"],"SEF-V417-009":["second","second:mineure"],"SEF-V420-009":["apres_inter","apres_inter:mineure"],"SEF-V421-006":["apres_inter","apres_inter:majeure"],"SEF-V422-003":["apres_inter","apres_inter:majeure"],"SEF-V484-011":["drury"],"SEF-V484-012":["drury"],"SEF-V487-003":["fortes"],"SEF-L01-C-04":["rubensohl"],"SEF-L04-028":["reveil","reveil:majeure"],"SEF-L10-021":["reveil","michaels","reveil:majeure"],"SEF-L06-021":["majeur","majeur:1♥"],"SEF-L08-020":["contre","contre:mineure"],"SEF-L10-013":["reponse_inter"],"SEF-L13-002":["roudi"],"SEF-L13-016":["sa","sa:1SA"],"SEF-L13-019":["sa","sa:1SA"],"SEF-L14-002":["multilandy"],"SEF-L14-006":["roudi"],"SEF-L20-005":["barrage"],"SEF-L20-006":["reveil","reveil:majeure"],"SEF-L21-003":["roudi"],"SEF-L21-005":["apres_fit"],"SEF-L21-006":["apres_fit"],"SEF-L21-007":["apres_fit"],"SEF-L22-007":["red","red:mineure"],"SEF-L24-004":["reveil","reveil:majeure"],"SEF-L25-002":["stayman"],"SEF-L25-005":["stayman"],"SEF-L26-001":["reveil","reveil:majeure"],"SEF-L27-004":["barrage"],"SEF-L27-005":["red","red:mineure"],"SEF-L29-003":["red","red:mineure"],"SEF-L30-001":["fortes"],"SEF-L33-005":["ouv","ouv:majeure"],"SEF-L34-004":["reveil","reveil:majeure"],"SEF-L37-004":["sa"],"SEF-L38-001":["sa"],"SEF-L40-001":["sa"],"SEF-L41-001":["sa"],"SEF-L42-003":["sa","sa:1SA"],"SEF-L43-005":["sa"],"SEF-Q26-M2-002":["rubensohl"],"V1-M4-006":["reveil","michaels","reveil:mineure"],"V1-M4-007":["reveil","michaels","reveil:mineure"],"V1-M4-008":["reveil","reveil:majeure"],"V2-M1-003":["ouv","ouv:sa"],"V2-M1-031":["mineur","mineur:1♣"],"V2-M2-007":["sa"],"V2-M2-008":["sa"],"V2-M2-013":["sa"],"V2-M2-040":["stayman"],"V2-M3-030":["second","second:majeure"],"V2-M4-023":["contre","contre:mineure"],"V2-M5-023":["multilandy"],"V2-M6-001":["roudi"],"V2-M6-005":["roudi"],"V2-M6-008":["drury"],"SEF-Q400-A-024":["ouv","ouv:passe"],"SEF-Q400-A-039":["majeur","majeur:1♥"],"SEF-Q400-B-006":["ouv","ouv:sa"],"SEF-Q400-B-036":["stayman"],"SEF-Q400-B-042":["sa","sa:2SA"],"SEF-Q400-B-047":["sa"],"SEF-Q400-B-048":["sa"],"SEF-Q400-B-059":["roudi"],"SEF-Q400-B-071":["roudi"],"SEF-Q400-B-084":["drury"],"SEF-Q400-B-091":["sa"],"SEF-Q400-B-093":["sa"],"SEF-Q400-C-039":["contre","contre:mineure"],"SEF-Q400-C-063":["red","red:mineure"],"SEF-Q400-C-078":["barrage"],"SEF-Q400-C-079":["barrage"],"SEF-Q400-C-089":["apres_inter","apres_inter:majeure"],"SEF-Q400-D-018":["forcing"],"SEF-Q685-A-037":["mineur","mineur:1♦"],"SEF-Q685-A-071":["majeur","majeur:1♥"],"SEF-Q685-A-073":["majeur","majeur:1♥"],"SEF-Q685-A-074":["majeur","majeur:1♠"],"SEF-Q685-A-075":["majeur","majeur:1♠"],"SEF-Q685-A-076":["majeur","majeur:1♠"],"SEF-Q685-A-077":["majeur","majeur:1♠"],"SEF-Q685-A-111":["second","second:mineure"],"SEF-Q685-A-127":["second","second:mineure"],"SEF-Q685-A-130":["second","second:mineure"],"SEF-Q685-B-024":["sa","sa:1SA"],"SEF-Q685-B-052":["stayman"],"SEF-Q685-B-056":["stayman"],"SEF-Q685-B-058":["stayman"],"SEF-Q685-B-063":["sa","sa:1SA"],"SEF-Q685-B-065":["sa"],"SEF-Q685-B-066":["sa"],"SEF-Q685-B-067":["sa"],"SEF-Q685-B-083":["drury"],"SEF-Q685-B-089":["sa"],"SEF-Q685-B-090":["sa"],"SEF-Q685-B-091":["sa"],"SEF-Q685-B-092":["sa"],"SEF-Q685-B-093":["sa"],"SEF-Q685-B-094":["sa"],"SEF-Q685-B-095":["sa"],"SEF-Q685-B-096":["sa"],"SEF-Q685-B-097":["sa"],"SEF-Q685-B-121":["sa"],"SEF-Q685-B-130":["sa"],"SEF-Q685-B-132":["roudi"],"SEF-Q685-B-134":["roudi"],"SEF-Q685-B-143":["roudi"],"SEF-Q685-B-157":["drury"],"SEF-Q685-B-158":["drury"],"SEF-Q685-B-167":["drury"],"SEF-Q685-C-040":["contre","contre:majeure"],"SEF-Q685-C-069":["red","red:mineure"],"SEF-Q685-C-071":["red","red:mineure"],"SEF-Q685-C-114":["reveil","reveil:majeure"],"SEF-Q685-C-115":["reveil","reveil:majeure"],"SEF-Q685-C-136":["apres_inter","apres_inter:majeure"],"SEF-Q685-D-043":["multilandy"],"SEF-Q685-D-061":["rubensohl"],"SEF-Q685-D-062":["rubensohl"],"SEF-Q685-D-063":["rubensohl"],"SEF-Q685-D-064":["rubensohl"],"SEF-Q685-D-065":["rubensohl"],"SEF-Q685-D-066":["rubensohl"],"SEF-Q685-D-067":["rubensohl"],"SEF-Q685-D-068":["rubensohl"],"SEF-Q685-D-081":["michaels"],"SEF-Q685-D-082":["michaels"],"SEF-Q685-D-085":["michaels"]});
  const audit3000Enabled=Object.keys(prerequis?.byId||{}).length>=3000&&Object.hasOwn(prerequis.byId,'SEF-Q685-D-068');
  function empty(){return {version:VERSION,completed:0,entries:{},skills:{},micros:{},axes:{},
    ...(audit3000Enabled?{audit3000Revision:AUDIT3000_REVISION}:{}),
    active:null,journal:[],difficultyFeedback:[],difficultyAdjustment:0};}
  // Optional observed first bid only. Old journals remain unchanged after load.
  const firstGuessEvidence=a=>a?.hadFreeError===true&&typeof a.firstGuess==='string'&&/^(?:Passe|Contre|Surcontre|[1-7](?:♣|♦|♥|♠|SA))$/.test(a.firstGuess)&&!(a.result==='correct'&&a.firstGuess===a.choice)?{firstGuess:a.firstGuess}:{};
  // Référence facultative du départage historique, distincte du journal observé.
  // Une référence absente ou corrompue ne change jamais les réponses ni leurs preuves.
  function validOrderReference(ids,reference){
    return Array.isArray(ids)&&Array.isArray(reference)&&ids.length>0&&ids.length<=20&&
      reference.length===ids.length&&new Set(ids).size===ids.length&&
      new Set(reference).size===reference.length&&reference.every(id=>typeof id==='string'&&ids.includes(id));
  }
  function referenceAnswers(event){
    const answers=event.answers||[];
    if(event.mode!=='parcours'||!validOrderReference(answers.map(a=>a.id),event.orderReferenceIds))return answers;
    const byId=new Map(answers.map(a=>[a.id,a]));
    return event.orderReferenceIds.map(id=>byId.get(id));
  }
  // Experimental full ordering: snapshot only themes whose relative order
  // changes. The native skill recurrence is replayed with real answers.
  const skillFields=['level','clean','errors','lastCleanSession','lastLevelChangeSession'];
  function validSkillBase(base,completed){
    if(!base||typeof base!=='object'||Array.isArray(base))return false;
    const keys=Object.keys(base);
    return keys.length>0&&keys.length<=Object.keys(INTRO).length&&keys.every(t=>{
      if(!Object.hasOwn(INTRO,t))return false;
      const v=base[t];
      return v===null||(v&&typeof v==='object'&&!Array.isArray(v)&&
        Object.keys(v).length===skillFields.length&&skillFields.every(k=>Object.hasOwn(v,k))&&
        Number.isInteger(v.level)&&v.level>=1&&v.level<=5&&Number.isInteger(v.clean)&&v.clean>=0&&v.clean<=3&&
        Number.isInteger(v.errors)&&v.errors>=0&&v.errors<=2&&
        ['lastCleanSession','lastLevelChangeSession'].every(k=>v[k]===null||Number.isInteger(v[k])&&v[k]>=0&&v[k]<=completed));
    });
  }
  function sameSkill(a,b){
    return !!a&&!!b&&skillFields.every(k=>a[k]===b[k]);
  }
  function changedOrderThemes(historical,proposed,byId){
    if(!validOrderReference(historical,proposed)||historical.some(id=>!byId.has(id)))return [];
    const themes=[...new Set(historical.map(id=>byId.get(id).theme))];
    return themes.filter(t=>historical.filter(id=>byId.get(id).theme===t).join('|')!==
      proposed.filter(id=>byId.get(id).theme===t).join('|'));
  }
  function loadObserved(raw){
    let old=raw;
    if(typeof raw==='string'){try{old=JSON.parse(raw)}catch(_){old=null}}
    const s=empty();
    if(!old||typeof old!=='object'||old.version!==VERSION)return s;
    s.completed=clamp(int(old.completed),0,100000);
    if(old.entries&&typeof old.entries==='object'&&!Array.isArray(old.entries)){
      for(const [id,r] of Object.entries(old.entries)){
        if(!r||typeof r!=='object'||id.length>100)continue;
        if(!['correct','wrong','skipped'].includes(r.result))continue;
        s.entries[id]={result:r.result,assisted:!!r.assisted,
          lastSession:clamp(int(r.lastSession),0,s.completed),
          due:clamp(int(r.due),0,100010),seen:clamp(int(r.seen,1),1,10000),
          streak:clamp(int(r.streak),0,10000),family:String(r.family||id)};
        if(Object.hasOwn(r,'assessment')){
          const a=r.assessment;
          s.entries[id].assessment=a&&typeof a==='object'&&!Array.isArray(a)&&
            ['correct','wrong','skipped'].includes(a.result)&&
            Number.isInteger(a.lastSession)&&a.lastSession>=0&&a.lastSession<=s.completed
            ?{result:a.result,assisted:!!a.assisted,lastSession:a.lastSession}:null;
        }
      }
    }
    if(old.skills&&typeof old.skills==='object'&&!Array.isArray(old.skills)){
      for(const [id,v] of Object.entries(old.skills)){
        if(!Object.hasOwn(INTRO,id)||!v||typeof v!=='object')continue;
        s.skills[id]={level:clamp(int(v.level,1),1,5),
          clean:clamp(int(v.clean),0,3),errors:clamp(int(v.errors),0,2),
          lastCleanSession:Number.isInteger(v.lastCleanSession)&&v.lastCleanSession>=0
            ?clamp(v.lastCleanSession,0,s.completed):null,
          lastLevelChangeSession:Number.isInteger(v.lastLevelChangeSession)&&v.lastLevelChangeSession>=0
            ?clamp(v.lastLevelChangeSession,0,s.completed):null};
      }
    }
    // Nouvelles données facultatives. Les sauvegardes V1/V1.1/V1.2 ne
    // contiennent pas ce champ : leur progression précédente reste intacte.
    if(old.micros&&typeof old.micros==='object'&&!Array.isArray(old.micros)){
      for(const [key,v] of Object.entries(old.micros)){
        if(!Object.hasOwn(MICRO_LABELS,key)||!v||typeof v!=='object')continue;
        const attempts=clamp(int(v.attempts),0,100000);
        s.micros[key]={
          score:clamp(Number.isInteger(v.score)?v.score:0,-3,3),
          attempts,independent:clamp(int(v.independent),0,attempts),
          lastSession:clamp(int(v.lastSession),0,s.completed),
          lastScoredSession:Number.isInteger(v.lastScoredSession)&&v.lastScoredSession>=0
            ?clamp(v.lastScoredSession,0,s.completed):null,
          sessionBase:clamp(Number.isInteger(v.sessionBase)?v.sessionBase:0,-3,3),
          sessionResult:v.sessionResult==='clean'||v.sessionResult==='weak'?v.sessionResult:null
        };
      }
    }

    // Les sauvegardes antérieures ne contiennent pas d'axes : aucun score
    // n'est déduit rétroactivement des réponses passées.
    if(old.axes&&typeof old.axes==='object'&&!Array.isArray(old.axes)){
      for(const [key,v] of Object.entries(old.axes)){
        if(!Object.hasOwn(AXIS_LABELS,key)||!v||typeof v!=='object')continue;
        const attempts=clamp(int(v.attempts),0,100000);
        s.axes[key]={
          score:clamp(Number.isInteger(v.score)?v.score:0,-3,3),
          attempts,independent:clamp(int(v.independent),0,attempts),
          lastSession:clamp(int(v.lastSession),0,s.completed),
          lastScoredSession:Number.isInteger(v.lastScoredSession)&&v.lastScoredSession>=0
            ?clamp(v.lastScoredSession,0,s.completed):null,
          sessionBase:clamp(Number.isInteger(v.sessionBase)?v.sessionBase:0,-3,3),
          sessionResult:v.sessionResult==='clean'||v.sessionResult==='weak'?v.sessionResult:null
        };
      }
    }
    if(old.active&&typeof old.active==='object'&&Array.isArray(old.active.ids)){
      const ids=old.active.ids.filter(x=>typeof x==='string'&&x.length<=100);
      if(ids.length&&ids.length<=20&&new Set(ids).size===ids.length){
        const answers={};
        if(old.active.answers&&typeof old.active.answers==='object'){
          for(const [k,v] of Object.entries(old.active.answers)){
            const i=Number(k);
            if(!Number.isInteger(i)||i<0||i>=ids.length||!v||!['correct','wrong','skipped'].includes(v.result))continue;
            answers[i]={result:v.result,choice:typeof v.choice==='string'?v.choice:null,
              assisted:!!v.assisted,hadFreeError:!!v.hadFreeError,...firstGuessEvidence(v)};
          }
        }
        s.active={ids,index:clamp(int(old.active.index),0,ids.length-1),
          answers,createdAt:int(old.active.createdAt,s.completed)};
        // Facultatif : les séances commencées avant ce suivi restent lisibles.
        // Aucun motif de sélection n'est réinventé a posteriori.
        if(Array.isArray(old.active.selection)&&old.active.selection.length===ids.length&&
          old.active.selection.every((v,i)=>validSelection(v,ids[i])))
          s.active.selection=old.active.selection.map(v=>({
            id:v.id,kind:v.kind,reason:v.reason
          }));
        if(old.active.mode!=='consolidation'&&validOrderReference(ids,old.active.orderReferenceIds))
          s.active.orderReferenceIds=old.active.orderReferenceIds.slice();
        if(s.active.orderReferenceIds&&validSkillBase(old.active.orderSkillBase,s.completed)&&
          Array.isArray(old.active.orderSkillRecordedIds)){
          const observed=Object.keys(answers).map(i=>ids[Number(i)]),recorded=old.active.orderSkillRecordedIds;
          if(recorded.length===observed.length&&new Set(recorded).size===recorded.length&&recorded.every(id=>observed.includes(id))){
            s.active.orderSkillBase=Object.fromEntries(Object.entries(old.active.orderSkillBase).map(([k,v])=>[k,v===null?null:Object.fromEntries(skillFields.map(field=>[field,v[field]]))]));
            s.active.orderSkillRecordedIds=recorded.slice();
          }
        }
        if(old.active.mode==='consolidation'){
          s.active.mode='consolidation';
          if(Array.isArray(old.active.targets)&&old.active.targets.length===ids.length&&
             old.active.targets.every(target=>focusLabel(target)))
            s.active.targets=old.active.targets.slice();
        }
      }
    }
    if(Number.isInteger(old.lastConsolidatedAt)&&old.lastConsolidatedAt>=0)
      s.lastConsolidatedAt=clamp(old.lastConsolidatedAt,0,s.completed);
    if(old.lastConsolidation&&typeof old.lastConsolidation==='object'){
      const report=old.lastConsolidation,counts=validCounts(report.counts);
      if(counts&&counts.total>=4&&
        Number.isInteger(report.atSession)&&report.atSession>=0&&report.atSession<=s.completed){
        let parts=[];
        if(Array.isArray(report.parts)&&report.parts.length<=2&&
           report.parts.every(x=>x&&focusLabel(x.target)&&validCounts(x.counts))){
          parts=report.parts.map(x=>({target:x.target,counts:validCounts(x.counts)}));
          const sum=parts.reduce((total,x)=>total+x.counts.total,0);
          if(sum!==counts.total||new Set(parts.map(x=>x.target)).size!==parts.length)parts=[];
        }
        s.lastConsolidation={atSession:report.atSession,counts,parts};
      }
    }
    // C4: separate practice log. Never interpreted as ordinary assessment or
    // used to reconstruct native entries, evidence, scores or deadlines.
    if(Array.isArray(old.foundationRecalls)){
      const rows=old.foundationRecalls.slice(-1000).filter(ev=>ev&&
        Number.isInteger(ev.session)&&ev.session>=66&&ev.session<=s.completed+1&&
        Array.isArray(ev.answers)&&ev.answers.length>=4&&ev.answers.length<=6&&
        new Set(ev.answers.map(a=>a?.id)).size===ev.answers.length&&
        ev.answers.every(a=>a&&typeof a.id==='string'&&a.id.length<=100&&
          ['correct','wrong','skipped'].includes(a.result)&&
          (a.choice===null||typeof a.choice==='string')&&
          typeof a.assisted==='boolean'&&typeof a.hadFreeError==='boolean'));
      if(new Set(rows.map(ev=>ev.session)).size===rows.length&&rows.length)
        s.foundationRecalls=rows.map(ev=>({session:ev.session,recordedAt:typeof ev.recordedAt==='string'?ev.recordedAt:null,
          answers:ev.answers.map(a=>({id:a.id,result:a.result,choice:a.choice===null?null:a.choice.slice(0,100),
            assisted:a.assisted,hadFreeError:a.hadFreeError,...firstGuessEvidence(a)}))}));
    }
    // Champs facultatifs : les anciennes sauvegardes restent lisibles sans historique reconstruit.
    if(Array.isArray(old.journal)){
      s.journal=old.journal.slice(-1000).filter(event=>
        event&&['parcours','consolidation'].includes(event.mode)&&
        Number.isInteger(event.session)&&event.session>=1&&event.session<=s.completed+1&&
        Array.isArray(event.answers)&&event.answers.length<=20&&event.answers.length>0&&
        event.answers.every(a=>a&&typeof a.id==='string'&&a.id.length<=100&&
          ['correct','wrong','skipped'].includes(a.result)&&
          (a.choice===null||typeof a.choice==='string'))
      ).map(event=>({
        mode:event.mode,session:event.session,
        recordedAt:typeof event.recordedAt==='string'?event.recordedAt:null,
        ...(event.mode==='parcours'&&validOrderReference(event.answers.map(a=>a.id),event.orderReferenceIds)
          ?{orderReferenceIds:event.orderReferenceIds.slice()}:{}),
        answers:event.answers.map(a=>({
          id:a.id,result:a.result,choice:a.choice===null?null:a.choice.slice(0,100),
          assisted:!!a.assisted,hadFreeError:!!a.hadFreeError,...firstGuessEvidence(a),
          theme:typeof a.theme==='string'?a.theme:null,
          difficulty:Number.isInteger(a.difficulty)?a.difficulty:null,
          family:typeof a.family==='string'?a.family:null,
          micro:typeof a.micro==='string'?a.micro:null,
          axis:typeof a.axis==='string'?a.axis:null,
          ...(SELECTION_REASONS.includes(a.selectionReason)&&
            ['nouveau','revision'].includes(a.selectionKind)
            ?{selectionKind:a.selectionKind,selectionReason:a.selectionReason}:{})
        }))
      }));
    }
    s.difficultyAdjustment=Number.isInteger(old.difficultyAdjustment)?
      clamp(old.difficultyAdjustment,-2,2):0;
    if(Array.isArray(old.difficultyFeedback)){
      s.difficultyFeedback=old.difficultyFeedback.filter(f=>f&&
        Number.isInteger(f.session)&&f.session>=1&&f.session<=s.completed&&
        ['increase','same','decrease'].includes(f.choice)).slice(-100)
        .map(f=>({session:f.session,choice:f.choice,
          recordedAt:typeof f.recordedAt==='string'?f.recordedAt:null}));
    }
    return s;
  }
  // Old observations are never regraded. Move only incompatible evidence
  // out of the live scoring journal, with exact original rows kept in the
  // archive. Old non-reconstructible aggregate buckets are conservatively
  // restarted, not fabricated by replaying an incomplete journal.
  function applyAudit3000Revision(s,raw){
    if(!audit3000Enabled)return s;
    let old=raw;if(typeof raw==='string'){try{old=JSON.parse(raw)}catch(_){old=null}}
    if(!old||old.version!==VERSION)return s;
    if(old.audit3000Revision===AUDIT3000_REVISION){
      const archive=old.audit3000Archive;
      if(archive&&typeof archive==='object'&&!Array.isArray(archive)&&archive.revision===AUDIT3000_REVISION)
        s.audit3000Archive=JSON.parse(JSON.stringify(archive));
      return s;
    }
    const risk=id=>Object.hasOwn(AUDIT3000_RISK,id);
    const touched=new Set(),archive={revision:AUDIT3000_REVISION,completedAtMigration:s.completed,
      entries:{},journal:[],foundationRecalls:[],active:null,aggregates:{skills:{},micros:{},axes:{}}};
    function note(id){if(risk(id))touched.add(id);}
    for(const [id,r] of Object.entries(s.entries))if(risk(id)){
      note(id);archive.entries[id]=r;delete s.entries[id];
    }
    function filterRows(rows,store,order){
      return (rows||[]).flatMap((event,index)=>{
        const removed=event.answers.filter(a=>risk(a.id));
        if(!removed.length)return [event];
        removed.forEach(a=>note(a.id));store.push({index,event});
        const answers=event.answers.filter(a=>!risk(a.id));
        if(!answers.length)return [];
        const copy={...event,answers};
        if(order&&Array.isArray(copy.orderReferenceIds))
          copy.orderReferenceIds=copy.orderReferenceIds.filter(id=>!risk(id));
        return [copy];
      });
    }
    s.journal=filterRows(s.journal,archive.journal,true);
    if(s.foundationRecalls){
      // A foundation recall is an indivisible 4-6-card historical event.
      // Keep its exact record in the archive if any card was revised.
      s.foundationRecalls=s.foundationRecalls.filter((event,index)=>{
        const ids=event.answers.filter(a=>risk(a.id)).map(a=>a.id);
        if(!ids.length)return true;
        ids.forEach(note);archive.foundationRecalls.push({index,event});return false;
      });
    }
    if(s.active){
      const stale=Object.keys(s.active.answers).filter(i=>risk(s.active.ids[Number(i)]));
      if(stale.length){
        archive.active=JSON.parse(JSON.stringify(s.active));
        for(const i of stale){note(s.active.ids[Number(i)]);delete s.active.answers[i];}
        // Keep the deck and unaffected answers. Present the first revised
        // unanswered card again rather than showing an obsolete correction.
        const first=s.active.ids.findIndex((_,i)=>!Object.hasOwn(s.active.answers,i));
        if(first>=0)s.active.index=first;
      }
    }
    // A legacy aggregate can contain earlier attempts even if a recent
    // entry was superseded. The affected question buckets are known from
    // the exact old and new catalogue. Do not touch unrelated buckets.
    const buckets=new Set([...touched].flatMap(id=>AUDIT3000_RISK[id]));
    for(const key of buckets){
      for(const field of ['skills','micros','axes'])if(Object.hasOwn(s[field],key)){
        archive.aggregates[field][key]=s[field][key];delete s[field][key];
      }
    }
    if(s.active&&touched.size&&s.active.orderSkillBase){
      if(!archive.active)archive.active=JSON.parse(JSON.stringify(s.active));
      delete s.active.orderSkillBase;delete s.active.orderSkillRecordedIds;
    }
    if(touched.size)s.audit3000Archive=archive;
    return s;
  }
  function load(raw){return applyAudit3000Revision(loadObserved(raw),raw);}
  function themeFloor(exercises,theme){
    const values=exercises.filter(x=>x.theme===theme).map(x=>x.difficulty);
    return values.length?Math.min(...values):1;
  }
  function levelFor(state,exercises,theme){
    return Math.max(themeFloor(exercises,theme),state.skills[theme]?.level||1);
  }
  function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}

  // Une seule porte d'entrée pédagogique, partagée par parcours et consolidation.
  const FOUNDATIONS=['ouv','majeur','mineur','sa','red','second','stayman'];
  const openingPass=q=>q.theme==='ouv'&&bid(q)==='Passe';
  const simplePass=q=>openingPass(q)&&q.difficulty===1&&Number.isInteger(q.h)&&q.h<12;
  const weakAnswer=a=>a.result!=='correct'||a.assisted||a.hadFreeError;
  function metadata(q){
    const m=prerequis?.schema==='QPJB_PREREQUIS_V1'&&prerequis.byId&&Object.hasOwn(prerequis.byId,q.id)&&prerequis.byId[q.id];
    if(!m||typeof m.concept!=='string'||!m.concept||!Number.isInteger(m.stage)||m.stage<0||m.stage>3||
       !Number.isInteger(m.minSession)||m.minSession<0||!Array.isArray(m.requires)||
       m.requires.some(r=>!r||typeof r.concept!=='string'||!Number.isInteger(r.minExposure)||r.minExposure<1))
      return null;
    // Visa pédagogique 26/11 : ces soutiens simples réguliers à trois
    // atouts introduisent le fit 5-3, au lieu d'exiger un fit déjà vu.
    // Les autres prérequis du catalogue et les situations avancées restent intacts.
    if(['SEF-028-2','SEF-028-1','SEF-N048-3','SEF-N048-1','SEF-N053-2','SEF-N053-1','SEF-C-006'].includes(q.id)&&
      majorThree(q)&&q.difficulty<=2&&m.concept==='majeur.soutien'&&m.minSession===1)
      return {...m,stage:0,requires:m.requires.filter(r=>r.concept!=='majeur.soutien')};
    return m;
  }
  function evidence(state,exercises){
    const byId=new Map(exercises.map(q=>[q.id,q]));
    const seen=new Map(),basic=new Map(),proofs=new Map(),lastTheme={},lastFamily={},lastConcept={};
    const weakConcept={},weakContext={},localHistory=new Map();
    const recent=[];
    function add(map,key,value){if(!map.has(key))map.set(key,new Set());map.get(key).add(value)}
    function observe(q,a,s){
      const m=metadata(q);if(!m)return;
      add(seen,m.concept,q.id);
      if(!localHistory.has(m.concept))localHistory.set(m.concept,[]);
      localHistory.get(m.concept).push({family:family(q),difficulty:q.difficulty,session:s,weak:weakAnswer(a),skipped:a.result==='skipped'});
      if(q.difficulty<=3)add(basic,m.concept,family(q));
      if(!weakAnswer(a)){
        if(!proofs.has(m.concept))proofs.set(m.concept,[]);
        proofs.get(m.concept).push({family:family(q),difficulty:q.difficulty,session:s});
      }
      lastTheme[q.theme]=Math.max(lastTheme[q.theme]??-1,s);
      lastConcept[m.concept]=Math.max(lastConcept[m.concept]??-1,s);
    }
    for(const event of state.journal||[]){
      if(event.mode!=='parcours'||event.session>state.completed)continue;
      for(const a of event.answers||[]){
        const q=byId.get(a.id);if(!q)continue;
        observe(q,a,event.session-1);
        if(event.session>state.completed-5)recent.push({q,a,s:event.session-1});
      }
    }
    // Les sauvegardes anciennes sans journal ne prouvent pas de maîtrise fine.
    // Une entrée ordinaire explicitement évaluée constitue une exposition unique,
    // sans extrapoler son nombre de répétitions ni un succès indépendant.
    for(const q of exercises){
      const r=state.entries?.[q.id];if(!r)continue;
      lastFamily[family(q)]=Math.max(lastFamily[family(q)]??-1,r.lastSession);
      lastTheme[q.theme]=Math.max(lastTheme[q.theme]??-1,r.lastSession);
      const m=metadata(q);
      if(m&&r.assessment&&r.assessment.lastSession<state.completed){
        add(seen,m.concept,q.id);
        if(q.difficulty<=3)add(basic,m.concept,family(q));
        lastConcept[m.concept]=Math.max(lastConcept[m.concept]??-1,r.assessment.lastSession);
      }
    }
    for(const {q,a,s} of recent){
      if(!weakAnswer(a))continue;
      const m=metadata(q),w=6-(state.completed-s);
      if(m)weakConcept[m.concept]=(weakConcept[m.concept]||0)+w;
      weakContext[context(q)]=(weakContext[context(q)]||0)+w;
    }
    const byConcept=new Map();
    for(const q of exercises){
      const m=metadata(q);
      if(!m)continue;
      if(!byConcept.has(m.concept))byConcept.set(m.concept,[]);
      byConcept.get(m.concept).push(q);
    }
    const localTargets=new Map(),localFragility=new Map();
    for(const [key,items] of byConcept){
      const floor=Math.min(...items.map(q=>q.difficulty));
      const history=localHistory.get(key)||[];
      const sessions=[...new Set(history.map(r=>r.session))].slice(-6);
      const recentLocal=history.filter(r=>sessions.includes(r.session));
      const clean=recentLocal.filter(r=>!r.weak);
      const weakSessions=new Set(recentLocal.filter(r=>r.weak&&!r.skipped).map(r=>r.session));
      const lastWeak=Math.max(-1,...weakSessions);
      const recovery=clean.filter(r=>r.session>lastWeak);
      const cleanSessions=new Set(recovery.map(r=>r.session));
      const weak=weakSessions.size>=2&&cleanSessions.size<2;
      let target=floor;
      if(recovery.length){
        // Three sessions and two families for promotion; isolated successes
        // or assisted attempts never increase the target.
        for(let level=floor;level<5;level++){
          const atLevel=recovery.filter(r=>r.difficulty>=level);
          if(new Set(atLevel.map(r=>r.session)).size>=3&&new Set(atLevel.map(r=>r.family)).size>=2)
            target=Math.max(target,level+1);
          else if(new Set(atLevel.map(r=>r.session)).size>=2&&new Set(atLevel.map(r=>r.family)).size>=2)
            target=Math.max(target,level);
        }
      }
      if(weak)target=Math.max(floor,target-1);
      localTargets.set(key,target);
      if(weak)localFragility.set(key,{lastWeak,weakSessions:weakSessions.size});
    }
    return {seen,basic,proofs,byConcept,lastTheme,lastFamily,lastConcept,weakConcept,weakContext,recent,localTargets,localFragility};
  }
  function evaluate(q,state,e){
    const s=state.completed,m=metadata(q),reasons=[];
    if(!Object.hasOwn(INTRO,q.theme)||!Number.isInteger(q.difficulty)||q.difficulty<1||q.difficulty>5)
      reasons.push('catalogue-invalid');
    if(!m)return {eligible:false,reasons:[...reasons,'prerequisite-metadata-missing']};
    if(s<INTRO[q.theme]||s<m.minSession)reasons.push('calendar');
    if(q.theme==='ouv'&&bid(q)==='2♣'&&s<INTRO.fortes)reasons.push('strong-opening');
    if(s===0&&q.theme!=='ouv')reasons.push('first-openings-only');
    if(s===0&&q.theme==='ouv'&&(!['1♣','1♦','1♥','1♠','1SA','Passe'].includes(bid(q))||
      q.difficulty!==1||(openingPass(q)&&!simplePass(q))))reasons.push('first-basic-opening');
    for(const r of m.requires){
      if((e.seen.get(r.concept)?.size||0)<r.minExposure)
        reasons.push('exposure:'+r.concept+':'+r.minExposure);
    }
    const lower=key=>(e.byConcept.get(key)||[]).filter(v=>v.difficulty<q.difficulty);
    if(q.difficulty>=4){
      const threshold=q.difficulty===5?3:2;
      const floor=q.difficulty===5?Math.max(18,(INTRO[q.theme]||0)+5):Math.max(8,(INTRO[q.theme]||0)+3);
      if(s<floor)reasons.push('difficulty-calendar');
      // La notion peut être nouvelle mais avancée : seules les dépendances
      // explicites de M1 peuvent alors fournir les fondamentaux.
      const keys=lower(m.concept).length?[m.concept]:[...new Set(m.requires.map(r=>r.concept))];
      const available=new Set(keys.flatMap(key=>lower(key).map(family)));
      const proof=keys.flatMap(key=>(e.proofs.get(key)||[]).filter(p=>p.difficulty<q.difficulty));
      const families=new Set(proof.map(p=>p.family));
      const sessions=new Set(proof.map(p=>p.session));
      const exposed=keys.some(key=>lower(key).some(v=>e.seen.get(key)?.has(v.id)));
      const ownBasics=(e.byConcept.get(m.concept)||[]).filter(v=>v.difficulty<=3&&metadata(v).stage<=1);
      if(!available.size||!exposed||(ownBasics.length&&!ownBasics.some(v=>e.seen.get(m.concept)?.has(v.id))))
        reasons.push('difficulty-foundation');
      // Plusieurs bonnes réponses d'une même séance ne suffisent pas.
      // Si une seule famille élémentaire existe, des séances indépendantes
      // successives permettent néanmoins de progresser.
      if(!available.size||families.size<Math.min(threshold,available.size)||sessions.size<threshold)
        reasons.push('difficulty-independent');
    }else if(q.difficulty===3&&m.stage>=1&&lower(m.concept).length&&
      !lower(m.concept).some(v=>e.seen.get(m.concept)?.has(v.id)))
      reasons.push('difficulty-foundation');
    return {eligible:reasons.length===0,reasons};
  }
  function eligibility(q,state,exercises){return evaluate(q,state,evidence(state,exercises))}
  // Lecture seule pour le coordinateur M2/M3 : cibles locales, fragilités
  // et preuves historiques distinctes. Ni statut acquis, ni autorisation
  // d'ignorer eligibility(). Ne persiste aucune donnée supplémentaire.
  function adaptiveDiagnostics(state,exercises){
    const e=evidence(state,exercises);
    return [...e.localTargets].map(([concept,target])=>{
      const proof=e.proofs.get(concept)||[],fragility=e.localFragility.get(concept);
      return {concept,target,adjustedTarget:clamp(target+(state.difficultyAdjustment||0),1,5),
        fragile:!!fragility,lastWeak:fragility?.lastWeak??null,
        weakSessions:fragility?.weakSessions??0,exposedIds:e.seen.get(concept)?.size||0,
        proofFamilies:new Set(proof.map(r=>r.family)).size,
        proofSessions:new Set(proof.map(r=>r.session)).size};
    });
  }
  function eligiblePool(exercises,state,e=evidence(state,exercises)){
    // Une erreur d'intégration ne doit jamais devenir un accès par défaut.
    if(exercises.some(q=>!metadata(q)))throw Error('QPJB: prérequis manquants ou invalides (catalogue incomplet)');
    return exercises.filter(q=>evaluate(q,state,e).eligible);
  }
  function passWeakness(state,e){
    if((state.micros?.['ouv:passe']?.score||0)<0)return true;
    return e.recent.some(({q,s})=>openingPass(q)&&state.completed-s<=3&&
      state.entries?.[q.id]&&weakAnswer(state.entries[q.id]));
  }
  const minorMajor4=q=>q.theme==='mineur'&&q.auction?.length===1&&((bid(q)==='1♥'&&q.shape?.[1]===4)||(bid(q)==='1♠'&&q.shape?.[0]===4));
  const minorNotrump=q=>q.theme==='mineur'&&q.auction?.length===1&&bid(q)==='1SA'&&q.shape?.[0]<4&&q.shape?.[1]<4;
  const majorSupport=q=>q.theme==='majeur'&&/^1[♥♠]$/.test(opener(q))&&/^[2-7][♥♠]$/.test(bid(q))&&bid(q)[1]===opener(q)[1];
  const majorThree=q=>majorSupport(q)&&q.auction?.length===1&&bid(q)==='2'+opener(q)[1]&&q.shape?.[opener(q)==='1♠'?0:1]===3;
  const minorSupport=q=>q.theme==='mineur'&&/^1[♣♦]$/.test(opener(q))&&/^[2-7][♣♦]$/.test(bid(q))&&bid(q)[1]===opener(q)[1];
  const openBid=q=>q.theme==='ouv'&&!openingPass(q);
  // Les Passes sont une alternative de base, pas des questions de fin de séance.
  // Bornes en positions (1-indexées), pas une séquence de réponses imposée.
  // Même décision naturelle, transposée dans une autre couleur : éviter
  // les exercices miroirs successifs sans confondre les enchères codées.
  function decisionPattern(q,mode){
    const o=opener(q),a=bid(q);
    if(q.auction?.length===1){
      if(majorSupport(q))return 'fit-majeur|'+a[0];
      if(minorSupport(q))return 'fit-mineur|'+a[0];
      if(q.theme==='mineur'&&/^1[♣♦]$/.test(o)&&/^1[♥♠]$/.test(a))return 'reponse-majeure-sur-mineure';
      if(q.theme==='mineur'&&/^1[♣♦]$/.test(o)&&a==='1SA')return 'reponse-sa-sur-mineure';
      if(q.theme==='majeur'&&/^1[♥♠]$/.test(o)&&a==='1SA')return 'reponse-sa-sur-majeure';
    }
    if(mode==='legacy')return '';
    const concept=metadata(q)?.concept;
    if(!concept||!a)return '';
    const sequence=[...(Array.isArray(q.auction)?q.auction:[]),a]
      .map(v=>String(v).replace(/[\uFE0E\uFE0F]/g,'').trim().replace(/\s+/g,' ')).join('|');
    // Seulement les concepts naturels : ne jamais transformer un Texas,
    // une réponse au Blackwood ou une enchère conventionnelle en son miroir.
    // Les ouvertures mineures restent contrastées (meilleure mineure).
    const natural=/^(ouv\.majeure|mineur\.base|mineur\.soutien|majeur\.soutien|majeur\.base|red\.base|red\.bicolore|second\.base|intervenir\.base|apres_inter\.base|reponse_inter\.base|reveil\.base|apres_fit\.base|barrage\.ouverture|barrage\.reponse)$/.test(concept);
    const variants=[sequence];
    if(natural)for(let mask=1;mask<4;mask++){
      variants.push(sequence.replace(/[♥♠♣♦]/g,c=>({
        '♥':mask&1?'♠':'♥','♠':mask&1?'♥':'♠',
        '♣':mask&2?'♦':'♣','♦':mask&2?'♣':'♦'
      })[c]));
    }
    return concept+'|'+variants.sort()[0];
  }
  function passDeadlines(s,count,length){
    if(!count||s>2||length!==10)return [];
    return (s===0?[2,5,7]:[4,7]).slice(0,count);
  }
  function passOrderOK(deck,s){
    if(s>2||deck.length!==10)return true;
    const positions=deck.flatMap((q,i)=>openingPass(q)?[i+1]:[]);
    if(s===0&&(positions.length!==3||deck.some(q=>openingPass(q)&&!simplePass(q))))return false;
    if(s===1&&(!positions.length||positions.length>2))return false;
    if(s===2&&positions.length>1)return false;
    const deadlines=passDeadlines(s,positions.length,deck.length);
    return positions.every((pos,i)=>pos<=deadlines[i]&&(!i||pos-positions[i-1]>=2));
  }
  // Sélection et ordre indépendants. Les bornes de Passe sont dures ;
  // les autres critères d'alternance restent des coûts souples.
  function logicalOrder(items,state,exerciseOf=x=>x.exercise){
    if(items.length<2)return items.slice();
    const s=state.completed;
    const salt=s+'|'+items.map(x=>exerciseOf(x).id).sort().join('|')+'|'+
      (state.journal||[]).slice(-2).map(ev=>referenceAnswers(ev).map(a=>a.result+Number(!!a.assisted)).join('')).join('|');
    const earlyOrder=s===1&&items.length===10&&items.filter(x=>openBid(exerciseOf(x))).length>=2;
    const totalPass=items.filter(x=>openingPass(exerciseOf(x))).length;
    const deadlines=passDeadlines(s,totalPass,items.length);
    const features=items.map(x=>{
      const q=exerciseOf(x);
      return {q,pattern:decisionPattern(q),concept:metadata(q)?.concept||'',
        answer:bid(q),shape:Array.isArray(q.shape)?q.shape.join(','):'',
        kind:x.kind||x.target||''};
    });
    const mixedKinds=new Set(features.map(x=>x.kind).filter(Boolean)).size>1;
    const priorityCounts=order=>{
      let exact=0,triples=0;
      for(let i=1;i<order.length;i++){
        const a=exerciseOf(order[i]),b=exerciseOf(order[i-1]);
        if(bid(a)===bid(b))exact++;
        if(s>0&&i>1&&a.theme===b.theme&&b.theme===exerciseOf(order[i-2]).theme)triples++;
      }
      return {exact,triples};
    };
    function search(mode='m4'){
    const legacy=mode==='legacy',wide=mode==='wide';
    let beam=[{seq:[],mask:0,cost:0,tie:0}];
    // Les sessions normales ont dix questions ; limite explicite pour API n<=20.
    for(let pos=0;pos<items.length;pos++){
      const next=[];
      for(const node of beam){
        const last=node.seq.length?exerciseOf(items[node.seq.at(-1)]):null,prev=node.seq.length>1?exerciseOf(items[node.seq.at(-2)]):null;
        const usedPass=node.seq.filter(i=>openingPass(exerciseOf(items[i]))).length;
        for(let i=0;i<items.length;i++){
          if(node.mask&(1<<i))continue;
          const q=exerciseOf(items[i]),pass=openingPass(q);
          if(earlyOrder&&pos<2&&!openBid(q))continue;
          // Introduire chaque type de réponse simple avant le premier fit,
          // pas toutes ses variantes : sinon les deux fits miroir sont
          // mécaniquement repoussés en fin de séance.
          if(earlyOrder&&majorSupport(q)&&[minorMajor4,minorNotrump].some(test=>
            items.some(v=>test(exerciseOf(v)))&&!node.seq.some(j=>test(exerciseOf(items[j])))))continue;
          if(deadlines.length){
            if(pass&&last&&openingPass(last))continue;
            const used=usedPass+Number(pass);
            // Un choix n'est admissible que si chaque Passe restant peut
            // encore respecter sa borne et la séparation entre deux Passes.
            const remainingFeasible=deadlines.slice(used).every((deadline,k)=>
              pos+2+Number(pass)+2*k<=deadline);
            if(!remainingFeasible||used<deadlines.filter(d=>d<=pos+1).length)continue;
          }else if(s===0&&totalPass&&items.length>=totalPass*2-1){
            if(pos===2&&!usedPass&&!pass)continue;
            if(pass&&last&&openingPass(last))continue;
            if(totalPass-usedPass-Number(pass)>Math.ceil((items.length-pos-1-Number(pass))/2))continue;
          }
          let c=0;
          const f=features[i],l=features[node.seq.at(-1)],p=features[node.seq.at(-2)],
            pp=features[node.seq.at(-3)];
          if(last){
            if(f.answer===l.answer)c+=legacy?100:wide?30000:300;
            if(legacy){
              const pattern=decisionPattern(q,'legacy');
              if(pattern&&pattern===decisionPattern(last,'legacy'))c+=100;
            }else{
            if(f.pattern&&f.pattern===l.pattern)c+=150;
            // Une deuxième main proche reste utile, mais pas immédiatement
            // ni après un seul exercice lorsque la séance offre une alternative.
            if(p&&f.pattern&&f.pattern===p.pattern)c+=18;
            if(p&&f.concept&&f.concept===l.concept&&f.concept===p.concept)c+=10;
            // Ne pas substituer un rythme ABAB mécanique à un bloc monotone.
            if(s>0&&pp&&q.theme===p.q.theme&&last.theme===pp.q.theme&&q.theme!==last.theme)c+=7;
            // Motifs intacts ; pénalité faible seulement sur les séries de 3.
            if(s>0&&mixedKinds&&p&&f.kind&&f.kind===l.kind&&f.kind===p.kind)c+=3;
            }
            if(s>0&&q.theme===last.theme)c+=3;
            if(s>0&&prev&&q.theme===last.theme&&q.theme===prev.theme)c+=legacy?100:wide?30000:300;
            if(q.h===last.h&&Number.isInteger(q.h))c+=8;
            if(f.shape&&f.shape===l.shape)c+=7;
            if(context(q)===context(last)&&opener(q))c+=5;
            if(s===0&&prev&&openingPass(prev)&&!openingPass(last)&&pass)c+=4;
          }
          next.push({seq:[...node.seq,i],mask:node.mask|(1<<i),cost:node.cost+c,
            tie:hash(salt+'|'+node.seq.join(',')+'|'+q.id)});
        }
      }
      if(!next.length){
        if(deadlines.length)throw Error('QPJB: ordre des Passes impossible');
        return items.slice();
      }
      next.sort((a,b)=>a.cost-b.cost||a.tie-b.tie);
      beam=next.slice(0,wide?192:48);
    }
    return beam[0].seq.map(i=>items[i]);
    }
    let ordered=search();
    let quality=priorityCounts(ordered);
    // Garder les anciennes garanties en priorité. Une recherche de secours
    // n'est utile que si la première solution présente une collision.
    if(quality.exact||quality.triples){
      const previous=search('legacy'),prior=priorityCounts(previous);
      if(quality.exact>prior.exact||quality.triples>prior.triples){
        ordered=previous;quality=prior;
      }
      if(quality.exact||quality.triples){
        const expanded=search('wide'),next=priorityCounts(expanded);
        if(next.exact<=quality.exact&&next.triples<=quality.triples&&
          next.exact+next.triples<quality.exact+quality.triples)ordered=expanded;
      }
    }
    return ordered;
  }
  // #528 — teacher-led curriculum. Generated from the three independently
  // reviewed plans; native eligibility, scoring, evidence and persistence remain.
  const PROGRAMME65=[{"o":"Décider Passe ou ouverture au palier de un selon H/HL, majeure cinquième, meilleure mineure et zone 1SA.","g":[["objectif",["SEF-013-1","SEF-N023-1","SEF-Q26-M1-003","SEF-V49-003","SEF-Q26-M1-002","SEF-Q400-A-001","SEF-Q400-A-003","SEF-Q400-A-004","SEF-Q400-A-005","SEF-Q400-A-006","SEF-Q400-A-007","SEF-Q685-A-009","SEF-Q685-A-010","SEF-Q685-A-011","SEF-Q685-A-012","SEF-Q685-A-013"],"initial"],["objectif",["SEF-012-1","SEF-N007-1","SEF-N005-1","SEF-009-1","SEF-Q400-A-009","SEF-Q400-A-010","SEF-Q400-A-011","SEF-Q400-A-012","SEF-Q400-A-013","SEF-Q400-A-014","SEF-Q400-A-015","SEF-Q685-A-014","SEF-Q685-A-015","SEF-Q685-A-016","SEF-Q685-A-017","SEF-Q685-A-018","SEF-Q685-A-019","SEF-Q685-A-020","SEF-Q685-A-021","SEF-Q685-A-022","SEF-Q685-A-023","SEF-Q685-A-024","SEF-Q685-A-025","SEF-Q685-A-026","SEF-Q685-A-027","SEF-Q685-A-028"],"initial"],["objectif",["SEF-006-2","SEF-007-2","SEF-V44-003","SEF-Q400-A-018","SEF-Q400-A-019","SEF-Q400-A-021","SEF-Q400-A-022","SEF-Q685-A-029","SEF-Q685-A-030","SEF-Q685-A-031","SEF-Q685-A-032","SEF-Q685-A-033","SEF-Q685-A-034","SEF-Q685-A-035"],"initial"],["objectif",["SEF-001-1","SEF-002-3","SEF-003-2","SEF-Q400-B-001","SEF-Q400-B-002","SEF-Q400-B-003","SEF-Q400-B-089","SEF-Q685-B-001","SEF-Q685-B-002","SEF-Q685-B-003","SEF-Q685-B-004","SEF-Q685-B-005","SEF-Q685-B-006"],"initial"]],"r":["SEF-013-1","SEF-N023-1","SEF-Q26-M1-003","SEF-012-1","SEF-N007-1","SEF-N005-1","SEF-009-1","SEF-006-2","SEF-007-2","SEF-003-2"]},{"o":"Choisir une première réponse naturelle; reconnaître un fit majeur 5–3 sans le confondre avec une ouverture.","g":[["objectif",["SEF-015-1","SEF-016-3","SEF-020-3","SEF-024-2","SEF-Q400-A-026","SEF-Q400-A-028","SEF-Q400-A-029","SEF-Q400-A-030","SEF-Q400-A-031","SEF-Q400-A-032","SEF-Q400-A-033","SEF-Q400-A-034","SEF-Q685-A-038","SEF-Q685-A-039","SEF-Q685-A-040","SEF-Q685-A-041","SEF-Q685-A-042","SEF-Q685-A-043","SEF-Q685-A-044","SEF-Q685-A-045","SEF-Q685-A-046","SEF-Q685-A-047","SEF-Q685-A-048","SEF-Q685-A-049","SEF-Q685-A-050","SEF-Q685-A-051","SEF-Q685-A-052","SEF-Q685-A-053","SEF-Q685-A-054","SEF-Q685-A-055","SEF-Q685-A-056","SEF-Q685-A-057","SEF-Q685-A-058","SEF-Q685-A-059","SEF-Q685-A-060"],"initial"],["objectif",["SEF-V410-022","SEF-PN26-M1-005","SEF-N048-3","SEF-028-2","SEF-N068-1","SEF-Q400-A-036","SEF-Q400-A-037","SEF-Q400-A-038","SEF-Q685-A-061","SEF-Q685-A-062","SEF-Q685-A-063","SEF-Q685-A-064","SEF-PN26-M1-006"],"initial"],["rappel",["SEF-012-1","SEF-N007-1","SEF-006-2"],"initial"],["reserve",["SEF-Q400-A-035","SEF-Q685-A-036","SEF-Q685-A-037"],"extension_conditionnelle"]],"r":["SEF-012-1","SEF-N007-1","SEF-015-1","SEF-016-3","SEF-020-3","SEF-024-2","SEF-V410-022","SEF-PN26-M1-005","SEF-028-2","SEF-N068-1"]},{"o":"Distinguer fit insuffisant, soutien simple et soutien invitant à quatre atouts; choisir une réponse sans fit.","g":[["objectif",["SEF-PN26-M1-021","SEF-N048-3","SEF-030-1","SEF-V49-010","SEF-Q400-A-043","SEF-Q400-A-045","SEF-Q685-A-070","SEF-Q685-A-071","SEF-Q685-A-072","SEF-Q685-A-073","SEF-028-2","SEF-PN26-M1-032"],"initial"],["objectif",["SEF-027-1","SEF-V44-010","SEF-V44-009","SEF-Q400-A-046","SEF-Q400-A-047","SEF-Q400-A-048","SEF-Q400-A-049","SEF-Q400-A-050","SEF-Q685-A-074","SEF-Q685-A-075","SEF-Q685-A-076","SEF-Q685-A-077","SEF-Q685-A-078","SEF-Q685-A-079"],"initial"],["objectif",["SEF-V410-022","SEF-N061-2","SEF-N068-1","SEF-Q400-A-039","SEF-Q400-A-040","SEF-Q400-A-041","SEF-Q685-A-065","SEF-Q685-A-066","SEF-Q685-A-067","SEF-Q685-A-068","SEF-Q685-A-069","SEF-N064-2","SEF-N064-3","SEF-N065-2","SEF-N066-1","SEF-N066-3","SEF-N067-1","SEF-N074-1","SEF-N074-3","SEF-N075-2","SEF-N075-1","SEF-N076-2","SEF-N076-1","SEF-N077-1","SEF-N077-3","SEF-N078-2","SEF-N079-2","SEF-N079-1","SEF-V49-012","SEF-Q26-M1-012","V2-M1-034","V2-M1-035","V2-M1-036"],"initial"],["objectif",["SEF-N045-1","SEF-N045-3","SEF-V44-008","SEF-V49-008","SEF-V419-003","V2-M1-023"],"apres_exposition"],["rappel",["SEF-015-1","SEF-020-3","SEF-Q26-M1-003"],"initial"]],"r":["SEF-PN26-M1-021","SEF-N048-3","SEF-027-1","SEF-V44-010","SEF-V410-022","SEF-N061-2","SEF-N068-1","SEF-015-1","SEF-020-3","SEF-Q26-M1-003"]},{"o":"Sur 1SA sans majeure à rechercher, choisir Passe/2SA/3SA; distinguer en rappel l'ouverture de 2SA (20–21 H).","g":[["objectif",["SEF-N088-1","SEF-N091-3","SEF-033-1","SEF-031-2","SEF-032-1","SEF-Q400-B-007","SEF-Q400-B-008","SEF-Q400-B-010","SEF-Q400-B-011","SEF-Q685-B-009","SEF-Q685-B-010","SEF-Q685-B-011","SEF-Q685-B-012","SEF-Q685-B-013","SEF-Q685-B-014","SEF-Q685-B-015","SEF-Q685-B-087","SEF-Q685-B-088"],"initial"],["objectif",["SEF-V44-005","SEF-V44-006","SEF-V44-007","SEF-V49-033","SEF-V49-034","SEF-V49-035","V2-M1-026","V2-M1-027","V2-M1-028"],"apres_exposition"],["transition",["SEF-004-1","SEF-005-1"],"initial"],["rappel",["SEF-002-1","SEF-001-1","SEF-012-1","SEF-Q26-M1-003","SEF-PN26-M1-005","SEF-020-3","SEF-N068-1"],"initial"]],"r":["SEF-N088-1","SEF-N091-3","SEF-033-1","SEF-004-1","SEF-002-1","SEF-012-1","SEF-Q26-M1-003","SEF-PN26-M1-005","SEF-020-3","SEF-N068-1"]},{"o":"Choisir la redemande minimale de l'ouvreur selon régularité, sixième ou soutien quatrième.","g":[["objectif",["SEF-044-1","SEF-N117-1","SEF-Q400-A-052","SEF-Q685-A-099","SEF-Q685-A-100","SEF-Q685-A-101","SEF-N124-1","SEF-V49-018","SEF-V49-037"],"initial"],["objectif",["SEF-048-1","SEF-050-2","SEF-Q400-A-056","SEF-Q685-A-104","SEF-Q685-A-105","SEF-Q685-A-106","SEF-V49-036"],"initial"],["objectif",["SEF-N106-1","SEF-V49-021","SEF-N107-2","SEF-Q400-A-060","SEF-Q400-A-061","SEF-Q400-A-062","SEF-Q685-A-108","SEF-Q685-A-109","SEF-Q685-A-110","SEF-V49-042"],"initial"],["rappel",["SEF-V410-022","SEF-PN26-M1-005","SEF-N091-3","SEF-033-1","SEF-015-1","SEF-020-3"],"initial"]],"r":["SEF-044-1","SEF-048-1","SEF-N107-2","SEF-V49-021","SEF-V410-022","SEF-PN26-M1-005","SEF-N091-3","SEF-033-1","SEF-015-1","SEF-020-3"]},{"o":"Utiliser le Texas majeur après 1SA avec main faible, sans minimum H, pour viser une partielle.","g":[["objectif",["SEF-037-1","SEF-N082-2","SEF-V44-015","SEF-Q400-B-022","SEF-Q685-B-032"],"initial"],["objectif",["SEF-038-1","SEF-N085-1","SEF-V44-016","SEF-Q400-B-023","SEF-Q685-B-035"],"initial"],["rappel",["SEF-031-2","SEF-032-1","SEF-033-1","SEF-044-1","SEF-048-1","SEF-N106-1"],"initial"]],"r":["SEF-037-1","SEF-038-1","SEF-N082-2","SEF-V44-016","SEF-031-2","SEF-032-1","SEF-033-1","SEF-044-1","SEF-048-1","SEF-N106-1"]},{"o":"Choisir Stayman sur 1SA avec majeure quatrième et valeurs d'invitation/manche; distinguer Texas et enchère quantitative.","g":[["objectif",["SEF-034-1","SEF-035-2","SEF-036-1","SEF-N094-3","SEF-Q400-B-019","SEF-Q400-B-020","SEF-Q400-B-021","SEF-Q685-B-022","SEF-Q685-B-023"],"initial"],["transfert",["SEF-039-2","SEF-040-2","SEF-Q400-B-024","SEF-Q685-B-034","SEF-Q685-B-037"],"initial"],["rappel",["SEF-032-1","SEF-033-1","SEF-037-1","SEF-038-1","SEF-044-1","SEF-PN26-M1-005","SEF-Q400-B-012"],"initial"]],"r":["SEF-034-1","SEF-035-2","SEF-036-1","SEF-039-2","SEF-040-2","SEF-032-1","SEF-033-1","SEF-037-1","SEF-044-1","SEF-PN26-M1-005"]},{"o":"Répondre au Stayman de 1SA selon nombre de majeures quatrièmes; quatre réponses SEF, quatrième réponse conditionnelle.","g":[["objectif",["SEF-V3-011-1","SEF-V3-013-4","SEF-V3-015-1","SEF-Q400-B-026","SEF-Q400-B-027","SEF-Q400-B-028","SEF-Q685-B-029","SEF-Q685-B-030"],"initial"],["objectif",["SEF-V416-007","SEF-Q400-B-029","SEF-Q685-B-031"],"apres_trois_cas"],["rappel",["SEF-034-1","SEF-035-2","SEF-037-1","SEF-038-1","SEF-044-1","SEF-N106-1","SEF-032-1"],"initial"]],"r":["SEF-V3-011-1","SEF-V3-013-4","SEF-V3-015-1","SEF-V416-007","SEF-034-1","SEF-037-1","SEF-038-1","SEF-044-1","SEF-N106-1","SEF-032-1"]},{"o":"Sur ouverture 2SA choisir partielle/manche; après soutien majeur simple reconnaître ouverture minimale et essai de manche.","g":[["rappel",["SEF-005-1","SEF-001-1","SEF-Q400-B-004","SEF-Q400-B-005","SEF-Q400-B-006","SEF-Q400-B-090","SEF-Q685-B-007","SEF-Q685-B-008","SEF-Q685-B-084","SEF-Q685-B-085","SEF-Q685-B-086"],"initial"],["objectif",["SEF-N097-3","SEF-041-2","SEF-Q400-B-013","SEF-Q400-B-015","SEF-Q400-B-016","SEF-Q400-B-017","SEF-Q685-B-016","SEF-Q685-B-017","SEF-Q685-B-018","SEF-Q685-B-019","SEF-Q685-B-020"],"initial"],["objectif",["SEF-V4-001-1","SEF-V4-013-3","SEF-Q400-A-081","SEF-Q400-A-082","SEF-Q685-A-151"],"initial"],["objectif",["SEF-V4-002-1","SEF-V4-014-1","SEF-Q400-A-085","SEF-Q400-A-086","SEF-Q685-A-152","SEF-Q685-A-153","SEF-Q685-A-156","SEF-Q685-A-157"],"apres_exposition"],["transition",["SEF-V4-007-1","SEF-V4-019-1"],"report_S10"],["rappel",["SEF-PN26-M1-021","SEF-N048-3","SEF-033-1","SEF-048-1","SEF-N106-1"],"initial"]],"r":["SEF-005-1","SEF-N097-3","SEF-041-2","SEF-V4-001-1","SEF-V4-002-1","SEF-PN26-M1-021","SEF-N048-3","SEF-033-1","SEF-048-1","SEF-N106-1"]},{"o":"Après Stayman ou Texas sur 1SA, choisir partielle, invitation ou manche selon fit et force.","g":[["objectif",["SEF-V3-001-1","SEF-V3-002-1","SEF-Q400-B-030","SEF-Q400-B-031","SEF-Q685-B-043","SEF-Q685-B-046"],"initial"],["objectif",["SEF-V3-005-1","SEF-V3-006-3","SEF-Q400-B-032","SEF-Q400-B-033","SEF-Q685-B-041","SEF-Q685-B-042"],"initial"],["objectif",["SEF-V3-017-2","SEF-V3-018-1","SEF-V44-026","SEF-V44-028","SEF-V3-019-3","SEF-V3-020-1","SEF-Q400-B-034","SEF-Q400-B-035","SEF-Q400-B-036","SEF-Q400-B-037","SEF-Q400-B-038","SEF-Q685-B-051","SEF-Q685-B-052","SEF-Q685-B-053"],"initial"],["rappel",["SEF-V4-002-1","SEF-V4-007-1","SEF-V4-001-1","SEF-Q400-A-087","SEF-Q400-A-088","SEF-L09-028"],"initial"]],"r":["SEF-V3-001-1","SEF-V3-002-1","SEF-V3-005-1","SEF-V3-006-3","SEF-V3-017-2","SEF-V44-026","SEF-V44-028","SEF-V3-018-1","SEF-V4-002-1","SEF-V4-007-1"]},{"o":"Reconnaître le bicolore économique (retour au palier de deux) et décider ensuite en tant que répondant.","g":[["objectif",["SEF-042-2","SEF-049-1","SEF-Q400-A-064","SEF-Q400-A-065","SEF-Q685-A-112","SEF-Q685-A-113","SEF-Q685-A-114","SEF-Q685-A-116","SEF-Q685-A-117","SEF-Q685-A-118"],"initial"],["objectif",["SEF-051-1","SEF-N126-1","SEF-Q400-A-067","SEF-Q685-A-120","SEF-Q685-A-121","SEF-Q685-A-122","SEF-Q685-A-124","SEF-Q685-A-125","SEF-Q685-A-126","SEF-V410-001"],"apres_exposition"],["objectif",["SEF-V49-022","SEF-V49-025","SEF-Q400-A-074","SEF-Q685-A-128","SEF-Q685-A-129"],"initial"],["objectif",["SEF-052-3","SEF-054-1","SEF-Q400-A-075","SEF-Q400-A-077","SEF-Q685-A-085","SEF-Q685-A-094","SEF-Q685-A-098","SEF-052-1","SEF-054-2"],"apres_exposition"],["rappel",["SEF-048-1","SEF-044-1","SEF-N106-1","SEF-V410-022","SEF-Q400-A-057","SEF-Q400-A-058","SEF-N132-1","SEF-N133-2"],"initial"]],"r":["SEF-042-2","SEF-049-1","SEF-051-1","SEF-V49-022","SEF-052-3","SEF-054-1","SEF-048-1","SEF-044-1","SEF-N106-1","SEF-V410-022"]},{"o":"Distinguer 2SA essai de l'ouvreur et 2SA fitté direct du répondant; accepter ou refuser l'invitation.","g":[["objectif",["SEF-V4-009-1","SEF-V4-010-1","SEF-V416-006","SEF-V421-012","SEF-V423-003","SEF-Q400-A-093","SEF-Q400-A-095","SEF-Q685-A-159","SEF-Q685-A-160","SEF-Q685-A-163","SEF-Q685-A-164","SEF-Q685-A-165","SEF-Q685-A-166","SEF-Q685-A-167","SEF-Q685-A-168","SEF-Q685-A-169","SEF-Q685-A-170","V2-M3-033","V2-M3-034","SEF-V423-002"],"initial"],["objectif",["SEF-N051-2","SEF-N056-1","SEF-PN26-M1-022","SEF-Q685-A-131","SEF-Q685-A-132","SEF-Q685-A-134","SEF-Q685-A-135","SEF-Q685-A-136","SEF-Q685-A-137","SEF-Q685-A-138","SEF-PN26-M1-023"],"initial"],["objectif",["SEF-V486-007","SEF-V486-008","SEF-Q400-A-099","SEF-Q400-A-100","SEF-Q685-A-140","SEF-Q685-A-141","SEF-Q685-A-142","SEF-Q685-A-143","SEF-Q685-A-144","SEF-Q685-A-145","SEF-Q685-A-146","SEF-Q685-A-147","SEF-Q685-A-148","SEF-Q685-A-149","SEF-Q685-A-150"],"apres_exposition"],["rappel",["V2-M1-039","SEF-V4-002-1","SEF-032-1","SEF-V44-010","SEF-N048-3"],"initial"]],"r":["SEF-V4-009-1","SEF-V4-010-1","SEF-N051-2","SEF-N056-1","SEF-V486-007","SEF-V486-008","V2-M1-039","SEF-V4-002-1","SEF-032-1","SEF-V44-010"]},{"o":"Transposer Stayman/Texas à 2SA en zone de manche; distinguer la rectification fittée sur 2SA de celle de 1SA.","g":[["objectif",["SEF-N101-3","SEF-N102-2","SEF-Q400-B-039","SEF-Q400-B-040","SEF-Q685-B-025","SEF-Q685-B-026","SEF-Q685-B-027"],"initial"],["objectif",["SEF-N104-1","SEF-N105-1","SEF-Q400-B-041","SEF-Q400-B-042","SEF-Q685-B-038","SEF-Q685-B-039","SEF-Q685-B-040"],"initial"],["objectif",["SEF-L40-001","SEF-L41-001","SEF-L43-005","SEF-L38-001","SEF-Q400-B-043","SEF-Q400-B-091","SEF-Q400-B-092","SEF-Q400-B-093","SEF-Q685-B-089","SEF-Q685-B-090","SEF-Q685-B-091","SEF-Q685-B-092","SEF-Q685-B-093","SEF-Q685-B-094","SEF-Q685-B-095","SEF-Q685-B-096","SEF-Q685-B-097"],"apres_exposition"],["objectif",["SEF-Q26-M2-008","SEF-L23-006","SEF-Q26-M2-009","SEF-Q400-B-025","SEF-Q400-B-094","SEF-Q685-B-049","SEF-Q685-B-098","SEF-Q685-B-099","SEF-Q685-B-100","SEF-Q685-B-101","SEF-Q685-B-102","SEF-Q685-B-103","SEF-Q685-B-104","SEF-Q685-B-106"],"apres_exposition"],["rappel",["SEF-041-2","SEF-N097-3","SEF-V3-017-2","SEF-V44-028","SEF-034-1","SEF-039-2","SEF-Q400-B-018"],"initial"]],"r":["SEF-N101-3","SEF-N104-1","SEF-N105-1","SEF-L40-001","SEF-L41-001","SEF-L43-005","SEF-L38-001","SEF-Q26-M2-008","SEF-L23-006","SEF-V3-017-2"]},{"o":"Identifier le Texas mineur sur 1SA : 2♠ Trèfle, 3♣ Carreau, avec longue et main faible.","g":[["objectif",["SEF-V482-001","SEF-V482-002","SEF-Q26-M2-005","SEF-PN26-M1-011","SEF-Q400-B-045","SEF-Q400-B-046","SEF-Q400-B-095","SEF-Q400-B-096","SEF-Q685-B-060","SEF-Q685-B-061","SEF-Q685-B-062","SEF-Q685-B-063","SEF-Q685-B-115","SEF-Q685-B-116","SEF-Q685-B-161"],"initial"],["transition",["SEF-L25-008","SEF-L37-004"],"report_S15"],["rappel",["SEF-037-1","SEF-038-1","SEF-034-1","SEF-V3-017-2","SEF-032-1","SEF-N106-1","SEF-048-1"],"initial"]],"r":["SEF-V482-001","SEF-V482-002","SEF-Q26-M2-005","SEF-037-1","SEF-038-1","SEF-034-1","SEF-V3-017-2","SEF-032-1","SEF-N106-1","SEF-048-1"]},{"o":"Réinvestir les enchères naturelles et les conventions déjà introduites; terminer une rectification mineure reportée, sans convention indépendante nouvelle.","g":[["objectif",["SEF-032-1","SEF-N094-3","SEF-039-2","SEF-V3-001-1","SEF-V44-026","SEF-L06-017","SEF-L06-018","SEF-Q26-M1-014","V2-M1-038","V2-M1-044"],"initial"],["objectif",["SEF-044-1","SEF-048-1","SEF-N106-1","SEF-052-3","SEF-054-1","SEF-051-1","SEF-V49-041","SEF-V49-020","SEF-045-1","SEF-N120-1"],"initial"],["objectif",["SEF-PN26-M1-021","SEF-N048-3","SEF-Q26-M1-003","SEF-V44-003"],"initial"],["transition",["SEF-L25-008","SEF-L37-004","SEF-Q400-B-047","SEF-Q400-B-048","SEF-Q400-B-097","SEF-Q685-B-064","SEF-Q685-B-065","SEF-Q685-B-066","SEF-Q685-B-067","SEF-Q685-B-119","SEF-Q685-B-120","SEF-Q685-B-121"],"initial"],["transition",["SEF-V486-007","SEF-V486-008","SEF-L40-001","SEF-Q26-M2-008","V2-M3-039","V2-M3-040"],"initial"]],"r":["SEF-032-1","SEF-N094-3","SEF-039-2","SEF-044-1","SEF-048-1","SEF-N106-1","SEF-052-3","SEF-054-1","SEF-L25-008","SEF-L37-004"]},{"o":"Décider intervenir naturellement ou passer après ouverture adverse; longueur, qualité, force et palier.","g":[["objectif",["SEF-V3-027-2","SEF-V3-031-2","SEF-V3-035-4","SEF-Q400-C-001","SEF-Q400-C-002","SEF-Q400-C-003","SEF-Q400-C-004","SEF-Q685-C-001","SEF-V3-028-1","SEF-V3-036-1","SEF-L27-002","V2-M4-013","V2-M4-015","V2-M4-019"],"initial"],["objectif",["SEF-V3-051-3","SEF-V3-052-1","SEF-Q400-C-005","SEF-Q400-C-006","SEF-Q685-C-003","SEF-Q685-C-004","SEF-V3-055-2","SEF-L27-001","SEF-Q26-M4-005","V2-M4-007","V2-M4-012","V2-M4-016","V2-M4-018"],"initial"],["objectif",["SEF-V3-037-1","SEF-Q400-C-007","SEF-Q400-C-008","SEF-Q400-C-009","SEF-Q685-C-002","SEF-V3-038-4","V2-M4-017"],"apres_exposition"],["rappel",["SEF-006-2","SEF-Q26-M1-003","SEF-N048-3","SEF-044-1","SEF-032-1"],"initial"],["reserve",["SEF-Q400-C-010","SEF-Q685-C-005","SEF-V3-043-3","V2-M4-011"],"extension_conditionnelle"]],"r":["SEF-V3-027-2","SEF-V3-035-4","SEF-V3-051-3","SEF-V3-052-1","SEF-V3-037-1","SEF-006-2","SEF-Q26-M1-003","SEF-N048-3","SEF-044-1","SEF-032-1"]},{"o":"Choisir un contre d'appel plutôt qu'une intervention naturelle, puis répondre au contre au palier approprié.","g":[["objectif",["SEF-V3-047-4","SEF-V3-049-2","SEF-V3-050-1","SEF-Q400-C-026","SEF-Q400-C-027","SEF-Q400-C-028","SEF-Q685-C-028","SEF-Q685-C-029","V2-M4-014"],"initial"],["objectif",["SEF-V3-057-1","SEF-V3-058-3","SEF-Q400-C-030","SEF-Q400-C-031","SEF-Q400-C-032","SEF-Q400-C-034","SEF-Q685-C-030","SEF-Q685-C-031","SEF-Q685-C-032","SEF-Q685-C-079","SEF-Q685-C-080","SEF-Q685-C-160","SEF-V3-057-4","SEF-V3-063-1","V2-M4-021","V2-M4-022"],"initial"],["objectif",["SEF-V3-065-3","SEF-Q400-C-036","SEF-Q400-C-037","SEF-Q400-C-038","SEF-Q685-C-036","SEF-Q685-C-037","SEF-Q685-C-038","SEF-Q685-C-039","SEF-Q685-C-159","SEF-V3-068-4","V2-M4-024","V2-M4-025","V2-M4-026"],"apres_exposition"],["rappel",["SEF-V3-031-2","SEF-V3-035-4","SEF-V3-051-3","SEF-N048-3"],"initial"],["reserve",["SEF-Q400-C-035","SEF-Q685-C-033","SEF-Q685-C-034","SEF-Q685-C-035"],"extension_conditionnelle"],["reserve",["SEF-Q400-C-039","SEF-Q685-C-040","SEF-Q685-C-081","SEF-Q685-C-157","SEF-Q685-C-158","SEF-V3-072-1","V2-M4-027","V2-M4-028"],"extension_conditionnelle"]],"r":["SEF-V3-047-4","SEF-V3-049-2","SEF-V3-057-1","SEF-V3-058-3","SEF-V3-065-3","SEF-V3-031-2","SEF-V3-035-4","SEF-V3-051-3","SEF-N048-3","SEF-V3-050-1"]},{"o":"Répondre à l'intervention naturelle du partenaire : soutien simple, Passe, SA avec arrêt ou nouvelle couleur naturelle.","g":[["objectif",["SEF-V4-025-2","SEF-V4-027-1","SEF-V4-029-1","SEF-Q400-C-014","SEF-Q400-C-015","SEF-Q685-C-013","SEF-Q685-C-014"],"initial"],["objectif",["SEF-V4-028-1","SEF-Q400-C-016","SEF-Q400-C-017","SEF-Q685-C-015"],"initial"],["objectif",["SEF-V413-009","SEF-Q400-C-018","SEF-Q685-C-016","SEF-Q685-C-078","SEF-L30-003"],"apres_exposition"],["rappel",["SEF-V3-057-1","SEF-V3-035-4","SEF-PN26-M1-005","SEF-N048-3","SEF-032-1"],"initial"],["reserve",["SEF-Q400-C-019","SEF-Q685-C-017","SEF-V4-026-4","SEF-V4-034-4"],"extension_conditionnelle"]],"r":["SEF-V4-025-2","SEF-V4-027-1","SEF-V4-028-1","SEF-V413-009","SEF-V4-029-1","SEF-V3-057-1","SEF-V3-035-4","SEF-PN26-M1-005","SEF-N048-3","SEF-032-1"]},{"o":"Après intervention adverse sur notre ouverture, choisir soutien, réponse naturelle ou contre Spoutnik selon séquence.","g":[["objectif",["SEF-V3-074-3","SEF-V44-041","SEF-V413-011","SEF-V3-085-3","SEF-Q400-C-047","SEF-Q400-C-048","SEF-Q400-C-049","SEF-Q400-C-050","SEF-Q400-C-051","SEF-Q400-C-052","SEF-Q400-C-053","SEF-Q400-C-055","SEF-Q400-C-056","SEF-Q685-C-052","SEF-Q685-C-053","SEF-Q685-C-054","SEF-Q685-C-055","SEF-Q685-C-056","SEF-Q685-C-057","SEF-Q685-C-059","SEF-Q685-C-060","SEF-Q685-C-061","SEF-Q685-C-088","SEF-Q685-C-089","SEF-V44-042","SEF-V410-028","SEF-V411-013","SEF-V425-006"],"initial"],["objectif",["SEF-V410-025","SEF-Q400-C-054","SEF-Q685-C-058","SEF-Q685-C-090"],"apres_exposition"],["objectif",["SEF-V410-026","SEF-V417-010","SEF-Q400-C-057","SEF-Q400-C-058","SEF-Q685-C-062","SEF-Q685-C-063","SEF-Q685-C-091","SEF-Q685-C-092","SEF-V412-018"],"apres_exposition"],["rappel",["SEF-V3-047-4","SEF-V3-057-1","SEF-V4-025-2","SEF-V410-022","SEF-N048-3"],"initial"],["reserve",["SEF-Q400-C-059","SEF-Q685-C-064","SEF-Q685-C-065","SEF-V410-027","SEF-V3-086-2"],"extension_conditionnelle"],["reserve",["SEF-Q400-C-060","SEF-Q685-C-066","SEF-Q685-C-067"],"extension_conditionnelle"]],"r":["SEF-V3-074-3","SEF-V44-041","SEF-V413-011","SEF-V410-025","SEF-V410-026","SEF-V3-047-4","SEF-V3-057-1","SEF-V4-025-2","SEF-V410-022","SEF-N048-3"]},{"o":"Distinguer bicolore économique et cher selon coût de la préférence et force; répondre sans passer au bicolore cher.","g":[["objectif",["SEF-V44-020","SEF-V410-007","V1-M1-001","SEF-Q400-A-068","SEF-Q400-A-070","SEF-Q685-A-081","SEF-Q685-A-082","SEF-Q685-A-083","SEF-Q685-A-084","SEF-Q685-A-086","SEF-Q685-A-087","SEF-Q685-A-088","SEF-Q685-A-091","SEF-Q685-A-093","SEF-Q685-A-096","SEF-Q685-A-097"],"initial"],["objectif",["SEF-L15-001","SEF-L15-002","SEF-L15-003","SEF-L16-001","SEF-Q400-A-078","SEF-Q400-A-080","SEF-Q685-A-103","SEF-Q685-A-107","SEF-Q685-A-111","SEF-Q685-A-115","SEF-Q685-A-119","SEF-Q685-A-123","SEF-Q685-A-127","SEF-Q685-A-130","V2-M3-019","V2-M3-020","V2-M3-021","V2-M3-022"],"apres_exposition"],["rappel",["SEF-049-1","SEF-051-1","SEF-052-3","SEF-054-1","SEF-048-1","SEF-V412-006","SEF-V413-002","SEF-V425-001","V2-M3-031","V2-M3-032","SEF-V410-012","SEF-V410-013","SEF-V412-009"],"initial"]],"r":["SEF-V44-020","SEF-V410-007","V1-M1-001","SEF-L15-001","SEF-L15-002","SEF-L16-001","SEF-049-1","SEF-051-1","SEF-052-3","SEF-054-1"]},{"o":"Choisir ouverture naturelle, barrage ou Passe","g":[["objectif",["SEF-V3-091-1","SEF-V3-092-3","SEF-V3-101-2","SEF-Q400-C-067","SEF-Q400-C-068","SEF-Q400-C-069","SEF-Q400-C-070","SEF-Q400-C-073","SEF-Q685-C-095","SEF-Q685-C-096","SEF-Q685-C-097","SEF-Q685-C-098","SEF-Q685-C-163","SEF-Q685-C-164","SEF-Q685-C-165","V2-M5-015"],""],["objectif",["SEF-V3-099-3","SEF-V3-100-2","SEF-Q400-C-071","SEF-Q400-C-072","SEF-Q685-C-099","V2-M5-013","V2-M5-016"],""],["objectif",["SEF-V419-001","SEF-V422-002","SEF-Q26-M1-004","SEF-Q400-A-023","SEF-Q400-A-024","SEF-Q400-A-025","SEF-Q685-A-001","SEF-Q685-A-002","SEF-Q685-A-003","SEF-Q685-A-004","SEF-Q685-A-005","SEF-Q685-A-006","SEF-Q685-A-007","SEF-Q685-A-008","SEF-Q685-C-100","SEF-Q685-C-101","V2-M5-014","SEF-Q400-C-073"],""],["reserve",["SEF-V3-095-1","SEF-V3-096-2","SEF-V44-046","SEF-V44-047"],""]],"r":["SEF-006-2","SEF-007-1","SEF-013-1","SEF-V3-091-1","SEF-V3-092-3","SEF-V3-101-2","SEF-V3-099-3","SEF-V3-100-2","SEF-V419-001","SEF-V422-002"]},{"o":"Répondre au deux faible selon fit, force et projet","g":[["objectif",["SEF-V3-103-4","SEF-V3-104-4","SEF-V426-003","SEF-L09-023","SEF-Q400-C-074","SEF-Q400-C-075","SEF-Q400-C-076","SEF-Q400-C-077","SEF-Q685-C-102","SEF-Q685-C-103","SEF-Q685-C-104","SEF-Q685-C-105","SEF-Q685-C-106","SEF-Q685-C-107","SEF-V3-105-3","V2-M5-019","V2-M5-020"],""],["objectif",["SEF-V486-001","SEF-V486-003","SEF-Q400-C-078","SEF-Q400-C-079","SEF-Q685-C-108","SEF-Q685-C-109","SEF-Q685-C-110"],""],["reserve",["SEF-V3-107-1"],""]],"r":["SEF-V3-091-1","SEF-V3-099-3","SEF-026-3","SEF-V3-074-3","SEF-V3-103-4","SEF-V3-104-4","SEF-V426-003","SEF-L09-023","SEF-V486-001","SEF-V486-003"]},{"o":"Agir sur deux faible : couleur, contre d'appel, SA ou Passe","g":[["objectif",["SEF-V470-007","SEF-V470-008","SEF-V470-009","SEF-V470-010","SEF-V470-011","SEF-Q400-C-011","SEF-Q400-C-012","SEF-Q400-C-013","SEF-Q400-C-029","SEF-Q685-C-006","SEF-Q685-C-007","SEF-Q685-C-008","SEF-Q685-C-009","SEF-Q685-C-010","SEF-Q685-C-011","SEF-Q685-C-012","SEF-Q685-C-073","SEF-Q685-C-074","SEF-Q685-C-075","SEF-Q685-C-076","SEF-Q685-C-077","SEF-Q26-M4-006"],""],["objectif",["SEF-V476-001","SEF-V476-002","SEF-Q400-C-040","SEF-Q400-C-041","SEF-Q400-C-042","SEF-Q685-C-041","SEF-Q685-C-042","SEF-Q685-C-043","SEF-Q685-C-044","SEF-Q685-C-082","SEF-Q685-C-083","V2-M4-029","V2-M4-030","V2-M4-031","V2-M4-032"],""],["reserve",["SEF-V476-008","SEF-V476-003","SEF-V476-005","SEF-Q400-C-043","SEF-Q400-C-044","SEF-Q400-C-045","SEF-Q400-C-046","SEF-Q685-C-045","SEF-Q685-C-046","SEF-Q685-C-047","SEF-Q685-C-048","SEF-Q685-C-049","SEF-Q685-C-050","SEF-Q685-C-051","SEF-Q685-C-084","SEF-Q685-C-085","SEF-Q685-C-086","SEF-Q685-C-087"],""]],"r":["SEF-V3-057-1","SEF-V3-058-3","SEF-V3-027-2","SEF-V470-007","SEF-V470-008","SEF-V470-009","SEF-V470-010","SEF-V470-011","SEF-V476-001","SEF-V476-002"]},{"o":"Reconnaître le réveil et sélectionner une action proportionnée au palier","g":[["objectif",["SEF-V4-048-1","SEF-V4-065-1","SEF-V4-053-3","SEF-Q400-C-033","SEF-Q400-C-080","SEF-Q400-C-081","SEF-Q400-C-082","SEF-Q400-C-083","SEF-Q685-C-111","SEF-Q685-C-112","SEF-Q685-C-113","SEF-Q685-C-114","SEF-Q685-C-115","SEF-Q685-C-116","SEF-Q685-C-117","SEF-Q685-C-118","SEF-Q685-C-119","SEF-Q685-C-120","SEF-Q685-C-121","SEF-L32-003","V2-M4-008","V2-M4-020","SEF-V44-060"],""],["objectif",["V2-M4-001","V2-M4-002","V2-M4-005","SEF-Q400-C-084","SEF-Q400-C-085","SEF-Q685-C-122","SEF-Q685-C-123","SEF-Q685-C-124","SEF-Q685-C-125","SEF-Q685-C-126","SEF-Q685-C-127","SEF-Q685-C-128","SEF-Q685-C-131"],""],["reserve",["SEF-V4-050-2","SEF-L10-018","SEF-Q26-M4-004","V2-M4-004"],""]],"r":["SEF-V470-007","SEF-V470-010","SEF-V3-031-2","SEF-V476-001","SEF-V4-048-1","SEF-V4-065-1","SEF-V4-053-3","V2-M4-001","V2-M4-002","V2-M4-005"]},{"o":"Distinguer 2SA fitté après intervention naturelle et Truscott après Contre","g":[["objectif",["SEF-V3-075-3","SEF-V3-082-1","SEF-Q400-C-086","SEF-Q400-C-087","SEF-Q400-C-088","SEF-Q400-C-089","SEF-Q400-C-090","SEF-Q685-C-132","SEF-Q685-C-133","SEF-Q685-C-134","SEF-Q685-C-135","SEF-Q685-C-136","SEF-Q685-C-137","SEF-Q685-C-138","SEF-Q685-C-139","SEF-Q685-C-140","SEF-Q685-C-141","SEF-Q685-C-142","SEF-V3-075-2","SEF-V425-008","SEF-V473-005","SEF-V473-006","SEF-V473-007","SEF-V473-008","SEF-L06-007","SEF-L13-009","SEF-L22-004","SEF-L26-004","SEF-L26-005","SEF-L33-004","V2-M5-001","V2-M5-003","V2-M5-004","V2-M5-011","V2-M5-012"],""],["objectif",["SEF-V470-005","SEF-V470-006","SEF-V44-045","SEF-Q400-C-091","SEF-Q400-C-092","SEF-Q400-C-093","SEF-Q685-C-143","SEF-Q685-C-144","SEF-Q685-C-145","SEF-Q685-C-146","SEF-Q685-C-166","SEF-Q685-C-167","SEF-Q685-C-168","SEF-V44-043","SEF-V413-012","SEF-V422-003","SEF-V470-004","SEF-V485-003","SEF-V485-008","SEF-L13-007","SEF-L14-015","SEF-L14-016","SEF-L22-003","SEF-L24-002","SEF-L28-007","SEF-L43-001","SEF-L44-003","V2-M5-002"],""],["reserve",["SEF-V3-081-3","SEF-V3-083-1","SEF-L42-001","V2-M5-005","V2-M5-010"],""],["reserve",["SEF-Q400-C-094","SEF-Q400-C-095","SEF-Q400-C-096","SEF-Q685-C-147","SEF-Q685-C-148","SEF-Q685-C-149","SEF-Q685-C-150","SEF-Q685-C-169","SEF-V472-001","SEF-V472-002","SEF-V472-003","SEF-V485-001","SEF-V485-002","SEF-V485-011","SEF-L09-003"],"extension_conditionnelle"]],"r":["SEF-N051-2","SEF-V3-074-3","SEF-V3-078-3","SEF-026-3","SEF-V4-025-2","SEF-V3-075-3","SEF-V3-082-1","SEF-V470-005","SEF-V470-006","SEF-V44-045"]},{"o":"Identifier si la redemande de l'ouvreur est libre ou forcée après intervention","g":[["objectif",["SEF-V471-001","SEF-V471-002","SEF-V471-003","SEF-V471-004","SEF-Q400-C-061","SEF-Q400-C-062","SEF-Q400-C-063","SEF-Q400-C-064","SEF-Q400-C-065","SEF-Q685-C-068","SEF-Q685-C-069","SEF-Q685-C-070","SEF-Q685-C-071","SEF-Q685-C-072","SEF-Q685-C-093","SEF-Q685-C-094","SEF-Q685-C-162","SEF-L32-002","V2-M3-017","V2-M3-018"],""],["objectif",["V2-M3-013","V2-M3-014","SEF-Q400-C-066","SEF-Q685-C-161"],""],["reserve",["SEF-V471-005","SEF-V471-006","SEF-L32-001","V2-M3-015","V2-M3-016","SEF-Q26-M5-010","V1-M1-003","V2-M5-007","V2-M5-008"],""],["reserve",["SEF-Q400-C-020","SEF-Q400-C-021","SEF-Q400-C-022","SEF-Q400-C-024","SEF-Q400-C-025","SEF-Q685-C-018","SEF-Q685-C-019","SEF-Q685-C-020","SEF-Q685-C-021","SEF-Q685-C-022","SEF-Q685-C-026","SEF-Q685-C-027"],"extension_conditionnelle"],["reserve",["SEF-Q400-C-023","SEF-Q685-C-023","SEF-Q685-C-024","SEF-Q685-C-025"],"extension_conditionnelle"],["reserve",["SEF-Q400-C-097","SEF-Q400-C-098","SEF-Q400-C-099","SEF-Q400-C-100","SEF-Q685-C-151","SEF-Q685-C-152","SEF-Q685-C-153","SEF-Q685-C-154","SEF-Q685-C-155","SEF-Q685-C-156","SEF-Q685-C-170","SEF-Q26-M5-003","SEF-Q26-M5-004","V1-M3-005","V1-M3-006","V1-M3-007"],"extension_conditionnelle"],["reserve",["SEF-L29-002","SEF-L29-003"],"consolidation"]],"r":["SEF-044-1","SEF-048-1","SEF-V3-074-3","SEF-V3-027-2","SEF-V471-001","SEF-V471-002","SEF-V471-003","SEF-V471-004","V2-M3-013","V2-M3-014"]},{"o":"Adapter la réponse de l'ouvreur à un contre d'entame sur Stayman ou Texas","g":[["objectif",["SEF-L25-001","SEF-L25-002","SEF-L25-003","SEF-Q400-B-009","SEF-Q685-B-033","SEF-Q685-B-036","SEF-Q685-B-044","SEF-Q685-B-056"],""],["objectif",["SEF-L25-004","SEF-L25-005","SEF-L25-006","SEF-Q400-B-014","SEF-Q685-B-057","SEF-Q685-B-058","SEF-Q685-B-059"],""],["reserve",["SEF-PN26-M1-017","SEF-PN26-M1-027","V2-M2-039","V2-M2-040","SEF-Q685-B-047"],""],["reserve",["SEF-Q400-B-098","SEF-Q685-B-117","SEF-Q685-B-118"],"extension_conditionnelle"]],"r":["SEF-034-1","SEF-V3-011-1","SEF-037-1","SEF-038-1","SEF-L25-001","SEF-L25-002","SEF-L25-003","SEF-L25-004","SEF-L25-005","SEF-L25-006"]},{"o":"Choisir la manche après Stayman ou Texas sur ouverture 2SA","g":[["objectif",["SEF-V3-021-2","SEF-V3-023-2","SEF-V3-024-1","SEF-Q685-B-048","SEF-Q685-B-050","SEF-Q685-B-105","SEF-Q685-B-107","SEF-Q685-B-109","SEF-Q685-B-110","SEF-Q685-B-111"],""],["objectif",["SEF-V3-025-1","SEF-V3-026-1","SEF-Q26-M2-022","SEF-Q400-B-044","SEF-Q685-B-021","SEF-Q685-B-028","SEF-Q685-B-045","SEF-Q685-B-054","SEF-Q685-B-055","SEF-Q685-B-108","SEF-Q685-B-112","SEF-Q685-B-113","SEF-Q685-B-114"],""],["reserve",[],""],["reserve",["SEF-Q400-B-049","SEF-Q400-B-050","SEF-Q400-B-051","SEF-Q685-B-068","SEF-Q685-B-122","SEF-Q685-B-123","SEF-Q685-B-163","SEF-Q685-B-164"],"extension_conditionnelle"],["reserve",["SEF-Q400-B-052","SEF-Q685-B-124","SEF-Q685-B-125","SEF-Q685-B-162"],"extension_conditionnelle"],["reserve",["SEF-Q400-B-053","SEF-Q400-B-054","SEF-Q685-B-069","SEF-Q685-B-126","SEF-Q685-B-127","SEF-Q685-B-128","SEF-Q685-B-129","SEF-Q685-B-130"],"extension_conditionnelle"],["reserve",["SEF-Q400-B-099"],"extension_conditionnelle"]],"r":["SEF-L23-006","SEF-L39-001","SEF-L40-001","SEF-L38-001","SEF-V3-021-2","SEF-V3-023-2","SEF-V3-024-1","SEF-V3-025-1","SEF-V3-026-1","SEF-Q26-M2-022"]},{"o":"Déclencher le Roudi après 1m–1M–1SA si le soutien troisième reste utile","g":[["objectif",["SEF-V4-073-1","SEF-V4-079-3","SEF-Q400-B-055","SEF-Q400-B-056","SEF-Q400-B-057","SEF-Q400-B-058","SEF-Q685-B-070","SEF-Q685-B-071","SEF-Q685-B-074","SEF-Q685-B-131","SEF-Q685-B-132","SEF-Q685-B-133"],""],["objectif",["V2-M6-001","SEF-V4-074-3","SEF-V4-075-2","SEF-V4-080-4","SEF-Q400-B-059","SEF-Q400-B-060","SEF-Q400-B-061","SEF-Q400-B-062","SEF-Q685-B-072","SEF-Q685-B-073","SEF-Q685-B-134","SEF-Q685-B-135","SEF-Q685-B-136"],""],["reserve",[],""]],"r":["SEF-044-1","SEF-052-3","SEF-V49-022","SEF-048-1","SEF-V4-073-1","SEF-V4-079-3","V2-M6-001","SEF-V4-074-3","SEF-V4-075-2","SEF-V4-080-4"]},{"o":"Choisir Drury fitté ou réponse naturelle après un Passe initial","g":[["objectif",["SEF-V4-098-1","SEF-V4-104-1","SEF-Q26-M6-007","SEF-Q400-B-075","SEF-Q400-B-077","SEF-Q400-B-100","SEF-Q685-B-080","SEF-Q685-B-146","SEF-Q685-B-147","SEF-Q685-B-165","SEF-Q685-B-166"],""],["objectif",["SEF-V4-099-2","SEF-V4-100-2","SEF-V4-105-2","V2-M6-008","SEF-Q400-B-076","SEF-Q400-B-078","SEF-Q400-B-079","SEF-Q685-B-081","SEF-Q685-B-082","SEF-Q685-B-148","SEF-Q685-B-149","SEF-Q685-B-150","SEF-Q685-B-151"],""],["reserve",[],""],["reserve",["SEF-Q400-B-080","SEF-Q400-B-081","SEF-Q685-B-152","SEF-Q685-B-153","SEF-Q685-B-167"],"extension_conditionnelle"]],"r":["SEF-V419-001","SEF-V422-002","SEF-L01-E-03","SEF-026-3","SEF-V4-098-1","SEF-V4-104-1","SEF-V4-099-2","SEF-V4-100-2","SEF-V4-105-2","V2-M6-008"]},{"o":"Répondre au Roudi à trois réponses en distinguant longueur et force","g":[["objectif",["SEF-V4-076-3","SEF-V4-077-1","SEF-V4-078-1","SEF-Q400-B-063","SEF-Q400-B-064","SEF-Q400-B-065","SEF-Q685-B-075","SEF-Q685-B-076","SEF-Q685-B-077","SEF-Q685-B-139","SEF-Q685-B-140","SEF-Q685-B-141"],""],["objectif",["SEF-V4-082-1","SEF-V4-083-1","SEF-V4-084-1","SEF-Q400-B-066","SEF-Q400-B-067","SEF-Q400-B-068","SEF-Q685-B-078","SEF-Q685-B-079","SEF-Q685-B-137","SEF-Q685-B-138"],""],["reserve",["SEF-V4-089-1","SEF-V4-090-1","SEF-V4-095-2","SEF-V4-096-1"],""]],"r":["SEF-V4-073-1","SEF-V4-074-3","V2-M6-001","SEF-044-1","SEF-V4-076-3","SEF-V4-077-1","SEF-V4-078-1","SEF-V4-082-1","SEF-V4-083-1","SEF-V4-084-1"]},{"o":"Évaluer l'ouverture après Drury et exploiter la réponse 2♦ d'attente","g":[["objectif",["SEF-V4-101-2","SEF-V4-102-1","SEF-V4-107-3","SEF-V4-108-1","SEF-Q400-B-082","SEF-Q400-B-083","SEF-Q400-B-084","SEF-Q400-B-085","SEF-Q685-B-083","SEF-Q685-B-154","SEF-Q685-B-155","SEF-Q685-B-156","SEF-Q685-B-168","SEF-Q685-B-169"],""],["objectif",["SEF-V484-001","SEF-V484-003","SEF-L01-F-02","SEF-Q400-B-086","SEF-Q400-B-087","SEF-Q685-B-159","SEF-Q685-B-170"],""],["reserve",["V2-M6-011","V2-M6-012","SEF-Q685-B-157","SEF-Q685-B-158"],""],["reserve",["SEF-Q400-B-088","SEF-Q685-B-160"],"extension_conditionnelle"]],"r":["SEF-V4-098-1","SEF-V4-099-2","SEF-V4-104-1","SEF-V4-101-2","SEF-V4-102-1","SEF-V4-107-3","SEF-V4-108-1","SEF-V484-001","SEF-V484-003","SEF-L01-F-02"]},{"o":"Choisir 2♣ fort indéterminé, 2♦ forcing de manche ou ouverture naturelle","g":[["objectif",["SEF-V44-002","V2-M6-013","V2-M6-014","SEF-V45-002","SEF-Q400-D-021","SEF-Q400-D-023","SEF-Q685-D-157","SEF-Q685-D-158"],""],["objectif",["SEF-V45-003","SEF-V45-004","SEF-Q400-D-024","SEF-Q685-D-159","SEF-Q685-D-160"],""],["reserve",["SEF-L03-005"],""]],"r":["SEF-004-1","SEF-001-1","SEF-006-2","SEF-013-1","SEF-V44-002","V2-M6-013","V2-M6-014","SEF-V45-002","SEF-V45-003","SEF-V45-004"]},{"o":"Donner le relais ou la réponse aux As après une ouverture forte","g":[["objectif",["SEF-V45-005","SEF-V45-006","SEF-Q400-D-026","SEF-Q400-D-027","SEF-Q685-D-018","SEF-Q685-D-019"],""],["objectif",["SEF-V45-009","SEF-V45-010","SEF-V45-011","SEF-V45-012","SEF-V475-001","SEF-Q400-D-028","SEF-Q400-D-029","SEF-Q400-D-030","SEF-Q685-D-020","SEF-Q685-D-021","SEF-Q685-D-022","SEF-Q685-D-023","SEF-Q685-D-024"],""],["reserve",["SEF-V475-002","SEF-V475-003","SEF-V475-004","SEF-V475-005","SEF-Q685-D-025","SEF-Q685-D-026","SEF-Q685-D-027","SEF-Q685-D-028"],""]],"r":["SEF-V44-002","V2-M6-014","SEF-004-1","SEF-V45-005","SEF-V45-006","SEF-V45-009","SEF-V45-010","SEF-V45-011","SEF-V45-012","SEF-V475-001"]},{"o":"Décrire la main de l'ouvreur après le relais fort","g":[["objectif",["SEF-V45-007","V1-M5-003","SEF-Q400-D-031","SEF-Q400-D-032","SEF-Q685-D-161","SEF-Q685-D-162"],""],["objectif",["V2-M6-019","V2-M6-020","SEF-V475-007","SEF-V45-008","SEF-Q685-D-164"],""],["reserve",[],""]],"r":["SEF-V45-005","SEF-V45-009","SEF-V45-003","V2-M6-014","SEF-V45-007","V1-M5-003","V2-M6-019","V2-M6-020","SEF-V475-007","SEF-V45-008"]},{"o":"Après ouverture forte, décider partielle ou manche","g":[["objectif",["SEF-V475-009","SEF-V475-010","SEF-Q400-D-035","SEF-Q685-D-030","SEF-Q685-D-166"],""],["objectif",["SEF-V486-023","SEF-V486-024","SEF-V486-025","SEF-Q400-D-033","SEF-Q400-D-034","SEF-Q685-D-031","SEF-Q685-D-168"],""],["reserve",["SEF-V487-005","SEF-L24-003","SEF-Q685-D-169"],""]],"r":["SEF-V45-007","V1-M5-003","SEF-V45-009","SEF-V45-005","SEF-L40-001","SEF-V475-009","SEF-V475-010","SEF-V486-023","SEF-V486-024","SEF-V486-025"]},{"o":"Identifier le besoin de troisième couleur forcing et le distinguer d'une enchère naturelle","g":[["objectif",["SEF-Q26-M6-001","SEF-L13-006","SEF-Q400-D-001","SEF-Q400-D-002","SEF-Q400-D-003","SEF-Q685-D-001","SEF-Q685-D-002","SEF-V45-022","SEF-V425-003"],""],["objectif",["SEF-L17-001","SEF-L17-004","SEF-Q400-D-005","SEF-Q685-D-005"],""],["objectif",["SEF-V45-013","SEF-V45-015","SEF-Q400-D-006","SEF-Q685-D-144"],""],["reserve",["SEF-L17-002","SEF-L17-003","SEF-L17-005","SEF-L17-012","SEF-Q685-D-145","SEF-Q685-D-147","SEF-Q685-D-148","SEF-V411-007"],""]],"r":["SEF-048-1","SEF-052-3","SEF-044-1","SEF-V44-020","SEF-Q26-M6-001","SEF-L13-006","SEF-L17-001","SEF-L17-004","SEF-V45-013","SEF-V45-015"]},{"o":"Utiliser la quatrième couleur forcing puis reconnaître les priorités de l'ouvreur","g":[["objectif",["SEF-Q26-M6-002","SEF-Q400-D-008","SEF-Q400-D-009"],""],["objectif",["SEF-V480-001","SEF-Q400-D-011","SEF-Q685-D-008"],""],["objectif",["SEF-V45-016","SEF-Q400-D-019","SEF-Q685-D-007"],""],["objectif",["SEF-V480-003","SEF-V480-011","SEF-Q685-D-010"],""],["reserve",["SEF-V480-007","SEF-V480-010","SEF-V480-005","SEF-Q685-D-149","SEF-Q685-D-150"],""]],"r":["SEF-V45-013","SEF-V45-015","SEF-L13-006","SEF-V44-020","SEF-Q26-M6-001","SEF-Q26-M6-002","SEF-V480-001","SEF-V45-016","SEF-V480-003","SEF-V480-011"]},{"o":"Conclure ou inviter après troisième ou quatrième couleur forcing","g":[["objectif",["SEF-L17-009","SEF-Q26-M3-006","SEF-Q400-D-015","SEF-Q400-D-016","SEF-Q685-D-011"],""],["objectif",["SEF-V486-026","SEF-V486-027","SEF-Q400-D-018","SEF-Q685-D-152"],""],["objectif",["SEF-V486-029","SEF-V486-030","SEF-Q685-D-014","SEF-Q685-D-153"],""],["reserve",["SEF-Q26-M3-005","V2-M6-029","V2-M6-030","V1-M5-005","SEF-Q685-D-012"],""]],"r":["SEF-V45-013","SEF-Q26-M6-002","SEF-V480-001","SEF-V480-003","SEF-L17-009","SEF-Q26-M3-006","SEF-V486-026","SEF-V486-027","SEF-V486-029","SEF-V486-030"]},{"o":"Exploiter le Roudi et distinguer le relais sur 2SA à saut","g":[["objectif",["SEF-V44-062","SEF-V44-063","SEF-V44-064","SEF-V44-065","SEF-Q400-B-069","SEF-Q400-B-070","SEF-Q400-B-071","SEF-Q400-B-072","SEF-Q400-B-073","SEF-Q400-B-074","SEF-Q685-B-142","SEF-Q685-B-143","SEF-Q685-B-144","SEF-Q685-B-145"],""],["objectif",["SEF-Q26-M6-005","SEF-Q26-M6-006","V1-M5-006","SEF-Q400-D-020"],""],["reserve",["V2-M6-031","V2-M6-032"],""]],"r":["SEF-V4-076-3","SEF-V4-083-1","SEF-V4-078-1","SEF-V44-062","SEF-V44-063","SEF-V44-064","SEF-V44-065","SEF-Q26-M6-005","SEF-Q26-M6-006","V1-M5-006"]},{"o":"Sur 1SA adverse, choisir une intervention Multi-Landy d’après les deux longueurs ou l’absence de distribution adaptée.","g":[["objectif",["SEF-V45-023","SEF-V45-024","SEF-Q400-D-041"],""],["objectif",["SEF-V45-025","SEF-V45-026","SEF-C2-001","SEF-Q400-D-043","SEF-Q685-D-043","V2-M5-025","SEF-PN26-M1-013"],""],["objectif",["SEF-C2-002","V2-M5-026","SEF-Q400-D-045","SEF-Q685-D-045","SEF-V45-028"],""],["objectif",["SEF-V45-030","SEF-Q26-M2-004","SEF-Q400-D-047","SEF-Q685-D-037","SEF-Q685-D-039","SEF-C2-003","V2-M5-021","V2-M5-023"],""],["objectif",["V2-M5-022","SEF-Q685-D-040"],""],["rappel",["SEF-V3-027-2"],""],["rappel",["SEF-V3-031-2"],""],["rappel",["SEF-031-2","SEF-031-1"],""],["rappel",["SEF-032-1"],""]],"r":["SEF-V45-023","SEF-V45-025","SEF-C2-002","SEF-V45-026","SEF-V45-030","V2-M5-022","SEF-V3-027-2","SEF-V3-031-2","SEF-031-2","SEF-032-1"]},{"o":"Après le Multi-Landy du partenaire, choisir une préférence faible, un relais ou un passe-ou-corrige explicitement convenu.","g":[["objectif",["SEF-V479-001","SEF-Q400-D-048","SEF-Q685-D-047","SEF-V479-007"],""],["objectif",["SEF-V479-002","SEF-Q685-D-048","SEF-Q685-D-056"],""],["objectif",["SEF-V479-003","SEF-Q400-D-049","SEF-Q685-D-049","SEF-Q685-D-050"],""],["objectif",["SEF-L14-001","SEF-Q685-D-051","SEF-Q685-D-052","SEF-Q26-M2-023"],""],["rappel",["SEF-V45-024","SEF-V45-023","SEF-Q685-D-042"],""],["rappel",["SEF-V45-027","SEF-Q400-D-046","SEF-Q685-D-046"],""],["rappel",["SEF-C2-001","SEF-V45-025","SEF-V45-026"],""],["rappel",["SEF-Q26-M2-004","SEF-V45-030","SEF-Q685-D-038"],""],["rappel",["SEF-V4-048-1","SEF-V4-048-2"],""],["rappel",["SEF-037-1","SEF-039-2"],""],["reserve",["SEF-V479-004","SEF-V479-008"],"consolidation"]],"r":["SEF-V479-001","SEF-V479-002","SEF-V479-003","SEF-L14-001","SEF-V45-024","SEF-V45-027","SEF-C2-001","SEF-Q26-M2-004","SEF-V4-048-1","SEF-037-1"]},{"o":"Sur notre 1SA perturbé, distinguer la réponse disponible au palier de deux du premier transfert Rubensohl.","g":[["objectif",["SEF-V486-017","SEF-Q685-D-057"],""],["objectif",["SEF-V486-018","SEF-V486-019","SEF-Q685-D-058","SEF-Q685-D-059"],""],["objectif",["SEF-L01-C-01","SEF-Q685-D-060"],""],["objectif",["SEF-V486-021","SEF-Q400-D-051","SEF-Q685-D-061"],""],["objectif",["SEF-V479-005","SEF-Q685-D-053","SEF-Q685-D-055"],""],["objectif",["SEF-V479-006","SEF-Q400-D-050","SEF-Q685-D-054","SEF-V479-011"],""],["rappel",["SEF-038-1"],""],["rappel",["SEF-039-2","SEF-037-1"],""],["rappel",["SEF-V3-074-3","SEF-V3-076-3"],""],["rappel",["SEF-V3-078-3","SEF-V3-078-1"],""]],"r":["SEF-V486-017","SEF-V486-018","SEF-L01-C-01","SEF-V486-021","SEF-V479-005","SEF-V479-006","SEF-038-1","SEF-039-2","SEF-V3-074-3","SEF-V3-078-3"]},{"o":"Après une intervention naturelle sur notre 1SA, distinguer transfert rectifiable et Texas impossible, puis décrire majeure ou arrêt.","g":[["rappel",["SEF-C2-004","SEF-V486-021","SEF-V45-032","SEF-Q685-D-062"],""],["rappel",["SEF-C2-006","SEF-Q400-D-056","SEF-Q685-D-063","SEF-Q685-D-064","SEF-Q685-D-066","SEF-V45-033","SEF-V45-039","V2-M5-034"],""],["rappel",["SEF-L01-C-03","SEF-V45-034","SEF-Q400-D-054","SEF-V45-040","V2-M5-028"],""],["rappel",["SEF-V45-031","SEF-Q400-D-053"],""],["objectif",["SEF-V481-013","SEF-Q400-D-059","SEF-Q685-D-069"],""],["objectif",["SEF-V481-001","SEF-Q400-D-057","SEF-Q685-D-070","SEF-V481-002","SEF-V481-009","SEF-V481-016"],""],["objectif",["SEF-V481-003","SEF-Q400-D-058","SEF-Q685-D-071","SEF-V481-004","SEF-V481-010"],""],["objectif",["SEF-V481-007","SEF-Q685-D-072","SEF-V481-005","SEF-V481-015"],""],["rappel",["SEF-034-1"],""],["rappel",["SEF-031-1","SEF-031-2"],""],["reserve",["SEF-Q400-D-055","SEF-Q685-D-068","SEF-V45-035"],"extension_conditionnelle"]],"r":["SEF-C2-004","SEF-C2-006","SEF-L01-C-03","SEF-V45-031","SEF-V481-013","SEF-V481-001","SEF-V481-003","SEF-V481-007","SEF-034-1","SEF-031-1"]},{"o":"Sur ouverture à la couleur adverse, reconnaître un bicolore Michaels précisé 5–5 et ne pas inventer une seconde longue.","g":[["objectif",["SEF-V45-041","SEF-V45-042","SEF-Q400-D-061","SEF-Q685-D-077"],""],["objectif",["SEF-V45-047","SEF-V45-048","SEF-Q400-D-063","SEF-Q685-D-083","SEF-Q685-D-084"],""],["objectif",["SEF-V45-049","SEF-Q400-D-064","SEF-Q685-D-085","SEF-Q685-D-086","V2-M5-035"],""],["objectif",["SEF-L01-D-04","SEF-Q400-D-060","SEF-Q685-D-073","SEF-Q685-D-075","SEF-Q26-M2-003","V2-M5-030"],""],["objectif",["SEF-Q26-M2-001","SEF-Q685-D-074","SEF-Q685-D-076","V1-M4-002","V2-M5-029","V2-M5-032"],""],["rappel",["SEF-V3-028-4"],""],["rappel",["SEF-V3-031-1"],""],["rappel",["SEF-C2-001","SEF-V45-025","SEF-V45-026"],""],["reserve",["SEF-Q26-M2-002"],"consolidation"]],"r":["SEF-V45-041","SEF-V45-047","SEF-V45-048","SEF-V45-042","SEF-V45-049","SEF-L01-D-04","SEF-Q26-M2-001","SEF-V3-028-4","SEF-V3-031-1","SEF-C2-001"]},{"o":"Après Michaels précisé ou en réveil, choisir la préférence économique ou l’intervention adaptée à la position.","g":[["objectif",["SEF-V477-001","SEF-V477-003","SEF-Q400-D-067","SEF-Q685-D-087"],""],["objectif",["SEF-V477-002","SEF-V477-005","SEF-Q400-D-068","SEF-Q685-D-088"],""],["objectif",["SEF-V477-006","SEF-Q685-D-089","SEF-V477-008","SEF-V477-009"],""],["objectif",["SEF-V477-007","SEF-Q685-D-090","SEF-V477-014"],""],["objectif",["SEF-L10-016","SEF-Q685-D-092"],""],["objectif",["SEF-L38-003","SEF-Q685-D-093"],""],["rappel",["SEF-V45-043","SEF-Q400-D-065","SEF-Q685-D-079","V2-M5-036"],""],["rappel",["SEF-V45-044","SEF-Q400-D-066","SEF-Q685-D-080"],""],["rappel",["SEF-V4-048-2","SEF-V4-048-1"],""],["rappel",["SEF-V4-050-2"],""],["reserve",["SEF-L10-021","V1-M4-006","V1-M4-007"],"consolidation"]],"r":["SEF-V477-001","SEF-V477-002","SEF-V477-006","SEF-V477-007","SEF-L10-016","SEF-L38-003","SEF-V45-043","SEF-V45-044","SEF-V4-048-2","SEF-V4-050-2"]},{"o":"Sur notre ouverture et un bicolore adverse connu, distinguer les deux cue-bids disponibles selon leur ordre réel.","g":[["objectif",["SEF-V473-009","SEF-Q400-D-069","SEF-Q685-D-094","SEF-L19-003","SEF-L36-004","SEF-L43-002"],""],["objectif",["SEF-V473-010","SEF-Q400-D-070","SEF-Q685-D-095","SEF-L22-001","SEF-L37-003"],""],["objectif",["SEF-L09-029","SEF-Q685-D-096","SEF-L19-002","SEF-L33-001","V2-M5-038"],""],["objectif",["SEF-L19-001","SEF-Q685-D-097"],""],["rappel",["SEF-V477-003","SEF-V477-001"],""],["rappel",["SEF-V477-005","SEF-V477-002","SEF-Q685-D-091"],""],["rappel",["SEF-V45-045","SEF-Q685-D-081"],""],["objectif",["SEF-V3-074-2","SEF-V3-074-3"],""],["objectif",["SEF-V3-057-1","SEF-Q685-C-030","SEF-Q685-C-079","SEF-Q685-C-160"],""],["objectif",["SEF-V3-058-3","SEF-Q685-C-031","SEF-Q685-C-080"],""]],"r":["SEF-V473-009","SEF-V473-010","SEF-L09-029","SEF-L19-001","SEF-V477-003","SEF-V477-005","SEF-V45-045","SEF-V3-074-2","SEF-V3-057-1","SEF-V3-058-3"]},{"o":"Sans fit agréé, utiliser 4SA comme invitation quantitative au petit chelem et distinguer les seuils de manche.","g":[["objectif",["SEF-V44-013","SEF-Q26-M2-016","SEF-Q400-D-072"],""],["rappel",["SEF-031-2","SEF-031-1"],""],["rappel",["SEF-032-1"],""],["rappel",["SEF-033-1"],""],["rappel",["SEF-041-2"],""],["rappel",["SEF-N097-3","SEF-N098-1"],""],["rappel",["SEF-004-1","SEF-005-1"],""],["reserve",["SEF-Q400-D-071"],"extension_conditionnelle"],["reserve",["SEF-Q400-D-073"],"extension_conditionnelle"],["reserve",["SEF-Q400-D-100"],"extension_conditionnelle"]],"r":["SEF-V44-013","SEF-Q26-M2-016","SEF-031-2","SEF-032-1","SEF-033-1","SEF-041-2","SEF-N097-3","SEF-N098-1","SEF-004-1","SEF-005-1"]},{"o":"Après fit agréé, annoncer le premier contrôle disponible (As, Roi ou courte) et repérer le contrôle sauté.","g":[["objectif",["SEF-V483-001","SEF-V483-002","SEF-V483-003","SEF-V483-004","SEF-V483-010","SEF-Q685-D-106"],""],["objectif",["SEF-V483-005","SEF-V483-006","SEF-V483-007","SEF-Q400-D-076"],""],["rappel",["SEF-026-3","SEF-026-1"],""],["rappel",["SEF-027-2"],""],["rappel",["SEF-V4-001-1"],""],["rappel",["SEF-V4-002-1"],""],["rappel",["SEF-V44-052"],""]],"r":["SEF-V483-001","SEF-V483-005","SEF-V483-006","SEF-V483-007","SEF-V483-002","SEF-026-3","SEF-027-2","SEF-V4-001-1","SEF-V4-002-1","SEF-V44-052"]},{"o":"Reconnaître le Splinter direct : annoncer simultanément le fit quatrième et la courte dans la zone prévue.","g":[["objectif",["SEF-Q26-M6-009","SEF-Q400-D-079","SEF-Q685-D-118"],""],["objectif",["SEF-Q26-M6-010","SEF-V45-056","SEF-Q400-D-080","SEF-Q685-D-119"],""],["objectif",["SEF-V45-057","SEF-Q400-D-081","SEF-Q685-D-120"],""],["objectif",["SEF-V45-058","SEF-Q400-D-082","SEF-Q685-D-121"],""],["rappel",["SEF-V483-003","SEF-V483-001","SEF-V483-002","SEF-V483-004","SEF-V483-010","SEF-Q685-D-108"],""],["rappel",["SEF-V483-008","SEF-V483-009","SEF-V483-014","SEF-Q400-D-077","SEF-Q685-D-112"],""],["rappel",["SEF-V483-011","SEF-V483-005","SEF-V483-006","SEF-V483-007","SEF-V483-012","SEF-V483-013"],""],["rappel",["SEF-026-1","SEF-026-3"],""],["rappel",["SEF-N051-2","SEF-N056-1"],""],["reserve",["SEF-Q400-D-078"],"extension_conditionnelle"],["reserve",["SEF-Q400-D-083"],"extension_conditionnelle"],["reserve",["SEF-Q400-D-084"],"extension_conditionnelle"]],"r":["SEF-Q26-M6-009","SEF-Q26-M6-010","SEF-V45-057","SEF-V45-058","SEF-V483-003","SEF-V483-008","SEF-V483-011","SEF-026-1","SEF-N051-2","SEF-N056-1"]},{"o":"Compter les cinq clés et coder les réponses 0/3 et 1/4 en 30–41 ; ne pas compter la Dame ni les Rois annexes.","g":[["objectif",["SEF-V45-050","SEF-V45-054","SEF-Q400-D-085","SEF-Q685-D-098"],""],["objectif",["SEF-V45-051","SEF-V45-055","SEF-PN26-M1-036","SEF-Q400-D-088","SEF-Q400-D-089","SEF-Q685-D-100","SEF-Q685-D-101"],""],["rappel",["SEF-V483-004","SEF-V483-001","SEF-V483-002","SEF-V483-003","SEF-V483-010","SEF-Q685-D-109"],""],["rappel",["SEF-V483-009","SEF-V483-008","SEF-V483-014","SEF-Q685-D-113"],""],["rappel",["SEF-V483-012","SEF-V483-005","SEF-V483-006","SEF-V483-007","SEF-V483-011","SEF-V483-013","SEF-Q685-D-115"],""],["objectif",["SEF-L13-004","SEF-Q685-D-122"],""],["objectif",["SEF-L20-002","SEF-Q685-D-123"],""]],"r":["SEF-V45-050","SEF-V45-051","SEF-V45-055","SEF-PN26-M1-036","SEF-V45-054","SEF-V483-004","SEF-V483-009","SEF-V483-012","SEF-L13-004","SEF-L20-002"]},{"o":"Après contrôles et fit, déclencher le Blackwood, distinguer 5♥/5♠ à deux clés et choisir une suite selon le bilan.","g":[["rappel",["SEF-V45-052","SEF-Q400-D-087","SEF-Q685-D-102"],""],["rappel",["SEF-V45-053","SEF-Q400-D-091","SEF-Q685-D-105"],""],["rappel",["SEF-V45-054","SEF-V45-050","SEF-Q685-D-099","SEF-Q685-D-104"],""],["objectif",["SEF-L01-A-01","SEF-L01-A-05","SEF-Q400-D-093","SEF-Q685-D-124"],""],["objectif",["SEF-V474-001","SEF-Q400-D-094","SEF-Q685-D-125"],""],["objectif",["SEF-L02-E-17","SEF-Q685-D-126"],""],["objectif",["SEF-L02-E-18","SEF-Q685-D-127"],""],["objectif",["SEF-L02-E-19","SEF-Q685-D-128"],""],["rappel",["SEF-V483-010","SEF-V483-001","SEF-V483-002","SEF-V483-003","SEF-V483-004"],""]],"r":["SEF-V45-052","SEF-V45-053","SEF-V45-054","SEF-L01-A-01","SEF-L01-A-05","SEF-V474-001","SEF-L02-E-17","SEF-L02-E-18","SEF-L02-E-19","SEF-V483-010"]},{"o":"Choisir la conclusion quantitative minimum/maximum ou, avec fit, répondre à la question de Dame ou de Roi annexe.","g":[["objectif",["SEF-L32-004","SEF-Q400-D-097"],""],["objectif",["SEF-L33-003","SEF-Q685-D-137"],""],["objectif",["SEF-Q26-M6-012","SEF-Q685-D-138"],""],["objectif",["SEF-L40-002","SEF-V44-013","SEF-Q26-M2-016"],""],["objectif",["SEF-L13-018","SEF-Q400-D-099","SEF-Q685-D-140"],""],["objectif",["SEF-V474-004","SEF-Q400-D-095","SEF-Q685-D-129","SEF-Q685-D-131"],""],["objectif",["SEF-V474-005","SEF-Q400-D-096","SEF-Q685-D-130","SEF-Q685-D-132"],""],["objectif",["SEF-L41-005","SEF-Q685-D-133"],""],["objectif",["SEF-V483-013","SEF-V483-005","SEF-V483-006","SEF-V483-007","SEF-V483-011","SEF-V483-012"],""],["objectif",["SEF-V483-014","SEF-V483-008","SEF-V483-009","SEF-Q685-D-116","SEF-Q685-D-117"],""]],"r":["SEF-L32-004","SEF-L33-003","SEF-Q26-M6-012","SEF-L40-002","SEF-L13-018","SEF-V474-004","SEF-V474-005","SEF-L41-005","SEF-V483-013","SEF-V483-014"]},{"o":"Reconnaître l’ouverture 3SA Gambling et son passe-ou-corrige ; revoir séparément les exceptions d’ouverture explicitement décrites.","g":[["objectif",["SEF-PN26-M1-025","SEF-Q400-D-036","SEF-Q685-D-032","SEF-Q685-D-175"],""],["objectif",["SEF-L06-029","SEF-Q400-D-038","SEF-Q685-D-034"],""],["objectif",["SEF-Q26-M2-014","SEF-Q685-D-170"],""],["objectif",["SEF-Q26-M2-015","SEF-Q685-D-035","SEF-Q685-D-174","SEF-L27-004"],""],["objectif",["SEF-L28-001","SEF-Q400-D-040","SEF-Q685-D-172"],""],["objectif",["SEF-Q26-M1-007","V2-M1-014","SEF-Q400-D-039","SEF-Q685-D-171"],""],["objectif",["SEF-V419-001"],""],["rappel",["SEF-V3-091-1"],""],["rappel",["SEF-V3-092-3"],""],["reserve",["SEF-Q400-D-037","SEF-Q685-D-033"],"extension_conditionnelle"]],"r":["SEF-PN26-M1-025","SEF-L06-029","SEF-Q26-M2-014","SEF-Q26-M2-015","SEF-L28-001","SEF-Q26-M1-007","V2-M1-014","SEF-V419-001","SEF-V3-091-1","SEF-V3-092-3"]},{"o":"Réinvestir le seuil d’ouverture, la majeure cinquième, les égalités mineures et la première réponse naturelle.","g":[["réinvestissement",["SEF-013-1","SEF-Q400-A-001","SEF-Q400-A-002","SEF-Q400-A-003","SEF-Q400-A-004","SEF-Q400-A-005","SEF-Q400-A-006","SEF-Q400-A-007","SEF-Q685-A-009","SEF-Q685-A-010","SEF-Q685-A-011","SEF-Q685-A-012","SEF-Q685-A-013"],""],["réinvestissement",["SEF-006-2","SEF-Q400-A-017","SEF-Q400-A-019","SEF-Q400-A-021","SEF-Q685-A-029","SEF-Q685-A-030","SEF-Q685-A-031","SEF-Q685-A-032","SEF-Q685-A-033"],""],["réinvestissement",["SEF-007-1","SEF-Q400-A-018","SEF-Q400-A-020","SEF-Q400-A-022","SEF-Q685-A-034","SEF-Q685-A-035"],""],["réinvestissement",["SEF-N007-1","SEF-PN26-M1-004","SEF-Q400-A-010","SEF-Q400-A-011","SEF-Q400-A-013","SEF-Q400-A-015","SEF-Q685-A-014","SEF-Q685-A-015","SEF-Q685-A-016","SEF-Q685-A-017","SEF-Q685-A-018","SEF-Q685-A-024","SEF-Q685-A-025","SEF-Q685-A-026","SEF-Q685-A-027","SEF-Q685-A-028"],""],["réinvestissement",["SEF-012-1","SEF-PN26-M1-001","SEF-PN26-M1-002","SEF-PN26-M1-003","SEF-Q400-A-008","SEF-Q400-A-009","SEF-Q400-A-012","SEF-Q400-A-014","SEF-Q400-A-016","SEF-Q685-A-019","SEF-Q685-A-020","SEF-Q685-A-021","SEF-Q685-A-022","SEF-Q685-A-023"],""],["réinvestissement",["SEF-001-1"],""],["réinvestissement",["SEF-004-1","SEF-005-1"],""],["réinvestissement",["SEF-015-1","SEF-Q400-A-026","SEF-Q400-A-028","SEF-Q400-A-030","SEF-Q685-A-038","SEF-Q685-A-039","SEF-Q685-A-040","SEF-Q685-A-041","SEF-Q685-A-042","SEF-Q685-A-048","SEF-Q685-A-049","SEF-Q685-A-050","SEF-Q685-A-051","SEF-Q685-A-052"],""],["réinvestissement",["SEF-016-3","SEF-Q400-A-027","SEF-Q400-A-029","SEF-Q685-A-043","SEF-Q685-A-044","SEF-Q685-A-045","SEF-Q685-A-046","SEF-Q685-A-047"],""],["réinvestissement",["SEF-N068-1","SEF-Q400-A-038"],""]],"r":["SEF-013-1","SEF-006-2","SEF-007-1","SEF-N007-1","SEF-012-1","SEF-001-1","SEF-004-1","SEF-015-1","SEF-016-3","SEF-N068-1"]},{"o":"Choisir la redemande naturelle et différencier le bicolore économique du cher, puis poursuivre sans surenchérir.","g":[["réinvestissement",["SEF-044-1","SEF-Q400-A-051","SEF-Q400-A-052","SEF-Q400-A-053","SEF-Q400-A-054","SEF-Q685-A-099","SEF-Q685-A-100","SEF-Q685-A-101","SEF-Q685-A-102"],""],["réinvestissement",["SEF-048-1","SEF-Q400-A-055"],""],["réinvestissement",["SEF-N107-2","SEF-N109-1","SEF-Q400-A-060","SEF-Q400-A-061","SEF-Q400-A-062","SEF-Q685-A-104","SEF-Q685-A-105","SEF-Q685-A-106","SEF-Q685-A-108","SEF-Q685-A-109","SEF-Q685-A-110"],""],["réinvestissement",["SEF-042-2","SEF-Q400-A-063","SEF-Q685-A-116","SEF-Q685-A-117","SEF-Q685-A-118","SEF-L13-020"],""],["réinvestissement",["SEF-047-1","SEF-Q400-A-064","SEF-Q685-A-112","SEF-Q685-A-113","SEF-Q685-A-114"],""],["réinvestissement",["SEF-V44-020","SEF-Q400-A-068","SEF-Q685-A-081","SEF-Q685-A-082","SEF-Q685-A-083","SEF-Q685-A-084","SEF-Q685-A-091","SEF-Q685-A-092","SEF-Q685-A-093"],""],["réinvestissement",["SEF-V410-006","SEF-Q400-A-069","SEF-Q400-A-070","SEF-Q685-A-086","SEF-Q685-A-087","SEF-Q685-A-088","SEF-Q685-A-089","SEF-Q685-A-095","SEF-Q685-A-096","SEF-Q685-A-097"],""],["réinvestissement",["SEF-V49-022","SEF-Q400-A-072","SEF-Q400-A-073","SEF-Q400-A-074","SEF-Q685-A-098","SEF-Q685-A-128","SEF-Q685-A-129"],""],["réinvestissement",["SEF-052-3","SEF-Q400-A-075","SEF-Q685-A-085","SEF-Q685-A-094"],""],["réinvestissement",["SEF-L15-001","SEF-Q400-A-078","SEF-Q685-A-115","SEF-Q685-A-123"],""]],"r":["SEF-044-1","SEF-048-1","SEF-N107-2","SEF-042-2","SEF-047-1","SEF-V44-020","SEF-V410-006","SEF-V49-022","SEF-052-3","SEF-L15-001"]},{"o":"Choisir entre SA naturel, Texas et Stayman, puis conclure selon la force et le fit effectivement révélé.","g":[["réinvestissement",["SEF-031-2","SEF-031-1","SEF-Q400-B-007","SEF-Q400-B-012"],""],["réinvestissement",["SEF-032-1","SEF-Q400-B-008","SEF-Q685-B-012","SEF-Q685-B-013"],""],["réinvestissement",["SEF-037-1","SEF-039-2","SEF-Q400-B-022","SEF-Q400-B-024"],""],["réinvestissement",["SEF-038-1","SEF-Q400-B-023","SEF-Q685-B-035","SEF-Q685-B-037"],""],["réinvestissement",["SEF-034-1","SEF-Q400-B-019","SEF-Q400-B-020","SEF-Q400-B-021","SEF-Q685-B-024"],""],["réinvestissement",["SEF-V3-017-2","SEF-Q400-B-035","SEF-Q685-B-051"],""],["réinvestissement",["SEF-V3-018-1","SEF-Q685-B-053"],""],["réinvestissement",["SEF-V3-001-1","SEF-Q400-B-030"],""],["réinvestissement",["SEF-V3-002-1","SEF-Q685-B-043"],""],["réinvestissement",["SEF-V3-006-3","SEF-V3-008-2","SEF-Q400-B-033","SEF-Q685-B-042"],""]],"r":["SEF-031-2","SEF-032-1","SEF-037-1","SEF-038-1","SEF-034-1","SEF-V3-017-2","SEF-V3-018-1","SEF-V3-001-1","SEF-V3-002-1","SEF-V3-006-3"]},{"o":"Évaluer le fit majeur et choisir soutien, 2SA fitté ou enchère d’essai selon le rôle et la force.","g":[["réinvestissement",["SEF-026-3","SEF-Q400-A-037","SEF-Q400-A-043","SEF-Q400-A-045","SEF-Q400-A-049","SEF-Q685-A-070","SEF-Q685-A-071","SEF-Q685-A-072","SEF-Q685-A-073","SEF-Q685-A-078","SEF-Q685-A-079"],""],["réinvestissement",["SEF-027-2","SEF-Q400-A-046"],""],["réinvestissement",["SEF-029-2","SEF-Q400-A-042","SEF-Q400-A-044"],""],["réinvestissement",["SEF-N051-2","SEF-N056-1","SEF-Q400-A-096","SEF-Q400-A-097","SEF-Q400-A-098","SEF-Q685-A-131","SEF-Q685-A-132","SEF-Q685-A-133","SEF-Q685-A-135","SEF-Q685-A-137","SEF-Q685-A-138","SEF-Q685-A-139"],""],["réinvestissement",["SEF-V4-002-1","SEF-Q400-A-084","SEF-Q400-A-086","SEF-Q685-A-154","SEF-Q685-A-155","SEF-Q685-A-158","V2-M3-038"],""],["réinvestissement",["SEF-V44-052","SEF-Q400-A-089","SEF-V44-050"],""],["réinvestissement",["SEF-V423-001","SEF-Q400-A-090","V2-M3-037"],""],["réinvestissement",["SEF-V4-009-1","SEF-Q400-A-091","SEF-Q685-A-159","SEF-Q685-A-161","SEF-Q685-A-162"],""],["réinvestissement",["SEF-V4-010-1","SEF-Q400-A-092"],""],["reserve",["SEF-Q400-A-083","V2-M3-036"],"extension_conditionnelle"]],"r":["SEF-026-3","SEF-027-2","SEF-029-2","SEF-N051-2","SEF-N056-1","SEF-V4-002-1","SEF-V44-052","SEF-V423-001","SEF-V4-009-1","SEF-V4-010-1"]},{"o":"En compétition naturelle, distinguer intervention, contre d’appel, passe, réponse au partenaire et soutien.","g":[["réinvestissement",["SEF-V3-027-2","SEF-Q400-C-001","SEF-Q400-C-002"],""],["réinvestissement",["SEF-V3-047-4","SEF-Q400-C-026","SEF-Q400-C-027","SEF-Q400-C-028","SEF-Q685-C-028","SEF-Q685-C-029"],""],["réinvestissement",["SEF-V3-051-3","SEF-Q400-C-005","SEF-Q400-C-006","SEF-Q685-C-003","SEF-Q685-C-004"],""],["réinvestissement",["SEF-V3-057-1","SEF-Q400-C-030","SEF-Q400-C-032","SEF-Q685-C-030","SEF-Q685-C-079","SEF-Q685-C-160"],""],["réinvestissement",["SEF-V3-058-3","SEF-Q400-C-031","SEF-Q685-C-031","SEF-Q685-C-080"],""],["réinvestissement",["SEF-V4-025-2","SEF-Q400-C-014","SEF-Q685-C-078"],""],["réinvestissement",["SEF-V4-027-1","SEF-Q400-C-015","SEF-Q685-C-014"],""],["réinvestissement",["SEF-V3-074-3","SEF-V3-074-2","SEF-Q400-C-047","SEF-Q400-C-048","SEF-Q685-C-052","SEF-Q685-C-061","SEF-Q685-C-088"],""],["réinvestissement",["SEF-V3-078-3","SEF-V3-078-1","SEF-Q400-C-049","SEF-Q400-C-050","SEF-Q685-C-053","SEF-Q685-C-054","SEF-Q685-C-089"],""],["réinvestissement",["SEF-V3-085-3","SEF-Q400-C-051","SEF-Q400-C-052","SEF-Q685-C-055","SEF-Q685-C-056"],""]],"r":["SEF-V3-027-2","SEF-V3-047-4","SEF-V3-051-3","SEF-V3-057-1","SEF-V3-058-3","SEF-V4-025-2","SEF-V4-027-1","SEF-V3-074-3","SEF-V3-078-3","SEF-V3-085-3"]},{"o":"En barrage et réveil, distinguer longueur/force d’ouverture, prolongation tactique, réponse au contre et position.","g":[["réinvestissement",["SEF-V3-091-1","SEF-Q400-C-067","SEF-Q685-C-095","SEF-Q685-C-096"],""],["réinvestissement",["SEF-V3-092-3","SEF-Q400-C-068","SEF-Q685-C-164"],""],["réinvestissement",["SEF-V3-095-1","SEF-Q400-C-069","SEF-Q685-C-163"],""],["réinvestissement",["SEF-V3-103-4","SEF-Q400-C-074","SEF-Q685-C-102"],""],["réinvestissement",["SEF-V3-104-4","SEF-Q400-C-075","SEF-Q685-C-103"],""],["réinvestissement",["SEF-V3-107-1","SEF-Q685-C-104"],""],["réinvestissement",["SEF-V476-001","SEF-Q400-C-040","SEF-Q685-C-041","SEF-Q685-C-042"],""],["réinvestissement",["SEF-V476-002","SEF-Q400-C-041","SEF-Q685-C-082"],""],["réinvestissement",["SEF-V4-048-1","SEF-V4-048-2","SEF-Q400-C-080","SEF-Q685-C-111","SEF-Q685-C-112"],""],["réinvestissement",["SEF-V4-050-2","SEF-Q400-C-033","SEF-Q685-C-113"],""],["reserve",["SEF-Q685-C-129","SEF-Q685-C-130"],"extension_conditionnelle"]],"r":["SEF-V3-091-1","SEF-V3-092-3","SEF-V3-095-1","SEF-V3-103-4","SEF-V3-104-4","SEF-V3-107-1","SEF-V476-001","SEF-V476-002","SEF-V4-048-1","SEF-V4-050-2"]},{"o":"Identifier le Roudi, le Drury et les troisième/quatrième couleurs forcing d’après la séquence réelle.","g":[["réinvestissement",["SEF-V4-074-3","SEF-Q400-B-060","SEF-Q685-B-072"],""],["réinvestissement",["SEF-V4-073-1","SEF-Q400-B-055","SEF-Q400-B-056","SEF-Q400-B-057","SEF-Q400-B-058"],""],["réinvestissement",["SEF-V4-099-2","SEF-Q400-B-076","SEF-Q685-B-081"],""],["réinvestissement",["SEF-V4-098-1","SEF-V4-104-1","SEF-Q400-B-075","SEF-Q400-B-077","SEF-Q400-B-100"],""],["réinvestissement",["SEF-L17-001","SEF-Q400-D-004"],""],["réinvestissement",["SEF-L17-004","SEF-Q685-D-004"],""],["réinvestissement",["SEF-V45-013","SEF-Q400-D-007"],""],["réinvestissement",["SEF-Q26-M6-002","SEF-Q685-D-006"],""],["réinvestissement",["SEF-V480-001","SEF-Q400-D-010"],""],["réinvestissement",["SEF-V480-003","SEF-Q400-D-014","SEF-Q685-D-009"],""],["reserve",["SEF-Q685-D-015","SEF-Q685-D-016","SEF-Q685-D-017","SEF-Q685-D-154","SEF-Q685-D-155"],"extension_conditionnelle"]],"r":["SEF-V4-074-3","SEF-V4-073-1","SEF-V4-099-2","SEF-V4-098-1","SEF-L17-001","SEF-L17-004","SEF-V45-013","SEF-Q26-M6-002","SEF-V480-001","SEF-V480-003"]},{"o":"Réinvestir les ouvertures fortes et la différence entre force globale, contrôles et compte des clés.","g":[["réinvestissement",["SEF-V44-002","SEF-Q400-D-025","SEF-Q685-D-156"],""],["réinvestissement",["SEF-V45-002","SEF-Q400-D-022"],""],["réinvestissement",["SEF-L27-003","SEF-Q685-D-173"],""],["réinvestissement",["SEF-V45-007","SEF-Q685-D-029"],""],["réinvestissement",["SEF-V45-008"],""],["réinvestissement",["SEF-V483-001","SEF-V483-002","SEF-V483-003","SEF-V483-004","SEF-V483-010"],""],["réinvestissement",["SEF-V483-005","SEF-V483-006","SEF-V483-007","SEF-V483-011","SEF-V483-012","SEF-V483-013","SEF-Q685-D-111"],""],["réinvestissement",["SEF-V45-050","SEF-V45-054","SEF-Q400-D-086","SEF-Q685-D-139"],""],["réinvestissement",["SEF-V45-052","SEF-Q400-D-090"],""],["réinvestissement",["SEF-V45-053","SEF-Q400-D-092","SEF-Q685-D-103"],""]],"r":["SEF-V44-002","SEF-V45-002","SEF-L27-003","SEF-V45-007","SEF-V45-008","SEF-V483-001","SEF-V483-005","SEF-V45-050","SEF-V45-052","SEF-V45-053"]},{"o":"Identifier le camp et le contexte avant d’utiliser Multi-Landy, Rubensohl, Michaels ou Truscott.","g":[["réinvestissement",["SEF-V45-023","SEF-V45-024","SEF-Q400-D-042","SEF-Q685-D-041"],""],["réinvestissement",["SEF-V45-025","SEF-V45-026","SEF-C2-001","SEF-Q400-D-044","SEF-Q685-D-044"],""],["réinvestissement",["SEF-V45-027"],""],["réinvestissement",["SEF-V45-032","SEF-V486-021","SEF-C2-004","SEF-Q400-D-052"],""],["réinvestissement",["SEF-V45-031","SEF-Q685-D-067"],""],["réinvestissement",["SEF-V45-034","SEF-L01-C-03","SEF-Q685-D-065"],""],["réinvestissement",["SEF-V45-041","SEF-V45-042","SEF-Q400-D-062","SEF-Q685-D-078"],""],["réinvestissement",["SEF-V45-045","SEF-Q685-D-082"],""],["réinvestissement",["SEF-V44-045"],""],["réinvestissement",["SEF-V470-005"],""],["reserve",["SEF-L14-002"],"consolidation"]],"r":["SEF-V45-023","SEF-V45-025","SEF-V45-027","SEF-V45-032","SEF-V45-031","SEF-V45-034","SEF-V45-041","SEF-V45-045","SEF-V44-045","SEF-V470-005"]},{"o":"Transférer le raisonnement entre séquences naturelles, compétitives, relais et quantitatives sans nouveau concept.","g":[["réinvestissement",["SEF-N145-1","SEF-N146-2"],""],["réinvestissement",["SEF-052-3","SEF-Q685-A-085","SEF-Q685-A-090","SEF-Q685-A-094"],""],["réinvestissement",["SEF-V471-001","SEF-Q685-C-068","SEF-Q685-C-070"],""],["réinvestissement",["V1-M1-004","SEF-Q685-C-069","SEF-Q685-C-094"],""],["réinvestissement",["SEF-V3-001-1"],""],["réinvestissement",["SEF-V3-008-2","SEF-V3-006-3","SEF-Q685-B-042"],""],["réinvestissement",["SEF-V486-026"],""],["réinvestissement",["SEF-V486-027","SEF-Q400-D-017","SEF-Q685-D-013"],""],["réinvestissement",["SEF-L32-004","SEF-Q685-D-136"],""],["réinvestissement",["SEF-L33-003","SEF-Q400-D-098"],""]],"r":["SEF-N145-1","SEF-052-3","SEF-V471-001","V1-M1-004","SEF-V3-001-1","SEF-V3-008-2","SEF-V486-026","SEF-V486-027","SEF-L32-004","SEF-L33-003"]},{"o":"Diagnostiquer les décisions fondamentales acquises ou encore fragiles ; réactiver les erreurs sans introduire de notion.","g":[["réinvestissement",["SEF-013-1","SEF-Q685-A-009","SEF-Q685-A-010","SEF-Q685-A-011","SEF-Q685-A-012","SEF-Q685-A-013"],""],["réinvestissement",["SEF-PN26-M1-004","SEF-N008-2","SEF-Q685-A-014","SEF-Q685-A-015","SEF-Q685-A-016","SEF-Q685-A-017","SEF-Q685-A-018","SEF-Q685-A-024","SEF-Q685-A-025","SEF-Q685-A-026","SEF-Q685-A-027","SEF-Q685-A-028"],""],["réinvestissement",["SEF-007-1","SEF-Q685-A-034","SEF-Q685-A-035"],""],["réinvestissement",["SEF-001-1","SEF-Q685-B-001","SEF-Q685-B-002","SEF-Q685-B-003","SEF-Q685-B-004","SEF-Q685-B-005","SEF-Q685-B-006"],""],["réinvestissement",["SEF-026-1","SEF-026-3","SEF-Q685-A-070","SEF-Q685-A-071","SEF-Q685-A-072","SEF-Q685-A-073","SEF-Q685-A-078","SEF-Q685-A-080"],""],["réinvestissement",["SEF-N109-1","SEF-N107-2","SEF-Q685-A-104","SEF-Q685-A-105","SEF-Q685-A-106","SEF-Q685-A-108","SEF-Q685-A-109","SEF-Q685-A-110"],""],["réinvestissement",["SEF-033-1","SEF-Q685-B-010","SEF-Q685-B-011","SEF-Q685-B-014"],""],["réinvestissement",["SEF-V3-048-2","SEF-Q685-C-028","SEF-Q685-C-029"],""],["réinvestissement",["SEF-V3-058-3","SEF-Q685-C-031","SEF-Q685-C-080"],""],["réinvestissement",["SEF-V483-002","SEF-V483-001","SEF-V483-003","SEF-V483-004","SEF-V483-010","SEF-Q400-D-075","SEF-Q685-D-107"],""]],"r":["SEF-013-1","SEF-PN26-M1-004","SEF-007-1","SEF-001-1","SEF-026-1","SEF-N109-1","SEF-033-1","SEF-V3-048-2","SEF-V3-058-3","SEF-V483-002"]}];
  function select(exercises,state,n=10,options={}){
    const s=state.completed,limit=clamp(int(n,10),1,20),e=evidence(state,exercises);
    // Candidate #396 : départage après S20, à score et strate pédagogique identiques.
    const durableSelection=s>=20&&durable?.schema==='QPJB_DURABLE_INTEGRATION_V1'
      ?durable.prepareSelection({history:state,exercises,metadataById:prerequis.byId,nowMs:Date.now()}):null;
    let pool=eligiblePool(exercises,state,e);
    const program=options.programme65!==false&&s<65&&limit===10?PROGRAMME65[s]:null;
    const pastProgram=program?PROGRAMME65.slice(0,s):[];
    const currentIds=new Set(program?.g.flatMap(g=>g[1])||[]);
    const priorIds=new Set(pastProgram.flatMap(p=>p.g.flatMap(g=>g[1])));
    const permitted=new Set([...currentIds,...priorIds]);
    // The existing first two lessons retain their specific hard constraints.
    // Later lessons may reuse previously scheduled candidates (including
    // deferred groups), but never discover a future group as a filler.
    if(program&&s>=2){
      const planned=pool.filter(q=>permitted.has(q.id)||e.seen.get(metadata(q).concept)?.has(q.id));
      const knownBasic=pool.filter(q=>e.seen.has(metadata(q).concept)&&metadata(q).stage===0&&q.difficulty<=2);
      const safe=[...new Map([...planned,...knownBasic].map(q=>[q.id,q])).values()];
      if(new Set(safe.map(family)).size>=limit)pool=safe;
      else if(new Set(planned.map(family)).size>=limit)pool=planned;
    }
    if(s===1||s===2&&!program){const early=pool.filter(q=>!minorSupport(q)&&(!majorSupport(q)||majorThree(q)));if(new Set(early.map(family)).size>=limit)pool=early;}
    const previous=state.entries||{};
    const passCap=s===0?3:s===2?1:passWeakness(state,e)?2:1;
    const selected=[],ids=new Set(),families=new Set(),themes={},answers={},contexts={},concepts={};
    const curriculum=options?.coherenceM1?.schema==='QPJB_COHERENCE_M1_V1'?options.coherenceM1:null;
    const maintenancePolicy=options?.coherenceM4?.schema==='QPJB_COORDINATOR_M4_V1'?options.coherenceM4:null;
    const atomic=options?.coherenceAtomic?.schema==='QPJB_COORDINATOR_ATOMIC_V1'?options.coherenceAtomic:null;
    const atomicSlots=[];
    let m1Changed=false,m4Changed=false;
    const reportDecision=typeof options?.observe==='function'?options.observe:()=>{};
    const targetByTheme=Object.fromEntries(ROADMAP.map(([t])=>[t,levelFor(state,exercises,t)]));
    const totalRecent=e.recent.length,weakRecent=e.recent.filter(({a})=>weakAnswer(a)).length;
    const rate=totalRecent?weakRecent/totalRecent:0;
    const profile=rate>=.5?'weak':rate>=.2?'middle':'strong';
    // Les niveaux avancés éligibles ne deviennent pas obligatoires quand
    // l'élève échoue encore souvent. Préférer les variantes élémentaires.
    // Après la phase de découverte, une variante avancée locale peut être
    // rencontrée si ses propres preuves existent et si elle apporte de la nouveauté.
    if(profile==='weak'){
      const easy=pool.filter(q=>q.difficulty<=3);
      const easyFamilies=new Set(easy.map(family));
      const novelEasy=[...easyFamilies].filter(key=>!Object.hasOwn(e.lastFamily,key)).length;
      // Avant l'introduction de toutes les rubriques, ou tant que le
      // réservoir de variantes élémentaires est ample, ne pas accélérer.
      // Les éligibilités avancées restent fondées sur leurs propres preuves.
      if(easyFamilies.size>=limit&&(s<INTRO.chelem||
        novelEasy>Math.max(2*limit,easyFamilies.size/4)))pool=easy;
    }
    const quotas=profile==='weak'?[2,3,4,1]:profile==='middle'?[4,3,2,1]:[5,3,1,1];
    const buckets={discovery:0,maintenance:0,weakness:0,transfer:0};
    // Le rappel par une autre main est un vrai rappel. Réserver les reprises
    // exactes à une fraction de la séance ; ne pas sacrifier la couverture.
    let repeatedFamilies=0,passChosen=0,hardChosen=0;
    const repeatBudget=profile==='weak'?2:profile==='middle'?1:0;
    const passCount=()=>passChosen;
    const mOf=q=>metadata(q);
    const fresh=q=>!previous[q.id];
    const due=q=>previous[q.id]&&previous[q.id].due<=s&&previous[q.id].lastSession<s;
    const bad=q=>previous[q.id]&&weakAnswer(previous[q.id]);
    const weak=q=>bad(q)&&due(q)||!!e.weakConcept[mOf(q).concept];
    const oldTheme=q=>s-(e.lastTheme[q.theme]??(INTRO[q.theme]-1));
    const oldFamily=q=>s-(e.lastFamily[family(q)]??-999);
    const oldConcept=q=>s-(e.lastConcept[mOf(q).concept]??-999);
    const novelFamily=q=>!Object.hasOwn(e.lastFamily,family(q));
    const dueMaintenanceConcepts=new Set(pool.filter(q=>due(q)&&!bad(q)).map(q=>mOf(q).concept));
    const maintenance=q=>due(q)&&!bad(q)||
      (e.seen.has(mOf(q).concept)&&(oldTheme(q)>=5||oldConcept(q)>=5||
        (oldConcept(q)>=3&&dueMaintenanceConcepts.has(mOf(q).concept))));
    const transfer=q=>fresh(q)&&!!e.weakContext[context(q)]&&!e.weakConcept[mOf(q).concept];
    function classify(q){
      if(weak(q))return 'weakness';
      if(maintenance(q))return 'maintenance';
      if(transfer(q))return 'transfer';
      return fresh(q)?'discovery':'maintenance';
    }
    function score(q,category){
      const m=mOf(q),t=q.theme,age=s-INTRO[t],r=previous[q.id];
      // An old saved theme level is preserved; absence of local journal
      // does not magically confer mastery of an unobserved concept.
      const target=clamp((e.localTargets.get(m.concept)||targetByTheme[t]||1)+(state.difficultyAdjustment||0),1,5);
      let value= -48*Math.abs(q.difficulty-target)-32*(themes[t]||0)
        -24*(answers[bid(q)]||0)-22*(contexts[context(q)]||0)-25*(concepts[m.concept]||0)
        +Math.min(70,oldTheme(q)*9)+Math.min(35,oldConcept(q)*3);
      if(program&&s>=2&&currentIds.has(q.id))value+=55;
      if(program&&s>=2&&priorIds.has(q.id)&&!e.seen.has(m.concept))value+=65;
      if(!r)value+=55;
      if(novelFamily(q))value+=250;
      if(oldFamily(q)<=2)value-=170;
      else if(oldFamily(q)<=5)value-=85;
      else if(oldFamily(q)<=8)value-=30;
      if(!Object.hasOwn(e.lastTheme,t))value+=age>=3?150:85;
      if(!e.seen.has(m.concept))value+=m.stage<=1?100:25;
      if(FOUNDATIONS.includes(t)&&oldTheme(q)>=5)value+=100;
      if(age<=2&&m.stage<=1)value+=35;
      if(profile==='weak'&&q.difficulty>=3)value-=q.difficulty>=4?170:35;
      if(category==='weakness'){
        value+=Math.min(75,(e.weakConcept[m.concept]||0)*8); if(e.localFragility.has(m.concept)&&novelFamily(q)&&q.difficulty<=target)value+=45;
        // Chez les élèves fragiles, favoriser un rappel à distance courte sans
        // dépasser le budget de reprises ni rendre les erreurs anciennes inéligibles.
        if(bad(q)&&due(q))value+=180+(profile==='weak'&&r&&s-r.lastSession>=3&&s-r.lastSession<=8?100:0);
      }
      if(category==='maintenance'&&due(q)&&!bad(q))value+=40;
      if(category==='transfer')value+=Math.min(60,(e.weakContext[context(q)]||0)*8);
      return value;
    }
    function choose(list,category,forcedReason,priority=false){
      const moreHard=profile!=='weak'||hardChosen<2||
        !pool.some(v=>v.difficulty<=3&&!ids.has(v.id)&&(!openingPass(v)||passCount()<passCap));
      const baseAvailable=q=>!ids.has(q.id)&&(!openingPass(q)||passCount()<passCap)&&
        (q.difficulty<=3||moreHard);
      // Quand le réservoir de familles nouvelles se raréfie, ne pas
      // concentrer la séance dans une seule rubrique si un rappel éligible
      // et de famille distincte permet de conserver la diversité.
      const diversify=s>=65&&Object.values(themes).some(n=>n>=5)&&
        pool.some(q=>baseAvailable(q)&&!families.has(family(q))&&(themes[q.theme]||0)<5);
      const available=q=>baseAvailable(q)&&(!diversify||(themes[q.theme]||0)<5);
      const distinct=q=>available(q)&&!families.has(family(q));
      let candidates=list.filter(available);
      if(!candidates.length)return false;
      const unique=candidates.filter(distinct);
      if(unique.length)candidates=unique;
      else if(pool.some(distinct))return false;
      const unseen=candidates.filter(novelFamily);
      const explicitRecall=forcedReason==='rappel_erreur_aide';
      if(unseen.length&&!explicitRecall)candidates=unseen;
      else if(!unseen.length&&!priority&&!explicitRecall&&repeatedFamilies>=repeatBudget&&
        pool.some(q=>distinct(q)&&novelFamily(q)))return false;
      const balanced=candidates.filter(q=>(themes[q.theme]||0)<(s===0?limit:4));
      if(balanced.length)candidates=balanced;
      else if(s>0&&!priority&&pool.some(q=>distinct(q)&&
        (unseen.length?novelFamily(q):true)&&(themes[q.theme]||0)<4))return false;
      // Les trois phases n'interviennent qu'après les filtres existants.
      // Aucun bonus ne peut lever un prérequis, un quota ou un rappel explicite.
      const usePolicy=!explicitRecall&&(s>=20||!priority||(s===1&&forcedReason==='equilibre_ouvertures'));
      const deltas=usePolicy&&typeof sessionPlan.rankPedagogy==='function'?
        new Map(sessionPlan.rankPedagogy({session:s+1,candidates,metadataById:prerequis.byId,
          history:state,selected,category:category||null}).map(r=>[r.id,r.delta])):new Map();
      // #419: only the already filtered native candidates are available to curriculum.
      const m1Context={session:s+1,candidates,metadataById:prerequis.byId,history:state,selected,category:category||null,priority,forcedReason};
      const allowM1=curriculum&&s>=2&&s<65&&!priority&&!forcedReason;
      let rankPool=candidates,m1Deltas=new Map();
      if(allowM1){
        const proposed=curriculum.prefer(m1Context),byId=new Map(candidates.map(q=>[q.id,q]));
        if(Array.isArray(proposed)&&proposed.length&&new Set(proposed.map(q=>q.id)).size===proposed.length&&proposed.every(q=>byId.get(q.id)===q))rankPool=proposed;
        for(const row of curriculum.rank(m1Context)){
          if(byId.has(row.id)&&Number.isFinite(row.delta)&&Math.abs(row.delta)<=100)m1Deltas.set(row.id,row.delta);
        }
      }
      const ranked=rankPool.map(q=>({q,v:score(q,category)+(deltas.get(q.id)||0)+(m1Deltas.get(q.id)||0)}));
      ranked.sort((a,b)=>b.v-a.v||hash(a.q.id+'#'+s)-hash(b.q.id+'#'+s)||a.q.id.localeCompare(b.q.id));
      let m1Choice=null,m4Choice=null;
      if(allowM1&&typeof curriculum.compose==='function'&&!m1Changed){
        const flagsById=Object.fromEntries(ranked.map(({q})=>[q.id,{due:!!due(q),bad:!!bad(q),novelFamily:novelFamily(q),firstConcept:!e.seen.has(mOf(q).concept),overdueCore:oldConcept(q)>=5,stage:mOf(q).stage}]));
        const proposed=curriculum.compose({...m1Context,changed:m1Changed,flagsById},ranked);
        const index=proposed?ranked.findIndex(x=>x.q.id===proposed.id):-1;
        if(index>0){m1Choice=proposed;ranked.unshift(...ranked.splice(index,1));m1Changed=true;}
      }
      // Experimental maintenance swaps are constrained to the same native
      // maintenance bucket, with one optional swap, and cannot displace
      // discovery, explicit errors or protected priority selections.
      if(maintenancePolicy&&s>=65&&!m4Changed&&!priority&&!forcedReason&&category==='maintenance'&&ranked.length>1){
        const flagsById=Object.fromEntries(ranked.map(({q})=>[q.id,{due:!!due(q),bad:!!bad(q),novelFamily:novelFamily(q),firstConcept:!e.seen.has(mOf(q).concept),age:oldConcept(q),stage:mOf(q).stage}]));
        const proposed=maintenancePolicy.choose({...m1Context,flagsById,selected,ranked});
        const index=proposed?ranked.findIndex(x=>x.q.id===proposed.id):-1;
        if(index>0){m4Choice=proposed;ranked.unshift(...ranked.splice(index,1));m4Changed=true;}
      }
      // #396: preserve the historical winning pedagogical stratum, not just
      // its numeric score. Cross-concept ties displaced foundational review.
      const stratum=q=>JSON.stringify([q.theme,mOf(q).concept,mOf(q).stage,q.difficulty,
        context(q),bid(q),classify(q),fresh(q),novelFamily(q),oldFamily(q),!!due(q),!!bad(q)]);
      const q=durableSelection&&!explicitRecall&&!priority&&!forcedReason
        ?durable.chooseWithinStratum(ranked,stratum,eligible=>durableSelection.rank({candidates:eligible,selected,category,priority,forcedReason}))
        :ranked[0].q;
      if(m1Choice||m4Choice)reportDecision({session:s+1,actualId:q.id,m1Choice,m4Choice});
      if(atomic&&s>=2&&s<65&&!forcedReason&&['discovery','maintenance'].includes(category)&&
         fresh(q)&&novelFamily(q)&&!due(q)&&!bad(q)){
        const key=v=>JSON.stringify([v.theme,mOf(v).concept,mOf(v).stage,mOf(v).minSession,mOf(v).requires,
         v.difficulty,context(v),bid(v),microKey(v),axisKey(v),classify(v),fresh(v),novelFamily(v),oldFamily(v),!!due(v),!!bad(v)]);
        const rows=ranked.filter(r=>fresh(r.q)&&novelFamily(r.q)&&!due(r.q)&&!bad(r.q)&&
          r.q.theme===q.theme&&r.q.difficulty===q.difficulty).map(r=>({...r,key:key(r.q)}));
        if(rows.length>1&&rows.some(r=>r.q===q))atomicSlots.push({index:selected.length,baseline:q,rows,category,priority});
      }
      const m=mOf(q),cat=category||classify(q);
      ids.add(q.id);families.add(family(q));themes[q.theme]=(themes[q.theme]||0)+1;
      if(!novelFamily(q))repeatedFamilies++;
      if(openingPass(q))passChosen++;
      if(q.difficulty>=4)hardChosen++;
      answers[bid(q)]=(answers[bid(q)]||0)+1;contexts[context(q)]=(contexts[context(q)]||0)+1;
      concepts[m.concept]=(concepts[m.concept]||0)+1;buckets[cat]++;
      const isFresh=fresh(q),isAlternate=isFresh&&cat==='maintenance'&&e.seen.has(m.concept);
      const kind=!isFresh||isAlternate?'revision':'nouveau';
      // La provenance de rappel prime sur le motif de quota/équilibre.
      // Une main inconnue d'une notion jamais exposée reste une découverte.
      const reason=isAlternate?'rappel_nouvelle_situation':!isFresh?
        (due(q)&&bad(q)?'rappel_erreur_aide':'rappel_question'):
        forcedReason||(cat==='weakness'?'renforcement_lacune':
        cat==='transfer'?'transfert_contexte':'nouveau_qcm');
      selected.push({exercise:q,kind,reason});return true;
    }
    function opening(answer,simple=false){
      const options=pool.filter(q=>q.theme==='ouv'&&bid(q)===answer&&(!simple||simplePass(q)));
      return choose(options,'discovery','equilibre_ouvertures',true);
    }
    // Reprise des contraintes #291, mais aucun ordre de réponses imposé.
    if(s===0&&limit>=8){
      const targets=limit===8?['1♣','1♦','1♥','1♠','1SA','1♣','1♦','Passe']:
        limit===9?['1♣','1♦','1♥','1♠','1SA','1♣','1♦','Passe','Passe']:
        ['1♣','1♦','1♥','1♠','1SA','1♣','1♦','Passe','Passe','Passe'];
      for(const answer of targets){
        let candidates=[];
        if(program&&answer==='1♣'){
          const seen=selected.some(v=>bid(v.exercise)===answer);
          candidates=pool.filter(q=>q.theme==='ouv'&&bid(q)===answer&&(seen?q.shape[3]>q.shape[2]:q.shape[3]===3&&q.shape[2]===3));
        }else if(program&&answer==='1♦'){
          const seen=selected.some(v=>bid(v.exercise)===answer);
          candidates=pool.filter(q=>q.theme==='ouv'&&bid(q)===answer&&(seen?q.shape[2]>q.shape[3]:q.shape[2]===4&&q.shape[3]===4));
        }else if(program&&answer==='Passe'&&!selected.some(v=>openingPass(v.exercise)&&v.exercise.h>=10))
          candidates=pool.filter(q=>simplePass(q)&&q.h>=10&&q.shape.every(n=>n>=2&&n<=4));
        if(!candidates.length||!choose(candidates,'discovery','equilibre_ouvertures',true))opening(answer,answer==='Passe');
      }
    }
    if(s===1&&limit>=10){
      if(program){
        for(const [answer,n] of [['1♣',3],['1♦',4]])
          if(!choose(pool.filter(q=>q.theme==='ouv'&&bid(q)===answer&&q.shape[2]===n&&q.shape[3]===n),'discovery','equilibre_ouvertures',true))opening(answer);
      }else{opening('1♣');opening('1♦');}
      const passes=pool.filter(openingPass);
      if(!choose(passes.filter(q=>bad(q)&&due(q)),'weakness','rappel_erreur_aide'))
        choose(passes,'maintenance','equilibre_ouvertures',true);
      for(const lead of ['1♣','1♦']){
        choose(pool.filter(q=>opener(q)===lead&&minorMajor4(q)),'discovery',null,true);
        choose(pool.filter(q=>opener(q)===lead&&minorNotrump(q)),'discovery',null,true);
      }
      for(const lead of ['1♥','1♠'])choose(pool.filter(q=>opener(q)===lead&&majorThree(q)),'discovery',null,true);
      if(selected.length<limit)choose(pool.filter(q=>q.theme==='majeur'&&!majorSupport(q)&&q.difficulty<=2),'discovery',null,true);
    }
    // Garantie de découverte et d'entretien, avant les quotas indicatifs.
    if(s>=2){
      // Une erreur récente mérite une réponse ciblée sans prendre toute la séance.
      if(selected.length<limit&&buckets.weakness<quotas[2]){
        const recallLimit=profile==='weak'?2:1;
        for(let i=0;i<recallLimit&&selected.length<limit&&repeatedFamilies<Math.max(1,repeatBudget);i++)
          if(!choose(pool.filter(q=>due(q)&&bad(q)),'weakness','rappel_erreur_aide'))break;
      }
      if(program){
        // Native choose() still enforces ID/family diversity, opening Passe
        // caps, local difficulty and scoring. Explicit error recall above wins.
        const activeGroups=program.g.filter(g=>!/^report_S/.test(g[2])&&['objectif','transition','réinvestissement','transfert'].includes(g[0]));
        const goalLimit=profile==='weak'?3:profile==='middle'?4:5;
        let goalCount=selected.filter(v=>activeGroups.some(g=>g[1].includes(v.exercise.id))).length;
        const eligibleFor=g=>pool.filter(q=>g[1].includes(q.id));
        const countGroup=g=>selected.filter(v=>g[1].includes(v.exercise.id)).length;
        // A group never consumes the entire deck just because it has many IDs.
        for(let pass=0;pass<2&&goalCount<goalLimit;pass++){
          for(const g of activeGroups){
            if(selected.length>=limit||goalCount>=goalLimit)break;
            if(countGroup(g)>pass)continue;
            if(g[2]==='apres_trois_cas'&&selected.filter(v=>metadata(v.exercise).concept==='sa1.stayman.reponse').length<3)continue;
            if(choose(eligibleFor(g),null,null,true))goalCount++;
          }
        }
        // At most two explicit previous-lesson recoveries; missing prerequisites
        // remain missing, and no same-session answer can unlock a question.
        const pending=pastProgram.flatMap(p=>p.g.filter(g=>g[0]==='objectif'||g[0]==='transition')).reverse();
        let recovered=0;
        for(const g of pending){
          if(selected.length>=limit-2||recovered>=2)break;
          if(g[1].some(id=>previous[id]))continue;
          if(choose(eligibleFor(g).filter(q=>!e.seen.has(mOf(q).concept)),null,null,true))recovered++;
        }
        const recallIds=new Set(program.g.filter(g=>g[0]==='rappel').flatMap(g=>g[1]));
        if(selected.length<limit-1)choose(pool.filter(q=>recallIds.has(q.id)&&e.seen.has(mOf(q).concept)),null,null,true);
      }
      // Réserver au plus une découverte éligible et un rappel fondamental
      // ancien, après le rappel explicite des erreurs.
      if(s>=20&&s<65){
        const core=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
        if(selected.length<limit)choose(pool.filter(q=>core.has(mOf(q).concept)&&e.seen.has(mOf(q).concept)&&oldConcept(q)>=8&&!concepts[mOf(q).concept]),'maintenance',null,true);
        if(selected.length<limit)choose(pool.filter(q=>!e.seen.has(mOf(q).concept)&&!concepts[mOf(q).concept]),'discovery',null,true);
      }
      const priorities=sessionPlan.priorityThemes({roadmap:ROADMAP,completed:s,lastTheme:e.lastTheme,eligibleThemes:pool.map(q=>q.theme)});
      for(const [t] of priorities){
        if(selected.length>=limit||themes[t])continue;
        const known=Object.hasOwn(e.lastTheme,t);
        const options=pool.filter(q=>q.theme===t&&(known||mOf(q).stage<=1));
        if(known){
          if(!choose(options.filter(q=>e.seen.has(mOf(q).concept)&&novelFamily(q)),'maintenance',null,true))
            if(!choose(options.filter(novelFamily),null,null,true))
              choose(options,null,null,true);
        }else choose(options,'discovery',null,true);
      }

    }
    const order=['discovery','maintenance','weakness','transfer'];
    while(selected.length<limit){
      const cats=order.slice().sort((a,b)=>(quotas[order.indexOf(b)]-buckets[b])-(quotas[order.indexOf(a)]-buckets[a]));
      let ok=false;
      if(s===1)ok=choose(pool.filter(q=>minorMajor4(q)||minorNotrump(q)||majorThree(q)||q.theme==='majeur'&&!majorSupport(q)),'discovery');
      if(!ok)for(const cat of cats){
        if(choose(pool.filter(q=>classify(q)===cat),cat)){ok=true;break;}
      }
      if(!ok)ok=choose(pool,null,'complement_catalogue');
      if(!ok)break;
    }
    let final=selected;
    if(atomic&&selected.length===10&&limit===10){
      const proposed=atomic.choose({session:s+1,history:state,exercises,metadataById:prerequis.byId,selected,slots:atomicSlots});
      if(proposed){
        const slot=atomicSlots.find(x=>x.index===proposed.index&&x.baseline.id===proposed.oldId);
        const row=slot?.rows.find(x=>x.q.id===proposed.id),old=selected[proposed.index]?.exercise;
        if(row&&old===slot.baseline&&row.q!==old&&row.q.theme===old.theme&&
           row.q.difficulty===old.difficulty&&openingPass(row.q)===openingPass(old)){
          const trial=selected.map((v,i)=>i===proposed.index?{...v,exercise:row.q}:v);
          if(new Set(trial.map(v=>v.exercise.id)).size===10&&new Set(trial.map(v=>family(v.exercise))).size===10&&
             passOrderOK(logicalOrder(trial,state).map(v=>v.exercise),s)){
            final=trial;reportDecision({session:s+1,actualId:row.q.id,atomicChoice:proposed});
          }
        }
      }
    }
    return logicalOrder(final,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));
  }

  // V1.7 : séance complémentaire de 4 à 10 cas distincts selon la couverture
  // réelle du catalogue ; ne jamais fabriquer ou répéter un cas pour remplir.
  // Le parcours principal reste strictement composé de dix QCM.
  // Un besoin doit être confirmé par au moins deux essais : pas de rattrapage
  // déclenché par une erreur isolée ou une classification non auditée.
  // #506 — experimental additive retrieval: never removes a guided question.
  // Opt-in only, after S65, and never competes with evidenced remediation.
  const RECALL_CORE=Object.freeze(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
  function foundationRecallPlan(state,exercises,pool,e,limit){
    const s=state.completed,byId=new Map(exercises.map(q=>[q.id,q])),last=new Map();
    if(s<65||limit<4||(state.foundationRecalls||[]).some(ev=>ev.session===s+1))return null;
    // Real answered events only; skipped cards and merely proposed plans
    // are not retrieval. No inferred history on legacy saves.
    for(const ev of state.journal||[]){
      if(!['parcours','consolidation'].includes(ev.mode)||!Number.isInteger(ev.session))continue;
      const at=ev.mode==='consolidation'?ev.session-1:ev.session;
      if(at<1||at>s)continue;
      for(const a of ev.answers||[]){
        if(!['correct','wrong'].includes(a.result))continue;
        const q=byId.get(a.id),c=q&&metadata(q)?.concept;
        if(RECALL_CORE.includes(c))last.set(c,Math.max(last.get(c)||0,at));
      }
    }
    for(const ev of state.foundationRecalls||[]){
      const at=ev.session-1;if(!Number.isInteger(at)||at<65||at>s)continue;
      for(const a of ev.answers||[]){
        if(!['correct','wrong'].includes(a.result))continue;
        const q=byId.get(a.id),c=q&&metadata(q)?.concept;
        if(RECALL_CORE.includes(c))last.set(c,Math.max(last.get(c)||0,at));
      }
    }
    const items=[],usedFamilies=new Set();
    const overdue=RECALL_CORE.filter(c=>last.has(c)&&s-last.get(c)>=10)
      .sort((a,b)=>last.get(a)-last.get(b)||a.localeCompare(b));
    for(const c of overdue){
      if(items.length>=Math.min(6,limit))break;
      const proof=e.proofs.get(c)||[];
      if(e.localFragility.has(c)||e.weakConcept[c]||new Set(proof.map(p=>p.family)).size<2||new Set(proof.map(p=>p.session)).size<2)continue;
      const eligible=pool.filter(q=>{
        const m=metadata(q),r=state.entries?.[q.id],assessment=assessmentOf(r||{});
        return m.concept===c&&m.stage<=1&&q.difficulty<=3&&r&&!weakAnswer(r)&&
          assessment?.result==='correct'&&!assessment.assisted&&s-r.lastSession>=10&&!usedFamilies.has(family(q));
      });
      eligible.sort((a,b)=>state.entries[a.id].lastSession-state.entries[b.id].lastSession||a.difficulty-b.difficulty||a.id.localeCompare(b.id));
      const q=eligible[0];if(!q)continue;
      usedFamilies.add(family(q));items.push({id:q.id,target:'foundation:recall'});
    }
    if(items.length<4)return null;
    return {available:true,reason:'foundation-recall',focus:[{kind:'foundation',key:'recall',label:'Rappel des fondamentaux',score:0}],items:logicalOrder(items,state,x=>byId.get(x.id))};
  }
  function consolidationPlan(state,exercises,n=10,options={}){
    if(state.active)return {available:false,reason:'session-active',focus:[],items:[]};
    if(state.lastConsolidatedAt===state.completed)return {available:false,reason:'already-consolidated',focus:[],items:[]};
    const limit=clamp(int(n,10),1,10),minFamilies=Math.min(4,limit),s=state.completed;
    let hasEvidence=false;
    const e=evidence(state,exercises),pool=eligiblePool(exercises,state,e);
    const targets=[];
    function collect(records,labels,kind,identify){
      for(const [key,r] of Object.entries(records||{})){
        if(!Object.hasOwn(labels,key)||!r||r.score>-2||r.attempts<2)continue;
        hasEvidence=true;
        const candidates=pool.filter(x=>identify(x)===key);
        if(new Set(candidates.map(family)).size<minFamilies)continue;
        targets.push({kind,key,label:labels[key],score:r.score,candidates});
      }
    }
    collect(state.micros,MICRO_LABELS,'micro',microKey);
    collect(state.axes,AXIS_LABELS,'axis',axisKey);
    targets.sort((a,b)=>a.score-b.score||b.candidates.length-a.candidates.length||
      (a.kind+':'+a.key).localeCompare(b.kind+':'+b.key));
    const focus=targets.slice(0,2);
    if(!focus.length){
      if(options.foundationRecall===true&&!hasEvidence){
        const recall=foundationRecallPlan(state,exercises,pool,e,limit);
        if(recall)return recall;
      }
      return {available:false,reason:hasEvidence?'pool-insufficient':'no-evidenced-weakness',focus:[],items:[]};
    }
    const items=[],usedIds=new Set(),usedFamilies=new Set(),counts={},bids={},contexts={};
    function choose(target){
      let options=target.candidates.filter(x=>!usedIds.has(x.id)&&!usedFamilies.has(family(x)));
      // Le plafond des Passes concerne les séances ordinaires ; une séance
      // explicitement ciblée sur cette faiblesse confirmée garde son rôle.
      if(!(target.kind==='micro'&&target.key==='ouv:passe'))
        options=options.filter(x=>!openingPass(x)||(bids['ouv|Passe']||0)<(passWeakness(state,e)?2:1));
      if(!options.length)return false;
      // Même en consolidation, ne pas aligner trois fois la même décision.
      const diverse=options.filter(x=>(bids[x.theme+'|'+bid(x)]||0)<2);
      if(diverse.length)options=diverse;
      const contextual=options.filter(x=>!opener(x)||(contexts[context(x)]||0)<2);
      if(contextual.length)options=contextual;
      function score(x){
        const rec=(state.entries||{})[x.id];
        const recent=rec?s-rec.lastSession:999;
        return (rec?-35:65)+(recent<=2?-80:recent<=5?-20:0)
          -28*Math.abs(x.difficulty-(e.localTargets.get(metadata(x).concept)||levelFor(state,exercises,x.theme)))
          -16*(counts[x.theme]||0)-22*(bids[x.theme+'|'+bid(x)]||0)
          -11*(contexts[context(x)]||0);
      }
      options.sort((a,b)=>score(b)-score(a)||hash(a.id+'#'+s)-hash(b.id+'#'+s));
      const x=options[0];
      usedIds.add(x.id);usedFamilies.add(family(x));
      counts[x.theme]=(counts[x.theme]||0)+1;
      bids[x.theme+'|'+bid(x)]=(bids[x.theme+'|'+bid(x)]||0)+1;
      contexts[context(x)]=(contexts[context(x)]||0)+1;
      items.push({id:x.id,target:target.kind+':'+target.key});
      return true;
    }
    for(let i=0;i<limit;i++){
      const primary=focus[i%focus.length];
      if(choose(primary))continue;
      if(!focus.some(t=>t!==primary&&choose(t)))break;
    }
    const available=items.length>=minFamilies;
    return {available,reason:available?null:'pool-insufficient',
      focus:focus.map(t=>({kind:t.kind,key:t.key,label:t.label,score:t.score})),
      items:available?logicalOrder(items,state,x=>pool.find(q=>q.id===x.id)):[]};
  }

  // Bilan borné : un résultat de séance, pas une déclaration de maîtrise.
  // Les libellés proviennent uniquement de la taxonomie déjà auditée.
  function focusLabel(target){
    if(typeof target!=='string')return null;
    const p=target.indexOf(':');
    if(p<0)return null;
    const kind=target.slice(0,p),key=target.slice(p+1);
    return kind==='foundation'&&key==='recall'?'Rappel des fondamentaux':
      kind==='micro'&&Object.hasOwn(MICRO_LABELS,key)?MICRO_LABELS[key]:
      kind==='axis'&&Object.hasOwn(AXIS_LABELS,key)?AXIS_LABELS[key]:null;
  }
  function validCounts(raw){
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
    const fields=['total','independent','helped','wrong','skipped'];
    if(fields.some(key=>!Number.isInteger(raw[key])||raw[key]<0||raw[key]>20))return null;
    if(raw.independent+raw.helped+raw.wrong+raw.skipped!==raw.total)return null;
    return Object.fromEntries(fields.map(key=>[key,raw[key]]));
  }
  function emptyCounts(total=0){return {total,independent:0,helped:0,wrong:0,skipped:0}}
  function addOutcome(counts,answer){
    if(answer.result==='skipped')counts.skipped++;
    else if(answer.result==='wrong')counts.wrong++;
    else if(answer.result==='correct'){
      if(answer.assisted||answer.hadFreeError)counts.helped++;
      else counts.independent++;
    }
    counts.total++;
  }
  function reportFor(active,atSession){
    const counts=emptyCounts(),parts=new Map();
    for(let i=0;i<active.ids.length;i++){
      const a=active.answers[i];addOutcome(counts,a);
      const tag=active.targets?.[i];
      if(!focusLabel(tag))continue;
      if(!parts.has(tag))parts.set(tag,emptyCounts());
      addOutcome(parts.get(tag),a);
    }
    const byTarget=[...parts].map(([target,counts])=>({target,counts}));
    // Legacy V1.7 focused sessions have no per-question target metadata:
    // publish the observed total only rather than guessing labels.
    return {atSession,counts,parts:byTarget.length&&
      byTarget.reduce((n,x)=>n+x.counts.total,0)===counts.total?byTarget:[]};
  }
  function startConsolidation(state,exercises,options={}){
    // La séance interrompue, qu'elle soit normale ou complémentaire, prime.
    if(state.active)return start(state,exercises);
    const plan=consolidationPlan(state,exercises,10,options);
    if(!plan.available)return [];
    const byId=new Map(exercises.map(x=>[x.id,x]));
    state.active={ids:plan.items.map(x=>x.id),index:0,answers:{},
      createdAt:state.completed,mode:'consolidation',
      targets:plan.items.map(x=>x.target)};
    return state.active.ids.map(id=>byId.get(id));
  }
  function start(state,exercises,options={}){
    const byId=new Map(exercises.map(x=>[x.id,x]));
    if(state.active){
      if(state.active.ids.every(id=>byId.has(id))){
        const deck=state.active.ids.map(id=>byId.get(id));
        // Une ancienne séance jamais entamée peut être recalculée.
        // Une séance commencée conserve exactement ses réponses et son ordre.
        const untouched=state.active.mode!=='consolidation'&&state.active.index===0&&
          Object.keys(state.active.answers||{}).length===0;
        if(!untouched||passOrderOK(deck,state.completed))return deck;
      }
      state.active=null;
    }
    let chosen=select(exercises,state,10,options);
    if(!chosen.length)return [];
    // Le candidat est désactivé pour tous les appels historiques à deux arguments.
    // Le coordinateur doit fournir explicitement le module et passer la recette intégrée.
    let orderReferenceIds=null,orderSkillBase=null;
    const orderModule=options?.coherenceM2;
    if(orderModule?.schema==='QPJB_COHERENCE_M2_V1'&&typeof orderModule.order==='function'){
      const historical=chosen.map(x=>x.id),historicalDeck=historical.map(id=>byId.get(id));
      try{
        const common={session:state.completed+1,history:state,selected:chosen,metadataById:prerequis.byId};
        const plan=orderModule.order({...common,deck:historical,exercises:historicalDeck,preserveThemeOrder:true});
        let proposed=validOrderReference(historical,plan?.ids)&&
          changedOrderThemes(historical,plan.ids,byId).length===0&&passOrderOK(plan.ids.map(id=>byId.get(id)),state.completed)
          ?plan.ids:historical;
        // A second pass starts from the already certified constrained M2
        // order. It may improve M3 transitions without changing any ID.
        if(options.coherenceFullOrder===true){
          const second=orderModule.order({...common,deck:proposed,exercises:proposed.map(id=>byId.get(id)),
            preserveThemeOrder:false,transitionGroups:options.transitionGroups});
          if(validOrderReference(proposed,second?.ids)&&passOrderOK(second.ids.map(id=>byId.get(id)),state.completed)){
            const changed=changedOrderThemes(historical,second.ids,byId);
            const base=Object.fromEntries(changed.map(t=>[t,state.skills[t]?{...state.skills[t]}:null]));
            if(!changed.length||validSkillBase(base,state.completed)){
              proposed=second.ids;
              if(changed.length)orderSkillBase=base;
            }
          }
        }
        if(proposed.some((id,i)=>id!==historical[i])){
          const byChoice=new Map(chosen.map(x=>[x.id,x]));
          chosen=proposed.map(id=>byChoice.get(id));
          orderReferenceIds=historical;
        }
      }catch(_){ /* Repli historique : aucun nouvel ordre ni état partiel. */ }
    }
    state.active={ids:chosen.map(x=>x.id),index:0,answers:{},
      createdAt:state.completed,selection:chosen.map(x=>({
        id:x.id,kind:x.kind,reason:x.reason
      }))};
    if(orderReferenceIds)state.active.orderReferenceIds=orderReferenceIds.slice();
    if(orderReferenceIds&&orderSkillBase){
      state.active.orderSkillBase=orderSkillBase;
      state.active.orderSkillRecordedIds=[];
    }
    return state.active.ids.map(id=>byId.get(id));
  }
  // Read-only study preview: exact same selector options and inactive state.
  // Caller must explicitly report quiz status; unknown/active contexts fail closed.
  function studySuggestions(state,exercises,options={}){
    const planner=options.coherenceM5;
    if(!state||state.active!==null||options.questionActive!==false||options.quizActive!==false||
       planner?.schema!=='QPJB_COHERENCE_M5_V1')return null;
    const phase=options.phase;
    if(phase!=='before'&&phase!=='after')return null;
    const session=phase==='before'?state.completed+1:state.completed;
    if(session<1)return null;
    const copy=JSON.parse(JSON.stringify(state));
    const deck=phase==='before'?start(copy,exercises,{...options,observe:undefined}):undefined;
    if(phase==='before'&&deck.length!==10)return null;
    const objective=options.coherenceM1?.plan?.({session,history:state,metadataById:prerequis.byId,candidates:deck||[]})||null;
    return planner.studyPlan({session,history:state,metadataById:prerequis.byId,
      selected:deck,objective,phase,questionActive:false,quizActive:false});
  }
  function advanceThemeSkill(prior,x,independent,completed){
    const skill=prior?{...prior}:{level:Math.max(1,x.difficulty===1?1:2),
      clean:0,errors:0,lastCleanSession:null,lastLevelChangeSession:null};
    if(independent){
      skill.errors=0;
      // Une seule preuve par rubrique et par séance : trois exercices
      // réussis à la suite ne doivent pas provoquer une promotion immédiate.
      if(x.difficulty>=skill.level&&skill.lastCleanSession!==completed){
        skill.clean++;
        skill.lastCleanSession=completed;
      }
      if(skill.clean>=3&&skill.lastLevelChangeSession!==completed){
        skill.level=Math.min(5,skill.level+1);
        skill.lastLevelChangeSession=completed;
        skill.clean=0;
      }
    }else{
      skill.clean=0;
      skill.errors++;
      if(skill.errors>=2){
        if(skill.lastLevelChangeSession!==completed){
          skill.level=Math.max(1,skill.level-1);
          skill.lastLevelChangeSession=completed;
        }
        skill.errors=0;
      }
    }
    return skill;
  }
  // Validate the snapshot by replaying the actual recording order first.
  // If anything is missing or corrupted, keep the already observed scores.
  function normalizeThemeOrder(state,active,byId){
    if(active.mode==='consolidation'||!validOrderReference(active.ids,active.orderReferenceIds)||
       !validOrderReference(active.ids,active.orderSkillRecordedIds)||!validSkillBase(active.orderSkillBase,state.completed))return false;
    const affected=changedOrderThemes(active.orderReferenceIds,active.ids,byId);
    if(!affected.length||affected.length!==Object.keys(active.orderSkillBase).length||
       affected.some(t=>!Object.hasOwn(active.orderSkillBase,t)))return false;
    const answers=new Map(active.ids.map((id,i)=>[id,active.answers[i]]));
    const replay=(theme,ids)=>{
      let skill=active.orderSkillBase[theme];
      for(const id of ids){
        const q=byId.get(id),a=answers.get(id);
        if(!q||!a)return null;
        if(q.theme===theme)skill=advanceThemeSkill(skill,q,a.result==='correct'&&!a.assisted&&!a.hadFreeError,state.completed);
      }
      return skill;
    };
    const next={};
    for(const theme of affected){
      const actual=replay(theme,active.orderSkillRecordedIds);
      if(!sameSkill(actual,state.skills[theme]))return false;
      const canonical=replay(theme,active.orderReferenceIds);
      if(!canonical)return false;
      next[theme]=canonical;
    }
    for(const [t,v] of Object.entries(next))state.skills[t]=v;
    return true;
  }
  function isFoundationActive(active){
    return active?.mode==='consolidation'&&active.ids?.length>=4&&active.ids.length<=6&&
      active.targets?.length===active.ids.length&&active.targets.every(t=>t==='foundation:recall');
  }
  function record(state,x,result,position,choice,assisted,hadFreeError,firstGuess){
    const active=state.active;
    if(!active||active.ids[position]!==x.id||Object.hasOwn(active.answers,position))return false;
    if(!['correct','wrong','skipped'].includes(result))return false;
    active.answers[position]={result,choice:typeof choice==='string'?choice:null,
      assisted:!!assisted,hadFreeError:!!hadFreeError,
      ...firstGuessEvidence({result,choice,hadFreeError,firstGuess:firstGuess!==x.answer?firstGuess:null})};
    if(isFoundationActive(active))return true;
    // Une réponse juste après une aide (ou une première mauvaise enchère
    // en saisie libre) n'est pas une preuve de maîtrise autonome.
    const independent=result==='correct'&&!assisted&&!hadFreeError;
    const old=state.entries[x.id]||{},streak=independent?(old.streak||0)+1:0;
    const assessment=active.mode==='consolidation'
      ?assessmentOf(old)
      :{result,assisted:!!assisted||!!hadFreeError,lastSession:state.completed};
    state.entries[x.id]={result,assisted:!!assisted||!!hadFreeError,lastSession:state.completed,
      due:state.completed+(independent?(streak===1?3:streak===2?8:18):1),
      seen:(old.seen||0)+1,streak,family:family(x),assessment};
    // V1.9 : la consolidation fournit un entraînement et des révisions réelles,
    // mais pas de preuve indépendante pour les niveaux et micro-compétences.
    // Sinon, sa numérotation (le même "completed" que la séance normale
    // suivante) pourrait bloquer l'évaluation de cette dernière.
    // Les résultats ciblés sont rapportés par finish() et restent traçables.
    if(active.mode==='consolidation')return true;
    state.skills[x.theme]=advanceThemeSkill(state.skills[x.theme],x,independent,state.completed);
    if(active.orderSkillBase&&Array.isArray(active.orderSkillRecordedIds))active.orderSkillRecordedIds.push(x.id);
    const mk=microKey(x);
    if(mk){
      const m=state.micros?.[mk]||{score:0,attempts:0,independent:0,
        lastSession:0,lastScoredSession:null,sessionBase:0,sessionResult:null};
      m.attempts=clamp(m.attempts+1,0,100000);
      if(independent)m.independent=clamp(m.independent+1,0,m.attempts);
      m.lastSession=state.completed;
      // Une séance entière apporte au maximum une preuve au sous-thème.
      // Une erreur dans la même séance prime sur un succès précédent.
      if(m.lastScoredSession!==state.completed){
        m.sessionBase=m.score;
        m.sessionResult=independent?'clean':'weak';
        m.score=clamp(m.sessionBase+(independent?1:-1),-3,3);
        m.lastScoredSession=state.completed;
      }else if(!independent&&m.sessionResult!=='weak'){
        m.sessionResult='weak';
        m.score=clamp(m.sessionBase-1,-3,3);
      }
      if(!state.micros)state.micros={};
      state.micros[mk]=m;
    }

    const ak=axisKey(x);
    if(ak){
      if(!state.axes)state.axes={};
      const a=state.axes[ak]||{score:0,attempts:0,independent:0,
        lastSession:0,lastScoredSession:null,sessionBase:0,sessionResult:null};
      a.attempts=clamp(a.attempts+1,0,100000);
      if(independent)a.independent=clamp(a.independent+1,0,a.attempts);
      a.lastSession=state.completed;
      // Une seule validation par axe et par séance. Une erreur/assistance
      // prime sur les réussites autonomes de la même séance.
      if(a.lastScoredSession!==state.completed){
        a.sessionBase=a.score;
        a.sessionResult=independent?'clean':'weak';
        a.score=clamp(a.sessionBase+(independent?1:-1),-3,3);
        a.lastScoredSession=state.completed;
      }else if(!independent&&a.sessionResult!=='weak'){
        a.sessionResult='weak';
        a.score=clamp(a.sessionBase-1,-3,3);
      }
      state.axes[ak]=a;
    }
    return true;
  }
  function move(state,index){
    if(state.active)state.active.index=clamp(int(index),0,state.active.ids.length-1);
  }
  function finish(state,exercises){
    if(!state.active)return false;
    if(Object.keys(state.active.answers).length!==state.active.ids.length)return false;
    // Journal prospectif : aucune réponse d'une séance ancienne n'est inventée.
    const active=state.active,byId=new Map((exercises||[]).map(x=>[x.id,x]));
    if(isFoundationActive(active)){
      if((state.foundationRecalls||[]).some(ev=>ev.session===state.completed+1))return false;
      const answers=active.ids.map((id,i)=>({id,...active.answers[i]}));
      (state.foundationRecalls??=[]).push({session:state.completed+1,recordedAt:new Date().toISOString(),answers});
      state.active=null;return true;
    }
    normalizeThemeOrder(state,active,byId);
    const record={
      mode:active.mode==='consolidation'?'consolidation':'parcours',
      session:state.completed+1,recordedAt:new Date().toISOString(),
      answers:active.ids.map((id,i)=>{
        const a=active.answers[i],q=byId.get(id);
        const reason=active.selection?.[i];
        return {id,result:a.result,choice:a.choice,assisted:a.assisted,
          hadFreeError:a.hadFreeError,...firstGuessEvidence(a),theme:q?.theme||null,
          difficulty:q?.difficulty??null,family:q?family(q):state.entries[id]?.family||null,
          micro:q?microKey(q):null,axis:q?axisKey(q):null,
          ...(validSelection(reason,id)?{
            selectionKind:reason.kind,selectionReason:reason.reason
          }:{})};
      })
    };
    if(record.mode==='parcours'&&validOrderReference(active.ids,active.orderReferenceIds))
      record.orderReferenceIds=active.orderReferenceIds.slice();
    if(!Array.isArray(state.journal))state.journal=[];
    state.journal.push(record);
    // Les séances ciblées consolident les preuves mais ne débloquent pas
    // artificiellement de nouvelles rubriques du parcours principal.
    if(state.active.mode==='consolidation'){
      state.lastConsolidation=reportFor(state.active,state.completed);
      state.lastConsolidatedAt=state.completed;
    }else state.completed++;
    state.active=null;return true;
  }
  function adjustDifficulty(state,choice){
    const delta={increase:1,same:0,decrease:-1};
    if(!state||state.active||state.completed<1||!Object.hasOwn(delta,choice))return false;
    if(!Array.isArray(state.difficultyFeedback))state.difficultyFeedback=[];
    const previous=state.difficultyFeedback.find(x=>x.session===state.completed);
    const old=previous?delta[previous.choice]:0;
    state.difficultyAdjustment=clamp((state.difficultyAdjustment||0)-old+delta[choice],-2,2);
    if(previous){previous.choice=choice;previous.recordedAt=new Date().toISOString();}
    else state.difficultyFeedback.push({
      session:state.completed,choice,recordedAt:new Date().toISOString()
    });
    return true;
  }
  // Mesure factuelle, strictement en lecture seule ; aucune cible de proportion
  // inventée et aucune reconstitution de la cause des anciens tirages.
  function selectionDiagnostics(state,last=5){
    const normal=(state.journal||[]).filter(x=>x.mode==='parcours');
    const recent=normal.slice(-clamp(int(last,5),1,100));
    const totals={reasons:{},themes:{},knownReasons:0,unknownReasons:0,questions:0};
    const perSession=recent.map(event=>{
      const reasons={},themes={},answers=event.answers||[];
      let knownReasons=0;
      for(const a of answers){
        themes[a.theme||'inconnue']=(themes[a.theme||'inconnue']||0)+1;
        const reason=SELECTION_REASONS.includes(a.selectionReason)?a.selectionReason:null;
        if(reason){reasons[reason]=(reasons[reason]||0)+1;knownReasons++;}
      }
      const counts=Object.values(themes).sort((a,b)=>b-a);
      const n=answers.length;
      const entry={session:event.session,questions:n,distinctThemes:counts.length,
        themes,reasons,knownReasons,unknownReasons:n-knownReasons,
        largestThemeCount:counts[0]||0,
        largestThemeShare:n?Number(((counts[0]||0)/n).toFixed(3)):0,
        topTwoThemeShare:n?Number(((counts[0]||0)+(counts[1]||0)).toFixed(0)/n):0};
      totals.questions+=n;totals.knownReasons+=knownReasons;totals.unknownReasons+=n-knownReasons;
      for(const [k,v] of Object.entries(themes))totals.themes[k]=(totals.themes[k]||0)+v;
      for(const [k,v] of Object.entries(reasons))totals.reasons[k]=(totals.reasons[k]||0)+v;
      return entry;
    });
    return {lastSessionsRequested:clamp(int(last,5),1,100),
      totalDetailedSessions:normal.length,observedSessions:recent.length,
      ...totals,perSession,
      note:'Les raisons ne sont disponibles que pour les séances créées avec ce suivi. Les séances historiques ne sont pas requalifiées et la répartition n’implique pas à elle seule un défaut pédagogique.'};
  }
  function exportProgress(state,exercises,quizRecords){
    const byId=new Map(exercises.map(q=>[q.id,q]));
    const journal=state.journal||[];
    const archivedJournal=state.audit3000Archive?.journal||[];
    const detailed=new Set([...journal,...archivedJournal.map(x=>x.event)].filter(x=>x.mode==='parcours').map(x=>x.session)).size;
    const questions=Object.entries(state.entries||{}).map(([id,r])=>{
      const q=byId.get(id);
      return {id,theme:q?.theme||null,difficulty:q?.difficulty??null,
        micro:q?microKey(q):null,axis:q?axisKey(q):null,
        family:r.family,lastResult:r.result,lastSession:r.lastSession,
        attemptsRecorded:r.seen,consecutiveIndependentSuccesses:r.streak,
        nextEligibleSession:r.due,assisted:r.assisted,
        assessedResult:r.assessment||null};
    });
    const counts=new Map();
    for(const event of journal)for(const a of event.answers){
      const concept=a.micro||'rubrique:'+(a.theme||'inconnue');
      const key=concept;
      const old=counts.get(key)||{concept:key,attempts:0,correct:0,independent:0};
      old.attempts++;if(a.result==='correct')old.correct++;
      if(a.result==='correct'&&!a.assisted&&!a.hadFreeError)old.independent++;
      counts.set(key,old);
    }
    return {
      format:'QPJB_PROGRESS_EXPORT_1',exportedAt:new Date().toISOString(),
      storageKeys:{parcours:'qpjb-sef-parcours-01',quiz:'qpjb-sef-entrainement-01'},
      limitations:{
        historicalSessionsWithoutDetailedAnswers:Math.max(0,state.completed-detailed),
        note:'Les séances antérieures à la création du journal n’ont pas leurs réponses détaillées reconstituées. Le suivi par question et les anciennes réponses du Quiz sont limités aux données réellement conservées.'+(state.audit3000Archive?' Les observations antérieures à une révision pédagogique sont conservées dans historicalAuditArchive et exclues des preuves actuelles. Les agrégats concernés repartent prudemment sans réévaluation rétroactive.':'')
      },
      summary:{completedSessions:state.completed,recordedDetailedSessions:detailed,
        totalQuestionEntries:questions.length,difficultyAdjustment:state.difficultyAdjustment||0},
      sessions:journal,
      ...(state.audit3000Archive?{historicalAuditArchive:state.audit3000Archive}:{}),
      ...(state.foundationRecalls?.length?{supplementalFoundationPractice:state.foundationRecalls}:{}),
      selectionDiagnostics:selectionDiagnostics(state,5),
      currentSession:state.active||null,
      questions,
      repetitions:{questions:questions.filter(q=>q.attemptsRecorded>1).map(q=>({id:q.id,count:q.attemptsRecorded})),
        concepts:[...counts.values()]},
      mastery:{skills:state.skills,micros:state.micros,axes:state.axes,
        dashboard:dashboard(state,exercises)},
      difficultyFeedback:state.difficultyFeedback||[],
      algorithmState:state,
      quizQuestionHistory:quizRecords||{}
    };
  }
  // Un export est un rapport accompagné de l'état réellement enregistré.
  // Ne jamais réimporter les agrégats du rapport comme s'ils étaient des
  // preuves, ni écrire la clé du Quiz classique en restaurant le parcours.
  function importProgress(raw){
    let backup;
    try{backup=typeof raw==='string'?JSON.parse(raw):raw}
    catch(_){throw Error('Le fichier ne contient pas un JSON valide.')}
    if(!backup||Array.isArray(backup)||backup.format!=='QPJB_PROGRESS_EXPORT_1'||
      backup.storageKeys?.parcours!=='qpjb-sef-parcours-01')
      throw Error('Ce fichier n’est pas un export de progression V1 QPJB.');
    const old=backup.algorithmState;
    if(!old||Array.isArray(old)||old.version!==VERSION||
      !Number.isInteger(old.completed)||old.completed<0||old.completed>100000||
      !old.entries||typeof old.entries!=='object'||Array.isArray(old.entries)||
      !old.skills||typeof old.skills!=='object'||Array.isArray(old.skills)||
      backup.summary?.completedSessions!==old.completed)
      throw Error('État de progression manquant ou incohérent.');
    const restored=loadObserved(old);
    // Un ancien journal incomplet reste incomplet : ni invention ni perte.
    if(Object.keys(restored.entries).length!==Object.keys(old.entries).length||
      (old.active&&!restored.active)||
      restored.journal.length!==(Array.isArray(old.journal)?old.journal.length:0)||
      (restored.foundationRecalls?.length||0)!==(Array.isArray(old.foundationRecalls)?old.foundationRecalls.length:0))
      throw Error('Sauvegarde incohérente : aucune donnée n’a été remplacée.');
    return applyAudit3000Revision(restored,old);
  }
  // Tableau V1.5 : consultation uniquement. Pas de modification du tirage
  // ni de reconstruction spéculative de l'historique.
  const DASH_LABELS={
    upcoming:'À découvrir',available:'Disponible',discovering:'En découverte',
    consolidating:'À consolider',confirmed:'Acquis confirmés',
    unassessed:'Non évalué',working:'En cours',reinforce:'À retravailler',
    repeated:'Réussites répétées'
  };
  function dashboard(state,exercises){
    const entries=state.entries||{};
    const themes=ROADMAP.map(([id,intro])=>{
      const pool=exercises.filter(x=>x.theme===id);
      const seen=pool.filter(x=>Object.hasOwn(entries,x.id));
      const autonomous=x=>entries[x.id].result==='correct'&&!entries[x.id].assisted;
      const independent=seen.filter(autonomous).length;
      const helped=seen.filter(x=>entries[x.id].result==='correct'&&entries[x.id].assisted).length;
      const wrong=seen.filter(x=>entries[x.id].result==='wrong').length;
      const skipped=seen.filter(x=>entries[x.id].result==='skipped').length;
      // Une seule observation par famille, la plus récente. En cas
      // d'égalité, garder la preuve prudente (une erreur prime).
      const families=new Map();
      for(const x of seen){
        const r=assessmentOf(entries[x.id]);if(!r)continue;
        const key=family(x),ok=r.result==='correct'&&!r.assisted,old=families.get(key);
        if(!old||r.lastSession>old.session)families.set(key,{session:r.lastSession,ok});
        else if(r.lastSession===old.session)old.ok=old.ok&&ok;
      }
      const recent=[...families.values()].sort((a,b)=>b.session-a.session);
      // Seules les évaluations ordinaires peuvent valider "Acquis confirmés".
      // Six familles évaluées récentes, avec toutes les égalités de la dernière séance.
      const cutoff=recent[Math.min(5,recent.length-1)]?.session;
      const recentFamily=recent.filter(r=>r.session>=cutoff);
      const doneSessions=new Set(recentFamily.filter(r=>r.ok&&r.session<state.completed).map(r=>r.session));
      const confirmed=recentFamily.length>=3&&recentFamily.every(r=>r.ok)&&doneSessions.size>=3;
      const status=!seen.length?(state.completed>=intro?'available':'upcoming'):
        confirmed?'confirmed':families.size>=3?'consolidating':'discovering';
      return {id,intro,status,total:pool.length,seen:seen.length,independent,helped,wrong,skipped,
        level:seen.length?levelFor(state,exercises,id):null};
    });
    function breakdown(labels,records,kind){
      return Object.entries(labels).map(([id,label])=>{
        const r=(records||{})[id];
        const count=exercises.filter(x=>(kind==='axis'?axisKey(x):microKey(x))===id).length;
        const attempted=!!r&&r.attempts>0;
        const status=!attempted?'unassessed':
          r.score<=-2&&r.attempts>=2?'reinforce':
          r.score===3&&r.independent>=3&&r.lastScoredSession!==null&&
            r.lastScoredSession<state.completed?'repeated':'working';
        return {id,label,status,covered:count,attempts:attempted?r.attempts:0,
          independent:attempted?r.independent:0};
      });
    }
    return {completed:state.completed,active:!!state.active,themes,
      micros:breakdown(MICRO_LABELS,state.micros,'micro'),
      axes:breakdown(AXIS_LABELS,state.axes,'axis'),
      distinct:themes.reduce((a,x)=>a+x.seen,0),
      independent:themes.reduce((a,x)=>a+x.independent,0),
      confirmed:themes.filter(x=>x.status==='confirmed').length,
      practiced:themes.filter(x=>x.seen>0).length,
      total:themes.reduce((a,x)=>a+x.total,0)};
  }
  function summary(state,exercises){
    const available=ROADMAP.filter(pair=>state.completed>=pair[1]);
    const attempted=new Set(Object.keys(state.entries||{}));
    const topicsDone=new Set(exercises.filter(x=>attempted.has(x.id)).map(x=>x.theme));
    return {session:state.completed+1,completed:state.completed,unlocked:available.length,
      practiced:topicsDone.size,seen:attempted.size,active:!!state.active};
  }
  return {eligibility,adaptiveDiagnostics,createForTests:fixture=>{if(!fixture||fixture.schema!=='QPJB_PREREQUIS_V1'||Object.keys(fixture.byId||{}).some(id=>/^SEF-/i.test(id)))throw Error('Fixtures only; production IDs forbidden');return factory(fixture,sessionPlan)},VERSION,ROADMAP,INTRO,audit3000Revision:audit3000Enabled?AUDIT3000_REVISION:null,audit3000Risk:()=>Object.keys(AUDIT3000_RISK),MICRO_LABELS,microKey,weaknesses,AXIS_LABELS,AXIS_AUDIT,axisKey,axisWeaknesses,DASH_LABELS,dashboard,focusLabel,consolidationPlan,startConsolidation,empty,load,select,start,studySuggestions,record,move,finish,adjustDifficulty,exportProgress,importProgress,selectionDiagnostics,SELECTION_REASONS,summary,levelFor};
});