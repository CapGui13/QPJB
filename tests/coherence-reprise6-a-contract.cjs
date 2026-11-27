'use strict';
const A=require('../quizz-coherence-reprise6-a-composition.js');
function check(x,m){if(!x)throw Error(m)}
const q=(id,theme,answer,shape,auction,difficulty=1)=>({id,theme,answer,shape,auction,difficulty});
const first=q('first','ouv','2SA',[3,3,4,3],[]),next=q('next','ouv','2SA',[4,3,3,3],[]),support=q('support','majeur','2♥',[2,3,4,4],['Partenaire : 1♥']),pass=q('pass','majeur','Passe',[3,3,4,3],['Partenaire : 1♥']),falseFit=q('falseFit','majeur','2♥',[3,4,3,3],['Partenaire : 1♥']),other=q('other','mineur','1♦',[3,2,4,4],['Partenaire : 1♣']),hard=q('hard','ouv','2SA',[3,3,4,3],[],4);
const metadataById=Object.fromEntries([[first,'ouv.sa2'],[next,'ouv.sa2'],[support,'majeur.soutien'],[pass,'majeur.soutien'],[falseFit,'majeur.soutien'],[other,'mineur.base'],[hard,'ouv.sa2']].map(([q,concept])=>[q.id,{concept,stage:0}]));
const ctx={session:3,category:'discovery',history:{active:null,entries:{}},selected:[{exercise:first}],metadataById,candidates:[next,support,pass,falseFit,other,hard],priority:false,forcedReason:null};
const a=A.make('saturation'),snap=JSON.stringify(ctx),r=a.rank(ctx);
check(JSON.stringify(ctx)===snap,'mutation');check(JSON.stringify(r)===JSON.stringify(a.rank(ctx)),'determinism');
check(r.find(x=>x.id==='next')?.delta===-45,'marginal cost');
check(r.find(x=>x.id==='support')?.delta===35,'actual support');
check(!r.some(x=>x.id==='pass'||x.id==='falseFit'||x.id==='hard'),'do not reward pass before support / four-card fit / advanced case');
check(a.rank({...ctx,selected:[{exercise:first},{exercise:support}]}).some(x=>x.id==='pass'&&x.delta===35),'contrast after support');
check(a.rank({...ctx,selected:[{exercise:first},{exercise:next},{exercise:support},{exercise:pass}]}).find(x=>x.id==='next')?.delta===-90,'cost persists without hard quota');
for(const c of [{session:1},{session:2},{session:4},{session:65},{session:180},{category:'weakness'},{category:'maintenance'},{category:'transfer'},{priority:true},{forcedReason:'rappel_erreur_aide'},{history:{active:{ids:[]}}},{selected:[]},{candidates:[next,hard]},{history:{active:null,entries:{next:{}}}}]){
 const out=a.rank({...ctx,...c});if(c.history?.entries)check(!out.some(x=>x.id==='next'),'never penalize known ID');else check(!out.length,'must remain neutral '+JSON.stringify(c));
}
check(r.every(x=>ctx.candidates.some(q=>q.id===x.id)&&Math.abs(x.delta)<=100),'native bounds');
check(a.prefer(ctx)===ctx.candidates,'no filtering');check(a.compose(ctx,[])===null,'no forced swap');
console.log('PASS reprise6-a contract: native candidates, determinism, S3 semantic fit and protections');
