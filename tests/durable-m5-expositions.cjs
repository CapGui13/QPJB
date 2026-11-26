'use strict';
const api=require('../quizz-durable-m5-lecons.js');
const payload=require('../audits/apprentissage-durable-20261126/m5/corpus-verification.json');
console.log((function sweep(api, payload){
 const {corpus,idConcept}=payload,groups=Object.create(null);for(const [id,c] of Object.entries(idConcept))(groups[c]??=[]).push(id);
 let assertions=0,ids=0,gates=0,scenarios=0;const ok=(b,msg)=>{assertions++;if(!b)throw Error(msg)};
 const assessment=(result="correct",assisted=false,lastSession=0)=>({assessment:{result,assisted,lastSession}});
 const event=(id,result="correct",assisted=false,mode="parcours",session=65)=>({mode,session,answers:[{id,result,assisted}]});
 const history=(entries={},journal=[],completed=65)=>({active:null,completed,entries,journal});
 const request=(concept,mode,h)=>({concept,mode,history:h,questionActive:false,nowMs:1000});
 const status=(c,h,exposed,description)=>{scenarios++;const d=api.lesson(request(c,"discovery",h)),r=api.lesson(request(c,"reminder",h)),s=api.lesson(request(c,"study",h));
  ok(Boolean(d)===!exposed,description+" discovery");ok(Boolean(r)===exposed,description+" reminder");ok(Boolean(s)===exposed,description+" study");
  if(exposed){ok(r.examples.length===0&&r.checks.length===0&&r.extensions.length===0,description+" recall short");ok(s.assisted===true&&s.assessment===false,description+" study non assessment");}
 };
 ok(Object.keys(corpus).length===99&&Object.keys(idConcept).length===1915,"catalogue count");
 for(const [c,l] of Object.entries(corpus)){
  const entries={};for(const p of l.prerequisites){ok(p.concept!==c,c+" no impossible self gate");for(const id of groups[p.concept].slice(0,p.minExposure))entries[id]=assessment();}
  const h=history(entries);status(c,h,false,c+" prerequisites only");
  for(const id of groups[c]){
   ids++;
   for(const result of ["correct","wrong"])for(const assisted of [false,true]){
    status(c,history({...entries,[id]:assessment(result,assisted)}),true,id+" entry "+result+" "+assisted);
    status(c,history(entries,[event(id,result,assisted)]),true,id+" journal "+result+" "+assisted);
   }
   status(c,history({...entries,[id]:assessment("skipped")}),false,id+" skipped entry");
   status(c,history(entries,[event(id,"skipped")]),false,id+" skipped journal");
   status(c,history(entries,[event(id,"correct",false,"consolidation")]),false,id+" consolidation");
   status(c,history(entries,[event(id,"correct",false,"parcours",66)]),false,id+" future journal");
   status(c,history({...entries,[id]:assessment("correct",false,65)}),false,id+" future entry");
   status(c,history({...entries,[id]:{assessment:{result:"correct"}}}),false,id+" undated session entry");
  }
  for(const p of l.prerequisites){
   gates++;const reduced={...entries};for(const id of groups[p.concept])delete reduced[id];
   const chosen=groups[p.concept].slice(0,p.minExposure),partial=chosen.slice(0,-1);
   for(const id of partial)reduced[id]=assessment();
   const journal=partial.flatMap(id=>Array.from({length:5},()=>event(id)));
   const deficient=history(reduced,journal);
   ok(api.lesson(request(c,"discovery",deficient))===null,c+" distinct exposure required "+p.concept);
   ok(!api.available(request(c,"discovery",deficient)).some(x=>x.concept===c),c+" gate list");
   const restored=history(reduced,[...journal,event(chosen.at(-1))]);
   ok(api.lesson(request(c,"discovery",restored))?.kind==="discovery",c+" union distinct IDs");
  }
  const advanced=history({...entries,[groups[c][0]]:assessment()});
  for(const mode of ["discovery","reminder","study"]){
   const ctx=request(c,mode,mode==="discovery"?h:advanced);
   for(const patch of [{questionActive:true},{questionActive:1},{questionActive:null},{exercise:{}},{answer:{}},{selected:[]},{candidates:[]},{history:{...ctx.history,active:{}}},{history:{...ctx.history,active:undefined}}]){
    const guarded={...ctx,...patch};ok(api.lesson(guarded)===null,c+" active/ambiguous guard "+mode);ok(api.available(guarded).length===0,c+" availability guard "+mode);
   }
  }
  ok(api.lesson(request(c,"discovery",history({...entries,"unknown-exercise":assessment()})))?.kind==="discovery",c+" unknown ID ignored");
  ok(api.available(request(c,"discovery",h)).some(x=>x.concept===c),c+" availability agrees");
 }
 ok(ids===1915,"all ids visited");
 return {assertions,ids,concepts:Object.keys(corpus).length,prerequisiteGates:gates,scenarios};
})(api,payload));
