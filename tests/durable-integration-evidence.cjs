'use strict';
function run({engine,exercises}){
 let assertions=0;const ok=(v,m)=>{assertions++;if(!v)throw Error(m)},same=(a,b,m)=>ok(JSON.stringify(a)===JSON.stringify(b),m);
 const s=engine.empty(),deck=engine.start(s,exercises),q=deck[0],wrong=q.choices.find(v=>v!==q.answer);
 ok(engine.record(s,q,'correct',0,q.answer,true,true,wrong),'Corrected response');
 ok(s.active.answers[0].firstGuess===wrong,'First actual choice stored');
 const restored=engine.load(JSON.stringify(s));same(restored.active,s.active,'Resume exact');
 for(let i=1;i<deck.length;i++)ok(engine.record(restored,deck[i],'correct',i,deck[i].answer,false,false),'Ordinary response');
 ok(engine.finish(restored,exercises),'Finish');
 ok(restored.journal[0].answers[0].firstGuess===wrong,'Journal has observed first choice');
 ok(restored.journal[0].answers[0].hadFreeError&&restored.journal[0].answers[0].assisted,'Never convert correction to autonomy');
 ok(restored.journal[0].answers.slice(1).every(a=>!Object.hasOwn(a,'firstGuess')),'Never invent first choice');
 same(engine.importProgress(JSON.stringify(engine.exportProgress(restored,exercises,{}))),restored,'Full progress round trip');
 const historical=JSON.parse(JSON.stringify(restored));delete historical.journal[0].answers[0].firstGuess;
 same(engine.load(historical),historical,'Historical absence preserved');
 const invalid=JSON.parse(JSON.stringify(restored));invalid.journal[0].answers[0].firstGuess=q.answer;
 ok(!Object.hasOwn(engine.load(invalid).journal[0].answers[0],'firstGuess'),'Reject claimed correct first choice on corrected success');
 const t=engine.empty(),d=engine.start(t,exercises);
 ok(engine.record(t,d[0],'correct',0,d[0].answer,true,true,'<bad>'),'Invalid optional first choice does not discard answer');
 ok(!Object.hasOwn(t.active.answers[0],'firstGuess'),'Ignore invalid bid');
 return {status:'PASS',assertions};
}
module.exports={run};
if(require.main===module){
 const h=require('node:fs').readFileSync(require('node:path').join(__dirname,'../quizz.html'),'utf8');
 const exercises=JSON.parse(h.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
 console.log(JSON.stringify(run({engine:require('../quizz-parcours.js'),exercises})));
}
