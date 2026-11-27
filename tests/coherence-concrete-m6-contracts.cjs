'use strict';
const V=require('../quizz-coherence-m6-contracts.js');
let assertions=0;
function yes(fn){fn();assertions++}
function no(fn){let rejected=false;try{fn()}catch{rejected=true}if(!rejected)throw Error('Negative fixture was accepted');assertions++}
const ctx={session:2,history:{journal:[]},exercises:[{id:'a'},{id:'b'}],metadataById:{a:{concept:'ouv.mineure'},b:{concept:'mineur.base'}},candidates:[{id:'a'},{id:'b'}],selected:[],category:'discovery',objective:null,nowMs:0};
const p={principal:'mineur.base',secondary:['ouv.mineure'],targetConcepts:['mineur.base'],quotas:{discovery:4,review:3},reason:'réponse naturelle',fallback:'rappel si besoin'};
const known=['mineur.base','ouv.mineure'];
yes(()=>V.plan(V.pure(()=>p,ctx),known));no(()=>V.plan({...p,principal:'invented'},known));no(()=>V.plan({...p,quotas:{review:-1}},known));no(()=>V.plan({...p,reason:''},known));
const o={ids:['b','a'],reasons:{a:'rappel',b:'nouvelle règle'}};
yes(()=>V.order(V.pure(()=>o,ctx),ctx.candidates));no(()=>V.order({...o,ids:['a','a']},ctx.candidates));no(()=>V.order({...o,reasons:{a:'rappel'}},ctx.candidates));no(()=>V.order({...o,ids:['a','c']},ctx.candidates));
yes(()=>V.rules(V.pure(()=>[{id:'b',requires:['ouv.mineure'],reason:'réponse après ouverture'}],ctx)));no(()=>V.rules([{id:'b',requires:[],reason:'arbitrary',block:true}]));no(()=>V.rules([{id:'b',requires:[],reason:'arbitrary',forceEligible:true}]));
yes(()=>V.rank(V.pure(()=>[{id:'b',delta:5,reason:'autre famille'}],ctx),ctx.candidates,10));no(()=>V.rank([{id:'x',delta:1,reason:'outside'}],ctx.candidates));no(()=>V.rank([{id:'a',delta:11,reason:'bound'}],ctx.candidates,10));no(()=>V.rank([{id:'a',delta:1,reason:'x'},{id:'a',delta:2,reason:'y'}],ctx.candidates));
yes(()=>V.studyPlan(V.pure(()=>[{lessonId:'mineur.base',when:'before',reason:'préparation'}],ctx),known));yes(()=>V.studyPlan([],known,{active:true}));no(()=>V.studyPlan([{lessonId:'unknown',when:'before',reason:'x'}],known));no(()=>V.studyPlan([{lessonId:'mineur.base',when:'before',reason:'x'}],known,{active:true}));
no(()=>V.pure(c=>{c.history.journal.push('invented');return []},ctx));no(()=>{let k=0;V.pure(()=>++k,ctx)});no(()=>V.pure(()=>Promise.resolve([]),ctx));
console.log(JSON.stringify({assertions,status:'PASS',scope:'normalized contract fixtures, not candidate integration'}));
