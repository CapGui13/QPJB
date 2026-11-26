/* QPJB — M3 : entretien conceptuel et discrimination après S65. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.QPJBPedagogieAvancee=api;
})(typeof window==='undefined'?null:window,function(){
  'use strict';
  const schema='QPJB_PEDAGOGIE_V1',phase='avancee';
  const contrasts=[
    ['chelem.quantitatif','chelem.controles','chelem.cles'],
    ['rubensohl.naturel','rubensohl.init'],
    ['multilandy.choix','multilandy.intervention','intervenir.base'],
    ['michaels.choix','michaels.intervention','intervenir.base'],
    ['competitif.spoutnik','contre.base','apres_inter.base'],
    ['reveil.base','intervenir.base'],
    ['apres_fit.essai','chelem.splinter','fit.2sa'],
    ['forcing.troisieme','forcing.quatrieme','red.base']
  ];
  const family=q=>String(q.caseFamily||q.family||q.id);
  const own=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
  const meta=(map,id)=>map instanceof Map?map.get(id):own(map,id)?map[id]:undefined;
  const clean=a=>a.result==='correct'&&!a.assisted&&!a.hadFreeError;
  const clamp=x=>Math.max(-100,Math.min(100,Math.round(x)));
  function evidence(ctx){
    const records=new Map();
    const get=k=>{
      if(!records.has(k))records.set(k,{last:0,families:new Map(),proofSessions:new Set()});
      return records.get(k);
    };
    const state=ctx.history||{};
    const journal=Array.isArray(state)?state:state.journal||[];
    for(const ev of journal){
      if(ev.mode!=='parcours'||!Number.isInteger(ev.session)||ev.session<1||ev.session>=ctx.session)continue;
      for(const a of ev.answers||[]){
        const m=meta(ctx.metadataById,a.id);
        if(!m||typeof m.concept!=='string')continue;
        const rec=get(m.concept),f=a.family;
        rec.last=Math.max(rec.last,ev.session);
        if(typeof f!=='string'||!f)continue;
        const prev=rec.families.get(f),ok=clean(a);
        if(!prev||ev.session>prev.session)rec.families.set(f,{session:ev.session,ok});
        else if(ev.session===prev.session)rec.families.set(f,{session:ev.session,ok:prev.ok&&ok});
        if(ok)rec.proofSessions.add(ev.session);
      }
    }
    // Une ancienne évaluation ordinaire est une exposition, jamais une
    // preuve autonome reconstruite en l'absence de journal.
    for(const [id,entry] of Object.entries(state.entries||{})){
      const a=entry.assessment,m=meta(ctx.metadataById,id);
      if(!m||!a||!Number.isInteger(a.lastSession)||a.lastSession<0||a.lastSession+1>=ctx.session)continue;
      const rec=get(m.concept);rec.last=Math.max(rec.last,a.lastSession+1);
    }
    return records;
  }
  function rank(ctx){
    if(!ctx||!Number.isInteger(ctx.session)||ctx.session<66||!Array.isArray(ctx.candidates)||!ctx.candidates.length)return [];
    const records=evidence(ctx);
    const selected=new Set((ctx.selected||[]).map(item=>meta(ctx.metadataById,(item.exercise||item).id)?.concept).filter(Boolean));
    const result=[],ids=new Set();
    for(const q of ctx.candidates){
      if(!q||typeof q.id!=='string'||ids.has(q.id))continue;
      ids.add(q.id);
      const m=meta(ctx.metadataById,q.id);
      if(!m||typeof m.concept!=='string'||!Number.isInteger(m.stage))continue;
      const rec=records.get(m.concept);
      const gap=rec?.last?ctx.session-rec.last:0;
      let delta=0;const why=[];
      // Signal conceptuel, pas un changement d'intervalle de révision.
      if(gap>=9){delta+=Math.min(68,4*(gap-8));why.push('concept-peu-entretenu');}
      if(rec&&gap>=4&&rec.families.size<3){
        delta+=18;why.push('exposition-conceptuelle-fragile');
      }
      if(rec&&gap>=4&&!rec.families.has(family(q))){
        const autonomous=[...rec.families.values()].filter(v=>v.ok).length;
        if(autonomous<2||rec.proofSessions.size<2){
          delta+=20;why.push('transfert-autre-famille');
        }
      }
      // Une poursuite complexe reste accessible si le moteur l'autorise.
      // Préférer une application de la notion quand une dépendance n'a
      // aucune preuve autonome observée, sans faire d'une absence un veto.
      if(m.stage>=2&&Array.isArray(m.requires)&&m.requires.some(req=>{
        const r=records.get(req.concept);
        return !r||![...r.families.values()].some(v=>v.ok);
      })){
        delta-=24;why.push('prerequis-sans-preuve-autonome');
      }
      if(selected.has(m.concept)){delta-=28;why.push('concept-deja-selectionne');}
      else if(contrasts.some(g=>g.includes(m.concept)&&g.some(k=>selected.has(k)))){
        delta+=18;why.push('discrimination-contextuelle');
      }
      if(delta)result.push({id:q.id,delta:clamp(delta),reason:why.join('|')});
    }
    return result;
  }
  return Object.freeze({schema,phase,rank});
});
