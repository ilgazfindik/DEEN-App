// Generates compositions/*.html (one scene per beat) from the BEATS table below.
// Edit the Arabic copy or timings here, then run:  node tools/build-scenes.mjs
// The generated scene files are plain HyperFrames HTML and can also be edited by hand
// (re-running this script overwrites them).
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OVERLAP = 0.3; // crossfade between consecutive scenes

// ---------------------------------------------------------------- palette
const C = {
  ground: "#0E2A22",
  deep: "#0A1D18",
  cream: "#F3EAD7",
  gold: "#D2B373",
  goldSoft: "#B89A5E",
  water: "#8CC3B4",
  waterDeep: "#3F8070",
  dry: "#E7C08A",
  warn: "#D08A68",
};

// ---------------------------------------------------------------- beats
// lines: max 2. Words prefixed with * are drawn in gold.
// visual: one of the builders in VISUALS.
export const BEATS = [
  { id: "s01", dur: 3, visual: "hook", instant: true,
    lines: ["بقعةٌ جافّةٌ صغيرة…", "قد *تُفسِدُ غُسلَك كلَّه"] },
  { id: "s02", dur: 3, visual: "fill",
    lines: ["الغُسلُ ليس صبًّا على عَجَل", "بل *تعميمُ البدنِ بالماء"] },
  { id: "s03", dur: 3.5, visual: "mistake",
    lines: ["الخطأُ الشائع: *الاستعجال", "فتبقى مواضعُ بلا ماء"] },
  { id: "s04", dur: 3.5, visual: "scale",
    lines: ["المضمضةُ والاستنشاق", "*حكمُهما يختلف بين المذاهب"] },
  { id: "s05", dur: 2.8, visual: "intent",
    lines: ["أولًا: *النيّةُ بالقلب", "وحكمُها يختلف بين المذاهب"] },
  { id: "s06", dur: 3.2, visual: "basmala",
    lines: ["ثم اغسلْ *يديك", "وأزِلِ الأذى عن بدنك"] },
  { id: "s07", dur: 4.5, visual: "jug",
    lines: ["ثانيًا: *توضّأ وضوءَ الصلاة", "مع المضمضةِ والاستنشاق"] },
  { id: "s08", dur: 3.5, visual: "pour",
    lines: ["ثالثًا: أفِضِ الماءَ *ثلاثًا", "على الرأس، فالأيمن، فالأيسر"] },
  { id: "s09", dur: 3.5, visual: "rub",
    lines: ["وادلُكْ *جسدَك بيدك", "وحكمُ الدَّلكِ يختلف بين المذاهب"] },
  { id: "s10", dur: 2.7, visual: "spotsA",
    lines: ["انتبهْ *لخلفِ الأذنين", "وثقوبِ الأقراط"] },
  { id: "s11", dur: 2.8, visual: "spotsB",
    lines: ["والسُّرّةِ والإبطين", "وما *بين الأصابع"] },
  { id: "s12", dur: 3, visual: "nail",
    lines: ["طلاءُ الأظافر *يحجبُ الماء", "فأزِلْه قبل الغُسل"] },
  { id: "s13", dur: 2.8, visual: "glad",
    lines: ["*بُشرى: صلِّ بغُسلك", "ما لم ينتقض وضوؤك"] },
  { id: "s14", dur: 3.2, visual: "share",
    lines: ["أرسِلْه *لمن يحتاجه", "لعلّه يُصحِّحُ غُسلَه"] },
];
{ let t = 0; for (const b of BEATS) { b.start = +t.toFixed(2); t += b.dur; } }
export const TOTAL = 45;

// ---------------------------------------------------------------- shared svg bits
// Silhouette drawn in a 400 x 600 box, facing the viewer
// (the person's right side is on the viewer's left).
const BODY =
  "M170 140 Q200 150 230 140 L232 160 Q290 165 300 200 L318 370 Q320 385 306 386 L296 386 Q286 386 284 372 L272 240 L262 360 L258 580 Q257 592 244 592 L222 592 Q210 592 209 580 L200 400 L191 580 Q190 592 178 592 L156 592 Q143 592 142 580 L138 360 L128 240 L116 372 Q114 386 104 386 L94 386 Q80 385 82 370 L100 200 Q110 165 168 160 Z";
const DROP = "M0 -40 C14 -18 26 -4 26 12 A26 26 0 0 1 -26 12 C-26 -4 -14 -18 0 -40 Z";

