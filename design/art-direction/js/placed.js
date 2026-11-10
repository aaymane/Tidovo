// ROOMRESET T1.1 — "Placed" signature study. One controller, interchangeable engines:
//   css    : DOM pebbles, procedural CSS material (reacts to the global light)
//   sprite : DOM pebbles, Blender pre-rendered satin material
//   gl     : WebGL (Three.js) pebbles + a tray that physically dents on impact
// Choreography and timings are identical across engines so they can be compared fairly.
import { Value, SPRING, VelocityTracker, clamp, lerp, onRender, arrival } from './spring.js';
import { prefs, buzz, tock, chord, announce, pressable, mountSettings, setDaypart, currentDaypart, motionReduced } from './feel.js';
import { mountPerf, reset as resetPerf } from './perf.js';
import { loadImage, blurredCanvas } from './blur.js';

import { GLYPHS, glyphSvg, MISSIONS, pebbleSize, flightPoint, liftCurve, REST_ROT } from './missions.js';
export { GLYPHS, glyphSvg, MISSIONS, pebbleSize, flightPoint, liftCurve };

// ------------------------------------------------------------------ DOM engine (css | sprite)
class DomEngine {
  constructor(material) { this.material = material; this.layer = document.getElementById('layer'); this.items = new Map(); }
  async mount(missions) {
    this.layer.innerHTML = '';
    for (const [i, m] of missions.entries()) this.items.set(m.id, this.create(m, i));
    this.off = onRender(() => { for (const it of this.items.values()) if (it.dirty) { it.dirty = false; it.draw(); } });
  }
  create(m, i) {
    const s = pebbleSize(m), wrap = document.createElement('div');
    wrap.className = 'pebble-wrap';
    wrap.style.setProperty('--size', s + 'px'); wrap.style.setProperty('--pr', m.pr); wrap.style.setProperty('--tint', m.tint);
    const sprite = this.material === 'sprite' ? `<img class="sprite" alt="" draggable="false" src="assets/pebbles/pebble-${m.id}.webp">` : '';
    wrap.innerHTML = `<div class="pebble-shadow"></div><div class="pebble ${this.material === 'sprite' ? 'is-sprite' : ''}">${sprite}${glyphSvg(m.glyph)}</div>`;
    const it = {
      el: wrap, body: wrap.querySelector('.pebble'), shadow: wrap.querySelector('.pebble-shadow'), w: s, h: s * 0.86,
      x: new Value(-200), y: new Value(-200), rot: new Value(REST_ROT[i % 5], 'deg'), lift: new Value(0, 'ratio'),
      sx: new Value(1, 'ratio'), sy: new Value(1, 'ratio'), o: new Value(0, 'ratio'), small: new Value(1, 'ratio'), dirty: true,
    };
    it.draw = () => {
      const L = it.lift.v, k = (1 + 0.08 * L) * it.small.v;
      wrap.style.transform = `translate3d(${(it.x.v - it.w / 2).toFixed(2)}px, ${(it.y.v - it.h / 2).toFixed(2)}px, 0) rotate(${it.rot.v.toFixed(2)}deg)`;
      it.body.style.transform = `scale(${(k * it.sx.v).toFixed(4)}, ${(k * it.sy.v).toFixed(4)})`;
      it.shadow.style.transform = `translate(calc(var(--lx) * ${(2 + 16 * L).toFixed(2)}px), calc(var(--ly) * ${(3 + 20 * L).toFixed(2)}px)) scale(${(it.small.v * (1 + 0.14 * L)).toFixed(4)})`;
      it.shadow.style.opacity = (1 - 0.5 * L).toFixed(3);
      wrap.style.opacity = it.o.v.toFixed(3);
    };
    for (const v of [it.x, it.y, it.rot, it.lift, it.sx, it.sy, it.o, it.small]) v.on(() => { it.dirty = true; });
    this.layer.appendChild(wrap);
    return it;
  }
  item(m) { return this.items.get(m.id); }
  position(m) { const it = this.item(m); return { x: it.x.v, y: it.y.v }; }
  // Pebble arrives on the card: short drop with weight.
  arrive(m, p) {
    const it = this.item(m);
    it.x.jump(p.x); it.y.jump(p.y + 14); it.small.jump(1); it.sx.jump(1); it.sy.jump(1);
    it.lift.jump(0.7); it.o.jump(0);
    it.o.tween(1, 160); it.y.to(p.y, SPRING.drop); return it.lift.to(0, SPRING.drop);
  }
  follow(m, p) { const it = this.item(m); it.x.jump(p.x); it.y.jump(p.y); }
  async fly(m, a, b, { onLand } = {}) {
    const it = this.item(m), t = new Value(0, 'ratio'), rot0 = it.rot.v;
    it.lift.to(0.25, SPRING.lift);
    const unsub = t.on((v) => {
      const p = flightPoint(a, b, v);
      it.x.jump(p.x); it.y.jump(p.y); it.lift.jump(Math.max(0, liftCurve(v)));
      it.rot.jump(lerp(rot0, 0, Math.min(1, v * 1.2)));
    });
    await arrival(t, 1, SPRING.flight);
    unsub(); it.x.jump(b.x); it.y.jump(b.y); it.lift.jump(0); it.rot.jump(0);
    onLand?.();
    it.sx.jump(1.05); it.sy.jump(0.94); it.sx.to(1, SPRING.snap); it.sy.to(1, SPRING.snap);
  }
  impact(index) {
    const imp = document.querySelectorAll('.tray .imprint')[index];
    const dent = imp?.querySelector('.dent'), warm = imp?.querySelector('.warm');
    if (!dent) return;
    const s = new Value(0.6, 'ratio'), o = new Value(1, 'ratio'), w = new Value(0, 'ratio');
    s.on((v) => { dent.style.transform = `scale(${v})`; }); o.on((v) => { dent.style.opacity = v; }); w.on((v) => { warm.style.opacity = v; });
    s.to(1.18, SPRING.snap); o.tween(0, 420);
    w.tween(0.9, 120).then(() => w.tween(0, 520));
    imp.classList.add('is-filled');
  }
  unfill(index) { document.querySelectorAll('.tray .imprint')[index]?.classList.remove('is-filled'); }
  async toLater(m, b) {
    const it = this.item(m);
    it.small.to(0.66, SPRING.settle);
    await Promise.all([it.x.to(b.x, SPRING.settle), it.y.to(b.y, SPRING.settle), it.rot.to(REST_ROT[MISSIONS.indexOf(m) % 5], SPRING.settle)]);
  }
  closeImprint(index, open = false) {
    const imp = document.querySelectorAll('.tray .imprint')[index]; if (!imp) return;
    const s = new Value(open ? 0.2 : 1, 'ratio'), o = new Value(open ? 0 : 1, 'ratio');
    s.on((v) => { imp.style.transform = `scale(${v})`; }); o.on((v) => { imp.style.opacity = v; });
    s.to(open ? 1 : 0.2, SPRING.settle); o.tween(open ? 1 : 0, open ? 180 : 260);
  }
  async back(m, from, to) { // undo: lift out of the imprint (or later row) back to the card
    const it = this.item(m), t = new Value(0, 'ratio');
    it.small.to(1, SPRING.settle);
    const unsub = t.on((v) => { const p = flightPoint(from, to, v); it.x.jump(p.x); it.y.jump(p.y); it.lift.jump(liftCurve(v) * 0.8); });
    await t.to(1, SPRING.flight); unsub(); it.lift.jump(0);
  }
  hide(m) { const it = this.item(m); it.o.tween(0, 120); }
  async destroy() { this.off?.(); this.layer.innerHTML = ''; this.items.clear(); }
}

