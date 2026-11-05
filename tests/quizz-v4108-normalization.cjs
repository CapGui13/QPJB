'use strict';
const assert=require('node:assert/strict');
const patches=Object.assign({},...Array.from({length:7},(_,i)=>require('./quizz-v4108-diff-p'+(i+1)+'.json')));
function normalize(original){
 const fields=patches[original.id];
 if(!fields)return original;
 const before={...original};
 for(const [name,[previous,current]] of Object.entries(fields)){
  if(current===null)assert.equal(Object.hasOwn(original,name),false,'Unexpected field '+name+' in '+original.id);
  else assert.deepStrictEqual(original[name],current,'Changed fixture field '+name+' in '+original.id);
  if(previous===null)delete before[name];
  else before[name]=previous;
 }
 return before;
}
module.exports={normalize,patches};
