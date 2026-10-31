/* Brand name. The product is Ilnura; the engine, the content packs and the locale dictionaries
   still say DEEN (their Turkish source strings are dictionary keys and must keep matching), so
   what reaches the screen is renamed here: text, accessible attributes and the page title.
   Internal identifiers (DEEN_*, deen-*, storage keys) are not touched.
   - A lone "DEEN" is a wordmark and becomes "ilnura" (lower case, as the logo is written).
   - In an all-caps label it becomes ILNURA (İLNURA in Turkish, where a capital I reads as ı).
   - Elsewhere it becomes Ilnura, and Turkish case endings follow the new name's vowels
     (DEEN’i → Ilnura’yı, DEEN’e → Ilnura’ya, DEEN’in → Ilnura’nın …).
   Outside Turkish the pass waits a moment so the locale layers translate the engine's Turkish
   text (looked up by its DEEN wording) before the name is replaced. */
(()=>{
 'use strict';
 if(window.DEEN_DS_BRAND)return;
 const NAME='Ilnura',MARK='ilnura';
 const lang=()=>String(document.documentElement.lang||'tr').slice(0,2).toLowerCase();
 const TR_ENDINGS={i:'yı',in:'nın',e:'ya',de:'da',den:'dan',deki:'daki',le:'yla',dir:'dır'};
 // No lookbehind (older Safari): the character before the name is captured and put back.
 const WORD=/(^|[^A-Za-z0-9_\-$.])DEEN(?:([’'])([a-zçğıöşüA-ZÇĞİÖŞÜ]+))?(?![A-Za-z0-9_\-])/g;
 function rename(text){
  if(!text||text.indexOf('DEEN')<0)return text;
  if(text.trim()==='DEEN')return text.replace('DEEN',MARK);
  // An all-caps label has capital Latin letters and no small ones (Arabic has no case at all).
  const rest=text.replace(/DEEN/g,'');
  const caps=/[A-ZÇĞİÖŞÜÄËÉÈÊÀÂÎÔÛŒ]/.test(rest)&&!/[a-zçğıöşüäëéèêàâîôûœ]/.test(rest);
  const base=caps?(lang()==='tr'?'İLNURA':'ILNURA'):NAME;
  const out=text.replace(WORD,(all,before,mark,ending)=>{
   if(!mark)return before+base;
   const tr=TR_ENDINGS[ending.toLocaleLowerCase('tr')];
   return before+base+mark+(tr?(caps?tr.toLocaleUpperCase('tr'):tr):ending);
  });
  // French elides "de" before a vowel: d’Ilnura (DEEN began with a consonant, so the texts say "de").
  return lang()==='fr'?out.replace(/\b([Dd])[Ee] (Ilnura|ILNURA)/g,(all,d,name)=>d+'’'+name):out;
 }
 const ATTRS=['aria-label','title','placeholder','alt'];
 const skipped=el=>!el||!!el.closest?.('script,style,textarea,[contenteditable="true"]');
 function fixText(n){if(skipped(n.parentElement))return;const v=n.nodeValue,r=rename(v);if(r!==v)n.nodeValue=r}
 function fixAttrs(el){
  for(const a of ATTRS){const v=el.getAttribute?.(a);if(v&&v.indexOf('DEEN')>=0){const r=rename(v);if(r!==v)el.setAttribute(a,r)}}
 }
 function sweep(root){
  if(!root)return;
  if(root.nodeType===3){fixText(root);return}
  if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
  if(root.nodeType===1){if(skipped(root))return;fixAttrs(root)}
  const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.nodeValue.indexOf('DEEN')>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP});
  for(let n=walk.nextNode();n;n=walk.nextNode())fixText(n);
  root.querySelectorAll?.('[aria-label*="DEEN"],[title*="DEEN"],[placeholder*="DEEN"],[alt*="DEEN"]').forEach(fixAttrs);
 }
 function fixTitle(){const t=document.title;if(t&&t.indexOf('DEEN')>=0)document.title=/^DEEN\b/.test(t)?NAME:rename(t)}
 // Changed nodes are collected and renamed together: at once in Turkish, a moment later elsewhere.
 const pending=new Set();let timer=0;
 function flush(){timer=0;const nodes=[...pending];pending.clear();for(const n of nodes)if(n.isConnected)sweep(n);fixTitle()}
 function queue(n){pending.add(n);if(timer)return;if(lang()==='tr')flush();else timer=setTimeout(flush,150)}
 function install(){
  if(!document.body){setTimeout(install,50);return}
  sweep(document.body);fixTitle();
  new MutationObserver(records=>{
   for(const r of records){
    if(r.type==='childList'){for(const n of r.addedNodes)if(n.nodeType===1||n.nodeType===3)queue(n)}
    else queue(r.target);
   }
  }).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:ATTRS});
  const head=document.querySelector('title');
  if(head)new MutationObserver(fixTitle).observe(head,{childList:true,characterData:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 window.DEEN_DS_BRAND=Object.freeze({version:'ds-brand-1',name:NAME,rename});
})();
