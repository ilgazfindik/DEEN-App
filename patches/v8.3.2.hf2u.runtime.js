(()=>{
 if(window.__deenV832HF2U)return;window.__deenV832HF2U=true;
 const VERSION='8.3.2-HF2U';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 const FACE={
  female_01:[93,29,114,55],female_02:[90,28,111,54],female_03:[78,28,98,54],female_04:[79,29,100,54],female_05:[77,30,98,55],female_06:[78,31,100,56],female_07:[79,29,101,54],female_08:[77,30,98,54],female_09:[74,30,94,55],female_10:[69,30,90,55],female_11:[67,30,87,54]
 };
 function root(){return $('#v812Wardrobe')}
 function mannequin(){return $('.v832k-mannequin',root())}
 function gender(){return mannequin()?.dataset?.gender==='male'?'male':'female'}
 function activeCard(){return $('.v832k-card.active',root())}
 function activeId(){return activeCard()?.dataset?.v832kReal||null}
 function avatarHtml(g){try{let h=window.DEEN_AVATAR_ASSETS?.svg?.(g)||'';if(h)h=h.replace('class="v831-stack','class="v831-stack v832u-selected-stack');return h}catch(_){return ''}}
 function ensureCanvas(m,g){
   let c=$('.v832u-canvas',m);if(!c){c=document.createElement('div');c.className='v832u-canvas';c.innerHTML='<div class="v832u-avatar-slot"></div><span class="v832u-outfit" aria-hidden="true"></span>';m.appendChild(c)}c.dataset.gender=g;return c
 }
 function syncOutfit(c,id){
   const card=activeCard(),src=$('.v832k-sprite',card),out=$('.v832u-outfit',c);if(!src||!out)return false;
   const style=src.getAttribute('style')||'';if(out.dataset.id!==id||out.getAttribute('style')!==style){out.dataset.id=id;out.setAttribute('style',style)}return true
 }
 function femaleBox(id){
   const b=FACE[id]||[78,29,99,55];
   /* Original clean reference canvas was 176x240. When fit into the square atlas cell it occupies 73.333% width, centered. */
   const x0=13.333333+(b[0]/176)*73.333334,x1=13.333333+(b[2]/176)*73.333334,y0=(b[1]/240)*100,y1=(b[3]/240)*100;
   return [x0-1.2,y0-1.0,(x1-x0)+2.4,(y1-y0)+2.0]
 }
 function syncAvatar(c,g,id){
   const slot=$('.v832u-avatar-slot',c);if(!slot)return;
   if(g==='female'){
     const b=femaleBox(id);slot.style.left=b[0]+'%';slot.style.top=b[1]+'%';slot.style.width=b[2]+'%';slot.style.height=b[3]+'%';
   }else{slot.style.removeProperty('left');slot.style.removeProperty('top');slot.style.removeProperty('width');slot.style.removeProperty('height')}
   const html=avatarHtml(g),sig=g+'|'+html;if(html&&slot.__v832uSig!==sig){slot.__v832uSig=sig;slot.innerHTML=html}
 }
 function clean(r,c){
   $('.v832u-status',c)?.remove?.();
   const f=$('.v831-footcopy,.v812-footcopy',r);if(f)f.innerHTML='<b>Giyinme Odası</b><small>Stilini seç; kombin avatarının üzerinde anında önizlenir.</small>';
 }
 function tick(){
   const r=root();if(!r?.classList?.contains('open'))return;const m=mannequin();if(!m)return;const g=gender(),id=activeId();if(!id)return;
   const c=ensureCanvas(m,g);syncOutfit(c,id);syncAvatar(c,g,id);clean(r,c);document.documentElement.dataset.deenHF2U='ready'
 }
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe [data-v832k-real],#v812Wardrobe [data-v831-gender],#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],[data-v810-open-wardrobe]'))[20,70,160,320].forEach(ms=>setTimeout(tick,ms))},true);
 const obs=new MutationObserver(()=>{if(root()?.classList?.contains('open'))queueMicrotask(tick)});setTimeout(()=>{const r=root();if(r)obs.observe(r,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})},350);
 setInterval(tick,120);[0,80,220,520,1000,1700].forEach(ms=>setTimeout(tick,ms));
 window.DEEN_HF2U={version:VERSION,refresh:tick,check:()=>({version:VERSION,gender:gender(),active:activeId(),outfit:!!$('.v832u-outfit',mannequin()),selectedAvatar:!!$('.v832u-selected-stack',mannequin()),saveLocked:true,debugClean:!$('.v832u-status,.v832t-fit-label,.v832k-body-note,.v832s-step-badge,.v832k-runtime-badge',root())?.offsetParent})};
 window.DEEN_RELEASE_VERSION=VERSION;setTimeout(()=>{document.title='DEEN v8.3.2 HF2U'},650)
})();
