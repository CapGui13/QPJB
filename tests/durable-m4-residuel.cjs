'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir='audits/apprentissage-durable-20261126/m4/',base='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
const read=p=>fs.readFileSync(path.join(root,p),'utf8'), old=p=>execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const qs=JSON.parse(old('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const meta={exports:{}};new Function('module',old('quizz-prerequis.js'))(meta);
const review=JSON.parse(read(dir+'revue-notions-residuelles.json')),opening=JSON.parse(read(dir+'revue-ouvertures.json')),add=JSON.parse(read(dir+'additions.json')),addReview=JSON.parse(read(dir+'revue-ajouts.json')),pairs=JSON.parse(read(dir+'contrasts.json'));
const groups=new Set(['ouv.mineure','ouv.bicolore.exception','drury.init','fortes.relais','mineur.soutien','barrage.ouverture']);
const by=new Map(qs.map(q=>[q.id,q]));let assertions=0;const ok=(x,m)=>{assertions++;if(!x)throw Error(m)};
const expected=qs.filter(q=>groups.has(meta.exports.byId[q.id].concept));ok(expected.length===107&&Object.keys(review.byId).length===107,'scope');
for(const q of expected){let z=review.byId[q.id];ok(z&&z.concept===meta.exports.byId[q.id].concept&&z.answer===q.answer&&z.h===q.h&&z.family===q.caseFamily&&JSON.stringify(z.shape)===JSON.stringify(q.shape),'source '+q.id);ok(z.reason.length>20&&['coherent_in_catalogue_framework','guided_not_independent','bounded_context','hold_editorial'].includes(z.status),'status '+q.id);ok(!(q.id in opening.byId),'disjoint '+q.id)}
ok(review.byId['SEF-V45-005'].status==='guided_not_independent'&&review.byId['SEF-V45-006'].status==='guided_not_independent','old prompts scaffolded');
ok(review.byId['V2-M1-031'].status==='hold_editorial','ambiguity preserved');
ok(add.length===5&&Object.keys(addReview.byId).length===5,'proposals');
for(const a of add){const q=a.exercise,r=addReview.byId[q.id];ok(r&&r.sources.every(id=>by.has(id))&&r.criterion.length>20,'source '+q.id);ok(a.diagnostics.every(d=>q.choices.includes(d.choice)&&d.choice!==q.answer),'diagnostic '+q.id)}
const x=add[3],y=add[4];for(const a of [x,y]){const q=a.exercise;ok(q.answer==='2♦'&&q.auction[0]==='Partenaire : 2♣ (fort indéterminé)'&&!/relais|obligatoire|systématique|2♦/.test(q.context),'unprompted relay');ok(JSON.stringify(a.metadata)===JSON.stringify(meta.exports.byId['SEF-V45-005']),'metadata floor')}
ok(x.exercise.h===0&&y.exercise.h===14,'extremes');ok(pairs.some(p=>p.a===x.exercise.id&&p.b===y.exercise.id&&p.evidence.review.classification==='consolidation'&&!p.evidence.transferEvidenceEligible),'no false transfer');
console.log(JSON.stringify({assertions,status:'PASS',reviewedResidual:expected.length,openingReviewed:Object.keys(opening.byId).length,proposals:add.length}));
