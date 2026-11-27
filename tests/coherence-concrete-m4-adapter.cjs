'use strict';
// Injection test exclusivement : le moteur historique garde tous ses filtres,
// ses quotas, son rappel explicite, son classement durable et logicalOrder().
const m4=require('../quizz-coherence-m4-diversite.js');
const contrast=require('../quizz-coherence-m4-contrast.js');
const reactivation=require('../quizz-coherence-m4-reactivation.js');
const cautious=require('../quizz-coherence-m4-cautious.js');
const atomic=require('./coherence-concrete-m4-atomic-adapter.cjs');
const recall=require('../quizz-coherence-m4-recall.js');
const recallAdapter=require('./coherence-concrete-m4-recall-adapter.cjs');
const reserve=require('./coherence-concrete-m4-reserve-adapter.cjs');
const earlyContrast=require('../quizz-coherence-m4-early-contrast.js');
const earlyAdapter=require('./coherence-concrete-m4-early-adapter.cjs');
const protectedRecall=require('./coherence-concrete-m4-protected-recall.cjs');
const anchor='const q=durableSelection&&!explicitRecall&&!priority&&!forcedReason';
const end='const m=mOf(q),cat=category||classify(q);';
function instrument(source,policy='A'){
  if(policy==='K')return protectedRecall.instrument(instrument(source,'D'));
  if(policy==='E')return atomic.instrument(source);
  if(policy==='J')return earlyAdapter.instrument(source);
  if(policy==='H'||policy==='I')return reserve.instrument(instrument(source,'D'),policy);
  if(policy==='F'||policy==='G')return recallAdapter.instrument(instrument(source,'D').replace(/const m=mOf\(q\),cat=category\|\|classify\(q\);/,'const m=mOf(q),cat=category||classify(q);'),policy);
  if(source.split(anchor).length!==2||source.split(end).length!==2)throw Error('Ancre choose() modifiée : revue obligatoire');
  return source.replace(anchor,anchor.replace('const q','let q')).replace(end,`
      if(${policy==='D'?'s>=2 && s<5 && !priority && !forcedReason && category===\'discovery\' && fresh(q) && novelFamily(q) && !due(q) && !bad(q) && ':' '}!explicitRecall && (!priority || s<${policy==='A'?2:5}) && (!forcedReason || forcedReason==='equilibre_ouvertures')){
        const chosen=q;
        const winning=ranked.find(r=>r.q===chosen);
        const tieType=v=>JSON.stringify([v.theme,mOf(v).concept,mOf(v).stage,v.difficulty,
          ${(policy==='A'||policy==='D')?'context(v),bid(v)':'(priority||s<2)?context(v):null,(priority||s<2)?bid(v):null'},classify(v),fresh(v),novelFamily(v),oldFamily(v),!!due(v),!!bad(v),
          s===1&&v.theme==='ouv'&&mOf(v).concept==='ouv.mineure'?(v.shape[2]===v.shape[3]?v.shape[2]:0):null]);
        const same=ranked.filter(r=>${policy==='D'?'fresh(r.q)&&novelFamily(r.q)&&!due(r.q)&&!bad(r.q)&&':''}tieType(r.q)===tieType(chosen)&&Math.abs(r.v-winning.v)<=${policy==='A'?24:policy==='B'?36:0});
        ${policy==='C'?`// Fixture du contrat M1 : rappel secondaire uniquement dans le slot maintenance natif.
        const core=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
        const debtOptions=(!priority&&category==='maintenance'&&s>=5)?ranked.filter(({q:v,v:score})=>
          v.theme===chosen.theme&&mOf(v).concept!==mOf(chosen).concept&&mOf(v).stage===mOf(chosen).stage&&v.difficulty===chosen.difficulty&&
          classify(v)===classify(chosen)&&fresh(v)===fresh(chosen)&&novelFamily(v)===novelFamily(chosen)&&oldFamily(v)===oldFamily(chosen)&&
          !!due(v)===!!due(chosen)&&!!bad(v)===!!bad(chosen)&&core.has(mOf(v).concept)&&e.seen.has(mOf(v).concept)&&oldConcept(v)>=7&&
          oldConcept(v)>=(core.has(mOf(chosen).concept)?oldConcept(chosen)+3:7)&&score>=winning.v-12&&!concepts[mOf(v).concept]):[];
        for(const row of debtOptions)if(!same.includes(row))same.push(row);
        const objective={concepts:debtOptions.map(r=>mOf(r.q).concept),fixture:'slot maintenance natif'};`:'const objective=null;'}
        q=__m4Pick({session:s+1,history:state,exercises,metadataById:prerequis.byId,
          candidates:same.map(r=>r.q),selected,category,objective,forcedReason,priority},same,chosen);
      }
      ${end}`);
}
function pick(ctx,rows,baseline,maxSession=180,onChange=()=>{},policy='A'){
  if(ctx.session>maxSession||rows.length<2)return baseline;
  const ranked=(policy==='J'?earlyContrast:(policy==='F'||policy==='G')&&ctx.category==='maintenance'?recall:(policy==='D'||policy==='E'||policy==='F'||policy==='G'||policy==='H'||policy==='I'||policy==='K')?cautious:policy==='C'?reactivation:policy==='B'?contrast:m4).rank({...ctx,baselineId:baseline.id}),d=new Map(ranked.map(r=>[r.id,r]));
  const b=rows.find(r=>r.q===baseline),base=b.v+(d.get(baseline.id)?.delta||0);
  let winner=b,score=base;
  for(const row of rows){
    const value=row.v+(d.get(row.q.id)?.delta||0);
    if(value>score){winner=row;score=value;}
  }
  if(winner!==b&&!ctx.preview)onChange({session:ctx.session,before:baseline.id,after:winner.q.id,baseScore:b.v,newScore:winner.v,rawScore:winner.rawScore??winner.v,noveltyAdjustment:winner.noveltyAdjustment||0,beforeSignal:d.get(baseline.id),afterSignal:d.get(winner.q.id),category:ctx.category,priority:ctx.priority});
  return winner.q;
}
module.exports={instrument,pick};
