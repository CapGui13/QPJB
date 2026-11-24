#!/usr/bin/env node
'use strict';
const {spawnSync}=require('node:child_process');
const {TextDecoder}=require('node:util');
const SCHEMA='QPJB_CI_PLAN_V1';
const LEVELS=['DOC_ONLY','QUICK','UI','FULL'];
const SHA=/^[0-9a-f]{40}$/;
const SESSION=/^(?:Séance [0-9]+-[0-9]{2} (?:Aix|Mumu)|SDE (?:Jan|Feb|Fév|Mar|Apr|Avr|May|Mai|Jun|Juin|Jul|Juil|Aug|Aoû|Sep|Sept|Oct|Nov|Dec|Déc) [0-9]{2})$/;
const CSS=new Set(['qpjb-bridge-ui.css','qpjb-design-tokens.css']);
const EMPTY_BLOB='e69de29bb2d1d6434b8b29ae775ad8c2e48c5391';
function marker(p){const a=p.split('/');return a.length===2&&SESSION.test(a[0])&&a[1]==='.seance-vide';}
const REPORTS=new Set(["audits/wave2/ux/PASSE_14_COMPARAISON_VISUELLE.md","audits/wave2/recommandations/PASSE25_RETRAIT_LANCEUR_NODE22_20261121.md","audits/wave2/ci/PASSE_9_PREUVES_HORODATEES.md"]);
const SELF=['scripts/ci-classify.cjs','tests/ci-classify.test.cjs','tests/ci-classify-real.cjs','audits/ci-optimisation/M1/README.md'];
const env={...process.env,GIT_NO_REPLACE_OBJECTS:'1',GIT_NO_LAZY_FETCH:'1',GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0',LC_ALL:'C'};
let cwd=process.cwd();
function git(args, allowed=[0]){
  const r=spawnSync('git',args,{cwd,env,maxBuffer:64*1024*1024,timeout:120000});
  if(r.error||!allowed.includes(r.status)) throw new Error('git '+args[0]+' failed: '+(r.error?.message||String(r.stderr).trim()||r.status));
  return r;
}
function decode(b){return new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(b);}
function nul(b){
  if(!b.length)return [];
  if(b[b.length-1]!==0)throw new Error('unterminated git output');
  return decode(b).slice(0,-1).split('\0');
}
function parseRaw(b){
  const a=nul(b),result=[],seen=new Set();
  for(let i=0;i<a.length;){
    const m=/^:([0-7]{6}) ([0-7]{6}) ([0-9a-f]{40}) ([0-9a-f]{40}) ([AMDT]|[RC][0-9]{1,3})$/.exec(a[i++]);
    if(!m)throw new Error('unexpected raw diff header');
    const [,oldMode,newMode,oldOid,newOid,status]=m;
    const kind=status[0],pair=kind==='R'||kind==='C';
    if(pair&&Number(status.slice(1))>100)throw new Error('invalid similarity');
    const first=a[i++],path=pair?a[i++]:first;
    if(!first||!path||seen.has(path))throw new Error('invalid/duplicate diff path');
    seen.add(path);
    const zero='0'.repeat(40);
    if((oldMode==='000000')!==(oldOid===zero)||(newMode==='000000')!==(newOid===zero)||
       (kind==='A')!==(oldMode==='000000')||(kind==='D')!==(newMode==='000000'))
      throw new Error('inconsistent diff mode/object');
    result.push({status,path,...(pair?{oldPath:first}:{}),oldMode,newMode,oldOid,newOid});
  }
  return result;
}
function diff(base,head){
  return parseRaw(git(['-c','diff.renames=true','diff','--raw','-z','--no-abbrev','--no-ext-diff','--no-textconv','--no-relative','--ignore-submodules=none','--find-renames','--find-copies','--find-copies-harder','-l0',base,head,'--']).stdout);
}
function safePath(p){
  return p===p.normalize('NFC')&&!/[\p{Cc}\p{Cf}\\]/u.test(p)&&p.split('/').every(s=>s&&s!=='.'&&s!=='..'&&!s.startsWith('.')&&s.trim()===s&&!s.endsWith('.'));
}
function pathLevel(p){
  if(marker(p))return 'QUICK';
  if(!safePath(p))return 'FULL';
  if(CSS.has(p))return 'UI';
  if(REPORTS.has(p))return 'DOC_ONLY';
  const a=p.split('/');
  if(a.length!==2)return 'FULL';
  const [folder,name]=a;
  // Disallow URL/path-confusing characters and misleading executable suffixes.
  if(!/^[\p{L}\p{M}\p{N} _.,'’()+&!–-]+$/u.test(name)||/\.(?:html?|js|mjs|cjs|svg|exe|php|sh)\./i.test(name))return 'FULL';
  if(folder==='Docs'&&/\.(?:jpe?g|png|gif|webp)$/i.test(name))return 'QUICK';
  // The builder discovers root folders with PBNs. Only the observed QPJB
  // naming convention is eligible for fast validation, including future sessions.
  if(SESSION.test(folder)&&/\.pbn$/i.test(name))return 'QUICK';
  return 'FULL';
}
function rank(a,b){return LEVELS[Math.max(LEVELS.indexOf(a),LEVELS.indexOf(b))];}
function reportRefs(ref,report){
  const stem=report.split('/').pop().slice(0,-3);
  const r=git(['grep','--full-name','-I','-i','-F','-l','-z','-e',stem,ref,'--','.',...([report,...SELF].map(p=>':(exclude)'+p))],[0,1]);
  return nul(r.stdout);
}
// Only non-executable home presentation can use UI. The rest of the
// HTML (including every script, attribute and navigation target) is immutable.
function homePresentation(text){
  let styles=0,titles=0;
  const normalized=text.replace(/<style>([\s\S]*?)<\/style>/g,(all,body)=>{
    if(/[<\u0000]/.test(body))throw Error('unsafe inline style');
    styles++;return '<style>__QPJB_STYLE__</style>';
  }).replace(/<title>([^<>&\r\n]+)<\/title>/g,()=>{titles++;return '<title>__QPJB_TITLE__</title>';});
  if(styles!==2||titles!==1)throw Error('unexpected home structure');
  return normalized;
}
function isHomePresentation(before,after){
  try{return before!==after&&homePresentation(before)===homePresentation(after);}catch{return false;}
}
function isSessionConfig(text){
  try{
    const c=JSON.parse(text),map=x=>x&&typeof x==='object'&&!Array.isArray(x);
    const plain=s=>typeof s==='string'&&s.length<=500&&!/[<>\p{Cc}\p{Cf}]/u.test(s);
    return map(c)&&Object.keys(c).sort().join(',')==='descriptions,links'&&map(c.descriptions)&&map(c.links)&&
      Object.entries(c.descriptions).every(([k,v])=>SESSION.test(k)&&plain(v))&&
      Object.entries(c.links).every(([k,v])=>{const i=k.lastIndexOf('/');return i>0&&SESSION.test(k.slice(0,i))&&/^B[0-9]+$/.test(k.slice(i+1))&&typeof v==='string'&&/^https:\/\/bridge-training\.com\/player\/index\.php\?dds=[A-Za-z0-9]+$/.test(v);});
  }catch{return false;}
}
function changeLevel(c,from,to){
  if(!['000000','100644'].includes(c.oldMode)||!['000000','100644'].includes(c.newMode)||c.status==='T')
    return ['FULL','non-ordinary file or mode'];
  if(c.status==='M'&&!c.oldPath&&c.path==='index.html'){
    const before=decode(git(['cat-file','blob',c.oldOid]).stdout),after=decode(git(['cat-file','blob',c.newOid]).stdout);
    return isHomePresentation(before,after)?['UI','home title/inline styles only']:['FULL','home structure or code changed'];
  }
  if(c.status==='M'&&!c.oldPath&&c.path==='config.json'){
    const before=decode(git(['cat-file','blob',c.oldOid]).stdout),after=decode(git(['cat-file','blob',c.newOid]).stdout);
    return isSessionConfig(before)&&isSessionConfig(after)?['QUICK','session descriptions/Bridge Training links']:['FULL','unrecognized config schema or values'];
  }
  // M2 accepts shared CSS modifications only, never additions/removals.
  // A copy out of an unchanged CSS is also deliberately classified FULL.
  if([c.path,c.oldPath].some(p=>CSS.has(p))&&c.status!=='M')
    return ['FULL','required shared CSS addition/removal/rename/copy'];
  // M2 proved the marker only for an empty regular blob in a session folder.
  const source=c.oldPath||c.path;
  if((marker(source)&&c.oldMode!=='000000'&&c.oldOid!==EMPTY_BLOB)||
     (marker(c.path)&&c.newMode!=='000000'&&c.newOid!==EMPTY_BLOB))
    return ['FULL','nonempty session marker'];
  let level=pathLevel(c.path);
  if(c.oldPath)level=rank(level,pathLevel(c.oldPath));
  // DOC_ONLY requires an existing, exact historical report; never a new,
  // renamed, copied or deleted report. Any tracked reference is conservative FULL.
  if(level==='DOC_ONLY'){
    if(c.status!=='M')return ['FULL','historical report moved, copied, added or deleted'];
    const refs=[...reportRefs(from,c.path),...reportRefs(to,c.path)];
    if(refs.length)return ['FULL','historical report referenced: '+refs.slice(0,4).join(', ')];
  }
  // If a report is moved/copied across classes, never use a fast path.
  if(level!=='DOC_ONLY'&&[c.path,c.oldPath].some(p=>REPORTS.has(p)))
    return ['FULL','historical report moved/copied'];
  return [level,level==='FULL'?'unrecognised or sensitive path':'allowed '+level+' path'];
}
function collisions(ref,paths){
  const seen=new Map(),dupes=new Set();
  const fold=p=>p.normalize('NFC').toLowerCase();
  const prefixes=p=>{const a=p.split('/');return a.map((_,i)=>a.slice(0,i+1).join('/'));};
  for(const p of nul(git(['ls-tree','-r','-z','--name-only',ref]).stdout)){
    for(const prefix of prefixes(p)){
      const k=fold(prefix);
      if(seen.has(k)&&seen.get(k)!==prefix)dupes.add(k);
      seen.set(k,prefix);
    }
  }
  return paths.some(p=>prefixes(p).some(k=>dupes.has(fold(k))));
}
function classify(base,head){
  if(!SHA.test(base||'')||!SHA.test(head||''))throw new Error('expected two complete lowercase SHA-1 commit IDs');
  cwd=decode(git(['rev-parse','--show-toplevel']).stdout).replace(/\r?\n$/,'');
  for(const ref of [base,head]){
    if(decode(git(['cat-file','-t',ref]).stdout).trim()!=='commit')throw new Error('not a commit: '+ref);
  }
  const changes=diff(base,head),reasons=[];
  let level='DOC_ONLY';
  function raise(l,reason){level=rank(level,l);reasons.push(reason);}
  const ancestor=git(['merge-base','--is-ancestor',base,head],[0,1]).status===0;
  if(!ancestor)raise('FULL','base is not an ancestor of head');
  if(decode(git(['rev-parse','--is-shallow-repository']).stdout).trim()!=='false')
    raise('FULL','shallow or uncertain history');
  function inspect(list,from,to,prefix){
    for(const c of list){
      const [l,why]=changeLevel(c,from,to);
      raise(l,prefix+c.status+' '+(c.oldPath?c.oldPath+' -> ':'')+c.path+': '+why);
    }
    if(level!=='FULL'&&list.length){
      const paths=list.flatMap(c=>[c.path,...(c.oldPath?[c.oldPath]:[])]);
      if(collisions(from,paths)||collisions(to,paths))raise('FULL',prefix+'case/Unicode path collision');
    }
  }
  inspect(changes,base,head,'');
  if(!changes.length)raise('FULL','empty net diff; no publication shortcut');
  // M2 consumes the entire raw net diff, not a filtered path list. A mixed
  // report+public plan cannot pass its documented scope guard. Escalate
  // rather than change the base or hide any paths from the verifier.
  if(changes.some(c=>REPORTS.has(c.path)||REPORTS.has(c.oldPath))&&
     changes.some(c=>!REPORTS.has(c.path)))
    raise('FULL','mixed historical report and public/other paths: M2 cannot validate the whole net diff');
  // Inspect each new commit against its first parent as well as the net diff.
  // This preserves the highest level even if sensitive changes were reverted.
  // Net changes remain the exact base/head diff for M2.
  if(ancestor&&level!=='FULL'){
    const rows=decode(git(['rev-list','--parents',base+'..'+head]).stdout).trim().split('\n').filter(Boolean);
    if(rows.length>256)raise('FULL','history exceeds conservative inspection budget');
    else for(const row of rows){
      const [commit,parent,...others]=row.split(' ');
      if(!SHA.test(commit)||!SHA.test(parent||'')||others.some(p=>!SHA.test(p)))
        throw new Error('missing or malformed commit parent');
      if(commit===head&&parent===base&&rows.length===1)continue;
      const list=diff(parent,commit);
      inspect(list,parent,commit,'history '+commit.slice(0,12)+' ');
      if(level==='FULL')break;
    }
  }
  return {schema:SCHEMA,baseSha:base,headSha:head,level,publish:level!=='DOC_ONLY',
    changes:changes.map(({oldMode,newMode,oldOid,newOid,...c})=>c),reasons:[...new Set(reasons)]};
}
function main(argv){
  if(argv.length!==4||argv[0]!=='--base'||argv[2]!=='--head')throw new Error('usage: node scripts/ci-classify.cjs --base SHA --head SHA');
  process.stdout.write(JSON.stringify(classify(argv[1],argv[3]))+'\n');
}
if(require.main===module){
  try{main(process.argv.slice(2));}catch(e){console.error('CI_CLASSIFY_ERROR: '+e.message);process.exitCode=1;}
}
module.exports={classify,parseRaw,pathLevel,isHomePresentation,isSessionConfig};
