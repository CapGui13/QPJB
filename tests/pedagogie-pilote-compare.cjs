'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dest=process.argv[2]||'pilot-output';
const baseline=JSON.parse(fs.readFileSync('audits/pedagogie-pilote-20261127/reference-ids.json','utf8')).rows;
const candidate=JSON.parse(fs.readFileSync(path.join(dest,'baseline.json'),'utf8'));
const clean=x=>String(x??'').replace(/\|/g,'\\|').replace(/\r?\n/g,' ');
const md=['# Pilote S1–S5 — comparatif avant/après','Référence 46033077400, mêmes profils et graine. Les réponses aux nouvelles questions sont simulées, pas une mesure de progrès réel.'];
const errors=[],checks=[],summary=[];
const verify=(ok,why)=>{checks.push({ok:!!ok,why});if(!ok)errors.push(why)};
verify(candidate.length===15,'15 sessions');
for(const r of candidate){
 const b=baseline.find(x=>x.profile===r.profile&&x.s===r.session),a=r.items;
 assert(b,'reference session missing');
 const key=r.profile+' S'+r.session,old=new Set(b.items.map(q=>q.id)),now=new Set(a.map(q=>q.id));
 const out=b.items.filter(q=>!now.has(q.id)),added=a.filter(q=>!old.has(q.id));
 summary.push({profile:r.profile,s:r.session,removed:out.map(q=>q.id),added:added.map(q=>q.id),sameOrder:b.items.every((q,i)=>q.id===a[i].id),correct:a.filter(q=>q.result==='correct').length});
 verify(a.length===10&&now.size===10,key+' ten distinct questions');
 if(r.session===1){
  for(const [bid,n] of [['1♣',2],['1♦',2],['1♥',1],['1♠',1],['1SA',1],['Passe',3]])verify(a.filter(q=>q.answer===bid).length===n,key+' quota '+bid);
  verify(a.some(q=>q.answer==='1♣'&&q.shape[2]===3&&q.shape[3]===3)&&a.some(q=>q.answer==='1♣'&&q.shape[3]>q.shape[2]),key+' clubs equal vs long');
  verify(a.some(q=>q.answer==='1♦'&&q.shape[2]===4&&q.shape[3]===4)&&a.some(q=>q.answer==='1♦'&&q.shape[2]>q.shape[3]),key+' diamonds equal vs long');
  verify(a.some(q=>q.answer==='Passe'&&q.h>=10&&q.h<12),key+' borderline pass');
 }
 if(r.session===2){
  verify(a.some(q=>q.theme==='ouv'&&q.answer==='1♣'&&q.shape[2]===3&&q.shape[3]===3)&&a.some(q=>q.theme==='ouv'&&q.answer==='1♦'&&q.shape[2]===4&&q.shape[3]===4),key+' existing minor tie guard');
  verify(a.filter(q=>q.concept==='majeur.soutien'&&/^2[♥♠]$/.test(q.answer)&&q.shape[q.answer==='2♠'?0:1]===3).length>=2,key+' 2 simple major fits');
 }
 if(r.session===3){
  verify(a.filter(q=>q.concept==='ouv.sa2').length<=1,key+' at most one 2NT opening');
  verify(['♥','♠'].some(c=>{const x=a.filter(q=>q.concept==='majeur.soutien'&&q.auction.length===1&&q.auction[0].endsWith('1'+c)&&q.shape[c==='♠'?0:1]===3);return x.some(q=>q.answer==='Passe')&&x.some(q=>q.answer==='2'+c)}),key+' same-major 3-trump pass/raise contrast');
 }
 if(r.session===4){
  verify(['Passe','2SA','3SA'].every(b=>a.some(q=>q.concept==='sa1.seuil'&&q.answer===b)),key+' 3 NT thresholds');
  if(r.profile==='autonome')verify(a.filter(q=>q.concept==='red.base').length===3,key+' 3 redemands');
  if(r.profile==='faible')verify(a.every(q=>q.concept!=='red.base'),key+' fragile profile no premature redemands');
 }
 if(r.session===5)verify(a.every(q=>!/^sa1\.(texas|stayman)(\.|$)/.test(q.concept)),key+' no Texas or Stayman yet');
 md.push('','## '+key,'| # | Avant (ID / réponse) | Après (ID / réponse) | Concept après | Main / H | Corrigé après |','|---|---|---|---|---|---|');
 for(let i=0;i<10;i++){const o=b.items[i],q=a[i];md.push('| '+[i+1,o.id+' / '+o.answer,q.id+' / '+q.answer,q.concept,(q.hand||[]).map(x=>x.join(' ')).join(' / ')+' — '+q.h+' H',q.explain].map(clean).join(' | ')+' |')}
 md.push('','Retirés : '+out.map(q=>q.id).join(', ')+' ; ajoutés : '+added.map(q=>q.id).join(', ')+'.');
}
const transitionPath=path.join(dest,'transitions.json');
if(process.env.PILOT_TRANSITION==='1'){
 const extra=JSON.parse(fs.readFileSync(transitionPath,'utf8'));
 const simple=new Set(['SEF-037-1','SEF-038-1','SEF-N082-2','SEF-N085-1','SEF-V44-015','SEF-V44-016','SEF-V49-017','SEF-C-003','V2-M2-030']);
 const complex=new Set(['SEF-039-2','SEF-039-1','SEF-040-2','SEF-N084-1','SEF-N087-2','V2-M2-018']);
 verify(extra.length===15,'S6–10: fifteen additional sessions');
 md.push('','## Transition S6–10');
 for(const profile of ['autonome','intermediaire','faible']){
  let elementary=false,stayman=false;
  for(const r of extra.filter(x=>x.profile===profile).sort((a,b)=>a.session-b.session)){
   const key=profile+' S'+r.session, a=r.items;
   verify(a.length===10&&new Set(a.map(q=>q.id)).size===10,key+' ten distinct questions');
   verify(elementary||!a.some(q=>complex.has(q.id)),key+' no complex Texas before completed elementary session');
   verify(elementary||stayman||!a.some(q=>q.concept==='sa1.stayman'),key+' first Stayman after elementary Texas');
   md.push('- '+key+': '+a.filter(q=>/^sa1\.(texas|stayman)/.test(q.concept)).map(q=>q.id+' '+q.answer+' '+q.result).join(', '));
   elementary||=a.some(q=>simple.has(q.id));stayman||=a.some(q=>q.concept==='sa1.stayman');
  }
  if(profile==='autonome')verify(elementary&&stayman,'autonomous profile receives both deferred conventions by S10');
 }
}
md.push('','## Contrôles',...checks.map(x=>'- '+(x.ok?'PASS':'FAIL')+' '+x.why));
fs.writeFileSync(path.join(dest,'comparatif.md'),md.join('\n')+'\n');
fs.writeFileSync(path.join(dest,'comparatif.json'),JSON.stringify({summary,checks,errors},null,2));
console.log('PILOT_COMPARE '+JSON.stringify({summary,checks:checks.length,errors}));
if(errors.length)process.exitCode=1;
