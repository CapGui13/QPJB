/* #508 — experimental source-first teaching, no selection/state mutation.
   Only completed/answered first-transfer questions get this feedback.
   Never counts a display as proof, never supplies the answer before response. */
'use strict';
const FIRST=Object.freeze(['SEF-037-1','SEF-038-1','SEF-039-2','SEF-039-1','SEF-040-2','SEF-N082-2','SEF-N084-1','SEF-N085-1','SEF-N087-2','SEF-V44-015','SEF-V44-016','SEF-V49-017','SEF-C-003','V2-M2-018','V2-M2-030']);
const CONTRAST='Sur 1SA, 2♦ est le Texas Cœur (rectification normale à 2♥) ; 2♥ est le Texas Pique (rectification normale à 2♠).';
const MARK='${escapeHTML(x.explain)}';
function supplement(q,type,result){
 if(type!=='parcours'||!['correct','wrong'].includes(result)||!FIRST.includes(q.id))return '';
 const s=String(q.explain||'');
 // All existing paired contrasts are preserved as-is.
 if(/2♦[^.!;]{0,35}Texas Cœur/i.test(s)&&/2♥[^.!;]{0,35}Texas Pique/i.test(s))return '';
 return CONTRAST;
}
function instrumentHTML(html){
 const anchor='function professeurFeedbackHTML(x,current){';
 if(html.split(anchor).length!==2||html.split(MARK).length!==2)throw Error('B: feedback anchor drift');
 const fn=supplement.toString().replace('FIRST.includes(q.id)',JSON.stringify(FIRST)+'.includes(q.id)').replace('return CONTRAST;', 'return '+JSON.stringify(CONTRAST)+';');
 return html.replace(anchor,fn+'\n'+anchor).replace(MARK,'${escapeHTML(x.explain)}${(()=>{const cue=supplement(x,parcoursState.active?.mode==="consolidation"?"consolidation":sessionType,current?.result);return cue?" "+escapeHTML(cue):""})()}');
}
module.exports={FIRST,CONTRAST,supplement,instrumentHTML};
