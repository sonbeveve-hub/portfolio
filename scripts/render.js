// Dựng HTML từ content.json. Chạy trong Node (lúc build/dev), không dùng DOM.

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// "*từ*" trong chuỗi -> <em> (dùng để tô màu nhấn).
const accent = (s = '') => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');

const isExternal = (href = '') => /^https?:\/\//.test(href);
const linkAttrs = (href) => (isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : '');

const icons = {
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
};
export const icon = (name) => icons[name] || '';

const button = ({ label, href, variant = 'primary', extra = '' }) =>
  `<a class="btn btn--${variant}" href="${esc(href)}"${linkAttrs(href)} data-magnetic ${extra}><span>${esc(label)}</span>${icon('arrow')}</a>`;

export function renderMeta(c) {
  const { site } = c;
  const url = site.url.replace(/\/$/, '');
  const og = site.ogImage ? `${url}${site.ogImage}` : '';
  return [
    `<title>${esc(site.title)}</title>`,
    `<meta name="description" content="${esc(site.description)}" />`,
    `<meta name="theme-color" content="${esc(site.themeColor)}" />`,
    `<link rel="canonical" href="${esc(url)}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(site.title)}" />`,
    `<meta property="og:description" content="${esc(site.description)}" />`,
    `<meta property="og:url" content="${esc(url)}/" />`,
    og && `<meta property="og:image" content="${esc(og)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
    .filter(Boolean)
    .join('\n    ');
}

function renderHeader(c) {
  const links = c.nav.map((n) => `<li><a href="${esc(n.href)}">${esc(n.label)}</a></li>`).join('');
  return `
<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="logo" href="#top" aria-label="${esc(c.brand.logo)}">${esc(c.brand.logo)}<span class="logo__mark">${esc(c.brand.logoMark)}</span></a>
    <nav class="nav" id="site-nav" aria-label="Chính" data-nav>
      <ul class="nav__list">${links}</ul>
    </nav>
    <div class="site-header__actions">
      ${button({ label: c.cta.label, href: c.cta.href, extra: 'data-cta-header' })}
      <button class="icon-btn" type="button" data-theme-toggle aria-label="${esc(c.ui.toggleTheme)}">
        <span class="icon-btn__sun">${icon('sun')}</span><span class="icon-btn__moon">${icon('moon')}</span>
      </button>
      <button class="icon-btn nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav" aria-label="${esc(c.ui.openMenu)}" data-label-open="${esc(c.ui.openMenu)}" data-label-close="${esc(c.ui.closeMenu)}">
        <span class="nav-toggle__open">${icon('menu')}</span><span class="nav-toggle__close">${icon('close')}</span>
      </button>
    </div>
  </div>
</header>`;
}

function renderHero(c) {
  const h = c.hero;
  return `
<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero__visual" data-hero-visual aria-hidden="true"></div>
  <div class="container hero__inner">
    <p class="eyebrow">${esc(h.eyebrow)}</p>
    <h1 class="display" id="hero-title">${accent(h.headline)}</h1>
    <p class="lead">${esc(h.subline)}</p>
    <p class="audience">${esc(h.audience)}</p>
    <div class="hero__cta">${button({ label: c.cta.label, href: c.cta.href })}</div>
  </div>
</section>`;
}

// Các section còn lại được hoàn thiện ở các mốc sau; tạm render tiêu đề để anchor menu hoạt động.
function renderStub(id, title) {
  return `
<section class="section" id="${id}" aria-labelledby="${id}-title">
  <div class="container">
    <h2 class="h2" id="${id}-title">${esc(title)}</h2>
  </div>
</section>`;
}

function renderFooter(c) {
  return `
<footer class="site-footer">
  <div class="container site-footer__inner">
    <p>© ${new Date().getFullYear()} ${esc(c.footer.copyright)}</p>
  </div>
</footer>`;
}

export function renderPage(c) {
  return `
<a class="skip-link" href="#main">${esc(c.ui.skip)}</a>
${renderHeader(c)}
<main id="main">
${renderHero(c)}
${renderStub('services', c.services.title)}
${renderStub('work', c.work.title)}
${renderStub('about', c.about.title)}
${renderStub('contact', c.contactCta.title)}
</main>
${renderFooter(c)}`;
}
