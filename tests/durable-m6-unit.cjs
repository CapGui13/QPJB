'use strict';
const L=require('../quizz-durable-m6-lab.js');
function suite(){
 let count=0;const ok=(v,m)=>{count++;if(!v)throw Error(m)},same=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),m),reject=(f,m)=>{let failed=false;try{f()}catch(e){failed=true}ok(failed,m)};
 const freeze=o=>{if(o&&typeof o==='object'&&!Object.isFrozen(o)){Object.freeze(o);Object.values(o).forEach(freeze)}return o};
 const a=freeze({id:'fixture-a',caseFamily:'f1',theme:'ouv',difficulty:1,answer:'1SA',choices:['1♣','2SA','1SA','Passe'],explain:'Règle canonique.'});
 const b=freeze({...a,id:'fixture-b',caseFamily:'f2'}),c=freeze({...a,id:'fixture-c',caseFamily:'f3',difficulty:3});
 const m=freeze({byId:{'fixture-a':{concept:'ouv.sa1'},'fixture-b':{concept:'ouv.sa1'},'fixture-c':{concept:'ouv.sa1'}}});
 const q=freeze([a,b,c]),p=L.profile('intermediaire'),k='ouv.sa1',seed=47;
 ok(L.random(seed,k)===L.random(seed,k),'stable random');ok(L.random(seed,k)!==L.random(11,k),'different seed');
 reject(()=>L.profile('missing'),'unknown profile');reject(()=>L.profile('aide',{half:0}),'zero half-life');reject(()=>L.profile('aide',{help:2}),'invalid rate');
 ok(L.sessionDay(p,25)-L.sessionDay(p,24)>p.pace,'break');
 const clean=freeze({id:a.id,result:'correct',choice:a.answer,assisted:false,hadFreeError:false,firstGuess:a.answer});
 const assisted=freeze({...clean,assisted:true}), corrected=freeze({...clean,hadFreeError:true,firstGuess:'2SA'}), skipped=freeze({...clean,result:'skipped',choice:null,firstGuess:null});
 ok(L.independent(clean)&&!L.independent(assisted)&&!L.independent(corrected)&&!L.independent(skipped),'proof separation');
 const e=freeze(L.update(p,k,seed,undefined,a,clean,0));
 ok(e.strength>L.baseSkill(p,k,seed),'learning');ok(L.effective(p,k,seed,e,100)<L.effective(p,k,seed,e,1),'forgetting');
 ok(L.update(p,k,seed,e,b,clean,10).stability>e.stability,'spaced new family');
 ok(L.update(p,k,seed,e,b,assisted,10).stability===e.stability,'assistance no stability bonus');
 same(L.update(p,k,seed,e,b,skipped,10),e,'skip no learning');
 ok(L.update(p,k,seed,e,b,clean,0).strength>L.update(p,k,seed,e,a,clean,0).strength,'novel family learning parameter');
 ok(L.probability(p,k,seed,e,a,0)>L.probability(p,k,seed,e,c,0),'difficulty');
 ok(L.probability(p,k,seed,e,a,0)>L.probability(p,k,seed,e,a,0,true),'familiarity removed for probe');
 const universe=L.catalog(q,m),probes=L.probes(p,seed,{[k]:e},universe,0);
 ok(probes.retention30<probes.retention7&&probes.transferN===1,'independent probes');
 const exhausted=L.update(p,k,seed,L.update(p,k,seed,e,b,clean,0),c,clean,0);
 ok(L.probes(p,seed,{[k]:exhausted},universe,0).unseenFamilyProbe===null,'no transfer opportunity');
 reject(()=>L.catalog([a,a],m),'duplicate catalogue ID');reject(()=>L.catalog([a],{byId:{}}),'missing concept');
 for(const name of Object.keys(L.PROFILES))for(const seed of L.SEEDS){
  const pp=L.profile(name);
  for(let s=1;s<=60;s++){
   const answer=L.answer(pp,k,seed,e,a,s,s);
   same(answer,L.answer(pp,k,seed,e,a,s,s),'deterministic outcome');
   ok(answer.result==='skipped'?answer.choice===null:a.choices.includes(answer.choice),'valid choice');
   ok(answer.result==='correct'?(answer.choice===a.answer):answer.choice!==a.answer,'correctness consistent');
   ok(!answer.hadFreeError||(answer.firstGuess!==a.answer&&!L.independent(answer)),'free correction');
  }
 }
 const fields=['families','concepts','proof','independent','retention30','retention7','debt','coreDebt','help','wrong','skipped','transferProof','duplicates','ineligible','short','variety'];
 const baseline={profile:'fixture',seed:11,model:'learning',parameters:{x:1},checkpoints:[{session:65,...Object.fromEntries(fields.map(x=>[x,0])),families:100,proof:50,concepts:50,retention30:.5}]};
 const identical=JSON.parse(JSON.stringify(baseline));ok(L.compare(baseline,identical)[0].review.length===0,'identity accepted');
 identical.checkpoints[0].families=90;identical.checkpoints[0].proof=30;identical.checkpoints[0].retention30=.4;identical.checkpoints[0].duplicates=1;
 same(L.compare(baseline,identical)[0].review,['invariants','families','proof','synthetic-retention'],'regression detected');
 reject(()=>L.compare(baseline,{...identical,seed:47}),'unpaired rejected');
 // Independent, synthetic contract fixtures: no sibling branch or production hook.
 const history=freeze({completed:2,journal:[{mode:'parcours',session:1,answers:[clean]},{mode:'parcours',session:2,answers:[assisted]}]});
 const inputs=freeze({exercise:a,answer:corrected,history,candidates:[b,c],selected:[a],nowMs:2*L.DAY,concept:k});
 const categories=new Set(['force','distribution','fit','priorite','niveau','forcing','convention','competition','contexte','autre','inconnu']);
 const pure=(fn,input)=>{const saved=JSON.stringify(input);const first=fn(input),second=fn(input);same(first,second,'deterministic fixture');same(JSON.stringify(input),saved,'read only fixture');return first};
 // M1: eligible candidates only; explicit reasons and references; neutral on absent signals.
 const M1={analyze:({history})=>history?.journal?.length?[{id:'s1',category:'force',references:['fixture-a'],strength:'weak',limits:['hypothesis']}]:[],rank:({candidates,signals})=>signals?.length?candidates.slice(0,1).map(q=>({id:q.id,delta:8,reason:'fixture',signalIds:['s1']})):[]};
 const signals=pure(M1.analyze,{history,exercises:q,diagnose:()=>({status:'unknown'})});
 function rankGuard(rows,ctx){return Array.isArray(rows)&&new Set(rows.map(v=>v.id)).size===rows.length&&rows.every(r=>ctx.candidates.some(q=>q.id===r.id)&&!ctx.selected.some(q=>q.id===r.id)&&Number.isFinite(r.delta)&&Math.abs(r.delta)<=100&&typeof r.reason==='string'&&Array.isArray(r.signalIds)&&r.signalIds.every(id=>ctx.signals.some(s=>s.id===id)))}
 const ctx=freeze({...inputs,signals});ok(signals.every(s=>categories.has(s.category)&&s.references.length&&s.limits.length),'M1 signal trace');
 ok(rankGuard(pure(M1.rank,ctx),ctx),'M1 bounded ranking');ok(!rankGuard([{id:a.id,delta:200,reason:'bad',signalIds:[]}],ctx),'M1 rejects noneligible');
 same(M1.rank({...ctx,signals:[]}),[],'M1 neutral missing signals');
 // M2: canonical invariant and abstention when no recorded answer.
 const M2={explain:({exercise,answer,diagnostic})=>({canonical:exercise.explain,feedback:answer?.result==='wrong'&&diagnostic?.status==='hypothesis'?'Vérifier la zone de force.':null,reminder:null,checkNext:null,targetConcept:null,targetCriteria:null,kind:'canonical'})};
 const rem=pure(M2.explain,inputs);ok(rem.canonical===a.explain&&rem.feedback===null,'M2 fallback');
 const wrong=freeze({...clean,result:'wrong',choice:'2SA',firstGuess:'2SA'});const diag=freeze({status:'hypothesis',category:'force',confidence:'medium'});
 ok(pure(M2.explain,{...inputs,answer:wrong,diagnostic:diag}).feedback!==null,'M2 targeted fixture');
 ok(M2.explain({exercise:a}).feedback===null,'M2 before answer no feedback');
 // M3: history lacking timestamps remains unknown and assisted/corrected are excluded.
 const M3={assess:({history})=>({concepts:{[k]:{evidence:(history?.journal||[]).flatMap(x=>x.answers).filter(L.independent).length,fragile:true,retention:'unknown',transfer:'unknown',reviewDue:null,reason:'fixture'}}})};
 const mastery=pure(M3.assess,{history,exercises:q,nowMs:inputs.nowMs,contrastPairs:[]}).concepts[k];
 ok(mastery.evidence===1&&mastery.retention==='unknown'&&mastery.reviewDue===null,'M3 no time invented');
 ok(M3.assess({history:{journal:[]}}).concepts[k].evidence===0,'M3 empty');
 // M4: validate contrast referential integrity; do not infer transfer from identical family.
 const contrasts=freeze([{a:a.id,b:b.id,concepts:[k],criterion:'zone',contextDifference:'fixture',evidence:'fixture only'}]);
 const contrastGuard=x=>x.a!==x.b&&q.some(v=>v.id===x.a)&&q.some(v=>v.id===x.b)&&q.find(v=>v.id===x.a).caseFamily!==q.find(v=>v.id===x.b).caseFamily&&x.concepts.every(k=>Object.values(m.byId).some(v=>v.concept===k))&&!!x.criterion&&!!x.contextDifference&&!!x.evidence;
 ok(contrasts.every(contrastGuard),'M4 contrast fixture');ok(!contrastGuard({...contrasts[0],b:a.id}),'M4 same case rejected');
 // M5: optional lesson separate from an ongoing autonomous assessment.
 const M5={lesson:({concept,mode})=>mode==='lesson'&&concept===k?{kind:'lesson',title:'Zone',rule:'Règle',examples:[],checks:[],prerequisites:[],reason:'fixture'}:null};
 ok(pure(M5.lesson,{concept:k,history,nowMs:inputs.nowMs,mode:'lesson'}).kind==='lesson','M5 optional');
 ok(M5.lesson({concept:k,mode:'assessment'})===null&&M5.lesson({})===null,'M5 no ongoing lesson or missing context');
 return {assertions:count,fixtureInterfaces:['M1','M2','M3','M4','M5'],status:'PASS',limitations:'Independent fixture guards, not verification of implementations on sibling branches.'};
}
module.exports={suite};if(require.main===module)console.log(JSON.stringify(suite()));
