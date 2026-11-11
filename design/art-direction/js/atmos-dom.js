// ROOMRESET T1.5 — Atmosphere engine B: Blender satin pebbles (ambient-lit sprites) + CSS light,
// blurred ONCE per depth with a static CSS filter, then moved with transforms only.
import { makeOrbs, blurOf, pose } from './atmos-scene.js';

const SPRITE = { '#B9CFBF': 'clothes', '#C3CFD9': 'books', '#E4DFD2': 'papers', '#DDBF9C': 'box', '#EBCB86': 'dishes', '#8DB89C': 'clothes', '#A9BFC9': 'books' };

export class DomAtmos {
  constructor(host) { this.host = host; this.orbs = makeOrbs(); this.theme = 'day'; }
  mount() {
    this.host.replaceChildren();
    this.host.classList.add('is-on');
    this.els = this.orbs.map((o) => {
      const el = document.createElement('div');
      el.className = 'aorb' + (o.light ? ' is-light' : '');
      if (o.light) el.style.setProperty('--glow', o.tint);
      else {
        const src = `assets/pebbles/pebble-${SPRITE[o.tint] || 'papers'}.webp`;
        el.style.setProperty('--sprite', `url(${src})`);
        const img = document.createElement('img'); img.alt = ''; img.src = src; img.decoding = 'async'; el.appendChild(img);
      }
      this.host.appendChild(el);
      return el;
    });
    this.resize();
  }
  resize() {
    this.W = innerWidth; this.H = innerHeight; const S = Math.min(this.W, this.H);
    this.sizes = this.orbs.map((o, i) => {
      const d = o.r * S * 2, b = blurOf(o), el = this.els[i];
      el.style.width = `${d}px`; el.style.height = `${d * (o.light ? 1 : 0.86)}px`;
      const dim = this.theme === 'evening' && !o.light ? ' brightness(0.56) saturate(0.9)' : '';
      el.style.filter = `blur(${(b * o.r * S * 0.42).toFixed(1)}px)${dim}`; // static: rasterised once
      el.style.opacity = (o.light ? 0.55 - 0.23 * b : 0.92 - 0.3 * b).toFixed(3);
      el.style.zIndex = String(Math.round(o.z * 100));
      return d;
    });
  }
  setTheme(name) { this.theme = name === 'evening' ? 'evening' : 'day'; this.resize(); }
  frame(t, par) {
    this.orbs.forEach((o, i) => {
      const p = pose(o, t, par), d = this.sizes[i], h = d * (o.light ? 1 : 0.86);
      this.els[i].style.transform = `translate3d(${(p.x * this.W - d / 2).toFixed(1)}px, ${(p.y * this.H - h / 2).toFixed(1)}px, 0) rotate(${p.rot.toFixed(3)}rad)`;
    });
  }
  destroy() { this.host.replaceChildren(); this.host.classList.remove('is-on'); }
}
