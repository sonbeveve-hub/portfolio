// Xuất tài liệu Design System + UI kit (1 file HTML độc lập) từ chính token, CSS và hàm render của site.
// Chạy: npm run build && node scripts/build-docs.mjs   →  docs/ui-kit.html
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent, setContextFor } from './docs-helpers.mjs';
import * as R from './render.js';
import * as P from './pages.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist/assets');
const c = loadContent();
setContextFor('vi');

/* ---------- CSS thật của site, nhúng font (latin + vietnamese) để mở offline ---------- */
const cssFile = readdirSync(dist).find((f) => /^main-.*\.css$/.test(f));
let siteCss = readFileSync(resolve(dist, cssFile), 'utf8');
for (const f of readdirSync(dist).filter((n) => n.endsWith('.woff2') && /-(latin|latin-ext|vietnamese)-/.test(n))) {
  const b64 = readFileSync(resolve(dist, f)).toString('base64');
  siteCss = siteCss.split(`url(/assets/${f})`).join(`url(data:font/woff2;base64,${b64})`);
}

/* ---------- Token ---------- */
const tokens = readFileSync(resolve(root, 'styles/tokens.css'), 'utf8');
const block = (re) => { const m = tokens.match(re); return Object.fromEntries([...m[1].matchAll(/--([\w-]+):\s*([^;]+);/g)].map((x) => [x[1], x[2].trim()])); };
const base = block(/:root \{([\s\S]*?)\n\}/);
const dark = block(/:root,\s*:root\[data-theme='dark'\] \{([\s\S]*?)\n\}/);
const light = block(/:root\[data-theme='light'\] \{([\s\S]*?)\n\}/);

const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return [16, 8, 0].map((s, i) => { const v = ((n >> s) & 255) / 255; return (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4) * [0.2126, 0.7152, 0.0722][i]; }).reduce((a, b) => a + b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const isHex = (v) => /^#[0-9a-f]{6}$/i.test(v);
const esc = R.esc;

const colorRows = [
  ['bg', 'Nền trang', 'Nền chính của mọi trang'],
  ['bg-elev', 'Nền nổi', 'Thẻ, ảnh chờ tải, khung phụ'],
  ['text', 'Chữ chính', 'Tiêu đề, nội dung chính'],
  ['muted', 'Chữ phụ', 'Mô tả, đoạn văn thứ cấp'],
  ['dim', 'Chữ mờ', 'Nhãn nhỏ, chú thích'],
  ['stroke', 'Đường kẻ', 'Đường phân cách, viền thẻ'],
  ['tag-stroke', 'Viền nhãn', 'Viền tag, thanh, nút phụ'],
  ['accent', 'Màu nhấn (duy nhất)', 'Nút chính, con trỏ, chấm trạng thái'],
  ['accent-text', 'Màu nhấn cho chữ', 'Bản đậm hơn ở theme sáng để đọc được'],
];
const swatch = (k) => {
  const d = dark[k] ?? base[k], l = light[k] ?? base[k];
  const cell = (v, bg) => `<div class="ds-sw"><i style="background:${v}"></i><code>${esc(v)}</code>${isHex(v) && isHex(bg) && !/^(bg|bg-elev|stroke|tag-stroke)$/.test(k) ? `<small>${ratio(v, bg).toFixed(1)}:1 trên nền</small>` : ''}</div>`;
  return { d: cell(d, dark.bg), l: cell(l, light.bg) };
};
const colors = colorRows.map(([k, name, use]) => { const s = swatch(k); return `<tr><th scope="row"><b>${name}</b><small>--${k}</small></th><td>${s.d}</td><td>${s.l}</td><td>${use}</td></tr>`; }).join('');

const fsRows = Object.keys(base).filter((k) => k.startsWith('fs-')).map((k) => {
  const sample = k === 'fs-footer' ? 'Aa' : k === 'fs-num' ? '120' : k === 'fs-xl' ? 'Thiết kế' : 'Thiết kế trải nghiệm';
  return `<tr><th scope="row"><b>--${k}</b><small>${esc(base[k])}</small></th><td><span style="font-size:min(var(--${k}), 92px);font-weight:300;line-height:1.15;white-space:nowrap">${sample}</span></td></tr>`;
}).join('');
const spRows = Object.keys(base).filter((k) => k.startsWith('sp-')).map((k) => `<tr><th scope="row"><b>--${k}</b><small>${esc(base[k])}</small></th><td><i class="ds-bar" style="width:min(var(--${k}), 100%)"></i></td></tr>`).join('');

/* ---------- Trích xuất thành phần thật từ HTML đã render ---------- */
const pick = (html, cls) => {
  const m = new RegExp(`<(\\w+)[^>]*class="[^"]*\\b${cls}\\b[^"]*"`).exec(html);
  if (!m) return `<p class="ds-miss">Không tìm thấy .${cls}</p>`;
  const tag = m[1], start = m.index, re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'g');
  re.lastIndex = start; let depth = 0, x;
  while ((x = re.exec(html))) { depth += x[1] ? -1 : 1; if (!depth) return html.slice(start, re.lastIndex); }
  return html.slice(start);
};
const home = R.renderHome(c);
setContextFor('vi', 'services'); const services = P.renderServicesPage(c);
setContextFor('vi', 'about'); const about = P.renderAboutPage(c);
setContextFor('vi', 'work'); const work = P.renderWorkPage(c);
setContextFor('vi', 'home');

