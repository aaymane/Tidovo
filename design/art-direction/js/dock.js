// ROOMRESET T1.1 — Light Dock study: sunbeam tab indicator, thumb scrubbing, Reset pebble in its cradle,
// pebble -> viewfinder morph. Transform/opacity only; one backdrop-filter (the dock glass).
import { Value, SPRING, VelocityTracker, clamp, lerp, mix01, onRender } from './spring.js';
import { buzz, announce, mountSettings, setDaypart, currentDaypart, pressable } from './feel.js';
import { mountPerf } from './perf.js';

const $ = (s, r = document) => r.querySelector(s);
const TABS = [
  { id: 'home', label: 'Accueil', title: 'Accueil', text: 'Votre micro-reset du soir vous attend : trois surfaces, quatre minutes.' },
  { id: 'world', label: 'Monde', title: 'Votre monde', text: 'Le chemin de galets s’allonge à chaque Reset. Rien ne fane.' },
  { id: 'coach', label: 'Coach', title: 'Coach du jour', text: 'Deux minutes suffisent aujourd’hui : la table de nuit.' },
  { id: 'settings', label: 'Réglages', title: 'Réglages', text: 'Son, mouvement calme, vie privée et données.' },
];

const clip = $('#dockClip'), beam = $('#beam'), source = $('#source'), cone = $('#cone');
const tabs = [...document.querySelectorAll('.tab')];
let centers = [];
let active = 0;

function measure() {
  const r = clip.getBoundingClientRect();
  centers = tabs.map((t) => { const b = t.getBoundingClientRect(); return b.left + b.width / 2 - r.left; });
}

const srcX = new Value(0), coneX = new Value(0), lift = tabs.map(() => new Value(0));
let dirty = true;
for (const v of [srcX, coneX]) v.on(() => { dirty = true; });
lift.forEach((v, i) => v.on((y) => { tabs[i].querySelector('.tab-icon').style.transform = `translateY(${y.toFixed(2)}px)`; }));
onRender(() => {
  if (!dirty) return; dirty = false;
  const vel = coneX.velocity();
  const skew = clamp(vel * 0.012, -16, 16);
  source.style.transform = `translateX(${(srcX.v - 15).toFixed(2)}px)`;
  beam.style.transform = `translateX(${(coneX.v - 40).toFixed(2)}px)`;
  cone.style.transform = `skewX(calc(var(--beam-skew) + ${(-skew).toFixed(2)}deg))`;
});

function select(i, { velocity = 0, announceIt = true } = {}) {
  const changed = i !== active; active = i;
  tabs.forEach((t, k) => { t.toggleAttribute('aria-current', k === i); if (k === i) t.setAttribute('aria-current', 'page'); });
  srcX.to(centers[i], SPRING.snap, { velocity });
  coneX.to(centers[i], SPRING.settle, { velocity: velocity * 0.6 });
  lift.forEach((v, k) => v.to(k === i ? -2 : 0, SPRING.snap));
  if (changed) {
    swapContent(TABS[i]);
    if (announceIt) announce(`${TABS[i].label}`);
  }
}

// Content crossfade (opacity + 8px rise, settle).
const cO = new Value(1, 'ratio'), cY = new Value(0);
cO.on((v) => { $('#tabBody').style.opacity = v; }); cY.on((v) => { $('#tabBody').style.transform = `translateY(${v}px)`; });
async function swapContent(t) {
  await cO.tween(0, 110);
  $('#tabTitle').textContent = t.title; $('#tabText').textContent = t.text;
  cY.jump(8); cO.tween(1, 180); cY.to(0, SPRING.settle);
}

