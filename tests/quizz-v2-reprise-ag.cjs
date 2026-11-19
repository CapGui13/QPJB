'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const AG=require('../scripts/parcours-v2-build-reprise-ag.cjs');
const root=path.resolve(__dirname,'..');
const original=fs.readFileSync(path.join(root,'preview/parcours-v2-autonome.html'),'utf8');
const built=AG.build(original);
assert.ok(built.length>original.length);
const appStart=original.lastIndexOf(AG.APP_MARKER);
assert.ok(appStart>1100000);
assert.equal(built.slice(0,appStart),original.slice(0,appStart),
  'Engines, full source data, original catalog and flags remain identical');
assert.ok(!original.includes('qpjb-preview-v2-ag-local-resume-v1'));
assert.ok(!built.includes('teacherConfirmedBeforeSession'));
assert.ok(!built.includes('Les résultats seront perdus à la fermeture'));
assert.ok(built.includes('Sauvegarde locale active sur cet appareil'));
assert.ok(built.includes('Sauvegarde locale indisponible'));
assert.ok(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon/i.test(built.slice(appStart)));
assert.throws(()=>AG.build(built),/already|unexpected|nonunique/);

const originalScripts=[...original.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
const scripts=[...built.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
 .map(([,attrs,body])=>({attrs,body}));
assert.equal(scripts.length,7,'The preview still has exactly 7 script elements');
assert.equal(scripts.length,originalScripts.length);
const data=(id,html)=>{const match=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
 .find(x=>x[1].includes('id="'+id+'"'));return match?.[2];};
for(const id of ['catalog-data','sa-data','stayman-data','review-flags'])
 assert.equal(data(id,built),data(id,original),'Original JSON unchanged: '+id);
assert.equal(JSON.parse(data('catalog-data',built)).length,1523);
assert.equal(JSON.parse(data('review-flags',built)).length,19);
assert.equal(JSON.parse(data('sa-data',built)).assignments.length,14);
assert.equal(JSON.parse(data('stayman-data',built)).assignments.length,65);

const storage=new Map();
const key='qpjb-preview-v2-ag-local-resume-v1';
function load(useStorage=true){
 let listener=null;
 const app={innerHTML:''};
 const nodes=Object.fromEntries(scripts.filter(x=>x.attrs.includes('application/json'))
   .map(({attrs,body})=>[attrs.match(/\bid="([^"]+)"/)[1],{textContent:body}]));
 const nav=()=>({setAttribute(){},textContent:''});
 const document={
   getElementById:id=>id==='app'?app:nodes[id]||nav(),
   addEventListener:(type,handler)=>{if(type==='click')listener=handler;}
 };
 const localStorage=useStorage?{
   setItem(k,v){storage.set(k,String(v));},
   getItem:k=>storage.get(k)||null,
   removeItem:k=>storage.delete(k)
 }:{
   setItem(){throw new Error('localStorage unavailable');},
   getItem(){throw new Error('localStorage unavailable');},
   removeItem(){throw new Error('localStorage unavailable');}
 };
 const window={localStorage};
 const sandbox=vm.createContext({window,document,console},{name:'AG local test'});
 for(const script of scripts.filter(x=>!x.attrs.includes('application/json')))
   vm.runInContext(script.body,sandbox,{timeout:60000});
 assert.equal(typeof listener,'function');
 const click=(action,choice,index)=>{
   listener({target:{closest:()=>({dataset:{action,choice,index},disabled:false})}});
 };
 return {click,app,window};
}
let site=load();
assert.ok(site.app.innerHTML.includes('Sauvegarde locale active'));
assert.ok(site.app.innerHTML.includes('1 523 QCM du catalogue'));
site.click('start');
assert.ok(site.app.innerHTML.includes('Question 1 sur 10'));
assert.ok(storage.has(key));
let snapshot=JSON.parse(storage.get(key));
assert.equal(snapshot.deck.length,10);
assert.equal(snapshot.active,true);
assert.equal(snapshot.learning.session,0);
site.click('answer','0');
assert.ok(site.app.innerHTML.includes('Réponse du catalogue'));
assert.equal(JSON.parse(storage.get(key)).results.length,1);
site=load();
assert.ok(site.app.innerHTML.includes('Question 1 sur 10'),
  'Restore answered first question on reload');
assert.ok(site.app.innerHTML.includes('Réponse du catalogue'));
site.click('next');
assert.ok(site.app.innerHTML.includes('Question 2 sur 10'));
site=load();
assert.ok(site.app.innerHTML.includes('Question 2 sur 10'));
assert.ok(!site.app.innerHTML.includes('Réponse du catalogue :'),
  'Unanswered question stays unanswered after reload');
for(let i=1;i<10;i++){
 site.click('answer','0');
 assert.ok(site.app.innerHTML.includes('Réponse du catalogue'));
 site.click('next');
}
assert.ok(site.app.innerHTML.includes('Bilan de la séance 1'));
assert.equal(JSON.parse(storage.get(key)).learning.session,1);
site=load();
assert.ok(site.app.innerHTML.includes('Bilan de la séance 1'));
site.click('start');
assert.ok(site.app.innerHTML.includes('Séance fictive 2'));
site=load();
assert.ok(site.app.innerHTML.includes('Séance fictive 2'));
site.click('reset');
assert.ok(!storage.has(key),'Reset removes local saved progress');
site=load();
assert.ok(site.app.innerHTML.includes('Un laboratoire pour tester'));
assert.ok(!site.app.innerHTML.includes('Bilan de la séance'));
storage.set(key,JSON.stringify({version:1,signature:'stale',learning:{}}));
site=load();
assert.ok(site.app.innerHTML.includes('Un laboratoire pour tester'));
assert.ok(!storage.has(key),'Stale fingerprint invalidated');
storage.set(key,'not json');
site=load();
assert.ok(!storage.has(key),'Corrupted local state invalidated');
const noStorage=load(false);
assert.ok(noStorage.app.innerHTML.includes('Sauvegarde locale indisponible'));
noStorage.click('start');
assert.ok(noStorage.app.innerHTML.includes('Question 1 sur 10'));

console.log('QPJB AG PASS : 1,523 original QCM, no teacher gate or lessons, reload mid-question, next question, summary, session 2, reset, stale/corrupt rejection, storage fallback.');
