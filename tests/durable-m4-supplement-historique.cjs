'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir='audits/apprentissage-durable-20261126/m4/',base='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,dir+p),'utf8'));
const c=read('couverture-editoriale.json');
const qs=JSON.parse(execFileSync('git',['show',base+':quizz.html'],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024}).match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const reviews=c.reviewSources.map(read),pairs=read('contrasts.json'),extra=read('supplement-transfert-historique.json'),handoff=read('cloture-transfert.json');
const api=require('../quizz-durable-m4-transfert.js'),aut=require('../quizz-durable-m4-autonomie.js');
let assertions=0;const ok=(x,m)=>{assertions++;if(!x)throw Error(m)};
const by=new Map(qs.map(q=>[q.id,q])),key=p=>[p.a,p.b].sort().join('|'),sig=q=>q.hand.map(s=>s.slice().sort().join('.')).sort().join('|');
ok(qs.length===1915&&by.size===1915,'base');ok(extra.base===base,'base supplement');ok(extra.pairs.length===4,'supplement size');
const existing=new Set(pairs.map(key)),oldStrict=pairs.filter(p=>aut.inspect({pair:p,reviews}).eligibleForIndependentProbe),allStrict=[...oldStrict];
const oldConcepts=new Set(oldStrict.flatMap(p=>p.concepts)),hist=new Set(pairs.filter(p=>p.evidence.kind==='historical_transfer_candidate').flatMap(p=>p.concepts));
ok(oldStrict.length===handoff.strictProbePairs&&oldConcepts.size===handoff.strictProbeConcepts,'prior counts');
ok(hist.size===22&&[...hist].filter(k=>oldConcepts.has(k)).length===11,'historical roles before');
const expected=[['4♥','4♥'],['4SA','4SA'],['6SA','6SA'],['4♣','4♦']];
for(const [i,p] of extra.pairs.entries()){
 const a=by.get(p.a),b=by.get(p.b);ok(a&&b&&a!==b,'IDs');ok(!existing.has(key(p)),'unique pair');existing.add(key(p));
 ok(a.caseFamily!==b.caseFamily&&sig(a)!==sig(b),'independent family/hand');ok(JSON.stringify(a.auction)!==JSON.stringify(b.auction),'distinct auction');
 ok(a.answer===expected[i][0]&&b.answer===expected[i][1],'canonical answers');
 for(const q of [a,b]){ok(q.hand.flat().length===13&&q.h===q.hand.flat().reduce((s,c)=>s+({A:4,R:3,D:2,V:1}[c]||0),0),'hand integrity');ok(reviews.some(r=>r.byId?.[q.id]?.concept===p.concepts[0]),'concept');}
 ok(p.evidence.automaticCredit===false,'no credit');ok(aut.inspect({pair:p,reviews}).eligibleForIndependentProbe,'editorial filter');
 for(const [x,y] of [[a,b],[b,a]]){let input={id:x.id,contrasts:[p],reviews,candidates:[y]},prior=JSON.stringify(input);ok(aut.filter(input)[0]?.id===y.id,'symmetric autonomous link');ok(api.links({...input,purpose:'transfer'})[0]?.id===y.id,'transfer link');ok(aut.filter({...input,candidates:[]}).length===0,'eligibility');ok(JSON.stringify(input)===prior,'pure');}
 allStrict.push(p);
}
const concepts=new Set(allStrict.flatMap(p=>p.concepts)),after=extra.projected;
ok(pairs.length+extra.pairs.length===after.practicePairs,'practice total');ok(pairs.filter(p=>p.evidence.transferEvidenceEligible===true).length+extra.pairs.length===after.intercontextualCandidates,'intercontextual total');
ok(allStrict.length===after.strictProbePairs&&concepts.size===after.strictProbeConcepts,'strict totals');ok([...hist].filter(k=>concepts.has(k)).length===after.historicalRoleCovered,'historical roles after');
ok(JSON.stringify([...hist].filter(k=>!concepts.has(k)).sort())===JSON.stringify(extra.remainingHistoricalRole.map(x=>x.concept).sort()),'residual roles');
console.log(JSON.stringify({status:'PASS',assertions,oldStrict:oldStrict.length,newStrict:allStrict.length,oldConcepts:oldConcepts.size,newConcepts:concepts.size,historicalRoleCoverage:after.historicalRoleCovered}));
