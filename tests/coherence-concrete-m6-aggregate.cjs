'use strict';
const fs=require('node:fs'),path=require('node:path');
const T=require('../quizz-coherence-m6-traces.js');
const root=process.argv[2]||'m6-archives',expectedRevision=process.argv[3];
T.check(expectedRevision&&/^[0-9a-f]{40}$/.test(expectedRevision),'Exact tested revision required');
const files=fs.readdirSync(root,{recursive:true}).map(x=>path.join(root,String(x))).filter(p=>/\/(autonome|intermediaire|faible|cible|aide|passe)-(11|47|103)\.json$/.test(p));
T.check(files.length===18,'Expected exactly 18 native archives, got '+files.length);
const seen=new Set(),matrix=[];
let beforeCount=0,afterCount=0;
for(const file of files){
 const x=JSON.parse(fs.readFileSync(file,'utf8')),a=x.before,b=x.after,tag=a.profile+'-'+a.seed;
 T.check(T.PROFILES.includes(a.profile)&&T.SEEDS.includes(a.seed)&&!seen.has(tag),'Profile/seed pair');seen.add(tag);
 T.check(a.revision===T.BASE&&b.revision===expectedRevision&&a.horizon===180&&b.horizon===180,'Native archive provenance');
 T.check(a.sessions.length===180&&b.sessions.length===180&&x.crossResume.checked,'Complete trajectory and cross resume');
 T.check(a.catalogueKey===b.catalogueKey&&x.patches.length===0&&x.effectivePatches.length===0,'Identity control catalogue and metadata');
 const cmp=T.compare(a,b);
 for(const [i,s] of a.sessions.entries()){
  const t=b.sessions[i];
  T.check(s.session===i+1&&t.session===i+1&&s.rows.length===10&&t.rows.length===10,'Complete ordered decks');
  T.check(T.same(s.rows,t.rows)&&T.same(s.objective,t.objective)&&T.same(s.summary,t.summary),'Identity differs S'+s.session+' '+tag);
  beforeCount+=s.rows.length;afterCount+=t.rows.length;
 }
 T.check(cmp.checkpoints.length===5&&cmp.checkpoints.every(c=>!c.before.violations.length&&!c.after.violations.length),'Checkpoint invariants');
 T.check(cmp.changes.every(c=>c.sameOrder&&c.sameSet),'Identity permutation');
 for(const arm of [a,b])for(const stored of arm.checkpoints){const recomputed=T.metrics(arm.sessions.slice(0,stored.session));T.check(T.same(stored,{session:stored.session,...recomputed}),'Recomputed checkpoint mismatch');}
 matrix.push({profile:a.profile,seed:a.seed,horizon:180,checkpoints:cmp.checkpoints,changedSessions:cmp.changes.filter(c=>!c.sameOrder).length,resumes:a.resumes.length,source:file});
}
T.check(beforeCount===32400&&afterCount===32400,'Expected 32,400 real QCM per arm');
const result={base:T.BASE,revision:expectedRevision,mode:'identity-control-not-integrated-candidate',trajectories:matrix.length,beforeCount,afterCount,matrix};
fs.writeFileSync('m6-native-register.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({base:result.base,revision:expectedRevision,trajectories:matrix.length,beforeCount,afterCount,alerts:matrix.flatMap(x=>x.checkpoints.flatMap(c=>c.review.map(r=>[x.profile,x.seed,c.session,r])))}));
