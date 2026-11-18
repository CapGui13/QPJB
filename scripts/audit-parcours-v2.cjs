'use strict';
/* QPJB V2 phase A — inventaire de couverture pédagogique, lecture seule.
 * Aucun classement n'est déduit automatiquement d'une explication libre.
 * Usage : node scripts/audit-parcours-v2.cjs --check
 *         node scripts/audit-parcours-v2.cjs --csv > revue.csv
 */
const BASELINE=Object.freeze({
  exercises:1523,themes:22,families:1315,
  withMicro:903,withoutMicro:620,withAxis:105,
  microAndAxis:65,withoutMicroOrAxis:580
});
const csvEscape=value=>'"'+String(value??'').replace(/"/g,'""').replace(/\r?\n/g,' ')+'"';
const key=x=>String(x.caseFamily||x.id);
function inventory(exercises,themes,P){
  if(!Array.isArray(exercises)||!Array.isArray(themes)||!P||typeof P.microKey!=='function')
    throw new TypeError('Inventaire : catalogue et moteur du parcours requis');
  const themeNames=new Map(themes.map(t=>[t.id,t.name]));
  if(themeNames.size!==themes.length)throw new Error('Identifiants de rubriques répétés');
  const ids=new Set(),allFamilies=new Set(),rows=[];
  const byTheme=themes.map(t=>({
    theme:t.id,name:t.name,total:0,withMicro:0,withoutMicro:0,
    withAxis:0,withoutMicroOrAxis:0,families:new Set(),missingFamilies:new Set(),
    editorialReasons:new Map()
  }));
  const groups=new Map(byTheme.map(t=>[t.theme,t]));
  for(const x of exercises){
    if(!x||typeof x.id!=='string'||!x.id||ids.has(x.id))throw new Error('ID QCM absent ou dupliqué : '+x?.id);
    if(!groups.has(x.theme))throw new Error('Rubrique inconnue : '+x.id);
    if(typeof x.difficultyReason!=='string'||!x.difficultyReason.trim())
      throw new Error('Justification de difficulté manquante : '+x.id);
    ids.add(x.id);
    const fam=key(x),micro=P.microKey(x),axis=P.axisKey(x);
    const g=groups.get(x.theme),reason=x.difficultyReason;
    allFamilies.add(fam);
    g.total++;g.families.add(fam);
    if(micro)g.withMicro++;
    else{
      g.withoutMicro++;
      g.missingFamilies.add(fam);
      g.editorialReasons.set(reason,(g.editorialReasons.get(reason)||0)+1);
      if(!axis)g.withoutMicroOrAxis++;
    }
    if(axis)g.withAxis++;
    rows.push({
      id:x.id,theme:x.theme,themeName:themeNames.get(x.theme),
      family:fam,difficulty:x.difficulty,answer:x.answer,
      micro:micro||'',axis:axis||'',difficultyReason:reason,
      reviewStatus:micro?'MICRO_EXISTANTE_A_RECONTROLER':'A_CLASSER_MANUELLEMENT'
    });
  }
  const summary={
    exercises:rows.length,themes:themes.length,families:allFamilies.size,
    withMicro:rows.filter(x=>x.micro).length,
    withoutMicro:rows.filter(x=>!x.micro).length,
    withAxis:rows.filter(x=>x.axis).length,
    microAndAxis:rows.filter(x=>x.micro&&x.axis).length,
    withoutMicroOrAxis:rows.filter(x=>!x.micro&&!x.axis).length
  };
  const breakdown=byTheme.map(g=>({
    theme:g.theme,name:g.name,total:g.total,
    withMicro:g.withMicro,withoutMicro:g.withoutMicro,
    withAxis:g.withAxis,withoutMicroOrAxis:g.withoutMicroOrAxis,
    families:g.families.size,missingFamilies:g.missingFamilies.size,
    topReasons:[...g.editorialReasons.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'fr'))
      .slice(0,8).map(([reason,count])=>({reason,count}))
  }));
  return {summary,breakdown,rows,queue:rows.filter(x=>!x.micro)};
}
function asCSV(rows){
  const fields=['id','theme','family','difficulty','answer','micro','axis','difficultyReason','reviewStatus'];
  return fields.join(',')+'\n'+rows.map(row=>fields.map(k=>csvEscape(row[k])).join(',')).join('\n')+'\n';
}
function assertBaseline(summary,expected=BASELINE){
  for(const [key,value] of Object.entries(expected)){
    if(summary[key]!==value)throw new Error('Dérive catalogue : '+key+' = '+summary[key]+' au lieu de '+value);
  }
  return true;
}
module.exports={BASELINE,inventory,asCSV,assertBaseline};
if(require.main===module){
  const fs=require('node:fs'),path=require('node:path');
  const root=path.resolve(__dirname,'..');
  const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8');
  const tag='<script id="training-data" type="application/json">';
  const i=html.indexOf(tag),j=html.indexOf('</script>',i+tag.length);
  if(i<0||j<0)throw new Error('Catalogue Quiz SEF intégré non trouvé');
  const data=JSON.parse(html.slice(i+tag.length,j)),P=require('../quizz-parcours.js');
  const result=inventory(data.exercises,data.themes,P);
  assertBaseline(result.summary);
  if(process.argv.includes('--csv'))process.stdout.write(asCSV(result.queue));
  else if(process.argv.includes('--all-csv'))process.stdout.write(asCSV(result.rows));
  else process.stdout.write(JSON.stringify({summary:result.summary,byTheme:result.breakdown},null,2)+'\n');
}