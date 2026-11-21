'use strict';
/* Contrôles dynamiques du focus UX sans navigateur : node tests/wave2-ux-focus.cjs */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'..','quizz.html'),'utf8');
const start=html.lastIndexOf('<script>'),end=html.lastIndexOf('</script>');
assert.ok(start>0&&end>start,'Script UI trouvé');
const js=html.slice(start+'<script>'.length,end);
function functionCode(name){
 const pattern=new RegExp('function '+name+'\\([^\\n]*');
 const match=js.match(pattern);
 assert.ok(match,'Fonction UI '+name);
 return match[0];
}
const exit=js.match(/function exitSession\(\)\{[\s\S]*?\n\}/);
assert.ok(exit,'Fonction de retour visible');
const evaluated=[functionCode('setQuizSkipTarget'),functionCode('focusQuizQuestion'),exit[0]].join('\n');
function scenario(type,withQuestion){
 const events=[],link={href:'#parcours-start',textContent:'',setAttribute(key,value){
  assert.equal(key,'href');this.href=value;
 }};
 const element=id=>({focus:options=>events.push('focus:'+id+':'+Boolean(options?.preventScroll))});
 const nodes={'back-home':element('back-home'),'parcours-start':element('parcours-start'),'new':element('new')};
 if(withQuestion)nodes['question-heading']=element('question-heading');
 const environment={
  document:{querySelector:selector=>selector==='.qpjb-quiz-skip'?link:null,
   body:{classList:{remove:value=>events.push('remove:'+value)}}},
  $:id=>nodes[id]||null,
  sessionType:type,quizSettingsScroll:317,
  parcoursHomeStatus:()=>events.push('homeStatus'),
  quizReportView:()=>events.push('reportView'),
  quizReportHeight:()=>events.push('reportHeight'),
  setTimeout:(callback,delay)=>{assert.equal(delay,80);events.push('timer80');callback()},
  quizScrollTo:y=>events.push('scroll:'+y)
 };
 vm.runInNewContext(evaluated+'\nfocusQuizQuestion();exitSession();',environment);
 return {link,events};
}
const parcours=scenario('parcours',true);
assert.equal(parcours.link.href,'#parcours-start');
assert.ok(parcours.events.includes('focus:question-heading:true'));
assert.ok(parcours.events.includes('focus:parcours-start:true'));
assert.ok(parcours.events.indexOf('scroll:317')<parcours.events.indexOf('focus:parcours-start:true'),
 'Retour focus après restauration du défilement');
const empty=scenario('libre',false);
assert.equal(empty.link.href,'#parcours-start');
assert.ok(empty.events.includes('focus:back-home:true'),'Pas de focus perdu sans exercice');
assert.ok(empty.events.includes('focus:new:true'),'Retour en séance libre');
console.log('PASS M3 focus simulé : question, liste vide, sortie guidée/libre, anti-saut de défilement');
