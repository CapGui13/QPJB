'use strict';
// Audit du contenu Quizz : les alertes pédagogiques sont des pistes, les incohérences structurelles bloquent la CI.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Quizz data must be embedded');
const data=JSON.parse(match[1]),xs=data.exercises;
const count=(items,fn)=>{
 const map=new Map();
 for(const item of items){const k=fn(item);map.set(k,(map.get(k)||0)+1)}
 return Object.fromEntries([...map].sort((a,b)=>String(a[0]).localeCompare(String(b[0]),'fr')));
};
const groups=new Map(),situations=new Map(),wording=new Map(),duplicateSituations=[];
for(const x of xs){
 const family=x.caseFamily||x.id.replace(/-\d+$/,'');
 const a=groups.get(family)||[];a.push(x.id);groups.set(family,a);
 const key=JSON.stringify([x.hand,x.auction]);
 const existing=situations.get(key);
 if(existing)duplicateSituations.push({id:x.id,first:existing,answer:x.answer});
 else situations.set(key,x.id);
 const textual=JSON.stringify([x.auction,x.context,x.answer,x.explain]);
 const prior=wording.get(textual)||[];
 prior.push(x.id);
 wording.set(textual,prior);
 if(x.whyNot){
  assert.ok(x.takeaway&&x.whyNot.reason,'Contrast must include reason and takeaway: '+x.id);
  assert.ok(x.choices.includes(x.whyNot.bid)&&x.whyNot.bid!==x.answer,
    'Contrast must refer to an actual incorrect option: '+x.id);
 }
}
assert.deepEqual(duplicateSituations,[],'Duplicate hand and auction combinations must be reviewed before publishing');
const sameTexts=[...wording.values()].filter(ids=>ids.length>1);
const report={
 version:data.version,
 total:xs.length,
 pedagogicalFamilies:groups.size,
 familiesWithVariants:[...groups.values()].filter(g=>g.length>1).length,
 exactSituationDuplicates:duplicateSituations,
 repeatedTextGroups:sameTexts.length,
 repeatedTextExtraExercises:sameTexts.reduce((n,a)=>n+a.length-1,0),
 repeatedTextExamples:sameTexts.slice(0,15),
 difficulty:count(xs,x=>String(x.difficulty)),
 topics:count(xs,x=>x.theme),
 stages:count(xs,x=>data.themes.find(t=>t.id===x.theme)?.stage||'unknown'),
 withTeachingContrast:xs.filter(x=>x.whyNot).length,
 withGenericContext:xs.filter(x=>/^Quelle enchère convient (?:à cette situation|dans cette séquence)/.test(String(x.context))).length,
 withoutAuction:xs.filter(x=>x.auction.length===0).length,
 shortestTopics:data.themes.map(t=>({name:t.name,topic:t.id,count:xs.filter(x=>x.theme===t.id).length,stage:t.stage})).sort((a,b)=>a.count-b.count).slice(0,8),
 policy:'Les répétitions et la couverture inégale sont des signaux de revue et non des erreurs démontrées. Aucune fréquence statistique réelle de donne n’est déduite du catalogue.'
};
const output=path.join(root,'artifacts','quizz-content');
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
const rows=report.shortestTopics.map(t=>'- '+t.name+' : '+t.count+' exercices').join('\n');
const md='# Rapport automatique Quizz — '+data.version+'\n\n'
 +'Exercices : **'+report.total+'**, familles : **'+report.pedagogicalFamilies+'**, variantes de familles : **'+report.familiesWithVariants+'**.\n\n'
 +'Textes identiques supplémentaires : **'+report.repeatedTextExtraExercises+'**, situations main+séquence identiques : **'+report.exactSituationDuplicates.length+'**.\n\n'
 +'Corrigés contrastifs : **'+report.withTeachingContrast+'**.\n\n'
 +'## Rubriques les moins couvertes\n'+rows+'\n\n'
 +'**Attention :** un texte répété peut accompagner une main différente. Ne pas supprimer ces exercices sans revue de l’intérêt pédagogique. Aucune probabilité de donne n’est déduite de ces volumes.\n';
fs.writeFileSync(path.join(output,'report.md'),md);
assert.equal(report.total,981,'Expected total for audit C01');
assert.equal(report.withTeachingContrast,54,'Expected C01 teaching contrasts');
console.log('Quizz content audit: PASS | '+report.total+' exercises | '+report.pedagogicalFamilies+' families | '+report.withTeachingContrast+' contrasted explanations | '+report.repeatedTextExtraExercises+' reused wordings');
