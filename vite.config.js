import { defineConfig } from 'vite';
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { LANGS, loadContent, pagesOf, prefixOf, entryFile, renderDocument, contentFile } from './scripts/site.js';

const root = import.meta.dirname;
const SHELL = readFileSync(resolve(root, 'templates/page.html'), 'utf8');

// Sinh các file HTML điểm vào (mỗi trang × mỗi ngôn ngữ). Nội dung thật được dựng trong plugin bên dưới.
const entries = {};
for (const lang of LANGS) {
  for (const page of pagesOf(loadContent(lang))) {
    const file = entryFile(lang, page.path);
    const abs = resolve(root, file);
    mkdirSync(dirname(abs), { recursive: true });
    const marker = `<!--@doc ${lang} ${page.id} ${page.slug || '-'}-->`;
    writeFileSync(abs, SHELL.replace('<!--@marker-->', marker));
    entries[file.replace(/\/?index\.html$/, '').replace(/\//g, '_') || 'index'] = abs;
  }
}

// Dựng HTML từ content/*.json lúc build/dev: trang có nội dung ngay (tốt cho SEO, không cần JS để hiển thị).
function contentPlugin() {
  return {
    name: 'portfolio-content',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const m = html.match(/<!--@doc (\w+) (\w+) ([\w-]+)-->/);
        if (!m) return html;
        const doc = renderDocument(m[1], m[2], m[3] === '-' ? undefined : m[3]);
        return html
          .replace('<!--@lang-->', doc.lang)
          .replace('<!--@meta-->', doc.meta)
          .replace('<!--@app-->', doc.app);
      },
    },
    configureServer(server) {
      const files = LANGS.map(contentFile);
      server.watcher.add(files);
      server.watcher.on('change', (file) => {
        if (files.includes(file)) server.ws.send({ type: 'full-reload' });
      });
    },
    generateBundle() {
      const base = loadContent(LANGS[0]).site.url.replace(/\/$/, '');
      const urls = pagesOf(loadContent(LANGS[0])).map((page) => {
        const links = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${base}${prefixOf(l)}${page.path}"/>`).join('\n');
        return LANGS.map((l) => `  <url>\n    <loc>${base}${prefixOf(l)}${page.path}</loc>\n${links}\n  </url>`).join('\n');
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
      });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: ${base}/sitemap.xml\n` });
    },
  };
}

// Bản build: nhúng CSS thẳng vào HTML (bớt một lượt tải chặn hiển thị) và preload các font chính.
function inlineCriticalPlugin() {
  return {
    name: 'portfolio-inline-critical',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return html;
        let out = html;
        const fonts = [];
        for (const [name, item] of Object.entries(bundle)) {
          if (item.type === 'asset' && name.endsWith('.css')) {
            const file = name.split('/').pop();
            const re = new RegExp(`<link[^>]*rel="stylesheet"[^>]*href="[^"]*${file.replace(/[.]/g, '\\.')}"[^>]*>`);
            if (re.test(out)) out = out.replace(re, () => `<style>${item.source}</style>`);
          } else if (/(inter-(latin|vietnamese)-wght-normal|playfair-display-(latin|vietnamese)-wght-italic)-[\w-]+\.woff2$/.test(name)) {
            fonts.push(`<link rel="preload" href="/${name}" as="font" type="font/woff2" crossorigin />`);
          }
        }
        return out.replace('</head>', `    ${fonts.join('\n    ')}\n  </head>`);
      },
    },
  };
}

export default defineConfig({
  plugins: [contentPlugin(), inlineCriticalPlugin()],
  build: {
    target: 'es2022',
    // Nhắm trình duyệt hiện đại để bước nén CSS không bỏ mất backdrop-filter chuẩn.
    cssTarget: ['chrome111', 'safari16.4', 'firefox113'],
    rollupOptions: { input: entries },
  },
});