const stage = (inner, cls = '') => `<div class="ds-stage ${cls}">${inner}</div>`;
const comp = (id, title, desc, inner, files, cls) => `<section class="ds-comp" id="${id}"><div class="ds-comp__head"><h3>${title}</h3><p>${desc}</p><code>${files}</code></div>${stage(inner, cls)}</section>`;

const iconGrid = (names, fn) => `<ul class="ds-icons">${names.map((n) => `<li><span>${fn(n)}</span><code>${n}</code></li>`).join('')}</ul>`;

const atoms = `
<div class="ds-atoms">
  <div><h4>Nút</h4><div class="ds-row">
    ${R.pill({ label: 'Nút chính', href: '#', cls: 'btn--primary' })}
    ${R.pill({ label: 'Nút viền', href: '#', cls: 'btn--outline' })}
    <a class="round-btn" href="#" aria-label="Mũi tên">${R.icon('arrow')}</a>
    <a class="round-btn" href="#" aria-label="Đóng">${R.icon('close')}</a>
  </div><code>.btn .btn--primary / .btn--outline · .round-btn</code></div>
  <div><h4>Nhãn (tag)</h4><div class="ds-row"><span class="tag">Thiết kế UI/UX</span><span class="tag">Hợp đồng lao động</span><span class="tag">Freelance</span></div><code>.tag</code></div>
  <div><h4>Chip lọc</h4><div class="ds-row" data-ds-chips><button class="chip-btn is-on" type="button">Tất cả</button><button class="chip-btn" type="button">Thiết kế</button><button class="chip-btn" type="button">Quản lý</button></div><code>.chip-btn (.is-on)</code></div>
  <div><h4>Chữ nhấn</h4><p class="ds-em">Thiết kế <em>trải nghiệm</em> có <u>chủ đích</u></p><code>*chữ* → serif nghiêng · __chữ__ → gạch chân</code></div>
  <div><h4>Con trỏ tuỳ chỉnh</h4><div class="ds-row ds-cursors"><span class="ds-cur"></span><span class="ds-cur ds-cur--hover"></span><span class="ds-cur ds-cur--label">Xem</span></div><code>.cursor · .is-hover (+) · .is-label · .is-x (×, theme sáng, trên ảnh About)</code></div>
  <div><h4>Mạng xã hội</h4>${pick(R.renderFooter(c), 'socials')}<code>.socials .social</code></div>
</div>`;

