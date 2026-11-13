'use strict';
// Navigateur mobile, données source, révélation et préservation des résultats historiques.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium,webkit,devices}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.js':'text/javascript;charset=utf-8','.html':'text/html;charset=utf-8','.css':'text/css;charset=utf-8','.json':'application/json'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
 if(!pathname.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
 let file=path.resolve(root,pathname.slice('/QPJB/'.length));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
 try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(404);res.end()}
});
(async()=>{
 await new Promise(ok=>server.listen(8774,'127.0.0.1',ok));
 const type=process.env.PW_BROWSER||'chromium';
 assert(['chromium','webkit'].includes(type));
 const browser=await ({chromium,webkit})[type].launch({headless:true,args:type==='chromium'?['--no-sandbox']:[]});
 const errors=[];
 try{
  const context=await browser.newContext({...devices['iPhone 12'],locale:'fr-FR'});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  const base='http://127.0.0.1:8774/QPJB/entrainement/';
  await page.goto(base+'originaux.html',{waitUntil:'domcontentloaded'});
  await page.locator('button.item').first().waitFor({state:'visible',timeout:30000});
  assert.equal(await page.locator('button.item').count(),139,'Tous les 139 exercices accessibles');
  assert.match(await page.locator('main').innerText(),/965/,'Total 826 + 139 expliqué');
  await page.evaluate(()=>localStorage.setItem('QPJB_TRAINING_QCM_V1',JSON.stringify({'EN-1m-001':{done:true,ok:true,validated:true,attempts:4}})));
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('button.item').first().waitFor({state:'visible'});
  const firstId=await page.locator('button.item').first().getAttribute('data-id');
  assert(firstId.startsWith('SRC-BH-'));
  await page.locator('button.item').first().click();
  assert.equal(await page.locator('.question').count(),1);
  assert.equal(await page.locator('#original-analysis').count(),0,'La réponse n’apparaît pas avant révélation');
  await page.locator('#reveal').click();
  await page.locator('#original-analysis').waitFor({state:'visible'});
  await page.locator('#mark-yes').click();
  const saved=await page.evaluate((id)=>{
   const s=JSON.parse(localStorage.getItem('QPJB_TRAINING_QCM_V1'));
   return {historical:s['EN-1m-001'],newItem:s[id]};
  },firstId);
  assert.equal(saved.historical.attempts,4,'La progression historique ne doit pas être modifiée');
  assert(saved.newItem.done&&saved.newItem.validated===true,'Nouveau résultat enregistré');
  await page.locator('#back-original-list').click();
  await page.locator('#original-progress').selectOption('ok');
  assert.equal(await page.locator('button.item').count(),1,'Filtre des exercices réussis');
  // L'application Entraînement est intégrée à la page parente via iframe.
  await page.goto('http://127.0.0.1:8774/QPJB/',{waitUntil:'domcontentloaded'});
  await page.locator('.training-button[data-training-mode="bidding"]').click({timeout:30000});
  const frame=page.frameLocator('#training-frame');
  const link=frame.getByRole('link',{name:/Ouvrir les 139 exercices originaux/});
  await link.waitFor({state:'visible',timeout:30000});
  await link.click();
  await frame.locator('button.item').first().waitFor({state:'visible',timeout:15000});
  assert.equal(await frame.locator('button.item').count(),139,'Accès direct depuis Entraînement');
  assert.deepEqual(errors,[],'Aucune erreur JavaScript');
  console.log('MISSION H BROWSER OK : '+type+' · accès 139 · correction masquée · sauvegarde sans perte · navigation');
 }finally{await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;server.close()});
