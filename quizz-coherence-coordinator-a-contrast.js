'use strict';
// A source-first alternative: use an already audited case as a worked
// contrast only AFTER an ordinary S3/S5 has ended. No question, score or proof.
function earlyContrast(session,deck,exercises,metadataById){
 if(![3,5].includes(session)||!Array.isArray(deck)||deck.length!==10||new Set(deck.map(q=>q.id)).size!==10||!metadataById)return null;
 const byId=new Map(exercises.map(q=>[q.id,q])),concept=q=>metadataById[q.id]?.concept;
 const bid=q=>String(q.answer||'').replace(/[\s\uFE0E\uFE0F]/g,'');
 const major=q=>{const lead=String(q.auction?.[0]||'').match(/^Partenaire\s*:\s*1([♥♠])$/)?.[1];return concept(q)==='majeur.soutien'&&q.auction.length===1&&lead&&q.shape?.[lead==='♠'?0:1]===3?lead:null};
 const role=q=>{
  if(concept(q)!=='red.base'||q.auction?.length!==2)return null;
  const first=String(q.auction[0]).match(/^Vous\s*:\s*1([♠♥♦♣])$/)?.[1],second=String(q.auction[1]).match(/^Partenaire\s*:\s*1([♠♥♦♣]|SA)$/)?.[1];
  if(!first||!second)return null;
  if(bid(q)==='1SA'&&second!=='SA'&&q.h>=12&&q.h<=14)return 'regular';
  if(bid(q)==='2'+first&&q.shape?.['♠♥♦♣'.indexOf(first)]>=6)return 'repeat';
  if(second!=='SA'&&second!==first&&bid(q)==='2'+second&&q.shape?.['♠♥♦♣'.indexOf(second)]>=4)return 'support';
  return null;
 };
 let id=null,why=null,valid=null;
 if(session===3){
  const source=deck.find(q=>major(q)&&bid(q)==='2'+major(q));
  if(!source||deck.some(q=>major(q)&&bid(q)==='Passe'))return null;
  const suit=major(source);id=suit==='♥'?'SEF-PN26-M1-021':'SEF-030-1';
  why='Un fit 5–3 ne suffit pas toujours pour soutenir.';
  valid=q=>major(q)===suit&&bid(q)==='Passe';
 }else{
  const covered=new Set(deck.map(role).filter(Boolean));
  if(covered.size!==2)return null;
  const missing=['regular','repeat','support'].find(r=>!covered.has(r));
  id={regular:'SEF-V49-037',repeat:'SEF-N122-1',support:'SEF-V49-021'}[missing];
  why={regular:'Une main régulière minimale se distingue d’un soutien ou d’une répétition.',repeat:'Une longue sixième peut justifier une répétition économique.',support:'Quatre cartes dans la couleur répondue permettent de reconnaître un fit.'}[missing];
  valid=q=>role(q)===missing;
 }
 const example=byId.get(id);
 if(!example||deck.some(q=>q.id===id)||!valid(example)||example.difficulty>2||!metadataById[id]||metadataById[id].minSession>session-1)return null;
 return {id,why,example};
}
function instrumentHTML(html){
 const fnAnchor='function finishSession(){';
 const renderAnchor="   if(focused)\$('repeat').onclick=()=>quizFadeNavigate(startParcours);";
 // Fixed exact anchors, never alter the embedded catalogue.
 if(html.split(fnAnchor).length!==2||html.split(renderAnchor).length!==2)throw Error('A contrast anchors');
 const render=`   if(advanced&&!focused){
     const cue=earlyContrast(parcoursState.completed,deck,DATA.exercises,window.QPJBPrerequis?.byId);
     if(cue){
       const x=cue.example,hand=x.hand.map((cards,i)=>['♠','♥','♦','♣'][i]+' '+cards.join(' ')).join(' · ');
       const panel=document.createElement('section');panel.className='parcours-report';panel.setAttribute('aria-label','Contraste à retenir');panel.dataset.earlyContrast=x.id;
       panel.innerHTML='<h3>Contraste à retenir</h3><p>Exemple expliqué — hors score. '+escapeHTML(cue.why)+'</p><p>'+escapeHTML(x.auction.join(' — '))+'</p><p>'+escapeHTML(hand)+' · '+x.h+' H</p><p><strong>'+escapeHTML(x.answer)+'</strong> — '+escapeHTML(x.explain)+'</p>';
       $('body').querySelector('.session-summary').after(panel);
     }
   }
`;
 return html.replace(fnAnchor,earlyContrast.toString()+'\n'+fnAnchor).replace(renderAnchor,render+renderAnchor);
}
module.exports={earlyContrast,instrumentHTML};
