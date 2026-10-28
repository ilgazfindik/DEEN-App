/* Lesson answer choices on the design system.
   The lesson engine still renders and grades every question; this layer only adds
   presentation to the choice-based types (multiple choice, card choice, scenario,
   odd one out, error spotting, listening, next word, true/false): A/B/C/D answer cards in a 2×2 grid when every option is
   short (a single column otherwise) and a heading in the reference style (learning-style
   chip, title with a gold accent, star rule). Letters come from a data attribute drawn by
   CSS, so option text, order and state classes stay exactly as the engine set them.
   Sequence building keeps its own tap-to-place flow and only gets the heading and card styling. */
(()=>{
 'use strict';
 if(window.DEEN_DS_LESSON)return;
 const L={
  tr:{hidden:n=>n+' HATA SAKLANIYOR',hint:'TEK DOKUNUŞTA CEVAPLA',rapid:'HATIRLA · BASKI YOK',style:{child:'ÇOCUK ANLATIMI',teen:'GENÇ ANLATIMI',adult:'YETİŞKİN ANLATIMI'},
   title:{choice:['Doğru ','cevabı',' seç'],odd:['Uymayanı ','bul',''],error:['Hatayı ','bul',''],scenario:['En doğru ','davranışı',' seç'],
    tf:['Doğru mu, ','yanlış',' mı?'],word:['Eksik ','kelimeyi',' seç'],order:['Doğru ','sıraya',' diz'],listen:['Dinle ve ','doğru',' cevabı seç']}},
  en:{hidden:n=>n===1?'1 MISTAKE HIDDEN':n+' MISTAKES HIDDEN',hint:'ANSWER WITH ONE TAP',rapid:'RECALL · NO PRESSURE',style:{child:'CHILD LEARNING STYLE',teen:'TEEN LEARNING STYLE',adult:'ADULT LEARNING STYLE'},
   title:{choice:['Choose the ','correct',' answer'],odd:['Find the one that ','doesn’t fit',''],error:['Spot the ','mistake',''],scenario:['Choose the ','best',' response'],
    tf:['True or ','false','?'],word:['Choose the ','missing',' word'],order:['Put them in the ','right',' order'],listen:['Listen and choose the ','right',' answer']}},
  ar:{hidden:n=>'يوجد '+n+' خطأ مخفي',hint:'أجب بلمسة واحدة',rapid:'تذكّر · بلا ضغط',style:{child:'أسلوب الأطفال',teen:'أسلوب الشباب',adult:'أسلوب البالغين'},
   title:{choice:['اختر الإجابة ','الصحيحة',''],odd:['ابحث عن ','المختلف',''],error:['اكتشف ','الخطأ',''],scenario:['اختر ','التصرّف الأفضل',''],
    tf:['صحيح أم ','خطأ','؟'],word:['اختر الكلمة ','الناقصة',''],order:['رتّبها ','بالترتيب الصحيح',''],listen:['استمع واختر ','الإجابة الصحيحة','']}},
  de:{hidden:n=>n===1?'1 FEHLER VERSTECKT':n+' FEHLER VERSTECKT',hint:'MIT EINEM TIPP ANTWORTEN',rapid:'ERINNERN · OHNE DRUCK',style:{child:'LERNSTIL FÜR KINDER',teen:'LERNSTIL FÜR JUGENDLICHE',adult:'LERNSTIL FÜR ERWACHSENE'},
   title:{choice:['Wähle die ','richtige',' Antwort'],odd:['Finde, was ','nicht passt',''],error:['Finde den ','Fehler',''],scenario:['Wähle die ','beste',' Reaktion'],
    tf:['Richtig oder ','falsch','?'],word:['Wähle das ','fehlende',' Wort'],order:['Bring sie in die ','richtige',' Reihenfolge'],listen:['Hör zu und wähle die ','richtige',' Antwort']}},
  fr:{hidden:n=>n===1?'1 ERREUR CACHÉE':n+' ERREURS CACHÉES',hint:'RÉPONDS EN UN GESTE',rapid:'MÉMOIRE · SANS PRESSION',style:{child:'STYLE ENFANT',teen:'STYLE ADO',adult:'STYLE ADULTE'},
   title:{choice:['Choisis la ','bonne',' réponse'],odd:['Trouve ce qui ','ne va pas',''],error:['Repère l’','erreur',''],scenario:['Choisis la ','meilleure',' réaction'],
    tf:['Vrai ou ','faux',' ?'],word:['Choisis le mot ','manquant',''],order:['Remets-les dans le ','bon',' ordre'],listen:['Écoute et choisis la ','bonne',' réponse']}}
 };
 // [container, option] pairs of the choice-based question types.
 const TYPES=[
  {kind:'choice',list:'.options.mc-standard',opt:'.option'},
  {kind:'choice',list:'.options.v852-card-grid',opt:'.option'},
  {kind:'scenario',list:'.v857-decisions',opt:'.option'},
  {kind:'odd',list:'.v858-odd-wrap',opt:'.v858-odd-card'},
  {kind:'error',list:'.v710-clues',opt:'.v710-clue'},
  {kind:'listen',list:'.v710-listen-options',opt:'.v710-listen-option'},
  {kind:'tf',list:'.v710-binary',opt:'button'},
  // The word bank is a single pick for "next word" but a tap-to-place sequence when a builder
  // zone is present; sequences get no letters (blocks move between zones).
  {kind:'order',list:'.v710-word-bank',opt:null,need:'.v710-builder-zone'},
  {kind:'word',list:'.v710-word-bank',opt:'.v710-word-chip'}
 ];
 // True/false shows a check and a cross (engine order: true first) instead of letters.
 const TF_MARKS=['✓','✕'];
 // Options longer than this (characters) do not fit a half-width card at 320–390px.
 const GRID_MAX=64;
 const COMPACT_MAX=24;
 const LETTERS='ABCDEFGH';
 const BOOK='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.5v-15Z"/><path d="M20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.5v-15Z"/></svg>';
 function lang(){
  let code='';try{code=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}
  code=String(code||document.documentElement.lang||'tr').slice(0,2).toLowerCase();
  return L[code]?code:'tr';
 }
 const profile=()=>{try{const p=String(state?.learningProfile||'');return /child|kid/.test(p)?'child':/teen|young/.test(p)?'teen':/adult/.test(p)?'adult':''}catch(_){return ''}};
 // classList.add/toggle report a mutation even when nothing changes; write only real changes.
 const setClass=(el,c,on=true)=>{if(el.classList.contains(c)!==on)el.classList.toggle(c,on)};
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

 // German and French: the locale layers skip #answerArea so answers keep their content-pack
 // text, which also leaves the engine's Turkish controls there untranslated. Translate those
 // controls with the layers' own reviewed tables; answer text itself is never touched.
 const CHROME={
  de:{pair:'Gegenstück',concept:'Begriff',target:n=>n+(n===1?' ZIEL':' ZIELE')},
  fr:{pair:'Correspondance',concept:'Notion',target:n=>n+(n===1?' CIBLE':' CIBLES')}
 };
 const ANSWER='.ds-opt,.option,.option-label,.v710-word-chip,.v710-builder-piece,.v1017-card,.v710-clue,.v858-odd-card,.v710-listen-option,.v710-case,.v857-scene-story,#questionText';
 function translator(code){
  const api=code==='de'?window.DEEN_GERMAN_UI:code==='fr'?window.DEEN_FRENCH_UI:code==='ar'?window.DEEN_ARABIC_UI:null;
  if(!api?.translate)return null;
  return key=>{let v=null;try{v=api.translate(key)}catch(_){}return v&&v!==key?v:null};
 }
 // Write only real changes, so the lesson observer settles after one pass.
 const setText=(node,value)=>{if(value!=null&&node.data!==value)node.data=value};
 const setAttr=(el,name,value)=>{if(value!=null&&el.getAttribute(name)!==value)el.setAttribute(name,value)};
 // The narration buttons ("Soruyu dinle", "Açıklamayı dinle") are added after the locale layers
 // have run, so their Turkish label can stay; translate the label, its aria-label and the idle
 // label the button restores after playback, with the active layer's own table.
 function localizeSpeak(code){
  const tx=translator(code);if(!tx)return;
  for(const b of document.querySelectorAll('#lesson .v960-speak')){
   const label=b.querySelector('[data-v960-label]')||b.querySelector('span:last-child');
   const n=label&&[...label.childNodes].find(c=>c.nodeType===3&&c.data.trim());
   if(n){const v=tx(n.data.trim());if(v)setText(n,v)}
   for(const name of ['aria-label','data-idle-label']){const value=b.getAttribute(name);if(value){const v=tx(value.trim());if(v)setAttr(b,name,v)}}
  }
 }
 function localizeChrome(area,code){
  const C=CHROME[code],tx=C&&translator(code);if(!tx)return;
  const colon=code==='fr'?' : ':': ';
  // The matching hero sits in the question frame, outside #answerArea.
  const roots=[area,document.getElementById('feedback'),document.querySelector('#quizView .v1017-hero')].filter(Boolean);
  for(const root of roots){
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
   while((n=walker.nextNode())){
    const raw=n.data,key=raw.trim();if(!key)continue;
    const el=n.parentElement;
    // Feedback starts with a Turkish lead-in ("Doğru cevap: …", "Kısaca: …") before content text.
    if(el.closest('.feedback-text,#feedbackText')){
     const m=raw.match(/^(\s*)(Doğru cevap|Kısaca|Birlikte düşün):\s*/);
     if(m){const lead=tx(m[2]+':')||(tx(m[2])&&tx(m[2])+colon.trimEnd());if(lead)setText(n,m[1]+lead.trimEnd()+' '+raw.slice(m[0].length))}
     continue;
    }
    if(el.closest(ANSWER))continue;
    // Matching title: the layer translates "<span>Eşleri</span>" but leaves the Turkish verb.
    if(key==='bul'&&el.closest('.v1017-title')){setText(n,'');continue}
    let m=key.match(/^(\d+) \/ (\d+) eşleşme$/);
    if(m){const w=tx('eşleşme');if(w)setText(n,raw.replace(key,m[1]+' / '+m[2]+' '+w));continue}
    m=key.match(/^(\d+) HEDEF$/);
    if(m){setText(n,raw.replace(key,C.target(Number(m[1]))));continue}
    const v=tx(key);if(v)setText(n,raw.replace(key,v));
   }
  }
  // The child profile prefixes translated questions with a Turkish lead-in ("Birlikte düşün: …").
  for(const q of document.querySelectorAll('#quizView #questionText,#quizView .deen-character-question-text')){
   const n=[...q.childNodes].find(c=>c.nodeType===3&&c.data.trim());if(!n)continue;
   const m=n.data.match(/^(\s*)(Birlikte düşün:|Boşluğu doldur:|Hatırla ve tamamla:|Kavramları doğru açıklamalarla eşleştir:)\s*/);
   if(m){const lead=tx(m[2]);setText(n,m[1]+(lead?lead.trimEnd()+' ':'')+n.data.slice(m[0].length))}
  }
  for(const el of area.querySelectorAll('[placeholder],[aria-label],[title]')){
   for(const name of ['placeholder','aria-label','title']){
    const value=el.getAttribute(name);if(!value)continue;
    // Odd one out and matching name their cards "İfade 2: …", "Eş: …", "Kavram: …".
    const m=value.match(/^(İfade) (\d+): (.*)$/)||value.match(/^(Eş|Kavram): (.*)$/);
    if(m){const label=m[1]==='İfade'?tx('İfade'):m[1]==='Eş'?C.pair:C.concept;
     if(label)setAttr(el,name,m.length===4?label+' '+m[2]+': '+m[3]:label+': '+m[2]);continue}
    const v=tx(value.trim());if(v)setAttr(el,name,v);
   }
  }
 }

 function decorate(){
  const area=document.getElementById('answerArea');if(!area)return;
  const frame=area.closest('.question-frame')||document.querySelector('#quizView .question-frame');
  const code=lang(),T=L[code];
  let type=null,list=null;
  for(const t of TYPES){const l=area.querySelector(t.list);if(l&&(!t.need||area.querySelector(t.need))){type=t;list=l;break}}
  if(frame)setClass(frame,'ds-choice-frame',!!list);
  if(list){
   // Cards sit directly in the list for most types; odd-one-out wraps them one level deeper.
   const options=type.opt?[...list.querySelectorAll(type.opt)].filter(o=>!o.parentElement.closest(type.opt)):[];
   // The grid goes on the cards' own parent, so headers inside the list (odd one out) stay above.
   const parent=options[0]?.parentElement;
   if(parent&&options.every(o=>o.parentElement===parent))list=parent;
   setClass(list,'ds-order',type.kind==='order');
   if(options.length>=2||type.kind==='order'){
    setClass(list,'ds-choice');
    options.forEach((o,i)=>{
     const mark=type.kind==='tf'?TF_MARKS[i]||LETTERS[i]:LETTERS[i];
     setClass(o,'ds-opt');if(o.dataset.dsLetter!==mark)o.dataset.dsLetter=mark;
     // Types without the engine's letter badge get a real one (no CSS generated text, which the
     // locale audits forbid). Answers are matched by data-value or .option-label, never by the
     // card's full text, so the extra letter does not affect grading.
     const badge=o.querySelector(':scope>.option-badge');
     if(!badge){const b=document.createElement('span');b.className='option-badge ds-letter';b.setAttribute('aria-hidden','true');b.textContent=mark;o.prepend(b)}
     else if(badge.classList.contains('ds-letter')&&badge.textContent!==mark)badge.textContent=mark;
    });
    const longest=Math.max(...options.map(o=>(o.querySelector('.option-label')?.textContent||o.textContent).trim().length));
    const layout=(options.length===4||options.length===2)&&longest<=GRID_MAX?'grid':'list';
    if(options.length&&list.dataset.dsLayout!==layout)list.dataset.dsLayout=layout;
    // Single words or short phrases get shorter cards, so the check button stays clear of the footer.
    const compact=String(longest<=COMPACT_MAX);if(options.length&&list.dataset.dsCompact!==compact)list.dataset.dsCompact=compact;
    setClass(list,'ds-tf',type.kind==='tf');
    // The German layer skips #answerArea (answer text must come from the content packs), so
    // the one-tap hint is localized here for every language.
    const tag=area.querySelector('.v859-speed-tag');if(tag&&tag.textContent!==T.hint)tag.textContent=T.hint;
    // Error spotting labels its case card in Turkish only ("⌕ 1 HATA SAKLANIYOR").
    const caseTag=area.querySelector('.v710-case .tag'),m=caseTag?.textContent.match(/^(\W*)(\d+) HATA SAKLANIYOR$/);
    // Write only on change: in Turkish the label is already final, and rewriting it would
    // re-trigger the observer forever.
    const label=m&&m[1]+T.hidden(Number(m[2]));
    if(label&&caseTag.textContent!==label)caseTag.textContent=label;
    // True/false ships a Turkish "recall, no pressure" label that English only half translates.
    const rapid=area.querySelector('.v710-rapid-top b');if(rapid&&rapid.textContent!==T.rapid)rapid.textContent=T.rapid;
    // With the classic header (title visible) the heading replaces it above the question;
    // in companion mode (speech bubble) it sits between the question and the options.
    const legacyTitle=frame?.querySelector('.v9916-task-title');
    const classic=frame&&(frame.classList.contains('ds-classic')||visible(legacyTitle));
    if(frame)setClass(frame,'ds-classic',!!classic);
    // One heading per question: rebuild it when the question (or its translation) changes.
    const question=frame?.querySelector('#questionText'),qkey=type.kind+'|'+(question?.textContent||'').trim();
    const existing=document.querySelector('#quizView .ds-mc-head');
    if(existing&&existing.dataset.dsQuestion!==qkey)existing.remove();
    if(!document.querySelector('#quizView .ds-mc-head')){
     const head=heading(type.kind,T);head.dataset.dsQuestion=qkey;
     if(classic&&question)question.before(head);else (type.kind==='order'&&area.querySelector('.v710-builder-zone')||list).before(head);
    }
   }
  }else document.querySelectorAll('#quizView .ds-mc-head').forEach(n=>n.remove());
  if(code==='de'||code==='fr')localizeChrome(area,code);
  if(code==='de'||code==='fr'||code==='ar')localizeSpeak(code);
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
