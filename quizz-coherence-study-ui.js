/* #419 — targeted lessons UI. No selection, storage, assessment or catalogue editing. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QPJBCoherenceStudyUI=api;})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 function clear(host){
  if(!host)return;
  host.hidden=true;
  const details=host.querySelector('details');
  if(details){details.ontoggle=null;details.open=false}
  host.querySelector('[data-study-list]')?.replaceChildren();
  host.querySelector('[data-study-rule]')?.replaceChildren();
 }
 function mount({host,getState,exercises,getOptions,engine,planner,lessons,blocked,reportHeight=()=>{}}){
  if(!host)return;
  clear(host);
  if(!engine?.studySuggestions||planner?.schema!=='QPJB_COHERENCE_M5_V1'||lessons?.schema!=='QPJB_DURABLE_INTEGRATION_V1'||blocked())return;
  const details=host.querySelector('details'),list=host.querySelector('[data-study-list]'),out=host.querySelector('[data-study-rule]');
  if(!details||!list||!out)return;
  const node=(parent,tag,value)=>{const el=host.ownerDocument.createElement(tag);if(value!==undefined)el.textContent=String(value);parent.appendChild(el);return el};
  const get=phase=>{
   if(blocked()||getState()?.active!==null)return null;
   try{return engine.studySuggestions(getState(),exercises,{...getOptions(),coherenceM5:planner,phase,questionActive:false,quizActive:false})}
   catch(_){return null}
  };
  function render(){
   list.replaceChildren();out.replaceChildren();
   if(blocked()||!details.open){if(blocked())clear(host);return}
   for(const [phase,title] of [['before','Avant la prochaine séance'],['after','À revoir après la dernière séance']]){
    const p=get(phase),items=p?.[phase]||[];
    if(!items.length)continue;
    node(list,'h4',title);
    const ul=node(list,'ul');
    for(const item of items){
     const li=node(ul,'li'),b=node(li,'button',item.title);
     b.type='button';b.className='secondary';
     node(li,'p',item.reason);
     b.onclick=()=>{
      out.replaceChildren();
      if(blocked()||!details.open){if(blocked())clear(host);return}
      // Recompute from the live inactive state; never retain a preview deck.
      const current=get(phase)?.[phase]?.find(x=>x.concept===item.concept&&x.mode===item.mode);
      if(!current){render();reportHeight();return}
      const l=lessons.lesson({history:getState(),concept:current.concept,mode:current.mode,questionActive:false});
      if(!l||l.assessment!==false||l.assisted!==true||typeof l.rule!=='string')return;
      node(out,'h4',l.title);node(out,'p',l.rule);
      reportHeight();
     };
    }
   }
   if(!list.children.length)node(list,'p','Aucune suggestion ciblée disponible pour le moment.');
  }
  details.ontoggle=()=>{
   if(blocked()){clear(host);reportHeight();return}
   if(details.open)render();else{list.replaceChildren();out.replaceChildren()}
   reportHeight();
  };
  host.hidden=false;
 }
 return Object.freeze({schema:'QPJB_COHERENCE_STUDY_UI_V1',clear,mount});
});
