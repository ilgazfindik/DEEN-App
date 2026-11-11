// Writes the retired-question list into the engine (release segment 09) and makes audioBlocked() skip those questions.
// audioBlocked() is the engine's single "do not offer this question" gate: stage composition, review pools and finals all call it.
// Idempotent. Run `node scripts/build-release-manifest.mjs` afterwards.
import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url).pathname;
const seg = root + 'release/v9.9.3-direct/segment-09.txt';
const { ids } = JSON.parse(readFileSync(root + 'scripts/learn-extra/retired.json', 'utf8'));
if (new Set(ids).size !== ids.length) throw new Error('duplicate ids in retired.json');
let s = readFileSync(seg, 'utf8');
const START = '/*DEEN_RETIRED_START*/', END = '/*DEEN_RETIRED_END*/';
const block = `${START}window.DEEN_RETIRED_IDS=new Set(${JSON.stringify([...ids].sort())});${END}`;
const re = new RegExp(START.replace(/[*/]/g, '\\$&') + '[\\s\\S]*?' + END.replace(/[*/]/g, '\\$&'));
if (re.test(s)) s = s.replace(re, block);
else {
  const anchor = 'const audioBlocked=q=>(';
  if (s.split(anchor).length !== 2) throw new Error('audioBlocked anchor not found exactly once');
  s = s.replace(anchor, block + ' const audioBlocked=q=>window.DEEN_RETIRED_IDS?.has?.(q?.id)===true||(');
}
writeFileSync(seg, s);
console.log('retired ids written:', ids.length);
