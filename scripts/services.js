// Dòng dịch vụ gần giữa màn hình sẽ sáng lên (bổ sung cho hover).
import { $$ } from './util.js';

export function initServices() {
  const rows = $$('[data-srow]');
  if (!rows.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle('is-active', e.isIntersecting)),
    { rootMargin: '-42% 0px -42% 0px' },
  );
  rows.forEach((r) => io.observe(r));
}
