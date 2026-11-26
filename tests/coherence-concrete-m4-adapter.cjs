'use strict';
// Injection test exclusivement : le moteur historique garde tous ses filtres,
// ses quotas, son rappel explicite, son classement durable et logicalOrder().
const m4=require('../quizz-coherence-m4-diversite.js');
const contrast=require('../quizz-coherence-m4-contrast.js');
const anchor='const q=durableSelection&&!explicitRecall&&!priority&&!forcedReason';
const end='const m=mOf(q),cat=category||classify(q);';
function instrument(source,policy='A'){
  if(source.split(anchor).length!==2||source.split(end).length!==2)throw Error('Ancre choose() modifiée : revue obligatoire');
  return source.replace(anchor,anchor.replace('const q','let q')).replace(end,`
      if(!explicitRecall && (!priority || s<${policy==='B'?5:2}) && (!forcedReason || forcedReason==='equilibre_ouvertures')){
        const chosen=q;
        const winning=ranked.find(r=>r.q===chosen);
        const tieType=v=>JSON.stringify([v.theme,mOf(v).concept,mOf(v).stage,v.difficulty,
          ${policy==='B'?'(priority||s<2)?context(v):null,(priority||s<2)?bid(v):null':'context(v),bid(v)'},classify(v),fresh(v),novelFamily(v),oldFamily(v),!!due(v),!!bad(v),
          s===1&&v.theme==='ouv'&&mOf(v).concept==='ouv.mineure'?(v.shape[2]===v.shape[3]?v.shape[2]:0):null]);
        const same=ranked.filter(r=>tieType(r.q)===tieType(chosen)&&Math.abs(r.v-winning.v)<=${policy==='B'?36:24});
        q=__m4Pick({session:s+1,history:state,exercises,metadataById:prerequis.byId,
          candidates:same.map(r=>r.q),selected,category,objective:null,forcedReason,priority},same,chosen);
      }
      ${end}`);
}
function pick(ctx,rows,baseline,maxSession=180,onChange=()=>{},policy='A'){
  if(ctx.session>maxSession||rows.length<2)return baseline;
  const ranked=(policy==='B'?contrast:m4).rank(ctx),d=new Map(ranked.map(r=>[r.id,r]));
  const b=rows.find(r=>r.q===baseline),base=b.v+(d.get(baseline.id)?.delta||0);
  let winner=b,score=base;
  for(const row of rows){
    const value=row.v+(d.get(row.q.id)?.delta||0);
    if(value>score){winner=row;score=value;}
  }
  if(winner!==b)onChange({session:ctx.session,before:baseline.id,after:winner.q.id,baseScore:b.v,newScore:winner.v,beforeSignal:d.get(baseline.id),afterSignal:d.get(winner.q.id),category:ctx.category,priority:ctx.priority});
  return winner.q;
}
module.exports={instrument,pick};
