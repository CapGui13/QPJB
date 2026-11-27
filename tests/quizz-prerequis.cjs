'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');const data=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);const table=require('../quizz-prerequis.js');
const verify=function verify(data,table){
 const fail=(ok,msg)=>{if(!ok)throw Error(msg);};
 const a=data.exercises,m=table.byId,ids=new Set(a.map(q=>q.id)), concepts=new Set(Object.values(m).map(x=>x.concept));
 fail(a.length===ids.size&&a.length>=1915&&data.themes.length===22,'catalogue');fail(table.schema==='QPJB_PREREQUIS_V1'&&Object.keys(m).length===ids.size,'coverage');
 const roadmap={ouv:0,majeur:1,mineur:1,sa:3,red:4,second:6,stayman:7,apres_fit:8,intervenir:10,contre:12,reponse_inter:13,apres_inter:14,barrage:17,reveil:19,roudi:22,drury:24,fortes:26,forcing:28,multilandy:32,rubensohl:34,michaels:36,chelem:39};
 for(const q of a){const x=m[q.id];fail(x&&/^[a-z0-9_.]+$/.test(x.concept)&&[0,1,2,3].includes(x.stage)&&Number.isInteger(x.minSession)&&x.minSession>=roadmap[q.theme]&&Array.isArray(x.requires),'invalid '+q.id);fail(new Set(x.requires.map(p=>p.concept)).size===x.requires.length,'duplicate '+q.id);for(const p of x.requires)fail(concepts.has(p.concept)&&Number.isInteger(p.minExposure)&&p.minExposure>0,'unknown requirement '+q.id);if(q.difficulty>=4)fail(x.stage===3&&x.requires.length>0,'advanced '+q.id);}
 for(const [id,at,c] of [['SEF-V44-002',26,'fortes.ouverture'],['SEF-L06-029',23,'sa.gambling'],['SEF-L37-004',12,'sa1.texas_mineur.reponse'],['SEF-L38-001',10,'sa2.stayman.reponse'],['SEF-L40-001',10,'sa2.stayman.reponse'],['SEF-L41-002',39,'chelem.quantitatif.suite'],['SEF-L28-001',22,'ouv.bicolore.exception'],['SEF-L09-029',38,'michaels.defense']])fail(m[id].minSession>=at&&m[id].concept===c&&m[id].requires.length>0,'audit '+id);
 fail(m['SEF-L06-027'].concept==='sa1.seuil','incidental Stayman');fail(m['SEF-L07-015'].concept==='second.base','incidental Roudi/quantitatif');
 fail(m['SEF-L37-004'].requires.some(x=>x.concept==='sa1.texas_mineur'),'Texas mineur initiative');fail(m['SEF-L38-001'].requires.some(x=>x.concept==='sa2.stayman'),'2SA Stayman initiative');
 const seen=new Set(),exposed=new Map(),earliest={};
 for(let s=0;s<154;s++){
  const avail=a.filter(q=>!seen.has(q.id)&&m[q.id].minSession<=s&&m[q.id].requires.every(p=>(exposed.get(p.concept)?.size||0)>=p.minExposure));
  for(const q of avail){seen.add(q.id);const c=m[q.id].concept;if(!exposed.has(c))exposed.set(c,new Set());exposed.get(c).add(q.caseFamily||q.id);earliest[q.id]=s;}
 }
 const blocked=a.filter(q=>!seen.has(q.id));fail(!blocked.length,'unreachable '+JSON.stringify(blocked.slice(0,20).map(q=>[q.id,m[q.id]])));
 const start=a.filter(q=>m[q.id].minSession===0&&m[q.id].requires.length===0);
 for(const [b,n] of [['1♣',2],['1♦',2],['1♥',1],['1♠',1],['1SA',1],['Passe',3]])fail(new Set(start.filter(q=>q.answer===b&&(b!=='Passe'||q.difficulty===1&&q.h<12)).map(q=>q.caseFamily||q.id)).size>=n,'S1 pool '+b);
 const firstByTheme={};for(const q of a)firstByTheme[q.theme]=Math.min(firstByTheme[q.theme]??999,earliest[q.id]);fail(firstByTheme.sa<=7,'early SA');
 return {ids:ids.size,concepts:concepts.size,reachable:seen.size,maxEarliest:Math.max(...Object.values(earliest)),firstByTheme,stages:[0,1,2,3].map(n=>Object.values(m).filter(x=>x.stage===n).length),withRequirements:Object.values(m).filter(x=>x.requires.length).length};
};
const stats=verify(data,table);
const historical=JSON.parse(fs.readFileSync(path.join(root,'audits/wave2/pedagogie/CONTRAT_PREREQUIS_P11_HOLD.json'),'utf8')).requirements;
for(const r of historical){assert.ok(table.byId[r.id].minSession>=r.earliestIntroSessionIndex,r.id);for(const id of r.priorExposureIds)assert.ok(table.byId[id],id);}
for(const [id,c] of [["SEF-L26-002","michaels.reveil"],["SEF-L05-014","competitif.sa_adverse"],["SEF-L15-001","second.bicolore_cher"],["SEF-V410-006","red.bicolore_cher"],["SEF-V4-073-1","roudi.init"],["SEF-V4-074-3","roudi.choix"],["SEF-V4-098-1","drury.init"],["SEF-V4-100-2","drury.choix"]])assert.equal(table.byId[id].concept,c,id);
const generator=require('../audits/progression-guidee/M1/generate.cjs');assert.deepEqual(table,generator.build(data.exercises));const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'quizz-prerequis.js'),'utf8'),ctx);assert.equal(JSON.stringify(ctx.window.QPJBPrerequis),JSON.stringify(table));
const bad=JSON.parse(JSON.stringify(table));delete bad.byId[data.exercises[0].id];assert.throws(()=>verify(data,bad));const bad2=JSON.parse(JSON.stringify(table));bad2.byId['SEF-L09-029'].minSession=0;assert.throws(()=>verify(data,bad2));const bad3=JSON.parse(JSON.stringify(table));bad3.byId['SEF-L37-004'].requires=[];assert.throws(()=>verify(data,bad3));console.log(JSON.stringify(stats));
