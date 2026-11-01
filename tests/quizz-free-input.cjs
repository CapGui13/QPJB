'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const match=html.match(/function normalizeBid\(input\)\{[\s\S]*?\n\}/);
assert.ok(match,'The free-input bid normalizer is present');
const normalizeBid=new Function('return ('+match[0]+')')();
for(const [input,expected] of [
 ['1♠','1♠'],['1 P','1♠'],['1 pique','1♠'],['1s','1♠'],
 ['2♥','2♥'],['2C','2♥'],['2 cœur','2♥'],['2 Coeurs','2♥'],
 ['3♦','3♦'],['3K','3♦'],['3 carreau','3♦'],['3 D','3♦'],
 ['4♣','4♣'],['4 T','4♣'],['4 trèfles','4♣'],
 ['3SA','3SA'],['3 NT','3SA'],['2 sans-atout','2SA'],
 ['Passe','Passe'],['p','Passe'],['pass','Passe'],
 ['Contre','Contre'],['X','Contre'],['Surcontre','Surcontre'],['XX','Surcontre'],
 ['6SA','6SA'],['7♠','7♠'],
 ['2ZZ',null],['',null],['8P',null],['3.7',null]
 ]){
 assert.equal(normalizeBid(input),expected,'Parsing: '+JSON.stringify(input));
}
const script=html.match(/<script>\s*([\s\S]*?)<\/script><\/body>/);
assert.ok(script,'The application is embedded');
const code=script[1];
for(const marker of [
 'function submitFreeAnswer(','function showChoices(','function stageAt(',
 'function finalizeAnswer(', 'sessionStages={}', 'assistedCorrect:',
 'independentCorrect:', "r.assisted", "id=\"free-answer\"",
 "id=\"show-choices\"", "id=\"free-form\""
])assert.ok(code.includes(marker),'Expected staged response workflow: '+marker);
console.log('Quizz free input: PASS | all accepted bridge bid spellings, invalid inputs and assisted-answer hooks');
