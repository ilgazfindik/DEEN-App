// The app can be installed: manifest, icons of the right size, and the tags in both the loader and the assembled page.
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const m=JSON.parse(readFileSync('manifest.webmanifest','utf8'));
assert(m.name&&m.short_name&&m.start_url&&m.scope&&m.display==='standalone','manifest basics');
assert(/^#[0-9a-f]{6}$/i.test(m.theme_color)&&/^#[0-9a-f]{6}$/i.test(m.background_color),'colours');
const png=f=>{const b=readFileSync(f);assert.equal(b.subarray(1,4).toString(),'PNG',f+' is a PNG');return [b.readUInt32BE(16),b.readUInt32BE(20)]};
const need={'192x192':false,'512x512':false,maskable:false};
for(const i of m.icons){const [w,h]=png(i.src);assert.equal(w+'x'+h,i.sizes,i.src+' is '+i.sizes);if(i.purpose==='maskable')need.maskable=true;else need[i.sizes]=true}
assert(need['192x192']&&need['512x512']&&need.maskable,'192, 512 and a maskable icon');
assert.deepEqual(png('assets/icons/apple-touch-icon.png'),[180,180],'apple touch icon is 180x180');
const tags=['rel="manifest" href="./manifest.webmanifest"','rel="apple-touch-icon"','name="theme-color"','name="apple-mobile-web-app-capable"'];
for(const f of ['index.html','release/v9.9.3-direct/segment-00.txt']){const s=readFileSync(f,'utf8');for(const t of tags)assert(s.includes(t),f+' has '+t)}
console.log('PWA ok:',m.icons.length,'icons, display',m.display);
