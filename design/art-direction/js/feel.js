// ROOMRESET prototype: senses and preferences shared by every study.
import { setCalm, Value, SPRING } from './spring.js';

const store = {
  get(k, d) { try { const v = localStorage.getItem('rr.' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('rr.' + k, JSON.stringify(v)); } catch { /* private mode */ } },
};

const params = new URLSearchParams(location.search);
export const prefs = {
  sound: store.get('sound', false),
  vibrate: store.get('vibrate', true),
  iosHaptic: store.get('iosHaptic', false),
  calm: store.get('calm', false),
  perf: params.has('perf') || store.get('perf', false),
};
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
export const motionReduced = () => reducedQuery.matches || prefs.calm || params.get('motion') === 'reduce';
function applyCalm() { setCalm(motionReduced()); document.documentElement.dataset.motion = motionReduced() ? 'calm' : 'full'; }
reducedQuery.addEventListener?.('change', applyCalm);
applyCalm();

// ------------------------------------------------------------------ sound (Web Audio, synthesized)
let ctx = null;
export function unlockAudio() {
  if (!prefs.sound) return;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  } catch { ctx = null; }
}
const SCALE = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2, 9 / 4];
export function tock(step = 0) {
  if (!prefs.sound || !ctx) return;
  const t = ctx.currentTime, f = 392 * SCALE[step % SCALE.length];
  const out = ctx.createGain(); out.gain.value = 0.22; out.connect(ctx.destination);
  // Body: short woody pitch-drop tone.
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(f * 1.32, t);
  osc.frequency.exponentialRampToValueAtTime(f, t + 0.035);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.9, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  osc.connect(g).connect(out); osc.start(t); osc.stop(t + 0.18);
  // Click: filtered noise transient, the "contact".
  const len = Math.floor(ctx.sampleRate * 0.03), buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const n = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), ng = ctx.createGain();
  bp.type = 'bandpass'; bp.frequency.value = 2200; bp.Q.value = 1.2; ng.gain.value = 0.35;
  n.buffer = buf; n.connect(bp).connect(ng).connect(out); n.start(t);
}
export function chord() {
  if (!prefs.sound || !ctx) return;
  const t = ctx.currentTime;
  [392, 587.33, 783.99].forEach((f, i) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t + i * 0.06);
    g.gain.exponentialRampToValueAtTime(0.09, t + i * 0.06 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.06 + 1.1);
    o.connect(g).connect(ctx.destination); o.start(t + i * 0.06); o.stop(t + i * 0.06 + 1.2);
  });
}

// ------------------------------------------------------------------ haptics
let iosSwitch = null;
function ensureIosSwitch() {
  if (iosSwitch) return iosSwitch;
  const label = document.createElement('label');
  label.setAttribute('aria-hidden', 'true');
  label.style.cssText = 'position:fixed;left:-200px;top:0;opacity:0;pointer-events:none';
  const input = document.createElement('input');
  input.type = 'checkbox'; input.setAttribute('switch', ''); input.tabIndex = -1;
  label.appendChild(input); document.body.appendChild(label);
  iosSwitch = label; return label;
}
// Must be called inside a user gesture handler for the iOS experiment to have a chance.
export function buzz(pattern = 12) {
  if (motionReduced() && pattern !== 12) pattern = 12;
  if (prefs.vibrate && navigator.vibrate) { try { navigator.vibrate(pattern); } catch { /* ignore */ } }
  if (prefs.iosHaptic) { try { ensureIosSwitch().click(); } catch { /* ignore */ } }
}

// ------------------------------------------------------------------ one global light
// Day parts drive shadow direction (--lx/--ly), beam skew and the theme.
export const DAYPARTS = {
  morning: { lx: 0.62, ly: 0.78, skew: -14, theme: 'day', label: 'Matin' },
  noon:    { lx: 0.08, ly: 1.0,  skew: -2,  theme: 'day', label: 'Midi' },
  evening: { lx: -0.6, ly: 0.8,  skew: 15,  theme: 'evening', label: 'Soir' },
};
export function currentDaypart() {
  const forced = params.get('daypart') || store.get('daypart', null);
  if (forced && DAYPARTS[forced]) return forced;
  const h = new Date().getHours();
  return h >= 18 || h < 6 ? 'evening' : h >= 11 && h < 15 ? 'noon' : 'morning';
}
export function setDaypart(name, persist = false) {
  const p = DAYPARTS[name]; if (!p) return;
  const root = document.documentElement.style;
  root.setProperty('--lx', p.lx); root.setProperty('--ly', p.ly); root.setProperty('--beam-skew', p.skew + 'deg');
  document.documentElement.dataset.theme = p.theme;
  document.documentElement.dataset.rrDaypart = name;
  if (persist) store.set('daypart', name);
  document.dispatchEvent(new CustomEvent('rr:daypart', { detail: { name, ...p } }));
}

