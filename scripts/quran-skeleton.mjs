// Letters of a Quran text without marks, spelling variants or spaces: two prints that agree here carry the same words.
const MARKS=/[\u0610-\u061A\u064B-\u065F\u0670\u06D5-\u06ED\u08D3-\u08FF\u0640\u200C-\u200F\u06DD\u06DE\u06E9]/g;
const MAP={'ٱ':'ا','أ':'ا','إ':'ا','آ':'ا','ى':'ي','ی':'ي','ک':'ك','ہ':'ه','ۃ':'ة','ھ':'ه','ې':'ي','ے':'ي','ٮ':'ب','ٯ':'ق','ڡ':'ف','ں':'ن','ۀ':'ه'};
// Prints differ in how they spell long vowels and hamza seats (dagger alef or full alef, hamza on a seat or alone), so the
// weak letters and hamza are left out too: what remains is the consonant skeleton of every word, in order.
export const skeleton=t=>t.normalize('NFKD').replace(MARKS,'').replace(/./gu,c=>MAP[c]||c).replace(/[\u0627\u0648\u064A\u0621\u0626\u0624\s]/g,'');
export const BISMILLAH=skeleton('بسم الله الرحمن الرحيم');
// Sources print the bismillah in front of ayah 1 (or not): take it off so both read the same.
export function withoutBismillah(chapter,text){
 if(chapter===1||chapter===9)return text;
 const w=text.trim().split(/\s+/);
 return w.length>4&&skeleton(w.slice(0,4).join(' '))===BISMILLAH?w.slice(4).join(' '):text;
}
