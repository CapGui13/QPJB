'use strict';
// QPJB Training: visual safeguards and reproducible screenshots, not a
// substitute for an actual Safari/iPhone/PWA check.
const {chromium,webkit,devices}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const browserName=process.env.PW_BROWSER||'chromium';
const out=path.resolve(root,'artifacts/training-visual',browserName);
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!pathname.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
 let file=path.resolve(root,pathname.slice('/QPJB/'.length));
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return}
 try{
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(404);res.end()}
});
const specs=[
 {name:'iphone12',size:{width:390,height:844},mobile:true},
 {name:'short',size:{width:375,height:667},mobile:true},
 {name:'landscape',size:{width:844,height:390},mobile:true},
 {name:'desktop',size:{width:1365,height:768},mobile:false},
 {name:'large-text',size:{width:390,height:844},mobile:true,largerText:true}
];
const results=[];
function checkNoHorizontalOverflow(measure,where){
 assert.ok(measure.docWidth<=measure.viewportWidth+3,
  where+' horizontal overflow: '+JSON.stringify(measure));
 assert.ok(measure.options.length===4,where+' must retain all four choices');
 assert.ok(measure.options.every(o=>o.width>=44&&o.left>=-3&&o.right<=measure.viewportWidth+3),
  where+' controls clipped: '+JSON.stringify(measure));
}
async function capture(frame,selector,file){
 await frame.locator(selector).screenshot({path:path.join(out,file),animations:'disabled',timeout:15000});
}
async function geometry(frame,kind){
 return frame.locator('#root').evaluate((root,selector)=>{
  const choices=root.querySelector(selector);
  const options=[...choices.querySelectorAll('button')].map(el=>{
   const r=el.getBoundingClientRect();
   return {left:r.left,right:r.right,width:r.width};
  });
  return {viewportWidth:document.documentElement.clientWidth,
   viewportHeight:document.documentElement.clientHeight,
   docWidth:document.documentElement.scrollWidth,
   options,grid:getComputedStyle(choices).gridTemplateColumns};
 },kind==='bid'?'.qpjb-bid-quiz .choices':'.cq-stage .cq-options');
}
async function waitView(frame,name,extra){
 await frame.waitForFunction(({name,extra})=>
  view===name && (!extra || (extra==='entames'?ptopic==='entames':extra==='plan-qcm'?ptopic==='plan-qcm':cat===extra)),
  {name,extra},{timeout:20000});
}
async function run(browser,spec){
 const context=await browser.newContext(spec.mobile?
  {...devices['iPhone 12'],viewport:spec.size,locale:'fr-FR',colorScheme:'dark',reducedMotion:'reduce'}:
  {viewport:spec.size,deviceScaleFactor:1,locale:'fr-FR',colorScheme:'dark',reducedMotion:'reduce'});
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto('http://127.0.0.1:8771/QPJB/',{waitUntil:'domcontentloaded'});
  await page.locator('.training-button[data-training-mode="bidding"]').click({timeout:30000});
  const locator=page.frameLocator('#training-frame');
  await locator.locator('.topic-group .tile').first().waitFor({state:'visible',timeout:30000});
  const frame=page.frames().find(f=>f.url().includes('/entrainement/'));
  assert.ok(frame,'Training iframe loaded');
  if(spec.largerText)await frame.evaluate(()=>{
   document.documentElement.style.setProperty('-webkit-text-size-adjust','150%','important');
   document.documentElement.style.setProperty('text-size-adjust','150%','important');
  });
  await frame.evaluate(()=>topic('2sa'));
  await waitView(frame,'list','2sa');
  await frame.evaluate(()=>item('EN-2sa-001'));
  await frame.waitForFunction(()=>id==='EN-2sa-001'&&view==='quiz',{timeout:15000});
  await locator.locator('.qpjb-bid-quiz').waitFor({state:'visible'});
  const bid=await geometry(locator,'bid');
  checkNoHorizontalOverflow(bid,spec.name+' bidding');
  await capture(locator,'.qpjb-bid-quiz',spec.name+'-bidding.png');
  // Strongest screen constraint: on a short portrait phone, the choices must fit.
  if(spec.name==='short'){
   const box=await locator.locator('.qpjb-bid-quiz .choices').boundingBox();
   assert.ok(box&&box.y+box.height<=spec.size.height+6,'Short iPhone shows four bidding answers');
  }
  // La barre de changement de mode est masquée dans un QCM : sortir
  // du QCM avant de demander le jeu de la carte.
  await frame.evaluate(()=>go('list'));
  await waitView(frame,'list','2sa');
  await page.locator('.training-tab[data-mode="play"]').click({timeout:15000});
  await waitView(frame,'playtopics');
  await frame.evaluate(()=>playTopic('entames'));
  await waitView(frame,'list','entames');
  await frame.evaluate(()=>item('JC-BH-020-Q01'));
  await frame.waitForFunction(()=>id==='JC-BH-020-Q01'&&view==='quiz',{timeout:15000});
  const stage=locator.locator('.cq-stage'),table=stage.locator('.deal-viewer');
  await table.waitFor({state:'visible'});
  const card=await geometry(locator,'card');
  checkNoHorizontalOverflow(card,spec.name+' cards');
  if(spec.size.width<=600)assert.equal(card.grid.trim().split(/\s+/).length,2,
   'Short entame options must use the compact two-column layout');
  await capture(locator,'.cq-stage',spec.name+'-entame.png');
  if(spec.name==='iphone12'){
   // Pixel regression without a fragile cross-platform golden image:
   // a checked then unchecked answer MUST return the same table screenshot.
   const before=await table.screenshot({animations:'disabled'});
   await stage.locator('.cq-option').nth(0).click();
   await stage.locator('.deal-played').waitFor({state:'attached'});
   await capture(locator,'.cq-stage','iphone12-entame-answered.png');
   await stage.locator('.cq-option').nth(0).click();
   await frame.waitForFunction(()=>!document.querySelector('.cq-stage .deal-played'));
   const after=await table.screenshot({animations:'disabled'});
   assert.ok(before.equals(after),
    'Card table visual pixels must be identical after answer selection and unselection');
  }
  if(spec.name==='iphone12'||spec.name==='desktop'||spec.name==='landscape'){
   await frame.evaluate(()=>playTopic('plan-qcm'));
   await waitView(frame,'list','plan-qcm');
   await frame.evaluate(()=>item('JC-BH-004-1-Q01'));
   await frame.waitForFunction(()=>id==='JC-BH-004-1-Q01'&&view==='quiz',{timeout:15000});
   const long=await geometry(locator,'card');
   checkNoHorizontalOverflow(long,spec.name+' long options');
   if(spec.size.width<=600)assert.equal(long.grid.trim().split(/\s+/).length,1,
     'Long QCM answers must have one full-width column');
   await capture(locator,'.cq-stage',spec.name+'-long-card.png');
  }
  if(spec.name==='iphone12'||spec.name==='desktop'){
   await frame.evaluate(()=>playTopic('plan-libre'));
   await waitView(frame,'list','plan-libre');
   await frame.evaluate(()=>item('JC-010'));
   await frame.waitForFunction(()=>id==='JC-010'&&view==='quiz',{timeout:15000});
   await locator.locator('.legacy-defense-source').waitFor({state:'visible'});
   await capture(locator,'.legacy-defense-source',spec.name+'-historical-defense.png');
  }
  const timing=await frame.evaluate(()=>{
   const nav=performance.getEntriesByType('navigation')[0];
   const assets=performance.getEntriesByType('resource').filter(x=>x.name.includes('/entrainement/'));
   return {navigationMs:Math.round(nav?.duration||0),
    firstRenderMs:Math.round(performance.getEntriesByName('qpjb-training-first-render')[0]?.startTime||0),
    fontsReadyMs:Math.round(performance.getEntriesByName('qpjb-training-fonts-ready')[0]?.startTime||0),
    resources:assets.map(x=>({name:x.name.split('/').at(-1),ms:Math.round(x.duration),
      bytes:x.decodedBodySize||0})).slice(0,12),
    dataResourceBytes:assets.filter(x=>x.name.includes('training-data.js')).reduce((a,x)=>a+x.decodedBodySize,0)};
  });
  assert.equal(errors.length,0,'No browser JS errors: '+errors.join('; '));
  results.push({screen:spec.name,viewport:spec.size,bidding:bid,card:card,
    timing,errors:0});
 }finally{await context.close()}
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 await new Promise(resolve=>server.listen(8771,'127.0.0.1',resolve));
 const browser=await ({chromium,webkit})[browserName].launch({
  headless:true,args:browserName==='chromium'?['--no-sandbox']:[]});
 try{
  for(const spec of specs)await run(browser,spec);
  fs.writeFileSync(path.join(out,'measurements.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify({result:'PASS',browser:browserName,screens:results.map(x=>x.screen),
   screenshots:fs.readdirSync(out).filter(x=>x.endsWith('.png')).length,
   timings:results.map(x=>({screen:x.screen,navigationMs:x.timing.navigationMs}))}));
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
