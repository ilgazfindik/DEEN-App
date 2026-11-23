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
    tf:['True or ','false','?'],word:['Choose the ','missing',' word'],order:['Put them in the ','right',' order'],listen:['Listen and choose the ','right',' answer'],match:['Find the ','matching',' pairs']}},
  ar:{hidden:n=>'يوجد '+n+' خطأ مخفي',hint:'أجب بلمسة واحدة',rapid:'تذكّر · بلا ضغط',style:{child:'أسلوب الأطفال',teen:'أسلوب الشباب',adult:'أسلوب البالغين'},
   title:{choice:['اختر الإجابة ','الصحيحة',''],odd:['ابحث عن ','المختلف',''],error:['اكتشف ','الخطأ',''],scenario:['اختر ','التصرّف الأفضل',''],
    tf:['صحيح أم ','خطأ','؟'],word:['اختر الكلمة ','الناقصة',''],order:['رتّبها ','بالترتيب الصحيح',''],listen:['استمع واختر ','الإجابة الصحيحة',''],match:['ابحث عن ','الأزواج المتطابقة','']}},
  de:{hidden:n=>n===1?'1 FEHLER VERSTECKT':n+' FEHLER VERSTECKT',hint:'MIT EINEM TIPP ANTWORTEN',rapid:'ERINNERN · OHNE DRUCK',style:{child:'LERNSTIL FÜR KINDER',teen:'LERNSTIL FÜR JUGENDLICHE',adult:'LERNSTIL FÜR ERWACHSENE'},
   title:{choice:['Wähle die ','richtige',' Antwort'],odd:['Finde, was ','nicht passt',''],error:['Finde den ','Fehler',''],scenario:['Wähle die ','beste',' Reaktion'],
    tf:['Richtig oder ','falsch','?'],word:['Wähle das ','fehlende',' Wort'],order:['Bring sie in die ','richtige',' Reihenfolge'],listen:['Hör zu und wähle die ','richtige',' Antwort'],match:['Finde die ','passenden',' Paare']}},
  fr:{hidden:n=>n===1?'1 ERREUR CACHÉE':n+' ERREURS CACHÉES',hint:'RÉPONDS EN UN GESTE',rapid:'MÉMOIRE · SANS PRESSION',style:{child:'STYLE ENFANT',teen:'STYLE ADO',adult:'STYLE ADULTE'},
   title:{choice:['Choisis la ','bonne',' réponse'],odd:['Trouve ce qui ','ne va pas',''],error:['Repère l’','erreur',''],scenario:['Choisis la ','meilleure',' réaction'],
    tf:['Vrai ou ','faux',' ?'],word:['Choisis le mot ','manquant',''],order:['Remets-les dans le ','bon',' ordre'],listen:['Écoute et choisis la ','bonne',' réponse'],match:['Trouve les ','paires',' assorties']}}
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
 const GRID_MAX=40; // longer answers read better full width than squeezed into half-width cards
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
 // Each element is checked once (again only when its classes change), and without forcing a
 // layout: the lesson DOM changes constantly and a full rescan was costly on slow phones.
 const floored=new WeakMap();
 function textFloor(root){
  for(const n of root.querySelectorAll('*')){
   const cls=n.getAttribute('class')||'';if(floored.get(n)===cls)continue;
   if(n.closest('svg')){floored.set(n,cls);continue}
   if(![...n.childNodes].some(c=>c.nodeType===3&&c.data.trim()))continue;
   floored.set(n,cls);
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
 // Arabic translates the lesson controls itself, but the matching counter ("0 / 3 eşleşme") and the
 // odd-one-out target ("1 HEDEF") are redrawn on every tap and can land after its pass. Only those
 // two counters are handled here; everything else stays with the Arabic layer.
 function localizeCounters(area){
  const tx=translator('ar')||(()=>null),pairs=tx('eşleşme')||'تطابقات';
  for(const root of [area,document.querySelector('#quizView .v1017-hero')].filter(Boolean)){
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;
   while((n=walker.nextNode())){
    const key=n.data.trim();if(!key||n.parentElement.closest(ANSWER))continue;
    let m=key.match(/^(\d+) \/ (\d+) eşleşme$/);
    if(m){setText(n,n.data.replace(key,m[1]+' / '+m[2]+' '+pairs));continue}
    m=key.match(/^(\d+) HEDEF$/);
    if(m)setText(n,n.data.replace(key,m[1]+' هدف'));
   }
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

 // Instructions at the start of a question ("Boşluğu tamamla: …", "Cevabı görmeden önce … tamamla: …", "Quick review: …",
 // "Vrai ou faux ? …") are moved out of the speech bubble into a small heading above it, so the bubble holds only the question.
 // Display only: the question data, grading and narration source are untouched.
 const LEAD_START=/^(?:boşluğu|ipucu|hızlı|kısa kontrol|temel kavram|kavram kontrolü|kavramları|eşleştirme|uygulama|challenge|aktif|akıllı|eksik|cevabı (?:görmeden|açmadan)|cümleyi|hatırla|tamamla|aşağıdaki kavramları|şu kavramları|complete|fill|remember|recall|choose|select|match|quick|review|concept|basic concept|key concept|practice|apply|challenge|active|smart|before|without|check|ergänze|vervollständige|fülle|erinnere|wähle|ordne|verbinde|kurzer|kurze|schnell|wiederholung|begriff|grundbegriff|anwendung|herausforderung|aktives|bevor|ohne|zuordnung|complète|complete|remplis|rappelle|choisis|associe|relie|révision|vérification|vérifie|contrôle|notion|mise en pratique|défi|rappel|avant|sans|association|أكمل|اكمل|املأ|تذكّر|تذكر|اختر|طابق|صِل|صل|مراجعة|فحص|مفهوم|تطبيق|تحدٍّ|تحد|قبل|بدون|توصيل|تدريب|مطابقة|استرجاع)/i;
 const LEAD_END=/(?:tamamla|doldur|hatırla|seç|eşleştir|tekrar|kontrolü|hatırlama|boşluğu yaz)$/i;
 const LEAD_TF=/^((?:Doğru mu,? yanlış mı|True or false|Richtig oder falsch|Vrai ou faux|صواب أم خطأ|صح أم خطأ)\s*[?؟])\s*/i;
 function splitLead(text){
  let t=String(text||'').trim();const leads=[];
  for(let k=0;k<3;k++){
   let m=t.match(/^\(([^()]{2,40})\)\s*/);
   if(m&&LEAD_START.test(m[1].trim())){leads.push(m[1].trim());t=t.slice(m[0].length);continue}
   m=t.match(LEAD_TF);if(m){leads.push(m[1].trim());t=t.slice(m[0].length);continue}
   m=t.match(/^([^:：«»"“”„\n]{2,90}?)\s*[:：]\s+(?=\S)/);
   if(m){const p=m[1].trim();if(LEAD_START.test(p)||LEAD_END.test(p)){leads.push(p);t=t.slice(m[0].length);continue}}
   break;
  }
  if(!leads.length||t.length<6)return null;
  return {lead:leads.join(' · '),rest:t.charAt(0).toLocaleUpperCase(lang()==='tr'?'tr':undefined)+t.slice(1)};
 }
 function leadQuestion(){
  const frame=document.querySelector('#quizView .question-frame');if(!frame)return;
  const nodes=[document.querySelector('#quizView #questionText'),frame.querySelector('.deen-character-question-text')].filter(Boolean);
  let lead=frame.querySelector(':scope > .ds-q-lead'),found=null;
  for(const q of nodes){
   const n=[...q.childNodes].find(c=>c.nodeType===3&&c.data.trim());if(!n)continue;
   const sp=splitLead(n.data);if(!sp)continue;
   const raw=n.data,lead0=raw.match(/^\s*/)[0];
   // Keep any blank-marker elements that follow the text node; only the leading instruction is removed.
   const rebuilt=lead0+sp.rest+(raw.trim().length<raw.length-lead0.length?raw.slice(lead0.length+raw.trim().length):'');
   if(n.data!==rebuilt)n.data=rebuilt;
   found=found||sp;
  }
  const current=nodes.map(q=>q.textContent.trim()).find(Boolean)||'';
  if(found){
   if(!lead){lead=document.createElement('div');lead.className='ds-q-lead';lead.setAttribute('role','note')}
   if(lead.textContent!==found.lead)lead.textContent=found.lead;
   lead.dataset.rest=found.rest.slice(0,60);
   const anchor=frame.querySelector(':scope > .deen-character-question-row')||frame.querySelector(':scope > #questionText');
   if(anchor&&lead.nextElementSibling!==anchor)anchor.before(lead);
  }else if(lead&&!current.startsWith(lead.dataset.rest||'\u0000')){lead.remove()}
 }
 function decorate(){
  leadQuestion();
  // The matching screen writes its heading as three separate nodes, which the word-level locale layers
  // turn into "Matching pairs Find". Write the whole phrase in the learner's language instead.
  {const T0=L[lang()],mt=T0&&T0.title&&T0.title.match,mh=document.querySelector('#quizView .v9916-task-title');
   if(mt&&mh&&mh.querySelector('.v1013-mint')&&mh.textContent!==mt.join('')){
    mh.textContent='';mh.append(document.createTextNode(mt[0]));
    const em=document.createElement('span');em.className='v1013-mint';em.textContent=mt[1];mh.append(em,document.createTextNode(mt[2]));
   }}
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
  else if(code==='ar')localizeCounters(area);
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

/* Info envelope ("bilgi zarfı"). A sealed envelope appears as soon as a lesson starts, on its first question (after the
   stage's own intro card). A tap breaks the seal, the flap opens, the letter rises and becomes a card in the middle of the
   screen; a tap anywhere shows the next note, or closes the envelope when there is none (swiping works too). When it comes
   and how many notes: see the lesson watcher below. Content is only existing, translated text — explanations of bank
   questions of the same stage (topped up from the same unit), never from questions drawn into this lesson, so no answers
   are given away; a note without a translation in the learner's language is never shown. Automated browsers do not get it
   (it would sit on top of the questions) unless localStorage ilnura_envelope=1 asks for it; ilnura_envelope=0 turns it off. */
(()=>{
 'use strict';
 if(window.DEEN_DS_ENVELOPE)return;
 const T={
  tr:{stage:'Bu aşamanın bilgi zarfı',tap:'Açmak için dokun',skip:'Geç',ok:'Anladım',next:'Devam etmek için ekrana dokun',dyk:'Biliyor muydun?',again:'Bu kavrama bir de böyle bak',kicker:'BİLGİ ZARFI',of:(a,b)=>a+' / '+b},
  en:{stage:'This stage’s envelope',tap:'Tap to open',skip:'Skip',ok:'Got it',next:'Tap anywhere to continue',dyk:'Did you know?',again:'Another look at this idea',kicker:'INFO ENVELOPE',of:(a,b)=>a+' / '+b},
  de:{stage:'Der Umschlag dieser Etappe',tap:'Zum Öffnen tippen',skip:'Überspringen',ok:'Verstanden',next:'Tippe irgendwo, um weiterzumachen',dyk:'Wusstest du schon?',again:'Noch ein Blick auf diesen Begriff',kicker:'INFO-UMSCHLAG',of:(a,b)=>a+' / '+b},
  fr:{stage:'L’enveloppe de cette étape',tap:'Touche pour ouvrir',skip:'Passer',ok:'Compris',next:'Touche l’écran pour continuer',dyk:'Le savais-tu ?',again:'Un autre regard sur cette notion',kicker:'ENVELOPPE',of:(a,b)=>a+' / '+b},
  ar:{stage:'رسالة هذه المرحلة',tap:'المس للفتح',skip:'تخطَّ',ok:'فهمت',next:'المس الشاشة للمتابعة',dyk:'هل تعلم؟',again:'نظرة أخرى إلى هذا المفهوم',kicker:'رسالة معرفية',of:(a,b)=>a+' / '+b}
 };
 const lang=()=>{const l=String(document.documentElement.lang||'tr').slice(0,2).toLowerCase();return T[l]?l:'tr'};
 const t=()=>T[lang()];
 const S=()=>{try{return typeof session==='object'&&session?session:null}catch(_){return null}};
 const pref=()=>{try{return localStorage.getItem('ilnura_envelope')}catch(_){return null}};
 const allowed=()=>{const p=pref();if(p==='0')return false;if(p==='1')return true;return !navigator.webdriver};
 const SEEN='ilnura_envelope_seen';
 const seen=()=>{try{return new Set(JSON.parse(localStorage.getItem(SEEN)||'[]'))}catch(_){return new Set()}};
 const mark=keys=>{try{const s=seen();keys.forEach(k=>s.add(k));localStorage.setItem(SEEN,JSON.stringify([...s].slice(-1500)))}catch(_){}};
 const reduced=()=>document.documentElement.classList.contains('v5-reduce')||matchMedia('(prefers-reduced-motion: reduce)').matches;
 const haptic=k=>{try{window.DEEN_DS_HAPTIC&&DEEN_DS_HAPTIC[k]&&DEEN_DS_HAPTIC[k]()}catch(_){}};

 // The learner's-language explanation of a bank question, or null when there is none to show.
 function note(q){
  if(!q||!q.explanation_tr)return null;
  let e=q.explanation_tr;const l=lang();
  if(l!=='tr'){let tq=null;try{tq=window.DEEN_CONTENT_LOCALE&&DEEN_CONTENT_LOCALE.translateQuestion(q)}catch(_){tq=null}
   if(!tq||!tq.explanation_tr||tq.explanation_tr===q.explanation_tr)return null;e=tq.explanation_tr}
  e=String(e).trim();if(e.length<30||e.length>320)return null;
  if(l!=='tr'&&/[ğışĞİŞ]/.test(e))return null;
  return {id:q.id,concept:q.concept_id||'',text:e};
 }
 const bank=stageId=>{try{return (typeof QUESTIONS!=='undefined'?QUESTIONS:[]).filter(q=>q&&q.stage_id===stageId&&!q.retired)}catch(_){return []}};
 // The lesson's stage. A lesson started from a stage carries its id (U01-S02); the mini lessons that the home screen's
 // "next mini lesson" button and the path cards open carry a mini-lesson id (U01-M02) and mix questions of several stages,
 // so their stage is the one most of their questions come from.
 const STAGE_ID=/^U\d\d-S\d\d$/;
 const stageOf=s=>{
  const own=String(s&&(s.stage&&(s.stage.id||s.stage))||'');if(STAGE_ID.test(own))return own;
  if(!/^U\d\d-M\d\d$/.test(own))return ''; // review sessions and other courses get no envelope
  const count=new Map();
  for(const q of (s&&s.questions)||[]){if(!q)continue;const m=String(q.stage_id||'').match(/^U\d\d-S\d\d$/)||String(q.id||'').match(/U\d\d-S\d\d/);
   if(m){const k=m[0];count.set(k,(count.get(k)||0)+1)}}
  let best='',n=0;for(const [k,v] of count)if(v>n||(v===n&&k<best)){best=k;n=v}
  return best;
 };
 // Notes the learner has not seen come first; once a stage's notes have all been seen they come round again (as a
 // review), so envelopes do not dry up. A note is never repeated within one lesson, and stage-start notes never come
 // from questions drawn into this lesson (no answers are given away).
 function ranked(qs,used){const done=seen();return qs.filter(q=>!used.has(q.id)).sort((x,y)=>(done.has('n:'+x.id)?1:0)-(done.has('n:'+y.id)?1:0))}
 // A stage whose own bank has too few notes (the pilot stages run on their own question set) is topped up from the other
 // stages of the same unit: earlier stages first (a review), then later ones.
 function unitStages(id){try{const u=String(id).slice(0,3);const list=STAGES.filter(x=>String(x.id).slice(0,3)===u).map(x=>x.id);const k=list.indexOf(id);
  return [id,...list.slice(0,Math.max(0,k)).reverse(),...list.slice(k+1)]}catch(_){return [id]}}
 // Notes for a lesson are hints for its own questions: notes on the concepts this lesson asks about (the concept asked
 // most often first), taken from other questions of the stage or unit — so they point towards the answers without giving
 // a question of this lesson away. Only when the lesson's concepts have no such note does a general note of the stage fill
 // in. One note per concept.
 function stageNotes(s,max,used){
  const id=stageOf(s);if(!/^U\d\d-S\d\d$/.test(id))return [];used=used||new Set();max=max||2;
  const qs=(s.questions||[]).filter(Boolean),inSession=new Set(qs.map(q=>q.id));
  const freq=new Map();qs.forEach(q=>{if(q.concept_id)freq.set(q.concept_id,(freq.get(q.concept_id)||0)+1)});
  const order=[...freq.keys()].sort((a,b)=>freq.get(b)-freq.get(a));
  const pool=[];for(const sid of unitStages(id))for(const q of bank(sid))if(!inSession.has(q.id))pool.push(q);
  const out=[],concepts=new Set();
  for(const c of order){
   for(const q of ranked(pool.filter(q=>q.concept_id===c),used)){const n=note(q);if(!n)continue;concepts.add(c);out.push(n);break}
   if(out.length>=max)return out;
  }
  for(const q of ranked(pool,used)){const n=note(q);if(!n||concepts.has(n.concept)||out.some(o=>o.id===n.id))continue;concepts.add(n.concept);out.push(n);if(out.length>=max)break}
  return out;
 }
 // The first and the last stage of a unit (kept for the stage-kind checks; every stage now gets an envelope).
 function important(id){try{const u=String(id).slice(0,3);const list=STAGES.filter(x=>String(x.id).slice(0,3)===u).map(x=>x.id);return list.length>1&&(list[0]===id||list[list.length-1]===id)}catch(_){return false}}

 let open=null;
 function show(kind,title,notes){
  if(open||!notes.length)return false;
  const L=t(),rtl=lang()==='ar';
  const ov=document.createElement('div');ov.className='ds-env-overlay';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label',title);if(rtl)ov.dir='rtl';
  const SEAL='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.1 6.4 6.4 2.1-6.4 2.1L12 19.5l-2.1-6.4L3.5 11l6.4-2.1z"/></svg>';
  const BULB='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.3 1.1 2.2h5c0-.9.5-1.7 1.1-2.2A6 6 0 0 0 12 3z"/></svg>';
  const TAP='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-1.5a1.5 1.5 0 0 1 3 0V11m0-1a1.5 1.5 0 0 1 3 0v4.5A6.5 6.5 0 0 1 11.5 21h-.3a6 6 0 0 1-4.6-2.2L4 15.5a1.6 1.6 0 0 1 2.4-2.1L9 15"/></svg>';
  ov.innerHTML='<div class="ds-env-backdrop"></div>'+
   '<div class="ds-env-stage"><div class="ds-env-aura" aria-hidden="true"><i></i><i></i><i></i></div>'+
    '<div class="ds-env-sparks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>'+
    '<button type="button" class="ds-env-envelope" aria-label="'+L.tap+'">'+
    '<span class="ds-env-back"></span><span class="ds-env-letter"><i></i><i></i><i></i></span><span class="ds-env-front"></span>'+
    '<span class="ds-env-flap"></span><span class="ds-env-seal">'+SEAL+'</span></button>'+
    '<span class="ds-env-pill"></span><p class="ds-env-title"></p><p class="ds-env-hint">'+TAP+'<span></span></p><button type="button" class="ds-env-skip"></button></div>'+
   '<div class="ds-env-card" aria-live="polite"><div class="ds-env-dots"></div>'+
    '<div class="ds-env-head"><span class="ds-env-icon">'+BULB+'</span><div class="ds-env-headtext"><div class="ds-env-kicker"></div><h3 class="ds-env-h"></h3></div></div>'+
    '<div class="ds-env-pages"></div><p class="ds-env-next"></p></div>';
  ov.querySelector('.ds-env-title').textContent=title;ov.querySelector('.ds-env-hint span').textContent=L.tap;ov.querySelector('.ds-env-pill').textContent=L.kicker;
  ov.querySelector('.ds-env-skip').textContent=L.skip;ov.querySelector('.ds-env-kicker').textContent=L.kicker;
  ov.querySelector('.ds-env-h').textContent=title;ov.querySelector('.ds-env-next').textContent=L.next;
  const pages=ov.querySelector('.ds-env-pages'),dots=ov.querySelector('.ds-env-dots');
  notes.forEach((n,i)=>{const p=document.createElement('article');p.className='ds-env-page';const tx=document.createElement('p');tx.textContent=n.text;p.append(tx);pages.append(p);
   if(notes.length>1){const d=document.createElement('i');if(!i)d.className='on';dots.append(d)}});
  if(notes.length<2)dots.remove();
  (document.getElementById('phone')||document.body).append(ov);open={ov,kind,notes};
  requestAnimationFrame(()=>requestAnimationFrame(()=>ov.classList.add('in')));
  let page=0;
  pages.addEventListener('scroll',()=>{const w=pages.clientWidth||1;const i=Math.round(Math.abs(pages.scrollLeft)/w);if(i!==page){page=i;haptic('select');[...dots.children].forEach((d,k)=>d.classList.toggle('on',k<=i))}},{passive:true});
  const env=ov.querySelector('.ds-env-envelope'),skip=ov.querySelector('.ds-env-skip');
  const openIt=()=>{if(ov.classList.contains('opening'))return;ov.classList.add('opening');haptic('tap');mark(notes.map(n=>'n:'+n.id));
   setTimeout(()=>ov.classList.add('opened'),reduced()?0:820)};
  const close=()=>{if(!open||open.ov!==ov||ov.classList.contains('out'))return;ov.classList.add('out');setTimeout(()=>{ov.remove();if(open&&open.ov===ov)open=null;setTimeout(tick,50)},reduced()?0:360)};
  skip.addEventListener('click',e=>{e.stopPropagation();close()});
  // A tap anywhere: on the sealed envelope screen it opens it; on the open card it shows the next note, or closes the
  // envelope after the last one.
  ov.addEventListener('click',e=>{
   if(!ov.classList.contains('opening')){openIt();return}
   if(!ov.classList.contains('opened'))return;
   const w=pages.clientWidth||1,dir=rtl?-1:1;
   if(page<notes.length-1){page++;pages.scrollTo({left:dir*w*page,behavior:reduced()?'auto':'smooth'});haptic('select');[...dots.children].forEach((d,k)=>d.classList.toggle('on',k<=page))}
   else close();
  });
  ov.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  return true;
 }

 // Concept stages teach the unit's ideas: S01–S05 and any "Kavram…" stage; S06/S07 review and test them (kept for the
 // stage-kind checks; every stage now gets an envelope).
 function conceptStage(id){
  const k=+String(id).slice(5,7);if(k>=1&&k<=5)return true;
  try{const st=STAGES.find(x=>x.id===id);return /kavram/i.test(String(st&&st.title||''))}catch(_){return false}
 }
 // Lesson watcher: every lesson of every stage on the learning path opens with an envelope, as soon as the learner enters
 // (on the first question, after the stage's own intro card), with one or two hint notes; none in the middle of a lesson.
 const done=new WeakMap();
 function tick(){
  if(!allowed()||open)return;
  const lesson=document.getElementById('lesson');if(!lesson||!lesson.classList.contains('active'))return;
  const s=S();if(!s||!Array.isArray(s.questions)||!s.questions.length)return;
  // Wait while the stage's own intro card or a dialog is actually on screen (a hidden intro layer can stay in the DOM).
  const onScreen=e=>{if(!e)return false;const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width>2&&r.height>2&&c.display!=='none'&&c.visibility!=='hidden'&&+c.opacity>0.05};
  if([...document.querySelectorAll('.v910-overlay, dialog[open]')].some(onScreen))return;
  const id=stageOf(s);if(!/^U\d\d-S\d\d$/.test(id))return;
  if(done.has(s))return;
  done.set(s,{});
  if((s.index|0)!==0)return;
  const notes=stageNotes(s,2,new Set());
  if(notes.length){mark(['s:'+id]);show('stage',t().stage,notes)}
 }
 function install(){
  const lesson=document.getElementById('lesson');if(!lesson){setTimeout(install,400);return}
  let q=0;new MutationObserver(()=>{if(q)return;q=setTimeout(()=>{q=0;tick()},450)}).observe(lesson,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
 window.DEEN_DS_ENVELOPE=Object.freeze({show,stageNotes,important,conceptStage,note,isOpen:()=>!!open,version:'ds-envelope-4'});
})();
