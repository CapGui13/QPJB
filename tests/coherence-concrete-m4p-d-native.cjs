'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib'),assert=require('node:assert/strict'),cp=require('node:child_process');
const L=require('../quizz-coherence-m4p-d-lab.js'),campaign=require('./coherence-concrete-m4-campaign.cjs'),features=require('../quizz-coherence-m4-diversite.js').features;
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const blob=s=>crypto.createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
const source=read('quizz-parcours.js'),html=read('quizz.html');
assert.equal(blob(source),L.ENGINE);assert.equal(blob(html),L.CATALOGUE);
const exercises=JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]).exercises;
const meta=require('../quizz-prerequis.js').byId;
assert.equal(exercises.length,1915);assert.equal(new Set(Object.values(meta).map(x=>x.concept)).size,99);
const [profile,seedArg,policy='D']=process.argv.slice(2),seed=Number(seedArg);
assert.ok(L.PROFILES.includes(profile)&&L.SEEDS.includes(seed));
const horizon=Number(process.env.HORIZON||180),out=process.env.OUT||'m4p-d-out';
const sha=cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
const provenance={base:L.BASE,engine:L.ENGINE,catalogue:L.CATALOGUE,testedSha:sha,responseRule:'fnv1a-m4-v1',baseline:'native-uninstrumented',metadata:blob(read('quizz-prerequis.js'))};
const opts={source,requireBase:require('node:module').createRequire(path.join(root,'quizz-parcours.js')),exercises,meta,profile,seed,horizon,policy,measure:()=>performance.now()};
const before=campaign.run(opts);
const runCandidate=process.env.M4PD_ADAPTER?require(path.resolve(process.env.M4PD_ADAPTER)).runCandidate:options=>campaign.run({...options,candidate:true});
const after=runCandidate({...opts});
const pair={profile,seed,horizon,provenance,before,after};
const reviewed=L.comparePair(pair,{catalogue:exercises,metadata:meta,features});
const archiveRoot=path.join(root,'audits/coherence-concrete-20261126/m4');
const oldD=[1,2].flatMap(n=>JSON.parse(fs.readFileSync(path.join(archiveRoot,'reprise-d-native-checkpoints-'+n+'.json'),'utf8'))).find(x=>x.profile===profile&&x.seed===seed);
assert.ok(oldD);
for(const c of reviewed.before){const x=oldD.before.find(v=>v.session===c.session);assert.ok(x);for(const k of [...Object.keys(L.DIRECTION),...L.ZERO,'repeatFamily','ids','themes'])assert.equal(c[k],x[k],'baseline historique '+profile+'/'+seed+'/'+c.session+'/'+k);assert.deepEqual(c.maxGap,x.maxGap);}
fs.mkdirSync(out,{recursive:true});
const file=path.join(out,profile+'-'+seed+'-'+policy+'.json');fs.writeFileSync(file,JSON.stringify(pair));
fs.writeFileSync(file+'.review.json',JSON.stringify(reviewed));
const compact=arm=>arm.sessions.map(s=>s.rows.map(r=>[r.id,r.role,r.reason,r.eligible,r.response.result,r.response.choice,r.response.assisted,r.response.hadFreeError]));
// Compact durable form: catalog SHA fixes the hands/context/level/answer, position is array index.
// Full JSON is also uploaded as an artifact; no inference of eligibility from ID alone.
const packed={profile,seed,horizon,policy,provenance,before:compact(before),after:compact(after),beforeCheckpoints:before.checkpoints,afterCheckpoints:after.checkpoints,changes:after.changes};
const gz=zlib.gzipSync(JSON.stringify(packed)).toString('base64');
const digest=crypto.createHash('sha256').update(gz).digest('hex');
console.log('M4PD_SUMMARY '+JSON.stringify({profile,seed,policy,provenance,changes:reviewed.changes,reservations:reviewed.reservations,before:before.checkpoints,after:after.checkpoints,regressions:reviewed.regressions.filter(x=>x.metric!=='latency-observation'),structure:reviewed.structure,digest,archiveBytes:gz.length}));
for(let i=0;i<gz.length;i+=16000)console.log('M4PD_ARCHIVE '+JSON.stringify({part:i/16000,data:gz.slice(i,i+16000)}));
assert.equal(reviewed.structure.length,0);
