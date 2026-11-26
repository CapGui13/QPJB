/* M3-D: proposition d'intégration locale, non raccordée à la production. */
'use strict';
function signature(x){
  let h=2166136261;
  const s=JSON.stringify([x.hand,x.h,x.shape,x.auction,x.context,x.answer,x.explain]);
  for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);
  return (h>>>0).toString(36);
}
function extendDiagnostic(baseDiagnose,data){
  if(typeof baseDiagnose!=='function'||data.schema!=='QPJB_M3_PARALLEL_D_V1')throw Error('Contrat de diagnostic incompatible');
  return function diagnose(input={}){
    const previous=baseDiagnose(input);
    if(previous.status!=='unknown'||previous.evidence?.rule!=='ambiguous')return previous;
    const {exercise:x,choice}=input||{};
    if(!x||!Array.isArray(x.choices)||!x.choices.includes(choice))return previous;
    const record=Object.hasOwn(data.byId,x.id)?data.byId[x.id]:null;
    if(!record||record.signature!==signature(x)||previous.evidence?.concept!==record.concept)return previous;
    const proposed=Object.hasOwn(record.choices,choice)?record.choices[choice]:null;
    if(!proposed)return previous;
    return {status:'hypothesis',category:proposed.category,reason:proposed.reason,confidence:proposed.confidence,evidence:{...previous.evidence,rule:proposed.rule,review:'M3-D',baseSHA:data.baseSHA}};
  };
}
module.exports={signature,extendDiagnostic};
