// Reprise6 D: #505 independent original FNV D comparator, T only.
'use strict';
// M4-D original response rule and original independent comparator. This
// is a new revision pair, not a replay of the immutable #445 provenance.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const D=require('../quizz-coherence-m4p-d-lab.js'),F=require('../quizz-coherence-m4-diversite.js'),m2=require('../quizz-coherence-m2-ordre.js'),m3=require('../quizz-coherence-m3-prerequis.js'),A=require('../quizz-coherence-reprise6-d-t.js');
const root=path.resolve(__dirname,'..'),[profile,rawSeed,dest='independent-output']=process.argv.slice(2),seed=Number(rawSeed),horizon=180;
assert(D.PROFILES.includes(profile)&&D.SEEDS.includes(seed));
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),sha=git('rev-parse','HEAD').trim();
const blob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
const originalHtml=git('show','2d336054bc91fbd6ac762c093ecb5ec6da9f97e8:quizz.html'),html=read('quizz.html');
const embedded=x=>x.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
assert.equal(embedded(html),embedded(originalHtml));assert.equal(read('quizz-prerequis.js'),git('show','2d336054bc91fbd6ac762c093ecb5ec6da9f97e8:quizz-prerequis.js'));
const exercises=JSON.parse(embedded(html)).exercises,meta=require('../quizz-prerequis.js').byId,source=read('quizz-parcours.js');
assert.equal(exercises.length,1915);
const original=read('tests/coherence-concrete-m4-campaign.cjs');
let harness=original;
function replace(a,b,n=1){assert.equal(harness.split(a).length,n+1,'exact adapter anchor');harness=harness.replaceAll(a,b)}
replace("verify=true,measure=()=>0})","verify=true,measure=()=>0,options={}})");
replace("const api=mod.exports,state=api.empty(),sessions=[]","const settings={...options,observe:r=>changes.push(r)};\n  const api=mod.exports,state=api.empty(),sessions=[]");
replace("api.start(state,exercises)","api.start(state,exercises,settings)",2);
const mod={exports:{}};new Function('module','exports','require',harness)(mod,mod.exports,require);
const requireBase=require('node:module').createRequire(path.join(root,'quizz-parcours.js'));
const transitionGroups=[{simple:m3.TEXAS_ELEMENTARY,complex:m3.TEXAS},{simple:m3.STAYMAN_SIMPLE,complex:m3.STAYMAN_FOURTH}];
const options={coherenceM2:m2,coherenceFullOrder:true,transitionGroups};
const arms={};
for(const name of ['Full','T']){
 const t=mod.exports.run({source,requireBase,exercises,meta,profile,seed,horizon,verify:true,measure:()=>performance.now(),options:name==='Full'?options:{...options,coherenceAtomic:A}});
 t.revision=sha;t.label=name;
 assert(t.checkpoints.every(c=>!c.violations&&!c.dupes&&!c.short&&!c.earlyViolations));
 // Recompute every metric and every response from the real catalogue with
 // the independent D consumer (not the M6 response model).
 D.analyze(t,{catalogue:exercises,metadata:meta,features:F.features,verifyResponse:true});
 arms[name]=t;
}
const results={};
for(const name of ['T']){
 const pair={profile,seed,horizon,before:arms.Full,after:arms[name]};
 // D's original provenance constants pin an OLD engine. The new commit,
 // catalogue and metadata are checked above. legacy=true permits this new
 // pair, with all original metrics present and verified by analyze above.
 const p=D.comparePair(pair,{catalogue:exercises,metadata:meta,features:F.features,verifyResponse:true,legacy:true});
 const fullGate=D.compareCheckpoints([p],{fullMatrix:false});
 const narrowGate=D.compareCheckpoints([p],{fullMatrix:false,requireEarly:name!=='M3',requireDebt:false});
 const regressions=p.regressions.filter(r=>r.metric!=='latency-observation');
 const transition=(t,simple,complex)=>{const rows=t.sessions.flatMap(s=>s.rows);const a=rows.findIndex(r=>simple.includes(r.id)),b=rows.findIndex(r=>complex.includes(r.id));return b>=0&&(a<0||b<a)};
 const transitions=t=>({texas:transition(t,m3.TEXAS_ELEMENTARY,m3.TEXAS),stayman:transition(t,m3.STAYMAN_SIMPLE,m3.STAYMAN_FOURTH)});
 results[name]={pair:p,fullGate,narrowGate,regressions,transitionsBefore:transitions(arms.Full),transitionsAfter:transitions(arms[name])};
}
fs.mkdirSync(dest,{recursive:true});
fs.writeFileSync(path.join(dest,'traces.json'),JSON.stringify(arms));
const provenance={revision:sha,engine:blob(source),catalogue:blob(html),metadata:blob(read('quizz-prerequis.js')),responseRule:'fnv1a-m4-v1',baseline:'full-order',originalD:blob(read('quizz-coherence-m4p-d-lab.js')),originalCampaign:blob(original)};
fs.writeFileSync(path.join(dest,'summary.json'),JSON.stringify({profile,seed,provenance,results}));
console.log('INDEPENDENT_SUMMARY '+JSON.stringify({profile,seed,provenance,results:Object.fromEntries(Object.entries(results).map(([k,r])=>[k,{changes:r.pair.changes,fullGate:r.fullGate.verdict,narrowGate:r.narrowGate.verdict,earlyGain:r.fullGate.earlyGain,debtGain:r.fullGate.debtGain,violations:r.fullGate.violations,regressions:r.regressions,latency:r.pair.regressions.filter(x=>x.metric==='latency-observation'),before:r.pair.before,after:r.pair.after,transitionsBefore:r.transitionsBefore,transitionsAfter:r.transitionsAfter}]))}));
