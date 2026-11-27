'use strict';
const assert=require('node:assert/strict'),P=require('../quizz-coherence-reprise6-c-debt-credit.js');
function fixture(){
 const meta={},q=(id,c)=>{meta[id]={concept:c,stage:1};return {id,caseFamily:'f-'+id,theme:'ouv',difficulty:2,answer:'1♦'}};
 const a=q('target-old-a','ouv.mineure'),b=q('target-old-b','ouv.mineure'),t=q('target-new','ouv.mineure');
 const d1=q('donor-a','ouv.position'),d2=q('donor-b','ouv.position');
 const filler=Array.from({length:8},(_,i)=>q('f'+i,'other.'+i));
 const exercises=[a,b,t,d1,d2,...filler],deck=[d1,d2,...filler].map(exercise=>({exercise,category:'maintenance',protected:false}));
 const answers=items=>items.map(x=>({id:x.id,result:'correct',assisted:false,hadFreeError:false}));
 const journal=Array.from({length:65},(_,i)=>({mode:'parcours',session:i+1,answers:answers([i===0?a:i===1?b:d1,d2,...filler])}));
 const flagsById=Object.fromEntries(exercises.map(x=>[x.id,{bad:false,weak:false,due:false,stage:1,category:'maintenance',localTarget:2,novelFamily:false}]));
 flagsById[t.id].novelFamily=true;flagsById[d1.id].novelFamily=true;
 return {session:66,history:{active:null,journal},exercises,metadataById:meta,pool:[t,d1,d2,...filler],deck,flagsById,bid:x=>x.answer,context:()=> 'opening',openingPass:()=>false};
}
const ctx=fixture(),snapshot=JSON.stringify(ctx),a=P.exchange(ctx);
assert.equal(a.id,'target-new');assert.equal(a.oldId,'donor-a');assert.equal(a.gap,64);assert.equal(a.donorStillPresent,true);assert.equal(JSON.stringify(ctx),snapshot);assert.deepEqual(a,P.exchange(ctx));
const cases=[
 ['S65',x=>x.session=65],['active',x=>x.history.active={}],['missing history',x=>x.history.journal.pop()],
 ['protected slot',x=>x.deck[0].protected=true],['forced error',x=>x.flagsById['donor-a'].bad=true],
 ['due donor',x=>x.flagsById['donor-a'].due=true],['weak target',x=>x.flagsById['target-new'].weak=true],
 ['new family parity',x=>x.flagsById['target-new'].novelFamily=false&&null],
 ['target absent',x=>x.pool=x.pool.filter(q=>q.id!=='target-new')],
 ['consolidation error',x=>x.history.journal.push({mode:'consolidation',session:65,answers:[{id:'target-old-a',result:'wrong',assisted:false,hadFreeError:false}]})],
 ['proof assisted',x=>{x.history.journal[0].answers[0].assisted=true}],
 ['no eligible slot',x=>x.deck[0].category='discovery'],
 ['difficulty',x=>x.pool[0].difficulty=3],
 ['invalid deck',x=>x.deck[0]={}]
];
for(const [name,mutate] of cases){
 const x=fixture();mutate(x);
 if(name==='new family parity'){x.flagsById['donor-a'].novelFamily=true;x.flagsById['donor-b'].novelFamily=true;}
 assert.equal(P.exchange(x),null,name);
}
assert.equal(P.credit(6),15);assert.equal(P.credit(12),51);
console.log('REPRISE6_C_UNIT PASS '+(cases.length+4)+' contrôles, aucune activation');
