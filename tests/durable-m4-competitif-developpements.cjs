'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir="audits/apprentissage-durable-20261126/m4/",base="d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7",priorRef="0b833b8d731f4d5e9d1feda4cb7aaf8c7c7e99a2";
const read=p=>JSON.parse(fs.readFileSync(path.join(root,dir+p),'utf8')),old=(ref,p)=>execFileSync('git',['show',ref+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const qs=JSON.parse(old(base,'quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const meta={exports:{}};new Function('module',old(base,'quizz-prerequis.js'))(meta);
const prior=JSON.parse(old(priorRef,dir+'couverture-editoriale.json')),review=read("revue-competitif-developpements.json"),cov=read('couverture-editoriale.json'),targets=["apres_inter.base","reponse_inter.base","red.competitif"],ids=targets.flatMap(c=>prior.byConcept[c].remainingIds),by=new Map(qs.map(q=>[q.id,q]));
let assertions=0;const ok=(x,m)=>{assertions++;if(!x)throw Error(m)};
ok(ids.length===180&&new Set(ids).size===180,'scope');ok(Object.keys(review.byId).length===ids.length,'coverage');const counts={};
for(const id of ids){const q=by.get(id),z=review.byId[id];ok(q&&z&&z.concept===meta.exports.byId[id].concept,'concept '+id);ok(z.h===q.h&&z.answer===q.answer&&z.family===q.caseFamily&&z.difficulty===q.difficulty,'source '+id);ok(JSON.stringify(z.shape)===JSON.stringify(q.shape)&&JSON.stringify(z.choices)===JSON.stringify(q.choices),'shape and options '+id);ok(z.reason.length>25&&['coherent_in_catalogue_framework','guided_not_independent','bounded_context','hold_editorial'].includes(z.status),'review '+id);ok(q.hand.flat().length===13&&q.hand.flat().reduce((s,c)=>s+({A:4,R:3,D:2,V:1}[c]||0),0)===q.h,'hand '+id);counts[z.status]=(counts[z.status]||0)+1;}
ok(JSON.stringify(counts)===JSON.stringify(review.counts),'counts');ok(cov.reviewed>=1613&&cov.remaining<=302&&cov.completeConcepts>=75,'new total');ok(review.coverage.total===1613&&review.coverage.remaining===302,'registry');
for(const c of targets){ok(cov.byConcept[c].remainingIds.length===0&&cov.byConcept[c].reviewed===cov.byConcept[c].total,'complete '+c);}
ok(Object.values(cov.byConcept).reduce((s,g)=>s+g.reviewed,0)===cov.reviewed,'sum reviewed');ok(Object.values(cov.byConcept).reduce((s,g)=>s+g.remainingIds.length,0)===cov.remaining,'sum remaining');ok(Object.values(cov.statusCounts).reduce((s,v)=>s+v,0)===cov.reviewed,'status sum');
ok(by.get('SEF-L35-003').hand[2].join('')==='AD10984'&&by.get('SEF-L35-003').context.includes('ADV1094')&&review.byId['SEF-L35-003'].status==='hold_editorial','editorial hold');
ok(JSON.stringify(by.get('V2-M3-013').hand)===JSON.stringify(by.get('V2-M3-014').hand),'same hand not independent');
for(const [id,answer] of [['SEF-V470-004','2♥'],['SEF-L30-005','Passe'],['SEF-V473-001','2SA'],['SEF-V486-014','1♠'],['SEF-V471-001','Passe'],['SEF-V471-006','1SA']])ok(by.get(id).answer===answer,'boundary '+id);
console.log(JSON.stringify({assertions,status:'PASS',reviewed:ids.length,totalReviewed:cov.reviewed,remaining:cov.remaining,counts}));
