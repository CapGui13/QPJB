'use strict';
// Vérification réelle des styles dans Chromium et WebKit, en largeur iPhone.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium,webkit,devices}=require('playwright');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html;charset=utf-8','.css':'text/css;charset=utf-8','.js':'text/javascript;charset=utf-8','.json':'application/json'};
const port=8776;
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  const route=decodeURIComponent(url.pathname);
  if(!route.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
  let f=path.resolve(root,route.slice('/QPJB/'.length));
  if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  try{if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');
    res.writeHead(200,{'content-type':mime[path.extname(f)]||'application/octet-stream'});
    fs.createReadStream(f).pipe(res);
  }catch(_){res.writeHead(404);res.end()}
});
(async()=>{
  await new Promise(ok=>server.listen(port,'127.0.0.1',ok));
  const type=process.env.PW_BROWSER||'chromium';
  assert(['chromium','webkit'].includes(type));
  const browser=await ({chromium,webkit})[type].launch({headless:true,args:type==='chromium'?['--no-sandbox']:[]});
  try{
    const context=await browser.newContext({...devices['iPhone 12'],locale:'fr-FR'});
    const page=await context.newPage();
    const errs=[];page.on('pageerror',e=>errs.push(e.message));
    await page.goto('http://127.0.0.1:'+port+'/QPJB/quizz.html',{waitUntil:'load'});
    const q=await page.evaluate(()=>{
      const host=document.getElementById('body');
      if(!host)throw Error('Quiz : conteneur #body introuvable');
      const probe=document.createElement('div');probe.id='axis-probe';
      probe.innerHTML='<table class="auc"><thead><tr><th>Sud</th><th>Ouest</th><th>Nord</th><th>Est</th></tr></thead><tbody><tr><td>1♥</td><td>Passe</td><td>2♥</td><td>Passe</td></tr><tr><td class="ask">?</td><td>Passe</td><td>—</td><td>—</td></tr></tbody></table>';
      host.append(probe);
      const bg=s=>getComputedStyle(probe.querySelector(s)).backgroundColor;
      return {s:bg('tbody tr:first-child td:nth-child(1)'),o:bg('tbody tr:first-child td:nth-child(2)'),n:bg('tbody tr:first-child td:nth-child(3)'),e:bg('tbody tr:first-child td:nth-child(4)'),ask:bg('tbody tr:nth-child(2) td:first-child')};
    });
    assert.equal(q.s,q.n,'Quiz : NS ont même fond');
    assert.equal(q.o,q.e,'Quiz : EO ont même fond');
    assert.notEqual(q.s,q.o,'Quiz : axes distincts');
    assert.notEqual(q.s,q.ask,'Quiz : case demandée reste violette');
    assert.equal(q.s,'rgb(38, 63, 88)','Quiz : bleu sombre exact');
    assert.equal(q.o,'rgb(81, 60, 48)','Quiz : abricot sombre exact');

    await page.goto('http://127.0.0.1:'+port+'/QPJB/entrainement/originaux.html',{waitUntil:'load'});
    await page.waitForFunction(() => [...document.styleSheets].some(x => x.href?.includes('qpjb-bridge-ui.css')), null, {timeout:15000});
    const t=await page.evaluate(()=>{
      const probe=document.createElement('div');probe.id='axis-probe';
      probe.innerHTML='<table class="auc"><thead><tr><th>S</th><th>O</th><th>N</th><th>E</th></tr></thead><tbody><tr><td>1♥</td><td>Passe</td><td>2♥</td><td>Passe</td></tr></tbody></table><div class="deal-seat north" data-seat="east"><span class="deal-seat-name">Est</span></div><div class="deal-seat east" data-seat="south"><span class="deal-seat-name">Sud</span></div><div class="deal-marker south" data-seat="west"><span>O</span></div>';
      document.body.append(probe);
      const bg=s=>getComputedStyle(probe.querySelector(s)).backgroundColor;
      return {ns:bg('tbody td:first-child'),ew:bg('tbody td:nth-child(2)'),visualNorthButPhysicalEast:bg('.deal-seat.north'),visualEastButPhysicalSouth:bg('.deal-seat.east'),physicalWestMarker:bg('.deal-marker span')};
    });
    assert.equal(t.ns,'rgb(231, 242, 255)','Entraînement : fond bleu pâle');
    assert.equal(t.ew,'rgb(255, 240, 227)','Entraînement : fond abricot pâle');
    assert.equal(t.visualNorthButPhysicalEast,t.ew,'Siège réel Est prioritaire sur sa position visuelle Nord');
    assert.equal(t.visualEastButPhysicalSouth,t.ns,'Siège réel Sud prioritaire sur sa position visuelle Est');
    assert.equal(t.physicalWestMarker,'rgb(248, 223, 201)','Repère Ouest abricot');
    assert.deepEqual(errs,[],'Aucune erreur JavaScript');
    console.log('QPJB BRIDGE UI BROWSER OK — '+type+' · camp réel, Quiz + originaux, mobile');
  }finally{await browser.close();await new Promise(ok=>server.close(ok))}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;server.close()});
