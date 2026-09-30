// Showreel: nút phát/tạm dừng. Video chỉ tải khi bấm phát; tự dừng khi cuộn ra khỏi màn hình.
import { $ } from './util.js';

export function initReel() {
  const video = $('[data-reel-video]');
  const btn = $('[data-reel-toggle]');
  if (!video || !btn) return;
  const root = video.closest('.reel');

  const setPlaying = (on) => {
    root.classList.toggle('is-playing', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? btn.dataset.labelPause : btn.dataset.labelPlay);
  };
  btn.addEventListener('click', async () => {
    if (!video.paused) { video.pause(); setPlaying(false); return; }
    try { await video.play(); setPlaying(true); } catch { setPlaying(false); }
  });
  new IntersectionObserver(([e]) => { if (!e.isIntersecting && !video.paused) { video.pause(); setPlaying(false); } }, { threshold: 0.1 }).observe(root);
}
