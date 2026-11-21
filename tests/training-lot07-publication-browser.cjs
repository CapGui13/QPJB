'use strict';
// Les 3 entames sont vérifiées sur le catalogue REEL, jamais injectées en mémoire.
const {chromium,webkit,devices}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),browserName=process.env.PW_BROWSER||'chromium';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
 let file=path.resolve(root,decodeURIComponent(u.pathname.slice('/QPJB/'.length)));
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return}
 try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});
 fs.createReadStream(file).pipe(res)}catch{res.writeHead(404);res.end()}
});
const specs=[{name:'phone',config:{...devices['iPhone 12'],locale:'fr-FR'}},{name:'desktop',config:{viewport:{width:1365,height:768},locale:'fr-FR'}}];
const ids=['JC-BH-079-03','JC-BH-091-03','JC-BH-091-04'],lead={'JC-BH-079-03':'♥7','JC-BH-091-03':'♦R','JC-BH-091-04':'♦8'},seat={'JC-BH-079-03':'south','JC-BH-091-03':'west','JC-BH-091-04':'west'};
let checks=0;function check(v,msg){assert.ok(v,msg);checks++}
async function run(browser,spec){
 const context=await browser.newContext(spec.config);
 const errors=[],events=[],started=Date.now();let page,child,stage='initialisation';
 try{
 page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 const track=(event,frame)=>{if(events.length<80)events.push({event,url:frame.url(),ms:Date.now()-started})};
 page.on('framenavigated',frame=>track('navigation',frame));
 page.on('framedetached',frame=>track('detachement',frame));
 await page.goto('http://127.0.0.1:8799/QPJB/',{waitUntil:'domcontentloaded'});
 await page.locator('.training-button[data-training-mode="bidding"]').click({timeout:30000});
 const frame=page.frameLocator('#training-frame');
 await frame.locator('.topic-group .tile').first().waitFor({state:'visible',timeout:30000});
 // Read the actual iframe element rather than finding an arbitrary past frame.
 child=await (await page.locator('#training-frame').elementHandle()).contentFrame();
 check(!!child&&child.url().includes('/entrainement/'),'Embedded training app matches iframe');
 // Bind assertions to the same frame in which the exact exercise was rendered.
 // A parent iframe replacement must fail with a useful diagnostic, not a
 // misleading 30-second visibility timeout in an unrelated replacement frame.
 const inChild=selector=>child.locator(selector);
 // The embedded app routes asynchronously (fade + postMessage). Do not force
 // a new exercise while an earlier parent navigation can still replace it.
 await child.waitForFunction(()=>view==='topics'&&!trainingPendingNav&&!trainingQueuedNav,null,{timeout:30000});
 await child.evaluate(async()=>{await ensureTrainingData('play')});
 const counts=await child.evaluate(()=>({b:D.bidding.length,p:D.play.length}));
 check(counts.b===638&&counts.p===188,'826 public exercises loaded');
 for(const id of ids){
  stage='rendu:'+id;
  // Every checked card is an opening lead (topic "Entame"), not a generic
  // defence topic. Assert the rendered exercise before waiting on visibility.
  await child.evaluate(x=>{
   if(!D.play.some(z=>z.id===x))throw new Error('Not published '+x);
   if(trainingPendingNav||trainingQueuedNav)throw new Error('Pending navigation before '+x);
   cat='play';ptopic='entames';id=x;randomMode=false;sessionIds=[id];trainingApplyPage('quiz',false,false);
   if(view!=='quiz'||current()?.id!==x||!document.querySelector('.play-free-panel .deal-seat'))
     throw new Error('Entame not rendered: '+x+' (view='+view+', current='+current()?.id+')');
  },id);
  console.log('LOT07 '+browserName+' '+spec.name+' '+id+' rendered');
  stage='main-visible:'+id;
  // Explicit negative test: deliberately fail after actual rendering, so CI
  // proves the diagnostic artifact path works rather than only matching text.
  if(process.env.PW_LOT07_DIAGNOSTIC_PROBE==='1'){
   stage='sonde:'+id;throw new Error('LOT07_DIAGNOSTIC_PROBE '+id);
  }
  const hand=inChild('.play-free-panel .deal-seat').first();
  await hand.waitFor({state:'visible',timeout:8000});
  stage='assertions:'+id;
  const got=await inChild('.play-free-panel .deal-seat').evaluateAll(a=>a.map(e=>e.getAttribute('data-seat')));
  check(got.length===1&&got[0]===seat[id],id+' one known hand at correct seat');
  check(await inChild('.play-free-panel .analysis-body').count()===0,id+' correction hidden');
  check(await inChild('.play-free-panel .deal-played').count()===0,id+' no answer on diagram');
  const prompt=(await inChild('.play-free-panel p').first().textContent()).replace(/[\uFE0E\uFE0F]/g,'');
  check(prompt.startsWith('Accord de la paire'),id+' agreement displayed before reveal');
  if(id!=='JC-BH-091-03')check(!new RegExp(lead[id]+'(?![0-9ARDV])').test(prompt),id+' does not leak answer');
  stage='revelation:'+id;
  await inChild('.play-free-panel button').filter({hasText:/Découvrir l’analyse/}).click();
  await inChild('.play-free-panel .analysis-body').waitFor({state:'visible',timeout:10000});
  const answer=(await inChild('.play-free-panel .analysis-body').textContent()).replace(/[\uFE0E\uFE0F]/g,'');
  check(new RegExp(lead[id]+'(?![0-9ARDV])').test(answer),id+' solution revealed');
  if(id==='JC-BH-091-03')check(answer.includes('♣D'),id+' alternative acceptable');
  if(id==='JC-BH-091-04')check(answer.includes('1SA'),id+' atout versus SA');
  check(await inChild('.play-free-panel .gamecheck').count()===1,id+' remains free self-assessment');
  const out=path.join(root,'artifacts','lot07-publication',browserName);fs.mkdirSync(out,{recursive:true});
  await page.screenshot({path:path.join(out,spec.name+'-'+id+'.png'),fullPage:true,animations:'disabled'});
 }
 stage='erreurs-javascript';
 check(errors.length===0,'No JavaScript errors: '+errors.join('; '));
 }catch(error){
  const out=path.join(root,'artifacts','lot07-publication',browserName);
  fs.mkdirSync(out,{recursive:true});
  const prefix=process.env.PW_LOT07_DIAGNOSTIC_PROBE==='1'?'probe-'+spec.name:spec.name;
  const inspection=child?await child.evaluate(()=>({
   view:typeof view==='undefined'?null:view,
   id:typeof current==='function'?current()?.id:null,
   pending:typeof trainingPendingNav==='undefined'?null:trainingPendingNav,
   queued:typeof trainingQueuedNav==='undefined'?null:trainingQueuedNav,
   seatCount:document.querySelectorAll('.play-free-panel .deal-seat').length
  })).catch(e=>({inspectionError:e.message})):null;
  const info={browser:browserName,device:spec.name,stage,error:error.message,
   childUrl:child?.url()||null,pageUrl:page?.url()||null,
   activeFrames:page?page.frames().map(f=>f.url()):[],
   frameEvents:events,inspection,javascriptErrors:errors};
  fs.writeFileSync(path.join(out,prefix+'-failure.json'),JSON.stringify(info,null,2));
  if(page)await page.screenshot({path:path.join(out,prefix+'-failure.png'),fullPage:true,animations:'disabled'}).catch(e=>{
   info.screenshotError=e.message;
   fs.writeFileSync(path.join(out,prefix+'-failure.json'),JSON.stringify(info,null,2));
  });
  console.error('LOT07_DIAGNOSTIC '+JSON.stringify(info));
  throw error;
 }finally{await context.close()}
}
(async()=>{
 check(['chromium','webkit'].includes(browserName),'Supported browser');
 await new Promise(resolve=>server.listen(8799,'127.0.0.1',resolve));
 const browser=await ({chromium,webkit})[browserName].launch({headless:true,args:browserName==='chromium'?['--no-sandbox']:[]});
 try{for(const spec of specs)await run(browser,spec);console.log('LOT07 SELECTIVE '+browserName+' PASS '+checks+' checks');}
 finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;server.close()});
