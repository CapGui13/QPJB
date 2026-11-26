/* QPJB M3-C — proposed adapter, not connected to production. */
'use strict';
const BASE='71b0823235db1400eaf57c2552df35c18094f30a';
const PREFIXES=new Set(['red','second','forcing','roudi']);
const CATEGORIES=new Set(['force','distribution','fit','priorite','niveau','forcing','convention','competition','contexte']);
const ALLOWED=new Set(['ambiguous','canonical-ambiguous-contrast']);
const key=(id,choice)=>id+':'+choice;
function signature(x){
  let h=2166136261;
  const s=JSON.stringify([x.hand,x.h,x.shape,x.auction,x.context,x.answer,x.explain]);
  for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);
  return(h>>>0).toString(36);
}
function createOverlay(base,docs,signed){
  if(typeof base?.diagnose!=='function'||signed.baselineSHA!==BASE)throw Error('M3-C base/signatures');
  const index=new Map(), seen=new Set();
  for(const doc of docs){
    if(doc.baselineSHA!==BASE||doc.schema!=='QPJB_M3C_REVIEW_V1')throw Error('M3-C invalid review');
    for(const row of doc.rows){
      const k=key(row.id,row.choice);
      if(seen.has(k)||!PREFIXES.has(row.concept.split('.')[0])||!signed.signatures[row.id])throw Error('M3-C invalid row '+k);
      seen.add(k);
      if(row.disposition==='hypothesis'){
        if(row.status!=='hypothesis'||!CATEGORIES.has(row.category)||!row.reason||row.confidence!=='medium')throw Error('M3-C invalid hypothesis '+k);
        index.set(k,Object.freeze({...row}));
      }else if(!['unknown','hold','weak'].includes(row.disposition)||row.status!=='unknown')throw Error('M3-C invalid disposition '+k);
    }
  }
  if(seen.size!==546)throw Error('M3-C incomplete review');
  function diagnose(input={}){
    const d=base.diagnose(input);
    if(d.status!=='unknown'||!ALLOWED.has(d.evidence?.rule)||!d.evidence?.offered)return d;
    const x=input?.exercise, choice=input?.choice;
    if(!x||!Array.isArray(x.choices)||!x.choices.includes(choice))return d;
    const row=index.get(key(x.id,choice));
    if(!row||row.concept!==d.evidence.concept||signature(x)!==signed.signatures[x.id])return d;
    if(row.evidence.expected!==x.answer||row.evidence.canonical!==x.explain)return d;
    return {status:'hypothesis',category:row.category,reason:row.reason,confidence:row.confidence,
      evidence:{...d.evidence,rule:row.evidence.rule,reviewBaseline:BASE}};
  }
  return Object.freeze({schema:base.schema,diagnose});
}
module.exports={BASE,createOverlay,signature};
