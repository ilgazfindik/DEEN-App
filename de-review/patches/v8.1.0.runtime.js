(()=>{
  const SEL='#worldScreenBody';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const unitLabel=n=>'U'+String(n).padStart(2,'0');
  function worldBody(){return document.querySelector(SEL)}
  function isWorldMain(){
    const b=worldBody(); if(!b) return false;
    if($('.v810-shell',b)) return true;
    if($('.v750-world',b)) return true;
    const active=$('.v740-world-tabs .active',b);
    return !!active && /DÜNYAM/i.test(active.textContent||'');
  }
  function gold(){try{return window.DEEN_WORLD?.gold?.() ?? 0}catch(e){return 0}}
  function currentArea(){try{return window.DEEN_INTERACTIVE_WORLD?.snapshot?.().currentArea || 'study'}catch(e){return 'study'}}
  function areas(){try{const a=window.DEEN_INTERACTIVE_WORLD?.areas?.() || [];return Array.isArray(a)?a:Object.values(a)}catch(e){return []}}
  function currentAreaMeta(){return areas().find(a=>a.id===currentArea()) || {id:'study',name:'Çalışma Köşesi',sub:'Başlangıç alanı'}}
  function chestGrid(){
    let equipped='';
    try{equipped=window.DEEN_WORLD?.snapshot?.().equipped?.collectible || ''}catch(e){}
    const html=[];
    for(let i=1;i<=15;i++){
      const unit=unitLabel(i);
      let st={claimed:false,reward:{glyph:'✦',name:'Ünite Hatırası'}};
      try{st=window.DEEN_WORLD?.chestStatus?.(unit,'end') || st}catch(e){}
      const owned=!!st.claimed, glyph=owned?(st.reward?.glyph||'✦'):'◇', nm=owned?(st.reward?.name||('Ünite '+i)):'Kilitli';
      const cls='v810-memory'+(owned?' owned':' locked')+(equipped===unit?' equipped':'');
      const onclick=owned?`onclick="DEEN_WORLD.equipCollectible('${unit}')"`:'';
      html.push(`<button class="${cls}" ${onclick} aria-label="${esc(nm)}"><span class="glyph">${glyph}</span><small>${i}</small></button>`);
    }
    return html.join('');
  }
  function buildShell(roomNode, progressNode){
    const area=currentAreaMeta();
    const shell=document.createElement('div');
    shell.className='v810-shell';
    shell.innerHTML=`<div class="v810-head"><div><span class="kicker">BENİM DÜNYAM</span><h1>Benim Köşem</h1><p>Karakterini yaşat, odanı düzenle ve yeni alanlar aç.</p></div><button class="v810-gold" type="button" data-v810-open-shop>🪙 <span>${gold()}</span> Altın</button></div>
    <div class="v810-topbar"><button class="v810-area-btn" type="button" data-v810-area-open><span><span class="v810-area-dot">⌂</span></span><span style="flex:1;text-align:left"><strong>${esc(area.name)}</strong><small>${esc(area.sub||'Başlangıç alanı')}</small></span><span>▾</span></button><button class="v810-more-btn" type="button" data-v810-menu-btn>•••</button><div class="v810-pop" data-v810-menu><button type="button" data-v810-open-wardrobe>Giyinme Odası</button><button type="button" data-v810-open-avatar>Avatar</button><button type="button" data-v810-open-shop>Mağaza</button><button type="button" data-v810-toggle-edit>Oda Düzeni</button><button type="button" data-v810-area-open>Alanlar</button></div></div>
    <div class="v810-progress-wrap"></div>
    <div class="v810-room-shell"></div>
    <div class="v810-collection"><div class="v810-collection-head"><div><b>Ünite Hatıraları</b><small>Büyük sandıklardan açılır</small></div><small>15 slot</small></div><div class="v810-memory-grid">${chestGrid()}</div><div class="v810-policy">Altın yalnız dünya, kıyafet ve kozmetik için kullanılır. <b>Altınla enerji satın alınamaz.</b></div></div>
    <div class="v810-area-sheet" data-v810-area-sheet><div class="v810-area-sheet-head"><div><b>Alan Seç</b><small>Yeni alanlar açıldıkça burada görünür.</small></div><button type="button" data-v810-area-close>×</button></div><div data-v810-area-list></div></div>`;
    $('.v810-progress-wrap',shell)?.append(progressNode);
    const roomShell=$('.v810-room-shell',shell); roomShell?.append(roomNode);
    const actions=document.createElement('div');
    actions.className='v810-room-actions';
    actions.innerHTML='<button class="primary" type="button" data-v810-toggle-edit>Oda Düzeni</button><button type="button" data-v810-open-wardrobe>Giyinme Odası</button>';
    roomShell?.append(actions);
    return shell;
  }
  function areaListHtml(){
    const cur=currentArea();
    return areas().map(a=>{const snap=window.DEEN_INTERACTIVE_WORLD?.snapshot?.()||{};const open=(snap.unlocked||[]).includes(a.id);return `<button class="v810-area-option ${cur===a.id?'active':''} ${open?'':'locked'}" type="button" data-v810-area="${a.id}"><span><b>${esc(a.name)}</b><small>${esc(a.sub||'')}</small></span><span class="price">${open?'Açık':'🔒'}</span></button>`}).join('');
  }
  function wire(shell){
    const menu=$('[data-v810-menu]',shell), menuBtn=$('[data-v810-menu-btn]',shell);
    const areaSheet=$('[data-v810-area-sheet]',shell), areaList=$('[data-v810-area-list]',shell);
    if(areaList) areaList.innerHTML=areaListHtml();
    menuBtn?.addEventListener('click',e=>{e.stopPropagation();menu?.classList.toggle('open')});
    document.addEventListener('click',ev=>{if(!shell.contains(ev.target)){menu?.classList.remove('open');areaSheet?.classList.remove('open')}});
    $$('[data-v810-open-shop]',shell).forEach(b=>b.addEventListener('click',()=>window.DEEN_WORLD?.tab?.('shop')));
    $$('[data-v810-open-wardrobe]',shell).forEach(b=>b.addEventListener('click',()=>window.DEEN_WORLD?.tab?.('wardrobe')));
    $('[data-v810-open-avatar]',shell)?.addEventListener('click',()=>window.DEEN_AVATAR_STUDIO?.open?.());
    $$('[data-v810-toggle-edit]',shell).forEach(b=>b.addEventListener('click',()=>window.DEEN_INTERACTIVE_WORLD?.edit?.()));
    $$('[data-v810-area-open]',shell).forEach(b=>b.addEventListener('click',()=>{menu?.classList.remove('open');areaSheet?.classList.add('open')}));
    $('[data-v810-area-close]',shell)?.addEventListener('click',()=>areaSheet?.classList.remove('open'));
    areaList?.addEventListener('click',e=>{
      const btn=e.target.closest('[data-v810-area]'); if(!btn) return; const id=btn.dataset.v810Area; areaSheet?.classList.remove('open'); try{window.DEEN_INTERACTIVE_WORLD?.area?.(id)}catch(err){}
      setTimeout(enhance,140);
    });
  }
  function enhance(){
    const body=worldBody(); if(!body || !isWorldMain()) return;
    if(body.dataset.v810Enhancing==='1') return; body.dataset.v810Enhancing='1';
    try{
      const stageWorld=$('.v750-world',body); const prog=$('.v802-progress-strip',body) || $('.v784-progress-strip',body);
      if(!stageWorld || !prog){body.dataset.v810Enhancing=''; return}
      const roomNode=stageWorld; const progNode=prog;
      const shell=buildShell(roomNode, progNode);
      body.innerHTML=''; body.append(shell); wire(shell); body.dataset.v810Done='1';
    }catch(e){console.warn('v8.1.0 world enhance',e)}
    body.dataset.v810Enhancing='';
  }
  function reapply(){ [50,180,360,720].forEach(ms=>setTimeout(enhance,ms)); }
  const WORLD=window.DEEN_WORLD||{};
  if(WORLD && !WORLD.__v810patched){
    ['render','open','tab'].forEach(k=>{
      const old=WORLD[k];
      if(typeof old==='function') WORLD[k]=function(...a){const r=old.apply(this,a); reapply(); return r};
    });
    WORLD.__v810patched=true;
  }
  const oldUI=window.updateUI;
  if(typeof oldUI==='function' && !oldUI.__v810){
    const fn=function(...a){const r=oldUI.apply(this,a); reapply(); return r}; fn.__v810=true; window.updateUI=fn;
  }
  document.addEventListener('click',e=>{if(e.target.closest?.('.navbtn[data-screen="worldScreen"]')) reapply()},true);
  window.addEventListener('pageshow',reapply); window.addEventListener('focus',reapply);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden) reapply()});
  setTimeout(reapply,700);
})();
