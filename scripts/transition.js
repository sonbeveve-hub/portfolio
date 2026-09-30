// Preloader (lần đầu trong phiên) và chuyển trang: lớp phủ trượt lên, hiện tên, rồi mở ra ở trang mới.
import { $, reducedMotion } from './util.js';

const root = document.documentElement;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function ready() {
  root.classList.remove('is-loading', 'is-arriving');
  root.classList.add('is-ready');
}

async function runPreloader(pre) {
  const imgs = JSON.parse(pre.dataset.images || '[]');
  const img = $('[data-pre-img]', pre);
  const num = $('[data-pre-num]', pre);
  let loaded = document.readyState === 'complete';
  addEventListener('load', () => { loaded = true; }, { once: true });

  let i = 0;
  const swap = () => { if (img && imgs.length) img.src = imgs[i++ % imgs.length]; };
  swap();
  const timer = setInterval(swap, 380);

  const DURATION = 2200;
  const t0 = performance.now();
  await new Promise((resolve) => {
    const tick = (now) => {
      const p = Math.min((now - t0) / DURATION, 1);
      const pct = loaded ? p * 100 : Math.min(p * 100, 92); // chờ tải xong mới chạm 100
      num.textContent = String(Math.round(pct));
      if (pct >= 100) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  clearInterval(timer);
  pre.classList.add('is-name');
  await wait(1200);
  pre.classList.add('is-out');
  await wait(900);
  ready();
  pre.remove();
}

async function runArrival(pt) {
  await wait(350);
  pt.classList.add('is-active', 'is-out');
  root.classList.remove('is-arriving');
  root.classList.add('is-ready');
  await wait(1000);
  pt.classList.remove('is-active', 'is-out');
}

export function initTransitions() {
  const pre = $('[data-pre]');
  const pt = $('[data-pt]');
  if (reducedMotion() || !pt) { ready(); return; }

  if (root.classList.contains('is-loading') && pre) runPreloader(pre);
  else if (root.classList.contains('is-arriving')) runArrival(pt);
  else root.classList.add('is-ready');

  // Bấm link nội bộ: phủ màn hình rồi mới chuyển trang.
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // cùng trang: để cuộn mượt xử lý
    e.preventDefault();
    pt.classList.add('is-active');
    void pt.offsetWidth;
    pt.classList.add('is-in');
    setTimeout(() => {
      try { sessionStorage.setItem('pt', '1'); } catch { /* bỏ qua */ }
      location.href = url.href;
    }, 900);
  });

  // Quay lại bằng nút Back (trang lấy từ bộ nhớ đệm): gỡ lớp phủ.
  addEventListener('pageshow', (e) => {
    if (e.persisted) { pt.classList.remove('is-active', 'is-in', 'is-out'); ready(); }
  });
}
