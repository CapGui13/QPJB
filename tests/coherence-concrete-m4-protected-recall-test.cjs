'use strict';
const assert=require('node:assert/strict'),k=require('./coherence-concrete-m4-protected-recall.cjs'),r=require('../quizz-coherence-m4-reserve.js');
const q=(id,theme='ouv',difficulty=1,caseFamily=id)=>({id,theme,difficulty,caseFamily});
const old=q('out'),a=q('proof-a'),b=q('proof-b'),coreOld=q('core-old'),coreNew=q('core-new'),rest=Array.from({length:9},(_,i)=>q('rest-'+i,'other'));
const exercises=[old,a,b,coreOld,coreNew,...rest],metadataById=Object.fromEntries(exercises.map(x=>[x.id,{concept:x===old||x===a||x===b?'ouv.position':x===coreOld||x===coreNew?'ouv.mineure':x.id,stage:1}]));
const good=id=>({id,result:'correct',assisted:false,hadFreeError:false});
const history={journal:[{mode:'parcours',session:50,answers:[good(coreOld.id)]},...Array.from({length:10},(_,i)=>({mode:'parcours',session:90+i,answers:[good(i===4?a.id:i===5?b.id:'other-'+i),...rest.map(x=>good(x.id))]}))]};
const deck=[{exercise:old,kind:'revision',reason:'rappel_nouvelle_situation'},...rest.map(exercise=>({exercise,kind:'nouveau',reason:'nouveau_qcm'}))],slots=[{index:0,baseline:old}];
const ctx={session:100,history,exercises,metadataById,pool:[coreOld,coreNew],seen:()=>true,classify:()=> 'maintenance',bad:()=>false,bid:x=>x.theme,context:x=>x.theme,novelFamily:x=>x!==coreOld,openingPass:()=>false,passCap:1,repeatBudget:0,oldConcept:()=>50,fresh:x=>x===coreNew};
let n=0,records=[];const check=(x,m)=>{assert.ok(x,m);n++};const apply=(c=ctx,d=deck,s=slots)=>k.replace(d,s,c,{plan:r.plan,record:x=>records.push(x)});
const snap=JSON.stringify([deck,history]);const result=apply();
check(result[0].exercise===coreNew,'new family chosen');check(result.slice(1).every((x,i)=>x===deck[i+1]),'nine other objects unchanged');check(records.length===1&&records[0].before===old.id&&records[0].after===coreNew.id,'one justified change');check(JSON.stringify([deck,history])===snap,'inputs untouched');
check(k.provenRecently(ctx,old),'actual evidence');check(!k.provenRecently({...ctx,history:{journal:history.journal.filter(x=>x.session!==95)}},old),'one session not enough');
const oneFamily={...ctx,exercises:exercises.map(x=>x===b?{...b,caseFamily:a.caseFamily}:x)};check(!k.provenRecently(oneFamily,old),'one family not enough');
for(const error of [{result:'wrong'},{assisted:true},{hadFreeError:true},{assisted:undefined}]){
 const h=JSON.parse(JSON.stringify(history));Object.assign(h.journal.find(x=>x.session===95).answers[0],error);check(apply({...ctx,history:h})===deck,'bad or uncertain local evidence');
}
for(const c of [{session:65},{history:{...history,active:{}}},{pool:[]},{seen:()=>false},{classify:()=> 'weakness'},{bad:()=>true},{pool:[{...coreNew,difficulty:2}]},{pool:[{...coreNew,theme:'other'}]},{history:{journal:history.journal.slice(1).filter(x=>x.session!==90)}},{metadataById:{...metadataById,[old.id]:{concept:'ouv.mineure',stage:1}}}])check(apply({...ctx,...c})===deck,'protected negative case');
check(apply(ctx,deck,[])===deck,'no discretionary slot');check(apply(ctx,[{...deck[0],reason:'rappel_erreur_aide'},...deck.slice(1)]) [0].exercise===old,'forced error recall not replaced');
check(apply({...ctx,pool:[coreOld],novelFamily:()=>false})[0].exercise===coreOld,'explicit one old-family exception in fixture');
check(apply({...ctx,pool:[coreNew],openingPass:x=>x===coreNew,passCap:0})===deck,'pass cap');
check(apply({...ctx,pool:[coreNew],bid:x=>x===coreNew?'other':x.theme})===deck,'answer concentration guard');
check(apply({...ctx,pool:[coreNew],context:x=>x===coreNew?'other':x.theme})===deck,'context concentration guard');
check(apply({...ctx,pool:[{...coreNew,caseFamily:rest[0].caseFamily}]})===deck,'family distinctness');
check(apply({...ctx,pool:[coreNew],metadataById:{...metadataById,[coreNew.id]:{concept:'ouv.mineure',stage:2}}})===deck,'no advanced stage');
check(records.every(x=>x.kind==='reservation'&&x.policy==='K'),'explicit provenance');
console.log('M4 K protected recall PASS',n);
