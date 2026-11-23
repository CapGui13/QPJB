#!/usr/bin/env node
'use strict';
// M2 P5 — etats actifs, exports/imports et sauvegardes historiques sans motif.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const api=require('../quizz-parcours.js');
const html=fs.readFileSync(path.join(__dirname,'../quizz.html'),'utf8');
const match=html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/);
assert(match,'Catalogue manquant');
const data=JSON.parse(match[1]),exercises=data.exercises;
assert.equal(exercises.length,1523);
assert.equal(data.themes.length,22);
const active=api.empty(),picks=api.start(active,exercises);
assert.equal(picks.length,10);
for(let i=0;i<4;i++)
 assert.equal(api.record(active,picks[i],i===0?'wrong':'correct',i,null,i===2,i===3),true);
const raw=JSON.stringify(active),fromStorage=api.load(raw);
assert.deepEqual(fromStorage.active.ids,active.active.ids);
assert.deepEqual(fromStorage.active.answers,active.active.answers);
assert.deepEqual(fromStorage.active.selection,active.active.selection);
const backup=api.exportProgress(active,exercises,{});
const fromImport=api.importProgress(JSON.stringify(backup));
assert.deepEqual(fromImport.active,fromStorage.active);
const old=JSON.parse(raw);
delete old.active.selection;
const legacy=api.load(JSON.stringify(old));
assert(legacy.active&&!('selection' in legacy.active));
const tampered=JSON.parse(raw);
tampered.active.selection[0].reason='motif-invente';
const invalid=api.load(JSON.stringify(tampered));
assert(invalid.active&&!('selection' in invalid.active));
for(const [label,state] of [['initial',active],['storage',fromStorage],
  ['import',fromImport],['legacy',legacy],['invalid',invalid]]){
 for(let i=4;i<10;i++)
   assert.equal(api.record(state,picks[i],'correct',i,null,false,false),true,label+' record '+i);
 assert.equal(api.finish(state,exercises),true,label+' finish');
 assert.equal(state.completed,1,label+' completed');
 assert.equal(state.journal.length,1,label+' journal');
 assert.equal(Object.keys(state.entries).length,10,label+' entries');
 const roundtrip=api.load(JSON.stringify(state));
 assert.deepEqual(roundtrip.entries,state.entries,label+' entries perdues');
 assert.deepEqual(roundtrip.skills,state.skills,label+' skills perdues');
 assert.deepEqual(roundtrip.micros,state.micros,label+' micros perdues');
 assert.deepEqual(roundtrip.axes,state.axes,label+' axes perdus');
 if(label==='legacy'||label==='invalid')
   assert(state.journal[0].answers.every(a=>!('selectionReason' in a)),
     label+' a reconstruit des motifs non historiques');
 else
   assert(state.journal[0].answers.every(a=>'selectionReason' in a),
     label+' a perdu des motifs existants');
}
console.log('PASS: 5 variantes de reprise, 10 reponses chacune, export/import et historiques preservés');