// ------------------------------------------------------------------ controller
const $ = (s, r = document) => r.querySelector(s);
const N = MISSIONS.length;
const st = { i: 0, status: MISSIONS.map(() => 'todo'), laterOrder: [], history: [], busy: false, engineName: 'css' };
let engine = null;
window.rrDebug = { st, starts: 0, get engine() { return engine; } };
const card = { y: new Value(0), o: new Value(1, 'ratio'), s: new Value(1, 'ratio') };

const center = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
// Slot position at rest (the card may still be springing in).
const slotPoint = () => { const c = center($('#slot')); return { x: c.x, y: c.y - card.y.v }; };
let gen = 0; // bumps on every restart: stale async sequences check it and stop.
const imprintPoint = (i) => center(document.querySelectorAll('.tray .imprint')[i]);
function laterPoint(k) {
  const row = $('#laterRow'), r = row.getBoundingClientRect();
  return { x: r.left + 22 + k * 48, y: r.top + r.height / 2 };
}

function buildTray() {
  $('#tray').innerHTML = MISSIONS.map((m) => {
    const s = pebbleSize(m);
    return `<div class="imprint" style="--size:${s}px;--pr:${m.pr}" role="listitem" aria-label="${m.title}, ${m.min} min">
      <span class="dent"></span><span class="warm"></span>${glyphSvg(m.glyph)}</div>`;
  }).join('');
}
function fillCard(m) {
  $('#slot').style.width = pebbleSize(m) + 'px';
  $('#slot').style.height = pebbleSize(m) * 0.86 + 'px';
  $('#missionTitle').textContent = m.title;
  $('#missionPlace').textContent = m.place;
  $('#missionTime').textContent = `${m.min} min`;
}
function placedCount() { return st.status.filter((s) => s === 'placed').length; }
function updateProgress() {
  const p = placedCount();
  $('#progress').textContent = `${p} sur ${N} missions placées`;
  light.tween(0.1 + 0.11 * p, 700);
}

