'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const engine=require('../quizz-parcours.js');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const qs=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
assert.equal(qs.length,1879);
const normalize=q=>String(q.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
const opening=q=>q.auction?.length===1?q.auction[0].match(/:\s*(1[♣♦♥♠])/)?.[1]:'';
function pattern(q){
  const o=opening(q),a=normalize(q);
  if(!o)return '';
  if(q.theme==='majeur'&&/^[2-7][♥♠]$/.test(a)&&a[1]===o[1])return 'fit-M|'+a[0];
  if(q.theme==='mineur'&&/^[2-7][♣♦]$/.test(a)&&a[1]===o[1])return 'fit-m|'+a[0];
  if(q.theme==='mineur'&&/^1[♥♠]$/.test(a))return '1M-sur-m';
  if(a==='1SA'&&['mineur','majeur'].includes(q.theme))return '1SA-sur-'+q.theme;
  return '';
}
for(const profile of ['autonome','modere','faible']){
  const state=engine.empty();
  for(let s=0;s<20;s++){
    const deck=engine.start(state,qs);
    assert.equal(deck.length,10);
    assert.equal(new Set(deck.map(q=>q.id)).size,10);
    if(s===1){
      assert.ok(deck.slice(0,2).every(q=>q.theme==='ouv'&&normalize(q)!=='Passe'));
      const fits=deck.map((q,i)=>pattern(q)==='fit-M|2'?i:-1).filter(i=>i>=0);
      assert.equal(fits.length,2);
      assert.ok(fits[1]-fits[0]>1,'soutiens miroirs adjacents');
      assert.ok(deck.slice(0,fits[0]).some(q=>pattern(q)==='1M-sur-m'));
      assert.ok(deck.slice(0,fits[0]).some(q=>pattern(q)==='1SA-sur-mineur'));
    }
    for(let i=0;i<deck.length;i++){
      const q=deck[i];
      assert.ok(engine.eligibility(q,state,qs).eligible);
      if(i){
        assert.notEqual(normalize(q),normalize(deck[i-1]));
        if(pattern(q))assert.notEqual(pattern(q),pattern(deck[i-1]));
      }
    }
    for(let i=0;i<deck.length;i++){
      const q=deck[i];let hash=2166136261;
      for(const c of q.id+'|'+s+'|47')hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;
      const wrong=hash/4294967296<(profile==='autonome'?0:profile==='faible'?.8:.33);
      assert.ok(engine.record(state,q,wrong?'wrong':'correct',i,null,false,false));
    }
    assert.ok(engine.finish(state,qs));
  }
}
console.log('Cohérence pédagogique : 3 profils × 20 séances, aucune adjacency miroir ni violation de prérequis.');
