#!/usr/bin/env node
'use strict';
const {spawnSync}=require('node:child_process');
const {TextDecoder}=require('node:util');
const SCHEMA='QPJB_CI_PLAN_V1';
const LEVELS=['DOC_ONLY','QUICK','UI','FULL'];
const SHA=/^[0-9a-f]{40}$/;
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
    result.push({status,path,...(pair?{oldPath:first}:{}),oldMode,newMode});
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
  if(!safePath(p))return 'FULL';
  if(p==='qpjb-bridge-ui.css'||p==='qpjb-design-tokens.css')return 'UI';
  if(REPORTS.has(p))return 'DOC_ONLY';
  const a=p.split('/');
  if(a.length!==2)return 'FULL';
  const [folder,name]=a;
  // Disallow URL/path-confusing characters and misleading executable suffixes.
  if(!/^[\p{L}\p{M}\p{N} _.,'’()+&!–-]+$/u.test(name)||/\.(?:html?|js|mjs|cjs|svg|exe|php|sh)\./i.test(name))return 'FULL';
  if(folder==='Docs'&&/\.(?:jpe?g|png|gif|webp)$/i.test(name))return 'QUICK';
  // The builder discovers root folders with PBNs. Only the observed QPJB
  // naming convention is eligible for fast validation, including future sessions.
  if(/^Séance [0-9]+-[0-9]{2} (?:Aix|Mumu)$/.test(folder)&&/\.pbn$/i.test(name))return 'QUICK';
  return 'FULL';
}
function rank(a,b){return LEVELS[Math.max(LEVELS.indexOf(a),LEVELS.indexOf(b))];}
function reportRefs(ref,report){
  const stem=report.split('/').pop().slice(0,-3);
  const r=git(['grep','--full-name','-I','-i','-F','-l','-z','-e',stem,ref,'--','.',...([report,...SELF].map(p=>':(exclude)'+p))],[0,1]);
  return nul(r.stdout);
}
function changeLevel(c,from,to){
  if(!['000000','100644'].includes(c.oldMode)||!['000000','100644'].includes(c.newMode)||c.status==='T')
    return ['FULL','non-ordinary file or mode'];
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
  const seen=new Set(),dupes=new Set();
  const fold=p=>p.normalize('NFC').toLowerCase();
  for(const p of nul(git(['ls-tree','-r','-z','--name-only',ref]).stdout)){
    const k=fold(p);
    if(seen.has(k))dupes.add(k);
    seen.add(k);
  }
  return paths.some(p=>dupes.has(fold(p)));
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
    changes:changes.map(({oldMode,newMode,...c})=>c),reasons:[...new Set(reasons)]};
}
function main(argv){
  if(argv.length!==4||argv[0]!=='--base'||argv[2]!=='--head')throw new Error('usage: node scripts/ci-classify.cjs --base SHA --head SHA');
  process.stdout.write(JSON.stringify(classify(argv[1],argv[3]))+'\n');
}
if(require.main===module){
  try{main(process.argv.slice(2));}catch(e){console.error('CI_CLASSIFY_ERROR: '+e.message);process.exitCode=1;}
}
module.exports={classify,parseRaw,pathLevel};
