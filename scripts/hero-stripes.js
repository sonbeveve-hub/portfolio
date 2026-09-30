// Nền hero: sọc dọc xanh neon chuyển động, vẽ bằng WebGL thuần (một fragment shader, rất nhẹ).
// Vùng giữa được làm dịu để chữ luôn đủ tương phản. Mobile giảm tải; tạm dừng khi ẩn;
// bật reduced-motion thì chỉ vẽ một khung tĩnh.

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FRAG = `
precision mediump float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uStripe;
uniform vec3 uBase; uniform vec3 uMid; uniform vec3 uHi; uniform float uMask;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float aspect=uRes.x/uRes.y;
  float col=floor(gl_FragCoord.x/uStripe);
  float f=fract(gl_FragCoord.x/uStripe);
  float cx=(col+.5)*uStripe/uRes.x;
  float t=uTime*.09;
  float v=fbm(vec2(cx*aspect*1.5,uv.y*1.1)+vec2(t,-t*.7));
  float dm=cx-uMouse.x;
  float glow=exp(-dm*dm*14.)*exp(-pow(uv.y-uMouse.y,2.)*2.6);
  float I=smoothstep(.2,.78,v)+glow*.5;
  // làm dịu vùng giữa (nơi có chữ)
  float m=1.-uMask*smoothstep(.62,0.,length((uv-vec2(.5,.52))*vec2(1.,1.5)));
  I=clamp(I*m,0.,1.);
  float prof=smoothstep(0.,.22,f)*(1.-smoothstep(.78,1.,f));
  float shade=mix(.28,1.,prof);
  vec3 c=mix(mix(uBase,uMid,clamp(I*2.,0.,1.)),uHi,clamp(I*2.-1.,0.,1.));
  c=mix(uBase,c,shade);
  float line=smoothstep(.42,.5,f)*(1.-smoothstep(.5,.58,f));
  c+=uHi*.10*line*I;
  c+=(h(gl_FragCoord.xy+fract(uTime))-.5)*.05;
  gl_FragColor=vec4(c,1.);
}`;

const hexToRgb = (hex) => {
  const m = hex.trim().replace('#', '');
  const full = m.length === 3 ? [...m].map((x) => x + x).join('') : m;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((x) => x / 255);
};
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

export function initHeroStripes() {
  const host = document.querySelector('[data-hero-visual]');
  if (!host) return;

  // Mobile: bỏ WebGL, dùng nền CSS dự phòng (nhẹ, không chặn luồng chính).
  if (matchMedia('(max-width: 767px)').matches) return;
  // Desktop: hiệu ứng chỉ là trang trí nên không chen vào lúc tải trang. Bật khi người dùng bắt đầu
  // tương tác (rê chuột, cuộn, gõ phím) hoặc sau 6 giây; trước đó hero dùng nền CSS dự phòng.
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  const events = ['pointermove', 'pointerdown', 'wheel', 'keydown', 'scroll', 'touchstart'];
  let started = false;
  const go = () => {
    if (started) return;
    started = true;
    events.forEach((ev) => removeEventListener(ev, go));
    idle(() => setup(host), { timeout: 1500 });
  };
  events.forEach((ev) => addEventListener(ev, go, { passive: true }));
  setTimeout(go, 6000);
}

function setup(host) {
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

  const U = Object.fromEntries(['uRes', 'uTime', 'uMouse', 'uStripe', 'uBase', 'uMid', 'uHi', 'uMask'].map((k) => [k, gl.getUniformLocation(prog, k)]));

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const small = matchMedia('(max-width: 767px)');
  const root = document.documentElement;
  const mouse = { x: 0.3, y: 0.4, tx: 0.3, ty: 0.4 };
  let visible = true;
  let raf = 0;
  let last = 0;

  const applyTheme = () => {
    const css = getComputedStyle(root);
    const bg = hexToRgb(css.getPropertyValue('--bg'));
    const accent = hexToRgb(css.getPropertyValue('--accent'));
    const dark = root.dataset.theme !== 'light';
    if (dark) {
      gl.uniform3fv(U.uBase, mix(bg, accent, 0.05));
      gl.uniform3fv(U.uMid, accent.map((v) => v * 0.3));
      gl.uniform3fv(U.uHi, mix(accent, [1, 1, 1], 0.1));
      gl.uniform1f(U.uMask, 0.62);
    } else {
      gl.uniform3fv(U.uBase, bg);
      gl.uniform3fv(U.uMid, mix(bg, accent, 0.28));
      gl.uniform3fv(U.uHi, mix(bg, accent, 0.68));
      gl.uniform1f(U.uMask, 0.3);
    }
  };

  const resize = () => {
    // Render ở ~0.7 độ phân giải: nền là dải sáng mềm nên không mất chi tiết, mà nhẹ hơn nhiều.
    const dpr = Math.min(devicePixelRatio || 1, 1) * 0.7;
    const w = Math.max(1, Math.round(host.clientWidth * dpr));
    const hgt = Math.max(1, Math.round(host.clientHeight * dpr));
    canvas.width = w;
    canvas.height = hgt;
    gl.viewport(0, 0, w, hgt);
    gl.uniform2f(U.uRes, w, hgt);
    gl.uniform1f(U.uStripe, (small.matches ? 16 : 26) * dpr);
  };

  const draw = (time) => {
    gl.uniform1f(U.uTime, time);
    gl.uniform2f(U.uMouse, mouse.x, mouse.y);
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
  const still = () => draw(4);

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