const comps = [
  comp('c-nav', 'Thanh điều hướng', 'Viên thuốc nổi ở giữa dưới cùng: đổi theme, menu, đổi ngôn ngữ, nút liên hệ. Ẩn khi cuộn xuống, hiện khi cuộn lên; trên mobile thu thành nút menu.', R.renderNav(c), 'render.js › renderNav · styles/nav.css · scripts/nav.js', 'ds-stage--nav'),
  comp('c-stats', 'Số liệu', 'Lưới số lớn chạy đếm khi vào màn hình; rê chuột thì ô chuyển gradient.', pick(home, 'stats'), 'render.js › renderStats · scripts/counters.js'),
  comp('c-services', 'Danh sách dịch vụ', 'Hàng lớn có số thứ tự, biểu tượng, mô tả; rê chuột chuyển nền trắng full-bleed.', pick(home, 'services'), 'render.js › renderHome · styles/sections.css'),
  comp('c-work', 'Dự án (danh sách + ảnh xem trước)', 'Mỗi dự án là một hàng; trên desktop ảnh xem trước đi theo con trỏ.', pick(work, 'wlist') || '', 'pages.js › renderWorkPage · scripts/wlist.js'),
  comp('c-testi', 'Lời nhận xét (chồng thẻ)', 'Chồng thẻ tự chạy, nút điều khiển trước/sau.', pick(home, 'testi'), 'render.js › renderHome · scripts/testimonials.js'),
  comp('c-wcta', 'Kêu gọi xem dự án', 'Câu lớn, nút tròn chuyển đổi, nút "Xem thêm".', R.renderWorksCta(c), 'render.js › renderWorksCta · scripts/work.js'),
  comp('c-acc', 'Nguyên tắc (accordion)', 'Mở/đóng từng mục, chỉ mở một mục tại một thời điểm.', pick(services, 'acc'), 'pages.js › renderServicesPage · scripts/accordion.js'),
  comp('c-metrics', 'Thẻ chỉ số', 'Lưới thẻ có nhãn + số; rê chuột thẻ sáng trắng.', pick(services, 'metrics2'), 'pages.js › renderServicesPage'),
  comp('c-tools', 'Công cụ + lọc theo nhóm', 'Chip lọc và lưới ô biểu tượng.', pick(about, 'tools'), 'pages.js › renderAboutPage · scripts/tools.js'),
  comp('c-plist', 'Danh sách nguyên tắc làm việc', 'Hàng tiêu đề + đoạn mô tả.', pick(about, 'principles'), 'pages.js › renderAboutPage'),
  comp('c-exp', 'Kinh nghiệm làm việc', 'Khối theo từng công việc hợp đồng; freelance nằm dưới; bấm hàng để mở mô tả/kết quả; rê chuột thì hàng sáng trắng.', pick(about, 'exp'), 'pages.js › renderExperience · scripts/experience.js'),
  comp('c-cred', 'Chứng chỉ, giải thưởng (khối nhỏ)', 'Hai cột, hàng mảnh, không hiệu ứng rê.', pick(about, 'cred'), 'pages.js › renderAboutPage'),
  comp('c-big', 'Chữ khổng lồ', 'Dòng chữ lớn có hình trang trí xen kẽ, sáng dần theo cuộn.', R.renderBigText(c), 'render.js › renderBigText · scripts/bigtext.js'),
  comp('c-form', 'Hộp thoại liên hệ', 'Biểu mẫu trắng: ô nhập gạch chân, chip chọn nhu cầu, trạng thái lỗi/đang gửi/thành công.', R.renderForm(c).replace('<dialog class="dlg"', '<div class="dlg" style="margin:0 auto"').replace('</dialog>', '</div>'), 'render.js › renderForm · scripts/form.js · scripts/contact-api.js'),
  comp('c-footer', 'Chân trang', 'Chữ tên khổng lồ, liên kết mạng xã hội, dòng bản quyền.', R.renderFooter(c), 'render.js › renderFooter · styles/footer.css'),
].join('\n');

