// Sinh docs/BRIEF-DU-AN.md: bản mô tả đầy đủ dự án + TOÀN BỘ nội dung site (VI và EN) + design token.
// Dùng để brief cho một dự án/phiên Claude mới. Chạy: npm run brief (tự đọc thư mục content/ nên luôn khớp nội dung mới nhất).
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadContent } from './content.js';

const root = resolve(import.meta.dirname, '..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');

/** Đối tượng lồng nhau → danh sách gạch đầu dòng dễ đọc. */
function dump(v, depth = 0) {
  const pad = '  '.repeat(depth);
  if (v === null || v === undefined || v === '') return '';
  if (Array.isArray(v)) {
    return v
      .map((item, i) => {
        if (item && typeof item === 'object') {
          const title = item.name || item.title || item.org || item.label || item.slug || `#${i + 1}`;
          return `${pad}- **${String(title).replace(/\n/g, ' ')}**\n${dump(item, depth + 1)}`;
        }
        return `${pad}- ${String(item).replace(/\n/g, ' ')}`;
      })
      .join('\n');
  }
  if (typeof v === 'object') {
    return Object.entries(v)
      .filter(([, x]) => !(x === null || x === undefined || x === '' || (Array.isArray(x) && !x.length)))
      .map(([k, x]) => (x && typeof x === 'object' ? `${pad}- \`${k}\`:\n${dump(x, depth + 1)}` : `${pad}- \`${k}\`: ${String(x).replace(/\n/g, ' / ')}`))
      .join('\n');
  }
  return `${pad}${v}`;
}

const SECTIONS = [
  ['site', 'Thông tin site & SEO'], ['brand', 'Thương hiệu / tên'], ['nav', 'Thanh điều hướng'], ['cta', 'Nút Đặt lịch'],
  ['hero', 'Trang chủ — Hero'], ['about', 'Trang chủ — Câu giới thiệu (About statement)'], ['reel', 'Trang chủ — Showreel'],
  ['stats', 'Trang chủ — Số liệu'], ['services', 'Dịch vụ (khối trang chủ + danh sách dịch vụ)'], ['work', 'Dự án (danh sách + case study)'],
  ['worksCta', 'Khối "Muốn xem thêm"'], ['testimonials', 'Lời nhận xét'], ['quote', 'Câu trích dẫn'], ['partners', 'Đối tác'],
  ['contact', 'Liên hệ, form, mạng xã hội'], ['footer', 'Footer'], ['ui', 'Chữ giao diện (nút, nhãn)'], ['pages', 'Các trang con: Dự án, Dịch vụ, Giới thiệu (gồm Kinh nghiệm)'],
];

const contentFor = (lang) => {
  const c = loadContent(lang);
  return SECTIONS.map(([k, t]) => `### ${t} (\`${k}\`)\n\n${dump(c[k]) || '_(trống)_'}`).join('\n\n');
};

// Token: lấy từng khối :root trong tokens.css
const tokensCss = read('styles/tokens.css');
const tokenBlocks = [...tokensCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .filter(([, sel, body]) => body.includes('--'))
  .map(([, sel, body]) => {
    const rows = [...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/g)].map(([, n, val, note]) => `| \`${n}\` | \`${val.trim().replace(/\|/g, '\\|')}\` | ${note || ''} |`);
    return `**${sel.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim()}**\n\n| Token | Giá trị | Ghi chú |\n|---|---|---|\n${rows.join('\n')}`;
  })
  .join('\n\n');

const today = new Date().toISOString().slice(0, 10);
const head = read('docs/brief-header.md').replace('{{DATE}}', today);

const out = `${head}

---

## 8. Design token (tự sinh từ \`styles/tokens.css\`)

${tokenBlocks}

---

## 9. TOÀN BỘ NỘI DUNG SITE — TIẾNG VIỆT (tự sinh từ \`content/\`)

> Quy ước chữ: \`*chữ*\` = serif nghiêng (nhấn), \`__chữ__\` = gạch chân, \`[[gem|clover|burst…]]\` = hình trang trí trong câu. Đây phần lớn là **nội dung mẫu**, cần thay bằng nội dung thật.

${contentFor('vi')}

---

## 10. TOÀN BỘ NỘI DUNG SITE — TIẾNG ANH

${contentFor('en')}
`;
writeFileSync(resolve(root, 'docs/BRIEF-DU-AN.md'), out);
console.log('Đã ghi docs/BRIEF-DU-AN.md', Math.round(out.length / 1024) + 'KB');
