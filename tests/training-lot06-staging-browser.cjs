'use strict';
// Test de rendu par injection EN MEMOIRE : ne rend aucun candidat accessible en production.
const {chromium,webkit,devices}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const project=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!pathname.startsWith('/QPJB/')){res.writeHead(404);res.end();return;}
 const rel=pathname.slice('/QPJB/'.length);
 let file=path.resolve(project,rel);
 if(!file.startsWith(project+path.sep)&&file!==project){res.writeHead(403);res.end();return;}
 try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res)}
 catch{res.writeHead(404);res.end();}
});
(async()=>{
 await new Promise(resolve=>server.listen(8776,'127.0.0.1',resolve));
 const kind=process.env.PW_BROWSER||'chromium';
 assert.ok(['chromium','webkit'].includes(kind));
 const browser=await ({chromium,webkit})[kind].launch({headless:true,args:kind==='chromium'?['--no-sandbox']:[]});
 let context;
 try{
  context=await browser.newContext({...devices['iPhone 12'],locale:'fr-FR'});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8776/QPJB/',{waitUntil:'domcontentloaded'});
  await page.locator('.training-button[data-training-mode="bidding"]').click({timeout:30000});
  const frame=page.frameLocator('#training-frame');
  await frame.locator('.topic-group .tile').first().waitFor({state:'visible',timeout:30000});
  const child=page.frames().find(x=>x.url().includes('/entrainement/'));
  assert.ok(child,'embedded training frame exists');
  const initial=await child.evaluate(()=>({bid:D.bidding.length,play:D.play.length}));
  assert.deepEqual(initial,{bid:622,play:0},'live dataset remains unchanged on first load');
  const stage=JSON.parse(fs.readFileSync(path.join(project,'entrainement/staging/lot06-candidats.json'),'utf8'));
  await child.evaluate(list=>{
   // L'injection est exclusivement locale au navigateur de tests.
   D.bidding.push(...list.map(x=>({...x,reviewStatus:'lot06_test_preview'})));
   cat='suite-repondant';id='EN-BH-130-06';randomMode=false;sessionIds=[id];
   trainingApplyPage('quiz',false,false);
  },stage.bidding);
  await frame.locator('.qpjb-bid-quiz').waitFor({state:'visible',timeout:10000});
  assert.match(await frame.locator('.qpjb-bid-quiz h2').first().textContent(),/Vous êtes en Nord/);
  assert.equal(await frame.locator('.qpjb-bid-quiz .choice').count(),4);
  await frame.locator('.qpjb-bid-quiz .choice').filter({hasText:/^Passe$/}).click();
  await frame.locator('.feedback').waitFor({state:'visible',timeout:5000});
  assert.match(await frame.locator('.feedback').textContent(),/Bonne réponse/i);
  await child.evaluate(async list=>{
    await ensureTrainingData('play');
    D.play.push(...list.map(x=>({...x,reviewStatus:'lot06_test_preview'})));
    cat='play';ptopic='all';id='JC-BH-079-02';randomMode=false;sessionIds=[id];
    trainingApplyPage('quiz',false,false);
  },stage.play);
  await frame.locator('.play-free-panel .deal-viewer').waitFor({state:'visible',timeout:10000});
  const seats=await frame.locator('.play-free-panel .deal-seat').evaluateAll(nodes=>nodes.map(x=>x.getAttribute('data-seat')));
  assert.deepEqual(seats,['south'],'only the genuine known defender hand is shown');
  await frame.locator('.play-free-panel button').filter({hasText:/Découvrir l’analyse/}).click();
  await frame.locator('.play-free-panel .analysis-body').waitFor({state:'visible',timeout:5000});
  assert.match(await frame.locator('.analysis-body').textContent(),/♥V/);
  assert.deepEqual(errors,[],'no browser runtime errors');
  console.log('LOT06 STAGING '+kind.toUpperCase()+' PASS — North bidder + South single-hand + choice feedback');
 }finally{if(context)await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());