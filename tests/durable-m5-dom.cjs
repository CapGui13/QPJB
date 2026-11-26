'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'quizz-durable-m5-lecons.js'),'utf8');
const demo=fs.readFileSync(path.join(root,'audits/apprentissage-durable-20261126/m5/demo.html'),'utf8');
const {corpus}=JSON.parse(fs.readFileSync(path.join(root,'audits/apprentissage-durable-20261126/m5/corpus-verification.json'),'utf8'));
console.log((function verifyDOM(source,demo,corpus){
 const browser={};new Function('window',source)(browser);const api=browser.QPJBDurableLessons;
 let assertions=0;function ok(x,msg){assertions++;if(!x)throw Error(msg)}
 const elements={};const document={activeElement:null,createElement:tag=>new El(tag),getElementById:id=>elements[id]};
 class El{
 constructor(tag){this.tag=tag;this.children=[];this.handlers={};this.textContent='';this.hidden=false;this.disabled=false;this._value=''}
 get value(){return this.tag==='select'?(this.children.some(c=>c.value===this._value)?this._value:this.children[0]?.value||''):this._value}
 set value(v){this._value=v}
 append(el){this.children.push(el)}
 replaceChildren(){this.children=[];this._value=''}
 addEventListener(event,fn){this.handlers[event]=fn}
 fire(event){this.handlers[event]?.()}
 focus(){document.activeElement=this}
 }
 function option(sel,value){const a=new El('option');a.value=value;sel.append(a)}
 for(const id of ['profile','mode','concept','open','close','status','lesson'])elements[id]=new El(['profile','mode','concept'].includes(id)?'select':'div');
 for(const v of ['start','advanced'])option(elements.profile,v);
 for(const v of ['discovery','reminder','study'])option(elements.mode,v);
 const script=demo.slice(demo.lastIndexOf('<script>')+8,demo.lastIndexOf('</script>'));
 new Function('window','document',script)(browser,document);
 const list=elements.concept,lesson=elements.lesson;
 const flat=el=>[el,...el.children.flatMap(flat)];
 const titles=el=>flat(el).filter(x=>x.tag==='summary').map(x=>x.textContent);
 const choose=(el,val)=>{el.value=val;el.fire('change')};
 const open=(c)=>{choose(list,c);elements.open.fire('click');ok(!lesson.hidden,c+' open');ok(document.activeElement?.id==='heading',c+' focus');return flat(lesson)};
 ok(list.children.length===4,'initial options');ok(lesson.hidden,'initial hidden');
 for(const c of list.children.map(x=>x.value)){open(c);ok(flat(lesson).some(x=>x.textContent==='Objectif : '+corpus[c].objective),c+' discovery objective');ok(!titles(lesson).some(x=>x.startsWith('Approfondir :')),c+' no advanced before exposure');elements.close.fire('click');ok(lesson.hidden&&document.activeElement===elements.open,'close focus')}
 choose(elements.mode,'reminder');ok(elements.open.disabled,'no premature recall');choose(elements.profile,'advanced');ok(list.children.length===99,'all 99 recalls');
 let recalls=0,studies=0,extensions=0,examples=0;
 for(const c of list.children.map(x=>x.value)){const l=corpus[c],nodes=open(c);ok(nodes.some(n=>n.textContent===l.reminder),c+' reminder exact');ok(!nodes.some(x=>x.textContent.startsWith('Objectif : ')),c+' no objective in short reminder');ok(titles(lesson).length===0,c+' short reminder');recalls++;}
 choose(elements.mode,'study');ok(list.children.length===99,'all 99 study');ok(lesson.hidden,'mode change closes');
 for(const c of list.children.map(x=>x.value)){const l=corpus[c],nodes=open(c),summaries=titles(lesson);ok(nodes.some(x=>x.textContent==='Objectif : '+l.objective),c+' study objective');ok(nodes.some(x=>x.textContent===l.rule),c+' rule');ok(nodes.some(x=>x.textContent===l.checks[0].answer),c+' check answer');ok(nodes.some(x=>x.textContent==='Aide pédagogique, non notée.'),c+' non scoring');const ext=l.extensions||[];ok(summaries.filter(x=>x.startsWith('Approfondir :')).length===ext.length,c+' extension count');for(const e of ext){ok(summaries.includes('Approfondir : '+e.title),c+' ext title');ok(nodes.some(x=>x.textContent===e.rule),c+' ext rule');ok(nodes.some(x=>x.textContent===e.check.answer),c+' ext check');extensions++}const unique=new Set([...l.examples,...ext.flatMap(e=>e.examples)].map(e=>e.id));examples+=unique.size;studies++;}
 choose(elements.mode,'discovery');ok(elements.open.disabled,'no repeat discovery on advanced');choose(elements.profile,'start');ok(list.children.length===4,'restart');ok(lesson.hidden,'restart hidden');
 return {assertions,recalls,studies,extensions,renderedExampleIds:examples,scope:'Exact module and inline demo script; DOM test double, not a browser'};
})(source,demo,corpus));
