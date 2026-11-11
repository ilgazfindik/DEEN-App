// Validates filled-in review sheets (CSV, ';' separated) and prints what is really approved.
// Usage: node scripts/review-sheets-report.mjs <sheet.csv> [more.csv ...]
// A row counts as APPROVED only with decision "onay", a named reviewer (and, for the religious sheet, a source).
// Nothing here changes the app: approvals are only counted so a later, reviewed PR can flip the release flags.
import { readFileSync } from 'node:fs';

export function parseCsv(text) {
  text = text.replace(/^﻿/, '');
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ';') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim() !== ''));
}

const DECISIONS = { onay: 'approved', onaylandi: 'approved', duzeltme: 'needs-correction', 'düzeltme': 'needs-correction', ret: 'rejected', red: 'rejected' };
const norm = (s) => String(s || '').trim().toLocaleLowerCase('tr').replace(/\s+/g, ' ');

export function evaluate(text) {
  const rows = parseCsv(text), head = rows.shift() || [];
  const col = (re) => head.findIndex((h) => re.test(norm(h)));
  const iId = col(/^soru no|^review ?id|^reviewid/), iDec = col(/^karar|^decision/);
  const iRev = col(/^inceleyen|^reviewer/), iSrc = col(/^kaynak|^evidence/);
  if (iId < 0 || iDec < 0 || iRev < 0) throw new Error('Sheet is missing the id / decision / reviewer columns');
  const religious = iSrc >= 0;
  const out = { total: 0, approved: [], needsCorrection: [], rejected: [], undecided: [], invalid: [] };
  for (const r of rows) {
    const id = (r[iId] || '').trim(); if (!id) continue; out.total++;
    const raw = norm(r[iDec]); if (!raw) { out.undecided.push(id); continue; }
    const d = DECISIONS[raw];
    if (!d) { out.invalid.push(id + ': unknown decision "' + r[iDec] + '"'); continue; }
    if (d === 'approved') {
      if (!norm(r[iRev])) { out.invalid.push(id + ': approved without a named reviewer'); continue; }
      if (religious && !norm(r[iSrc])) { out.invalid.push(id + ': approved without a source'); continue; }
      out.approved.push(id);
    } else if (d === 'needs-correction') out.needsCorrection.push(id); else out.rejected.push(id);
  }
  return out;
}

if (process.argv[1] && process.argv[1].endsWith('review-sheets-report.mjs') && process.argv.length > 2) {
  for (const f of process.argv.slice(2)) {
    const r = evaluate(readFileSync(f, 'utf8'));
    console.log(`${f}: ${r.total} rows · approved ${r.approved.length} · needs correction ${r.needsCorrection.length} · rejected ${r.rejected.length} · undecided ${r.undecided.length} · invalid ${r.invalid.length}`);
    for (const x of r.invalid) console.log('  INVALID ' + x);
  }
}
