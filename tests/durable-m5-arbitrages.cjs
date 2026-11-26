'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const report=read('audits/apprentissage-durable-20261126/m5/arbitrages-35.json'), original=read('audits/coherence-integrale-20261125/integration/arbitrages-finaux.json');
const {corpus,idConcept}=read('audits/apprentissage-durable-20261126/m5/corpus-verification.json');
const source=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const all=(function extract(s){let i=s.indexOf('"exercises":[')+12,d=0,q=false,e=false;for(let j=i;j<s.length;j++){let c=s[j];if(q){if(e)e=false;else if(c==='\\')e=true;else if(c==='"')q=false;continue}if(c==='"')q=true;else if(c==='[')d++;else if(c===']'&&!--d)return JSON.parse(s.slice(i,j+1))}throw Error("catalogue introuvable")})(source);
const by=Object.fromEntries(all.map(x=>[x.id,x]));
let n=0;const ok=(x,m)=>{n++;if(!x)throw Error(m)};
ok(report.decisions.length===35&&original.decisions.length===35&&new Set(report.decisions.map(x=>x.id)).size===35,'35 unique');
let direct=0;
for(const d of original.decisions){
 const e=report.decisions.find(x=>x.id===d.id);ok(e&&e.historicalDecision===d.decision&&e.answerAfter===d.answerAfter,d.id+' decision');
 ok(by[d.id]?.answer===d.answerAfter&&e.catalogueAnswerVerified,d.id+' catalogue');
 ok(idConcept[d.id]===e.concept&&e.disposition.length>20,d.id+' scope');
 const l=corpus[e.concept],examples=[...l.examples,...(l.extensions||[]).flatMap(x=>x.examples)].filter(x=>x.id===d.id);
 ok(e.usedAsExample===(examples.length>0),d.id+' source usage');
 if(examples.length)direct++;
 const cross=Object.entries(corpus).filter(([c,l])=>c!==e.concept&&[...l.examples,...(l.extensions||[]).flatMap(x=>x.examples)].some(x=>x.id===d.id)).map(([c])=>c);
 ok(JSON.stringify(cross)===JSON.stringify(e.crossConceptExamples||[]),d.id+' cross-concept usage');
 for(const x of examples){const a=by[x.id];ok(x.answer===a.answer&&x.comment===a.explain&&x.context===a.context&&JSON.stringify(x.hand)===JSON.stringify(a.hand)&&JSON.stringify(x.auction)===JSON.stringify(a.auction),d.id+' exact example')}
}
ok(direct===report.counts.directExamples&&35-direct===report.counts.notUsedAsExamples,'counts');
ok(corpus['mineur.base'].rule.includes('12 HL inclus')&&corpus['mineur.base'].reminder.includes('12 HL'),'priority boundary');
ok(corpus['majeur.base'].rule.includes('En silence adverse')&&corpus['majeur.base'].reminder.includes('sans fit ni intervention'),'2/1 scope');
ok(corpus['apres_inter.base'].extensions.find(x=>x.id==='m5-ext-37').rule.includes('non auto-forcing'),'competitive exception');
ok(corpus['fit.2sa'].rule.includes('3M direct')&&corpus['fit.2sa'].rule.includes('quatre atouts'),'3M not three cards');
ok(corpus['mineur.base'].extensions.find(x=>x.id==='m5-ext-24').rule.includes('ne sont pas obligatoires'),'natural 2SA holds');
ok(corpus['multilandy.reponse'].extensions.find(x=>x.id==='m5-ext-07').rule.includes('convenu entre partenaires'),'Landy local scope');
console.log({assertions:n,decisions:35,directExamples:direct,notUsedAsExamples:35-direct,scope:'targeted historical record; not universal convention validation'});
