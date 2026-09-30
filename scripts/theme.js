// Chuyển sáng/tối, ghi nhớ lựa chọn trong localStorage.
const root = document.documentElement;

const save = (theme) => {
  try { localStorage.setItem('theme', theme); } catch { /* bỏ qua khi bị chặn lưu trữ */ }
};

export function initTheme() {
  const btn = document.querySelector('[data-theme-toggle]');
  const meta = document.querySelector('meta[name="theme-color"]');
  btn?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    save(next);
  });
  // Nếu người dùng chưa chọn tay thì theo hệ điều hành.
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch { /* ignore */ }
    if (!saved) root.dataset.theme = e.matches ? 'light' : 'dark';
  });
  void meta;
}