const breakpoints = [['max 560px', 'Điện thoại nhỏ: lưới 2 cột'], ['max 760px', 'Mobile: menu thu gọn, ẩn thành phần chỉ dành cho desktop'], ['min 760px', 'Tablet trở lên: bố cục 2 cột'], ['min 900px', 'Desktop: bố cục đầy đủ, ảnh xem trước, hiệu ứng rê chuột'], ['hover: none / pointer: coarse', 'Cảm ứng: tắt con trỏ tuỳ chỉnh, nút từ tính'], ['prefers-reduced-motion', 'Tắt hoạt ảnh, hiện nội dung ngay']]
  .map(([a, b]) => `<tr><th scope="row"><code>${a}</code></th><td>${b}</td></tr>`).join('');

const motion = [
  ['Easing chung', '<code>cubic-bezier(0.22, 1, 0.36, 1)</code> (--ease) · thời lượng 0.4s (--dur)'],
  ['Hiện khi cuộn', 'IntersectionObserver gắn <code>[data-reveal]</code>, trễ theo <code>--i</code>'],
  ['Số đếm', 'Chạy 0 → giá trị khi vào màn hình (counters.js)'],
  ['Cuộn mượt', 'Lenis; cuộn tới neo (#hash) cũng mượt'],
  ['Chuyển trang', 'Lớp phủ xanh trượt lên 0.9s <code>cubic-bezier(.6,0,.3,1)</code>; màn chờ chỉ hiện lần đầu/phiên'],
  ['Hero', 'Các sọc WebGL (desktop, bật khi tương tác hoặc sau 6s); mobile dùng CSS dự phòng'],
  ['Chân dung About', 'Canvas chấm điểm, vùng "soi" ảnh sạch đi theo chuột có độ trễ'],
  ['Nút từ tính / con trỏ', 'Nút hút nhẹ theo chuột; con trỏ phóng to thành "+" hoặc nhãn'],
].map(([a, b]) => `<tr><th scope="row">${a}</th><td>${b}</td></tr>`).join('');

const structure = [
  ['content/ (settings, pages/, projects/, services/, experience/, testimonials/, partners/)', 'Toàn bộ chữ, liên kết, đường dẫn ảnh — mỗi file có bản vi và en; sửa qua /admin'],
  ['styles/tokens.css', 'Design token — sửa ở đây để đổi toàn site'],
  ['scripts/render.js · pages.js', 'Hàm dựng HTML (Node, lúc build) cho thành phần và từng trang'],
  ['scripts/*.js (trình duyệt)', 'Hiệu ứng và tương tác; đăng ký trong main.js'],
  ['templates/page.html', 'Khung HTML chung; Vite sinh các trang từ khung này'],
  ['vercel.json', 'Cấu hình build và cache khi triển khai'],
].map(([a, b]) => `<tr><th scope="row"><code>${a}</code></th><td>${b}</td></tr>`).join('');

const nav = [['tong-quan', 'Tổng quan'], ['mau', 'Màu sắc'], ['chu', 'Chữ'], ['khoang', 'Khoảng cách & lưới'], ['dong', 'Chuyển động'], ['icon', 'Biểu tượng & hình'], ['atoms', 'Thành phần nhỏ'], ['uikit', 'UI kit'], ['cau-truc', 'Cấu trúc mã']];

