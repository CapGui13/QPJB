'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir='audits/apprentissage-durable-20261126/m4/',base='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7',priorRef='81409518c4654e61ac282c13baa0307ed4729658';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,dir+p),'utf8')),old=(ref,p)=>execFileSync('git',['show',ref+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const qs=JSON.parse(old(base,'quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const meta={exports:{}};new Function('module',old(base,'quizz-prerequis.js'))(meta);
const prior=JSON.parse(old(priorRef,dir+'couverture-editoriale.json')),review=read('revue-interventions-contres-reveils.json'),targets=Object.entries(prior.byConcept).filter(([c])=>/^(intervenir|contre|reveil)\./.test(c)),ids=new Set(targets.flatMap(([c,g])=>g.remainingIds)),expected=qs.filter(q=>ids.has(q.id));
let assertions=0;const ok=(x,m)=>{assertions++;if(!x)throw Error(m)};
ok(prior.reviewed===1226,'prior coverage');ok(expected.length===207&&Object.keys(review.byId).length===207,'new coverage');ok(targets.reduce((s,[c,g])=>s+g.total,0)===review.coverage.scopeTotal,'scope');
const counts={};for(const q of expected){const z=review.byId[q.id];ok(z&&z.concept===meta.exports.byId[q.id].concept,'concept '+q.id);ok(z.h===q.h&&z.answer===q.answer&&z.family===q.caseFamily&&z.difficulty===q.difficulty,'source '+q.id);ok(JSON.stringify(z.shape)===JSON.stringify(q.shape)&&JSON.stringify(z.choices)===JSON.stringify(q.choices),'exact choices '+q.id);ok(z.reason.length>25&&['coherent_in_catalogue_framework','guided_not_independent','bounded_context','hold_editorial'].includes(z.status),'review '+q.id);counts[z.status]=(counts[z.status]||0)+1;}
ok(JSON.stringify(counts)===JSON.stringify(review.counts),'counts');ok(review.coverage.total===1433&&review.coverage.remaining===qs.length-1433,'total');
const by=id=>qs.find(q=>q.id===id);
for(const [id,suit,len,h,answer] of [['V2-M4-007',3,4,13,'Passe'],['V2-M4-008',3,4,13,'1SA'],['V2-M4-019',0,6,15,'1♠'],['V2-M4-020',0,6,15,'Contre'],['V2-M4-021',1,4,3,'1♥'],['V2-M4-022',1,4,3,'Passe'],['V2-M4-029',1,4,7,'3♥'],['V2-M4-030',1,4,9,'2SA'],['V2-M4-037',0,4,10,'2♦'],['V2-M4-038',0,5,10,'2♥']]){const q=by(id);ok(q.shape[suit]===len&&q.h===h&&q.answer===answer,'boundary '+id)}
ok(by('SEF-V3-059-5').shape[3]===4&&by('SEF-V3-059-5').explain.includes('cinq Trèfles'),'editorial error');ok(review.byId['SEF-V3-059-5'].status==='hold_editorial','hold');
console.log(JSON.stringify({assertions,status:'PASS',reviewed:expected.length,totalReviewed:1433,scopeTotal:review.coverage.scopeTotal,counts}));
