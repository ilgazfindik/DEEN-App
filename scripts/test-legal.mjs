// The privacy policy and the terms exist in all five languages with the same structure, and the public pages exist.
import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const win={document:undefined,navigator:{language:'tr'}};
vm.runInNewContext(readFileSync('assets/design/legal.js','utf8'),{window:win,navigator:win.navigator,location:{search:''},localStorage:{getItem(){return null}}});
const L=win.DEEN_LEGAL;assert(L,'DEEN_LEGAL defined');
assert.equal(L.publisher,'ILGAZ FINDIK');
const shape=d=>d.map(s=>[s[1].length,s[1].map(p=>Array.isArray(p)?p.length:0).join(',')].join(':')).join('|');
for(const doc of ['privacy','terms']){
 const base=L.docs.tr[doc];assert(base.length>=10,doc+' has sections');
 for(const lang of ['en','de','fr','ar']){
  const d=L.docs[lang][doc];
  assert.equal(shape(d),shape(base),doc+' has the same structure in '+lang);
  for(const s of d){assert(s[0].trim()&&s[1].every(p=>Array.isArray(p)?p.every(x=>x.trim()):p.trim()),'no empty text '+lang+' '+doc)}
 }
}
for(const lang of ['tr','en','de','fr','ar']){const u=L.ui[lang];for(const k of ['row','privacy','terms','updated','close','contact','email','feedback','consent','lang','home'])assert(u[k]&&u[k].trim(),'ui '+k+' '+lang);assert(L.updated[lang],'date '+lang)}
assert(L.contact.email||/^https:\/\//.test(L.contact.web),'a way to reach the publisher is shown');
for(const f of ['legal/privacy.html','legal/terms.html'])assert(existsSync(f),f+' exists');
// What the policy claims must stay true: no analytics/ad SDK in the shipped code.
const shipped=readFileSync('index.html','utf8');
for(const bad of ['googletagmanager','google-analytics','gtag(','adsbygoogle','facebook.net','hotjar','segment.com','sentry.io'])assert(!shipped.includes(bad),'the policy says there is no tracking, but index.html mentions '+bad);
console.log('Legal pages ok: 5 languages x 2 documents, same structure');
