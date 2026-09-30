// Lời chứng thực xếp chồng: tự chuyển, dừng khi rê chuột/focus, có nút trước/sau.
import { $, $$, reducedMotion } from './util.js';

export function initTestimonials() {
  const deck = $('[data-deck]');
  if (!deck) return;
  const cards = $$('[data-tcard]', deck);
  const n = cards.length;
  if (n < 2) return;
  let active = 0;
  let timer = 0;
  let paused = false;
  let visible = false;

  const render = () => cards.forEach((c, i) => {
    const o = (i - active + n) % n;
    c.style.setProperty('--o', String(o));
    c.toggleAttribute('data-far', o > 3);
    c.setAttribute('aria-hidden', String(o !== 0));
  });
  const go = (i) => { active = (i + n) % n; render(); };
  const stop = () => { clearInterval(timer); timer = 0; };
  const start = () => { if (!timer && !paused && visible && !reducedMotion()) timer = setInterval(() => go(active + 1), 7000); };

  $('[data-tprev]')?.addEventListener('click', () => { go(active - 1); stop(); start(); });
  $('[data-tnext]')?.addEventListener('click', () => { go(active + 1); stop(); start(); });
  deck.addEventListener('click', () => { go(active + 1); stop(); start(); });
  const section = deck.closest('section');
  section.addEventListener('pointerenter', () => { paused = true; stop(); });
  section.addEventListener('pointerleave', () => { paused = false; start(); });
  section.addEventListener('focusin', () => { paused = true; stop(); });
  section.addEventListener('focusout', () => { paused = false; start(); });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(section);
  render();
}
