/* QPJB — M2 progression intermédiaire, bonus souples entre candidats éligibles. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.QPJBPedagogieIntermediaire=api;
})(typeof window==='undefined'?null:window,function(){
  'use strict';
  const foundations=new Set(['ouv.sa1','ouv.sa2','ouv.majeure','ouv.mineure','ouv.passe','mineur.base','mineur.soutien','majeur.base','majeur.soutien','sa1.seuil','sa2.seuil','red.base','red.bicolore','second.base','apres_fit.base','sa1.stayman','sa1.texas','sa1.stayman.reponse','intervenir.base','contre.base','reponse_inter.base','apres_inter.base','barrage.ouverture','reveil.base']);
  // Liens pédagogiques souples, jamais de nouveau prérequis. Les notions
  // explicitement déclarées dans requires restent la source de vérité.
  const bridges={
    'roudi.init':['red.base','second.base'],'roudi.choix':['red.base','second.base'],
    'drury.init':['ouv.position','majeur.soutien'],'drury.choix':['ouv.position','majeur.soutien'],
    'forcing.troisieme':['red.bicolore','second.base'],'forcing.quatrieme':['red.bicolore','second.base'],
    'multilandy.choix':['intervenir.base'],'multilandy.intervention':['intervenir.base','contre.base'],
    'rubensohl.init':['apres_inter.base','sa1.texas'],'rubensohl.naturel':['apres_inter.base','sa1.seuil'],
    'michaels.choix':['intervenir.base','red.bicolore'],'michaels.intervention':['intervenir.base','red.bicolore'],
    'chelem.quantitatif':['sa1.seuil','sa2.seuil'],'chelem.controles':['majeur.soutien','apres_fit.base'],
    'chelem.cles':['majeur.soutien','apres_fit.base']
  };
  function rank({session,candidates=[],metadataById={},history={},selected=[],category=null}={}){
    if(!Number.isInteger(session)||session<21||session>65)return [];
    const lookup=id=>metadataById instanceof Map?metadataById.get(id):metadataById[id];
    const stats=new Map();
    const get=key=>{if(!stats.has(key))stats.set(key,{last:0,ids:new Set(),cleanFamilies:new Set(),cleanSessions:new Set()});return stats.get(key)};
    for(const ev of history.journal||[]){
      if(ev.mode!=='parcours'||!Number.isInteger(ev.session)||ev.session>=session)continue;
      for(const a of ev.answers||[]){
        const m=lookup(a.id);if(!m)continue;
        const s=get(m.concept);s.last=Math.max(s.last,ev.session);s.ids.add(a.id);
        if(a.result==='correct'&&!a.assisted&&!a.hadFreeError&&a.difficulty<=3&&a.family){
          s.cleanFamilies.add(a.family);s.cleanSessions.add(ev.session);
        }
      }
    }
    // Une sauvegarde antérieure au journal prouve au plus une exposition.
    for(const [id,entry] of Object.entries(history.entries||{})){
      const m=lookup(id),a=entry.assessment;
      if(!m||!a||!Number.isInteger(a.lastSession)||a.lastSession<0||a.lastSession+1>=session)continue;
      const s=get(m.concept);s.ids.add(id);s.last=Math.max(s.last,a.lastSession+1);
    }
    const selectedConcepts=new Set(selected.map(q=>lookup((q.exercise||q).id)?.concept).filter(Boolean));
    const need=key=>{
      const s=stats.get(key);return !s||!s.cleanFamilies.size||!s.cleanSessions.size;
    };
    return candidates.flatMap(q=>{
      const m=lookup(q.id);if(!m||typeof m.concept!=='string')return [];
      const key=m.concept,s=stats.get(key),gap=s?session-s.last:0,parts=[];let delta=0;
      // Ne pas substituer une variante facile à une erreur exigible.
      const entry=history.entries?.[q.id];
      if(category==='weakness'&&entry&&entry.due<=session-1&&
        (entry.result!=='correct'||entry.assisted))return [];
      if(s&&foundations.has(key)&&q.difficulty<=3&&!selectedConcepts.has(key)&&gap>=6){
        delta+=Math.min(85,25+(gap-6)*9);parts.push('fondamental_eloigne');
      }
      if(s&&s.ids.size<=2&&gap>=3&&gap<=12&&q.difficulty<=3&&m.stage<=1&&
        !selectedConcepts.has(key)&&category!=='weakness'){
        delta+=30;parts.push('consolidation_premiere_decouverte');
      }
      if(!s&&m.stage<=1&&q.difficulty<=3&&!selectedConcepts.has(key)){
        // Favoriser le cas d'initiation, plutôt que sa poursuite.
        delta+=18;parts.push('introduction_simple');
      }
      if(!s&&m.stage>=2){
        const deps=[...new Set((m.requires||[]).map(r=>r.concept).concat(bridges[key]||[]))].filter(k=>k!==key);
        if(deps.some(need)){delta-=35;parts.push('poursuite_avant_preuve_autonome');}
      }
      if(!s&&m.stage<=1&&bridges[key]?.some(need)){
        // Incitation modeste : la convention reste accessible aux élèves faibles.
        delta-=15;parts.push('liaison_naturelle_fragile');
      }
      // Réinvestir un premier succès sans aide sur une autre famille,
      // à distance, avant d'accumuler des notions à peine découvertes.
      if(s&&gap>=2&&q.difficulty<=3&&!selectedConcepts.has(key)&&
        s.cleanFamilies.size===1&&!s.cleanFamilies.has(q.caseFamily||q.id)){
        delta+=70;parts.push('seconde_preuve_sur_autre_main');
      }
      if(selectedConcepts.has(key)&&category==='discovery'){
        delta-=25;parts.push('autre_notion_disponible');
      }
      return delta?[{id:q.id,delta:Math.max(-100,Math.min(100,delta)),reason:parts.join('+')}]:[];
    });
  }
  return Object.freeze({schema:'QPJB_PEDAGOGIE_V1',phase:'intermediaire',rank});
});
