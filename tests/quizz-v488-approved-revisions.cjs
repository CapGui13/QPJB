'use strict';
const assert=require('node:assert/strict');
const approved=require('./quizz-v488-approved-revisions.json');
function normalizedPrefix(exercises,count){
 return exercises.slice(0,count).map(x=>{
  const item=approved[x.id];
  if(!item)return x;
  assert.deepStrictEqual(x,item.after,'Only exact V4.88-approved changes are allowed for '+x.id);
  return item.before;
 });
}
module.exports={normalizedPrefix,approved};
