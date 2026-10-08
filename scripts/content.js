// Nạp nội dung từ thư mục content/ và ghép thành một đối tượng cho mỗi ngôn ngữ (cấu trúc mà render.js / pages.js dùng).
// Cấu trúc thư mục (được trang quản trị /admin – Decap CMS – ghi trực tiếp):
//   content/settings.json            cài đặt chung: site, brand, nav, cta, contact, footer, ui
//   content/pages/home.json          trang chủ: hero, about, reel, stats, tiêu đề các khối…
//   content/pages/{work,services,about}.json
//   content/{projects,services,experience,testimonials,partners}/*.json   mỗi mục một file
// Mỗi file có dạng { "vi": {...}, "en": {...} }. Ô nào bản tiếng Anh để trống thì lấy theo bản tiếng Việt.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';

const root = resolve(import.meta.dirname, '..');
export const CONTENT_DIR = resolve(root, 'content');
export const DEFAULT_LANG = 'vi';

const readJSON = (p) => JSON.parse(readFileSync(p, 'utf8'));
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const isEmpty = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);

/** Điền chỗ trống của bản dịch bằng giá trị của bản gốc (đệ quy, giữ nguyên chỗ đã dịch). */
export function withFallback(value, base) {
  if (base === undefined) return value;
  if (isEmpty(value)) return base;
  if (Array.isArray(value) && Array.isArray(base)) return value.map((v, i) => withFallback(v, base[i]));
  if (isObj(value) && isObj(base)) {
    const out = { ...base };
    for (const k of Object.keys(value)) out[k] = withFallback(value[k], base[k]);
    return out;
  }
  return value;
}

const localize = (data, lang) => {
  const base = data[DEFAULT_LANG] || {};
  return lang === DEFAULT_LANG ? base : withFallback(data[lang] || {}, base);
};

const file = (rel, lang) => localize(readJSON(resolve(CONTENT_DIR, rel)), lang);

/** Một thư mục = một danh sách. Tên file (bỏ .json) là slug; sắp theo trường order rồi theo tên file. */
function list(dir, lang, { slug = false } = {}) {
  const abs = resolve(CONTENT_DIR, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => ({ name: basename(f, '.json'), data: localize(readJSON(resolve(abs, f)), lang) }))
    .sort((a, b) => (Number(a.data.order) || 0) - (Number(b.data.order) || 0))
    .map(({ name, data }) => {
      const { order, ...rest } = data;
      void order;
      return slug ? { slug: name, ...rest } : rest;
    });
}

export function loadContent(lang) {
  const s = file('settings.json', lang);
  const h = file('pages/home.json', lang);
  const about = file('pages/about.json', lang);
  return {
    site: s.site,
    brand: s.brand,
    nav: s.nav,
    cta: s.cta,
    hero: h.hero,
    about: h.about,
    reel: h.reel,
    stats: h.stats,
    services: { ...h.services, items: list('services', lang, { slug: true }) },
    work: { ...h.work, items: list('projects', lang, { slug: true }) },
    worksCta: h.worksCta,
    testimonials: { ...h.testimonials, items: list('testimonials', lang) },
    quote: h.quote,
    partners: { ...h.partners, items: list('partners', lang) },
    contact: s.contact,
    footer: s.footer,
    ui: s.ui,
    pages: {
      work: file('pages/work.json', lang),
      services: file('pages/services.json', lang),
      about: { ...about, experience: { ...about.experience, items: list('experience', lang) } },
    },
  };
}
