'use strict';
/* Exécution : PW_BROWSER=chromium|webkit node tests/wave2-ux-browser.cjs */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium,webkit}=require('playwright');
const {runScenarioPlan}=require('./wave2-ux-plan.cjs');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 const route=decodeURIComponent(url.pathname);
 if(!route.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
 const file=path.resolve(root,route.slice('/QPJB/'.length));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
 try{const data=fs.readFileSync(file);res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(data)}
 catch(_){res.writeHead(404);res.end()}
});
async function scenario(browser,engine,width,base){
 const context=await browser.newContext({viewport:{width,height:844},locale:'fr-FR',reducedMotion:'reduce',serviceWorkers:'block'});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(base+'/QPJB/quizz.html',{waitUntil:'domcontentloaded'});
  const skip=page.locator('.qpjb-quiz-skip');
  assert.equal(await skip.getAttribute('href'),'#parcours-start','Lien disponible dès la préparation');
  await page.locator('#parcours-start').click();
  await page.locator('#question-heading').waitFor({state:'visible'});
  assert.equal(await skip.getAttribute('href'),'#question-heading');
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'question-heading');
  const hand=await page.locator('.hand').evaluate(el=>({columns:getComputedStyle(el).gridTemplateColumns,display:getComputedStyle(el).display,font:parseFloat(getComputedStyle(el.querySelector('.suit')).fontSize)}));
  assert.equal(hand.display,'grid','Main mobile repliée en grille');
  assert.ok(hand.font>=18.5,'Main lisible, '+hand.font+'px');
  if(width===390){
   await page.locator('#free-answer').fill('???');
   await page.locator('#free-form button[type="submit"]').click();
   assert.equal(await page.locator('#free-answer').getAttribute('aria-describedby'),'bid-free-error');
   await page.locator('#free-answer').fill('1SA');
   assert.equal(await page.locator('#bid-free-error').count(),0);
   assert.equal(await page.locator('#free-answer').getAttribute('aria-describedby'),null);
  }
  await page.locator('#show-choices').click();
  assert.equal(await page.locator('#answers button').count(),4);
  await page.locator('#answers button').first().click();
  await page.locator('#answer-feedback').waitFor({state:'visible'});
  await page.waitForFunction(()=>document.activeElement?.id==='answer-feedback');
  await page.locator('#next').click();
  await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
  assert.match(await page.locator('#session-progress-label').textContent(),/Question 2 \/ 10 · 1 réponse enregistrée/);
  const checkpoint=await page.evaluate(()=>localStorage.getItem('qpjb-sef-parcours-01'));
  assert.equal(JSON.parse(checkpoint).active.index,1);
  await page.locator('#back-home').click();
  await page.waitForFunction(()=>document.activeElement?.id==='parcours-start');
  assert.equal(await skip.getAttribute('href'),'#parcours-start');
  assert.equal(await page.evaluate(()=>localStorage.getItem('qpjb-sef-parcours-01')),checkpoint,'Sauvegarde identique après suspension');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#parcours-start').click();
  await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
  assert.equal(await page.locator('#qpjb-quiz-announcement').textContent(),'Séance reprise. Question 2 sur 10.');
  assert.equal(JSON.parse(await page.evaluate(()=>localStorage.getItem('qpjb-sef-parcours-01'))).active.index,1);
  const size=await page.evaluate(()=>({total:document.documentElement.scrollWidth,visible:document.documentElement.clientWidth}));
  assert.ok(size.total<=size.visible+2,'Pas de débordement horizontal '+JSON.stringify(size));
  for(let i=1;i<10;i++){
   await page.locator('#pass').click();
   if(i<9)await page.waitForFunction(n=>document.querySelector('#step')?.textContent.includes((n+2)+' / 10'),i);
  }
  await page.locator('#session-summary-title').waitFor({state:'visible'});
  assert.equal(await skip.getAttribute('href'),'#session-summary-title');
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'session-summary-title');
  const totals=(await page.locator('.session-summary-stats dd').allTextContents()).map(Number);
  assert.equal(totals.reduce((a,b)=>a+b,0),10);
  await page.locator('#done-home').click();
  await page.waitForFunction(()=>document.activeElement?.id==='parcours-start');
  assert.deepEqual(errors,[]);
  console.log('PASS M3 '+engine+'/'+width+'px : reprise, clavier, main et bilan');
 }finally{await context.close()}
}

