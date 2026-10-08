# Portfolio cá nhân (nhiều trang, song ngữ)

Website portfolio dựng bằng **Vite + HTML/CSS/JS thuần** (không framework), gồm:

- Trang chủ, **Work** (danh sách dự án), **Services**, **About** và trang **chi tiết từng dự án**
- **Hai ngôn ngữ**: Tiếng Việt (mặc định, ở `/`) và Tiếng Anh (ở `/en/`), có nút chuyển **VI / EN** trên thanh nav
- Preloader đếm phần trăm, hiệu ứng chuyển trang, cuộn mượt, con trỏ tuỳ chỉnh, theme sáng/tối

Bố cục, nhịp điệu và hiệu ứng lấy cảm hứng từ một trang portfolio tham khảo; toàn bộ chữ, ảnh, logo là **placeholder của bạn** — thay bằng nội dung thật.

**Vì sao chọn stack này:** xuất ra file tĩnh (Vercel/Netlify/GitHub Pages đều được), mỗi trang được dựng sẵn HTML nên tốt cho SEO, JS nhẹ, dễ đạt Lighthouse ≥ 90.

## Chạy dự án

```bash
npm install
npm run dev       # chạy thử, tự tải lại khi sửa content/*.json
npm run build     # xuất bản tĩnh vào thư mục dist/
npm run preview   # xem bản build
```

Cần Node 18+. Các file HTML điểm vào (`index.html`, `work/`, `en/`…) được **tự sinh** khi chạy dev/build từ `templates/page.html` và `content/*.json`, nên không cần sửa và không commit.

## Cấu trúc thư mục

```
content/
  vi.json             ← NỘI DUNG TIẾNG VIỆT (toàn bộ chữ, link, đường dẫn ảnh)
  en.json             ← NỘI DUNG TIẾNG ANH (cùng cấu trúc với vi.json)
templates/page.html   ← khung HTML chung cho mọi trang
scripts/
  site.js             ← danh sách trang, ngôn ngữ, dựng HTML từng trang
  render.js           ← các khối của trang chủ + nav, footer, form, preloader
  pages.js            ← Work, Services, About, chi tiết dự án
  main.js             ← điểm vào, khởi tạo các hiệu ứng
  transition.js       ← preloader + chuyển trang
  hero-stripes.js     ← nền sọc động ở hero (WebGL)
  contact-api.js      ← NƠI GẮN FORM THẬT (đang là hàm giả lập)
  …                   ← mỗi hiệu ứng một file nhỏ
styles/
  tokens.css          ← design tokens: màu, cỡ chữ, spacing, radius, font
  base.css nav.css hero.css sections.css pages.css footer.css overlay.css
public/
  assets/images/      ← ảnh (dự án, chân dung, poster, og.png)
  assets/logos/       ← logo đối tác
  assets/video/reel.webm ← video showreel
  favicon.svg
vercel.json           ← cấu hình deploy Vercel
```

## Địa chỉ các trang

| Trang | Tiếng Việt | Tiếng Anh |
| --- | --- | --- |
| Trang chủ | `/` | `/en/` |
| Dự án | `/work/` | `/en/work/` |
| Dịch vụ | `/services/` (mỗi dịch vụ có `#slug`) | `/en/services/` |
| Giới thiệu | `/about/` | `/en/about/` |
| Chi tiết dự án | `/work/<slug>/` | `/en/work/<slug>/` |

Trang chi tiết dự án được tạo tự động cho mỗi phần tử trong `work.items` (theo `slug`). Dự án có `"status": "soon"` hiện "Sắp ra mắt" và không có trang riêng.

## Trang quản trị nội dung (/admin)

Sửa nội dung bằng form, không cần đụng JSON: mở **https://portfolio-pi-eight-jsed3pl308.vercel.app/admin/**, đăng nhập GitHub, chọn **Tiếng Việt** hoặc **Tiếng Anh**, sửa rồi bấm **Công bố → Công bố ngay**. Mỗi lần công bố là một commit lên `main`; Vercel đăng bản mới sau 1–2 phút. Ảnh tải lên nằm trong `public/assets/images/`.

