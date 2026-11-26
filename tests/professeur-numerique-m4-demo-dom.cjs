'use strict';
const fs=require('node:fs'),path=require('node:path');
const api=require('../quizz-remediation.js');
const html=fs.readFileSync(path.resolve(__dirname,'../audits/professeur-numerique-20261126/m4/demo.html'),'utf8');
function domTest(script,api){
 class E{
  constructor(tag='div',doc){this.tagName=tag;this.doc=doc;this.children=[];this.handlers={};this.hidden=false;this.checked=false;this.disabled=false;this.value='';this._text=''}
  set textContent(v){this._text=String(v);this.children=[]}
  get textContent(){return this._text+this.children.map(x=>x.textContent).join('')}
  append(...x){this.children.push(...x)}
  replaceChildren(...x){this._text='';this.children=x}
  addEventListener(k,f){(this.handlers[k]??=[]).push(f)}
  emit(k,event={}){for(const f of this.handlers[k]||[])f({target:this,preventDefault(){},...event})}
  focus(){this.doc.activeElement=this}
  querySelector(k){return this.children.find(x=>x.tagName===k)||null}
  querySelectorAll(k){return this.children.filter(x=>x.tagName===k)}
 }
 const document={elements:{},activeElement:null,createElement(tag){return new E(tag,this)},getElementById(id){return this.elements[id]??(this.elements[id]=new E('div',this))}};
 const context=new Function("document","QPJBRemediation",script+"\nreturn {cases,pairs};")(document,api);
 const $=id=>document.getElementById(id);const assert=(v,m)=>{if(!v)throw Error(m)};
 const select=i=>{$('case').value=String(i);$('case').emit('change');assert($('feedback').hidden&&$('canonical').textContent===''&&$('extra').textContent==='','reset')};
 const bid=b=>{$('bid').value=b;$('free').emit('submit')};
 const choose=b=>{const el=$('choices').children.find(e=>e.textContent===b);assert(el,'button '+b);el.emit('click')};
 let tested=0,transfers=0;
 for(const [i,c] of context.cases.entries()){
  const q=c.exercise;
  select(i);bid(q.answer.replace('♠','P').replace('♥','C').replace('♦','K').replace('♣','T').toLowerCase());assert($('verdict').textContent==='Bonne réponse sans aide'&&$('canonical').textContent===q.explain&&$('extra').textContent==='','autonomous');
  select(i);$('past').checked=true;$('show').emit('click');choose(c.choice);assert($('canonical').textContent===q.explain&&$('extra').textContent.includes('Rappel')&&document.activeElement===$('feedback'),'targeted');
  const pair=context.pairs[q.id];
  if(pair){$('feedback').emit('keydown',{key:'Enter'});assert($('phase').textContent.startsWith('Réinvestissement')&&$('canonical').textContent===''&&document.activeElement===$('question'),'transfer');bid(pair.exercise.answer);assert($('canonical').textContent===pair.exercise.explain&&$('extra').textContent==='','transfer independent');transfers++}
  select(i);bid('xyz');assert($('feedback').hidden&&$('status').textContent.includes('non reconnue'),'invalid');bid(c.choice);assert($('feedback').hidden&&$('canonical').textContent==='','free error not leaked');choose(q.answer);assert($('verdict').textContent==='Bonne réponse après correction'&&$('extra').textContent!=='','corrected');
  select(i);$('show').emit('click');choose(q.answer);assert($('verdict').textContent==='Bonne réponse avec les propositions','assisted');
  tested++;
 }
 return {tested,transfers};
}
const script=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
console.log('M4_DEMO_DOM_DOUBLE_PASS',domTest(script,api));
