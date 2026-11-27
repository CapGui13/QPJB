'use strict';
// M4-B #447, experimental only. No production imports.
const CORE=Object.freeze(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
const core=new Set(CORE),fam=q=>String(q.caseFamily||q.id),concept=(ctx,q)=>ctx.metadataById[q.id]?.concept;
const independent=a=>a.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
function evidence(ctx){
 const map=new Map(),families=new Map(),sessions=new Map(),byId=new Map(ctx.exercises.map(q=>[q.id,q]));let complete=true;
 for(const ev of ctx.history?.journal||[]){
  if(ev.mode!=='parcours')continue;
  if(!Number.isInteger(ev.session)||ev.session<1||ev.session>=ctx.session||sessions.has(ev.session)||!Array.isArray(ev.answers)||ev.answers.length!==10||new Set(ev.answers.map(a=>a.id)).size!==10){complete=false;continue;}
  if(ev.answers.some(a=>!byId.has(a.id)||!concept(ctx,byId.get(a.id))||!['correct','wrong','skipped'].includes(a.result)||typeof a.assisted!=='boolean'||typeof a.hadFreeError!=='boolean')){complete=false;continue;}
  sessions.set(ev.session,ev.answers);
  for(const a of ev.answers){
   const q=byId.get(a.id),c=concept(ctx,q),f=fam(q),v=map.get(c)||{last:0,successes:[],errors:[],families:new Set()};
   v.last=Math.max(v.last,ev.session);v.families.add(f);(independent(a)?v.successes:v.errors).push({s:ev.session,f,id:a.id});map.set(c,v);
   families.set(f,Math.max(families.get(f)||0,ev.session));
  }
 }
 if(sessions.size!==ctx.session-1)complete=false;
 for(let s=1;s<ctx.session;s++)if(!sessions.has(s))complete=false;
 const halves=[0,0],help=[0,0];
 for(let s=ctx.session-10;s<ctx.session;s++){
  const as=sessions.get(s);if(!as){complete=false;continue;}
  const i=s<ctx.session-5?0:1;halves[i]+=as.filter(independent).length;help[i]+=as.filter(a=>a.assisted||a.hadFreeError).length;
 }
 return {map,families,complete,stable:complete&&halves.every(n=>n>=30)&&help.every(n=>n<=10)};
}
function stats(ev,c,s){
 const v=ev.map.get(c);if(!v)return null;
 const successes=v.successes.filter(a=>a.s>=s-24),fs=new Set(successes.map(a=>a.f)),ss=new Set(successes.map(a=>a.s));
 const lastSuccess=Math.max(0,...v.successes.map(a=>a.s)),lastError=Math.max(0,...v.errors.map(a=>a.s));
 const interval=fs.size>=4&&ss.size>=4?12:fs.size>=2&&ss.size>=2?9:7,deadline=v.last+interval;
 return {gap:s-v.last,deadline,interval,overdue:s-deadline,last:v.last,lastSuccess,lastError,proofFamilies:fs.size,proofSessions:ss.size,exposedFamilies:v.families.size};
}
const selectedQ=ctx=>(ctx.selected||[]).map(x=>x.exercise||x);
function usable(ctx){return Number.isInteger(ctx.session)&&ctx.session>=21&&ctx.session<=180&&!ctx.history?.active&&Array.isArray(ctx.exercises)&&!!ctx.metadataById;}
function priority(ctx,ev,q){
 const c=concept(ctx,q),t=stats(ev,c,ctx.session);if(!core.has(c)||!t||!t.lastSuccess||t.lastError>=t.lastSuccess||t.overdue<0||q.difficulty>3||ctx.metadataById[q.id].stage>1)return null;
 const familyGap=ctx.session-(ev.families.get(fam(q))||0);
 if(ev.families.has(fam(q))&&familyGap<9)return null;
 return {...t,concept:c,familyGap,novel:!ev.families.has(fam(q))};
}
// L: EDF among native filtered candidates only. Existing core reservation or redundant maintenance.
function rank(ctx){
 if(!usable(ctx)||ctx.category!=='maintenance'||ctx.forcedReason||!Array.isArray(ctx.candidates)||(!ctx.nativeCoreReservation&&!ctx.discretionary))return [];
 const ev=evidence(ctx);if(!ev.stable)return [];
 const selected=selectedQ(ctx),seen=new Set(selected.map(q=>concept(ctx,q))),sf=new Set(selected.map(fam)),si=new Set(selected.map(q=>q.id)),out=[];
 for(const q of ctx.candidates){
  if(si.has(q.id)||sf.has(fam(q))||seen.has(concept(ctx,q)))continue;
  const t=priority(ctx,ev,q);if(!t)continue;
  out.push({id:q.id,delta:Math.min(32,8+2*t.overdue),reason:'EDF '+t.concept+' échéance S'+t.deadline+' ; écart '+t.gap,proof:t});
 }
 return out.sort((a,b)=>b.delta-a.delta||a.proof.deadline-b.proof.deadline||a.id.localeCompare(b.id));
}
function chooseRank(ctx,rows,baseline){
 if(!usable(ctx))return {q:baseline};
 const ev=evidence(ctx);if(!ev.stable)return {q:baseline};
 const bc=concept(ctx,baseline),bt=stats(ev,bc,ctx.session);
 if(!ctx.nativeCoreReservation&&!selectedQ(ctx).some(q=>concept(ctx,q)===bc))return {q:baseline};
 if(ctx.nativeCoreReservation&&!core.has(bc))return {q:baseline};
 const scores=new Map(rank(ctx).map(r=>[r.id,r])),baseRow=rows.find(r=>r.q===baseline);if(!baseRow)return {q:baseline};
 let winner=baseline,best=baseRow.v+(scores.get(baseline.id)?.delta||0),signal=null;
 for(const r of rows){
  const q=r.q,x=scores.get(q.id);
  if(!x||q.id===baseline.id||q.theme!==baseline.theme||q.difficulty!==baseline.difficulty||ctx.metadataById[q.id].stage!==ctx.metadataById[baseline.id].stage||
      ctx.bad(q)||ctx.bad(baseline)||ctx.due(baseline)||ctx.novelFamily(q)!==ctx.novelFamily(baseline))continue;
  if(ctx.nativeCoreReservation&&bt&&x.proof.deadline>=bt.deadline)continue;
  if(r.v+x.delta>best){winner=q;best=r.v+x.delta;signal=x;}
 }
 return {q:winner,signal,displaced:bt,scoreBefore:baseRow.v,scoreAfter:rows.find(r=>r.q===winner)?.v};
}
// M: replace only a repeated, discretionary redundant maintenance slot.
// No exception to repeat budget, no removal of a concept from the current deck.
function replace(ctx,deck,slots){
 if(!usable(ctx)||deck.length!==10||ctx.session<66)return {deck};
 const ev=evidence(ctx);if(!ev.stable)return {deck};
 const count=(d,key)=>{const a=new Map();for(const v of d){const k=key(v.exercise);a.set(k,(a.get(k)||0)+1);}return Math.max(0,...a.values());};
 const maxBid=count(deck,ctx.bid),maxContext=count(deck,ctx.context);
 const repeats=d=>d.filter(v=>!ctx.novelFamily(v.exercise)).length,passes=d=>d.filter(v=>ctx.openingPass(v.exercise)).length;
 if(new Set(deck.map(v=>v.exercise.id)).size!==10||new Set(deck.map(v=>fam(v.exercise))).size!==10)return {deck};
 let best=null;
 for(const {index,baseline:old} of slots){
  if(deck[index]?.exercise!==old||!['rappel_nouvelle_situation','rappel_question'].includes(deck[index].reason)||ctx.novelFamily(old)||ctx.bad(old)||ctx.due(old))continue;
  const c=concept(ctx,old),proof=stats(ev,c,ctx.session),rest=deck.filter((_,i)=>i!==index);
  if(!proof||proof.proofFamilies<2||proof.proofSessions<2||ctx.session-proof.lastSuccess>6||proof.lastError>=proof.lastSuccess||!rest.some(v=>concept(ctx,v.exercise)===c))continue;
  const rc=new Set(rest.map(v=>concept(ctx,v.exercise))),rf=new Set(rest.map(v=>fam(v.exercise))),ri=new Set(rest.map(v=>v.exercise.id));
  for(const q of ctx.pool){
   if(q.theme!==old.theme||q.difficulty!==old.difficulty||ctx.metadataById[q.id].stage!==ctx.metadataById[old.id].stage||rc.has(concept(ctx,q))||ri.has(q.id)||rf.has(fam(q))||q.id===old.id||ctx.classify(q)!=='maintenance'||ctx.bad(q))continue;
   const t=priority(ctx,ev,q);if(!t)continue;
   const proposed=deck.map((v,i)=>i===index?{...v,exercise:q,kind:'revision',reason:ctx.fresh(q)?'rappel_nouvelle_situation':'rappel_question'}:v);
   if(repeats(proposed)>repeats(deck)||passes(proposed)>passes(deck)||count(proposed,ctx.bid)>maxBid||count(proposed,ctx.context)>maxContext)continue;
   if(!best||t.deadline<best.target.deadline||(t.deadline===best.target.deadline&&q.id<best.q.id))best={deck:proposed,q,index,old,target:t,displaced:proof,repeatBefore:repeats(deck),repeatAfter:repeats(proposed)};
  }
 }
 return best||{deck};
}
module.exports={CORE,evidence,stats,rank,chooseRank,replace};
