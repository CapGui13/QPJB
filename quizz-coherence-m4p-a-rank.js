'use strict';
// #446: experimental, no production activation. L = within-deck contrasts;
// R = clean recent repetition. Exact native stratum checked by the adapter.
const base=require('./quizz-coherence-m4-diversite.js');
const family=q=>String(q?.caseFamily||q?.id||'');
const clean=a=>a?.result==='correct'&&a.assisted===false&&a.hadFreeError===false;
const protectedConcept=new Set(['ouv.passe','ouv.mineure','majeur.soutien']);
const metaKey=m=>JSON.stringify([m?.concept,m?.stage,m?.minSession,m?.requires]);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function rank(ctx={}){
 const {session,category,metadataById:meta={},baselineId,policy='L'}=ctx;
 if(!Number.isInteger(session)||session<3||session>20||ctx.history?.active||ctx.forcedReason||
 !['discovery','maintenance'].includes(category)||!['L','R','T'].includes(policy))return [];
 const candidates=ctx.candidates||[],lookup=new Map((ctx.exercises||[]).map(q=>[q.id,q]));
 for(const q of candidates)lookup.set(q.id,q);
 const old=lookup.get(baselineId),m=meta[baselineId],f=base.features(old,m);
 if(!f||protectedConcept.has(m.concept)||old.difficulty>3)return [];
 const rest=(ctx.selected||[]).map(x=>x.exercise||x),local=rest.map(q=>base.features(q,meta[q.id])).filter(Boolean);
 const journal=(ctx.history?.journal||[]).filter(e=>e.mode==='parcours'&&e.session>=session-2&&e.session<session);
 if(journal.length!==2||new Set(journal.map(e=>e.session)).size!==2||journal.some(e=>e.answers?.length!==10))return [];
 const history=journal.flatMap(e=>e.answers).map(a=>({a,q:lookup.get(a.id)}));
 if(history.some(x=>!x.q))return [];
 const relevant=history.filter(x=>meta[x.q.id]?.concept===m.concept);
 // Never displace a local consolidation of a failed or assisted concept.
 if(relevant.some(x=>!clean(x.a)))return [];
 const past=relevant.map(x=>base.features(x.q,meta[x.q.id])).filter(Boolean);
 const count=(arr,v)=>arr.filter(x=>x.near===v.near).length;
 // T: evidence-wide guard and same-family substitution. A new ID may still
 // affect future trajectories; the S180 gate is unchanged.
 if(policy==='T'&&!history.every(x=>clean(x.a)))return [];
 const repeated=policy==='L'?count(local,f):policy==='R'?count(past,f):count(local,f)+count(past,f);
 if(!repeated)return [];
 // R only with a real independent success on the same decision. L can
 // contrast a first discovery within a complete deck (no invented mastery).
 if(policy==='R'&&!past.some(x=>x.decision===f.decision))return [];
 const used=new Set(rest.map(family)),out=[];
 for(const q of candidates){
  const v=base.features(q,meta[q.id]);
  if(!v||q.id===old.id||used.has(family(q))||q.theme!==old.theme||q.difficulty!==old.difficulty||
  q.answer!==old.answer||!same(q.auction,old.auction)||metaKey(meta[q.id])!==metaKey(m)||v.decision!==f.decision)continue;
  const localGain=count(local,f)-count(local,v),recentGain=count(past,f)-count(past,v);
  // A real force or shape contrast, not a new hand alone. Do not trade
  // a local repetition against a recent repetition (or vice versa).
  if(policy==='T'&&family(q)!==family(old))continue;
  if(v.near===f.near||localGain<0||recentGain<0||(policy==='L'?localGain:policy==='R'?recentGain:localGain+recentGain)<=0)continue;
  out.push({id:q.id,delta:Math.min(24,8*(localGain+recentGain)),reason:policy==='T'?'contraste au sein de la même famille après deux séances autonomes':policy==='L'?'contraste de force/distribution dans une décision répétée du deck':'contraste de force/distribution après réussite autonome récente',localGain,recentGain});
 }
 return out.sort((a,b)=>b.delta-a.delta||a.id.localeCompare(b.id));
}
module.exports=Object.freeze({schema:'QPJB_M4P_A_V1',rank});
