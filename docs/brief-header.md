# BRIEF DỰ ÁN — Website portfolio cá nhân

> Cập nhật: {{DATE}} · File này được sinh tự động bằng `npm run brief` (phần đầu viết tay ở `docs/brief-header.md`, phần nội dung + token đọc thẳng từ code).
> Mục đích: dán/đính kèm file này vào một dự án hoặc phiên Claude mới để Claude nắm được **toàn bộ** dự án: mục tiêu, công nghệ, cấu trúc, design system, quy ước, trạng thái và **toàn bộ chữ trên site**.
> Hướng dẫn làm việc chi tiết cho Claude khi sửa code: `CLAUDE.md` ở thư mục gốc repo.

## 1. Tổng quan

| Mục | Thông tin |
|---|---|
| Chủ dự án | caca — sale, designer (cử nhân thiết kế đồ hoạ), UI/UX, quản lý dự án. Làm việc bằng **tiếng Việt**. |
| Sản phẩm | Website portfolio cá nhân, song ngữ **VI** (`/`) và **EN** (`/en/`) |
| Cảm hứng | https://kstoimenov.com/ — bám bố cục, nhịp, hiệu ứng; **không** sao chép chữ, logo, ảnh, video, lời nhận xét |
| Repo | https://github.com/sonbeveve-hub/portfolio (nhánh `main`, đẩy thẳng lên `main`) |
| Website | https://portfolio-pi-eight-jsed3pl308.vercel.app (Vercel, tự đăng khi có commit mới trên `main`) |
| Trang quản trị nội dung | https://portfolio-pi-eight-jsed3pl308.vercel.app/admin/ (Decap CMS, đăng nhập GitHub) |
| Figma | File "Portfolio — Design System", key `6qo4PciHMVrTAtH7LVPgkj` (design system v1.2.1) |
| Đặt lịch | Google Calendar – Lịch hẹn "Trao đổi dự án" (30 phút, Google Meet; T2–T6 19h–24h, T7–CN 8h–24h), nhúng trong hộp thoại khi bấm nút "Đặt lịch" |

**Nguyên tắc chính:** làm giống trang mẫu, không tự ý bỏ/đổi. Khi có nhiều hướng: đưa 2–3 phương án, có khuyên dùng.

## 2. Các trang

| Trang | Đường dẫn | Nội dung chính |
|---|---|---|
| Trang chủ | `/`, `/en/` | Hero (sọc WebGL + tiêu đề + nút Đặt lịch) → câu giới thiệu chữ sáng dần → showreel → số liệu → dịch vụ → dự án → khối "Muốn xem thêm" → nhận xét → câu trích → đối tác → footer + form liên hệ |
| Dự án | `/work/` | Danh sách dự án (rê chuột hiện ảnh) |
| Chi tiết dự án | `/work/<slug>/` | Case study: mở đầu, thông tin nhanh, các phần nội dung, kết quả, dự án tiếp theo |
| Dịch vụ | `/services/` | Mục lục dịch vụ + chi tiết từng dịch vụ (gói gồm, ảnh) |
| Giới thiệu | `/about/` | Ảnh chân dung chấm điểm (soi theo chuột), câu giới thiệu, nguyên tắc (accordion), công cụ, **Kinh nghiệm làm việc** (hợp đồng + freelance lồng nhau, tự tính thời lượng), chứng chỉ/giải thưởng |

## 3. Công nghệ

- **Vite + HTML/CSS/JS thuần** (không framework). Thư viện: `lenis` (cuộn mượt), font Inter Variable + Playfair Display Variable.
- HTML **không viết tay**: lúc build, plugin trong `vite.config.js` ghép `templates/page.html` + nội dung `content/` → các trang tĩnh; tự sinh sitemap (có hreflang), robots, nhúng CSS quan trọng.
- Lệnh: `npm install` · `npm run dev` · `npm run build` (ra `dist/`) · `npm run preview` · `npm run docs` (UI kit HTML) · `npm run brief` (sinh file này).
- Triển khai: Vercel (`vercel.json`: build, `dist`, cleanUrls, cache). Hàm Vercel `api/auth.js`, `api/callback.js` cho đăng nhập GitHub OAuth của `/admin` (biến môi trường `OAUTH_GITHUB_CLIENT_ID`, `OAUTH_GITHUB_CLIENT_SECRET` — đã cài).

## 4. Cấu trúc thư mục

