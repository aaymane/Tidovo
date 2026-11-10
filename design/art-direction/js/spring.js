// ROOMRESET prototype motion core.
// Springs reproduce Motion's `visualDuration` + `bounce` mapping exactly
// (motion-dom 14.12.0, animation/generators/spring.mjs, verified 2026-11-10):
//   stiffness = (2π / (1.2 · visualDuration))², damping = 2 · ζ · √stiffness, ζ = max(1 − bounce, 0.05)
// One shared requestAnimationFrame loop that stops completely at rest (0 rAF when idle).

export const SPRING = {
  press:  { visualDuration: 0.18, bounce: 0.25 },
  lift:   { visualDuration: 0.16, bounce: 0 },
  drop:   { visualDuration: 0.35, bounce: 0.2 },
  flight: { visualDuration: 0.5,  bounce: 0 },
  snap:   { visualDuration: 0.3,  bounce: 0.18 },
  settle: { visualDuration: 0.45, bounce: 0.08 },
  morph:  { visualDuration: 0.52, bounce: 0.12 },
  sheet:  { visualDuration: 0.4,  bounce: 0.04 },
  reveal: { visualDuration: 0.8,  bounce: 0.15 },
};

export function physics({ visualDuration, bounce = 0 }) {
  const zeta = bounce < 0 ? 1 / Math.max(1 + bounce, 0.05) : Math.max(1 - bounce, 0.05);
  const root = (2 * Math.PI) / (visualDuration * 1.2);
  const stiffness = root * root;
  return { stiffness, damping: 2 * zeta * Math.sqrt(stiffness) };
}

// ------------------------------------------------------------------ calm mode
let calm = false;
export const setCalm = (v) => { calm = !!v; };
export const isCalm = () => calm;

// ------------------------------------------------------------------ frame loop
const active = new Set();
const renders = new Set();
export const frameHooks = new Set(); // (dtMs, activeCount) => void, used by perf.js
let raf = 0, last = 0, pending = 0;

function tick(now) {
  const dtMs = last ? now - last : 1000 / 60;
  last = now;
  for (const hook of frameHooks) hook(dtMs, active.size);
  const dt = Math.min(dtMs, 64) / 1000;
  for (const anim of [...active]) anim.step(dt);
  for (const render of renders) render();
  if (active.size || pending > 0) {
    pending = Math.max(0, pending - 1);
    raf = requestAnimationFrame(tick);
  } else {
    raf = 0; last = 0;
  }
}
function wake() { if (!raf) raf = requestAnimationFrame(tick); }
export function requestFrame() { pending = Math.max(pending, 1); wake(); }
export function onRender(fn) { renders.add(fn); return () => renders.delete(fn); }
export const rafRunning = () => raf !== 0;
export const activeCount = () => active.size;

// ------------------------------------------------------------------ values
const REST = { px: [0.5, 2], ratio: [0.002, 0.01], deg: [0.05, 0.5] };

