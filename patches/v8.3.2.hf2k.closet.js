(()=>{
 if(window.__deenV832HF2KCloset)return;window.__deenV832HF2KCloset=true;
 const VERSION='8.3.2-HF2K',REV='832hf2k1';
 const $=(s,r=document)=>r?.querySelector?.(s)||null,$$=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
 const LEGACY=['outfit_teal','outfit_lavender','outfit_navy','outfit_cream'];
 const NAMES=['Teal Tunik','Lavanta Tunik','Lacivert Tunik','Krem Tunik'];
 const CFG={male:{count:12,cell:96,cols:6,file:'male_atlas.b64'},female:{count:11,cell:80,cols:6,file:'female_atlas.b64'}};
 const URLS={male:'',female:''},preview={male:null,female:null},initial={male:null,female:null};
 function studio(){return window.DEEN_AVATAR_STUDIO} function pro(){return window.DEEN_WARDROBE_PRO} function world(){return window.DEEN_WORLD} function avatar(){return window.DEEN_AVATAR_ASSETS}
 function gender(){try{return studio()?.state?.().gender==='male'?'male':'female'}catch(_){return 'female'}}
 function ws(){try{return world()?.snapshot?.()||{}}catch(_){return {}}} function items(){try{return world()?.items?.()||[]}catch(_){return []}}
 function idFor(g,i){return `${g}_${String(i+1).padStart(2,'0')}`} function idx(g,id){const m=String(id||'').match(new RegExp(`^${g}_(\\d{2})$`));if(!m)return null;const n=+m[1]-1;return n>=0&&n<CFG[g].count?n:null}
 function legacyEq(){return ws()?.equipped?.outfit||'outfit_teal'} function legacyIdx(){const n=LEGACY.indexOf(legacyEq());return n<0?0:n}
 function store(){try{state.myWorld=state.myWorld&&typeof state.myWorld==='object'?state.myWorld:{};state.myWorld.avatarAssets=state.myWorld.avatarAssets&&typeof state.myWorld.avatarAssets==='object'?state.myWorld.avatarAssets:{};const a=state.myWorld.avatarAssets;a.visualOutfit=a.visualOutfit&&typeof a.visualOutfit==='object'?a.visualOutfit:{};return a.visualOutfit}catch(_){return {}}}
 function saved(g){const s=store();return idx(g,s[g])!==null?s[g]:idFor(g,legacyIdx())} function current(g=gender()){return idx(g,preview[g])!==null?preview[g]:saved(g)}
 function outfitMode(){try{const s=pro()?.snapshot?.();return s?.sub==='worldOutfit'||s?.cat==='outfit'}catch(_){return false}}
 function atlasStyle(g,id){const i=idx(g,id),c=CFG[g];if(i===null||!URLS[g])return '';const rows=Math.ceil(c.count/c.cols),aw=c.cols*c.cell,ah=rows*c.cell,col=i%c.cols,row=Math.floor(i/c.cols),px=aw===c.cell?0:(col*c.cell/(aw-c.cell))*100,py=ah===c.cell?0:(row*c.cell/(ah-c.cell))*100;return `background-image:url(${URLS[g]});background-size:${(aw/c.cell)*100}% ${(ah/c.cell)*100}%;background-position:${px}% ${py}%;background-repeat:no-repeat;`}
 async function load(g){const r=await fetch(`./assets/clothing-runtime/hf2e/${CFG[g].file}?v=${REV}`,{cache:'no-store'});if(!r.ok)throw new Error(`${g} atlas HTTP ${r.status}`);const t=(await r.text()).replace(/\s+/g,'');if(!t.startsWith('UklGR'))throw new Error(`${g} atlas invalid`);URLS[g]=`data:image/webp;base64,${t}`}
 function info(g,i){if(i<4){const it=items().find(o=>o?.id===LEGACY[i]),owned=new Set(ws()?.owned||[]);return{name:it?.name||NAMES[i],sub:(it?.default||owned.has(LEGACY[i]))?'SAHİPSİN':`🪙 ${Number(it?.price||0)}`}}return{name:`${g==='male'?'Erkek':'Kadın'} Kombin ${i+1}`,sub:'KATALOG'}}
 function cards(g){const cur=current(g);return Array.from({length:CFG[g].count},(_,i)=>{const id=idFor(g,i),m=info(g,i);return `<button type="button" class="v812-card v812-outfit v832k-card ${id===cur?'active':''}" data-v832k-real="${id}"><span class="ico v832k-thumb"><span class="v832k-sprite" style="${atlasStyle(g,id)}"></span></span><b>${m.name}</b><span class="price">${id===cur?'SEÇİLİ':m.sub}</span></button>`}).join('')}
 function bodySvg(g){
  const skin='#efb28f',skin2='#d99070',line='#263b40',cloth='#34434a',cloth2='#26353b';
  if(g==='male')return `<svg class="v832k-body-svg" viewBox="0 0 260 344" aria-hidden="true"><g stroke="${line}" stroke-width="4" stroke-linejoin="round"><path fill="${skin}" d="M112 101h36v35h-36z"/><path fill="${cloth}" d="M75 125q55-27 110 0l18 101-28 16-10-87v112H95V155l-10 87-28-16z"/><path fill="${cloth2}" d="M96 260h29v67H87l5-64zm39 0h29l4 64h-38z"/><path fill="${skin}" d="M57 225q12 5 28 17l-6 18q-19-7-28-20zm146 0-28 17 6 18q19-7 28-20z"/></g></svg>`;
  return `<svg class="v832k-body-svg" viewBox="0 0 260 344" aria-hidden="true"><g stroke="${line}" stroke-width="4" stroke-linejoin="round"><path fill="${skin}" d="M113 101h34v34h-34z"/><path fill="${cloth}" d="M83 126q47-26 94 0l18 105-27 13-11-88 9 100h-72l9-100-11 88-27-13z"/><path fill="${cloth2}" d="M101 255h25v70H91l7-68zm33 0h25l7 68h-35z"/><path fill="${skin}" d="M65 230q11 4 27 14l-5 18q-19-7-28-18zm130 0-27 14 5 18q19-7 28-18z"/></g></svg>`;
 }
 function ensureMannequin(){
  const root=$('#v812Wardrobe'),box=$('.v812-avatar',root);if(!root||!box||!outfitMode())return null;
  const g=gender();try{const st=avatar()?.state?.();if(st?.gender!==g)avatar()?.setGender?.(g)}catch(_){}
  let m=$('.v832k-mannequin',box);
  if(!m||m.dataset.gender!==g){
   let head='';try{head=avatar()?.svg?.(g)||''}catch(_){}
   box.innerHTML=`<div class="v832k-mannequin" data-gender="${g}">${bodySvg(g)}<div class="v832k-head-slot">${head}</div><span class="v832k-body-note">GÖVDE PROTOTİPİ</span></div>`;
   box.classList.add('v832k-body-preview');m=$('.v832k-mannequin',box);
  }
  return m;
 }
 function render(){
  const root=$('#v812Wardrobe');if(!root?.classList?.contains('open')||!outfitMode())return;
  const g=gender(),grid=$('.v812-grid',root);if(!grid||!URLS[g])return;
  grid.innerHTML=cards(g);grid.classList.add('v832k-real-grid');
  let b=$('.v832k-runtime-badge',root);if(!b){b=document.createElement('span');b.className='v832k-runtime-badge';$('.v812-subtabs',root)?.insertAdjacentElement('afterend',b)}b.textContent='HF2K · BODY FIT TEST';
  ensureMannequin();
  const f=$('.v812-footcopy',root);if(f)f.innerHTML='<b>Adım 1 · Kıyafet uyumlu gövde</b><small>Şimdilik kıyafet giydirme kapalı. Önce kadın/erkek gövde oranını onaylıyoruz.</small>';
 }
 function choose(id){const g=gender();if(idx(g,id)===null)return;preview[g]=id;render()}
 function tick(){const root=$('#v812Wardrobe');if(root?.classList?.contains('open')){const g=gender();if(!initial[g])initial[g]=saved(g);if(preview[g]==null)preview[g]=initial[g];if(outfitMode())render()}}
 document.addEventListener('click',e=>{const c=e.target.closest?.('[data-v832k-real]');if(c){e.preventDefault();e.stopImmediatePropagation();choose(c.dataset.v832kReal);return}if(e.target.closest?.('#v812Wardrobe [data-v812-save]')&&outfitMode()){e.preventDefault();e.stopImmediatePropagation();return}if(e.target.closest?.('#v812Wardrobe [data-v812-cat],#v812Wardrobe [data-v812-sub]')){setTimeout(tick,40);setTimeout(tick,140)}},true);
 Promise.all([load('male'),load('female')]).then(()=>{for(const g of ['male','female'])preview[g]=saved(g);setInterval(tick,180);[0,100,300,900].forEach(ms=>setTimeout(tick,ms));window.DEEN_REAL_CLOSET={version:VERSION,check:()=>({version:VERSION,gender:gender(),cards:$$('#v812Wardrobe .v832k-card').length,body:!!$('#v812Wardrobe .v832k-mannequin'),phase:'body-fit-only'})};window.DEEN_RELEASE_VERSION=VERSION;document.title='DEEN v8.3.2 HF2K'}).catch(err=>{window.DEEN_HF2K_ERROR=String(err?.message||err);console.error(err)});
})();