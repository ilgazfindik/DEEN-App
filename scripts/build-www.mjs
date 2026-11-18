#!/usr/bin/env node
// Builds ./www: the exact files the app needs at runtime, for the Capacitor (iOS) shell.
// Source of truth stays the repository root (GitHub Pages serves it as-is). www/ is generated and git-ignored.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'www');
const FILES = ['index.html', 'manifest.webmanifest', 'sw.js'];
const DIRS = ['assets', 'release', 'legal'];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of FILES) fs.copyFileSync(path.join(root, f), path.join(out, f));
for (const d of DIRS) fs.cpSync(path.join(root, d), path.join(out, d), { recursive: true, filter: (s) => !/(^|\/)\.DS_Store$/.test(s) });

let files = 0, bytes = 0;
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else { files++; bytes += fs.statSync(p).size; } } })(out);
console.log(`www ready: ${files} files, ${(bytes / 1048576).toFixed(1)} MiB`);
