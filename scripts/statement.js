// Câu lớn ở About: từng từ sáng dần theo tiến độ cuộn; thước kẻ bên phải chạy theo.
import { $, $$, clamp, reducedMotion } from './util.js';

export function initStatement() {
  const el = $('[data-statement]');
  if (!el || reducedMotion()) return;
  const words = $$('.word', el);
  const ruler = $('[data-ruler]');
  const wrap = el.parentElement;
  let ticking = false;

  const update = () => {
    ticking = false;
    const vh = innerHeight;
    const r = el.getBoundingClientRect();
    const p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.28), 0, 1);
    const lit = p * (words.length + 5);
    words.forEach((w, i) => { w.style.setProperty('--lit', clamp(lit - i, 0, 1).toFixed(2)); });
    if (ruler) {
      const wr = wrap.getBoundingClientRect();
      ruler.style.setProperty('--p', String(clamp((vh * 0.5 - wr.top) / wr.height, 0, 1)));
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
}
