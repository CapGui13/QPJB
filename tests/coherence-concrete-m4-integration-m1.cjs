'use strict';
// Compatibility experiment: actual M1 V2/V6 files from independent frozen
// checkout. Compare M1-only vs M1+TP with D's identical response/metric rules.
// No global activation, no change to M1, no assertion that M1-only is native.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),cp=require('node:child_process');
const L=require('../quizz-coherence-m4p-d-lab.js'),features=require('../quizz-coherence-m4-diversite.js').features;
const native=require('./coherence-concrete-m4-campaign.cjs'),tp=require('./coherence-concrete-m4-integration-tp.cjs');
const root=path.join(__dirname,'..'),m1Root=path.resolve(process.env.M4_M1_ROOT||'m1-frozen');
const sha='6d2d2586a0b59e029c808df8424ab458cf3cd064';
const gitHead=dir=>cp.execFileSync('git',['rev-parse','HEAD'],{cwd:dir,encoding:'utf8'}).trim();
assert.equal(gitHead(m1Root),sha);
const blob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('quizz-parcours.js'),html=read('quizz.html'),meta=require('../quizz-prerequis.js').byId;
assert.equal(blob(source),L.ENGINE);assert.equal(blob(html),L.CATALOGUE);assert.equal(blob(read('quizz-prerequis.js')),'8e920bb9c925c7474bb04701f0f2fecac5288b91');
for(const p of ['quizz-parcours.js','quizz.html','quizz-prerequis.js'])assert.equal(blob(fs.readFileSync(path.join(m1Root,p),'utf8')),blob(read(p)),'M1 native base divergent');
const exercises=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
assert.equal(exercises.length,1915);
const requireBase=require('node:module').createRequire(path.join(root,'quizz-parcours.js')),m1Bench=require(path.join(m1Root,'tests/coherence-concrete-m1-bench.cjs'));
const [profile,seedArg]=process.argv.slice(2),seed=Number(seedArg);assert.ok(L.PROFILES.includes(profile)&&L.SEEDS.includes(seed));
const out=process.env.OUT||'/tmp/m4-m1';fs.mkdirSync(out,{recursive:true});
function nativeTrace(policy,withM4){
 const curriculum=require(path.join(m1Root,policy==='V2'?'quizz-coherence-m1-guarded.js':'quizz-coherence-m1-window.js'));
 const m1Events=[];
 const m1Source="const curriculum=require('__m1_curriculum'),observe=require('__m1_observe');\n"+m1Bench.sourceFor(source,true,false);
 const req=id=>id==='__m1_curriculum'?curriculum:id==='__m1_observe'?(event=>m1Events.push(event)):requireBase(id);
 const opts={source:m1Source,requireBase:req,exercises,meta,profile,seed,horizon:180,measure:()=>performance.now()};
 const arm=withM4?tp.runCandidate(opts):native.run(opts);
 arm.m1Events=m1Events;return arm;
}
function compare(before,after){
 const opts={catalogue:exercises,metadata:meta,features};
 const a=L.analyze(before,opts),b=L.analyze(after,opts),regressions=[];
 assert.equal(a.errors.length,0);assert.equal(b.errors.length,0);
 for(let i=0;i<a.checkpoints.length;i++){
  const u=a.checkpoints[i],v=b.checkpoints[i],h=u.session;
  for(const c of L.CORE){
   if((v.conceptDebt[c]||0)>(u.conceptDebt[c]||0))regressions.push({h,metric:'conceptDebt',concept:c,before:u.conceptDebt[c]||0,after:v.conceptDebt[c]||0});
   if(u.terminalGap[c]!==null&&(v.terminalGap[c]===null||v.terminalGap[c]>u.terminalGap[c]))regressions.push({h,metric:'terminalGap',concept:c,before:u.terminalGap[c],after:v.terminalGap[c]});
  }
  for(const c of u.proofConcepts)if(!v.proofConcepts.includes(c))regressions.push({h,metric:'proofConceptLost',concept:c});
 }
 return {profile,seed,before:a.checkpoints,after:b.checkpoints,changes:after.changes.length,reservations:after.changes.filter(x=>x.policy==='P').length,regressions,structure:[...a.errors,...b.errors]};
}
const ids=arm=>arm.sessions.map(s=>s.rows.map(r=>[r.id,r.role,r.reason,r.response]));
for(const policy of ['V2','V6']){
 const before=nativeTrace(policy,false),after=nativeTrace(policy,true),review=compare(before,after);
 assert.deepEqual(ids(before).slice(0,2),ids(after).slice(0,2),'preserve S1/S2');
 const altered=ids(before).flatMap((a,i)=>JSON.stringify(a)!==JSON.stringify(ids(after)[i])?[i+1]:[]);
 const provenance={m1Sha:sha,m1Policy:policy,m4Sha:gitHead(root),engine:L.ENGINE,catalogue:L.CATALOGUE,metadata:'8e920bb9c925c7474bb04701f0f2fecac5288b91',responseRule:'fnv1a-m4-v1',baseline:'m1-instrumented'};
 const summary={profile,seed,policy,provenance,review,altered,changes:after.changes,m1EventsBefore:before.m1Events,m1EventsAfter:after.m1Events};
 fs.writeFileSync(path.join(out,policy+'-'+profile+'-'+seed+'.json'),JSON.stringify({summary,before,after}));
 console.log('M4_M1_SUMMARY '+JSON.stringify(summary));
}
