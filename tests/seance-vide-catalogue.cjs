'use strict';
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const session='Séance 0-01 Mumu';
const catalogue=JSON.parse(fs.readFileSync(path.join(root,'catalogue.json'),'utf8'));
const config=JSON.parse(fs.readFileSync(path.join(root,'config.json'),'utf8'));
const generator=fs.readFileSync(path.join(root,'scripts/build_catalogue.py'),'utf8');
const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
const matching=catalogue.seances.filter(s=>s.folder===session);
assert.equal(matching.length,1,'one session 0-01 Mumu');
assert.ok(!catalogue.seances.some(s=>s.folder==='Séance 2-05 Aix'),'old session not present');
assert.ok(!fs.existsSync(path.join(root,'Séance 2-05 Aix')),'old directory removed');
// Exécute les véritables fonctions d'accueil avec le catalogue public.
const vm=require('node:vm');
const grid={innerHTML:'',addEventListener(){}}, count={textContent:''};
const sandbox={document:{getElementById:id=>id==='seance-grid'?grid:count},descMap:catalogue.descMap,esc:s=>String(s)};
vm.createContext(sandbox);
const start=home.indexOf('function seanceDisplayName(');
const end=home.indexOf('function renderSeanceGrid(',start);
const next=home.indexOf('\nfunction ',end+1);
assert.ok(start>=0&&end>start&&next>end,'home grouping functions present');
vm.runInContext(home.slice(start,next),sandbox);
sandbox.sessions=catalogue.seances;
const sorted=vm.runInContext('sessions.slice().sort(compareSeances).map(s=>s.folder)',sandbox);
assert.deepEqual(Array.from(sorted),[
 ...catalogue.seances.filter(s=>/^Séance 1-/.test(s.folder)).map(s=>s.folder).sort((a,b)=>a.localeCompare(b,'fr',{numeric:true})),
 ...catalogue.seances.filter(s=>/^Séance 2-/.test(s.folder)).map(s=>s.folder).sort((a,b)=>a.localeCompare(b,'fr',{numeric:true})),
 'Séance 0-01 Mumu','SDE Nov 26'
],'Saison 1, Saison 2, puis séances spéciales');
vm.runInContext('renderSeanceGrid(sessions)',sandbox);
const headings=[...grid.innerHTML.matchAll(/class="seance-separator" role="heading" aria-level="3">([^<]+)/g)].map(m=>m[1]);
assert.deepEqual(headings,['Saison 1','Saison 2','Séances spéciales']);
assert.deepEqual([...grid.innerHTML.matchAll(/data-folder="([^"]+)"/g)].map(m=>m[1]),Array.from(sorted));
assert.equal(count.textContent,'('+catalogue.seances.length+')');
assert.ok(grid.innerHTML.indexOf('Séances spéciales')<grid.innerHTML.indexOf('data-folder="Séance 0-01 Mumu"'));

assert.equal(matching[0].fichiers.length,7,'seven published PBNs');
assert.equal(catalogue.descMap[session],config.descriptions[session],'same description');
assert.equal(fs.existsSync(path.join(root,session,'.seance-vide')),false,'no empty-session marker once populated');
assert.ok(generator.includes('(folder / ".seance-vide").is_file()'),'generator still supports future empty sessions');
assert.ok(home.includes('Séance en préparation : aucune donne publiée pour le moment.'),'empty-session fallback remains generic');
const expected=[
  {
    "name": "B1 - 3SA - choisir la couleur à affranchir (course de vitesse).pbn",
    "sha256": "516f04bfa45d28e34825af1133e6f08de131aa942dbd9aadd214cddac9aefd68"
  },
  {
    "name": "B2 - points de longueur du répondant.pbn",
    "sha256": "4195c8e656a741f6a2d5e2e566a3d0110d38a7fb42ac4af339313436af1f06a3"
  },
  {
    "name": "B3 - 7SA - communications et déblocage.pbn",
    "sha256": "e474555ed4f95be95b706df04c98d1971d65021f1f313546f82962c89e9c8a05"
  },
  {
    "name": "B4 - 3SA - double cab.pbn",
    "sha256": "6232d78d37732a4d133632c6497063dad43185607ef90db62a374cf0515f1ce4"
  },
  {
    "name": "B5 - 3SA - conserver la communication pour exploiter une longue.pbn",
    "sha256": "75478664dfc09d109da7cd92ba570d0492139053a48e0d5cabdec9c78c9f1899"
  },
  {
    "name": "B6 - 3SA - affranchir en donnant AD.pbn",
    "sha256": "5fac94f15a1336f588562c6770acf051f6c84af10c49bbe3410c92d8e7b3213c"
  },
  {
    "name": "B7 - 6SA - première impasse.pbn",
    "sha256": "d2d81752595e2233d611581161719eeb8c7c16b5c7b19efd6270a592398c5b01"
  }
];
for(const [index,item] of expected.entries()){
  const entry=matching[0].fichiers[index];
  assert.equal(entry.name,item.name,'PBN order and filename B'+(index+1));
  const buffer=fs.readFileSync(path.join(root,session,item.name));
  assert.equal(crypto.createHash('sha256').update(buffer).digest('hex'),item.sha256,'original bytes preserved: '+item.name);
  const text=buffer.toString('latin1');
  const deal=/\[Deal\s+"[NESW]:([^"]+)"\]/.exec(text);
  assert.ok(deal,'PBN has Deal: '+item.name);
  const cards=deal[1].split(' ').flatMap(h=>h.split('.').flatMap((s,i)=>[...s].map(c=>i+':'+c)));
  assert.equal(cards.length,52,'52 cards: '+item.name);
  assert.equal(new Set(cards).size,52,'all cards unique: '+item.name);
  assert.ok(/\[Contract\s+"[^"]+"\]/.test(text),'contract present: '+item.name);
  assert.equal(entry.download_url,'./'+encodeURIComponent(session)+'/'+encodeURIComponent(item.name).replace(/[!'()*]/g,c=>'%'+c.charCodeAt(0).toString(16).toUpperCase()),'download path valid: '+item.name);
}
console.log('Séance 0-01 Mumu : 7 PBN et intégrité SHA-256 OK');
