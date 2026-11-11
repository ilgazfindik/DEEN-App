// Writes the retired-question list into the engine and makes every place that CHOOSES questions skip them.
// Rendering and answering are deliberately untouched: a retired question that is still stored in a learner's saved lesson
// plays like any other question (audioBlocked() would turn it into a "media unavailable" panel, so it is not used for this).
// Idempotent. Run `node scripts/build-release-manifest.mjs` afterwards.
import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url).pathname;
const dir = root + 'release/v9.9.3-direct/';
const { ids } = JSON.parse(readFileSync(root + 'scripts/learn-extra/retired.json', 'utf8'));
if (new Set(ids).size !== ids.length) throw new Error('duplicate ids in retired.json');

const START = '/*DEEN_RETIRED_START*/', END = '/*DEEN_RETIRED_END*/';
const block = `${START}window.DEEN_RETIRED_IDS=new Set(${JSON.stringify([...ids].sort())});window.deenRetired=q=>window.DEEN_RETIRED_IDS.has(q&&q.id);${END}`;
const esc = (s) => s.replace(/[*/]/g, '\\$&');
const re = new RegExp(esc(START) + '[\\s\\S]*?' + esc(END));

function patch(file, fn) {
  const p = dir + file;
  const before = readFileSync(p, 'utf8');
  const after = fn(before);
  if (after !== before) writeFileSync(p, after);
}
function swap(s, from, to, expected) {
  const parts = s.split(from);
  if (parts.length === 1) return s; // already patched or not present
  if (expected && parts.length - 1 !== expected) throw new Error(`expected ${expected} x ${JSON.stringify(from)}, found ${parts.length - 1}`);
  return parts.join(to);
}
let total = 0;
const selection = (s) => {
  const n0 = (s.match(/deenRetired\(/g) || []).length;
  s = s.replace(/!audioBlocked\(q\)(?!&&!deenRetired)/g, '!audioBlocked(q)&&!deenRetired(q)');
  while (s.includes('&&!deenRetired(q)&&!deenRetired(q)')) s = s.split('&&!deenRetired(q)&&!deenRetired(q)').join('&&!deenRetired(q)');
  s = swap(s, "return !(typeof audioBlocked==='function'&&audioBlocked(q));", "return !(typeof audioBlocked==='function'&&audioBlocked(q))&&!deenRetired(q);");
  s = swap(s, "function safe(q){return !!q && !(typeof audioBlocked==='function'&&audioBlocked(q))}", "function safe(q){return !!q && !(typeof audioBlocked==='function'&&audioBlocked(q))&&!deenRetired(q)}");
  s = swap(s, "function safe640(q){return !!q && !(typeof audioBlocked==='function'&&audioBlocked(q))}", "function safe640(q){return !!q && !(typeof audioBlocked==='function'&&audioBlocked(q))&&!deenRetired(q)}");
  s = swap(s, 'filter(q => !(window.audioBlocked && audioBlocked(q)))', 'filter(q => !(window.audioBlocked && audioBlocked(q)) && !deenRetired(q))');
  total += (s.match(/deenRetired\(/g) || []).length - n0;
  return s;
};
patch('segment-09.txt', (s) => {
  // 1) undo the earlier approach: audioBlocked() back to its original form
  s = s.replace('const audioBlocked=q=>window.DEEN_RETIRED_IDS?.has?.(q?.id)===true||(', 'const audioBlocked=q=>(');
  // 2) the list + helper, right before audioBlocked
  if (re.test(s)) s = s.replace(re, block);
  else {
    const anchor = ' const audioBlocked=q=>(';
    if (s.split(anchor).length !== 2) throw new Error('audioBlocked anchor not found exactly once');
    s = s.replace(anchor, block + anchor);
  }
  return selection(s);
});
for (const f of ['segment-10.txt', 'segment-11.txt', 'segment-12.txt', 'segment-13.txt']) patch(f, selection);
console.log('retired ids:', ids.length, '· selection sites patched this run:', total);
