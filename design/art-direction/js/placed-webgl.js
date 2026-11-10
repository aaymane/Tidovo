// ROOMRESET T1.1 — WebGL engine for the "Placed" study (Three.js r187, loaded by import map).
// World units = CSS pixels: x right, y up (= -screen y), z toward the viewer. The plane z = 0
// is the screen plane, so DOM rects map 1:1. Renders only when something changes.
import * as THREE from 'three';
import { Value, SPRING, onRender, lerp, arrival } from './spring.js';
import { MISSIONS, GLYPHS, pebbleSize, flightPoint, liftCurve } from './missions.js';

const REST_ROT = [-9, 7, -5, 10, -7];
const WELL_DEPTH = 9;
const LIFT_HEIGHT = 64;

function cssColor(el, prop, fallback) {
  // Computed colors come back as rgb(...) or, with color-mix(), as color(srgb r g b).
  const v = getComputedStyle(el)[prop] || '';
  let m = v.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (m) return new THREE.Color().setRGB(+m[1], +m[2], +m[3], THREE.SRGBColorSpace);
  m = v.match(/rgba?\(([^)]+)\)/);
  if (!m) return new THREE.Color(fallback);
  const [r, g, b] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
}
function cssVar(name, fallback) {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
}
function glyphTexture(glyph, color) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'); x.translate(0, 128); x.scale(128 / 24, -128 / 24);
  x.strokeStyle = color; x.lineWidth = 1.75; x.lineCap = 'round'; x.lineJoin = 'round';
  for (const [, d] of GLYPHS[glyph].matchAll(/d="([^"]+)"/g)) x.stroke(new Path2D(d));
  const t = new THREE.CanvasTexture(c); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function roundedMask(w, h, r) {
  const s = 2, c = document.createElement('canvas'); c.width = Math.ceil(w * s); c.height = Math.ceil(h * s);
  const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = '#fff'; x.beginPath(); x.roundRect(0, 0, c.width, c.height, r * s); x.fill();
  const t = new THREE.CanvasTexture(c); t.flipY = false; return t;
}

export class GlEngine {
  constructor(canvas) { this.canvas = canvas; this.items = new Map(); this.dirty = true; this.trayDirty = true; }

