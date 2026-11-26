'use strict';
// A DOM double verifies the interaction logic, not browser layout or actual keyboard navigation.
function run({demo,data,mod}){
 const scripts=[...demo.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)];
 const fixture=scripts[0][1],cases=JSON.parse(fixture),g={};
 new Function('module','globalThis',data)(undefined,g);new Function('module','globalThis',mod)(undefined,g);
 let checks=0,active;const ok=(x,m)=>{checks++;if(!x)throw Error(m);};
 const el={};const node=()=>({hidden:false,value:'',textContent:'',children:[],focus(){active=this;},replaceChildren(){this.children=[];},append(x){this.children.push(x);},get firstElementChild(){return this.children[0];}});
 for(const id of ['fixtures','title','hand','auction','context','free','status','canonical','feedback','reminder','check','options','result','form','help','next'])el[id]=node();
 el.fixtures.textContent=fixture;
 const doc={getElementById:id=>el[id],createElement:()=>node()};
 new Function('document','QPJBDurableRemediation',scripts.at(-1)[1])(doc,g.QPJBDurableRemediation);
 const submit=c=>{el.free.value=c;el.form.onsubmit({preventDefault(){}});};
 for(const c of cases){
  ok(el.result.hidden&&el.canonical.textContent===''&&el.options.children.length===0,'no leak');
  submit('invalid');ok(el.result.hidden&&el.status.textContent.includes('valide'),'invalid free input');
  el.help.onclick();ok(el.options.children.length===4&&active===el.options.children[0],'help/focus');
  el.options.children.find(x=>x.textContent!==c.first.q.answer).onclick();
  ok(!el.result.hidden&&el.canonical.textContent===c.first.q.explain&&active===el.result,'wrong/canonical/focus');
  el.next.onclick();ok(el.canonical.textContent===''&&el.result.hidden,'next clear');
  submit(c.next.q.answer);ok(el.canonical.textContent===c.next.q.explain&&el.status.textContent.includes('sans aide'),'free correct');el.next.onclick();
 }
 for(const c of cases){
  submit(c.first.q.choices.find(x=>x!==c.first.q.answer));ok(el.result.hidden&&el.options.children.length===4,'first guess no leak');
  el.options.children.find(x=>x.textContent===c.first.q.answer).onclick();
  ok(el.canonical.textContent===c.first.q.explain&&el.status.textContent.includes('après aide'),'corrected assisted');
  el.next.onclick();submit(c.next.q.answer);el.next.onclick();
 }
 return {cases:cases.length,checks};
}
module.exports={run};
if(require.main===module){const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');console.log(JSON.stringify(run({demo:read('audits/apprentissage-durable-20261126/m2/demo.html'),data:read('quizz-durable-m2-data.js'),mod:read('quizz-durable-m2-remediation.js')})));}
