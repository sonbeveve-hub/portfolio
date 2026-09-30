// TÍCH HỢP THẬT SAU: thay hàm này bằng lời gọi tới dịch vụ nhận form
// (vd. Formspree, Netlify Forms, Resend, hoặc API riêng). Trả về Promise;
// resolve khi gửi được, reject (throw) khi lỗi để giao diện hiện trạng thái lỗi.
export async function sendMessage(data) {
  // Ví dụ:
  // const res = await fetch('https://formspree.io/f/xxxx', {
  //   method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error('send failed');
  await new Promise((r) => setTimeout(r, 900));
  void data;
}
