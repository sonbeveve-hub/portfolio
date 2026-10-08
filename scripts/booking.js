// Đặt lịch: nút có data-booking (link lịch hẹn Google Calendar) mở hộp thoại chứa trang đặt lịch của Google.
// Google tự gửi email xác nhận + lời mời lịch cho người đặt và thêm sự kiện vào lịch của chủ site.
import { $, $$ } from './util.js';
import { lockScroll } from './smooth.js';

export function initBooking() {
  const dlg = $('[data-booking-dialog]');
  if (!dlg || typeof dlg.showModal !== 'function') return; // không có hộp thoại → link mở tab mới như thường
  const frame = $('iframe', dlg);
  let opener = null;
  $$('[data-booking]').forEach((a) =>
    a.addEventListener('click', (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      opener = a;
      if (!frame.getAttribute('src')) frame.setAttribute('src', frame.dataset.src); // chỉ tải trang Google khi mở lần đầu
      dlg.showModal();
      lockScroll(true);
    })
  );
  $('[data-close-booking]', dlg)?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { lockScroll(false); opener?.focus(); });
}
