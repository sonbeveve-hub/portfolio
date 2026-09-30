// Khối nguyên tắc: bấm (hoặc Enter/Space) để mở một cột; rê chuột cũng mở bằng CSS.
import { $$ } from './util.js';

export function initAccordion() {
  const cols = $$('[data-acc]');
  if (!cols.length) return;
  cols.forEach((col) => col.addEventListener('click', () => {
    const open = !col.classList.contains('is-open');
    cols.forEach((c) => { c.classList.remove('is-open'); c.setAttribute('aria-expanded', 'false'); });
    if (open) { col.classList.add('is-open'); col.setAttribute('aria-expanded', 'true'); }
  }));
}