// ------------------------------------------------------------------ thumb scrubbing
const vt = new VelocityTracker();
let scrubbing = false, pid = null, hover = -1, downX = 0, downT = 0;
const nearest = (x) => centers.reduce((best, c, k) => (Math.abs(c - x) < Math.abs(centers[best] - x) ? k : best), 0);
clip.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.reset-pebble')) return;
  scrubbing = true; pid = e.pointerId; clip.setPointerCapture(pid); vt.reset();
  const r = clip.getBoundingClientRect(); downX = e.clientX; downT = performance.now();
  hover = active; vt.add(e.clientX - r.left, 0);
});
clip.addEventListener('pointermove', (e) => {
  if (!scrubbing || e.pointerId !== pid) return;
  if (Math.abs(e.clientX - downX) < 8) return;
  const r = clip.getBoundingClientRect();
  const x = clamp(e.clientX - r.left, centers[0], centers[centers.length - 1]);
  vt.add(x, 0);
  srcX.jump(x, vt.get().x); coneX.to(x, { visualDuration: 0.2, bounce: 0 });
  const k = nearest(x);
  if (k !== hover) { hover = k; buzz(6); tabs.forEach((t, j) => t.classList.toggle('is-hover', j === k)); }
});
const end = (e) => {
  if (!scrubbing || e.pointerId !== pid) return;
  scrubbing = false; tabs.forEach((t) => t.classList.remove('is-hover'));
  const r = clip.getBoundingClientRect();
  const isTap = Math.abs(e.clientX - downX) < 8 && performance.now() - downT < 400;
  const k = isTap ? nearest(e.clientX - r.left) : nearest(srcX.v);
  if (isTap) buzz(6);
  select(k, { velocity: isTap ? 0 : vt.get().x });
};
clip.addEventListener('pointerup', end); clip.addEventListener('pointercancel', end);
tabs.forEach((t, i) => t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); } }));

// ------------------------------------------------------------------ Reset pebble + cradle
const pebble = $('#resetPebble'), cradle = $('#cradlePath');
const press = new Value(0, 'ratio');
press.on((p) => {
  pebble.style.transform = `translate(-50%, ${(3 * p).toFixed(2)}px) scale(${(1 - 0.04 * p).toFixed(4)})`;
  const d = 10 + 5 * p;
  cradle.setAttribute('d', `M0 0 C 20 0 26 ${d} 52 ${d} S 84 0 104 0 Z`);
});
press.jump(0);
pebble.addEventListener('pointerdown', () => { press.to(1, { visualDuration: 0.1, bounce: 0 }); buzz(12); });
const release = () => press.to(0, SPRING.press);
pebble.addEventListener('pointerup', release); pebble.addEventListener('pointercancel', release); pebble.addEventListener('pointerleave', release);
pebble.addEventListener('click', openViewfinder);

// ------------------------------------------------------------------ pebble -> viewfinder morph
const vf = $('#viewfinder'), vfInner = $('#vfInner'), morph = new Value(0, 'ratio');
let from = null;
morph.on((p) => {
  if (!from) return;
  const W = innerWidth, H = innerHeight;
  const sx = lerp(from.w / W, 1, p), sy = lerp(from.h / H, 1, p);
  const tx = lerp(from.cx - W / 2, 0, p), ty = lerp(from.cy - H / 2, 0, p);
  const R = lerp(from.w / 2, 0, p);
  vf.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
  vf.style.borderRadius = `${(R / sx).toFixed(2)}px / ${(R / sy).toFixed(2)}px`;
  vfInner.style.opacity = mix01(0.55, 0.95, p).toFixed(3);
});
function openViewfinder() {
  const r = pebble.getBoundingClientRect();
  from = { w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  vf.hidden = false; morph.jump(0);
  morph.to(1, SPRING.morph).then((ok) => { if (ok) $('#vfClose').focus(); });
  announce('Viseur ouvert. Cadrez la pièce entière.');
}
$('#vfClose').addEventListener('click', async () => {
  await morph.to(0, SPRING.morph);
  vf.hidden = true; pebble.focus();
});

// ------------------------------------------------------------------ daypart
for (const b of document.querySelectorAll('button[data-daypart]')) {
  b.addEventListener('click', () => {
    setDaypart(b.dataset.daypart, true);
    document.querySelectorAll('button[data-daypart]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    dirty = true; srcX.jump(srcX.v);
  });
}

// ------------------------------------------------------------------ boot
setDaypart(currentDaypart());
document.querySelectorAll('button[data-daypart]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.daypart === document.documentElement.dataset.rrDaypart)));
mountSettings($('#tools'));
mountPerf();
pressable($('#heroBtn'));
measure();
srcX.jump(centers[0]); coneX.jump(centers[0]);
select(0, { announceIt: false });
addEventListener('resize', () => { measure(); srcX.jump(centers[active]); coneX.jump(centers[active]); });
