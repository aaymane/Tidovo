// ROOMRESET T1.5 — Atmosphere engine A: one full-screen fragment shader (raw WebGL 1, no library).
// Depth-of-field pebbles (superellipse SDF, pseudo-3D shading from the global light), emissive
// light orbs, a light pool, grain and vignette. Rendered at half resolution: the blur hides it.
import { makeOrbs, blurOf, pose, hexRgb } from './atmos-scene.js';

const N = 12;
const VS = 'attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }';
const FS = `precision mediump float;
uniform vec2 uRes; uniform float uTime; uniform vec3 uL;
uniform vec3 uTop; uniform vec3 uBot; uniform vec3 uPool; uniform float uShade;
uniform vec4 uO[${N}];
uniform vec4 uC[${N}];
uniform vec2 uR[${N}];
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  vec3 col = mix(uBot, uTop, uv.y);
  vec2 poolC = vec2(0.5 - uL.x * 0.45, 1.05);
  float pool = smoothstep(0.95, 0.0, length((uv - poolC) * vec2(1.0, 1.4)));
  col = mix(col, uPool, pool * 0.55);
  vec3 L = normalize(uL);
  for (int i = 0; i < ${N}; i++) {
    vec4 o = uO[i]; vec4 c = uC[i]; vec2 rr = uR[i];
    vec2 p = frag - o.xy;
    float cs = cos(rr.x), sn = sin(rr.x);
    p = vec2(cs * p.x - sn * p.y, sn * p.x + cs * p.y);
    vec2 q = abs(p) / vec2(o.z, o.z * 0.86);
    float th = atan(p.y, p.x + 1e-4);
    float wob = 1.0 + 0.04 * sin(3.0 * th + rr.y) + 0.025 * sin(5.0 * th + rr.y * 1.7);
    float d = pow(pow(q.x, 2.6) + pow(q.y, 2.6), 1.0 / 2.6) / wob;
    float b = o.w;
    float edge = mix(0.03, 0.6, b);
    float a = 1.0 - smoothstep(1.0 - edge, 1.0 + edge, d);
    if (a < 0.002) continue;
    vec3 oc;
    if (c.w > 0.5) {
      oc = c.rgb; a *= mix(0.55, 0.32, b);
    } else {
      float dd = min(d, 1.0);
      float h = sqrt(max(0.0, 1.0 - dd * dd));
      vec3 n = normalize(vec3(p / o.z * 0.85, h + 0.2));
      float lam = clamp(dot(n, L), 0.0, 1.0);
      float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 16.0);
      oc = c.rgb * uShade * (0.62 + 0.55 * lam) + spec * 0.3 * (1.0 - b);
      oc = mix(oc, col, b * 0.25);
      a *= mix(0.92, 0.62, b);
    }
    col = mix(col, oc, a);
  }
  col += (hash(frag + fract(uTime) * 100.0) - 0.5) * 0.022;
  float vig = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(1.0, 0.8)));
  col *= mix(0.9, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
}`;

const THEMES = {
  day: { top: '#EEF2EC', bot: '#DCE5DD', pool: '#FFE3A6', shade: 1.0 },
  evening: { top: '#16251F', bot: '#0B1411', pool: '#C98F33', shade: 0.55 },
};

export class GlAtmos {
  constructor(canvas) { this.canvas = canvas; this.orbs = makeOrbs(); this.theme = 'day'; }
  mount() {
    const gl = (this.gl = this.canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, powerPreference: 'low-power' }));
    if (!gl) throw new Error('WebGL indisponible');
    const sh = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = (this.prog = gl.createProgram());
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = Object.fromEntries(['uRes', 'uTime', 'uL', 'uTop', 'uBot', 'uPool', 'uShade', 'uO', 'uC', 'uR'].map((n) => [n, gl.getUniformLocation(prog, n + (['uO', 'uC', 'uR'].includes(n) ? '[0]' : ''))]));
    this.bufO = new Float32Array(N * 4); this.bufC = new Float32Array(N * 4); this.bufR = new Float32Array(N * 2);
    this.resize();
  }
  resize() {
    const scale = 0.5 * Math.min(devicePixelRatio || 1, 2);
    this.cssW = innerWidth; this.cssH = innerHeight;
    this.canvas.width = Math.max(2, Math.round(innerWidth * scale)); this.canvas.height = Math.max(2, Math.round(innerHeight * scale));
    this.scale = scale;
    this.gl?.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  setTheme(name) { this.theme = name === 'evening' ? 'evening' : 'day'; }
  frame(t, par, light) {
    const gl = this.gl; if (!gl) return;
    const W = this.canvas.width, H = this.canvas.height, S = Math.min(W, H), th = THEMES[this.theme];
    this.orbs.forEach((o, i) => {
      const p = pose(o, t, par);
      this.bufO.set([p.x * W, H - p.y * H, o.r * S, blurOf(o)], i * 4);
      const rgb = hexRgb(o.tint);
      this.bufC.set([...rgb, o.light ? 1 : 0], i * 4);
      this.bufR.set([p.rot, o.wob], i * 2);
    });
    gl.uniform2f(this.u.uRes, W, H); gl.uniform1f(this.u.uTime, t);
    gl.uniform3f(this.u.uL, -light.lx, light.ly, 0.9);
    gl.uniform3fv(this.u.uTop, hexRgb(th.top)); gl.uniform3fv(this.u.uBot, hexRgb(th.bot)); gl.uniform3fv(this.u.uPool, hexRgb(th.pool));
    gl.uniform1f(this.u.uShade, th.shade);
    gl.uniform4fv(this.u.uO, this.bufO); gl.uniform4fv(this.u.uC, this.bufC); gl.uniform2fv(this.u.uR, this.bufR);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  destroy() { this.gl?.getExtension('WEBGL_lose_context')?.loseContext(); this.gl = null; }
}
