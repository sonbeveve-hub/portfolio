// Chữ khổng lồ: các dòng trượt ngang ngược chiều nhau theo tiến độ cuộn.
import { $, $$, clamp, reducedMotion } from './util.js';

export function initBigText() {
  const sec = $('.bigtext');
  const rows = $$('[data-parallax]');
  if (!sec || !rows.length || reducedMotion()) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight;
    const r = sec.getBoundingClientRect();
    const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
    const range = Math.min(innerWidth * 0.3, 460);
    rows.forEach((row) => row.style.setProperty('--tx', `${(Number(row.dataset.parallax) * (p - 0.5) * range * 2).toFixed(1)}px`));
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
}
