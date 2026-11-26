/* #423 — F/G rappel de fondamentaux, limité au slot de maintenance autorisé. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.QPJBCoherenceM4Recall=api;
})(typeof window==='undefined'?null:window,function(){
 'use strict';
 const CORE=Object.freeze(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
 const core=new Set(CORE), family=q=>String(q?.caseFamily||q?.id||'');
 const clean=a=>a?.result==='correct'&&!a.assisted&&!a.hadFreeError;
 function prepare(ctx){
  const meta=ctx.metadataById||{}, byId=new Map((ctx.exercises||[]).map(q=>[q.id,q])), history=new Map(), families=new Map();
  for(const ev of ctx.history?.journal||[]){
   if(ev.mode!=='parcours'||!Number.isInteger(ev.session)||ev.session>=ctx.session||ev.session<1)continue;
   for(const a of ev.answers||[]){
    const q=byId.get(a.id),c=meta[a.id]?.concept;if(!q||!c)continue;
    const h=history.get(c)||[];h.push({s:ev.session,f:family(q),ok:clean(a),id:q.id});history.set(c,h);
    families.set(family(q),Math.max(families.get(family(q))||0,ev.session));
   }
  }
  // Old exports are evidence of exposure only; do not promote them to proofs.
  const exposed=new Map();
  for(const [id,r] of Object.entries(ctx.history?.entries||{})){
   const q=byId.get(id),c=meta[id]?.concept,s=r?.assessment?.lastSession;
   if(q&&c&&Number.isInteger(s)&&s>=0&&s+1<ctx.session)exposed.set(c,Math.max(exposed.get(c)||0,s+1));
   if(q&&Number.isInteger(r?.lastSession)&&r.lastSession>=0&&r.lastSession+1<ctx.session)families.set(family(q),Math.max(families.get(family(q))||0,r.lastSession+1));
  }
  const last=c=>Math.max(exposed.get(c)||0,...(history.get(c)||[]).map(x=>x.s));
  const gap=c=>last(c)?ctx.session-last(c):0;
  return {meta,byId,history,families,last,gap};
 }
 function rank(ctx={}){
  if(!Number.isInteger(ctx.session)||ctx.session<6||ctx.category!=='maintenance'||ctx.priority||ctx.forcedReason||ctx.history?.active||!Array.isArray(ctx.candidates)||ctx.objective?.allowRecall!==true||!Array.isArray(ctx.objective?.concepts))return [];
  const {meta,byId,history,families,gap}=prepare(ctx);
  const old=byId.get(ctx.baselineId), c=meta[old?.id]?.concept;
  if(!old||!c)return [];
  const selected=(ctx.selected||[]).map(v=>v?.exercise||v).filter(Boolean);
  const selectedConcepts=new Set(selected.map(q=>meta[q.id]?.concept));
  const selectedIds=new Set(selected.map(q=>q.id)),selectedFamilies=new Set(selected.map(family));
  // Do not defer a fragile or overdue concept. Two recent clean sessions and
  // distinct families are mandatory, even if a second occurrence is selected.
  const local=(history.get(c)||[]).filter(x=>x.s>=ctx.session-10);
  const lastBad=Math.max(0,...local.filter(x=>!x.ok).map(x=>x.s));
  const recovered=local.filter(x=>x.ok&&x.s>lastBad);
  const proved=new Set(recovered.map(x=>x.s)).size>=2&&new Set(recovered.map(x=>x.f)).size>=2;
  if(!proved||gap(c)>6||gap(c)===0)return [];
  if(!selectedConcepts.has(c)&&gap(c)>3)return [];
  const allowed=new Set(ctx.objective.concepts),out=[],ids=new Set();
  for(const q of ctx.candidates){
   if(!q?.id||ids.has(q.id))continue;ids.add(q.id);
   const m=meta[q.id],target=m?.concept,age=gap(target),familyAge=families.has(family(q))?ctx.session-families.get(family(q)):Infinity;
   const safe=target!==c&&core.has(target)&&allowed.has(target)&&age>=12&&age>=gap(c)+8&&
    q.theme===old.theme&&q.difficulty===old.difficulty&&m.stage<=1&&
    !selectedIds.has(q.id)&&!selectedFamilies.has(family(q))&&!selectedConcepts.has(target)&&
    familyAge>=8&&(familyAge===Infinity||ctx.objective.allowRepeat===true);
   const delta=safe?Math.min(32,16+age-12):0;
   out.push({id:q.id,delta,reason:safe?'rappel '+target+' après '+age+' séances ; '+c+' récemment prouvé sur deux familles et deux séances':'classement natif conservé'});
  }
  return out;
 }
 return Object.freeze({schema:'QPJB_COHERENCE_M4_RECALL_FG_V1',CORE,rank});
});
