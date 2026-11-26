"use strict";
// Adaptateur de validation isolé : aucune modification du moteur partagé.
function signature(x){let h=2166136261;const s=JSON.stringify([x.hand,x.h,x.shape,x.auction,x.context,x.answer,x.explain]);for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return (h>>>0).toString(36);}
function overlay(engine, rows){
 const index=new Map();
 for(const r of rows){const key=JSON.stringify([r.id,r.choice]);if(index.has(key))throw Error("duplicate "+key);index.set(key,r);}
 return {schema:engine.schema,diagnose(input={}){
   const base=engine.diagnose(input);
   if(base.status!=="unknown"||!["ambiguous","canonical-ambiguous-contrast"].includes(base.evidence.rule))return base;
   const {exercise:x,choice}=input;
   if(!x||!Array.isArray(x.choices)||!x.choices.includes(choice))return base;
   const r=index.get(JSON.stringify([x.id,choice]));
   if(!r||r.status!=="hypothesis"||r.signature!==signature(x))return base;
   return {status:r.status,category:r.category,reason:r.reason,confidence:r.confidence,evidence:{...base.evidence,rule:r.evidence.rule,canonicalExcerpt:r.evidence.canonicalExcerpt,signature:r.signature,base:r.evidence.base}};
 }};
}
module.exports={signature,overlay};
