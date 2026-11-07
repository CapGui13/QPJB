'use strict';
/* Experimental LOT 07 V3 test-only injection into the REAL QPJB training app.
 * Dataset files stay untouched: 812 public exercises remain unchanged.
 * No candidate is published or activated by this test.
 */
const {chromium,webkit,devices}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/lot07-v3-staged.json'),'utf8'));
const browserName=process.env.PW_BROWSER||'chromium';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
 '.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(!url.pathname.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
 let file=path.resolve(root,decodeURIComponent(url.pathname.slice('/QPJB/'.length)));
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return}
 try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});
 fs.createReadStream(file).pipe(res)}catch{res.writeHead(404);res.end()}
});
const specs=[
 {name:'phone',config:{...devices['iPhone 12'],locale:'fr-FR'}},
 {name:'desktop',config:{viewport:{width:1365,height:768},locale:'fr-FR'}}
];
const out=path.join(root,'artifacts','lot07-v3',browserName);
const leadById={'JC-BH-079-03':'♥7','JC-BH-091-03':'♦R','JC-BH-091-04':'♦8'};
const seatById={'JC-BH-079-03':'south','JC-BH-091-03':'west','JC-BH-091-04':'west'};
let checks=0;
function check(condition,message){assert.ok(condition,message);checks++}
async function run(browser,spec){
 const context=await browser.newContext(spec.config);
 try{
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8799/QPJB/',{waitUntil:'domcontentloaded'});
 await page.locator('.training-button[data-training-mode="bidding"]').click({timeout:30000});
 const frame=page.frameLocator('#training-frame');
 await frame.locator('.topic-group .tile').first().waitFor({state:'visible',timeout:30000});
 const child=page.frames().find(f=>f.url().includes('/entrainement/'));
 check(!!child,'Real embedded training iframe exists');
 const counts=await child.evaluate(()=>({b:D.bidding.length,p:D.play.length}));
 check(counts.b===627&&counts.p===0,'Public dataset unchanged and lazy-loaded');
 await child.evaluate(rec=>{
   if(D.bidding.some(x=>x.id===rec.id))throw new Error('Unexpected published Lot07 exercise');
   D.bidding.push(rec);
   cat='reponse-contre';id=rec.id;randomMode=false;sessionIds=[id];
   trainingApplyPage('quiz',false,false);
 },fixture.bidding[0]);
 await frame.locator('.qpjb-bid-quiz .choice').first().waitFor({state:'visible'});
 check(await frame.locator('.qpjb-bid-quiz .choice').count()===4,'Four QCM choices rendered');
 const bid=await frame.locator('.qpjb-bid-quiz').evaluate(el=>{
   const ctx=el.querySelector('[data-prequestion-context="true"]'),choice=el.querySelector('.choices .choice');
   return {visible:!!ctx&&ctx.getClientRects().length>0,
    before:!!ctx&&!!choice&&!!(ctx.compareDocumentPosition(choice)&Node.DOCUMENT_POSITION_FOLLOWING),
    text:ctx?.textContent||'',heading:el.querySelector('h2')?.textContent||''};
 });
 check(bid.visible&&bid.before,'Convention is visibly before QCM choices');
 check(bid.text.includes('0 à 7 H')&&bid.text.includes('8 à 10 H')&&bid.text.includes('six')===false,
  'Convention gives 0-7 H and 8-10 H without preselecting a specific option');
 check(await frame.locator('.qpjb-bid-quiz .feedback').count()===0,'No bidding feedback before choice');
 check((await frame.locator('.qpjb-bid-quiz').textContent()).includes('Vous êtes en Est'),'Correct seat displayed');
 await frame.locator('.qpjb-bid-quiz .choice[data-answer-index="2"]').click();
 await frame.locator('.qpjb-bid-quiz .feedback').waitFor({state:'visible'});
 check((await frame.locator('.qpjb-bid-quiz .feedback').textContent()).includes('Mauvaise réponse'),'Wrong bid rejected under stated agreement');
 await frame.locator('.qpjb-bid-quiz .choice[data-answer-index="3"]').click();
 await frame.locator('.qpjb-bid-quiz .feedback').waitFor({state:'visible'});
 check((await frame.locator('.qpjb-bid-quiz .feedback').textContent()).includes('Bonne réponse'),'Correct bid accepted under stated agreement');
 check((await frame.locator('.qpjb-bid-quiz .feedback').textContent()).includes('11 HL'),'H versus HL explained after answer');
 await page.screenshot({path:path.join(out,spec.name+'-bidding.png'),fullPage:true,animations:'disabled'});
 await child.evaluate(async()=>{
   await ensureTrainingData('play');
 });
 const before=await child.evaluate(()=>D.play.length);
 check(before===185,'Play catalogue remains at 185 before test injection');
 for(const rec of fixture.play){
  await child.evaluate(item=>{
    if(!D.play.some(x=>x.id===item.id))D.play.push(item);
    cat='play';ptopic='defense';id=item.id;randomMode=false;sessionIds=[id];
    trainingApplyPage('quiz',false,false);
  },rec);
  await frame.locator('.play-free-panel .deal-seat').first().waitFor({state:'visible',timeout:10000});
  const seen=await frame.locator('.play-free-panel .deal-seat').evaluateAll(nodes=>nodes.map(el=>el.getAttribute('data-seat')));
  check(seen.length===1&&seen[0]===seatById[rec.id],rec.id+' displays only the actual known defender at the right seat');
  check(await frame.locator('.play-free-panel .analysis-body').count()===0,rec.id+' solution remains hidden before reveal');
  check(await frame.locator('.play-free-panel .deal-played').count()===0,rec.id+' does not draw an answer card in advance');
  const prompt=(await frame.locator('.play-free-panel p').first().textContent()).replace(/[\uFE0E\uFE0F]/g,'');
  check(prompt.includes('Accord de la paire'),rec.id+' convention is visible before reveal');
  if(rec.id!=='JC-BH-091-03')check(!new RegExp(leadById[rec.id]+'(?![0-9ARDV])').test(prompt),rec.id+' prompt does not leak standalone answer card');
  await frame.locator('.play-free-panel button').filter({hasText:/Découvrir l’analyse/}).click();
  await frame.locator('.play-free-panel .analysis-body').waitFor({state:'visible',timeout:10000});
  const answer=(await frame.locator('.play-free-panel .analysis-body').textContent()).replace(/[\uFE0E\uFE0F]/g,'');
  check(new RegExp(leadById[rec.id]+'(?![0-9ARDV])').test(answer),rec.id+' correct standalone answer card revealed only after click');
  if(rec.id==='JC-BH-091-03')check(answer.includes('♣D'),rec.id+' alternative club lead explicitly accepted');
  if(rec.id==='JC-BH-091-04')check(answer.includes('1SA'),rec.id+' trump versus NT contrast discussed');
  await page.screenshot({path:path.join(out,spec.name+'-'+rec.id+'.png'),fullPage:true,animations:'disabled'});
 }
 const total=await child.evaluate(()=>({b:D.bidding.length,p:D.play.length}));
 check(total.b===628&&total.p===188,'Exactly four TEST fixtures in memory, not in public source');
 check(errors.length===0,'No JavaScript page errors: '+errors.join('; '));
 }finally{await context.close()}
}
(async()=>{
 check(['chromium','webkit'].includes(browserName),'Supported Playwright browser');
 check(fixture.bidding.length===1&&fixture.play.length===3,'Exactly 4 test-only fixtures');
 fs.mkdirSync(out,{recursive:true});
 await new Promise(resolve=>server.listen(8799,'127.0.0.1',resolve));
 const browser=await ({chromium,webkit})[browserName].launch({
  headless:true,args:browserName==='chromium'?['--no-sandbox']:[]});
 try{for(const spec of specs)await run(browser,spec);
  console.log('LOT07 V3 REAL TRAINING APP '+browserName.toUpperCase()+' PASS: '+checks+' checks, 4 isolated fixtures, phone and desktop');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;server.close()});
