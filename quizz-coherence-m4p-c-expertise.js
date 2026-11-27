'use strict';
function build(exercises,meta,old,pairs){
 const norm=x=>String(x??"").replace(/[\uFE0E\uFE0F]/g,"").trim().replace(/\s+/g," "),idx=Object.fromEntries(old.map(x=>[x.id,x])),r={},rel={};
 for(let i=0;i<pairs.length;i++){const [a,b]=pairs[i];(rel[a]??=[]).push(i);(rel[b]??=[]).push(i)}
 for(const x of exercises){
 const m=meta[x.id],o=idx[x.id];if(r[x.id]||!m||!o||m.concept!==o.concept||x.caseFamily!==o.family)throw Error(x.id);
 const shape=x.hand.map(s=>s.length),h=x.hand.flat().reduce((s,c)=>s+({A:4,R:3,D:2,V:1}[c]||0),0),hl=h+shape.reduce((s,n)=>s+Math.max(0,n-4),0),flags=[];
 if(h!==x.h||shape.join()!==x.shape.join()||shape.reduce((s,n)=>s+n,0)!==13||x.hand.some(s=>new Set(s).size!==s.length)||!x.choices.map(norm).includes(norm(x.answer)))flags.push("controle_structurel_HOLD");
 let axis=null;const c=m.concept,a=norm(x.answer),auction=x.auction.map(norm);
 if(c==="ouv.passe")axis=hl>=11?"frontiere":hl<=5?"0-5":hl<=8?"6-8":"9-10";
 if(c==="ouv.mineure")axis=shape[2]===shape[3]?"egalite-"+shape[2]:shape[2]>shape[3]?"carreau_plus_long":"trefle_plus_long";
 if(c==="ouv.sa1"||c==="ouv.sa2")axis=[h,shape.slice().sort((a,b)=>b-a)];
 if(c==="majeur.soutien"){const p=auction[0]?.match(/1([♠♥])/);if(p)axis="fit-"+shape[["♠","♥"].indexOf(p[1])];}
 if(c==="sa1.seuil")axis=a;
 if(c==="sa1.texas")axis=hl<=7?"partielle_candidate":hl<=9?"invitation_candidate":"manche_candidate";
 r[x.id]={concept:c,family:x.caseFamily,theme:x.theme,level:x.difficulty,answer:a,H:h,HL:hl,shape,auction,axis,stage:m.stage,minSession:m.minSession,prior: o.features.decision,signature:JSON.stringify([c,auction,a,axis,m.stage]),relations:rel[x.id]||[],status:rel[x.id]?"revue_IA_ciblee":"automatique_seulement",flags,proof:rel[x.id]?"relations.json + corrigé canonique référencé":"contrôle structurel uniquement",source:x.id,proposal:rel[x.id]?"annotation_externe_REVIEW":null};
 }
 return r;
}
function relation(rows,pairs,a,b){if(!rows[a]||!rows[b])return {status:"HOLD",type:"non_examine"};if(a===b)return {status:"structurel",type:"meme_id"};const p=rows[a].relations.map(i=>pairs[i]).find(p=>p[0]===b||p[1]===b);return p?{status:"REVIEW_sans_visa",type:p[2],proof:p[3]}:{status:"HOLD",type:"non_arbitre",sameFamily:rows[a].family===rows[b].family,sameSignature:rows[a].signature===rows[b].signature};}
module.exports={build,relation};
