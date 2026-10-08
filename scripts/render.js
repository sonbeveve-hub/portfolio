// Dựng HTML từ content.json. Chạy trong Node (lúc build/dev), không dùng DOM.

export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// "*từ*" -> chữ serif nghiêng.
export const accent = (s = '') => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');

export const isExternal = (href = '') => /^https?:\/\//.test(href);
export const linkAttrs = (href) => (isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : '');
export const pad2 = (n) => String(n).padStart(2, '0');
export const navLabel = (c, key, fb = '') => c.nav.find((n) => n.key === key)?.label || fb;

// Ngữ cảnh trang đang dựng (render chạy đồng bộ trong Node nên dùng biến toàn cục cho gọn).
const CTX = { lang: 'vi', prefix: '', page: 'home', alt: null };
export const setContext = (ctx) => Object.assign(CTX, ctx);
export const getContext = () => CTX;
export const href = (path = '/') => CTX.prefix + path;

export const S = (inner, extra = '') => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"${extra}>${inner}</svg>`;

const icons = {
  sun: S('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: S('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
  arrow: S('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  arrowUR: S('<path d="M7 17L17 7M8 7h9v9"/>'),
  arrowL: S('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  menu: S('<path d="M3 9h18M3 15h18"/>'),
  close: S('<path d="M6 6l12 12M18 6L6 18"/>'),
  play: S('<path d="M8 5.5v13l11-6.5z"/>'),
  pause: S('<path d="M8 5v14M16 5v14"/>'),
  layout: S('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>'),
  compass: S('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
  layers: S('<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5"/>'),
  calendar: S('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>'),
  message: S('<path d="M4 5h16v11H9l-5 4z"/>'),
  spark: S('<path d="M12 3c.6 5.4 3.6 8.4 9 9-5.4.6-8.4 3.6-9 9-.6-5.4-3.6-8.4-9-9 5.4-.6 8.4-3.6 9-9z"/>'),
  // Social (nét mảnh)
  linkedin: S('<path d="M5 9.5V19M5 5.5v.5M9.5 19v-9.5M9.5 13c0-2.2 1.4-3.5 3.3-3.5s3.2 1.3 3.2 3.6V19"/>'),
  behance: S('<path d="M3 6h6a3 3 0 010 6H3zM3 12h7a3.2 3.2 0 010 6.4H3zM14 9.5h7M14.3 14.5h6.7a3 3 0 10-2.7 3"/>'),
  dribbble: S('<circle cx="12" cy="12" r="9"/><path d="M5.5 7.5c5 1 9 .5 13-2M3.2 12.5c6.5-1 11.5 1 14.3 6.5M9 3.3c3 3.5 5 8 5.5 17"/>'),
  zalo: S('<path d="M5 6h13L6 18h13"/>'),
  mail: S('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>'),
};
export const icon = (name) => icons[name] || '';
export const iconNames = Object.keys(icons);

// Hình trang trí (điền màu, dùng trong chữ khổng lồ và câu About)
const shapes = {
  gem: S('<rect x="4.5" y="4.5" width="15" height="15" rx="4.5" transform="rotate(45 12 12)"/><circle cx="12" cy="12" r="3.2" fill="none"/>', ' class="is-outline"'),
  clover: S('<circle cx="8" cy="8" r="4"/><circle cx="16" cy="8" r="4"/><circle cx="8" cy="16" r="4"/><circle cx="16" cy="16" r="4"/>'),
  burst: S('<g stroke="currentColor" stroke-width="1.6" stroke-linecap="round">' + Array.from({ length: 16 }, (_, i) => { const a = (i * Math.PI) / 8; return `<path d="M${(12 + 5 * Math.cos(a)).toFixed(2)} ${(12 + 5 * Math.sin(a)).toFixed(2)}L${(12 + 10 * Math.cos(a)).toFixed(2)} ${(12 + 10 * Math.sin(a)).toFixed(2)}"/>`; }).join('') + '</g>'),
  star4: S('<path d="M12 1.5c.9 6.3 4.2 9.6 10.5 10.5-6.3.9-9.6 4.2-10.5 10.5C11.1 16.2 7.8 12.9 1.5 12 7.8 11.1 11.1 7.8 12 1.5z"/>'),
  eye: S('<path d="M1 12c3-5.2 7-7.5 11-7.5S20 6.800 23 12c-3 5.200-7 7.500-11 7.500S4 17.200 1 12z"/><circle cx="12" cy="12" r="3.6" fill="var(--bg)"/>'),
  checker: S('<rect x="2" y="2" width="10" height="10"/><rect x="12" y="12" width="10" height="10"/>'),
  ring: S('<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="4.6" ry="10" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="1.2"/>'),
  asterisk: S('<g stroke="currentColor" stroke-width="3.4" stroke-linecap="round"><path d="M12 2.500v19M3.800 7.200l16.400 9.600M3.800 16.800L20.200 7.200"/></g>'),
  half: S('<path d="M2 3h9a10 9 0 010 18H2z" transform="translate(4 0)"/>'),
};
export const shapeNames = Object.keys(shapes);
export const shape = (name, cls = '') => `<span class="shape ${cls}" aria-hidden="true">${shapes[name] || ''}</span>`;

export const pill = ({ label, href, cls = '', attrs = '' }) =>
  `<a class="btn ${cls}" href="${esc(href)}"${linkAttrs(href)} data-magnetic ${attrs}><span>${esc(label)}</span>${icon('arrowUR')}</a>`;

export function renderMeta(c, doc) {
  const { site } = c;
  const origin = site.url.replace(/\/$/, '');
  const title = doc.title ? `${doc.title} — ${c.brand.logo}` : site.title;
  const og = site.ogImage ? `${origin}${site.ogImage}` : '';
  const alts = (doc.alternates || [])
    .map((a) => `<link rel="alternate" hreflang="${a.lang}" href="${esc(origin + a.path)}" />`)
    .concat(doc.alternates?.length ? [`<link rel="alternate" hreflang="x-default" href="${esc(origin + doc.alternates[0].path)}" />`] : []);
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(doc.description || site.description)}" />`,
    `<meta name="theme-color" content="${esc(site.themeColor)}" />`,
    `<link rel="canonical" href="${esc(origin + doc.path)}" />`,
    ...alts,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="${c.site.lang === 'vi' ? 'vi_VN' : 'en_US'}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(doc.description || site.description)}" />`,
    `<meta property="og:url" content="${esc(origin + doc.path)}" />`,
    og && `<meta property="og:image" content="${esc(og)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
    .filter(Boolean)
    .join('\n    ');
}

/* ---------- Nav (viên thuốc cố định ở đáy) ---------- */
export function pageLabel(c) {
  return CTX.page === 'home' || !c.nav.some((n) => n.key === CTX.page) ? c.ui.home : navLabel(c, CTX.page);
}

export function renderNav(c) {
  const items = c.nav
    .map((n) => `<li><a class="nav__link" href="${href(`/${n.key}/`)}" data-nav-link${CTX.page === n.key ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`)
    .join('');
  const cta = `<li class="nav__li-cta">${pill({ label: c.cta.label, href: c.cta.href })}</li>`;
  const alt = CTX.alt;
  const lang = alt
    ? `<a class="nav__lang" href="${esc(alt.path)}" hreflang="${alt.lang}" lang="${alt.lang}" data-lang-switch aria-label="${esc(c.ui.langCode)} · ${esc(c.ui.langName)}">${esc(c.ui.langCode)}</a>`
    : '';
  return `
<nav class="nav" data-nav aria-label="${esc(c.ui.nav || 'Main')}">
  <div class="nav__bar">
    <button class="nav__theme" type="button" data-theme-toggle aria-label="${esc(c.ui.toggleTheme)}">
      <span class="ico-sun">${icon('sun')}</span><span class="ico-moon">${icon('moon')}</span>
    </button>
    <ul class="nav__list" id="nav-list">${items}${cta}</ul>
    <span class="nav__current" data-nav-current aria-hidden="true">${esc(pageLabel(c))}</span>
    ${lang}
    ${pill({ label: c.cta.label, href: c.cta.href, cls: 'nav__cta' })}
    <button class="nav__burger" type="button" data-nav-toggle aria-expanded="false" aria-controls="nav-list" aria-label="${esc(c.ui.openMenu)}" data-label-open="${esc(c.ui.openMenu)}" data-label-close="${esc(c.ui.closeMenu)}">
      <span class="ico-open">${icon('menu')}</span><span class="ico-close">${icon('close')}</span>
    </button>
  </div>
</nav>`;
}

/* ---------- Hero ---------- */
function renderHero(c) {
  const h = c.hero;
  const lines = h.lines
    .map((l, i) => `<span class="hline hline--${l.style}${l.align === 'right' ? ' is-right' : ''}" style="--i:${i}"><span class="hline__in">${esc(l.text)}</span></span>`)
    .join(' ');
  const cta = h.lines.some((l) => l.cta) ? pill({ label: c.cta.label, href: c.cta.href, cls: 'hero__cta' }) : '';
  return `
<section class="hero" id="top" data-section="${esc(c.ui.home)}">
  <div class="hero__visual" data-hero-visual aria-hidden="true"></div>
  <a class="hero__logo" href="${href('/')}" aria-label="${esc(c.brand.logo)}">${esc(c.brand.logo)}<span>${esc(c.brand.logoMark)}</span></a>
  <div class="hero__inner">
    <div class="hero__head">
      <h1 class="hero__title">${lines}</h1>
      ${cta}
    </div>
    <div class="hero__tags">
      <p class="hero__tag" style="--i:3">${esc(h.tagLeft)}</p>
      <p class="hero__tag" style="--i:4">${esc(h.tagRight)}</p>
    </div>
  </div>
</section>`;
}

/* ---------- About: câu lớn, chữ sáng dần theo cuộn ---------- */
// Quy ước trong content.json: *nghiêng serif*, __gạch chân__, [[tên-hình]] hình nhỏ chèn giữa câu.
export function statementTokens(text = '') {
  const parts = text.split(/(\[\[[a-z0-9]+\]\]|__[^_]+__|\*[^*]+\*)/).filter((p) => p && p.trim() !== '');
  const out = [];
  for (const part of parts) {
    const t = part.trim();
    if (t.startsWith('[[')) out.push(`<span class="word word--icon">${shape(t.slice(2, -2), 'shape--inline')}</span>`);
    else if (t.startsWith('__')) t.slice(2, -2).split(/\s+/).forEach((w) => out.push(`<span class="word"><u>${esc(w)}</u></span>`));
    else if (t.startsWith('*')) t.slice(1, -1).split(/\s+/).forEach((w) => out.push(`<span class="word"><em>${esc(w)}</em></span>`));
    else t.split(/\s+/).forEach((w) => out.push(`<span class="word">${esc(w)}</span>`));
  }
  return out.join(' ');
}

function renderAbout(c) {
  return `
<section class="about" id="about" aria-labelledby="about-title">
  <div class="wrap wrap--statement">
    <h2 class="sr-only" id="about-title">${esc(navLabel(c, '#about', 'About'))}</h2>
    <p class="statement" data-statement>${statementTokens(c.about.statement)}</p>
    <div class="ruler" aria-hidden="true" data-ruler><span class="ruler__mark"></span></div>
  </div>
</section>`;
}

/* ---------- Showreel ---------- */
function renderReel(c) {
  const r = c.reel;
  const unit = `<span class="reel__word">${esc(r.marquee)}</span><span class="reel__word reel__word--serif">${esc(r.marquee)}</span>`;
  return `
<section class="reel" aria-label="${esc(r.label)}">
  <video class="reel__video" muted loop playsinline preload="none" poster="${esc(r.poster)}" data-reel-video>
    <source src="${esc(r.video)}" type="video/webm" />
  </video>
  <div class="reel__shade" aria-hidden="true"></div>
  <div class="reel__marquee" aria-hidden="true"><div class="reel__track">${unit.repeat(3)}${unit.repeat(3)}</div></div>
  <button class="reel__play" type="button" data-reel-toggle aria-pressed="false" aria-label="${esc(r.playLabel)}" data-label-play="${esc(r.playLabel)}" data-label-pause="${esc(r.pauseLabel)}">
    <span class="ico-play">${icon('play')}</span><span class="ico-pause">${icon('pause')}</span>
  </button>
</section>`;
}

/* ---------- Số liệu ---------- */
export function renderStats(c) {
  const items = c.stats
    .map(
      (s, i) => `
      <li class="stat" data-reveal style="--i:${i}">
        <div class="stat__row">
          <p class="stat__num"><span data-count="${Number(s.value)}">${Number(s.value)}</span>${esc(s.suffix || '')}</p>
          <span class="stat__unit">${esc(s.unit)}</span>
        </div>
        <p class="stat__desc">${esc(s.label)}</p>
      </li>`,
    )
    .join('');
  return `
<section class="stats" aria-label="${esc(c.ui.statsLabel)}">
  <div class="wrap wrap--work"><ul class="stats__grid">${items}</ul></div>
</section>`;
}

/* ---------- Dịch vụ ---------- */
function renderServices(c) {
  const s = c.services;
  const rows = s.items
    .map(
      (it, i) => `
      <li><a class="srow" data-srow href="${href(`/services/#${it.slug}`)}">
        <span class="srow__side srow__side--l">${pad2(i + 1)}</span>
        <h3 class="srow__title"><span class="srow__icon">${icon(it.icon)}</span><span>${esc(it.title)}</span></h3>
        <p class="srow__side srow__side--r">${esc(it.text)}</p>
      </a></li>`,
    )
    .join('');
  const a = s.audience;
  return `
<section class="services" id="services" aria-labelledby="services-title">
  <div class="services__head">
    <h2 class="services__title" id="services-title" data-reveal>${accent(s.title)}</h2>
    <div class="services__sub" data-reveal style="--i:1">
      <p>${esc(s.tagline)}</p>
      ${pill({ label: s.button.label, href: href('/services/'), cls: 'btn--outline' })}
    </div>
  </div>
  <ol class="services__list">${rows}</ol>
  <div class="wrap wrap--work audience" data-reveal>
    <p class="audience__label">${esc(a.label)}</p>
    <p>${esc(a.textA)}</p>
    <p>${esc(a.textB)}</p>
  </div>
</section>`;
}

/* ---------- Dự án ---------- */
function renderWork(c) {
  const w = c.work;
  const items = w.items
    .map((p) => {
      const url = p.status === 'soon' ? '' : href(`/work/${p.slug}/`);
      const link = url
        ? `<a class="proj__link" href="${esc(url)}" data-cursor="link">${esc(w.linkLabel)}<span class="sr-only"> — ${esc(p.title)}</span></a>`
        : `<span class="proj__soon">${esc(w.soonLabel)}</span>`;
      const img = (src, alt, cls) =>
        src ? `<figure class="ph ${cls}"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" /></figure>` : '';
      return `
      <article class="proj" data-reveal>
        <header class="proj__head">
          <div>
            <span class="tag">${esc(p.industry)}</span>
            <h3 class="proj__title">${esc(p.title)}</h3>
          </div>
          ${link}
        </header>
        <div class="proj__media">${img(p.image, p.alt, 'ph--a')}${img(p.image2, '', 'ph--b')}</div>
      </article>`;
    })
    .join('');
  return `
<section class="work" id="work" aria-labelledby="work-title">
  <div class="wrap wrap--work">
    <h2 class="sr-only" id="work-title">${esc(w.title)}</h2>
    ${items}
  </div>
</section>`;
}

/* ---------- CTA sau dự án ---------- */
export function renderWorksCta(c) {
  const w = c.worksCta;
  return `
<section class="wcta" aria-labelledby="wcta-title">
  <h2 class="wcta__title" id="wcta-title" data-reveal>
    <span class="wcta__row"><span>${esc(w.line1)}</span>${shape('eye', 'wcta__eye')}</span>
    <span class="wcta__row"><span class="wcta__serif">${esc(w.line2a)}</span><span class="wcta__toggle" aria-hidden="true"><span class="wcta__knob"><img src="${esc(c.about.portrait)}" alt="" width="120" height="150" loading="lazy" decoding="async" /></span></span><span class="wcta__serif">${esc(w.line2b)}</span></span>
    <span class="wcta__row"><span>${esc(w.line3)}</span></span>
  </h2>
  <p class="wcta__text" data-reveal style="--i:1">${esc(w.text)}</p>
  <a class="wcta__btn" href="${href('/work/')}" data-magnetic data-reveal style="--i:2"><span class="wcta__btn-label">${esc(w.label)}</span><span class="wcta__btn-circle">${icon('arrow')}</span></a>
</section>`;
}

/* ---------- Lời chứng thực (xếp chồng) ---------- */
function renderTestimonials(c) {
  const t = c.testimonials;
  const cards = t.items
    .map(
      (it, i) => `
      <figure class="tcard" data-tcard style="--o:${i}">
        <blockquote>${esc(it.quote)}</blockquote>
        <figcaption><strong>${esc(it.name)}</strong> - <span>${esc(it.role)}</span></figcaption>
      </figure>`,
    )
    .join('');
  return `
<section class="testi" aria-labelledby="testi-title">
  <div class="wrap wrap--work testi__grid">
    <div class="testi__intro" data-reveal>
      <h2 class="testi__title" id="testi-title">${accent(t.title)}</h2>
      <p class="testi__text">${esc(t.text)}</p>
      <div class="testi__ctrl">
        <button type="button" class="round-btn" data-tprev aria-label="${esc(t.prev)}">${icon('arrowL')}</button>
        <button type="button" class="round-btn" data-tnext aria-label="${esc(t.next)}">${icon('arrow')}</button>
      </div>
    </div>
    <div class="testi__deck" data-deck role="group" aria-roledescription="carousel" aria-live="polite" data-reveal style="--i:1">${cards}</div>
  </div>
</section>`;
}

/* ---------- Chữ khổng lồ chạy ngang theo cuộn ---------- */
export function renderBigText(c) {
  const q = c.quote;
  return `
<section class="bigtext">
  <p class="bigtext__h">
    <span class="bt bt--1" data-parallax="-1"><span>${esc(q.line1)}</span>${shape('burst')}${shape('star4')}${shape('asterisk')}</span>
    <span class="bt bt--2" data-parallax="1">${shape('half')}<span class="bt__serif">${esc(q.line2)}</span></span>
    <span class="bt bt--3" data-parallax="-1">${shape('checker')}<span>${esc(q.line3)}</span>${shape('ring')}${shape('clover')}${shape('checker')}${shape('asterisk')}</span>
  </p>
</section>`;
}

/* ---------- Đối tác (lưới có viền) ---------- */
function renderPartners(c) {
  const p = c.partners;
  const cells = p.items
    .map((it) => `<li class="pcell">${it.logo ? `<img src="${esc(it.logo)}" alt="${esc(it.name)}" loading="lazy" decoding="async" />` : `<span class="pname">${esc(it.name)}</span>`}</li>`)
    .join('');
  return `
<section class="partners" aria-labelledby="partners-title">
  <div class="partners__head" data-reveal>
    <h2 class="partners__title" id="partners-title">${accent(p.title)}</h2>
    <p>${esc(p.text)}</p>
  </div>
  <div class="wrap wrap--work"><ul class="pgrid" data-reveal>${cells}</ul></div>
</section>`;
}

/* ---------- Footer ---------- */
export function renderFooter(c) {
  const ct = c.contact;
  const socials = ct.socials
    .map((s) => `<li><a class="social" href="${esc(s.href)}"${linkAttrs(s.href)}><span class="social__icon">${icon(s.icon)}</span><span class="social__label">${esc(s.label)}</span></a></li>`)
    .join('');
  const legal = c.footer.legal.map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join('');
  return `
<footer class="footer" id="contact" aria-labelledby="footer-title">
  <div class="wrap wrap--work">
    <h2 class="footer__title" id="footer-title" data-reveal>${esc(ct.title)}</h2>
    <div class="footer__row" data-reveal style="--i:1">
      <div class="footer__text">
        <p>${esc(ct.text)}</p>
        <button type="button" class="link-u" data-open-form>${esc(ct.writeLabel)}</button>
      </div>
      <button type="button" class="btn btn--outline" data-open-form data-magnetic><span>${esc(ct.button.label)}</span>${icon('arrowUR')}</button>
    </div>
  </div>
  <div class="wrap wrap--wide"><ul class="socials" data-reveal>${socials}</ul></div>
  <div class="wrap wrap--work footer__bottom">
    <p>© ${new Date().getFullYear()} ${esc(c.footer.copyright)}</p>
    <a class="footer__logo" href="${href('/')}" aria-label="${esc(c.brand.logo)}">${esc(c.brand.logo)}<span>${esc(c.brand.logoMark)}</span></a>
    <ul class="footer__legal">${legal}</ul>
  </div>
</footer>
${renderForm(c)}`;
}

export function renderForm(c) {
  const f = c.contact.form;
  const chips = f.options
    .map((o, i) => `<label class="chip"><input type="checkbox" name="topic" value="${esc(o)}" /><span>${esc(o)}</span></label>`)
    .join('');
  return `
<dialog class="dlg" data-form-dialog aria-labelledby="form-title">
  <form class="dlg__form" data-form novalidate data-msg-sending="${esc(f.sending)}" data-msg-success="${esc(f.success)}" data-msg-error="${esc(f.error)}" data-msg-invalid="${esc(f.invalid)}">
    <button type="button" class="dlg__close" data-close-form aria-label="${esc(f.close)}">${icon('close')}</button>
    <h2 class="dlg__title" id="form-title">${accent(f.title)}</h2>
    <p class="dlg__intro">${esc(f.intro)}</p>
    <div class="dlg__grid">
      <label class="field"><span>${esc(f.name)} *</span><input name="name" type="text" autocomplete="name" required /></label>
      <label class="field"><span>${esc(f.email)} *</span><input name="email" type="email" autocomplete="email" required /></label>
      <label class="field"><span>${esc(f.contact)}</span><input name="contact" type="text" /></label>
      <label class="field"><span>${esc(f.company)}</span><input name="company" type="text" autocomplete="organization" /></label>
    </div>
    <fieldset class="dlg__chips"><legend>${esc(f.lookingFor)} *</legend><div>${chips}</div></fieldset>
    <label class="field"><span>${esc(f.message)} *</span><textarea name="message" rows="3" required></textarea></label>
    <div class="dlg__actions">
      <button class="dlg__send" type="submit" data-submit><span class="dlg__send-label">${esc(f.submit)}</span><span class="dlg__send-circle">${icon('arrow')}</span></button>
    </div>
    <p class="dlg__status" data-status role="status" aria-live="polite"></p>
  </form>
</dialog>`;
}

/* ---------- Preloader + lớp chuyển trang ---------- */
function nameChars(c, cls) {
  let n = 0;
  return c.brand.nameLines
    .map((line) => `<span class="${cls}__line">${[...line].map((ch) => `<span class="${cls}__mask"><span class="${cls}__char" style="--ci:${n++}">${esc(ch)}</span></span>`).join('')}</span>`)
    .join('');
}

export const markSvg = `<svg class="mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="48" cy="48" r="9" fill="var(--accent)"/></svg>`;

export function renderOverlays(c) {
  const imgs = c.work.items.map((p) => p.image).filter(Boolean);
  return `
<div class="pre" data-pre data-images='${esc(JSON.stringify(imgs))}' aria-hidden="true">
  <div class="pre__stage">
    <div class="pre__cell pre__cell--logo">${markSvg}</div>
    <div class="pre__cell pre__cell--img"><img alt="" width="200" height="240" data-pre-img /></div>
    <div class="pre__cell pre__cell--num">[<span data-pre-num>0</span>%]</div>
  </div>
  <p class="pre__name">${nameChars(c, 'pre')}</p>
</div>
<div class="pt" data-pt aria-hidden="true">${Array.from({ length: 6 }, (_, k) => `<i class="pt__col" style="--k:${k}"></i>`).join('')}<p class="pt__name">${nameChars(c, 'pt')}</p></div>`;
}

/* Khung chung cho mọi trang: skip-link, preloader, nav, nội dung chính, footer + form. */
export function renderShell(c, mainHtml) {
  return `
<a class="skip-link" href="#main">${esc(c.ui.skip)}</a>
${renderOverlays(c)}
${renderNav(c)}
<main id="main">
${mainHtml}
</main>
${renderFooter(c)}`;
}

/* Nội dung trang chủ */
export function renderHome(c) {
  return [renderHero(c), renderAbout(c), renderReel(c), renderStats(c), renderServices(c), renderWork(c), renderWorksCta(c), renderTestimonials(c), renderBigText(c), renderPartners(c)].join('\n');
}
