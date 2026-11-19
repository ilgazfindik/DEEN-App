// Every companion picture must be a complete, decodable file. Chrome forgives a truncated PNG; iOS WebKit shows nothing, which made the
// character vanish whenever the lesson swapped to its "correct" pose (cat_correct.png, lion_correct.png were truncated).
// PNG: chunk CRCs, IEND present, the IDAT data inflates to exactly the size the header promises. WebP: RIFF length matches the file.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'assets');
const crcTable = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = (buf) => { let c = -1; for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
function checkPng(buf) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (buf.length < 33 || !buf.subarray(0, 8).equals(sig)) return 'not a PNG';
  let pos = 8, idat = [], w = 0, h = 0, depth = 0, ctype = 0, interlace = 0, sawEnd = false;
  while (pos + 12 <= buf.length) {
    const len = buf.readUInt32BE(pos), type = buf.toString('latin1', pos + 4, pos + 8);
    if (pos + 12 + len > buf.length) return `chunk ${type} runs past the end of the file`;
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (buf.readUInt32BE(pos + 8 + len) !== crc32(buf.subarray(pos + 4, pos + 8 + len))) return `bad CRC in ${type}`;
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); depth = data[8]; ctype = data[9]; interlace = data[12]; }
    if (type === 'IDAT') idat.push(data);
    if (type === 'IEND') { sawEnd = true; break; }
    pos += 12 + len;
  }
  if (!sawEnd) return 'no IEND (truncated)';
  let raw; try { raw = zlib.inflateSync(Buffer.concat(idat)); } catch (e) { return 'image data does not inflate: ' + e.message; }
  if (!interlace) {
    const ch = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ctype] || 1, rowBytes = Math.ceil(w * ch * depth / 8);
    if (raw.length !== h * (rowBytes + 1)) return `image data is ${raw.length} bytes, expected ${h * (rowBytes + 1)}`;
  }
  return null;
}
function checkWebp(buf) {
  if (buf.length < 16 || buf.toString('latin1', 0, 4) !== 'RIFF' || buf.toString('latin1', 8, 12) !== 'WEBP') return 'not a WebP';
  return buf.readUInt32LE(4) + 8 === buf.length ? null : `RIFF says ${buf.readUInt32LE(4) + 8} bytes, file has ${buf.length}`;
}
const bad = []; let n = 0;
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!/(^|\/)companions\//.test(p.replace(/\\/g, '/'))) continue;
    const buf = fs.readFileSync(p);
    const err = /\.png$/i.test(p) ? checkPng(buf) : /\.webp$/i.test(p) ? checkWebp(buf) : null;
    if (/\.(png|webp)$/i.test(p)) n++;
    if (err) bad.push(`${path.relative(root, p)}: ${err}`);
  }
})(root);
if (bad.length) { console.error('Broken companion pictures:\n  ' + bad.join('\n  ')); process.exit(1); }
console.log(`PASS: ${n} companion pictures are complete files`);
