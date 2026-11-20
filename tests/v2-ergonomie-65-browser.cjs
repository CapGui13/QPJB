'use strict';
// Recette de la page élève V2 publiée : progression, sauvegarde héritée,
// journal sans historique inventé et difficulté bornée. Données de test fictives.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const http=require('node:http'),{chromium,webkit,devices}=require('playwright');
const root=path.resolve(__dirname,'..');
const KEY='qpjb-v2-eleve-65-pedago-r1',VER='QPJB-V2-65-19A-20261120-R1';
function server(){
 return http.createServer((req,res)=>{
  const route=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  let file=path.resolve(root,'.'+route);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
 });
}
async function downloadJSON(page,button){
 const event=page.waitForEvent('download');
 await page.locator(button).click();
 const download=await event;
 return JSON.parse(fs.readFileSync(await download.path(),'utf8'));
}
async function save(page){
 return page.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
}
async function check(which,mobile,url){
 const browser=await ({chromium,webkit})[which].launch({headless:true,
  args:which==='chromium'?['--no-sandbox']:[]});
 try{
  const ctx=await browser.newContext({...(mobile?devices['iPhone 12']:
   {viewport:{width:1370,height:850}}),locale:'fr-FR',
   acceptDownloads:true,serviceWorkers:'block'});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.getByRole('heading',{name:'Parcours guidé SEF'}).waitFor();
  const publicText=await page.locator('body').innerText();
  assert.doesNotMatch(publicText,/Aperçu privé|HORS PRODUCTION|19 DÉCISIONS PÉDAGOGIQUES|V1\/V2-F/);
  assert.match(publicText,/Ta progression est enregistrée/);
  assert.equal(await page.locator('#ux-progress-export').count(),1);
  assert.equal(await page.locator('#backup-export').count(),1);
  assert.equal(await page.locator('#backup-import').count(),1);
  assert.equal(await page.locator('#start').count(),1);
  const payload=await page.evaluate(()=>{
    const d=JSON.parse(document.getElementById('ay-payload').textContent);
    return {count:d.catalog.length,version:d.candidateVersion,
      answer:d.catalog.find(q=>q.id==='SEF-L06-029')?.answer};
  });
  assert.deepEqual(payload,{count:1523,version:VER,answer:'4♦'});
  await page.evaluate(k=>{
    const F=window.AYEngine,completed=Array.from({length:13},(_,i)=>({
      number:i+1,correct:7,questions:10,coreCorrect:7,coreQuestions:10,
      supplement:null,supplementMatched:null
    }));
    const engineState=F.newState(13);engineState.session=13;
    // Ces 13 séances sont une FICTION de test, aucune réponse individuelle
    // antérieure n'est produite ni inférée.
    localStorage.setItem(k,JSON.stringify({
      schema:2,contentVersion:'QPJB-V2-65-19A-20261120-R1',model:'core',
      engineState,current:null,completed,addonAnswers:[],
      nextSession:14,finished:false
    }));
  },KEY);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.getByText('Bilan de la séance 13').waitFor();
  let record=await save(page);
  assert.equal(record.completed.length,13);
  assert.equal(record.uxJournal,undefined);
  let progress=await downloadJSON(page,'#ux-progress-export');
  assert.equal(progress.format,'QPJB_V2_STUDENT_PROGRESSION_ANALYSE_1');
  assert.equal(progress.sessions.length,13);
  assert.deepEqual(progress.questionJournal,[]);
  assert.deepEqual(progress.limitations.completedSessionsWithoutAnswerJournal,
    Array.from({length:13},(_,i)=>i+1));
  await page.getByRole('button',{name:'Trop difficile'}).click();
  record=await save(page);
  assert.equal(record.uxDifficultyAdjustment,-1);
  assert.equal(record.engineState.uxDifficultyAdjustment,-1);
  assert.equal(record.uxFeedback.length,1);
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.getByRole('button',{name:'Trop difficile'}).getAttribute('aria-pressed'),'true');
  await page.getByRole('button',{name:'Niveau adapté'}).click();
  assert.equal((await save(page)).uxDifficultyAdjustment,0);
  await page.getByRole('button',{name:'Trop facile'}).click();
  record=await save(page);
  assert.equal(record.uxDifficultyAdjustment,1);
  assert.equal(record.uxFeedback.length,1);
  assert.equal(record.uxFeedback[0].session,13);
  const backup=await downloadJSON(page,'#backup-export');
  assert.equal(backup.format,'QPJB_V2_STUDENT_BACKUP_1');
  assert.equal(backup.record.completed.length,13);
  assert.equal(backup.record.uxFeedback.length,1);
  // Une restauration invalide ne doit jamais remplacer le contenu stocké.
  const corrupt={...backup,record:{...backup.record,uxJournal:[{session:13,answers:[]}]}};
  await page.locator('#backup-import').setInputFiles({name:'corrupt.json',
    mimeType:'application/json',buffer:Buffer.from(JSON.stringify(corrupt))});
  await page.waitForFunction(()=>document.querySelector('#backup-result').textContent.includes('Import refusé'));
  assert.equal((await save(page)).completed.length,13);
  await page.locator('#nextSession').click();
  await page.getByText('Séance 14/65').waitFor();
  for(let i=0;i<10;i++){
    if(await page.locator('#free').count()){
      await page.locator('#free').fill('Passe');
    }else{
      await page.locator('.choice').first().click();
    }
    await page.locator('#answer').click();
    await page.locator('.feedback').waitFor();
    if(i===0){
      await page.reload({waitUntil:'domcontentloaded'});
      await page.locator('.feedback').waitFor();
    }
    await page.locator('#next').click();
  }
  await page.getByText('Bilan de la séance 14').waitFor();
  record=await save(page);
  assert.equal(record.completed.length,14);
  assert.equal(record.nextSession,15);
  assert.equal(record.uxJournal.length,1);
  assert.equal(record.uxJournal[0].session,14);
  assert.equal(record.uxJournal[0].answers.length,10);
  assert.ok(record.uxJournal[0].answers.every(a=>
    typeof a.id==='string'&&typeof a.choice==='string'&&
    typeof a.correct==='boolean'&&typeof a.family==='string'));
  progress=await downloadJSON(page,'#ux-progress-export');
  assert.equal(progress.questionJournal.length,1);
  assert.equal(progress.questionJournal[0].session,14);
  assert.equal(progress.sessions.length,14);
  assert.deepEqual(progress.limitations.completedSessionsWithoutAnswerJournal,
    Array.from({length:13},(_,i)=>i+1));
  await page.locator('#home').click();
  page.once('dialog',d=>d.dismiss());
  await page.locator('#erase').click();
  assert.equal((await save(page)).nextSession,15,'Annuler la réinitialisation préserve la progression');
  assert.deepEqual(errors,[],'Aucune erreur de script');
  const bounds=await page.evaluate(()=>({
    width:document.documentElement.scrollWidth,
    viewport:document.documentElement.clientWidth}));
  assert.ok(bounds.width<=bounds.viewport+2,'Débordement horizontal '+JSON.stringify(bounds));
  console.log('V2 ERGONOMIE 65 PASS '+which+'/'+(mobile?'mobile':'desktop'));
  await ctx.close();
 }finally{await browser.close()}
}
(async()=>{
 const srv=server();await new Promise((ok,bad)=>{srv.once('error',bad);srv.listen(0,'127.0.0.1',ok)});
 try{
  const base='http://127.0.0.1:'+srv.address().port+'/preview/v2-eleve/parcours-sef-65-r1.html';
  await check('chromium',false,base);
  await check('webkit',true,base);
 }finally{await new Promise(ok=>srv.close(ok))}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
