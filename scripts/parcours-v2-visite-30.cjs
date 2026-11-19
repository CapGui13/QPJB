'use strict';
// Parcours QPJB V2 — carnet pédagogique de 30 séances, exclusivement hors production.
// Toutes les mains / séquences / réponses proviennent des 1 523 QCM originaux.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const F=require('./parcours-v2-pilot.cjs');
const P=require('../quizz-parcours.js');
const ROOT=path.resolve(__dirname,'..');
const OUT=path.join(ROOT,'artifacts/v2-30-seances');
const SCENARIOS=[
  {id:'equilibre-13',name:'Profil équilibré · graine 13',profile:'balanced',seed:13},
  {id:'fragile-mineures-29',name:'Fragile sur les mineures · graine 29',profile:'fragile-mineures',seed:29},
  {id:'facile-47',name:'Très à l’aise · graine 47',profile:'facile',seed:47}
];
const N=30,ALLOWED_FAMILY_SPAN=3;
const THEMES={
  ouv:'Choix de l’ouverture',mineur:'Réponses aux mineures',
  majeur:'Réponses aux majeures',sa:'Sans-atout',stayman:'Stayman / Texas',
  intervenir:'Intervenir',reponse_inter:'Répondre après intervention',
  apres_inter:'Après intervention',forcing:'Forcing',
  michaels:'Michaels',rubensohl:'Rubensohl',chelem:'Chelem'
};
const round=n=>Math.round(n*100)/100;
function aggregate(deck,field){return deck.reduce((o,q)=>(o[field(q)]=(o[field(q)]||0)+1,o),{});}
function maxCount(obj){return Math.max(0,...Object.values(obj));}
function sample(q,selection,answerCorrect,sensitive){
  const cardCount=q.hand.reduce((n,c)=>n+c.length,0);
  assert.equal(cardCount,13,'Main incomplète '+q.id);
  assert.ok(q.choices.includes(q.answer),'Réponse hors des choix '+q.id);
  return {id:q.id,family:F.family(q),theme:q.theme,
    themeLabel:THEMES[q.theme]||q.theme,
    difficulty:q.difficulty,role:F.roleOpening(q),answer:q.answer,
    auction:q.auction||[],hand:q.hand,choices:q.choices,context:q.context,
    explain:q.explain,syntheticCorrect:answerCorrect,
    scheduledRecall:selection.source==='scheduled-recall',
    sensitive:sensitive.has(q.id)};
}
function generate(){
  const catalog=F.loadCatalog(),annotations=F.loadAnnotations();
  assert.equal(catalog.length,1523);assert.equal(annotations.size,79);
  const sourceIds=new Set(catalog.map(q=>q.id));
  assert.equal(sourceIds.size,catalog.length);
  const preview=fs.readFileSync(path.join(ROOT,'preview/parcours-v2-autonome.html'),'utf8');
  const marker='<script id="review-flags" type="application/json">';
  const at=preview.indexOf(marker),end=preview.indexOf('</script>',at+marker.length);
  assert.ok(at>=0&&end>at,'Liste des questions sensibles absente');
  const flags=JSON.parse(preview.slice(at+marker.length,end));
  const sensitive=new Set(flags.map(x=>x[0]));
  assert.equal(sensitive.size,19);
  const scenarios=[];
  for(const conf of SCENARIOS){
    const state=F.newState(conf.seed),sessions=[];
    const allFamilies=new Map(),themesSeen=new Set();
    for(let i=0;i<N;i++){
      const deck=F.select(catalog,state,annotations,10);
      assert.equal(deck.length,10,'Séance incomplète '+(i+1));
      const selected=state.lastSelection.map(s=>({...s}));
      const results=F.simulatedAnswers(deck,i,conf.seed,conf.profile);
      assert.equal(new Set(deck.map(F.family)).size,10,'Famille répétée dans la séance');
      const familyRecency=[],newThemes=[];
      for(let k=0;k<deck.length;k++){
        const q=deck[k];
        assert.ok(sourceIds.has(q.id),'Question hors catalogue '+q.id);
        assert.ok(F.available(q,i,annotations),'Question présentée trop tôt '+q.id);
        if(!themesSeen.has(q.theme)){themesSeen.add(q.theme);newThemes.push(q.theme);}
        const fam=F.family(q);
        if(allFamilies.has(fam)&&i-allFamilies.get(fam)<=ALLOWED_FAMILY_SPAN)
          familyRecency.push({id:q.id,lastSession:allFamilies.get(fam)+1,gap:i-allFamilies.get(fam)});
        allFamilies.set(fam,i);
      }
      const qs=deck.map((q,k)=>sample(q,selected[k],results[k],sensitive));
      const answerCounts=aggregate(qs,x=>x.answer);
      const themes=aggregate(qs,x=>x.theme);
      const levels=aggregate(qs,x=>String(x.difficulty));
      const roles=aggregate(qs,x=>x.role||'autre');
      const adjacentSame=qs.reduce((n,q,k)=>n+(k>0&&q.answer===qs[k-1].answer?1:0),0);
      const high=qs.filter(q=>q.difficulty>=4).length;
      const low=qs.filter(q=>q.difficulty<=2).length;
      const session={number:i+1,questions:qs,editorialMean:round(qs.reduce((n,q)=>n+q.difficulty,0)/10),
        levels,themes,roles,newThemes,recentFamilyReuse:familyRecency,
        high,low,scheduledRecalls:qs.filter(q=>q.scheduledRecall).length,
        repeatedAnswers:maxCount(answerCounts),answers:answerCounts,adjacentSame,
        sensitive:qs.filter(q=>q.sensitive).map(q=>q.id)};
      sessions.push(session);
      F.recordSession(state,deck,results,annotations);
    }
    const windows=[[1,5],[6,10],[11,20],[21,30]].map(([from,to])=>{
      const selection=sessions.slice(from-1,to),qs=selection.flatMap(s=>s.questions);
      return {from,to,meanDifficulty:round(qs.reduce((n,q)=>n+q.difficulty,0)/qs.length),
        highShare:round(qs.filter(q=>q.difficulty>=4).length*100/qs.length),
        uniqueThemes:new Set(qs.map(q=>q.theme)).size,
        uniqueFamilies:new Set(qs.map(q=>q.family)).size,
        scheduledRecalls:qs.filter(q=>q.scheduledRecall).length,
        openings:Object.fromEntries(['1♣','1♦','1♥','1♠','1SA','Passe']
          .map(k=>[k,qs.filter(q=>q.role==='ouv:'+k).length])),
        replies:Object.fromEntries(['1♣','1♦','1♥','1♠','1SA']
          .map(k=>[k,qs.filter(q=>q.role==='rep:'+k).length]))};
    });
    const all=sessions.flatMap(s=>s.questions);
    scenarios.push({...conf,sessions,windows,summary:{
      questions:all.length,uniqueFamilies:new Set(all.map(q=>q.family)).size,
      themesSeen:new Set(all.map(q=>q.theme)).size,
      meanEditorialDifficulty:round(all.reduce((n,q)=>n+q.difficulty,0)/all.length),
      scheduledRecalls:all.filter(q=>q.scheduledRecall).length,
      sessionsWith3SameAnswer:sessions.filter(s=>s.repeatedAnswers>=3).map(s=>s.number),
      sessionsWith4SameAnswer:sessions.filter(s=>s.repeatedAnswers>=4).map(s=>s.number),
      recentFamilyReuse:sessions.flatMap(s=>s.recentFamilyReuse.map(x=>({session:s.number,...x}))),
      flaggedCases:all.filter(q=>q.sensitive).map(q=>({id:q.id,session:sessions.find(s=>s.questions.includes(q)).number})),
      firstThemes:Object.fromEntries([...new Set(all.map(q=>q.theme))]
        .map(t=>[t,sessions.find(s=>s.questions.some(q=>q.theme===t)).number]))
    }});
  }
  const report={schema:'QPJB_V2_VISITE_30_SEANCES_1',
    source:'V2-F et 1 523 QCM originaux',created:'2026-11-19',
    simulation:true,realLearners:false,realScores:false,questionsModified:false,
    publicSiteModified:false,seedProfilesDifferent:true,
    sessionsPerScenario:N,questionsPerSession:10,catalogCount:catalog.length,
    scenarios};
  assert.equal(report.scenarios.length,3);
  for(const s of scenarios){
    assert.equal(s.sessions.length,30);
    assert.equal(s.sessions.flatMap(x=>x.questions).length,300);
    for(const q of s.sessions.flatMap(x=>x.questions))
      assert.ok(sourceIds.has(q.id));
  }
  return report;
}
function escapeHtml(x){
 return String(x===undefined||x===null?'':x).replace(/[&<>"']/g,c=>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function html(report){
 const data=JSON.stringify(report).replace(/</g,'\\u003c').replace(/&/g,'\\u0026');
 return '<!doctype html><html lang="fr"><head><meta charset="utf-8">'+
 '<meta name="viewport" content="width=device-width, initial-scale=1">'+
 '<title>QPJB · Visite guidée des 30 séances V2</title>'+
 '<style>'+
 ':root{font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#202a43;background:#f3f6fc}'+
 '*{box-sizing:border-box}body{margin:0}.wrap{max-width:1250px;margin:auto;padding:25px 18px 60px}'+
 'h1{font-size:clamp(1.6rem,3vw,2.4rem);margin:0 0 8px}h2{font-size:1.35rem}h3{font-size:1.05rem}'+
 '.top{background:#163b71;color:white;padding:25px 20px}.top p{max-width:1050px;line-height:1.5}'+
 '.muted{color:#5a6981}.top .muted{color:#d7e3ff}.pill{display:inline-block;padding:4px 10px;border-radius:100px;background:#e7effe;color:#234a8b;font-size:.78rem;font-weight:700}'+
 '.warn{background:#fff0cb;color:#76530c}.board{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:18px 0}'+
 '.tile{background:white;border:1px solid #dce3f0;padding:17px;border-radius:12px}.num{font-size:1.75rem;font-weight:750;color:#19457e}'+
 '.controls{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:16px 0}select,button{font:inherit;padding:9px 12px;border-radius:8px;border:1px solid #b9c7dd;background:white;color:#213351}'+
 'button{cursor:pointer}button:focus-visible,select:focus-visible{outline:3px solid #408cf0}button[aria-pressed=true]{background:#184f93;color:white;border-color:#184f93}'+
 '.sessions{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:7px;margin:16px 0}'+
 '.sessions button{padding:10px 0}.columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}'+
 '.card{background:white;border:1px solid #dce3f0;border-radius:14px;padding:16px;margin:12px 0;overflow-wrap:anywhere}'+
 '.question{border-left:5px solid #789bc8}.question.recall{border-left-color:#237e61}.question.sensitive{border-left-color:#bd7c22}'+
 '.meta{display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin:8px 0}.auction{white-space:pre-line;background:#f1f5fd;padding:10px;border-radius:8px;line-height:1.55}'+
 '.suits{border-collapse:collapse}.suits td{padding:3px 10px;border-bottom:1px solid #e1e9f3}.suits td:first-child{font-weight:800}'+
 '.red{color:#bf263d}.black{color:#26334d}details{background:#f7f9fd;border:1px solid #e2e8f4;border-radius:9px;margin:10px 0;padding:9px 12px}summary{cursor:pointer;font-weight:650}'+
 'ol{padding-left:25px}li{margin:4px 0}.hint{font-size:.87rem}.bar{height:9px;background:#e4eaf4;border-radius:10px;overflow:hidden}.fill{height:100%;background:#347cc3}'+
 '@media(max-width:760px){.sessions{grid-template-columns:repeat(6,minmax(0,1fr))}.board{grid-template-columns:1fr}.columns{grid-template-columns:1fr}.wrap{padding:16px 12px}.top{padding:20px 10px}}'+
 '</style></head><body><header class="top"><div class="wrap"><span class="pill">AUDIT HORS PRODUCTION</span>'+
 '<h1>QPJB · Visite guidée des 30 premières séances V2</h1>'+
 '<p>Ce carnet affiche les <b>vrais QCM du catalogue</b> sélectionnés par le moteur V2-F pour trois profils <b>fictifs</b>. Les réponses sont simulées pour permettre au moteur de programmer ses rappels : aucune donnée ni réussite d’élève.</p>'+
 '<p class="muted">Fichier autonome, sans réseau ni sauvegarde. On inspecte les séances, on ne joue pas ici au Quiz. Aucune modification du site QPJB.</p></div></header>'+
 '<main class="wrap"><div class="controls"><label for="profile"><b>Parcours :</b></label><select id="profile"></select>'+
 '<button id="prev">← Séance précédente</button><button id="next">Séance suivante →</button></div>'+
 '<section id="summary"></section><section id="sessionsNav" class="sessions" aria-label="Choix de la séance"></section>'+
 '<section id="session"></section><h2>Les 10 QCM originaux de cette séance</h2><div id="questions"></div>'+
 '</main><script type="application/json" id="dataset">'+data+'</script><script>'+
 "(function(){'use strict';"+
 'const data=JSON.parse(document.getElementById("dataset").textContent);'+
 'const E=x=>String(x===undefined||x===null?"":x).replace(/[&<>"\\x27]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",\'"\':"&quot;","\\x27":"&#39;"}[c]));'+
 'const $=id=>document.getElementById(id);let profile=0,number=1;'+
 'const profiles=$("profile");data.scenarios.forEach((s,i)=>{const x=document.createElement("option");x.value=i;x.textContent=s.name;profiles.append(x)});'+
 'function table(o){return Object.entries(o).filter(([,v])=>v>0).map(([k,v])=>E(k)+" : <b>"+v+"</b>").join(" · ")||"Aucune"}'+
 'function render(){const sc=data.scenarios[profile],s=sc.sessions[number-1],a=sc.summary;'+
 '$("summary").innerHTML="<div class=board><div class=tile><div class=num>"+a.questions+"</div>QCM sur 30 séances</div><div class=tile><div class=num>"+a.uniqueFamilies+"</div>Familles différentes</div><div class=tile><div class=num>"+a.scheduledRecalls+"</div>Rappels ciblés simulés</div></div>"+'+
 '"<p class=muted>Nouveaux thèmes dans le parcours : "+a.themesSeen+" · Réponses identiques ≥ 3 dans la même séance : "+a.sessionsWith3SameAnswer.length+" séance(s). Comparer les profils avant de conclure.</p>";'+
 'let nav="";for(let n=1;n<=30;n++){nav+="<button data-n="+n+" aria-pressed="+(n===number)+">"+n+"</button>"}$("sessionsNav").innerHTML=nav;'+
 '$("session").innerHTML="<div class=card><h2>Séance "+s.number+" / 30</h2><div class=meta><span class=pill>Difficulté éditoriale moyenne : "+s.editorialMean+"/5</span><span class=pill>"+s.scheduledRecalls+" rappel(s)</span><span class=pill>"+s.newThemes.length+" nouvelle(s) rubrique(s)</span><span class=pill>"+s.repeatedAnswers+" occurrences au maximum d’une même réponse</span></div>"+'+
 '"<div class=columns><div><h3>Ouvertures et réponses travaillées</h3><p>"+table(s.roles)+"</p><h3>Rubriques</h3><p>"+table(s.themes)+"</p></div><div><h3>Difficultés 1–5</h3><p>"+table(s.levels)+"</p><h3>Points d’attention</h3><p>"+(s.recentFamilyReuse.length?"Familles vues récemment : "+s.recentFamilyReuse.map(x=>E(x.id)).join(", "):"Aucune famille reprise sous trois séances.")+"</p><p>"+(s.sensitive.length?"Cas éditoriaux signalés : "+s.sensitive.map(E).join(", "):"Aucun des 19 cas sensibles signalé.")+"</p></div></div></div>";'+
 '$("questions").innerHTML=s.questions.map((q,i)=>{const suits=["♠","♥","♦","♣"];const cards=q.hand.map((cards,j)=>"<tr><td class="+(j===1||j===2?"red":"black")+">"+suits[j]+"</td><td>"+E(cards.join(" "))+"</td></tr>").join("");return "<article class=\\"card question "+(q.scheduledRecall?"recall ":"")+(q.sensitive?"sensitive":"")+"\\"><h3>Question "+(i+1)+" · "+E(q.themeLabel)+"</h3><div class=meta><span class=pill>"+E(q.id)+"</span><span class=pill>Niveau "+q.difficulty+"/5</span>"+(q.scheduledRecall?"<span class=pill>Révision programmée</span>":"")+(q.sensitive?"<span class=\\"pill warn\\">À arbitrer</span>":"")+"</div><p>"+E(q.context)+"</p><div class=columns><div><table class=suits>"+cards+"</table></div><div><p class=auction>"+E(q.auction.join("\\n"))+"</p></div></div><details><summary>Voir les choix, la bonne réponse et l’explication originale</summary><p>"+q.choices.map((c,j)=>(j+1)+". "+E(c)).join(" · ")+"</p><p><b>Réponse du catalogue : "+E(q.answer)+"</b></p><p>"+E(q.explain)+"</p><p class=hint>Réponse fictive du simulateur : "+(q.syntheticCorrect?"correcte":"incorrecte")+" ; pas une observation d’élève.</p></details></article>"}).join("");'+
 '$("prev").disabled=number===1;$("next").disabled=number===30;'+
 '}'+
 'profiles.addEventListener("change",()=>{profile=Number(profiles.value);number=1;render()});'+
 '$("prev").addEventListener("click",()=>{if(number>1){number--;render();scrollTo({top:0,behavior:"smooth"})}});'+
 '$("next").addEventListener("click",()=>{if(number<30){number++;render();scrollTo({top:0,behavior:"smooth"})}});'+
 '$("sessionsNav").addEventListener("click",event=>{const b=event.target.closest("button[data-n]");if(b){number=Number(b.dataset.n);render()}});'+
 'render();'+
 '})();</script></body></html>';
}
function main(){
 const report=generate();
 fs.mkdirSync(OUT,{recursive:true});
 fs.writeFileSync(path.join(OUT,'visite-30-seances.json'),JSON.stringify(report,null,2));
 fs.writeFileSync(path.join(OUT,'visite-30-seances.html'),html(report));
 const brief={schema:report.schema,catalog:report.catalogCount,
  scenarios:report.scenarios.map(s=>({profile:s.id,summary:s.summary,windows:s.windows,
   firstFive:s.sessions.slice(0,5).map(x=>({session:x.number,mean:x.editorialMean,
    answers:x.questions.map(q=>q.answer),themes:x.themes,
    roles:x.roles,recalls:x.scheduledRecalls})),
   sessionsWithConcentratedAnswers:s.sessions.filter(x=>x.repeatedAnswers>=3)
     .map(x=>({session:x.number,maxSameAnswer:x.repeatedAnswers,answers:x.answers}))
  }))};
 fs.writeFileSync(path.join(OUT,'synthese-30-seances.json'),JSON.stringify(brief,null,2));
 console.log('QPJB-V2-30-METRICS '+JSON.stringify(brief));
 console.log('QPJB V2 30 séances — 3 profils × 30 séances × 10 QCM originaux ; HTML autonome prêt.');
 return brief;
}
module.exports={generate,html,main};
if(require.main===module)main();
