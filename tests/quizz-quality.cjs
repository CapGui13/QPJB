'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match);
const db=JSON.parse(match[1]),xs=db.exercises;
assert.equal(xs.length,993);assert.equal(db.themes.length,22);
const norm=a=>a.map(v=>v.replace(/\s*\([^)]*\)\s*/g,'').trim()).join('|');
const order={'♣':0,'♦':1,'♥':2,'♠':3,SA:4};
const rank=b=>{const m=String(b).match(/^([1-7])(♣|♦|♥|♠|SA)$/);return m?(+m[1]-1)*5+order[m[2]]:null;};
const byAuction=new Map();
for(const x of xs){const k=norm(x.auction);if(!byAuction.has(k))byAuction.set(k,[]);byAuction.get(k).push(x)}
const rows=[];
for(const x of xs){
 assert.equal(x.choices.length,4,x.id);assert.equal(new Set(x.choices).size,4,x.id);
 assert.ok(x.choices.includes(x.answer),x.id);
 const last=x.auction.at(-1)||'',lastContract=x.auction.map(v=>rank(v.slice(v.indexOf(':')+1).replace(/\s*\([^)]*\).*/, '').trim())).filter(z=>z!==null).at(-1);
 const forced=x.auction.some(v=>/Vous : 2♣ \((Roudi|Drury)\)/.test(v))||x.auction[0]==='Partenaire : 2♣ (fort indéterminé)';
 const noFit=x.auction.some(v=>/Vous : [23]♣/.test(v))&&/Partenaire : [23]♦/.test(last);
 const other=x.choices.filter(v=>v!==x.answer).map(bid=>{
  const r=rank(bid);if(r!==null&&lastContract!==undefined)assert.ok(r>lastContract,x.id+' '+bid);
  const peers=(byAuction.get(norm(x.auction))||[]).filter(y=>y.id!==x.id&&y.answer===bid);
  const distance=Math.min(Infinity,...peers.map(y=>Math.abs(y.h-x.h)+1.5*x.shape.reduce((a,v,i)=>a+Math.abs(v-y.shape[i]),0)));
  const gap=r!==null&&rank(x.answer)!==null?Math.abs(r-rank(x.answer)):null;
  const warnings=[];
  if(bid==='Passe'&&forced)warnings.push('Passe sur relais');
  if(bid==='3SA'&&x.h<=6&&/Partenaire : 1SA/.test(last))warnings.push('Manche sans force');
  if(noFit&&/^4[♥♠]$/.test(bid))warnings.push('Fit majeur nié');
  if(gap!==null&&gap>=11)warnings.push('Écart de palier');
  const score=(Number.isFinite(distance)?distance<=6?4:distance<=11?3:2:1)+(gap!==null?(gap<=5?1:gap>=11?-2:0):0)
   +(x.whyNot?.bid===bid?1:0)-2*warnings.filter(v=>v!=='Écart de palier').length;
  return {bid,peer:peers.length,score,warnings};
 });
 const low=other.filter(o=>o.score<=1).length;
 rows.push({id:x.id,theme:x.theme,level:x.difficulty,h:x.h,shape:x.shape.join('-'),
  auction:x.auction.join(' / '),answer:x.answer,choices:x.choices.join(' / '),options:other,
  grade:low>=2?'REVUE PRIORITAIRE':low?'A EXAMINER':'SIGNAL FAVORABLE',
  flags:[...new Set(other.flatMap(o=>o.warnings))],explanation:x.whyNot?.reason||''});
}
const stats={version:db.version,total:rows.length,choices:rows.length*4,wrong:rows.length*3,
 themes:db.themes.length,auctionPatterns:byAuction.size,
 peerSupported:rows.reduce((n,r)=>n+r.options.filter(o=>o.peer>0).length,0),
 favourable:rows.filter(r=>r.grade==='SIGNAL FAVORABLE').length,
 toExamine:rows.filter(r=>r.grade==='A EXAMINER').length,
 priority:rows.filter(r=>r.grade==='REVUE PRIORITAIRE').length,
 explained:xs.filter(x=>x.whyNot).length};
const dir=path.join(__dirname,'..','artifacts','quizz-content');
fs.mkdirSync(dir,{recursive:true});
const quote=s=>'"'+String(s??'').replace(/"/g,'""')+'"';
const headers=['id','rubrique','niveau','points_H','distribution','sequence','bonne_reponse','quatre_choix','diagnostic','erreurs_avec_analogue_dans_la_base','alertes','faux_1','faux_2','faux_3','score_1','score_2','score_3','commentaire_pedagogique'];
const csv=[headers.join(','),...rows.map(r=>[r.id,r.theme,r.level,r.h,r.shape,r.auction,r.answer,r.choices,r.grade,
 r.options.filter(o=>o.peer>0).length,r.flags.join(' ; '),...r.options.map(o=>o.bid),...r.options.map(o=>o.score),r.explanation
].map(quote).join(','))].join('\n')+'\n';
fs.writeFileSync(path.join(dir,'qualite-993.csv'),csv);
const md=[
'# QPJB — audit automatique des 993 exercices',
'',
'Version du catalogue : '+stats.version,
'',
'**Couverture :** '+stats.total+' exercices, '+stats.choices+' choix, '+stats.wrong+' mauvaises propositions et '+stats.themes+' rubriques.',
'',
'Le signal calculé combine la légalité dans la séquence, la proximité de palier, les ambiguïtés de relais/fits et l’existence de cas comparables où la même proposition est correcte.',
'',
'**Limite importante :** les indicateurs automatiques ne prouvent pas qu’une mauvaise réponse est pédagogiquement optimale. Certaines bonnes erreurs de débutant ne sont jamais correctes dans le catalogue. Les cas marqués sont à lire individuellement.',
'',
'- Options observées comme correctes dans au moins un autre exercice de même séquence : '+stats.peerSupported+' / '+stats.wrong+'.',
'- Signal favorable : '+stats.favourable+' ; à examiner : '+stats.toExamine+' ; revue prioritaire : '+stats.priority+'.',
'- Explications explicites de piège déjà présentes : '+stats.explained+'.',
'',
'## Couverture par rubrique',
'',
'| Rubrique | Exercices | Revues prioritaires |',
'|---|---:|---:|',
...db.themes.map(t=>'| '+t.name+' | '+rows.filter(r=>r.theme===t.id).length+' | '+rows.filter(r=>r.theme===t.id&&r.grade==='REVUE PRIORITAIRE').length+' |'),
'',
'## Exercices signalés pour une revue prioritaire',
'',
'| ID | Thème | Bonne enchère | Trois distracteurs |',
'|---|---|---|---|',
...rows.filter(r=>r.grade==='REVUE PRIORITAIRE').map(r=>'| '+r.id+' | '+r.theme+' | '+r.answer+' | '+r.options.map(o=>o.bid).join(', ')+' |'),
'',
'**Le CSV qualite-993.csv contient une ligne pour chacun des 993 exercices**, avec la séquence, la réponse, les quatre propositions, un diagnostic et trois scores individuels. La revue du système SEF et des contextes incomplets reste un travail pédagogique distinct.',
''
].join('\n');
fs.writeFileSync(path.join(dir,'qualite-993.md'),md);
console.log('Quizz quality: '+JSON.stringify(stats));
