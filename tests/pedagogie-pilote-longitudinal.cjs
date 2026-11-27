'use strict';
// Paired current-main comparison; no thresholds or historical gates changed.
const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path'),assert=require('node:assert/strict');
const C=require('./durable-m6-campaign.cjs');
const root=path.resolve(__dirname,'..'),base='8989dc247ff3e6681d32b3e11d49edbbddd47e8c';
const [profile='autonome',seedArg='11',dest='pilot-longitudinal.json']=process.argv.slice(2),seed=Number(seedArg);
const files=[...new Set([...C.paths,...fs.readdirSync(root).filter(p=>/^quizz-.*\.js$/.test(p)||p==='parcours-recommandations.js')])];
const git=(...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:24*1024*1024});
const load=ref=>Object.fromEntries(files.filter(p=>git('ls-tree','--name-only',ref,'--',p).trim()).map(p=>[p,git('show',ref+':'+p)]));
const current=Object.fromEntries(files.map(p=>[p,fs.readFileSync(path.join(root,p),'utf8')]));
const published=load(base);
assert.equal(C.data(current['quizz.html']).length,1915);
const result=C.pair(published,current,profile,seed,180);
const checkpoints=result.comparison.map(x=>({session:x.session,review:x.review,deltas:x.deltas,commonTransfer:x.commonTransfer?.delta,crossSessionNewFamilyDelta:x.crossSessionNewFamilyDelta}));
const out={base,profile,seed,beforeViolations:result.before.violations,afterViolations:result.after.violations,crossResume:result.crossResume,checkpoints};
fs.writeFileSync(dest,JSON.stringify({summary:out,result},null,2));
console.log('PILOT_LONGITUDINAL '+JSON.stringify(out));
if(out.beforeViolations.length||out.afterViolations.length||checkpoints.some(x=>x.review.length))process.exitCode=2;
