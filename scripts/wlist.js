// Trang Work: ảnh xem trước đi theo con trỏ khi rê lên từng dự án.
import { $, $$, finePointer, reducedMotion } from './util.js';

export function initWorkPreview() {
  const img = $('[data-wprev]');
  const rows = $$('.wrow[data-preview]');
  if (!img || !rows.length || !finePointer()) return;
  const ease = reducedMotion() ? 1 : 0.14;
  let x = 0, y = 0, tx = 0, ty = 0, on = false;
  const tick = () => {
    x += (tx - x) * ease; y += (ty - y) * ease;
    img.style.transform = `translate3d(${x + 28}px, ${y - 90}px, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; if (!on) { x = tx; y = ty; } }, { passive: true });
  rows.forEach((r) => {
    r.addEventListener('pointerenter', () => { img.src = r.dataset.preview; img.classList.add('is-on'); on = true; });
    r.addEventListener('pointerleave', () => { img.classList.remove('is-on'); on = false; });
  });
}
