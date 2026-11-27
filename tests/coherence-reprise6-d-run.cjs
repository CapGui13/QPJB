'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process'),crypto=require('node:crypto'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const [profile='autonome',rawSeed='11',dest='reprise6-d-native',rawHorizon='180']=process.argv.slice(2),seed=Number(rawSeed),horizon=Number(rawHorizon);
const patch=require('../quizz-coherence-reprise6-d-patch.js'),policy=require('../quizz-coherence-reprise6-d-t.js'),lab=require('./coherence-reprise6-d-native.cjs');
const source=read('quizz-parcours.js'),html=read('quizz.html'),embedded=h=>h.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:24*1024*1024});
const hist='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
assert.equal(embedded(html),embedded(git('show',hist+':quizz.html')));assert.equal(read('quizz-prerequis.js'),git('show',hist+':quizz-prerequis.js'));
const sha=git('rev-parse','HEAD').trim(),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const exercises=JSON.parse(embedded(html)).exercises,meta=require('../quizz-prerequis.js').byId,features=require('../quizz-coherence-m4-diversite.js').features,m6=require('../quizz-coherence-m6-traces.js'),m2=require('../quizz-coherence-m2-ordre.js'),m3=require('../quizz-coherence-m3-prerequis.js');
let now=Date.UTC(2026,0,1);class FixedDate extends Date{constructor(...a){super(...(a.length?a:[now]))}static now(){return now}}
const requireBase=createRequire(path.join(root,'quizz-parcours.js')),mod={exports:{}};
new Function('module','exports','require','Date',source)(mod,mod.exports,requireBase,FixedDate);
const common={api:mod.exports,exercises,meta,features,m6,m2,m3,profile,seed,horizon,clock:n=>now=Date.UTC(2026,0,1)+n,capture:true};
const traces=[],summary=[];
for(const model of ['D','M6'])for(const consolidate of [false,true]){
 const before=lab.run({...common,model,consolidate}),after=lab.run({...common,model,consolidate,policy});
 traces.push({before,after});
 const alerts=[];for(const [i,b] of before.checkpoints.entries()){const a=after.checkpoints[i],session=b.session;
  for(const [concept,value] of Object.entries(b.debt))if((a.debt[concept]||0)>value)alerts.push({session,metric:'conceptDebt',concept,before:value,after:a.debt[concept]});
  for(const concept of b.proof)if(!a.proof.includes(concept))alerts.push({session,metric:'proofLost',concept});
  for(const metric of ['families','autonomous'])if(a[metric]<b[metric])alerts.push({session,metric,before:b[metric],after:a[metric]});
  for(const metric of ['hard','near','nearRecent'])if(a[metric]>b[metric])alerts.push({session,metric,before:b[metric],after:a[metric]});
 }
 summary.push({model,consolidate,alerts,before:before.checkpoints,after:after.checkpoints,direct:after.direct,consolidations:[before.consolidations,after.consolidations],resumes:[before.resumes,after.resumes]});
}
fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(path.join(dest,'traces.json'),JSON.stringify(traces));
fs.writeFileSync(path.join(dest,'summary.json'),JSON.stringify({sha,engine:hash(source),catalogue:hash(embedded(html)),profile,seed,horizon,summary}));
console.log(JSON.stringify({profile,seed,horizon,summary:summary.map(x=>({model:x.model,consolidate:x.consolidate,alerts:x.alerts.length,consolidations:x.consolidations,resumes:x.resumes,direct:x.direct.map(d=>({session:d.session,old:d.old.id,next:d.next.id})),near:x.before.map((b,i)=>[b.session,b.near,x.after[i].near]),debt:x.before.map((b,i)=>[b.session,b.debtTotal,x.after[i].debtTotal])}))}));
