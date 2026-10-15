import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const parts=Array.from({length:67},(_,i)=>readFileSync(root+'release/v9.9.3-direct/segment-'+String(i).padStart(2,'0')+'.txt','utf8'));
const html=parts.slice(0,2).join('\n')+'\n'+parts.slice(2,9).join('')+'\n'+parts.slice(9).join('\n');
let count=0;for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/\bsrc=|application\/json/.test(match[1]))continue;new vm.Script(match[2],{filename:match[1]||'script-'+count});count++}
for(const file of ['boot.js','auth.js','locale.js','content.js','english-ui.js','premium-offer.js','premium-hub.js','quran-arabic-letters.js','quran-arabic-harakat.js','quran-arabic-reading.js','quran-arabic-words.js','quran-arabic-listening.js','quran-arabic-meaning.js','quran-arabic-phrases.js','quran-arabic-patterns.js','quran-arabic-mastery.js','quran-arabic-daily.js','quran-arabic-adaptive.js','quran-arabic-foundation-review.js','quran-arabic-paths.js'])new vm.Script(readFileSync(root+'assets/i18n/'+file,'utf8'),{filename:file});
const index=readFileSync(root+'index.html','utf8');for(const match of index.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(match[1],{filename:'index.html'});
console.log('PASS: '+count+' assembled inline scripts and all startup JavaScript compile');
