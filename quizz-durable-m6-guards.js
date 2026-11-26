/* M6 comparison and evidence guards. Independent of candidate selection policy. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.QPJBDurableM6Guards=factory();})(typeof window==='undefined'?globalThis:window,function(){
'use strict';
const numeric=['families','concepts','proof','independent','debt','coreDebt','help','wrong','skipped','transferProof','duplicates','ineligible','short','variety'];
const fractions=['retention7','retention30'];
function stable(v){
 if(v===null||typeof v==='string'||typeof v==='boolean')return JSON.stringify(v);
 if(typeof v==='number'&&Number.isFinite(v))return JSON.stringify(v);
 if(Array.isArray(v))return '['+v.map(stable).join(',')+']';
 if(v&&typeof v==='object'&&(Object.getPrototypeOf(v)===Object.prototype||Object.getPrototypeOf(v)===null))return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}';
 throw Error('Unsupported or nonfinite evidence value');
}
function hash(v){
 let a=2166136261,b=0x9e3779b9;
 for(const c of stable(v)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619)>>>0;b=Math.imul(b^n,0x85ebca6b)>>>0;}
 return a.toString(16).padStart(8,'0')+b.toString(16).padStart(8,'0');
}
function exerciseProjection(q,meta){
 return {id:q.id,family:q.caseFamily||q.id,concept:meta.byId[q.id].concept,difficulty:q.difficulty,answer:q.answer,choices:q.choices,hand:q.hand,auction:q.auction||[],context:q.context||''};
}
// Full immutable reference population, including difficulty and decision context.
// The hash is a deterministic comparability identifier, not a cryptographic signature.
function universeKey(exercises,meta){return hash(exercises.map(q=>exerciseProjection(q,meta)).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0));}
function validateCheckpoint(c){
 if(!c||!Number.isInteger(c.session)||c.session<1)throw Error('Invalid checkpoint session');
 for(const k of numeric)if(!Number.isInteger(c[k])||c[k]<0)throw Error('Invalid checkpoint '+c.session+' '+k);
 for(const k of fractions)if(!Number.isFinite(c[k])||c[k]<0||c[k]>1)throw Error('Invalid checkpoint '+c.session+' '+k);
 for(const k of ['themes','transferN','probeN','crossSessionNewFamily'])if(c[k]!==undefined&&(!Number.isInteger(c[k])||c[k]<0))throw Error('Invalid optional metric '+k);
 if(c.proof>c.concepts||c.transferN!==undefined&&c.probeN!==undefined&&c.transferN>c.probeN)throw Error('Impossible checkpoint counts');
 if(c.unseenFamilyProbe!==undefined&&c.unseenFamilyProbe!==null&&(!Number.isFinite(c.unseenFamilyProbe)||c.unseenFamilyProbe<0||c.unseenFamilyProbe>1))throw Error('Invalid transfer probe');
 if(c.probeRows!==undefined){
  if(!Array.isArray(c.probeRows)||c.probeRows.length!==c.probeN)throw Error('Incomplete probe cohort');
  const keys=new Set();
  for(const p of c.probeRows){
   if(!p||typeof p.concept!=='string'||typeof p.anchorId!=='string'||keys.has(p.concept)||!Number.isFinite(p.retention7)||!Number.isFinite(p.retention30)||p.retention7<0||p.retention7>1||p.retention30<0||p.retention30>1||typeof p.seen!=='boolean'||!Array.isArray(p.novel))throw Error('Invalid probe evidence');
   keys.add(p.concept);const ids=new Set();
   for(const v of p.novel){if(!v||typeof v.id!=='string'||typeof v.family!=='string'||ids.has(v.id)||!Number.isFinite(v.p)||v.p<0||v.p>1)throw Error('Invalid novel probe');ids.add(v.id);}
  }
 }
 return c;
}
function validateTrajectory(r){
 if(!r||!Array.isArray(r.checkpoints)||!r.checkpoints.length||!Number.isInteger(r.seed)||typeof r.profile!=='string'||!['learning','fixed'].includes(r.model))throw Error('Incomplete trajectory');
 if(r.horizon!==undefined&&(!Number.isInteger(r.horizon)||r.horizon<1||r.checkpoints.at(-1).session!==r.horizon))throw Error('Truncated horizon');
 let prior=0;
 for(const c of r.checkpoints){validateCheckpoint(c);if(c.session<=prior)throw Error('Non-increasing checkpoints');prior=c.session;}
 if(r.violations!==undefined&&!Array.isArray(r.violations))throw Error('Invalid violations');
 if(r.events!==undefined){
  if(!Array.isArray(r.events)||r.events.length!==r.horizon)throw Error('Incomplete event log');
  let day=-Infinity;
  for(let i=0;i<r.events.length;i++){const e=r.events[i];
   if(e.s!==i+1||!Number.isFinite(e.day)||e.day<day||!Array.isArray(e.ids)||!Array.isArray(e.answers)||e.ids.length!==e.answers.length)throw Error('Malformed event '+(i+1));
   for(let j=0;j<e.answers.length;j++){const a=e.answers[j];if(!Array.isArray(a)||a[0]!==e.ids[j]||!['correct','wrong','skipped'].includes(a[1])||typeof a[2]!=='boolean'||typeof a[3]!=='boolean'||(a[2]&&a[3]))throw Error('Malformed answer '+(i+1)+'/'+j);}
   day=e.day;
  }
 }
 return r;
}
function validatePair(before,after){
 validateTrajectory(before);validateTrajectory(after);
 for(const k of ['profile','seed','model','ruleSource','horizon','universeKey'])if(before[k]!==after[k])throw Error('Unpaired '+k);
 if(stable(before.parameters)!==stable(after.parameters))throw Error('Unpaired parameters');
 if(before.checkpoints.length!==after.checkpoints.length)throw Error('Unpaired checkpoints');
 for(let i=0;i<before.checkpoints.length;i++){
  const a=before.checkpoints[i],b=after.checkpoints[i];
  if(a.session!==b.session||a.day!==b.day||a.probeN!==b.probeN)throw Error('Unpaired horizon, day or probe count');
  if((a.probeRows===undefined)!==(b.probeRows===undefined))throw Error('Unpaired probe rows');
  if(a.probeRows){const y=new Map(b.probeRows.map(p=>[p.concept,p]));if(a.probeRows.some(p=>y.get(p.concept)?.anchorId!==p.anchorId))throw Error('Unpaired probe anchor');}
 }
 return true;
}
const round=x=>Math.round(x*10000)/10000;
// Compare the same unseen item in BOTH arms. Different opportunity counts
// are retained separately; they cannot bias the paired probability estimate.
function commonTransfer(a,b,seed,random){
 if(!a.probeRows||!b.probeRows)return null;
 const by=new Map(b.probeRows.map(p=>[p.concept,p])),rows=[];
 for(const x of a.probeRows){
  const y=by.get(x.concept);if(!x.seen||!y?.seen)continue;
  const novel=new Map(y.novel.map(v=>[v.id,v]));
  const common=x.novel.filter(v=>novel.get(v.id)?.family===v.family).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
  if(!common.length)continue;
  const v=common[Math.floor(random(seed,x.concept,'common-transfer')*common.length)],w=novel.get(v.id);
  rows.push({concept:x.concept,id:v.id,family:v.family,before:v.p,after:w.p});
 }
 const n=rows.length;
 return {n,beforeN:a.transferN??null,afterN:b.transferN??null,before:n?round(rows.reduce((z,v)=>z+v.before,0)/n):null,after:n?round(rows.reduce((z,v)=>z+v.after,0)/n):null,delta:n?round(rows.reduce((z,v)=>z+v.after-v.before,0)/n):null,rows};
}
function crossSessionNewFamily(e,f,s){return !!e&&e.families.size>0&&!e.families.has(f)&&[...e.sessions].some(t=>t!==s);}
function sameHistorical(a,b){return stable(a)===stable(b);}
return Object.freeze({schema:'QPJB_DURABLE_M6_GUARDS_V1',stable,hash,universeKey,validateCheckpoint,validateTrajectory,validatePair,commonTransfer,crossSessionNewFamily,sameHistorical});
});