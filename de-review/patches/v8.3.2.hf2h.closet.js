(()=>{
  if(window.__deenV832HF2HCloset)return;
  window.__deenV832HF2HCloset=true;

  const VERSION='8.3.2-HF2H', REV='832hf2h1';
  const $=(s,r=document)=>r?.querySelector?.(s)||null;
  const $$=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
  const LEGACY=['outfit_teal','outfit_lavender','outfit_navy','outfit_cream'];
  const LEGACY_NAMES=['Teal Tunik','Lavanta Tunik','Lacivert Tunik','Krem Tunik'];
  const CFG={
    male:{count:12,cell:96,cols:6,file:'male_atlas.b64'},
    female:{count:11,cell:80,cols:6,file:'female_atlas.b64'}
  };
  const URLS={male:'',female:''}, META={male:null,female:null};
  const preview={male:null,female:null}, initial={male:null,female:null};
  let timer=0;

  function studio(){return window.DEEN_AVATAR_STUDIO}
  function pro(){return window.DEEN_WARDROBE_PRO}
  function world(){return window.DEEN_WORLD}
  function studioState(){try{return studio()?.state?.()||{}}catch(_){return {}}}
  function worldSnap(){try{return world()?.snapshot?.()||{}}catch(_){return {}}}
  function worldItems(){try{return world()?.items?.()||[]}catch(_){return []}}
  function gender(){return studioState()?.gender==='male'?'male':'female'}
  function idFor(g,i){return `${g}_${String(i+1).padStart(2,'0')}`}
  function parseId(g,id){const m=String(id||'').match(new RegExp(`^${g}_(\\d{2})$`));if(!m)return null;const i=Number(m[1])-1;return i>=0&&i<CFG[g].count?i:null}
  function legacyIndex(id){const i=LEGACY.indexOf(id);return i<0?0:i}
  function legacyEquipped(){return worldSnap()?.equipped?.outfit||'outfit_teal'}

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
  function current(g=gender()){return parseId(g,preview[g])!==null?preview[g]:saved(g)}

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
    if(!r.ok)throw new Error(`${g} outfit atlas HTTP ${r.status}`);
    const text=(await r.text()).replace(/\s+/g,'');
    if(text.length<64||!text.startsWith('UklGR'))throw new Error(`${g} outfit atlas invalid`);
    URLS[g]=`data:image/webp;base64,${text}`;
    META[g]={base64Chars:text.length,count:c.count,canvas:[c.cols*c.cell,Math.ceil(c.count/c.cols)*c.cell]};
  }

  function outfitInfo(){
    const arr=worldItems().filter(x=>x?.type==='outfit'&&!x?.paid);
    return {arr,owned:new Set(worldSnap()?.owned||[])};
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
      return `<button type="button" class="v812-card v812-outfit v832h-card ${active?'active':''}" data-v832h-real="${id}" data-v832h-index="${i}"><span class="ico v832h-thumb"><span class="v832h-sprite" style="${spriteStyle(g,id)}"></span></span><b>${lab.name}</b><span class="price">${active?'SEÇİLİ':lab.sub}</span></button>`;
    }).join('');
  }

  function outfitMode(){
    try{const s=pro()?.snapshot?.();return s?.sub==='worldOutfit'||s?.cat==='outfit'}catch(_){return false}
  }
  function renderCards(){
    const root=$('#v812Wardrobe');
    if(!root?.classList?.contains('open')||!outfitMode())return false;
    const g=gender(),grid=$('.v812-grid',root);
    if(!grid||!URLS[g])return false;
    const sig=`${g}|${current(g)}|${legacyEquipped()}|${(worldSnap()?.owned||[]).join(',')}`;
    if(grid.dataset.v832hSig!==sig||!$('.v832h-card',grid)){
      grid.innerHTML=cardsHtml(g);
      grid.dataset.v832hSig=sig;
      grid.classList.add('v832h-real-grid');
    } else {
      $$('.v832h-card',grid).forEach(el=>el.classList.toggle('active',el.dataset.v832hReal===current(g)));
    }
    let badge=$('.v832h-runtime-badge',root);
    if(!badge){
      badge=document.createElement('span');badge.className='v832h-runtime-badge';badge.textContent='HF2H · REAL OUTFITS';
      const subtabs=$('.v812-subtabs',root);subtabs?.insertAdjacentElement('afterend',badge);
    }
    root.dataset.v832hCloset='ready';
    return true;
  }

  function applyPreview(){
    const root=$('#v812Wardrobe');
    if(!root?.classList?.contains('open'))return;
    const box=$('.v812-avatar',root),g=gender(),id=current(g);
    if(!box||!URLS[g]||parseId(g,id)===null)return;
    let wear=$('.v832h-worn-outfit',box);
    if(!wear){wear=document.createElement('span');wear.className='v832h-worn-outfit';wear.setAttribute('aria-hidden','true');box.appendChild(wear)}
    wear.dataset.v832h=id;wear.style.cssText=spriteStyle(g,id);
  }
  function applyWorld(){
    const g=gender(),id=saved(g);
    if(!URLS[g]||parseId(g,id)===null)return;
    $$('[data-v831-real-avatar="1"].v831-stack').forEach(stack=>{
      if(stack.closest?.('#v812Wardrobe'))return;
      let wear=$(':scope>.v832h-world-outfit',stack);
      if(!wear){wear=document.createElement('span');wear.className='v831-sprite v832h-world-outfit';wear.setAttribute('aria-hidden','true');const base=$(':scope>.layer-base_avatar',stack);base?base.after(wear):stack.prepend(wear)}
      wear.dataset.v832h=id;wear.style.cssText=spriteStyle(g,id);
    });
  }

  function choose(id){
    const g=gender();if(parseId(g,id)===null)return;
    preview[g]=id;
    try{state.myWorld.avatarAssets.visualOutfitPreview=id}catch(_){}
    renderCards();applyPreview();
  }
  function commit(){
    const g=gender(),id=current(g),idx=parseId(g,id);if(idx===null)return false;
    if(idx<4){
      const legacy=LEGACY[idx],it=worldItems().find(x=>x?.id===legacy),snap=worldSnap(),owned=new Set(snap?.owned||[]),cost=Number(it?.price||0);
      if(!(it?.default||owned.has(legacy))&&Number(snap?.gold||0)<cost)return false;
      try{if(it?.default||owned.has(legacy))world()?.equip?.(legacy);else world()?.buy?.(legacy)}catch(_){return false}
    }
    const s=store();s[g]=id;preview[g]=id;
    try{state.myWorld.avatarAssets.visualOutfitPreview=null;saveState?.();updateUI?.()}catch(_){}
    initial[g]=id;applyWorld();return true;
  }
  function closeToWorld(){
    const root=$('#v812Wardrobe');if(root)root.classList.remove('open');
    try{document.body.style.overflow=''}catch(_){}
    setTimeout(()=>{try{world()?.open?.('world')}catch(_){}},80);
  }

  function tick(){
    const root=$('#v812Wardrobe');
    if(root?.classList?.contains('open')){
      const g=gender();if(!initial[g]){initial[g]=saved(g);preview[g]=initial[g]}
      if(outfitMode()){renderCards();applyPreview()}
    } else applyWorld();
    document.documentElement.dataset.deenHF2H=(URLS.male||URLS.female)?'ready':'loading';
  }

  function bind(){
    if(document.__v832hBound)return;document.__v832hBound=true;
    document.addEventListener('click',e=>{
      const card=e.target.closest?.('[data-v832h-real]');
      if(card){e.preventDefault();e.stopImmediatePropagation();choose(card.dataset.v832hReal);return}
      if(e.target.closest?.('#v812Wardrobe [data-v812-save]')&&$('#v812Wardrobe')?.classList?.contains('open')&&outfitMode()){
        e.preventDefault();e.stopImmediatePropagation();if(commit())closeToWorld();return;
      }
      if(e.target.closest?.('#v812Wardrobe [data-v812-cancel]')){
        const g=gender();preview[g]=initial[g]||saved(g);setTimeout(tick,40);return;
      }
      if(e.target.closest?.('#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub]')){setTimeout(tick,30);setTimeout(tick,120)}
    },true);
  }

  async function boot(){
    bind();
    const result=await Promise.allSettled([loadAtlas('male'),loadAtlas('female')]);
    if(!URLS.male&&!URLS.female){
      document.documentElement.dataset.deenHF2H='asset-error';
      window.DEEN_HF2H_ERROR=result.map(x=>x.status==='rejected'?String(x.reason):'ok').join(' | ');
      console.error('DEEN HF2H outfit atlases unavailable',result);return;
    }
    for(const g of ['male','female'])preview[g]=saved(g);
    timer=setInterval(tick,120);[0,80,220,500,1200].forEach(ms=>setTimeout(tick,ms));
    window.DEEN_REAL_CLOSET={version:VERSION,revision:REV,refresh:tick,check:()=>({version:VERSION,revision:REV,status:document.documentElement.dataset.deenHF2H,target:'v8.1.2-wardrobe-dom',gender:gender(),mode:outfitMode(),saved:saved(gender()),preview:current(gender()),realCards:$$('#v812Wardrobe .v832h-card').length,worn:$$('#v812Wardrobe .v832h-worn-outfit').length,atlas:META})};
    window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.3.2 HF2H';
  }
  boot().catch(err=>{document.documentElement.dataset.deenHF2H='error';window.DEEN_HF2H_ERROR=String(err?.message||err);console.error('DEEN HF2H closet boot failed',err)});
})();
