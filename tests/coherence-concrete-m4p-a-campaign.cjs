'use strict';
// Reuse the exact historical campaign and response model with an isolated
// adapter injection. No copy of the motor, catalogue, response model or gate.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),adapter=require(['U','V','W','Y'].includes(process.env.POLICY)?'./coherence-concrete-m4p-a-composition-adapter.cjs':'./coherence-concrete-m4p-a-adapter.cjs');
const historical=fs.readFileSync(path.join(__dirname,'coherence-concrete-m4-campaign.cjs'),'utf8');
const mod={exports:{}};
const req=id=>id==='./coherence-concrete-m4-adapter.cjs'?adapter:require(id);
new Function('module','exports','require',historical)(mod,mod.exports,req);
const {pair,PROFILES,SEEDS,HORIZONS}=mod.exports;
const source=fs.readFileSync(path.join(root,'quizz-parcours.js'),'utf8'),html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const blob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
assert.equal(blob(source),'4a5c96d374d56b0c60cc4c9b5d74c8f04eb1e5a9');
assert.equal(blob(html),'7a952dc57b582a2a7b5be73f83306df83881f3a8');
const exercises=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const requireBase=require('node:module').createRequire(path.join(root,'quizz-parcours.js'));
const meta=requireBase('./quizz-prerequis.js').byId;
assert.equal(exercises.length,1915);assert.equal(new Set(Object.values(meta).map(m=>m.concept)).size,99);
const horizon=Number(process.env.HORIZON||180),out=process.env.OUT||path.join(root,'audits/coherence-concrete-20261126/m4/parallel/a/native');
const policy=process.env.POLICY||'L';assert.ok(['L','R','T','U','V','W','Y'].includes(policy));
fs.mkdirSync(out,{recursive:true});
for(const profile of PROFILES.filter(p=>!process.env.PROFILE||p===process.env.PROFILE))for(const seed of SEEDS.filter(s=>!process.env.SEED||s===Number(process.env.SEED))){
 const p=pair({source,requireBase,exercises,meta,profile,seed,horizon,maxSession:20,policy,measure:()=>performance.now()});
 fs.writeFileSync(path.join(out,profile+'-'+seed+'.json'),JSON.stringify(p));
 console.log(JSON.stringify({profile,seed,policy,before:p.before.checkpoints,after:p.after.checkpoints,changes:p.after.changes}));
 for(const side of [p.before,p.after])assert.ok(side.checkpoints.every(x=>!x.violations&&!x.dupes&&!x.short&&!x.earlyViolations),'structure');
 assert.ok(p.after.changes.every(x=>x.session>=3&&x.session<=20),'périmètre');
}