const SPOT = {
  earR: [148, 76], earL: [252, 76], lobeR: [152, 104], lobeL: [248, 104],
  navel: [200, 300], pitR: [128, 214], pitL: [272, 214], handR: [99, 382], handL: [301, 382],
};

function silhouette(p, { level = 1, spots = [], extra = "" } = {}) {
  // level: initial water level 0..1 (animated by the scene tweens via #p-level)
  const y = 600 - level * 600;
  const spotSvg = spots
    .map(
      ([k, color], i) => `
      <g id="${p}-spot${i}" transform="translate(${SPOT[k][0]} ${SPOT[k][1]})">
        <circle r="26" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="5 6" id="${p}-ring${i}"/>
        <circle r="11" fill="${color}"/>
      </g>`,
    )
    .join("");
  return `
  <svg id="${p}-sil" class="vis" viewBox="0 0 400 600" width="373" height="560" style="left:353px;top:445px" overflow="visible">
    <defs>
      <clipPath id="${p}-clip">
        <circle cx="200" cy="82" r="50"/>
        <path d="${BODY}"/>
      </clipPath>
      <linearGradient id="${p}-wg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${C.water}" stop-opacity="0.95"/>
        <stop offset="1" stop-color="${C.waterDeep}" stop-opacity="0.9"/>
      </linearGradient>
      <linearGradient id="${p}-shine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/>
        <stop offset="0.5" stop-color="#fff" stop-opacity="0.35"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <g clip-path="url(#${p}-clip)">
      <rect x="0" y="0" width="400" height="600" fill="#163F33"/>
      <rect id="${p}-level" x="0" y="${y}" width="400" height="640" fill="url(#${p}-wg)"/>
      <rect id="${p}-shine" x="-160" y="0" width="120" height="600" fill="url(#${p}-shine)" transform="skewX(-18)"/>
    </g>
    <circle cx="200" cy="82" r="50" fill="none" stroke="${C.cream}" stroke-opacity="0.55" stroke-width="3"/>
    <path d="${BODY}" fill="none" stroke="${C.cream}" stroke-opacity="0.55" stroke-width="3" stroke-linejoin="round"/>
    ${spotSvg}
    ${extra}
  </svg>`;
}

const tw = (sel, from, to, at) =>
  `tl.fromTo("${sel}", ${JSON.stringify(from)}, ${JSON.stringify(to)}, ${at});`;

