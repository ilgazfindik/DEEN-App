(()=>{
 if(window.__deenV832HF2KCloset)return;window.__deenV832HF2KCloset=true;
 const VERSION='8.4.3-BASIC-CLOSET',REV='843basic1';
 const $=(s,r=document)=>r?.querySelector?.(s)||null,$$=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
 const LEGACY=['outfit_teal','outfit_lavender','outfit_navy','outfit_cream'];
 const NAMES=['Teal Tunik','Lavanta Tunik','Lacivert Tunik','Krem Tunik'];
 // Only the original/basic four outfits are exposed. sheetCount preserves atlas geometry.
 const CFG={
  male:{count:4,sheetCount:12,cell:96,cols:6,file:'male_atlas.b64'},
  female:{count:4,sheetCount:11,cell:80,cols:6,file:'female_atlas.b64'}
 };
 const URLS={male:'',female:''},preview={male:null,female:null},initial={male:null,female:null};
 let raf=0,loaded=false,saving=false;
 function studio(){return window.DEEN_AVATAR_STUDIO}
 function pro(){return window.DEEN_WARDROBE_PRO}
 function world(){return window.DEEN_WORLD}
 function root(){return $('#v812Wardrobe')}
 function gender(){try{return studio()?.state?.().gender==='male'?'male':'female'}catch(_){return 'female'}}
 function ws(){try{return world()?.snapshot?.()||{}}catch(_){return {}}}
 function items(){try{return world()?.items?.()||[]}catch(_){return []}}
 function idFor(g,i){return `${g}_${String(i+1).padStart(2,'0')}`}
 function idx(g,id){const m=String(id||'').match(new RegExp(`^${g}_(\\d{2})$`));if(!m)return null;const n=+m[1]-1;return n>=0&&n<CFG[g].count?n:null}
 function legacyEq(){return ws()?.equipped?.outfit||'outfit_teal'}
 function legacyIdx(){const n=LEGACY.indexOf(legacyEq());return n<0?0:n}
 function store(){try{state.myWorld=state.myWorld&&typeof state.myWorld==='object'?state.myWorld:{};state.myWorld.avatarAssets=state.myWorld.avatarAssets&&typeof state.myWorld.avatarAssets==='object'?state.myWorld.avatarAssets:{};const a=state.myWorld.avatarAssets;a.visualOutfit=a.visualOutfit&&typeof a.visualOutfit==='object'?a.visualOutfit:{};return a.visualOutfit}catch(_){return {}}}
 function saved(g){const s=store();return idx(g,s[g])!==null?s[g]:idFor(g,legacyIdx())}
 function current(g=gender()){return idx(g,preview[g])!==null?preview[g]:saved(g)}
 function outfitMode(){try{const s=pro()?.snapshot?.();return s?.sub==='worldOutfit'||s?.cat==='outfit'}catch(_){return false}}
 function atlasStyle(g,id){
  const i=idx(g,id),c=CFG[g];if(i===null||!URLS[g])return '';
  const rows=Math.ceil(c.sheetCount/c.cols),aw=c.cols*c.cell,ah=rows*c.cell,col=i%c.cols,row=Math.floor(i/c.cols);
  const px=aw===c.cell?0:(col*c.cell/(aw-c.cell))*100,py=ah===c.cell?0:(row*c.cell/(ah-c.cell))*100;
  return `background-image:url(${URLS[g]});background-size:${(aw/c.cell)*100}% ${(ah/c.cell)*100}%;background-position:${px}% ${py}%;background-repeat:no-repeat;`;
 }
 async function load(g){const r=await fetch(`./assets/clothing-runtime/hf2e/${CFG[g].file}?v=${REV}`,{cache:'no-store'});if(!r.ok)throw new Error(`${g} atlas HTTP ${r.status}`);const t=(await r.text()).replace(/\s+/g,'');if(!t.startsWith('UklGR'))throw new Error(`${g} atlas invalid`);URLS[g]=`data:image/webp;base64,${t}`}
 function info(i){const it=items().find(o=>o?.id===LEGACY[i]),owned=new Set(ws()?.owned||[]);return{name:it?.name||NAMES[i],sub:(it?.default||owned.has(LEGACY[i]))?'SAHİPSİN':`🪙 ${Number(it?.price||0)}`}}
 function nameFor(g,id){const i=idx(g,id);return i===null?'Kıyafet':info(i).name}
 function cards(g){const cur=current(g);return Array.from({length:4},(_,i)=>{const id=idFor(g,i),m=info(i);return `<button type="button" class="v812-card v812-outfit v832k-card ${id===cur?'active':''}" data-v832k-real="${id}"><span class="ico v832k-thumb"><span class="v832k-sprite" style="${atlasStyle(g,id)}"></span></span><b>${m.name}</b><span class="price">${id===cur?'SEÇİLİ':m.sub}</span></button>`}).join('')}
 function bodySvg(g){const skin='#efb28f',line='#263b40',cloth='#34434a',cloth2='#26353b';if(g==='male')return `<svg class="v832k-body-svg" viewBox="0 0 260 344" aria-hidden="true"><g stroke="${line}" stroke-width="4" stroke-linejoin="round"><path fill="${skin}" d="M112 101h36v35h-36z"/><path fill="${cloth}" d="M75 125q55-27 110 0l18 101-28 16-10-87v112H95V155l-10 87-28-16z"/><path fill="${cloth2}" d="M96 260h29v67H87l5-64zm39 0h29l4 64h-38z"/></g></svg>`;return `<svg class="v832k-body-svg" viewBox="0 0 260 344" aria-hidden="true"><g stroke="${line}" stroke-width="4" stroke-linejoin="round"><path fill="${skin}" d="M113 101h34v34h-34z"/><path fill="${cloth}" d="M83 126q47-26 94 0l18 105-27 13-11-88 9 100h-72l9-100-11 88-27-13z"/><path fill="${cloth2}" d="M101 255h25v70H91l7-68zm33 0h25l7 68h-35z"/></g></svg>`}
 function ensureMannequin(){const r=root(),box=$('.v812-avatar',r);if(!r||!box||!outfitMode())return null;const g=gender();let m=$('.v832k-mannequin',box);if(!m||m.dataset.gender!==g){box.innerHTML=`<div class="v832k-mannequin" data-gender="${g}">${bodySvg(g)}<div class="v832k-head-slot"></div></div>`;box.classList.add('v832k-body-preview');m=$('.v832k-mannequin',box)}return m}
 function syncSelectionText(){const r=root();if(!r||!outfitMode())return;const g=gender(),id=current(g),name=nameFor(g,id);r.dataset.deenVisualOutfit=id;r.dataset.deenVisualOutfitName=name;const leaves=$$('*',r).filter(el=>!el.children.length&&el.textContent.trim()==='Şu an seçili');for(const label of leaves){let row=label.parentElement;for(let depth=0;row&&depth<4;depth++,row=row.parentElement){if(row.querySelector?.('[data-v832k-real]'))break;const target=$$('b,small,span,div',row).find(el=>!el.closest?.('[data-v832k-real]')&&/^(Teal|Lavanta|Lacivert|Krem) Tunik$/.test(el.textContent.trim()));if(target){target.textContent=name;break}}}}
 function render(){const r=root();if(!loaded||!r?.classList?.contains('open')||!outfitMode())return false;const g=gender(),grid=$('.v812-grid',r);if(!grid||!URLS[g])return false;if(!initial[g])initial[g]=saved(g);if(preview[g]==null)preview[g]=initial[g];grid.innerHTML=cards(g);grid.classList.add('v832k-real-grid');ensureMannequin();syncSelectionText();document.documentElement.dataset.deenCloset='basic-ready';return true}
 function refreshVisuals(){window.DEEN_HF2U?.refresh?.()}
 function choose(id){const g=gender();if(idx(g,id)===null)return false;preview[g]=id;render();syncSelectionText();refreshVisuals();return true}
 function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;render()})}
 function resetSession(){for(const g of ['male','female']){const id=saved(g);initial[g]=id;preview[g]=id}schedule()}
 function ownershipForLegacy(i){const id=LEGACY[i],it=items().find(o=>o?.id===id),own=new Set(ws()?.owned||[]);return{id,it,owned:!!(it?.default||own.has(id)),cost:Number(it?.price||0)}}
 function canCommit(g,id){const i=idx(g,id);if(i===null)return false;const m=ownershipForLegacy(i);return m.owned||Number(ws()?.gold||0)>=m.cost}
 function persistVisual(g,id){const i=idx(g,id);if(i===null)return false;const m=ownershipForLegacy(i);try{if(!m.owned&&m.it)world()?.buy?.(m.id);world()?.equip?.(m.id)}catch(err){console.warn('basic outfit economy',err)}const s=store();s[g]=id;try{state.myWorld.avatar=state.myWorld.avatar&&typeof state.myWorld.avatar==='object'?state.myWorld.avatar:{};state.myWorld.avatar.created=true;state.myWorld.avatar.visualOutfit=id;state.myWorld.avatar.visualOutfitVersion=VERSION;saveState?.();updateUI?.()}catch(err){console.warn('basic outfit save',err)}initial[g]=id;preview[g]=id;return true}
 function commit(){if(saving)return false;const g=gender(),id=current(g);if(!canCommit(g,id))return false;saving=true;let result=true;try{const p=pro();if(typeof p?.save==='function'){const r=p.save();if(r===false)result=false}if(result!==false)persistVisual(g,id)}catch(err){console.error('basic closet save',err);result=false}finally{saving=false}return result}
 function cancel(){resetSession();try{return pro()?.cancel?.()}catch(err){console.error('basic closet cancel',err);return false}}
 function patchPro(){const p=pro();if(!p||p.__v843BasicCloset)return false;const oldOpen=p.open;p.open=function(...args){const r=typeof oldOpen==='function'?oldOpen.apply(this,args):undefined;resetSession();requestAnimationFrame(()=>{schedule();refreshVisuals()});return r};p.__v843BasicCloset=true;return true}
 document.addEventListener('click',e=>{const r=root(),c=e.target.closest?.('[data-v832k-real]');if(c){e.preventDefault();e.stopImmediatePropagation();choose(c.dataset.v832kReal);return}if(r?.classList?.contains('open')&&e.target.closest?.('#v812Wardrobe [data-v812-save],#v812Wardrobe [data-v831-save]')){e.preventDefault();e.stopImmediatePropagation();commit();return}if(r?.classList?.contains('open')&&e.target.closest?.('#v812Wardrobe [data-v812-cancel]')){e.preventDefault();e.stopImmediatePropagation();cancel();return}if(e.target.closest?.('#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub],#v812Wardrobe [data-v831-gender],[data-v810-open-wardrobe]'))requestAnimationFrame(()=>{schedule();syncSelectionText();refreshVisuals()})},true);
 let patchFrames=0;function ensurePatched(){if(patchPro())return;if(patchFrames++<120)requestAnimationFrame(ensurePatched)}ensurePatched();
 Promise.all([load('male'),load('female')]).then(()=>{loaded=true;resetSession();requestAnimationFrame(schedule);window.DEEN_REAL_CLOSET={version:VERSION,refresh:schedule,current:()=>current(),saved:g=>saved(g||gender()),choose,save:commit,cancel,reset:resetSession,check:()=>({version:VERSION,gender:gender(),current:current(),saved:saved(gender()),cards:$$('#v812Wardrobe .v832k-card').length,body:!!$('#v812Wardrobe .v832k-mannequin'),visualStore:{...store()},basicOnly:true,counts:{female:4,male:4}})}}).catch(err=>{window.DEEN_HF2K_ERROR=String(err?.message||err);console.error(err)});
})();