const light = new Value(0.1, 'ratio');
light.on((v) => { $('.atmos-light').style.opacity = v.toFixed(3); });

card.y.on(() => drawCard()); card.o.on(() => drawCard()); card.s.on(() => drawCard());
function drawCard() {
  const el = $('#card');
  el.style.transform = `translate3d(0, ${card.y.v.toFixed(2)}px, 0) scale(${card.s.v.toFixed(4)})`;
  el.style.opacity = card.o.v.toFixed(3);
}

function nextIndex(from) { for (let k = from; k < N; k++) if (st.status[k] === 'todo') return k; return -1; }

async function enterCard(i) {
  st.i = i; fillCard(MISSIONS[i]);
  card.y.jump(36); card.o.jump(0); card.s.jump(0.98);
  card.o.tween(1, 180); card.s.to(1, SPRING.settle);
  await card.y.to(0, SPRING.settle);
}
function exitCard(dir, velocity = 0) {
  card.o.tween(0, 140); card.s.to(0.96, SPRING.settle);
  card.y.to(dir === 'up' ? -40 : 60, SPRING.settle, { velocity });
}

let undoTimer = 0;
function showUndo(text) {
  const u = $('#undo'); $('#undoText').textContent = text; u.hidden = false;
  clearTimeout(undoTimer); undoTimer = setTimeout(() => { u.hidden = true; }, 5000);
}

function hideHint() { const h = $('.hint'); if (h) h.hidden = true; }
async function done(velocity = 0) {
  if (st.busy || st.i < 0) return;
  hideHint();
  st.busy = true; buzz(12);
  const i = st.i, m = MISSIONS[i];
  st.history.push({ type: 'placed', i }); st.status[i] = 'placed';
  const g = gen, from = engine.position(m), to = imprintPoint(i);
  exitCard('up', velocity);
  const step = placedCount() - 1;
  const flight = engine.fly(m, from, to, {
    onLand: () => {
      engine.impact(i); tock(step); updateProgress();
      announce(`${m.title} : placé. ${placedCount()} sur ${N}.`);
    },
  });
  setTimeout(() => { st.busy = false; }, 150);
  showUndo(`${m.title} placé`);
  await new Promise((r) => setTimeout(r, motionReduced() ? 0 : 260));
  if (g !== gen) return;
  const n = nextIndex(i + 1);
  if (n >= 0) { await prepareNext(n, g); } else { await flight; if (g === gen) finish(); }
}