function contrastRatio(a,b){
 const lum=text=>{
  const m=String(text).match(/[0-9.]+/g);assert.ok(m?.length>=3,'Couleur RGB disponible '+text);
  const rgb=m.slice(0,3).map(v=>Number(v)/255).map(x=>x<=0.04045?x/12.92:Math.pow((x+0.055)/1.055,2.4));
  return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722;
 };
 const x=lum(a),y=lum(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);
}
async function touchScenario(browser,engine,base){
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,locale:'fr-FR',reducedMotion:'reduce',serviceWorkers:'block'});
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(base+'/QPJB/quizz.html',{waitUntil:'domcontentloaded'});
  await page.locator('#parcours-start').click();
  await page.locator('#free-answer').waitFor({state:'visible'});
  assert.equal(await page.locator('#free-answer').getAttribute('readonly'),'','Clavier AZERTY natif désactivé sur tactile');
  await page.locator('#free-answer').click();
  await page.locator('#bid-keypad.is-open').waitFor({state:'visible',timeout:6000});
  assert.equal(await page.locator('#bid-keypad [data-bid-key]').count(),16,'Touches bridge intactes');
  const sizes=await page.locator('#bid-keypad [data-bid-key]').evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect().height));
  assert.ok(sizes.every(v=>v>=43.5),'Cibles tactiles du clavier >=44px : '+sizes.join(','));
  await page.locator('#bid-keypad [data-bid-key="2"]').click();
  await page.locator('#bid-keypad [data-bid-key="♠"]').click();
  assert.equal(await page.locator('#free-answer').inputValue(),'2♠','Composition de 2♠');
  await page.locator('#bid-keypad [data-bid-key="⌫"]').click();
  assert.equal(await page.locator('#free-answer').inputValue(),'2','Retour arrière conserve le palier');
  await page.locator('#bid-keypad [data-bid-key="Passe"]').click();
  assert.equal(await page.locator('#free-answer').inputValue(),'Passe');
  await page.locator('#bid-keypad [data-bid-key="⌫"]').click();
  assert.equal(await page.locator('#free-answer').inputValue(),'');
  await page.locator('#bid-key-close').click();
  await page.locator('#bid-keypad').waitFor({state:'hidden',timeout:5000});
  assert.equal(await page.locator('#bid-key-toggle').getAttribute('aria-expanded'),'false','Fermeture ARIA');
  assert.deepEqual(errors,[],'Aucune exception JS tactile');
  console.log('PASS M3 '+engine+'/tactile : 16 touches, composition, suppression, ARIA');
 }finally{await context.close()}
}
async function layoutScenario(browser,engine,width,height,base){
 const context=await browser.newContext({viewport:{width,height},locale:'fr-FR',reducedMotion:'reduce',serviceWorkers:'block'});
 const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(base+'/QPJB/quizz.html',{waitUntil:'domcontentloaded'});
  await page.locator('#parcours-start').click();
  await page.locator('#question-heading').waitFor({state:'visible'});
  const dims=await page.evaluate(()=>{
   const hand=document.querySelector('.hand'),entry=document.querySelector('.free-entry-row');
   const empty=document.querySelector('.auc td.auction-empty'),ask=document.querySelector('.auc td.ask.pulse');
   return {outer:document.documentElement.scrollWidth,inner:document.documentElement.clientWidth,
    hand:getComputedStyle(hand).gridTemplateColumns,handDisplay:getComputedStyle(hand).display,
    entry:getComputedStyle(entry).gridTemplateColumns,
    empty:empty?{color:getComputedStyle(empty).color,bg:getComputedStyle(empty).backgroundColor,opacity:getComputedStyle(empty).opacity}:null,
    motion:ask?getComputedStyle(ask).animationName:null};
  });
  assert.ok(dims.outer<=dims.inner+2,'Débordement horizontal '+width+'px : '+JSON.stringify(dims));
  if(width===195){
   assert.equal(dims.handDisplay,'grid','Zoom 200% : main en grille');
   assert.equal(dims.hand.trim().split(/\s+/).length,1,'Zoom 200% : une colonne pour la main');
   assert.equal(dims.entry.trim().split(/\s+/).length,1,'Zoom 200% : saisie en une colonne');
  }
  if(dims.empty){
   assert.equal(dims.empty.opacity,'1','Cellule vide sans réduction d’opacité');
   assert.ok(contrastRatio(dims.empty.color,dims.empty.bg)>=4.5,'Contraste calculé AA : '+contrastRatio(dims.empty.color,dims.empty.bg));
  }
  if(dims.motion!==null)assert.equal(dims.motion,'none','Mouvement réduit respecté');
  const dir=process.env.PW_ARTIFACT_DIR||path.join(root,'artifacts','wave2-ux');
  fs.mkdirSync(dir,{recursive:true});
  await page.screenshot({path:path.join(dir,engine+'-'+width+'x'+height+'-P6.png'),fullPage:true});
  assert.deepEqual(errors,[],'Aucune erreur JS reflow');
  console.log('PASS M3 '+engine+'/'+width+'x'+height+' : reflow, contraste, mouvement réduit');
 }finally{await context.close()}
}
async function emptySelectionScenario(browser,engine,base){
 const context=await browser.newContext({viewport:{width:360,height:760},locale:'fr-FR',reducedMotion:'reduce'});
 const page=await context.newPage();
 try{
  await page.goto(base+'/QPJB/quizz.html',{waitUntil:'domcontentloaded'});
  await page.locator('#selection-mode').selectOption('review');
  await page.locator('#new').click();
  await page.locator('body.session-mode').waitFor();
  assert.match(await page.locator('#body').textContent(),/Aucun exercice pour cette combinaison/);
  assert.equal(await page.locator('.qpjb-quiz-skip').getAttribute('href'),'#back-home');
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'back-home');
  await page.locator('#back-home').click();
  await page.waitForFunction(()=>document.activeElement?.id==='new');
  assert.equal(await page.locator('.qpjb-quiz-skip').getAttribute('href'),'#parcours-start');
  console.log('PASS M3 '+engine+'/selection-vide : retour clavier accessible');
 }finally{await context.close()}
}
async function keyboardScenario(browser,engine,base){
 const context=await browser.newContext({viewport:{width:1280,height:900},locale:'fr-FR',reducedMotion:'reduce',serviceWorkers:'block'});
 const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(base+'/QPJB/quizz.html',{waitUntil:'domcontentloaded'});
  await page.locator('#parcours-start').focus();
  await page.keyboard.press('Enter');
  await page.locator('#question-heading').waitFor({state:'visible'});
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'question-heading','Focus du titre après ouverture au clavier');
  await page.locator('#show-choices').focus();
  await page.keyboard.press('Enter');
  await page.locator('#answers button').first().waitFor({state:'visible'});
  assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('data-choice')),'0','Première proposition focalisée');
  await page.keyboard.press('Enter');
  await page.locator('#answer-feedback').waitFor({state:'visible'});
  await page.waitForFunction(()=>document.activeElement?.id==='answer-feedback');
  assert.ok((await page.locator('.feedback-explanation').textContent()).trim().length>10);
  await page.locator('#next').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('#step')?.textContent.includes('2 / 10'));
  assert.equal(await page.evaluate(()=>document.activeElement?.id),'question-heading','Retour du focus sur la nouvelle question');
  assert.deepEqual(errors,[],'Aucune exception JS en navigation clavier');
  console.log('PASS M3 '+engine+'/clavier : lancement, QCM, correction, question suivante');
 }finally{await context.close()}
}
(async()=>{
 const selected=process.env.PW_BROWSER;
 const engines=selected?[selected]:['chromium','webkit'];
 assert.ok(engines.every(x=>['chromium','webkit'].includes(x)),'Moteur navigateur inconnu');
 const reports=[];
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 const base='http://127.0.0.1:'+server.address().port;
 try{
  for(const engine of engines){
   let browser;
   try{
    browser=await ({chromium,webkit})[engine].launch({headless:true,
     args:engine==='chromium'?['--no-sandbox']:[]});
   }catch(err){
    reports.push({engine,passed:0,failed:1,
     results:[{name:'démarrage '+engine,status:'failed',error:String(err.stack||err),durationMs:0}]});
    console.error('M3 FAIL lancement '+engine+' : '+String(err.stack||err));
    continue;
   }
   try{
    const cases=[
     {name:'parcours 320px',run:()=>scenario(browser,engine,320,base)},
     {name:'parcours 390px',run:()=>scenario(browser,engine,390,base)},
     {name:'clavier tactile 390px',run:()=>touchScenario(browser,engine,base)},
     {name:'aucun exercice',run:()=>emptySelectionScenario(browser,engine,base)},
     {name:'navigation clavier',run:()=>keyboardScenario(browser,engine,base)},
     {name:'reflow 195x422px',run:()=>layoutScenario(browser,engine,195,422,base)},
     {name:'paysage 844x390px',run:()=>layoutScenario(browser,engine,844,390,base)}
    ];
    const report=await runScenarioPlan(cases);
    reports.push({engine,...report});
   }finally{
    await browser.close();
   }
  }
 }finally{
  await new Promise(resolve=>server.close(resolve));
  const dir=process.env.PW_ARTIFACT_DIR||path.join(root,'artifacts','wave2-ux');
  fs.mkdirSync(dir,{recursive:true});
  const outfile=path.join(dir,'rapport-m3-'+engines.join('-')+'.json');
  fs.writeFileSync(outfile,JSON.stringify({schemaVersion:1,source:'wave2-ux-browser.cjs',
   generatedAt:new Date().toISOString(),reports},null,2)+'\n');
  console.log('Rapport détaillé M3 : '+outfile);
 }
 const failures=reports.reduce((n,r)=>n+r.failed,0);
 const passed=reports.reduce((n,r)=>n+r.passed,0);
 console.log('M3 SCÉNARIOS : '+passed+' réussis / '+failures+' échecs sur '+reports.length+' moteur(s)');
 if(failures)throw new Error('Recette navigateur M3 incomplète : '+failures+' scénario(s) en échec');
})().catch(err=>{console.error(err.stack||err);process.exitCode=1});
