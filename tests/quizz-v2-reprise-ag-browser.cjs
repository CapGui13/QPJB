'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium,webkit,devices}=require('playwright');
const AG=require('../scripts/parcours-v2-build-reprise-ag.cjs');
const engine=process.env.PW_BROWSER||'chromium';
if(!['chromium','webkit'].includes(engine))throw Error('Browser must be chromium or webkit');
const html=path.resolve(__dirname,'../artifacts/v2-ag/parcours-v2-reprise.html');
AG.create(html);
const url=pathToFileURL(html).href;
(async()=>{
 const browser=await ({chromium,webkit})[engine].launch({
   headless:true,args:engine==='chromium'?['--no-sandbox']:[]
 });
 try{
  for(const mode of ['desktop','mobile']){
   const opts=mode==='mobile'?
     {...devices['iPhone 12'],locale:'fr-FR',reducedMotion:'reduce'}:
     {viewport:{width:1365,height:850},locale:'fr-FR',reducedMotion:'reduce'};
   const context=await browser.newContext(opts);
   const page=await context.newPage(),errors=[],requests=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>requests.push(r.url()));
   await context.setOffline(true);
   await page.goto(url,{waitUntil:'domcontentloaded'});
   await page.getByText('Un laboratoire pour tester').waitFor();
   assert.ok(await page.getByText('1 523',{exact:true}).isVisible());
   const canSave=await page.evaluate(()=>{
     try{return window.localStorage.getItem('qpjb-preview-v2-ag-local-resume-v1-probe')===null}
     catch(_){return false;}
   });
   const savedIndicator=page.getByText('Sauvegarde locale active sur cet appareil',{exact:false});
   if(canSave)assert.ok(await savedIndicator.isVisible());
   else assert.ok(await page.getByText('Sauvegarde locale indisponible',{exact:false}).isVisible());
   async function noOverflow(){
     const widths=await page.evaluate(()=>({
       content:document.documentElement.scrollWidth,
       viewport:document.documentElement.clientWidth
     }));
     assert.ok(widths.content<=widths.viewport+2,JSON.stringify(widths));
   }
   await noOverflow();
   await page.locator('#nav-play').click();
   await page.getByText('Question 1 sur 10').waitFor();
   await page.locator('button.choice').first().click();
   await page.getByText('Réponse du catalogue :').waitFor();
   if(canSave){
     await page.reload({waitUntil:'domcontentloaded'});
     await page.getByText('Question 1 sur 10').waitFor();
     assert.ok(await page.locator('.feedback').isVisible());
     await page.locator('button[data-action=next]').click();
     await page.getByText('Question 2 sur 10').waitFor();
     await page.reload({waitUntil:'domcontentloaded'});
     await page.getByText('Question 2 sur 10').waitFor();
     assert.equal(await page.locator('.feedback').count(),0,
       'Unanswered second question should still be unanswered');
     for(let i=1;i<10;i++){
       await page.locator('button.choice').first().click();
       await page.getByText('Réponse du catalogue :').waitFor();
       await page.locator('button[data-action=next]').click();
     }
     await page.getByText('Bilan de la séance 1').waitFor();
     await page.reload({waitUntil:'domcontentloaded'});
     await page.getByText('Bilan de la séance 1').waitFor();
     await page.locator('button[data-action=start]').last().click();
     await page.getByText('Séance fictive 2').waitFor();
     await page.reload({waitUntil:'domcontentloaded'});
     await page.getByText('Séance fictive 2').waitFor();
     await page.locator('button[data-action=reset]').click();
     await page.getByText('Un laboratoire pour tester').waitFor();
     await page.reload({waitUntil:'domcontentloaded'});
     await page.getByText('Un laboratoire pour tester').waitFor();
     await page.locator('#nav-play').click();
     await page.getByText('Séance fictive 1').waitFor();
   }else{
     await page.reload({waitUntil:'domcontentloaded'});
     await page.getByText('Un laboratoire pour tester').waitFor();
   }
   assert.deepEqual(errors,[],'No browser exceptions: '+engine+'/'+mode);
   assert.ok(requests.every(u=>u.startsWith('file://')||u.startsWith('data:')),
      'No external browser requests');
   await noOverflow();
   console.log('QPJB AG BROWSER '+engine+' '+mode+' localStorage='+
       (canSave?'ACTIVE_RELOAD_PASS':'UNAVAILABLE_FALLBACK_PASS'));
   await context.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
