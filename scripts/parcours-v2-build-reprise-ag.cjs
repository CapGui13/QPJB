'use strict';
// QPJB AG — generate a separate SINGLE-FILE offline V2 preview with optional
// browser-local resume. Never rewrites the original preview or live QPJB site.
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const INPUT=path.join(ROOT,'preview','parcours-v2-autonome.html');
const OUTPUT=path.join(ROOT,'artifacts','v2-ag','parcours-v2-reprise.html');
const APP_MARKER='<script>(function previewApp(){';
const STATE_MARKER='let learning=window.PreviewPilot.newState(13),deck=[],cursor=0,results=[],view=\'home\',reviewIndex=0,reviewSelected=null,sessionInProgress=false;';
const SAVE_MARKER='if(button&&!button.disabled)act(button);';
const LAST_MARKER='render();\n})();</script></body></html>';
const INJECT=[
"// AG sandbox persistence: this is a separate test file, not the live site.",
"// Nothing is transmitted: all data stays in this browser's localStorage.",
"const agKey='qpjb-preview-v2-ag-local-resume-v1';",
"const agVersion=1;",
"function agHash(){",
"  let h=2166136261;",
"  for(const q of catalog){",
"    const word=q.id+'|'+q.answer+'|'+(q.caseFamily||q.id)+'\\n';",
"    for(let i=0;i<word.length;i++){h^=word.charCodeAt(i);h=Math.imul(h,16777619);}",
"  }",
"  return String(h>>>0);",
"}",
"const agSignature=agHash();",
"let agAvailable=false;",
"try{",
"  const probe=agKey+'-probe';",
"  window.localStorage.setItem(probe,'1');",
"  agAvailable=window.localStorage.getItem(probe)==='1';",
"  window.localStorage.removeItem(probe);",
"}catch(_){agAvailable=false;}",
"function agObject(x){return x!==null&&typeof x==='object'&&!Array.isArray(x);}",
"function agValid(s){",
"  if(!agObject(s)||s.version!==agVersion||s.signature!==agSignature)return false;",
"  const l=s.learning;",
"  if(!agObject(l)||l.seed!==13||!Number.isInteger(l.session)||",
"     l.session<0||l.session>100000)return false;",
"  for(const name of ['history','families','concepts','recentOpening','reviewQueue'])",
"    if(!agObject(l[name]))return false;",
"  if(l.reviewSupport!==null&&!agObject(l.reviewSupport))return false;",
"  if(!Array.isArray(l.reviewEvents)||!Array.isArray(l.lastSelection)||",
"     l.reviewEvents.length>100000||l.lastSelection.length>10)return false;",
"  if(typeof s.active!=='boolean'||!Array.isArray(s.deck)||",
"     !Array.isArray(s.results)||s.results.length>10)return false;",
"  if(s.deck.length!==0&&s.deck.length!==10)return false;",
"  if(s.active&&s.deck.length!==10)return false;",
"  if(!Number.isInteger(s.cursor)||s.cursor<0||",
"     s.cursor>(s.deck.length?s.deck.length-1:0))return false;",
"  if(s.view!=='home'&&s.view!=='play'&&s.view!=='summary')return false;",
"  const ids=new Set(),families=new Set();",
"  for(const id of s.deck){",
"    const q=allById.get(id);",
"    if(!q||ids.has(id)||families.has(window.PreviewPilot.family(q)))return false;",
"    ids.add(id);families.add(window.PreviewPilot.family(q));",
"  }",
"  for(let i=0;i<s.results.length;i++){",
"    const r=s.results[i];",
"    if(r!==null&&(!s.deck[i]||!allById.get(s.deck[i]).choices.includes(r)))",
"      return false;",
"  }",
"  if(s.active&&s.view==='summary')return false;",
"  if(s.view==='summary'&&(s.active||s.deck.length!==10||",
"       s.results.length!==10||s.results.some(x=>x===null)||l.session<1))return false;",
"  return true;",
"}",
"function agRestore(){",
"  if(!agAvailable)return;",
"  let saved=null;",
"  try{saved=window.localStorage.getItem(agKey);}catch(_){agAvailable=false;return;}",
"  if(!saved)return;",
"  try{",
"    if(saved.length>3000000)throw Error('snapshot too large');",
"    const parsed=JSON.parse(saved);",
"    if(!agValid(parsed))throw Error('stale or invalid saved state');",
"    learning=parsed.learning;",
"    deck=parsed.deck.map(id=>allById.get(id));",
"    cursor=parsed.cursor;",
"    results=parsed.results.map(x=>x===null?undefined:x);",
"    sessionInProgress=parsed.active;",
"    view=sessionInProgress?'play':parsed.view==='summary'?'summary':'home';",
"  }catch(_){try{window.localStorage.removeItem(agKey);}catch(__){} }",
"}",
"function agSave(action){",
"  if(!agAvailable)return;",
"  try{",
"    if(action==='reset'){window.localStorage.removeItem(agKey);return;}",
"    const saved={version:agVersion,signature:agSignature,learning,",
"      deck:deck.map(q=>q.id),cursor,",
"      results:results.map(x=>x===undefined?null:x),",
"      active:sessionInProgress,",
"      view:view==='summary'?'summary':view==='play'?'play':'home'};",
"    const data=JSON.stringify(saved);",
"    if(data.length>3000000)throw Error('snapshot too large');",
"    window.localStorage.setItem(agKey,data);",
"  }catch(_){agAvailable=false;}",
"}"
].join('\n');
function replaceUnique(source,needle,substitute){
  const start=source.indexOf(needle);
  if(start<0||source.indexOf(needle,start+needle.length)>=0)
    throw Error('AG: source preview marker absent or nonunique: '+needle.slice(0,50));
  return source.slice(0,start)+substitute+source.slice(start+needle.length);
}
function build(original){
  if(original.length<1000000||!original.includes(APP_MARKER)||
     !original.includes('1 523 QCM du catalogue')||
     !original.includes('79 classifications pédagogiques candidates'))
    throw Error('AG: unexpected original preview format');
  const at=original.lastIndexOf(APP_MARKER);
  let app=original.slice(at);
  const before=original.slice(0,at);
  if(before.includes('qpjb-preview-v2-ag-local-resume-v1'))
    throw Error('AG: base preview is already persisted');
  app=replaceUnique(app,STATE_MARKER,STATE_MARKER+'\n'+INJECT);
  app=replaceUnique(app,SAVE_MARKER,
    "if(button&&!button.disabled){act(button);agSave(button.dataset.action);}");
  app=replaceUnique(app,LAST_MARKER,
    'agRestore();\n'+LAST_MARKER);
  app=replaceUnique(app,
    'Les résultats seront perdus à la fermeture ou à l’actualisation.',
    'La reprise locale est disponible sur cet appareil si le navigateur autorise le stockage.');
  app=replaceUnique(app,
    'Le prototype n’enregistre aucune donnée dans le navigateur et n’utilise aucun serveur.',
    'Cette version de test sauvegarde localement tes séances dans ce navigateur, sans aucun serveur.');
  const homeMarker=' <div class="actions" style="margin-top:20px">';
  const homeIdx=app.indexOf(homeMarker);
  if(homeIdx<0)throw Error('AG: home action marker missing');
  const statusJs='$'+"{agAvailable?'<p class=\"tiny\">Sauvegarde locale active sur cet appareil. Le bouton Réinitialiser efface aussi la sauvegarde.</p>':'<p class=\"tiny\">Sauvegarde locale indisponible dans ce navigateur : la reprise après fermeture peut ne pas fonctionner.</p>'}";
  app=app.slice(0,homeIdx)+statusJs+'\n'+app.slice(homeIdx);
  // The source QCM JSON, original embedded engines and all their answers
  // are left byte-for-byte identical.
  const built=before+app;
  if(built.length<original.length||built.includes('teacherConfirmedBeforeSession'))
    throw Error('AG: output unexpectedly altered or includes manual teacher gating');
  if(!built.includes("agRestore();\nrender();")||
     !built.includes("agSave(button.dataset.action)"))
    throw Error('AG: persistence integration incomplete');
  return built;
}
function create(output=OUTPUT){
  const original=fs.readFileSync(INPUT,'utf8');
  const built=build(original);
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.writeFileSync(output,built,'utf8');
  return {schema:'QPJB_AG_LOCAL_PREVIEW_1',file:output,
    bytes:Buffer.byteLength(built),catalogQcm:1523,
    existingPreviewChanged:false,publicSiteChanged:false,
    automaticProgression:true,teacherGate:false,lessonsIncluded:false,
    localOnly:true,networkCallsAdded:false,storageFallback:'explicit warning'};
}
if(require.main===module)process.stdout.write(JSON.stringify(
  create(process.argv[2]||OUTPUT),null,2)+'\n');
module.exports={INJECT,build,create,APP_MARKER,STATE_MARKER};
