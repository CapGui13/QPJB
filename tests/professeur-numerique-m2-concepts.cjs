const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');const root=path.join(__dirname,'..');const api=require('../quizz-apprentissage-concepts.js');const meta=require('../quizz-prerequis.js').byId;const qs=JSON.parse(fs.readFileSync(path.join(root,'quizz.html'),'utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const check=function check(api, qs, meta, assert){
 const roles=["discovery","consolidation","discrimination","deepening","transfer","review"];
 assert(Object.keys(api.concepts).length===99,"99 concepts");assert(Object.keys(api.byId).length===1879,"1879 IDs");
 for(const x of qs){const m=api.classify(x.id);assert(m&&m.concept===meta[x.id].concept&&m.answer===x.answer&&m.family===x.caseFamily,"ID "+x.id);assert(m.roles.length&&m.roles.every(r=>roles.includes(r))&&m.rationale,"roles");assert(Object.isFrozen(m),"frozen");}
 assert(api.classify("__proto__")===null&&api.describe("constructor")===null,"unknown");
 for(const [k,d] of Object.entries(api.concepts)){assert(d.objective&&roles.every(role=>d.stages[role].ids.every(id=>api.classify(id).concept===k&&api.classify(id).roles.includes(role))),"stages "+k);assert(d.prerequisites.every(e=>api.describe(e.concept)),"prereq");}
 const xs=qs.filter(x=>api.classify(x.id).concept==="ouv.sa1"),x=xs[0],y=xs.find(z=>z.caseFamily!==x.caseFamily);
 const answer=(q,extra={})=>({id:q.id,result:"correct",choice:q.answer,assisted:false,hadFreeError:false,...extra});
 const event=(session,answers,mode="parcours")=>({session,mode,answers});
 const scenarios=[
 ["new",{completed:0},"unseen"],
 ["old",{completed:9,entries:{[x.id]:{assessment:{lastSession:2,result:"correct"}}}},"exposed"],
 ["assisted",{completed:1,journal:[event(1,[answer(x,{assisted:true})])]},"exposed"],
 ["free-error",{completed:1,journal:[event(1,[answer(x,{hadFreeError:true})])]},"exposed"],
 ["invalid-choice",{completed:1,journal:[event(1,[answer(x,{choice:"?"})])]},"exposed"],
 ["first",{completed:1,journal:[event(1,[answer(x)])]},"first_success"],
 ["same-session",{completed:1,journal:[event(1,[answer(x),answer(y)])]},"first_success"],
 ["same-family",{completed:4,journal:[event(1,[answer(x)]),event(4,[answer(x)])]},"first_success"],
 ["independent",{completed:4,journal:[event(1,[answer(x)]),event(4,[answer(y)])]},"multi_family_evidence"],
 ["consolidation-only",{completed:1,journal:[event(1,[answer(x)],"consolidation")]},"unseen"],
 ["relapse",{completed:5,journal:[event(1,[answer(x)]),event(4,[answer(y)]),event(5,[answer(y,{result:"wrong",choice:"Passe"})])]},"fragile"]
 ];
 const output=[];
 for(const [name,history,expected] of scenarios){const ctx={concept:"ouv.sa1",history,candidates:[x,y,{id:"UNKNOWN"},x]},before=JSON.stringify(ctx),v=api.recommend(ctx),s=v.concepts["ouv.sa1"];assert(s.evidence===expected,name+" "+s.evidence);assert(s.mastery==="not_established","no fabricated mastery");assert(JSON.stringify(ctx)===before,"mutation");assert(v.candidates.length===2&&v.candidates.every(x=>Math.abs(x.delta)<=20),"candidate boundaries");assert(api.recommend({...ctx,category:"maintenance"}).candidates.every(x=>x.delta===0),"maintenance");output.push({name,evidence:s.evidence,next:s.next,proofFamilies:s.independentFamilies,proofSessions:s.independentSessions});}
 assert(api.recommend({candidates:[x,y],selected:[x]}).candidates.length===1,"selected");
 assert(api.recommend(null).candidates.length===0,"null");return output;
};
console.log(check(api,qs,meta,assert.ok));const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'quizz-apprentissage-concepts.js'),'utf8'),context);assert.equal(context.window.QPJBApprentissageConcepts.schema,api.schema);assert.equal(Object.keys(context.window.QPJBApprentissageConcepts.byId).length,1879);console.log('M2 tests OK');

