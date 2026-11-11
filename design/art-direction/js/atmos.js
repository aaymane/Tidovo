// ROOMRESET T1.5 — "Atmosphère vivante" study controller.
// Battery rules: 30 fps when nobody touches, 60 fps while interacting, stops when the tab is
// hidden, a single still frame with reduced motion. Parallax from finger (always) and tilt (opt-in).
import { GlAtmos } from './atmos-gl.js';
import { DomAtmos } from './atmos-dom.js';
import { setDaypart, currentDaypart, motionReduced, mountSettings, announce } from './feel.js';
import { mountPerf, record, setExternalLoop, reset as resetPerf } from './perf.js';

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
let engine = null, name = 'gl', raf = 0, last = 0, lastInput = -1e9, skip = false;
const par = { x: 0, y: 0 }, target = { x: 0, y: 0 };
let light = { lx: 0.55, ly: 0.85 };

function readLight() {
  const cs = getComputedStyle(document.documentElement);
  light = { lx: parseFloat(cs.getPropertyValue('--lx')) || 0.55, ly: parseFloat(cs.getPropertyValue('--ly')) || 0.85 };
}
function loop(now) {
  raf = requestAnimationFrame(loop);
  const interacting = now - lastInput < 3000;
  skip = !skip;
  if (!interacting && skip) return; // 30 fps ambient
  if (interacting && last) record(now - last);
  last = now;
  par.x += (target.x - par.x) * 0.08; par.y += (target.y - par.y) * 0.08;
  engine.frame(now / 1000, par, light);
}
function startLoop() {
  stopLoop();
  if (!engine) return;
  if (motionReduced()) { engine.frame(12, { x: 0, y: 0 }, light); return; } // one still frame
  last = 0; raf = requestAnimationFrame(loop);
}
function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
setExternalLoop(() => raf !== 0, 'Atmosphère');

async function use(next) {
  stopLoop(); engine?.destroy(); engine = null; name = next;
  document.body.dataset.atmos = next;
  for (const b of document.querySelectorAll('[data-atmos-btn]')) b.setAttribute('aria-checked', String(b.dataset.atmosBtn === next));
  const theme = document.documentElement.dataset.theme;
  try {
    if (next === 'gl') { engine = new GlAtmos($('#atmosGl')); engine.mount(); }
    else if (next === 'dom') { engine = new DomAtmos($('#atmosDom')); engine.mount(); }
  } catch (err) {
    console.error(err); $('#atmosNote').textContent = 'Le shader n’a pas pu démarrer ici : retour aux sprites.'; return use('dom');
  }
  engine?.setTheme(theme);
  $('#atmosNote').textContent = { gl: 'Shader : profondeur de champ calculée en direct.', dom: 'Sprites Blender floutés une fois, déplacés en transform.', flat: 'Fond uni : la référence de départ.' }[next];
  const u = new URL(location.href); u.searchParams.set('atmos', next); history.replaceState(null, '', u);
  resetPerf(); startLoop();
}

// ------------------------------------------------------------------ inputs
addEventListener('pointermove', (e) => {
  target.x = (e.clientX / innerWidth) * 2 - 1; target.y = (e.clientY / innerHeight) * 2 - 1; lastInput = performance.now();
}, { passive: true });
addEventListener('pointerdown', () => { lastInput = performance.now(); }, { passive: true });
let beta0 = null;
function onTilt(e) {
  if (e.gamma == null) return;
  if (beta0 == null) beta0 = e.beta;
  target.x = Math.max(-1, Math.min(1, e.gamma / 25)); target.y = Math.max(-1, Math.min(1, (e.beta - beta0) / 25));
  lastInput = performance.now();
}
$('#tiltBtn').addEventListener('click', async () => {
  try {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      if ((await DeviceOrientationEvent.requestPermission()) !== 'granted') { announce('Inclinaison refusée.'); return; }
    }
    addEventListener('deviceorientation', onTilt);
    $('#tiltBtn').setAttribute('aria-pressed', 'true'); $('#tiltBtn').textContent = 'Inclinaison active';
  } catch { announce('Inclinaison indisponible sur cet appareil.'); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) stopLoop(); else startLoop(); });
addEventListener('resize', () => { engine?.resize(); if (!raf) startLoop(); });
for (const b of document.querySelectorAll('[data-atmos-btn]')) b.addEventListener('click', () => use(b.dataset.atmosBtn));
for (const b of document.querySelectorAll('button[data-daypart]')) {
  b.addEventListener('click', () => {
    setDaypart(b.dataset.daypart, true); readLight();
    document.querySelectorAll('button[data-daypart]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $('#greeting').textContent = b.dataset.daypart === 'evening' ? 'Bonsoir.' : 'Bonjour.';
    engine?.setTheme(document.documentElement.dataset.theme); if (!raf) startLoop();
  });
}

// ------------------------------------------------------------------ boot
setDaypart(currentDaypart()); readLight();
const dp = document.documentElement.dataset.rrDaypart;
document.querySelectorAll('button[data-daypart]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.daypart === dp)));
$('#greeting').textContent = dp === 'evening' ? 'Bonsoir.' : 'Bonjour.';
mountSettings($('#tools'), { onChange: (k) => { if (k === 'calm') startLoop(); } });
mountPerf();
use(['gl', 'dom', 'flat'].includes(params.get('atmos')) ? params.get('atmos') : 'gl');
window.rrAtmos = { get running() { return raf !== 0; }, get engine() { return name; } };
