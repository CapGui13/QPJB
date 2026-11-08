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
 try{
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8799/QPJB/',{waitUntil:'domcontentloaded'});
 await page.locator('.training-button[data-training-mode="bidding"]').click({timeout:30000});
 const frame=page.frameLocator('#training-frame');
 await frame.locator('.topic-group .tile').first().waitFor({state:'visible',timeout:30000});
 const child=page.frames().find(f=>f.url().includes('/entrainement/'));
 check(!!child,'Embedded training app');
 await child.evaluate(async()=>{await ensureTrainingData('play')});
 const counts=await child.evaluate(()=>({b:D.bidding.length,p:D.play.length}));
 check(counts.b===633&&counts.p===188,'821 public exercises loaded');
 for(const id of ids){
  await child.evaluate(x=>{
   if(!D.play.some(z=>z.id===x))throw new Error('Not published '+x);
   cat='play';ptopic='defense';id=x;randomMode=false;sessionIds=[id];trainingApplyPage('quiz',false,false);
  },id);
  await frame.locator('.play-free-panel .deal-seat').first().waitFor({state:'visible',timeout:10000});
  const got=await frame.locator('.play-free-panel .deal-seat').evaluateAll(a=>a.map(e=>e.getAttribute('data-seat')));
  check(got.length===1&&got[0]===seat[id],id+' one known hand at correct seat');
  check(await frame.locator('.play-free-panel .analysis-body').count()===0,id+' correction hidden');
  check(await frame.locator('.play-free-panel .deal-played').count()===0,id+' no answer on diagram');
  const prompt=(await frame.locator('.play-free-panel p').first().textContent()).replace(/[\uFE0E\uFE0F]/g,'');
  check(prompt.startsWith('Accord de la paire'),id+' agreement displayed before reveal');
  if(id!=='JC-BH-091-03')check(!new RegExp(lead[id]+'(?![0-9ARDV])').test(prompt),id+' does not leak answer');
  await frame.locator('.play-free-panel button').filter({hasText:/Découvrir l’analyse/}).click();
  await frame.locator('.play-free-panel .analysis-body').waitFor({state:'visible',timeout:10000});
  const answer=(await frame.locator('.play-free-panel .analysis-body').textContent()).replace(/[\uFE0E\uFE0F]/g,'');
  check(new RegExp(lead[id]+'(?![0-9ARDV])').test(answer),id+' solution revealed');
  if(id==='JC-BH-091-03')check(answer.includes('♣D'),id+' alternative acceptable');
  if(id==='JC-BH-091-04')check(answer.includes('1SA'),id+' atout versus SA');
  check(await frame.locator('.play-free-panel .gamecheck').count()===1,id+' remains free self-assessment');
  const out=path.join(root,'artifacts','lot07-publication',browserName);fs.mkdirSync(out,{recursive:true});
  await page.screenshot({path:path.join(out,spec.name+'-'+id+'.png'),fullPage:true,animations:'disabled'});
 }
 check(errors.length===0,'No JavaScript errors: '+errors.join('; '));
 }finally{await context.close()}
}
(async()=>{
 check(['chromium','webkit'].includes(browserName),'Supported browser');
 await new Promise(resolve=>server.listen(8799,'127.0.0.1',resolve));
 const browser=await ({chromium,webkit})[browserName].launch({headless:true,args:browserName==='chromium'?['--no-sandbox']:[]});
 try{for(const spec of specs)await run(browser,spec);console.log('LOT07 SELECTIVE '+browserName+' PASS '+checks+' checks');}
 finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;server.close()});
