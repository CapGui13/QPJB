'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const B=require('./optimisation-seances-benchmark.cjs'),root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const hist=p=>execFileSync('git',['show',B.BASE+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const data=h=>JSON.parse(h.split('<script id="training-data" type="application/json">')[1].split('</script>')[0]);
const current=data(read('quizz.html')),old=data(hist('quizz.html'));
assert.deepEqual(current,old,'Catalogue exact');assert.equal(current.exercises.length,1879);
assert.equal(read('quizz-prerequis.js'),hist('quizz-prerequis.js'),'Prerequisites unchanged');
const meta=require('../quizz-prerequis.js'),plan=require('../quizz-session-plan.js');
const base=B.makeEngine(hist('quizz-parcours.js'),meta);
// Référence indépendante du visa pédagogique du 26/11 : seuls ces sept
// soutiens simples à trois atouts peuvent introduire le concept de fit.
// La référence historique garde les prérequis d'origine.
const candidateMeta={...meta,byId:{...meta.byId}};
const introFitIds=['SEF-028-2','SEF-028-1','SEF-N048-3','SEF-N048-1','SEF-N053-2','SEF-N053-1','SEF-C-006'];
for(const id of introFitIds){
 const q=current.exercises.find(q=>q.id===id),m=meta.byId[id];
 assert.ok(q&&m,'Cas introductif connu '+id);
 const opening=String(q.auction?.[0]||'').replace(/[\s\uFE0E\uFE0F]/g,'');
 const answer=String(q.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
 assert.ok(q.theme==='majeur'&&q.auction.length===1&&/^1[♥♠]$/.test(opening)&&answer==='2'+opening[1]&&q.shape[opening==='1♠'?0:1]===3&&q.difficulty<=2,'Fit 5-3 simple '+id);
 assert.equal(m.concept,'majeur.soutien',id);
 assert.equal(m.minSession,1,id);
 candidateMeta.byId[id]={...m,stage:0,requires:m.requires.filter(r=>r.concept!=='majeur.soutien')};
}

const source=read('quizz-parcours.js'),marker='return {eligibility,adaptiveDiagnostics,createForTests:';
assert.equal(source.split(marker).length,2);
const m={exports:{}};
new Function('module','require',source.replace(marker,'return {eligibilityBatch:(deck,state,exercises)=>{const e=evidence(state,exercises);return deck.map(q=>evaluate(q,state,e))},eligibility,adaptiveDiagnostics,createForTests:'))(m,name=>{
 if(name==='./quizz-prerequis.js')return meta;if(name==='./quizz-session-plan.js')return plan;throw Error(name);
});
const candidate=m.exports,actual=require('../quizz-parcours.js');
assert.deepEqual(actual.select(current.exercises,actual.empty()),candidate.select(current.exercises,candidate.empty()),'Uninstrumented first deck');
assert.equal(typeof actual.adaptiveDiagnostics,'function');
const profiles=B.PROFILES.filter(p=>!process.argv[2]||p===process.argv[2]),seeds=B.SEEDS.filter(s=>!process.argv[3]||s===Number(process.argv[3]));
assert(profiles.length&&seeds.length,'Unknown profile/seed');
let failures=[];
for(const profile of profiles)for(const seed of seeds){
 const before=B.run(base,current.exercises,meta,profile,seed),after=B.run(candidate,current.exercises,candidateMeta,profile,seed);
 console.log(JSON.stringify({profile,seed,before,after}));
 for(let i=0;i<before.length;i++){
  const a=before[i],b=after[i],tag=profile+'/'+seed+'/S'+b.horizon;
  const check=(ok,reason)=>{if(!ok)failures.push(tag+': '+reason)};
  check(a.violations===0&&b.violations===0,'eligibility');
  check(b.families>=.95*a.families,'family retention <95%');
  check(b.gf<=6,'foundational gap >6');
  check(b.go<=10,'nonfoundational gap >10');
  check(Object.keys(b.first).length>=Object.keys(a.first).length,'rubric coverage');
  check(b.concepts>=a.concepts-2,'concept coverage regression');
  check(b.adj<=Math.max(2,a.adj)&&b.triple<=Math.max(2,a.triple),'presentation');
  if(i===0){check(Object.keys(b.first).length>=14&&b.first.sa>=4&&b.first.sa<=8&&b.first.red===5&&b.first.stayman===8,'early progression');}
  else check(Object.keys(b.first).length===22,'22 rubrics');
  if(['faible','aide'].includes(profile)){
   check(i!==0||b.hard===0,'early advanced difficulty');
   check(b.hard<=a.hard+Math.ceil(b.horizon*10*.02),'advanced difficulty +2 points');
  }
  check(b.pending<=a.pending+Math.max(20,Math.ceil(a.pending*.10)),'pending errors increase');
  if(a.medianDelay!==null&&b.medianDelay!==null)check(b.medianDelay<=a.medianDelay+8,'median exact-ID delay +8 sessions');
  if(a.p90Delay!==null&&b.p90Delay!==null)check(b.p90Delay<=a.p90Delay*2+10,'p90 exact-ID delay');
 }
}
assert.deepEqual(failures,[],'Combined acceptance failures');console.log('PASS combined acceptance '+profiles.length*seeds.length+' pairs');
