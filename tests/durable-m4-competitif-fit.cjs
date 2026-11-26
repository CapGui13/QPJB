'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir='audits/apprentissage-durable-20261126/m4/',base='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,dir+p),'utf8')),old=p=>execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const qs=JSON.parse(old('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const meta={exports:{}};new Function('module',old('quizz-prerequis.js'))(meta);
const names=["revue-ouvertures.json","revue-notions-residuelles.json","revue-sa-initial.json","revue-sa-developpements.json","revue-fit-majeur.json","revue-extremites-transfert.json","revue-extremites-complement.json","revue-reponses-naturelles.json","revue-roudi-drury.json","revue-redemandes.json","revue-ouvertures-position.json","revue-secondes-forcing-fortes.json"],prior=new Set(names.flatMap(p=>Object.keys(read(p).byId))),review=read('revue-competitif-fit.json'),scope=qs.filter(q=>/^competitif\./.test(meta.exports.byId[q.id].concept)),expected=scope.filter(q=>!prior.has(q.id));
let assertions=0;const ok=(x,m)=>{assertions++;if(!x)throw Error(m)};
ok(prior.size===1178,'prior coverage');ok(expected.length===48&&Object.keys(review.byId).length===48,'new coverage');ok(scope.length===review.coverage.scopeTotal,'scope');
const counts={};for(const q of expected){const z=review.byId[q.id];ok(z&&z.concept===meta.exports.byId[q.id].concept,'concept '+q.id);ok(z.h===q.h&&z.answer===q.answer&&z.family===q.caseFamily&&z.difficulty===q.difficulty,'source '+q.id);ok(JSON.stringify(z.shape)===JSON.stringify(q.shape)&&JSON.stringify(z.choices)===JSON.stringify(q.choices),'exact choices '+q.id);ok(z.reason.length>25&&['coherent_in_catalogue_framework','guided_not_independent','bounded_context'].includes(z.status),'review '+q.id);ok(!prior.has(q.id),'disjoint '+q.id);counts[z.status]=(counts[z.status]||0)+1;}
ok(JSON.stringify(counts)===JSON.stringify(review.counts),'counts');ok(review.coverage.total===1226&&review.coverage.remaining===qs.length-1226,'total');
const by=id=>qs.find(q=>q.id===id);
for(const [id,suit,len,h,answer] of [['SEF-V470-006',1,3,11,'Surcontre'],['V2-M5-003',0,3,11,'2SA'],['V2-M5-002',0,4,10,'2SA'],['SEF-L16-009',0,4,12,'2SA'],['SEF-V472-003',3,5,8,'2♣'],['SEF-V485-001',3,5,9,'2SA'],['V2-M5-007',1,4,14,'3♥'],['V2-M5-008',1,4,16,'4♥']]){const q=by(id);ok(q.shape[suit]===len&&q.h===h&&q.answer===answer,'boundary '+id)}
ok(review.byId['SEF-L05-014'].status==='bounded_context','penalty not guaranteed');ok(review.byId['SEF-V472-002'].status==='bounded_context','barrage judgment');
console.log(JSON.stringify({assertions,status:'PASS',reviewed:expected.length,totalReviewed:1226,scopeTotal:scope.length,counts}));
