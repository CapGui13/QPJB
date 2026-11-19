'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium,webkit,devices}=require('playwright');
const builder=require('../scripts/parcours-v2-ay-live-build.cjs');
const F=require('../scripts/parcours-v2-pilot.cjs');
const ROOT=path.resolve(__dirname,'..');
const browserName=process.env.PW_BROWSER||'chromium';
const AZ='qpjb-preview-v2-az-01';
async function run(){
 const {output}=builder.build();
 assert.ok(['chromium','webkit'].includes(browserName));
 const browser=await ({chromium,webkit})[browserName].launch({
  headless:true,args:browserName==='chromium'?['--no-sandbox']:[]
 });
 try{
  for(const mobile of [false,true]){
   const context=await browser.newContext(mobile?
    {...devices['iPhone 12'],locale:'fr-FR',reducedMotion:'reduce'}:
    {viewport:{width:1365,height:850},locale:'fr-FR',reducedMotion:'reduce'});
   const page=await context.newPage(),errors=[],requests=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('request',r=>requests.push(r.url()));
   await context.setOffline(true);
   await page.goto(pathToFileURL(output).href,{waitUntil:'domcontentloaded'});
   await page.getByText('Parcours guidé adaptatif — test AZ').waitFor();
   assert.ok(await page.locator('#model').isVisible());
   // Le mode élève démarre sans les huit compléments en attente d'arbitrage.
   assert.equal(await page.locator('#model').inputValue(),'core');
   await page.locator('#start').click();
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-preview-v2-az-01')).model),'core');
   await page.getByText('Séance 1/65').waitFor();
   const q1=await page.locator('.hint').filter({hasText:'SEF'}).first().textContent();
   assert.ok(q1);
   await page.locator('.choice').first().click();
   await page.locator('#answer').click();
   await page.locator('.feedback').waitFor({state:'visible'});
   const originals={v1:'{"completed":11}',v2:'{"completed":8}',training:'{"results":{}}'};
   await page.evaluate(({data})=>{
      localStorage.setItem('qpjb-sef-parcours-01',data.v1);
      localStorage.setItem('qpjb-sef-parcours-v2-01',data.v2);
      localStorage.setItem('qpjb-sef-entrainement-01',data.training);
   },{data:originals});
   await page.reload();
   await page.locator('.feedback').waitFor();
   await page.locator('#next').click();
   await page.getByText('Question 2/10').waitFor();
   await page.locator('#home').click();
   await page.getByText('Parcours guidé adaptatif — test AZ').waitFor();
   await page.locator('#start').click();
   await page.getByText('Question 2/10').waitFor();
   // Test a REAL continuation at session 18 using the original browser selection engine.
   await page.evaluate(async({key})=>{
     const model='seven',engine=window.AYEngine,annotations=engine.loadAnnotations();
     const source=engine.loadCatalog(),state=engine.newState(13);
     for(let s=0;s<17;s++){
       const deck=engine.select(source,state,annotations,10);
       engine.recordSession(state,deck,
         engine.simulatedAnswers(deck,s,13,'balanced'),annotations);
     }
     localStorage.setItem(key,JSON.stringify({schema:1,model,engineState:state,
       current:null,completed:Array.from({length:17},(_,i)=>({number:i+1,correct:8,questions:10})),
       addonAnswers:[],nextSession:18,finished:false}));
   },{key:AZ});
   await page.reload();
   await page.getByText('Bilan de la séance 17').waitFor();
   await page.locator('#nextSession').click();
   await page.getByText('Séance 18/65').waitFor();
   const before=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),AZ);
   assert.equal(before.current.items.length,10);
   assert.equal(before.current.items.filter(i=>i.origin==='ADDON').length,1);
   assert.equal(before.current.items.find(i=>i.origin==='ADDON').id,'EN-BH-067-06');
   const initialCore=before.current.items.filter(i=>i.origin==='SEF').map(i=>i.id);
   assert.equal(initialCore.length,9);
   for(let i=0;i<10;i++){
      if(i>0)await page.locator('#next').click();
      if(i===4){
        await page.getByText('EN-BH-067-06').waitFor();
        await page.locator('.choice').first().click();
      }else await page.locator('.choice').first().click();
      await page.locator('#answer').click();
      await page.locator('.feedback').waitFor();
   }
   await page.locator('#next').click();
   await page.getByText('Bilan de la séance 18').waitFor();
   const finished=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),AZ);
   assert.equal(finished.engineState.session,18);
   assert.equal(finished.addonAnswers.length,1);
   assert.equal(finished.addonAnswers[0].noMasteryCredit,true);
   assert.equal(finished.completed.length,18);
   assert.equal(finished.current,null);
   const persisted=await page.evaluate(()=>({
     v1:localStorage.getItem('qpjb-sef-parcours-01'),
     v2:localStorage.getItem('qpjb-sef-parcours-v2-01'),
     training:localStorage.getItem('qpjb-sef-entrainement-01')
   }));
   assert.deepEqual(persisted,originals);
   await page.locator('#home').click();
   page.once('dialog',dialog=>dialog.accept());
   await page.locator('#erase').click();
   // Reset must erase AZ only.
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),AZ),null);
   // Une sauvegarde AZ illisible doit être conservée, non écrasée par un nouveau départ.
   const incompatible='{sauvegarde-ancienne-incompatible';
   await page.evaluate(({key,value})=>localStorage.setItem(key,value),
     {key:AZ,value:incompatible});
   await page.reload();
   await page.getByText('Sauvegarde AZ incompatible',{exact:true}).waitFor();
   assert.equal(await page.locator('#start').count(),0);
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),AZ),incompatible);
   page.once('dialog',dialog=>dialog.dismiss());
   await page.locator('#eraseIncompatible').click();
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),AZ),incompatible,
     'Annuler doit préserver la sauvegarde illisible');
   page.once('dialog',dialog=>dialog.accept());
   await page.locator('#eraseIncompatible').click();
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),AZ),null);
   await page.locator('#model').waitFor();
   assert.equal(await page.locator('#model').inputValue(),'core');
   assert.deepEqual(await page.evaluate(()=>({
     v1:localStorage.getItem('qpjb-sef-parcours-01'),
     v2:localStorage.getItem('qpjb-sef-parcours-v2-01'),
     training:localStorage.getItem('qpjb-sef-entrainement-01')
   })),originals);
   // Le lien élève est distinct de l'atelier AZ : pas de suppléments ni de migration implicite.
   await page.goto(pathToFileURL(output).href+'?mode=eleve',{waitUntil:'domcontentloaded'});
   await page.getByText('Parcours guidé SEF — 65 séances').waitFor();
   assert.equal(await page.locator('#model').count(),0);
   assert.equal(await page.getByText('Expérimental : 7 ouvertures complémentaires').count(),0);
   await page.locator('#start').click();
   await page.getByText('Séance 1/65').waitFor();
   const pupil=await page.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-preview-v2-eleve-01')));
   assert.equal(pupil.model,'core');
   assert.equal(pupil.current.items.length,10);
   assert.ok(pupil.current.items.every(q=>q.origin==='SEF'));
   assert.equal(await page.evaluate(key=>localStorage.getItem(key),AZ),null,
     'La sauvegarde du mode enseignant doit rester distincte');
   assert.deepEqual(await page.evaluate(()=>({
     v1:localStorage.getItem('qpjb-sef-parcours-01'),
     v2:localStorage.getItem('qpjb-sef-parcours-v2-01'),
     training:localStorage.getItem('qpjb-sef-entrainement-01')
   })),originals);
   assert.deepEqual(errors,[],'Browser exceptions: '+browserName+'/'+mobile);
   assert.ok(requests.every(u=>u.startsWith('file://')||u.startsWith('data:')),
     'Network request blocked');
   const widths=await page.evaluate(()=>({
     w:document.documentElement.scrollWidth,c:document.documentElement.clientWidth
   }));
   assert.ok(widths.w<=widths.c+2,'Horizontal overflow '+JSON.stringify(widths));
   console.log('QPJB-AZ-BROWSER PASS '+browserName+' '+(mobile?'mobile':'desktop')+
    ' adaptive, resume, S18-addon, V1/V2 isolation');
   await context.close();
  }
 }finally{await browser.close()}
}
run().catch(err=>{console.error(err);process.exitCode=1});
