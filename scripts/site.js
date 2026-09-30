// Mô hình của cả site: ngôn ngữ, danh sách trang, dựng HTML cho từng trang. Chỉ chạy trong Node.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderMeta, renderShell, renderHome, setContext } from './render.js';
import { pageMain, renderProjectPage } from './pages.js';

export const LANGS = ['vi', 'en']; // vi = mặc định ở gốc "/", en nằm ở "/en/"
export const prefixOf = (lang) => (lang === LANGS[0] ? '' : `/${lang}`);

const root = resolve(import.meta.dirname, '..');
export const contentFile = (lang) => resolve(root, 'content', `${lang}.json`);
export const loadContent = (lang) => JSON.parse(readFileSync(contentFile(lang), 'utf8'));

// Danh sách trang của một ngôn ngữ: id, đường dẫn (không gồm tiền tố ngôn ngữ), tiêu đề SEO.
export function pagesOf(c) {
  const list = [
    { id: 'home', path: '/', title: '' },
    { id: 'work', path: '/work/', title: c.pages.work.seoTitle },
    { id: 'services', path: '/services/', title: c.pages.services.seoTitle },
    { id: 'about', path: '/about/', title: c.pages.about.seoTitle },
  ];
  for (const p of c.work.items) list.push({ id: 'project', slug: p.slug, path: `/work/${p.slug}/`, title: p.title, parent: 'work' });
  return list;
}

// Tên file HTML vật lý (điểm vào của Vite) cho một trang.
export const entryFile = (lang, path) => `${prefixOf(lang) ? prefixOf(lang).slice(1) + '/' : ''}${path.slice(1)}index.html`.replace(/^\//, '');

export function renderDocument(lang, id, slug) {
  const c = loadContent(lang);
  const page = pagesOf(c).find((p) => p.id === id && (id !== 'project' || p.slug === slug));
  if (!page) throw new Error(`Không có trang ${id}/${slug} (${lang})`);
  const alts = LANGS.map((l) => ({ lang: l, path: prefixOf(l) + page.path }));
  const other = alts.find((a) => a.lang !== lang);
  setContext({ lang, prefix: prefixOf(lang), page: page.parent || page.id, alt: other });
  const main = id === 'home' ? renderHome(c) : id === 'project' ? renderProjectPage(c, slug) : pageMain[id](c);
  return {
    lang,
    page: page.parent || page.id,
    meta: renderMeta(c, { path: prefixOf(lang) + page.path, title: page.title, alternates: alts }),
    app: renderShell(c, main),
  };
}
