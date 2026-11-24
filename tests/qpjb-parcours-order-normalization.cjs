'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto');
const edits=[
  {
    "before": "const pool=exercises.filter(x=>Object.hasOwn(INTRO,x.theme)&&s>=INTRO[x.theme]&&Number.isInteger(x.difficulty));\n    const previous=state.entries||{};",
    "after": "const pool=exercises.filter(x=>Object.hasOwn(INTRO,x.theme)&&s>=INTRO[x.theme]&&Number.isInteger(x.difficulty)&&\n      (x.theme!=='ouv'||bid(x)!=='2♣'||s>=INTRO.fortes));\n    const previous=state.entries||{};"
  },
  {
    "before": "    function pick(list,kind,reason){",
    "after": "    const isOpeningPass=x=>x.theme==='ouv'&&bid(x)==='Passe';\n    const weakPassDue=due.some(x=>isOpeningPass(x)&&s-previous[x.id].lastSession<=3&&\n      (previous[x.id].result!=='correct'||previous[x.id].assisted));\n    const passWeak=weakPassDue||((state.micros||{})['ouv:passe']?.score||0)<0;\n    function pick(list,kind,reason){"
  },
  {
    "before": "      const distinctBids=ranked.filter",
    "after": "      // Au-delà du premier cours : un Passe d'entrée en rappel ordinaire,\n      // deux en cas de fragilité, sans bloquer un catalogue réduit.\n      if(s>0){\n        const allowed=ranked.filter(x=>!isOpeningPass(x)||(bidCount['ouv|Passe']||0)<(passWeak?2:1));\n        if(allowed.length)ranked=allowed;\n        else if(pool.some(x=>!picked.has(x.id)&&!isOpeningPass(x)))return false;\n      }\n      const distinctBids=ranked.filter"
  },
  {
    "before": "    // Dès la toute première séance : cinq couleurs/contrats distincts,\n    // deux mineures de chaque type et Passe, si le catalogue les permet.\n    // Le score général remplit les dernières places sans doublon de famille.\n    if(s===0&&limit>=8){\n      for(const target of ['1♣','1♦','1♥','1♠','1SA','1♣','1♦','Passe']){\n        const candidates=fresh.filter(x=>x.theme==='ouv'&&bid(x)===target&&\n          !selected.some(chosen=>family(chosen.exercise)===family(x)));\n        if(candidates.length)pick(candidates,'nouveau','equilibre_ouvertures');\n      }\n    }",
    "after": "    // Ouvrir ou ne pas ouvrir : contraste dès la deuxième main et\n    // trois Passes simples espacés sur dix questions.\n    function openingCandidates(answer,list=fresh){\n      return list.filter(x=>x.theme==='ouv'&&bid(x)===answer&&\n        !selected.some(chosen=>family(chosen.exercise)===family(x)));\n    }\n    if(s===0&&limit>=8){\n      const targets=limit===8?['1♣','Passe','1♥','1♦','1SA','1♠','1♣','1♦']:\n        limit===9?['1♣','Passe','1♥','1♦','Passe','1SA','1♠','1♣','1♦']:\n        ['1♣','Passe','1♥','1♦','Passe','1SA','1♠','1♣','Passe','1♦'];\n      for(const target of targets){\n        const candidates=openingCandidates(target);\n        const simple=target==='Passe'?candidates.filter(x=>x.difficulty===1&&Number.isInteger(x.h)&&x.h<12):[];\n        if(candidates.length)pick(simple.length?simple:candidates,'nouveau','equilibre_ouvertures');\n      }\n    }\n    // Deuxième séance : rappeler le seuil et les deux mineures, tout en\n    // réservant les autres places aux réponses. Priorité à un Passe raté.\n    if(s===1&&limit>=10&&pool.some(x=>x.theme==='mineur')&&pool.some(x=>x.theme==='majeur')){\n      for(const target of ['1♣','1♦']){\n        const options=openingCandidates(target);\n        if(options.length)pick(options,'nouveau','equilibre_ouvertures');\n      }\n      const review=openingCandidates('Passe',due.filter(x=>previous[x.id].result!=='correct'||previous[x.id].assisted));\n      const options=openingCandidates('Passe');\n      if(!pick(review,'revision','rappel_erreur_aide')&&options.length)\n        pick(options,'nouveau','equilibre_ouvertures');\n    }"
  },
  {
    "before": "    let plannedReviews=0;",
    "after": "    let plannedReviews=selected.filter(x=>x.kind==='revision').length;"
  },
  {
    "before": "    // La même famille ne doit pas se suivre ; les candidats alternatifs\n    // ne sont disponibles qu'en cas d'épuisement du catalogue.\n    return selected.map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));",
    "after": "    // Mélange logique déterministe : casser les répétitions de réponse ou\n    // de thème si possible, sans modifier les QCM retenus ni leurs motifs.\n    // Une séance active reste inchangée (start).\n    const ordered=[],remaining=selected.slice();\n    while(remaining.length){\n      const last=ordered.at(-1)?.exercise,before=ordered.at(-2)?.exercise;\n      let index=0;\n      if(last){\n        const sameBid=x=>bid(x.exercise)===bid(last);\n        const sameBlock=x=>before&&before.theme===last.theme&&x.exercise.theme===last.theme;\n        if(sameBid(remaining[0])||sameBlock(remaining[0])){\n          const alternative=remaining.findIndex(x=>!sameBid(x)&&!sameBlock(x));\n          if(alternative>=0)index=alternative;\n          else if(sameBid(remaining[0])){\n            const other=remaining.findIndex(x=>!sameBid(x));\n            if(other>=0)index=other;\n          }\n        }\n      }\n      ordered.push(remaining.splice(index,1)[0]);\n    }\n    return ordered.map(v=>({id:v.exercise.id,kind:v.kind,reason:v.reason}));"
  }
];
const blob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s,'utf8')+'\0').update(s,'utf8').digest('hex');
function restoreOpeningOrder(source){
  // Restaurer précisément les seuls blocs du correctif autorisé, puis
  // vérifier intégralement le moteur historique. Aucun garde assoupli.
  for(const {before,after} of edits.slice().reverse()){
    assert.equal(source.split(after).length,2,'Bloc de progression hors correctif');
    source=source.replace(after,before);
  }
  assert.equal(blob(source),'2b6775a9eb6167f9356534f42c9dbba6a10446f3','Moteur précédent exact après normalisation');
  return source;
}
module.exports={restoreOpeningOrder};
