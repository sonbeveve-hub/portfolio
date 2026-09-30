// Ảnh chân dung ở About: lớp chấm điểm (vẽ lại từng ô bằng canvas cho nét) phủ lên ảnh; quanh con trỏ hiện ảnh sạch
// (vùng tròn mờ viền đi theo chuột, có độ trễ). Không có JS/canvas thì vẫn thấy ảnh chấm điểm tĩnh.
import { $, finePointer, reducedMotion } from './util.js';

const COLS = 146; // số ô theo chiều ngang của ảnh chấm điểm (khớp lúc tạo ảnh)
const CELL_SRC = 6; // mỗi ô là 6px trong ảnh nguồn

const load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

export async function initPortrait() {
  const box = $('[data-aportrait]');
  if (!box) return;
  const canvas = $('canvas', box);
  const ctx = canvas.getContext('2d');
  let dither, clean;
  try { [dither, clean] = await Promise.all([load(box.dataset.dither), load(box.dataset.clean)]); } catch { return; }

  // Đọc mức xám của từng ô từ ảnh chấm điểm nguồn
  const rows = Math.round(dither.height / CELL_SRC);
  const probe = document.createElement('canvas');
  probe.width = dither.width; probe.height = dither.height;
  const pctx = probe.getContext('2d', { willReadFrequently: true });
  pctx.drawImage(dither, 0, 0);
  const src = pctx.getImageData(0, 0, probe.width, probe.height).data;
  const cells = new Uint8Array(COLS * rows); // 0 = trống, còn lại = độ sáng
  for (let y = 0; y < rows; y++) for (let x = 0; x < COLS; x++) {
    const i = ((y * CELL_SRC + 2) * probe.width + (x * CELL_SRC + 2)) * 4;
    cells[y * COLS + x] = src[i + 3] > 128 ? src[i] : 0;
  }

  const animated = finePointer() && !reducedMotion();
  const layer = document.createElement('canvas'); // lớp chấm điểm đã vẽ sẵn
  const spot = document.createElement('canvas'); // lớp tạm: ảnh sạch cắt theo vùng soi
  const lctx = layer.getContext('2d');
  const sctx = spot.getContext('2d');
  let W = 0, H = 0, dpr = 1, R = 0;
  const p = { x: 0, y: 0, tx: 0, ty: 0, a: 0, ta: 0 };
  let raf = 0, visible = true;

  const paintDots = () => {
    lctx.clearRect(0, 0, W, H);
    const pitch = W / COLS;
    const gap = Math.max(1, Math.round(dpr));
    for (let y = 0; y < rows; y++) for (let x = 0; x < COLS; x++) {
      const v = cells[y * COLS + x];
      if (!v) continue;
      const x0 = Math.round(x * pitch), y0 = Math.round(y * pitch);
      const x1 = Math.round((x + 1) * pitch) - gap, y1 = Math.round((y + 1) * pitch) - gap;
      lctx.fillStyle = `rgb(${v},${v},${v})`;
      lctx.fillRect(x0, y0, Math.max(1, x1 - x0), Math.max(1, y1 - y0));
    }
  };

  const draw = () => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(layer, 0, 0);
    if (p.a < 0.01) return;
    const x = p.x * dpr, y = p.y * dpr;
    const grad = (c) => { const g = c.createRadialGradient(x, y, R * 0.3, x, y, R); g.addColorStop(0, `rgba(0,0,0,${p.a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); return g; };
    ctx.globalCompositeOperation = 'destination-out'; // bớt chấm quanh con trỏ
    ctx.fillStyle = grad(ctx); ctx.fillRect(0, 0, W, H);
    sctx.globalCompositeOperation = 'source-over'; // ảnh sạch, cắt theo cùng vùng
    sctx.clearRect(0, 0, W, H);
    sctx.drawImage(clean, 0, 0, W, H);
    sctx.globalCompositeOperation = 'destination-in';
    sctx.fillStyle = grad(sctx); sctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(spot, 0, 0);
  };

  const resize = () => {
    const r = box.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = Math.round(r.width * dpr); H = Math.round(r.height * dpr);
    canvas.width = layer.width = spot.width = W;
    canvas.height = layer.height = spot.height = H;
    R = Math.max(90, r.width * 0.32) * dpr;
    paintDots();
    draw();
  };

  const tick = () => {
    raf = 0;
    p.x += (p.tx - p.x) * 0.16; p.y += (p.ty - p.y) * 0.16; p.a += (p.ta - p.a) * 0.14;
    draw();
    if (Math.abs(p.tx - p.x) > 0.3 || Math.abs(p.ty - p.y) > 0.3 || Math.abs(p.ta - p.a) > 0.01) start();
  };
  const start = () => { if (!raf && visible) raf = requestAnimationFrame(tick); };

  if (animated) {
    // Nghe chuột trên cả trang: khối chữ ở hero nằm đè lên ảnh nên ảnh không tự nhận được sự kiện.
    addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = box.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const inside = x > -40 && x < r.width + 40 && y > -40 && y < r.height + 40;
      if (inside) {
        if (p.ta === 0) { p.x = x; p.y = y; }
        p.tx = x; p.ty = y; p.ta = 1;
      } else p.ta = 0;
      start();
    }, { passive: true });
    document.addEventListener('pointerleave', () => { p.ta = 0; start(); });
  }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(box);
  addEventListener('resize', resize);

  resize();
  box.classList.add('is-ready');
}
