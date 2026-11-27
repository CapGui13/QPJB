'use strict';
// Capture the actual production UI's selection, not a reconstructed selection policy.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium,webkit}=require('playwright');
const plan=JSON.parse(fs.readFileSync('audits/programme-65-20261127/programme-normalise.json','utf8')).sessions;
const engine=process.env.PROGRAMME_BROWSER==='webkit'?webkit:chromium;
const root=path.resolve(process.argv[2]||'_public_site'), dest=process.argv[3]||'pilot-output';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer((req,res)=>{try{let u=new URL(req.url,'http://localhost');let file=path.resolve(root,decodeURIComponent(u.pathname.replace(/^\/QPJB\//,'')));if(!file.startsWith(root+path.sep)&&file!==root)throw Error('path');if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res)}catch{res.writeHead(404);res.end()}});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/QPJB/quizz.html';
 const browser=await engine.launch({headless:true,...(engine===chromium?{args:['--no-sandbox']}:{})});
 const rows=[];
 try{
 for(const profile of ['autonome','intermediaire','faible']){
  const ctx=await browser.newContext({serviceWorkers:'block'});const page=await ctx.newPage();
  try{
   for(let s=1;s<=65;s++){
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
    assert.equal(result.length,10);assert.equal(new Set(result.map(x=>x.id)).size,10);const ids=new Set(plan[s-1].groups.filter(g=>['objectif','transition','réinvestissement','transfert'].includes(g.role)).flatMap(g=>g.ids));
    rows.push({profile,session:s,objective:plan[s-1].objective,objectiveItems:result.filter(q=>ids.has(q.id)).length,items:result});
    if([1,5,12,21,30,32,41,51,65].includes(s))console.log('PROGRAMME_UI '+JSON.stringify({profile,s,objectiveItems:rows.at(-1).objectiveItems,ids:result.map(x=>x.id)}));
   }
  }finally{await ctx.close()}
 }
 assert.equal(rows.length,195);fs.mkdirSync(dest,{recursive:true});fs.writeFileSync(path.join(dest,'ui-selections.json'),JSON.stringify(rows,null,2));
 const empty=rows.filter(x=>!x.objectiveItems).map(x=>({profile:x.profile,session:x.session}));
 console.log('PROGRAMME_UI_RESULT '+JSON.stringify({browser:process.env.PROGRAMME_BROWSER||'chromium',sessions:rows.length,questions:rows.length*10,empty,profiles:['autonome','intermediaire','faible'].map(p=>({p,objectiveItems:rows.filter(r=>r.profile===p).reduce((n,r)=>n+r.objectiveItems,0)}))}));
 assert.equal(empty.length,0,'Each actual UI lesson has a scheduled objective');
 }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1;server.close()});
