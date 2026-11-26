'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const api=require('../quizz-diagnostic-erreurs.js'),meta=require('../quizz-prerequis.js').byId,patches=require('../audits/professeur-numerique-20261126/m3/patches.json');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const q=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const buildPlausibility=function buildPlausibility(q,api,patches,meta){
 const index=new Map(),patchMap=new Map(patches.map(p=>[p.id,p]));
 const assert=(v,m)=>{if(!v)throw Error(m)};
 for(const x of q){const k=JSON.stringify([x.auction,x.answer]);const arr=index.get(k)||[];arr.push(x);index.set(k,arr);}
 const byId=new Map(q.map(x=>[x.id,x]));
 const metrics={};
 const result=q.map(x=>{
  function inspect(choices){
   return choices.filter(c=>c!==x.answer).map(choice=>{
    const d=api.diagnose({exercise:x,choice});
    const options=(index.get(JSON.stringify([x.auction,choice]))||[]).filter(y=>y.id!==x.id);
    // Prefer a distinct hand in the same family/context; do not infer correct alternative on the current hand.
    const score=y=>(y.caseFamily===x.caseFamily?4:0)+(y.context===x.context?2:0)+(meta[y.id]?.concept===meta[x.id]?.concept?1:0);
    const y=options.slice().sort((a,b)=>score(b)-score(a)||a.id.localeCompare(b.id,'en'))[0];
    const level=y?(y.caseFamily===x.caseFamily?'same-family':y.context===x.context?'same-context':'same-auction'):'no-catalogue-example';
    const conflict=options.some(y=>JSON.stringify(y.hand)===JSON.stringify(x.hand)&&y.context===x.context);
    return {choice,status:d.status,category:d.category,rule:d.evidence.rule,contrast:{level,id:y?.id||null,contextExact:y?y.context===x.context:false,conceptExact:y?meta[y.id].concept===meta[x.id].concept:false,points:y?y.h:null,shape:y?y.shape:null,conflict}};
   });
  }
  const before=inspect(x.choices),p=patchMap.get(x.id),after=p?inspect(p.newChoices):before;
  for(const [key,a] of [['before',before],['after',after]]){const m=metrics[key]??={options:0,sameFamily:0,sameContext:0,sameAuction:0,noCatalogueExample:0,unknownWithExample:0,unknownWithoutExample:0,conflicts:0,sameRulePairs:0};const grouped={};
   for(const v of a){m.options++;m[{'same-family':'sameFamily','same-context':'sameContext','same-auction':'sameAuction','no-catalogue-example':'noCatalogueExample'}[v.contrast.level]]++;if(v.status==='unknown')m[v.contrast.id?'unknownWithExample':'unknownWithoutExample']++;if(v.contrast.conflict)m.conflicts++;if(v.status==='hypothesis')grouped[v.rule]=(grouped[v.rule]||0)+1;
    if(v.contrast.id){const y=byId.get(v.contrast.id);assert(y.answer===v.choice&&JSON.stringify(y.auction)===JSON.stringify(x.auction),'contrast '+x.id);}
   }
   m.sameRulePairs+=Object.values(grouped).reduce((sum,n)=>sum+n*(n-1)/2,0);
  }
  return p?{id:x.id,before,after}:{id:x.id,before};
 });
 return {schema:'QPJB_DIAGNOSTIC_PLAUSIBILITY_V1',metrics,rows:result};
};
const result=buildPlausibility(q,api,patches,meta),expected=require('../audits/professeur-numerique-20261126/m3/plausibilite.json');
assert.deepEqual(result,expected);
assert.equal(result.metrics.before.options,5637);assert.equal(result.metrics.after.options,5637);assert.equal(result.metrics.after.conflicts,0);
assert.ok(result.metrics.after.sameRulePairs<result.metrics.before.sameRulePairs);
console.log(JSON.stringify(result.metrics));
