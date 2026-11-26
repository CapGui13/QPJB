'use strict';
// Recette intégrée : comparaison de la base réellement publiée et du moteur
// réunissant M1–M4. Une réponse dépend de l'ID, séance, profil et graine,
// jamais de la position de la question dans le paquet.
const BASE='2c6edd95c09a4e8073813f01bc976c31ed4649aa';
const PROFILES=['autonome','intermediaire','faible','cible','aide','passe'];
const SEEDS=[11,47,103], HORIZONS=[20,65,153,180];
const CORE=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
const ok=(v,m)=>{if(!v)throw Error(m)};
const same=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),m);
const bid=q=>String(q.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
const family=q=>String(q.caseFamily||q.id);
const openingPass=q=>q.theme==='ouv'&&bid(q)==='Passe';
const opener=q=>String(q.auction?.[0]||'').match(/:\s*(1[♣♦♥♠])/)?.[1]||'';
const minorReply=q=>q.theme==='mineur'&&q.auction?.length===1&&/^1[♣♦]$/.test(opener(q));
const fit=q=>q.theme==='majeur'&&q.auction?.length===1&&/^1[♥♠]$/.test(opener(q))&&bid(q)==='2'+opener(q)[1];
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h/4294967296};
function compile(source,req){const m={exports:{}};new Function('module','require',source)(m,req);return m.exports}
function instrument(source,meta,plan,candidate){
 const anchor='return {eligibility,adaptiveDiagnostics,createForTests:';
 ok(source.split(anchor).length===2,'Exact diagnostic marker');
 return compile(source.replace(anchor,
   'return {eligibilityBatch:(deck,state,exercises)=>{const e=evidence(state,exercises);return deck.map(q=>evaluate(q,state,e))},'+
   (candidate?'decisionPatternForTest:decisionPattern,':'')+'eligibility,adaptiveDiagnostics,createForTests:'),
   n=>{if(n==='./quizz-prerequis.js')return meta;if(n==='./quizz-session-plan.js')return plan;throw Error(n)});
}
function outcome(profile,seed,q,s){
 const u=hash(q.id+'|'+s+'|'+seed),v=hash('a|'+q.id+'|'+s+'|'+seed);
 const probability=profile==='autonome'?0:profile==='intermediaire'?.33:
 profile==='faible'?.75:profile==='cible'?(['intervenir','contre','apres_inter','reponse_inter','barrage','reveil','multilandy','michaels','rubensohl'].includes(q.theme)?.8:.12):
 profile==='passe'?(openingPass(q)?.9:.1):.15;
 return {wrong:u<probability,help:profile==='aide'&&v<.6};
}
function verifyEarly(deck,s,candidate){
 const pp=deck.flatMap((q,i)=>openingPass(q)?[i]:[]);
 if(s===0){
   ok(deck.every(q=>q.theme==='ouv'&&q.difficulty===1),'S1 fundamental');
   ok(pp.length===3&&pp.every((v,i)=>v<=[1,4,6][i]&&(!i||v-pp[i-1]>=2)&&deck[v].h<12),'S1 passes');
   for(const [a,n] of [['1♣',2],['1♦',2],['1♥',1],['1♠',1],['1SA',1]])ok(deck.filter(q=>bid(q)===a).length>=n,'S1 '+a);
 }
 if(s===1){
   ok(pp.length>=1&&pp.length<=2&&pp.every((v,i)=>v<=[3,6][i]&&(!i||v-pp[i-1]>=2)),'S2 passes');
   ok(deck.slice(0,2).every(q=>q.theme==='ouv'&&!openingPass(q)),'S2 openings');
   const supports=deck.flatMap((q,i)=>fit(q)?[i]:[]);
   ok(supports.length>=2&&supports.every(i=>deck[i].shape[bid(deck[i])==='2♠'?0:1]===3),'S2 fit 5-3');
   if(candidate){
     const ties=deck.filter(q=>q.theme==='ouv'&&q.shape?.[2]===q.shape?.[3]&&[3,4].includes(q.shape[2]));
     ok(ties.some(q=>q.shape[2]===3&&bid(q)==='1♣')&&ties.some(q=>q.shape[2]===4&&bid(q)==='1♦'),'S2 meilleure mineure');
     ok(supports.every((v,i)=>!i||v-supports[i-1]>1),'S2 supports séparés');
     const prior=deck.slice(0,supports[0]);
     ok(prior.some(q=>minorReply(q)&&bid(q)==='1SA')&&prior.some(q=>minorReply(q)&&/^1[♥♠]$/.test(bid(q))),'S2 premières réponses avant fit');
   }
 }
 if(s===2)ok(pp.length<=1,'S3 passe');
 if(s>2)ok(pp.length<=2,'Later opening passe');
}
function run(api,peer,meta,qs,pattern,profile,seed,horizon,candidate){
 const state=api.empty(),families=new Set(),ids=new Set(),concepts=new Set(),topics=new Set();
 const proof=new Map(),last=new Map(),first=new Map(),pending=new Map(),delays=[];
 let invalid=0,short=0,duplicates=0,exact=0,triples=0,mirror1=0,mirror2=0,abab=0,hard=0,coreDebt=0,conceptDebt=0,contrast=0,assisted=0,wrongCount=0;
 const results=[],begin=Date.now();
 for(let s=0;s<horizon;s++){
   const deck=api.start(state,qs),selection=state.active.selection;
   if(deck.length!==10)short++;
   if(new Set(deck.map(q=>q.id)).size!==deck.length||new Set(deck.map(family)).size!==deck.length)duplicates++;
   same(selection.map(x=>x.id),deck.map(q=>q.id),'Selection/ID alignment');
   invalid+=api.eligibilityBatch(deck,state,qs).filter(v=>!v.eligible).length;
   verifyEarly(deck,s,candidate);
   for(const [key,at] of last){
     if(CORE.has(key)&&s-at>8)coreDebt++;
     if(s-at>20)conceptDebt++;
   }
   const patterns=deck.map(pattern),sessionConcepts=new Set(deck.map(q=>meta.byId[q.id].concept));
   if([['chelem.quantitatif','chelem.controles','chelem.cles'],['rubensohl.naturel','rubensohl.init'],['forcing.troisieme','forcing.quatrieme','red.base'],['multilandy.choix','multilandy.intervention','intervenir.base'],['michaels.choix','michaels.intervention','intervenir.base']].some(group=>group.filter(c=>sessionConcepts.has(c)).length>=2))contrast++;
   for(let i=0;i<deck.length;i++){
     const q=deck[i],m=meta.byId[q.id],k=m.concept;
     families.add(family(q));ids.add(q.id);concepts.add(k);topics.add(q.theme);last.set(k,s);if(!first.has(q.theme))first.set(q.theme,s+1);
     if(i&&bid(q)===bid(deck[i-1]))exact++;
     if(s&&i>1&&q.theme===deck[i-1].theme&&q.theme===deck[i-2].theme)triples++;
     if(i&&patterns[i]&&patterns[i]===patterns[i-1])mirror1++;
     if(i>1&&patterns[i]&&patterns[i]===patterns[i-2])mirror2++;
     if(s&&i>2&&q.theme===deck[i-2].theme&&deck[i-1].theme===deck[i-3].theme&&q.theme!==deck[i-1].theme)abab++;
     hard+=+(q.difficulty>=4);
     if(pending.has(q.id)){delays.push(s-pending.get(q.id));pending.delete(q.id)}
     const {wrong,help}=outcome(profile,seed,q,s);assisted+=+help;wrongCount+=+wrong;
     if(wrong||help)pending.set(q.id,s);
     if(!wrong&&!help){
       if(!proof.has(k))proof.set(k,{families:new Set(),sessions:new Set()});
       proof.get(k).families.add(family(q));proof.get(k).sessions.add(s);
     }
     ok(api.record(state,q,wrong?'wrong':'correct',i,null,help,false),'Record');
     if(i===0&&[0,19,20,64,65,152].includes(s)){
       for(const receiver of [api,peer]){
         const restored=receiver.load(JSON.stringify(state));
         same(restored.active,state.active,'Active session intact across versions');
         same(receiver.start(restored,qs).map(v=>v.id),deck.map(v=>v.id),'Exact resumed IDs');
       }
     }
   }
   ok(api.finish(state,qs),'Finish');
   if(HORIZONS.includes(s+1)){
     const proofConcepts=[...proof.values()].filter(v=>v.families.size>=2&&v.sessions.size>=2).length;
     const sorted=delays.slice().sort((a,b)=>a-b);
     results.push({session:s+1,families:families.size,ids:ids.size,concepts:concepts.size,topics:topics.size,
       proofConcepts,hard,coreDebt,conceptDebt,invalid,short,duplicates,exact,triples,mirror1,mirror2,abab,contrast,
       pending:pending.size,medianRecall:sorted.length?sorted[Math.floor((sorted.length-1)/2)]:null,
       assisted,wrongCount,first:Object.fromEntries(first),ms:Date.now()-begin});
   }
 }
 return results;
}
function compare({oldSource,liveSource,oldMeta,liveMeta,oldPlan,livePlan,qs},profile,seed,horizon=153){
 ok(PROFILES.includes(profile)&&SEEDS.includes(seed)&&HORIZONS.includes(horizon),'Invalid profile, seed or horizon');
 ok(qs.length===1879,'Catalogue size');
 ok(livePlan.pedagogyReady,'Production policies not wired');
 const a=instrument(oldSource,oldMeta,oldPlan,false),b=instrument(liveSource,liveMeta,livePlan,true);
 const pattern=q=>b.decisionPatternForTest(q);
 const before=run(a,b,oldMeta,qs,pattern,profile,seed,horizon,false),after=run(b,a,liveMeta,qs,pattern,profile,seed,horizon,true);
 const review=[];
 for(let i=0;i<before.length;i++){
   const x=before[i],y=after[i],at=y.session;
   ok(y.invalid===0&&y.short===0&&y.duplicates===0,'Eligibility/size/families S'+at);
   ok(y.families>=.95*x.families,'Family coverage S'+at);
   ok(y.topics>=x.topics,'Theme coverage S'+at);
   if(at===20)ok(y.first.sa>=4&&y.first.sa<=8,'Early SA');
   if(at>=65&&x.proofConcepts-y.proofConcepts>Math.max(3,.1*x.proofConcepts))review.push('S'+at+': autonomous proof coverage '+x.proofConcepts+' -> '+y.proofConcepts);
   if(at>=65&&x.concepts-y.concepts>2)review.push('S'+at+': concept coverage '+x.concepts+' -> '+y.concepts);
   if(y.coreDebt>x.coreDebt&&y.coreDebt-x.coreDebt>Math.max(10,.15*x.coreDebt))review.push('S'+at+': foundational debt '+x.coreDebt+' -> '+y.coreDebt);
   if(y.exact>x.exact+2||y.triples>x.triples+2||y.mirror1+y.mirror2>x.mirror1+x.mirror2+2)review.push('S'+at+': order regression');
 }
 return {profile,seed,horizon,before,after,review};
}
module.exports={BASE,PROFILES,SEEDS,HORIZONS,compile,instrument,compare};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
 const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
 const old=p=>execFileSync('git',['show',BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
 const data=h=>h.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
 const text=data(read('quizz.html'));same(text,data(old('quizz.html')),'Embedded catalogue byte-identical');
 const oldMeta=compile(old('quizz-prerequis.js')),liveMeta=require('../quizz-prerequis.js');
 const expected=JSON.parse(JSON.stringify(oldMeta));expected.byId['SEF-020-3'].concept='mineur.base';
 same(liveMeta,expected,'Only approved concept correction');
 const input={oldSource:old('quizz-parcours.js'),liveSource:read('quizz-parcours.js'),oldMeta,liveMeta,
   oldPlan:compile(old('quizz-session-plan.js')),livePlan:require('../quizz-session-plan.js'),qs:JSON.parse(text).exercises};
 const profile=process.argv[2]||'autonome',seed=Number(process.argv[3]||47),horizon=Number(process.argv[4]||153);
 const result=compare(input,profile,seed,horizon);
 console.log(JSON.stringify(result,null,2));
 if(result.review.length){console.error('Pedagogical trade-offs requiring coordinator review:',result.review);process.exitCode=2;}
}
