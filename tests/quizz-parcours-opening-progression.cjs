'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const P=require('../quizz-parcours.js');
const root=path.join(__dirname,'..');
const raw=fs.readFileSync(path.join(root,'quizz.html'),'utf8').match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
const ex=JSON.parse(raw[1]).exercises;
const isPass=q=>q.theme==='ouv'&&q.answer==='Passe';
const profiles=['autonome','erreurs','passeRate','mixte','aides'];
for(const profile of profiles){
  const s=P.empty();
  for(let n=1;n<=12;n++){
    const d=P.start(s,ex),p=d.filter(isPass);
    assert.equal(d.length,10);assert.equal(new Set(d.map(x=>x.caseFamily||x.id)).size,10);
    assert.deepEqual(P.start(P.load(JSON.stringify(s)),ex).map(x=>x.id),d.map(x=>x.id));
    assert(d.every(x=>x.theme!=='ouv'||x.answer!=='2♣'||n-1>=P.INTRO.fortes),'Strong opening premature');
    if(n===1){assert.equal(p.length,3);assert(d.findIndex(isPass)<=2);assert(p.every(x=>x.h<12&&x.difficulty===1));assert(p.every((x,i)=>i===0||d.indexOf(x)-d.indexOf(p[i-1])>=2));}
    else{assert(p.length<=2);if(profile==='autonome')assert(p.length<=1);}
    if(n===2){assert(d.some(x=>x.theme==='majeur')&&d.some(x=>x.theme==='mineur'));assert(d.filter(x=>x.theme==='ouv').length<=4);assert(p.length>=1);}
    if(n===3&&profile==='passeRate')assert(p.length>=1,'Specific weakness must retain reinforcement');
    if(n<=4)console.log(profile,n,d.map(x=>x.theme+':'+x.answer).join(' | '));
    for(let i=0;i<d.length;i++){const x=d[i];const wrong=profile==='erreurs'||profile==='passeRate'&&isPass(x)||profile==='mixte'&&i%3===0;assert(P.record(s,x,wrong?'wrong':'correct',i,null,profile==='aides',false));}
    assert(P.finish(s,ex));
  }
}
console.log('OPENING_PROGRESSION_PASS 5 profils × 12 séances ; reprise intacte');
