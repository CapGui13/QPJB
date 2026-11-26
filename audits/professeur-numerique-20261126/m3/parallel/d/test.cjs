/* M3-D: test autonome, exécutable avec Node ou injecté dans V8. */
'use strict';
const names=['rubensohl-init-naturel','rubensohl-reponse-suite','multilandy-intervention-choix','multilandy-reponse-suite','michaels-intervention-reveil','michaels-defense','michaels-reponse','chelem-blackwood-quantitatif','chelem-controles','chelem-splinter'];
const allowed=new Set(['force','distribution','fit','priorite','niveau','forcing','convention','competition','contexte','autre','inconnu']);
const prefixes=new Set(['chelem','michaels','multilandy','rubensohl']);
const key=(id,choice)=>id+':'+choice;
function run({exercises,cart,rows,data,holds,patches,base,extendDiagnostic,signature}){
  let assertions=0;
  function check(condition,message){assertions++;if(!condition)throw Error(message);}
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const scope=cart.filter(x=>prefixes.has(x.concept.split('.')[0]));
  const map=new Map(exercises.map(x=>[x.id,x]));
  const unknown=new Map(scope.flatMap(x=>x.options.filter(o=>o[1]==='unknown').map(o=>[key(x.id,o[0]),x.concept])));
  check(scope.length===295,'scope QCM');check(unknown.size===563,'scope unknown');check(rows.length===563,'row count');
  const seen=new Set(),proposals=new Map(),holdKeys=new Set(holds.map(x=>key(x.id,x.choice)));
  const counts={};
  for(const row of rows){
    const k=key(row.id,row.choice),x=map.get(row.id);
    check(!seen.has(k)&&unknown.has(k),'unknown duplicate or outside scope '+k);seen.add(k);
    check(row.evidence.concept===unknown.get(k),'concept '+k);
    check(row.baseStatus==='unknown'&&row.reason.length>30,'reason '+k);
    check(x.choices.includes(row.choice)&&row.choice!==x.answer,'catalogue '+k);
    check(same(row.evidence.hand,x.hand)&&same(row.evidence.auction,x.auction)&&same(row.evidence.shape,x.shape)&&row.evidence.h===x.h&&row.evidence.context===x.context&&row.evidence.expected===x.answer,'evidence '+k);
    check(allowed.has(row.category),'category '+k);
    check((row.status==='hypothesis')===(row.disposition==='hypothesis'),'disposition '+k);
    check((row.disposition==='HOLD-editorial')===holdKeys.has(k),'HOLD '+k);
    if(row.status==='hypothesis'){
      const d=data.byId[row.id],o=d?.choices[row.choice];
      check(d.signature===signature(x)&&d.concept===row.evidence.concept,'signature '+k);
      check(o&&o.category===row.category&&o.reason===row.reason&&o.confidence===row.confidence&&o.rule===row.evidence.rule,'payload '+k);
      proposals.set(k,row);
    }else check(!data.byId[row.id]?.choices[row.choice],'unknown not promoted '+k);
    const f=row.evidence.concept.split('.')[0];counts[f]??={};counts[f][row.disposition]=(counts[f][row.disposition]||0)+1;
  }
  check(seen.size===unknown.size,'exhaustiveness');check(holds.length===6&&holdKeys.size===6,'HOLD count');
  check(Object.values(data.byId).reduce((n,x)=>n+Object.keys(x.choices).length,0)===proposals.size,'payload count');
  check(data.baseSHA==='71b0823235db1400eaf57c2552df35c18094f30a','base SHA');
  const diagnose=extendDiagnostic(base,data);
  const originalCatalogue=JSON.stringify(exercises),originalData=JSON.stringify(data);let retained=0,promoted=0,correct=0,globalRetained=0,initialHyp=0,invalid=0;const start=Date.now();
  for(const c of cart){
    const x=map.get(c.id);check(!!x,'catalogue ID '+c.id);
    const input={exercise:x,choice:x.answer,assisted:true,hadFreeError:true};
    check(same(diagnose(input),base(input))&&diagnose(input).status==='correct','correct '+c.id);correct++;
    for(const choice of [null,'foo','8SA']){const invalidInput={exercise:x,choice,assisted:true,hadFreeError:true};check(same(diagnose(invalidInput),base(invalidInput)),'invalid free '+c.id);invalid++;}
    for(const o of c.options){
      const choice=o[0],input={exercise:x,choice,assisted:false,hadFreeError:false};
      const d=base(input),n=diagnose(input),k=key(c.id,choice),row=proposals.get(k);
      check(d.status===o[1]&&d.category===o[2]&&d.confidence===o[3]&&d.evidence.rule===o[4],'base map '+k);
      if(prefixes.has(c.concept.split('.')[0])&&d.status==='hypothesis')initialHyp++;
      if(row){
        check(n.status==='hypothesis'&&n.category===row.category&&n.reason===row.reason&&n.confidence===row.confidence,'promote '+k);promoted++;
        const assisted={...input,assisted:true,hadFreeError:true},a=diagnose(assisted);
        check(a.evidence.assisted===true&&a.evidence.hadFreeError===true&&a.evidence.offered===true,'flags '+k);
        const mutated={...x,context:x.context+' MODIF'};
        check(same(diagnose({...input,exercise:mutated}),base({...input,exercise:mutated})),'signature guard '+k);
        const notOffered={...x,choices:x.choices.filter(z=>z!==choice)};
        check(same(diagnose({...input,exercise:notOffered}),base({...input,exercise:notOffered})),'offered guard '+k);
      }else{
        check(same(n,d),'preserve '+k);globalRetained++;if(seen.has(k))retained++;
      }
    }
  }
  check(promoted===509&&retained===54,'promotion totals');
  check(initialHyp===322,'initial hypotheses');
  check(promoted+globalRetained===5637,'global options');
  check(JSON.stringify(exercises)===originalCatalogue&&JSON.stringify(data)===originalData,'non mutation');
  for(const [id,choice] of [['SEF-L33-005','2♦'],['V2-M1-031','1♦'],['V2-M4-017','Passe']]){const n=diagnose({exercise:map.get(id),choice});check(n.status==='unknown'&&n.evidence.rule==='editorial-hold','historical HOLD '+id);}
  const elapsedMs=Date.now()-start;
  for(const p of patches){
    const x=map.get(p.id);
    check(scope.some(c=>c.id===p.id),'patch scope');
    check(same(p.oldChoices,x.choices),'patch old');
    check(p.newChoices.length===x.choices.length&&new Set(p.newChoices).size===p.newChoices.length&&p.newChoices.includes(x.answer),'patch choice invariants');
    check(p.diagnostics.length===p.newChoices.length-1,'patch coverage');
    for(const d of p.diagnostics){
      check(d.choice!==x.answer&&p.newChoices.includes(d.choice)&&allowed.has(d.category)&&d.reason.length>30,'patch diagnostic');
      const b=base({exercise:{...x,choices:p.newChoices},choice:d.choice});
      check(b.evidence.rule!=='illegal-call'&&b.evidence.rule!=='unverified-case','patch legality');
    }
    check(!holds.some(h=>h.id===p.id),'no patch HOLD');
  }
  return {assertions,qcm:scope.length,reviewed:rows.length,promoted,retained,initialHyp,globalRetained,correct,invalid,elapsedMs,counts,patches:patches.length,holds:holds.length};
}
module.exports={run,names};
if(require.main===module){
  const fs=require('node:fs'),path=require('node:path');
  const root=path.resolve(__dirname,'../../../../..');
  const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
  const html=fs.readFileSync(path.join(root,'quizz.html'),'utf8'),i=html.indexOf('"exercises":['),j=html.lastIndexOf('<script',i);
  const exercises=JSON.parse(html.slice(html.indexOf('>',j)+1,html.indexOf('</script>',i))).exercises;
  const cart=read(path.join(__dirname,'../../cartographie.json'));
  const rows=names.flatMap(n=>read(path.join(__dirname,'revue-'+n+'.json')));
  const {extendDiagnostic,signature}=require('./integration.cjs');
  const base=require(path.join(root,'quizz-diagnostic-erreurs.js')).diagnose;
  console.log(JSON.stringify(run({exercises,cart,rows,data:read(path.join(__dirname,'diagnostics.json')),holds:read(path.join(__dirname,'hold.json')),patches:read(path.join(__dirname,'patches.json')),base,extendDiagnostic,signature}),null,2));
}