function shineTweens(p, d) {
  return tw(`#${p}-shine`, { x: 0 }, { x: 640, duration: Math.min(d, 2.4), ease: "sine.inOut" }, 0.2);
}
function spotPulse(p, i, at, d) {
  return [
    tw(`#${p}-spot${i}`, { opacity: 0, scale: 0.3, transformOrigin: "50% 50%" },
      { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, at),
    tw(`#${p}-ring${i}`, { scale: 1, transformOrigin: "50% 50%" },
      { scale: 1.35, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: Math.max(1, Math.floor((d - at) / 0.8) - 1) }, at + 0.3),
  ].join("\n");
}

// ---------------------------------------------------------------- visuals
const VISUALS = {
  hook(p, d) {
    return {
      html: silhouette(p, { level: 1, spots: [["pitL", C.dry]] }),
      js: [
        tw(`#${p}-sil`, { scale: 1, transformOrigin: "50% 40%" }, { scale: 1.06, duration: d, ease: "none" }, 0),
        shineTweens(p, d),
        spotPulse(p, 0, 0, d),
        // frame 0 must already show the dry spot (hook = thumbnail)
        `tl.set("#${p}-spot0", { opacity: 1, scale: 1 }, 0);`,
      ].join("\n"),
    };
  },
  fill(p, d) {
    const drops = [130, 200, 270, 165, 235]
      .map((x, i) => `<path id="${p}-d${i}" d="${DROP}" fill="${C.water}" transform="translate(${x} -60) scale(0.45)"/>`)
      .join("");
    return {
      html: silhouette(p, { level: 0, extra: drops }),
      js: [
        tw(`#${p}-level`, { attr: { y: 600 } }, { attr: { y: -20 }, duration: d - 0.5, ease: "power1.inOut" }, 0.2),
        ...[0, 1, 2, 3, 4].map((i) =>
          tw(`#${p}-d${i}`, { y: 0, opacity: 0 }, { y: 520, opacity: 1, duration: 0.9, ease: "power2.in" }, 0.15 + i * 0.42)),
        ...[0, 1, 2, 3, 4].map((i) =>
          `tl.to("#${p}-d${i}", { opacity: 0, duration: 0.15 }, ${(1.05 + i * 0.42).toFixed(2)});`),
      ].join("\n"),
    };
  },
  mistake(p, d) {
    const cross = `<g id="${p}-x" transform="translate(330 40)">
        <circle r="34" fill="${C.warn}"/>
        <path d="M-12 -12 L12 12 M12 -12 L-12 12" stroke="${C.deep}" stroke-width="7" stroke-linecap="round"/>
      </g>`;
    return {
      html: silhouette(p, {
        level: 1,
        spots: [["earR", C.dry], ["pitL", C.dry], ["navel", C.dry]],
        extra: cross,
      }),
      js: [
        spotPulse(p, 0, 0.5, d), spotPulse(p, 1, 0.9, d), spotPulse(p, 2, 1.3, d),
        tw(`#${p}-x`, { scale: 0, transformOrigin: "50% 50%", rotation: -30 },
          { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.2)" }, 0.3),
      ].join("\n"),
    };
  },
  scale(p, d) {
    return {
      html: `
      <svg id="${p}-scale" class="vis" viewBox="0 0 400 400" width="540" height="540" style="left:270px;top:460px" overflow="visible">
        <g stroke="${C.gold}" stroke-width="7" stroke-linecap="round" fill="none">
          <path d="M200 70 L200 330"/>
          <path d="M140 340 L260 340"/>
          <circle cx="200" cy="58" r="12" fill="${C.gold}"/>
          <g id="${p}-beam">
            <path d="M70 100 L330 100"/>
            <g id="${p}-panR"><path d="M70 100 L40 210 M70 100 L100 210"/><path d="M28 210 Q70 250 112 210 Z" fill="${C.gold}" fill-opacity="0.18"/></g>
            <g id="${p}-panL"><path d="M330 100 L300 210 M330 100 L360 210"/><path d="M288 210 Q330 250 372 210 Z" fill="${C.gold}" fill-opacity="0.18"/></g>
          </g>
        </g>
        <g id="${p}-dots" fill="${C.cream}">
          <circle cx="160" cy="385" r="9"/><circle cx="187" cy="385" r="9"/><circle cx="214" cy="385" r="9"/><circle cx="241" cy="385" r="9"/>
        </g>
      </svg>`,
      js: [
        tw(`#${p}-beam`, { rotation: -7, svgOrigin: "200 100" }, { rotation: 7, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: 2 }, 0),
        tw(`#${p}-panR`, { rotation: 7, svgOrigin: "70 100" }, { rotation: -7, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: 2 }, 0),
        tw(`#${p}-panL`, { rotation: 7, svgOrigin: "330 100" }, { rotation: -7, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: 2 }, 0),
        tw(`#${p}-dots circle`, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.12, ease: "power2.out" }, 0.8),
      ].join("\n"),
    };
  },
  intent(p, d) {
    const rings = [0, 1, 2]
      .map((i) => `<circle id="${p}-r${i}" cx="200" cy="200" r="60" fill="none" stroke="${C.gold}" stroke-width="3"/>`)
      .join("");
    return {
      html: `
      <svg id="${p}-intent" class="vis" viewBox="0 0 400 400" width="560" height="560" style="left:260px;top:450px" overflow="visible">
        <defs><radialGradient id="${p}-glow"><stop offset="0" stop-color="${C.gold}" stop-opacity="0.55"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></radialGradient></defs>
        <circle id="${p}-halo" cx="200" cy="200" r="150" fill="url(#${p}-glow)"/>
        ${rings}
        <circle cx="200" cy="200" r="26" fill="${C.cream}"/>
      </svg>`,
      js: [
        ...[0, 1, 2].map((i) =>
          tw(`#${p}-r${i}`, { attr: { r: 30 }, opacity: 0.9 }, { attr: { r: 190 }, opacity: 0, duration: 1.8, ease: "sine.out" }, i * 0.6)),
        tw(`#${p}-halo`, { scale: 0.8, transformOrigin: "50% 50%" }, { scale: 1.1, duration: d, ease: "sine.inOut" }, 0),
      ].join("\n"),
    };
  },
  basmala(p, d) {
    return {
      html: `
      <div id="${p}-basmala" class="vis basmala" dir="rtl" lang="ar">بِسْمِ اللَّهِ</div>
      <svg id="${p}-orn" class="vis" viewBox="0 0 600 40" width="600" height="40" style="left:240px;top:960px">
        <path id="${p}-ornl" d="M20 20 L270 20" stroke="${C.goldSoft}" stroke-width="3" stroke-linecap="round"/>
        <path id="${p}-ornr" d="M330 20 L580 20" stroke="${C.goldSoft}" stroke-width="3" stroke-linecap="round"/>
        <rect x="288" y="8" width="24" height="24" fill="${C.gold}" transform="rotate(45 300 20)"/>
      </svg>`,
      js: [
        tw(`#${p}-basmala`, { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power2.inOut" }, 0.15),
        tw(`#${p}-ornl`, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.9),
        tw(`#${p}-ornr`, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.9),
      ].join("\n"),
    };
  },
  jug(p, d) {
    const drops = [0, 1, 2, 3]
      .map((i) => `<path id="${p}-jd${i}" d="${DROP}" fill="${C.water}" transform="translate(${120 + (i % 2) * 22} 250) scale(0.32)"/>`)
      .join("");
    return {
      html: `
      <svg id="${p}-jug" class="vis" viewBox="0 0 400 460" width="490" height="563" style="left:295px;top:450px" overflow="visible">
        <g id="${p}-vessel" fill="none" stroke="${C.gold}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
          <path d="M215 60 L285 60 L278 95 Q330 120 330 190 Q330 260 250 268 Q170 260 170 190 Q170 120 222 95 Z" fill="${C.gold}" fill-opacity="0.14"/>
          <path d="M330 140 Q372 150 362 205 Q352 238 322 236"/>
          <path d="M180 165 Q140 150 112 112 L100 98"/>
          <path d="M200 280 L300 280"/>
        </g>
        <path id="${p}-stream" d="M100 104 Q96 180 128 300" stroke="${C.water}" stroke-width="10" stroke-linecap="round" fill="none"/>
        ${drops}
        <g id="${p}-hands" fill="none" stroke="${C.cream}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.85">
          <path d="M30 336 Q36 410 130 412 Q224 410 230 336" fill="${C.cream}" fill-opacity="0.08"/>
          <path d="M30 336 Q50 326 66 338 M230 336 Q210 326 194 338"/>
        </g>
        <circle id="${p}-splash" cx="130" cy="350" r="20" fill="none" stroke="${C.water}" stroke-width="4"/>
      </svg>`,
      js: [
        tw(`#${p}-vessel`, { rotation: 0, svgOrigin: "250 170" }, { rotation: -14, duration: 0.8, ease: "power2.inOut" }, 0.1),
        tw(`#${p}-stream`, { strokeDasharray: 260, strokeDashoffset: 260 }, { strokeDashoffset: 0, duration: 0.6, ease: "power1.in" }, 0.7),
        ...[0, 1, 2, 3].map((i) =>
          tw(`#${p}-jd${i}`, { y: 0, opacity: 0 }, { y: 80, opacity: 1, duration: 0.5, ease: "power2.in", repeat: 3, repeatDelay: 0.25 }, 1.1 + i * 0.18)),
        tw(`#${p}-splash`, { attr: { r: 14 }, opacity: 1 }, { attr: { r: 90 }, opacity: 0, duration: 0.9, ease: "sine.out", repeat: 3 }, 1.4),
      ].join("\n"),
    };
  },
  pour(p, d) {
    const marks = [
      ["1", 278, 40, 0.2],
      ["2", 70, 150, 1.1],
      ["3", 330, 150, 2.0],
    ];
    const extra =
      marks
        .map(
          ([n, x, y]) => `
        <g id="${p}-m${n}" transform="translate(${x} ${y})">
          <circle r="30" fill="${C.gold}"/>
          <text y="11" text-anchor="middle" class="num" fill="${C.deep}">${n}</text>
        </g>`,
        )
        .join("") +
      `<text id="${p}-lr" x="40" y="215" text-anchor="middle" class="lbl" fill="${C.cream}">الأيمن</text>
       <text id="${p}-ll" x="360" y="215" text-anchor="middle" class="lbl" fill="${C.cream}">الأيسر</text>
       <path id="${p}-pd0" d="${DROP}" fill="${C.water}" transform="translate(200 10) scale(0.5)"/>
       <path id="${p}-pd1" d="${DROP}" fill="${C.water}" transform="translate(118 60) scale(0.5)"/>
       <path id="${p}-pd2" d="${DROP}" fill="${C.water}" transform="translate(282 60) scale(0.5)"/>`;
    return {
      html: silhouette(p, { level: 0, extra }),
      js: [
        ...marks.map(([n, , , at]) =>
          tw(`#${p}-m${n}`, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, ease: "back.out(2)" }, at)),
        ...[0, 1, 2].map((i) =>
          tw(`#${p}-pd${i}`, { y: -40, opacity: 0 }, { y: 70, opacity: 1, duration: 0.45, ease: "power2.in", repeat: 2, repeatDelay: 0.05 }, marks[i][3] + 0.1)),
        tw(`#${p}-level`, { attr: { y: 600 } }, { attr: { y: -20 }, duration: 2.6, ease: "power1.inOut" }, 0.4),
        tw(`#${p}-lr`, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.1),
        tw(`#${p}-ll`, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 2.0),
      ].join("\n"),
    };
  },
  rub(p, d) {
    const loops = [[200, 270], [108, 300], [292, 300], [200, 470]]
      .map(([x, y], i) => `<circle id="${p}-o${i}" cx="${x}" cy="${y}" r="34" fill="none" stroke="${C.gold}" stroke-width="4" stroke-dasharray="40 18" stroke-linecap="round"/>`)
      .join("");
    return {
      html: silhouette(p, { level: 1, extra: loops }),
      js: [
        shineTweens(p, d),
        ...[0, 1, 2, 3].map((i) =>
          tw(`#${p}-o${i}`, { rotation: 0, opacity: 0, transformOrigin: "50% 50%" }, { rotation: 360, opacity: 1, duration: d - 0.6, ease: "none" }, 0.15 + i * 0.12)),
      ].join("\n"),
    };
  },
  spotsA(p, d) {
    return {
      html: silhouette(p, { level: 1, spots: [["earR", C.dry], ["earL", C.dry], ["lobeR", C.gold], ["lobeL", C.gold]] }),
      js: [
        spotPulse(p, 0, 0.4, d), spotPulse(p, 1, 0.5, d), spotPulse(p, 2, 1.2, d), spotPulse(p, 3, 1.3, d),
      ].join("\n"),
    };
  },
  spotsB(p, d) {
    return {
      html: silhouette(p, { level: 1, spots: [["navel", C.dry], ["pitR", C.dry], ["pitL", C.dry], ["handR", C.gold], ["handL", C.gold]] }),
      js: [
        spotPulse(p, 0, 0.3, d), spotPulse(p, 1, 0.6, d), spotPulse(p, 2, 0.7, d), spotPulse(p, 3, 1.2, d), spotPulse(p, 4, 1.3, d),
      ].join("\n"),
    };
  },
  nail(p, d) {
    return {
      html: `
      <svg id="${p}-nail" class="vis" viewBox="0 0 400 460" width="470" height="540" style="left:305px;top:480px" overflow="visible">
        <path d="M120 460 L120 150 Q120 60 200 60 Q280 60 280 150 L280 460" fill="${C.cream}" fill-opacity="0.12" stroke="${C.cream}" stroke-opacity="0.7" stroke-width="5"/>
        <path d="M150 190 L150 120 Q150 85 200 85 Q250 85 250 120 L250 190 Q200 205 150 190 Z" fill="${C.cream}" fill-opacity="0.25" stroke="${C.cream}" stroke-width="4"/>
        <path id="${p}-polish" d="M150 190 L150 120 Q150 85 200 85 Q250 85 250 120 L250 190 Q200 205 150 190 Z" fill="${C.warn}"/>
        <path id="${p}-nd" d="${DROP}" fill="${C.water}" transform="translate(200 -40) scale(0.55)"/>
        <g id="${p}-ok" transform="translate(320 70)">
          <circle r="32" fill="${C.water}"/>
          <path d="M-13 1 L-3 11 L14 -9" stroke="${C.deep}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      </svg>`,
      js: [
        tw(`#${p}-nd`, { y: -60, opacity: 0 }, { y: 70, opacity: 1, duration: 0.5, ease: "power2.in" }, 0.2),
        tw(`#${p}-nd`, { scaleX: 1 }, { scaleX: 1.5, scaleY: 0.4, opacity: 0, duration: 0.25, transformOrigin: "50% 100%" }, 0.7),
        tw(`#${p}-polish`, { y: 0, opacity: 1 }, { y: -110, opacity: 0, duration: 0.7, ease: "power2.in" }, 1.1),
        tw(`#${p}-ok`, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, ease: "back.out(2)" }, 1.9),
      ].join("\n"),
    };
  },
  glad(p, d) {
    const rays = Array.from({ length: 16 }, (_, i) => {
      const a = (i * Math.PI) / 8;
      const r1 = 150, r2 = i % 2 ? 210 : 240;
      return `<path d="M${(200 + r1 * Math.cos(a)).toFixed(1)} ${(200 + r1 * Math.sin(a)).toFixed(1)} L${(200 + r2 * Math.cos(a)).toFixed(1)} ${(200 + r2 * Math.sin(a)).toFixed(1)}"/>`;
    }).join("");
    return {
      html: `
      <svg id="${p}-glad" class="vis" viewBox="0 0 400 400" width="560" height="560" style="left:260px;top:450px" overflow="visible">
        <g id="${p}-rays" stroke="${C.goldSoft}" stroke-width="5" stroke-linecap="round">${rays}</g>
        <g id="${p}-star" fill="${C.gold}" fill-opacity="0.16" stroke="${C.gold}" stroke-width="6" stroke-linejoin="round">
          <rect x="110" y="110" width="180" height="180"/>
          <rect x="110" y="110" width="180" height="180" transform="rotate(45 200 200)"/>
        </g>
        <circle cx="200" cy="200" r="46" fill="${C.cream}"/>
      </svg>`,
      js: [
        tw(`#${p}-star`, { scale: 0.4, rotation: -45, svgOrigin: "200 200" }, { scale: 1, rotation: 0, duration: 0.9, ease: "back.out(1.6)" }, 0.05),
        tw(`#${p}-rays`, { rotation: 0, opacity: 0, svgOrigin: "200 200" }, { rotation: 22.5, opacity: 1, duration: d, ease: "none" }, 0),
      ].join("\n"),
    };
  },
  share(p, d) {
    return {
      html: `
      <svg id="${p}-share" class="vis" viewBox="0 0 400 400" width="540" height="540" style="left:270px;top:460px" overflow="visible">
        <path id="${p}-trail" d="M20 380 Q100 360 130 300 Q160 240 205 210" stroke="${C.goldSoft}" stroke-width="5" stroke-dasharray="14 14" fill="none" stroke-linecap="round"/>
        <g id="${p}-plane" transform="translate(205 205)">
          <path d="M-60 10 L90 -70 L30 80 L5 30 Z" fill="${C.gold}"/>
          <path d="M5 30 L90 -70 L-15 40 Z" fill="${C.cream}" fill-opacity="0.85"/>
        </g>
      </svg>`,
      js: [
        tw(`#${p}-trail`, { strokeDashoffset: 0, opacity: 0 }, { strokeDashoffset: -84, opacity: 1, duration: d, ease: "none" }, 0),
        tw(`#${p}-plane`, { x: -80, y: 60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.0, ease: "power3.out" }, 0.05),
        `tl.to("#${p}-plane", { x: 14, y: -10, duration: ${(d - 1.2).toFixed(2)}, ease: "sine.inOut" }, 1.05);`,
      ].join("\n"),
    };
  },
};

// ---------------------------------------------------------------- text
function words(p, lines, instant) {
  let n = 0;
  return lines
    .map((line, li) => {
      const ws = line.split(" ").map((w) => {
        const hot = w.startsWith("*");
        const t = hot ? w.slice(1) : w;
        return `<span id="${p}-w${n++}" class="w${hot ? " hot" : ""}${instant && li === 0 ? " now" : ""}">${t}</span>`;
      });
      return `<div class="line l${li + 1}">${ws.join(" ")}</div>`;
    })
    .join("\n        ");
}

function textTweens(p, lines, dur, instant) {
  const counts = lines.map((l) => l.split(" ").length);
  const total = counts.reduce((a, b) => a + b, 0);
  const start = instant ? 0.25 : OVERLAP;
  const span = Math.min(dur * 0.42, 0.2 * total + 0.3); // reveal window
  const step = span / total;
  const out = [];
  let i = 0;
  lines.forEach((_, li) => {
    for (let k = 0; k < counts[li]; k++, i++) {
      if (instant && li === 0) continue; // already on screen at frame 0
      out.push(tw(`#${p}-w${i}`, { opacity: 0, y: 26, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.42, ease: "power3.out" }, +(start + i * step).toFixed(3)));
    }
  });
  return out.join("\n");
}

// ---------------------------------------------------------------- scene file
const FONTS = `
    @font-face { font-family: "Cairo"; font-weight: 700; src: url("assets/fonts/cairo-arabic-700-normal.woff2") format("woff2"); unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF; }
    @font-face { font-family: "Cairo"; font-weight: 800; src: url("assets/fonts/cairo-arabic-800-normal.woff2") format("woff2"); unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF; }
    @font-face { font-family: "Cairo"; font-weight: 700; src: url("assets/fonts/cairo-latin-700-normal.woff2") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }
    @font-face { font-family: "Cairo"; font-weight: 800; src: url("assets/fonts/cairo-latin-800-normal.woff2") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }
    @font-face { font-family: "Amiri"; font-weight: 700; src: url("assets/fonts/amiri-arabic-700-normal.woff2") format("woff2"); }`;

function scene(b) {
  const p = b.id;
  const v = VISUALS[b.visual](p, b.dur + (b.id === "s14" ? 0 : OVERLAP));
  const len = b.id === "s14" ? b.dur : b.dur + OVERLAP;
  return `<!-- generated by tools/build-scenes.mjs: edit the BEATS table there and re-run -->
<template>
  <style>${FONTS}
    #root { position: absolute; inset: 0; font-family: "Cairo", sans-serif; }
    #root .vis { position: absolute; }
    #root .txt {
      position: absolute; left: 140px; right: 140px; top: 1040px;
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      text-align: center; direction: rtl; letter-spacing: 0; color: ${C.cream};
    }
    #root .line { white-space: nowrap; line-height: 1.25; }
    #root .l1 { font-size: 72px; font-weight: 800; }
    #root .l2 { font-size: 60px; font-weight: 700; color: ${C.cream}; opacity: 0.92; }
    #root .w { display: inline-block; opacity: 0; }
    #root .w.now { opacity: 1; }
    #root .hot { color: ${C.gold}; }
    #root .basmala {
      left: 90px; right: 90px; top: 540px; text-align: center;
      font-family: "Amiri", serif; font-weight: 700; font-size: 210px; line-height: 1.6; color: ${C.gold};
    }
    #root .num { font-family: "Cairo", sans-serif; font-weight: 800; font-size: 34px; }
    #root .lbl { font-family: "Cairo", sans-serif; font-weight: 700; font-size: 30px; }
  </style>
  <div id="root" data-composition-id="${p}" data-width="1080" data-height="1920" data-layout-allow-overflow>
    <div id="${p}-stage" class="clip" data-start="0" data-duration="${len}">
      <div id="${p}-visual">${v.html}
      </div>
      <div id="${p}-txt" class="txt" lang="ar" dir="rtl">
        ${words(p, b.lines, b.instant)}
      </div>
    </div>
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    ${b.instant ? "" : tw(`#${p}-visual`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0)}
${v.js}
${textTweens(p, b.lines, b.dur, b.instant)}
    ${b.id === "s14" ? "" : tw(`#${p}-stage`.replace("-stage", "-visual") + `, #${p}-txt`, { opacity: 1 }, { opacity: 0, duration: OVERLAP, ease: "power1.in" }, +(len - OVERLAP - 0.02).toFixed(2))}
    window.__timelines["${p}"] = tl;
  </script>
</template>
`;
}

mkdirSync(join(ROOT, "compositions"), { recursive: true });
for (const b of BEATS) writeFileSync(join(ROOT, "compositions", `${b.id}.html`), scene(b));

// hosts for index.html (printed so the root can be updated by hand if timings change)
const hosts = BEATS.map((b, i) => {
  const len = b.id === "s14" ? b.dur : b.dur + OVERLAP;
  return `      <div id="${b.id}" data-composition-id="${b.id}" data-composition-src="compositions/${b.id}.html" data-start="${b.start}" data-duration="${+len.toFixed(2)}" data-track-index="${2 + (i % 2)}" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:${10 + i}"></div>`;
}).join("\n");
writeFileSync(join(ROOT, "tools", "hosts.generated.html"), hosts + "\n");
console.log(`wrote ${BEATS.length} scenes, total ${TOTAL}s`);
