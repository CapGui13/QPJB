'use strict';
// #509: experimental debt-credit exchange, never enabled by default.
// Runs after composition and before native logicalOrder. No eligibility exception.
const CORE=Object.freeze(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
const fam=q=>String(q.caseFamily||q.id);
const clean=a=>a.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
const allowed=new Set(['correct','wrong','skipped']);
function ledger(ctx){
 const byId=new Map(ctx.exercises.map(q=>[q.id,q])), events=new Map(), concepts=new Map(), families=new Map(), debt=new Map();
 const concept=q=>ctx.metadataById[q.id]?.concept;
 for(const ev of ctx.history.journal||[]){
  if(ev.mode!=='parcours')continue;
  if(!Number.isInteger(ev.session)||ev.session<1||ev.session>=ctx.session||events.has(ev.session)||!Array.isArray(ev.answers)||ev.answers.length!==10||new Set(ev.answers.map(a=>a.id)).size!==10)return null;
  if(ev.answers.some(a=>!byId.has(a.id)||!concept(byId.get(a.id))||!allowed.has(a.result)||typeof a.assisted!=='boolean'||typeof a.hadFreeError!=='boolean'))return null;
  events.set(ev.session,ev.answers);
 }
 for(let s=1;s<ctx.session;s++){
  const as=events.get(s);if(!as)return null;
  for(const a of as){
   const q=byId.get(a.id),c=concept(q),f=fam(q),v=concepts.get(c)||{last:0,success:0,error:0,proofFamilies:new Set(),proofSessions:new Set()};
   v.last=s;families.set(f,s);
   if(clean(a)){v.success=s;v.proofFamilies.add(f);v.proofSessions.add(s)}else v.error=s;
   concepts.set(c,v);
  }
  for(const c of CORE){const v=concepts.get(c);if(v)debt.set(c,(debt.get(c)||0)+Math.max(0,s-v.last-6))}
 }
 return {concepts,families,debt};
}
const count=(rows,key)=>{const m=new Map();for(const q of rows){const k=key(q);m.set(k,(m.get(k)||0)+1)}return m};
const max=m=>Math.max(0,...m.values());
const cmp=(a,b)=>a<b?-1:a>b?1:0;
const credit=g=>Array.from({length:6},(_,i)=>Math.max(0,g+i-6)).reduce((a,b)=>a+b,0);
// One exchange, at most. Debt fairness is by cumulative concept debt with
// a current-gap floor; not native score, global quota or periodic reminder.
function exchange(ctx,mode='strict'){
 const s=ctx.session,unchanged=null;
 if(!['strict','recent'].includes(mode))return unchanged;
 if(mode==='recent'&&(!Array.isArray(ctx.expertise?.HOLD)||!Array.isArray(ctx.expertise?.CONTRAST_OR_SEQUENCE)))return unchanged;
 const hold=new Set(ctx.expertise?.HOLD||[]),protectedIds=new Set(ctx.expertise?.CONTRAST_OR_SEQUENCE||[]);
 if(!Number.isInteger(s)||s<66||s>180||ctx.history?.active||!Array.isArray(ctx.exercises)||!Array.isArray(ctx.deck)||ctx.deck.length!==10||!Array.isArray(ctx.pool)||!ctx.metadataById||!ctx.flagsById)return unchanged;
 const concept=q=>ctx.metadataById[q.id]?.concept,qs=ctx.deck.map(x=>x?.exercise);
 if(!ctx.history||!Array.isArray(ctx.history.journal)||qs.some(q=>!q||!concept(q))||count(qs,q=>q.id).size!==10||count(qs,fam).size!==10)return unchanged;
 const counts=count(qs,concept);
 const h=ledger(ctx);if(!h)return unchanged;
 const prior=qs.map(q=>ctx.flagsById[q.id]);if(prior.some(f=>!f))return unchanged;
 const bids=count(qs,ctx.bid),contexts=count(qs,ctx.context),themes=count(qs,q=>q.theme);
 const eligible=new Set(ctx.pool.map(q=>q.id)),ids=new Set(qs.map(q=>q.id)),families=new Set(qs.map(fam));
 const consolidationRisk=new Set((ctx.history.journal||[]).filter(ev=>ev.mode==='consolidation'&&ev.session>=s-8).flatMap(ev=>(ev.answers||[]).filter(a=>!clean(a)).map(a=>ctx.metadataById[a.id]?.concept)));
 const choices=[];
 for(const q of ctx.pool){
  const c=concept(q),v=h.concepts.get(c),f=ctx.flagsById[q.id];
  if(hold.has(q.id)||!CORE.includes(c)||consolidationRisk.has(c)||!v||!f||counts.has(c)||ids.has(q.id)||families.has(fam(q))||f.bad||f.weak||f.stage>1||f.category!=='maintenance'||q.difficulty>3||q.difficulty>f.localTarget||v.success<=v.error||v.proofFamilies.size<2||v.proofSessions.size<2)continue;
  const gap=s-v.last,familyGap=s-(h.families.get(fam(q))||0);
  if(gap<12||(!f.novelFamily&&familyGap<12))continue;
  // Actual recent failures remain the native engine's responsibility.
  for(let i=0;i<qs.length;i++){
   const old=qs[i],d=concept(old),p=prior[i],w=h.concepts.get(d),slot=ctx.deck[i];
   if(hold.has(old.id)||!eligible.has(old.id)||consolidationRisk.has(d)||!w||slot.protected!==false||p.bad||p.weak||p.due||
      w.success<=w.error||w.proofFamilies.size<2||w.proofSessions.size<2||
      f.stage>p.stage||f.novelFamily!==p.novelFamily||ctx.openingPass(q)&&!ctx.openingPass(old))continue;
   if(mode==='strict'){
    if(slot.category!=='maintenance'||counts.get(d)<2||s-w.success>8||q.difficulty!==old.difficulty)continue;
   }else{
    // Alternative C2: one native unprotected discovery of an already proved
    // non-core concept, exercised autonomously in the immediately prior
    // session. No first exposure, no older obligation, no novelty exception.
    if(protectedIds.has(old.id)||slot.category!=='discovery'||slot.reason!=='nouveau_qcm'||CORE.includes(d)||counts.get(d)!==1||
       w.last!==w.success||s-w.success!==1||w.proofFamilies.size<3||w.proofSessions.size<3||
       q.difficulty>old.difficulty)continue;
   }
   const rest=qs.map((x,j)=>j===i?q:x);
   if(max(count(rest,ctx.bid))>max(bids)||max(count(rest,ctx.context))>max(contexts)||max(count(rest,x=>x.theme))>max(themes))continue;
   const donorCost=mode==='recent'?credit(s-w.last):0,gain=credit(gap)-donorCost; if(gain<36)continue;
   choices.push({index:i,id:q.id,oldId:old.id,concept:c,donorConcept:d,gap,familyGap,accumulatedDebt:h.debt.get(c)||0,forecastCredit:gain,donorCost,donorStillPresent:counts.get(d)>1,novelFamily:f.novelFamily,mode,donorLastSuccess:w.success,donorProofFamilies:w.proofFamilies.size,donorProofSessions:w.proofSessions.size,reason:mode==='recent'?'rappel_fondamental_credit_recent':'rappel_fondamental_credit_dette'});
  }
 }
 choices.sort((a,b)=>b.forecastCredit-a.forecastCredit||b.accumulatedDebt-a.accumulatedDebt||b.familyGap-a.familyGap||cmp(a.id,b.id)||cmp(a.oldId,b.oldId));
 return choices[0]||unchanged;
}
module.exports=Object.freeze({CORE,ledger,exchange,credit});
