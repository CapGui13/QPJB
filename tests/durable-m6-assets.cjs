'use strict';
// Exact versioned local script references, offline warming and public build allowlist.
// The test is intentionally independent of historical fixed resource counts.
function validate({html,worker,build,files}){
 const scripts=[...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(m=>m[1]);
 const local=scripts.filter(s=>/^\.\/(?:quizz-[\w-]+|parcours-recommandations)\.js(?:\?[^"']+)?$/.test(s)).map(s=>s.slice(2));
 if(!local.length)throw Error('Missing local quiz scripts');
 const css=[...html.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["']/gi)].map(m=>m[1]).filter(x=>/^\.\/qpjb-bridge-ui\.css(?:\?|$)/.test(x)).map(x=>x.slice(2));
 const resources=[...new Set(['quizz.html',...local,...css])];
 const failures=[];
 for(const url of resources){
  const filename=url.split('?')[0];
  if(!worker.includes("BASE + '"+url+"'")&&!worker.includes('BASE + "'+url+'"'))failures.push({url,kind:'offline-cache'});
  if(!build.includes('"'+filename+'"')&&!build.includes("'"+filename+"'"))failures.push({url,kind:'public-build'});
  if(files&&!files.includes(filename))failures.push({url,kind:'missing-source'});
 }
 if(/quizz-durable-m6-/.test(html)||/quizz-durable-m6-/.test(worker)||/quizz-durable-m6-/.test(build))failures.push({kind:'lab-publication'});
 return {resources,failures};
}
module.exports={validate};
if(require.main===module){
 const fs=require('node:fs'),path=require('node:path');
 const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
 const result=validate({html:read('quizz.html'),worker:read('service-worker.js'),build:read('scripts/build_public_site.py'),files:fs.readdirSync(root)});
 console.log(JSON.stringify(result,null,2));if(result.failures.length)process.exitCode=1;
}
