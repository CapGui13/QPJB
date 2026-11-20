'use strict';
// Parcours privé de 65 séances : recette navigateur réelle avec sauvegarde isolée.
// Aucune modification du Quiz SEF, aucune donnée élève réelle importée.
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium,webkit,devices}=require('playwright');

const root=path.resolve(__dirname,'..');
const url=pathToFileURL(path.join(root,
 'artifacts/v2-editorial-hold-private/QPJB_V2_65_SEANCES_CORRECTIONS_PROPOSEES_HOLD.html')).href;
const oldKey='qpjb-preview-v2-eleve-01';
const newKey='qpjb-preview-v2-eleve-02-hold';
const oldSentinel='{"schema":1,"legacy":"DO-NOT-MODIFY-OR-IMPORT","completed":27}';
const ids=['SEF-V416-008','SEF-V416-009','SEF-L25-007','SEF-L06-029'];
const expected=['4♣','4♦','2SA','4♦'];

function model(browserName,mobile){
 const name=mobile?'mobile':'desktop';
 const options=mobile?{...devices['iPhone 12'],locale:'fr-FR',reducedMotion:'reduce'}:
   {viewport:{width:1365,height:850},locale:'fr-FR',reducedMotion:'reduce'};
 return {name,options};
}
async function answerQuestion(page,answer){
 if(await page.locator('#free').count()){
   await page.locator('#free').fill(answer||'1♣');
 }else{
   const options=page.locator('.choice');
   assert.ok(await options.count()>=3,'Choix absents');
   const selected=answer?
     options.filter({hasText:answer}).first():options.first();
   await selected.click();
 }
 await page.locator('#answer').click();
 await page.locator('.feedback').waitFor({state:'visible'});
}
async function browserRecipe(browserName,mobile){
 const browser=await ({chromium,webkit})[browserName].launch({
   headless:true,args:browserName==='chromium'?['--no-sandbox']:[]
 });
 const {name,options}=model(browserName,mobile);
 try{
  const context=await browser.newContext(options);
  const page=await context.newPage();
  const errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',req=>requests.push(req.url()));
  await context.setOffline(true);
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.getByRole('alert').getByText(/PROTOTYPE ÉDITORIAL/).waitFor();
  assert.equal(await page.locator('#start').count(),1,'Accueil sans démarrage');
  assert.equal(await page.locator('#model').count(),0,'Aucun mode expérimental');
  const catalog=await page.evaluate(()=>{
    const payload=JSON.parse(document.querySelector('#ay-payload').textContent);
    return {count:payload.catalog.length,addons:payload.addons.length,
      decision:payload.releaseDecision,approval:payload.editorialApproval,
      answers:Object.fromEntries(payload.catalog
        .filter(q=>['SEF-V416-008','SEF-V416-009','SEF-L25-007','SEF-L06-029'].includes(q.id))
        .map(q=>[q.id,q.answer]))};
  });
  assert.equal(catalog.count,1523);
  assert.equal(catalog.addons,0);
  assert.equal(catalog.decision,'HOLD');
  assert.equal(catalog.approval,'PENDING');
  for(let k=0;k<ids.length;k++)assert.equal(catalog.answers[ids[k]],expected[k]);

  // Conserver une sauvegarde ancienne AVANT toute réponse au nouveau parcours.
  await page.evaluate(({key,sentinel})=>localStorage.setItem(key,sentinel),
    {key:oldKey,sentinel:oldSentinel});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#start').click();
  await page.getByText('Séance 1/65').waitFor();
  let saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),newKey);
  assert.equal(saved.current.items.length,10);
  assert.ok(saved.current.items.every(q=>q.origin==='SEF'));
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),oldKey),oldSentinel);

  // Réponse déjà corrigée : elle doit survivre au rechargement.
  await answerQuestion(page);
  await page.reload({waitUntil:'domcontentloaded'});
  assert.ok(await page.locator('.feedback').isVisible(),'Correction disparue après recharge');
  saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),newKey);
  assert.equal(saved.current.position,0);
  assert.equal(saved.current.revealed,true);
  assert.ok(saved.current.answers[0]);

  for(let i=1;i<10;i++){
    await page.locator('#next').click();
    await page.getByText('Question '+(i+1)+'/10').waitFor();
    await answerQuestion(page);
  }
  await page.locator('#next').click();
  await page.getByText('Bilan de la séance 1').waitFor();
  saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),newKey);
  assert.equal(saved.completed.length,1);
  assert.equal(saved.current,null);
  assert.equal(saved.nextSession,2);
  assert.equal(saved.engineState.session,1);
  assert.equal(await page.locator('#sef-session-grid .sef-step.done').count(),1);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.getByText('Bilan de la séance 1').waitFor();
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),oldKey),oldSentinel);

  // Dans une séance fictive injectée pour la recette seulement, tester
  // les quatre QCM précis et les corrigés de la variante HOLD.
  await page.evaluate(({key,ids})=>{
    const engine=window.AYEngine;
    if(!engine)throw Error('Moteur V2 indisponible');
    const payload=JSON.parse(document.querySelector('#ay-payload').textContent);
    const extras=payload.catalog.map(q=>q.id).filter(id=>!ids.includes(id)).slice(0,6);
    const items=[...ids,...extras].map(id=>({origin:'SEF',id}));
    localStorage.setItem(key,JSON.stringify({
      schema:1,model:'core',engineState:engine.newState(13),
      current:{number:1,items,position:0,answers:Array(10).fill(null),revealed:false},
      completed:[],addonAnswers:[],nextSession:1,finished:false
    }));
  },{key:newKey,ids});
  await page.reload({waitUntil:'domcontentloaded'});
  for(let n=0;n<ids.length;n++){
    assert.ok((await page.locator('.hint').allTextContents()).some(s=>s.includes(ids[n])),
      'Question éditoriale non affichée : '+ids[n]);
    await answerQuestion(page,expected[n]);
    const s=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),newKey);
    assert.equal(s.current.answers[n].correct,true,'Réponse corrigée incohérente '+ids[n]);
    if(n<ids.length-1)await page.locator('#next').click();
  }
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),oldKey),oldSentinel);

  // Réinitialiser le prototype n'efface pas l'ancienne progression.
  await page.locator('#home').click();
  await page.locator('#erase').waitFor();
  page.once('dialog',d=>d.dismiss());
  await page.locator('#erase').click();
  assert.ok(await page.evaluate(k=>localStorage.getItem(k),newKey),'Annulation doit préserver la V2 HOLD');
  page.once('dialog',d=>d.accept());
  await page.locator('#erase').click();
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),newKey),null);
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),oldKey),oldSentinel);

  // Sauvegarde HOLD illisible : refuser son écrasement silencieux.
  const broken='{invalid-HOLD-save';
  await page.evaluate(({key,value})=>localStorage.setItem(key,value),{key:newKey,value:broken});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.getByText('Sauvegarde du parcours incompatible').waitFor();
  assert.equal(await page.locator('#start').count(),0);
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),newKey),broken);
  page.once('dialog',d=>d.dismiss());
  await page.locator('#eraseIncompatible').click();
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),newKey),broken);
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),oldKey),oldSentinel);

  const widths=await page.evaluate(()=>({
    content:document.documentElement.scrollWidth,
    viewport:document.documentElement.clientWidth
  }));
  assert.ok(widths.content<=widths.viewport+2,
    'Débordement horizontal '+browserName+'/'+name+' : '+JSON.stringify(widths));
  assert.deepEqual(errors,[],'Exceptions JS '+browserName+'/'+name);
  assert.ok(requests.every(u=>u.startsWith('file://')||u.startsWith('data:')),
    'Réseau externe inattendu '+JSON.stringify(requests.filter(u=>!u.startsWith('file://'))));
  console.log('QPJB V2 HOLD BROWSER PASS '+browserName+'/'+name+
    ' : 1 séance, reprise, 4 QCM, sauvegarde historique protégée, reset sécurisé');
  await context.close();
 }finally{await browser.close();}
}
(async()=>{
 // Deux moteurs et deux formats complémentaires, sans matrice redondante.
 await browserRecipe('chromium',false);
 await browserRecipe('webkit',true);
})().catch(err=>{console.error(err.stack||err);process.exitCode=1;});
