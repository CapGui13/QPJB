/* Independent adapter assertions for #419. Not a substitute for actual integration.
 * Normalized return shape belongs to the receipt adapter, not production APIs. */
'use strict';
const check=(v,m)=>{if(!v)throw Error(m)};
const copy=v=>JSON.parse(JSON.stringify(v));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const id=x=>typeof x==='string'?x:x?.id;
const text=x=>typeof x==='string'&&x.trim().length>0;
function pure(fn,ctx){
 const x=copy(ctx),y=copy(ctx),before=JSON.stringify(x),out=fn(x),other=fn(y);
 check(JSON.stringify(x)===before&&JSON.stringify(y)===before,'Context mutated');
 check(!out?.then&&same(out,other),'Non-synchronous or non-deterministic output');
 return out;
}
function plan(out,known){
 check(out&&text(out.principal)&&known.includes(out.principal),'M1 unknown principal');
 check(Array.isArray(out.secondary)&&out.secondary.every(x=>known.includes(x)),'M1 unknown secondary');
 check(Array.isArray(out.targetConcepts)&&out.targetConcepts.every(x=>known.includes(x)),'M1 unknown target');
 check(text(out.reason)&&text(out.fallback)&&out.quotas&&typeof out.quotas==='object','M1 reason, fallback and soft quotas');
 check(Object.values(out.quotas).every(x=>Number.isFinite(x)&&x>=0),'M1 invalid quota');
 return out;
}
function order(out,deck){
 check(out&&Array.isArray(out.ids)&&same(out.ids.slice().sort(),deck.map(id).sort()),'M2 not a permutation');
 check(out.ids.every(x=>text(out.reasons?.[x])),'M2 missing position reason');
 return out;
}
function rules(out){
 check(Array.isArray(out)&&out.every(x=>text(x.id)&&Array.isArray(x.requires)&&text(x.reason)),'M3 no explicit prerequisites');
 check(out.every(x=>x.block!==true&&x.forceEligible!==true),'M3 advisory only, no arbitrary eligibility override');
 return out;
}
function rank(out,candidates,bound=100){
 check(Array.isArray(out)&&Number.isFinite(bound)&&bound>=0,'M4 invalid rank or bound');
 const ids=new Set(candidates.map(id));
 check(new Set(out.map(id)).size===out.length&&out.every(x=>ids.has(id(x))&&Number.isFinite(x.delta)&&Math.abs(x.delta)<=bound&&text(x.reason)),'M4 rank outside eligible candidates, bounds or reason');
 return out;
}
function studyPlan(out,available,{active=false}={}){
 check(Array.isArray(out)&&out.every(x=>available.includes(x.lessonId)&&text(x.reason)&&['before','after'].includes(x.when)),'M5 unknown lesson, reason or timing');
 // The normalized before/after adapter abstains during active assessment.
 check(!active||out.length===0,'M5 study suggestion during active assessment');
 return out;
}
module.exports={pure,plan,order,rules,rank,studyPlan};
