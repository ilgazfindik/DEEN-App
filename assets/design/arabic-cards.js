/* Card-first letter lessons: each new letter arrives as a teaching card and is asked about at once,
   using only letters already taught. A wrong answer shows a short reminder and the question returns
   at the end of the lesson. The Arabic path engine opens this layer and saves the result itself. */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_CARDS)return;
 const AR_FONT='"Noto Naskh Arabic","Geeza Pro","Arabic Typesetting","Traditional Arabic",serif';
 // Shape family and dots for every letter: [family, dot count, 'a'bove/'b'elow].
 const DESC={alif:['stroke',0],ba:['boat',1,'b'],ta:['boat',2,'a'],tha:['boat',3,'a'],jim:['hook',1,'b'],hha:['hook',0],kha:['hook',1,'a'],
  dal:['angle',0],dhal:['angle',1,'a'],ra:['tail',0],zay:['tail',1,'a'],sin:['teeth',0],shin:['teeth',3,'a'],sad:['loop',0],dad:['loop',1,'a'],
  tta:['stick',0],zza:['stick',1,'a'],ayn:['mouth',0],ghayn:['mouth',1,'a'],fa:['fa',1,'a'],qaf:['qaf',2,'a'],kaf:['kaf',0],lam:['lam',0],
  mim:['mim',0],nun:['nun',1,'a'],ha:['ring',0],waw:['waw',0],ya:['ya',2,'b']};
 const SHAPE={
  tr:{stroke:'Yukarıdan aşağı dik bir çizgi.',boat:'Kayık gibi yayvan bir çanak.',hook:'Üstte bir şapka, altta açık bir kanca.',angle:'Küçük, köşeli bir dirsek.',tail:'Satırın altına inen kısa bir kuyruk.',teeth:'Üç küçük diş ve yuvarlak bir kuyruk.',loop:'Yatık bir halka ve yuvarlak bir kuyruk.',stick:'Yatık bir halka ve üstünde dik bir çubuk.',mouth:'Üstte açık bir ağız, altta geniş bir kanca.',fa:'Küçük yuvarlak bir baş ve düz bir gövde.',qaf:'Yuvarlak bir baş ve derin bir çanak.',kaf:'Uzun bir gövde, içinde küçük bir işaret.',lam:'Uzun bir çizgi ve altta yuvarlak bir kanca.',mim:'Küçük yuvarlak bir baş ve aşağı inen kuyruk.',nun:'Yuvarlak, derin bir çanak.',ring:'Küçük, yuvarlak bir halka.',waw:'Yuvarlak bir baş ve aşağı kıvrılan kuyruk.',ya:'Kıvrımlı bir gövde ve geri dönen kuyruk.'},
  en:{stroke:'A single upright stroke.',boat:'A wide, shallow bowl like a boat.',hook:'A cap on top and an open hook below.',angle:'A small angled elbow.',tail:'A short tail that dips below the line.',teeth:'Three small teeth and a round tail.',loop:'A flat loop and a round tail.',stick:'A flat loop with an upright stick.',mouth:'An open mouth on top and a wide hook below.',fa:'A small round head on a flat body.',qaf:'A round head and a deep bowl.',kaf:'A tall body with a small mark inside.',lam:'A tall stroke ending in a round hook.',mim:'A small round head with a tail going down.',nun:'A round, deep bowl.',ring:'A small round ring.',waw:'A round head with a tail curling down.',ya:'A curving body with a tail that sweeps back.'},
  de:{stroke:'Ein einzelner senkrechter Strich.',boat:'Eine flache Schale wie ein Boot.',hook:'Oben ein Dach, unten ein offener Haken.',angle:'Ein kleiner, eckiger Winkel.',tail:'Ein kurzer Schwanz, der unter die Zeile reicht.',teeth:'Drei kleine Zähne und ein runder Bogen.',loop:'Eine flache Schlaufe und ein runder Bogen.',stick:'Eine flache Schlaufe mit senkrechtem Strich.',mouth:'Oben ein offener Mund, unten ein weiter Haken.',fa:'Ein kleiner runder Kopf auf flachem Körper.',qaf:'Ein runder Kopf und eine tiefe Schale.',kaf:'Ein hoher Körper mit kleinem Zeichen darin.',lam:'Ein hoher Strich mit rundem Haken unten.',mim:'Ein kleiner runder Kopf mit Schwanz nach unten.',nun:'Eine runde, tiefe Schale.',ring:'Ein kleiner runder Ring.',waw:'Ein runder Kopf mit nach unten gebogenem Schwanz.',ya:'Ein geschwungener Körper mit zurückschwingendem Schwanz.'},
  fr:{stroke:'Un simple trait vertical.',boat:'Une coupe plate comme une barque.',hook:'Un chapeau en haut et un crochet ouvert en bas.',angle:'Un petit coude anguleux.',tail:'Une courte queue qui descend sous la ligne.',teeth:'Trois petites dents et une queue arrondie.',loop:'Une boucle allongée et une queue arrondie.',stick:'Une boucle allongée surmontée d’une tige.',mouth:'Une bouche ouverte en haut et un large crochet en bas.',fa:'Une petite tête ronde sur un corps plat.',qaf:'Une tête ronde et une coupe profonde.',kaf:'Un grand corps avec un petit signe à l’intérieur.',lam:'Un trait haut terminé par un crochet rond.',mim:'Une petite tête ronde avec une queue vers le bas.',nun:'Une coupe ronde et profonde.',ring:'Un petit anneau rond.',waw:'Une tête ronde et une queue qui descend en courbe.',ya:'Un corps courbé avec une queue qui revient.'},
  ar:{stroke:'خطّ واحد قائم.',boat:'جسم مسطّح يشبه القارب.',hook:'رأس في الأعلى وتجويف مفتوح في الأسفل.',angle:'شكل صغير بزاوية.',tail:'ذيل قصير ينزل تحت السطر.',teeth:'ثلاث أسنان صغيرة وذيل مستدير.',loop:'عقدة مستطيلة وذيل مستدير.',stick:'عقدة مستطيلة فوقها عصا قائمة.',mouth:'رأس مفتوح في الأعلى وتجويف واسع في الأسفل.',fa:'رأس صغير مستدير على جسم مسطّح.',qaf:'رأس مستدير وتجويف عميق.',kaf:'جسم طويل بداخله علامة صغيرة.',lam:'خطّ طويل ينتهي بتجويف مستدير.',mim:'رأس صغير مستدير وذيل نازل.',nun:'تجويف مستدير عميق.',ring:'حلقة صغيرة مستديرة.',waw:'رأس مستدير وذيل منحنٍ للأسفل.',ya:'جسم منحنٍ وذيل يرتدّ إلى الخلف.'}
 };
 const T={
  tr:{newLetter:'YENİ HARF',rule:'KURAL',form:'YAZILIŞ',listen:'Dinle',cont:'Devam',check:'Kontrol et',got:'Anladım',which:n=>'Hangisi '+n+'?',whatName:'Bu harf hangisi?',hear:'Duyduğun harfe dokun',match:'Harfleri adlarıyla eşleştir',
   dotsQ:(c,p)=>c===0?'Hangisinde nokta yok?':'Hangisinin '+(p==='a'?'üstünde ':'altında ')+c+' nokta var?',
   dots:(c,p)=>c===0?'Noktası yok.':(p==='a'?'Üstünde ':'Altında ')+c+' nokta var.',dotsShort:(c,p)=>c===0?'nokta yok':(p==='a'?'üstte ':'altta ')+c+' nokta',
   ruleTitle:'Noktalar harfi değiştirir',ruleSub:'Benzer harfleri noktaların sayısı ve yeri ayırır.',
   joinTitle:'Kelime başında kısalır',joinSub:'Bu harfler kelimenin başında sonraki harfe bağlanır ve kuyruklarını bırakır. Noktalar yerinde kalır.',initialQ:n=>n+' kelime başında nasıl yazılır?',
   noJoinTitle:'Sonraki harfe bağlanmaz',noJoinSub:'Bu harfler kendilerinden sonra gelen harfle birleşmez; kelimenin başında da aynı yazılır.',noJoinQ:'Hangisi sonraki harfe bağlanmaz?',
   praise:['Harika!','Doğru!','Çok iyi!','Tam isabet!'],matched:'Hepsini eşleştirdin.',streak:n=>n+' doğru üst üste',streakTag:n=>n+' seri',remember:'Hatırla',again:'Bu soru az sonra yeniden gelecek.',retry:'TEKRAR DENE',
   matchHint:'Harfi ve adını birlikte seç.',done:'Ders tamamlandı!',learned:'Bu derste öğrendiklerin',acc:'DOĞRULUK',time:'SÜRE',best:'EN UZUN SERİ',quitTitle:'Dersten çıkılsın mı?',quitSub:'Bu dersteki ilerlemen kaydedilmez.',quitStay:'Derse devam et',quitLeave:'Çık',close:'Dersten çık',progress:'Ders ilerlemesi',replay:'Sesi tekrar çal'},
  en:{newLetter:'NEW LETTER',rule:'RULE',form:'WRITING',listen:'Listen',cont:'Continue',check:'Check',got:'Got it',which:n=>'Which one is '+n+'?',whatName:'Which letter is this?',hear:'Tap the letter you hear',match:'Match the letters to their names',
   dotsQ:(c,p)=>c===0?'Which one has no dots?':'Which one has '+c+' dot'+(c>1?'s':'')+(p==='a'?' above?':' below?'),
   dots:(c,p)=>c===0?'No dots.':c+' dot'+(c>1?'s':'')+(p==='a'?' above.':' below.'),dotsShort:(c,p)=>c===0?'no dots':c+(p==='a'?' above':' below'),
   ruleTitle:'Dots change the letter',ruleSub:'Similar letters differ only in the number and place of their dots.',
   joinTitle:'Shorter at the start of a word',joinSub:'At the start of a word these letters join the next letter and drop their tail. The dots stay where they are.',initialQ:n=>'How is '+n+' written at the start of a word?',
   noJoinTitle:'Does not join forward',noJoinSub:'These letters never join the letter after them, so they look the same at the start of a word.',noJoinQ:'Which one does not join the next letter?',
   praise:['Great!','Correct!','Well done!','Spot on!'],matched:'All matched.',streak:n=>n+' in a row',streakTag:n=>n+' streak',remember:'Remember',again:'This question comes back in a moment.',retry:'TRY AGAIN',
   matchHint:'Pick a letter and its name together.',done:'Lesson complete!',learned:'Letters from this lesson',acc:'ACCURACY',time:'TIME',best:'BEST STREAK',quitTitle:'Leave the lesson?',quitSub:'Progress in this lesson will not be saved.',quitStay:'Keep learning',quitLeave:'Leave',close:'Leave lesson',progress:'Lesson progress',replay:'Play the sound again'},
  de:{newLetter:'NEUER BUCHSTABE',rule:'REGEL',form:'SCHREIBWEISE',listen:'Anhören',cont:'Weiter',check:'Prüfen',got:'Verstanden',which:n=>'Welcher ist '+n+'?',whatName:'Welcher Buchstabe ist das?',hear:'Tippe auf den Buchstaben, den du hörst',match:'Ordne die Buchstaben ihren Namen zu',
   dotsQ:(c,p)=>c===0?'Welcher hat keine Punkte?':'Welcher hat '+c+' Punkt'+(c>1?'e':'')+(p==='a'?' oben?':' unten?'),
   dots:(c,p)=>c===0?'Keine Punkte.':c+' Punkt'+(c>1?'e':'')+(p==='a'?' oben.':' unten.'),dotsShort:(c,p)=>c===0?'keine Punkte':c+(p==='a'?' oben':' unten'),
   ruleTitle:'Punkte ändern den Buchstaben',ruleSub:'Ähnliche Buchstaben unterscheiden sich nur durch Zahl und Lage der Punkte.',
   joinTitle:'Am Wortanfang kürzer',joinSub:'Am Wortanfang verbinden sich diese Buchstaben mit dem nächsten und verlieren ihren Schwanz. Die Punkte bleiben.',initialQ:n=>'Wie schreibt man '+n+' am Wortanfang?',
   noJoinTitle:'Verbindet nicht nach links',noJoinSub:'Diese Buchstaben verbinden sich nie mit dem folgenden Buchstaben und sehen am Wortanfang gleich aus.',noJoinQ:'Welcher verbindet sich nicht mit dem nächsten Buchstaben?',
   praise:['Super!','Richtig!','Sehr gut!','Genau!'],matched:'Alles zugeordnet.',streak:n=>n+' richtig in Folge',streakTag:n=>n+' in Folge',remember:'Merke',again:'Diese Frage kommt gleich noch einmal.',retry:'NOCH EINMAL',
   matchHint:'Wähle einen Buchstaben und seinen Namen.',done:'Lektion geschafft!',learned:'Buchstaben aus dieser Lektion',acc:'GENAUIGKEIT',time:'ZEIT',best:'BESTE SERIE',quitTitle:'Lektion verlassen?',quitSub:'Der Fortschritt dieser Lektion wird nicht gespeichert.',quitStay:'Weiterlernen',quitLeave:'Verlassen',close:'Lektion verlassen',progress:'Lektionsfortschritt',replay:'Ton noch einmal abspielen'},
  fr:{newLetter:'NOUVELLE LETTRE',rule:'RÈGLE',form:'ÉCRITURE',listen:'Écouter',cont:'Continuer',check:'Vérifier',got:'Compris',which:n=>'Laquelle est '+n+' ?',whatName:'Quelle est cette lettre ?',hear:'Touche la lettre que tu entends',match:'Associe les lettres à leur nom',
   dotsQ:(c,p)=>c===0?'Laquelle n’a aucun point ?':'Laquelle a '+c+' point'+(c>1?'s':'')+(p==='a'?' au-dessus ?':' dessous ?'),
   dots:(c,p)=>c===0?'Aucun point.':c+' point'+(c>1?'s':'')+(p==='a'?' au-dessus.':' dessous.'),dotsShort:(c,p)=>c===0?'aucun point':c+(p==='a'?' dessus':' dessous'),
   ruleTitle:'Les points changent la lettre',ruleSub:'Des lettres semblables ne diffèrent que par le nombre et la place des points.',
   joinTitle:'Plus courte en début de mot',joinSub:'En début de mot, ces lettres se lient à la suivante et perdent leur queue. Les points restent en place.',initialQ:n=>'Comment s’écrit '+n+' en début de mot ?',
   noJoinTitle:'Ne se lie pas à la suivante',noJoinSub:'Ces lettres ne se lient jamais à la lettre suivante ; en début de mot elles gardent la même forme.',noJoinQ:'Laquelle ne se lie pas à la lettre suivante ?',
   praise:['Bravo !','Correct !','Très bien !','Parfait !'],matched:'Tout est associé.',streak:n=>n+' d’affilée',streakTag:n=>n+' d’affilée',remember:'À retenir',again:'Cette question reviendra dans un instant.',retry:'ENCORE UNE FOIS',
   matchHint:'Choisis une lettre et son nom.',done:'Leçon terminée !',learned:'Lettres de cette leçon',acc:'PRÉCISION',time:'TEMPS',best:'MEILLEURE SÉRIE',quitTitle:'Quitter la leçon ?',quitSub:'Ta progression dans cette leçon ne sera pas enregistrée.',quitStay:'Continuer',quitLeave:'Quitter',close:'Quitter la leçon',progress:'Progression de la leçon',replay:'Rejouer le son'},
  ar:{newLetter:'حرف جديد',rule:'قاعدة',form:'الكتابة',listen:'استمع',cont:'متابعة',check:'تحقّق',got:'فهمت',which:n=>'أيّها '+n+'؟',whatName:'ما اسم هذا الحرف؟',hear:'المس الحرف الذي تسمعه',match:'صِل كل حرف باسمه',
   dotsQ:(c,p)=>c===0?'أيّها بلا نقاط؟':'أيّها '+({1:'فيه نقطة واحدة',2:'فيه نقطتان',3:'فيه ثلاث نقاط'}[c])+(p==='a'?' فوقه؟':' تحته؟'),
   dots:(c,p)=>c===0?'بلا نقاط.':({1:'نقطة واحدة',2:'نقطتان',3:'ثلاث نقاط'}[c])+(p==='a'?' فوقه.':' تحته.'),dotsShort:(c,p)=>c===0?'بلا نقاط':({1:'نقطة',2:'نقطتان',3:'ثلاث نقاط'}[c])+(p==='a'?' فوق':' تحت'),
   ruleTitle:'النقاط تغيّر الحرف',ruleSub:'الحروف المتشابهة يميّزها عدد النقاط ومكانها.',
   joinTitle:'يقصر في أول الكلمة',joinSub:'في أول الكلمة تتصل هذه الحروف بما بعدها ويختفي ذيلها، وتبقى النقاط في مكانها.',initialQ:n=>'كيف يُكتب '+n+' في أول الكلمة؟',
   noJoinTitle:'لا يتصل بما بعده',noJoinSub:'هذه الحروف لا تتصل أبدًا بالحرف الذي يليها، فيبقى شكلها في أول الكلمة كما هو.',noJoinQ:'أيّها لا يتصل بالحرف الذي بعده؟',
   praise:['رائع!','صحيح!','أحسنت!','إصابة تامة!'],matched:'وصلت الجميع.',streak:n=>n+' إجابات صحيحة متتالية',streakTag:n=>n+' متتالية',remember:'تذكّر',again:'سيعود هذا السؤال بعد قليل.',retry:'حاول مجددًا',
   matchHint:'اختر الحرف واسمه معًا.',done:'اكتمل الدرس!',learned:'حروف هذا الدرس',acc:'الدقّة',time:'الوقت',best:'أطول سلسلة',quitTitle:'هل تريد مغادرة الدرس؟',quitSub:'لن يُحفظ تقدّمك في هذا الدرس.',quitStay:'تابع التعلّم',quitLeave:'مغادرة',close:'مغادرة الدرس',progress:'تقدّم الدرس',replay:'أعد تشغيل الصوت'}
 };
 const ICON={
  speak:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  close:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'
 };
 const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
 const arText=(e,text)=>{e.textContent=text;e.lang='ar';e.dir='rtl';return e};

 /* Lesson plan: card → question for each letter, then a dots rule, a match, and the writing rules. */
 function buildSteps(letters,known,L,audioOk){
  const C=window.DEEN_ARABIC_LETTERS,get=id=>C.get(id),steps=[];
  const taught=[...known];
  const fam=id=>DESC[id]?.[0],dotKey=id=>(DESC[id]?.[1]||0)+(DESC[id]?.[2]||'');
  const others=(x,n,pool)=>{
   // Same-shape letters first: they are the ones learners confuse.
   const cand=shuffle(pool.filter(id=>id!==x));cand.sort((a,b)=>(fam(b)===fam(x))-(fam(a)===fam(x)));
   return cand.slice(0,n);
  };
  letters.forEach((x,i)=>{
   const twin=taught.filter(id=>fam(id)===fam(x)).pop();
   steps.push({k:'card',kind:'new',id:x,vs:twin||null});
   taught.push(x);
   const pool=taught.filter(id=>id!==x);
   if(pool.length)steps.push({k:'q',type:'pick',id:x,opts:shuffle([x,...others(x,i===0?1:Math.min(2,pool.length),taught)])});
   if(i>=1){
    if(audioOk(x)&&i%2===0)steps.push({k:'q',type:'listen',id:x,opts:shuffle([x,...others(x,2,taught)])});
    else steps.push({k:'q',type:'name',id:x,opts:shuffle([x,...others(x,Math.min(2,pool.length),letters.slice(0,i+1).concat(known))])});
   }
  });
  steps.push({k:'card',kind:'rule',ids:letters.slice(0,5)});
  steps.push({k:'q',type:'match',ids:shuffle(letters).slice(0,4)});
  // A dots question whose answer is the only option with that dot pattern.
  for(const x of shuffle(letters)){
   const rest=shuffle(taught.filter(id=>id!==x&&dotKey(id)!==dotKey(x)));
   const picks=[];for(const id of rest){if(picks.length===2)break;if(!picks.some(p=>dotKey(p)===dotKey(id)))picks.push(id)}
   if(picks.length===2){steps.push({k:'q',type:'dots',id:x,opts:shuffle([x,...picks])});break}
  }
  const joiners=letters.filter(id=>get(id).joinsNext),stay=letters.filter(id=>!get(id).joinsNext);
  if(joiners.length){
   const show=joiners.slice(0,3);
   steps.push({k:'card',kind:'join',ids:show});
   const x=shuffle(show)[0],pool=taught.filter(id=>get(id).joinsNext&&id!==x);
   if(pool.length)steps.push({k:'q',type:'initial',id:x,opts:shuffle([x,...others(x,Math.min(2,pool.length),pool)])});
  }
  if(stay.length){
   steps.push({k:'card',kind:'nojoin',ids:stay.slice(0,4)});
   const x=shuffle(stay)[0],pool=taught.filter(id=>get(id).joinsNext);
   if(pool.length>=1)steps.push({k:'q',type:'nojoin',id:x,opts:shuffle([x,...shuffle(pool).slice(0,2)])});
  }
  return steps;
 }

 let host=null,run=null;
 function close(){
  window.DEEN_ARABIC_LETTER_AUDIO?.stop?.();
  document.removeEventListener('keydown',onKey,true);
  host?.remove();host=null;run=null;document.documentElement.classList.remove('dac-open');
 }
 function onKey(e){if(e.key==='Escape'&&run){e.preventDefault();askQuit()}}
 function sound(kind){try{window.DEEN_DS_SOUND?.play?.(kind)}catch(_){}}

 function open(opts){
  const C=window.DEEN_ARABIC_LETTERS;if(!C||!opts||!Array.isArray(opts.letterIds)||!opts.letterIds.length)return false;
  close();
  const lang=T[opts.lang]?opts.lang:'tr',L=T[lang],S=SHAPE[lang];
  const AUDIO=window.DEEN_ARABIC_LETTER_AUDIO,audioOk=id=>!!AUDIO?.available?.(id);
  const name=id=>C.get(id)?.names?.[lang]||C.get(id)?.names?.en||id,glyph=id=>C.get(id)?.glyph||'';
  const dotsOf=id=>L.dots(DESC[id]?.[1]||0,DESC[id]?.[2]),dotsShort=id=>L.dotsShort(DESC[id]?.[1]||0,DESC[id]?.[2]);
  const play=id=>{if(audioOk(id))AUDIO.play(id)};
  const steps=buildSteps(opts.letterIds,(opts.known||[]).filter(id=>C.get(id)),L,audioOk);
  run={opts,queue:steps.map(s=>({s})),total:steps.length,done:0,first:0,asked:0,combo:0,best:0,missed:new Set(),started:Date.now(),cur:null,sel:null,phase:'',matchBad:false};
  const pet=(()=>{let p='owl';try{p=window.state?.profile?.companion||p}catch(_){}return String(p).replace(/[^a-z]/g,'')||'owl'})();
  const img=pose=>'assets/companions/'+pet+'/'+pet+'_'+pose+'.png';

  host=el('div','dac');host.id='dsArabicCards';host.setAttribute('role','dialog');host.setAttribute('aria-modal','true');host.dir=lang==='ar'?'rtl':'ltr';host.lang=lang;
  host.style.setProperty('--dac-ar',AR_FONT);
  host.innerHTML='<div class="dac-top"><button type="button" class="dac-x"></button><div class="dac-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"><i></i></div><span class="dac-combo"></span></div><div class="dac-body"></div><div class="dac-foot"><div class="dac-fb"><img alt=""><div><h3></h3><p></p></div><span class="dac-mini"></span></div><button type="button" class="dac-cta"></button></div>';
  const $=s=>host.querySelector(s),body=$('.dac-body'),foot=$('.dac-foot'),cta=$('.dac-cta');
  $('.dac-x').innerHTML=ICON.close;$('.dac-x').setAttribute('aria-label',L.close);$('.dac-x').addEventListener('click',askQuit);
  $('.dac-bar').setAttribute('aria-label',L.progress);
  $('.dac-fb img').addEventListener('error',e=>{if(!e.target.src.includes('/owl/'))e.target.src=e.target.src.replace(/companions\/[a-z]+\/[a-z]+_/,'companions/owl/owl_')});
  document.body.append(host);document.documentElement.classList.add('dac-open');document.addEventListener('keydown',onKey,true);

  const setBar=()=>{const p=Math.round(run.done/run.total*100);$('.dac-bar i').style.width=p+'%';$('.dac-bar').setAttribute('aria-valuenow',String(p))};
  const feedback=(state,title,text,mini,pose)=>{
   foot.classList.remove('is-ok','is-bad');if(state)foot.classList.add(state);
   $('.dac-fb h3').textContent=title||'';$('.dac-fb p').textContent=text||'';arText($('.dac-mini'),mini||'');if(pose)$('.dac-fb img').src=img(pose);
  };
  function next(){
   setBar();
   if(!run.queue.length)return finish();
   run.cur=run.queue.shift();run.sel=null;run.matchBad=false;feedback();
   const s=run.cur.s;body.textContent='';body.scrollTop=0;
   const box=el('div','dac-step');body.append(box);
   cta.className='dac-cta';
   if(s.k==='card'){renderCard(s,box);cta.disabled=false;cta.textContent=L.cont;run.phase='card';return}
   run.phase='ask';cta.textContent=L.check;cta.disabled=true;
   if(run.cur.retry)box.append(el('span','dac-tag is-rule',L.retry));
   const prompt=el('h2','dac-prompt');box.append(prompt);
   if(s.type==='pick')prompt.textContent=L.which(name(s.id));
   else if(s.type==='name')prompt.textContent=L.whatName;
   else if(s.type==='listen')prompt.textContent=L.hear;
   else if(s.type==='match')prompt.textContent=L.match;
   else if(s.type==='dots')prompt.textContent=L.dotsQ(DESC[s.id]?.[1]||0,DESC[s.id]?.[2]);
   else if(s.type==='initial')prompt.textContent=L.initialQ(name(s.id));
   else if(s.type==='nojoin')prompt.textContent=L.noJoinQ;
   if(s.type==='match')renderMatch(s,box);else renderChoices(s,box);
  }
  function renderCard(s,box){
   box.append(el('span','dac-tag '+(s.kind==='new'?'is-new':'is-rule'),s.kind==='new'?L.newLetter:s.kind==='rule'?L.rule:L.form));
   const c=el('div','dac-card');box.append(c);
   if(s.kind==='new'){
    c.append(arText(el('div','dac-big'),glyph(s.id)),el('div','dac-name',name(s.id)),el('div','dac-tip',S[DESC[s.id][0]]+' '+dotsOf(s.id)));
    if(audioOk(s.id)){const b=el('button','dac-hear');b.type='button';b.innerHTML=ICON.speak;b.append(el('span','',L.listen));b.addEventListener('click',()=>play(s.id));c.append(b);setTimeout(()=>{if(run&&run.cur?.s===s)play(s.id)},350)}
    if(s.vs){const vs=el('div','dac-vs');const side=(id,hi)=>{const d=el('div','');d.append(arText(el('b',hi?'is-hi':''),glyph(id)),el('span','',name(id)));return d};vs.append(side(s.vs,false),el('span','dac-ne','≠'),side(s.id,true));c.append(vs)}
   }else if(s.kind==='rule'){
    c.append(el('div','dac-name is-sm',L.ruleTitle),el('div','dac-tip',L.ruleSub));
    const rows=el('div','dac-rows');for(const id of s.ids){const r=el('div','');const t=el('span','');t.append(el('strong','',name(id)),el('em','',dotsShort(id)));r.append(arText(el('b',''),glyph(id)),t);rows.append(r)}c.append(rows);
   }else{
    c.append(el('div','dac-name is-sm',s.kind==='join'?L.joinTitle:L.noJoinTitle));
    const forms=el('div','dac-forms');
    for(const id of s.ids){const r=el('div','dac-form');r.append(arText(el('b',''),glyph(id)),el('span','dac-arrow',lang==='ar'?'←':'→'),arText(el('b','is-to'),C.get(id).forms.initial));forms.append(r)}
    c.append(forms,el('div','dac-tip',s.kind==='join'?L.joinSub:L.noJoinSub));
   }
  }
  function renderChoices(s,box){
   if(s.type==='name')box.append(arText(el('div','dac-shown'),glyph(s.id)));
   if(s.type==='listen'){const b=el('button','dac-listen');b.type='button';b.innerHTML=ICON.speak;b.setAttribute('aria-label',L.replay);b.addEventListener('click',()=>play(s.id));box.append(b);setTimeout(()=>{if(run&&run.cur?.s===s)play(s.id)},350)}
   const g=el('div','dac-opts'+(s.type==='name'?' is-text':''));box.append(g);
   for(const id of s.opts){
    const b=el('button','dac-opt');b.type='button';b.dataset.id=id;
    if(s.type==='name')b.textContent=name(id);else arText(b,s.type==='initial'?C.get(id).forms.initial:glyph(id));
    b.addEventListener('click',()=>{if(run.phase!=='ask')return;g.querySelectorAll('.dac-opt').forEach(x=>x.classList.toggle('is-sel',x===b));run.sel=id;cta.disabled=false;sound('select');if(s.type!=='listen')play(id)});
    g.append(b);
   }
  }
  function renderMatch(s,box){
   const g=el('div','dac-match');box.append(g);const right=shuffle(s.ids);let pickL=null,pickR=null,left=s.ids.length;
   s.ids.forEach((id,i)=>{
    for(const [val,side] of [[id,'L'],[right[i],'R']]){
     const b=el('button','dac-opt'+(side==='L'?' is-glyph':''));b.type='button';b.dataset.id=val;b.dataset.side=side;
     if(side==='L')arText(b,glyph(val));else b.textContent=name(val);
     b.addEventListener('click',()=>{
      if(run.phase!=='ask')return;
      g.querySelectorAll('[data-side="'+side+'"]').forEach(x=>x.classList.remove('is-sel'));b.classList.add('is-sel');
      if(side==='L'){pickL=b;play(val)}else pickR=b;
      if(!pickL||!pickR)return;
      const a=pickL,c=pickR;pickL=pickR=null;
      if(a.dataset.id===c.dataset.id){
       a.classList.replace('is-sel','is-right');c.classList.replace('is-sel','is-right');sound('select');
       setTimeout(()=>{a.classList.add('is-gone');c.classList.add('is-gone')},320);
       if(--left===0){run.sel='ok';setTimeout(check,420)}
      }else{
       run.matchBad=true;run.missed.add(a.dataset.id);sound('wrong');
       a.classList.replace('is-sel','is-wrong');c.classList.replace('is-sel','is-wrong');setTimeout(()=>{a.classList.remove('is-wrong');c.classList.remove('is-wrong')},450);
      }
     });
     g.append(b);
    }
   });
   box.append(el('p','dac-hint',L.matchHint));
  }
  function check(){
   const s=run.cur.s,ok=s.type==='match'?!run.matchBad:run.sel===s.id;
   run.phase='feedback';
   if(s.type!=='match')body.querySelectorAll('.dac-opt').forEach(b=>{if(b.dataset.id===s.id)b.classList.add('is-right');else if(b.classList.contains('is-sel'))b.classList.add('is-wrong')});
   if(!run.cur.retry)run.asked++;
   opts.onAnswer?.(s.id||null,ok);
   cta.disabled=false;
   if(ok){
    if(!run.cur.retry)run.first++;run.combo++;run.best=Math.max(run.best,run.combo);run.done++;setBar();
    const tag=$('.dac-combo');tag.textContent=run.combo>=3?L.streakTag(run.combo):'';tag.classList.toggle('is-on',run.combo>=3);
    sound(run.combo===3?'combo3':run.combo===5?'combo5':run.combo===7?'combo7':'correct');
    feedback('is-ok',L.praise[Math.random()*L.praise.length|0],run.combo>=3?L.streak(run.combo):s.type==='match'?L.matched:'','', 'correct');
    cta.textContent=L.cont;
   }else{
    run.combo=0;$('.dac-combo').classList.remove('is-on');if(s.id)run.missed.add(s.id);sound('wrong');
    const hintId=s.id||[...run.missed].pop();
    const mini=s.type==='initial'?C.get(hintId).forms.initial:glyph(hintId);
    const text=s.type==='nojoin'?name(hintId)+': '+L.noJoinTitle+'.':s.type==='initial'?name(hintId)+': '+L.joinTitle+'.':name(hintId)+': '+dotsOf(hintId);
    feedback('is-bad',L.remember,text+' '+L.again,mini,'try_again');
    cta.classList.add('is-bad');cta.textContent=L.got;
    run.queue.push({s,retry:true});
   }
  }
  function finish(){
   const sec=Math.round((Date.now()-run.started)/1000),acc=run.asked?Math.round(run.first/run.asked*100):100;
   const result={lessonIndex:opts.lessonIndex,missedIds:[...run.missed],questions:run.asked,firstTryCorrect:run.first,seconds:sec};
   try{opts.onDone?.(result)}catch(_){}
   sound('complete');
   body.textContent='';foot.remove();$('.dac-top').remove();host.classList.add('is-done');
   const d=el('div','dac-done');body.append(d);
   const party=el('img','dac-party');party.alt='';party.src=img('celebrate');party.addEventListener('error',()=>{if(!party.src.includes('/owl/'))party.src='assets/companions/owl/owl_celebrate.png'});
   const stats=el('div','dac-stats');
   for(const [cls,label,val] of [['a',L.acc,acc+'%'],['b',L.time,Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')],['c',L.best,String(run.best)]]){const s=el('div','dac-stat is-'+cls);s.append(el('small','',label),el('span','',val));stats.append(s)}
   const learned=el('div','dac-learned');
   for(const id of opts.letterIds){const b=el('button','');b.type='button';arText(b,glyph(id));b.setAttribute('aria-label',name(id));b.addEventListener('click',()=>play(id));learned.append(b)}
   const btn=el('button','dac-cta',L.cont);btn.type='button';btn.addEventListener('click',()=>{close();try{opts.onClose?.()}catch(_){}});
   d.append(party,el('h2','',L.done),el('p','dac-sub',L.learned),learned,stats,btn);
   try{window.DEEN_DS_MOTION?.confetti?.(host)}catch(_){}
   btn.focus({preventScroll:true});
  }
  cta.addEventListener('click',()=>{
   if(!run)return;
   if(run.phase==='card'){run.done++;next();return}
   if(run.phase==='ask'){if(run.sel)check();return}
   if(run.phase==='feedback')next();
  });
  run.ask=()=>{
   if(host.querySelector('.dac-quit'))return;
   const q=el('div','dac-quit');q.setAttribute('role','alertdialog');
   const card=el('div','dac-quit-card');const stay=el('button','dac-cta',L.quitStay),leave=el('button','dac-leave',L.quitLeave);stay.type=leave.type='button';
   card.append(el('h3','',L.quitTitle),el('p','',L.quitSub),stay,leave);q.append(card);host.append(q);
   stay.addEventListener('click',()=>q.remove());leave.addEventListener('click',()=>{close();try{opts.onExit?.()}catch(_){}});stay.focus({preventScroll:true});
  };
  sound('start');next();
  return true;
 }
 function askQuit(){run?.ask?.()}
 window.DEEN_ARABIC_CARDS=Object.freeze({version:'ds-arabic-cards-1',open,close,isOpen:()=>!!host,current:()=>run?.cur?{kind:run.cur.s.k,type:run.cur.s.type||run.cur.s.kind,id:run.cur.s.id||null,retry:!!run.cur.retry}:null,plan:(ids,known,lang)=>buildSteps(ids,known||[],T[lang]||T.tr,()=>false)});
})();
