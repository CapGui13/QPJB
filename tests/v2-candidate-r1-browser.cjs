'use strict';
// Candidat V2 : 1 séance, gambling barrages, sauvegardes JSON, desktop/mobile.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url'),{chromium,webkit,devices}=require('playwright');
const url=pathToFileURL(path.resolve(__dirname,'../artifacts/v2-pedagogy-candidate-private/QPJB_V2_65_SEANCES_CANDIDAT_PEDAGOGIQUE.html')).href;
const key='qpjb-v2-eleve-65-pedago-r1',oldKey='qpjb-preview-v2-eleve-02-hold';
const version='QPJB-V2-65-19A-20261120-R1';
async function answer(page,value){
 const label=value?page.locator('.choice').filter({hasText:value}).first():page.locator('.choice').first();
 await label.click();await page.locator('#answer').click();await page.locator('.feedback').waitFor();
}
async function run(engine,mobile){
 const browser=await ({chromium,webkit})[engine].launch({headless:true,args:engine==='chromium'?['--no-sandbox']:[]});
 try{
  const opts=mobile?{...devices['iPhone 12'],locale:'fr-FR',acceptDownloads:true}:
    {viewport:{width:1350,height:850},locale:'fr-FR',acceptDownloads:true};
  const ctx=await browser.newContext(opts),page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await ctx.setOffline(true);
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.getByRole('alert').getByText(/19 DÉCISIONS VALIDÉES/).waitFor();
  assert.equal(await page.locator('#backup-tools').count(),1);
  assert.equal(await page.locator('#az-return-v1').count(),0);
  const quiz=await page.evaluate(()=>{
   const d=JSON.parse(document.querySelector('#ay-payload').textContent);
   const q=d.catalog.find(x=>x.id==='SEF-L06-029');
   return {count:d.catalog.length,theme:q.theme,answer:q.answer,version:d.candidateVersion};
  });
  assert.deepEqual(quiz,{count:1523,theme:'sa',answer:'4♦',version});
  await page.evaluate(k=>localStorage.setItem(k,'OLD_SAVE_UNTOUCHED'),oldKey);
  await page.locator('#start').click();await page.getByText('Séance 1/65').waitFor();
  const active=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  assert.equal(active.schema,2);assert.equal(active.contentVersion,version);
  await answer(page);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('.feedback').waitFor();
  for(let i=1;i<10;i++){await page.locator('#next').click();await answer(page)}
  await page.locator('#next').click();await page.getByText('Bilan de la séance 1').waitFor();
  let record=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  assert.equal(record.completed.length,1);assert.equal(record.engineState.session,1);
  const promise=page.waitForEvent('download');
  await page.locator('#backup-export').click();
  const download=await promise;
  const backup=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
  assert.equal(backup.format,'QPJB_V2_STUDENT_BACKUP_1');
  assert.equal(backup.contentVersion,version);
  assert.equal(backup.record.completed.length,1);
  await page.locator('#backup-import').setInputFiles({name:'wrong.json',mimeType:'application/json',
    buffer:Buffer.from(JSON.stringify({...backup,contentVersion:'WRONG'}))});
  await page.waitForFunction(()=>document.querySelector('#backup-result').textContent.includes('Import refusé'));
  assert.equal((await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key)).nextSession,2);
  await page.evaluate(k=>{
   const e=window.AYEngine,d=JSON.parse(document.querySelector('#ay-payload').textContent);
   const items=['SEF-L06-029'],used=new Set();
   for(const q of d.catalog){if(q.id==='SEF-L06-029'||used.has(e.family(q)))continue;
    used.add(e.family(q));items.push(q.id);if(items.length===10)break;}
   localStorage.setItem(k,JSON.stringify({schema:2,contentVersion:'QPJB-V2-65-19A-20261120-R1',
    model:'core',engineState:e.newState(13),current:{number:1,items:items.map(id=>({origin:'SEF',id})),
    position:0,answers:Array(10).fill(null),revealed:false},completed:[],addonAnswers:[],
    nextSession:1,finished:false}));
  },key);
  await page.reload({waitUntil:'domcontentloaded'});
  const hint=await page.locator('.hint').filter({hasText:'SEF-L06-029'}).first().textContent();
  assert.ok(hint.includes('Ouvertures conventionnelles / barrages'),hint);
  await answer(page,'4♦');
  for(let i=1;i<10;i++){await page.locator('#next').click();await answer(page)}
  await page.locator('#next').click();await page.getByText('Bilan de la séance 1').waitFor();
  record=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  assert.ok(record.engineState.concepts['barrage:gambling_3sa_passe_corrige'],'Concept barrage absent');
  assert.ok(!record.engineState.concepts['sa:gambling_3sa_passe_corrige'],'Ancien concept SA');
  page.once('dialog',d=>d.accept());
  const navigated=page.waitForEvent('framenavigated');
  await page.locator('#backup-import').setInputFiles({name:'good.json',mimeType:'application/json',
    buffer:Buffer.from(JSON.stringify(backup))});
  await navigated;
  await page.locator('#backup-tools').waitFor({state:'visible'});
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('qpjb-v2-eleve-65-pedago-r1')).nextSession===2);
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),oldKey),'OLD_SAVE_UNTOUCHED');
  assert.deepEqual(errors,[],'Exceptions JS navigateur');
  const size=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
  assert.ok(size.width<=size.viewport+2,'Débordement horizontal '+JSON.stringify(size));
  console.log('QPJB V2 CANDIDATE BROWSER PASS '+engine+'/'+(mobile?'mobile':'desktop'));
  await ctx.close();
 }finally{await browser.close()}
}
(async()=>{await run('chromium',false);await run('webkit',true)})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
