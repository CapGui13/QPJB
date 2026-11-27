'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process'),crypto=require('node:crypto'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const [profile='autonome',rawSeed='11',dest='reprise6-recall',rawHorizon='180']=process.argv.slice(2),seed=Number(rawSeed),horizon=Number(rawHorizon);
const policy=require('../quizz-coherence-reprise6-d-t.js'),lab=require('./coherence-reprise6-recall-native.cjs');
const source=read('quizz-parcours.js'),html=read('quizz.html'),embedded=h=>h.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:24*1024*1024});
const hist='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8',base='287bbf94538908605ab5a28661ed94524ece066b';
assert.equal(embedded(html),embedded(git('show',hist+':quizz.html')));assert.equal(read('quizz-prerequis.js'),git('show',hist+':quizz-prerequis.js'));
assert.equal(html,git('show',base+':quizz.html'));
const sha=git('rev-parse','HEAD').trim(),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const exercises=JSON.parse(embedded(html)).exercises,meta=require('../quizz-prerequis.js').byId,features=require('../quizz-coherence-m4-diversite.js').features,m6=require('../quizz-coherence-m6-traces.js'),m2=require('../quizz-coherence-m2-ordre.js'),m3=require('../quizz-coherence-m3-prerequis.js');
let now=Date.UTC(2026,0,1);class FixedDate extends Date{constructor(...a){super(...(a.length?a:[now]))}static now(){return now}}
const requireBase=createRequire(path.join(root,'quizz-parcours.js'));
function apiFor(code){const mod={exports:{}};new Function('module','exports','require','Date',code)(mod,mod.exports,requireBase,FixedDate);return mod.exports}
const reference=apiFor(git('show',base+':quizz-parcours.js')),candidate=apiFor(source);
const common={exercises,meta,features,m6,m2,m3,policy,profile,seed,horizon,clock:n=>now=Date.UTC(2026,0,1)+n,capture:true,consolidate:true};
const traces=[],summary=[];
for(const model of ['D','M6']){
 const baseline=lab.run({...common,api:reference,model}),disabled=lab.run({...common,api:candidate,model});
 assert.deepEqual(disabled,baseline,'opt-out must be identical to reference');
 const after=lab.run({...common,api:candidate,model,foundationRecall:true});
 const alerts=[],extraAlerts=[];
 for(const [i,b] of baseline.checkpoints.entries()){const a=after.checkpoints[i],session=b.session;
  for(const [concept,value] of Object.entries(b.debt))if((a.debt[concept]||0)>value)alerts.push({session,metric:'conceptDebt',concept,before:value,after:a.debt[concept]});
  for(const [concept,value] of Object.entries(b.actualDebt))if((a.actualDebt[concept]||0)>value)extraAlerts.push({session,metric:'actualAnsweredDebt',concept,before:value,after:a.actualDebt[concept]});
  for(const concept of b.proof)if(!a.proof.includes(concept))alerts.push({session,metric:'proofLost',concept});
  for(const metric of ['families','autonomous'])if(a[metric]<b[metric])alerts.push({session,metric,before:b[metric],after:a[metric]});
  for(const metric of ['hard','near','nearRecent'])if(a[metric]>b[metric])alerts.push({session,metric,before:b[metric],after:a[metric]});
 }
 const changed=baseline.sessions.filter((b,i)=>b.rows.map(r=>r.id).sort().join('|')!==after.sessions[i].rows.map(r=>r.id).sort().join('|')).map(b=>b.session);
 traces.push({baseline,after});
 summary.push({model,alerts,extraAlerts,before:baseline.checkpoints,after:after.checkpoints,extraAnswered:after.extraAnswered,recalls:after.recalls.map(r=>({session:r.session,ids:r.rows.map(q=>q.id),concepts:r.rows.map(q=>q.concept),results:r.rows.map(q=>q.result)})),changed,consolidations:[baseline.consolidations,after.consolidations],resumes:[baseline.resumes,after.resumes]});
}
fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(path.join(dest,'traces.json'),JSON.stringify(traces));fs.writeFileSync(path.join(dest,'summary.json'),JSON.stringify({sha,engine:hash(source),catalogue:hash(embedded(html)),profile,seed,horizon,summary}));
console.log('RECALL_SUMMARY '+JSON.stringify({profile,seed,horizon,summary}));
