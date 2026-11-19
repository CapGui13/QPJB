'use strict';
// QPJB AT — identification prudente des exercices SOURCÉS d'ouverture.
// L'absence de correspondance de main dans le Quiz SEF n'est PAS une validation
// pédagogique ni une preuve de nouvelle famille. Aucune mutation applicative.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const rd=p=>fs.readFileSync(path.join(root,p),'utf8');
const paths=['entrainement/training-data-bootstrap.js',
 'entrainement/training-data-bidding.js',
 'entrainement/training-originals-data.js','quizz.html'];
const source=paths.map(p=>rd(p));
const datasets=vm.runInNewContext(source.slice(0,3).join('\n;\n')+
  '\n;({D,QPJB_ORIGINALS})',{console:{log(){}}},{timeout:30000});
const original=datasets.QPJB_ORIGINALS,bidding=datasets.D.bidding;
const tag='<script id="training-data" type="application/json">';
const i=source[3].indexOf(tag),j=source[3].indexOf('</script>',i+tag.length);
assert.ok(i>=0&&j>i,'Quiz SEF source not found');
const sef=JSON.parse(source[3].slice(i+tag.length,j)).exercises;
assert.equal(sef.length,1523);
assert.equal(bidding.length,638);
assert.equal(original.length,139);
const normRank=s=>s==='T'?'10':s;
const rankOrder=['A','R','D','V','10','9','8','7','6','5','4','3','2'];
function canonicalHand(hand){
  if(!Array.isArray(hand)||hand.length!==4)return {valid:false,key:null,why:'NOT_FOUR_SUITS'};
  const normalized=[];
  for(const row of hand){
    let cards=Array.isArray(row)?row.map(String):typeof row==='string'?row.trim().split(/\s+/):[];
    cards=cards.map(normRank).filter(x=>x&&x!=='-'&&x!=='—');
    if(!cards.every(x=>rankOrder.includes(x)))return {valid:false,key:null,why:'UNRECOGNIZED_CARD'};
    if(new Set(cards).size!==cards.length)return {valid:false,key:null,why:'DUPLICATE_IN_SUIT'};
    normalized.push(cards.sort((a,b)=>rankOrder.indexOf(a)-rankOrder.indexOf(b)).join(''));
  }
  const n=normalized.reduce((sum,s,idx)=>sum+
    (Array.isArray(hand[idx])?hand[idx].length:
    hand[idx].trim().split(/\s+/).filter(x=>x&&x!=='-'&&x!=='—').length),0);
  return n===13?{valid:true,key:normalized.join('|'),why:null,shape:hand.map(
    a=>Array.isArray(a)?a.length:a.split(/\s+/).filter(x=>x).length)}:
    {valid:false,key:null,why:'CARD_COUNT_'+n};
}
function counts(records,key){
 const result={};
 for(const q of records){
  const k=String(typeof key==='function'?key(q):q[key]??'');
  result[k]=(result[k]||0)+1;
 }
 return Object.fromEntries(Object.entries(result).sort((a,b)=>a[0].localeCompare(b[0],'fr')));
}
const sefOpen=sef.filter(q=>q.theme==='ouv');
assert.equal(sefOpen.length,84);
const sefByHand=new Map();
for(const q of sefOpen){
 const h=canonicalHand(q.hand);if(!h.valid)throw Error('Invalid SEF hand '+q.id);
 if(!sefByHand.has(h.key))sefByHand.set(h.key,[]);
 sefByHand.get(h.key).push({id:q.id,answer:q.answer,family:q.caseFamily||q.id,difficulty:q.difficulty});
}
const categories=new Set(['ouverture','barrage']);
const training=bidding.filter(q=>categories.has(q.theme));
const choices=training.map(q=>{
 const hand=canonicalHand(q.hand);
 const matches=hand.valid?sefByHand.get(hand.key)||[]:[];
 const audit={
  id:q.id,origin:'ENTRAINEMENT_QCM',type:q.theme,
  topic:q.topic,level:q.level,sourceRef:q.sourceRef||q.points||null,
  sourceRefAlternate:q.points||null,hand:q.hand,
  auction:q.auction,answer:q.correct,choices:q.choices,
  explanation:q.explanation,
  reviewStatus:q.reviewStatus||null,choiceStatus:q.choiceStatus||null,
  handValid:hand.valid,handError:hand.why,shape:hand.shape||null,
  matchingSEFHand:matches,
  exactHandMatched:matches.length>0,
  identicalAnswerMatches:matches.filter(m=>m.answer===q.correct).map(m=>m.id),
  workingStatus:!hand.valid?'SOURCE_INCOMPLETE':
   matches.length?'MAIN_DEJA_VUE_SEF_A_REVOIR':'MAIN_NON_IDENTIQUE_SEF_A_REVOIR'
 };
 return audit;
});
const originalsBidding=original.filter(q=>q.category==='encheres');
const sourceOpeningOriginals=originalsBidding.filter(q=>
 /(de quoi ouvrez|votre ouverture|choix de l.ouverture|quelle ouverture|ouvrez.vous|ouvrir ou non|ouvrez-vous)/i
  .test([q.prompt,q.situation].join(' ')));
