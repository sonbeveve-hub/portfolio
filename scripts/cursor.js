// Con trỏ tuỳ chỉnh: vòng tròn accent đi theo chuột có độ trễ; phóng to khi rê lên link/nút/thẻ dự án.
import { finePointer, reducedMotion } from './util.js';

const HOVER = 'a, button, input, textarea, label, summary, [data-cursor], .proj, .tcard';

export function initCursor() {
  if (!finePointer()) return;
  const el = document.createElement('div');
  el.className = 'cursor';
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);

  const ease = reducedMotion() ? 1 : 0.18;
  let x = -100, y = -100, tx = -100, ty = -100, on = false;
  const tick = () => {
    x += (tx - x) * ease;
    y += (ty - y) * ease;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    tx = e.clientX; ty = e.clientY;
    if (!on) { on = true; x = tx; y = ty; el.classList.add('is-on'); }
    const lab = e.target.closest?.('[data-cursor-label]');
    el.classList.toggle('is-label', !!lab);
    el.textContent = lab ? lab.dataset.cursorLabel : '';
    el.classList.toggle('is-hover', !lab && !!e.target.closest?.(HOVER));
  }, { passive: true });
  document.addEventListener('pointerleave', () => { on = false; el.classList.remove('is-on'); });
}