- Dùng [Decap CMS](https://decapcms.org) (`public/admin/index.html`, cấu hình form ở `public/admin/config.yml`). Đăng nhập qua 2 hàm Vercel `api/auth.js` và `api/callback.js` (GitHub OAuth).
- **Cài một lần:** tạo GitHub OAuth App (Settings → Developer settings → OAuth Apps → New): Homepage URL = địa chỉ site, Authorization callback URL = `<địa chỉ site>/api/callback`. Trên Vercel (Settings → Environment Variables) thêm `OAUTH_GITHUB_CLIENT_ID` và `OAUTH_GITHUB_CLIENT_SECRET`, rồi Redeploy. Chỉ tài khoản có quyền ghi vào repo mới lưu được.
- **Chạy thử trên máy:** `npx decap-server` (trong thư mục repo) + `npm run dev`, mở `http://localhost:5173/admin/` → bấm Đăng nhập (sửa thẳng file, không cần GitHub).
- Thêm trường mới vào `content/*.json` thì phải khai báo thêm trong `config.yml` (form chỉ hiện trường đã khai báo; các trường khác vẫn được giữ nguyên khi lưu).
- Đổi tên miền: sửa `base_url`, `site_url`, `display_url` trong `config.yml` và callback URL của OAuth App.

## Cách thay nội dung (sửa trực tiếp file)

Sửa `content/vi.json` và `content/en.json` (cùng cấu trúc; nhớ sửa cả hai). Các khối chính:

| Khối | Là gì |
| --- | --- |
| `site` | Title, description, ảnh chia sẻ (Open Graph), **`url` thật của bạn** (dùng cho sitemap/canonical/hreflang) |
| `brand`, `nav`, `cta` | Logo chữ, tên hiện khi tải trang (`nameLines`), menu, nút CTA chính (link Calendly/Zalo) |
| `hero`, `about.statement`, `reel`, `stats` | Các khối trang chủ |
| `services.items` | Mỗi dịch vụ: `slug`, `icon`, `title`, `text` (ngắn), `long` (trang Services), `deliverables` (danh sách), `image` |
| `work.items` | Mỗi dự án: `slug`, `title`, `industry`, `tags`, `status`, `image`, `image2`, và `detail` (thông tin, các phần case study) |
| `pages.work / services / about` | Nội dung riêng của các trang con (tiêu đề, nguyên tắc, công cụ, giải thưởng…) |
| `worksCta`, `testimonials`, `quote`, `partners` | Các khối còn lại của trang chủ |
| `contact`, `footer`, `ui` | Email, mạng xã hội, form, link pháp lý, chữ giao diện |

Trong chuỗi, `*từ*` thành chữ serif nghiêng; ở `about.statement` còn dùng `__gạch chân__` và `[[gem]]` `[[clover]]` `[[burst]]` (hình nhỏ chèn giữa câu).

### Thêm một ngôn ngữ khác
Copy `content/en.json` thành `content/<mã>.json`, dịch, rồi thêm mã vào mảng `LANGS` trong `scripts/site.js` (và sửa chuỗi `langCode`/`langName` trong `ui`).

### Đổi màu, chữ, khoảng cách
Sửa `styles/tokens.css`. Màu nhấn duy nhất là `--accent` (xanh neon `#6fff54`); nếu muốn `#22C55E` thì đổi đúng một dòng đó.

### Ảnh
- Ảnh hiện tại là placeholder. Thay bằng ảnh **WebP/AVIF** rồi sửa đường dẫn trong `content/*.json`. Ảnh đã bật `loading="lazy"`; nhớ điền `alt`.
- Ảnh chân dung (`about.portrait`) hiện ở trang About dưới dạng chấm điểm (halftone) và trong công tắc ở phần CTA.
- Logo đối tác: bỏ file vào `public/assets/logos/` rồi điền `logo` trong `partners.items`. Để trống thì hiện tên.

### Video showreel
Thay `public/assets/video/reel.webm` (nên ≤ 5MB, muted, lặp). Video chỉ tải khi người xem bấm phát.

### Form liên hệ
Giao diện và trạng thái (đang gửi / thành công / lỗi) đã có. Để gắn thật, mở `scripts/contact-api.js` và thay hàm `sendMessage` bằng lời gọi tới Formspree, Netlify Forms, Resend hoặc API riêng.

## Hiệu ứng và truy cập

- **Preloader** (lần đầu trong một phiên): logo, ảnh dự án đổi liên tục, bộ đếm phần trăm, tên chạy lên từng chữ, rồi màn mở ra. Các lần chuyển trang sau dùng lớp phủ có hiện tên.
- Hero WebGL (desktop): bật khi người dùng bắt đầu rê chuột/cuộn (hoặc sau 6 giây) để không chen vào lúc tải trang. Mobile dùng nền CSS nhẹ.
- `prefers-reduced-motion`: tắt preloader, chuyển trang, cuộn mượt, marquee, hiện dần; hero chỉ vẽ một khung tĩnh.
- Bàn phím: có link "Bỏ qua tới nội dung chính", focus rõ, hộp thoại form đóng bằng `Esc`.
- Theme sáng/tối: mặc định tối, nhớ lựa chọn của người dùng.

## Deploy (Vercel)

1. Đẩy repo lên GitHub.
2. Vào vercel.com → **Add New → Project** → chọn repo → **Deploy** (`vercel.json` đã khai báo build và thư mục `dist`).
3. Sửa `site.url` trong `content/vi.json` và `content/en.json` thành địa chỉ thật để sitemap, canonical và hreflang đúng.

Với **Netlify**: Build command `npm run build`, Publish directory `dist`. Với **GitHub Pages** dùng tên miền riêng hoặc `<user>.github.io` thì giữ nguyên; nếu site nằm ở `/<repo>/` thì phải thêm `base` vào `vite.config.js` và sửa các đường dẫn `/assets/...` cho khớp.

## Danh sách cần thay trước khi công khai

- [ ] Tên, logo chữ, `nameLines`, `site.title`, `site.description`, `site.url` (cả hai ngôn ngữ)
- [ ] Headline, mô tả, câu About (`hero`, `about.statement`)
- [ ] Số liệu (`stats`), dịch vụ (`services.items`)
- [ ] Dự án: tên, ngành, ảnh, và nội dung `detail` của từng dự án (`work.items`)
- [ ] Nội dung các trang con (`pages.*`): nguyên tắc, công cụ, giải thưởng…
- [ ] Lời chứng thực thật (`testimonials`), logo đối tác (`partners`)
- [ ] Link Calendly/Zalo (`cta`), email, mạng xã hội, link pháp lý (`contact`, `footer`)
- [ ] Ảnh chân dung, video `reel.webm` và poster, ảnh chia sẻ `og.png` (1200×630)
- [ ] Gắn form thật (`scripts/contact-api.js`)

## Design system & UI kit

`npm run docs` tạo `docs/ui-kit.html`: một file HTML độc lập (mở offline) gồm màu (kèm tỉ lệ tương phản), chữ, khoảng cách, chuyển động, biểu tượng và toàn bộ thành phần giao diện, lấy trực tiếp từ token, CSS và hàm render của site nên luôn khớp với trang thật.
