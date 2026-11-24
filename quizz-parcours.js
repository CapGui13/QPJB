/* QPJB — parcours algorithmique V1.10 : preuves de maîtrise séparées des entraînements, sans IA ni API. */
(function(root,factory){
  const api=factory();
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
        button.style.marginLeft='8px';
        const input=root.document.createElement('input');
        input.type='file';input.id='progress-import-file';
        input.accept='.json,application/json';input.hidden=true;
        exportButton.insertAdjacentElement('afterend',button);
        button.insertAdjacentElement('afterend',input);
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
})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  const VERSION=1;
  // Métadonnées de sélection purement descriptives : aucun changement des
  // poids, de l'éligibilité, de la notation ou des corrigés.
  const SELECTION_REASONS=[
    'equilibre_ouvertures','nouveau_qcm','rappel_erreur_aide',
    'rappel_nouvelle_situation','rappel_question','complement_catalogue'
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
  function empty(){return {version:VERSION,completed:0,entries:{},skills:{},micros:{},axes:{},
    active:null,journal:[],difficultyFeedback:[],difficultyAdjustment:0};}
  function load(raw){
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
              assisted:!!v.assisted,hadFreeError:!!v.hadFreeError};
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
        answers:event.answers.map(a=>({
          id:a.id,result:a.result,choice:a.choice===null?null:a.choice.slice(0,100),
          assisted:!!a.assisted,hadFreeError:!!a.hadFreeError,
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
  function themeFloor(exercises,theme){
    const values=exercises.filter(x=>x.theme===theme).map(x=>x.difficulty);
    return values.length?Math.min(...values):1;
  }
  function levelFor(state,exercises,theme){
    return Math.max(themeFloor(exercises,theme),state.skills[theme]?.level||1);
  }
  function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function select(exercises,state,n=10){
    const s=state.completed,limit=clamp(int(n,10),1,20);
    const pool=exercises.filter(x=>Object.hasOwn(INTRO,x.theme)&&s>=INTRO[x.theme]&&Number.isInteger(x.difficulty)&&
      (x.theme!=='ouv'||bid(x)!=='2♣'||s>=INTRO.fortes));
    const previous=state.entries||{};
    // Les micro-categories (ex. sa:1SA) regroupent plusieurs conventions.
    // Une reussite en Texas ne doit pas repousser le rappel d'un Stayman.
    // Pour rapprocher deux cas, exiger la meme ouverture visible et la meme
    // enchere attendue, sans pretendre avoir homologue une competence fine.
    const concept=x=>'situation:'+situation(x);
    const latestIndependent={};
    for(const x of pool){
      const r=previous[x.id];
      if(r&&r.result==='correct'&&!r.assisted)
        latestIndependent[concept(x)]=Math.max(latestIndependent[concept(x)]??-1,r.lastSession);
    }
    // Pré-calcul : ne jamais rescanner les 1 523 QCM lors de chaque comparaison.
    const targetByTheme=Object.fromEntries(ROADMAP.map(([theme])=>[theme,levelFor(state,exercises,theme)]));
    const due=pool.filter(x=>{
      const r=previous[x.id];if(!r||r.due>s||r.lastSession>=s)return false;
      // Les succès autonomes attendent au minimum 5/11/19 séances.
      // Seule une bonne reponse du meme contexte ET de la meme enchere
      // repousse le rappel. Une simple micro-categorie commune ne suffit pas.
      if(r.result==='correct'&&!r.assisted)
        return s-Math.max(r.lastSession,latestIndependent[concept(x)]??-1)>=
          (r.streak>=3?19:r.streak===2?11:5);
      return true;
    });
    const fresh=pool.filter(x=>!previous[x.id]);
    const selected=[],picked=new Set(),count={},bidCount={},contextCount={},microCount={},axisCount={};
    // Erreur récente -> priorité modérée aux nouveaux cas similaires.
    // Ne touche ni à la montée en difficulté ni aux révisions classiques.
    const needBySituation={},needByContext={};
    for(const x of exercises){
      const r=previous[x.id];if(!r)continue;
      const age=s-r.lastSession;
      if(age<1||age>8)continue;
      const weight=r.result==='wrong'?34:r.result==='skipped'?22:r.assisted?17:0;
      if(!weight)continue;
      const key=situation(x);
      needBySituation[key]=Math.max(needBySituation[key]||0,Math.max(0,weight-Math.max(0,age-2)*4));
      // Transfert d'apprentissage : la même ouverture peut appeler une
      // réponse différente. Favoriser aussi ce contexte, pas un seul libellé.
      if(opener(x)){
        const ctx=context(x);
        needByContext[ctx]=Math.max(needByContext[ctx]||0,
          Math.max(0,Math.min(28,weight)-Math.max(0,age-2)*4));
      }
    }
    const recentOpeningBids={};
    const latestTheme={};
    for(const x of exercises){
      const rec=previous[x.id];
      if(rec&&(!Object.hasOwn(latestTheme,x.theme)||rec.lastSession>latestTheme[x.theme]))
        latestTheme[x.theme]=rec.lastSession;
      if(x.theme==='ouv'&&rec&&s-rec.lastSession<=3){
        const answer=bid(x);
        recentOpeningBids[answer]=(recentOpeningBids[answer]||0)+1;
      }
    }
    // LOT_B_EVIDENCE_BEGIN
    // Lire huit séances ordinaires récentes, sans ajouter de champ sauvegardé.
    // Aide ou première erreur libre = fragilité, jamais une réussite autonome.
    const foundationThemes=new Set(['ouv','majeur','mineur','sa','red','second','stayman']);
    const recentFoundation={};
    for(const event of (state.journal||[]).filter(e=>e.mode==='parcours').slice(-8))
      for(const answer of event.answers||[]){
        if(!foundationThemes.has(answer.theme))continue;
        const stat=recentFoundation[answer.theme]||{attempts:0,weak:0};
        stat.attempts++;
        if(answer.result!=='correct'||answer.assisted||answer.hadFreeError)stat.weak++;
        recentFoundation[answer.theme]=stat;
      }
    const foundationSummary=Object.values(recentFoundation)
      .reduce((v,r)=>({attempts:v.attempts+r.attempts,weak:v.weak+r.weak}),{attempts:0,weak:0});
    const struggling=foundationSummary.attempts>=10&&
      foundationSummary.weak*2>=foundationSummary.attempts;
    // LOT_B_EVIDENCE_END
    const maxPerTheme=pool.every(x=>x.theme==='ouv')?limit:4;
    const recentFamily={};
    for(const x of exercises){
      const r=previous[x.id],key=family(x);
      if(r&&(!Object.hasOwn(recentFamily,key)||r.lastSession>recentFamily[key]))
        recentFamily[key]=r.lastSession;
    }
    // LOT_B_DIVERSITY_BEGIN
    // Favoriser de nouveaux contextes et types de réponses, sans les imposer.
    const seenContexts=new Set(),seenDecisions=new Set();
    for(const x of exercises){
      if(!previous[x.id])continue;
      seenContexts.add(x.theme+'|'+String(x.auction?.[0]||''));
      seenDecisions.add(x.theme+'|'+String(x.answer||''));
    }
    // Les échecs quasi systématiques exigent une protection plus forte
    // contre les cas difficiles que les succès fréquents avec assistance.
    const severeStruggling=struggling&&foundationSummary.weak*4>=
      foundationSummary.attempts*3;
    // LOT_B_DIVERSITY_END
    const isOpeningPass=x=>x.theme==='ouv'&&bid(x)==='Passe';
    const weakPassDue=due.some(x=>isOpeningPass(x)&&s-previous[x.id].lastSession<=3&&
      (previous[x.id].result!=='correct'||previous[x.id].assisted));
    const passWeak=weakPassDue||((state.micros||{})['ouv:passe']?.score||0)<0;
    function pick(list,kind,reason){
      let ranked=list.filter(x=>!picked.has(x.id));
      if(!ranked.length)return false;
      const famUsed=new Set(selected.map(x=>family(x.exercise)));
      const noSameFamily=ranked.filter(x=>!famUsed.has(family(x)));
      if(noSameFamily.length)ranked=noSameFamily;
      const withinCap=ranked.filter(x=>(count[x.theme]||0)<maxPerTheme);
      if(withinCap.length)ranked=withinCap;
      else if(kind==='revision'&&fresh.some(x=>!picked.has(x.id)&&(count[x.theme]||0)<maxPerTheme))
        return false; // Une révision ne doit pas faire dépasser le plafond d'un thème.
      // À l'ouverture, deux décisions identiques maximum par séance si le
      // catalogue comporte assez d'alternatives réellement distinctes.
      // Au-delà du premier cours : un Passe d'entrée en rappel ordinaire,
      // deux en cas de fragilité, sans bloquer un catalogue réduit.
      if(s>0){
        const allowed=ranked.filter(x=>!isOpeningPass(x)||(bidCount['ouv|Passe']||0)<(passWeak?2:1));
        if(allowed.length)ranked=allowed;
        else if(pool.some(x=>!picked.has(x.id)&&!isOpeningPass(x)))return false;
      }
      const distinctBids=ranked.filter(x=>x.theme!=='ouv'||
        (bidCount['ouv|'+bid(x)]||0)<2);
      if(distinctBids.length)ranked=distinctBids;
      // Ne pas confondre les réponses à 1♣ et à 1♦, ni à 1♥ et 1♠.
      const otherContexts=ranked.filter(x=>
        (x.theme!=='mineur'&&x.theme!=='majeur')||!opener(x)||
        (contextCount[context(x)]||0)<2);
      if(otherContexts.length)ranked=otherContexts;
      // Jamais trois occurrences d'une micro-compétence dans une même séance
      // si le catalogue offre d'autres notions éligibles.
      if(s>=4){
        const otherMicros=ranked.filter(x=>!microKey(x)||(microCount[microKey(x)]||0)<2);
        if(otherMicros.length)ranked=otherMicros;
      }
      // Écarter les micro-compétences confirmées récemment, sauf véritable rappel.
      if(kind!=='revision'){
        const exploratory=ranked.filter(x=>{
          const key=microKey(x),m=key&&(state.micros||{})[key];
          return !m||m.score<2||m.independent<2||s-m.lastSession>=4;
        });
        if(exploratory.length)ranked=exploratory;
      }
      // LOT_B_PICK_BEGIN
      // Calculer ce quota une fois par place, pas pour chaque QCM candidat.
      const foundationChosen=selected.reduce(
        (n,chosen)=>n+Number(foundationThemes.has(chosen.exercise.theme)),0);
      // LOT_B_PICK_END
      function score(x){
        const t=x.theme,age=s-INTRO[t],already=count[t]||0;
        const skill=targetByTheme[t];
        const recent=Object.hasOwn(recentFamily,family(x))?s-recentFamily[family(x)]:999;
        const variety=recent<=2?-145:recent<=5?-85:recent<=8?-35:0;
        const focus=age<=1?95:age<=3?55:age<=7?20:0;
        const last=Object.hasOwn(latestTheme,t)?s-latestTheme[t]:Math.min(9,age+1);
        const balance=-31*already;
        // Le ressenti règle la difficulté des prochaines questions, sans modifier
        // les preuves indépendantes ni les niveaux de maîtrise calculés.
        const target=clamp(skill+state.difficultyAdjustment,1,5);
        const fit=-28*Math.abs(x.difficulty-target);
        const need=state.skills[t]?.errors?12*state.skills[t].errors:0;
        const answer=bid(x),sameAnswer=bidCount[t+'|'+answer]||0;
        // Couvrir d'abord plusieurs types d'ouvertures : 1♣ et 1♦ doivent
        // apparaître tôt, même quand un tirage simple favoriserait 1SA/Passe.
        // En dehors des ouvertures, varier aussi la réponse attendue à l'intérieur
        // d'une rubrique pour réduire la mémorisation superficielle.
        const bidVariety=t==='ouv'
          ?(sameAnswer===0?60:sameAnswer===1?7:-105*(sameAnswer-1))+
            ((answer==='1♣'||answer==='1♦')&&sameAnswer<2?34:0)-
            Math.min(36,(recentOpeningBids[answer]||0)*9)
          :-Math.min(80,sameAnswer*27);
        const lead=opener(x);
        const contextVariety=(t==='mineur'||t==='majeur'||t==='sa')&&lead
          ?-Math.min(90,(contextCount[context(x)]||0)*36):0;
        const contextualNeed=kind==='revision'?0:
          (Math.round((needBySituation[situation(x)]||0)*0.6)+
           Math.round((needByContext[context(x)]||0)*0.6));
        // Distinguer une lacune locale d'un échec sur toute la rubrique :
        // un score faible oriente vers de nouveaux cas du même sous-thème.
        const micro=microKey(x),microRecord=micro?(state.micros||{})[micro]:null;
        const microNeed=kind==='revision'||!microRecord?0:
          clamp(-microRecord.score*13,-39,39);
        const microVariety=micro?-Math.min(60,(microCount[micro]||0)*20):0;
        const masteryCooldown=kind==='revision'||!microRecord?0:
          microRecord.score>=2&&microRecord.independent>=2
            ?(s-microRecord.lastSession<4?-145:
              s-microRecord.lastSession<8?-80:
              s-microRecord.lastSession<12?-30:0):0;
        const microDiscovery=kind==='revision'||!micro?0:
          !microRecord?42:microRecord.score<=-2?42:0;
        // Bonus léger sur un axe transversal fragile. N'affecte que les
        // exercices explicitement audités, sans modifier la difficulté.
        const axis=axisKey(x),axisRecord=axis?(state.axes||{})[axis]:null;
        const axisNeed=kind==='revision'||!axisRecord?0:
          clamp(-axisRecord.score*11,-33,33);
        const axisVariety=axis?-Math.min(32,(axisCount[axis]||0)*8):0;
        // LOT_B_SCORE_BEGIN
        // Repondérer les fondamentaux fragiles. Aucune rubrique n'est exclue.
        const evidence=recentFoundation[t];
        const foundationNeed=!struggling||kind==='revision'||!foundationThemes.has(t)||!evidence||
          evidence.attempts<3||evidence.weak<2?0:
          Math.round(200*evidence.weak/evidence.attempts);
        // Ne pas sacrifier toute la découverte : réserver de la place aux autres thèmes.
        const explorationFloor=struggling&&s>=8&&kind!=='revision'&&foundationChosen>=8
          ?(foundationThemes.has(t)?-500:250):0;
        const discovery=struggling&&kind!=='revision'&&s>=8&&
          !foundationThemes.has(t)&&!Object.hasOwn(latestTheme,t)
          ?(x.difficulty<=2?260:x.difficulty===3?130:0):0;
        const newFamily=struggling&&kind!=='revision'&&recent>=999?200:0;
        // La couverture se mesure aussi par contextes d'ouverture et réponses,
        // pas seulement par le nombre d'identifiants de QCM distincts.
        const rareContext=struggling&&kind!=='revision'&&
          !seenContexts.has(t+'|'+String(x.auction?.[0]||''))?70:0;
        const rareAnswer=struggling&&kind!=='revision'&&
          !seenDecisions.has(t+'|'+String(x.answer||''))?30:0;
        // Éviter de présenter des cas de niveau 4–5 à un élève qui échoue partout.
        const hardWhileStruggling=struggling&&kind!=='revision'&&x.difficulty>=4
          ?(severeStruggling?-250:-110):0;
        const lotBPriority=foundationNeed+explorationFloor+discovery+
          newFamily+rareContext+rareAnswer+hardWhileStruggling;
        // LOT_B_SCORE_END
        const review=kind==='revision'
          ?(previous[x.id]?.result==='wrong'?40:previous[x.id]?.result==='skipped'?30:previous[x.id]?.assisted?20:0)
          :0;
        return (kind==='revision'?0:focus)+Math.min(36,last*4)+balance+fit+need+variety+review+bidVariety+contextVariety+contextualNeed+microNeed+microVariety+axisNeed+axisVariety+masteryCooldown+microDiscovery+lotBPriority;
      }
      ranked.sort((a,b)=>score(b)-score(a)||hash(a.id+'#'+s)-hash(b.id+'#'+s));
      const winner=ranked[0];picked.add(winner.id);
      count[winner.theme]=(count[winner.theme]||0)+1;
      contextCount[context(winner)]=(contextCount[context(winner)]||0)+1;
      const mk=microKey(winner);
      if(mk)microCount[mk]=(microCount[mk]||0)+1;
      const ak=axisKey(winner);
      if(ak)axisCount[ak]=(axisCount[ak]||0)+1;
      const chosenAnswer=winner.theme+'|'+bid(winner);
      bidCount[chosenAnswer]=(bidCount[chosenAnswer]||0)+1;
      selected.push({exercise:winner,kind,reason});
      return true;
    }
    // Ouvrir ou ne pas ouvrir : contraste dès la deuxième main et
    // trois Passes simples espacés sur dix questions.
    function openingCandidates(answer,list=fresh){
      return list.filter(x=>x.theme==='ouv'&&bid(x)===answer&&
        !selected.some(chosen=>family(chosen.exercise)===family(x)));
    }
    if(s===0&&limit>=8){
      const targets=limit===8?['1♣','Passe','1♥','1♦','1SA','1♠','1♣','1♦']:
        limit===9?['1♣','Passe','1♥','1♦','Passe','1SA','1♠','1♣','1♦']:
        ['1♣','Passe','1♥','1♦','Passe','1SA','1♠','1♣','Passe','1♦'];
      for(const target of targets){
        const candidates=openingCandidates(target);
        const simple=target==='Passe'?candidates.filter(x=>x.difficulty===1&&Number.isInteger(x.h)&&x.h<12):[];
        if(candidates.length)pick(simple.length?simple:candidates,'nouveau','equilibre_ouvertures');
      }
    }
    // Deuxième séance : rappeler le seuil et les deux mineures, tout en
    // réservant les autres places aux réponses. Priorité à un Passe raté.
    if(s===1&&limit>=10&&pool.some(x=>x.theme==='mineur')&&pool.some(x=>x.theme==='majeur')){
      for(const target of ['1♣','1♦']){
        const options=openingCandidates(target);
        if(options.length)pick(options,'nouveau','equilibre_ouvertures');
      }
      const review=openingCandidates('Passe',due.filter(x=>previous[x.id].result!=='correct'||previous[x.id].assisted));
      const options=openingCandidates('Passe');
      if(!pick(review,'revision','rappel_erreur_aide')&&options.length)
        pick(options,'nouveau','equilibre_ouvertures');
    }
    // Revisions : erreur/aide = revoir le cas du ; reussite autonome =
    // proposer une autre main avec ouverture et reponse identiques, si possible.
    const weakDueCandidates=due.filter(x=>
      previous[x.id].result!=='correct'||previous[x.id].assisted);
    const strongConcepts=new Set(due.filter(x=>
      previous[x.id].result==='correct'&&!previous[x.id].assisted).map(concept));
    const alternateReviews=fresh.filter(x=>strongConcepts.has(concept(x)));
    const reviewQuota=Math.min(weakDueCandidates.length?2:1,Math.floor(limit/4),due.length);
    const plan=[];
    for(let i=0;i<limit;i++)plan.push(i===3||i===7?'revision':'nouveau');
    let plannedReviews=selected.filter(x=>x.kind==='revision').length;
    for(let i=selected.length;i<limit;i++){
      let kind=plan[i];
      if(kind==='revision'&&plannedReviews>=reviewQuota)kind='nouveau';
      if(kind==='revision'&&
        (pick(weakDueCandidates,'revision','rappel_erreur_aide')||
         pick(alternateReviews,'revision','rappel_nouvelle_situation')||
         pick(due,'revision','rappel_question'))){plannedReviews++;continue}
      if(pick(fresh,'nouveau','nouveau_qcm'))continue;
      if(pick(due,'revision','rappel_question'))continue;
      if(pick(pool,'revision','complement_catalogue'))continue;
      break;
    }
    // Mélange logique déterministe : casser les répétitions de réponse ou
    // de thème si possible, sans modifier les QCM retenus ni leurs motifs.
    // Une séance active reste inchangée (start).
    const ordered=[],remaining=selected.slice();
    while(remaining.length){
      const last=ordered.at(-1)?.exercise,before=ordered.at(-2)?.exercise;
      let index=0;
      if(last){
        const sameBid=x=>bid(x.exercise)===bid(last);
        const sameBlock=x=>before&&before.theme===last.theme&&x.exercise.theme===last.theme;
        if(sameBid(remaining[0])||sameBlock(remaining[0])){
          const alternative=remaining.findIndex(x=>!sameBid(x)&&!sameBlock(x));
          if(alternative>=0)index=alternative;
          else if(sameBid(remaining[0])){
            const other=remaining.findIndex(x=>!sameBid(x));
            if(other>=0)index=other;
          }
        }
      }
      ordered.push(remaining.splice(index,1)[0]);
    }
    return ordered.map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));
  }

  // V1.7 : séance complémentaire de 4 à 10 cas distincts selon la couverture
  // réelle du catalogue ; ne jamais fabriquer ou répéter un cas pour remplir.
  // Le parcours principal reste strictement composé de dix QCM.
  // Un besoin doit être confirmé par au moins deux essais : pas de rattrapage
  // déclenché par une erreur isolée ou une classification non auditée.
  function consolidationPlan(state,exercises,n=10){
    if(state.active)return {available:false,reason:'session-active',focus:[],items:[]};
    if(state.lastConsolidatedAt===state.completed)return {available:false,reason:'already-consolidated',focus:[],items:[]};
    const limit=clamp(int(n,10),1,10),minFamilies=Math.min(4,limit),s=state.completed;
    let hasEvidence=false;
    const pool=exercises.filter(x=>Object.hasOwn(INTRO,x.theme)&&s>=INTRO[x.theme]&&Number.isInteger(x.difficulty));
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
    if(!focus.length)return {available:false,reason:hasEvidence?'pool-insufficient':'no-evidenced-weakness',focus:[],items:[]};
    const items=[],usedIds=new Set(),usedFamilies=new Set(),counts={},bids={},contexts={};
    function choose(target){
      let options=target.candidates.filter(x=>!usedIds.has(x.id)&&!usedFamilies.has(family(x)));
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
          -28*Math.abs(x.difficulty-levelFor(state,exercises,x.theme))
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
      items:available?items:[]};
  }

  // Bilan borné : un résultat de séance, pas une déclaration de maîtrise.
  // Les libellés proviennent uniquement de la taxonomie déjà auditée.
  function focusLabel(target){
    if(typeof target!=='string')return null;
    const p=target.indexOf(':');
    if(p<0)return null;
    const kind=target.slice(0,p),key=target.slice(p+1);
    return kind==='micro'&&Object.hasOwn(MICRO_LABELS,key)?MICRO_LABELS[key]:
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
  function startConsolidation(state,exercises){
    // La séance interrompue, qu'elle soit normale ou complémentaire, prime.
    if(state.active)return start(state,exercises);
    const plan=consolidationPlan(state,exercises,10);
    if(!plan.available)return [];
    const byId=new Map(exercises.map(x=>[x.id,x]));
    state.active={ids:plan.items.map(x=>x.id),index:0,answers:{},
      createdAt:state.completed,mode:'consolidation',
      targets:plan.items.map(x=>x.target)};
    return state.active.ids.map(id=>byId.get(id));
  }
  function start(state,exercises){
    const byId=new Map(exercises.map(x=>[x.id,x]));
    if(state.active){
      if(state.active.ids.every(id=>byId.has(id)))return state.active.ids.map(id=>byId.get(id));
      state.active=null;
    }
    const chosen=select(exercises,state,10);
    if(!chosen.length)return [];
    state.active={ids:chosen.map(x=>x.id),index:0,answers:{},
      createdAt:state.completed,selection:chosen.map(x=>({
        id:x.id,kind:x.kind,reason:x.reason
      }))};
    return state.active.ids.map(id=>byId.get(id));
  }
  function record(state,x,result,position,choice,assisted,hadFreeError){
    const active=state.active;
    if(!active||active.ids[position]!==x.id||Object.hasOwn(active.answers,position))return false;
    if(!['correct','wrong','skipped'].includes(result))return false;
    active.answers[position]={result,choice:typeof choice==='string'?choice:null,
      assisted:!!assisted,hadFreeError:!!hadFreeError};
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
    const skill=state.skills[x.theme]||{level:Math.max(1,x.difficulty===1?1:2),
      clean:0,errors:0,lastCleanSession:null,lastLevelChangeSession:null};
    if(independent){
      skill.errors=0;
      // Une seule preuve par rubrique et par séance : trois exercices
      // réussis à la suite ne doivent pas provoquer une promotion immédiate.
      if(x.difficulty>=skill.level&&skill.lastCleanSession!==state.completed){
        skill.clean++;
        skill.lastCleanSession=state.completed;
      }
      if(skill.clean>=3&&skill.lastLevelChangeSession!==state.completed){
        skill.level=Math.min(5,skill.level+1);
        skill.lastLevelChangeSession=state.completed;
        skill.clean=0;
      }
    }else{
      skill.clean=0;
      skill.errors++;
      if(skill.errors>=2){
        if(skill.lastLevelChangeSession!==state.completed){
          skill.level=Math.max(1,skill.level-1);
          skill.lastLevelChangeSession=state.completed;
        }
        skill.errors=0;
      }
    }
    state.skills[x.theme]=skill;
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
    const record={
      mode:active.mode==='consolidation'?'consolidation':'parcours',
      session:state.completed+1,recordedAt:new Date().toISOString(),
      answers:active.ids.map((id,i)=>{
        const a=active.answers[i],q=byId.get(id);
        const reason=active.selection?.[i];
        return {id,result:a.result,choice:a.choice,assisted:a.assisted,
          hadFreeError:a.hadFreeError,theme:q?.theme||null,
          difficulty:q?.difficulty??null,family:q?family(q):state.entries[id]?.family||null,
          micro:q?microKey(q):null,axis:q?axisKey(q):null,
          ...(validSelection(reason,id)?{
            selectionKind:reason.kind,selectionReason:reason.reason
          }:{})};
      })
    };
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
    const detailed=journal.filter(x=>x.mode==='parcours').length;
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
        note:'Les séances antérieures à la création du journal n’ont pas leurs réponses détaillées reconstituées. Le suivi par question et les anciennes réponses du Quiz sont limités aux données réellement conservées.'
      },
      summary:{completedSessions:state.completed,recordedDetailedSessions:detailed,
        totalQuestionEntries:questions.length,difficultyAdjustment:state.difficultyAdjustment||0},
      sessions:journal,
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
    const restored=load(old);
    // Un ancien journal incomplet reste incomplet : ni invention ni perte.
    if(Object.keys(restored.entries).length!==Object.keys(old.entries).length||
      (old.active&&!restored.active)||
      restored.journal.length!==(Array.isArray(old.journal)?old.journal.length:0))
      throw Error('Sauvegarde incohérente : aucune donnée n’a été remplacée.');
    return restored;
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
  return {VERSION,ROADMAP,INTRO,MICRO_LABELS,microKey,weaknesses,AXIS_LABELS,AXIS_AUDIT,axisKey,axisWeaknesses,DASH_LABELS,dashboard,focusLabel,consolidationPlan,startConsolidation,empty,load,select,start,record,move,finish,adjustDifficulty,exportProgress,importProgress,selectionDiagnostics,SELECTION_REASONS,summary,levelFor};
});