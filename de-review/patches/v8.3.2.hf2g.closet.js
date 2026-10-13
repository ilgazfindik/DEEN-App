(()=>{
  if(window.__deenV832HF2GCloset)return;
  window.__deenV832HF2GCloset=true;

  const VERSION='8.3.2-HF2G', REV='832hf2g1';
  const $=(s,r=document)=>r?.querySelector?.(s)||null;
  const $$=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
  const LEGACY=['outfit_teal','outfit_lavender','outfit_navy','outfit_cream'];
  const LEGACY_NAMES=['Teal Tunik','Lavanta Tunik','Lacivert Tunik','Krem Tunik'];
  const CFG={
    male:{count:12,cell:96,cols:6,file:'male_atlas.b64'},
    female:{count:11,cell:80,cols:6,file:'female_atlas.b64'}
  };

  const URLS={male:'',female:''};
  const META={male:null,female:null};
  const preview={male:null,female:null};
  const initial={male:null,female:null};
  let proPatched=false;
  let intervalId=0;

  function gender(){
    try{const g=window.DEEN_AVATAR_ASSETS?.state?.()?.gender;if(g==='male'||g==='female')return g}catch(_){}
    try{const g=state?.myWorld?.avatarAssets?.gender;if(g==='male'||g==='female')return g}catch(_){}
    const badge=$('#v812Wardrobe .v831-real-badge')?.textContent||'';
    return /ERKEK/i.test(badge)?'male':'female';
  }
  function world(){return window.DEEN_WORLD}
  function snap(){try{return world()?.snapshot?.()||{}}catch(_){return {}}}
  function items(){try{return world()?.items?.()||[]}catch(_){return []}}
  function legacyIndex(id){const i=LEGACY.indexOf(id);return i<0?0:i}
  function legacyEquipped(){return snap()?.equipped?.outfit||'outfit_teal'}
  function idFor(g,i){return `${g}_${String(i+1).padStart(2,'0')}`}
  function parseId(g,id){const m=String(id||'').match(new RegExp(`^${g}_(\\d{2})$`));if(!m)return null;const i=Number(m[1])-1;return i>=0&&i<CFG[g].count?i:null}
  function store(){
    try{
      state.myWorld=state.myWorld&&typeof state.myWorld==='object'?state.myWorld:{};
      state.myWorld.avatarAssets=state.myWorld.avatarAssets&&typeof state.myWorld.avatarAssets==='object'?state.myWorld.avatarAssets:{};
      const a=state.myWorld.avatarAssets;
      a.visualOutfit=a.visualOutfit&&typeof a.visualOutfit==='object'?a.visualOutfit:{};
      return a.visualOutfit;
    }catch(_){return {}}
  }
  function saved(g){
    const s=store();
    return parseId(g,s[g])!==null?s[g]:idFor(g,legacyIndex(legacyEquipped()));
  }
  function current(g=gender()){
    return parseId(g,preview[g])!==null?preview[g]:saved(g);
  }
  function spriteStyle(g,id){
    const i=parseId(g,id),c=CFG[g];
    if(i===null||!URLS[g])return '';
    const rows=Math.ceil(c.count/c.cols),aw=c.cols*c.cell,ah=rows*c.cell;
    const col=i%c.cols,row=Math.floor(i/c.cols),x=col*c.cell,y=row*c.cell;
    const sx=(aw/c.cell)*100, sy=(ah/c.cell)*100;
    const px=aw===c.cell?0:(x/(aw-c.cell))*100;
    const py=ah===c.cell?0:(y/(ah-c.cell))*100;
    return `background-image:url("${URLS[g]}");background-size:${sx}% ${sy}%;background-position:${px}% ${py}%;background-repeat:no-repeat`;
  }

  async function loadAtlas(g){
    const c=CFG[g];
    const r=await fetch(`./assets/clothing-runtime/hf2e/${c.file}?v=${REV}`,{cache:'no-store'});
    if(!r.ok)throw new Error(`${g} atlas HTTP ${r.status}`);
    const text=(await r.text()).replace(/\s+/g,'');
    if(text.length<64||!text.startsWith('UklGR'))throw new Error(`${g} atlas base64 invalid`);
    URLS[g]=`data:image/webp;base64,${text}`;
    META[g]={base64Chars:text.length,count:c.count,ready:true};
    return true;
  }

  function outfitInfo(){
    const arr=items().filter(x=>x?.type==='outfit'&&!x?.paid);
    return {arr,owned:new Set(snap()?.owned||[])};
  }
  function labelFor(g,i){
    if(i<4){
      const {arr,owned}=outfitInfo(),it=arr.find(x=>x.id===LEGACY[i]);
      return {name:it?.name||LEGACY_NAMES[i],sub:(it?.default||owned.has(LEGACY[i]))?'SAHİPSİN':`🪙 ${Number(it?.price||0)}`};
    }
    return {name:`${g==='male'?'Erkek':'Kadın'} Kombin ${i+1}`,sub:'DENE'};
  }
  function cardsHtml(g){
    const cur=current(g);
    return Array.from({length:CFG[g].count},(_,i)=>{
      const id=idFor(g,i),lab=labelFor(g,i),active=id===cur;
      return `<button type="button" class="v831-card v832g-card ${active?'active':''}" data-v832g-real="${id}" data-v832g-index="${i}"><span class="v831-thumb v832g-thumb"><span class="v831-sprite v832g-sprite" style="${spriteStyle(g,id)}"></span></span><b>${lab.name}</b><small class="${i<4?'v831-price':''}">${active?'SEÇİLİ':lab.sub}</small></button>`;
    }).join('');
  }
  function outfitTabActive(root){
    return !!$('.v831-main-tab.active[data-v831-cat="outfit"]',root);
  }
  function renderCards(){
    const root=$('#v812Wardrobe');
    if(!root?.classList?.contains('open')||!outfitTabActive(root))return false;
    const g=gender(),cards=$('.v831-cards',root);
    if(!cards||!URLS[g])return false;
    const sig=`${g}|${current(g)}|${legacyEquipped()}|${(snap()?.owned||[]).join(',')}`;
    if(cards.dataset.v832gSig!==sig||!$('.v832g-card',cards)){
      cards.innerHTML=cardsHtml(g);
      cards.dataset.v832gSig=sig;
    }else{
      $$('.v832g-card',cards).forEach(el=>el.classList.toggle('active',el.dataset.v832gReal===current(g)));
    }
    const h=$('.v831-selector-head b',root),s=$('.v831-selector-head small',root);
    if(h)h.textContent='Gerçek kıyafetler';
    if(s)s.textContent=`${CFG[g].count} kombin · sağa-sola kaydır`;
    let badge=$('.v832g-runtime-badge',root);
    if(!badge){
      badge=document.createElement('span');badge.className='v832g-runtime-badge';badge.textContent='HF2G · REAL OUTFITS';
      ($('.v831-selector-head',root)||root).appendChild(badge);
    }
    root.dataset.v832gCloset='ready';
    return true;
  }

  function wear(stack,g,id){
    if(!stack||!URLS[g]||parseId(g,id)===null)return false;
    $$(':scope>.v832-worn-outfit,:scope>.v832d-worn-outfit,:scope>.v832e-worn-outfit,:scope>.v832f-worn-outfit,:scope>.v832g-worn-outfit',stack).forEach(n=>n.remove());
    const el=document.createElement('span');
    el.className='v831-sprite v832g-worn-outfit';
    el.dataset.v832g=id;el.setAttribute('aria-hidden','true');
    el.style.cssText=spriteStyle(g,id);
    const base=$(':scope>.layer-base_avatar',stack);
    base?base.after(el):stack.prepend(el);
    return true;
  }
  function applyPreview(){
    const root=$('#v812Wardrobe'),g=gender();
    const stack=$('.v831-preview .v831-stack',root);
    if(stack)wear(stack,g,current(g));
  }
  function applyWorld(){
    const g=gender(),id=saved(g);
    $$('[data-v831-real-avatar="1"].v831-stack').forEach(stack=>{
      if(!stack.closest?.('#v812Wardrobe .v831-preview'))wear(stack,g,id);
    });
  }
  function refresh(){
    renderCards();applyPreview();applyWorld();
    document.documentElement.dataset.deenHF2G=(URLS.male||URLS.female)?'ready':'loading';
  }

  function choose(id){
    const g=gender();
    if(parseId(g,id)===null)return;
    preview[g]=id;
    try{state.myWorld.avatarAssets.visualOutfitPreview=id}catch(_){}
    refresh();setTimeout(refresh,30);setTimeout(refresh,120);
  }
  function commit(g){
    const id=current(g),idx=parseId(g,id);
    if(idx===null)return false;
    if(idx<4){
      const legacyId=LEGACY[idx],it=items().find(x=>x?.id===legacyId),owned=new Set(snap()?.owned||[]);
      try{
        if(it?.default||owned.has(legacyId))world()?.equip?.(legacyId);
        else if(Number(snap()?.gold||0)>=Number(it?.price||0))world()?.buy?.(legacyId);
      }catch(e){console.warn('HF2G legacy outfit commit',e)}
    }
    const s=store();s[g]=id;preview[g]=id;
    try{if(state?.myWorld?.avatarAssets)state.myWorld.avatarAssets.visualOutfitPreview=null;saveState?.();updateUI?.()}catch(_){}
    return true;
  }
  function patchPro(){
    const p=window.DEEN_WARDROBE_PRO;
    if(!p||p.__v832g)return false;
    const oldOpen=p.open,oldSave=p.save,oldCancel=p.cancel,oldRender=p.render;
    p.open=function(...a){
      const r=typeof oldOpen==='function'?oldOpen.apply(this,a):undefined;
      for(const g of ['male','female']){initial[g]=saved(g);preview[g]=initial[g]}
      [0,40,120,300].forEach(ms=>setTimeout(refresh,ms));return r;
    };
    p.save=function(...a){
      const g=gender();
      const r=typeof oldSave==='function'?oldSave.apply(this,a):undefined;
      if(r===false)return r;
      commit(g);[20,100].forEach(ms=>setTimeout(refresh,ms));return r;
    };
    p.cancel=function(...a){
      for(const g of ['male','female'])preview[g]=initial[g]||saved(g);
      const r=typeof oldCancel==='function'?oldCancel.apply(this,a):undefined;
      setTimeout(refresh,80);return r;
    };
    p.render=function(...a){const r=typeof oldRender==='function'?oldRender.apply(this,a):undefined;setTimeout(refresh,0);return r};
    p.__v832g=true;proPatched=true;return true;
  }
  function bind(){
    if(document.__v832gBound)return;document.__v832gBound=true;
    document.addEventListener('click',e=>{
      const card=e.target.closest?.('[data-v832g-real]');
      if(card){e.preventDefault();e.stopPropagation();choose(card.dataset.v832gReal);return}
      if(e.target.closest?.('#v812Wardrobe [data-v831-gender]')){setTimeout(()=>{const g=gender();preview[g]=saved(g);refresh()},50);return}
      if(e.target.closest?.('#v812Wardrobe .v831-main-tab')){setTimeout(refresh,20);setTimeout(refresh,100);return}
    },true);
  }

  async function boot(){
    bind();
    const loads=await Promise.allSettled([loadAtlas('male'),loadAtlas('female')]);
    if(!URLS.male&&!URLS.female){
      document.documentElement.dataset.deenHF2G='asset-error';
      window.DEEN_HF2G_ERROR=loads.map(x=>x.status==='rejected'?String(x.reason):'ok').join(' | ');
      console.error('DEEN HF2G atlases unavailable',loads);
      return;
    }
    for(const g of ['male','female'])preview[g]=saved(g);
    if(!intervalId)intervalId=setInterval(()=>{if(!proPatched)patchPro();const r=$('#v812Wardrobe');if(r?.classList?.contains('open'))refresh();else applyWorld()},250);
    [0,60,180,500,1200].forEach(ms=>setTimeout(refresh,ms));
    window.DEEN_REAL_CLOSET={
      version:VERSION,revision:REV,refresh,
      check:()=>({version:VERSION,revision:REV,status:document.documentElement.dataset.deenHF2G,gender:gender(),saved:saved(gender()),preview:current(gender()),realCards:$$('#v812Wardrobe .v832g-card').length,worn:$$('.v832g-worn-outfit').length,atlas:META,proPatched})
    };
    window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.3.2 HF2G';
  }
  boot().catch(err=>{document.documentElement.dataset.deenHF2G='error';window.DEEN_HF2G_ERROR=String(err?.message||err);console.error('DEEN HF2G boot failed',err)});
})();