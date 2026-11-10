// ROOMRESET T1.1 — art direction board: live pebble hero, light, palettes with computed contrast.
import { Value, SPRING, VelocityTracker, clamp, lerp } from './spring.js';
import { buzz, tock, announce, mountSettings, setDaypart, currentDaypart, pressable } from './feel.js';
import { mountPerf } from './perf.js';
import { flightPoint, liftCurve } from './missions.js';

const $ = (s, r = document) => r.querySelector(s);

// ------------------------------------------------------------------ hero: put it in its place
const table = $('#table'), wrap = $('#heroPebble'), body = wrap.querySelector('.pebble'), shadow = wrap.querySelector('.pebble-shadow');
const imprint = $('#heroImprint');
const P = { x: new Value(0), y: new Value(0), rot: new Value(-9, 'deg'), lift: new Value(0, 'ratio'), sq: new Value(0, 'ratio') };
let home = { x: 0, y: 0 }, target = { x: 0, y: 0 }, placed = false;
const W = 64, H = 64 * 0.86;
function draw() {
  const L = P.lift.v, k = 1 + 0.08 * L;
  wrap.style.transform = `translate3d(${(P.x.v - W / 2).toFixed(2)}px, ${(P.y.v - H / 2).toFixed(2)}px, 0) rotate(${P.rot.v.toFixed(2)}deg)`;
  body.style.transform = `scale(${(k * (1 + 0.05 * P.sq.v)).toFixed(4)}, ${(k * (1 - 0.06 * P.sq.v)).toFixed(4)})`;
  shadow.style.transform = `translate(calc(var(--lx) * ${(2 + 16 * L).toFixed(2)}px), calc(var(--ly) * ${(3 + 20 * L).toFixed(2)}px)) scale(${(1 + 0.14 * L).toFixed(3)})`;
  shadow.style.opacity = (1 - 0.5 * L).toFixed(3);
}
Object.values(P).forEach((v) => v.on(draw));
function layoutHero() {
  const t = table.getBoundingClientRect(), i = imprint.getBoundingClientRect();
  target = { x: i.left - t.left + i.width / 2, y: i.top - t.top + i.height / 2 };
  home = { x: Math.max(56, t.width * 0.22), y: t.height * 0.56 };
  if (placed) { P.x.jump(target.x); P.y.jump(target.y); P.rot.jump(0); } else { P.x.jump(home.x); P.y.jump(home.y); P.rot.jump(-9); }
}
function land() {
  placed = true; P.rot.to(0, SPRING.snap);
  P.sq.jump(1); P.sq.to(0, SPRING.snap);
  const dent = imprint.querySelector('.dent'), warm = imprint.querySelector('.warm');
  const ds = new Value(0.6, 'ratio'), dO = new Value(1, 'ratio'), wO = new Value(0, 'ratio');
  ds.on((v) => { dent.style.transform = `scale(${v})`; }); dO.on((v) => { dent.style.opacity = v; }); wO.on((v) => { warm.style.opacity = v; });
  ds.to(1.18, SPRING.snap); dO.tween(0, 420); wO.tween(0.9, 120).then(() => wO.tween(0, 600));
  tock(0); announce('Placé. C’est le geste central de ROOMRESET.');
  $('#heroAfter').hidden = false; $('#placeBtn').hidden = true;
}
async function placeByButton() {
  if (placed) return;
  buzz(12);
  const t = new Value(0, 'ratio'), a = { x: P.x.v, y: P.y.v }, r0 = P.rot.v;
  const off = t.on((v) => { const p = flightPoint(a, target, v); P.x.jump(p.x); P.y.jump(p.y); P.lift.jump(liftCurve(v)); P.rot.jump(lerp(r0, 0, v)); });
  await t.to(1, SPRING.flight); off(); P.lift.jump(0); land();
}
const vt = new VelocityTracker();
let drag = null;
wrap.addEventListener('pointerdown', (e) => {
  if (placed) return;
  const t = table.getBoundingClientRect();
  drag = { id: e.pointerId, dx: e.clientX - t.left - P.x.v, dy: e.clientY - t.top - P.y.v, t };
  wrap.setPointerCapture(e.pointerId); vt.reset(); vt.add(e.clientX, e.clientY);
  P.x.stop(); P.y.stop(); P.lift.to(1, SPRING.lift); P.rot.to(P.rot.v * 0.5, SPRING.settle); buzz(6);
});
wrap.addEventListener('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  vt.add(e.clientX, e.clientY);
  const { t } = drag;
  const rb = (v, min, max) => (v < min ? min - (min - v) * 0.3 : v > max ? max + (v - max) * 0.3 : v);
  P.x.jump(rb(e.clientX - t.left - drag.dx, 36, t.width - 36));
  P.y.jump(rb(e.clientY - t.top - drag.dy, 30, t.height - 30));
});
const release = (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  const v = vt.get(), t = drag.t; drag = null;
  const predicted = { x: P.x.v + 0.2 * v.x, y: P.y.v + 0.2 * v.y };
  const near = Math.hypot(P.x.v - target.x, P.y.v - target.y) < 44 || Math.hypot(predicted.x - target.x, predicted.y - target.y) < 40;
  if (near) {
    buzz(12);
    P.x.to(target.x, SPRING.snap, { velocity: v.x }); P.y.to(target.y, SPRING.snap, { velocity: v.y });
    P.lift.to(0, SPRING.drop).then(land);
  } else {
    P.x.glide({ velocity: v.x, min: 36, max: t.width - 36 }); P.y.glide({ velocity: v.y, min: 30, max: t.height - 30 });
    P.lift.to(0, SPRING.drop);
  }
};
wrap.addEventListener('pointerup', release); wrap.addEventListener('pointercancel', release);
$('#placeBtn').addEventListener('click', placeByButton);
$('#resetHero').addEventListener('click', () => {
  placed = false; $('#heroAfter').hidden = true; $('#placeBtn').hidden = false;
  P.lift.jump(0.6); P.x.to(home.x, SPRING.settle); P.y.to(home.y, SPRING.settle); P.rot.to(-9, SPRING.settle); P.lift.to(0, SPRING.drop);
});

