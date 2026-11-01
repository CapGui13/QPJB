'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const m=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(m,'The original quiz database is embedded in quizz.html');
const exercises=JSON.parse(m[1]).exercises;
const allowed=/^(?:[1-7](?:♣|♦|♥|♠|SA)|Passe|Contre|Surcontre)$/;
const rank=s=>{
 const m=String(s).match(/^([1-7])(♣|♦|♥|♠|SA)$/);
 return m?(Number(m[1])-1)*5+{'♣':0,'♦':1,'♥':2,'♠':3,SA:4}[m[2]]:null;
};
const illegal=[],noNearMiss=[],byTheme={},correctionExamples=[];
for(const x of exercises){
 assert.equal(x.choices.length,4,'Exactly four options: '+x.id);
 assert.equal(new Set(x.choices).size,4,'All options differ: '+x.id);
 assert.ok(x.choices.includes(x.answer),'Correct bid is offered: '+x.id);
 let lastContract=null;
 for(const call of x.auction){
  const bid=call.slice(call.indexOf(':')+1).replace(/\s*\([^)]*\)\s*$/,'').trim();
  const r=rank(bid);if(r!==null)lastContract=r;
 }
 let nearMiss=0;
 for(const bid of x.choices){
  assert.match(bid,allowed,'A choice must be a real bridge bid: '+x.id+' '+bid);
  const r=rank(bid);
  if(lastContract!==null&&r!==null&&r<=lastContract){
   illegal.push({id:x.id,auction:x.auction,choice:bid,correct:x.answer});
  }
  if(bid!==x.answer&&rank(x.answer)!==null&&r!==null&&Math.abs(r-rank(x.answer))<=5)nearMiss++;
  if(bid==='Contre'&&x.auction.length){
   const last=x.auction.at(-1);
   if(/^(Partenaire|Vous|Réponse)\s*:/.test(last)&&!/\bPasse\b/i.test(last)){
    illegal.push({id:x.id,auction:x.auction,choice:bid,reason:'Cannot double own partnership bid'});
   }
  }
  if(bid==='Surcontre'&&!x.auction.some(call=>/^Adversaire\s*:\s*Contre/i.test(call))){
   illegal.push({id:x.id,auction:x.auction,choice:bid,reason:'No opposing double is described'});
  }
 }
 if(rank(x.answer)!==null&&nearMiss===0)noNearMiss.push({id:x.id,answer:x.answer,choices:x.choices});
 const theme=byTheme[x.theme]||(byTheme[x.theme]={questions:0,nearContractQuestions:0});
 theme.questions++;if(nearMiss>0)theme.nearContractQuestions++;
}
const report={version:JSON.parse(m[1]).version,questions:exercises.length,choices:exercises.length*4,
 impossibleChoices:illegal,contractAnswersWithoutNearbyBid:noNearMiss,byTheme,
 methodology:'Un candidat « proche » est un contrat à cinq rangs ou moins de la bonne enchère. La proximité et la légalité sont nécessaires mais ne certifient pas la valeur pédagogique individuelle de chaque distracteur.',
 policy:'Ne pas produire des propositions arbitraires à la volée. Toute modification est spécifique à la séquence, et la bonne réponse d’origine reste inchangée.'};
const output=path.join(__dirname,'..','artifacts','quizz-content');
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,'distractor-audit.json'),JSON.stringify(report,null,2)+'\n');
const md='# Audit des quatre propositions du Quizz\n\n'
 +'- Exercices : **'+report.questions+'**.\n'
 +'- Choix proposés : **'+report.choices+'**.\n'
 +'- Propositions impossibles selon la séquence : **'+illegal.length+'**.\n'
 +'- Questions à réponse par contrat sans autre contrat proche : **'+noNearMiss.length+'**.\n\n'
 +'**Méthode :** '+report.methodology+'\n\n'
 +'**Limite :** une enchère légale et proche n’est pas nécessairement un bon piège. La pertinence des quatre propositions reste une question pédagogique à examiner cas par cas.\n';
