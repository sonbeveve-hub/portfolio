import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderMeta, renderPage } from './scripts/render.js';

const contentPath = resolve(import.meta.dirname, 'content.json');
const readContent = () => JSON.parse(readFileSync(contentPath, 'utf8'));

// Dựng HTML từ content.json lúc build/dev để trang có nội dung ngay (tốt cho SEO, không cần JS để hiển thị).
function contentPlugin() {
  return {
    name: 'portfolio-content',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const content = readContent();
        return html
          .replace('<!--@lang-->', content.site.lang)
          .replace('<!--@meta-->', renderMeta(content))
          .replace('<!--@app-->', renderPage(content));
      },
    },
    configureServer(server) {
      server.watcher.add(contentPath);
      server.watcher.on('change', (file) => {
        if (file === contentPath) server.ws.send({ type: 'full-reload' });
      });
    },
    generateBundle() {
      const { url } = readContent().site;
      const base = url.replace(/\/$/, '');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}/</loc></url>\n</urlset>\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`,
      });
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
            if (re.test(out)) {
              out = out.replace(re, () => `<style>${item.source}</style>`);
              delete bundle[name];
            }
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
  },
});
