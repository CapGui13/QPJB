'use strict';
const assert=require('node:assert/strict');
const approved=require('./quizz-v488-approved-revisions.json');
const editorial=require('./quizz-v489-approved-revisions.json');
const additional=require('./quizz-v490-approved-revisions.json');
const arbitration=require('./quizz-v491-approved-revisions.json');
function normalizedPrefix(exercises,count){
 return exercises.slice(0,count).map(original=>{
  let x=original;
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
