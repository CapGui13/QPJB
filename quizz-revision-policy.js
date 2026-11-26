/* QPJB M2 — pure revision scheduling, no mastery or storage writes. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.QPJBRevisionPolicy=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const family=q=>String(q.caseFamily||q.id);
  const weak=a=>a.result!=='correct'||!!a.assisted||!!a.hadFreeError;
  const valid=a=>a&&['correct','wrong','skipped'].includes(a.result);
  const hand=q=>Array.isArray(q.hand)?JSON.stringify(q.hand):null;
  function prepare({state,metadata,exercises,candidates,session=state.completed,history=state.journal||[],mode='A'}){
    if(!['A','B'].includes(mode)||!Number.isInteger(session)||session<0)throw Error('M2 invalid configuration');
    const byId=new Map(exercises.map(q=>[q.id,q])),eligible=new Set(candidates.map(q=>q.id));
    const groups=new Map(),lastId=new Map(),lastFamily=new Map(),observed=new Set();
    function observe(q,a,s,verified){
      const c=metadata[q.id]?.concept;if(!c||!valid(a)||!Number.isInteger(s)||s<0||s>=session)return;
      if(!groups.has(c))groups.set(c,new Map());
      const g=groups.get(c);if(!g.has(s))g.set(s,[]);
      g.get(s).push({q,a,verified});
      lastId.set(q.id,Math.max(lastId.get(q.id)??-1,s));
      lastFamily.set(family(q),Math.max(lastFamily.get(family(q))??-1,s));
    }
    for(const ev of history){
      if(ev.mode!=='parcours'||!Number.isInteger(ev.session)||ev.session>session)continue;
      for(const a of ev.answers||[]){
        const q=byId.get(a.id);if(!q||!valid(a))continue;
        observed.add(q.id+'|'+(ev.session-1));observe(q,a,ev.session-1,true);
      }
    }
    // Historical summaries are exposures, not invented independent evidence.
    // An explicit null assessment denotes consolidation-only.
    for(const [id,r] of Object.entries(state.entries||{})){
      const q=byId.get(id);if(!q)continue;
      if(Number.isInteger(r.lastSession)&&r.lastSession<session){
        lastId.set(id,Math.max(lastId.get(id)??-1,r.lastSession));
        lastFamily.set(family(q),Math.max(lastFamily.get(family(q))??-1,r.lastSession));
      }
      const a=Object.hasOwn(r,'assessment')?r.assessment:r;
      if(valid(a)&&!observed.has(id+'|'+a.lastSession))observe(q,a,a.lastSession,false);
    }
    const schedule=new Map();
    for(const [c,events] of groups){
      let streak=0,proofFamilies=new Set(),last=-1,lastWeak=false,anchor=[],lastVerified=false;
      for(const [s,attempts] of [...events].sort((a,b)=>a[0]-b[0])){
        last=s;lastWeak=attempts.some(x=>weak(x.a));
        lastVerified=attempts.every(x=>x.verified);
        anchor=attempts.filter(x=>lastWeak?weak(x.a):true).map(x=>x.q);
        if(lastWeak){streak=0;proofFamilies=new Set()}
        else if(lastVerified){
          streak++;
          for(const x of attempts)proofFamilies.add(family(x.q));
        }else{streak=0;proofFamilies=new Set()}
      }
      const interval=lastWeak?1:!lastVerified?3:streak>=3&&proofFamilies.size>=2?18:streak>=2&&proofFamilies.size>=2?8:3;
      schedule.set(c,{last,due:last+interval,interval,weak:lastWeak,anchor});
    }
    const ratings=new Map(),alternates=new Map();
    for(const q of candidates){
      const c=metadata[q.id]?.concept,plan=schedule.get(c);
      if(!plan||session<plan.due)continue;
      const differentFamily=plan.anchor.every(a=>family(a)!==family(q));
      const differentHand=hand(q)!==null&&plan.anchor.every(a=>hand(a)!==hand(q));
      const exact=plan.anchor.some(a=>a.id===q.id);
      const age=session-(lastId.get(q.id)??-999);
      const famAge=session-(lastFamily.get(family(q))??-999);
      const difficultyOK=q.difficulty<=Math.max(...plan.anchor.map(a=>a.difficulty))+(plan.weak?0:1);
      const variant=differentFamily&&differentHand&&difficultyOK;
      if(variant)alternates.set(c,true);
      const priority=(plan.weak?60:25)+Math.min(100,(session-plan.due)*7)+(variant?110:0)
        +(age>=8?30:0)+(famAge>=5?20:0)-(age<=2?120:0)-(difficultyOK?0:100);
      ratings.set(q.id,{concept:c,priority,variant,exact,difficultyOK,weak:plan.weak,due:plan.due,age});
    }
    function rank(q,selectedConcepts={}){
      if(!eligible.has(q.id))return null;
      const r=ratings.get(q.id);
      if(!r||selectedConcepts[r.concept]||!r.difficultyOK)return null;
      if(alternates.has(r.concept)&&!r.variant)return null;
      if(!r.variant&&!r.exact)return null;
      return {...r,reason:r.variant?'rappel_nouvelle_situation':r.weak?'rappel_erreur_aide':'rappel_question'};
    }
    function recall(pool,selectedConcepts={}){
      return pool.filter(q=>rank(q,selectedConcepts)?.weak);
    }
    function bonus(q,category,selectedConcepts={}){
      const r=rank(q,selectedConcepts);if(!r)return 0;
      if(r.weak&&category==='weakness')return Math.min(220,r.priority);
      if(mode==='B'&&!r.weak&&category==='maintenance')return Math.min(100,r.priority);
      return 0;
    }
    return {rank,recall,bonus,schedule:[...schedule].map(([concept,p])=>({concept,last:p.last,due:p.due,interval:p.interval,weak:p.weak}))};
  }
  return {schema:'QPJB_REVISION_POLICY_V1',prepare};
});