fs.writeFileSync(path.join(output,'distractor-audit.md'),md);
assert.equal(exercises.length,993,'The 993 SEF questions remain intact');
assert.deepEqual(illegal,[],'Do not suggest impossible bids as distractors');
assert.deepEqual(noNearMiss,[],'Each contract answer must have a nearby plausible contracting alternative');
// Upgrade pédagogique : rendre explicite la couverture des trois mauvaises enchères.
// Ce rapport est un outil de revue, pas une génération automatique de corrigés SEF.
const comparisonRows=[];
for(const x of exercises){
 const mentioned=x.whyNot?.bid&&x.choices.includes(x.whyNot.bid)&&x.whyNot.bid!==x.answer;
 const wrong=x.choices.filter(b=>b!==x.answer);
 for(const bid of wrong){
  const documented=Boolean(mentioned&&x.whyNot.bid===bid&&x.whyNot.reason);
  const contractRank=rank(bid);
  const answerRank=rank(x.answer);
  const distance=(contractRank!==null&&answerRank!==null)?Math.abs(contractRank-answerRank):null;
  const isVeryWeak=Number(x.h)<=5;
  const ambitious=/^(?:3SA|4[♥♠]|5[♣♦])$/.test(bid);
  const reasons=[];
  if(!documented)reasons.push('comparaison individuelle manquante');
  if(isVeryWeak&&ambitious)reasons.push('enchère haute avec main très faible : revoir le piège');
  if(distance!==null&&distance>10)reasons.push('contrat éloigné de la bonne enchère');
  comparisonRows.push({id:x.id,theme:x.theme,answer:x.answer,bid,documented,
   h:x.h,auction:x.auction.join(' / '),reasons:reasons.join(' ; ')});
 }
}
const quoteCsv=value=>'"'+String(value??'').replace(/"/g,'""')+'"';
const comparisonCsv=[
 ['id','rubrique','bonne_enchere','mauvaise_proposition','expliquee_individuellement','points_H','sequence','points_a_revoir'].join(','),
 ...comparisonRows.map(r=>[r.id,r.theme,r.answer,r.bid,r.documented?'oui':'non',r.h,r.auction,r.reasons]
 .map(quoteCsv).join(','))
].join('\n')+'\n';
fs.writeFileSync(path.join(output,'comparaison-2979-propositions.csv'),comparisonCsv);
const individuallyExplained=comparisonRows.filter(r=>r.documented).length;
const needsManualReview=comparisonRows.filter(r=>r.reasons.includes('enchère haute')||r.reasons.includes('contrat éloigné')).length;
const comparisonMarkdown=[
 '# Quizz QPJB — couverture des explications comparatives',
 '',
 '- Exercices conservés : **'+exercises.length+'**.',
 '- Mauvaises propositions examinées : **'+comparisonRows.length+'**.',
 '- Propositions avec explication individuelle explicite : **'+individuallyExplained+'**.',
 '- Propositions encore sans explication individuelle : **'+(comparisonRows.length-individuallyExplained)+'**.',
 '- Alertes heuristiques de pièges à revoir : **'+needsManualReview+'** (non assimilées à des erreurs).',
 '',
 'Le fichier CSV `comparaison-2979-propositions.csv` recense **chaque** mauvaise option,',
 'la séquence et les points H, ainsi que les motifs de revue. Les indications ne',
 'valident ni ne réfutent automatiquement les enchères du référentiel SEF.',
 'Les corrigés restent inchangés tant que la pertinence individuelle n’est pas vérifiée.',
 '',
 '## Règle de travail',
 '',
 'Pour chaque question, comparer les trois mauvaises enchères à la bonne :',
 'identifier la confusion de force, de fit, de longueur, de palier ou de convention.',
 'Ne jamais produire trois explications génériques qui pourraient transformer',
 'une enchère défendable en « erreur » catégorique.',
 ''
].join('\n');
fs.writeFileSync(path.join(output,'comparaisons-pedagogiques.md'),comparisonMarkdown);
assert.equal(comparisonRows.length,2979,'Three distractors per SEF exercise are audited');
assert.equal(new Set(comparisonRows.map(r=>r.id+'|'+r.bid)).size,2979,
 'Each wrong bid is represented exactly once in the comparative audit');

console.log('Quizz distractors: PASS | '+exercises.length+' questions | '+report.choices+' options | no illegal contract bids | near misses present');
