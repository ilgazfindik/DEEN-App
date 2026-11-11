import assert from 'node:assert/strict';
import { evaluate, parseCsv } from './review-sheets-report.mjs';
const head = 'Soru No;Soru;KARAR (onay / düzeltme / ret);Kaynak (ilmihal);İnceleyen kişi;Notlar\n';
const sheet = head +
 'A1;"soru; ile ""tırnak""";onay;Diyanet İlmihali s.12;Ali Veli;\n' +   // approved
 'A2;x;onay;;Ali Veli;\n' +                                                // no source -> invalid
 'A3;x;onay;kaynak;;\n' +                                                  // no reviewer -> invalid
 'A4;x;düzeltme;;Ali Veli;metni değiştir\n' +                              // needs correction
 'A5;x;ret;;Ali Veli;\n' +                                                 // rejected
 'A6;x;;;;\n' +                                                            // undecided
 'A7;x;belki;;Ali Veli;\n';                                                // unknown decision
const r = evaluate(sheet);
assert.deepEqual(r.approved, ['A1']); assert.deepEqual(r.needsCorrection, ['A4']); assert.deepEqual(r.rejected, ['A5']);
assert.deepEqual(r.undecided, ['A6']); assert.equal(r.invalid.length, 3); assert.equal(r.total, 7);
assert.equal(parseCsv(sheet)[1][1], 'soru; ile "tırnak"');
// Translation sheet (no source column): reviewer is still required.
const t = evaluate('Soru No;KARAR;İnceleyen (ana dili)\nB1;onay;Maria\nB2;onay;\n');
assert.deepEqual(t.approved, ['B1']); assert.equal(t.invalid.length, 1);
assert.throws(() => evaluate('a;b\n1;2\n'));
console.log('Review sheet checks ok');
