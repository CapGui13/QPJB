/* QPJB — parcours algorithmique V1 : règles locales, sans IA ni API. */
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
  const int=(x,fallback=0)=>Number.isInteger(x)&&x>=0?x:fallback;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function empty(){return {version:VERSION,completed:0,entries:{},skills:{},active:null};}
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
          clean:clamp(int(v.clean),0,3),errors:clamp(int(v.errors),0,2)};
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
    const due=pool.filter(x=>previous[x.id]&&previous[x.id].due<=s&&previous[x.id].lastSession<s);
    const fresh=pool.filter(x=>!previous[x.id]);
    const selected=[],picked=new Set(),count={};
    const latestTheme={};
    for(const x of exercises){
      const rec=previous[x.id];
      if(rec&&(!Object.hasOwn(latestTheme,x.theme)||rec.lastSession>latestTheme[x.theme]))
        latestTheme[x.theme]=rec.lastSession;
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
      function score(x){
        const t=x.theme,age=s-INTRO[t],already=count[t]||0;
        const skill=levelFor(state,exercises,t);
        const recent=Object.hasOwn(recentFamily,family(x))?s-recentFamily[family(x)]:999;
        const variety=recent<=1?-95:recent<=3?-30:recent<=5?-10:0;
        const focus=age<=1?95:age<=3?55:age<=7?20:0;
        const last=Object.hasOwn(latestTheme,t)?s-latestTheme[t]:Math.min(9,age+1);
        const balance=-31*already;
        const fit=-28*Math.abs(x.difficulty-skill);
        const need=state.skills[t]?.errors?12*state.skills[t].errors:0;
        const review=kind==='revision'
          ?(previous[x.id]?.result==='wrong'?40:previous[x.id]?.result==='skipped'?30:previous[x.id]?.assisted?20:0)
          :0;
        return (kind==='revision'?0:focus)+Math.min(36,last*4)+balance+fit+need+variety+review;
      }
      ranked.sort((a,b)=>score(b)-score(a)||hash(a.id+'#'+s)-hash(b.id+'#'+s));
      const winner=ranked[0];picked.add(winner.id);
      count[winner.theme]=(count[winner.theme]||0)+1;
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
    const old=state.entries[x.id]||{},streak=result==='correct'&&!assisted?(old.streak||0)+1:0;
    state.entries[x.id]={result,assisted:!!assisted,lastSession:state.completed,
      due:state.completed+(result==='correct'&&!assisted?(streak===1?3:streak===2?8:18):1),
      seen:(old.seen||0)+1,streak,family:family(x)};
    const skill=state.skills[x.theme]||{level:Math.max(1,x.difficulty===1?1:2),clean:0,errors:0};
    if(result==='correct'&&!assisted){
      skill.errors=0;
      if(x.difficulty>=skill.level)skill.clean++;
      if(skill.clean>=3){skill.level=Math.min(5,skill.level+1);skill.clean=0}
    }else{
      skill.clean=0;skill.errors++;
      if(skill.errors>=2){skill.level=Math.max(1,skill.level-1);skill.errors=0}
    }
    state.skills[x.theme]=skill;
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
  return {VERSION,ROADMAP,INTRO,empty,load,select,start,record,move,finish,summary,levelFor};
});