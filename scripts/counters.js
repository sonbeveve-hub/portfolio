// Số đếm chạy khi cuộn tới. Giá trị cuối đã có sẵn trong HTML nên không JS vẫn đúng.
const easeOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function initCounters() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  nums.forEach((el) => { el.textContent = '0'; });
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const el = e.target;
        const to = Number(el.dataset.count);
        const dur = 1600;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          el.textContent = String(Math.round(to * easeOut(p)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.6 },
  );
  nums.forEach((el) => io.observe(el));
}
