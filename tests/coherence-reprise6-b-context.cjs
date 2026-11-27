'use strict';
const assert=require('node:assert/strict');
const B=require('../quizz-coherence-reprise6-b-context.js');
const BASE='13966e475cf986c6f76e7faf870377fdf4ef99aa';
function one(html,a,b){const i=html.indexOf(a),j=html.indexOf(b,i);assert(i>=0&&j>i,'source anchor '+a);return html.slice(i,j)}
function renderer(html){
 const escape=one(html,'const escapeHTML=','const mix=');
 const rich=one(html,'function richText(text)','function richBid(text)');
 const suit=html.match(/(?:function bidSuitClass\([^\n]*\}|const bidSuitClass=[^\n]*)/);
 assert(suit,'suit anchor');
 const note=one(html,'function conventionNote(x){','function professeurFeedbackHTML');
 return new Function(escape+'\n'+suit[0]+'\n'+rich+'\n'+note+'\nreturn conventionNote;')();
}
function run(html){
 const candidate=B.instrumentHTML(html), before=renderer(html), after=renderer(candidate);
 const extract=x=>x.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1];
 assert.equal(extract(candidate),extract(html),'catalogue bytes unchanged');
 const exercises=JSON.parse(extract(html)).exercises;
 assert.equal(exercises.length,1915);
 const changes=[];
 for(const q of exercises){
  const a=before(q),b=after(q);
  if(a!==b)changes.push({id:q.id,before:a,after:b,answer:q.answer});
  if(B.IDS.includes(q.id)){
   assert.equal(a,'');assert(b.includes('deux majeures quatrièmes'));assert(b.includes('laissant l’ouvreur déclarant'));
   assert(!b.includes('>'+q.answer+'</span>'),'no answer revealed');
  }else assert.equal(b,a,q.id+' unrelated context changed');
 }
 assert.deepEqual(changes.map(r=>r.id).sort(),[...B.IDS].sort());
 assert.throws(()=>B.instrumentHTML('anchor absent'));
 assert.equal(B.needsContext({id:B.IDS[0],auction:['a','b','c'],context:'unrelated'}),false);
 return {catalogue:exercises.length,unchanged:exercises.length-changes.length,changes};
}
module.exports={BASE,run,renderer};
if(require.main===module){
 const cp=require('node:child_process'),fs=require('node:fs');
 const html=cp.execFileSync('git',['show',BASE+':quizz.html'],{encoding:'utf8',maxBuffer:32*1024*1024});
 const result=run(html);console.log(JSON.stringify(result,null,2));
 if(process.env.CONTEXT_OUTPUT)fs.writeFileSync(process.env.CONTEXT_OUTPUT,JSON.stringify(result,null,2));
}
