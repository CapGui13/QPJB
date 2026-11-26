const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const engine=require('../quizz-parcours.js');const api=require('../quizz-apprentissage-concepts.js');const qs=JSON.parse(fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const bench=function bench(engine,api,qs,configs,assert){
 const lookup=new Map(qs.map(x=>[x.id,x]));
 const hash=(s)=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0)/4294967296};
 const correct=(q,profile,n,seed)=>{let u=hash(q.id+":"+n+":"+seed);
  if(profile==="autonome")return {result:"correct",choice:q.answer,assisted:false,hadFreeError:false};
  const err=profile==="faible"?.65:profile==="cible"?(api.classify(q.id).concept==="majeur.soutien"?.85:.12):profile==="passe"?(q.answer==="Passe"?.9:.12):profile==="aide"?.12:.30;
  if(u<err)return {result:"wrong",choice:q.choices.find(x=>x!==q.answer),assisted:false,hadFreeError:false};
  return {result:"correct",choice:q.answer,assisted:profile==="aide"&&u<.75,hadFreeError:profile==="aide"&&u>=.75&&u<.85};
 };
 const output=[];
 for(const {profile,seed,horizon} of configs){
   const state=engine.empty(),seenConcepts=new Set(),families=new Set();let decisions=0,supported=0,neutral=0,unknown=0,initialTop=0,informativeTop=0,mutations=0,checks=0,maxMs=0,sumMs=0;const snapshots=[];
   for(let n=1;n<=horizon;n++){
     const deck=engine.start(state,qs);assert(deck.length===10,"deck "+profile+" "+n);
     const raw=JSON.stringify(state);const time=Date.now();const rec=api.recommend({history:state,candidates:deck});const elapsed=Date.now()-time;sumMs+=elapsed;maxMs=Math.max(maxMs,elapsed);
     if(JSON.stringify(state)!==raw)mutations++;
     assert(JSON.stringify(state)===raw,"read only "+profile+" "+n);assert(rec.candidates.length===deck.length&&rec.candidates.every(x=>deck.some(q=>q.id===x.id)),"candidate set");checks+=2;
     const originalTop=rec.candidates.find(x=>x.id===deck[0].id);initialTop+=originalTop.role!==null;informativeTop+=rec.candidates[0].role!==null;
     for(const q of deck){let m=api.classify(q.id);seenConcepts.add(m.concept);families.add(m.family);}
     supported+=rec.candidates.filter(x=>x.role!==null).length;neutral+=rec.candidates.filter(x=>x.delta===0).length;unknown+=rec.candidates.filter(x=>x.role===null).length;decisions+=deck.length;
     for(let i=0;i<deck.length;i++){let q=deck[i],a=correct(q,profile,n,seed);assert(engine.record(state,q,a.result,i,a.choice,a.assisted,a.hadFreeError),"record");}
     assert(engine.finish(state,qs),"finish");
     if([20,65,153,horizon].includes(n)){let statuses=api.recommend({history:state,candidates:[...seenConcepts].map(k=>api.describe(k).stages.review.ids[0])}).concepts;let levels={};for(const s of Object.values(statuses))levels[s.evidence]=(levels[s.evidence]||0)+1;
       assert(Object.values(statuses).every(s=>s.mastery==="not_established"),"no mastery");
       snapshots.push({session:n,concepts:seenConcepts.size,families:families.size,levels,stageMatches:supported,decisions,baselineFirstMatched:initialTop,rankedFirstMatched:informativeTop,neutral,unknown,mutations,maxMs,meanMs:Math.round(sumMs/n*100)/100});
     }
   }
   const loaded=engine.load(JSON.stringify(state));let candidates=engine.start(loaded,qs);let r1=api.recommend({history:loaded,candidates});let snapshot=JSON.stringify(loaded);let r2=api.recommend({history:loaded,candidates});assert(JSON.stringify(r1)===JSON.stringify(r2)&&snapshot===JSON.stringify(loaded),"save load deterministic");
   output.push({profile,seed,horizon,snapshots});
 }
 return output;
};
const configs=[{"profile":"autonome","seed":47,"horizon":20},{"profile":"intermediaire","seed":47,"horizon":20},{"profile":"faible","seed":47,"horizon":20},{"profile":"cible","seed":47,"horizon":20},{"profile":"aide","seed":47,"horizon":20},{"profile":"passe","seed":47,"horizon":20}];console.log(JSON.stringify(bench(engine,api,qs,configs,assert.ok),null,2));
