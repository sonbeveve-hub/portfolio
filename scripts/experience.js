// Trang About: kinh nghiệm làm việc — bấm để mở/đóng chi tiết từng hàng.
import { $, $$ } from './util.js';

export function initExperience() {
  const root = $('[data-exp]');
  if (!root) return;
  $$('.xrow', root).forEach((row) => {
    const head = $('.xrow__head', row);
    head.addEventListener('click', () => {
      const open = !row.classList.contains('is-open');
      row.classList.toggle('is-open', open);
      head.setAttribute('aria-expanded', String(open));
    });
  });
}
