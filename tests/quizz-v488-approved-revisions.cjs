'use strict';
const assert=require('node:assert/strict');
const approved=require('./quizz-v488-approved-revisions.json');
const editorial=require('./quizz-v489-approved-revisions.json');
const additional=require('./quizz-v490-approved-revisions.json');
const arbitration=require('./quizz-v491-approved-revisions.json');
const competitive=require('./quizz-v492-approved-revisions.json');
const competitiveNext=require('./quizz-v493-approved-revisions.json');
const competitiveExtra=require('./quizz-v494-approved-revisions.json');
const currentV495=require('./quizz-v495-approved-revisions.json');
const currentV496=require('./quizz-v496-approved-revisions.json');
function normalizedPrefix(exercises,count){
 return exercises.slice(0,count).map(original=>{
  let x=original;
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
