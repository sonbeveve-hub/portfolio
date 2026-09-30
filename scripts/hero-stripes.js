// Nền hero: sọc dọc màu accent chuyển động, vẽ bằng WebGL thuần (một fragment shader, rất nhẹ).
// Tự giảm tải trên mobile, dừng khi ra khỏi màn hình/tab ẩn, và chỉ vẽ 1 khung khi bật reduced-motion.

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FRAG = `
precision mediump float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uStripe;
uniform vec3 uBg; uniform vec3 uAccent; uniform float uStrength;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float aspect=uRes.x/uRes.y;
  float col=floor(gl_FragCoord.x/uStripe);
  float f=fract(gl_FragCoord.x/uStripe);
  float cx=(col+.5)*uStripe/uRes.x;
  float t=uTime*.1;
  float v=fbm(vec2(cx*aspect*1.6,uv.y*1.3)+vec2(t,-t*.8));
  float dm=cx-uMouse.x;
  float glow=exp(-dm*dm*16.)*exp(-pow(uv.y-uMouse.y,2.)*3.);
  float I=smoothstep(.28,.85,v)+glow*.45;
  float prof=smoothstep(0.,.2,f)*(1.-smoothstep(.8,1.,f));
  float shade=mix(.5,1.,prof);
  vec3 c=mix(uBg,uAccent,clamp(I,0.,1.)*uStrength*shade);
  c=mix(uBg,c,smoothstep(0.,.3,uv.y));
  gl_FragColor=vec4(c,1.);
}`;

const hexToRgb = (hex) => {
  const m = hex.trim().replace('#', '');
  const full = m.length === 3 ? [...m].map((x) => x + x).join('') : m;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((x) => x / 255);
};

export function initHeroStripes() {
  const host = document.querySelector('[data-hero-visual]');
  if (!host) return;

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return; // giữ nền CSS dự phòng

  const compile = (type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (name) => gl.getUniformLocation(prog, name);
  const U = { res: u('uRes'), time: u('uTime'), mouse: u('uMouse'), stripe: u('uStripe'), bg: u('uBg'), accent: u('uAccent'), strength: u('uStrength') };

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const small = matchMedia('(max-width: 767px)');
  const root = document.documentElement;
  const mouse = { x: 0.3, y: 0.4, tx: 0.3, ty: 0.4 };
  let visible = true;
  let raf = 0;
  let last = 0;

  const applyTheme = () => {
    const css = getComputedStyle(root);
    const dark = root.dataset.theme !== 'light';
    gl.uniform3fv(U.bg, hexToRgb(css.getPropertyValue('--bg')));
    gl.uniform3fv(U.accent, hexToRgb(css.getPropertyValue('--accent')));
    gl.uniform1f(U.strength, dark ? 0.7 : 0.5);
  };

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, small.matches ? 1 : 1.5);
    const w = Math.max(1, Math.round(host.clientWidth * dpr));
    const hgt = Math.max(1, Math.round(host.clientHeight * dpr));
    canvas.width = w;
    canvas.height = hgt;
    gl.viewport(0, 0, w, hgt);
    gl.uniform2f(U.res, w, hgt);
    gl.uniform1f(U.stripe, (small.matches ? 18 : 26) * dpr);
  };

  const draw = (time) => {
    gl.uniform1f(U.time, time);
    gl.uniform2f(U.mouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const frame = (ms) => {
    raf = 0;
    if (!visible || document.hidden || reduced.matches) return;
    raf = requestAnimationFrame(frame);
    if (small.matches && ms - last < 33) return; // mobile: tối đa ~30fps
    last = ms;
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    draw(ms / 1000);
  };
  const start = () => { if (!raf && visible && !document.hidden && !reduced.matches) raf = requestAnimationFrame(frame); };
  const still = () => { draw(4); };

  host.appendChild(canvas);
  applyTheme();
  resize();
  still();
  host.classList.add('is-ready');

  addEventListener('resize', () => { resize(); if (reduced.matches) still(); });
  new MutationObserver(() => { applyTheme(); still(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const r = host.getBoundingClientRect();
    mouse.tx = (e.clientX - r.left) / r.width;
    mouse.ty = 1 - (e.clientY - r.top) / r.height;
  }, { passive: true });
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; start(); }).observe(host);
  document.addEventListener('visibilitychange', start);
  reduced.addEventListener('change', () => (reduced.matches ? still() : start()));
  start();
}
