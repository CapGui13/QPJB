'use strict';
// Rejoue exclusivement la trajectoire candidate, en conservant le témoin
// original produit sur le même moteur et le même blob de module.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),base='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const old=p=>git('show',base+':'+p);
const dir=path.join(root,'audits/apprentissage-durable-20261126/m1');
const [profile,seedArg]=process.argv.slice(2),seed=Number(seedArg);
const pending=[...['autonome','intermediaire','faible','cible','aide','passe'].flatMap(p=>[11,47,103].map(s=>[p,s])),...['force','longueur','fit','forcing','convention','competition','recuperation'].map(p=>[p,47])];
assert.ok(pending.some(([p,s])=>p===profile&&s===seed),'comparison not in matrix');
const sourceSha=git('rev-parse','HEAD').trim();
const moduleBlob=git('rev-parse','HEAD:quizz-durable-m1-adaptation.js').trim();
assert.equal(moduleBlob,'a09254905aae5021062087b3175ce24ad156ef68');
assert.equal(git('rev-parse','HEAD:tests/durable-m1-banc.cjs').trim(),'5cf8f6578655f8318a1cf2d1e2c28d73501d7d1e');
const fixture='banc-phase-protegee-'+profile+'-'+seed+'.json';
const prior=JSON.parse(fs.readFileSync(path.join(dir,fixture),'utf8'));
assert.equal(prior.testedSha,'c4e8807a5a10478611786a0dd43ce6516becf43d');
assert.equal(prior.profile,profile);assert.equal(prior.seed,seed);assert.equal(prior.horizon,180);
const {compile}=require('./durable-m1-banc.cjs');
const guard=require('../quizz-durable-m1-guard.js');
let banc=fs.readFileSync(path.join(__dirname,'durable-m1-banc.cjs'),'utf8');
const anchor="const m1signals=s>=3?__A.analyze({history:state,exercises,diagnose:__P.diagnose}):null;";
const condition="&&(s>=65||(mOf(q).concept===mOf(baseWinner).concept&&q.difficulty===baseWinner.difficulty))";
assert.equal(banc.split(anchor).length,2);assert.equal(banc.split(condition).length,2);
banc=banc.replace(anchor,anchor+" const m1guard=__A.guard(state);").replace(condition,"&&m1guard.allow"+condition);
const B=compile(banc+'\nmodule.exports.run=run;',require);
const cache=new Map();
function load(n){n=n.replace(/^\.\//,'');if(cache.has(n))return cache.get(n);const v=compile(old(n),load);cache.set(n,v);return v}
const qs=JSON.parse(old('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const registry=new Map([0,1,2,3].flatMap(n=>JSON.parse(fs.readFileSync(path.join(dir,'registre-'+n+'.json'),'utf8'))).map(r=>[r.id,r.options]));
assert.equal(qs.length,1915);assert.equal(registry.size,1915);
const input={source:old('quizz-parcours.js'),meta:load('quizz-prerequis.js'),plan:load('quizz-session-plan.js'),A:{...require('../quizz-durable-m1-adaptation.js'),guard:guard.evaluate},P:load('quizz-professeur.js'),qs,registry,policy:'preserve-concept-level'};
const before=prior.before,after=B.run(input,profile,seed,180,true),hold=[];
assert.deepEqual(before.early,after.early,'S1–3 exact');
assert.deepEqual(after.results.map(x=>x.session),[20,65,153,180]);
for(let i=0;i<before.results.length;i++){const a=before.results[i],b=after.results[i];assert.equal(a.session,b.session);assert.ok(!b.invalid&&!b.short&&!b.duplicates&&!b.passViolation,'integrity');if(b.families<.95*a.families||b.topics<a.topics||b.concepts<a.concepts-2||b.proof<a.proof-Math.max(3,.1*a.proof))hold.push({session:b.session,reason:'exposure/proof regression',before:a,after:b});}
if(after.results.at(-1).concepts!==99)hold.push({session:180,reason:'catalogue coverage',concepts:after.results.at(-1).concepts});
const proof={policy:'preserve-concept-level-and-autonomous-evidence',sourceSha,base,moduleBlob,baseline:fixture,baselineSha:git('rev-parse','HEAD:audits/apprentissage-durable-20261126/m1/'+fixture).trim(),node:process.version,profile,seed,horizon:180,before,after,hold};
console.log(JSON.stringify(proof,null,2));if(hold.length)process.exitCode=2;