const originalRecord=sourceOpeningOriginals.map(q=>({
 id:q.id,sourceId:q.sourceId,type:'ORIGINAL_SOURCE_LIBRE',
 prompt:q.prompt,situation:q.situation,solution:q.solution,
 printedAnswer:q.originalPrintedResponse||null,
 level:q.level,pdfSujet:q.pdfSujet,shaSujet:q.shaSujet,
 pdfCorrige:q.pdfCorrige,shaCorrige:q.shaCorrige,
 page:q.page,sourceRole:q.sourceRole,
 workingStatus:'EXPLICITEMENT_OUVERTURE_RETRANSCRIPTION_A_CONTROLER',
 warning:'Réponse libre ; pas un QCM utilisable tel quel. La main et la réponse doivent être revues sur le PDF.'
}));
const report={
 schema:'QPJB_V2_AT_OPENING_SOURCE_CANDIDATES_1',
 created:'2026-11-19',
 scope:'Diagnostic hors production. Ne pas toucher au Quiz SEF, ni injecter automatiquement des originaux.',
 sources:paths.map((p,k)=>({path:p,sha256:crypto.createHash('sha256').update(source[k]).digest('hex')})),
 catalog:{sef:sef.length,sefOpeningQuestions:sefOpen.length,
   sefOpeningFamilies:new Set(sefOpen.map(q=>q.caseFamily||q.id)).size,
   trainingBidding:bidding.length,originalComplement:original.length,
   originalComplementBidding:originalsBidding.length},
 openingBiddingCategories:{ouverture:training.filter(q=>q.theme==='ouverture').length,
   barrage:training.filter(q=>q.theme==='barrage').length},
 trainingSummary:{
   records:choices.length,byTheme:counts(choices,'type'),
   difficultyLevel:counts(choices,'level'),
   reviewStatus:counts(choices,'reviewStatus'),
   sourceReferencePresent:choices.filter(q=>!!q.sourceRef).length,
   validHands:choices.filter(q=>q.handValid).length,
   uniqueHandKeys:new Set(training.map(q=>canonicalHand(q.hand).key).filter(Boolean)).size,
   exactHandMatchedSEF:choices.filter(q=>q.exactHandMatched).length,
   exactHandAndAnswerMatchedSEF:choices.filter(q=>q.identicalAnswerMatches.length>0).length,
   noExactHandSEF:choices.filter(q=>q.handValid&&!q.exactHandMatched).length,
   invalidHands:choices.filter(q=>!q.handValid).map(q=>({id:q.id,reason:q.handError}))
 },
 originalsSummary:{total:original.length,enchere:originalsBidding.length,
   explicitlyOpeningPrompt:originalRecord.length,
   sourcePairsWithPdfHashes:originalRecord.filter(q=>q.shaSujet&&q.shaCorrige).length,
   ids:originalRecord.map(q=>q.id)},
 caution:'Aucune absence de doublon exact par main ne certifie que la notion est distincte. Entraînement n’est pas automatiquement un Quiz SEF; originaux à réponse libre nécessitent une adaptation et validation séparées.',
 trainingCandidates:choices,
 originalOpeningCandidates:originalRecord
};
const out=path.join(root,'artifacts/v2-at');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'inventaire-ouvertures.json'),JSON.stringify(report,null,2));
const md=[
 '# QPJB V2 — Pistes d’ouverture issues des corpus existants (AT)',
 '',
 'Audit automatisé en lecture seule. **Aucune insertion ni modification du Quiz SEF.**',
 '',
 '| Indicateur | Résultat |','|---|---:|',
 '| Questions d’ouverture du Quiz SEF | '+report.catalog.sefOpeningQuestions+' |',
 '| Familles d’ouverture du Quiz SEF | '+report.catalog.sefOpeningFamilies+' |',
 '| QCM d’Entraînement « ouverture » | '+report.openingBiddingCategories.ouverture+' |',
 '| QCM d’Entraînement « barrage » | '+report.openingBiddingCategories.barrage+' |',
 '| Mains Entraînement valides | '+report.trainingSummary.validHands+' |',
 '| Mains identiques à une main d’ouverture Quiz SEF | '+report.trainingSummary.exactHandMatchedSEF+' |',
 '| Mains distinctes par identité exacte de la main du Quiz SEF | '+report.trainingSummary.noExactHandSEF+' |',
 '| Originaux complémentaires de catégorie Enchères | '+report.originalsSummary.enchere+' |',
 '| Originaux complémentaires à question d’ouverture explicite | '+report.originalsSummary.explicitlyOpeningPrompt+' |',
 '',
 '> **Différent par les cartes n’est pas la preuve d’une compétence différente.**',
 '> Le PDF et le système adopté doivent être revus avant d’envisager une adaptation au parcours guidé.',
 '',
 'Les 38 fiches d’Entraînement et les originaux repérés (avec identifiants et sources)',
 'sont dans le JSON joint. Le nombre réellement intégrable n’est **pas encore décidé**.'
 ].join('\n');
fs.writeFileSync(path.join(out,'synthese-ouvertures.md'),md);
console.log('QPJB-AT-DIGEST '+JSON.stringify({
 catalog:report.catalog,
 training:report.trainingSummary,
 originals:report.originalsSummary,
 levelByTheme:report.openingBiddingCategories,
 candidatesSample:choices.slice(0,8).map(x=>({id:x.id,theme:x.type,
   level:x.level,source:x.sourceRef,answer:x.answer,matched:x.matchingSEFHand.map(m=>m.id),
   auction:x.auction,review:x.reviewStatus,hand:x.hand}))
}));
console.log('QPJB-AT-SOURCE-AUDIT-COMPLETE');
