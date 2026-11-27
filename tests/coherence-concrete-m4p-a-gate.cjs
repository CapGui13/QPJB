'use strict';
// Gate inchangée sur tous les horizons et profils : pas de moyenne qui masque une régression.
const fs=require('node:fs'),path=require('node:path');
const folder=process.argv[2];if(!folder)throw Error('dossier des traces');
const {PROFILES,SEEDS,HORIZONS}=require('./coherence-concrete-m4-campaign.cjs');
const violations=[],totals={};let changes=0,improved=false,earlyChanges=0,laterChanges=0;
for(const profile of PROFILES)for(const seed of SEEDS){
 const p=JSON.parse(fs.readFileSync(path.join(folder,profile+'-'+seed+'.json'),'utf8'));
 if(p.profile!==profile||p.seed!==seed||p.after.policy!==(process.env.POLICY||'T')||p.before.checkpoints.length!==5||p.after.checkpoints.length!==5)throw Error('trace invalide '+profile+'/'+seed);
 changes+=p.after.changes.length;
 earlyChanges+=p.after.changes.filter(x=>x.session<=5).length;
 laterChanges+=p.after.changes.filter(x=>x.session>=6&&x.session<=20).length;
 for(const c of p.after.changes)if(c.session<3||c.session>20)violations.push({profile,seed,metric:'périmètre',session:c.session});
 for(let i=0;i<HORIZONS.length;i++){
  const a=p.before.checkpoints[i],b=p.after.checkpoints[i],h=HORIZONS[i];
  if(a.session!==h||b.session!==h)throw Error('horizon');
  const metrics={nearPairs:1,decisionPairs:1,nearRecent:1,coreDebt:1,themeDebt:1,hard:1,proof:-1,concepts:-1,families:-1,independent:-1};
  const t=totals[h]||={};
  for(const [k,sign] of Object.entries(metrics)){
   if(!Number.isFinite(a[k])||!Number.isFinite(b[k]))throw Error('métrique absente '+k);
   const pair=t[k]||=[0,0];pair[0]+=a[k];pair[1]+=b[k];
   if(sign*(b[k]-a[k])>0)violations.push({profile,seed,h,metric:k,before:a[k],after:b[k]});
   if(h===5&&['nearPairs','decisionPairs','nearRecent'].includes(k)&&b[k]<a[k])improved=true;
  }
  for(const k of ['violations','dupes','short','earlyViolations'])if(a[k]||b[k])violations.push({profile,seed,h,metric:k,before:a[k],after:b[k]});
 }
}
console.log(JSON.stringify({changes,earlyChanges,laterChanges,improved,totals,violations,verdict:earlyChanges>0&&laterChanges>0&&improved&&!violations.length?'CANDIDAT_A_REVOIR':'HOLD'},null,2));
process.exitCode=earlyChanges>0&&laterChanges>0&&improved&&!violations.length?0:1;
