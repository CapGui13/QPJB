/* QPJB — parcours algorithmique V1.3 : progression étayée, sans IA ni API. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.QPJBParcours=api;
})(typeof window!=='undefined'?window:null,function(){
  'use strict';
  const VERSION=1;
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
    'contre:mineure':'Répondre au contre après une ouverture mineure',
    'contre:majeure':'Répondre au contre après une ouverture majeure',
    'contre:barrage':'Répondre au contre après un deux faible',
    'apres_inter:mineure':'Répondre après intervention sur une mineure',
    'apres_inter:majeure':'Répondre après intervention sur une majeure',
    'reveil:mineure':'Réveiller après une ouverture mineure',
    'reveil:majeure':'Réveiller après une ouverture majeure',
    'reveil:barrage':'Réveiller après une ouverture au palier de deux'
  };
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
  function empty(){return {version:VERSION,completed:0,entries:{},skills:{},micros:{},active:null};}
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
      }
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
    const pool=exercises.filter(x=>Object.hasOwn(INTRO,x.theme)&&s>=INTRO[x.theme]&&Number.isInteger(x.difficulty));
    const previous=state.entries||{};
    // Pré-calcul : ne jamais rescanner les 1 523 QCM lors de chaque comparaison.
    const targetByTheme=Object.fromEntries(ROADMAP.map(([theme])=>[theme,levelFor(state,exercises,theme)]));
    const due=pool.filter(x=>previous[x.id]&&previous[x.id].due<=s&&previous[x.id].lastSession<s);
    const fresh=pool.filter(x=>!previous[x.id]);
    const selected=[],picked=new Set(),count={},bidCount={},contextCount={},microCount={};
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
    const maxPerTheme=pool.every(x=>x.theme==='ouv')?limit:4;
    const recentFamily={};
    for(const x of exercises){
      const r=previous[x.id],key=family(x);
      if(r&&(!Object.hasOwn(recentFamily,key)||r.lastSession>recentFamily[key]))
        recentFamily[key]=r.lastSession;
    }
    function pick(list,kind){
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
      const distinctBids=ranked.filter(x=>x.theme!=='ouv'||
        (bidCount['ouv|'+bid(x)]||0)<2);
      if(distinctBids.length)ranked=distinctBids;
      // Ne pas confondre les réponses à 1♣ et à 1♦, ni à 1♥ et 1♠.
      const otherContexts=ranked.filter(x=>
        (x.theme!=='mineur'&&x.theme!=='majeur')||!opener(x)||
        (contextCount[context(x)]||0)<2);
      if(otherContexts.length)ranked=otherContexts;
      function score(x){
        const t=x.theme,age=s-INTRO[t],already=count[t]||0;
        const skill=targetByTheme[t];
        const recent=Object.hasOwn(recentFamily,family(x))?s-recentFamily[family(x)]:999;
        const variety=recent<=1?-95:recent<=3?-30:recent<=5?-10:0;
        const focus=age<=1?95:age<=3?55:age<=7?20:0;
        const last=Object.hasOwn(latestTheme,t)?s-latestTheme[t]:Math.min(9,age+1);
        const balance=-31*already;
        const fit=-28*Math.abs(x.difficulty-skill);
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
        const microVariety=micro?-Math.min(45,(microCount[micro]||0)*12):0;
        const review=kind==='revision'
          ?(previous[x.id]?.result==='wrong'?40:previous[x.id]?.result==='skipped'?30:previous[x.id]?.assisted?20:0)
          :0;
        return (kind==='revision'?0:focus)+Math.min(36,last*4)+balance+fit+need+variety+review+bidVariety+contextVariety+contextualNeed+microNeed+microVariety;
      }
      ranked.sort((a,b)=>score(b)-score(a)||hash(a.id+'#'+s)-hash(b.id+'#'+s));
      const winner=ranked[0];picked.add(winner.id);
      count[winner.theme]=(count[winner.theme]||0)+1;
      contextCount[context(winner)]=(contextCount[context(winner)]||0)+1;
      const mk=microKey(winner);
      if(mk)microCount[mk]=(microCount[mk]||0)+1;
      const chosenAnswer=winner.theme+'|'+bid(winner);
      bidCount[chosenAnswer]=(bidCount[chosenAnswer]||0)+1;
      selected.push({exercise:winner,kind});
      return true;
    }
    const reviewQuota=Math.min(2,Math.floor(limit/4),due.length);
    // Placer les révisions parmi les nouveautés plutôt qu'en bloc.
    const plan=[];
    for(let i=0;i<limit;i++)plan.push(i===3||i===7?'revision':'nouveau');
    let plannedReviews=0;
    for(let i=0;i<limit;i++){
      let kind=plan[i];
      if(kind==='revision'&&plannedReviews>=reviewQuota)kind='nouveau';
      if(kind==='revision'&&pick(due,'revision')){plannedReviews++;continue}
      if(pick(fresh,'nouveau'))continue;
      if(pick(due,'revision'))continue;
      if(pick(pool,'revision'))continue;
      break;
    }
    // La même famille ne doit pas se suivre ; les candidats alternatifs
    // ne sont disponibles qu'en cas d'épuisement du catalogue.
    return selected.map(v=>({id:v.exercise.id,kind:v.kind}));
  }
  function start(state,exercises){
    const byId=new Map(exercises.map(x=>[x.id,x]));
    if(state.active){
      if(state.active.ids.every(id=>byId.has(id)))return state.active.ids.map(id=>byId.get(id));
      state.active=null;
    }
    const chosen=select(exercises,state,10);
    if(!chosen.length)return [];
    state.active={ids:chosen.map(x=>x.id),index:0,answers:{},createdAt:state.completed};
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
    state.entries[x.id]={result,assisted:!!assisted||!!hadFreeError,lastSession:state.completed,
      due:state.completed+(independent?(streak===1?3:streak===2?8:18):1),
      seen:(old.seen||0)+1,streak,family:family(x)};
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
    return true;
  }
  function move(state,index){
    if(state.active)state.active.index=clamp(int(index),0,state.active.ids.length-1);
  }
  function finish(state){
    if(!state.active)return false;
    if(Object.keys(state.active.answers).length!==state.active.ids.length)return false;
    state.completed++;state.active=null;return true;
  }
  function summary(state,exercises){
    const available=ROADMAP.filter(pair=>state.completed>=pair[1]);
    const attempted=new Set(Object.keys(state.entries||{}));
    const topicsDone=new Set(exercises.filter(x=>attempted.has(x.id)).map(x=>x.theme));
    return {session:state.completed+1,completed:state.completed,unlocked:available.length,
      practiced:topicsDone.size,seen:attempted.size,active:!!state.active};
  }
  return {VERSION,ROADMAP,INTRO,MICRO_LABELS,microKey,weaknesses,empty,load,select,start,record,move,finish,summary,levelFor};
});