(()=>{
  if(window.__deenV832HF2ICloset)return;
  window.__deenV832HF2ICloset=true;

  const VERSION='8.3.2-HF2I', REV='832hf2i1';
  const $=(s,r=document)=>r?.querySelector?.(s)||null;
  const $$=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
  const LEGACY=['outfit_teal','outfit_lavender','outfit_navy','outfit_cream'];
  const LEGACY_NAMES=['Teal Tunik','Lavanta Tunik','Lacivert Tunik','Krem Tunik'];
  const CFG={male:{count:12,cell:96,cols:6,file:'male_atlas.b64'},female:{count:11,cell:80,cols:6,file:'female_atlas.b64'}};
  const URLS={male:'',female:''}, META={male:null,female:null};
  const preview={male:null,female:null}, initial={male:null,female:null};
  let timer=0;

  function studio(){return window.DEEN_AVATAR_STUDIO}
  function pro(){return window.DEEN_WARDROBE_PRO}
  function world(){return window.DEEN_WORLD}
  function avatar(){return window.DEEN_AVATAR_ASSETS}
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
  function saved(g){const s=store();return parseId(g,s[g])!==null?s[g]:idFor(g,legacyIndex(legacyEquipped()))}
  function current(g=gender()){return parseId(g,preview[g])!==null?preview[g]:saved(g)}

  function spriteStyle(g,id){
    const i=parseId(g,id),c=CFG[g];if(i===null||!URLS[g])return '';
    const rows=Math.ceil(c.count/c.cols),aw=c.cols*c.cell,ah=rows*c.cell;
    const col=i%c.cols,row=Math.floor(i/c.cols),x=col*c.cell,y=row*c.cell;
    const sx=(aw/c.cell)*100,sy=(ah/c.cell)*100;
    const px=aw===c.cell?0:(x/(aw-c.cell))*100,py=ah===c.cell?0:(y/(ah-c.cell))*100;
    return `background-image:url("${URLS[g]}");background-size:${sx}% ${sy}%;background-position:${px}% ${py}%;background-repeat:no-repeat`;
  }
  async function loadAtlas(g){
    const c=CFG[g],r=await fetch(`./assets/clothing-runtime/hf2e/${c.file}?v=${REV}`,{cache:'no-store'});
    if(!r.ok)throw new Error(`${g} outfit atlas HTTP ${r.status}`);
    const text=(await r.text()).replace(/\s+/g,'');
    if(text.length<64||!text.startsWith('UklGR'))throw new Error(`${g} outfit atlas invalid`);
    URLS[g]=`data:image/webp;base64,${text}`;
    META[g]={base64Chars:text.length,count:c.count,canvas:[c.cols*c.cell,Math.ceil(c.count/c.cols)*c.cell]};
  }

  function outfitInfo(){const arr=worldItems().filter(x=>x?.type==='outfit'&&!x?.paid);return{arr,owned:new Set(worldSnap()?.owned||[])}}
  function labelFor(g,i){
    if(i<4){const {arr,owned}=outfitInfo(),it=arr.find(x=>x.id===LEGACY[i]);return{name:it?.name||LEGACY_NAMES[i],sub:(it?.default||owned.has(LEGACY[i]))?'SAHİPSİN':`🪙 ${Number(it?.price||0)}`}}
    return{name:`${g==='male'?'Erkek':'Kadın'} Kombin ${i+1}`,sub:'DENE'};
  }
  function cardsHtml(g){
    const cur=current(g);
    return Array.from({length:CFG[g].count},(_,i)=>{const id=idFor(g,i),lab=labelFor(g,i),active=id===cur;return `<button type="button" class="v812-card v812-outfit v832i-card ${active?'active':''}" data-v832i-real="${id}" data-v832i-index="${i}"><span class="ico v832i-thumb"><span class="v832i-sprite" style="${spriteStyle(g,id)}"></span></span><b>${lab.name}</b><span class="price">${active?'SEÇİLİ':lab.sub}</span></button>`}).join('');
  }
  function outfitMode(){try{const s=pro()?.snapshot?.();return s?.sub==='worldOutfit'||s?.cat==='outfit'}catch(_){return false}}

  function ensureRealPreview(){
    const root=$('#v812Wardrobe'),box=$('.v812-avatar',root);if(!root||!box||!outfitMode())return null;
    const g=gender();
    try{const st=avatar()?.state?.();if(st?.gender!==g)avatar()?.setGender?.(g)}catch(_){}
    if(!$('.v831-stack',box)){
      try{const html=avatar()?.svg?.(g);if(html){box.innerHTML=html;box.classList.add('v832i-real-preview')}}catch(_){}
    }
    return $('.v831-stack',box);
  }
  function renderCards(){
    const root=$('#v812Wardrobe');if(!root?.classList?.contains('open')||!outfitMode())return false;
    const g=gender(),grid=$('.v812-grid',root);if(!grid||!URLS[g])return false;
    const sig=`${g}|${current(g)}|${legacyEquipped()}|${(worldSnap()?.owned||[]).join(',')}`;
    if(grid.dataset.v832iSig!==sig||!$('.v832i-card',grid)){grid.innerHTML=cardsHtml(g);grid.dataset.v832iSig=sig;grid.classList.add('v832i-real-grid')}
    else $$('.v832i-card',grid).forEach(el=>el.classList.toggle('active',el.dataset.v832iReal===current(g)));
    let badge=$('.v832i-runtime-badge',root);if(!badge){badge=document.createElement('span');badge.className='v832i-runtime-badge';badge.textContent='HF2I · REAL OUTFITS';$('.v812-subtabs',root)?.insertAdjacentElement('afterend',badge)}
    root.dataset.v832iCloset='ready';return true;
  }
  function wear(stack,g,id){
    if(!stack||!URLS[g]||parseId(g,id)===null)return false;
    $$(':scope>.v832-worn-outfit,:scope>.v832d-worn-outfit,:scope>.v832e-worn-outfit,:scope>.v832f-worn-outfit,:scope>.v832g-worn-outfit,:scope>.v832h-worn-outfit,:scope>.v832h-world-outfit,:scope>.v832i-worn-outfit',stack).forEach(n=>n.remove());
    const el=document.createElement('span');el.className='v831-sprite v832i-worn-outfit';el.dataset.v832i=id;el.dataset.v832iGender=g;el.setAttribute('aria-hidden','true');el.style.cssText=spriteStyle(g,id);
    const base=$(':scope>.layer-base_avatar',stack);base?base.after(el):stack.prepend(el);return true;
  }
  function applyPreview(){const stack=ensureRealPreview(),g=gender();if(stack)wear(stack,g,current(g))}
  function applyWorld(){
    const g=gender(),id=saved(g);if(!URLS[g]||parseId(g,id)===null)return;
    $$('[data-v831-real-avatar="1"].v831-stack').forEach(stack=>{if(stack.closest?.('#v812Wardrobe'))return;wear(stack,g,id)});
  }
  function choose(id){const g=gender();if(parseId(g,id)===null)return;preview[g]=id;try{state.myWorld.avatarAssets.visualOutfitPreview=id}catch(_){};renderCards();applyPreview()}
  function commit(){
    const g=gender(),id=current(g),idx=parseId(g,id);if(idx===null)return false;
    if(idx<4){const legacy=LEGACY[idx],it=worldItems().find(x=>x?.id===legacy),snap=worldSnap(),owned=new Set(snap?.owned||[]),cost=Number(it?.price||0);if(!(it?.default||owned.has(legacy))&&Number(snap?.gold||0)<cost)return false;try{if(it?.default||owned.has(legacy))world()?.equip?.(legacy);else world()?.buy?.(legacy)}catch(_){return false}}
    const s=store();s[g]=id;preview[g]=id;try{state.myWorld.avatarAssets.visualOutfitPreview=null;saveState?.();updateUI?.()}catch(_){};initial[g]=id;applyWorld();return true;
  }
  function closeToWorld(){const root=$('#v812Wardrobe');if(root)root.classList.remove('open');try{document.body.style.overflow=''}catch(_){};setTimeout(()=>{try{world()?.open?.('world')}catch(_){}},80)}
  function tick(){
    const root=$('#v812Wardrobe');
    if(root?.classList?.contains('open')){const g=gender();if(!initial[g]){initial[g]=saved(g);preview[g]=initial[g]}if(outfitMode()){renderCards();applyPreview()}else $('.v812-avatar',root)?.classList?.remove('v832i-real-preview')}
    else applyWorld();
    document.documentElement.dataset.deenHF2I=(URLS.male||URLS.female)?'ready':'loading';
  }
  function bind(){
    if(document.__v832iBound)return;document.__v832iBound=true;
    document.addEventListener('click',e=>{
      const card=e.target.closest?.('[data-v832i-real]');if(card){e.preventDefault();e.stopImmediatePropagation();choose(card.dataset.v832iReal);return}
      if(e.target.closest?.('#v812Wardrobe [data-v812-save]')&&$('#v812Wardrobe')?.classList?.contains('open')&&outfitMode()){e.preventDefault();e.stopImmediatePropagation();if(commit())closeToWorld();return}
      if(e.target.closest?.('#v812Wardrobe [data-v812-cancel]')){const g=gender();preview[g]=initial[g]||saved(g);setTimeout(tick,40);return}
      if(e.target.closest?.('#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub]')){setTimeout(tick,30);setTimeout(tick,120)}
    },true);
  }
  async function boot(){
    bind();const result=await Promise.allSettled([loadAtlas('male'),loadAtlas('female')]);
    if(!URLS.male&&!URLS.female){document.documentElement.dataset.deenHF2I='asset-error';window.DEEN_HF2I_ERROR=result.map(x=>x.status==='rejected'?String(x.reason):'ok').join(' | ');console.error('DEEN HF2I outfit atlases unavailable',result);return}
    for(const g of ['male','female'])preview[g]=saved(g);
    timer=setInterval(tick,120);[0,80,220,500,1200].forEach(ms=>setTimeout(tick,ms));
    window.DEEN_REAL_CLOSET={version:VERSION,revision:REV,refresh:tick,check:()=>({version:VERSION,revision:REV,status:document.documentElement.dataset.deenHF2I,target:'v8.1.2-dom+v8.3.1-real-avatar',gender:gender(),mode:outfitMode(),saved:saved(gender()),preview:current(gender()),realCards:$$('#v812Wardrobe .v832i-card').length,worn:$$('.v832i-worn-outfit').length,realPreview:!!$('#v812Wardrobe .v812-avatar .v831-stack'),atlas:META})};
    const stamp=()=>{window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.3.2 HF2I'};stamp();[1500,3500,5500].forEach(ms=>setTimeout(stamp,ms));
  }
  boot().catch(err=>{document.documentElement.dataset.deenHF2I='error';window.DEEN_HF2I_ERROR=String(err?.message||err);console.error('DEEN HF2I closet boot failed',err)});
})();
