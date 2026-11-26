"use strict";
// Adaptateur autonome, à intégrer par le coordinateur uniquement.
const signature=x=>{let h=2166136261;const s=JSON.stringify([x.hand,x.h,x.shape,x.auction,x.context,x.answer,x.explain]);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)};
const key=(id,c)=>JSON.stringify([id,c]);
function extend(base,data){
 if(!base||base.schema!=="QPJB_DIAGNOSTIC_V1"||data.schema!=="QPJB_M3A_DIAGNOSTICS_V1")throw Error("Schéma incompatible");
 const lookup=new Map();
 for(const x of data.records){const k=key(x.id,x.choice);if(lookup.has(k))throw Error("Diagnostic dupliqué "+k);lookup.set(k,x)}
 return {...base,diagnose(input){
   const d=base.diagnose(input), e=input?.exercise;
   if(d.status!=="unknown"||!e||!d.evidence||d.evidence.rule==="editorial-hold")return d;
   const x=lookup.get(key(e.id,input.choice));
   if(!x||d.evidence.rule!==x.previousRule||signature(e)!==x.signature)return d;
   return {...x.diagnostic,evidence:{...d.evidence,...x.diagnostic.evidence}};
 }};
}
module.exports={extend,signature,key};