export class Value {
  constructor(v, unit = 'px') {
    this.v = v; this.vel = 0; this.target = v; this.unit = unit;
    this.listeners = new Set(); this.anim = null; this.resolve = null;
  }
  get() { return this.v; }
  velocity() { return this.vel; }
  on(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emit() { for (const fn of this.listeners) fn(this.v); }
  jump(v, vel = 0) { this.stop(); this.v = v; this.target = v; this.vel = vel; this.emit(); requestFrame(); }
  stop() {
    if (this.anim) { active.delete(this.anim); this.anim = null; }
    if (this.resolve) { const r = this.resolve; this.resolve = null; r(false); }
  }
  done() {
    if (this.anim) { active.delete(this.anim); this.anim = null; }
    if (this.resolve) { const r = this.resolve; this.resolve = null; r(true); }
  }
  // Spring to target. Inherits current velocity (Motion behaviour) unless one is given.
  to(target, cfg = SPRING.settle, { velocity } = {}) {
    this.stop();
    this.target = target;
    if (velocity !== undefined) this.vel = velocity;
    if (calm) { this.v = target; this.vel = 0; this.emit(); requestFrame(); return Promise.resolve(true); }
    const { stiffness: k, damping: c } = physics(cfg);
    const [restDelta, restSpeed] = REST[this.unit] || REST.px;
    const self = this;
    this.anim = {
      step(dt) {
        const sub = Math.max(1, Math.ceil(dt * 240)), h = dt / sub;
        for (let i = 0; i < sub; i++) {
          const a = -k * (self.v - self.target) - c * self.vel;
          self.vel += a * h; self.v += self.vel * h;
        }
        if (Math.abs(self.vel) < restSpeed && Math.abs(self.v - self.target) < restDelta) {
          self.v = self.target; self.vel = 0; self.emit(); self.done();
        } else self.emit();
      },
    };
    active.add(this.anim); wake();
    return new Promise((res) => { this.resolve = res; });
  }
  // Friction glide (Motion-style inertia): target = v0 + power·velocity, exponential approach.
  glide({ velocity = this.vel, power = 0.2, timeConstant = 200, min = -Infinity, max = Infinity } = {}) {
    this.stop();
    const origin = this.v;
    const ideal = origin + power * velocity;
    const target = Math.min(max, Math.max(min, ideal));
    const amplitude = target - origin;
    if (calm || Math.abs(amplitude) < 0.5) { this.jump(target); return Promise.resolve(true); }
    let t = 0;
    const self = this;
    this.target = target;
    this.anim = {
      step(dt) {
        t += dt * 1000;
        const e = Math.exp(-t / timeConstant);
        const prev = self.v;
        self.v = target - amplitude * e;
        self.vel = dt > 0 ? (self.v - prev) / dt : 0;
        if (Math.abs(target - self.v) < 0.5) { self.v = target; self.vel = 0; self.emit(); self.done(); }
        else self.emit();
      },
    };
    active.add(this.anim); wake();
    return new Promise((res) => { this.resolve = res; });
  }
  // Time-based tween (opacity, light), cubic-bezier easing.
  tween(target, duration = 180, ease = EASE.out) {
    this.stop();
    if (calm || duration <= 0) { this.jump(target); return Promise.resolve(true); }
    const from = this.v; let t = 0;
    const self = this;
    this.target = target;
    this.anim = {
      step(dt) {
        t = Math.min(1, t + (dt * 1000) / duration);
        self.v = from + (target - from) * ease(t);
        self.emit();
        if (t >= 1) { self.vel = 0; self.done(); }
      },
    };
    active.add(this.anim); wake();
    return new Promise((res) => { this.resolve = res; });
  }
}

// ------------------------------------------------------------------ easing
export function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const err = sx(t) - x; if (Math.abs(err) < 1e-5) break;
      const d = dx(t); if (Math.abs(d) < 1e-6) break; t -= err / d;
    }
    return sy(Math.min(1, Math.max(0, t)));
  };
}
export const EASE = {
  out: cubicBezier(0.22, 1, 0.36, 1),
  in: cubicBezier(0.4, 0, 1, 1),
  inOut: cubicBezier(0.65, 0, 0.35, 1),
  linear: (t) => t,
};

// ------------------------------------------------------------------ pointer velocity
export class VelocityTracker {
  constructor() { this.s = []; }
  reset() { this.s = []; }
  add(x, y, t = performance.now()) {
    this.s.push({ x, y, t });
    while (this.s.length > 2 && t - this.s[0].t > 100) this.s.shift();
  }
  get() {
    const s = this.s; if (s.length < 2) return { x: 0, y: 0 };
    const a = s[0], b = s[s.length - 1], dt = (b.t - a.t) / 1000;
    return dt > 0 ? { x: (b.x - a.x) / dt, y: (b.y - a.y) / dt } : { x: 0, y: 0 };
  }
}

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const mix01 = (a, b, v) => clamp((v - a) / (b - a), 0, 1);

// Resolve when the motion is visually there (99.5 %), not when the spring is fully at rest:
// impact feedback must coincide with the visible arrival.
export function arrival(v, target, cfg, threshold = 0.005) {
  return new Promise((resolve) => {
    let fired = false;
    const off = v.on((x) => { if (!fired && Math.abs(target - x) <= threshold) { fired = true; off(); v.stop(); resolve(true); } });
    v.to(target, cfg).then(() => { if (!fired) { fired = true; off(); resolve(true); } });
  });
}
