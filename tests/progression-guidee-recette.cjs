#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const H=require('./progression-guidee-historical.cjs'),G=require('./wave2-adaptatif-golden.cjs');
const {simulate,profiles,horizons,seeds,exercises}=require('./wave2-adaptatif-benchmark.cjs');
const root=path.resolve(__dirname,'..'),base=H.engine();
const live=JSON.parse(H.payload(fs.readFileSync(path.join(root,'quizz.html'),'utf8'))).exercises;
const foundations=['ouv','mineur','majeur','sa','red','second','stayman'];
const advanced=['SEF-V44-002','SEF-L06-029','SEF-L37-004','SEF-L38-001','SEF-L40-001','SEF-L41-002','SEF-L28-001','SEF-L09-029'];
const bid=q=>String(q.answer).replace(/[\s\uFE0E\uFE0F]/g,'');
const family=q=>q.caseFamily||q.id;
const pass=q=>q.theme==='ouv'&&bid(q)==='Passe';
const opener=q=>String(q.auction?.[0]||'').match(/:\s*(1[♣♦♥♠])/)?.[1];
const clone=x=>JSON.parse(JSON.stringify(x));
const max=a=>a.length?Math.max(...a):0;
const quantile=(a,p)=>a.length?a.slice().sort((a,b)=>a-b)[Math.floor((a.length-1)*p)]:null;
function metrics(profile,horizon,meta=null,catalogue=exercises){
 const exercises=catalogue,byId=new Map(exercises.map(q=>[q.id,q]));
 const d={first20:[],firstTheme:{},maxGap:{},firstAdvanced:{},firstDifficulty:{},firstConcept:{},eligibleThemeSince:{},
  responseAdjacencies:0,themeTriples:0,shapeAdjacencies:0,forceAdjacencies:0,newFamily:0,repeatFamily:0,
  recallAlternate:0,recallDirect:0,errors:0,assisted:0,weakAdvanced:0,difficultyCounts:{},selectionReasons:{},violations:[]};
 const lastTheme={},seenFamilies=new Set(),exposure=new Map(),basic=new Set(),pending=new Map(),lastSeen=new Map(),delays=[];
 const themes=Object.keys(base.INTRO);
 const hasBasic=new Set(meta?exercises.filter(q=>meta[q.id].stage<=1&&q.difficulty<=3).map(q=>meta[q.id].concept):[]);
 const check=(condition,code,s,detail)=>{if(!condition)d.violations.push({code,session:s+1,detail})};
 function observe(e){
  if(e.phase==='answer'){
   const {s,q,a}=e;
   if(a.result!=='correct'||a.assisted||a.hadFreeError){
    if(!pending.has(q.id))pending.set(q.id,s);
    if(a.result!=='correct')d.errors++;
    if(a.assisted)d.assisted++;
   }
   return;
  }
  const {s,state,chosen,selection,api}=e,counts={};
  const passes=chosen.flatMap((q,i)=>pass(q)?[i]:[]);
  check(chosen.length===10&&new Set(chosen.map(q=>q.id)).size===10&&new Set(chosen.map(family)).size===10,'distinct-ten',s,chosen.map(q=>q.id));
  check(Array.isArray(selection)&&selection.length===chosen.length&&selection.every((v,i)=>v.id===chosen[i].id),'reason-alignment',s,selection);
  const weakPass=(state.micros?.['ouv:passe']?.score||0)<0||Object.entries(state.entries||{}).some(([id,v])=>byId.has(id)&&pass(byId.get(id))&&v.lastSession>=s-3&&(v.result!=='correct'||v.assisted));
  if(s===0){
   check(chosen.every(q=>q.theme==='ouv'),'opening-only',s,chosen.map(q=>q.id));
   check(passes.length===3&&passes[0]<3&&passes.every((v,i)=>!i||v-passes[i-1]>1),'S1-passes',s,passes);
   check(passes.every(i=>chosen[i].h<12&&chosen[i].difficulty===1),'S1-simple-pass',s,passes.map(i=>chosen[i].id));
   for(const [b,n] of [['1♣',2],['1♦',2],['1♥',1],['1♠',1],['1SA',1]])check(chosen.filter(q=>bid(q)===b).length>=n,'S1-opening-mix',s,b);
  }else if(s===1){
   check(passes.length>=1&&passes.length<=(weakPass?2:1),'S2-passes',s,passes);
   for(const b of ['1♣','1♦'])check(chosen.some(q=>q.theme==='ouv'&&bid(q)===b),'S2-minors',s,b);
   check(chosen.filter(q=>['mineur','majeur'].includes(q.theme)).length>=6,'S2-six-responses',s,chosen.map(q=>q.theme));
   for(const [theme,bs] of [['mineur',['1♣','1♦']],['majeur',['1♥','1♠']]])for(const b of bs)
    check(chosen.some(q=>q.theme===theme&&opener(q)===b),'S2-response-context',s,b);
  }else check(passes.length<=(weakPass?2:1),'opening-pass-cap',s,passes);
  const eligible=q=>{const m=meta?.[q.id];return !!m&&s>=m.minSession&&m.requires.every(r=>(exposure.get(r.concept)||0)>=r.minExposure)};
  if(meta)for(const theme of themes){
   if(d.firstTheme[theme]!==undefined||d.eligibleThemeSince[theme]!==undefined)continue;
   if(exercises.some(q=>q.theme===theme&&meta[q.id].stage<=1&&eligible(q)&&api.eligibility(q,state,exercises).eligible))d.eligibleThemeSince[theme]=s+1;
  }
  const recent=(state.journal||[]).slice(-8).filter(x=>x.mode==='parcours').flatMap(x=>x.answers||[]).filter(a=>foundations.includes(a.theme));
  const weak=recent.length>=10&&recent.filter(a=>a.result!=='correct'||a.assisted||a.hadFreeError).length*2>=recent.length;
  let adj=0,triples=0;
  const reasonCounts={};
  for(let i=0;i<chosen.length;i++){
   const q=chosen[i],m=meta?.[q.id],sel=selection?.[i];
   counts[q.theme]=(counts[q.theme]||0)+1;
   d.firstTheme[q.theme]??=s+1;
   if(advanced.includes(q.id))d.firstAdvanced[q.id]??=s+1;
   d.firstDifficulty[q.theme+'|'+q.difficulty]??=s+1;
   d.difficultyCounts[q.difficulty]=(d.difficultyCounts[q.difficulty]||0)+1;
   if(weak&&!foundations.includes(q.theme))d.weakAdvanced++;
   if(seenFamilies.has(family(q)))d.repeatFamily++;else d.newFamily++;
   seenFamilies.add(family(q));
   if(sel){
    d.selectionReasons[sel.reason]=(d.selectionReasons[sel.reason]||0)+1;
    reasonCounts[sel.reason]=(reasonCounts[sel.reason]||0)+1;
    if(sel.kind==='revision'&&!lastSeen.has(q.id))d.recallAlternate++;
    if(sel.kind==='revision'&&pending.has(q.id))d.recallDirect++;
   }
   if(pending.has(q.id)&&pending.get(q.id)<s){delays.push(s-pending.get(q.id));pending.delete(q.id)}
   lastSeen.set(q.id,s);
   if(i&&bid(q)===bid(chosen[i-1]))adj++;
   if(i>=2&&q.theme===chosen[i-1].theme&&q.theme===chosen[i-2].theme)triples++;
   if(i&&q.shape&&JSON.stringify(q.shape)===JSON.stringify(chosen[i-1].shape))d.shapeAdjacencies++;
   if(i&&Number.isFinite(q.h)&&q.h===chosen[i-1].h)d.forceAdjacencies++;
   if(meta){
    check(!!m,'missing-metadata',s,q.id);
    if(m){
     check(eligible(q),'independent-prerequisite',s,{id:q.id,meta:m,exposures:m.requires.map(r=>[r.concept,exposure.get(r.concept)||0])});
     const x=api.eligibility(q,clone(state),exercises);
     check(x?.eligible===true&&Array.isArray(x.reasons),'engine-eligibility',s,{id:q.id,diagnostic:x});
     if(q.difficulty>=4&&hasBasic.has(m.concept))check(basic.has(m.concept),'difficulty-before-basic',s,q.id);
     d.firstConcept[m.concept]??=s+1;
    }
   }else check(s>=base.INTRO[q.theme],'historical-roadmap',s,q.id);
  }
  for(const theme of themes){
   if(lastTheme[theme]!==undefined)d.maxGap[theme]=Math.max(d.maxGap[theme]||0,s-lastTheme[theme]-(counts[theme]?1:0));
   if(counts[theme])lastTheme[theme]=s;
  }
  if(s<20){
   d.responseAdjacencies+=adj;if(s>0)d.themeTriples+=triples;
   d.first20.push({session:s+1,ids:chosen.map(q=>q.id),bids:chosen.map(bid),passes:passes.length,counts,reasonCounts,adj,triples,maxDifficulty:max(chosen.map(q=>q.difficulty))});
  }
  // Only exposures from completed earlier sessions can unlock a subsequent deck.
  if(meta)for(const q of chosen){
   const m=meta[q.id];if(!m)continue;
   exposure.set(m.concept,(exposure.get(m.concept)||0)+1);
   if(m.stage<=1&&q.difficulty<=3)basic.add(m.concept);
  }
 }
 function finish(){
  d.errorDelay={count:delays.length,median:quantile(delays,.5),p90:quantile(delays,.9),max:max(delays),pending:pending.size,oldestPending:max([...pending.values()].map(s=>horizon-1-s))};
  if(meta){
   for(const theme of themes){
    const t=d.eligibleThemeSince[theme];
    if(t!==undefined&&t+4<=horizon)check(d.firstTheme[theme]!==undefined&&d.firstTheme[theme]<=t+4,'discovery-delay',t-1,{theme,first:d.firstTheme[theme]});
   }
   if(profile==='echecs')check(d.firstTheme.sa>=4&&d.firstTheme.sa<=8,'weak-SA-discovery',7,d.firstTheme.sa);
   if(profile==='autonome'){
    check(d.responseAdjacencies<=2,'answer-adjacency-target',19,d.responseAdjacencies);
    check(d.themeTriples<=2,'theme-triples-target',19,d.themeTriples);
   }
  }
  return d;
 }
 return {observe,finish};
}
function metadataFor(candidate){
 const exercises=live;
 const m=require(path.join(root,'quizz-prerequis.js'));
 assert.equal(m.schema,'QPJB_PREREQUIS_V1');assert.equal(Object.keys(m.byId).length,exercises.length);
 assert.equal(typeof candidate.eligibility,'function','Missing M2 diagnostic');
 for(const q of exercises){
  const x=m.byId[q.id];assert(x&&typeof x.concept==='string'&&x.concept.length&&[0,1,2,3].includes(x.stage)&&Number.isInteger(x.minSession)&&x.minSession>=0&&Array.isArray(x.requires),'Metadata '+q.id);
  for(const r of x.requires)assert(typeof r.concept==='string'&&Number.isInteger(r.minExposure)&&r.minExposure>=0,'Requirement '+q.id);
 }
 return m.byId;
}
function runTrajectory(api,profile,horizon,seed,meta){
 const catalogue=meta?live:exercises;
 const m=metrics(profile,horizon,meta,catalogue);
 return {summary:simulate(profile,horizon,seed,api,m.observe,catalogue),detail:m.finish()};
}
function compare(before,after){
 const a=before.summary,b=after.summary,d=after.detail,problems=d.violations.slice(),notes=[];
 const gate=(ok,code,detail)=>{if(!ok)problems.push({code,detail})};
 const note=(ok,code,detail)=>{if(!ok)notes.push({code,detail})};
 gate(b.uniqueFamilies>=a.uniqueFamilies*.95,'family-retention',{before:a.uniqueFamilies,after:b.uniqueFamilies});
 if(b.horizon>=65){
  const missing=Object.keys(base.INTRO).filter(t=>d.firstTheme[t]===undefined);
  gate(!missing.some(t=>d.eligibleThemeSince[t]!==undefined&&d.eligibleThemeSince[t]+4<=b.horizon),'coverage-eligible-themes',missing);
  note(!missing.length,'coverage-not-yet-eligible',missing);
 }
 if(['echecs','aides'].includes(b.profile)){
  gate(b.hardShare<=a.hardShare+.01,'weak-hard-regression',{before:a.hardShare,after:b.hardShare});
  note(d.weakAdvanced<=before.detail.weakAdvanced,'advanced-while-weak',{before:before.detail.weakAdvanced,after:d.weakAdvanced});
 }
 for(const theme of foundations)note((d.maxGap[theme]||0)<=6,'foundation-gap',{theme,gap:d.maxGap[theme]});
 for(const key of ['uniqueContexts','uniqueDecisions'])note(b[key]>=a[key]*.95,key,{before:a[key],after:b[key]});
 note(b.weakDueDistinctEverRecalledShare===null||a.weakDueDistinctEverRecalledShare===null||b.weakDueDistinctEverRecalledShare>=a.weakDueDistinctEverRecalledShare-.05,'weak-recall-rate',{before:a.weakDueDistinctEverRecalledShare,after:b.weakDueDistinctEverRecalledShare});
 note(d.errorDelay.p90===null||before.detail.errorDelay.p90===null||d.errorDelay.p90<=before.detail.errorDelay.p90+2,'error-return-delay',{before:before.detail.errorDelay,after:d.errorDelay});
 return {problems,notes};
}
// Use the exact historical decks as a controlled fixture to exercise the
// candidate's state machinery without constraining its new selection algorithm.
function stateSemantics(candidate){
 const historic=base.empty();
 const project=state=>{
  const x=clone(state);
  for(const entry of x.journal||[]){
   assert.equal(new Date(entry.recordedAt).toISOString(),entry.recordedAt);
   entry.recordedAt='CLOCK';
  }
  return Object.fromEntries(['version','completed','entries','skills','micros','axes','journal','active'].map(k=>[k,x[k]]));
 };
 for(let s=0;s<6;s++){
  const deck=base.start(historic,exercises),tested=candidate.load(JSON.stringify(historic));
  assert.deepEqual(tested.active,historic.active);
  for(let i=0;i<deck.length;i++){
   const result=s<3?'correct':s===3?'wrong':i%3===0?'skipped':'correct';
   const assisted=s>=4&&i%3===1,freeError=s===5&&i%3===2;
   assert(base.record(historic,deck[i],result,i,null,assisted,freeError));
   assert(candidate.record(tested,deck[i],result,i,null,assisted,freeError));
  }
  assert(base.finish(historic,exercises));assert(candidate.finish(tested,exercises));
  assert.deepEqual(project(tested),project(historic),'Record/finish state semantics, historical fixture '+(s+1));
 }
}
function compatibility(candidate){
 stateSemantics(candidate);
 const exercises=live,byId=new Map(exercises.map(q=>[q.id,q]));
 // No fallback can admit an advanced real case with unmet prerequisites.
 const gated=advanced.map(id=>byId.get(id));
 assert(gated.every(Boolean),'Named regression cases absent');
 const empty=candidate.empty();
 for(const q of gated)assert.equal(candidate.eligibility(q,empty,exercises).eligible,false,'Premature advanced case '+q.id);
 const pool=gated;
 try{
  const chosen=candidate.select(pool,empty,10);
  assert.equal(chosen.length,0,'Fallback admitted advanced real QCM');
 }catch(err){
  // Only explicit eligibility/pool errors may stand for an empty deck.
  assert(!('actual' in err),'Fallback admitted advanced real QCM');
  assert.match(String(err.message),/pr[eé]requis|[ée]ligib|catalog|pool|disponib|admissib/i);
 }
 // A real-looking unknown ID must not silently receive fabricated eligibility.
 const unknown={...gated[0],id:'SEF-M3-UNKNOWN-PRODUCTION-ID'};
 let diagnostic;
 try{diagnostic=candidate.eligibility(unknown,empty,[...exercises,unknown])}
 catch(err){assert.match(String(err.message),/metadata|m[ée]tadonn[ée]e|pr[eé]requis|catalog|unknown|missing|inconnu|absent/i)}
 if(diagnostic!==undefined)assert.equal(diagnostic.eligible,false,'Unknown real ID admitted');
 const legacy=base.empty(),deck=base.start(legacy,H.catalogue().exercises);
 assert(base.record(legacy,deck[0],'wrong',0,null,false,false));legacy.active.index=1;
 const loaded=candidate.load(JSON.stringify(legacy));
 assert.deepEqual(loaded.active,legacy.active,'exact legacy active');
 assert.deepEqual(candidate.importProgress(JSON.stringify(candidate.exportProgress(loaded,exercises,{}))).active,loaded.active,'exact active export/import');
 assert.deepEqual(candidate.start(loaded,exercises).map(q=>q.id),legacy.active.ids);
 for(let i=1;i<10;i++)assert(candidate.record(loaded,deck[i],'correct',i,null,false,false));
 assert(candidate.finish(loaded,exercises));assert.equal(loaded.completed,1);
 const state=candidate.empty();
 for(let s=0;s<20;s++){
  const cards=candidate.start(state,exercises);
  cards.forEach((q,i)=>assert(candidate.record(state,q,pass(q)?'wrong':'correct',i,null,false,false)));
  assert(candidate.finish(state,exercises));
  if(!candidate.consolidationPlan(state,exercises).available)continue;
  const before=clone(state),focus=candidate.startConsolidation(state,exercises);
  assert(focus.length>=4&&focus.length<=10);assert.equal(new Set(focus.map(family)).size,focus.length);
  for(const q of focus)assert(candidate.eligibility(q,before,exercises).eligible,'consolidation prerequisite '+q.id);
  assert.deepEqual(candidate.load(JSON.stringify(state)).active,state.active);
  focus.forEach((q,i)=>assert(candidate.record(state,q,'wrong',i,null,false,false)));
  assert(candidate.finish(state,exercises));assert.equal(state.completed,before.completed);
  for(const k of ['skills','micros','axes'])assert.deepEqual(state[k],before[k],'consolidation '+k);
  return {consolidationAt:s+1,consolidationLength:focus.length};
 }
 throw Error('No targeted consolidation in 20 sessions with repeated specific weakness');
}
function selftest(){
 const m=metrics('autonome',20),chosen=exercises.filter(q=>q.theme==='ouv'&&!pass(q)).slice(0,10);
 m.observe({phase:'deck',s:0,state:base.empty(),chosen,selection:chosen.map(q=>({id:q.id,kind:'nouveau',reason:'nouveau_qcm'})),api:base});
 assert(m.finish().violations.some(v=>v.code==='S1-passes'));
 const fake={summary:{uniqueFamilies:100,horizon:20,profile:'autonome',uniqueContexts:20,uniqueDecisions:20,weakDueDistinctEverRecalledShare:null},detail:{violations:[],maxGap:{},errorDelay:{p90:null}}};
 assert(compare(fake,{...fake,summary:{...fake.summary,uniqueFamilies:94}}).problems.some(v=>v.code==='family-retention'));
 assert(!compare(fake,{...fake,summary:{...fake.summary,uniqueFamilies:95}}).problems.length);
 // Sensitivity: a diagnostic erroneously saying yes cannot mask independent
 // unmet metadata prerequisites; a diagnostic saying no also fails the test.
 const md=Object.fromEntries(exercises.map(q=>[q.id,{concept:q.id,stage:0,minSession:0,requires:[]}]));
 md[chosen[0].id].requires=[{concept:'not-seen-fixture',minExposure:1}];
 const guarded=metrics('modere',20,md);
 guarded.observe({phase:'deck',s:0,state:base.empty(),chosen,selection:chosen.map(q=>({id:q.id,kind:'nouveau',reason:'nouveau_qcm'})),api:{eligibility:q=>({eligible:q.id!==chosen[1].id,reasons:[]})}});
 const codes=guarded.finish().violations.map(x=>x.code);
 assert(codes.includes('independent-prerequisite'));assert(codes.includes('engine-eligibility'));
 assert.throws(()=>H.payload('<html/>'));
 console.log('PASS M3 harness: negative opening/family/corrupt payload, 95% boundary');
}
function main(){
 const args=process.argv.slice(2);
 if(args.includes('--selftest'))return selftest();
 assert(args.includes('--baseline')!==args.includes('--candidate'),'Choose --baseline or --candidate');
 const value=flag=>{const i=args.indexOf(flag);return i<0?null:args[i+1]};
 const requested=value('--profile');assert(!requested||[...profiles,'faiblesse_passe'].includes(requested));
 const selected=requested?[requested]:[...profiles,'faiblesse_passe'];
 const candidate=args.includes('--candidate')?require(path.join(root,'quizz-parcours.js')):null,meta=candidate?metadataFor(candidate):null;
 const results=[],baselineRows=[];
 for(const profile of selected){
  const pairs=profile==='faiblesse_passe'?[[20,29]]:horizons.flatMap(h=>seeds.map(s=>[h,s]));
  for(const [horizon,seed] of pairs){
   const before=runTrajectory(base,profile,horizon,seed,null);
   if(profile!=='faiblesse_passe')baselineRows.push(before.summary);
   const after=candidate?runTrajectory(candidate,profile,horizon,seed,meta):null;
   const comparison=after?compare(before,after):null;
   results.push({profile,horizon,seed,before,after,comparison});
   console.log('M3 '+profile+'/'+horizon+'/'+seed+' baseline '+before.summary.uniqueFamilies+' families; '+(after?'candidate '+after.summary.uniqueFamilies+' families; '+comparison.problems.length+' failures, '+comparison.notes.length+' notes':'candidate not run'));
   console.log('M3_BASELINE '+JSON.stringify({profile,horizon,seed,passes:before.detail.first20.slice(0,3).map(x=>x.passes),firstBids:before.detail.first20[0].bids,adj:before.detail.responseAdjacencies,triples:before.detail.themeTriples,sa:before.detail.firstTheme.sa??null,foundations:Object.fromEntries(foundations.map(t=>[t,before.detail.maxGap[t]??null])),families:before.summary.uniqueFamilies,themes:before.summary.uniqueThemes}));
  }
 }
 if(baselineRows.length)G.verify(baselineRows,G.golden.filter(row=>selected.includes(row[0])));
 const out={reference:{commit:H.base,engineBlob:H.engineBlob,quizBlob:H.quizBlob},mode:candidate?'candidate':'baseline',results,compatibility:null};
 const output=value('--out')||path.join(root,'artifacts','progression-guidee',requested||'all')+'.json';
 fs.mkdirSync(path.dirname(output),{recursive:true});
 if(candidate&&selected.includes('faiblesse_passe'))try{out.compatibility=compatibility(candidate)}catch(e){out.compatibility={error:e.stack};process.exitCode=1}
 fs.writeFileSync(output,JSON.stringify(out,null,2)+'\n');
 const fail=results.reduce((n,r)=>n+(r.comparison?.problems.length||0),0);
 console.log('M3 report '+output+' : '+results.length+' trajectories, '+fail+' candidate failures');
 if(fail)process.exitCode=1;
}
if(require.main===module)main();
module.exports={metrics,compare,runTrajectory,selftest};
