'use strict';
// BA: chemin complet sur l'interface QPJB, contrôle de cohabitation V1/V2-F/AZ.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium,webkit,devices}=require('playwright');
const P=require('../quizz-parcours.js');
const root=path.resolve(__dirname,'..');
const engine=process.env.PW_BROWSER||'chromium';
const base='http://127.0.0.1:8854/QPJB/';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json; charset=utf-8'};
const server=http.createServer((req,res)=>{
 let url;
 try{url=new URL(req.url,'http://127.0.0.1')}catch(_){res.writeHead(400).end();return}
 if(!url.pathname.startsWith('/QPJB/')){res.writeHead(404).end();return}
 let filename;
 try{filename=path.resolve(root,decodeURIComponent(url.pathname.slice('/QPJB/'.length)))}
 catch(_){res.writeHead(400).end();return}
 if(filename!==root&&!filename.startsWith(root+path.sep)){res.writeHead(403).end();return}
 try{
  if(fs.statSync(filename).isDirectory())filename=path.join(filename,'index.html');
  res.writeHead(200,{'content-type':mime[path.extname(filename)]||'application/octet-stream'});
  fs.createReadStream(filename).pipe(res);
 }catch(_){res.writeHead(404).end()}
});
async function main(){
 assert.ok(['chromium','webkit'].includes(engine));
 await new Promise(r=>server.listen(8854,'127.0.0.1',r));
 const browser=await ({chromium,webkit})[engine].launch({
  headless:true,args:engine==='chromium'?['--no-sandbox']:[]
 });
 try{
  for(const device of ['desktop','mobile']){
   const context=await browser.newContext(device==='mobile'?
    {...devices['iPhone 12'],locale:'fr-FR',reducedMotion:'reduce'}:
    {viewport:{width:1365,height:800},locale:'fr-FR',reducedMotion:'reduce'});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push('origin: '+e.message));
   await page.goto(base+'quizz.html',{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('#parcours-v2-preview-wrap').isVisible(),false);
   assert.equal(await page.locator('#parcours-v2-az-preview-link').isVisible(),false);
   const legacy=P.empty();legacy.completed=7;
   const saved={old:JSON.stringify(legacy),v2:JSON.stringify({sentinel:'V2-F-stays'}),
     training:JSON.stringify({sentinel:'Training-stays'}),
     azTeacher:JSON.stringify({sentinel:'AZ-teacher-stays'})};
   await page.evaluate(a=>{
    localStorage.setItem('qpjb-sef-parcours-01',a.old);
    localStorage.setItem('qpjb-sef-parcours-v2-01',a.v2);
    localStorage.setItem('qpjb-sef-entrainement-01',a.training);
    localStorage.setItem('qpjb-preview-v2-az-01',a.azTeacher);
   },saved);
   await page.goto(base+'index.html?v2preview=1',{waitUntil:'domcontentloaded'});
   await page.locator('.training-button-quizz').click();
   const frame=page.frameLocator('#quizz-frame');
   await frame.locator('#parcours-v2-preview-link').waitFor({state:'visible'});
   await frame.locator('#parcours-v2-az-preview-link').waitFor({state:'visible'});
   const frameSrc=await page.locator('#quizz-frame').getAttribute('src');
   assert.ok(frameSrc.includes('&v2preview=1'));
   const promise=page.waitForEvent('popup');
   await frame.locator('#parcours-v2-az-preview-link').click();
   const popup=await promise;
   popup.on('pageerror',e=>errors.push('AZ: '+e.message));
   await popup.getByRole('heading',{name:'Parcours guidé SEF — 65 séances',level:2}).waitFor();
   assert.ok(popup.url().startsWith(base+'preview/v2-eleve/parcours-sef-65.html'));
   assert.ok(await popup.locator('#az-return-v1').isVisible());
   assert.equal(await popup.locator('#model').count(),0,'Pas de modes complémentaires dans l’essai élève');
   await popup.locator('#start').click();
   await popup.getByText('Séance 1/65').waitFor();
   await popup.locator('.choice').first().click();
   await popup.locator('#answer').click();
   await popup.locator('.feedback').waitFor();
   const first=await popup.evaluate(()=>JSON.parse(localStorage.getItem('qpjb-preview-v2-eleve-01')));
   assert.equal(first.model,'core');
   assert.equal(first.current.number,1);
   assert.equal(first.current.position,0);
   assert.equal(first.current.revealed,true);
   await popup.reload({waitUntil:'domcontentloaded'});
   await popup.locator('.feedback').waitFor();
   await popup.locator('#next').click();
   await popup.getByText('Question 2/10').waitFor();
   const beforeReturn=await popup.evaluate(()=>({
    old:localStorage.getItem('qpjb-sef-parcours-01'),
    v2:localStorage.getItem('qpjb-sef-parcours-v2-01'),
    training:localStorage.getItem('qpjb-sef-entrainement-01'),
    azTeacher:localStorage.getItem('qpjb-preview-v2-az-01')
   }));
   assert.deepEqual(beforeReturn,saved,'AZ must not change classic or V2-F keys');
   await popup.locator('#az-return-v1').click();
   await popup.locator('#parcours-status').waitFor({state:'visible'});
   assert.ok(popup.url().includes('quizz.html?v2preview=1'));
   // Le Quiz initialise ses panneaux après DOMContentLoaded. Sur Chromium,
   // attendre la visibilité des liens, pas seulement celle du statut V1.
   await popup.locator('#parcours-v2-preview-link')
     .waitFor({state:'visible',timeout:30000});
   await popup.locator('#parcours-v2-az-preview-link')
     .waitFor({state:'visible',timeout:30000});
   assert.match(await popup.locator('#parcours-status').textContent(),/Séances terminées : 7/);
   await popup.goto(base+'preview/v2-eleve/parcours-sef-65.html');
   await popup.getByText('Question 2/10').waitFor();
   await popup.locator('#home').click();
   await popup.getByRole('heading',{name:'Parcours guidé SEF — 65 séances',level:2}).waitFor();
   assert.equal(await popup.locator('#sef-session-grid .sef-step').count(),65,
     'Le tableau affiche les 65 séances');
   assert.equal(await popup.locator('#sef-session-grid .sef-step.current').count(),1);
   assert.ok((await popup.locator('.sef-progress').textContent()).includes('0 / 0'),
     'Aucun résultat ne doit être inventé avant la fin de la première séance');
   popup.once('dialog',d=>d.accept());
   await popup.locator('#erase').click();
   assert.equal(await popup.evaluate(()=>localStorage.getItem('qpjb-preview-v2-eleve-01')),null);
   assert.deepEqual(await popup.evaluate(()=>({
    old:localStorage.getItem('qpjb-sef-parcours-01'),
    v2:localStorage.getItem('qpjb-sef-parcours-v2-01'),
    training:localStorage.getItem('qpjb-sef-entrainement-01'),
    azTeacher:localStorage.getItem('qpjb-preview-v2-az-01')
   })),saved);
   const width=await popup.evaluate(()=>({
    doc:document.documentElement.scrollWidth,
    viewport:document.documentElement.clientWidth
   }));
   assert.ok(width.doc<=width.viewport+2,'Unexpected horizontal overflow '+JSON.stringify(width));
   assert.deepEqual(errors,[],engine+'/'+device+' JS errors');
   console.log('QPJB BA BROWSER PASS '+engine+' '+device+
      ' defaultHidden=OK studentOnly=OK popup=OK return=OK resume=OK V1/V2/AZ unchanged reset=student-only');
   await context.close();
  }
 }finally{await browser.close()}
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
