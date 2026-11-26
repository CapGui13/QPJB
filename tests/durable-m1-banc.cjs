'use strict';
// Injection mémoire, après les filtres de choose() et avant le tri. Le moteur
// reste strictement celui de #395; le témoin calcule les mêmes opportunités,
// sans appliquer le bonus. Aucun rappel explicite, créneau prioritaire ni S1–3.
const BASE='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
const PROFILES=['autonome','intermediaire','faible','cible','aide','passe'];
const EXTRA=['force','longueur','fit','forcing','convention','competition','recuperation'];
const SEEDS=[11,47,103], HORIZONS=[20,65,153,180];
const ok=(v,m)=>{if(!v)throw Error(m)};
const family=q=>String(q.caseFamily||q.id);
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h/4294967296};
function compile(source,req,extra={}){const m={exports:{}};new Function('module','require',...Object.keys(extra),source)(m,req,...Object.values(extra));return m.exports}
function instrument(source,meta,plan,A,P,enabled,trace,policy='original'){
 ok(['original','preserve-concept-level'].includes(policy),'policy');
 const anchor='    const s=state.completed,limit=clamp(int(n,10),1,20),e=evidence(state,exercises);';
 const rank='      const ranked=candidates.map(q=>({q,v:score(q,category)+(deltas.get(q.id)||0)}));';
 const chosen='      const q=ranked[0].q,m=mOf(q),cat=category||classify(q);';
 const protection=policy==='preserve-concept-level'?`const baseWinner=candidates.map(q=>({q,v:score(q,category)+(deltas.get(q.id)||0)})).sort((a,b)=>b.v-a.v||hash(a.q.id+'#'+s)-hash(b.q.id+'#'+s)||a.q.id.localeCompare(b.q.id))[0].q;`:'';
 const guard=policy==='preserve-concept-level'?'&&(s>=65||(mOf(q).concept===mOf(baseWinner).concept&&q.difficulty===baseWinner.difficulty))':'';
 const eligibility='return {eligibility,adaptiveDiagnostics,createForTests:';
 for(const key of [anchor,rank,chosen,eligibility])ok(source.split(key).length===2,'unique injection '+key);
 return compile(source.replace(anchor,anchor+'\n    const m1signals=s>=3?__A.analyze({history:state,exercises,diagnose:__P.diagnose}):null;')
 .replace(rank,'      const m1rank=s>=3&&!explicitRecall&&!priority?new Map(__A.rank({history:state,exercises,candidates,selected,signals:m1signals,category}).map(x=>[x.id,x])):new Map();\n      '+protection+'\n      const ranked=candidates.map(q=>({q,v:score(q,category)+(deltas.get(q.id)||0)+(__enabled'+guard+'?(m1rank.get(q.id)?.delta||0):0)}));')
 .replace(chosen,chosen+'\n      if(m1rank.size)__trace.push({session:s+1,eligible:m1rank.size,chosen:q.id,target:m1rank.get(q.id)||null,category});')
 .replace(eligibility,'return {eligibilityBatch:(deck,state,exercises)=>{const e=evidence(state,exercises);return deck.map(q=>evaluate(q,state,e))},eligibility,adaptiveDiagnostics,createForTests:'),
 n=>n==='./quizz-prerequis.js'?meta:n==='./quizz-session-plan.js'?plan:undefined,
 {__A:A,__P:P,__enabled:enabled,__trace:trace});
}
const targets={force:['force'],longueur:['distribution'],fit:['fit','priorite'],forcing:['forcing'],convention:['convention'],competition:['competition'],recuperation:['force','distribution']};
function outcome(profile,seed,q,s,options){
 const u=hash(q.id+'|'+s+'|'+seed),v=hash('a|'+q.id+'|'+s+'|'+seed),w=hash('c|'+q.id+'|'+s+'|'+seed);
 const targeted=targets[profile]?.length?options.filter(o=>o[1]==='hypothesis'&&o[3]!=='low'&&targets[profile].includes(o[2])):[];
 const probability=profile==='autonome'?0:profile==='intermediaire'?.33:profile==='faible'?.75:profile==='cible'?(['intervenir','contre','apres_inter','reponse_inter','barrage','reveil','multilandy','michaels','rubensohl'].includes(q.theme)?.8:.12):profile==='passe'?(q.theme==='ouv'&&q.answer==='Passe'?.9:.1):profile==='aide'?.15:targeted.length?(profile==='recuperation'&&s>=40?.07:.85):.08;
 const wrong=u<probability,assisted=profile==='aide'&&v<.6,choices=targeted.length?targeted.map(o=>o[0]):q.choices.filter(c=>c!==q.answer);
 return {result:wrong?'wrong':'correct',choice:wrong?choices[Math.floor(w*choices.length)]:q.answer,assisted,hadFreeError:false};
}
function run(input,profile,seed,horizon,enabled){
 const {source,meta,plan,A,P,qs,registry}=input,trace=[],api=instrument(source,meta,plan,A,P,enabled,trace,input.policy||'original');
 const state=api.empty(),families=new Set(),ids=new Set(),concepts=new Set(),topics=new Set(),proof=new Map(),early=[],last=new Map();
 let invalid=0,short=0,duplicates=0,passViolation=0,recall=0,wrong=0,assisted=0,difficulty=0,repeated=0,coreDebt=0,recovered=0,signalCount=0,allTrace=0,targeted=0,eligibleOffers=0;
 const results=[],start=Date.now();
 for(let s=0;s<horizon;s++){
  if(profile==='recuperation'&&s===25)api.adjustDifficulty(state,'harder');
  if(profile==='recuperation'&&s===45)api.adjustDifficulty(state,'easier');
  const deck=api.start(state,qs),selection=state.active.selection;
  if(s<3)early.push(deck.map(q=>q.id));
  if(deck.length!==10)short++;
  if(new Set(deck.map(q=>q.id)).size!==deck.length||new Set(deck.map(family)).size!==deck.length)duplicates++;
  invalid+=api.eligibilityBatch(deck,state,qs).filter(v=>!v.eligible).length;
  const pp=deck.filter(q=>q.theme==='ouv'&&q.answer==='Passe').length;if((s===0&&pp!==3)||(s===2&&pp>1)||(s>2&&pp>2))passViolation++;
  for(const [k,at] of last)if(k.startsWith('ouv.')&&s-at>8)coreDebt++;
  for(let i=0;i<deck.length;i++){
   const q=deck[i],m=meta.byId[q.id],k=m.concept;
   repeated+=+families.has(family(q));families.add(family(q));ids.add(q.id);concepts.add(k);topics.add(q.theme);last.set(k,s);
   recall+=+(selection[i].reason==='rappel_erreur_aide');
   const a=outcome(profile,seed,q,s,registry.get(q.id));wrong+=+(a.result==='wrong');assisted+=+a.assisted;difficulty+=q.difficulty;
   if(a.result==='correct'&&!a.assisted){if(!proof.has(k))proof.set(k,{f:new Set(),s:new Set()});proof.get(k).f.add(family(q));proof.get(k).s.add(s)}
   ok(api.record(state,q,a.result,i,a.choice,a.assisted,a.hadFreeError),'record');
   if(i===0&&[0,19,64,152].includes(s)){const restored=api.load(JSON.stringify(state));ok(JSON.stringify(api.start(restored,qs).map(v=>v.id))===JSON.stringify(deck.map(v=>v.id)),'active resume')}
  }
  ok(api.finish(state,qs),'finish');
  if(HORIZONS.includes(s+1)){
   const sig=A.analyze({history:state,exercises:qs,diagnose:P.diagnose});
   recovered=sig.signals.filter(x=>x.strength==='recovered').length;signalCount=sig.signals.filter(x=>['strong','recurrent'].includes(x.strength)).length;
   allTrace=trace.length;targeted=trace.filter(x=>x.target).length;eligibleOffers=trace.reduce((a,x)=>a+x.eligible,0);
   results.push({session:s+1,invalid,short,duplicates,passViolation,families:families.size,ids:ids.size,concepts:concepts.size,topics:topics.size,proof:[...proof.values()].filter(x=>x.f.size>=2&&x.s.size>=2).length,repeated,recall,wrong,assisted,difficulty,coreDebt,recovered,signalCount,eligibleOffers,allTrace,targeted,ms:Date.now()-start});
  }
 }
 return {results,early,trace:trace.filter(x=>x.target).slice(0,20)};
}
function compare(input,profile,seed,horizon=180){
 ok([...PROFILES,...EXTRA].includes(profile)&&SEEDS.includes(seed)&&HORIZONS.includes(horizon),'arguments');
 const before=run(input,profile,seed,horizon,false),after=run(input,profile,seed,horizon,true);
 ok(JSON.stringify(before.early)===JSON.stringify(after.early),'S1–3 exact');
 const hold=[];
 for(let i=0;i<before.results.length;i++){const a=before.results[i],b=after.results[i];ok(!b.invalid&&!b.short&&!b.duplicates&&!b.passViolation,'integrity');if(b.families<.95*a.families||b.topics<a.topics||b.concepts<a.concepts-2||b.proof<a.proof-Math.max(3,.1*a.proof))hold.push({session:b.session,reason:'exposure/proof regression',before:a,after:b});}
 return {profile,seed,horizon,policy:input.policy||'original',before,after,hold};
}
module.exports={BASE,PROFILES,EXTRA,SEEDS,HORIZONS,compile,instrument,compare};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process'),root=path.join(__dirname,'..');
 const old=p=>execFileSync('git',['show',BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
 const cache=new Map();
 function load(n){if(cache.has(n))return cache.get(n);const v=compile(old(n),x=>load(x.replace(/^\.\//,'')));cache.set(n,v);return v}
 const qs=JSON.parse(old('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
 const registry=new Map([0,1,2,3].flatMap(n=>require('../audits/apprentissage-durable-20261126/m1/registre-'+n+'.json')).map(r=>[r.id,r.options]));
 const input={source:old('quizz-parcours.js'),meta:load('quizz-prerequis.js'),plan:load('quizz-session-plan.js'),A:require('../quizz-durable-m1-adaptation.js'),P:load('quizz-professeur.js'),qs,registry,policy:process.argv[5]||'original'};
 console.log(JSON.stringify(compare(input,process.argv[2]||'intermediaire',Number(process.argv[3]||47),Number(process.argv[4]||180)),null,2));
}