const docCss = `
.ds-wrap{max-width:1120px;margin:0 auto;padding:0 clamp(16px,4vw,48px)}
.ds-top{position:sticky;top:0;z-index:50;background:var(--nav-bg);backdrop-filter:blur(12px);border-bottom:1px solid var(--stroke)}
.ds-top .ds-wrap{display:flex;align-items:center;gap:20px;height:56px;overflow-x:auto;white-space:nowrap;font-size:13px}
.ds-top a{color:var(--muted)} .ds-top a:hover{color:var(--text)}
.ds-top button{margin-left:auto;border:1px solid var(--stroke);border-radius:99px;padding:6px 14px;font-size:12px;color:var(--text)}
.ds-hero{padding:72px 0 40px}.ds-hero h1{font-size:clamp(2.4rem,7vw,5rem);font-weight:300;line-height:1.05}
.ds-hero p{max-width:62ch;color:var(--muted);margin-top:18px;line-height:1.6}
.ds-s{padding:56px 0;border-top:1px solid var(--stroke)}
.ds-s>h2{font-size:clamp(1.6rem,3vw,2.3rem);font-weight:300;margin-bottom:10px}
.ds-s>p.ds-lead{color:var(--muted);max-width:64ch;line-height:1.6;margin-bottom:28px}
.ds-tbl{width:100%;border-collapse:collapse;font-size:14px}
.ds-tbl th,.ds-tbl td{padding:12px 14px 12px 0;border-top:1px solid var(--stroke);text-align:left;vertical-align:middle;font-weight:400}
.ds-tbl thead th{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--dim);border-top:0}
.ds-tbl th small{display:block;color:var(--dim);font-size:12px;font-weight:400;margin-top:2px}
.ds-tbl code,.ds-comp code,.ds-atoms code{font:12px ui-monospace,Menlo,Consolas,monospace;color:var(--muted)}
.ds-sw{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.ds-sw i{width:34px;height:34px;border-radius:8px;border:1px solid var(--stroke)}.ds-sw small{color:var(--dim);font-size:12px}
.ds-bar{display:block;height:10px;background:var(--accent);border-radius:99px}
.ds-icons{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:12px;margin-bottom:28px}
.ds-icons li{display:grid;justify-items:center;gap:8px;padding:16px 6px;border:1px solid var(--stroke);border-radius:12px}
.ds-icons span svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.ds-icons .shape{display:block;width:38px;height:38px}.ds-icons .shape svg{width:100%;height:100%;fill:currentColor;stroke:none}
.ds-atoms{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
.ds-atoms>div:last-child{grid-column:1/-1}
.ds-atoms>div{border:1px solid var(--stroke);border-radius:16px;padding:22px;display:grid;gap:14px;align-content:start}
.ds-atoms h4{font-size:11px;font-weight:400;letter-spacing:.08em;text-transform:uppercase;color:var(--dim)}
.ds-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.ds-em{font-size:1.6rem;font-weight:300}.ds-em u{text-underline-offset:5px}
.ds-cursors{gap:24px}.ds-cur{position:relative;display:grid;place-items:center;width:18px;height:18px;border:1.5px solid var(--accent-text);border-radius:50%;font-size:12px;color:#121212}
.ds-cur--hover{width:64px;height:64px;background:color-mix(in srgb,var(--accent) 22%,transparent)}
.ds-cur--hover::before,.ds-cur--hover::after{content:'';position:absolute;background:var(--accent-text);left:50%;top:50%}.ds-cur--hover::before{width:14px;height:1.5px;margin:-.75px 0 0 -7px}.ds-cur--hover::after{width:1.5px;height:14px;margin:-7px 0 0 -.75px}
.ds-cur--label{width:92px;height:92px;background:#fff;border-color:#fff}
.ds-comp{margin-bottom:44px}.ds-comp__head{display:grid;gap:6px;margin-bottom:14px}.ds-comp__head h3{font-size:1.25rem;font-weight:400}.ds-comp__head p{color:var(--muted);font-size:14px;line-height:1.55;max-width:70ch}
.ds-stage{position:relative;transform:translateZ(0);overflow:hidden;border:1px solid var(--stroke);border-radius:16px;background:var(--bg);padding:8px 0}
.ds-stage--nav{min-height:150px;display:grid;place-items:center}
.ds-stage--nav .nav{position:static!important;transform:none!important;margin:0}
.ds-stage .wrap{padding-inline:clamp(16px,3vw,40px)}
.ds-stage [data-reveal]{opacity:1!important;transform:none!important}
.ds-foot{padding:40px 0 80px;color:var(--dim);font-size:13px}
.ds-miss{color:#d93636;padding:20px}
`;

