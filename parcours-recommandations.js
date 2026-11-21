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
    const responses=new Map(),autonomousByArea=new Map(),assessedByArea=new Map(),helpedByArea=new Map();
    const firstVersion=new Map(),ambiguous=new Set();
    // Les doublons de journal ne sont acceptables comme preuve que si
    // l'issue, l'aide et les étiquettes de la réponse restent identiques.
    // Un import contradictoire ne peut jamais établir un chevauchement.
    for(const event of state.journal||[]){
      if(!event||event.mode!=='parcours'||!integer(event.session)||
          event.session<1||event.session>state.completed)continue;
      for(const a of event.answers||[]){
        if(!safeRecord(a)||typeof a.id!=='string')continue;
        const answerId=event.session+'|'+a.id;
        const signature=JSON.stringify([a.result,a.choice,!!a.assisted,!!a.hadFreeError,
          typeof a.micro==='string'?a.micro:null,typeof a.axis==='string'?a.axis:null]);
        if(firstVersion.has(answerId)&&firstVersion.get(answerId)!==signature)
          ambiguous.add(answerId);
        else if(!firstVersion.has(answerId))firstVersion.set(answerId,signature);
      }
    }
    for(const event of state.journal||[]){
      if(!event||event.mode!=='parcours'||!integer(event.session)||
          event.session<1||event.session>state.completed)continue;
      for(const a of event.answers||[]){
        if(!safeRecord(a)||typeof a.id!=='string')continue;
        const answerId=event.session+'|'+a.id;
        if(ambiguous.has(answerId))continue;
        for(const kind of ['micro','axis']){
          if(typeof a[kind]!=='string')continue;
          const id=kind+':'+a[kind];
          if(!responses.has(id))responses.set(id,new Set());
          if(!responses.get(id).has(answerId)){
            responses.get(id).add(answerId);
            if(outcome(a)==='autonomous')
              autonomousByArea.set(id,(autonomousByArea.get(id)||0)+1);
            if(outcome(a)!=='skipped')
              assessedByArea.set(id,(assessedByArea.get(id)||0)+1);
            if(outcome(a)==='helped')
              helpedByArea.set(id,(helpedByArea.get(id)||0)+1);
          }
        }
      }
    }
    // Le score V1 baisse également sur un saut. Deux questions sautées
    // ne constituent pourtant pas deux erreurs effectivement constatées.
    // Adapter le conseil UNIQUEMENT quand le journal complet en atteste.
    for(const item of proposals){
      if(!['persistent_difficulty','consolidate'].includes(item.type))continue;
      const e=item.evidence;
      if(!e||!['micros','axes'].includes(e.source))continue;
      const id=(e.source==='micros'?'micro':'axis')+':'+e.key;
      if(responses.get(id)?.size!==e.attempts)continue;
      if((assessedByArea.get(id)||0)===0){
        item.type='not_evaluated';
        item.id='not_evaluated:'+id;
        item.priority=90;
        item.title='Notion à réessayer après des questions sautées : '+e.label;
        item.message='Les tentatives détaillées ont toutes été sautées : aucune erreur de réponse n’a été constatée pour cette notion.';
        e.skippedOnly=true;
      }else if((helpedByArea.get(id)||0)===e.attempts){
        // Réponses finales correctes avec aide/erreur libre : aucune autonomie.
        // Préserver le type et la priorité V1 de la recommandation.
        item.title='Autonomie à consolider : '+e.label;
        item.message='Toutes les réponses sont correctes avec aide ou après première erreur libre ; aucune réussite autonome ne peut être conclue.';
        e.assistedOnly=true;
      }
    }
    const divergent=new Set();
    for(const item of proposals){
      const e=item.evidence;
      if(!e||!['micros','axes'].includes(e.source))continue;
      const id=(e.source==='micros'?'micro':'axis')+':'+e.key;
      // Seul un journal COMPLET permet de comparer les indépendances.
      // Un journal partiel reste incertain, sans contre-preuve inventée.
      if(responses.get(id)?.size===e.attempts&&
         (autonomousByArea.get(id)||0)!==e.independent)
        divergent.add(id);
    }
    const erased=new Set();
    for(const micro of proposals){
      if(micro.evidence?.source!=='micros')continue;
      const a=micro.evidence;
      if(divergent.has('micro:'+a.key))continue;
      const left=responses.get('micro:'+a.key);
      if(!left||left.size!==a.attempts)continue;
      for(const axis of proposals){
        if(erased.has(axis)||axis.type!==micro.type||axis.evidence?.source!=='axes')continue;
        const b=axis.evidence,right=responses.get('axis:'+b.key);
        if(divergent.has('axis:'+b.key)||
           !right||right.size!==b.attempts||right.size!==left.size||
           a.score!==b.score||a.attempts!==b.attempts||
           a.independent!==b.independent)continue;
        if(![...left].every(id=>right.has(id)))continue;
        // Métadonnée de classement complémentaire : PAS une seconde preuve.
        if(!Array.isArray(micro.evidence.sameAnswersAs))micro.evidence.sameAnswersAs=[];
        micro.evidence.sameAnswersAs.push({source:'axes',key:b.key,label:b.label});
        erased.add(axis);
      }
    }
    return {items:proposals.filter(p=>{
      if(erased.has(p))return false;
      const e=p.evidence;
      return !e||!['micros','axes'].includes(e.source)||
        !divergent.has((e.source==='micros'?'micro':'axis')+':'+e.key);
    }),merged:erased.size,ambiguous:ambiguous.size,divergent:divergent.size};
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
  function explain(item,completed,stats){
    const e=item.evidence;
    if(item.type==='not_evaluated'&&e?.skippedOnly)return {
      observed:'Les '+e.attempts+' tentative(s) enregistrée(s) pour « '+e.label+' » ont été sautées.',
      caveat:'Un saut ne démontre ni un échec constaté ni une réussite autonome ; le score V1 reste inchangé.',
      action:'Réessayer la notion en répondant à de nouvelles questions du parcours.'
    };
    if(item.type==='not_evaluated'&&e?.source==='journalConsistency')return {
      observed:e.count+' suivi(s) de notion présentent des compteurs indépendants contradictoires avec leur journal détaillé.',
      caveat:'Ces données ne permettent de conclure ni à une maîtrise ni à une difficulté persistante.',
      action:'Vérifier la cohérence de la sauvegarde avant d’utiliser ces conseils.'
    };
    if(item.type==='resume')return {
      observed:e.answered+' réponse(s) enregistrée(s) sur '+e.total+' dans la séance en cours.',
      caveat:'Une séance interrompue n’est pas une validation de ces notions.',
      action:'Reprendre la séance en cours.'
    };
    if(item.type==='revision_session')return {
      observed:'Le moteur V1 confirme un plan de '+e.count+' situation(s), ciblant '+e.focus.map(f=>f.label).join(' et ')+'.',
      caveat:'La disponibilité est calculée sur le catalogue fourni et les scores V1. Une question sautée peut abaisser un score sans erreur constatée ; cette séance ne prouve pas la maîtrise.',
      action:'Lancer la séance complémentaire depuis le parcours, après avoir terminé toute séance active.'
    };
    if(item.type==='not_evaluated')return {
      observed:completed>0?
        `${completed} séance(s) terminée(s), dont ${stats.detailedSessions} avec journal détaillé, sans suivi exploitable de micro-compétence ni d’axe.`:
        'Aucun suivi exploitable de notion évaluée n’est disponible.',
      caveat:stats.detailedSessions>0?
        'Des réponses sont conservées, mais aucune classification auditée ne permet d’en déduire la maîtrise d’une notion.':
        'L’absence de suivi exploitable ne signifie pas que l’élève n’a jamais travaillé ces notions.',
      action:completed>0?'Poursuivre le parcours pour enrichir le suivi des notions auditées.':
        'Commencer une séance du parcours pour obtenir des observations vérifiables.'
    };
    const source=e.source==='micros'?'micro-compétence':'axe transversal';
    const when=integer(e.lastSession)&&e.lastSession<completed?
      ' Dernière tentative à la séance '+(e.lastSession+1)+' sur '+completed+' séance(s) terminée(s).':'';
    const observed='Suivi V1 de '+source+' « '+e.label+' » : '+e.attempts+
      ' tentative(s), '+e.independent+' indépendante(s), score '+e.score+'.'+when;
    if(item.type==='repeated_autonomous')return {
      observed,
      caveat:'Ces réussites répétées ne garantissent pas la maîtrise de toute la rubrique ni le maintien à long terme.',
      action:'Continuer le parcours et varier les situations.'
    };
    if(e.assistedOnly&&['persistent_difficulty','consolidate'].includes(item.type))return {
      observed:observed+' Toutes les réponses finales détaillées ont été correctes avec aide ou après première erreur libre.',
      caveat:'Aucune réussite autonome n’est démontrée, mais le journal ne contient aucune réponse finale incorrecte sur cette notion. Le score V1 reste inchangé.',
      action:'Réessayer plusieurs situations sans aide pour vérifier l’autonomie.'
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
          'Séance complémentaire disponible',
          'Le moteur V1 propose une séance complémentaire à partir des scores du suivi. Les questions sautées peuvent aussi contribuer à cette proposition.'),
          evidence:{source:'consolidationPlan',focus:revision.focus,count:revision.count}});
      }
    }

    if(!active&&!areas.length){
      const archived=state.completed>0&&!stats.detailedSessions;
      const unclassified=stats.detailedSessions>0;
      proposals.push(suggestion('not_evaluated',90,null,
        archived?'Historique sans évaluation de notion exploitable':
          unclassified?'Séances enregistrées sans classification de notion':'Aucune notion encore évaluée',
        archived?'Des séances anciennes existent, mais aucun suivi précis de notion n’est disponible. Poursuis le parcours pour constituer de nouvelles observations.':
          unclassified?'Des réponses sont enregistrées, mais aucune micro-compétence ni axe audité n’est suivi. Poursuis le parcours pour enrichir les observations.':
          'Commence une séance du parcours pour obtenir un bilan fondé sur tes réponses.'));
    }
    const grouped=overlappingAreas(proposals,state);
    if(!grouped.items.length&&grouped.divergent)
      grouped.items.push({...suggestion('not_evaluated',90,null,
        'Suivi contradictoire à vérifier',
        'Les résultats détaillés et les compteurs du parcours ne concordent pas : aucun acquis ni difficulté ne peut être conclu.'),
        evidence:{source:'journalConsistency',count:grouped.divergent}});
    const visible=visibleRecommendations(grouped.items,limit)
      .map(item=>{
        const explanation=explain(item,state.completed,stats);
        if(grouped.divergent)
          explanation.caveat+=' '+grouped.divergent+
            ' suivi(s) de notion divergent entre compteurs et réponses détaillées : aucun acquis ne doit en être déduit.';
        if(grouped.ambiguous)
          explanation.caveat+=' '+grouped.ambiguous+
            ' réponse(s) du journal contiennent des versions contradictoires.';
        if(stats.sessionsWithoutDetail)
          explanation.caveat+=' '+stats.sessionsWithoutDetail+
            ' séance(s) terminée(s) sans journal détaillé : leurs réponses ne sont pas reconstituées.';
        return {...item,explanation};
      });
    const limitations=[];
    if(grouped.divergent)
      limitations.push(`${grouped.divergent} suivi(s) de notion divergent entre compteurs agrégés et réponses détaillées : conseils concernés écartés.`);
    if(grouped.ambiguous)
      limitations.push(`${grouped.ambiguous} réponse(s) du journal avec versions contradictoires : aucun regroupement de conseil fondé sur ces réponses.`);
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


/* PASSE 22 : adaptateur de recette Node22 ÉPHÉMÈRE — RETRAIT OBLIGATOIRE. 
 * Le workflow historique appelle le test V1; cet adaptateur charge les suites
 * M4 seulement dans ce processus GitHub Actions, puis sera supprimé.
 */
if(typeof process!=='undefined'&&process.env.GITHUB_ACTIONS==='true'&&
   /[/\\]tests[/\\]parcours-recommandations-v1\.test\.js$/.test(process.argv[1]||'')){
  const fs=require('node:fs'),path=require('node:path');
  for(const name of fs.readdirSync(path.join(__dirname,'tests')).filter(
    name=>name.startsWith('wave2-recos-')&&name.endsWith('.test.js')).sort()){
    require(path.join(__dirname,'tests',name));
  }
}
