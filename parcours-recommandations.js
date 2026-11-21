/* QPJB — recommandations du parcours V1 : lecture seule, sans stockage ni reclassification. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.QPJBParcoursRecommandations=api;
})(typeof window!=='undefined'?window:null,function(){
  'use strict';

  const VERSION=1;
  const OUTCOMES=['autonomous','helped','wrong','skipped'];
  const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  const integer=n=>Number.isInteger(n)&&n>=0;
  const counts=()=>({autonomous:0,helped:0,wrong:0,skipped:0});
  const copyCounts=c=>({autonomous:c.autonomous,helped:c.helped,wrong:c.wrong,skipped:c.skipped});
  const safeRecord=r=>r&&typeof r==='object'&&!Array.isArray(r);
  const scoreValid=r=>safeRecord(r)&&integer(r.attempts)&&r.attempts>0&&
    integer(r.independent)&&r.independent<=r.attempts&&
    Number.isInteger(r.score)&&r.score>=-3&&r.score<=3;

  function engineOrNull(explicit){
    if(explicit)return explicit;
    if(typeof window!=='undefined'&&window.QPJBParcours)return window.QPJBParcours;
    if(typeof module!=='undefined'&&module.exports&&typeof require==='function'){
      try{return require('./quizz-parcours.js');}catch(_){return null;}
    }
    return null;
  }

  // Une réponse correcte après aide OU première erreur libre est « aidée ».
  // Une question sautée n'est ni une réussite ni une erreur constatée.
  function outcome(answer){
    if(!safeRecord(answer))return null;
    if(answer.result==='wrong')return 'wrong';
    if(answer.result==='skipped')return 'skipped';
    if(answer.result==='correct')return answer.assisted||answer.hadFreeError?'helped':'autonomous';
    return null;
  }

  function observations(state){
    const byMode={parcours:counts(),consolidation:counts()};
    const sessions=new Set();
    const seen=new Set();
    for(const event of state.journal||[]){
      if(!event||!own(byMode,event.mode)||!integer(event.session))continue;
      if(event.mode==='parcours'&&(event.session<1||event.session>state.completed))continue;
      if(event.mode==='parcours')sessions.add(event.session);
      for(const a of event.answers||[]){
        const result=outcome(a);
        if(!result||typeof a.id!=='string')continue;
        // Un journal réimporté avec la même réponse dupliquée ne prouve rien de plus.
        const fingerprint=event.mode+'|'+event.session+'|'+a.id;
        if(seen.has(fingerprint))continue;
        seen.add(fingerprint);
        byMode[event.mode][result]++;
      }
    }
    return {parcours:byMode.parcours,consolidation:byMode.consolidation,
      detailedSessions:sessions.size,
      sessionsWithoutDetail:Math.max(0,state.completed-sessions.size)};
  }

  function synthesizeArea(state,kind,labels){
    const records=kind==='micro'?state.micros:state.axes;
    const list=[];
    for(const key of Object.keys(labels||{})){
      const rec=(records||{})[key];
      if(!scoreValid(rec))continue;
      list.push({kind,key,label:labels[key],attempts:rec.attempts,
        independent:rec.independent,score:rec.score,
        lastSession:integer(rec.lastSession)?rec.lastSession:null,
        lastScoredSession:integer(rec.lastScoredSession)?rec.lastScoredSession:null});
    }
    return list;
  }

  function suggestion(type,priority,area,title,message){
    return {id:type+':'+(area?area.kind+':'+area.key:'general'),type,priority,title,message,
      evidence:area?{source:area.kind==='micro'?'micros':'axes',key:area.key,
        label:area.label,attempts:area.attempts,independent:area.independent,
        score:area.score,lastSession:area.lastSession,
        lastScoredSession:area.lastScoredSession}:null};
  }

  // Un axe et un micro peuvent classifier LES MEMES REPONSES, sans constituer
  // deux preuves indépendantes. Regrouper seulement si TOUTES les tentatives
  // agrégées de chacun sont identifiables dans le journal conservé.
  // Une ancienne sauvegarde sans journal ne satisfait jamais ce critère.
  function overlappingAreas(proposals,state){
    const responses=new Map();
    for(const event of state.journal||[]){
      if(!event||event.mode!=='parcours'||!integer(event.session)||
          event.session<1||event.session>state.completed)continue;
      for(const a of event.answers||[]){
        if(!safeRecord(a)||typeof a.id!=='string')continue;
        const answerId=event.session+'|'+a.id;
        for(const kind of ['micro','axis']){
          if(typeof a[kind]!=='string')continue;
          const id=kind+':'+a[kind];
          if(!responses.has(id))responses.set(id,new Set());
          responses.get(id).add(answerId);
        }
      }
    }
    const erased=new Set();
    for(const micro of proposals){
      if(micro.evidence?.source!=='micros')continue;
      const a=micro.evidence;
      const left=responses.get('micro:'+a.key);
      if(!left||left.size!==a.attempts)continue;
      for(const axis of proposals){
        if(erased.has(axis)||axis.type!==micro.type||axis.evidence?.source!=='axes')continue;
        const b=axis.evidence,right=responses.get('axis:'+b.key);
        if(!right||right.size!==b.attempts||right.size!==left.size||
           a.score!==b.score||a.attempts!==b.attempts||
           a.independent!==b.independent)continue;
        if(![...left].every(id=>right.has(id)))continue;
        // Métadonnée de classement complémentaire : PAS une seconde preuve.
        if(!Array.isArray(micro.evidence.sameAnswersAs))micro.evidence.sameAnswersAs=[];
        micro.evidence.sameAnswersAs.push({source:'axes',key:b.key,label:b.label});
        erased.add(axis);
      }
    }
    return {items:proposals.filter(p=>!erased.has(p)),merged:erased.size};
  }

  // Une révision disponible est une action réalisable, distincte de la liste
  // des difficultés. Lorsque la place le permet, préserver au moins une action.
  // La reprise active interdit une nouvelle révision et garde toujours priorité.
  function visibleRecommendations(items,limit){
    const sorted=items.slice().sort((a,b)=>a.priority-b.priority||a.id.localeCompare(b.id));
    const visible=sorted.slice(0,limit);
    const revision=sorted.find(x=>x.type==='revision_session');
    if(limit>=2&&revision&&!visible.includes(revision)){
      visible[visible.length-1]=revision;
      visible.sort((a,b)=>a.priority-b.priority||a.id.localeCompare(b.id));
    }
    return visible;
  }

  // Contrat de lecture destiné à l'intégration future : les champs suivants
  // explicitent une preuve EXISTANTE, sa limite et une action. Aucun calcul
  // de maîtrise ni indicateur d'apprentissage supplémentaire.
  function explain(item){
    const e=item.evidence;
    if(item.type==='resume')return {
      observed:e.answered+' réponse(s) enregistrée(s) sur '+e.total+' dans la séance en cours.',
      caveat:'Une séance interrompue n’est pas une validation de ces notions.',
      action:'Reprendre la séance en cours.'
    };
    if(item.type==='revision_session')return {
      observed:'Le moteur V1 confirme un plan de '+e.count+' situation(s), ciblant '+e.focus.map(f=>f.label).join(' et ')+'.',
      caveat:'La disponibilité vaut pour le catalogue fourni et l’état actuel ; la révision ne prouve pas une maîtrise.',
      action:'Lancer la séance complémentaire depuis le parcours, après avoir terminé toute séance active.'
    };
    if(item.type==='not_evaluated')return {
      observed:'Aucun suivi exploitable de notion évaluée n’est disponible.',
      caveat:'Aucune conclusion sur le niveau de l’élève n’est possible.',
      action:'Commencer une séance du parcours pour obtenir les premières observations.'
    };
    const source=e.source==='micros'?'micro-compétence':'axe transversal';
    const observed='Suivi V1 de '+source+' « '+e.label+' » : '+e.attempts+
      ' tentative(s), '+e.independent+' indépendante(s), score '+e.score+'.';
    if(item.type==='repeated_autonomous')return {
      observed,
      caveat:'Ces réussites répétées ne garantissent pas la maîtrise de toute la rubrique ni le maintien à long terme.',
      action:'Continuer le parcours et varier les situations.'
    };
    if(item.type==='persistent_difficulty')return {
      observed,
      caveat:'Le score est un agrégat V1, pas un diagnostic certain de chaque situation ni une mesure de maîtrise.',
      action:'Retravailler cette notion sur plusieurs situations distinctes.'
    };
    return {
      observed,
      caveat:'Une réponse aidée ou erronée ne constitue pas une preuve de réussite autonome.',
      action:'Consolider avec de nouvelles situations et revoir les explications.'
    };
  }

  // Ne modifie ni les scores, ni l'état, ni le catalogue. Les étiquettes sont
  // celles de quizz-parcours.js ; aucun thème ou axe nouveau n'est créé.
  function buildReport(rawState,options={}){
    // Les intégrateurs peuvent transmettre null depuis un champ facultatif :
    // ne pas lever d'exception ni inventer de recommandations dans ce cas.
    options=safeRecord(options)?options:{};
    const core=engineOrNull(options.parcours);
    if(!core||typeof core.load!=='function'||!core.MICRO_LABELS||!core.AXIS_LABELS)
      throw Error('Moteur QPJBParcours V1 requis en lecture seule.');
    let raw=rawState;
    if(typeof rawState==='string'){
      try{raw=JSON.parse(rawState);}catch(_){raw=null;}
    }
    if(!safeRecord(raw)||raw.version!==VERSION)
      return {schemaVersion:VERSION,status:'unavailable',completedSessions:0,
        recommendations:[],limitations:['État V1 absent, invalide ou incompatible.']};
    const state=core.load(raw);
    const limit=integer(options.maxRecommendations)?Math.min(10,Math.max(1,options.maxRecommendations)):6;
    const stats=observations(state);
    const areas=[...synthesizeArea(state,'micro',core.MICRO_LABELS),
      ...synthesizeArea(state,'axis',core.AXIS_LABELS)];
    const proposals=[];
    const active=state.active;
    const currentSession=active?{
      mode:active.mode==='consolidation'?'consolidation':'parcours',
      answered:Object.keys(active.answers||{}).length,total:active.ids.length
    }:null;
    if(currentSession){
      proposals.push({...suggestion('resume',5,null,'Reprendre la séance',
        `${currentSession.answered} réponse(s) sur ${currentSession.total} enregistrée(s) : reprends la séance interrompue.`),
        evidence:{source:'active',...currentSession}});
    }

    for(const a of areas){
      if(a.score<=-2&&a.attempts>=2){
        proposals.push(suggestion('persistent_difficulty',20,a,
          'Difficulté persistante à retravailler : '+a.label,
          'Plusieurs tentatives ont été enregistrées et les preuves indépendantes restent insuffisantes dans le suivi V1.'));
      }else if(a.score<2&&a.attempts>=2&&a.independent<a.attempts){
        proposals.push(suggestion('consolidate',40,a,'À consolider : '+a.label,
          'Le suivi comprend au moins une réponse non autonome : poursuis avec des situations variées.'));
      }
      // Même règle de preuve que « Réussites répétées » du tableau V1.
      if(a.score===3&&a.independent>=3&&a.lastScoredSession!==null&&
        a.lastScoredSession<state.completed){
        proposals.push(suggestion('repeated_autonomous',70,a,
          'Réussites autonomes répétées : '+a.label,
          'Des réussites indépendantes répétées ont été constatées. Cela ne garantit pas la maîtrise de toute la rubrique.'));
      }
    }

    let revision=null;
    if(!active&&Array.isArray(options.exercises)&&typeof core.consolidationPlan==='function'){
      // Vérifie l'éligibilité réelle ; ne lance pas la séance et ne change rien.
      const plan=core.consolidationPlan(state,options.exercises,10);
      revision={available:!!plan.available,reason:plan.reason||null,
        focus:Array.isArray(plan.focus)?plan.focus.map(f=>({kind:f.kind,key:f.key,label:f.label})):[],
        count:plan.available&&Array.isArray(plan.items)?plan.items.length:0};
      if(revision.available){
        proposals.push({...suggestion('revision_session',30,null,
          'Séance de révision pertinente',
          'Une séance complémentaire est proposée par le moteur V1 à partir des difficultés effectivement suivies.'),
          evidence:{source:'consolidationPlan',focus:revision.focus,count:revision.count}});
      }
    }

    if(!areas.length&&!stats.detailedSessions&&Object.keys(state.entries||{}).length===0){
      proposals.push(suggestion('not_evaluated',90,null,
        'Aucune notion encore évaluée','Commence une séance du parcours pour obtenir un bilan fondé sur tes réponses.'));
    }
    const grouped=overlappingAreas(proposals,state);
    const visible=visibleRecommendations(grouped.items,limit)
      .map(item=>({...item,explanation:explain(item)}));
    const limitations=[];
    if(stats.sessionsWithoutDetail)
      limitations.push(`${stats.sessionsWithoutDetail} séance(s) terminée(s) sans journal détaillé : résultats non reconstitués.`);
    if(!Array.isArray(options.exercises))
      limitations.push('Disponibilité d’une séance complémentaire non vérifiée sans le catalogue de QCM.');
    limitations.push('Les succès en consolidation restent distincts des preuves de maîtrise du parcours ordinaire.');
    return {schemaVersion:VERSION,status:'ok',completedSessions:state.completed,
      currentSession,observations:{parcours:copyCounts(stats.parcours),
        consolidation:copyCounts(stats.consolidation),
        detailedSessions:stats.detailedSessions,sessionsWithoutDetail:stats.sessionsWithoutDetail,
        evaluatedMicros:areas.filter(a=>a.kind==='micro').length,
        evaluatedAxes:areas.filter(a=>a.kind==='axis').length},
      revision,recommendations:visible,limitations};
  }
  return {VERSION,OUTCOMES,outcome,buildReport};
});
