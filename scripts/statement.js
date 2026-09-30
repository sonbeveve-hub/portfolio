// Đoạn chữ lớn ở About: từng từ sáng dần theo tiến độ cuộn.
export function initStatement() {
  const el = document.querySelector('[data-statement]');
  if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const words = [...el.querySelectorAll('.word')];
  let ticking = false;

  const update = () => {
    ticking = false;
    const vh = innerHeight;
    const r = el.getBoundingClientRect();
    const p = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.3), 0), 1);
    const lit = p * (words.length + 4);
    words.forEach((w, i) => {
      const t = Math.min(Math.max(lit - i, 0), 1);
      w.style.opacity = String(0.18 + 0.82 * t);
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
}
