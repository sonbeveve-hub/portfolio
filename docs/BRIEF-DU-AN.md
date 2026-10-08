# BRIEF DỰ ÁN — Website portfolio cá nhân

> Cập nhật: 2026-10-08 · File này được sinh tự động bằng `npm run brief` (phần đầu viết tay ở `docs/brief-header.md`, phần nội dung + token đọc thẳng từ code).
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


---

## 8. Design token (tự sinh từ `styles/tokens.css`)

**:root**

| Token | Giá trị | Ghi chú |
|---|---|---|
| `--accent` | `#6fff54` |  |
| `--accent-ink` | `#062b0c` | chữ đặt trên nền accent |
| `--grad` | `linear-gradient(114deg, #0ae448 0%, #66ea22 50%, #a9fc83 100%)` |  |
| `--font-sans` | `'Inter Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif` |  |
| `--font-serif` | `'Playfair Display Variable', Georgia, 'Times New Roman', serif` | Thang cỡ chữ (bám tỉ lệ của trang mẫu: 13.5 / 18 / 37.5 / 75 / 120 / 165) |
| `--fs-2xs` | `0.75rem` | 12px — cỡ nhỏ nhất: nhãn viết hoa, chip, badge (gộp 10.5/11/12px) |
| `--fs-xs` | `0.8125rem` |  |
| `--fs-s` | `0.9375rem` |  |
| `--fs-btn` | `1.125rem` |  |
| `--fs-lead` | `clamp(1.05rem, 0.9rem + 0.5vw, 1.35rem)` | mục lục dịch vụ |
| `--fs-statement` | `clamp(1.5rem, 0.6rem + 1.85vw, 2.34rem)` |  |
| `--fs-h3` | `clamp(1.25rem, 1rem + 0.9vw, 1.75rem)` | tiêu đề khối nhỏ: kinh nghiệm, chứng chỉ, số liệu |
| `--fs-h2` | `clamp(1.75rem, 0.9rem + 1.5vw, 2.34rem)` |  |
| `--fs-h1` | `clamp(1.9rem, 1rem + 2.2vw, 3rem)` | tên dự án, nút CTA lớn, tên ở màn chờ |
| `--fs-serv` | `clamp(1.75rem, 0.8rem + 3.9vw, 4.1rem)` |  |
| `--fs-big` | `clamp(2.4rem, 1rem + 3.9vw, 4.7rem)` |  |
| `--fs-xl` | `clamp(2.6rem, 0.9rem + 7.4vw, 7.5rem)` |  |
| `--fs-num` | `clamp(4rem, 1.4rem + 7.4vw, 8rem)` |  |
| `--fs-footer` | `clamp(3.5rem, 1rem + 11vw, 10.3rem)` |  |
| `--sp-1` | `0.25rem` |  |
| `--sp-2` | `0.5rem` |  |
| `--sp-3` | `0.75rem` |  |
| `--sp-4` | `1rem` |  |
| `--sp-5` | `1.5rem` |  |
| `--sp-6` | `2rem` |  |
| `--sp-7` | `3rem` |  |
| `--sp-8` | `clamp(4rem, 3.6rem + 1.6vw, 5rem)` | v1.1: về lưới 4px (cũ 4.7rem = 75.2px) |
| `--sp-9` | `clamp(5rem, 10.4vw, 9.4rem)` |  |
| `--radius-s` | `6px` |  |
| `--radius` | `20px` |  |
| `--radius-pill` | `999px` |  |
| `--radius-sm` | `8px` | nav link, nút nav |
| `--radius-md` | `12px` | tag, thẻ, ô công cụ, hộp thoại (gộp 10/12px) |
| `--radius-lg` | `16px` | thanh nav, menu mobile (gộp 14/16px) |
| `--gutter` | `clamp(1.25rem, 4.6vw, 4.4rem)` |  |
| `--w-work` | `1030px` |  |
| `--w-wide` | `1122px` |  |
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` |  |
| `--dur` | `0.4s` |  |
| `--dur-fast` | `0.2s` | dành cho hiệu ứng mới; giá trị cũ giữ nguyên để không đổi nhịp so với trang mẫu |
| `--dur-slow` | `0.8s` |  |
| `--ease-emphasized` | `cubic-bezier(0.76, 0, 0.24, 1)` | Bề mặt trắng cố định (hộp thoại liên hệ, cả hai theme) |
| `--surface-light` | `#ffffff` |  |
| `--on-surface-light` | `#121212` |  |
| `--on-surface-light-muted` | `#55575c` | 7.2:1 trên trắng |
| `--input-border` | `#828282` | 3.8:1 — viền ô nhập (cũ #d4d4d4 = 1.5:1) |
| `--danger-on-light` | `#d93636` |  |
| `--success-on-light` | `#0a7d1e` |  |

**:root, :root[data-theme='dark']**

| Token | Giá trị | Ghi chú |
|---|---|---|
| `--bg` | `#121212` |  |
| `--bg-elev` | `#1a1a1a` |  |
| `--text` | `#ffffff` |  |
| `--muted` | `#b8b8b8` |  |
| `--dim` | `#828282` |  |
| `--stroke` | `#4e4e4e` |  |
| `--tag-stroke` | `#626262` |  |
| `--accent-text` | `#6fff54` |  |
| `--nav-bg` | `rgba(18, 18, 18, 0.62)` |  |
| `--hero-tint` | `#6fff54` | màu dải sáng nền hero |
| `--word-dim` | `0.45` | độ đậm của chữ chưa sáng ở About (v1.1: .38 → .45 để đạt 4.5:1) |
| `--border-control` | `#6e6e6e` | viền control 3.7:1 (WCAG 1.4.11) |
| `--focus-ring` | `var(--accent)` |  |
| `--btn-primary-border` | `var(--accent)` |  |
| `--danger` | `#ff6b6b` |  |
| `--success` | `#6fff54` |  |
| `--shadow` | `0 12px 40px rgba(0, 0, 0, 0.45)` |  |

**:root[data-theme='light']**

| Token | Giá trị | Ghi chú |
|---|---|---|
| `--bg` | `#f5f5f1` |  |
| `--bg-elev` | `#ffffff` |  |
| `--text` | `#121212` |  |
| `--muted` | `#4a4a4a` |  |
| `--dim` | `#6e6e6e` |  |
| `--stroke` | `#c8c8c2` |  |
| `--tag-stroke` | `#a9a9a3` |  |
| `--accent-text` | `#0a7d1e` |  |
| `--nav-bg` | `rgba(245, 245, 241, 0.7)` |  |
| `--hero-tint` | `#0a7d1e` | xanh rêu: dịu hơn neon trên nền sáng |
| `--word-dim` | `0.6` |  |
| `--border-control` | `#828282` |  |
| `--focus-ring` | `var(--accent-text)` |  |
| `--btn-primary-border` | `#0a7d1e` |  |
| `--danger` | `#c62828` |  |
| `--success` | `#0a7d1e` |  |
| `--shadow` | `0 12px 40px rgba(18, 18, 18, 0.12)` |  |

---

## 9. TOÀN BỘ NỘI DUNG SITE — TIẾNG VIỆT (tự sinh từ `content/`)

> Quy ước chữ: `*chữ*` = serif nghiêng (nhấn), `__chữ__` = gạch chân, `[[gem|clover|burst…]]` = hình trang trí trong câu. Đây phần lớn là **nội dung mẫu**, cần thay bằng nội dung thật.

### Thông tin site & SEO (`site`)

- `url`: https://portfolio-pi-eight-jsed3pl308.vercel.app
- `lang`: vi
- `title`: Tên Bạn — Designer & UI/UX
- `description`: Portfolio của Tên Bạn: thiết kế giao diện, trải nghiệm người dùng và quản lý dự án cho doanh nghiệp cần sản phẩm ra thật nhanh.
- `ogImage`: /assets/images/og.png
- `themeColor`: #121212

### Thương hiệu / tên (`brand`)

- `logo`: Tên Bạn
- `logoMark`: .
- `nameLines`:
  - Tên
  - Bạn

### Thanh điều hướng (`nav`)

- **Dự án**
  - `key`: work
  - `label`: Dự án
- **Dịch vụ**
  - `key`: services
  - `label`: Dịch vụ
- **Giới thiệu**
  - `key`: about
  - `label`: Giới thiệu

### Nút Đặt lịch (`cta`)

- `label`: Đặt lịch
- `href`: https://calendar.google.com/calendar/appointments/schedules/AcZssZ18syupBON0_UFEN60jA8gFMKqLlLQX-qQd_hAcH8oESr2hEnPw7HJwTU_jK3L5KWwtVgHjjfMf
- `booking`:
  - `title`: Đặt *lịch hẹn*
  - `intro`: Chọn khung giờ phù hợp. Bạn sẽ nhận email xác nhận và lời mời trên Google Calendar.
  - `newTab`: Mở trang đặt lịch trong tab mới

### Trang chủ — Hero (`hero`)

- `lines`:
  - **#1**
    - `text`: Thiết kế giúp
    - `style`: sans
  - **#2**
    - `text`: sản phẩm của bạn
    - `style`: serif
    - `align`: right
  - **#3**
    - `text`: ra thật nhanh
    - `style`: sans
    - `cta`: true
- `headlineSr`: Thiết kế giúp sản phẩm của bạn ra thật nhanh
- `tagLeft`: Designer, UI/UX và quản lý dự án — từ wireframe đến bàn giao.
- `tagRight`: Dành cho doanh nghiệp cần sản phẩm ra thị trường nhanh mà vẫn chất lượng.

### Trang chủ — Câu giới thiệu (About statement) (`about`)

- `statement`: Tôi làm việc ở giao điểm của thiết kế, dữ liệu và vận hành. [[gem]] Mỗi __sản phẩm__ bắt đầu bằng việc hiểu người dùng, đi qua những vòng thử ngắn và kết thúc bằng bản bàn giao gọn gàng. [[clover]] Kết quả là giao diện rõ ràng, đội ngũ làm nhanh hơn và khách hàng thấy __giá trị__ ngay từ bản đầu tiên. [[burst]]
- `portrait`: /assets/images/portrait.jpg
- `portraitAlt`: Ảnh chân dung của Tên Bạn

### Trang chủ — Showreel (`reel`)

- `label`: Xem showreel
- `marquee`: Xem showreel
- `video`: /assets/video/reel.webm
- `poster`: /assets/images/reel-poster.svg
- `playLabel`: Phát video
- `pauseLabel`: Tạm dừng video

### Trang chủ — Số liệu (`stats`)

- **Kinh nghiệm thiết kế sản phẩm số**
  - `value`: 5
  - `suffix`: +
  - `unit`: Năm
  - `label`: Kinh nghiệm thiết kế sản phẩm số
- **Đã hoàn thành cho nhiều ngành**
  - `value`: 60
  - `suffix`: +
  - `unit`: Dự án
  - `label`: Đã hoàn thành cho nhiều ngành
- **Quay lại làm việc lần thứ hai**
  - `value`: 40
  - `suffix`: +
  - `unit`: Khách hàng
  - `label`: Quay lại làm việc lần thứ hai

### Dịch vụ (khối trang chủ + danh sách dịch vụ) (`services`)

- `title`: *Dịch vụ* để sản phẩm tốt hơn
- `tagline`: Sáu mảng việc, một người chịu trách nhiệm đến cùng — từ ý tưởng thô đến sản phẩm người dùng thật sự dùng.
- `button`:
  - `label`: Xem dịch vụ
- `audience`:
  - `label`: Tôi làm cho ai
  - `textA`: Từ doanh nghiệp đã có tên tuổi đến người sáng lập mới bắt đầu, tôi đều làm việc theo cùng một tiêu chuẩn.
  - `textB`: Những sản phẩm ra mắt nhanh, đúng nhu cầu và dễ mở rộng.
- `soon`:
  - `title`: Phát triển Webflow
  - `label`: Sắp ra mắt
- `items`:
  - **Thiết kế UI**
    - `slug`: ui-design
    - `icon`: layout
    - `title`: Thiết kế UI
    - `text`: Giao diện web và app nhất quán, sẵn sàng để lập trình.
    - `long`: Giao diện là nơi sản phẩm của bạn gặp người dùng. Tôi thiết kế màn hình rõ ràng, nhất quán và sẵn sàng để lập trình, để đội kỹ thuật không phải đoán.
    - `deliverables`:
      - Thiết kế giao diện web và app
      - Hệ thống lưới và typography
      - Trạng thái và vi tương tác
      - Bản thiết kế bàn giao cho lập trình
      - Kiểm tra trước khi ra mắt
      - Hỗ trợ trong lúc triển khai
    - `image`: /assets/images/project-1.svg
    - `imageAlt`: Ảnh minh họa
    - `badge`: Quy trình có AI
  - **Nghiên cứu & UX**
    - `slug`: research-ux
    - `icon`: compass
    - `title`: Nghiên cứu & UX
    - `text`: Phỏng vấn, luồng người dùng và wireframe có dữ liệu.
    - `long`: Trước khi vẽ, tôi hỏi. Phỏng vấn, xem hành vi thật và dựng luồng người dùng để mọi quyết định đều có lý do.
    - `deliverables`:
      - Phỏng vấn người dùng
      - Bản đồ hành trình
      - Luồng người dùng
      - Wireframe
      - Kiểm thử khả dụng
      - Báo cáo phát hiện
    - `image`: /assets/images/project-2.svg
    - `imageAlt`: Ảnh minh họa
    - `badge`: Tăng tốc bằng AI
  - **Design system**
    - `slug`: design-system
    - `icon`: layers
    - `title`: Design system
    - `text`: Bộ thành phần giúp đội ngũ làm nhanh và đồng bộ.
    - `long`: Một bộ thành phần dùng chung giúp đội ngũ làm nhanh hơn và sản phẩm nhất quán khi lớn lên.
    - `deliverables`:
      - Kiểm kê giao diện hiện có
      - Màu, chữ, khoảng cách
      - Thư viện thành phần
      - Quy tắc sử dụng
      - Tài liệu cho lập trình
      - Quy trình cập nhật
    - `image`: /assets/images/project-3.svg
    - `imageAlt`: Ảnh minh họa
  - **Quản lý dự án**
    - `slug`: project-management
    - `icon`: calendar
    - `title`: Quản lý dự án
    - `text`: Lập kế hoạch, theo dõi tiến độ, giữ đúng deadline.
    - `long`: Tôi giữ dự án đi đúng hướng: rõ việc, rõ người, rõ hạn, và báo sớm khi có rủi ro.
    - `deliverables`:
      - Lộ trình và mốc bàn giao
      - Phân việc và ưu tiên
      - Họp đồng bộ ngắn
      - Theo dõi rủi ro
      - Báo cáo tiến độ hằng tuần
      - Tổng kết sau dự án
    - `image`: /assets/images/project-4.svg
    - `imageAlt`: Ảnh minh họa
  - **Tư vấn & bán hàng**
    - `slug`: consulting-sales
    - `icon`: message
    - `title`: Tư vấn & bán hàng
    - `text`: Từ báo giá, kịch bản chốt đơn đến chăm sóc sau bàn giao.
    - `long`: Thiết kế tốt còn cần bán được. Tôi đồng hành từ báo giá, kịch bản chốt đơn đến chăm sóc sau bàn giao.
    - `deliverables`:
      - Tư vấn định hướng sản phẩm
      - Báo giá và phạm vi
      - Kịch bản trao đổi với khách
      - Tài liệu giới thiệu
      - Chăm sóc sau bàn giao
      - Đề xuất cải tiến
    - `image`: /assets/images/project-1.svg
    - `imageAlt`: Ảnh minh họa
    - `badge`: Zalo & Email
  - **Branding cơ bản**
    - `slug`: branding
    - `icon`: spark
    - `title`: Branding cơ bản
    - `text`: Logo, màu sắc và bộ nhận diện gọn cho thương hiệu mới.
    - `long`: Một bộ nhận diện gọn gàng đủ để thương hiệu mới trông đáng tin từ ngày đầu.
    - `deliverables`:
      - Logo và biến thể
      - Bảng màu
      - Chữ và quy tắc dùng
      - Mẫu mạng xã hội
      - Mẫu tài liệu
      - Sổ tay thương hiệu ngắn
    - `image`: /assets/images/project-2.svg
    - `imageAlt`: Ảnh minh họa

### Dự án (danh sách + case study) (`work`)

- `title`: Dự án nổi bật
- `linkLabel`: Xem dự án
- `soonLabel`: Sắp ra mắt
- `next`: Dự án tiếp theo
- `items`:
  - **Dự án 01**
    - `slug`: project-01
    - `title`: Dự án 01
    - `industry`: Thương mại điện tử
    - `tags`:
      - Thiết kế sản phẩm
      - Nghiên cứu UX
      - Chiến lược thương hiệu
    - `status`: live
    - `image`: /assets/images/project-1.svg
    - `image2`: /assets/images/project-1b.svg
    - `alt`: Ảnh minh họa Dự án 01
    - `detail`:
      - `meta`:
        - **Khách hàng**
          - `label`: Khách hàng
          - `value`: Khách hàng mẫu
        - **Năm**
          - `label`: Năm
          - `value`: 2025
        - **Vai trò**
          - `label`: Vai trò
          - `value`: Thiết kế sản phẩm, Nghiên cứu UX, Chiến lược thương hiệu
        - **Ngành**
          - `label`: Ngành
          - `value`: Thương mại điện tử
      - `intro`:
        - `title`: Một sản phẩm *quá phức tạp* để dùng
        - `text`: Mô tả mẫu cho Dự án 01: bối cảnh, vấn đề khách hàng gặp phải và vì sao dự án này quan trọng. Thay bằng câu chuyện thật của bạn.
      - `sections`:
        - **Làm cho sự phức tạp *biến mất***
          - `title`: Làm cho sự phức tạp *biến mất*
          - `text`: Mô tả hướng tiếp cận: bạn đã nghiên cứu gì, đặt ra nguyên tắc nào và thử nghiệm ra sao.
          - `bullets`:
            - Một mục tiêu rõ ràng cho cả sản phẩm
            - Nhìn thấy trạng thái quan trọng ngay lập tức
            - Mở rộng mà không phải học lại
          - `images`:
            - /assets/images/project-1.svg
        - **Một ngôn ngữ cho *toàn bộ sản phẩm***
          - `title`: Một ngôn ngữ cho *toàn bộ sản phẩm*
          - `text`: Mô tả hệ thống thiết kế, thành phần và quy tắc đã giúp đội ngũ làm nhanh và nhất quán.
          - `bullets`:
            - Bộ thành phần dùng chung
            - Quy tắc khoảng cách và chữ
            - Tài liệu cho lập trình
          - `images`:
            - /assets/images/project-1.svg
            - /assets/images/project-1b.svg
        - **Những quyết định *quan trọng***
          - `title`: Những quyết định *quan trọng*
          - `text`: Kể về 2–3 quyết định khó và lý do bạn chọn như vậy.
          - `images`:
            - /assets/images/project-1b.svg
      - `result`:
        - `title`: Sâu nhưng *dễ chịu*
        - `text`: Kết quả đo được: số liệu, phản hồi của khách hàng và điều bạn học được.
  - **Dự án 02**
    - `slug`: project-02
    - `title`: Dự án 02
    - `industry`: Giáo dục
    - `tags`:
      - Thiết kế sản phẩm
      - Nghiên cứu UX
    - `status`: live
    - `image`: /assets/images/project-2.svg
    - `image2`: /assets/images/project-2b.svg
    - `alt`: Ảnh minh họa Dự án 02
    - `detail`:
      - `meta`:
        - **Khách hàng**
          - `label`: Khách hàng
          - `value`: Khách hàng mẫu
        - **Năm**
          - `label`: Năm
          - `value`: 2025
        - **Vai trò**
          - `label`: Vai trò
          - `value`: Thiết kế sản phẩm, Nghiên cứu UX
        - **Ngành**
          - `label`: Ngành
          - `value`: Giáo dục
      - `intro`:
        - `title`: Một sản phẩm *quá phức tạp* để dùng
        - `text`: Mô tả mẫu cho Dự án 02: bối cảnh, vấn đề khách hàng gặp phải và vì sao dự án này quan trọng. Thay bằng câu chuyện thật của bạn.
      - `sections`:
        - **Làm cho sự phức tạp *biến mất***
          - `title`: Làm cho sự phức tạp *biến mất*
          - `text`: Mô tả hướng tiếp cận: bạn đã nghiên cứu gì, đặt ra nguyên tắc nào và thử nghiệm ra sao.
          - `bullets`:
            - Một mục tiêu rõ ràng cho cả sản phẩm
            - Nhìn thấy trạng thái quan trọng ngay lập tức
            - Mở rộng mà không phải học lại
          - `images`:
            - /assets/images/project-2.svg
        - **Một ngôn ngữ cho *toàn bộ sản phẩm***
          - `title`: Một ngôn ngữ cho *toàn bộ sản phẩm*
          - `text`: Mô tả hệ thống thiết kế, thành phần và quy tắc đã giúp đội ngũ làm nhanh và nhất quán.
          - `bullets`:
            - Bộ thành phần dùng chung
            - Quy tắc khoảng cách và chữ
            - Tài liệu cho lập trình
          - `images`:
            - /assets/images/project-2.svg
            - /assets/images/project-2b.svg
        - **Những quyết định *quan trọng***
          - `title`: Những quyết định *quan trọng*
          - `text`: Kể về 2–3 quyết định khó và lý do bạn chọn như vậy.
          - `images`:
            - /assets/images/project-2b.svg
      - `result`:
        - `title`: Sâu nhưng *dễ chịu*
        - `text`: Kết quả đo được: số liệu, phản hồi của khách hàng và điều bạn học được.
  - **Dự án 03**
    - `slug`: project-03
    - `title`: Dự án 03
    - `industry`: Tài chính
    - `tags`:
      - Thiết kế sản phẩm
      - Design system
    - `status`: live
    - `image`: /assets/images/project-3.svg
    - `image2`: /assets/images/project-3b.svg
    - `alt`: Ảnh minh họa Dự án 03
    - `detail`:
      - `meta`:
        - **Khách hàng**
          - `label`: Khách hàng
          - `value`: Khách hàng mẫu
        - **Năm**
          - `label`: Năm
          - `value`: 2025
        - **Vai trò**
          - `label`: Vai trò
          - `value`: Thiết kế sản phẩm, Design system
        - **Ngành**
          - `label`: Ngành
          - `value`: Tài chính
      - `intro`:
        - `title`: Một sản phẩm *quá phức tạp* để dùng
        - `text`: Mô tả mẫu cho Dự án 03: bối cảnh, vấn đề khách hàng gặp phải và vì sao dự án này quan trọng. Thay bằng câu chuyện thật của bạn.
      - `sections`:
        - **Làm cho sự phức tạp *biến mất***
          - `title`: Làm cho sự phức tạp *biến mất*
          - `text`: Mô tả hướng tiếp cận: bạn đã nghiên cứu gì, đặt ra nguyên tắc nào và thử nghiệm ra sao.
          - `bullets`:
            - Một mục tiêu rõ ràng cho cả sản phẩm
            - Nhìn thấy trạng thái quan trọng ngay lập tức
            - Mở rộng mà không phải học lại
          - `images`:
            - /assets/images/project-3.svg
        - **Một ngôn ngữ cho *toàn bộ sản phẩm***
          - `title`: Một ngôn ngữ cho *toàn bộ sản phẩm*
          - `text`: Mô tả hệ thống thiết kế, thành phần và quy tắc đã giúp đội ngũ làm nhanh và nhất quán.
          - `bullets`:
            - Bộ thành phần dùng chung
            - Quy tắc khoảng cách và chữ
            - Tài liệu cho lập trình
          - `images`:
            - /assets/images/project-3.svg
            - /assets/images/project-3b.svg
        - **Những quyết định *quan trọng***
          - `title`: Những quyết định *quan trọng*
          - `text`: Kể về 2–3 quyết định khó và lý do bạn chọn như vậy.
          - `images`:
            - /assets/images/project-3b.svg
      - `result`:
        - `title`: Sâu nhưng *dễ chịu*
        - `text`: Kết quả đo được: số liệu, phản hồi của khách hàng và điều bạn học được.
  - **Dự án 04**
    - `slug`: project-04
    - `title`: Dự án 04
    - `industry`: Bất động sản
    - `tags`:
      - Thiết kế sản phẩm
    - `status`: soon
    - `image`: /assets/images/project-4.svg
    - `image2`: /assets/images/project-4b.svg
    - `alt`: Ảnh minh họa Dự án 04
    - `detail`:
      - `meta`:
        - **Khách hàng**
          - `label`: Khách hàng
          - `value`: Khách hàng mẫu
        - **Năm**
          - `label`: Năm
          - `value`: 2025
        - **Vai trò**
          - `label`: Vai trò
          - `value`: Thiết kế sản phẩm
        - **Ngành**
          - `label`: Ngành
          - `value`: Bất động sản
      - `intro`:
        - `title`: Một sản phẩm *quá phức tạp* để dùng
        - `text`: Mô tả mẫu cho Dự án 04: bối cảnh, vấn đề khách hàng gặp phải và vì sao dự án này quan trọng. Thay bằng câu chuyện thật của bạn.
      - `sections`:
        - **Làm cho sự phức tạp *biến mất***
          - `title`: Làm cho sự phức tạp *biến mất*
          - `text`: Mô tả hướng tiếp cận: bạn đã nghiên cứu gì, đặt ra nguyên tắc nào và thử nghiệm ra sao.
          - `bullets`:
            - Một mục tiêu rõ ràng cho cả sản phẩm
            - Nhìn thấy trạng thái quan trọng ngay lập tức
            - Mở rộng mà không phải học lại
          - `images`:
            - /assets/images/project-4.svg
        - **Một ngôn ngữ cho *toàn bộ sản phẩm***
          - `title`: Một ngôn ngữ cho *toàn bộ sản phẩm*
          - `text`: Mô tả hệ thống thiết kế, thành phần và quy tắc đã giúp đội ngũ làm nhanh và nhất quán.
          - `bullets`:
            - Bộ thành phần dùng chung
            - Quy tắc khoảng cách và chữ
            - Tài liệu cho lập trình
          - `images`:
            - /assets/images/project-4.svg
            - /assets/images/project-4b.svg
        - **Những quyết định *quan trọng***
          - `title`: Những quyết định *quan trọng*
          - `text`: Kể về 2–3 quyết định khó và lý do bạn chọn như vậy.
          - `images`:
            - /assets/images/project-4b.svg
      - `result`:
        - `title`: Sâu nhưng *dễ chịu*
        - `text`: Kết quả đo được: số liệu, phản hồi của khách hàng và điều bạn học được.

### Khối "Muốn xem thêm" (`worksCta`)

- `line1`: Muốn xem
- `line2a`: tôi
- `line2b`: giúp
- `line3`: doanh nghiệp thế nào?
- `text`: Vài dự án tôi tự hào, làm cùng cả doanh nghiệp lớn lẫn đối tác độc lập.
- `label`: Xem tất cả dự án

### Lời nhận xét (`testimonials`)

- `title`: Khách hàng *nói gì*
- `text`: Muốn biết làm việc cùng tôi thế nào? Đừng chỉ nghe tôi nói — đây là điều khách hàng chia sẻ.
- `prev`: Lời chứng thực trước
- `next`: Lời chứng thực tiếp theo
- `items`:
  - **Nguyễn Văn A**
    - `quote`: Lời chứng thực mẫu — thay bằng nhận xét thật của khách hàng.
    - `name`: Nguyễn Văn A
    - `role`: Giám đốc, Công ty A
  - **Trần Thị B**
    - `quote`: Lời chứng thực mẫu — làm việc chuyên nghiệp, bàn giao đúng hạn.
    - `name`: Trần Thị B
    - `role`: Founder, Startup B
  - **Lê Văn C**
    - `quote`: Lời chứng thực mẫu — giao diện đẹp và dễ dùng hơn mong đợi.
    - `name`: Lê Văn C
    - `role`: Trưởng phòng, Đơn vị C

### Câu trích dẫn (`quote`)

- `line1`: Thiết kế để mở rộng
- `line2`: & tạo trải nghiệm
- `line3`: dựa trên dữ liệu

### Đối tác (`partners`)

- `title`: Đối tác *đáng tin*
- `text`: Được tin dùng bởi các nhóm từ startup mới thành lập đến doanh nghiệp lớn.
- `items`:
  - **Đối tác 01**
    - `name`: Đối tác 01
  - **Đối tác 02**
    - `name`: Đối tác 02
  - **Đối tác 03**
    - `name`: Đối tác 03
  - **Đối tác 04**
    - `name`: Đối tác 04
  - **Đối tác 05**
    - `name`: Đối tác 05
  - **Đối tác 06**
    - `name`: Đối tác 06
  - **Đối tác 07**
    - `name`: Đối tác 07
  - **Đối tác 08**
    - `name`: Đối tác 08
  - **Đối tác 09**
    - `name`: Đối tác 09
  - **Đối tác 10**
    - `name`: Đối tác 10

### Liên hệ, form, mạng xã hội (`contact`)

- `title`: Liên hệ
- `text`: Tôi xây những sản phẩm chạm đến con người và đem lại kết quả cho doanh nghiệp.
- `email`: hello@example.com
- `writeLabel`: Thích viết hơn? Gửi lời nhắn.
- `button`:
  - `label`: Liên hệ
- `socials`:
  - **Zalo**
    - `label`: Zalo
    - `icon`: zalo
    - `href`: https://zalo.me/your-number
  - **LinkedIn**
    - `label`: LinkedIn
    - `icon`: linkedin
    - `href`: https://www.linkedin.com/in/your-profile
  - **Behance**
    - `label`: Behance
    - `icon`: behance
    - `href`: https://www.behance.net/your-profile
  - **Dribbble**
    - `label`: Dribbble
    - `icon`: dribbble
    - `href`: https://dribbble.com/your-profile
  - **Email**
    - `label`: Email
    - `icon`: mail
    - `href`: mailto:hello@example.com
- `form`:
  - `title`: Bạn cần một *người đồng hành*?
  - `intro`: Kể cho tôi nghe bạn đang xây gì và đang vướng ở đâu. Tôi tự đọc từng tin nhắn và phản hồi trong một hai ngày, không có bot ở giữa.
  - `close`: Đóng
  - `name`: Họ tên
  - `email`: Email
  - `contact`: Zalo hoặc LinkedIn
  - `company`: Tên công ty
  - `lookingFor`: Bạn đang cần gì?
  - `options`:
    - Thiết kế UI
    - Nghiên cứu & UX
    - Design system
    - Quản lý dự án
    - Tư vấn & bán hàng
    - Branding
    - Khác
  - `message`: Kể thêm về dự án
  - `submit`: Gửi
  - `sending`: Đang gửi…
  - `success`: Đã gửi! Mình sẽ phản hồi sớm.
  - `error`: Chưa gửi được, vui lòng thử lại.
  - `invalid`: Vui lòng điền đủ thông tin bắt buộc (*) và chọn ít nhất một mục.

### Footer (`footer`)

- `copyright`: Tên Bạn. Đã đăng ký bản quyền.
- `legal`:
  - **Chính sách bảo mật**
    - `label`: Chính sách bảo mật
    - `href`: #
  - **Điều khoản**
    - `label`: Điều khoản
    - `href`: #

### Chữ giao diện (nút, nhãn) (`ui`)

- `toggleTheme`: Chuyển giao diện sáng/tối
- `openMenu`: Mở menu
- `closeMenu`: Đóng menu
- `skip`: Bỏ qua tới nội dung chính
- `home`: Trang đầu
- `statsLabel`: Số liệu nổi bật
- `langCode`: EN
- `langName`: Switch to English
- `reach`: Liên hệ
- `loading`: Đang tải

### Các trang con: Dự án, Dịch vụ, Giới thiệu (gồm Kinh nghiệm) (`pages`)

- `work`:
  - `title`: Những dự án *được chọn lọc*
  - `text`: Sản phẩm thật, đội ngũ thật. Case study, không phải mood board.
  - `seoTitle`: Dự án
- `services`:
  - `seoTitle`: Dịch vụ
  - `h1`: Chiến lược, thiết kế và triển khai. *Không cần bộ máy agency.*
  - `lead`: Sáu mảng việc, một đối tác chịu trách nhiệm. Tôi làm việc với founder và đội ngũ đang lớn cần chất lượng ở tốc độ startup — dùng AI để rút ngắn thời gian mà không cắt xén tay nghề.
  - `expect`: Bạn sẽ nhận được
  - `bag`: Trong gói gồm
  - `principlesTitle`: Sau hơn 5 năm làm sản phẩm, *vài điều đã trở thành bắt buộc*
  - `principles`:
    - **Tập trung vào sản phẩm**
      - `title`: Tập trung vào sản phẩm
      - `text`: Giao diện đẹp mà người dùng không hiểu là thất bại. Mọi quyết định bắt đầu từ sản phẩm và người dùng của nó.
    - **Tư duy đồng sáng lập**
      - `title`: Tư duy đồng sáng lập
      - `text`: Tôi quan tâm kết quả như người trong cuộc: nói thẳng khi thấy hướng đi chưa ổn, trước khi bạn ra mắt.
    - **Giao hàng đã được kiểm chứng**
      - `title`: Giao hàng đã được kiểm chứng
      - `text`: Nhiều năm làm việc với startup lẫn doanh nghiệp. Quy trình đã được thử qua thực tế nên sản phẩm đến đúng hạn và chạy ổn khi ra thật.
    - **Nhịp độ startup**
      - `title`: Nhịp độ startup
      - `text`: Thử sớm, sửa sớm, bàn giao gọn. Dùng AI để rút ngắn thời gian mà không cắt xén tay nghề.
  - `quoteBand`: Thiết kế tốt *nhìn như hiển nhiên*
  - `metricsTitle`: Những con số *có ý nghĩa.* Đây là điều công việc thật sự mang lại.
  - `expand`: Mở rộng
  - `metricItems`:
    - **Dự án thiện nguyện đã hoàn thành**
      - `value`: 04
      - `label`: Dự án thiện nguyện đã hoàn thành
    - **Lĩnh vực chuyên môn chính**
      - `value`: +5
      - `label`: Lĩnh vực chuyên môn chính
    - **Vốn các đối tác đã huy động**
      - `value`: 23M
      - `label`: Vốn các đối tác đã huy động
    - **Tỉ lệ khách hàng hài lòng theo khảo sát sau dự án**
      - `value`: 97%
      - `label`: Tỉ lệ khách hàng hài lòng theo khảo sát sau dự án
    - **Lượt người dùng sản phẩm trên toàn thế giới**
      - `value`: 111M
      - `label`: Lượt người dùng sản phẩm trên toàn thế giới
    - **Thời gian ra thị trường rút ngắn nhờ quy trình thiết kế dùng AI**
      - `value`: 38%
      - `label`: Thời gian ra thị trường rút ngắn nhờ quy trình thiết kế dùng AI
- `about`:
  - `seoTitle`: Giới thiệu
  - `h1a`: Đa số designer chỉ nộp file thuyết trình.
  - `h1b`: Tôi giao *sản phẩm*
  - `lead`: Tôi làm sản phẩm số từ vài năm nay, từ lúc "AI" chỉ là tính năng sửa lỗi gõ. Giờ tôi dùng nó để giao cho founder và doanh nghiệp trong vài ngày những gì agency báo giá vài tháng.
  - `portrait`: /assets/images/portrait.jpg
  - `portraitAlt`: Ảnh chân dung
  - `fast`:
    - `title`: Nhanh, tập trung, *dùng AI*
    - `text`:
      - Thiết kế sản phẩm là giải đúng vấn đề, rồi thực hiện không rườm rà.
      - Tôi làm việc với công ty giai đoạn đầu và đội ngũ đang lớn, cần quyết định chứ không cần workshop. Quy trình xây quanh việc giao nhanh: từ chiến lược đến bàn giao, không cần buổi khởi động dài hai tuần.
      - Tôi đã làm sản phẩm cho SaaS, tài chính và ứng dụng người dùng. Công cụ thay đổi, kỷ luật thì không.
  - `tools`:
    - `title`: Bộ công cụ *đứng sau công việc*
    - `text`: Công việc của tôi chạy trên nhiều công cụ: từ design system, cộng tác đến tự động hóa và AI. Chúng giúp tôi làm thông minh hơn, nhanh hơn và vượt kỳ vọng. Bộ công cụ này luôn thay đổi.
    - `all`: Tất cả
    - `items`:
      - **Figma**
        - `name`: Figma
        - `cat`: Thiết kế
      - **Notion**
        - `name`: Notion
        - `cat`: Năng suất
      - **Slack**
        - `name`: Slack
        - `cat`: Giao tiếp
      - **Calendly**
        - `name`: Calendly
        - `cat`: Đặt lịch
      - **Webflow**
        - `name`: Webflow
        - `cat`: Làm web
      - **Keynote**
        - `name`: Keynote
        - `cat`: Thuyết trình
      - **Mailchimp**
        - `name`: Mailchimp
        - `cat`: Marketing
      - **Drive**
        - `name`: Drive
        - `cat`: Năng suất
      - **Jitter**
        - `name`: Jitter
        - `cat`: Thiết kế
      - **Stripe**
        - `name`: Stripe
        - `cat`: Marketing
      - **Claude**
        - `name`: Claude
        - `cat`: AI
      - **Cloudflare**
        - `name`: Cloudflare
        - `cat`: Bảo mật
  - `principles`:
    - `title`: Khác biệt không phải lời hứa. *Đây là ý nghĩa thật*
    - `items`:
      - **Không phô diễn.**
        - `title`: Không phô diễn.
        - `text`: Không có bản thuyết trình nào không được giao. Mỗi sản phẩm bàn giao đều có việc để làm.
      - **Không hố đen.**
        - `title`: Không hố đen.
        - `text`: Bạn luôn biết dự án đang ở đâu, vướng gì, và tôi nghĩ gì — kể cả khi tôi nghĩ ta đang giải sai bài.
      - **Có AI trong phòng.**
        - `title`: Có AI trong phòng.
        - `text`: Tôi dùng AI trong cả quy trình: nghiên cứu, kiểm chứng, dựng nguyên mẫu nhanh hơn. Tay nghề vẫn là của con người.
      - **Tôi sẽ nói khi có gì sai.**
        - `title`: Tôi sẽ nói khi có gì sai.
        - `text`: Nếu có gì lệch — cấu trúc, chiến lược, hình ảnh — tôi nói trước khi bạn ra mắt.
      - **Cùng chịu rủi ro.**
        - `title`: Cùng chịu rủi ro.
        - `text`: Thời gian của bạn là thật. Tôi làm với sự gấp gáp của người quan tâm kết quả.
      - **Bạn nói chuyện với tôi.**
        - `title`: Bạn nói chuyện với tôi.
        - `text`: Không account manager, không chuyển tiếp. Bạn làm việc trực tiếp với người làm.
  - `photos`:
    - **#1**
      - `src`: /assets/images/project-1.svg
      - `alt`: Ảnh làm việc
    - **#2**
      - `src`: /assets/images/project-3b.svg
      - `alt`: Ảnh làm việc
  - `awards`:
    - `title`: Chứng chỉ, giải thưởng *& báo chí*
    - `types`:
      - `cert`: Chứng chỉ
      - `award`: Giải thưởng
      - `pub`: Báo chí
    - `items`:
      - **Nielsen Norman Group UXC**
        - `name`: Nielsen Norman Group UXC
        - `type`: cert
        - `topic`: Quản lý UX
      - **Uxcel**
        - `name`: Uxcel
        - `type`: cert
        - `topic`: Thiết kế dịch vụ
      - **Behance UI/UX**
        - `name`: Behance UI/UX
        - `type`: award
        - `topic`: Thiết kế sản phẩm
      - **Behance Digital Arts**
        - `name`: Behance Digital Arts
        - `type`: award
        - `topic`: Nghệ thuật số
      - **Abduzeedo**
        - `name`: Abduzeedo
        - `type`: pub
        - `topic`: Nghệ thuật số
      - **GoGuide**
        - `name`: GoGuide
        - `type`: pub
        - `topic`: Nghệ thuật số
    - `colCert`: Chứng chỉ
    - `colMore`: Giải thưởng & báo chí
  - `closing`:
    - `a`: Sản phẩm *tiếp theo* của bạn
    - `b`: đang trễ tiến độ.
    - `c`: Bắt đầu thôi
    - `btn`: Dự án
  - `dither`: /assets/images/portrait-dither-2.png
  - `clean`: /assets/images/portrait-clean-2.webp
  - `experience`:
    - `title`: Kinh nghiệm *làm việc*
    - `lead`: Hai dòng công việc chạy song song: làm theo hợp đồng lao động và nhận dự án freelance trong cùng khoảng thời gian.
    - `lanes`:
      - `employment`: Hợp đồng lao động
      - `freelance`: Freelance
    - `all`: Tất cả
    - `now`: Nay
    - `chartLabel`: Biểu đồ thời gian làm việc theo hai dòng: hợp đồng lao động và freelance
    - `units`:
      - `y`: năm
      - `m`: tháng
    - `resultsLabel`: Kết quả
    - `during`: Freelance cùng thời gian
    - `solo`: Freelance ngoài thời gian hợp đồng
    - `projects`: dự án
    - `items`:
      - **Công ty Truyền thông C**
        - `type`: employment
        - `org`: Công ty Truyền thông C
        - `role`: UI Designer
        - `from`: 2018-03
        - `to`: 2019-05
        - `summary`: Thiết kế giao diện web và ấn phẩm số cho khách hàng thương hiệu.
        - `results`:
          - Hoàn thành hơn 25 dự án giao diện
          - Xây bộ thư viện thành phần đầu tiên của công ty
      - **Landing page khoá học trực tuyến**
        - `type`: freelance
        - `org`: Landing page khoá học trực tuyến
        - `role`: Thiết kế & tư vấn bán hàng
        - `from`: 2018-08
        - `to`: 2019-03
        - `summary`: Thiết kế landing page và kịch bản tư vấn cho khoá học trực tuyến.
        - `results`:
          - Tỷ lệ chuyển đổi 7,4%
          - Hơn 300 học viên trong đợt đầu
      - **Công ty Giải pháp B**
        - `type`: employment
        - `org`: Công ty Giải pháp B
        - `role`: Product Designer
        - `from`: 2019-06
        - `to`: 2022-02
        - `summary`: Thiết kế trải nghiệm cho ứng dụng web và di động, từ nghiên cứu người dùng đến thử nghiệm.
        - `results`:
          - Tăng 18% tỷ lệ hoàn tất đăng ký
          - Ra mắt 2 ứng dụng di động
          - Chuẩn hoá quy trình nghiên cứu người dùng
      - **Bộ ấn phẩm sự kiện**
        - `type`: freelance
        - `org`: Bộ ấn phẩm sự kiện
        - `role`: Thiết kế đồ hoạ
        - `from`: 2019-09
        - `to`: 2020-02
        - `summary`: Thiết kế bộ ấn phẩm nhận diện cho chuỗi sự kiện thường niên.
        - `results`:
          - Hơn 60 ấn phẩm bàn giao
          - Được nhà tổ chức mời hợp tác tiếp
      - **Cửa hàng trực tuyến thời trang**
        - `type`: freelance
        - `org`: Cửa hàng trực tuyến thời trang
        - `role`: Thiết kế UI & chốt đơn
        - `from`: 2020-03
        - `to`: 2021-01
        - `summary`: Thiết kế cửa hàng trực tuyến và kịch bản chăm sóc khách hàng.
        - `results`:
          - Tỷ lệ chốt đơn tăng 22%
          - Doanh thu tháng cao nhất gấp 3 lần
      - **Bảng điều khiển cho startup logistics**
        - `type`: freelance
        - `org`: Bảng điều khiển cho startup logistics
        - `role`: Thiết kế sản phẩm
        - `from`: 2021-05
        - `to`: 2022-08
        - `summary`: Thiết kế bảng điều khiển theo dõi đơn hàng cho startup logistics.
        - `results`:
          - Gọi vốn thành công vòng hạt giống
          - Rút ngắn 50% thời gian theo dõi đơn
      - **Công ty Công nghệ A**
        - `type`: employment
        - `org`: Công ty Công nghệ A
        - `role`: Senior UI/UX Designer
        - `from`: 2022-03
        - `summary`: Dẫn dắt thiết kế cho nhóm sản phẩm, xây dựng design system và phối hợp chặt với kỹ sư, kinh doanh.
        - `results`:
          - Design system dùng chung cho 4 sản phẩm
          - Giảm 30% thời gian bàn giao thiết kế
          - Hướng dẫn 3 designer mới
      - **Website thương hiệu nội thất**
        - `type`: freelance
        - `org`: Website thương hiệu nội thất
        - `role`: Thiết kế web & thương hiệu
        - `from`: 2023-02
        - `to`: 2023-11
        - `summary`: Thiết kế website giới thiệu và bộ nhận diện cho thương hiệu nội thất.
        - `results`:
          - Tăng 2,5 lần lượng yêu cầu báo giá
          - Ra mắt đúng hạn sau 9 tháng
      - **Ứng dụng đặt lịch cho phòng khám**
        - `type`: freelance
        - `org`: Ứng dụng đặt lịch cho phòng khám
        - `role`: Thiết kế UI/UX
        - `from`: 2024-01
        - `summary`: Thiết kế lại luồng đặt lịch và trang quản trị cho chuỗi phòng khám.
        - `results`:
          - Giảm 40% cuộc gọi đặt lịch
          - Bàn giao bộ thiết kế cho đội phát triển

---

## 10. TOÀN BỘ NỘI DUNG SITE — TIẾNG ANH

### Thông tin site & SEO (`site`)

- `url`: https://portfolio-pi-eight-jsed3pl308.vercel.app
- `lang`: en
- `title`: Your Name — Designer & UI/UX
- `description`: Portfolio of Your Name: interface design, user experience and project management for teams that need products shipped fast.
- `ogImage`: /assets/images/og.png
- `themeColor`: #121212

### Thương hiệu / tên (`brand`)

- `logo`: Your Name
- `logoMark`: .
- `nameLines`:
  - Your
  - Name

### Thanh điều hướng (`nav`)

- **Work**
  - `key`: work
  - `label`: Work
- **Services**
  - `key`: services
  - `label`: Services
- **About**
  - `key`: about
  - `label`: About

### Nút Đặt lịch (`cta`)

- `label`: Let’s talk
- `href`: https://calendar.google.com/calendar/appointments/schedules/AcZssZ18syupBON0_UFEN60jA8gFMKqLlLQX-qQd_hAcH8oESr2hEnPw7HJwTU_jK3L5KWwtVgHjjfMf
- `booking`:
  - `title`: Book a *call*
  - `intro`: Pick a time that suits you. You'll get a confirmation email and a Google Calendar invite.
  - `newTab`: Open the booking page in a new tab

### Trang chủ — Hero (`hero`)

- `lines`:
  - **#1**
    - `text`: Design that helps
    - `style`: sans
  - **#2**
    - `text`: your product
    - `style`: serif
    - `align`: right
  - **#3**
    - `text`: ship fast
    - `style`: sans
    - `cta`: true
- `headlineSr`: Design that helps your product ship fast
- `tagLeft`: Designer, UI/UX and project management — from wireframe to handoff.
- `tagRight`: For teams that need to reach the market fast without cutting quality.

### Trang chủ — Câu giới thiệu (About statement) (`about`)

- `statement`: I work where design, data and operations meet. [[gem]] Every __product__ starts with understanding users, goes through short test loops and ends with a clean handoff. [[clover]] The result is a clear interface, a faster team and clients who see the __value__ from the very first version. [[burst]]
- `portrait`: /assets/images/portrait.jpg
- `portraitAlt`: Ảnh chân dung của Tên Bạn

### Trang chủ — Showreel (`reel`)

- `label`: Watch showreel
- `marquee`: Watch showreel
- `video`: /assets/video/reel.webm
- `poster`: /assets/images/reel-poster.svg
- `playLabel`: Play video
- `pauseLabel`: Pause video

### Trang chủ — Số liệu (`stats`)

- **Designing digital products**
  - `value`: 5
  - `suffix`: +
  - `unit`: Years
  - `label`: Designing digital products
- **Delivered across many industries**
  - `value`: 60
  - `suffix`: +
  - `unit`: Projects
  - `label`: Delivered across many industries
- **Came back for a second project**
  - `value`: 40
  - `suffix`: +
  - `unit`: Clients
  - `label`: Came back for a second project

### Dịch vụ (khối trang chủ + danh sách dịch vụ) (`services`)

- `title`: *Services* for better products
- `tagline`: Six disciplines, one accountable partner — from rough idea to a product people actually use.
- `button`:
  - `label`: View services
- `audience`:
  - `label`: Who I build for
  - `textA`: From established companies to first-time founders, I hold the same standard for both.
  - `textB`: Products that launch fast, fit the need and scale easily.
- `soon`:
  - `title`: Webflow development
  - `label`: Coming soon
- `items`:
  - **UI design**
    - `slug`: ui-design
    - `icon`: layout
    - `title`: UI design
    - `text`: Consistent web and app interfaces, ready for development.
    - `long`: The interface is where your product meets people. I design clear, consistent screens that are ready for development, so engineers never have to guess.
    - `deliverables`:
      - Web and app interface design
      - Grid and typography system
      - States and micro-interactions
      - Developer-ready handoff files
      - Pre-launch review
      - Support during build
    - `image`: /assets/images/project-1.svg
    - `imageAlt`: Illustration
    - `badge`: AI-powered workflow
  - **Research & UX**
    - `slug`: research-ux
    - `icon`: compass
    - `title`: Research & UX
    - `text`: Interviews, user flows and data-backed wireframes.
    - `long`: Before drawing, I ask. Interviews, real behavior and user flows make sure every decision has a reason.
    - `deliverables`:
      - User interviews
      - Journey mapping
      - User flows
      - Wireframes
      - Usability testing
      - Findings report
    - `image`: /assets/images/project-2.svg
    - `imageAlt`: Illustration
    - `badge`: AI-accelerated
  - **Design system**
    - `slug`: design-system
    - `icon`: layers
    - `title`: Design system
    - `text`: A component kit that keeps the team fast and aligned.
    - `long`: One shared component kit keeps the team fast and the product consistent as it grows.
    - `deliverables`:
      - Interface audit
      - Color, type, spacing
      - Component library
      - Usage guidelines
      - Developer documentation
      - Update workflow
    - `image`: /assets/images/project-3.svg
    - `imageAlt`: Illustration
  - **Project management**
    - `slug`: project-management
    - `icon`: calendar
    - `title`: Project management
    - `text`: Planning, progress tracking and on-time delivery.
    - `long`: I keep projects on track: clear tasks, owners and deadlines, with early warnings when risk shows up.
    - `deliverables`:
      - Roadmap and milestones
      - Task breakdown and priorities
      - Short sync meetings
      - Risk tracking
      - Weekly progress reports
      - Post-project review
    - `image`: /assets/images/project-4.svg
    - `imageAlt`: Illustration
  - **Consulting & sales**
    - `slug`: consulting-sales
    - `icon`: message
    - `title`: Consulting & sales
    - `text`: From quoting and closing scripts to after-sales care.
    - `long`: Good design also has to sell. I support you from quoting and closing scripts to after-sales care.
    - `deliverables`:
      - Product direction advice
      - Quotes and scope
      - Client conversation scripts
      - Pitch materials
      - After-sales care
      - Improvement proposals
    - `image`: /assets/images/project-1.svg
    - `imageAlt`: Illustration
    - `badge`: Chat & email
  - **Essential branding**
    - `slug`: branding
    - `icon`: spark
    - `title`: Essential branding
    - `text`: Logo, color and a lean identity for a new brand.
    - `long`: A lean identity is enough to make a new brand look trustworthy from day one.
    - `deliverables`:
      - Logo and variants
      - Color palette
      - Type and usage rules
      - Social templates
      - Document templates
      - Short brand guide
    - `image`: /assets/images/project-2.svg
    - `imageAlt`: Illustration

### Dự án (danh sách + case study) (`work`)

- `title`: Selected work
- `linkLabel`: View project
- `soonLabel`: Coming soon
- `next`: Next project
- `items`:
  - **Project 01**
    - `slug`: project-01
    - `title`: Project 01
    - `industry`: E-commerce
    - `tags`:
      - Product design
      - UX research
      - Brand strategy
    - `status`: live
    - `image`: /assets/images/project-1.svg
    - `image2`: /assets/images/project-1b.svg
    - `alt`: Illustration for Project 01
    - `detail`:
      - `meta`:
        - **Client**
          - `label`: Client
          - `value`: Sample client
        - **Year**
          - `label`: Year
          - `value`: 2025
        - **Role**
          - `label`: Role
          - `value`: Product design, UX research, Brand strategy
        - **Industry**
          - `label`: Industry
          - `value`: E-commerce
      - `intro`:
        - `title`: A product *too complex* to use
        - `text`: Sample description for Project 01: the context, the problem the client faced and why the project mattered. Replace with your real story.
      - `sections`:
        - **Make the complexity *disappear***
          - `title`: Make the complexity *disappear*
          - `text`: Describe the approach: what you researched, which principles you set and how you tested them.
          - `bullets`:
            - One clear goal for the whole product
            - See the key state at a glance
            - Scale without relearning
          - `images`:
            - /assets/images/project-1.svg
        - **One grammar for the *whole product***
          - `title`: One grammar for the *whole product*
          - `text`: Describe the design system, components and rules that made the team fast and consistent.
          - `bullets`:
            - Shared component kit
            - Spacing and type rules
            - Developer documentation
          - `images`:
            - /assets/images/project-1.svg
            - /assets/images/project-1b.svg
        - **The decisions that *mattered***
          - `title`: The decisions that *mattered*
          - `text`: Tell the story of two or three hard decisions and why you made them.
          - `images`:
            - /assets/images/project-1b.svg
      - `result`:
        - `title`: Deep, but *calm*
        - `text`: Measured outcome: numbers, client feedback and what you learned.
  - **Project 02**
    - `slug`: project-02
    - `title`: Project 02
    - `industry`: Education
    - `tags`:
      - Product design
      - UX research
    - `status`: live
    - `image`: /assets/images/project-2.svg
    - `image2`: /assets/images/project-2b.svg
    - `alt`: Illustration for Project 02
    - `detail`:
      - `meta`:
        - **Client**
          - `label`: Client
          - `value`: Sample client
        - **Year**
          - `label`: Year
          - `value`: 2025
        - **Role**
          - `label`: Role
          - `value`: Product design, UX research
        - **Industry**
          - `label`: Industry
          - `value`: Education
      - `intro`:
        - `title`: A product *too complex* to use
        - `text`: Sample description for Project 02: the context, the problem the client faced and why the project mattered. Replace with your real story.
      - `sections`:
        - **Make the complexity *disappear***
          - `title`: Make the complexity *disappear*
          - `text`: Describe the approach: what you researched, which principles you set and how you tested them.
          - `bullets`:
            - One clear goal for the whole product
            - See the key state at a glance
            - Scale without relearning
          - `images`:
            - /assets/images/project-2.svg
        - **One grammar for the *whole product***
          - `title`: One grammar for the *whole product*
          - `text`: Describe the design system, components and rules that made the team fast and consistent.
          - `bullets`:
            - Shared component kit
            - Spacing and type rules
            - Developer documentation
          - `images`:
            - /assets/images/project-2.svg
            - /assets/images/project-2b.svg
        - **The decisions that *mattered***
          - `title`: The decisions that *mattered*
          - `text`: Tell the story of two or three hard decisions and why you made them.
          - `images`:
            - /assets/images/project-2b.svg
      - `result`:
        - `title`: Deep, but *calm*
        - `text`: Measured outcome: numbers, client feedback and what you learned.
  - **Project 03**
    - `slug`: project-03
    - `title`: Project 03
    - `industry`: Finance
    - `tags`:
      - Product design
      - Design system
    - `status`: live
    - `image`: /assets/images/project-3.svg
    - `image2`: /assets/images/project-3b.svg
    - `alt`: Illustration for Project 03
    - `detail`:
      - `meta`:
        - **Client**
          - `label`: Client
          - `value`: Sample client
        - **Year**
          - `label`: Year
          - `value`: 2025
        - **Role**
          - `label`: Role
          - `value`: Product design, Design system
        - **Industry**
          - `label`: Industry
          - `value`: Finance
      - `intro`:
        - `title`: A product *too complex* to use
        - `text`: Sample description for Project 03: the context, the problem the client faced and why the project mattered. Replace with your real story.
      - `sections`:
        - **Make the complexity *disappear***
          - `title`: Make the complexity *disappear*
          - `text`: Describe the approach: what you researched, which principles you set and how you tested them.
          - `bullets`:
            - One clear goal for the whole product
            - See the key state at a glance
            - Scale without relearning
          - `images`:
            - /assets/images/project-3.svg
        - **One grammar for the *whole product***
          - `title`: One grammar for the *whole product*
          - `text`: Describe the design system, components and rules that made the team fast and consistent.
          - `bullets`:
            - Shared component kit
            - Spacing and type rules
            - Developer documentation
          - `images`:
            - /assets/images/project-3.svg
            - /assets/images/project-3b.svg
        - **The decisions that *mattered***
          - `title`: The decisions that *mattered*
          - `text`: Tell the story of two or three hard decisions and why you made them.
          - `images`:
            - /assets/images/project-3b.svg
      - `result`:
        - `title`: Deep, but *calm*
        - `text`: Measured outcome: numbers, client feedback and what you learned.
  - **Project 04**
    - `slug`: project-04
    - `title`: Project 04
    - `industry`: Real estate
    - `tags`:
      - Product design
    - `status`: soon
    - `image`: /assets/images/project-4.svg
    - `image2`: /assets/images/project-4b.svg
    - `alt`: Illustration for Project 04
    - `detail`:
      - `meta`:
        - **Client**
          - `label`: Client
          - `value`: Sample client
        - **Year**
          - `label`: Year
          - `value`: 2025
        - **Role**
          - `label`: Role
          - `value`: Product design
        - **Industry**
          - `label`: Industry
          - `value`: Real estate
      - `intro`:
        - `title`: A product *too complex* to use
        - `text`: Sample description for Project 04: the context, the problem the client faced and why the project mattered. Replace with your real story.
      - `sections`:
        - **Make the complexity *disappear***
          - `title`: Make the complexity *disappear*
          - `text`: Describe the approach: what you researched, which principles you set and how you tested them.
          - `bullets`:
            - One clear goal for the whole product
            - See the key state at a glance
            - Scale without relearning
          - `images`:
            - /assets/images/project-4.svg
        - **One grammar for the *whole product***
          - `title`: One grammar for the *whole product*
          - `text`: Describe the design system, components and rules that made the team fast and consistent.
          - `bullets`:
            - Shared component kit
            - Spacing and type rules
            - Developer documentation
          - `images`:
            - /assets/images/project-4.svg
            - /assets/images/project-4b.svg
        - **The decisions that *mattered***
          - `title`: The decisions that *mattered*
          - `text`: Tell the story of two or three hard decisions and why you made them.
          - `images`:
            - /assets/images/project-4b.svg
      - `result`:
        - `title`: Deep, but *calm*
        - `text`: Measured outcome: numbers, client feedback and what you learned.

### Khối "Muốn xem thêm" (`worksCta`)

- `line1`: Want to see
- `line2a`: how I
- `line2b`: enable
- `line3`: companies?
- `text`: A few projects I’m proud of, built with large companies and independent partners alike.
- `label`: View all works

### Lời nhận xét (`testimonials`)

- `title`: What people *have to say*
- `text`: Curious what it’s really like to work with me? Don’t take my word for it. Here’s what my clients say.
- `prev`: Previous testimonial
- `next`: Next testimonial
- `items`:
  - **Alex Nguyen**
    - `quote`: Sample testimonial — replace with a real client quote.
    - `name`: Alex Nguyen
    - `role`: Director, Company A
  - **Bao Tran**
    - `quote`: Sample testimonial — professional, delivered on time.
    - `name`: Bao Tran
    - `role`: Founder, Startup B
  - **Chi Le**
    - `quote`: Sample testimonial — a nicer and easier interface than expected.
    - `name`: Chi Le
    - `role`: Head of Product, Company C

### Câu trích dẫn (`quote`)

- `line1`: Design to scale
- `line2`: & drive experiences
- `line3`: with data

### Đối tác (`partners`)

- `title`: Valuable *Partners*
- `text`: Trusted by teams from pre-seed start-ups to the Fortune 500.
- `items`:
  - **Partner 01**
    - `name`: Partner 01
  - **Partner 02**
    - `name`: Partner 02
  - **Partner 03**
    - `name`: Partner 03
  - **Partner 04**
    - `name`: Partner 04
  - **Partner 05**
    - `name`: Partner 05
  - **Partner 06**
    - `name`: Partner 06
  - **Partner 07**
    - `name`: Partner 07
  - **Partner 08**
    - `name`: Partner 08
  - **Partner 09**
    - `name`: Partner 09
  - **Partner 10**
    - `name`: Partner 10

### Liên hệ, form, mạng xã hội (`contact`)

- `title`: Get in touch
- `text`: I build products that move people, and move the business.
- `email`: hello@example.com
- `writeLabel`: Prefer to write? Send a note.
- `button`:
  - `label`: Contact
- `socials`:
  - **Zalo**
    - `label`: Zalo
    - `icon`: zalo
    - `href`: https://zalo.me/your-number
  - **LinkedIn**
    - `label`: LinkedIn
    - `icon`: linkedin
    - `href`: https://www.linkedin.com/in/your-profile
  - **Behance**
    - `label`: Behance
    - `icon`: behance
    - `href`: https://www.behance.net/your-profile
  - **Dribbble**
    - `label`: Dribbble
    - `icon`: dribbble
    - `href`: https://dribbble.com/your-profile
  - **Email**
    - `label`: Email
    - `icon`: mail
    - `href`: mailto:hello@example.com
- `form`:
  - `title`: You need a *partner*?
  - `intro`: Tell me what you’re building, and where it’s stuck. I read every note myself and reply within a day or two, no bots in between.
  - `close`: Close
  - `name`: Your name
  - `email`: Email
  - `contact`: Zalo or LinkedIn
  - `company`: Company name
  - `lookingFor`: You are looking for?
  - `options`:
    - UI design
    - Research & UX
    - Design system
    - Project management
    - Consulting & sales
    - Branding
    - Other
  - `message`: Tell me more about the project
  - `submit`: Send
  - `sending`: Sending…
  - `success`: Sent! I’ll reply soon.
  - `error`: Couldn’t send, please try again.
  - `invalid`: Please fill in the required fields (*) and pick at least one option.

### Footer (`footer`)

- `copyright`: Your Name. All rights reserved.
- `legal`:
  - **Privacy policy**
    - `label`: Privacy policy
    - `href`: #
  - **Terms & Conditions**
    - `label`: Terms & Conditions
    - `href`: #

### Chữ giao diện (nút, nhãn) (`ui`)

- `toggleTheme`: Toggle light/dark theme
- `openMenu`: Open menu
- `closeMenu`: Close menu
- `skip`: Skip to main content
- `home`: Home
- `statsLabel`: Key numbers
- `langCode`: VI
- `langName`: Chuyển sang tiếng Việt
- `reach`: Reach out
- `loading`: Loading

### Các trang con: Dự án, Dịch vụ, Giới thiệu (gồm Kinh nghiệm) (`pages`)

- `work`:
  - `title`: Curated *design work* that works
  - `text`: Real products, shipped for real teams. Case studies, not mood boards.
  - `seoTitle`: Work
- `services`:
  - `seoTitle`: Services
  - `h1`: Strategy, design, and execution. *Without the agency overhead.*
  - `lead`: Six disciplines, one accountable partner. I work with founders and scaling teams who need quality output at start-up speed — using AI to cut timelines without cutting corners on craft.
  - `expect`: What to expect
  - `bag`: What’s in the bag
  - `principlesTitle`: After 5+ years and many shipped products, *a few things have become non-negotiable*
  - `principles`:
    - **Product focus**
      - `title`: Product focus
      - `text`: A beautiful interface nobody understands is a failure. Every decision starts with the product and its users.
    - **Co-founder mentality**
      - `title`: Co-founder mentality
      - `text`: I care about the outcome like an insider: I’ll say so when a direction looks off, before you ship.
    - **Proven delivery**
      - `title`: Proven delivery
      - `text`: Years of shipping for start-ups and enterprises alike. The process is battle-tested, so the work lands on time and holds up in production.
    - **Start-up pace**
      - `title`: Start-up pace
      - `text`: Test early, fix early, hand off clean. AI shortens the timeline without cutting corners on craft.
  - `quoteBand`: Good design *looks obvious*
  - `metricsTitle`: Numbers that mean something. *Here’s what the work has actually produced.*
  - `expand`: Expand
  - `metricItems`:
    - **Pro-bonos completed**
      - `value`: 04
      - `label`: Pro-bonos completed
    - **Key domain areas of knowledge**
      - `value`: +5
      - `label`: Key domain areas of knowledge
    - **Money raised by my partners**
      - `value`: 23M
      - `label`: Money raised by my partners
    - **Client satisfaction rate based on post-project surveys.**
      - `value`: 97%
      - `label`: Client satisfaction rate based on post-project surveys.
    - **Products used worldwide by satisfied users**
      - `value`: 111M
      - `label`: Products used worldwide by satisfied users
    - **Average time to market reduced due to AI streamlined design process.**
      - `value`: 38%
      - `label`: Average time to market reduced due to AI streamlined design process.
- `about`:
  - `seoTitle`: About
  - `h1a`: Most designers ship decks.
  - `h1b`: I ship *products*
  - `lead`: I’ve been building digital products for years, back when “AI” meant autocorrect. Now I use it to deliver for founders and businesses in days what agencies quote in months.
  - `portrait`: /assets/images/portrait.jpg
  - `portraitAlt`: Portrait
  - `fast`:
    - `title`: Fast, focused, *AI-native*
    - `text`:
      - Product design is about solving the right problem, then executing it without ceremony.
      - I work with early-stage companies and scaling teams that need decisions made, not workshopped. My process is built around fast delivery, from strategy to handoff, without the two-week kick-off theater.
      - I’ve shipped products across SaaS, fintech and consumer apps. The tools have changed. The discipline hasn’t.
  - `tools`:
    - `title`: Tools stack *powering my work*
    - `text`: My work runs on a diverse stack of tools ranging from design systems and collaboration to automation and AI. They help me work smarter, scale faster and go beyond expectations. The stack is always evolving.
    - `all`: All
    - `items`:
      - **Figma**
        - `name`: Figma
        - `cat`: Design
      - **Notion**
        - `name`: Notion
        - `cat`: Productivity
      - **Slack**
        - `name`: Slack
        - `cat`: Communication
      - **Calendly**
        - `name`: Calendly
        - `cat`: Scheduling
      - **Webflow**
        - `name`: Webflow
        - `cat`: Website Building
      - **Keynote**
        - `name`: Keynote
        - `cat`: Presentations
      - **Mailchimp**
        - `name`: Mailchimp
        - `cat`: Marketing
      - **Drive**
        - `name`: Drive
        - `cat`: Productivity
      - **Jitter**
        - `name`: Jitter
        - `cat`: Design
      - **Stripe**
        - `name`: Stripe
        - `cat`: Marketing
      - **Claude**
        - `name`: Claude
        - `cat`: AI
      - **Cloudflare**
        - `name`: Cloudflare
        - `cat`: Security
  - `principles`:
    - `title`: Different isn’t a promise. *Here’s what it actually means*
    - `items`:
      - **No theater.**
        - `title`: No theater.
        - `text`: No decks that never ship. Every deliverable has a job — if it doesn’t, it doesn’t get made.
      - **No black holes.**
        - `title`: No black holes.
        - `text`: You’ll always know where we are, what’s blocked, and what I actually think — including when I think we’re solving the wrong problem.
      - **AI in the room.**
        - `title`: AI in the room.
        - `text`: I use AI across the entire process — faster research, validation and prototypes. The craft stays human.
      - **I’ll tell you when it’s wrong.**
        - `title`: I’ll tell you when it’s wrong.
        - `text`: If something’s off — structurally, strategically, visually — I’ll say so before you ship it, not after.
      - **Skin in the game.**
        - `title`: Skin in the game.
        - `text`: Your runway is real. I work with the urgency of someone who cares whether this succeeds.
      - **You talk to me.**
        - `title`: You talk to me.
        - `text`: No account managers. No relays. You work directly with the person doing the work.
  - `photos`:
    - **#1**
      - `src`: /assets/images/project-1.svg
      - `alt`: Working photo
    - **#2**
      - `src`: /assets/images/project-3b.svg
      - `alt`: Working photo
  - `awards`:
    - `title`: Certifications, awards *& press*
    - `types`:
      - `cert`: Certification
      - `award`: Award
      - `pub`: Publication
    - `items`:
      - **Nielsen Norman Group UXC**
        - `name`: Nielsen Norman Group UXC
        - `type`: cert
        - `topic`: UX Management
      - **Uxcel**
        - `name`: Uxcel
        - `type`: cert
        - `topic`: Service Design
      - **Behance UI/UX**
        - `name`: Behance UI/UX
        - `type`: award
        - `topic`: Product design
      - **Behance Digital Arts**
        - `name`: Behance Digital Arts
        - `type`: award
        - `topic`: Digital Arts
      - **Abduzeedo**
        - `name`: Abduzeedo
        - `type`: pub
        - `topic`: Digital Arts
      - **GoGuide**
        - `name`: GoGuide
        - `type`: pub
        - `topic`: Digital Arts
    - `colCert`: Certifications
    - `colMore`: Awards & press
  - `closing`:
    - `a`: Your *next product* is
    - `b`: already behind schedule.
    - `c`: Let’s get to
    - `btn`: Work
  - `dither`: /assets/images/portrait-dither-2.png
  - `clean`: /assets/images/portrait-clean-2.webp
  - `experience`:
    - `title`: Work *experience*
    - `lead`: Two tracks that run in parallel: employment contracts, and freelance projects taken on during the same periods.
    - `lanes`:
      - `employment`: Employment
      - `freelance`: Freelance
    - `all`: All
    - `now`: Present
    - `chartLabel`: Timeline of work across two tracks: employment and freelance
    - `units`:
      - `y`: yr
      - `m`: mo
    - `resultsLabel`: Results
    - `during`: Freelance during this time
    - `solo`: Freelance outside employment
    - `projects`: projects
    - `items`:
      - **Media Company C**
        - `type`: employment
        - `org`: Media Company C
        - `role`: UI Designer
        - `from`: 2018-03
        - `to`: 2019-05
        - `summary`: Designed web interfaces and digital collateral for brand clients.
        - `results`:
          - Delivered 25+ interface projects
          - Built the company's first component library
      - **Online course landing page**
        - `type`: freelance
        - `org`: Online course landing page
        - `role`: Design & sales consulting
        - `from`: 2018-08
        - `to`: 2019-03
        - `summary`: Designed the landing page and consulting script for an online course.
        - `results`:
          - 7.4% conversion rate
          - 300+ students in the first cohort
      - **Solutions Company B**
        - `type`: employment
        - `org`: Solutions Company B
        - `role`: Product Designer
        - `from`: 2019-06
        - `to`: 2022-02
        - `summary`: Designed the experience of web and mobile apps, from user research to testing.
        - `results`:
          - 18% higher sign-up completion
          - Launched 2 mobile apps
          - Standardised the user research process
      - **Event collateral set**
        - `type`: freelance
        - `org`: Event collateral set
        - `role`: Graphic design
        - `from`: 2019-09
        - `to`: 2020-02
        - `summary`: Designed an identity collateral set for an annual event series.
        - `results`:
          - 60+ pieces delivered
          - Invited back by the organiser
      - **Fashion online store**
        - `type`: freelance
        - `org`: Fashion online store
        - `role`: UI design & closing scripts
        - `from`: 2020-03
        - `to`: 2021-01
        - `summary`: Designed the online store and the customer-care scripts.
        - `results`:
          - 22% higher close rate
          - Best month revenue 3x
      - **Logistics startup dashboard**
        - `type`: freelance
        - `org`: Logistics startup dashboard
        - `role`: Product design
        - `from`: 2021-05
        - `to`: 2022-08
        - `summary`: Designed an order-tracking dashboard for a logistics startup.
        - `results`:
          - Closed their seed round
          - 50% faster order tracking
      - **Tech Company A**
        - `type`: employment
        - `org`: Tech Company A
        - `role`: Senior UI/UX Designer
        - `from`: 2022-03
        - `summary`: Lead design for the product team, build the design system and work closely with engineering and sales.
        - `results`:
          - Shared design system across 4 products
          - 30% faster design handoff
          - Mentored 3 new designers
      - **Furniture brand website**
        - `type`: freelance
        - `org`: Furniture brand website
        - `role`: Web & brand design
        - `from`: 2023-02
        - `to`: 2023-11
        - `summary`: Designed the marketing site and identity for a furniture brand.
        - `results`:
          - 2.5x more quote requests
          - Shipped on time after 9 months
      - **Clinic booking app**
        - `type`: freelance
        - `org`: Clinic booking app
        - `role`: UI/UX design
        - `from`: 2024-01
        - `summary`: Redesigned the booking flow and admin dashboard for a clinic chain.
        - `results`:
          - 40% fewer booking calls
          - Design handoff to the dev team
