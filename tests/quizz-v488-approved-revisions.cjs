'use strict';
const assert=require('node:assert/strict');
// Les exceptions nouvellement approuvées sont contrôlées sur leurs champs exacts.
// Le bloc historique des 993 QCM reste intégralement protégé (relecture inverse avant SHA).
const approvedLotD11=require('../audits/QPJB_V1_LOT_D_11_INTEGRATION_20261121.json');
const approvedSEFClosure=require('../audits/QPJB_SEF_CLOTURE_2_QCM_20261121.json');
const approved=require('./quizz-v488-approved-revisions.json');
const editorial2SA=require('../audits/pedagogie/validations-2sa-fitte-20261123.json').approved;
const editorialLotA=require('../audits/pedagogie/validations-lot-a-complement-20261123.json').approved;
const preview26=require('../audits/pedagogie/proposition-26-textes-revue-20261123.json').items;
const editorialAuthorise=[...editorial2SA,...editorialLotA];
const editorial=require('./quizz-v489-approved-revisions.json');
const additional=require('./quizz-v490-approved-revisions.json');
const arbitration=require('./quizz-v491-approved-revisions.json');
const competitive=require('./quizz-v492-approved-revisions.json');
const competitiveNext=require('./quizz-v493-approved-revisions.json');
const competitiveExtra=require('./quizz-v494-approved-revisions.json');
const currentV495=require('./quizz-v495-approved-revisions.json');
const currentV496=require('./quizz-v496-approved-revisions.json');
const currentV497=require('./quizz-v497-approved-revisions.json');
const currentV498=require('./quizz-v498-approved-revisions.json');
const currentV499=require('./quizz-v499-approved-revisions.json');
const currentV4100=require('./quizz-v4100-approved-revisions.json');
const currentV4101=require('./quizz-v4101-approved-revisions.json');
const currentV4102=require('./quizz-v4102-approved-revisions.json');
const currentV4103=require('./quizz-v4103-approved-revisions.json');
const revisionRecenteV4112=require('./quizz-v4112-approved-revisions.cjs');
const revisionRecentes=require('./quizz-v4108-normalization.cjs');
function normalizedPrefix(exercises,count){
 return exercises.slice(0,count).map(sourceRaw=>{
  // Prévisualisation des 26 corrections de texte : retour exact aux snapshots avant
  // toute autre normalisation historique. Le dossier demeure DRAFT, non fusionnable.
  const proposal=preview26.find(x=>x.id===sourceRaw.id);
  if(proposal){
   for(const field of proposal.fields)
    assert([proposal.before[field],proposal.after[field]].includes(sourceRaw[field]),
     'Champ de prévisualisation hors manifeste : '+sourceRaw.id+'#'+field);
  }
  const raw=proposal?{...sourceRaw,...proposal.before}:sourceRaw;
  // Seulement les cinq champs éditoriaux explicitement approuvés : deux contextes 2SA
  // et trois retouches du lot A. Les valeurs exactes sont validées avant l'inversion
  // nécessaire aux empreintes historiques, sans neutraliser leurs garde-fous.
  const allowed=editorialAuthorise.find(p=>p.id===raw.id);
  if(allowed){
   assert(['context','explain'].includes(allowed.field),'Champ SEF non autorisé '+raw.id);
   assert([allowed.after,allowed.before].includes(raw[allowed.field]),'Texte hors validation SEF '+raw.id);
  }
  const original=allowed?{...raw,[allowed.field]:allowed.before}:raw;
  const approvedLotD=approvedLotD11.proposals.find(p=>p.id===original.id);
  let source=original;
  const closure=approvedSEFClosure.patches.find(p=>p.id===original.id);
  if(closure){
   for(const [field,approvedAfter] of Object.entries(closure.after))
    assert.deepStrictEqual(original[field],approvedAfter,'Only exact SEF closure edits allowed for '+original.id+' ('+field+')');
   source={...source,...closure.before};
  }
  if(approvedLotD){
   for(const [key,approvedAfter] of Object.entries(approvedLotD.after)){
    assert.deepStrictEqual(original[key],approvedAfter,'Only exact user-approved Lot D changes allowed for '+original.id+' ('+key+')');
   }
   source={...original,...approvedLotD.before};
  }
  let x=revisionRecentes.normalize(revisionRecenteV4112.normalize(source));
  const v4103=currentV4103[x.id];
  if(v4103){
   assert.deepStrictEqual(x,v4103.after,'Only exact V4.103 approved contextual/calibration changes allowed for '+x.id);
   x=v4103.before;
  }
  const v4102=currentV4102[x.id];
  if(v4102){
   assert.deepStrictEqual(x,v4102.after,'Only exact V4.102 approved redundancy improvements allowed for '+x.id);
   x=v4102.before;
  }
  const v4101=currentV4101[x.id];
  if(v4101){
   assert.deepStrictEqual(x,v4101.after,'Only exact V4.101 approved distractor changes allowed for '+x.id);
   x=v4101.before;
  }
  const v4100=currentV4100[x.id];
  if(v4100){
   assert.deepStrictEqual(x,v4100.after,'Only exact V4.100 approved editorial changes allowed for '+x.id);
   x=v4100.before;
  }
  const v499=currentV499[x.id];
  if(v499){
   assert.deepStrictEqual(x,v499.after,'Only exact V4.99 user-approved Multi-Landy changes allowed for '+x.id);
   x=v499.before;
  }
  const v498=currentV498[x.id];
  if(v498){
   assert.deepStrictEqual(x,v498.after,'Only exact V4.98 approved Multi-Landy updates allowed for '+x.id);
   x=v498.before;
  }
  const v497=currentV497[x.id];
  if(v497){
   assert.deepStrictEqual(x,v497.after,'Only exact V4.97 user-approved changes allowed for '+x.id);
   x=v497.before;
  }
  const v496=currentV496[x.id];
  if(v496){
   assert.deepStrictEqual(x,v496.after,'Only exact V4.96 approved editorial updates allowed for '+x.id);
   x=v496.before;
  }
  const v495=currentV495[x.id];
  if(v495){
   assert.deepStrictEqual(x,v495.after,'Only exact V4.95 user-approved changes allowed for '+x.id);
   x=v495.before;
  }
  const newestReview=competitiveExtra[x.id];
  if(newestReview){
   assert.deepStrictEqual(x,newestReview.after,'Only exact V4.94 approved competition changes allowed for '+x.id);
   x=newestReview.before;
  }
  const nextReview=competitiveNext[x.id];
  if(nextReview){
   assert.deepStrictEqual(x,nextReview.after,'Only exact V4.93 arbitrated competition changes allowed for '+x.id);
   x=nextReview.before;
  }
  const caseReview=competitive[x.id];
  if(caseReview){
   assert.deepStrictEqual(x,caseReview.after,'Only exact V4.92 competitive case changes allowed for '+x.id);
   x=caseReview.before;
  }
  const fix=arbitration[x.id];
  if(fix){
   assert.deepStrictEqual(x,fix.after,'Only exact V4.91 user-arbitrated changes are allowed for '+x.id);
   x=fix.before;
  }
  const improvement=additional[x.id];
  if(improvement){
    assert.deepStrictEqual(x,improvement.after,'Only exact V4.90 editorial changes are allowed for '+x.id);
    x=improvement.before;
  }
  const correction=editorial[x.id];
  if(correction){
   assert.deepStrictEqual(x,correction.after,'Only exact V4.89 editorial changes are allowed for '+x.id);
   x=correction.before;
  }
  const item=approved[x.id];
  if(!item)return x;
  assert.deepStrictEqual(x,item.after,'Only exact V4.88-approved changes are allowed for '+x.id);
  return item.before;
 });
}
module.exports={normalizedPrefix,approved};
