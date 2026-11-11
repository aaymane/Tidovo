// ROOMRESET T1.5 — "Atmosphère vivante": one shared scene for every engine.
// Out-of-focus pebbles and light orbs at several depths (cinema depth of field), slow drift,
// parallax from finger / tilt. Positions are fractions of the screen; radius is a fraction of
// the short side. z: 0 = far, 1 = near; the focus plane sits at FOCUS.

export const FOCUS = 0.5;

// Deterministic (same scene on every engine and every load).
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

const DAY = ['#B9CFBF', '#C3CFD9', '#E4DFD2', '#DDBF9C', '#EBCB86', '#8DB89C', '#A9BFC9'];
const LIGHT = '#FFD98A';

export function makeOrbs() {
  seed = 7;
  const orbs = [];
  const add = (n, zMin, zMax, rMin, rMax, kindLight = 0) => {
    for (let i = 0; i < n; i++) {
      const z = zMin + (zMax - zMin) * rnd();
      orbs.push({
        x: 0.08 + 0.84 * rnd(), y: 0.06 + 0.88 * rnd(),
        r: rMin + (rMax - rMin) * rnd(), z,
        tint: i < kindLight ? LIGHT : DAY[Math.floor(rnd() * DAY.length)],
        light: i < kindLight,
        rot: rnd() * Math.PI * 2, wob: rnd() * 6.28,
        ax: 0.012 + 0.03 * rnd(), ay: 0.012 + 0.03 * rnd(),
        px: 18 + 22 * rnd(), py: 22 + 24 * rnd(), ph: rnd() * 6.28, spin: (rnd() - 0.5) * 0.06,
      });
    }
  };
  add(4, 0.05, 0.25, 0.05, 0.08, 1);   // far: small, soft
  add(5, 0.42, 0.6, 0.07, 0.11, 1);    // mid: almost in focus
  add(3, 0.85, 1.0, 0.2, 0.3, 0);      // near: huge, very blurred, at the edges
  // Push the near ones toward the edges so they frame the content instead of covering it.
  orbs.filter((o) => o.z > 0.8).forEach((o, k) => { o.x = [0.02, 0.98, 0.1][k]; o.y = [0.16, 0.58, 0.97][k]; });
  return orbs.sort((a, b) => a.z - b.z); // back to front
}

// Blur amount (0..1) from distance to the focus plane.
export const blurOf = (o) => Math.min(1, 0.12 + Math.abs(o.z - FOCUS) * 1.6);

// Animated pose for time t (s) and parallax p (-1..1). Near objects move more.
export function pose(o, t, par) {
  const depth = 0.25 + o.z * 1.1;
  return {
    x: o.x + o.ax * Math.sin((2 * Math.PI * t) / o.px + o.ph) - par.x * 0.035 * depth,
    y: o.y + o.ay * Math.cos((2 * Math.PI * t) / o.py + o.ph * 1.3) - par.y * 0.03 * depth,
    rot: o.rot + o.spin * t,
  };
}

export function hexRgb(h) {
  const n = h.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
}
