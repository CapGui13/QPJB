'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir='audits/apprentissage-durable-20261126/m4/',base='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
const read=p=>fs.readFileSync(path.join(root,p),'utf8'), old=p=>execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const qs=JSON.parse(old('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const meta={exports:{}};new Function('module',old('quizz-prerequis.js'))(meta);
const reviews=['revue-ouvertures.json','revue-notions-residuelles.json','revue-sa-initial.json','revue-sa-developpements.json','revue-fit-majeur.json'].map(p=>JSON.parse(read(dir+p))),review=reviews[4],pairs=JSON.parse(read(dir+'contrasts.json')),api=require('../quizz-durable-m4-autonomie.js');
const groups=new Set(["majeur.soutien","fit.2sa","fit.2sa.suite","apres_fit.base","apres_fit.essai","apres_fit.essai.suite"]);let assertions=0;const ok=(x,m)=>{assertions++;if(!x)throw Error(m)};
const expected=qs.filter(q=>groups.has(meta.exports.byId[q.id].concept));ok(expected.length===104&&Object.keys(review.byId).length===104,'scope');
for(const q of expected){const z=review.byId[q.id];ok(z&&z.concept===meta.exports.byId[q.id].concept&&z.h===q.h&&z.answer===q.answer&&z.family===q.caseFamily&&z.difficulty===q.difficulty,'source '+q.id);ok(JSON.stringify(z.shape)===JSON.stringify(q.shape)&&JSON.stringify(z.choices)===JSON.stringify(q.choices),'exact choices/shape '+q.id);ok(z.reason.length>30&&['coherent_in_catalogue_framework','guided_not_independent','bounded_context','hold_editorial'].includes(z.status),'status '+q.id);ok(reviews.slice(0,4).every(r=>!(q.id in r.byId)),'disjoint '+q.id)}
const counts={};for(const z of Object.values(review.byId))counts[z.status]=(counts[z.status]||0)+1;
ok(JSON.stringify(counts)===JSON.stringify({"coherent_in_catalogue_framework":50,"guided_not_independent":39,"bounded_context":15}),'status counts');
const candidates=pairs.filter(p=>p.evidence.transferEvidenceEligible===true);ok(candidates.length===77,'candidate count');const prior=JSON.stringify(reviews),pairCounts={};
for(const [i,pair] of candidates.entries()){const r=api.inspect({pair,reviews});pairCounts[r.reason]=(pairCounts[r.reason]||0)+1;ok(JSON.stringify(r)===JSON.stringify(review.transferScreen.pairs[i]),'recorded screen');ok(r.automaticCredit===false,'no automatic credit');ok(r.eligibleForIndependentProbe===r.statuses.every(s=>s==='coherent_in_catalogue_framework'),'two coherent endpoints');ok(api.filter({id:pair.a,contrasts:[pair],reviews,candidates:[pair.b]}).length===Number(r.eligibleForIndependentProbe),'candidate filter');ok(api.filter({id:pair.a,contrasts:[pair],reviews,candidates:[]}).length===0,'eligibility')}
ok(JSON.stringify(pairCounts)===JSON.stringify(review.transferScreen.counts),'counts');ok(JSON.stringify(reviews)===prior,'pure');
const find=id=>qs.find(q=>q.id===id);
const hld=(q,suit)=>q.h+(q.shape[suit]===4?2:0)+q.shape.filter((n,i)=>i!==suit&&n===2).length;
for(const [a,b,suit,ha,hb,aa,ab] of [['SEF-PN26-M1-021','SEF-PN26-M1-032',1,5,6,'Passe','2♥'],['V2-M1-039','V2-M1-040',1,10,11,'2♥','2SA'],['V2-M1-041','V2-M1-042',0,11,11,'2SA','3♠']]){ok(hld(find(a),suit)===ha&&hld(find(b),suit)===hb,'HLD threshold '+a);ok(find(a).answer===aa&&find(b).answer===ab,'boundary '+a)}
ok(find('SEF-V4-002-1').auction[0].startsWith('Vous')&&find('SEF-V4-002-1').answer==='2SA','opener trial');ok(find('SEF-V486-007').auction[1].startsWith('Partenaire : 2SA')&&find('SEF-V486-007').answer==='3♥','direct invitation recipient');ok(find('SEF-L21-005').answer==='4♥'&&find('SEF-L21-006').answer==='Passe','competitive wide invitation');
ok(find('V2-M3-033').h===find('V2-M3-034').h&&find('V2-M3-033').answer==='4♠'&&find('V2-M3-034').answer==='3♠','specific complements not points alone');
ok(find('V2-M3-035').shape[0]===5&&find('V2-M3-036').shape[0]===6&&find('V2-M3-035').answer==='Passe'&&find('V2-M3-036').answer==='3♠','preventive boundary');ok(review.gaps.some(g=>g.disposition==='HOLD_AGREEMENT'),'no invented priority');
const total=reviews.reduce((s,r)=>s+Object.keys(r.byId).length,0);ok(total===488,'cumulative reviewed');
console.log(JSON.stringify({assertions,status:'PASS',reviewed:expected.length,totalReviewed:total,statusCounts:counts,pairCounts}));
