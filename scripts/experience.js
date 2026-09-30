// Trang About: kinh nghiệm làm việc — lọc theo loại, mở/đóng hàng, liên kết thanh biểu đồ với hàng danh sách.
import { $, $$ } from './util.js';

export function initExperience() {
  const root = $('[data-exp]');
  if (!root) return;
  const rows = $$('.xrow', root);
  const bars = $$('.xbar', root);
  const chips = $$('[data-xcat]', root);
  const byId = (id) => rows.find((r) => r.dataset.x === id);
  const mark = (id, on) => {
    bars.forEach((b) => b.classList.toggle('is-hl', on && b.dataset.x === id));
    rows.forEach((r) => r.classList.toggle('is-hl', on && r.dataset.x === id));
  };
  const toggle = (row, open = !row.classList.contains('is-open')) => {
    row.classList.toggle('is-open', open);
    $('.xrow__head', row).setAttribute('aria-expanded', String(open));
  };

  chips.forEach((chip) => chip.addEventListener('click', () => {
    const cat = chip.dataset.xcat;
    chips.forEach((c) => { const on = c === chip; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', String(on)); });
    rows.forEach((r) => { r.hidden = cat !== '*' && r.dataset.type !== cat; });
    bars.forEach((b) => { const r = byId(b.dataset.x); b.classList.toggle('is-dim', r.hidden); });
  }));

  rows.forEach((row) => {
    $('.xrow__head', row).addEventListener('click', () => toggle(row));
    row.addEventListener('pointerenter', () => mark(row.dataset.x, true));
    row.addEventListener('pointerleave', () => mark(row.dataset.x, false));
    row.addEventListener('focusin', () => mark(row.dataset.x, true));
    row.addEventListener('focusout', () => mark(row.dataset.x, false));
  });
  bars.forEach((bar) => {
    const id = bar.dataset.x;
    bar.addEventListener('pointerenter', () => mark(id, true));
    bar.addEventListener('pointerleave', () => mark(id, false));
    bar.addEventListener('focus', () => mark(id, true));
    bar.addEventListener('blur', () => mark(id, false));
    bar.addEventListener('click', () => {
      const row = byId(id);
      if (row.hidden) return;
      rows.forEach((r) => r !== row && toggle(r, false));
      toggle(row, true);
      row.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    });
  });
}
