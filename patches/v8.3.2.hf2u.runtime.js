(()=>{
 if(window.__deenV832HF2U)return;window.__deenV832HF2U=true;
 const VERSION='8.4.3-HF2U-BASIC';
 const FOOT='<b>Giyinme Odası</b><small>Stilini seç; kombin avatarının üzerinde anında önizlenir.</small>';
 const $=(s,r=document)=>r?.querySelector?.(s)||null;
 function root(){return $('#v812Wardrobe')}
 function mannequin(){return $('.v832k-mannequin',root())}
 function gender(){return mannequin()?.dataset?.gender==='male'?'male':'female'}
 function activeCard(){return $('.v832k-card.active',root())}
 function activeId(){return activeCard()?.dataset?.v832kReal||null}
 function avatarHtml(g){try{let h=window.DEEN_AVATAR_ASSETS?.svg?.(g)||'';if(h)h=h.replace('class="v831-stack','class="v831-stack v832u-selected-stack');return h}catch(_){return ''}}
 function ensureCanvas(m,g){let c=$('.v832u-canvas',m);if(!c){c=document.createElement('div');c.className='v832u-canvas';c.innerHTML='<div class="v832u-avatar-slot"></div><span class="v832u-outfit" aria-hidden="true"></span>';m.appendChild(c)}c.dataset.gender=g;return c}
 function syncOutfit(c,id){const card=activeCard(),src=$('.v832k-sprite',card),out=$('.v832u-outfit',c);if(!src||!out)return false;const style=src.getAttribute('style')||'';if(out.dataset.id!==id||out.getAttribute('style')!==style){out.dataset.id=id;out.setAttribute('style',style)}return true}
 function syncAvatar(c,g){const slot=$('.v832u-avatar-slot',c);if(!slot)return false;slot.style.removeProperty('left');slot.style.removeProperty('top');slot.style.removeProperty('width');slot.style.removeProperty('height');const html=avatarHtml(g),sig=g+'|'+html;if(html&&slot.__v843BasicSig!==sig){slot.__v843BasicSig=sig;slot.innerHTML=html}return !!html}
 function clean(r,c){$('.v832u-status',c)?.remove?.();const f=$('.v831-footcopy,.v812-footcopy',r);if(f&&f.innerHTML!==FOOT)f.innerHTML=FOOT}
 function tick(){const r=root();if(!r?.classList?.contains('open'))return false;const m=mannequin();if(!m)return false;const g=gender(),id=activeId();if(!id)return false;const c=ensureCanvas(m,g);syncAvatar(c,g);syncOutfit(c,id);clean(r,c);document.documentElement.dataset.deenHF2U='basic-ready';return true}
 let raf=0;function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;tick()})}
 document.addEventListener('click',e=>{if(e.target.closest?.('#v812Wardrobe,[data-v810-open-wardrobe]')){schedule();setTimeout(schedule,70)}},true);
 [0,180,600].forEach(ms=>setTimeout(schedule,ms));
 window.DEEN_HF2U={version:VERSION,refresh:schedule,check:()=>({version:VERSION,gender:gender(),active:activeId(),outfit:!!$('.v832u-outfit',mannequin()),avatar:!!$('.v832u-avatar-slot .v831-stack',mannequin()),basicOnly:true,eventDriven:true})};
})();