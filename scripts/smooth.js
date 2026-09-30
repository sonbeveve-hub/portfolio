// Cuộn mượt bằng Lenis; tắt khi người dùng chọn giảm chuyển động.
import Lenis from 'lenis';
import { reducedMotion } from './util.js';

let lenis = null;

export function initSmoothScroll() {
  if (reducedMotion()) return;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = id === '#top' ? 0 : document.querySelector(id);
    if (target === null) return;
    e.preventDefault();
    lenis.scrollTo(target, { duration: 1.4 });
    history.replaceState(null, '', id);
  });
}

// Khoá/mở cuộn trang (dùng khi mở hộp thoại).
export const lockScroll = (lock) => { if (lenis) lock ? lenis.stop() : lenis.start(); };
