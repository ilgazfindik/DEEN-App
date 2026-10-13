/* French staging UI bridge. NOT referenced by the production entrypoint.
 * Runs only with explicit QA opt-in on loopback; does not store user state. */
(()=>{
 'use strict';
 const local=/^(localhost|127(?:\.\d{1,3}){3}|\[::1\])$/i.test(window.location?.hostname||'');
 if(window.__DEEN_FRENCH_QA__!==true||!local)return;
 if(window.DEEN_FRENCH_STAGE_UI)return;
 const excluded='script,style,noscript,code,textarea,[contenteditable="true"],[data-deen-no-translate],[lang="ar"],.deen-ikhlas-arabic,.deen-mem-arabic,.deen-qj2-ar,.deen-qj2-option.ar';
 const escape=s=>s.replace(/[\^$.*+?()[\]{}|\\]/g,'\\$&');
 const tokenRe=/\{(n|unit|topic)\}/g;
 function template(pattern,translation){
  let cursor=0,match,regex='^',fields=[];
  tokenRe.lastIndex=0;
  while((match=tokenRe.exec(pattern))){
   regex+=escape(pattern.slice(cursor,match.index));
   regex+=match[1]==='n'?'(\\d+)':'(.+?)';
   fields.push(match[1]);cursor=match.index+match[0].length;
  }
  regex+=escape(pattern.slice(cursor))+'$';
  return fields.length?{translation,fields,re:new RegExp(regex,'u')}:null;
 }
 const state={ready:false,locale:'tr',table:new Map(),patterns:[],originals:new WeakMap(),
  attributes:new WeakMap(),writes:0,missing:new Set()};
 function agree(text,fields,values){
  const index=fields.indexOf('n'),n=index<0?NaN:Number(values[index]);
  if(n===1)return text.replace('notions apprises','notion apprise')
    .replace(/\bjours\b/gu,'jour').replace(/\bQUESTIONS\b/gu,'QUESTION');
  return text;
 }
 function translate(raw,lang=state.locale){
  const source=String(raw);
  if(lang!=='fr'||!state.ready)return source;
  const lead=source.match(/^\s*/u)?.[0]||'',tail=source.match(/\s*$/u)?.[0]||'',key=source.trim();
  let text=state.table.get(key);
  if(text==null){
   for(const pattern of state.patterns){
    const found=pattern.re.exec(key);
    if(!found)continue;
    const values=found.slice(1);let i=0;
    text=pattern.translation.replace(tokenRe,()=>values[i++]);
    text=agree(text,pattern.fields,values);break;
   }
  }
  if(text==null){if(key)state.missing.add(key);return source;}
  return lead+text+tail;
 }
 function remember(node,attribute){
  const storage=attribute?state.attributes:state.originals;
  if(attribute){
   const saved=storage.get(node)||{},now=node.getAttribute(attribute);
   if(!saved[attribute]||saved[attribute].output!==now)saved[attribute]={source:now,output:now};
   storage.set(node,saved);return saved[attribute];
  }
  const now=node.nodeValue;let saved=storage.get(node);
  if(!saved||saved.output!==now){saved={source:now,output:now};storage.set(node,saved);}
  return saved;
 }
 function localize(root=window.document?.body,lang=state.locale){
  if(!root||!state.ready)return 0;
  let changed=0,node;const walker=window.document.createTreeWalker(root,window.NodeFilter.SHOW_TEXT);
  while((node=walker.nextNode())){
   if(node.parentElement?.closest?.(excluded)||/[\u0600-\u06ff]/u.test(node.nodeValue))continue;
   const row=remember(node),value=translate(row.source,lang);
   if(node.nodeValue!==value){node.nodeValue=value;changed++;}
   row.output=value;
  }
  for(const element of root.querySelectorAll?.('[aria-label],[title],[placeholder],[alt]')||[]){
   if(element.closest?.(excluded))continue;
   for(const attr of ['aria-label','title','placeholder','alt']){
    if(!element.hasAttribute(attr))continue;
    const row=remember(element,attr),value=translate(row.source,lang);
    if(element.getAttribute(attr)!==value){element.setAttribute(attr,value);changed++;}
    row.output=value;
   }
  }
  state.writes+=changed;return changed;
 }
 function init({staticTranslations,dynamicTranslations}){
  if(state.ready)throw Error('FR_PREVIEW_ALREADY_READY');
  if(!staticTranslations||Object.keys(staticTranslations).length!==1452)throw Error('FR_PREVIEW_STATIC_COVERAGE');
  if(!dynamicTranslations||Object.keys(dynamicTranslations).length!==9)throw Error('FR_PREVIEW_DYNAMIC_COVERAGE');
  for(const [key,value] of Object.entries(staticTranslations))
   if(!key.trim()||typeof value!=='string'||!value.trim())throw Error('FR_PREVIEW_EMPTY_UI');
  state.table=new Map(Object.entries(staticTranslations));
  for(const [key,value] of Object.entries(dynamicTranslations)){
   const pattern=template(key,value);
   if(pattern)state.patterns.push(pattern);
   else if(!state.table.has(key))state.table.set(key,value);
  }
  state.ready=true;
  return {staticKeys:Object.keys(staticTranslations).length,dynamicPatterns:state.patterns.length,
   previewOnly:true,productionActivated:false};
 }
 function setLocale(lang,root=window.document?.body){
  if(!['tr','fr'].includes(lang))throw Error('FR_PREVIEW_BAD_LOCALE');
  state.locale=lang;return localize(root,lang);
 }
 function audit(){return {ready:state.ready,locale:state.locale,staticKeys:state.table.size,
  dynamicPatterns:state.patterns.length,writes:state.writes,
  unrecognized:[...state.missing],productionActivated:false};}
 window.DEEN_FRENCH_STAGE_UI=Object.freeze({init,translate,localize,setLocale,audit,
  version:'fr-staging-preview-v1'});
})();
