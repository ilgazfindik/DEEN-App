/**
 * DEEN v9.9.5 - Companion Celebration Engine
 * Üst üste doğrularda seçili yoldaş, Duolingo tarzı efektlerle kutlar.
 * Sprite sheet: 4 kolon x 3 satır (12 poz)
 */
(function () {
  'use strict';

  // Görsel yolu adayları: hangisi varsa o kullanılır
  const SHEET_CANDIDATES = [
    'assets/combo/companions-sheet.png',
    'assetscombocompanions-sheet.png',
    'companions-sheet.png'
  ];
  let sheetURL = SHEET_CANDIDATES[0];
  (function resolveSheet(i) {
    if (i >= SHEET_CANDIDATES.length) return;
    const img = new Image();
    img.onload = function () { sheetURL = SHEET_CANDIDATES[i]; };
    img.onerror = function () { resolveSheet(i + 1); };
    img.src = SHEET_CANDIDATES[i];
  })(0);

  const COLS = 4, ROWS = 3;

  // [satır, kolon] -> wave poz / kitap poz
  const COMPANIONS = {
    aslan:      { label: 'Aslan',      poses: [[0,0],[0,1]] },
    kurt:       { label: 'Kurt',       poses: [[0,2],[0,3]] },
    baykus:     { label: 'Baykuş',     poses: [[1,0],[1,1]] },
    kaplumbaga: { label: 'Kaplumbağa', poses: [[1,2],[1,3]] },
    kartal:     { label: 'Kartal',     poses: [[2,0],[2,1]] },
    kedi:       { label: 'Kedi',       poses: [[2,2],[2,3]] }
  };

  const MESSAGES = {
    3:  'İyi bir seri başladı.',
    5:  'Odaklanman etkileyici.',
    7:  'Durdurulamıyorsun.',
    10: 'Bu bir ustalık serisi.'
  };

  let combo = 0;
  let busy = false;

  const style = document.createElement('style');
  style.textContent = `
    .dc-overlay{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;
      align-items:center;justify-content:center;gap:18px;
      background:rgba(6,10,14,.55);backdrop-filter:blur(4px);
      opacity:0;pointer-events:none;transition:opacity .25s ease}
    .dc-overlay.active{opacity:1;pointer-events:auto}
    .dc-medallion{width:min(52vw,250px);aspect-ratio:5845/5687;border-radius:50%;
      background-size:400% 300%;background-repeat:no-repeat;
      border:3px solid rgba(212,175,55,.9);
      box-shadow:0 0 0 8px rgba(212,175,55,.14),0 24px 60px rgba(0,0,0,.5);
      animation:dcPop .65s cubic-bezier(.175,.885,.32,1.275) both,
                dcFloat 2.2s ease-in-out .65s infinite}
    .dc-title{font-size:1.5rem;font-weight:800;letter-spacing:.06em;color:#E7C873;
      text-shadow:0 2px 12px rgba(0,0,0,.6);animation:dcText .45s ease-out both}
    .dc-sub{font-size:.95rem;color:rgba(255,255,255,.75);margin-top:-10px;
      animation:dcText .45s ease-out .1s both}
    .dc-particle{position:absolute;width:9px;height:9px;border-radius:50%;
      pointer-events:none;animation:dcPart 1s ease-out both}
    .dc-overlay.closing{opacity:0;transition:opacity .3s ease}
    .dc-overlay.closing .dc-medallion{transform:scale(.85);transition:transform .3s ease}
    @keyframes dcPop{0%{transform:scale(0) translateY(90px);opacity:0}
      60%{transform:scale(1.12) translateY(0);opacity:1}
      100%{transform:scale(1) translateY(0);opacity:1}}
    @keyframes dcFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes dcText{0%{transform:scale(.6);opacity:0}100%{transform:scale(1);opacity:1}}
    @keyframes dcPart{0%{transform:translate(0,0) scale(1);opacity:1}
      100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
  `;
  document.head.appendChild(style);

  function bgPos(row, col) {
    return `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`;
  }

  function getCompanion() {
    try {
      if (window.DEEN && window.DEEN.state && window.DEEN.state.companion
          && COMPANIONS[window.DEEN.state.companion]) return window.DEEN.state.companion;
      const raw = localStorage.getItem('deen_companion') || localStorage.getItem('deenCompanion');
      if (raw && COMPANIONS[raw]) return raw;
      const st = JSON.parse(localStorage.getItem('deen_state') || '{}');
      if (st.companion && COMPANIONS[st.companion]) return st.companion;
    } catch (e) {}
    return 'kurt';
  }

  function burst(container) {
    const colors = ['#D4AF37', '#2DD4BF', '#A7F3D0', '#F59E0B', '#FFFFFF'];
    for (let i = 0; i < 26; i++) {
      const p = document.createElement('div');
      p.className = 'dc-particle';
      p.style.background = colors[i % colors.length];
      p.style.left = '50%'; p.style.top = '42%';
      const a = Math.random() * Math.PI * 2;
      const d = 70 + Math.random() * 130;
      p.style.setProperty('--tx', Math.cos(a) * d + 'px');
      p.style.setProperty('--ty', Math.sin(a) * d + 'px');
      p.style.animationDelay = (Math.random() * .15) + 's';
      container.appendChild(p);
      setTimeout(() => p.remove(), 1300);
    }
  }

  function celebrate(n) {
    if (busy) return;
    busy = true;
    const id = getCompanion();
    const c = COMPANIONS[id];
    const pose = c.poses[Math.floor(Math.random() * 2)]; // 2 pozdan biri

    const ov = document.createElement('div');
    ov.className = 'dc-overlay';
    ov.innerHTML = `
      <div class="dc-medallion" style="background-position:${bgPos(pose[0], pose[1])}"></div>
      <div class="dc-title">ÜST ÜSTE ${n} DOĞRU</div>
      <div class="dc-sub">${MESSAGES[n] || 'Seri devam ediyor.'} ${c.label} seninle.</div>`;
    ov.querySelector('.dc-medallion').style.backgroundImage = `url("${sheetURL}")`;
    document.body.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('active'));
    burst(ov);
    if (typeof window.deenPlaySound === 'function') window.deenPlaySound('streak');

    setTimeout(() => {
      ov.classList.add('closing');
      setTimeout(() => { ov.remove(); busy = false; }, 320);
    }, 2400);
  }

  function shouldCelebrate(n) {
    return [3, 5, 7, 10].includes(n) || (n > 10 && n % 5 === 0);
  }

  window.DEEN_COMBO = {
    onAnswer(correct) {
      if (correct) { combo++; if (shouldCelebrate(combo)) celebrate(combo); }
      else combo = 0;
    },
    setCompanion(id) { if (COMPANIONS[id]) localStorage.setItem('deen_companion', id); },
    preview(id) {
      const orig = getCompanion;
      getCompanion = () => id;
      celebrate(5);
      getCompanion = orig;
    },
    get combo() { return combo; }
  };

  ['deen:answer', 'answer:result'].forEach(ev =>
    document.addEventListener(ev, e => {
      const ok = e.detail && (e.detail.correct ?? e.detail.isCorrect);
      if (typeof ok === 'boolean') window.DEEN_COMBO.onAnswer(ok);
    }));

  console.log('%c[DEEN] v9.9.5 Companion Celebration hazır', 'color:#D4AF37;font-weight:bold');
})();
