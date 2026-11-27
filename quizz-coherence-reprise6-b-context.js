/* #508 — isolated presentation raccordement, not activated.
   Restores an existing premise, never adds a proof or changes selection. */
'use strict';
const IDS=Object.freeze(['SEF-V416-008','SEF-V416-009']);
const MARK="  const context=String(x.context||'').trim();";
const premise=/répond 2SA, montrant les deux majeures quatrièmes/;
function needsContext(q){
 return IDS.includes(q.id)&&premise.test(String(q.context||''))&&
   q.auction?.length===3&&q.auction[2]==='Partenaire : 2SA';
}
function instrumentHTML(html){
 if(html.split(MARK).length!==2)throw Error('B: conventionNote anchor drift');
 // Keep source catalogue and renderer escape/dedup path intact.
 const helper='('+needsContext.toString().replace('IDS.includes(q.id)',JSON.stringify(IDS)+'.includes(q.id)').replace('premise.test',premise.toString()+'.test')+')';
 return html.replace(MARK,MARK+'\n  if('+helper+'(x))notes.push(context);');
}
module.exports={IDS,needsContext,instrumentHTML};
