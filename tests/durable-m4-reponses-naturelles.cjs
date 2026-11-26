'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir='audits/apprentissage-durable-20261126/m4/',base='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
const read=p=>fs.readFileSync(path.join(root,p),'utf8'), old=p=>execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const qs=JSON.parse(old('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises,by=new Map(qs.map(q=>[q.id,q]));
const meta={exports:{}};new Function('module',old('quizz-prerequis.js'))(meta);
const reviews=['revue-ouvertures.json','revue-notions-residuelles.json','revue-sa-initial.json','revue-sa-developpements.json','revue-fit-majeur.json','revue-extremites-transfert.json','revue-extremites-complement.json','revue-reponses-naturelles.json'].map(p=>JSON.parse(read(dir+p))),review=reviews[7],oldIds=new Set(reviews.slice(0,7).flatMap(r=>Object.keys(r.byId)));
let assertions=0;const ok=(x,m)=>{assertions++;if(!x)throw Error(m)};
const scope=qs.filter(q=>['mineur.base','majeur.base'].includes(meta.exports.byId[q.id].concept)),expected=scope.filter(q=>!oldIds.has(q.id));
ok(scope.length===159&&expected.length===156&&Object.keys(review.byId).length===156,'scope');
for(const q of expected){const z=review.byId[q.id];ok(z&&z.concept===meta.exports.byId[q.id].concept&&z.h===q.h&&z.answer===q.answer&&z.family===q.caseFamily&&z.difficulty===q.difficulty,'source '+q.id);ok(JSON.stringify(z.shape)===JSON.stringify(q.shape)&&JSON.stringify(z.choices)===JSON.stringify(q.choices),'exact choices/shape '+q.id);ok(z.reason.length>30&&['coherent_in_catalogue_framework','guided_not_independent','bounded_context','hold_editorial'].includes(z.status),'status '+q.id);ok(!oldIds.has(q.id),'disjoint '+q.id)}
const counts={};for(const z of Object.values(review.byId))counts[z.status]=(counts[z.status]||0)+1;ok(JSON.stringify(counts)===JSON.stringify({"coherent_in_catalogue_framework":133,"guided_not_independent":23}),'status counts');
const hl=q=>q.h+q.shape.reduce((s,n)=>s+Math.max(0,n-4),0),q=id=>by.get(id);
for(const [a,b,ha,hb,aa,ab] of [['SEF-PN26-M1-020','SEF-PN26-M1-031',5,6,'Passe','1♠'],['SEF-Q26-M1-008','SEF-Q26-M1-009',12,13,'1♠','1♦'],['V2-M1-037','V2-M1-038',11,12,'1SA','2♦'],['SEF-Q26-M1-013','SEF-Q26-M1-012',10,12,'1SA','2♣']]){ok(hl(q(a))===ha&&hl(q(b))===hb,'HL '+a);ok(q(a).answer===aa&&q(b).answer===ab,'boundary '+a)}
ok(q('SEF-L06-018').h===11&&q('SEF-L06-018').shape[1]===4&&q('SEF-L06-018').answer==='2♦','H threshold and five-card hearts');ok(q('SEF-L06-017').h===10&&q('SEF-L06-017').shape[2]===6&&q('SEF-L06-017').answer==='2♦','HL threshold without 11 H');
ok(q('SEF-Q26-M1-016').h===17&&q('SEF-Q26-M1-016').answer==='1♠','one-over-one unlimited');ok(q('SEF-Q26-M1-015').shape[0]===1&&q('SEF-Q26-M1-015').answer==='1SA','fallback not necessarily balanced');
ok(q('SEF-L18-004').answer==='2♠'&&q('SEF-L23-001').answer==='1♥','passed-hand distinction');
const union=new Set(reviews.flatMap(r=>Object.keys(r.byId))),total=reviews.reduce((s,r)=>s+Object.keys(r.byId).length,0);ok(total===742&&union.size===total,'unique cumulative review');ok(scope.every(q=>union.has(q.id)),'all natural first-response concepts covered');
console.log(JSON.stringify({assertions,status:'PASS',reviewed:expected.length,totalReviewed:total,statusCounts:counts,completeNaturalResponses:scope.length}));
