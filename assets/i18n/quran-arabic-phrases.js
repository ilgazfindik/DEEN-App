/* DEEN Arabic Phase 8: small Quran vocabulary, phrase comprehension,
   verse-order practice and optional spaced written recall.
   These are teaching glosses, never a substitute for complete translation or tafsir. */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_PHRASES)return;
 const local=values=>Object.freeze(values);
 const vocab=(id,glyph,reference,excerpt,gloss,note)=>Object.freeze({
  id,glyph,reference,excerpt,gloss:local(gloss),note:local(note)
 });
 const phrase=(id,glyph,reference,excerpt,gloss,note)=>Object.freeze({
  id,glyph,reference,excerpt,gloss:local(gloss),note:local(note)
 });
 const order=(id,glyph,reference,parts,gloss)=>Object.freeze({
  id,glyph,reference,excerpt:glyph,parts:Object.freeze(parts),gloss:local(gloss)
 });
 const vocabulary=Object.freeze([
  vocab('vocab-bismi','بِسْمِ','1:1','بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
   {tr:'Adıyla / adına',en:'In the name of',ar:'باسم',de:'Im Namen von',fr:'Au nom de'},
   {tr:'بِ (ile) + اسم (isim) yapısıyla bağlantılıdır.',en:'Combines the preposition bi- with the noun ism.',ar:'الباء حرف جر متصل بالاسم.',de:'Präposition bi- mit dem Wort ism.',fr:'La préposition bi- est liée au nom ism.'}),
  vocab('vocab-alhamdu','ٱلْحَمْدُ','1:2','ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ',
   {tr:'Hamd / övgü',en:'Praise',ar:'الثناء والحمد',de:'Lobpreis',fr:'Louange'},
   {tr:'ٱلْ takısı belirli isim yapar.',en:'The prefix al- marks the definite noun.',ar:'أل للتعريف في الاسم.',de:'al- markiert den bestimmten Ausdruck.',fr:'al- marque le nom défini.'}),
  vocab('vocab-lam','لَمْ','112:3','لَمْ يَلِدْ وَلَمْ يُولَدْ',
   {tr:'-medi / -madı (olumsuzluk)',en:'Did not (negation)',ar:'حرف نفي وجزم',de:'Nicht (Vergangenheit verneint)',fr:'Ne ... pas (passé négatif)'},
   {tr:'Ardından muzari fiil gelir; olumsuz geçmiş anlamı verir.',en:'Used with a jussive imperfect verb to negate a past action.',ar:'تدخل على المضارع فتجزمه وتنفي وقوع الفعل في الماضي.',de:'Verneint ein Geschehen mit einem Verb im Dschussiv.',fr:'Négation du passé suivie d’un verbe à l’inaccompli apocopé.'}),
  vocab('vocab-rabbi','رَبِّ','1:2','ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ',
   {tr:'Rab / sahip ve terbiye eden',en:'Lord / Sustainer',ar:'الرب والمربي',de:'Herr / Erhalter',fr:'Seigneur / Celui qui pourvoit'},
   {tr:'Burada رَبِّ kelimesi esreli biçimdedir.',en:'Here rabbi has a kasra ending.',ar:'كلمة رَبِّ هنا مجرورة بالكسرة.',de:'Hier endet rabbi mit Kasra.',fr:'Ici, rabbi se termine par une kasra.'})
 ]);
 const phrases=Object.freeze([
  phrase('phrase-bismillah','بِسْمِ ٱللَّهِ','1:1','بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
   {tr:'Allah’ın adıyla',en:'In the name of Allah',ar:'باسم الله',de:'Im Namen Allahs',fr:'Au nom d’Allah'},
   {tr:'بِ edatı + isim tamlaması',en:'Preposition + genitive construction',ar:'جار ومجرور مع إضافة',de:'Präposition + Genitivverbindung',fr:'Préposition et construction génitive'}),
  phrase('phrase-alhamdulillah','ٱلْحَمْدُ لِلَّهِ','1:2','ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ',
   {tr:'Hamd Allah’a aittir',en:'Praise belongs to Allah',ar:'الحمد لله',de:'Das Lob gebührt Allah',fr:'La louange appartient à Allah'},
   {tr:'İsimle başlayan kısa ifade',en:'A short nominal construction',ar:'تركيب اسمي قصير',de:'Kurze nominale Wendung',fr:'Courte construction nominale'}),
  phrase('phrase-lamyalid','لَمْ يَلِدْ','112:3','لَمْ يَلِدْ وَلَمْ يُولَدْ',
   {tr:'O doğurmamıştır',en:'He has not begotten',ar:'لم ينجب',de:'Er hat nicht gezeugt',fr:'Il n’a pas engendré'},
   {tr:'Olumsuzluk edatı + fiil',en:'Negation particle + verb',ar:'حرف نفي وجزم + فعل',de:'Negationspartikel + Verb',fr:'Particule négative + verbe'})
 ]);
 const ordering=Object.freeze([
  order('order-ikhlas3','لَمْ يَلِدْ وَلَمْ يُولَدْ','112:3',['لَمْ','يَلِدْ','وَلَمْ','يُولَدْ'],
   {tr:'Doğurmamış ve doğurulmamıştır.',en:'He neither begets nor is born.',ar:'لم يلد ولم يولد.',de:'Er hat weder gezeugt noch ist Er gezeugt worden.',fr:'Il n’a jamais engendré et n’a pas été engendré.'}),
  order('order-fatiha2','ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ','1:2',['ٱلْحَمْدُ','لِلَّهِ','رَبِّ','ٱلْعَـٰلَمِينَ'],
   {tr:'Hamd, âlemlerin Rabbi Allah’a mahsustur.',en:'All praise belongs to Allah, Lord of all worlds.',ar:'الحمد لله رب العالمين.',de:'Alles Lob gehört Allah, dem Herrn der Welten.',fr:'Louange à Allah, Seigneur des mondes.'}),
  order('order-nas1','قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ','114:1',['قُلْ','أَعُوذُ','بِرَبِّ','ٱلنَّاسِ'],
   {tr:'De ki: İnsanların Rabbine sığınırım.',en:'Say: I seek refuge in the Lord of mankind.',ar:'قل أعوذ برب الناس.',de:'Sprich: Ich suche Zuflucht beim Herrn der Menschen.',fr:'Dis : Je cherche refuge auprès du Seigneur des hommes.'})
 ]);
 const lessons=Object.freeze([
  Object.freeze({id:'arabic-phrase-vocab-01',index:21,kind:'phrase-vocab',items:vocabulary}),
  Object.freeze({id:'arabic-phrase-context-01',index:22,kind:'phrase-context',items:phrases}),
  Object.freeze({id:'arabic-phrase-order-01',index:23,kind:'phrase-order',items:ordering})
 ]);
 const reviewCards=Object.freeze([...vocabulary,...phrases]);
 const ids=new Set();
 for(const item of [...reviewCards,...ordering]){
  if(ids.has(item.id))throw Error('ARABIC_PHRASE_DUPLICATE_CARD:'+item.id);ids.add(item.id);
  if(!item.excerpt.includes(item.glyph))throw Error('ARABIC_PHRASE_QUOTE_MISMATCH:'+item.id);
  for(const lang of ['tr','en','ar','de','fr']){
   if(!item.gloss[lang])throw Error('ARABIC_PHRASE_LOCALE_MISSING:'+item.id+':'+lang);
   if(item.note&&!item.note[lang])throw Error('ARABIC_PHRASE_NOTE_MISSING:'+item.id+':'+lang);
  }
  if(item.parts&&item.parts.join(' ')!==item.glyph)throw Error('ARABIC_PHRASE_ORDER_MISMATCH:'+item.id);
 }
 const intervals=Object.freeze([1,3,7,14,30]);
 const delayWrong=10*60*1000;
 function schedule(previous,correct,at=Date.now()){
  const now=Number.isFinite(at)?Math.max(0,at):Date.now();
  const prior=previous&&typeof previous==='object'?previous:null;
  const step=Number.isInteger(prior?.step)&&prior.step>=0&&prior.step<=intervals.length?prior.step:0;
  if(!correct)return Object.freeze({step:0,dueAt:now+delayWrong,updatedAt:now,lastResult:'again'});
  // A mistake requires a short follow-up even if the learner immediately retries successfully.
  if(prior?.lastResult==='again')return Object.freeze({step:0,dueAt:now+delayWrong,updatedAt:now,lastResult:'retry'});
  const days=intervals[Math.min(step,intervals.length-1)];
  return Object.freeze({step:Math.min(step+1,intervals.length),dueAt:now+days*86400000,updatedAt:now,lastResult:'good'});
 }
 window.DEEN_ARABIC_PHRASES=Object.freeze({
  version:1,startIndex:21,lessonCount:3,lessons,reviewCards,
  cardIds:Object.freeze(reviewCards.map(x=>x.id)),schedule,
  reviewStatus:'simple-time-based-written-practice',audioRequired:false
 });
})();
