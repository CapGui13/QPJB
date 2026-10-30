'use strict';
// Repérage prudent des énoncés pouvant manquer d'informations explicites.
// Une alerte est une demande de relecture, jamais une correction automatique.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const s=fs.readFileSync(path.join(root,'entrainement/training-data.js'),'utf8').trim();
assert(s.startsWith('const D=')&&s.endsWith(';'));
const data=JSON.parse(s.slice(8,-1));
const findings=[];
function add(ex,kind,reason,priority='à relire'){
  findings.push({id:ex.id,source:ex.sourceRef||'',rubrique:ex.topic||ex.theme||'',
    priorite:priority,type:kind,observation:reason,extrait:String(ex.prompt||ex.question||'').slice(0,230)});
}
for(const ex of data.play){
  if(ex.reviewStatus==='a_verifier'){
    add(ex,'déjà mis en quarantaine',ex.quarantineReason||'Relecture pédagogique suspendue','déjà isolé');
    continue;
  }
  if(ex.exerciseFormat!=='carte_qcm')continue;
  const prompt=String(ex.prompt||'');
  const announcedLead=String(ex.lead||'');
  const isLeadChoice=ex.topic==='Entame';
  const hasLead=/^(?:10|[ARDV2-9])\s*[♠♥♦♣]|^[♠♥♦♣]\s*(?:10|[ARDV2-9])/.test(announcedLead);
  if(!isLeadChoice&&/\b(?:l.entame|sur l.entame|après l.entame)\b/i.test(prompt)&&!hasLead
    &&!/entame\s+(?:du|de la|de l'|de l’|d'un|d’une|d'une|le|la|l'|l’)\s*(?:10|[ARDV2-9]|as|roi|dame|valet)/i.test(prompt))
    add(ex,'entame à confirmer','Énoncé mentionnant une entame sans carte explicitement identifiée dans le champ dédié ou dans la formulation.');
  if(ex.type==='defense'&&!isLeadChoice&&ex.holdings?.length){
    const hasPlayer=ex.holdings.some(h=>/^vous\b|votre main/i.test(h.label||''));
    const hasSeat=/\b(?:vous\s+[êe]tes\s+en\s+|^)(?:est|ouest|nord|sud)\b/i.test(prompt);
    if(!hasPlayer&&!hasSeat&&ex.holdings.length<4)
      add(ex,'position du joueur à confirmer','Le joueur qui doit décider n’est pas explicitement désigné dans les mains ou dans l’énoncé.');
  }
  if(!Array.isArray(ex.options)||!Number.isInteger(ex.answerIndex)||ex.answerIndex<0||ex.answerIndex>=ex.options.length)
    add(ex,'proposition manquante','La réponse attendue ne correspond pas à une proposition visible.','structurel');
}
const byKind=Object.fromEntries([...new Set(findings.map(f=>f.type))].map(kind=>[kind,findings.filter(f=>f.type===kind).length]));
const report={generatedFrom:'entrainement/training-data.js',
  totalExercices:data.bidding.length+data.play.length,
  totalSignalements:findings.length,parCategorie:byKind,
  note:'Signalements exploratoires : ils ne prouvent pas une erreur de bridge. Aucune réponse ni aucune quarantaine n’est modifiée. Audit pédagogique final sous supervision.',
  signalements:findings};
const dir=path.join(root,'artifacts','training-ambiguity');
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report,null,2)+'\n');
const csv=[['id','priorité','type','observation','source'],...findings.map(f=>[f.id,f.priorite,f.type,f.observation,f.source])]
  .map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\n');
fs.writeFileSync(path.join(dir,'report.csv'),'\ufeff'+csv+'\n');
console.log('QPJB ambiguities: '+JSON.stringify({exercises:report.totalExercices,findings:findings.length,byKind}));
