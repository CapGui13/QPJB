'use strict';
const assert=require('node:assert/strict');
const G=require('../quizz-coherence-m1-guarded.js');
const q={id:'A',answer:'2♥',difficulty:1,theme:'majeur'},metadataById={A:{concept:'majeur.soutien',stage:0}};
const clean={result:'correct',assisted:false,hadFreeError:false};
const row=(session,patch={})=>({mode:'parcours',session,answers:Array.from({length:10},()=>({...clean,...patch}))});
const ctx={session:3,candidates:[q],metadataById,selected:[],category:'discovery',history:{journal:[row(1),row(2)]}};
assert.equal(G.autonomy(ctx).enabled,true);assert.ok(G.rank(ctx).length);
for(const journal of [[],[row(1)],[row(1),row(2,{assisted:true})],[row(1),row(2,{hadFreeError:true})],[row(1),row(2,{result:'wrong'})],[row(1),row(2,{assisted:undefined})],[row(1),{...row(2),mode:'consolidation'}],[row(1),row(1)]]){
 const c={...ctx,history:{journal}};assert.equal(G.autonomy(c).enabled,false);assert.equal(G.prefer(c),c.candidates);assert.deepEqual(G.rank(c),[]);assert.ok(G.plan(c).fallback.includes('consolidation'));
}
assert.equal(G.autonomy({...ctx,session:5,history:{journal:[row(1,{result:'wrong'}),row(2),row(3),row(4)]}}).enabled,false);
const snapshot=JSON.stringify(ctx);G.plan(ctx);G.rank(ctx);G.prefer(ctx);assert.equal(JSON.stringify(ctx),snapshot);
for(const ext of [{priority:true},{forcedReason:'rappel_erreur_aide'},{category:'weakness'},{history:{...ctx.history,active:{ids:['A']}}}]){
 const c={...ctx,...ext};assert.equal(G.prefer(c),c.candidates);assert.deepEqual(G.rank(c),[]);
}
console.log('M1 guarded: autonomie explicite, consolidation, reprise, catégories protégées PASS');