// ------------------------------------------------------------------ palettes + computed contrast
function lum(hex) {
  const n = hex.replace('#', ''), c = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const PAL = {
  air: { name: 'Air du matin', bg: '#E9EEE8', surface: '#F7F9F5', berry: '#A8385A' },
  lin: { name: 'Lin (v0)', bg: '#F5F0E8', surface: '#FFFCF7', berry: '#A13F2A' },
};
function contrastRows(p) {
  return [
    ['Texte principal', '#15231E', p.bg, 4.5], ['Texte sur carte', '#15231E', p.surface, 4.5],
    ['Texte secondaire', '#4B5B54', p.bg, 4.5], ['Texte auxiliaire, grand', '#6F7D76', p.bg, 3],
    ['Accent chaud', '#8A5300', p.bg, 4.5], ['Succès', '#2E6A4D', p.bg, 4.5], ['Attention', p.berry, p.bg, 4.5],
    ['Bord d’empreinte, non-texte', '#7C8982', p.bg, 3], ['Galet placé, non-texte', '#5E8C6E', p.bg, 3],
    ['Lumière seule, non-texte', '#F2B33D', p.bg, 3],
    ['Soir : texte', '#F1EADF', '#0F1A16', 4.5], ['Soir : texte secondaire', '#A8B4AD', '#0F1A16', 4.5],
    ['Soir : lampe', '#F5BE55', '#0F1A16', 4.5], ['Soir : bord, non-texte', '#6E7E76', '#0F1A16', 3],
  ];
}
function renderContrast() {
  const key = document.documentElement.dataset.palette || 'air', p = PAL[key];
  $('#contrastBody').innerHTML = contrastRows(p).map(([label, fg, bg, min]) => {
    const r = ratio(fg, bg), ok = r >= min;
    return `<tr><th scope="row"><span class="sw" style="background:${fg};box-shadow:0 0 0 3px ${bg}, 0 0 0 4px rgb(21 35 30 / .2)"></span>${label}</th>
      <td>${r.toFixed(2).replace('.', ',')}:1</td><td>${min.toString().replace('.', ',')}:1</td><td class="${ok ? 'ok' : 'ko'}">${ok ? 'Conforme' : 'Insuffisant : bord ou icône obligatoire'}</td></tr>`;
  }).join('');
  $('#paletteName').textContent = p.name;
}
for (const b of document.querySelectorAll('[data-palette-btn]')) {
  b.addEventListener('click', () => {
    document.documentElement.dataset.palette = b.dataset.paletteBtn;
    document.querySelectorAll('[data-palette-btn]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    renderContrast();
  });
}

// ------------------------------------------------------------------ light
for (const b of document.querySelectorAll('button[data-daypart]')) {
  b.addEventListener('click', () => {
    setDaypart(b.dataset.daypart, true);
    document.querySelectorAll('button[data-daypart]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    draw();
  });
}

// ------------------------------------------------------------------ boot
setDaypart(currentDaypart());
document.querySelectorAll('button[data-daypart]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.daypart === document.documentElement.dataset.rrDaypart)));
document.documentElement.dataset.palette = 'air';
mountSettings($('#tools'));
mountPerf();
pressable($('#placeBtn'));
renderContrast();
layoutHero();
addEventListener('resize', layoutHero);
