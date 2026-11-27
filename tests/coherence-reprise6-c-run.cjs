'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),[profile='autonome',seedRaw='11',model='both',hRaw='180',dest='reprise6-c-output']=process.argv.slice(2),seed=Number(seedRaw),horizon=Number(hRaw);
const base='13966e475cf986c6f76e7faf870377fdf4ef99aa',historical='2d336054bc91fbd6ac762c093ecb5ec6da9f97e8';
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
const read=p=>fs.readFileSync(path.join(root,p),'utf8'),blob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
const sources=Object.fromEntries(git('ls-files').trim().split('\n').filter(p=>p==='quizz.html'||/^quizz-.*\.js$/.test(p)||/^tests\/(?:coherence-concrete|durable-m6|coherence-reprise6-c).*\.cjs$/.test(p)).map(p=>[p,read(p)]));
for(const p of ['quizz-parcours.js','quizz-prerequis.js','quizz.html'])assert.equal(sources[p],git('show',base+':'+p),p+' frozen baseline');
const embedded=x=>x.split('<script id="training-data" type="application/json">')[1].split('</script>')[0];
assert.equal(embedded(sources['quizz.html']),embedded(git('show',historical+':quizz.html')));assert.equal(sources['quizz-prerequis.js'],git('show',historical+':quizz-prerequis.js'));
const P=require('./coherence-reprise6-c-campaign.cjs'),result=P.runPair(sources,profile,seed,horizon,model,()=>performance.now());
const provenance={base,historical,testedSha:git('rev-parse','HEAD').trim(),engine:blob(sources['quizz-parcours.js']),catalogue:blob(sources['quizz.html']),metadata:blob(sources['quizz-prerequis.js']),policy:blob(sources['quizz-coherence-reprise6-c-debt-credit.js']),adapter:blob(sources['tests/coherence-reprise6-c-adapter.cjs']),m6:blob(sources['quizz-coherence-m6-traces.js']),d:blob(sources['quizz-coherence-m4p-d-lab.js']),dCampaign:blob(sources['tests/coherence-concrete-m4-campaign.cjs'])};
const traces={},models={};for(const [k,v] of Object.entries(result.models)){const {traces:t,...rest}=v;traces[k]=t;models[k]=rest}
fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(path.join(dest,'traces.json'),JSON.stringify({profile,seed,horizon,provenance,traces}));const summary={profile,seed,horizon,provenance,models};fs.writeFileSync(path.join(dest,'summary.json'),JSON.stringify(summary));
console.log('REPRISE6_C_SUMMARY '+JSON.stringify(summary));
