'use strict';
// Observatoire V2 : parcours existant, données synthétiques uniquement.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium,webkit,devices}=require('playwright');
const root=path.resolve(__dirname,'..'),KEY='qpjb-v2-eleve-65-pedago-r1';
function server(){
 return http.createServer((req,res)=>{
  const file=path.join(root,'preview/v2-eleve/parcours-sef-65-r1.html');
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 });
}
async function run(name,mobile,url){
 const browser=await ({chromium,webkit})[name].launch({headless:true,
  args:name==='chromium'?['--no-sandbox']:[]});
 try{
  const ctx=await browser.newContext({...(mobile?devices['iPhone 12']:
   {viewport:{width:1280,height:860}}),locale:'fr-FR',serviceWorkers:'block'});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#v2-competences').count(),0,
   'Pas de bilan personnel avant le début');
  await page.evaluate(k=>{
   const F=window.AYEngine,completed=Array.from({length:13},(_,i)=>({
    number:i+1,correct:7,questions:10,coreCorrect:7,coreQuestions:10,
    supplement:null,supplementMatched:null
   }));
   const state=F.newState(13);state.session=13;
   state.concepts={
    'ouv:sa':{lastSession:11,lastResult:'correct',attempts:3,errors:0,due:17},
    'stayman:stayman_1sa_ouvreur_4_reponses':{
      lastSession:12,lastResult:'wrong',attempts:2,errors:1,due:14},
    'rubrique:chelem':{lastSession:10,lastResult:'correct',attempts:1,errors:0,due:15}
   };
   localStorage.setItem(k,JSON.stringify({
     schema:2,contentVersion:'QPJB-V2-65-19A-20261120-R1',
     model:'core',engineState:state,current:null,completed,addonAnswers:[],
     nextSession:14,finished:false
   }));
  },KEY);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.getByText('Bilan de la séance 13').waitFor();
  const before=await page.evaluate(k=>localStorage.getItem(k),KEY);
  const details=page.locator('#v2-competences');
  assert.equal(await details.count(),1);
  await details.locator('summary').click();
  assert.match(await details.textContent(),/Mes notions travaillées/);
  assert.match(await details.textContent(),/2 repère/);
  assert.match(await details.textContent(),/1 repère\(s\) à revoir/);
  assert.match(await details.textContent(),/1 classification\(s\) encore candidate/);
  assert.match(await details.textContent(),/une notion rencontrée n’est pas une notion maîtrisée/);
  assert.match(await details.textContent(),/sans classification fine/);
  assert.match(await details.textContent(),/Dernier résultat à revoir/);
  assert.match(await details.textContent(),/Aucun de ces indicateurs ne bloque/);
  const after=await page.evaluate(k=>localStorage.getItem(k),KEY);
  assert.equal(after,before,'Ouvrir le tableau ne doit pas toucher la progression');
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#v2-competences').count(),1,'Vue conservée après rechargement');
  await page.locator('#nextSession').click();
  await page.getByText('Séance 14/65').waitFor();
  assert.equal(await page.locator('.choice').count(),4,'Quiz existant inchangé');
  const state=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
  assert.equal(state.completed.length,13,'La séance en cours ne modifie pas les anciennes séances');
  assert.deepEqual(errors,[],'Aucune exception navigateur');
  console.log('QPJB V2 OBSERVATOIRE BROWSER PASS '+name+'/'+(mobile?'mobile':'desktop'));
  await ctx.close();
 }finally{await browser.close()}
}
(async()=>{
 const srv=server();
 await new Promise((resolve,reject)=>{srv.once('error',reject);srv.listen(0,'127.0.0.1',resolve)});
 try{
  const url='http://127.0.0.1:'+srv.address().port+'/preview/v2-eleve/parcours-sef-65-r1.html';
  await run('chromium',false,url);
  await run('webkit',true,url);
 }finally{await new Promise(ok=>srv.close(ok))}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
