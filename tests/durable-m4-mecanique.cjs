'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir='audits/apprentissage-durable-20261126/m4/',base='d3f606ffe52e6b9183a45d0ec58e6c2a9b3a92e7';
const read=p=>fs.readFileSync(path.join(root,p),'utf8'), old=p=>execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const qs=JSON.parse(old('quizz.html').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const additions=JSON.parse(read(dir+'additions.json')),pairs=JSON.parse(read(dir+'contrasts.json')),review=JSON.parse(read(dir+'revue-ouvertures.json'));
const bid=x=>{const m=/^([1-7])(♣|♦|♥|♠|SA)$/.exec(x);return m?+m[1]*5+['♣','♦','♥','♠','SA'].indexOf(m[2]):-1};
const H={A:4,R:3,D:2,V:1},out={},all=[...qs,...additions.map(x=>x.exercise)],by=new Map(all.map(q=>[q.id,q]));
let assertions=0;const failures=[];const ok=(v,m)=>{assertions++;if(!v)failures.push(m)};
const signature=q=>q.hand.map(x=>[...x].sort().join(',')).join('/');
const permutation=q=>q.hand.map(x=>[...x].sort().join(',')).sort().join('/');
ok(qs.length===1915,'historical count');ok(by.size===all.length,'unique IDs');
for(const q of all){const checks={},check=(name,v)=>{checks[name]=!!v;ok(v,q.id+' '+name)};
check('thirteenCards',q.hand.length===4&&q.hand.flat().length===13);
check('validRanks',q.hand.every(s=>new Set(s).size===s.length&&s.every(c=>/^(A|R|D|V|10|[2-9])$/.test(c))));
check('honours',q.h===q.hand.flat().reduce((s,c)=>s+(H[c]||0),0));
check('shape',JSON.stringify(q.shape)===JSON.stringify(q.hand.map(s=>s.length)));
check('choices',q.choices.length===4&&new Set(q.choices).size===4&&q.choices.includes(q.answer));
check('text',typeof q.context==='string'&&q.context.trim().length>0&&typeof q.explain==='string'&&q.explain.trim().length>0);
let last=-1,side=null,doubled=0,legal=true;
for(const e of q.auction){const m=/^(Vous|Partenaire|Adversaire)\s*:\s*([1-7](?:♣|♦|♥|♠|SA)|Passe|Surcontre|Contre)/.exec(e);if(!m){legal=false;continue}const b=bid(m[2]),s=m[1]==='Adversaire'?'them':'us';if(b>=0){if(b<=last)legal=false;last=b;side=s;doubled=0}else if(m[2]==='Contre'){if(last<0||side===s||doubled!==0)legal=false;doubled=1}else if(m[2]==='Surcontre'){if(last<0||side!==s||doubled!==1)legal=false;doubled=2}}
check('auctionPartialLegality',legal);
check('choiceLegality',q.choices.every(b=>b==='Passe'||b==='Contre'&&last>=0&&side==='them'&&doubled===0||b==='Surcontre'&&last>=0&&side==='us'&&doubled===1||bid(b)>last));
out[q.id]={checks,semanticFlag:/également défendable|également une enchère légale|peut se défendre|autre enchère.*défendable|plusieurs enchères.*possibles/i.test(q.explain)?'alternative_explicitly_mentioned':null};
}
for(const p of pairs){const a=by.get(p.a),b=by.get(p.b);ok(a&&b&&signature(a)!==signature(b),'exact independent hand '+p.a+' '+p.b);ok(a&&b&&permutation(a)!==permutation(b),'not a suit permutation '+p.a+' '+p.b)}
ok(Object.keys(review.byId).length===52,'opening editorial scope');
for(const [id,r] of Object.entries(review.byId)){const q=by.get(id);ok(q&&q.h===r.h&&q.answer===r.answer&&JSON.stringify(q.shape)===JSON.stringify(r.shape)&&q.caseFamily===r.family,'review provenance '+id);ok(r.reason.length>20&&['coherent_in_catalogue_framework','hold_editorial'].includes(r.status),'review disposition '+id)}
const result={schema:'QPJB_M4_MECHANICAL_V1',base,scope:'Structure des enchères abrégées : montants croissants, camps pour Contre/Surcontre, choix licites après préfixe. Ni tour de parole complet, ni unicité pédagogique, ni accords certifiés.',historical:qs.length,additions:additions.length,pairs:pairs.length,assertions,status:failures.length?'FAIL':'PASS',failures,byId:out};
if(failures.length)throw Error(JSON.stringify(failures));
console.log(JSON.stringify(result));
