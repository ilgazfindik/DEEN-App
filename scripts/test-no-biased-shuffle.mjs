// `array.sort(() => Math.random() - .5)` does not give a uniform shuffle (answer positions would favour some slots).
// Every shuffle in the app must be a Fisher-Yates one; this scans the shipped code for the biased idiom.
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const bad = [];
// only what the app ships (the loader, the release segments and the assets); archived copies and old patches are not loaded
const files = [path.join(root, 'index.html'), path.join(root, 'sw.js')];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'vendor') walk(p); } else if (/\.(js|txt|mjs|css|html)$/.test(e.name)) files.push(p);
  }
})(path.join(root, 'release'));
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'vendor') walk(p); } else if (/\.(js|mjs)$/.test(e.name)) files.push(p);
  }
})(path.join(root, 'assets'));
for (const p of files) if (fs.existsSync(p) && /sort\(\s*\(\s*\)\s*=>\s*Math\.random\(\)\s*-\s*0?\.5\s*\)/.test(fs.readFileSync(p, 'utf8'))) bad.push(path.relative(root, p));
if (bad.length) { console.error('Biased shuffle idiom found in:\n  ' + bad.join('\n  ')); process.exit(1); }
console.log('PASS: no biased sort(() => Math.random() - .5) shuffles in the shipped code');