  async mount(missions, ui) {
    const W = innerWidth, H = innerHeight;
    const r = (this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true, powerPreference: 'high-performance' }));
    r.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); r.setSize(W, H, false);
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFShadowMap;
    r.toneMapping = THREE.NeutralToneMapping; r.toneMappingExposure = 1.0;
    r.outputColorSpace = THREE.SRGBColorSpace; r.setClearColor(0x000000, 0);
    const scene = (this.scene = new THREE.Scene());
    const fov = 16, dist = H / 2 / Math.tan(THREE.MathUtils.degToRad(fov / 2));
    const cam = (this.camera = new THREE.PerspectiveCamera(fov, W / H, 10, dist * 2));
    cam.position.set(W / 2, -H / 2, dist); cam.lookAt(W / 2, -H / 2, 0);

    // One global light, same direction as the CSS shadows (--lx, --ly).
    const lx = cssVar('--lx', 0.55), ly = cssVar('--ly', 0.85), evening = document.documentElement.dataset.theme === 'evening';
    const sun = (this.sun = new THREE.DirectionalLight(evening ? 0xffc983 : 0xfff0d8, evening ? 2.1 : 2.6));
    sun.position.set(W / 2 - lx * 520, -H / 2 + ly * 520, 900);
    sun.target.position.set(W / 2, -H / 2, 0);
    sun.castShadow = true;
    const sc = sun.shadow.camera; sc.left = -W; sc.right = W; sc.top = H; sc.bottom = -H; sc.near = 10; sc.far = 3000;
    sun.shadow.mapSize.set(1024, 1024); sun.shadow.radius = 5; sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.8;
    scene.add(sun, sun.target);
    scene.add(new THREE.HemisphereLight(evening ? 0xc9d6cd : 0xffffff, evening ? 0x3a4a42 : 0xb7c2b9, evening ? 1.35 : 1.05));

    // Shadow catcher over the whole screen: pebble shadows fall on the DOM card underneath.
    const catcher = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, H * 2), new THREE.ShadowMaterial({ opacity: evening ? 0.34 : 0.24 }));
    catcher.position.set(W / 2, -H / 2, -0.6); catcher.receiveShadow = true; scene.add(catcher);

    this.buildTray(ui.tray, missions, ui.imprint);
    for (const [i, m] of missions.entries()) this.items.set(m.id, this.createPebble(m, i));
    this.off = onRender(() => this.frame());
    for (const it of this.items.values()) it.group.visible = true;
    r.compile(scene, cam); r.render(scene, cam);
    for (const it of this.items.values()) it.group.visible = false;
    this.dirty = true; this.frame();
  }

  // ---------------------------------------------------------------- tray (heightfield)
  buildTray(trayEl, missions, imprintPoint) {
    const rect = trayEl.getBoundingClientRect();
    const w = rect.width, h = rect.height, segX = Math.round(w / 3.2), segY = Math.round(h / 3.2);
    const geo = new THREE.PlaneGeometry(w, h, segX, segY);
    const color = cssColor(trayEl, 'backgroundColor', '#E2E8E0');
    if (document.documentElement.dataset.theme === 'evening') color.offsetHSL(0, 0, 0.06); // keep hollows readable at night
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.93, metalness: 0, alphaMap: roundedMask(w, h, 18), alphaTest: 0.5 });
    const mesh = (this.tray = new THREE.Mesh(geo, mat));
    mesh.position.set(rect.left + w / 2, -(rect.top + h / 2), 0);
    mesh.receiveShadow = true; mesh.castShadow = true;
    this.scene.add(mesh);
    this.trayRect = rect;
    this.base = Float32Array.from(geo.attributes.position.array);
    this.wells = missions.map((m, i) => {
      const p = imprintPoint(i), s = pebbleSize(m);
      return { x: p.x - (rect.left + w / 2), y: -(p.y - (rect.top + h / 2)), rx: (s / 2) * 1.06, ry: (s * 0.86 / 2) * 1.06, open: new Value(1, 'ratio') };
    });
    for (const well of this.wells) well.open.on(() => { this.trayDirty = true; this.dirty = true; });
    this.dent = { x: 0, y: 0, sigma: 28, amp: new Value(0) };
    this.dent.amp.on(() => { this.trayDirty = true; this.dirty = true; });
    // Engraved glyphs at the bottom of each well.
    this.glyphs = missions.map((m, i) => {
      const s = pebbleSize(m) * 0.4, g = new THREE.Mesh(new THREE.PlaneGeometry(s, s),
        new THREE.MeshBasicMaterial({ map: glyphTexture(m.glyph, document.documentElement.dataset.theme === 'evening' ? '#F1EADF' : '#15231E'), transparent: true, opacity: 0.32, depthWrite: false }));
      const wl = this.wells[i]; g.position.set(wl.x, wl.y, -WELL_DEPTH + 1.2); mesh.add(g); return g;
    });
    this.updateTray();
  }
  heightAt(x, y) {
    let z = 0;
    for (const wl of this.wells) {
      const o = wl.open.v; if (o <= 0.001) continue;
      const nx = Math.abs(x - wl.x) / wl.rx, ny = Math.abs(y - wl.y) / wl.ry;
      const s = Math.pow(Math.pow(nx, 2.6) + Math.pow(ny, 2.6), 1 / 2.6);
      const t = Math.min(1, Math.max(0, (s - 0.74) / (1.08 - 0.74)));
      z -= WELL_DEPTH * o * (1 - t * t * (3 - 2 * t));
    }
    const a = this.dent.amp.v;
    if (a) { const dx = x - this.dent.x, dy = y - this.dent.y; z += a * Math.exp(-(dx * dx + dy * dy) / (2 * this.dent.sigma ** 2)); }
    return z;
  }
  updateTray() {
    const pos = this.tray.geometry.attributes.position, b = this.base;
    for (let i = 0; i < pos.count; i++) pos.array[i * 3 + 2] = this.heightAt(b[i * 3], b[i * 3 + 1]);
    pos.needsUpdate = true; this.tray.geometry.computeVertexNormals();
    this.glyphs?.forEach((g, i) => { const o = this.wells[i].open.v; g.material.opacity = 0.32 * o; g.position.z = -WELL_DEPTH * o + 1.2; });
    this.trayDirty = false;
  }

  // ---------------------------------------------------------------- pebbles
  createPebble(m, i) {
    const s = pebbleSize(m), hh = s * 0.86, rz = hh * 0.32;
    const geo = new THREE.SphereGeometry(1, 56, 36), pos = geo.attributes.position, seed = i * 1.37 + 0.4;
    for (let k = 0; k < pos.count; k++) {
      const x = pos.getX(k), y = pos.getY(k), z = pos.getZ(k), th = Math.atan2(y, x);
      const wob = 1 + 0.035 * Math.sin(3 * th + seed) + 0.022 * Math.sin(5 * th + seed * 1.7);
      // Flatter underside, domed top: a river stone resting on a table.
      const zz = z < 0 ? z * 0.62 : z;
      pos.setXYZ(k, x * (s / 2) * wob, y * (hh / 2) * wob, zz * rz);
    }
    geo.computeVertexNormals();
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(m.tint), roughness: 0.42, metalness: 0,
      sheen: 0.45, sheenRoughness: 0.55, sheenColor: new THREE.Color('#ffffff'),
      clearcoat: 0.28, clearcoatRoughness: 0.38,
    });
    const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = true; mesh.receiveShadow = true;
    const glyph = new THREE.Mesh(new THREE.PlaneGeometry(s * 0.42, s * 0.42),
      new THREE.MeshBasicMaterial({ map: glyphTexture(m.glyph, '#15231E'), transparent: true, opacity: 0.5, depthWrite: false }));
    glyph.position.z = rz + 0.6;
    const group = new THREE.Group(); group.add(mesh, glyph); group.visible = false; this.scene.add(group);
    const it = {
      group, rz, x: new Value(-300), y: new Value(-300), z: new Value(rz), rot: new Value(REST_ROT[i % 5], 'deg'),
      lift: new Value(0, 'ratio'), squash: new Value(0, 'ratio'), scale: new Value(1, 'ratio'), inWell: -1,
    };
    for (const v of [it.x, it.y, it.z, it.rot, it.lift, it.squash, it.scale]) v.on(() => { this.dirty = true; });
    return it;
  }
  pose(it) {
    const L = it.lift.v, k = it.scale.v * (1 + 0.05 * L), q = it.squash.v;
    let dentZ = 0;
    if (it.inWell >= 0 && this.dent.amp.v) dentZ = this.dent.amp.v * 0.9;
    it.group.position.set(it.x.v, -it.y.v, it.z.v + LIFT_HEIGHT * L + dentZ);
    it.group.rotation.z = THREE.MathUtils.degToRad(-it.rot.v);
    it.group.scale.set(k * (1 + 0.05 * q), k * (1 + 0.05 * q), k * (1 - 0.14 * q));
  }
  item(m) { return this.items.get(m.id); }
  position(m) { const it = this.item(m); return { x: it.x.v, y: it.y.v }; }
  wellZ(it) { return it.rz - WELL_DEPTH * 0.82; }

  arrive(m, p) {
    const it = this.item(m); it.group.visible = true; it.inWell = -1;
    it.x.jump(p.x); it.y.jump(p.y + 14); it.z.jump(it.rz); it.scale.jump(1); it.lift.jump(0.7);
    it.y.to(p.y, SPRING.drop); return it.lift.to(0, SPRING.drop);
  }
  follow(m, p) { const it = this.item(m); it.x.jump(p.x); it.y.jump(p.y); }
  async fly(m, a, b, { onLand } = {}) {
    const it = this.item(m), i = MISSIONS.indexOf(m), t = new Value(0, 'ratio'), rot0 = it.rot.v, z0 = it.z.v, z1 = this.wellZ(it);
    const unsub = t.on((v) => {
      const p = flightPoint(a, b, v);
      it.x.jump(p.x); it.y.jump(p.y); it.lift.jump(liftCurve(v)); it.z.jump(lerp(z0, z1, v));
      it.rot.jump(lerp(rot0, 0, Math.min(1, v * 1.2)));
    });
    await arrival(t, 1, SPRING.flight);
    unsub(); it.x.jump(b.x); it.y.jump(b.y); it.lift.jump(0); it.rot.jump(0); it.z.jump(z1); it.inWell = i;
    onLand?.();
    it.squash.jump(1); it.squash.to(0, SPRING.snap);
  }
  impact(index) {
    const wl = this.wells[index]; this.dent.x = wl.x; this.dent.y = wl.y;
    this.dent.amp.jump(0); this.dent.amp.to(0, { visualDuration: 0.36, bounce: 0.35 }, { velocity: -170 });
  }
  unfill() { /* the pebble leaves the well in back() */ }
  async toLater(m, b) {
    const it = this.item(m); it.inWell = -1;
    it.scale.to(0.66, SPRING.settle); it.z.to(it.rz * 0.66, SPRING.settle);
    await Promise.all([it.x.to(b.x, SPRING.settle), it.y.to(b.y, SPRING.settle)]);
  }
  closeImprint(index, open = false) { this.wells[index].open.to(open ? 1 : 0, SPRING.settle); }
  async back(m, from, to) {
    const it = this.item(m), t = new Value(0, 'ratio'), z0 = it.z.v; it.inWell = -1;
    it.scale.to(1, SPRING.settle);
    const unsub = t.on((v) => { const p = flightPoint(from, to, v); it.x.jump(p.x); it.y.jump(p.y); it.lift.jump(liftCurve(v) * 0.8); it.z.jump(lerp(z0, it.rz, v)); });
    await t.to(1, SPRING.flight); unsub(); it.lift.jump(0);
  }
  hide(m) { const it = this.item(m); it.scale.to(0.85, SPRING.settle).then(() => { it.group.visible = false; this.dirty = true; }); }

  frame() {
    if (!this.dirty || !this.renderer) return;
    if (this.trayDirty) this.updateTray();
    for (const it of this.items.values()) this.pose(it);
    this.renderer.render(this.scene, this.camera);
    this.dirty = false;
  }
  async destroy() {
    this.off?.();
    this.scene?.traverse((o) => {
      o.geometry?.dispose();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const mt of mats) { mt.map?.dispose(); mt.alphaMap?.dispose(); mt.dispose(); }
    });
    this.renderer?.clear(); this.renderer?.dispose(); this.renderer = null; this.items.clear();
  }
}