const verify=function verify(api,qs,meta,assert){
 const lookup=new Map(qs.map(x=>[x.id,x]));
 const meaningful=(x,y)=>x.caseFamily!==y.caseFamily&&(x.h!==y.h||JSON.stringify(x.shape)!==JSON.stringify(y.shape))&&JSON.stringify(x.hand)!==JSON.stringify(y.hand);
 const report={pairs:0,consolidations:0,transfers:0,profiles:0,boundaries:{}};
 for(const x of qs){const m=api.classify(x.id);
   for(const [role,field] of [["discrimination","contrastId"],["consolidation","consolidationId"],["transfer","transferId"]]){
     assert(m.roles.includes(role)===!!m[field],x.id+" "+role);
     if(!m[field])continue;const y=lookup.get(m[field]);assert(y&&(role==="transfer"?x.caseFamily!==y.caseFamily&&JSON.stringify(x.hand)!==JSON.stringify(y.hand):meaningful(x,y)),x.id+" distinct family/hand");
     if(role==="discrimination"){assert(x.answer!==y.answer&&x.choices.includes(y.answer)&&y.choices.includes(x.answer)&&JSON.stringify(x.auction)===JSON.stringify(y.auction),x.id+" contrast");report.pairs++;}
     else if(role==="transfer"){assert(JSON.stringify(x.auction)!==JSON.stringify(y.auction),x.id+" context shift");assert(api.describe(m.concept).transferPairs.some(p=>(p.a===x.id&&p.b===y.id||p.b===x.id&&p.a===y.id)&&p.criterion&&p.status==="source_reviewed_transfer_candidate"),x.id+" curated pair");report.transfers++;}else{assert(x.answer===y.answer&&meta[x.id].concept===meta[y.id].concept,x.id+" same decision");assert(JSON.stringify(x.auction)===JSON.stringify(y.auction),x.id+" consolidation");report.consolidations++;}
   }
 }
 const answer=(q,extra={})=>({id:q.id,result:"correct",choice:q.answer,assisted:false,hadFreeError:false,...extra});
 const event=(session,answers)=>({session,mode:"parcours",answers});
 for(const [k,d] of Object.entries(api.concepts)){
   const g=d.stages.review.ids.map(id=>lookup.get(id)),x=g[0],y=g.find(q=>q.caseFamily!==x.caseFamily);
   assert(y,"independent family available "+k);
   const scenarios=[
     {history:{completed:0},expected:"unseen"},
     {history:{completed:2,journal:[event(2,[answer(x,{assisted:true})])]},expected:"exposed"},
     {history:{completed:2,journal:[event(2,[answer(x),answer(y)])]},expected:"first_success"},
     {history:{completed:4,journal:[event(1,[answer(x)]),event(4,[answer(y)])]},expected:"multi_family_evidence"},
     {history:{completed:5,journal:[event(1,[answer(x)]),event(4,[answer(y)]),event(5,[answer(y,{result:"wrong",choice:"?"})])]},expected:"fragile"}
   ];
   for(const {history,expected} of scenarios){const ctx={concept:k,candidates:g,history};const before=JSON.stringify(ctx),res=api.recommend(ctx);assert(res.concepts[k].evidence===expected,k+" "+expected);assert(JSON.stringify(ctx)===before,k+" non mutation");assert(res.candidates.every(x=>g.some(y=>y.id===x.id)&&(!x.role||api.classify(x.id).roles.includes(x.role))),k+" candidates");report.profiles++;}
 }
 for(const [k,filter] of [
 ["ouv.mineure",x=>x.shape[2]===3&&x.shape[3]===3],
 ["ouv.sa1",x=>x.h===15||x.h===17],
 ["majeur.soutien",x=>x.auction.some(a=>/1[♥♠]/.test(a))&&x.shape[x.auction.find(a=>/1[♥♠]/.test(a)).includes("♠")?0:1]===3],
 ["chelem.quantitatif",x=>x.choices.includes("4SA")],
 ["chelem.blackwood.declenchement",x=>x.choices.includes("4SA")]
 ]){const ids=api.describe(k).stages.review.ids.map(id=>lookup.get(id)).filter(filter);report.boundaries[k]=ids.map(x=>({id:x.id,h:x.h,shape:x.shape,answer:x.answer,contrast:api.classify(x.id).contrastId}));}
 return report;
};
console.log(verify(api,qs,meta,assert.ok));

const checkContextPairs=function checkContextPairs(api,assert){
 const pairs=new Map();for(const [k,d] of Object.entries(api.concepts))for(const p of d.contextContrasts||[]){assert(p.concepts.includes(k)&&p.proof==="non_automatique","context pair contract");assert(api.classify(p.a)&&api.classify(p.b)&&p.criterion,"context pair traceability");pairs.set(p.a+"|"+p.b,p);}
 assert(pairs.size===14,"14 teacher contrasts");assert(pairs.has("SEF-V44-013|SEF-L01-A-01"),"4SA contextual meaning");return pairs.size;
};
console.log('Contrastes didactiques :',checkContextPairs(api,assert.ok));

