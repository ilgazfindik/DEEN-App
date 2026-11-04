/* Unit reviews on the Arabic path: one node at the end of each unit that opens once all its lessons
   are done and asks about ten mixed questions over everything the unit taught (no teaching cards).
   Reviews keep their own progress; the lessons' own records are not touched. */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_REVIEW)return;
 const STORE='deen_arabic_unit_reviews_v1';
 const T={
  tr:{node:'Ünite tekrarı',done:'Tamamlandı',ready:'Tekrara hazır',locked:'Ünitedeki dersleri bitirince açılır',sub:'Bu ünitede öğrendiklerini karışık sorularla pekiştir.',again:'Yeniden tekrar et'},
  en:{node:'Unit review',done:'Completed',ready:'Ready to review',locked:'Opens when the unit’s lessons are done',sub:'Strengthen what you learned in this unit with mixed questions.',again:'Review again'},
  de:{node:'Einheit wiederholen',done:'Abgeschlossen',ready:'Bereit zur Wiederholung',locked:'Öffnet sich nach allen Lektionen der Einheit',sub:'Festige das Gelernte dieser Einheit mit gemischten Fragen.',again:'Noch einmal wiederholen'},
  fr:{node:'Révision de l’unité',done:'Terminée',ready:'Prête à réviser',locked:'S’ouvre une fois les leçons de l’unité terminées',sub:'Consolide ce que tu as appris dans cette unité avec des questions variées.',again:'Réviser encore'},
  ar:{node:'مراجعة الوحدة',done:'مكتمل',ready:'جاهز للمراجعة',locked:'تُفتح بعد إكمال دروس الوحدة',sub:'ثبّت ما تعلّمته في هذه الوحدة بأسئلة متنوعة.',again:'راجع مرة أخرى'}
 };
 function lang(){let c='';try{c=window.DEEN_APP_LOCALE?.get?.()||''}catch(_){}c=String(c||document.documentElement.lang||'tr').slice(0,2).toLowerCase();return T[c]?c:'tr'}
 function done(){try{const d=JSON.parse(localStorage.getItem(STORE)||'null');return Array.isArray(d?.completed)?d.completed:[]}catch(_){return []}}
 function markDone(key){const ids=done();if(!ids.includes(key))ids.push(key);try{localStorage.setItem(STORE,JSON.stringify({schema:1,completed:ids,updatedAt:Date.now()}))}catch(_){}}
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n};
 // Everything a unit taught, as one review payload; repeated words appear once.
 function payload(unit,code){
  if(unit.key==='marks')return {items:window.DEEN_ARABIC_MARKS?.items?.(code)||[]};
  const parts=unit.indices.map(i=>window.DEEN_QURAN_PATHS?.unitItems?.(i)).filter(Boolean);
  if(unit.key==='letters')return {letterIds:parts.flatMap(p=>p.letterIds||[])};
  const seen=new Set(),items=[];
  for(const x of parts.flatMap(p=>p.items||[])){const k=x.glyph+'|'+x.name;if(seen.has(x.glyph)||seen.has(k))continue;seen.add(x.glyph);seen.add(k);items.push(x)}
  return {items};
 }
 function open(unit){
  const code=lang(),t=T[code],p=payload(unit,code);
  if(!window.DEEN_ARABIC_CARDS||!(p.letterIds?.length||p.items?.length>=2))return false;
  return window.DEEN_ARABIC_CARDS.open({...p,review:true,lessonIndex:null,lang:code,ask:'read',title:t.node+' · '+unit.title,subtitle:t.sub,
   onDone:()=>markDone(unit.key),
   onClose:()=>{window.DEEN_QURAN_PATHS?.refresh?.();setTimeout(()=>document.querySelector('#leagueScreenBody .dsq-cur')?.scrollIntoView({block:'center',behavior:'instant'}),220)}});
 }
 const isDone=b=>/\bis-(complete|completed|done)\b/.test(b.className);
 // Units the path shows, with the container their review node joins and the lessons it covers.
 function units(landing,strings){
  const out=[];
  const grid=landing.querySelector(':scope>.deen-path-course-grid');
  if(grid){const ls=[...grid.querySelectorAll('.deen-path-course-item')];out.push({key:'letters',host:grid,title:strings?.lettersUnit||'',lessons:ls,indices:ls.map(b=>b.dataset.lessonIndex)})}
  for(const sec of landing.querySelectorAll(':scope>section')){
   const m=String(sec.className).match(/deen-path-(vowel|reading|marks|word|meaning|phrase|pattern)-section/);if(!m)continue;
   const ls=[...sec.querySelectorAll(':scope>.deen-path-course-item')];if(ls.length<2)continue;
   out.push({key:m[1],host:sec,title:sec.querySelector(':scope>h3')?.textContent||'',lessons:ls,indices:ls.map(b=>b.dataset.lessonIndex).filter(x=>x!=null)});
  }
  return out;
 }
 function attach(landing,strings){
  const code=lang(),t=T[code],finished=done();
  for(const unit of units(landing,strings)){
   if(unit.host.querySelector(':scope>.dsq-review-item'))continue;
   const ready=unit.lessons.every(isDone),complete=finished.includes(unit.key);
   const b=el('button','dsq-review-item'+(complete?' is-completed':'')+(ready?'':' is-locked'));b.type='button';b.disabled=!ready;b.dataset.review=unit.key;
   const top=el('span','deen-path-course-item-top');
   top.append(el('span','deen-path-course-number',t.node),el('span','deen-path-course-status',complete?'✓ '+t.done:ready?t.ready:t.locked));
   b.append(top,el('span','deen-path-course-glyphs dsq-review-glyph'));
   b.setAttribute('aria-label',t.node+' · '+unit.title);
   b.addEventListener('click',()=>open(unit));
   unit.host.append(b);
  }
 }
 window.DEEN_ARABIC_REVIEW=Object.freeze({version:'ds-arabic-review-1',attach,open,done,store:STORE});
})();
