// Trang About: lọc các công cụ theo nhóm.
import { $, $$ } from './util.js';

export function initTools() {
  const bar = $('[data-tools-filter]');
  if (!bar) return;
  const tiles = $$('.tool');
  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    $$('[data-cat]', bar).forEach((b) => { const on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    const cat = btn.dataset.cat;
    tiles.forEach((t) => { t.hidden = cat !== '*' && t.dataset.cat !== cat; });
  });
}