async function later(velocity = 0) {
  if (st.busy || st.i < 0) return;
  hideHint();
  st.busy = true; buzz(6);
  const i = st.i, m = MISSIONS[i], g = gen;
  st.history.push({ type: 'later', i }); st.status[i] = 'later'; st.laterOrder.push(i);
  exitCard('down', velocity);
  engine.closeImprint(i);
  renderLater();
  engine.toLater(m, laterPoint(st.laterOrder.length - 1));
  setTimeout(() => { st.busy = false; }, 150);
  showUndo(`${m.title} : pour plus tard`);
  announce(`${m.title} : gardé pour plus tard, sans pénalité.`);
  const n = nextIndex(i + 1);
  if (n >= 0) await prepareNext(n, g); else if (g === gen) finish();
}

async function prepareNext(n, g = gen) {
  if (g !== gen) return;
  const p = enterCard(n);
  engine.arrive(MISSIONS[n], slotPoint());
  await p;
}

async function undo() {
  const h = st.history.pop(); if (!h) return;
  $('#undo').hidden = true; $('#receipt').hidden = true;
  const m = MISSIONS[h.i];
  if (st.i >= 0 && st.status[st.i] === 'todo' && st.i !== h.i) engine.hide(MISSIONS[st.i]);
  let from;
  if (h.type === 'placed') { from = imprintPoint(h.i); engine.unfill(h.i); }
  else {
    from = laterPoint(st.laterOrder.indexOf(h.i));
    st.laterOrder = st.laterOrder.filter((k) => k !== h.i); renderLater(); engine.closeImprint(h.i, true);
  }
  st.status[h.i] = 'todo';
  await enterCard(h.i);
  await engine.back(m, from, slotPoint());
  updateProgress();
  announce(`Annulé. ${m.title} est de nouveau la mission en cours.`);
}

function renderLater() {
  const row = $('#laterRow');
  row.setAttribute('aria-label', `${st.laterOrder.length} mission(s) pour plus tard`);
  $('#laterCount').textContent = st.laterOrder.length ? `Plus tard (${st.laterOrder.length})` : 'Plus tard';
}

function finish() {
  st.i = -1;
  const placed = placedCount(), mins = MISSIONS.reduce((a, m, k) => a + (st.status[k] === 'placed' ? m.min : 0), 0);
  const lat = st.laterOrder.length;
  $('#receiptText').textContent = placed
    ? `${placed} mission${placed > 1 ? 's' : ''} placée${placed > 1 ? 's' : ''} en ${mins} minutes.${lat ? ` ${lat} gardée${lat > 1 ? 's' : ''} pour plus tard.` : ''}`
    : 'Rien de placé cette fois, et c’est très bien aussi.';
  // The tray seals: one light sweep across the plan.
  const seal = $('#seal'), x = new Value(-1, 'ratio');
  x.on((v) => { seal.style.transform = `translateX(${(v * 100).toFixed(2)}%)`; seal.style.opacity = (1 - Math.abs(v)).toFixed(3); });
  x.tween(1, 900);
  if (placed) chord();
  const r = $('#receipt'), ry = new Value(40); r.hidden = false; r.style.opacity = '0';
  ry.on((v) => { r.style.transform = `translateY(${v}px)`; });
  const ro = new Value(0, 'ratio'); ro.on((v) => { r.style.opacity = v; });
  setTimeout(() => { ro.tween(1, 200); ry.to(0, SPRING.settle); $('#replay').focus({ preventScroll: true }); }, motionReduced() ? 0 : 500);
  announce($('#receiptText').textContent);
}

// ------------------------------------------------------------------ swipe on the card
function bindSwipe() {
  const el = $('#card'), vt = new VelocityTracker();
  let startY = 0, dragging = false, id = null, base = null;
  // Measure the slot once per gesture, then add the card offset (no layout reads per move).
  const follow = () => engine.follow(MISSIONS[st.i], { x: base.x, y: base.y + card.y.v });
  el.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || st.busy || st.i < 0) return;
    dragging = true; id = e.pointerId; startY = e.clientY - card.y.v; vt.reset(); vt.add(0, e.clientY);
    base = slotPoint();
    el.setPointerCapture(id); card.y.stop();
  });
  el.addEventListener('pointermove', (e) => {
    if (!dragging || e.pointerId !== id) return;
    let dy = e.clientY - startY; vt.add(0, e.clientY);
    if (Math.abs(dy) > 120) dy = Math.sign(dy) * (120 + (Math.abs(dy) - 120) * 0.35);
    card.y.jump(dy); follow();
  });
  const end = (e) => {
    if (!dragging || e.pointerId !== id) return;
    dragging = false; const v = vt.get().y, dy = card.y.v;
    if (dy < -70 || v < -650) done(v);
    else if (dy > 70 || v > 650) later(v);
    else {
      card.y.to(0, SPRING.settle, { velocity: v });
      const off = card.y.on(follow);
      setTimeout(off, 700);
    }
  };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
}

