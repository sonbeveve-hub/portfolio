// Ảnh dự án: dịch nhẹ theo cuộn (parallax) bên trong khung.
import { $$, clamp, reducedMotion } from './util.js';

export function initWork() {
  const imgs = $$('.ph img');
  if (!imgs.length || reducedMotion() || !('IntersectionObserver' in window)) return;
  const visible = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    onScroll();
  }, { rootMargin: '10% 0px' });
  imgs.forEach((i) => io.observe(i.parentElement));

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight;
    visible.forEach((box) => {
      const r = box.getBoundingClientRect();
      const off = (r.top + r.height / 2 - vh / 2) / vh;
      box.firstElementChild.style.setProperty('--py', `${clamp(-off * 7, -5, 5).toFixed(2)}%`);
    });
  };
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
}