// ------------------------------------------------------------------ screen reader announcements
let live = null;
export function announce(text) {
  if (!live) {
    live = document.createElement('div');
    live.className = 'sr-only'; live.setAttribute('aria-live', 'polite'); live.setAttribute('role', 'status');
    document.body.appendChild(live);
  }
  live.textContent = '';
  setTimeout(() => { live.textContent = text; }, 30);
}

// ------------------------------------------------------------------ press feedback (buttons)
export function pressable(el) {
  const s = new Value(1, 'ratio');
  s.on((v) => { el.style.transform = `scale(${v})`; });
  const down = () => { s.to(0.97, { visualDuration: 0.08, bounce: 0 }); };
  const up = () => { s.to(1, SPRING.press); };
  el.addEventListener('pointerdown', down);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  el.addEventListener('pointerleave', up);
  return el;
}

// ------------------------------------------------------------------ settings sheet
const ICON_GEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';

export function mountSettings(host, { onChange } = {}) {
  const btn = document.createElement('button');
  btn.className = 'icon-btn'; btn.type = 'button';
  btn.setAttribute('aria-label', 'Réglages de l’étude'); btn.innerHTML = ICON_GEAR;
  host.appendChild(btn);
  const backdrop = document.createElement('div'); backdrop.className = 'sheet-backdrop';
  const sheet = document.createElement('div');
  sheet.className = 'sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('aria-label', 'Réglages'); sheet.hidden = true;
  const rows = [
    ['sound', 'Son', 'Un « tock » boisé qui monte d’une note à chaque mission placée.'],
    ['vibrate', 'Vibrations', 'Android uniquement : Safari iOS ne les prend pas en charge.'],
    ['iosHaptic', 'Haptique iOS, expérimental', 'Astuce iOS 18+ à tester sur votre iPhone, sans garantie.'],
    ['calm', 'Mouvement calme', 'Remplace les mouvements par des fondus courts.'],
    ['perf', 'Mesures de performance', 'Affiche les temps de frame mesurés en direct.'],
  ];
  sheet.innerHTML = `<div class="grabber"></div><h2>Réglages</h2>${rows.map(([k, t, d]) => `
    <div class="toggle-row"><p>${t}<small>${d}</small></p>
    <input class="switch" type="checkbox" role="switch" data-k="${k}" aria-label="${t}" ${prefs[k] ? 'checked' : ''}></div>`).join('')}
    <div style="margin-top:14px"><button class="btn btn-quiet btn-block" type="button" data-close>Fermer</button></div>`;
  document.body.append(backdrop, sheet);
  const y = new Value(1, 'ratio'), o = new Value(0, 'ratio');
  y.on((v) => { sheet.style.transform = `translateY(${v * 105}%)`; });
  o.on((v) => { backdrop.style.opacity = v; });
  const open = () => {
    sheet.hidden = false; backdrop.style.pointerEvents = 'auto';
    y.to(0, SPRING.sheet); o.tween(1, 180);
    sheet.querySelector('.switch').focus();
  };
  const close = () => {
    backdrop.style.pointerEvents = 'none';
    o.tween(0, 120); y.to(1, SPRING.sheet).then((ok) => { if (ok) sheet.hidden = true; });
    btn.focus();
  };
  btn.addEventListener('click', open);
  backdrop.addEventListener('click', close);
  sheet.querySelector('[data-close]').addEventListener('click', close);
  sheet.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  sheet.addEventListener('change', (e) => {
    const k = e.target.dataset.k; if (!k) return;
    prefs[k] = e.target.checked; store.set(k, prefs[k]);
    if (k === 'sound' && prefs.sound) unlockAudio();
    if (k === 'calm') applyCalm();
    onChange?.(k, prefs[k]);
  });
}

// Unlock audio on the first gesture anywhere.
addEventListener('pointerdown', unlockAudio, { once: true, capture: true });
