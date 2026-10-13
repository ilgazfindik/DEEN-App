(()=>{
 const VERSION='8.9.1-TODDLER-INTERACTIVE-UI',BUILD='891toddler2';
 
 /**
  * TODDLER İNTERAKTİF OYUN TİPLERİ - UI RENDER FONKSİYONLARI
  * 
  * Bu yama, v8.9.0 toddler motorunun tanımladığı yeni soru tipleri için
  * görsel arayüz render fonksiyonlarını ekler.
  * 
  * ÖZELLİKLER:
  * - Büyük dokunmatik hedefler (min 80x80px)
  * - Renkli animasyonlar
  * - Emoji desteği
  * - Sürükle-bırak desteği
  * - Ses efektleri entegrasyonu
  */
 
 function runtime(){
  if(window.__deenV891ToddlerUI)return;window.__deenV891ToddlerUI=true;
  
  // Confetti efekti - başarı ödülü
  function spawnConfetti(x,y){
   const container=document.createElement('div');
   container.style.cssText='position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
   document.body.appendChild(container);
   
   const colors=['#FF6B6B','#4ECDC4','#FFE66D','#95E1D3','#F38181'];
   const emojis=['⭐','🌟','✨','🎉','🎊','💫','🔥','❤️'];
   
   for(let i=0;i<30;i++){
    const conf=document.createElement('div');
    conf.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    conf.style.cssText=`
     position:absolute;
     left:${x}%;
     top:${y}%;
     font-size:${Math.random()*20+15}px;
     color:${colors[Math.floor(Math.random()*colors.length)]};
     pointer-events:none;
     animation:confetti-fly ${1+Math.random()}s ease-out forwards;
    `;
    container.appendChild(conf);
   }
   
   setTimeout(()=>container.remove(),2000);
  }
  
  // Ses efekti çalma
  function playSound(type){
   const audioContext=new (window.AudioContext||window.webkitAudioContext)();
   const oscillator=audioContext.createOscillator();
   const gainNode=audioContext.createGain();
   
   oscillator.connect(gainNode);
   gainNode.connect(audioContext.destination);
   
   switch(type){
    case 'success':
     oscillator.frequency.setValueAtTime(523.25,audioContext.currentTime);
     oscillator.frequency.setValueAtTime(659.25,audioContext.currentTime+0.1);
     oscillator.frequency.setValueAtTime(783.99,audioContext.currentTime+0.2);
     gainNode.gain.setValueAtTime(0.3,audioContext.currentTime);
     gainNode.gain.exponentialRampToValueAtTime(0.01,audioContext.currentTime+0.4);
     oscillator.start(audioContext.currentTime);
     oscillator.stop(audioContext.currentTime+0.4);
     break;
    case 'correct':
     oscillator.frequency.setValueAtTime(523.25,audioContext.currentTime);
     oscillator.frequency.setValueAtTime(783.99,audioContext.currentTime+0.15);
     gainNode.gain.setValueAtTime(0.3,audioContext.currentTime);
     gainNode.gain.exponentialRampToValueAtTime(0.01,audioContext.currentTime+0.3);
     oscillator.start(audioContext.currentTime);
     oscillator.stop(audioContext.currentTime+0.3);
     break;
    case 'wrong':
     oscillator.frequency.setValueAtTime(196,audioContext.currentTime);
     oscillator.frequency.setValueAtTime(164.81,audioContext.currentTime+0.2);
     gainNode.gain.setValueAtTime(0.2,audioContext.currentTime);
     gainNode.gain.exponentialRampToValueAtTime(0.01,audioContext.currentTime+0.3);
     oscillator.start(audioContext.currentTime);
     oscillator.stop(audioContext.currentTime+0.3);
     break;
    case 'pop':
     oscillator.frequency.setValueAtTime(880,audioContext.currentTime);
     gainNode.gain.setValueAtTime(0.15,audioContext.currentTime);
     gainNode.gain.exponentialRampToValueAtTime(0.01,audioContext.currentTime+0.1);
     oscillator.start(audioContext.currentTime);
     oscillator.stop(audioContext.currentTime+0.1);
     break;
   }
  }
  
  // Resim-Kelime Eşleştirme UI
  function renderImageWordMatch(q,renderCb){
   const container=document.createElement('div');
   container.className='toddler-image-word-match';
   container.style.cssText='display:flex;flex-direction:column;gap:20px;padding:20px;max-width:500px;margin:0 auto;';
   
   const imagesDiv=document.createElement('div');
   imagesDiv.style.cssText='display:grid;grid-template-columns:repeat(2,1fr);gap:15px;';
   
   const wordsDiv=document.createElement('div');
   wordsDiv.style.cssText='display:flex;flex-direction:column;gap:10px;';
   
   let selectedImage=null;
   let matchedCount=0;
   const totalPairs=q.pairs?.length||4;
   
   q.pairs.forEach((pair,idx)=>{
    const imgBtn=document.createElement('button');
    imgBtn.innerHTML=`<img src="${pair.image}" style="width:100%;height:120px;object-fit:cover;border-radius:15px;border:4px solid #ddd;" alt="">`;
    imgBtn.style.cssText='cursor:pointer;transition:transform 0.2s,border-color 0.2s;min-height:120px;';
    imgBtn.onclick=()=>{
     if(selectedImage){
      if(selectedImage===idx){
       imgBtn.style.borderColor='#ddd';
       selectedImage=null;
      }else{
       // Eşleşme kontrolü
       if(q.pairs[selectedImage].word===q.pairs[idx].word){
        imgBtn.style.borderColor='#4ECDC4';
        document.querySelector(`[data-img-idx="${selectedImage}"]`).style.borderColor='#4ECDC4';
        playSound('correct');
        spawnConfetti(50,50);
        matchedCount++;
        if(matchedCount===totalPairs){
         setTimeout(()=>renderCb(true),500);
        }
       }else{
        playSound('wrong');
        imgBtn.style.borderColor='#FF6B6B';
        setTimeout(()=>{
         imgBtn.style.borderColor='#ddd';
         document.querySelector(`[data-img-idx="${selectedImage}"]`).style.borderColor='#ddd';
        },500);
       }
       selectedImage=null;
      }
     }else{
      selectedImage=idx;
      imgBtn.style.borderColor='#FFE66D';
      playSound('pop');
     }
    };
    imgBtn.dataset.imgIdx=idx;
    imagesDiv.appendChild(imgBtn);
   });
   
   // Kelime butonları karıştır
   const shuffledWords=[...q.pairs].sort(()=>Math.random()-0.5);
   shuffledWords.forEach((pair,idx)=>{
    const wordBtn=document.createElement('button');
    wordBtn.textContent=pair.word;
    wordBtn.style.cssText='padding:15px 20px;font-size:18px;border-radius:12px;border:3px solid #ddd;background:#fff;cursor:pointer;transition:all 0.2s;min-height:60px;';
    wordBtn.onmouseover=()=>wordBtn.style.transform='scale(1.02)';
    wordBtn.onmouseout=()=>wordBtn.style.transform='scale(1)';
    wordsDiv.appendChild(wordBtn);
   });
   
   container.appendChild(imagesDiv);
   container.appendChild(wordsDiv);
   
   return container;
  }
  
  // Renk-Şekil Sıralama UI
  function renderColorShapeSort(q,renderCb){
   const container=document.createElement('div');
   container.style.cssText='display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;';
   
   const instruction=document.createElement('div');
   instruction.textContent=q.instruction||'Renkleri sırala!';
   instruction.style.cssText='font-size:24px;font-weight:bold;color:#07151c;text-align:center;';
   container.appendChild(instruction);
   
   const dropZone=document.createElement('div');
   dropZone.style.cssText='display:flex;gap:10px;padding:20px;background:#f0f4f8;border-radius:20px;min-height:100px;align-items:center;';
   
   const shapes=[...q.shapes||[]];
   const correctOrder=q.correct_order||shapes.map((_,i)=>i);
   let placedShapes=[];
   
   shapes.forEach((shape,idx)=>{
    const shapeEl=document.createElement('div');
    shapeEl.draggable=true;
    shapeEl.style.cssText=`
     width:80px;height:80px;
     background:${shape.color};
     border-radius:${shape.type==='circle'?'50%':shape.type==='square'?'15px':'50% 0 50% 0'};
     cursor:grab;
     transition:transform 0.2s;
     box-shadow:0 4px 8px rgba(0,0,0,0.2);
    `;
    shapeEl.onDragStart=(e)=>{
     e.dataTransfer.setData('text/plain',idx.toString());
     playSound('pop');
    };
    shapeEl.onclick=()=>{
     dropZone.appendChild(shapeEl);
     placedShapes.push(idx);
     checkCompletion();
    };
    container.appendChild(shapeEl);
   });
   
   function checkCompletion(){
    if(placedShapes.length===shapes.length){
     const isCorrect=JSON.stringify(placedShapes)===JSON.stringify(correctOrder);
     if(isCorrect){
      playSound('success');
      spawnConfetti(50,50);
      setTimeout(()=>renderCb(true),500);
     }else{
      playSound('wrong');
      setTimeout(()=>{
       placedShapes=[];
       // Reset shapes
      },500);
     }
    }
   }
   
   container.appendChild(dropZone);
   return container;
  }
  
  // Puzzle Tamamlama UI
  function renderPuzzleComplete(q,renderCb){
   const container=document.createElement('div');
   container.style.cssText='display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;';
   
   const puzzleImage=document.createElement('div');
   puzzleImage.style.cssText=`
    width:300px;height:300px;
    background-image:url('${q.image}');
    background-size:300px 300px;
    border-radius:20px;
    border:4px solid #4ECDC4;
    display:grid;
    grid-template-columns:repeat(${q.gridSize||3},1fr);
    grid-template-rows:repeat(${q.gridSize||3},1fr);
    gap:2px;
   `;
   
   const pieces=[];
   for(let i=0;i<(q.gridSize||3)*(q.gridSize||3);i++){
    pieces.push(i);
   }
   pieces.sort(()=>Math.random()-0.5);
   
   pieces.forEach((pieceIdx,posIdx)=>{
    const piece=document.createElement('div');
    piece.style.cssText=`
     width:calc(300px / ${q.gridSize||3});
     height:calc(300px / ${q.gridSize||3});
     background-image:url('${q.image}');
     background-size:300px 300px;
     background-position:${-(pieceIdx%(q.gridSize||3))*(300/(q.gridSize||3))}px ${-Math.floor(pieceIdx/(q.gridSize||3))*(300/(q.gridSize||3))}px;
     cursor:pointer;
     transition:transform 0.2s;
    `;
    piece.onclick=()=>{
     playSound('pop');
     // Puzzle mantığı buraya
    };
    puzzleImage.appendChild(piece);
   });
   
   container.appendChild(puzzleImage);
   return container;
  }
  
  // Dinle ve İşaretle UI
  function renderListenPoint(q,renderCb){
   const container=document.createElement('div');
   container.style.cssText='display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;';
   
   const audioBtn=document.createElement('button');
   audioBtn.innerHTML='🔊 Dinle';
   audioBtn.style.cssText='padding:20px 40px;font-size:24px;border-radius:50px;background:#4ECDC4;color:#fff;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(78,205,196,0.4);transition:transform 0.2s;';
   audioBtn.onclick=()=>{
    if(q.audioSrc){
     const audio=new Audio(q.audioSrc);
     audio.play();
     playSound('pop');
    }
   };
   container.appendChild(audioBtn);
   
   const optionsDiv=document.createElement('div');
   optionsDiv.style.cssText='display:grid;grid-template-columns:repeat(2,1fr);gap:15px;';
   
   q.options.forEach((opt,idx)=>{
    const btn=document.createElement('button');
    btn.innerHTML=`<img src="${opt.image}" style="width:100%;height:120px;object-fit:cover;border-radius:15px;" alt="">`;
    btn.style.cssText='cursor:pointer;transition:transform 0.2s;min-height:120px;border:4px solid #ddd;border-radius:15px;';
    btn.onclick=()=>{
     if(idx===q.correctIndex){
      btn.style.borderColor='#4ECDC4';
      playSound('success');
      spawnConfetti(50,50);
      setTimeout(()=>renderCb(true),500);
     }else{
      btn.style.borderColor='#FF6B6B';
      playSound('wrong');
      setTimeout(()=>btn.style.borderColor='#ddd',500);
     }
    };
    optionsDiv.appendChild(btn);
   });
   
   container.appendChild(optionsDiv);
   return container;
  }
  
  // Doğru Yol Seç UI (Happy Path)
  function renderHappyPath(q,renderCb){
   const container=document.createElement('div');
   container.style.cssText='display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;';
   
   const pathContainer=document.createElement('div');
   pathContainer.style.cssText='position:relative;width:300px;height:400px;background:#f0f4f8;border-radius:20px;overflow:hidden;';
   
   // Yol çizgisi
   const pathLine=document.createElement('div');
   pathLine.style.cssText='position:absolute;left:50%;top:0;width:4px;height:100%;background:#ddd;transform:translateX(-50%);';
   pathContainer.appendChild(pathLine);
   
   // Seçenekler
   q.pathOptions.forEach((opt,idx)=>{
    const optionBtn=document.createElement('button');
    optionBtn.textContent=opt.text;
    optionBtn.style.cssText=`
     position:absolute;
     left:${opt.isCorrect?'50%':(idx%2===0?'20%':'80%')}%;
     top:${20+idx*20}%;
     transform:translateX(-50%);
     padding:15px 25px;
     font-size:18px;
     border-radius:15px;
     border:3px solid ${opt.isCorrect?'#4ECDC4':'#ddd'};
     background:#fff;
     cursor:pointer;
     transition:all 0.2s;
    `;
    optionBtn.onclick=()=>{
     if(opt.isCorrect){
      optionBtn.style.background='#4ECDC4';
      optionBtn.style.color='#fff';
      playSound('success');
      spawnConfetti(50,50);
      setTimeout(()=>renderCb(true),500);
     }else{
      optionBtn.style.background='#FF6B6B';
      optionBtn.style.color='#fff';
      playSound('wrong');
      setTimeout(()=>{
       optionBtn.style.background='#fff';
       optionBtn.style.color='#07151c';
      },500);
     }
    };
    pathContainer.appendChild(optionBtn);
   });
   
   container.appendChild(pathContainer);
   return container;
  }
  
  // Çıkart Toplama UI (Sticker Reward)
  function renderStickerReward(q,renderCb){
   const container=document.createElement('div');
   container.style.cssText='display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;';
   
   const stickerBook=document.createElement('div');
   stickerBook.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:20px;background:#fff;border-radius:20px;box-shadow:0 4px 12px rgba(0,0,0,0.1);';
   
   const stickers=q.stickers||['⭐','🌟','🎉','🎊','💫','🔥','❤️','🎈','🍭'];
   const collected=new Set();
   
   stickers.forEach((sticker,idx)=>{
    const stickerEl=document.createElement('div');
    stickerEl.textContent=sticker;
    stickerEl.style.cssText=`
     font-size:40px;
     text-align:center;
     padding:15px;
     border-radius:15px;
     background:${collected.has(idx)?'#FFE66D':'#f0f4f8'};
     cursor:pointer;
     transition:transform 0.2s;
    `;
    stickerEl.onclick=()=>{
     if(!collected.has(idx)){
      collected.add(idx);
      stickerEl.style.background='#FFE66D';
      stickerEl.style.transform='scale(1.2)';
      playSound('pop');
      if(collected.size===stickers.length){
       playSound('success');
       spawnConfetti(50,50);
       setTimeout(()=>renderCb(true),500);
      }
     }
    };
    stickerBook.appendChild(stickerEl);
   });
   
   container.appendChild(stickerBook);
   return container;
  }
  
  // Emoji ile Cevap UI
  function renderEmoteChoice(q,renderCb){
   const container=document.createElement('div');
   container.style.cssText='display:flex;flex-direction:column;align-items:center;gap:20px;padding:20px;';
   
   const questionText=document.createElement('div');
   questionText.textContent=q.question;
   questionText.style.cssText='font-size:24px;text-align:center;color:#07151c;';
   container.appendChild(questionText);
   
   const emotesDiv=document.createElement('div');
   emotesDiv.style.cssText='display:flex;gap:15px;flex-wrap:wrap;justify-content:center;';
   
   q.emotes.forEach((emote,idx)=>{
    const emoteBtn=document.createElement('button');
    emoteBtn.textContent=emote.emoji;
    emoteBtn.style.cssText='font-size:50px;padding:20px;border-radius:50%;border:4px solid #ddd;background:#fff;cursor:pointer;transition:transform 0.2s;';
    emoteBtn.onclick=()=>{
     if(emote.isCorrect){
      emoteBtn.style.borderColor='#4ECDC4';
      emoteBtn.style.background='#E8F8F5';
      playSound('success');
      spawnConfetti(50,50);
      setTimeout(()=>renderCb(true),500);
     }else{
      emoteBtn.style.borderColor='#FF6B6B';
      emoteBtn.style.background='#FDEDEC';
      playSound('wrong');
      setTimeout(()=>{
       emoteBtn.style.borderColor='#ddd';
       emoteBtn.style.background='#fff';
      },500);
     }
    };
    emotesDiv.appendChild(emoteBtn);
   });
   
   container.appendChild(emotesDiv);
   return container;
  }
  
  // Sürükle-Yerleştir UI
  function renderDragDropPlace(q,renderCb){
   const container=document.createElement('div');
   container.style.cssText='display:flex;flex-direction:column;gap:20px;padding:20px;';
   
   const sourceDiv=document.createElement('div');
   sourceDiv.style.cssText='display:flex;gap:15px;padding:20px;background:#f0f4f8;border-radius:15px;justify-content:center;flex-wrap:wrap;';
   
   const targetDiv=document.createElement('div');
   targetDiv.style.cssText='display:flex;gap:15px;padding:20px;background:#E8F8F5;border-radius:15px;justify-content:center;flex-wrap:wrap;min-height:80px;';
   
   const items=[...q.items||[]];
   const placedItems=[];
   
   items.forEach((item,idx)=>{
    const itemEl=document.createElement('div');
    itemEl.draggable=true;
    itemEl.textContent=item.text||item.emoji;
    itemEl.style.cssText='padding:15px 20px;font-size:20px;border-radius:12px;background:#fff;border:3px solid #4ECDC4;cursor:grab;user-select:none;';
    itemEl.onDragStart=(e)=>{
     e.dataTransfer.setData('text/plain',idx.toString());
     playSound('pop');
    };
    sourceDiv.appendChild(itemEl);
   });
   
   targetDiv.ondragover=(e)=>e.preventDefault();
   targetDiv.ondrop=(e)=>{
    e.preventDefault();
    const idx=parseInt(e.dataTransfer.getData('text/plain'));
    const item=items[idx];
    
    if(q.correctPlacement.includes(item)){
     const placedEl=document.createElement('div');
     placedEl.textContent=item.text||item.emoji;
     placedEl.style.cssText='padding:15px 20px;font-size:20px;border-radius:12px;background:#fff;border:3px solid #4ECDC4;';
     targetDiv.appendChild(placedEl);
     placedItems.push(item);
     playSound('correct');
     
     if(placedItems.length===q.correctPlacement.length){
      playSound('success');
      spawnConfetti(50,50);
      setTimeout(()=>renderCb(true),500);
     }
    }else{
     playSound('wrong');
    }
   };
   
   container.appendChild(sourceDiv);
   container.appendChild(targetDiv);
   return container;
  }
  
  // Render fonksiyonlarını kaydet
  window.DEEN_TODDLER_UI_RENDERERS={
   image_word_match:renderImageWordMatch,
   color_shape_sort:renderColorShapeSort,
   puzzle_complete:renderPuzzleComplete,
   listen_point:renderListenPoint,
   happy_path:renderHappyPath,
   sticker_reward:renderStickerReward,
   emote_choice:renderEmoteChoice,
   drag_drop_place:renderDragDropPlace
  };
  
  // Mevcut renderQuestion fonksiyonunu genişlet
  function install(){
   const oldRender=typeof renderQuestion==='function'?renderQuestion:window.renderQuestion;
   if(typeof oldRender==='function'&&!oldRender.__v891){
    const wrapped=function(q,...args){
     const toddlerRenderer=window.DEEN_TODDLER_UI_RENDERERS[q.type];
     if(toddlerRenderer){
      return toddlerRenderer(q,(result)=>{
       // Sonuç callback'i
       if(result){
        playSound('success');
        spawnConfetti(50,50);
       }
      });
     }
     return oldRender.call(this,q,...args);
    };
    wrapped.__v891=true;
    try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
    document.documentElement.dataset.deenToddlerUI='ready';
    return true;
   }
   return false;
  }
  
  // Otomatik yükleme
  [0,150,500,1200,2500].forEach(ms=>setTimeout(install,ms));
  
  // Public API
  window.DEEN_TODDLER_INTERACTIVE_UI={
   version:VERSION,
   build:BUILD,
   install,
   playSound,
   spawnConfetti,
   renderers:Object.keys(window.DEEN_TODDLER_UI_RENDERERS||{}),
   check:()=>({
    version:VERSION,
    build:BUILD,
    ready:document.documentElement.dataset.deenToddlerUI==='ready',
    renderers:Object.keys(window.DEEN_TODDLER_UI_RENDERERS||{})
   })
  };
 }
 
 const addition=`<!-- DEEN v8.9.1 — Toddler Interactive UI -->
<script id="deen-v891-toddler-ui-runtime">
(`+runtime.toString()+`)();
<\/script>`;
 
 window.DEEN_PATCH_V891=function(html){
  let out=String(html);
  if(out.includes('deen-v891-toddler-ui-runtime'))return{html:out,version:VERSION,applied:0};
  out+='\\n'+addition+'\\n';
  return{html:out,version:VERSION,applied:1};
 };
})();
