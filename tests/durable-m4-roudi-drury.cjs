'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir='audits/apprentissage-durable-20261126/m4/',base='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,dir+p),'utf8')),old=p=>execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const qs=JSON.parse(old('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const meta={exports:{}};new Function('module',old('quizz-prerequis.js'))(meta);
const names=["revue-ouvertures.json","revue-notions-residuelles.json","revue-sa-initial.json","revue-sa-developpements.json","revue-fit-majeur.json","revue-extremites-transfert.json","revue-extremites-complement.json","revue-reponses-naturelles.json"],prior=new Set(names.flatMap(p=>Object.keys(read(p).byId))),review=read('revue-roudi-drury.json'),expected=qs.filter(q=>!prior.has(q.id)&&/^(roudi|drury)\./.test(meta.exports.byId[q.id].concept));
let assertions=0;const ok=(x,m)=>{assertions++;if(!x)throw Error(m)};
ok(prior.size===742,'prior coverage');ok(expected.length===81&&Object.keys(review.byId).length===81,'new coverage');
const counts={};for(const q of expected){const z=review.byId[q.id];ok(z&&z.concept===meta.exports.byId[q.id].concept,'concept '+q.id);ok(z.h===q.h&&z.answer===q.answer&&z.family===q.caseFamily&&z.difficulty===q.difficulty,'source '+q.id);ok(JSON.stringify(z.shape)===JSON.stringify(q.shape)&&JSON.stringify(z.choices)===JSON.stringify(q.choices),'exact choices '+q.id);ok(z.reason.length>30&&['coherent_in_catalogue_framework','guided_not_independent','bounded_context','hold_editorial'].includes(z.status),'review '+q.id);ok(!prior.has(q.id),'disjoint '+q.id);counts[z.status]=(counts[z.status]||0)+1;}
ok(JSON.stringify(counts)===JSON.stringify(review.counts),'counts');ok(review.coverage.total===823&&review.coverage.remaining===qs.length-823,'total');
const by=id=>qs.find(q=>q.id===id);
for(const [id,suit,len,h,answer] of [['SEF-V4-082-1',0,2,13,'2♦'],['SEF-V4-083-1',0,3,12,'2♥'],['SEF-V4-084-1',0,3,14,'2♠'],['SEF-L13-002',1,2,14,'2♦'],['SEF-V484-005',3,1,9,'3♥'],['SEF-V484-008',3,1,9,'3♠'],['V2-M6-009',3,2,10,'2♣'],['V2-M6-010',3,1,10,'2SA'],['V2-M6-001',0,4,11,'2SA'],['V2-M6-002',0,5,11,'2♣']]){const q=by(id);ok(q.shape[suit]===len&&q.h===h&&q.answer===answer,'boundary '+id)}
ok(review.byId['SEF-L10-030'].status==='guided_not_independent','rule in prompt');ok(review.byId['SEF-V484-014'].status==='bounded_context','judgment');ok(review.gaps.some(g=>g.disposition==='HOLD_EDITORIAL_PROPOSAL'),'hold');
console.log(JSON.stringify({assertions,status:'PASS',reviewed:expected.length,totalReviewed:823,counts}));
