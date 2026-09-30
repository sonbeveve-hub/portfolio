// Nút CTA hút nhẹ về phía con trỏ.
import { $$, finePointer, reducedMotion } from './util.js';

export function initMagnetic() {
  if (!finePointer() || reducedMotion()) return;
  $$('[data-magnetic]').forEach((el) => {
    if (el.closest('.nav')) return;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.transform = `translate(${(dx * 14).toFixed(1)}px, ${(dy * 12).toFixed(1)}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}
