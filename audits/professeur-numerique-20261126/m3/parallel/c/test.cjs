/* Run with node audits/professeur-numerique-20261126/m3/parallel/c/test.cjs from repo root. */
'use strict';
function runChecks({base,adapter,docs,signed,cart,exercises,patches,hold}){
 const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
 const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 const key=(id,choice)=>id+':'+choice;
 const scoped=x=>['red','second','forcing','roudi'].includes(x.concept.split('.')[0]);
 const by=new Map(exercises.map(x=>[x.id,x]));
 const rows=docs.flatMap(x=>x.rows);
 const index=new Map(rows.map(x=>[key(x.id,x.choice),x]));
 const scope=cart.filter(scoped);
 const expected=new Set(scope.flatMap(m=>m.options.filter(o=>o[1]==='unknown').map(o=>key(m.id,o[0]))));
 const beforeInputs=JSON.stringify([exercises,docs,signed,cart,patches,hold]);
 const api=adapter.createOverlay(base,docs,signed);
 const metrics={catalogue:exercises.length,scope:scope.length,wrong:0,correct:0,reviewed:rows.length,priorHypotheses:0,priorPreserved:0,changed:0,retainedUnknown:0,outsideChanged:0,guards:0,patches:0,byConcept:{},categories:{},dispositions:{}};
 assert(exercises.length===1879&&by.size===1879&&cart.length===1879,'catalogue cardinality');
 assert(scope.length===396&&expected.size===546&&rows.length===546&&index.size===546,'scope cardinality');
 assert([...expected].every(k=>index.has(k))&&[...index.keys()].every(k=>expected.has(k)),'exact set of unknown options');
 for(const m of cart){
  const x=by.get(m.id);assert(x&&x.choices.length===4&&new Set(x.choices).size===4&&x.choices.includes(x.answer),'invalid exercise '+m.id);
  const c=scoped(m)?(metrics.byConcept[m.concept]??={qcm:0,options:0,beforeHypothesis:0,beforeUnknown:0,newHypothesis:0,unknown:0,weak:0,hold:0}):null;
  if(c)c.qcm++;
  const correct={exercise:x,choice:x.answer};assert(equal(api.diagnose(correct),base.diagnose(correct))&&api.diagnose(correct).status==='correct','correct '+m.id);metrics.correct++;
  for(const o of m.options){
   const [choice,status,category]=o,k=key(m.id,choice),input={exercise:x,choice},before=base.diagnose(input),after=api.diagnose(input),row=index.get(k);metrics.wrong++;
   assert(choice!==x.answer&&x.choices.includes(choice),'option '+k);
   assert(before.status===status&&before.category===category,'baseline cartography '+k);
   if(c){c.options++;c[status==='hypothesis'?'beforeHypothesis':'beforeUnknown']++}
   if(status==='hypothesis')metrics.priorHypotheses++;
   if(row){
    assert(row.concept===m.concept&&row.evidence.expected===x.answer&&row.evidence.canonical===x.explain&&equal(row.evidence.auction,x.auction)&&equal(row.evidence.shape,x.shape)&&row.evidence.h===x.h&&row.reason.length>30,'evidence '+k);
    assert(adapter.signature(x)===signed.signatures[x.id],'signature '+k);
    metrics.dispositions[row.disposition]=(metrics.dispositions[row.disposition]||0)+1;
   }
   if(row?.disposition==='hypothesis'){
    assert(before.status==='unknown'&&after.status==='hypothesis'&&after.category===row.category&&after.reason===row.reason&&after.confidence===row.confidence&&after.evidence.reviewBaseline===adapter.BASE,'new diagnostic '+k);
    metrics.changed++;c.newHypothesis++;metrics.categories[after.category]=(metrics.categories[after.category]||0)+1;
    const assisted=api.diagnose({...input,assisted:true,hadFreeError:true});assert(assisted.status==='hypothesis'&&assisted.evidence.assisted&&assisted.evidence.hadFreeError,'assistance metadata '+k);metrics.guards++;
    for(const modified of [{...x,context:x.context+' (modifié)'},{...x,explain:x.explain+' (modifié)'},{...x,choices:x.choices.filter(z=>z!==choice)}]){
     const inp={exercise:modified,choice};assert(equal(api.diagnose(inp),base.diagnose(inp)),'changed/unoffered '+k);metrics.guards++;
    }
   }else{
    assert(equal(before,after),'unexpected output change '+k);
    if(status==='hypothesis')metrics.priorPreserved++;
    if(row){c[row.disposition]++;metrics.retainedUnknown++}
   }
   if(!c&&!equal(before,after))metrics.outsideChanged++;
  }
 }
 assert(metrics.wrong===5637&&metrics.correct===1879&&metrics.changed+metrics.retainedUnknown===546&&metrics.priorHypotheses===metrics.priorPreserved&&metrics.outsideChanged===0,'global totals');
 for(const h of hold.new.concat(hold.unknown,hold.weak)){
  const row=index.get(key(h.id,h.choice));assert(row&&row.status==='unknown','hold coverage '+h.id);
  assert(api.diagnose({exercise:by.get(h.id),choice:h.choice}).status==='unknown','hold result '+h.id);metrics.guards++;
 }
 for(const h of hold.existing){const inp={exercise:by.get(h.id),choice:h.choice};assert(equal(api.diagnose(inp),base.diagnose(inp)),'existing hold '+h.id);metrics.guards++}
 for(const h of [{id:'SEF-L33-005',choice:'2♦'},{id:'V2-M1-031',choice:'1♦'},{id:'V2-M4-017',choice:'Passe'}]){
  const inp={exercise:by.get(h.id),choice:h.choice};assert(equal(api.diagnose(inp),base.diagnose(inp))&&api.diagnose(inp).status==='unknown','global HOLD '+h.id);metrics.guards++;
 }
 const rank=z=>{const b=/^([1-7])(♣|♦|♥|♠|SA)$/.exec(z);return b?5*(Number(b[1])-1)+['♣','♦','♥','♠','SA'].indexOf(b[2]):-1};
 for(const p of patches.proposals){
  const x=by.get(p.id),m=scope.find(z=>z.id===p.id);assert(x&&m&&equal(p.oldChoices,x.choices)&&p.answer===x.answer,'patch baseline '+p.id);
  assert(p.newChoices.length===4&&new Set(p.newChoices).size===4&&p.newChoices.includes(x.answer),'patch choices '+p.id);
  const removed=x.choices.filter(z=>!p.newChoices.includes(z)),added=p.newChoices.filter(z=>!x.choices.includes(z));
  assert(removed.length===1&&added.length===1&&m.options.some(o=>o[0]===removed[0]&&o[1]==='unknown'),'patch must not replace prior diagnosis '+p.id);
  const last=Math.max(...x.auction.map(s=>rank((s.match(/:\s*([1-7](?:♣|♦|♥|♠|SA))/)||[])[1])));
  assert(rank(added[0])>last&&p.diagnostics.length===3&&p.diagnostics.every(d=>p.newChoices.includes(d.choice)&&d.choice!==x.answer&&d.reason),'patch legality '+p.id);
  assert(new Set(p.diagnostics.map(d=>d.category)).size>new Set(m.options.map(o=>index.get(key(m.id,o[0]))?.category)).size,'patch diagnostic diversity '+p.id);
  metrics.patches++;
 }
 const fixture=rows.find(x=>x.disposition==='hypothesis'),exercise=by.get(fixture.id);
 for(const input of [{},{exercise,choice:'???'},{exercise:{...exercise,id:'M3C-UNSEEN'},choice:fixture.choice},{exercise,choice:null}]){
  assert(equal(api.diagnose(input),base.diagnose(input)),'invalid/unseen input');metrics.guards++;
 }
 assert(JSON.stringify([exercises,docs,signed,cart,patches,hold])===beforeInputs,'input mutation');metrics.guards++;
 const start=Date.now();let benchmarkCalls=0;
 for(let pass=0;pass<5;pass++)for(const x of exercises)for(const choice of x.choices){api.diagnose({exercise:x,choice});benchmarkCalls++}
 metrics.benchmark={calls:benchmarkCalls,elapsedMs:Date.now()-start};
 return metrics;
}
module.exports={runChecks};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path');
 const read=p=>JSON.parse(fs.readFileSync(path.resolve(__dirname,p),'utf8'));
 const manifest=read('diagnostics.json');
 const html=fs.readFileSync(path.resolve(__dirname,'../../../../../quizz.html'),'utf8');
 const exercises=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
 console.log(JSON.stringify(runChecks({base:require('../../../../../quizz-diagnostic-erreurs.js'),adapter:require('./overlay.cjs'),docs:manifest.files.map(read),signed:read('signatures.json'),cart:read('../../cartographie.json'),exercises,patches:read('patches.json'),hold:read('hold.json')}),null,2));
}
