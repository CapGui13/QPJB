'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto');
const base='ccd8f20811b9531bbfccb8352ec60953dd7d07cb', dir='audits/audit3000-20261127/';
const read=p=>fs.readFileSync(p,'utf8'), old=p=>cp.execFileSync('git',['show',base+':'+p],{maxBuffer:20*1024*1024});
const extract=s=>JSON.parse(s.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const baseHtml=old('quizz.html'),sha=crypto.createHash('sha1').update('blob '+baseHtml.length+'\0').update(baseHtml).digest('hex');
assert.equal(sha,'59fb3ca4c826d4f08905b1c5b076b7f09a5304fb');
const b=extract(baseHtml.toString()),a=extract(read('quizz.html')),m=JSON.parse(read(dir+'INTEGRATION-CATALOGUE.json')).byId;
assert.equal(a.exercises.length,3000);assert.deepEqual(a.exercises.map(q=>q.id),b.exercises.map(q=>q.id));
const applied=new Set();for(let i=0;i<3000;i++){const o=b.exercises[i],q=a.exercises[i],x=m[o.id];if(x){assert.deepEqual(x.before,o);assert.deepEqual(x.after,q);assert.notDeepEqual(o,q);applied.add(o.id);}else assert.deepEqual(q,o);}
assert.equal(applied.size,Object.keys(m).length);assert.deepEqual({...a,exercises:b.exercises},b);
console.log('AUDIT3000 exact base/manifest and IDs: PASS',applied.size);
