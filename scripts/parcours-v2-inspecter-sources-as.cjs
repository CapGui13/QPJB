'use strict';
// QPJB AS : reconnaissance des formats sources, lecture seule.
// Ne publie ni ne modifie aucun exercice.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=path=>fs.readFileSync(path,'utf8');
const sandbox={console:{log(){}},setTimeout(){},clearTimeout(){}};
const js=[
  read(path.join(root,'entrainement/training-data-bootstrap.js')),
  read(path.join(root,'entrainement/training-data-bidding.js')),
  read(path.join(root,'entrainement/training-originals-data.js'))
].join('\n;\n');
const result=vm.runInNewContext(js+'\n;({D,QPJB_ORIGINALS})',sandbox,{timeout:20000});
const D=result.D,originals=result.QPJB_ORIGINALS;
const html=read(path.join(root,'quizz.html'));
const tag='<script id="training-data" type="application/json">';
const start=html.indexOf(tag),end=html.indexOf('</script>',start+tag.length);
if(start<0||end<0)throw Error('Catalogue Quiz SEF inaccessible');
const quiz=JSON.parse(html.slice(start+tag.length,end)).exercises;
const count=(xs,key)=>Object.fromEntries([...new Set(xs.map(x=>String(x[key]??'')))].sort().map(k=>[k,xs.filter(x=>String(x[key]??'')===k).length]));
const inspect=(xs,n)=>xs.slice(0,n).map(q=>({
  id:q.id,keys:Object.keys(q),repr:JSON.stringify(q).slice(0,1350)
}));
const output={
 schema:'QPJB_AS_SOURCE_SHAPES_1',sourceFiles:['entrainement/training-data-bootstrap.js',
 'entrainement/training-data-bidding.js','entrainement/training-originals-data.js','quizz.html'],
 totals:{bidding:D.bidding.length,play:D.play.length,originals:originals.length,
   originalsBidding:originals.filter(o=>o.category==='encheres').length,
   quiz:quiz.length,quizOpenings:quiz.filter(q=>q.theme==='ouv').length},
 categoryDeclared:D.categories.filter(x=>['ouverture','barrage'].includes(x.id)),
 biddingCategories:count(D.bidding,'category'),
 biddingCategoryAlt:count(D.bidding,'cat'),
 biddingExamples:inspect(D.bidding,2),
 openingExamples:inspect(D.bidding.filter(q=>['ouverture','barrage'].includes(q.category||q.cat)),4),
 originalExamples:inspect(originals,2),
 quizOpeningExamples:inspect(quiz.filter(q=>q.theme==='ouv'),2)
};
console.log('QPJB-AS-SHAPE '+JSON.stringify(output));
