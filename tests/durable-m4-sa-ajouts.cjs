'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir='audits/apprentissage-durable-20261126/m4/',base='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
const read=p=>fs.readFileSync(path.join(root,p),'utf8'), old=p=>execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const qs=JSON.parse(old('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const meta={exports:{}};new Function('module',old('quizz-prerequis.js'))(meta);
const adds=JSON.parse(read(dir+'additions.json')),pairs=JSON.parse(read(dir+'contrasts.json')),reg=JSON.parse(read(dir+'revue-ajouts.json')),dev=JSON.parse(read(dir+'revue-sa-developpements.json'));
const api=require('../quizz-durable-m4-autonomie.js'),by=new Map(qs.map(q=>[q.id,q])),H={A:4,R:3,D:2,V:1};let assertions=0;const ok=(x,m)=>{assertions++;if(!x)throw Error(m)};
const key=q=>q.hand.map(s=>[...s].sort().join(',')).sort().join('/');
const keys=new Set(qs.map(key));const ids=['SEF-AD26-M4-006','SEF-AD26-M4-007','SEF-AD26-M4-008'];
const sources=['SEF-V482-003','SEF-Q26-M2-020','SEF-V482-007'];
const cases=ids.map(id=>adds.find(a=>a.exercise.id===id));ok(cases.every(Boolean),'new cases');ok(dev.resolutionPass11.proposals.map(p=>p.id).join()===ids.join(),'documented gaps');
for(const [i,a] of cases.entries()){const q=a.exercise,r=reg.byId[q.id];ok(!keys.has(key(q)),'not permutation of historical or new hand');keys.add(key(q));ok(q.hand.flat().length===13&&q.hand.every(s=>new Set(s).size===s.length),'cards');ok(q.h===q.hand.flat().reduce((s,c)=>s+(H[c]||0),0),'H');ok(JSON.stringify(q.shape)===JSON.stringify(q.hand.map(s=>s.length)),'shape');ok(q.choices.length===4&&new Set(q.choices).size===4&&q.choices.includes(q.answer),'choices');ok(q.context==='Sud est à la parole. Les adversaires passent. Quelle enchère choisissez-vous dans le traitement SEF/QPJB étudié ?','no decision cue');ok(JSON.stringify(a.metadata)===JSON.stringify(meta.exports.byId[sources[i]]),'prerequisite floor');ok(r.sources.every(s=>by.has(s))&&r.criterion.length>30,'historical support');ok(a.diagnostics.length===3&&a.diagnostics.every(d=>q.choices.includes(d.choice)&&d.choice!==q.answer),'distractors');
const links=pairs.filter(p=>p.a===q.id||p.b===q.id);ok(links.length>=1&&links.every(p=>!p.evidence.transferEvidenceEligible&&p.evidence.automaticCredit===false),'no automatic or forced transfer');ok(links.every(p=>!api.inspect({pair:p,reviews:[]}).eligibleForIndependentProbe),'not autonomous evidence');}
const [a,b,c]=cases.map(x=>x.exercise);ok(a.h===3&&a.shape[3]===6&&a.answer==='3♣'&&a.auction.includes('Partenaire : 2SA'),'weak hand returns to clubs after modulation');ok(b.h===7&&b.shape[1]===4&&b.shape[0]===3&&b.auction.includes('Partenaire : 3SA')&&b.answer==='4♣','coded game transfer');ok(c.h===12&&c.shape[3]===6&&c.shape[2]===1&&c.answer==='3SA','other-minor shortage code');
ok(!qs.filter(q=>meta.exports.byId[q.id].concept==='sa1.texas_mineur.suite').some(q=>q.auction.some(s=>/^Partenaire : 2SA/.test(s))),'real historical gap');
console.log(JSON.stringify({assertions,status:'PASS',proposed:cases.length}));
