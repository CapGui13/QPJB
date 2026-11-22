'use strict';
/* Serveur de recette M3 : les ressources manquantes doivent produire un
 * statut HTTP d'erreur avant l'envoi des en-têtes (et non un crash de stream).
 */
const fs=require('node:fs');
const path=require('node:path');
const types={'.html':'text/html; charset=utf-8',
 '.js':'application/javascript; charset=utf-8',
 '.css':'text/css; charset=utf-8',
 '.svg':'image/svg+xml'};
function requestPath(req,res){
 try{return decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname)}
 catch(_){res.writeHead(400);res.end('Chemin de ressource invalide');return null}
}
function serveQPJBFile(res,root,pathname){
 if(!pathname.startsWith('/QPJB/')){res.writeHead(404);res.end();return}
 const base=path.resolve(root);
 const file=path.resolve(base,pathname.slice('/QPJB/'.length));
 if(!file.startsWith(base+path.sep)){
  res.writeHead(403);res.end('Ressource hors racine');return;
 }
 let data;
 try{data=fs.readFileSync(file)}
 catch(_){res.writeHead(404);res.end('Ressource introuvable');return}
 res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream',
  'cache-control':'no-store'});
 res.end(data);
}
module.exports={requestPath,serveQPJBFile};