| Đường dẫn | Vai trò |
|---|---|
| `content/settings.json` | Cài đặt chung: site/SEO, tên, nav, nút Đặt lịch (`cta`), liên hệ, footer, chữ giao diện |
| `content/pages/{home,about,services,work}.json` | Chữ của từng trang |
| `content/projects/*.json` | Mỗi dự án một file (tên file = slug đường dẫn) |
| `content/services/*.json`, `experience/`, `testimonials/`, `partners/` | Mỗi mục một file; sắp theo trường `order` (kinh nghiệm sắp theo ngày) |
| `scripts/content.js` | Ghép thư mục `content/` thành dữ liệu cho từng ngôn ngữ; bản EN thiếu ô nào thì lấy theo VI |
| `scripts/render.js`, `pages.js`, `site.js` | Dựng HTML |
| `scripts/*.js` khác | Hiệu ứng: màn chờ, chuyển trang, hero WebGL, con trỏ, nút từ tính, chân dung chấm điểm, accordion, form, đặt lịch… |
| `styles/tokens.css` | **Design token** (màu, cỡ chữ, khoảng cách, bo góc, chuyển động) — xem mục 8 |
| `styles/*.css` | base, nav, hero, sections, footer, pages, overlay |
| `public/admin/` | Decap CMS: `config.yml` (form nhập liệu), `preview.js`, `admin.css` |
| `public/assets/` | Ảnh, video `reel.webm`, logo |
| `docs/` | `design-system.html` (so sánh với trang mẫu), `ui-kit.html` (UI kit), file brief này |

Mỗi file nội dung có dạng `{ "vi": {...}, "en": {...} }`.

## 5. Hệ thống thiết kế (tóm tắt)

- **Màu:** một màu nhấn duy nhất xanh neon `#6fff54` (gradient `--grad`). Theme tối mặc định nền `#121212`; theme sáng nền `#f5f5f1`. Dải sáng hero: neon (tối) / xanh rêu `#0a7d1e` (sáng) qua `--hero-tint`.
- **Chữ:** Inter 300 cho nội dung; nhấn bằng Playfair Display nghiêng. Thang cỡ chữ bám tỉ lệ trang mẫu (13.5 / 18 / 37.5 / 75 / 120 / 165px), dùng `clamp()` co giãn.
- **Khoảng cách:** lưới 4px, `--sp-1` … `--sp-9`. **Bo góc:** 6 / 8 / 12 / 16 / 20px / pill.
- **Chuyển động:** easing `cubic-bezier(.22,1,.36,1)`, `--dur .4s` (giữ nhịp trang mẫu).
- **Truy cập:** đạt Lighthouse Accessibility 100; hỗ trợ `prefers-reduced-motion`, bàn phím, theme tối/sáng, cảm ứng (tắt con trỏ tuỳ chỉnh), độ tương phản viền control ≥ 3:1, chữ ≥ 4.5:1.
- **Figma (v1.2.1):** trang Cover, Read me, Audit, Colors, Typography, Spacing, Motion, Icons, Buttons, Tags, Navigation, Stats, Lists, Accordion, Testimonial, Form, Footer, template Home (desktop/mobile), About, Inner pages, Services, Work, Case study (có bản sáng). 4 bộ biến: Primitives, Theme (Dark/Light), Viewport (Desktop 1440/Mobile 390), Shape & Motion. 29 icon.

## 6. Hiệu ứng đặc trưng

Màn chờ đầu phiên (đếm %, ảnh luân phiên, hiện tên) · chuyển trang 6 cột đen trồi lên trái→phải · hero sọc WebGL (desktop; mobile dùng CSS) · hiện dần khi cuộn · số đếm · cuộn mượt · con trỏ vòng ("+" trên link, nhãn tuỳ chỉnh) · nút từ tính · chồng thẻ nhận xét · accordion · chân dung chấm điểm soi theo chuột · công tắc ảnh ở khối "Muốn xem thêm" · thanh nav dưới có dải mờ, thu gọn khi cuộn.

## 7. Trạng thái & việc còn lại

**Đã xong:** toàn bộ giao diện các trang, song ngữ, theme sáng/tối, hiệu ứng, SEO (meta, sitemap, hreflang, robots), design system + UI kit + Figma, trang quản trị `/admin` (đã đăng nhập được), đặt lịch Google Calendar thật.

**Còn lại:**
1. **Thay nội dung thật** (phần lớn mục 9–10 là mẫu): tên/logo, ảnh dự án, video showreel, nhận xét, logo đối tác, số liệu, dịch vụ, kinh nghiệm, chứng chỉ, email `hello@example.com`, mạng xã hội, nội dung case study.
2. Trang Chính sách bảo mật / Điều khoản (footer đang trỏ `#`).
3. Form liên hệ chưa gửi thật (`scripts/contact-api.js` là hàm giả) — cần chọn dịch vụ (Formspree, Resend…).
4. Nếu gắn tên miền riêng: đổi `site.url`, cấu hình `/admin` và callback GitHub OAuth.

**Cách sửa nội dung:** vào `/admin` → chọn mục → sửa cột VI (và EN) → "Công bố" → Vercel đăng sau 1–2 phút. Hoặc sửa file trong `content/` rồi commit.
