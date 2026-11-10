// ROOMRESET prototype: live frame-time overlay (?perf=1 or settings toggle).
// Measures only frames where something animates (DOM loop or WebGL loop), so idle time
// does not dilute the numbers; shows whether any rAF loop is running at rest.
import { frameHooks, rafRunning } from './spring.js';
import { prefs } from './feel.js';

const samples = [];
const MAX = 900;
let longTasks = 0, ltSupported = false, el = null, external = () => false, label = '';

export function record(dtMs) {
  if (dtMs <= 0 || dtMs > 250) return; // ignore tab switches
  samples.push(dtMs); if (samples.length > MAX) samples.shift();
}
export function setExternalLoop(isRunning, name = '') { external = isRunning; label = name; }
export function stats() {
  if (!samples.length) return null;
  const s = [...samples].sort((a, b) => a - b), q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))];
  return { n: s.length, p50: q(0.5), p95: q(0.95), max: s[s.length - 1], janky: s.filter((v) => v > 20).length };
}
export function reset() { samples.length = 0; longTasks = 0; }

frameHooks.add((dt, activeCount) => { if (activeCount > 0) record(dt); });
// Test hook (Playwright / manual): window.rrPerf.stats(), .reset(), .idle()
window.rrPerf = { stats, reset, idle: () => !rafRunning() && !external() };

function fmt(v) { return v.toLocaleString('fr-FR', { maximumFractionDigits: 1, minimumFractionDigits: 1 }); }
function render() {
  if (!el) return;
  const st = stats();
  const running = rafRunning() || external();
  el.innerHTML = `<div><b>Mesures${label ? ' · ' + label : ''}</b></div>
    ${st ? `<div>${st.n} images animées</div>
    <div>p50 ${fmt(st.p50)} ms · p95 <b>${fmt(st.p95)}</b> ms</div>
    <div>max ${fmt(st.max)} ms · > 20 ms : ${st.janky}</div>` : '<div>Interagissez pour mesurer.</div>'}
    <div>Tâches longues : ${ltSupported ? longTasks : 'non mesurables ici'}</div>
    <div>Boucle : ${running ? 'active' : 'au repos (0 rAF)'}</div>
    <button type="button">Remettre à zéro</button>`;
  el.querySelector('button').onclick = reset;
}

export function mountPerf() {
  if (!prefs.perf || el) return;
  el = document.createElement('div'); el.className = 'perf'; el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);
  ltSupported = (PerformanceObserver.supportedEntryTypes || []).includes('longtask');
  if (ltSupported) new PerformanceObserver((list) => { longTasks += list.getEntries().length; }).observe({ type: 'longtask', buffered: true });
  setInterval(render, 500); render();
}
export function unmountPerf() { el?.remove(); el = null; }
