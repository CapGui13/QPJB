'use strict';
/* Une page non débordante peut contenir une main tronquée dans un conteneur
 * à défilement horizontal. Vérifier le contenu de la main elle-même. */
const assert=require('node:assert/strict');
function assertHandReflow(metrics,description='mobile'){
 const required=['documentWidth','viewportWidth','handScrollWidth','handClientWidth'];
 for(const key of required)
  assert.ok(Number.isFinite(metrics?.[key]),`${description}: mesure ${key} absente`);
 assert.ok(metrics.documentWidth<=metrics.viewportWidth+2,
  `${description}: débordement horizontal de la page`);
 assert.ok(metrics.handScrollWidth<=metrics.handClientWidth+2,
  `${description}: main tronquée malgré une page sans débordement`);
 assert.ok(Array.isArray(metrics.rankRects)&&metrics.rankRects.length===4,
  `${description}: les quatre couleurs doivent être mesurées`);
 const {left,right}=metrics.handRect||{};
 assert.ok(Number.isFinite(left)&&Number.isFinite(right)&&right>=left,
  `${description}: rectangle de la main invalide`);
 for(const rect of metrics.rankRects){
  assert.ok(Number.isFinite(rect.left)&&Number.isFinite(rect.right)&&
   rect.left>=left-2&&rect.right<=right+2,
   `${description}: une longueur de couleur sort de la main`);
 }
 return true;
}
module.exports={assertHandReflow};
