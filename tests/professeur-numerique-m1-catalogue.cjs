'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const raw=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const old=JSON.parse(raw.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const meta=require('../quizz-prerequis.js').byId;
const additions=require('../audits/professeur-numerique-20261126/m1/additions.json');
const verify=function(old,meta,additions,expected){
function check(b,m){if(!b)throw Error(m)}
const ranks=new Set("A R D V 10 9 8 7 6 5 4 3 2".split(" ")),points={A:4,R:3,D:2,V:1}, ids=new Set(old.map(q=>q.id)),families=new Set(old.map(q=>q.caseFamily)), concepts=new Set(Object.values(meta).map(x=>x.concept)),allids=new Set([...ids,...additions.map(a=>a.exercise.id)]), signatures=new Set(old.map(q=>JSON.stringify([q.hand,q.auction]))), themes=new Set(old.map(q=>q.theme)), roles=new Set(["discovery","consolidation","discrimination","deepening","transfer","review"]),categories=new Set(["force","distribution","fit","priorite","niveau","forcing","convention","competition","contexte","autre","inconnu"]);
check(old.length===1879&&ids.size===1879&&Object.keys(meta).length===1879&&concepts.size===99&&themes.size===22,"base");
check(old.every(q=>meta[q.id]),"metadata coverage");check(additions.length===expected,"count");
for(const {exercise:q,metadata:m,pedagogy:p,diagnostics:d} of additions){
check(/^SEF-PN26-M1-\d{3}$/.test(q.id)&&!ids.has(q.id),q.id+" unique id");ids.add(q.id);
check(/^pn26-m1-\d{3}$/.test(q.caseFamily)&&!families.has(q.caseFamily),q.id+" family");families.add(q.caseFamily);
check(q.hand.length===4&&q.hand.flat().length===13&&q.hand.every(s=>new Set(s).size===s.length&&s.every(c=>ranks.has(c))),q.id+" cards");
check(q.h===q.hand.flat().reduce((s,c)=>s+(points[c]||0),0)&&JSON.stringify(q.shape)===JSON.stringify(q.hand.map(s=>s.length)),q.id+" H/shape");
const sig=JSON.stringify([q.hand,q.auction]);check(!signatures.has(sig),q.id+" identical hand/auction");signatures.add(sig);
check(themes.has(q.theme)&&Number.isInteger(q.difficulty)&&q.difficulty>=1&&q.difficulty<=5&&q.explain&&q.difficultyReason&&q.context,q.id+" fields");
check(Array.isArray(q.auction)&&q.choices.length===4&&new Set(q.choices).size===4&&q.choices.includes(q.answer),q.id+" choices");
check(q.choices.every(c=>/^(Passe|Contre|Surcontre|[1-7](♣|♦|♥|♠|SA))$/.test(c)),q.id+" bids");
check(concepts.has(m.concept)&&[0,1,2,3].includes(m.stage)&&Number.isInteger(m.minSession)&&m.minSession>=0&&m.requires.every(r=>concepts.has(r.concept)&&Number.isInteger(r.minExposure)&&r.minExposure>0),q.id+" metadata");
check(p.roles.length&&p.roles.every(r=>roles.has(r))&&p.contrastWith.length&&p.contrastWith.every(id=>allids.has(id)&&id!==q.id)&&p.rationale,q.id+" pedagogy");
check(d.length===3&&new Set(d.map(x=>x.choice)).size===3&&d.every(x=>q.choices.includes(x.choice)&&x.choice!==q.answer&&categories.has(x.category)&&x.reason&&x.confidence==="medium"),q.id+" diagnostics");
const [s,h,k,c]=q.shape;
if(m.concept==="ouv.mineure"){check(s<5&&h<5&&(q.h>=12&&q.h<=14||q.h>=18&&q.h<=19)&&q.answer===(k===c?(k===3?"1♣":"1♦"):k>c?"1♦":"1♣"),q.id+" opening rule");}
if(m.concept==="sa2.stayman.reponse")check(q.h>=20&&q.h<=21&&q.answer===(s===4&&h===4?"3SA":s===4?"3♠":h===4?"3♥":"3♦"),q.id+" Stayman rule");
if(m.concept==="sa2.texas.reponse")check(q.h>=20&&q.h<=21&&s>=3&&q.answer==="3♠",q.id+" fit rectification");
if(m.concept==="sa1.texas_mineur")check(Math.max(s,h)<4&&((c>=6&&q.answer==="2♠")||(k>=6&&q.answer==="3♣")),q.id+" minor transfer");
if(q.id.endsWith("005"))check(q.h===7&&h===3&&s===4&&q.answer==="2♥",q.id+" 5-3");
if(q.id.endsWith("006"))check(q.h===7&&h===2&&s===4&&q.answer==="1♠",q.id+" non-fit");
if(q.id.endsWith("007"))check(q.h===7&&Math.max(s,h)<4&&q.answer==="Passe",q.id+" invitation boundary");
if(q.id.endsWith("013"))check(s===6&&h<4&&k<4&&c<4&&q.answer==="2♦",q.id+" Multi-Landy");
if(q.id.endsWith("014"))check(s===5&&k===5&&q.answer==="3♣",q.id+" Michaels");
}
return {base:old.length,concepts:concepts.size,new:additions.length,projected:ids.size,checks:"PASS"};
};
const result=verify(old,meta,additions,14);
assert.equal(result.projected,1893);
console.log(JSON.stringify(result));