const extra=function extra(api,qs,assert){
 const lookup=new Map(qs.map(x=>[x.id,x]));
 const concepts=Object.entries(api.concepts);
 for(const [k,d] of concepts){for(const [role,examples] of Object.entries(d.learningCriteria.examples)){assert(examples.length<=3,"examples bound");for(const v of examples){assert(lookup.has(v.id)&&api.classify(v.id).roles.includes(role)&&v.criterion&&v.decision===lookup.get(v.id).answer,"example "+k+" "+role);}}}
 const fit=api.describe("majeur.soutien").stages.discovery.ids;
 assert(fit.length===9&&fit.every(id=>{const x=lookup.get(id);return x.shape[x.answer.endsWith("♠")?0:1]===3&&/^2[♥♠]$/.test(x.answer)}),"5-3 first");
 const [x,y,z]=[...new Map(qs.filter(x=>api.classify(x.id).concept==="ouv.sa1").map(x=>[x.caseFamily,x])).values()];
 const correct=q=>({id:q.id,result:"correct",choice:q.answer,assisted:false,hadFreeError:false});
 const wrong=q=>({...correct(q),result:"wrong",choice:"Passe"});
 const evt=(session,...answers)=>({mode:"parcours",session,answers});
 let history={completed:5,journal:[evt(1,correct(x)),evt(2,correct(y)),evt(3,wrong(x)),evt(5,correct(z))]};
 let st=api.recommend({concept:"ouv.sa1",history,candidates:[x,y,z]}).concepts["ouv.sa1"];
 assert(st.fragile&&st.weakFamilies.includes(x.caseFamily)&&st.next==="consolidation","weak family not masked by another success");
 history={completed:6,journal:[...history.journal,evt(6,correct(x))]};st=api.recommend({concept:"ouv.sa1",history}).concepts["ouv.sa1"];
 assert(!st.fragile,"same family corrected on later session");
 history={completed:6,journal:[...history.journal,evt(6,wrong(x),correct(x))]};st=api.recommend({concept:"ouv.sa1",history}).concepts["ouv.sa1"];
 assert(st.fragile,"same session error precedence");
 history={completed:7,journal:[evt(1,correct(x)),evt(2,correct(y)),evt(3,wrong(x)),evt(5,correct(z)),evt(7,correct(y))]};st=api.recommend({concept:"ouv.sa1",history}).concepts["ouv.sa1"];
 assert(!st.fragile&&st.unresolvedWeakFamilies.includes(x.caseFamily)&&st.mastery==="not_established","recovery on two independent later families does not invent a clean history");
 history={completed:7,journal:[evt(1,correct(x)),evt(2,correct(y)),evt(3,wrong(x)),evt(7,correct(z),correct(y))]};st=api.recommend({concept:"ouv.sa1",history}).concepts["ouv.sa1"];
 assert(st.fragile,"recovery must span different sessions");
};
extra(api,qs,assert.ok);

const transferTest=function transferTest(api,qs,assert){
 const map=new Map(qs.map(x=>[x.id,x]));
 const pairs=new Map();for(const d of Object.values(api.concepts))for(const p of d.transferPairs){pairs.set(p.a+"|"+p.b,p);assert(p.criterion&&p.concepts.every(k=>api.describe(k).transferPairs.some(x=>x.a===p.a&&x.b===p.b)),"pair reference");}
 assert(pairs.size===18,"18 curated transfer pairs");
 for(const [a,b] of [["SEF-V475-006","SEF-L29-005"],["SEF-V410-006","V2-M3-001"],["SEF-V45-022","SEF-L13-006"],["SEF-V3-105-3","SEF-L43-003"]])assert(api.classify(a).transferId!==b,"different meanings not transfer");
 const a=map.get("SEF-034-1"),b=map.get("SEF-N101-3"),answer=q=>({id:q.id,result:"correct",choice:q.answer,assisted:false,hadFreeError:false}),event=(session,q)=>({mode:"parcours",session,answers:[answer(q)]});
 const check=journal=>api.recommend({concept:"sa1.stayman",history:{completed:3,journal}}).concepts["sa1.stayman"];
 assert(check([event(1,a),event(3,b)]).transferred,"documented cross-concept transfer");
 assert(!check([event(1,a),event(1,b)]).transferred,"same session not transfer evidence");
};
transferTest(api,qs,assert.ok);
