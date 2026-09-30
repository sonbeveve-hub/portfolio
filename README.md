# Portfolio cá nhân (một trang)

Website portfolio một trang, dựng bằng **Vite + HTML/CSS/JS thuần** (không framework).
Bố cục, nhịp điệu và hiệu ứng lấy cảm hứng từ một trang portfolio tham khảo; toàn bộ chữ, ảnh, logo là **placeholder của bạn** — thay bằng nội dung thật.

**Vì sao chọn stack này:** xuất ra file tĩnh (deploy Vercel/Netlify/GitHub Pages đều được), JS chỉ ~10KB nén, dễ đạt Lighthouse ≥ 90.

## Chạy dự án

```bash
npm install
npm run dev       # chạy thử, tự tải lại khi sửa content.json
npm run build     # xuất bản tĩnh vào thư mục dist/
npm run preview   # xem bản build
```

Cần Node 18+.

## Cấu trúc thư mục

```
content.json          ← TOÀN BỘ nội dung chữ, link, đường dẫn ảnh (sửa file này là chính)
index.html            ← khung trang (ít khi phải sửa)
scripts/
  render.js           ← dựng HTML từ content.json lúc build
  main.js             ← điểm vào, khởi tạo các hiệu ứng
  hero-stripes.js     ← nền sọc động ở hero (WebGL)
  contact-api.js      ← NƠI GẮN FORM THẬT (đang là hàm giả lập)
  …                   ← mỗi hiệu ứng một file nhỏ (nav, reveal, cursor, form…)
styles/
  tokens.css          ← design tokens: màu, cỡ chữ, spacing, radius, font
  base.css nav.css hero.css sections.css footer.css
public/
  assets/images/      ← ảnh (dự án, chân dung, poster, og.png)
  assets/logos/       ← logo đối tác
  assets/video/reel.webm ← video showreel
  favicon.svg
```

## Cách thay nội dung

Mọi thứ nằm trong `content.json`, theo từng khối:

| Khối | Là gì |
| --- | --- |
| `site` | Title, description, ảnh chia sẻ (Open Graph), **`url` thật của bạn** (dùng cho sitemap/canonical) |
| `brand`, `nav`, `cta` | Logo chữ, menu, nút CTA chính (link Calendly/Zalo/form) |
| `hero` | 3 dòng headline (`style`: `sans` hoặc `serif`), 2 dòng mô tả nhỏ |
| `about.statement` | Câu lớn sáng dần khi cuộn. Ký hiệu: `*chữ serif nghiêng*`, `__gạch chân__`, `[[gem]]` `[[clover]]` `[[burst]]` hình nhỏ chèn giữa câu |
| `about.portrait` | Ảnh chân dung (hiện trong công tắc ở phần CTA) |
| `reel` | Video showreel + poster |
| `stats` | 3 số nổi bật (đếm chạy khi cuộn tới) |
| `services` | 3–6 dịch vụ, mỗi mục có `icon`: `layout`, `compass`, `layers`, `calendar`, `message`, `spark` |
| `work.items` | Dự án: `title`, `industry`, `image` (ảnh lớn), `image2` (ảnh phụ, có thể bỏ), `href` (để trống = "Sắp ra mắt") |
| `worksCta`, `testimonials`, `quote`, `partners` | Các khối còn lại |
| `contact`, `footer` | Email, mạng xã hội, form, link pháp lý |

Trong chuỗi, `*từ*` sẽ thành chữ serif nghiêng ở các tiêu đề.

### Đổi màu, chữ, khoảng cách
Sửa `styles/tokens.css`. Màu nhấn duy nhất là `--accent` (đang là xanh neon `#6fff54`); nếu bạn muốn `#22C55E` thì đổi đúng một dòng đó (và `--accent-text` cho theme sáng nếu cần).

### Ảnh
- Ảnh hiện tại là placeholder SVG. Thay bằng ảnh **WebP/AVIF** (tỉ lệ ảnh lớn ≈ 12:7, ảnh phụ dọc ≈ 0.7:1) rồi sửa đường dẫn trong `content.json`.
- Ảnh đã bật `loading="lazy"`. Nhớ điền `alt` (`work.items[].alt`).
- Logo đối tác: bỏ file vào `public/assets/logos/` rồi điền `logo` trong `partners.items`. Để trống thì hiện tên.

### Video showreel
Thay `public/assets/video/reel.webm` (nên ≤ 5MB, muted, lặp). Ảnh `poster` hiện khi video chưa phát. Video chỉ tải khi người xem bấm phát.

### Form liên hệ
Giao diện và trạng thái (đang gửi / thành công / lỗi) đã có. Để gắn thật, mở `scripts/contact-api.js` và thay hàm `sendMessage` bằng lời gọi tới Formspree, Netlify Forms, Resend hoặc API riêng.

## Hiệu ứng và truy cập

- Hero WebGL (desktop): bật khi người dùng bắt đầu rê chuột/cuộn/gõ phím (hoặc sau 6 giây) để không chen vào lúc tải trang; dừng khi ra khỏi màn hình hoặc tab ẩn. Mobile và trình duyệt không có WebGL dùng nền CSS có ánh sáng trôi nhẹ (không cần JS nặng).
- Cuộn mượt (Lenis), con trỏ tuỳ chỉnh (chỉ khi có chuột), nút hút nhẹ, hiện dần khi cuộn.
- `prefers-reduced-motion`: tắt cuộn mượt, marquee, hiện dần, đếm số; hero chỉ vẽ một khung tĩnh.
- Bàn phím: có link "Bỏ qua tới nội dung chính", focus rõ, hộp thoại form đóng bằng `Esc`.
- Theme sáng/tối: mặc định tối, nhớ lựa chọn của người dùng.

## Deploy

Thư mục xuất bản là `dist/` (lệnh `npm run build`).

**Vercel / Netlify** — kết nối repo, chọn:
- Build command: `npm run build`
- Output directory: `dist`

**GitHub Pages** — nếu site nằm ở `https://<user>.github.io/<repo>/` (không phải tên miền riêng), thêm `base: '/<repo>/'` vào `vite.config.js` và đổi các đường dẫn `/assets/...` trong `content.json` cho khớp. Với tên miền riêng hoặc `<user>.github.io` thì giữ nguyên. Dùng GitHub Actions (`actions/deploy-pages`) để đẩy thư mục `dist/`.

Sau khi deploy, nhớ sửa `site.url` trong `content.json` để sitemap và canonical đúng.

## Danh sách cần thay trước khi công khai

- [ ] Tên, logo chữ, `site.title`, `site.description`, `site.url`
- [ ] Headline, mô tả, câu dành cho khách hàng mục tiêu (`hero`)
- [ ] Câu About (`about.statement`), ảnh chân dung (`about.portrait`)
- [ ] 3 số liệu (`stats`) và 3–6 dịch vụ (`services`)
- [ ] 4–6 dự án: tên, ngành, ảnh, link (`work.items`)
- [ ] Lời chứng thực thật (`testimonials`), logo đối tác (`partners`)
- [ ] Link Calendly/Zalo (`cta`), email, mạng xã hội, link pháp lý (`contact`, `footer`)
- [ ] Video `assets/video/reel.webm` và poster
- [ ] Ảnh chia sẻ `assets/images/og.png` (1200×630)
- [ ] Gắn form thật (`scripts/contact-api.js`)
