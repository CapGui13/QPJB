'use strict';
// Capture the actual production UI's selection, not a reconstructed selection policy.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(process.argv[2]||'_public_site'), dest=process.argv[3]||'pilot-output';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer((req,res)=>{try{let u=new URL(req.url,'http://localhost');let file=path.resolve(root,decodeURIComponent(u.pathname.replace(/^\/QPJB\//,'')));if(!file.startsWith(root+path.sep)&&file!==root)throw Error('path');if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res)}catch{res.writeHead(404);res.end()}});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/QPJB/quizz.html';
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const rows=[];
 try{
 for(const profile of ['autonome','intermediaire','faible']){
  const ctx=await browser.newContext({serviceWorkers:'block'});const page=await ctx.newPage();
  try{
   for(let s=1;s<=5;s++){
    await page.goto(url,{waitUntil:'domcontentloaded'});await page.locator('#parcours-start').waitFor({state:'visible'});
    await page.locator('#parcours-start').click();await page.locator('#question-heading').waitFor({state:'visible'});
    const result=await page.evaluate(({profile,s})=>{
     const key='qpjb-sef-parcours-01',api=window.QPJBParcours,all=JSON.parse(document.querySelector('#training-data').textContent).exercises,meta=window.QPJBPrerequis.byId;
     const state=api.load(localStorage.getItem(key));if(state.completed!==s-1||state.active.ids.length!==10||all.length!==1915)throw Error('Unexpected actual UI state');
     const byId=new Map(all.map(q=>[q.id,q]));const selection=state.active.selection;
     const hash=str=>{let h=2166136261;for(const c of str)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;return h/4294967296};
     const threshold={autonome:0,intermediaire:.33,faible:.75}[profile];
     const items=state.active.ids.map((id,i)=>{const q=byId.get(id),m=meta[id],result=hash(id+'|'+(s-1)+'|11')<threshold?'wrong':'correct';const choice=result==='correct'?q.answer:q.choices.find(x=>x!==q.answer);
      const item={position:i+1,id,theme:q.theme,concept:m.concept,requires:m.requires,minSession:m.minSession,difficulty:q.difficulty,hand:q.hand,h:q.h,shape:q.shape,auction:q.auction,context:q.context,question:q.question||q.prompt,choices:q.choices,answer:q.answer,explain:q.explain,selection:Array.isArray(selection)?selection.find(x=>x.id===id)||selection[i]:selection?.[id],result,choice};
      if(!api.record(state,q,result,i,choice,false,false))throw Error('record '+id);return item});
     if(!api.finish(state,all)||state.completed!==s)throw Error('finish '+s);
     localStorage.setItem(key,JSON.stringify(state));return items;
    },{profile,s});
    assert.equal(result.length,10);assert.equal(new Set(result.map(x=>x.id)).size,10);rows.push({profile,seed:11,session:s,items:result});
    console.log('PILOT '+JSON.stringify({profile,s,items:result.map(x=>({id:x.id,concept:x.concept,answer:x.answer,result:x.result}))}));
   }
  }finally{await ctx.close()}
 }
 assert.equal(rows.length,15);fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(path.join(dest,'baseline.json'),JSON.stringify(rows,null,2));
 const clean=x=>String(x??'').replace(/\|/g,'\\|').replace(/\r?\n/g,' ');
 const md=['# Référence S1–S5 — moteur UI réel','Réponses simulées M6, graine 11. Les questions sont sélectionnées par le bouton réel. Les réponses et fins de séance sont enregistrées par le moteur, sans simuler les clics de réponse.'];
 for(const r of rows){md.push('','## '+r.profile+' — S'+r.session,'| # | ID | Concept | Main (♠ ♥ ♦ ♣) / H | Enchères | Réponse | Corrigé | Résultat simulé |','|---|---|---|---|---|---|---|---|');for(const q of r.items)md.push('| '+[q.position,q.id,q.concept,(q.hand||[]).map(x=>x.join(' ')).join(' / ')+' — '+q.h+' H',(q.auction||[]).join(' — '),q.answer,q.explain,q.result].map(clean).join(' | ')+' |')}
 fs.writeFileSync(path.join(dest,'baseline.md'),md.join('\n')+'\n');console.log('PILOT_PASS 15 sessions, 150 actual UI selections');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1;server.close()});
