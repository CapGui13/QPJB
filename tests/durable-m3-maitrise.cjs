'use strict';
const fs=require('node:fs'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const BASE='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
const root=require('node:path').join(__dirname,'..');
const read=p=>fs.readFileSync(require('node:path').join(root,p),'utf8');
const readBase=p=>execFileSync('git',['show',BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});
const cache=new Map();
function baseRequire(p){
 p=p.replace(/^\.\//,'');
 if(cache.has(p))return cache.get(p).exports;
 const m={exports:{}};cache.set(p,m);
 new Function('module','exports','require','window',readBase(p))(m,m.exports,baseRequire,undefined);
 return m.exports;
}
const api=require('../quizz-durable-m3-maitrise.js');
const engine=baseRequire('quizz-parcours.js'),architecture=baseRequire('quizz-apprentissage-concepts.js'),meta=baseRequire('quizz-prerequis.js').byId;
const qs=JSON.parse(readBase('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const registry=JSON.parse(read('audits/apprentissage-durable-20261126/m3/registre.json'));
const win={};vm.runInNewContext(read('quizz-durable-m3-maitrise.js'),{window:win});
const run=function run(api,browser,engine,architecture,qs,meta,registry){
 const DAY=86400000,HOUR=3600000,T=Date.UTC(2025,0,1),now=T+365*DAY;
 const lookup=new Map(qs.map(q=>[q.id,q])),groups=new Map();
 for(const q of qs){const k=meta[q.id].concept;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(q);}
 let assertions=0;const eq=(a,b,msg)=>{assertions++;if(JSON.stringify(a)!==JSON.stringify(b))throw Error(msg+" : "+JSON.stringify(a)+" != "+JSON.stringify(b));};
 const ok=(x,msg)=>{assertions++;if(!x)throw Error(msg);};
 const a=(q,kind="clean")=>({id:q.id,result:kind==="wrong"?"wrong":kind==="skip"||kind==="skip-error"?"skipped":"correct",choice:kind==="wrong"?q.choices.find(x=>x!==q.answer):kind==="skip"||kind==="skip-error"?null:q.answer,assisted:kind==="assisted",hadFreeError:kind==="corrected"||kind==="skip-error",family:q.caseFamily});
 const event=(session,t,answers,mode="parcours")=>({session,mode,recordedAt:t===null?null:typeof t==="string"?t:new Date(t).toISOString(),answers});
 const state=(journal,completed=Math.max(0,...journal.filter(e=>e.mode==="parcours").map(e=>e.session)),entries={})=>({version:1,completed,journal,entries,skills:{}});
 const assess=(history,exercises=qs,nowMs=now,extra={})=>api.assess({history,exercises,nowMs,...extra});
 const concept=q=>meta[q.id].concept;
 const distinct=pool=>[...new Map(pool.map(q=>[q.caseFamily,q])).values()];
 const first=qs[0], k=concept(first), [q1,q2,q3]=distinct(groups.get(k));
 const empty=assess(state([]));
 eq(Object.keys(empty.concepts).length,99,"99 concepts");eq(qs.length,1915,"1915 real IDs");eq(new Set(qs.map(q=>q.id)).size,1915,"unique IDs");
 eq(empty.pairs.length,59,"all signed historical pairs");
 for(const s of Object.values(empty.concepts)){eq(s.evidence.status,"unobserved","no evidence");eq(s.reviewDue,null,"no unseen due");eq(s.mastery,"not_established","no categorical mastery");}
 eq(assess(null,[],null).quality.completed,null,"missing state");
 eq(assess({version:2,completed:3,journal:[event(1,T,[a(q1)])]}).concepts[k].evidence.status,"unobserved","unsupported state version");
 const testOne=assess(state([event(1,T,[a(q1)])]),qs,T+HOUR);
 eq(JSON.stringify(testOne),JSON.stringify(browser.assess({history:state([event(1,T,[a(q1)])]),exercises:qs,nowMs:T+HOUR})),"UMD window and CJS parity");
 for(const q of qs){
   const s=assess(state([event(1,T,[a(q)])]),[q],T+HOUR).concepts[concept(q)];
   eq(s.evidence.autonomous,1,"exact ID "+q.id);eq(s.evidence.status,"first_autonomous","single answer "+q.id);eq(s.mastery,"not_established","single never mastery");eq(s.retention.intervalMs,null,"single never retention");
 }
 const perConcept=[];
 for(const [key,pool] of groups){
   const [x,y,z]=distinct(pool);
   const one=assess(state([event(1,T,[a(x),a(y),a(z)])]),pool,T+HOUR).concepts[key];
   eq(one.evidence.status,"first_autonomous","same session "+key);
   const grouped=assess(state([event(1,T,[a(x)]),event(2,T+HOUR,[a(y)]),event(3,T+2*HOUR,[a(z)])]),pool,T+3*HOUR).concepts[key];
   eq(grouped.evidence.status,"multi_family_multi_session","grouped "+key);eq(grouped.retention.status,"less_than_24h","grouped not delayed");
   const spaced=assess(state([event(1,T,[a(x)]),event(2,T+DAY,[a(y)]),event(3,T+31*DAY,[a(z)])]),pool,T+31*DAY+HOUR).concepts[key];
   eq(spaced.retention.status,"observed_30d","long delayed "+key);eq(spaced.review.days,30,"cap "+key);
   const weak=assess(state([event(1,T,[a(x)]),event(2,T+DAY,[a(y)]),event(3,T+31*DAY,[a(z)]),event(4,T+32*DAY,[a(x,"wrong")])]),pool,T+32*DAY+HOUR).concepts[key];
   eq(weak.fragile,true,"failure after delay "+key);eq(weak.review.days,1,"early review "+key);eq(weak.retention.intervalMs,null,"old successes not current retention "+key);eq(weak.evidence.autonomous,3,"keep historical proof");
   const rec=assess(state([event(1,T,[a(x,"wrong")]),event(2,T+DAY,[a(y)]),event(3,T+8*DAY,[a(z)])]),pool,T+8*DAY+HOUR).concepts[key];
   eq(rec.recovery.observed,true,"recovery "+key);eq(rec.fragile,false,"recovery no punitive lock");ok(rec.recovery.unrecheckedWeakFamilies.includes(x.caseFamily),"specific failure not erased");
   perConcept.push({concept:key,ids:pool.length,families:distinct(pool).length,scenarios:5,result:"PASS"});
 }
 for(const p of registry.pairs){
   const x=lookup.get(p.a),y=lookup.get(p.b);ok(x&&y&&x.caseFamily!==y.caseFamily,"real pair endpoints");
   const find=r=>r.pairs.find(z=>z.a===p.a&&z.b===p.b&&z.kind===p.kind);
   const both=assess(state([event(1,T,[a(x)]),event(2,T+DAY,[a(y)])]),[x,y],T+2*DAY);
   eq(find(both).status,"observed_candidate","pair "+p.kind+" "+p.a+" "+p.b);
   eq(find(assess(state([event(1,T,[a(x),a(y)])]),[x,y],T+DAY)).status,"same_session_only","pair same session");
   eq(find(assess(state([event(1,T,[a(x)]),event(2,T+DAY,[a(y,"assisted")])]),[x,y],T+2*DAY)).status,"not_demonstrated","assisted pair");
   eq(find(assess(state([event(1,T,[a(y)]),event(2,T+DAY,[a(x)])]),[x,y],T+2*DAY)).status,p.kind==="discrimination"?"observed_candidate":"not_demonstrated","pair direction");
   eq(find(assess(state([]),[x,y],T)).status,"not_demonstrated","pair no evidence");
   eq(find(assess(state([event(1,T,[a(x)]),event(2,T+DAY,[a(y)])]),[x],T+2*DAY)).status,"unavailable","pair missing");
 }
 const test=(label,h,t=now,exercises=qs)=>{const s=assess(h,exercises,t).concepts[k];return s;};
 for(const kind of ["wrong","assisted","corrected","skip","skip-error"]){
   const s=test(kind,state([event(1,T,[a(q1,kind)])]));
   eq(s.evidence.autonomous,0,kind+" not autonomous");eq(s.fragile,kind!=="skip",kind+" fragile");eq(s.reviewDue,true,kind+" eventual check");
 }
 const missing={...a(q1)};delete missing.hadFreeError;
 const mismatch={...a(q1),choice:q1.choices.find(x=>x!==q1.answer)};
 const firstWrong={...a(q1),firstGuess:q1.choices.find(x=>x!==q1.answer)};
 for(const r of [missing,mismatch,firstWrong])eq(test("uncertain",state([event(1,T,[r])])).evidence.autonomous,0,"uncertain not independent");
 const tainted=test("tainted",state([event(1,T,[a(q1),a(q2,"wrong")]),event(2,T+DAY,[a(q3)])]));
 eq(tainted.evidence.autonomous,2,"raw clean attempts preserved");eq(tainted.evidence.currentSessions,[2],"mixed session not clean");eq(tainted.fragile,true,"mixed session not proof");
 const practiceOnly=test("practice",state([event(1,T,[a(q1)],"consolidation"),event(1,T+DAY,[a(q2)],"consolidation")],0));
 eq(practiceOnly.evidence.autonomous,0,"consolidation not assessment");eq(practiceOnly.evidence.practice.length,2,"practice visible");eq(practiceOnly.retention.intervalMs,null,"consolidation no retention");
 const afterPractice=test("practice after failure",state([event(1,T,[a(q1,"wrong")]),event(2,T+DAY,[a(q2)],"consolidation")],1),T+DAY+HOUR);
 eq(afterPractice.fragile,true,"practice not cure");eq(afterPractice.reviewDue,true,"practice not postpone");
 const sameId=test("same family",state([event(1,T,[a(q1)]),event(2,T+31*DAY,[a(q1)])]),T+32*DAY);
 eq(sameId.evidence.status,"first_autonomous","same family insufficient");eq(sameId.retention.sameFamilyRecall.intervalMs,31*DAY,"same-family recall separate");eq(sameId.retention.intervalMs,null,"not transfer");
 const old={version:1,completed:30,skills:{},entries:{[q1.id]:{result:"correct",lastSession:2,assisted:false,seen:100,streak:90,due:20},[q2.id]:{result:"correct",lastSession:4,assisted:false,assessment:{result:"correct",lastSession:4,assisted:false}}},micros:{[k]:{score:3,attempts:100,independent:100}}};
 const sOld=test("old",old);
 eq(sOld.evidence.autonomous,0,"legacy summary not proof");eq(sOld.evidence.legacyExposure.length,2,"legacy exposure");eq(sOld.retention.status,"unknown","legacy time unknown");
 const exp=engine.exportProgress(engine.load(old),qs,{[q1.id]:{history:[{at:new Date(T).toISOString(),result:"correct",choice:q1.answer,mode:"libre",assisted:false,hadFreeError:false}]}});
 eq(test("export",exp).evidence.autonomous,0,"mixed quiz history ignored");eq(test("restored",engine.importProgress(exp)).evidence.autonomous,0,"real import old");
 eq(test("export inconsistent",{...exp,summary:{completedSessions:2}}).evidence.status,"unobserved","bad export");
 const active=state([]);active.active={ids:[q1.id],answers:{0:a(q1)},createdAt:0,index:0};active.entries[q1.id]={result:"correct",lastSession:0,assessment:{result:"correct",lastSession:0}};
 eq(test("active",active).evidence.autonomous,0,"unfinished not proof");
 const timeCases=[{name:"absent",times:[null,null],now:T+40*DAY},{name:"invalid",times:["2025-02-30T00:00:00.000Z","2025-01-02"],now:T+40*DAY},{name:"future",times:[T+40*DAY,T+41*DAY],now:T+10*DAY},{name:"rollback",times:[T+10*DAY,T],now:T+40*DAY},{name:"no now",times:[T,T+DAY],now:null}];
 for(const c of timeCases){
   const r=assess(state([event(1,c.times[0],[a(q1)]),event(2,c.times[1],[a(q2)])]),qs,c.now);
   eq(r.concepts[k].retention.status,"unknown","clock "+c.name);eq(r.concepts[k].retention.intervalMs,null,"no invented interval");
   eq(r.concepts[k].evidence.autonomous,2,"session proof retained");
   if(c.name==="rollback")eq(r.quality.clockRollback,true,"rollback detected");
 }
 const dup=assess(state([event(1,T,[a(q1)]),event(1,T,[a(q2)])],1));eq(dup.quality.duplicateAssessmentSessions,1,"duplicate detected");eq(dup.concepts[k].evidence.autonomous,0,"duplicate assessment abstain");
 const dupAnswer=assess(state([event(1,T,[a(q1),a(q1)])]));eq(dupAnswer.quality.invalidAnswers,2,"duplicate id");eq(dupAnswer.concepts[k].evidence.autonomous,0,"duplicates abstain");
 const outOfOrder=assess(state([event(2,T,[a(q1)]),event(1,T+DAY,[a(q2)])],2));eq(outOfOrder.quality.sessionRollback,true,"session rollback");eq(outOfOrder.concepts[k].evidence.autonomous,0,"ambiguous order");
 const badFamily=assess(state([event(1,T,[{...a(q1),family:"other"}])]),[q1]);eq(badFamily.concepts[k].evidence.autonomous,0,"wrong family");
 const badExercise=assess(state([event(1,T,[a(q1)])]),[{...q1,answer:"ZZ"}]);eq(badExercise.quality.invalidExercises,1,"changed catalogue");
 const truncated=state(Array.from({length:1001},(_,i)=>event(i+1,T+i*HOUR,[a(i===0?q2:q1)])),1001);
 const rt=assess(truncated,[q1,q2],T+1002*HOUR);
 eq(rt.quality.retainedEvents,1000,"journal cap");eq(rt.quality.discardedEvents,1,"truncated");eq(rt.quality.missingDetailedSessions,1,"gap");eq(rt.concepts[k].evidence.historicalFamilies,[q1.caseFamily],"no reconstruction");
 const now1=T+31*DAY+HOUR;
 const stableHistory=state([event(1,T,[a(q1)]),event(2,T+DAY,[a(q2)]),event(3,T+31*DAY,[a(q3)])]);
 const fresh=test("stable",stableHistory,now1);const resumed=test("absence",stableHistory,T+365*DAY);
 eq(fresh.reviewDue,false,"fresh");eq(resumed.reviewDue,true,"resume due");eq(resumed.fragile,false,"absence not failure");eq(resumed.evidence, fresh.evidence,"absence preserves proof");eq(resumed.retention.status,fresh.retention.status,"absence does not erase");
 eq(resumed.review.overdueMs,30*DAY,"overdue cap");
 const rankInput={history:stableHistory,exercises:qs,nowMs:T+365*DAY,candidates:[q1,q2,q3,q3,{id:"unknown"}],selected:[]};
 const before=JSON.stringify(rankInput),rank=api.rankReview(rankInput);
 eq(JSON.stringify(rankInput),before,"rank pure");ok(rank.length===3&&rank.every(x=>x.delta>0&&x.delta<=30),"bounded positive hints");
 eq(api.rankReview({...rankInput,selected:[q1]}),[],"one concept per selected deck");
 for(const category of ["due","weakness","review","discovery","rappel_erreur_aide","rappel_question"])eq(api.rankReview({...rankInput,category}),[],"explicit prior category "+category);
 eq(api.rankReview({...rankInput,history:{...stableHistory,active:{ids:[q1.id]}}}),[],"active untouched");
 eq(api.rankReview({...rankInput,history:state([])}),[],"no unobserved suggestion");
 const pureInput={history:stableHistory,exercises:[q1,q2,q3],nowMs:now};
 const deepFreeze=o=>{if(o&&typeof o==="object"&&!Object.isFrozen(o)){Object.freeze(o);Object.values(o).forEach(deepFreeze)}return o;};
 deepFreeze(pureInput);eq(api.assess(pureInput),api.assess(pureInput),"deterministic frozen inputs");
 // Baseline comparison: run the actual #395 record/finish and the concept module.
 // Synthetic decks are drawn deterministically from the real catalogue, not claimed eligible.
 const candidates=Array.from(groups.values(),g=>g[0]),keys=[...groups.keys()],profiles=["grouped","daily","weekly","forgetting","assisted","resumption"],seeds=[11,47,103],metrics=[];
 const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0)/4294967296};
 for(const profile of profiles)for(const seed of seeds){
   const st=engine.empty(),out=[];let time=T,total=0,totalAssessed=0;
   for(let n=1;n<=180;n++){
     time+=profile==="grouped"?HOUR:profile==="weekly"?7*DAY:DAY;
     if(profile==="resumption"&&n===91)time+=90*DAY;
     const deck=[],families=new Set();
     for(let j=0;j<10;j++){
       const key=keys[((n-1)*7+j*9+seed)%keys.length],pool=groups.get(key);
       const index=Math.floor(hash(key+":"+n+":"+j+":"+seed)*pool.length);
       let q=null;for(let l=0;l<pool.length;l++){const x=pool[(index+l)%pool.length];if(!families.has(x.caseFamily)){q=x;break;}}
       if(q){families.add(q.caseFamily);deck.push(q);}
     }
     ok(deck.length===10,"synthetic deck");
     const consolidate=n%15===0;
     if(consolidate){st.active={ids:deck.map(q=>q.id),index:0,answers:{},createdAt:st.completed,mode:"consolidation",targets:deck.map(()=>null)};}
     else st.active={ids:deck.map(q=>q.id),index:0,answers:{},createdAt:st.completed};
     for(let i=0;i<deck.length;i++){
       const q=deck[i],u=hash(profile+":"+seed+":"+n+":"+q.id);
       let kind="clean";
       if(profile==="assisted")kind=u<.20?"wrong":u<.65?"assisted":u<.80?"corrected":u<.85?"skip":"clean";
       if(profile==="forgetting"&&n>=70&&n<=110&&u<.65)kind="wrong";
       if(profile==="resumption"&&n>=91&&n<=105&&u<.45)kind="wrong";
       const r=a(q,kind);
       ok(engine.record(st,q,r.result,i,r.choice,r.assisted,r.hadFreeError),"real record");
       total++;if(!consolidate)totalAssessed++;
     }
     ok(engine.finish(st,qs),"real finish");
     st.journal.at(-1).recordedAt=new Date(time).toISOString();
     if([20,65,90,91,105,153,180].includes(n)){
       const s0=JSON.stringify(st),start=Date.now();
       const result=assess(st,qs,time),ms=Date.now()-start;
       eq(JSON.stringify(st),s0,"benchmark pure");
       const prior=architecture.recommend({history:st,candidates}).concepts;
       const baseDue=new Set(Object.entries(st.entries).filter(([id,r])=>r.due<=st.completed&&lookup.has(id)).map(([id])=>meta[id].concept));
       const newDue=Object.values(result.concepts).filter(s=>s.reviewDue===true);
       const baselineMulti=Object.values(prior).filter(s=>s.evidence==="multi_family_evidence").length;
       const multi=Object.values(result.concepts).filter(s=>s.evidence.status==="multi_family_multi_session").length;
       const elapsed=Object.values(result.concepts).filter(s=>s.retention.intervalMs>=DAY).length;
       const priorSpaced=Object.values(prior).filter(s=>s.spaced).length;
       const pendingWeak=Object.values(result.concepts).filter(s=>s.fragile).length;
       const weakNewDue=newDue.filter(s=>s.fragile).length;
       const weakBaseDue=Object.values(result.concepts).filter(s=>s.fragile&&baseDue.has(s.concept)).length;
       const rank=api.rankReview({history:st,exercises:qs,nowMs:time,candidates:deck,selected:[]});
       ok(rank.every(x=>deck.some(q=>q.id===x.id)&&x.delta<=30),"rank safe");
       ok(Object.values(result.concepts).every(s=>s.mastery==="not_established"),"no categorical verdict");
       out.push({event:n,completed:st.completed,baselineMulti,newMulti:multi,baselineSessionSpaced:priorSpaced,newDelayed24h:elapsed,baselineDueConcepts:baseDue.size,newDueConcepts:newDue.length,fragile:pendingWeak,baselineDueFragile:weakBaseDue,newDueFragile:weakNewDue,rankedCandidates:rank.length,assessMs:ms});
     }
   }
   const final=assess(st,qs,time);
   const restored=engine.load(JSON.stringify(st));
   eq(assess(restored,qs,time),final,"real resume exact");
   const exported=engine.exportProgress(st,qs,{});
   eq(assess(exported,qs,time),final,"real export exact");
   eq(assess(engine.importProgress(exported),qs,time),final,"real import exact");
   metrics.push({profile,seed,events:180,answers:total,assessmentAnswers:totalAssessed,snapshots:out});
 }
 // Adversarial calibration: expected values arise from constructed scenarios,
 // not from interpreting the base's session spacing as elapsed calendar time.
 const oracle={concepts:99,qualificationChecks:0,qualificationErrors:0,baseSessionSpacedInUnder24h:0,newDelayedInUnder24h:0,baseDueAfter90DaysNoSessions:0,newDueAfter90DaysNoSessions:0,newPrematureDue:0,newDelayedTrue:0,fragileAfterForgetting:0,assistedNotProof:0,missingTimeUnknown:0};
 const qualify=(condition,label)=>{oracle.qualificationChecks++;if(!condition)oracle.qualificationErrors++;ok(condition,label);};
 for(const [key,pool] of groups){
   const [x,y,z]=distinct(pool);
   const groupedHistory=state([event(1,T,[a(x)]),event(2,T+HOUR,[a(y)]),event(3,T+2*HOUR,[a(z)])]);
   const prev=architecture.recommend({history:groupedHistory,candidates:[x]}).concepts[key];
   oracle.baseSessionSpacedInUnder24h+=prev.spaced?1:0;
   const candidate=assess(groupedHistory,pool,T+3*HOUR).concepts[key];
   oracle.newDelayedInUnder24h+=candidate.retention.intervalMs>=DAY?1:0;
   qualify(candidate.retention.intervalMs<DAY&&candidate.retention.status==="less_than_24h","grouped sessions not elapsed days "+key);
   const before=engine.empty();
   before.active={ids:[x.id],index:0,answers:{},createdAt:before.completed};
   ok(engine.record(before,x,"correct",0,x.answer,false,false),"base real observation");
   ok(engine.finish(before,qs),"base real completion");
   before.journal[0].recordedAt=new Date(T).toISOString();
   oracle.baseDueAfter90DaysNoSessions+=before.entries[x.id].due<=before.completed?1:0;
   const fresh=assess(before,pool,T+HOUR).concepts[key];
   const late=assess(before,pool,T+90*DAY).concepts[key];
   oracle.newPrematureDue+=fresh.reviewDue===true?1:0;
   oracle.newDueAfter90DaysNoSessions+=late.reviewDue===true?1:0;
   qualify(fresh.reviewDue===false,"no early reminder "+key);
   qualify(late.reviewDue===true&&!late.fragile,"time only due without punishment "+key);
   const spacedHistory=state([event(1,T,[a(x)]),event(2,T+7*DAY,[a(y)]),event(3,T+31*DAY,[a(z)])]);
   const spaced=assess(spacedHistory,pool,T+31*DAY+HOUR).concepts[key];
   oracle.newDelayedTrue+=spaced.retention.status==="observed_30d"?1:0;
   qualify(spaced.retention.status==="observed_30d","positive delayed evidence "+key);
   const forgotten=assess(state([...spacedHistory.journal,event(4,T+90*DAY,[a(z,"wrong")])]),pool,T+90*DAY+HOUR).concepts[key];
   oracle.fragileAfterForgetting+=forgotten.fragile?1:0;
   qualify(forgotten.fragile&&forgotten.retention.intervalMs===null&&forgotten.evidence.autonomous===3,"forgetting preserves historical proofs "+key);
   const helped=assess(state([event(1,T,[a(x,"assisted")]),event(2,T+7*DAY,[a(y,"corrected")])]),pool,T+10*DAY).concepts[key];
   oracle.assistedNotProof+=helped.evidence.autonomous===0?1:0;
   qualify(helped.evidence.autonomous===0&&helped.reviewDue===true,"assistance no evidence "+key);
   const undated=assess(state([event(1,null,[a(x)]),event(2,null,[a(y)])]),pool,T+10*DAY).concepts[key];
   oracle.missingTimeUnknown+=undated.retention.status==="unknown"?1:0;
   qualify(undated.retention.status==="unknown"&&undated.retention.intervalMs===null,"time missing "+key);
 }
 // Optional coordinator contract: additions require explicit trusted metadata,
 // and a supplied contrast is not a transfer unless labelled as such.
 const future={...q1,id:"SEF-AD26-M4-FIXTURE",caseFamily:"fixture-new-family"};
 const futureHistory=state([event(1,T,[a(q1)]),event(2,T+7*DAY,[a(future)])]);
 const fp={a:q1.id,b:future.id,concepts:[k],criterion:"Fixture",contextDifference:"Fixture only",evidence:"Fixture only"};
 const input={history:futureHistory,exercises:[q1,future],nowMs:T+8*DAY,metadataById:{[future.id]:{concept:k}},contrastPairs:[fp]};
 const ex=api.assess(input);
 eq(ex.concepts[k].evidence.currentFamilies.length,2,"coordinator addition fixture");
 eq(ex.pairs.find(p=>p.b===future.id).status,"observed_candidate","provided contrast fixture");
 eq(ex.pairs.find(p=>p.b===future.id).kind,"discrimination","no implicit transfer");
 eq(api.assess({...input,metadataById:{}}).concepts[k].evidence.currentFamilies.length,1,"unknown ID not credited");
 eq(api.assess({...input,contrastPairs:[{...fp,evidence:null}]}).pairs.find(p=>p.b===future.id).status,"unavailable","missing signed evidence");
 const pair=registry.pairs.find(p=>p.kind==="transfer"),px=lookup.get(pair.a),py=lookup.get(pair.b);
 const lost=assess(state([event(1,T,[a(px)]),event(2,T+DAY,[a(py)]),event(3,T+2*DAY,[a(py,"wrong")])]),[px,py],T+3*DAY).pairs.find(p=>p.a===pair.a&&p.b===pair.b&&p.kind==="transfer");
 eq(lost.status,"not_demonstrated","current transfer interrupted");
 eq(lost.historicalStatus,"observed_candidate","historical pair not erased");
 eq(api.rankReview({...rankInput,selected:[{exercise:q1,reason:"rappel_question"}]}),[],"actual selected wrapper");
 eq(api.rankReview({...rankInput,forcedReason:"rappel_erreur_aide"}),[],"explicit reason");
 eq(api.rankReview({...rankInput,priority:true}),[],"priority untouched");
 eq(api.rankReview({...rankInput,history:state([event(1,T,[a(q1)])])}),[],"S1–3 neutral");
 // Full supported journal window: 1000 completed sessions, 20 distinct IDs
 // per event, real IDs/families and injected clock. Measure, do not assert
 // platform-specific wall clock threshold.
 const stressJournal=Array.from({length:1000},(_,i)=>event(i+1,T+i*DAY,Array.from({length:20},(_,j)=>a(qs[(i*19+j)%qs.length]))));
 const stressHistory=state(stressJournal,1000),stressNow=T+1000*DAY;
 const t0=Date.now(),stressResult=assess(stressHistory,qs,stressNow),stressMs=Date.now()-t0;
 const t1=Date.now(),stressRank=api.rankReview({history:stressHistory,exercises:qs,nowMs:stressNow,candidates:qs,selected:[]}),stressRankMs=Date.now()-t1;
 eq(stressResult.quality.retainedEvents,1000,"full supported window");eq(stressResult.quality.possibleTruncation,true,"possible loaded truncation");
 eq(Object.values(stressResult.concepts).reduce((sum,s)=>sum+s.evidence.autonomous,0),20000,"20k proof rows");
 eq(stressResult.quality.invalidAnswers,0,"stress valid answers");
 ok(stressRank.every(x=>x.delta<=30&&lookup.has(x.id)),"stress rank bounded");
 const prepStart=Date.now(),prep=api.prepareReview({history:stressHistory,exercises:qs,nowMs:stressNow}),prepareMs=Date.now()-prepStart;
 const t2=Date.now();for(let i=0;i<10;i++)eq(prep.rank({candidates:qs}),stressRank,"prepared ranking parity "+i);const preparedTenRankMs=Date.now()-t2;
 eq(prep.rank({candidates:qs,priority:true}),[],"prepared priority guard");
 const stress={events:1000,answers:20000,assessMs:stressMs,rankMs:stressRankMs,prepareMs,preparedTenRankMs,rankCandidates:stressRank.length,resultJsonChars:JSON.stringify(stressResult).length};
 return {assertions,perConcept,pairTests:registry.pairs.length,metrics,oracle,stress,execution:"actual module and base source; synthetic histories"};
};
const results=run(api,win.QPJBDurableMastery,engine,architecture,qs,meta,registry);
console.log(JSON.stringify(results,null,2));
