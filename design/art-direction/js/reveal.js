// ROOMRESET T1.1 — Sunrise Reveal study.
// 1) Focus pull on the "after" photo (crossfade of pre-blurred layers, opacity only).
// 2) A band of morning light compares before/after. Transforms only: a clipping window is
//    translated and the "after" image counter-translated inside it; the band hides the seam.
import { Value, SPRING, VelocityTracker, clamp, mix01, EASE } from './spring.js';
import { buzz, chord, announce, mountSettings, setDaypart, currentDaypart, pressable, motionReduced } from './feel.js';
import { mountPerf } from './perf.js';
import { loadImage, blurredCanvas } from './blur.js';

const $ = (s, r = document) => r.querySelector(s);
const frame = $('#frame'), win = $('#win'), after = $('#afterImg'), band = $('#band'), focus = $('#focus');
let W = 0;
const x = new Value(0), streak = new Value(0, 'ratio');
let crossedFromLeft = false, shownSummary = false;

function measure() { W = frame.clientWidth; }
function draw() {
  const v = clamp(x.v, 0, W);
  win.style.transform = `translate3d(${(v - W).toFixed(2)}px, 0, 0)`;
  after.style.transform = `translate3d(${(W - v).toFixed(2)}px, 0, 0)`;
  band.style.transform = `translate3d(${(v - 36).toFixed(2)}px, 0, 0)`;
  $('.tag-after').style.opacity = mix01(40, 110, v).toFixed(3);
  $('.tag-before').style.opacity = mix01(40, 110, W - v).toFixed(3);
  band.setAttribute('aria-valuenow', String(Math.round((v / (W || 1)) * 100)));
}
x.on(() => {
  draw();
  streak.jump(clamp(Math.abs(x.velocity()) / 1600, 0, 1));
  if (x.v < W * 0.3) crossedFromLeft = true;
  if (crossedFromLeft && x.v >= W - 0.5 && !shownSummary) summary();
});
streak.on((s) => { $('#streak').style.opacity = (0.15 + 0.85 * s).toFixed(3); });

function summary() {
  shownSummary = true; chord();
  const el = $('#summary'); el.hidden = false;
  const o = new Value(0, 'ratio'), y = new Value(10);
  o.on((v) => { el.style.opacity = v; }); y.on((v) => { el.style.transform = `translateY(${v}px)`; });
  o.tween(1, 220); y.to(0, SPRING.settle);
  announce(el.textContent);
}

// ------------------------------------------------------------------ focus pull
async function focusPull() {
  const img = await loadImage('assets/room-after.jpg');
  const layers = [1 / 40, 1 / 16, 1 / 7].map((f) => blurredCanvas(img, f, 270));
  focus.replaceChildren(...layers);
  focus.hidden = false;
  band.style.opacity = '0';
  const t = new Value(0, 'ratio'), zoom = $('#zoom');
  t.on((v) => {
    layers[0].style.opacity = (1 - mix01(0, 0.45, v)).toFixed(3);
    layers[1].style.opacity = (1 - mix01(0.25, 0.7, v)).toFixed(3);
    layers[2].style.opacity = (1 - mix01(0.5, 1, v)).toFixed(3);
    zoom.style.transform = `scale(${(1.045 - 0.045 * EASE.out(v)).toFixed(4)})`;
  });
  t.jump(0);
  await new Promise((r) => setTimeout(r, motionReduced() ? 0 : 350));
  await t.tween(1, 900, EASE.out);
  focus.hidden = true;
  // The light band arrives at the right edge, then nudges once to show it can move.
  const bo = new Value(0, 'ratio'); bo.on((v) => { band.style.opacity = v; });
  await bo.tween(1, 200);
  if (!motionReduced()) { await x.to(W - 28, SPRING.settle); await x.to(W, SPRING.snap); }
  $('#hint').hidden = false;
}

// ------------------------------------------------------------------ drag anywhere on the photo
const vt = new VelocityTracker();
let dragging = false, pid = null, left = 0;
frame.addEventListener('pointerdown', (e) => {
  dragging = true; pid = e.pointerId; frame.setPointerCapture(pid);
  left = frame.getBoundingClientRect().left; vt.reset();
  const fx = clamp(e.clientX - left, 0, W); vt.add(fx, 0);
  if (Math.abs(fx - x.v) > 40) x.to(fx, { visualDuration: 0.16, bounce: 0 }); else x.stop();
  buzz(6);
});
frame.addEventListener('pointermove', (e) => {
  if (!dragging || e.pointerId !== pid) return;
  const fx = clamp(e.clientX - left, 0, W); vt.add(fx, 0);
  x.jump(fx, vt.get().x);
});
const end = (e) => {
  if (!dragging || e.pointerId !== pid) return;
  dragging = false;
  const v = vt.get().x;
  const target = v > 600 ? W : v < -600 ? 0 : x.v > W / 2 ? W : 0;
  x.to(target, SPRING.settle, { velocity: v });
  streak.tween(0, 400);
};
frame.addEventListener('pointerup', end); frame.addEventListener('pointercancel', end);

band.addEventListener('keydown', (e) => {
  const step = W * 0.05;
  if (e.key === 'ArrowRight') x.to(clamp(x.target + step, 0, W), SPRING.snap);
  else if (e.key === 'ArrowLeft') x.to(clamp(x.target - step, 0, W), SPRING.snap);
  else if (e.key === 'Home') x.to(0, SPRING.settle);
  else if (e.key === 'End') x.to(W, SPRING.settle);
  else return;
  e.preventDefault();
});

$('#showAfter').addEventListener('click', async () => {
  if (x.v > W - 1) { await x.to(0, SPRING.reveal); }
  crossedFromLeft = true; x.to(W, SPRING.reveal);
});
$('#replay').addEventListener('click', () => {
  shownSummary = false; crossedFromLeft = false; $('#summary').hidden = true; $('#hint').hidden = true;
  x.jump(W); focusPull();
});

// ------------------------------------------------------------------ boot
setDaypart(currentDaypart());
mountSettings($('#tools'));
mountPerf();
pressable($('#showAfter')); pressable($('#replay'));
await Promise.all([after.decode?.().catch(() => {}), $('#beforeImg').decode?.().catch(() => {})]);
measure(); x.jump(W);
addEventListener('resize', () => { const p = W ? x.v / W : 1; measure(); x.jump(p * W); });
focusPull();
