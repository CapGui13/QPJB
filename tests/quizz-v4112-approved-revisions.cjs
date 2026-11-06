'use strict';
const assert=require('node:assert/strict');
const fixture=require('./quizz-v4112-approved-revisions.json');
function normalize(original){
 const changes=fixture.editsById[original.id];
 if(!changes)return original;
 const previous={...original};
 for(const [field,[before,after]] of Object.entries(changes)){
  assert.deepStrictEqual(original[field],after,'V4.112: unexpected change to '+original.id+'/'+field);
  previous[field]=before;
 }
 return previous;
}
module.exports={normalize,fixture};
