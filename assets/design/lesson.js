/* Lesson multiple choice on the design system.
   The lesson engine still renders #answerArea and grades answers; this layer only adds a
   heading ("Choose the correct answer") above four-option questions and picks the layout:
   a 2×2 card grid when every option is short, a single column of the same cards otherwise.
   Option buttons, their order and their state classes are untouched. */
(()=>{
 'use strict';
 if(window.DEEN_DS_LESSON)return;
 const L={
  tr:{hint:'TEK DOKUNUŞTA CEVAPLA',title:['Doğru ','cevabı',' seç'],style:{child:'ÇOCUK ANLATIMI',teen:'GENÇ ANLATIMI',adult:'YETİŞKİN ANLATIMI'}},
  en:{hint:'ANSWER WITH ONE TAP',title:['Choose the ','correct',' answer'],style:{child:'CHILD LEARNING STYLE',teen:'TEEN LEARNING STYLE',adult:'ADULT LEARNING STYLE'}},
  ar:{hint:'أجب بلمسة واحدة',title:['اختر الإجابة ','الصحيحة',''],style:{child:'أسلوب الأطفال',teen:'أسلوب الشباب',adult:'أسلوب البالغين'}},
  de:{hint:'MIT EINEM TIPP ANTWORTEN',title:['Wähle die ','richtige',' Antwort'],style:{child:'LERNSTIL FÜR KINDER',teen:'LERNSTIL FÜR JUGENDLICHE',adult:'LERNSTIL FÜR ERWACHSENE'}},
  fr:{hint:'RÉPONDS EN UN GESTE',title:['Choisis la ','bonne',' réponse'],style:{child:'STYLE ENFANT',teen:'STYLE ADO',adult:'STYLE ADULTE'}}
 };
 // Options longer than this (characters) do not fit a half-width card at 320–390px.
 const GRID_MAX=64;
 const BOOK='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.5v-15Z"/><path d="M20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.5v-15Z"/></svg>';
 function lang(){
  let code='';try{code=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}
  code=String(code||document.documentElement.lang||'tr').slice(0,2).toLowerCase();
  return L[code]?code:'tr';
 }
 const profile=()=>{try{const p=String(state?.learningProfile||'');return /child|kid/.test(p)?'child':/teen|young/.test(p)?'teen':/adult/.test(p)?'adult':''}catch(_){return ''}};

 function decorate(){
  const area=document.getElementById('answerArea');if(!area)return;
  const list=area.querySelector(':scope>.options.mc-standard');if(!list)return;
  const options=[...list.querySelectorAll(':scope>.option')];if(options.length<2)return;
  const longest=Math.max(...options.map(o=>(o.querySelector('.option-label')?.textContent||o.textContent).trim().length));
  const layout=options.length===4&&longest<=GRID_MAX?'grid':'list';
  if(list.dataset.dsLayout!==layout)list.dataset.dsLayout=layout;
  // The German layer skips #answerArea (answer text must come from the content packs), so the
  // one-tap hint above the options is localized here for every language.
  const tag=area.querySelector(':scope>.v859-speed-tag'),hint=L[lang()].hint;
  if(tag&&tag.textContent!==hint)tag.textContent=hint;
  if(area.querySelector(':scope>.ds-mc-head'))return;
  const code=lang(),T=L[code],head=document.createElement('div');head.className='ds-mc-head';
  const style=T.style[profile()];
  if(style){const chip=document.createElement('span');chip.className='ds-mc-chip';chip.innerHTML=BOOK;chip.append(document.createTextNode(style));head.append(chip)}
  const title=document.createElement('h3');title.className='ds-mc-title';
  title.append(document.createTextNode(T.title[0]));const em=document.createElement('em');em.textContent=T.title[1];title.append(em,document.createTextNode(T.title[2]));
  const rule=document.createElement('span');rule.className='ds-mc-rule';rule.setAttribute('aria-hidden','true');rule.innerHTML='<i></i><b>✦</b><i></i>';
  head.append(title,rule);
  list.before(head);
 }
 let queued=false;
 const schedule=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;decorate()})};
 function install(){
  const area=document.getElementById('answerArea');
  if(!area){setTimeout(install,300);return}
  new MutationObserver(schedule).observe(area,{childList:true});
  decorate();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 window.DEEN_DS_LESSON=Object.freeze({decorate,version:'ds-lesson-mc-v1',strings:L});
})();
