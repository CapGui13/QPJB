'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir='audits/apprentissage-durable-20261126/m4/',base='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,dir+p),'utf8')),old=p=>execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const qs=JSON.parse(old('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const meta={exports:{}};new Function('module',old('quizz-prerequis.js'))(meta);
const names=["revue-ouvertures.json","revue-notions-residuelles.json","revue-sa-initial.json","revue-sa-developpements.json","revue-fit-majeur.json","revue-extremites-transfert.json","revue-extremites-complement.json","revue-reponses-naturelles.json","revue-roudi-drury.json"],prior=new Set(names.flatMap(p=>Object.keys(read(p).byId))),review=read('revue-redemandes.json'),scope=qs.filter(q=>/^red\.(bicolore|bicolore_cher|base)$/.test(meta.exports.byId[q.id].concept)),expected=scope.filter(q=>!prior.has(q.id));
let assertions=0;const ok=(x,m)=>{assertions++;if(!x)throw Error(m)};
ok(prior.size===823,'prior coverage');ok(expected.length===116&&Object.keys(review.byId).length===116,'new coverage');ok(scope.length===review.coverage.scopeTotal,'scope');
const counts={};for(const q of expected){const z=review.byId[q.id];ok(z&&z.concept===meta.exports.byId[q.id].concept,'concept '+q.id);ok(z.h===q.h&&z.answer===q.answer&&z.family===q.caseFamily&&z.difficulty===q.difficulty,'source '+q.id);ok(JSON.stringify(z.shape)===JSON.stringify(q.shape)&&JSON.stringify(z.choices)===JSON.stringify(q.choices),'exact choices '+q.id);ok(z.reason.length>30&&['coherent_in_catalogue_framework','guided_not_independent','bounded_context','hold_editorial'].includes(z.status),'review '+q.id);ok(!prior.has(q.id),'disjoint '+q.id);counts[z.status]=(counts[z.status]||0)+1;}
ok(JSON.stringify(counts)===JSON.stringify(review.counts),'counts');ok(review.coverage.total===939&&review.coverage.remaining===qs.length-939,'total');
const by=id=>qs.find(q=>q.id===id);
for(const [id,suit,len,h,answer] of [['SEF-V44-017',1,4,13,'3♥'],['SEF-V44-018',0,4,13,'3♠'],['SEF-V410-006',1,4,17,'2♥'],['V2-M3-001',1,6,13,'2♥'],['V2-M3-002',1,6,17,'2♠'],['V2-M3-003',0,4,13,'1♠'],['V2-M3-004',0,4,19,'2♠'],['V2-M3-011',1,4,18,'3SA'],['V2-M3-012',1,3,18,'2SA'],['SEF-V417-002',1,5,13,'2♥']]){const q=by(id);ok(q.shape[suit]===len&&q.h===h&&q.answer===answer,'boundary '+id)}
for(const id of ['SEF-V44-017','SEF-V44-018']){const q=by(id);ok(review.byId[id].status==='hold_editorial','hold '+id);ok(q.explain.includes('neuvième atout'),'source unsupported ninth '+id)}
ok(review.byId['SEF-L31-002'].status==='guided_not_independent','given rule');
console.log(JSON.stringify({assertions,status:'PASS',reviewed:expected.length,totalReviewed:939,scopeTotal:scope.length,counts}));