const docJs = `
const r=document.documentElement;
document.getElementById('ds-theme').addEventListener('click',()=>{r.dataset.theme=r.dataset.theme==='light'?'dark':'light'});
document.addEventListener('click',(e)=>{
  const row=e.target.closest('.xrow__head'); if(row){const li=row.parentElement;const o=!li.classList.contains('is-open');li.classList.toggle('is-open',o);row.setAttribute('aria-expanded',o)}
  const chip=e.target.closest('.chip-btn'); if(chip){const g=chip.parentElement;g.querySelectorAll('.chip-btn').forEach(b=>{b.classList.toggle('is-on',b===chip);b.setAttribute('aria-pressed',b===chip)});
    const cat=chip.dataset.cat; if(g.hasAttribute('data-tools-filter')){document.querySelectorAll('.tool').forEach(t=>t.hidden=cat!=='*'&&t.dataset.cat!==cat)}}
  const acc=e.target.closest('.acc__btn,.acc button'); if(acc){const it=acc.closest('.acc__item,li');if(it)it.classList.toggle('is-open')}
  if(e.target.closest('.ds-stage a[href="#"]')) e.preventDefault();
});
`;

const html = `<!doctype html>
<html lang="vi" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Design System & UI kit</title>
<style>${siteCss}</style>
<style>${docCss}</style>
</head>
<body>
<header class="ds-top"><div class="ds-wrap">${nav.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}<button id="ds-theme" type="button">Đổi theme sáng/tối</button></div></header>
<main class="ds-wrap">
<section class="ds-hero" id="tong-quan">
  <h1>Design system <em>& UI kit</em></h1>
  <p>Tài liệu sống của trang portfolio: mọi màu, chữ, khoảng cách và thành phần bên dưới đều lấy trực tiếp từ token và hàm dựng của site (không vẽ lại), nên luôn khớp với trang thật. Dùng nút "Đổi theme" để xem hai giao diện.</p>
  <table class="ds-tbl" style="margin-top:28px"><tbody>
    <tr><th scope="row">Nguyên tắc</th><td>Tối là mặc định; chỉ một màu nhấn (xanh neon); chữ sans nhẹ (300), nhấn bằng serif nghiêng; nhiều khoảng thở; chuyển động dùng chung một đường cong.</td></tr>
    <tr><th scope="row">Công nghệ</th><td>Vite + HTML/CSS/JS thuần; nội dung trong JSON (vi/en); dựng HTML lúc build.</td></tr>
    <tr><th scope="row">Hỗ trợ</th><td>Theme tối/sáng · VI/EN · giảm chuyển động · cảm ứng · bàn phím (focus-visible).</td></tr>
  </tbody></table>
</section>

<section class="ds-s" id="mau"><h2>Màu <em>sắc</em></h2>
<p class="ds-lead">Chín biến màu, hai bảng giá trị. Tỉ lệ tương phản tính theo WCAG so với nền của từng theme (chữ thường cần ≥ 4.5:1).</p>
<table class="ds-tbl"><thead><tr><th>Biến</th><th>Theme tối</th><th>Theme sáng</th><th>Dùng cho</th></tr></thead><tbody>${colors}
<tr><th scope="row"><b>Gradient</b><small>--grad</small></th><td colspan="3"><div style="height:34px;border-radius:8px;background:var(--grad);max-width:420px"></div><code>${esc(base.grad)}</code> — thanh nhấn, hover số liệu, nút chuyển đổi</td></tr>
</tbody></table></section>

<section class="ds-s" id="chu"><h2>Chữ <em>& thang cỡ</em></h2>
<p class="ds-lead">Hai họ chữ: <b>Inter Variable</b> (trọng lượng 300 cho hầu hết) và <b>Playfair Display Variable</b> (chỉ dùng nghiêng để nhấn). Cỡ chữ dùng <code>clamp()</code> nên co giãn theo màn hình.</p>
<div class="ds-row" style="gap:40px;margin-bottom:28px"><div><div style="font-size:3rem;font-weight:300">Aa Inter</div><code>--font-sans · 300 / 400 / 500</code></div><div><div style="font-size:3rem;font-family:var(--font-serif);font-style:italic">Aa Playfair</div><code>--font-serif · italic</code></div></div>
<table class="ds-tbl"><tbody>${fsRows}</tbody></table></section>

<section class="ds-s" id="khoang"><h2>Khoảng cách, <em>bo góc & lưới</em></h2>
<table class="ds-tbl"><tbody>${spRows}</tbody></table>
<table class="ds-tbl" style="margin-top:28px"><tbody>
<tr><th scope="row"><b>Bo góc</b></th><td><div class="ds-row"><span class="tag" style="border-radius:var(--radius-s)">--radius-s ${base['radius-s']}</span><span class="tag" style="border-radius:var(--radius)">--radius ${base.radius}</span><span class="tag" style="border-radius:var(--radius-pill)">--radius-pill</span></div></td></tr>
<tr><th scope="row"><b>Lưới</b></th><td>Lề trang <code>--gutter ${esc(base.gutter)}</code> · cột nội dung <code>--w-work ${base['w-work']}</code> · cột rộng <code>--w-wide ${base['w-wide']}</code></td></tr>
</tbody></table>
<h3 style="margin:32px 0 10px;font-weight:400">Điểm ngắt responsive</h3>
<table class="ds-tbl"><tbody>${breakpoints}</tbody></table></section>

<section class="ds-s" id="dong"><h2>Chuyển <em>động</em></h2><table class="ds-tbl"><tbody>${motion}</tbody></table></section>

<section class="ds-s" id="icon"><h2>Biểu tượng <em>& hình trang trí</em></h2>
<p class="ds-lead">Biểu tượng nét mảnh 1.6px, bo tròn, dùng <code>currentColor</code>. Hình trang trí là hình đặc dùng trong chữ khổng lồ và câu About (<code>[[tên]]</code>).</p>
${iconGrid(R.iconNames, R.icon)}${iconGrid(R.shapeNames, (n) => R.shape(n))}</section>

<section class="ds-s" id="atoms"><h2>Thành phần <em>nhỏ</em></h2>${atoms}</section>

<section class="ds-s" id="uikit"><h2>UI <em>kit</em></h2>
<p class="ds-lead">Các khối dựng trang, hiển thị bằng đúng HTML và CSS của site. Phần tương tác cơ bản (mở hàng, chip lọc, theme) vẫn chạy; hiệu ứng cuộn/con trỏ chỉ có trên trang thật.</p>
${comps}</section>

<section class="ds-s" id="cau-truc"><h2>Cấu trúc <em>mã</em></h2><table class="ds-tbl"><tbody>${structure}</tbody></table></section>
<p class="ds-foot">Tạo tự động bằng <code>node scripts/build-docs.mjs</code> — chạy lại sau khi sửa token hoặc thành phần để tài liệu luôn đúng.</p>
</main>
<script>${docJs}</script>
</body>
</html>`;

mkdirSync(resolve(root, 'docs'), { recursive: true });
writeFileSync(resolve(root, 'docs/ui-kit.html'), html);
console.log('docs/ui-kit.html', Math.round(html.length / 1024), 'KB');