// ------------------------------------------------------------------ engines
async function makeEngine(name) {
  if (name === 'gl') {
    const { GlEngine } = await import('./placed-webgl.js');
    return new GlEngine(document.getElementById('gl'));
  }
  return new DomEngine(name);
}

async function start(name) {
  gen++;
  window.rrDebug.starts++; if (window.rrDebug.trace) console.log('START', name, new Error().stack.split('\n').slice(1, 4).join(' | '));
  if (engine) await engine.destroy();
  st.engineName = name; document.body.dataset.engine = name;
  for (const b of document.querySelectorAll('[data-engine-btn]')) b.setAttribute('aria-checked', String(b.dataset.engineBtn === name));
  const hint = $('.hint'); if (hint) hint.hidden = false;
  st.i = 0; st.status = MISSIONS.map(() => 'todo'); st.laterOrder = []; st.history = []; st.busy = false;
  $('#receipt').hidden = true; $('#undo').hidden = true;
  buildTray(); renderLater(); updateProgress();
  for (const imp of document.querySelectorAll('.tray .imprint')) { imp.style.opacity = ''; imp.style.transform = ''; }
  if (name === 'gl') $('#engineNote').textContent = 'Chargement du moteur 3D…';
  engine = await makeEngine(name);
  try {
    await engine.mount(MISSIONS, { imprint: imprintPoint, tray: $('#tray') });
  } catch (err) {
    console.error(err);
    $('#engineNote').textContent = 'Le moteur 3D n’a pas pu démarrer ici : retour au moteur CSS.';
    return start('css');
  }
  $('#engineNote').textContent = { css: 'Matière procédurale en CSS, guidée par la lumière globale.', sprite: 'Matière satinée pré-rendue dans Blender.', gl: 'Galets 3D réels, plateau qui se creuse à l’impact.' }[name];
  resetPerf();
  const u = new URL(location.href); u.searchParams.set('engine', name); history.replaceState(null, '', u);
  await enterCard(0);
  engine.arrive(MISSIONS[0], slotPoint());
}

// ------------------------------------------------------------------ atmosphere: your room, very blurred
async function atmosphere() {
  try {
    const img = await loadImage('assets/room-before.jpg');
    const c = blurredCanvas(img, 1 / 36, 240);
    c.setAttribute('aria-hidden', 'true');
    $('.atmos').prepend(c);
  } catch { /* stays on the plain background */ }
}

// ------------------------------------------------------------------ boot
setDaypart(currentDaypart());
mountSettings($('#tools'));
mountPerf();
pressable($('#doneBtn')); pressable($('#laterBtn'));
$('#doneBtn').addEventListener('click', () => done());
$('#laterBtn').addEventListener('click', () => later());
$('#undoBtn').addEventListener('click', undo);
$('#replay').addEventListener('click', () => start(st.engineName));
for (const b of document.querySelectorAll('[data-engine-btn]')) b.addEventListener('click', () => start(b.dataset.engineBtn));
for (const b of document.querySelectorAll('button[data-daypart]')) b.addEventListener('click', () => { setDaypart(b.dataset.daypart, true); start(st.engineName); });
bindSwipe();
atmosphere();
// Restart only when the width really changes (rotation); mobile browsers fire height-only resizes.
let resizeT = 0, lastW = innerWidth;
addEventListener('resize', () => {
  if (Math.abs(innerWidth - lastW) < 2) return;
  lastW = innerWidth; clearTimeout(resizeT); resizeT = setTimeout(() => start(st.engineName), 250);
});
const initial = new URLSearchParams(location.search).get('engine');
start(['css', 'sprite', 'gl'].includes(initial) ? initial : 'css');
