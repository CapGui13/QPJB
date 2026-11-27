/* QPJB #423 — sélection uniquement ; aucune mutation ni ordre. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.QPJBCoherenceM4=api;
})(typeof window==='undefined'?null:window,function(){
  'use strict';
  const schema='QPJB_COHERENCE_M4_V1';
  const CORE=new Set(['ouv.passe','ouv.mineure','ouv.majeure','ouv.sa1','mineur.base','majeur.base','majeur.soutien','sa1.seuil','red.base']);
  const natural=new Set(['ouv.majeure','mineur.base','mineur.soutien','majeur.base','majeur.soutien','red.base','red.bicolore','second.base','intervenir.base','apres_inter.base','reponse_inter.base','reveil.base','apres_fit.base','barrage.ouverture','barrage.reponse']);
  const norm=x=>String(x??'').replace(/[\uFE0E\uFE0F]/g,'').trim().replace(/\s+/g,' ');
  const family=q=>String(q?.caseFamily||q?.id||'');
  function features(q,m){
    if(!q||!m?.concept||!Array.isArray(q.auction)||!Array.isArray(q.shape)||q.shape.length!==4||!q.shape.every(Number.isInteger)||!Number.isInteger(q.h))return null;
    const c=m.concept,a=norm(q.answer),shape=q.shape;
    if(!a)return null;
    const sequence=q.auction.map(norm).concat(a).join('|');
    const variants=[{seq:sequence,shape:shape.slice()}];
    // Miroirs structurels seulement. Jamais normaliser une enchère codée.
    if(natural.has(c))for(let mask=1;mask<4;mask++){
      const sh=shape.slice();
      if(mask&1)[sh[0],sh[1]]=[sh[1],sh[0]];
      if(mask&2)[sh[2],sh[3]]=[sh[3],sh[2]];
      variants.push({seq:sequence.replace(/[♥♠♣♦]/g,k=>({'♥':mask&1?'♠':'♥','♠':mask&1?'♥':'♠','♣':mask&2?'♦':'♣','♦':mask&2?'♣':'♦'})[k]),shape:sh});
    }
    variants.sort((x,y)=>x.seq<y.seq?-1:x.seq>y.seq?1:x.shape.join(',').localeCompare(y.shape.join(',')));
    let decision=c+'|'+variants[0].seq,distribution=variants[0].shape.join('-'),force=String(q.h);
    if(c==='ouv.passe'){
      // Ne pas confondre main franchement faible et frontière 11 H.
      force=q.h<=5?'0–5':q.h<=8?'6–8':q.h<=10?'9–10':'11+';
      distribution=shape.slice().sort((x,y)=>y-x).join('-');
    }else if(c==='ouv.mineure'){
      // L'égalité 3–3 / 4–4 et le choix de la plus longue sont des contrastes, pas des miroirs.
      decision=c+'|'+a+'|'+(shape[2]===shape[3]?'egalite-'+shape[2]:'longueur');
    }else if(c==='ouv.sa1'||c==='ouv.sa2'||c==='sa1.seuil'||c==='sa2.seuil'){
      distribution=shape.slice().sort((x,y)=>y-x).join('-');
    }
    return {decision,force,distribution,near:decision+'|'+force+'|'+distribution,criterion:decision+'|'+force};
  }
  const clean=a=>a?.result==='correct'&&!a.assisted&&!a.hadFreeError;
  function rank(ctx={}){
    if(!ctx||!Number.isInteger(ctx.session)||ctx.session<1||!Array.isArray(ctx.candidates)||!ctx.metadataById||ctx.history?.active)return [];
    const {session,metadataById:meta,category}=ctx;
    if(ctx.forcedReason==='rappel_erreur_aide')return [];
    const selected=(ctx.selected||[]).map(x=>x?.exercise||x).filter(Boolean);
    const chosen=selected.map(q=>({q,f:features(q,meta[q.id])})).filter(x=>x.f);
    const lookup=new Map((ctx.exercises||[]).map(q=>[q.id,q]));
    for(const q of ctx.candidates)if(q?.id)lookup.set(q.id,q);
    const recent=[],last=new Map();
    for(const e of ctx.history?.journal||[]){
      if(e.mode!=='parcours'||!Number.isInteger(e.session)||e.session>=session)continue;
      for(const a of e.answers||[]){
        const q=lookup.get(a.id),m=q&&meta[q.id];if(!m)continue;
        last.set(m.concept,Math.max(last.get(m.concept)||0,e.session));
        if(session-e.session<=2&&clean(a)){
          const f=features(q,m);if(f)recent.push({q,f,age:session-e.session});
        }
      }
    }
    // Une entrée ancienne atteste au plus une exposition datée, pas une réussite.
    for(const [id,r] of Object.entries(ctx.history?.entries||{})){
      const m=meta[id],s=r?.assessment?.lastSession;
      if(m&&Number.isInteger(s)&&s>=0&&s+1<session)last.set(m.concept,Math.max(last.get(m.concept)||0,s+1));
    }
    const ids=new Set(),out=[];
    for(const q of ctx.candidates){
      if(!q?.id||ids.has(q.id))continue;ids.add(q.id);
      const m=meta[q.id],f=features(q,m);if(!f)continue;
      let delta=0;const why=[];
      const same=chosen.filter(x=>x.f.decision===f.decision);
      if(same.some(x=>x.f.near===f.near)){delta-=32;why.push('même décision, force et distribution proches dans la séance')}
      else if(same.some(x=>x.f.criterion===f.criterion)){delta-=18;why.push('même décision et zone de force dans la séance')}
      else if(same.length){delta-=5;why.push('même décision mais contraste de force')}
      if(same.length&&same.every(x=>x.f.force!==f.force)){delta+=8;why.push('variation de force pour le même critère')}
      if(category!=='weakness'){
        const r=recent.filter(x=>x.f.near===f.near&&family(x.q)!==family(q));
        if(r.length){delta-=r.some(x=>x.age===1)?12:6;why.push('variante proche réussie sans aide récemment')}
      }
      // Le rappel fondamental ne concerne que la maintenance, jamais une découverte.
      // Bonus interconcept uniquement sur un plan explicite et sans rappel du même concept déjà choisi.
      const objective=ctx.objective;
      const allowed=Array.isArray(objective?.concepts)?objective.concepts:[];
      const gap=last.has(m.concept)?session-last.get(m.concept):0;
      if(category==='maintenance'&&CORE.has(m.concept)&&allowed.includes(m.concept)&&gap>=7&&!chosen.some(x=>meta[x.q.id]?.concept===m.concept)){
        delta+=Math.min(12,gap-5);why.push('rappel fondamental ancien autorisé par le plan');
      }
      // Aucun changement de preuve, de famille, de difficulté ou d'éligibilité.
      out.push({id:q.id,delta:Math.max(-44,Math.min(12,delta)),reason:why.join(' ; ')||'aucun signal de proximité ou dette autorisée'});
    }
    return out;
  }
  return Object.freeze({schema,features,rank});
});
