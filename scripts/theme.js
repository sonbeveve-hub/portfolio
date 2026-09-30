// Chuyển sáng/tối, ghi nhớ lựa chọn trong localStorage. Mặc định là tối.
const root = document.documentElement;

export function initTheme() {
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* bỏ qua khi bị chặn lưu trữ */ }
  });
}
