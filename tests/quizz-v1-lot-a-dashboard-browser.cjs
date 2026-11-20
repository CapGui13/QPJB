'use strict';
// LOT A V1 : preuve d'affichage uniquement, aucune modification du moteur ni des sauvegardes.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,webkit,devices}=require('playwright');
const root=path.resolve(__dirname,'..');
const engine=process.env.PW_BROWSER||'chromium';
const KEY='qpjb-sef-parcours-01';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 const p=decodeURIComponent(url.pathname);
 if(!p.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
 let file=path.resolve(root,p.slice('/QPJB/'.length));
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
 try{
  if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
 }catch(_){res.writeHead(404);res.end()}
});
async function openDashboard(page){
 await page.locator('#parcours-start').waitFor({state:'visible'});
 await page.locator('#parcours-dashboard > summary').click();
 await page.locator('#parcours-dashboard-themes > summary').click();
}
async function goWithState(page,build){
 const generated=await page.evaluate(({key,kind})=>{
  const P=window.QPJBParcours;
  const data=JSON.parse(document.querySelector('#training-data').textContent);
  const group=theme=>data.exercises.filter(x=>x.theme===theme);
  const unique=items=>items.filter((x,i,a)=>a.findIndex(y=>
   String(y.caseFamily||y.id)===String(x.caseFamily||x.id))===i);
  const s=P.empty();
  let target;
  if(kind==='three-of-sixty-five'){
   target='chelem';
   const cards=unique(group(target));
   if(group(target).length!==65||cards.length!==65)throw Error('Fixture : 65 QCM / 65 familles attendus');
   s.completed=43;
   cards.slice(0,3).forEach((x,i)=>{
    const at=39+i;
    s.entries[x.id]={result:'correct',assisted:false,lastSession:at,
     assessment:{result:'correct',assisted:false,lastSession:at},
     due:44,seen:1,streak:1,family:String(x.caseFamily||x.id)};
   });
  }else if(kind==='same-family'){
   target='ouv';
   const pool=group(target);
   const byFamily=new Map();
   for(const x of pool){
    const f=String(x.caseFamily||x.id);
    if(!byFamily.has(f))byFamily.set(f,[]);
    byFamily.get(f).push(x);
   }
   const repeated=[...byFamily.values()].find(g=>g.length>=2);
   if(!repeated)throw Error('Fixture : aucune variante de famille disponible');
   const third=pool.find(x=>String(x.caseFamily||x.id)!==String(repeated[0].caseFamily||repeated[0].id));
   s.completed=10;
   [repeated[0],repeated[1],third].forEach((x,i)=>{
    s.entries[x.id]={result:'correct',assisted:false,lastSession:i+1,
     assessment:{result:'correct',assisted:false,lastSession:i+1}};
   });
  }else if(kind==='consolidation-only'||kind==='legacy'||kind==='skipped'){
   target='chelem';
   const x=group(target)[0];
   s.completed=43;
   if(kind==='consolidation-only')
    s.entries[x.id]={result:'correct',assisted:false,lastSession:42,assessment:null};
   if(kind==='legacy')
    s.entries[x.id]={result:'correct',assisted:false,lastSession:41};
   if(kind==='skipped')
    s.entries[x.id]={result:'skipped',assisted:false,lastSession:41,
     assessment:{result:'skipped',assisted:false,lastSession:41}};
  }else throw Error('Scénario inconnu : '+kind);
  const status=P.dashboard(s,data.exercises).themes.find(x=>x.id===target).status;
  localStorage.setItem(key,JSON.stringify(s));
  return {status,target,saved:localStorage.getItem(key)};
 },{key:KEY,kind:build});
 await page.reload({waitUntil:'domcontentloaded'});
 await openDashboard(page);
 const actual=await page.evaluate(key=>localStorage.getItem(key),KEY);
 assert.equal(actual,generated.saved,'L\u2019affichage/rechargement ne doit pas écrire la sauvegarde');
 return generated;
}
(async()=>{
 assert.ok(engine==='chromium'||engine==='webkit','PW_BROWSER doit être chromium ou webkit');
 await new Promise((resolve,reject)=>{
  server.once('error',reject);server.listen(0,'127.0.0.1',resolve);
 });
 const browser=await ({chromium,webkit})[engine].launch({headless:true,
  args:engine==='chromium'?['--no-sandbox']:[]});
 try{
  const context=await browser.newContext(engine==='webkit'?
   {...devices['iPhone 12'],locale:'fr-FR',serviceWorkers:'block',reducedMotion:'reduce'}:
   {viewport:{width:1365,height:860},locale:'fr-FR',serviceWorkers:'block',reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/QPJB/quizz.html',
   {waitUntil:'domcontentloaded'});

  // Trois réussites autonomes sur trois familles, parmi les 65 QCM du thème.
  const sample=await goWithState(page,'three-of-sixty-five');
  assert.equal(sample.status,'confirmed','La classification historique reste inchangée');
  const confirmed=page.locator('#parcours-dashboard-themes [data-item="chelem"]');
  assert.equal(await confirmed.locator('.parcours-dashboard-state').getAttribute('data-status'),'confirmed');
  assert.equal(await confirmed.locator('.parcours-dashboard-state').textContent(),'Réussites confirmées');
  const note=await confirmed.locator('.parcours-dashboard-row-note').textContent();
  assert.match(note,/3 \/ 65 familles évaluées/);
  assert.match(note,/3\/65 QCM vus/);
  assert.match(note,/3 sans aide/);
  assert.match(note,/Confirmation limitée aux situations récemment évaluées, pas à toute la rubrique/);
  assert.doesNotMatch(await confirmed.textContent(),/Acquis confirmés/);
  assert.match(await page.locator('#parcours-dashboard-themes > .parcours-dashboard-note').textContent(),
   /Cela ne valide pas tous les QCM ni toute la rubrique/);
  assert.equal(await page.locator('#parcours-dashboard-content').evaluate(el=>
   el.scrollWidth>el.clientWidth+2),false,'Pas de débordement horizontal du tableau');
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),KEY),sample.saved,
   'Déplier le tableau ne modifie pas la progression');
  const screenshots=path.join(root,'artifacts');fs.mkdirSync(screenshots,{recursive:true});
  await page.screenshot({path:path.join(screenshots,'qpjb-v1-lot-a-'+engine+'.png'),fullPage:true});

  // Trois QCM ne font que deux familles, sans fabriquer un troisième acquis.
  const repeated=await goWithState(page,'same-family');
  assert.notEqual(repeated.status,'confirmed');
  const opening=page.locator('#parcours-dashboard-themes [data-item="ouv"]');
  assert.match(await opening.textContent(),/2 \/ 55 familles évaluées/);
  assert.match(await opening.textContent(),/3\/84 QCM vus/);

  // Une réussite de consolidation sans évaluation ordinaire ne compte pas.
  const targeted=await goWithState(page,'consolidation-only');
  assert.notEqual(targeted.status,'confirmed');
  assert.match(await page.locator('#parcours-dashboard-themes [data-item="chelem"]').textContent(),
   /0 \/ 65 familles évaluées/);

  // Les anciennes sauvegardes sans assessment conservent leur lecture prudente.
  await goWithState(page,'legacy');
  assert.match(await page.locator('#parcours-dashboard-themes [data-item="chelem"]').textContent(),
   /1 \/ 65 familles évaluées/);

  // Une question passée ne constitue pas une évaluation de situation.
  await goWithState(page,'skipped');
  assert.match(await page.locator('#parcours-dashboard-themes [data-item="chelem"]').textContent(),
   /0 \/ 65 familles évaluées/);
  assert.deepEqual(errors,[],'Aucune exception JS dans les navigateurs');
  console.log('LOT A V1 '+engine+' PASS : 3/65, familles uniques, consolidation, legacy, skipped, sauvegarde');
  await context.close();
 }finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
