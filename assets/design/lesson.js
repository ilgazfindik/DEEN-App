/* Lesson answer choices on the design system.
   The lesson engine still renders and grades every question; this layer only adds
   presentation to the choice-based types (multiple choice, card choice, scenario,
   odd one out, error spotting): A/B/C/D answer cards in a 2×2 grid when every option is
   short (a single column otherwise) and a heading in the reference style (learning-style
   chip, title with a gold accent, star rule). Letters come from a data attribute drawn by
   CSS, so option text, order and state classes stay exactly as the engine set them. */
(()=>{
 'use strict';
 if(window.DEEN_DS_LESSON)return;
 const L={
  tr:{hidden:n=>n+' HATA SAKLANIYOR',hint:'TEK DOKUNUŞTA CEVAPLA',style:{child:'ÇOCUK ANLATIMI',teen:'GENÇ ANLATIMI',adult:'YETİŞKİN ANLATIMI'},
   title:{choice:['Doğru ','cevabı',' seç'],odd:['Uymayanı ','bul',''],error:['Hatayı ','bul',''],scenario:['En doğru ','davranışı',' seç']}},
  en:{hidden:n=>n===1?'1 MISTAKE HIDDEN':n+' MISTAKES HIDDEN',hint:'ANSWER WITH ONE TAP',style:{child:'CHILD LEARNING STYLE',teen:'TEEN LEARNING STYLE',adult:'ADULT LEARNING STYLE'},
   title:{choice:['Choose the ','correct',' answer'],odd:['Find the one that ','doesn’t fit',''],error:['Spot the ','mistake',''],scenario:['Choose the ','best',' response']}},
  ar:{hidden:n=>'يوجد '+n+' خطأ مخفي',hint:'أجب بلمسة واحدة',style:{child:'أسلوب الأطفال',teen:'أسلوب الشباب',adult:'أسلوب البالغين'},
   title:{choice:['اختر الإجابة ','الصحيحة',''],odd:['ابحث عن ','المختلف',''],error:['اكتشف ','الخطأ',''],scenario:['اختر ','التصرّف الأفضل','']}},
  de:{hidden:n=>n===1?'1 FEHLER VERSTECKT':n+' FEHLER VERSTECKT',hint:'MIT EINEM TIPP ANTWORTEN',style:{child:'LERNSTIL FÜR KINDER',teen:'LERNSTIL FÜR JUGENDLICHE',adult:'LERNSTIL FÜR ERWACHSENE'},
   title:{choice:['Wähle die ','richtige',' Antwort'],odd:['Finde, was ','nicht passt',''],error:['Finde den ','Fehler',''],scenario:['Wähle die ','beste',' Reaktion']}},
  fr:{hidden:n=>n===1?'1 ERREUR CACHÉE':n+' ERREURS CACHÉES',hint:'RÉPONDS EN UN GESTE',style:{child:'STYLE ENFANT',teen:'STYLE ADO',adult:'STYLE ADULTE'},
   title:{choice:['Choisis la ','bonne',' réponse'],odd:['Trouve ce qui ','ne va pas',''],error:['Repère l’','erreur',''],scenario:['Choisis la ','meilleure',' réaction']}}
 };
 // [container, option] pairs of the choice-based question types.
 const TYPES=[
  {kind:'choice',list:'.options.mc-standard',opt:'.option'},
  {kind:'choice',list:'.options.v852-card-grid',opt:'.option'},
  {kind:'scenario',list:'.v857-decisions',opt:'.option'},
  {kind:'odd',list:'.v858-odd-wrap',opt:'.v858-odd-card'},
  {kind:'error',list:'.v710-clues',opt:'.v710-clue'}
 ];
 // Options longer than this (characters) do not fit a half-width card at 320–390px.
 const GRID_MAX=64;
 const LETTERS='ABCDEFGH';
 const BOOK='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.5v-15Z"/><path d="M20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.5v-15Z"/></svg>';
 function lang(){
  let code='';try{code=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}
  code=String(code||document.documentElement.lang||'tr').slice(0,2).toLowerCase();
  return L[code]?code:'tr';
 }
 const profile=()=>{try{const p=String(state?.learningProfile||'');return /child|kid/.test(p)?'child':/teen|young/.test(p)?'teen':/adult/.test(p)?'adult':''}catch(_){return ''}};
 const visible=el=>!!el&&el.getClientRects().length>0&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden';

 function heading(kind,T){
  const head=document.createElement('div');head.className='ds-mc-head';head.dataset.dsKind=kind;
  const style=T.style[profile()];
  if(style){const chip=document.createElement('span');chip.className='ds-mc-chip';chip.innerHTML=BOOK;chip.append(document.createTextNode(style));head.append(chip)}
  const [a,b,c]=T.title[kind]||T.title.choice,title=document.createElement('h3');title.className='ds-mc-title';
  const em=document.createElement('em');em.textContent=b;title.append(document.createTextNode(a),em,document.createTextNode(c));
  const rule=document.createElement('span');rule.className='ds-mc-rule';rule.setAttribute('aria-hidden','true');rule.innerHTML='<i></i><b>✦</b><i></i>';
  head.append(title,rule);
  return head;
 }

 // Legacy lesson chrome goes down to 7px; lift anything below 12px to 12px.
 function textFloor(root){
  for(const n of root.querySelectorAll('*')){
   if(n.closest('svg')||!n.getClientRects().length)continue;
   if(![...n.childNodes].some(c=>c.nodeType===3&&c.data.trim()))continue;
   const size=parseFloat(getComputedStyle(n).fontSize);
   if(size&&size<12)n.style.setProperty('font-size','12px','important');
  }
 }

 function decorate(){
  const area=document.getElementById('answerArea');if(!area)return;
  const frame=area.closest('.question-frame')||document.querySelector('#quizView .question-frame');
  const code=lang(),T=L[code];
  let type=null,list=null;
  for(const t of TYPES){const l=area.querySelector(t.list);if(l){type=t;list=l;break}}
  if(frame)frame.classList.toggle('ds-choice-frame',!!list);
  if(list){
   // Cards sit directly in the list for most types; odd-one-out wraps them one level deeper.
   const options=[...list.querySelectorAll(type.opt)].filter(o=>!o.parentElement.closest(type.opt));
   // The grid goes on the cards' own parent, so headers inside the list (odd one out) stay above.
   const parent=options[0]?.parentElement;
   if(parent&&options.every(o=>o.parentElement===parent))list=parent;
   if(options.length>=2){
    list.classList.add('ds-choice');
    options.forEach((o,i)=>{
     o.classList.add('ds-opt');if(o.dataset.dsLetter!==LETTERS[i])o.dataset.dsLetter=LETTERS[i];
     // Types without the engine's letter badge get a real one (no CSS generated text, which the
     // locale audits forbid). Answers are matched by data-value or .option-label, never by the
     // card's full text, so the extra letter does not affect grading.
     const badge=o.querySelector(':scope>.option-badge');
     if(!badge){const b=document.createElement('span');b.className='option-badge ds-letter';b.setAttribute('aria-hidden','true');b.textContent=LETTERS[i];o.prepend(b)}
     else if(badge.classList.contains('ds-letter')&&badge.textContent!==LETTERS[i])badge.textContent=LETTERS[i];
    });
    const longest=Math.max(...options.map(o=>(o.querySelector('.option-label')?.textContent||o.textContent).trim().length));
    const layout=options.length===4&&longest<=GRID_MAX?'grid':'list';
    if(list.dataset.dsLayout!==layout)list.dataset.dsLayout=layout;
    // The German layer skips #answerArea (answer text must come from the content packs), so
    // the one-tap hint is localized here for every language.
    const tag=area.querySelector('.v859-speed-tag');if(tag&&tag.textContent!==T.hint)tag.textContent=T.hint;
    // Error spotting labels its case card in Turkish only ("⌕ 1 HATA SAKLANIYOR").
    const caseTag=area.querySelector('.v710-case .tag'),m=caseTag?.textContent.match(/^(\W*)(\d+) HATA SAKLANIYOR$/);
    // Write only on change: in Turkish the label is already final, and rewriting it would
    // re-trigger the observer forever.
    const label=m&&m[1]+T.hidden(Number(m[2]));
    if(label&&caseTag.textContent!==label)caseTag.textContent=label;
    // With the classic header (title visible) the heading replaces it above the question;
    // in companion mode (speech bubble) it sits between the question and the options.
    const legacyTitle=frame?.querySelector('.v9916-task-title');
    const classic=frame&&(frame.classList.contains('ds-classic')||visible(legacyTitle));
    if(frame)frame.classList.toggle('ds-classic',!!classic);
    // One heading per question: rebuild it when the question (or its translation) changes.
    const question=frame?.querySelector('#questionText'),qkey=type.kind+'|'+(question?.textContent||'').trim();
    const existing=document.querySelector('#quizView .ds-mc-head');
    if(existing&&existing.dataset.dsQuestion!==qkey)existing.remove();
    if(!document.querySelector('#quizView .ds-mc-head')){
     const head=heading(type.kind,T);head.dataset.dsQuestion=qkey;
     if(classic&&question)question.before(head);else list.before(head);
    }
   }
  }else document.querySelectorAll('#quizView .ds-mc-head').forEach(n=>n.remove());
  floor();
 }
 // Some lesson chrome (energy, progress, reactions) is added after the question renders.
 let floorTimer=0;
 function floor(){
  const lesson=document.getElementById('lesson');if(!lesson?.classList.contains('active'))return;
  // Throttled: lesson animations mutate the DOM continuously.
  if(floorTimer)return;
  floorTimer=setTimeout(()=>{floorTimer=0;textFloor(lesson)},250);
 }
 let queued=false;
 const schedule=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;decorate()})};
 function install(){
  const lesson=document.getElementById('lesson');
  if(!lesson){setTimeout(install,300);return}
  // Locale layers may replace #answerArea or the question text, so watch the whole lesson;
  // decorate() is idempotent and only writes when something is missing.
  new MutationObserver(schedule).observe(lesson,{childList:true,subtree:true,characterData:true});
  decorate();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 window.DEEN_DS_LESSON=Object.freeze({decorate,version:'ds-lesson-choice-v2',strings:L});
})();
