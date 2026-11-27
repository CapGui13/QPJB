'use strict';
// Research only. No production policy or existing acceptance threshold is
// changed by this experiment. All trajectories use the real engine and
// the same immutable pre-audit probe universe.
const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path');
const C=require('./durable-m6-campaign.cjs'),LAB=require('../quizz-durable-m6-lab.js'),G=require('../quizz-durable-m6-guards.js');
const root=path.join(__dirname,'..'),[profile='intermediaire',seedArg='47']=process.argv.slice(2),seed=Number(seedArg),horizon=180;
if(!Object.hasOwn(LAB.PROFILES,profile)||!Number.isInteger(seed))throw Error('Invalid experiment scenario');
const readGit=(ref,p)=>cp.execFileSync('git',['show',ref+':'+p],{cwd:root,encoding:'utf8',maxBuffer:24*1024*1024});
const names=ref=>cp.execFileSync('git',['ls-tree','--name-only',ref],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(p=>/^quizz-.*\.js$/.test(p)||p==='parcours-recommandations.js');
const base=Object.fromEntries([...new Set([...C.paths,...names(C.AUDIT_BASE)])].map(p=>[p,readGit(C.AUDIT_BASE,p)]));
const current=Object.fromEntries([...new Set([...C.paths,...fs.readdirSync(root).filter(p=>/^quizz-.*\.js$/.test(p)||p==='parcours-recommandations.js')])].map(p=>[p,fs.readFileSync(path.join(root,p),'utf8')]));
const readBlob=sha=>JSON.parse(cp.execFileSync('git',['cat-file','blob',sha],{cwd:root,encoding:'utf8',maxBuffer:24*1024*1024}));
const audit={exercises:C.data(base['quizz.html']),meta:C.compile(base['quizz-prerequis.js'],require),
 catalogue:readBlob('0359c7ac24904f95afd72a5ac5f8da9fa6d9592f'),metadata:readBlob('ecc1a1802665d9af4c6ca63ae7cd5e85b286afcc')};
const probe=C.prepare(base),prepared=C.prepare(current);
const revision=C.verifyAuditRevision(probe,prepared,audit);
const anchor="\n    }\n    const order=['discovery','maintenance','weakness','transfer'];";
if(current['quizz-parcours.js'].split(anchor).length!==2)throw Error('Exact experiment anchor must be unique');
function trial(policy){
 if(policy==='current')return current;
 // One optional slot after the normal objective, recovery and priority
 // selections. Never force a future concept, break a family cap or bypass
 // any prerequisite. Use observed history only, not the simulation seed.
 const block=`
      // Research-only bounded retrieval/transfer policy: ${policy}.
      if(selected.length<limit){
        let reserved=false;
        if(${policy!=='transfer'}&&s>=65){
          const core=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
          const dueCore=pool.filter(q=>core.has(mOf(q).concept)&&e.seen.has(mOf(q).concept)&&oldConcept(q)>=8&&!concepts[mOf(q).concept]&&q.difficulty<=3);
          const orderCore=[...new Set(dueCore.map(q=>mOf(q).concept))].sort((a,b)=>(e.lastConcept[a]??-1)-(e.lastConcept[b]??-1)||a.localeCompare(b));
          for(const k of orderCore)if(choose(dueCore.filter(q=>mOf(q).concept===k),'maintenance',null,true)){reserved=true;break;}
        }
        if(!reserved&&${policy!=='core'}){
          const candidates=pool.filter(q=>{
            const k=mOf(q).concept,rows=e.proofs.get(k)||[];
            if(!rows.length||concepts[k]||e.localFragility.has(k)||oldConcept(q)<3||!novelFamily(q))return false;
            if(new Set(rows.map(r=>r.family)).size>=2&&new Set(rows.map(r=>r.session)).size>=2)return false;
            return !rows.some(r=>r.family===family(q))&&q.difficulty<=Math.min(3,e.localTargets.get(k)||targetByTheme[q.theme]||1);
          });
          const orderTransfer=[...new Set(candidates.map(q=>mOf(q).concept))].sort((a,b)=>(e.lastConcept[a]??-1)-(e.lastConcept[b]??-1)||a.localeCompare(b));
          for(const k of orderTransfer)if(choose(candidates.filter(q=>mOf(q).concept===k),'maintenance',null,true))break;
        }
      }`;
 return {...current,'quizz-parcours.js':current['quizz-parcours.js'].replace(anchor,block+anchor)};
}
function compare(before,after){
 G.validatePair(before,after,{requireEvents:true});
 return LAB.compare(before,after).map((r,i)=>{
  const a=before.checkpoints[i],b=after.checkpoints[i],common=before.model==='learning'?G.commonTransfer(a,b,seed,LAB.random):null;
  if(common?.n>=10&&common.delta<-.03)r.review.push('common-transfer-probe');
  if(a.crossSessionNewFamily-b.crossSessionNewFamily>Math.max(5,.15*a.crossSessionNewFamily))r.review.push('cross-session-transfer');
  return {...r,commonTransfer:common,crossSessionNewFamilyDelta:b.crossSessionNewFamily-a.crossSessionNewFamily};
 });
}
const opts={probe,collectProbeRows:true};
const before=C.run(base,profile,seed,horizon,opts),control=C.run(current,profile,seed,horizon,opts);
const compact=x=>({...x,checkpoints:x.checkpoints.map(({probeRows,...other})=>other)});
const variants={};let structural=before.violations.length+control.violations.length;
for(const policy of ['current','core','transfer','combined']){
 const after=policy==='current'?control:C.run(trial(policy),profile,seed,horizon,opts);
 const direct=compare(before,after),relative=compare(control,after);
 structural+=after.violations.length;
 variants[policy]={trajectory:compact(after),direct,relative,flags:direct.flatMap(r=>r.review.map(metric=>({session:r.session,metric}))),relativeFlags:relative.flatMap(r=>r.review.map(metric=>({session:r.session,metric})))};
}
const result={schema:'QPJB_AUDIT3000_SELECTION_EXPERIMENT_V1',reference:C.AUDIT_BASE,revision,profile,seed,horizon,structural,
 preAudit:compact(before),variants,policy:'One optional slot; no production activation. Original comparator thresholds unchanged. Holdout seeds 211,307 not used to design the hypotheses.'};
fs.writeFileSync(path.join(root,'audit3000-selection-experiment.json'),JSON.stringify(result));
console.log(JSON.stringify({profile,seed,structural,variants:Object.fromEntries(Object.entries(variants).map(([k,v])=>[k,{flags:v.flags,relativeFlags:v.relativeFlags,final:v.direct.at(-1)?.deltas}]))},null,2));
if(structural)process.exitCode=2;
