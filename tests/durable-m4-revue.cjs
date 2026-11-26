'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir='audits/apprentissage-durable-20261126/m4/';
const read=p=>fs.readFileSync(path.join(root,p),'utf8'), old=p=>execFileSync('git',['show','d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7:'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const pairs=JSON.parse(read(dir+'contrasts.json')),reg=JSON.parse(read(dir+'revue-paires.json')),add=JSON.parse(read(dir+'additions.json'));
const qs=JSON.parse(old('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const by=new Map([...qs,...add.map(a=>a.exercise)].map(q=>[q.id,q])),api=require('../quizz-durable-m4-transfert.js');
let assertions=0;const ok=(v,m)=>{assertions++;if(!v)throw Error(m)};
const key=(a,b)=>[a,b].sort().join('|'),counts={},seen=new Set(),concepts=new Set(),tc=new Set(),eligible=qs.concat(add.map(a=>a.exercise));
ok(qs.length===1915,'base');ok(Object.keys(reg.byId).length===by.size,'registry');ok(Object.keys(reg.concepts).length===99,'concept registry');
for(const p of pairs){const k=key(p.a,p.b),a=by.get(p.a),b=by.get(p.b),t=p.evidence.review.classification,transfer=t==='intercontextual',hold=t==='hold';
ok(!seen.has(k)&&a&&b&&a.caseFamily!==b.caseFamily&&JSON.stringify(a.hand)!==JSON.stringify(b.hand),'pair '+k);seen.add(k);
ok(p.evidence.review.reason.length>20&&p.evidence.automaticCredit===false&&p.evidence.transferEvidenceEligible===transfer,'evidence '+k);
counts[t]=(counts[t]||0)+1;
for(const c of p.concepts){concepts.add(c);if(transfer)tc.add(c);ok(reg.concepts[c][t].includes(k),'concept '+c);}
for(const [x,y] of [[a,b],[b,a]]){ok(reg.byId[x.id].pairReviews.some(z=>z.pair===k&&z.classification===t),'endpoint '+x.id);
const arg={id:x.id,contrasts:[p],candidates:[y]};const before=JSON.stringify(arg);
ok(api.links(arg).length===(hold?0:1),'practice '+k);
ok(api.links({...arg,purpose:'transfer'}).length===(transfer?1:0),'transfer '+k);
ok(api.links({...arg,purpose:'transfer',candidates:[]}).length===0,'eligibility '+k);
ok(JSON.stringify(arg)===before,'pure '+k);
ok(JSON.stringify(api.links(arg))===JSON.stringify(api.links(arg)),'determinism '+k);}
}
ok(concepts.size===99,'coverage');ok(tc.size===reg.transferConcepts,'transfer concepts');ok(JSON.stringify(counts)===JSON.stringify(reg.counts),'counts');
for(const q of qs){const z=reg.byId[q.id];ok(z&&Array.isArray(z.pairReviews),'id '+q.id);ok(z.disposition===(z.pairReviews.length?'pair_criterion_reviewed_not_full_editorial_visa':'structurally_mapped_not_individually_certified'),'honest coverage '+q.id);}
ok(qs.filter(q=>reg.byId[q.id].pairReviews.length).length===reg.reviewedHistoricalIds,'review count');
const valid=pairs.find(p=>p.evidence.transferEvidenceEligible),legacy={...valid,evidence:{automaticCredit:false,kind:'legacy'}};
ok(api.links({id:legacy.a,contrasts:[legacy],candidates:[legacy.b],purpose:'transfer'}).length===0,'legacy abstain');
ok(api.links({id:legacy.a,contrasts:[legacy],candidates:[legacy.b],purpose:'practice'})[0]?.transferEvidenceEligible===false,'legacy neutral');
ok(api.links({id:valid.a,contrasts:[valid],candidates:[valid.b],purpose:'unknown'}).length===0,'invalid purpose');
for(const q of eligible){const out=api.links({id:q.id,contrasts:pairs,candidates:eligible,purpose:'transfer'});ok(out.every(x=>x.automaticCredit===false&&x.transferEvidenceEligible&&by.has(x.id)),'all candidates '+q.id);}
console.log(JSON.stringify({assertions,status:'PASS',pairs:pairs.length,counts,transferConcepts:tc.size,reviewedHistoricalIds:reg.reviewedHistoricalIds}));
