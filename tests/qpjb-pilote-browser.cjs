'use strict';
const {chromium,webkit,devices}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml',
 '.webp':'image/webp','.png':'image/png'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!pathname.startsWith('/QPJB/')){res.writeHead(404);return res.end()}
 let filename=path.resolve(root,pathname.slice('/QPJB/'.length));
 if(!filename.startsWith(root+path.sep)&&filename!==root){res.writeHead(403);return res.end()}
 try{
  if(fs.statSync(filename).isDirectory())filename=path.join(filename,'index.html');
  res.writeHead(200,{'content-type':mime[path.extname(filename)]||'application/octet-stream'});
  fs.createReadStream(filename).pipe(res);
 }catch(e){res.writeHead(404);res.end()}
});
const url='http://127.0.0.1:8792/QPJB/';
const bids=['EN-BH-134-03','EN-BH-136-05','EN-BH-139-06','EN-BH-140-01','EN-BH-140-02','EN-BH-140-05'];
const cards=['JC-BH-136-01','JC-BH-139-01','JC-BH-140-01'];
async function run(browser,device){
 const errors=[];
 const context=await browser.newContext({...device,locale:'fr-FR'});
 const page=await context.newPage();
 page.on('pageerror',err=>errors.push(err.message));
 try{
  // Le parcours ordinaire de l'application reste strictement inchangé.
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.locator('.training-button[data-training-mode="bidding"]').click({timeout:30000});
  const normal=page.frames().find(f=>f.url().includes('/entrainement/'));
  assert(normal,'L’iframe normal doit être présent');
  await normal.waitForFunction(()=>D.bidding.length===563,{timeout:30000});
  assert.equal(await normal.evaluate(()=>D.play.length),0);
  await page.goto(url+'entrainement/?pilot=1&mode=bidding',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>D.bidding.length===569,{timeout:30000});
  assert.equal(await page.evaluate(()=>D.counts.bidding),569);
  assert.equal(await page.evaluate(()=>D.counts.play),114);
  await page.evaluate(()=>localStorage.setItem('QPJB_TRAINING_QCM_V1','{"sentinel":{"done":true}}'));
  for(const id of bids){
    await page.evaluate(exId=>{
      const record=D.bidding.find(x=>x.id===exId);
      cat=record.theme;status='all';ptopic='all';item(exId);
    },id);
    await page.locator('.qpjb-bid-quiz').waitFor({state:'visible',timeout:10000});
    assert.equal(await page.locator('.qpjb-bid-quiz .choice').count(),4,id);
    assert.equal(await page.locator('.qpjb-bid-quiz .suit').count(),4,id);
    const index=await page.evaluate(exId=>{
      const q=D.bidding.find(x=>x.id===exId);
      return q.choices.indexOf(q.correct);
    },id);
    await page.locator('.qpjb-bid-quiz .choice[data-answer-index="'+index+'"]').click();
    await page.locator('.qpjb-bid-quiz .qpjb-answer-area.is-open').waitFor({state:'visible',timeout:10000});
    assert(await page.evaluate(exId=>saved[exId]?.done===true,id),'QCM non sauvegardé '+id);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    assert(overflow<=4,'Débordement horizontal '+id+': '+overflow);
  }
  await page.evaluate(()=>ensureTrainingData('play'));
  await page.waitForFunction(()=>D.play.length===117,{timeout:30000});
  for(const id of cards){
    await page.evaluate(exId=>{
      cat='play';status='all';ptopic='all';item(exId);
    },id);
    await page.locator('.play-free-panel').waitFor({state:'visible',timeout:10000});
    assert(await page.locator('.play-free-panel .deal-viewer').count()===1,'Diagramme absent '+id);
    await page.getByRole('button',{name:/Découvrir l’analyse/}).click();
    await page.locator('.play-free-panel .analysis-body').waitFor({state:'visible',timeout:10000});
    await page.getByRole('button',{name:/J’avais bon/}).click();
    assert(await page.evaluate(exId=>saved[exId]?.done===true,id),'Plan libre non sauvegardé '+id);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    assert(overflow<=4,'Débordement horizontal '+id+': '+overflow);
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('QPJB_TRAINING_QCM_V1')),
    '{"sentinel":{"done":true}}','La progression publique ne doit pas être altérée');
  const pilotSaved=await page.evaluate(()=>localStorage.getItem('QPJB_TRAINING_PILOT_9_V1'));
  assert(pilotSaved&&cards.every(id=>pilotSaved.includes(id)),'Progression pilote incomplète');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>D.bidding.length===569,{timeout:30000});
  assert.equal(await page.evaluate(()=>localStorage.getItem('QPJB_TRAINING_PILOT_9_V1')),pilotSaved,
    'Progression pilote non conservée au rechargement');
  assert.deepEqual(errors,[],'Erreurs JavaScript du navigateur : '+errors.join('; '));
  console.log(JSON.stringify({result:'PASS',device:device.isMobile?'mobile':'desktop',
    bidding:6,plans:3,published:677,staged:686,errors:0}));
 }finally{await context.close()}
}
(async()=>{
 await new Promise(resolve=>server.listen(8792,'127.0.0.1',resolve));
 const name=process.env.PW_BROWSER||'chromium';
 const browserType={chromium,webkit}[name];
 assert(browserType,'Navigateur supporté');
 const browser=await browserType.launch({headless:true,args:name==='chromium'?['--no-sandbox']:[]});
 try{
  await run(browser,devices['iPhone 12']);
  await run(browser,{viewport:{width:1280,height:800}});
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
