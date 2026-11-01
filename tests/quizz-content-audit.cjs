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

const familyVariants=[];
for(const [family,ids] of groups){
 if(ids.length<2)continue;
 const members=ids.map(id=>xs.find(x=>x.id===id));
 const reference=members[0];
 const sameShape=members.every(x=>JSON.stringify(x.shape)===JSON.stringify(reference.shape));
 const sameAuction=members.every(x=>JSON.stringify(x.auction)===JSON.stringify(reference.auction));
 const sameAnswer=members.every(x=>x.answer===reference.answer);
 const sameH=members.every(x=>x.h===reference.h);
 const hcps=members.map(x=>x.h);
 const sameText=members.every(x=>x.context===reference.context&&x.explain===reference.explain);
 familyVariants.push({
  family,
  ids,
  theme:reference.theme,
  hcp:hcps,
  hcpSpread:Math.max(...hcps)-Math.min(...hcps),
  sameShape,sameAuction,sameAnswer,sameText,sameH,
  situationDifference:!sameShape||!sameAuction||!sameAnswer?'decision-contrast':
    sameH?'honor-repartition':'hcp-variation',
  review:'préserver les variantes ; évaluer manuellement si la différence apporte un apprentissage distinct'
 });
}
const familyVariantCounts=count(familyVariants,x=>x.situationDifference);

const report={
 version:data.version,
 total:xs.length,
 pedagogicalFamilies:groups.size,
 familiesWithVariants:[...groups.values()].filter(g=>g.length>1).length,
 familyVariantTypes:familyVariantCounts,
 familyVariantDetail:familyVariants,
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
const csvEscape=value=>'"'+String(value).replace(/"/g,'""')+'"';
const headers=['family','ids','theme','hcp','hcpSpread','sameShape','sameAuction','sameAnswer','sameText','situationDifference','review'];
const csv=[headers.join(','),
 ...familyVariants.map(x=>headers.map(k=>csvEscape(Array.isArray(x[k])?x[k].join('|'):x[k])).join(','))].join('\n')+'\n';
fs.writeFileSync(path.join(output,'variant-families.csv'),csv);

const rows=report.shortestTopics.map(t=>'- '+t.name+' : '+t.count+' exercices').join('\n');
const md='# Rapport automatique Quizz — '+data.version+'\n\n'
 +'Exercices : **'+report.total+'**, familles : **'+report.pedagogicalFamilies+'**, variantes de familles : **'+report.familiesWithVariants+'**.\n\n'
 +'Textes identiques supplémentaires : **'+report.repeatedTextExtraExercises+'**, situations main+séquence identiques : **'+report.exactSituationDuplicates.length+'**.\n\n'
 +'Corrigés contrastifs : **'+report.withTeachingContrast+'**.\n\n'
 +'Familles à variantes : **'+familyVariants.length+'**, dont '+(familyVariantCounts['hcp-variation']||0)+' variations de force, '+(familyVariantCounts['honor-repartition']||0)+' variations à force égale, '+(familyVariantCounts['decision-contrast']||0)+' contrastes de décision.\n\n'
 +'## Rubriques les moins couvertes\n'+rows+'\n\n'
 +'**Attention :** un texte répété peut accompagner une main différente. Ne pas supprimer ces exercices sans revue de l’intérêt pédagogique. Aucune probabilité de donne n’est déduite de ces volumes.\n';
fs.writeFileSync(path.join(output,'report.md'),md);
assert.equal(report.total,993,'Expected total for audit C02');
assert.equal(report.withTeachingContrast,78,'Expected C02 teaching contrasts');
assert.equal(familyVariants.length,203,'All 203 existing variant families must remain preserved');
assert.equal(familyVariantCounts['decision-contrast']||0,0,'Baseline family variants must keep their original decision');
console.log('Quizz content audit: PASS | '+report.total+' exercises | '+report.pedagogicalFamilies+' families | '+report.withTeachingContrast+' contrasted explanations | '+report.repeatedTextExtraExercises+' reused wordings');
