'use strict';
// Recompute the trace-derived metrics of #385 without lowering its thresholds.
// No timing/eligibility claim: traces cannot reconstruct actual selection latency.
const CORE=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
const HORIZONS=[5,20,65,153,180];
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h/4294967296};
const bid=q=>String(q.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
const family=q=>String(q.caseFamily||q.id);
const openingPass=q=>q.theme==='ouv'&&bid(q)==='Passe';
const opener=q=>String(q.auction?.[0]||'').match(/:\s*(1[♣♦♥♠])/)?.[1]||'';
const minorReply=q=>q.theme==='mineur'&&q.auction?.length===1&&/^1[♣♦]$/.test(opener(q));
const fit=q=>q.theme==='majeur'&&q.auction?.length===1&&/^1[♥♠]$/.test(opener(q))&&bid(q)==='2'+opener(q)[1];
function early(deck,s){
 const errors=[],ok=(v,m)=>{if(!v)errors.push(m)},pp=deck.flatMap((q,i)=>openingPass(q)?[i]:[]);
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
  const ties=deck.filter(q=>q.theme==='ouv'&&q.shape?.[2]===q.shape?.[3]&&[3,4].includes(q.shape[2]));
  ok(ties.some(q=>q.shape[2]===3&&bid(q)==='1♣')&&ties.some(q=>q.shape[2]===4&&bid(q)==='1♦'),'S2 meilleure mineure');
  ok(supports.every((v,i)=>!i||v-supports[i-1]>1),'S2 supports séparés');
  const prior=deck.slice(0,supports[0]);
  ok(prior.some(q=>minorReply(q)&&bid(q)==='1SA')&&prior.some(q=>minorReply(q)&&/^1[♥♠]$/.test(bid(q))),'S2 premières réponses avant fit');
 }
 if(s===2)ok(pp.length<=1,'S3 passe');
 if(s>2)ok(pp.length<=2,'Later opening passe');
 return errors;
}
function outcome(profile,seed,q,s){
 const u=hash(q.id+'|'+s+'|'+seed),v=hash('a|'+q.id+'|'+s+'|'+seed);
 const p=profile==='autonome'?0:profile==='intermediaire'?.33:profile==='faible'?.75:profile==='cible'?(['intervenir','contre','apres_inter','reponse_inter','barrage','reveil','multilandy','michaels','rubensohl'].includes(q.theme)?.8:.12):profile==='passe'?(openingPass(q)?.9:.1):.15;
 return {wrong:u<p,help:profile==='aide'&&v<.6};
}
function measure(t,by,meta){
 const ids=new Set(),families=new Set(),concepts=new Set(),topics=new Set(),proof=new Map(),last=new Map(),pending=new Map(),delays=[],first={},guards=[],checkpoints=[];
 let coreDebt=0,conceptDebt=0,hard=0,exact=0,triples=0,wrongCount=0,assisted=0,short=0,duplicates=0;
 for(let s=0;s<t.trace.length;s++){
  const deck=t.trace[s].map(id=>{const q=by.get(id);if(!q)throw Error('Unknown '+id);return q});
  if(deck.length!==10)short++;
  if(new Set(deck.map(q=>q.id)).size!==deck.length||new Set(deck.map(family)).size!==deck.length)duplicates++;
  for(const e of early(deck,s))guards.push({session:s+1,reason:e});
  for(const [k,at] of last){if(CORE.has(k)&&s-at>8)coreDebt++;if(s-at>20)conceptDebt++;}
  for(let i=0;i<deck.length;i++){
   const q=deck[i],k=meta[q.id].concept;
   ids.add(q.id);families.add(family(q));concepts.add(k);topics.add(q.theme);last.set(k,s);first[q.theme]??=s+1;
   if(i&&bid(q)===bid(deck[i-1]))exact++;
   if(s&&i>1&&q.theme===deck[i-1].theme&&q.theme===deck[i-2].theme)triples++;
   hard+=+(q.difficulty>=4);
   if(pending.has(q.id)){delays.push(s-pending.get(q.id));pending.delete(q.id)}
   const {wrong,help}=outcome(t.profile,t.seed,q,s);wrongCount+=+wrong;assisted+=+help;
   if(wrong||help)pending.set(q.id,s);
   if(!wrong&&!help){if(!proof.has(k))proof.set(k,{families:new Set(),sessions:new Set()});proof.get(k).families.add(family(q));proof.get(k).sessions.add(s)}
  }
  if(HORIZONS.includes(s+1)){
   const sorted=delays.slice().sort((a,b)=>a-b);
   checkpoints.push({session:s+1,ids:ids.size,families:families.size,concepts:concepts.size,topics:topics.size,proofConcepts:[...proof.values()].filter(v=>v.families.size>=2&&v.sessions.size>=2).length,hard,coreDebt,conceptDebt,exact,triples,wrongCount,assisted,pending:pending.size,medianRecall:sorted.length?sorted[Math.floor((sorted.length-1)/2)]:null,firstSA:first.sa??null,short,duplicates});
  }
 }
 return {group:t.group,profile:t.profile,seed:t.seed,guards,checkpoints};
}
function run(archives,exercises,meta){
 const by=new Map(exercises.map(q=>[q.id,q])),trajectories=archives.flatMap(a=>a.trajectories).map(t=>measure(t,by,meta));
 if(trajectories.length!==36)throw Error('36 trajectories expected');
 const pairs=trajectories.filter(a=>a.group==='none').map(a=>{
  const b=trajectories.find(t=>t.group==='texas'&&t.profile===a.profile&&t.seed===a.seed);
  if(!b)throw Error('Missing matched candidate');
  const alerts=[];
  for(let i=0;i<a.checkpoints.length;i++){
   const x=a.checkpoints[i],y=b.checkpoints[i],at=y.session,flag=(v,k)=>{if(v)alerts.push({session:at,metric:k,before:x[k],after:y[k]})};
   flag(y.families<.95*x.families,'families');flag(y.topics<x.topics,'topics');
   if(at===20)flag(y.firstSA<4||y.firstSA>8,'firstSA');
   flag(at>=65&&x.proofConcepts-y.proofConcepts>Math.max(3,.1*x.proofConcepts),'proofConcepts');
   flag(at>=65&&x.concepts-y.concepts>2,'concepts');
   flag(y.coreDebt-x.coreDebt>Math.max(10,.15*x.coreDebt),'coreDebt');
   flag(y.exact>x.exact+2,'exact');flag(y.triples>x.triples+2,'triples');
  }
  return {profile:a.profile,seed:a.seed,baselineGuards:a.guards,candidateGuards:b.guards,alerts,before:a.checkpoints,after:b.checkpoints};
 });
 return {pairs,scope:'Recomputed historical #385 trace-derived criteria; excludes mirror pattern, actual eligibility, resume, latency, #409 model-specific tests. S5 displayed as additional checkpoint; same thresholds applied. No human learning claim.'};
}
module.exports={run};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),root=path.resolve(__dirname,'..'),base='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
 const get=p=>cp.execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
 const m={exports:{}};new Function('module',get('quizz-prerequis.js'))(m);
 const ex=JSON.parse(get('quizz.html').split('<script id="training-data" type="application/json">')[1].split('</script>')[0]).exercises;
 const dir=path.join(root,'audits/coherence-concrete-20261126/m3');
 const archives=['benchmark-s180-seed11.json','benchmark-s180-pilot.json','benchmark-s180-seed103.json'].map(n=>JSON.parse(fs.readFileSync(path.join(dir,n),'utf8')));
 console.log(JSON.stringify(run(archives,ex,m.exports.byId)));
}
