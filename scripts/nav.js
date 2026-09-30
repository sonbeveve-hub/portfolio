// Nav ở đáy: gọn lại khi cuộn, menu mobile.
import { $ } from './util.js';

export function initNav() {
  const nav = $('[data-nav]');
  if (!nav) return;
  const list = $('#nav-list');
  const toggle = $('[data-nav-toggle]');

  const onScroll = () => nav.classList.toggle('is-compact', scrollY > 60);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const setOpen = (open) => {
    list.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
  };
  toggle?.addEventListener('click', () => setOpen(!list.classList.contains('is-open')));
  list.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) setOpen(false); });
}
