'use strict';
const fs=require('node:fs'),path=require('node:path');
const legacyBuild=function build(exercises){
 const roadmap={ouv:0,majeur:1,mineur:1,sa:3,red:4,second:6,stayman:7,apres_fit:8,intervenir:10,contre:12,reponse_inter:13,apres_inter:14,barrage:17,reveil:19,roudi:22,drury:24,fortes:26,forcing:28,multilandy:32,rubensohl:34,michaels:36,chelem:39};
 const rows=exercises.map(q=>{
  const t=q.theme,d=q.difficulty,b=q.answer,id=q.id, reason=q.difficultyReason||'';
  const calls=(q.auction||[]).map(raw=>({role:raw.split(':')[0].trim(),bid:(raw.match(/:\s*([1-7](?:SA|[♣♦♥♠])|Surcontre|Contre|Passe)/)||[])[1]||'',raw}));
  const act=calls.filter(x=>x.bid&&x.bid!=='Passe'),a=act.map(x=>x.bid),ns=act.filter(x=>!/^Adversaire/.test(x.role)),enemy=act.filter(x=>/^Adversaire/.test(x.role)),[first,second,third]=a,tags=act.map(x=>x.raw).join(' ');
  let c=t+'.base',f=roadmap[t],p=0,rs=[],parent=null;
  const use=(concept,floor,phase,requires=[],support=null)=>{c=concept;f=Math.max(roadmap[t],floor);p=phase;rs=requires;parent=support};
  const major=/^[1-7][♥♠]$/,minor=/^[1-7][♣♦]$/;
  const rank=bid=>'♣♦♥♠'.indexOf(bid?.slice(-1));
  const reverse=(op,response,rebid)=>/^[1-7][♣♦♥♠]$/.test(rebid||'')&&rebid[0]==='2'&&rank(rebid)>rank(op)&&rank(rebid)!==rank(response);
  switch(t){
   case 'ouv':
    if(b==='2♣'||b==='2♦')use('fortes.ouverture',26,0,['ouv.sa2','ouv.majeure']);
    else if(id==='SEF-L28-001')use('ouv.bicolore.exception',22,3,['ouv.mineure','ouv.majeure','red.bicolore'],'ouv.mineure');
    else if(calls.length)use('ouv.position',4,1,['ouv.passe','ouv.majeure'],'ouv.majeure');
    else if(b==='2SA')use('ouv.sa2',1,0,['ouv.sa1']);
    else use('ouv.'+(b==='Passe'?'passe':b==='1SA'?'sa1':minor.test(b)?'mineure':'majeure'),0,0);
    break;
   case 'mineur':case 'majeur':{
    const op=t==='mineur'?'ouv.mineure':'ouv.majeure',root=t+'.base';
    if(t==='majeur'&&b==='2SA'&&major.test(first))use('fit.2sa',8,1,[root,'majeur.soutien'],root);
    else if((t==='majeur'?major:minor).test(b)&&b.slice(-1)===first?.slice(-1))use(t+'.soutien',1,0,[op]);
    else use(root,1,0,[op]);break;
   }
   case 'sa':case 'stayman':{
    const sa=first==='2SA'?2:1,basic='sa'+sa+'.seuil',stay='sa'+sa+'.stayman',tx='sa'+sa+'.texas',mn='sa'+sa+'.texas_mineur';
    const conv=second||b,st=conv===(sa===1?'2♣':'3♣'),te=(sa===1?['2♦','2♥']:['3♦','3♥']).includes(conv),mi=(sa===1?['2♠','3♣']:['3♠']).includes(conv);
    const br=sa===1?['ouv.sa1']:['ouv.sa2','sa1.seuil'];
    if(first==='3SA')use('sa.gambling',23,3,['barrage.ouverture','sa1.seuil'],'barrage.ouverture');
    else if(a.includes('4SA')||b==='4SA'||b==='5SA')use(a.includes('4SA')?'chelem.quantitatif.suite':'chelem.quantitatif',39,a.includes('4SA')?2:0,[basic,...(a.includes('4SA')?['chelem.quantitatif']:[])],basic);
    else if(sa===2&&b==='4♦'&&a.length===1)use('sa2.bicolore',15,3,['sa2.texas.suite','sa2.stayman.suite'],'sa2.texas');
    else if(a.length===1&&!st&&!te&&!mi)use(basic,sa===1?3:6,0,br);
    else if(st||te||mi){
     const root=st?stay:te?tx:mn,gate=mi?(sa===2?16:12):(sa===1?4:8);
     const start=[basic,...(sa===2?[st?'sa1.stayman.reponse':te?'sa1.texas.suite':'sa1.texas_mineur.reponse']:[]),...(mi?['sa1.texas.suite']:[])];
     if(a.length===1)use(root,gate,0,start);
     else if(enemy.length)use(root+'.contre',14,3,[root,...(st?[root+'.reponse']:[]),'contre.base'],root);
     else if(a.length===2)use(root+'.reponse',Math.max(gate+2,sa===1?7:10),1,[root,...(sa===2&&mi?['sa2.seuil','sa1.texas_mineur.reponse','sa2.texas']:[])],root);
     else {use(root+'.suite',Math.max(gate+3,sa===1?9:12),2,[root,...((st||mi||sa===2)?[root+'.reponse']:[])],root);if(a.length>3||/chassé.croisé|transfert de manche|relais 3♣|chelem/i.test(reason)){p=3;f=Math.max(f,sa===2?18:15);}}
    }else use(basic,sa===1?3:6,1,br);
    break;
   }
   case 'red':
    if(enemy.length)use('red.competitif',14,2,['red.base','apres_inter.base'],'red.base');
    else if(a.length===2&&reverse(first,second,b))use('red.bicolore_cher',9,2,['red.bicolore'],'red.bicolore');
    else if((a.length===2&&/^[1-3][♣♦♥♠]$/.test(b)&&b.slice(-1)!==first?.slice(-1)&&b.slice(-1)!==second?.slice(-1))||id==='SEF-V413-013')use('red.bicolore',5,0,['mineur.base','majeur.base'],'red.base');
    else use('red.base',4,0,['mineur.base','majeur.base']);break;
   case 'second':
    if(/troisième couleur forcing|3e couleur forcing/i.test(tags))use('forcing.troisieme.suite',28,2,['forcing.troisieme','second.base'],'forcing.base');
    else if(/bicolore cher|modérateur/i.test(tags)||reverse(first,second,third))use('second.bicolore_cher',12,2,['red.bicolore_cher','second.base'],'second.base');
    else use('second.base',6,0,['red.base']);break;
   case 'apres_fit':
    if(/fitté/i.test(tags)&&a.includes('2SA'))use('fit.2sa.suite',10,2,['fit.2sa','apres_fit.base',...(enemy.length?['competitif.2sa_fitte']:[])],'apres_fit.base');
    else if(a.length>=3)use('apres_fit.essai.suite',10,2,['apres_fit.essai'],'apres_fit.base');
    else if(b==='2SA'||(major.test(b)&&b.startsWith('3')&&d>=3))use('apres_fit.essai',8,1,['apres_fit.base'],'apres_fit.base');
    else use('apres_fit.base',8,0,['majeur.soutien']);break;
   case 'intervenir':
    if(/^2[♥♠]$/.test(first||''))use('intervenir.deux_faible',17,1,['intervenir.base','barrage.ouverture'],'intervenir.base');
    else use('intervenir.base',10,0,['ouv.majeure','ouv.mineure']);break;
   case 'contre':
    if(/^2[♥♠]$/.test(first||''))use('contre.deux_faible',18,a.includes('2SA')?2:1,['contre.base','barrage.ouverture'],'contre.base');
    else use('contre.base',12,0,['intervenir.base']);break;
   case 'reponse_inter':
    if(ns[0]?.bid==='1SA')use('intervenir.sa.suite',17,2,['reponse_inter.base','sa1.stayman','sa1.texas'],'reponse_inter.base');
    else use('reponse_inter.base',13,0,['intervenir.base']);break;
   case 'apres_inter':
    if(enemy.some(x=>x.bid==='1SA'))use('competitif.sa_adverse',16,1,['apres_inter.base','sa1.seuil'],'apres_inter.base');
    else if(enemy.some(x=>x.bid==='Contre')&&(/Truscott|Surcontre|rencontre/i.test(reason)||b==='2SA'||(b==='3SA'&&major.test(first))))use('competitif.truscott',16,1,['apres_inter.base','majeur.soutien'],'apres_inter.base');
    else if(b==='Contre'||/Spoutnik/i.test(tags))use('competitif.spoutnik',14,0,['apres_inter.base'],'apres_inter.base');
    else if(b==='2SA'&&/fitté/i.test(reason)&&!/naturel sur/i.test(reason))use('competitif.2sa_fitte',15,1,['apres_inter.base','fit.2sa'],'apres_inter.base');
    else use('apres_inter.base',14,0,['intervenir.base','majeur.soutien']);break;
   case 'barrage':
    if(!a.length)use('barrage.ouverture',17,0,['ouv.majeure','ouv.passe']);
    else if(a.length===1)use('barrage.reponse',18,1,['barrage.ouverture'],'barrage.ouverture');
    else use('barrage.suite',20,2,['barrage.reponse'],'barrage.reponse');break;
   case 'reveil':
    if(/^2[♥♠]$/.test(first||''))use('reveil.deux_faible',20,1,['reveil.base','barrage.ouverture'],'reveil.base');
    else use('reveil.base',19,0,['intervenir.base']);break;
   case 'roudi':
    if(ns.length<=3)use(b==='2♣'?'roudi.init':'roudi.choix',22,0,['second.base']);
    else if(ns.length===4)use('roudi.reponse',24,1,['roudi.init'],'roudi.init');
    else use('roudi.suite',26,2,['roudi.reponse'],'roudi.init');break;
   case 'drury':
    if(!ns.some(x=>x.bid==='2♣'))use(b==='2♣'?'drury.init':'drury.choix',24,0,['majeur.soutien','ouv.position']);
    else use(ns.length<=2?'drury.reponse':'drury.suite',26,ns.length<=2?1:2,['drury.init',...(ns.length>2?['drury.reponse']:[])],'drury.init');break;
   case 'fortes':
    if(!a.length)use('fortes.ouverture',26,0,['ouv.sa2','ouv.majeure']);
    else if(a.length===1)use('fortes.relais',27,1,['fortes.ouverture'],'fortes.ouverture');
    else if(a.length===2)use('fortes.redemande',29,2,['fortes.relais'],'fortes.ouverture');
    else use('fortes.suite',31,2,['fortes.redemande'],'fortes.redemande');
    if(a[2]==='2SA'&&a.length>=3&&/stayman|texas/i.test(reason+' '+tags)){rs.push('sa2.seuil',/stayman/i.test(reason+' '+tags)?'sa2.stayman':'sa2.texas');}break;
   case 'forcing':{
    let kind=ns.length>=3&&ns[0].bid.slice(-1)===ns[2].bid.slice(-1)?'troisieme':'quatrieme';
    if(/troisième|3e couleur/i.test(tags))kind='troisieme';if(/quatrième|4e couleur/i.test(tags))kind='quatrieme';
    if(['SEF-V45-022','SEF-L13-005','SEF-L13-006'].includes(id))use('forcing.base',28,0,['second.base']);
    else if(id==='SEF-L13-003')use('forcing.checkback',29,2,['red.base','roudi.init'],'forcing.base');
    else if(ns.length>=5)use('forcing.'+kind+'.suite',30,2,['forcing.'+kind,'second.base'],'forcing.base');
    else use('forcing.'+kind,28,ns.length===3?1:0,['forcing.base'],'forcing.base');break;
   }
   case 'multilandy':
    if(ns.length===0)use(b==='Passe'?'multilandy.choix':'multilandy.intervention',32,0,['intervenir.base','sa1.seuil']);
    else if(ns.length===1)use('multilandy.reponse',34,1,['multilandy.intervention'],'multilandy.intervention');
    else use('multilandy.suite',36,2,['multilandy.reponse'],'multilandy.reponse');break;
   case 'rubensohl':
    if(ns.length<=1)use((b==='Passe'||b==='Contre'||b==='Surcontre'||/^2[♣♦♥♠]$/.test(b)||b==='3SA')?'rubensohl.naturel':'rubensohl.init',34,0,['apres_inter.base','sa1.texas','sa1.stayman']);
    else use(ns.length===2?'rubensohl.reponse':'rubensohl.suite',36,ns.length===2?1:2,['rubensohl.init',...(ns.length>2?['rubensohl.reponse']:[])],'rubensohl.init');break;
   case 'michaels':
    if(!ns.length)use((b==='Passe'||/^1[♣♦♥♠]$/.test(b))?'michaels.choix':'michaels.intervention',36,0,['intervenir.base']);
    else use(ns.length===1?'michaels.reponse':'michaels.suite',38,ns.length===1?1:2,['michaels.intervention'],'michaels.intervention');break;
   case 'chelem':
    if(first==='1SA'||first==='2SA')use(a.includes('4SA')?'chelem.quantitatif.suite':'chelem.quantitatif',39,a.includes('4SA')?2:0,[first==='1SA'?'sa1.seuil':'sa2.seuil',...(a.includes('4SA')?['chelem.quantitatif']:[])],first==='1SA'?'sa1.seuil':'sa2.seuil');
    else if(first==='4SA')use(a.length===1?'chelem.cles':a.length===2?'chelem.blackwood.suite':'chelem.blackwood.dame_rois',39,a.length===1?0:a.length===2?2:3,['chelem.controles',...(a.length>1?['chelem.cles']:[]),...(a.length>2?['chelem.blackwood.suite']:[])],'chelem.cles');
    else if(b==='4SA')use('chelem.blackwood.declenchement',40,2,['chelem.controles','chelem.cles'],'chelem.controles');
    else if(a.length===1)use('chelem.splinter',39,1,['majeur.soutien','apres_fit.base'],'chelem.controles');
    else use('chelem.controles',39,0,['apres_fit.base']);break;
   default:throw Error('unknown theme '+t);
  }
  if(!['michaels','multilandy','rubensohl'].includes(t)&&enemy.some(x=>/Micha[ëe]l|bicolore.*(?:5.5|♣.*♦|♦.*♣|Carreau.*Cœur)/i.test(x.raw)))use('michaels.defense',38,2,['michaels.intervention','apres_inter.base'],'michaels.intervention');
  if(t==='reveil'&&((a.length===2&&major.test(first)&&second?.slice(-1)===first.slice(-1)&&['2SA','4♣','3♥','3♠'].includes(b)&&(/bicolore|cue.bid/i.test(reason)||b==='2SA')&&b!=='3'+(first==='1♥'?'♠':'♥'))||id==='SEF-L38-003'))use('michaels.reveil',38,2,['michaels.intervention','reveil.base'],'michaels.intervention');
  if(['SEF-L13-008','SEF-L19-005','SEF-L22-006','SEF-L23-002','SEF-L29-004','SEF-L30-004','SEF-L37-002','SEF-L13-004','SEF-L20-002','SEF-L28-004'].includes(id)){const old=c;use('chelem.splinter.variante',40,3,['chelem.splinter',old],'chelem.controles');}
  if(['SEF-L22-007','SEF-L27-005','SEF-V487-003'].includes(id)){const old=c;use('chelem.quantitatif.suite',41,2,['chelem.quantitatif',old],'chelem.quantitatif');}
  if(['SEF-L36-002','SEF-L36-001'].includes(id)){rs.push('competitif.spoutnik');f=Math.max(f,16);}
  if(id==='SEF-L24-006'){rs.push('apres_inter.base');f=Math.max(f,14);}
  if(id==='SEF-L39-005')rs.push('competitif.2sa_fitte','barrage.ouverture');
  if(id==='SEF-L19-004')rs.push('competitif.2sa_fitte');
  if(id==='SEF-L38-004'||id==='SEF-L38-005')rs.push('sa1.texas.suite','sa1.stayman.reponse');
  if(t==='reponse_inter'&&b==='2SA'&&/fitté|mixed raise/i.test(reason)){rs.push('fit.2sa');f=Math.max(f,15);}
  return {id,t,d,family:q.caseFamily||id,c,f,p,rs,parent};
 });
 const groups=new Map();for(const r of rows){if(!groups.has(r.c))groups.set(r.c,[]);groups.get(r.c).push(r);}
 // Absence de question autonome: transfert majeur 1SA dans la poursuite;
 // transfert mineur 2SA utilise l'initiation 1SA.
 const aliases={'sa1.texas.reponse':'sa1.texas','sa2.texas_mineur':'sa1.texas_mineur','sa2.texas_mineur.reponse':'sa1.texas_mineur.reponse','sa2.texas.suite':'sa2.texas.reponse','forcing.troisieme.suite':'forcing.troisieme','apres_fit.essai.suite':'apres_fit.essai'};
 function resolve(c){if(groups.has(c))return c;if(aliases[c]&&groups.has(aliases[c]))return aliases[c];throw Error('missing prerequisite '+c);}
 const low=c=>new Set(groups.get(resolve(c)).filter(x=>x.d<=3).map(x=>x.family)).size;
 const byId={};
 for(const r of rows){
  let stage=r.p,minSession=r.f;
  if(r.d===3)stage=Math.max(stage,1);if(r.d>=4)stage=3;
  const requirements=new Map();const add=(c,n)=>{c=resolve(c);requirements.set(c,Math.max(requirements.get(c)||0,n));};
  r.rs.forEach(c=>add(c,1));
  if(r.d>=4){
   const candidates=[r.c,r.parent,...r.rs].filter(Boolean);
   const foundation=candidates.find(c=>low(c)>0);
   if(!foundation)throw Error('advanced without low foundation '+r.id+' '+JSON.stringify(candidates));
   add(foundation,Math.min(r.d===5?3:2,low(foundation)));minSession=Math.max(minSession,r.f+(r.d===5?8:4));
  }else if(r.d===2&&r.p===0&&r.t!=='ouv'&&groups.get(r.c).some(x=>x.d===1)){
   stage=1;add(r.c,1); // N1 avant N2, sans déplacer les ouvertures S1
  }else if(r.d===3){
   if(r.p===0&&groups.get(r.c).some(x=>x.d<=2)){add(r.c,1);minSession=Math.max(minSession,r.f+1);}
   else if(r.p===0)stage=0;
  }
  byId[r.id]={concept:r.c,stage,minSession,requires:[...requirements].map(([concept,minExposure])=>({concept,minExposure})).sort((x,y)=>x.concept<y.concept?-1:x.concept>y.concept?1:0)};
 }
 return {schema:'QPJB_PREREQUIS_V1',byId};
};
// Table explicite : préserver les classifications historiques lors des reformulations.
const explicit=JSON.parse(JSON.stringify(require('../../coherence-integrale-20261125/integration/prerequis.json')));
// Visa coordinateur #377 : une réponse naturelle de 1SA n'est pas un soutien mineur.
const correction=require('../../coherence-progression-20261126/m1/prerequis-proposals.json');
for(const p of correction){
 if(p.id!=='SEF-020-3'||JSON.stringify(explicit.byId[p.id])!==JSON.stringify(p.old))throw Error('Unexpected pedagogical metadata patch');
 explicit.byId[p.id]=p.new;
}
// Visa Professeur numérique #386 : nouveaux IDs uniquement, métadonnées validées par coordinateur.
const publication=require('../../professeur-numerique-20261126/integration/publication.json');
for(const row of publication.additions){
 if(explicit.byId[row.id])throw Error('New pedagogical ID already exists '+row.id);
 explicit.byId[row.id]=row.metadata;
}
// QCM400 #545 : intégrer exclusivement les métadonnées explicites revues des quatre lots.
for(const lot of ['A','B','C','D']){
 const raw=require('../../qcm400-20261127/'+lot+'/prerequis.json');
 const rows=raw.byId||raw;
 if(Object.keys(rows).length!==100)throw Error('Unexpected QCM400 lot size '+lot);
 for(const [id,metadata] of Object.entries(rows)){
  if(!id.startsWith('SEF-Q400-'+lot+'-')||explicit.byId[id])throw Error('Unexpected QCM400 ID '+id);
  explicit.byId[id]=metadata;
 }
}
// QCM685 #546 : métadonnées explicites, sans recalcul des règles historiques.
for(const lot of ['A','B','C','D']){
 const raw=require('../../qcm685-20261127/'+lot+'/prerequis.json');
 const rows=raw.byId||raw;
 if(Object.keys(rows).length!==(lot==='D'?175:170))throw Error('Unexpected QCM685 lot size '+lot);
 for(const [id,metadata] of Object.entries(rows)){
  if(!id.startsWith('SEF-Q685-'+lot+'-')||explicit.byId[id])throw Error('Unexpected QCM685 ID '+id);
  explicit.byId[id]=metadata;
 }
}
function build(exercises){const ids=new Set(exercises.map(q=>q.id));if(ids.size!==exercises.length||ids.size!==Object.keys(explicit.byId).length||[...ids].some(id=>!explicit.byId[id]))throw Error('Explicit prerequis coverage mismatch');return {schema:explicit.schema,byId:Object.fromEntries(exercises.map(q=>[q.id,explicit.byId[q.id]]))};}
const root=path.resolve(__dirname,'../../..');
const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
const data=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const table=build(data.exercises);
const source="/* QPJB cohérence 2026-11-25 — table explicite, source audits/coherence-integrale-20261125/integration/prerequis.json + correctif #378 */\n(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.QPJBPrerequis=factory();})(typeof window!=='undefined'?window:globalThis,function(){'use strict';return "+JSON.stringify(table)+';});\n';
if(require.main===module){if(process.argv.includes('--write'))fs.writeFileSync(path.join(root,'quizz-prerequis.js'),source);else if(fs.readFileSync(path.join(root,'quizz-prerequis.js'),'utf8')!==source)throw Error('Generated module differs');}
module.exports={build,source};
