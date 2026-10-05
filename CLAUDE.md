# CLAUDE.md — Bàn giao dự án cho Claude

> Đọc file này đầu tiên. Nó cho Claude biết: người dùng là ai, dự án là gì, đã làm gì, quy ước, bẫy đã gặp và việc còn lại.
> Cập nhật file này (mục 9 và 10) cuối mỗi phiên làm việc.

## 1. Người dùng và cách làm việc
- Người dùng nói **tiếng Việt**: luôn trả lời, giải thích, báo trạng thái bằng **tiếng Việt**. Câu hỏi đơn giản thì trả lời ngắn; đi thẳng vào nội dung chính trước, giải thích thêm sau.
- Không chắc thì nói rõ, không đoán mò.
- Người dùng đảm nhiệm nhiều vai (sale, designer, UI/UX, quản lý dự án): đoán vai theo ngữ cảnh câu hỏi.
- Người dùng thường **gửi ảnh chụp màn hình** để chỉ ra điểm khác với trang mẫu. Hãy xem kỹ ảnh, tìm nguyên nhân thật rồi sửa đúng chỗ.
- **Nguyên tắc chính: làm giống trang mẫu (https://kstoimenov.com/). Không tự ý bỏ hoặc đổi khác trang mẫu.** Khi không rõ trang mẫu làm gì, nói rõ phần nào là suy đoán và hỏi lại.
- Khi cần chọn giữa nhiều hướng: nêu 2–3 phương án ngắn, có khuyên dùng, để người dùng chọn (họ thường trả lời "làm A đi").
- **Đây là dự án RIÊNG**, không liên quan và không được lưu chung code với repo `Hotro_HUPH`.

## 2. Dự án là gì
- Website portfolio cá nhân, lấy cảm hứng từ kstoimenov.com (bố cục, nhịp, hiệu ứng) nhưng **không sao chép chữ, logo, ảnh, video, lời nhận xét** của trang mẫu. Toàn bộ nội dung hiện là **nội dung mẫu/giữ chỗ**, người dùng sẽ thay bằng nội dung thật.
- Repo: https://github.com/sonbeveve-hub/portfolio (nhánh làm việc: `main`, đẩy thẳng lên `main`).
- Triển khai: **Vercel** (đã có `vercel.json`). Người dùng tự import repo và deploy. Sau khi có URL thật, thay `site.url` trong `content/vi.json` và `content/en.json` (hiện là `https://example.com`) rồi build lại.
- Hai ngôn ngữ: tiếng Việt ở `/`, tiếng Anh ở `/en/`.
- Các trang: Trang chủ, Dự án (`/work/`), Dịch vụ (`/services/`), Giới thiệu (`/about/`), chi tiết từng dự án (`/work/<slug>/`).

## 3. Công nghệ và cách chạy
- Vite + HTML/CSS/JS thuần (không framework). Phụ thuộc: `lenis` (cuộn mượt), font `@fontsource-variable/inter` và `playfair-display`.
- `npm install` → `npm run dev` (chạy thử) · `npm run build` (ra `dist/`) · `npm run preview` (xem bản build, cổng 4173) · `npm run docs` (tạo `docs/ui-kit.html`).
- **HTML không viết tay.** Lúc cấu hình Vite chạy, các file điểm vào (`/index.html`, `/en/`, `/work/`, `/services/`, `/about/`) được sinh từ `templates/page.html` + `content/*.json`. Các file này nằm trong `.gitignore`, đừng sửa trực tiếp.
- Plugin trong `vite.config.js`: `portfolio-content` (dựng HTML lúc build/dev bằng Node), `inlineCriticalPlugin` (nhúng CSS, preload font), sinh sitemap (có hreflang) và robots. `cssTarget` đặt `['chrome111','safari16.4','firefox113']`.

## 4. Cấu trúc mã
| Đường dẫn | Vai trò |
|---|---|
| `content/vi.json`, `content/en.json` | **Toàn bộ chữ, liên kết, đường dẫn ảnh.** Sửa nội dung ở đây (sửa cả 2 file). |
| `styles/tokens.css` | Design token: màu, cỡ chữ, khoảng cách, bo góc. Đổi toàn site ở đây. |
| `styles/*.css` | base, nav, hero, sections (trang chủ), footer (kèm hộp thoại liên hệ, con trỏ), pages (các trang con), overlay (màn chờ + chuyển trang) |
| `scripts/site.js` | Danh sách ngôn ngữ, trang, hàm `renderDocument` |
| `scripts/render.js` | Hàm dựng HTML dùng chung (nav, thống kê, footer, form, trang chủ...). Có `setContext({lang,prefix,page,alt})` và `href()` thêm tiền tố ngôn ngữ. |
| `scripts/pages.js` | Dựng HTML cho Dự án, Dịch vụ, Giới thiệu (gồm `renderExperience`), chi tiết dự án |
| `scripts/main.js` | Đăng ký mọi hiệu ứng ở trình duyệt |
| `scripts/*.js` còn lại | Hiệu ứng/tương tác: reveal, counters, smooth (Lenis), cursor, magnetic, transition, nav, theme, hero-stripes (WebGL), aportrait (chân dung chấm điểm), accordion, tools, experience, wlist, testimonials, form... |
| `scripts/build-docs.mjs`, `docs-helpers.mjs` | Sinh `docs/ui-kit.html` (design system + UI kit từ token và hàm render thật) |
| `docs/design-system.html` | Tài liệu so sánh design system giữa trang này và trang mẫu |
| `docs/ui-kit.html` | Design system + UI kit của trang này |
| `public/assets/` | Ảnh (`images/`), video (`video/reel.webm`), logo |
| `vercel.json` | Build, thư mục `dist`, cleanUrls, header cache |

## 5. Quy ước nội dung và giao diện
- Trong chuỗi JSON: `*chữ*` → chữ serif nghiêng (nhấn); `__chữ__` → gạch chân; `[[gem|clover|burst|...]]` → hình trang trí chèn vào câu (About).
- Một **màu nhấn duy nhất**: xanh neon `#6fff54`, gradient `--grad`. Nền tối `#121212` là mặc định; có theme sáng `#f5f5f1`. Chữ chính Inter (trọng lượng 300), nhấn bằng Playfair nghiêng.
- Easing chung `--ease: cubic-bezier(.22,1,.36,1)`, thời lượng `--dur: .4s`.
- Phải hỗ trợ `prefers-reduced-motion`, theme tối/sáng, VI/EN, cảm ứng (tắt con trỏ tuỳ chỉnh).
- Hiệu ứng rê chuột trắng toàn chiều ngang cho các hàng danh sách dùng `::before` rộng `100vw`.
- Không viết `-webkit-backdrop-filter` bằng tay (lightningcss sẽ bỏ `backdrop-filter` không tiền tố nếu thiếu `cssTarget`).
- Mọi chữ hiển thị mới phải thêm vào **cả hai** file `content/vi.json` và `content/en.json`.

## 6. Hiệu ứng chính (đã làm, giống trang mẫu)
- **Màn chờ** đầu tiên mỗi phiên (đếm %, ảnh luân phiên, hiện tên), lưu `sessionStorage 'seen'`.
- **Chuyển trang:** 6 cột đen trồi lên từ đáy lần lượt trái → phải (mỗi cột lệch 70ms, 0.8s), phủ kín rồi nhả ra ở trang mới theo cùng thứ tự; tên hiện ở giữa lúc phủ kín. Cờ `sessionStorage 'pt'`, class `html.is-arriving`.
- **Hero:** sọc WebGL (chỉ desktop, bật sau lần tương tác đầu hoặc 6s; mobile dùng CSS dự phòng).
- Hiện dần khi cuộn (`data-reveal`, class `.js` trên `<html>`), số đếm, cuộn mượt Lenis, con trỏ tuỳ chỉnh (vòng; "+" khi rê link; nhãn qua `data-cursor-label`; trên ảnh chân dung ở About: "+" ở theme tối, "×" ở theme sáng), nút từ tính, chồng thẻ nhận xét, accordion nguyên tắc.
- **About:** ảnh chân dung bằng canvas chấm điểm, vùng "soi" ảnh sạch đi theo chuột có độ trễ (`aportrait.js`). Ảnh nguồn: `portrait-dither-2.png` (146×262 ô, mỗi ô 6px) và `portrait-clean-2.webp`.
- **Kinh nghiệm làm việc (About):** mỗi công việc hợp đồng là một khối lớn; freelance trùng thời gian hiện ngay dưới, mỗi dự án một hàng; bấm hàng để mở mô tả/kết quả. Dữ liệu ở `pages.about.experience.items` (`type: employment|freelance`, `org`, `role`, `from: 'YYYY-MM'`, `to: null|'YYYY-MM'`, `summary`, `results[]`). Thời gian hiển thị `MM/YYYY — MM/YYYY|Nay`, thời lượng tự tính. Freelance tự gán vào công việc trùng thời gian nhiều nhất. Phía dưới có khối chứng chỉ/giải thưởng nhỏ.

## 7. Bẫy đã gặp (đừng lặp lại)
- **Cache ảnh:** ảnh cũ trong bộ nhớ đệm từng làm chân dung vẽ sai. Đã đổi tên file thành `-2`, `vercel.json` chỉ cache lâu cho file có mã băm (js/css/woff2), ảnh/video/logo chỉ cache 1 giờ, và `aportrait.js` tự đọc kích thước ảnh thật. **Khi đổi ảnh, đổi cả tên file.** Lưu ý: script tạo ảnh cũ (nằm ngoài repo) ghi tên cũ, nếu tạo lại phải đặt tên `-2` hoặc mới hơn.
- Sự kiện chuột trên ảnh chân dung phải nghe ở `window` vì khối chữ hero nằm đè lên ảnh.
- `backdrop-filter` bị bỏ nếu không đặt `cssTarget` (xem mục 3).
- WebGL phần mềm làm điểm hiệu năng dao động: mobile không chạy WebGL.
- Chữ nhạt dần ở câu About phải đủ tương phản (dùng token `--word-dim`).
- `pkill -f "vite preview"` có thể giết cả shell của phiên; hãy dừng tiến trình theo cách khác.
- Trang mẫu từng bị chặn mạng trong môi trường đám mây; cần cho phép tên miền `kstoimenov.com` trong cài đặt môi trường mạng nếu muốn xem lại.
- Công cụ tạo ảnh để lại dấu hiệu nhỏ ở góc ảnh chân dung; đã tô tối thay vì xoá để tránh vết lõm.

## 8. Cách kiểm tra sau mỗi thay đổi (quy trình đã dùng)
1. `npm run build` (không được có lỗi).
2. Chạy `npm run preview` (cổng 4173), chụp ảnh bằng Playwright + Chromium có sẵn trong môi trường: desktop 1440×900 và mobile 390×844, theme tối và sáng, VI và EN, trạng thái rê chuột. Không có lỗi console.
3. Với hiệu năng: Lighthouse (kết quả trước đây: desktop 100 điểm cả bốn mục; mobile hiệu năng 93–97, mục khác 100).
4. Commit tiếng Việt, rõ ràng, rồi `git push origin main`.

## 9. Trạng thái hiện tại (cập nhật lần cuối: 2026-10-05)
Đã xong: trang chủ đầy đủ, 3 trang con + trang chi tiết dự án, đổi ngôn ngữ VI/EN, màn chờ + chuyển trang giống mẫu (6 cột), theme sáng/tối, hiệu ứng chân dung About, mục Kinh nghiệm làm việc, tài liệu design system (`docs/design-system.html`) và UI kit (`docs/ui-kit.html`), README, `vercel.json`, SEO (meta, sitemap, hreflang, robots).
Commit mới nhất tại thời điểm viết: `eb5bd7c` (chuyển trang 6 cột).

## 10. Việc còn lại
1. **Người dùng deploy trên Vercel** (import repo `portfolio`), rồi gửi URL để Claude thay `site.url` (`https://example.com` → URL thật) trong `content/*.json` và build lại.
2. **Thay nội dung thật** (hiện toàn bộ là mẫu): tên/logo, ảnh dự án (đang là SVG giữ chỗ `project-N.svg`), video giới thiệu (`reel.webm` là bản mẫu), lời nhận xét, số liệu, dịch vụ, kinh nghiệm làm việc, chứng chỉ, liên kết mạng xã hội.
3. **Biểu mẫu liên hệ:** `scripts/contact-api.js` đang là hàm giả (`sendMessage`). Cần nối dịch vụ gửi thật (ví dụ Formspree/Resend/API riêng) khi người dùng chọn.
4. Nếu người dùng thấy chuyển trang hoặc màn chờ vẫn khác mẫu, nhờ họ gửi thêm ảnh/quay video chuyển động để đối chiếu (hiện thời lượng và việc hiện tên ở giữa là suy đoán).

## 11. Gợi ý khi bắt đầu phiên mới
- Chạy `git pull origin main`, `npm install`, `npm run build` để chắc chắn mọi thứ chạy được.
- Đọc `README.md` và file này, rồi hỏi người dùng muốn làm gì tiếp (thường là gửi ảnh chỉ điểm khác mẫu hoặc gửi nội dung thật).
