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
const result=verify(old,meta,additions,30);
assert.equal(result.projected,1909);
const newRules=function(additions){
const check=(ok,m)=>{if(!ok)throw Error(m)};
const get=n=>additions.find(x=>x.exercise.id===`SEF-PN26-M1-${String(n).padStart(3,"0")}`).exercise;
const a=get(15),b=get(16),c=get(17),d=get(18),e=get(19);
check(a.h===11&&a.shape[1]===3&&Math.min(...a.shape)>=3&&a.auction[0]==="Vous : Passe"&&a.answer==="2♣","Drury boundary");
check(b.h===15&&b.shape[0]===2&&b.answer==="2♠"&&b.auction.at(-1)==="Adversaire : Passe","ordinary Texas");
check(c.h===15&&JSON.stringify(c.hand)===JSON.stringify(b.hand)&&c.auction.at(-1).includes("Contre")&&c.answer==="Passe","Texas doubled contrast");
check(d.h===15&&d.shape[0]===2&&d.answer==="Passe"&&e.h===15&&e.shape[0]===3&&e.answer==="3♠"&&JSON.stringify(d.auction)===JSON.stringify(e.auction),"minimum invitation contrast");
};
newRules(additions);
const rules3=function(additions){
const check=(ok,m)=>{if(!ok)throw Error(m)};
const get=n=>additions.find(x=>x.exercise.id===`SEF-PN26-M1-${String(n).padStart(3,"0")}`).exercise;
const a=get(20),b=get(21),c=get(22),d=get(23),e=get(24),f=get(25),g=get(26),h=get(27),i=get(28),j=get(29),k=get(30);
check(a.h===5&&Math.max(...a.shape)===4&&a.answer==="Passe","5H minor response");
check(b.h===5&&b.shape[1]===3&&Math.min(...b.shape)===3&&b.answer==="Passe","5 HLD support");
check(c.h===12&&c.shape[1]===3&&Math.min(...c.shape)===3&&c.answer==="2SA","12 HLD support");
check(d.h===10&&d.shape[1]===3&&d.shape[0]===2&&d.answer==="2SA","10 H + D");
check(e.h===6&&e.shape[0]<4&&e.shape[1]<4&&e.shape[2]===4&&e.shape[3]===4&&e.answer==="3SA","2SA minor 4-4");
check(f.h===10&&f.auction.length===0&&f.shape[3]===7&&["A","R","D","V","10","9"].every(x=>f.hand[3].includes(x))&&f.hand.slice(0,3).flat().every(x=>!["A","R"].includes(x))&&f.answer==="3SA","gambling");
const losers=s=>Math.min(3,s.length)-["A","R","D"].slice(0,Math.min(3,s.length)).filter(x=>s.includes(x)).length;
check(g.h===15&&g.shape[0]===5&&g.shape[3]===5&&g.hand.reduce((n,s)=>n+losers(s),0)===6&&g.answer==="1♠","six losers despite 15 H");
check(h.h===15&&h.shape[0]===3&&h.hand[1].every(x=>!["A","R","D","V"].includes(x))&&h.answer==="Surcontre","Texas fit without stopper");
check(i.h===17&&i.shape[3]===3&&i.hand[3].every(x=>!["A","R","D","V"].includes(x))&&i.answer==="3♣","maximum without complement");
check(j.h===21&&j.shape[3]===2&&j.answer==="3SA","2SA maximum without club support");
check(k.h===21&&k.shape[1]===3&&k.shape[0]===2&&k.answer==="4♥","5-5 game choice");
};
rules3(additions);
const suits=['♣','♦','♥','♠','SA'];
function rank(b){const m=b.match(/^([1-7])(♣|♦|♥|♠|SA)$/);return m?(Number(m[1])-1)*5+suits.indexOf(m[2]):-1;}
for(const {exercise:q} of additions){const last=q.auction.flatMap(s=>{const m=s.match(/:\s*([1-7](?:♣|♦|♥|♠|SA))/);return m?[m[1]]:[]}).at(-1);for(const bid of q.choices){if(rank(bid)>=0&&last)assert.equal(rank(bid)>rank(last),true,q.id+' non-rising '+bid);if(bid==='Surcontre')assert.equal(q.auction.at(-1)?.includes('Contre'),true,q.id+' surcontre');}}
console.log(JSON.stringify(result));
