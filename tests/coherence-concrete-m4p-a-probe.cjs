'use strict';
// Native selection probe: observation only, never changes q or deck.
const feature=require('../quizz-coherence-m4-diversite.js').features;
const family=q=>String(q.caseFamily||q.id);
function instrument(source){
 const start='const selected=[],ids=new Set(),families=new Set(),themes={},answers={},contexts={},concepts={};';
 const anchor='const m=mOf(q),cat=category||classify(q);';
 const end='return logicalOrder(selected,state).map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));';
 for(const a of [start,anchor,end])if(source.split(a).length!==2)throw Error('Ancre diagnostic modifiée');
 return source.replace(start,start+'\n    const __probeSlots=[];').replace(anchor,`
      if(s<20){
       const winner=ranked.find(r=>r.q===q),concept=mOf(q).concept;
       const key=v=>JSON.stringify([v.theme,mOf(v).concept,mOf(v).stage,mOf(v).minSession,mOf(v).requires,v.difficulty,context(v),bid(v),microKey(v),axisKey(v),classify(v),fresh(v),novelFamily(v),oldFamily(v),!!due(v),!!bad(v)]);
       const candidates=exercises.filter(v=>v.id!==q.id&&mOf(v).concept===concept);
       const poolIds=new Set(pool.map(v=>v.id)),listIds=new Set(list.map(v=>v.id)),scores=new Map(ranked.map(r=>[r.q.id,r.v]));
       const stages=candidates.map(v=>{
        let rejection=null;
        if(!poolIds.has(v.id))rejection='hors pool natif (éligibilité ou garde profil)';
        else if(!listIds.has(v.id))rejection='hors liste du rôle/priorité';
        else if(!available(v))rejection='plafond natif / ID utilisé';
        else if(!scores.has(v.id))rejection='filtre famille/nouveauté/équilibre';
        else if(key(v)!==key(q))rejection='strate native stricte différente';
        else if(scores.get(v.id)!==winner.v)rejection='score natif différent';
        return {id:v.id,rejection,score:scores.get(v.id)??null,family:family(v),answer:v.answer,auction:v.auction,h:v.h,shape:v.shape,level:v.difficulty};
       });
       __probeSlots.push({index:selected.length,id:q.id,concept,category,priority,forcedReason:forcedReason||null,explicitRecall,score:winner.v,fresh:fresh(q),novel:novelFamily(q),due:!!due(q),bad:!!bad(q),stages,rankedTotal:ranked.length});
      }
      ${anchor}`).replace(end,`
      if(s<20)__m4Pick({session:s+1,history:state,exercises,metadataById:prerequis.byId,selected,slots:__probeSlots},[],null);
      ${end}`);
}
function pick(ctx,rows,old,maxSession,onChange){
 const {session,history,exercises,metadataById:meta,selected,slots}=ctx;
 const byId=new Map(exercises.map(q=>[q.id,q])),recent=(history.journal||[]).filter(e=>e.mode==='parcours'&&session-e.session<=2&&session>e.session).flatMap(e=>(e.answers||[]).map(a=>({a,q:byId.get(a.id),session:e.session})));
 const deck=selected.map(v=>v.exercise);
 for(const slot of slots){
  const q=byId.get(slot.id),f=feature(q,meta[q.id]),rest=deck.filter(v=>v.id!==q.id);
  const local=rest.filter(v=>feature(v,meta[v.id])?.near===f?.near),prior=recent.filter(v=>v.q&&feature(v.q,meta[v.q.id])?.near===f?.near);
  const used=new Set(rest.map(family)),localNear=new Set(rest.map(v=>feature(v,meta[v.id])?.near)),recentNear=new Set(recent.filter(x=>x.q).map(x=>feature(x.q,meta[x.q.id])?.near));
  const counts={},details=[];
  for(const a of slot.stages){
   const v=byId.get(a.id),vf=feature(v,meta[v.id]);let reason=a.rejection;
   if(!reason&&used.has(a.family))reason='collision famille deck final';
   if(!reason&&(vf?.near===f?.near||localNear.has(vf?.near)||recentNear.has(vf?.near)))reason='pas de contraste de proximité inédit';
   if(!reason&&(v.answer!==q.answer||JSON.stringify(v.auction)!==JSON.stringify(q.auction)))reason='enchère/contexte réel différent';
   counts[reason||'contraste même décision disponible']=(counts[reason||'contraste même décision disponible']||0)+1;
   if(local.length||prior.length)details.push({...a,reason});
  }
  const {stages,...safe}=slot;
  onChange({session,...safe,localNear:local.map(x=>x.id),recentNear:prior.map(x=>({id:x.q.id,session:x.session,response:x.a})),counts,alternatives:details});
 }
 return old;
}
module.exports={instrument,pick};
