/* Source-guarded question adapter. Missing packs never return Turkish questions. */
(()=>{
 if(window.DEEN_CONTENT_LOCALE)return;
 const loaded=new Map(),loading=new Map();
 const manifest=()=>window.__DEEN_CONTENT_MANIFEST__;
 const same=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
 const blanks=s=>(String(s||'').match(/_{2,}|\[\s*\]|\{blank\}/g)||[]).length;
 function raw(question){return question?.__deenSourceQuestion||question}
 function validate(source,entry){
  if(!source||!entry||!entry.source||!entry.display)return false;
  for(const field of ['question_tr','explanation_tr','activity_type','options_tr','correct_answer','pairs','items','correct_order'])if(!same(source[field],entry.source[field]))return false;
  const d=entry.display;
  if(typeof d.question_tr!=='string'||!d.question_tr.trim()||typeof d.explanation_tr!=='string'||!d.explanation_tr.trim())return false;
  if(blanks(source.question_tr)!==blanks(d.question_tr))return false;
  if(source.activity_type==='matching'){
   if(!Array.isArray(d.pairs)||d.pairs.length!==source.pairs?.length||d.pairs.some(p=>!p?.left?.trim()||!p?.right?.trim()))return false;
  }else if(source.activity_type==='build_sequence'){
   if(!Array.isArray(d.items)||d.items.length!==source.items?.length||new Set(d.items).size!==d.items.length)return false;
   if(!Array.isArray(d.correct_order)||d.correct_order.length!==source.correct_order?.length)return false;
   const indices=source.correct_order.map(item=>source.items.indexOf(item));
   if(indices.some((index,i)=>index<0||d.items[index]!==d.correct_order[i]))return false;
  }else if(Array.isArray(source.options_tr)){
   if(!Array.isArray(d.options_tr)||d.options_tr.length!==source.options_tr.length)return false;
   const index=source.options_tr.indexOf(source.correct_answer);
   if(index<0||d.options_tr[index]!==d.correct_answer||d.options_tr.filter(x=>x===d.correct_answer).length!==1)return false;
  }else if(typeof d.correct_answer!=='string'||!d.correct_answer.trim())return false;
  return true;
 }
 function translateQuestion(question,lang=window.DEEN_APP_LOCALE.get()){
  let source=raw(question);if(lang==='tr')return source;
  if(lang==='ar')return window.DEEN_ARABIC_PILOT?.translateQuestion?.(source)||null;
  const candidates=loaded.get(lang)?.questions?.[source?.id];const entries=Array.isArray(candidates)?candidates:[candidates];let entry=entries.find(e=>validate(source,e));
  if(!entry&&lang==='en'&&source?.playful_pilot===true&&source.playful_version==='7.3.0'&&typeof source.legacy_question_tr==='string'){const canonical={...source,question_tr:source.legacy_question_tr};entry=entries.find(e=>validate(canonical,e));if(entry)source=canonical;}
  if(!entry)return null;
  return {...source,...entry.display,__deenContentLocale:lang,__deenSourceQuestion:source};
 }
 function inspectBank(rows,lang=window.DEEN_APP_LOCALE.get()){
  const failedIds=rows.filter(q=>!translateQuestion(q,lang)).map(q=>q.id);return {sourceCount:rows.length,translated:rows.length-failedIds.length,failedIds};
 }
 async function preload(lang){
  if(lang==='tr')return true;
  if(lang==='ar')return !!await window.DEEN_ARABIC_PILOT?.preload?.();
  const config=manifest()?.languages?.[lang];
  if(config?.question_data!=='complete'||!qaReady(lang,config)||!(config.bank||config.parts?.length))return false;
  if(loaded.has(lang))return true;if(loading.has(lang))return loading.get(lang);
  const job=(async()=>{
   try{
    const json=async(part)=>{
     const response=await fetch(part.path+'?build='+encodeURIComponent(window.__DEEN_DEPLOY_ID__||''),{cache:'no-store'});
     if(!response.ok)throw Error('CONTENT_HTTP:'+part.path);
     const text=await response.text();
     if(part.sha256){const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));const hash=Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('');if(hash!==part.sha256)throw Error('CONTENT_HASH:'+part.path);}
     return JSON.parse(text);
    };
    const questions=Object.create(null);
    if(config.parts?.length){
     const packs=await Promise.all(config.parts.map(json));
     for(let i=0;i<packs.length;i++){
      const pack=packs[i];
      if(pack.locale!==lang||pack.schema_version!==1||pack.expert_approved!==false||pack.verified_by_religious_expert!==false||Object.keys(pack.translations||{}).length!==config.parts[i].count)throw Error('CONTENT_SCHEMA:'+config.parts[i].path);
      for(const [id,entry] of Object.entries(pack.translations)) {
       // German must not admit an invalid stored/legacy variant merely because it
       // is absent from the initial 1,484 active-question snapshot.
       if(lang==='de'&&!validate(entry?.source,entry))throw Error('CONTENT_VARIANT_INVALID:'+id);
       (questions[id]||(questions[id]=[])).push(entry);
      }
      window.DEEN_BOOT?.progress?.(i+1,packs.length);
     }
    }else{const pack=await json({path:config.bank});if(pack.locale!==lang||pack.schema_version!==1||pack.expert_approved!==false||!pack.questions)return false;Object.assign(questions,pack.questions);}
    loaded.set(lang,{questions});
    const base=inspectBank(window.DEEN_BASE_QUESTIONS||[],lang),active=inspectBank(QUESTIONS,lang);
    if(base.sourceCount!==manifest().required_base_questions||active.sourceCount!==manifest().required_active_questions||base.failedIds.length||active.failedIds.length){console.error('[DEEN content source]',JSON.stringify({locale:lang,base:base.sourceCount,active:active.sourceCount,baseFailed:base.failedIds.slice(0,8),activeFailed:active.failedIds.slice(0,8)}));loaded.delete(lang);return false;}
    return true;
   }catch(error){console.error('[DEEN content]',String(error?.message||error));return false;}finally{loading.delete(lang);}
  })();loading.set(lang,job);return job;
 }
 function qaReady(lang,config){return config?.global_qa==='passed'||lang==='en'&&config?.global_qa==='pending'&&window.__DEEN_LOCALIZATION_QA__===true}
 function available(lang){const config=manifest()?.languages?.[lang];return ['tr','ar'].includes(lang)||config?.question_data==='complete'&&qaReady(lang,config)}
 function translateText(text,lang=window.DEEN_APP_LOCALE.get()){
  if(lang!=='en'&&lang!=='de')return text;
  const sourceText=String(text),tables=loaded.get(lang)?.questions;
  if(!tables)return text;
  let current;try{current=session?.questions?.[session.index]}catch(_){}
  const source=current?.__deenSourceQuestion;
  function lookup(entry){
   const s=entry?.source,d=entry?.display;if(!s||!d)return null;
   for(const k of ['question_tr','explanation_tr','correct_answer'])if(s[k]===sourceText)return d[k];
   for(const k of ['options_tr','items','correct_order'])for(let i=0;i<(s[k]?.length||0);i++)if(s[k][i]===sourceText)return d[k][i];
   for(let i=0;i<(s.pairs?.length||0);i++)for(const k of ['left','right'])if(s.pairs[i][k]===sourceText)return d.pairs[i][k];
   return null;
  }
  const candidates=tables[source?.id]||[];
  for(const e of Array.isArray(candidates)?candidates:[candidates])if(validate(source,e)){const value=lookup(e);if(value)return value;
   const stripped=String(e.source.question_tr).replace(/^(?:Boşluğu tamamla|Eksik kavramı seç|Kayıp kelime(?:yi bul)?|İpucu olmadan tamamla|Boşluğu doldur):\s*/i,'');
   if(stripped===sourceText){const prefix=lang==='de'?/^(?:Ergänze die Lücke|Ergänze den Satz|Finde das fehlende Wort|Wähle den fehlenden Begriff|Fülle die Lücke aus):\s*/i:/^(?:Complete the sentence|Choose the missing concept|Missing word|Find the missing word|Complete without a hint|Fill in the blank):\s*/i;return e.display.question_tr.replace(prefix,'');}
  }
  // A known German source must never borrow the translation of a different question variant.
  if(lang==='de'&&source?.id)return text;
  // Shared hints and labels use the same guarded pack entries, never an independent language bank.
  if(!loaded.get(lang).textMap){const map=new Map(),conflicts=new Set();const add=(key,value)=>{if(typeof key!=='string'||typeof value!=='string')return;if(lang==='de'&&map.has(key)&&map.get(key)!==value){map.delete(key);conflicts.add(key);return;}if(!conflicts.has(key)&&!map.has(key))map.set(key,value);};for(const entries of Object.values(tables))for(const e of Array.isArray(entries)?entries:[entries]){const s=e.source,d=e.display;for(const k of ['question_tr','explanation_tr','correct_answer'])add(s[k],d[k]);for(const k of ['options_tr','items','correct_order'])for(let i=0;i<(s[k]?.length||0);i++)add(s[k][i],d[k]?.[i]);for(let i=0;i<(s.pairs?.length||0);i++)for(const k of ['left','right'])add(s.pairs[i][k],d.pairs?.[i]?.[k]);}loaded.get(lang).textMap=map;}
  return loaded.get(lang).textMap.get(sourceText)||text;
 }
 window.DEEN_CONTENT_LOCALE=Object.freeze({preload,translateQuestion,translateText,inspectBank,validate,available,manifest,version:'global-content-guard-v2'});
})();
