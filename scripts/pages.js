// Các trang con: Work, Services, About và trang chi tiết từng dự án. Chạy trong Node (lúc build/dev).
import { esc, accent, icon, shape, pill, href, pad2, renderStats, renderBigText, getContext } from './render.js';

const logo = (c) =>
  `<a class="hero__logo" href="${href('/')}" aria-label="${esc(c.brand.logo)}">${esc(c.brand.logo)}<span>${esc(c.brand.logoMark)}</span></a>`;

/* Nét cong trang trí ở nền (giống lớp hình nền của trang mẫu) */
const bgShapes = () => `
<div class="bgshape" aria-hidden="true">
  <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="380" cy="70" r="330"/>
    <circle cx="1060" cy="470" r="470"/>
    <path d="M0 250C380 240 760 420 1100 70S1440 40 1440 40"/>
    <path d="M1110 0C1110 380 1040 700 820 900"/>
  </svg>
</div>`;

const arrowBtn = (label, attrs, tag = 'a') =>
  `<${tag} class="rbtn" ${attrs} data-magnetic><span class="rbtn__label">${esc(label)}</span><span class="rbtn__circle">${icon('arrow')}</span></${tag}>`;

/* Đoạn chốt trang: "Your next product is already behind schedule. Let's get to [Work] →" */
function renderClosing(c, toWork) {
  const cl = c.pages.about.closing;
  const btn = toWork
    ? arrowBtn(cl.btn, `href="${href('/work/')}"`)
    : arrowBtn(c.contact.button.label, 'type="button" data-open-form', 'button');
  return `
<section class="closing" aria-label="${esc(cl.b)}">
  <p class="closing__t" data-reveal>
    <span>${accent(cl.a)}</span>
    <span>${esc(cl.b)}</span>
    <span class="closing__last">${esc(cl.c)} ${btn}</span>
  </p>
</section>`;
}

/* ---------- /work ---------- */
export function renderWorkPage(c) {
  const p = c.pages.work;
  const rows = c.work.items
    .map((it, i) => {
      const inner = `<span class="wrow__title">${esc(it.title)}</span><span class="wrow__tags">${it.status === 'soon' ? esc(c.work.soonLabel) : '/ ' + esc(it.tags.join(', '))}</span><span class="wrow__n">${i + 1}</span>`;
      return it.status === 'soon'
        ? `<li><span class="wrow is-soon">${inner}</span></li>`
        : `<li><a class="wrow" href="${href(`/work/${it.slug}/`)}" data-preview="${esc(it.image)}">${inner}</a></li>`;
    })
    .join('');
  return `
${bgShapes()}
<section class="phero" aria-labelledby="page-title">
  ${logo(c)}
  <div class="phero__inner">
    <h1 class="phero__title" id="page-title">${accent(p.title)}</h1>
    <p class="phero__lead">${esc(p.text)}</p>
  </div>
</section>
<section class="wlist wrap wrap--work" aria-label="${esc(c.work.title)}"><ol class="wlist__ol" data-reveal>${rows}</ol></section>
<img class="wprev" data-wprev alt="" aria-hidden="true" />
${renderClosing(c, false)}`;
}

/* ---------- /services ---------- */
const SERVICE_SHAPES = ['burst', 'clover', 'star4', 'asterisk', 'ring', 'eye'];

export function renderServicesPage(c) {
  const p = c.pages.services;
  const items = c.services.items;

  // Dải ảnh đầu trang (mờ dần ở đáy)
  const widths = ['1.3', '0.95', '1.7', '0.8', '1.4'];
  const strip = items
    .concat(items)
    .map((it, i) => `<img src="${esc(it.image)}" alt="" style="aspect-ratio:${widths[i % widths.length]}" loading="lazy" decoding="async" />`)
    .join('');

  // Mục lục dịch vụ: 2 cột, có số, nhãn nhỏ, mũi tên; mục "sắp ra mắt" bị mờ
  const soon = c.services.soon;
  const total = items.length + (soon ? 1 : 0);
  const idx = items
    .map(
      (it, i) => `<li><a class="sidx" href="#${esc(it.slug)}" data-reveal style="--i:${i % 4}">
        <span class="sidx__n">${pad2(i + 1)}</span><span class="sidx__t">${esc(it.title)}</span>${it.badge ? `<span class="badge">${esc(it.badge)}</span>` : ''}<span class="sidx__arrow">${icon('arrow')}</span></a></li>`,
    )
    .concat(soon ? [`<li><span class="sidx is-soon"><span class="sidx__n">${pad2(total)}</span><span class="sidx__t">${esc(soon.title)}</span><span class="badge">${esc(soon.label)}</span></span></li>`] : [])
    .join('');

  const sections = items
    .map(
      (it, i) => `
<section class="svc" id="${esc(it.slug)}" aria-labelledby="${esc(it.slug)}-t">
  <div class="wrap wrap--work">
    <h2 class="svc__title" id="${esc(it.slug)}-t" data-reveal>${shape(SERVICE_SHAPES[i % SERVICE_SHAPES.length], 'svc__shape')}${esc(it.title)}</h2>
    <div class="svc__cols">
      <div data-reveal>
        <p class="svc__label">${esc(p.expect)}</p>
        <p class="svc__text">${esc(it.long)}</p>
        ${arrowBtn(c.ui.reach, 'type="button" data-open-form', 'button')}
      </div>
      <div data-reveal style="--i:1">
        <p class="svc__label">${esc(p.bag)}</p>
        <ol class="svc__list">${it.deliverables.map((d, k) => `<li><span>${pad2(k + 1)}</span>${esc(d)}</li>`).join('')}</ol>
      </div>
    </div>
  </div>
  <div class="svc__band" data-reveal>
    <figure><img src="${esc(it.image)}" alt="${esc(it.imageAlt || '')}" loading="lazy" decoding="async" /></figure>
    <figure><img src="${esc(items[(i + 1) % items.length].image)}" alt="" loading="lazy" decoding="async" /></figure>
  </div>
</section>`,
    )
    .join('');

  // Nguyên tắc: 4 cột mở rộng khi rê chuột / bấm (con trỏ hiện nhãn "Mở rộng")
  const acc = p.principles
    .map(
      (x, i) => `<button type="button" class="acc__col" aria-expanded="false" data-acc data-cursor-label="${esc(p.expand)}">
        <span class="acc__n">${pad2(i + 1)}</span>
        <span class="acc__text">${esc(x.text)}</span>
        <span class="acc__t">${esc(x.title)}</span>
      </button>`,
    )
    .join('');

  // Số liệu: lưới thẻ bo góc, ô tiêu đề chiếm hai cột đầu
  const cards = p.metricItems
    .map((m, i) => `<div class="mcard" data-reveal style="--i:${i % 3}"><span class="mcard__v">${esc(m.value)}</span><span class="mcard__l">${esc(m.label)}</span></div>`)
    .join('');
  const first = cards.indexOf('</div>') + 6;

  return `
${bgShapes()}
<section class="phero phero--services" aria-labelledby="page-title">
  ${logo(c)}
  <div class="phero__inner">
    <h1 class="phero__title" id="page-title">${accent(p.h1)}</h1>
    <p class="phero__lead phero__lead--right">${esc(p.lead)}</p>
  </div>
  <div class="strip" aria-hidden="true"><div class="strip__track">${strip}</div></div>
</section>
<section class="sindex wrap wrap--work" aria-label="${esc(c.services.title.replace(/\*/g, ''))}">
  <ul class="sindex__list" style="--rows:${Math.ceil(total / 2)}">${idx}</ul>
</section>
${sections}
<section class="acc wrap wrap--work" aria-labelledby="acc-t">
  <h2 class="acc__h" id="acc-t" data-reveal>${accent(p.principlesTitle)}</h2>
  <div class="acc__row" data-reveal>${acc}</div>
</section>
<section class="metrics2 wrap wrap--work" aria-labelledby="metrics-t">
  <div class="metrics2__grid">
    <h2 class="metrics2__title" id="metrics-t" data-reveal>${accent(p.metricsTitle)}</h2>
    ${cards}
  </div>
</section>
${renderClosing(c, false)}`;
}

/* ---------- Kinh nghiệm làm việc (About) ---------- */
const mIdx = (ym) => { const [y, m] = ym.split('-').map(Number); return y * 12 + (m - 1); };
const fmtMY = (ym) => `${ym.slice(5, 7)}/${ym.slice(0, 4)}`;

function renderExperience(x) {
  const now = new Date();
  const nowYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const items = x.items.map((it, i) => ({ ...it, i, s: mIdx(it.from), e: mIdx(it.to || nowYM) }));
  const jobs = items.filter((t) => t.type === 'employment').sort((p, q) => q.s - p.s);
  const free = items.filter((t) => t.type === 'freelance').sort((p, q) => q.s - p.s);
  const dur = (it) => {
    const n = it.e - it.s + 1, y = Math.floor(n / 12), m = n % 12;
    return [y ? `${y} ${x.units.y}` : '', m ? `${m} ${x.units.m}` : ''].filter(Boolean).join(' ');
  };
  const period = (it) => `${fmtMY(it.from)} — ${it.to ? fmtMY(it.to) : x.now}`;

  // Mỗi dự án freelance thuộc công việc hợp đồng mà nó trùng thời gian nhiều nhất
  const groups = new Map(jobs.map((j) => [j.i, []]));
  const solo = [];
  free.forEach((f) => {
    let best = null, bestN = 0;
    jobs.forEach((j) => { const n = Math.min(j.e, f.e) - Math.max(j.s, f.s) + 1; if (n > bestN) { best = j; bestN = n; } });
    (best ? groups.get(best.i) : solo).push(f);
  });

  const body = (t) => `<div class="xrow__body"><div class="xrow__inner">
        <p>${esc(t.summary)}</p>
        <div><p class="xrow__rl">${esc(x.resultsLabel)}</p><ul>${(t.results || []).map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>
      </div></div>`;
  const row = (t, job) => `<li class="xrow${job ? ' xrow--job' : ''}" data-x="${t.i}">
      <button type="button" class="xrow__head" aria-expanded="false">
        <span class="xrow__name">${esc(job ? t.role : t.org)}</span>
        <span class="xrow__role">${esc(job ? t.org : t.role)}</span>
        <span class="xrow__time">${esc(period(t))}<small>${esc(dur(t))}</small></span>
        <span class="xrow__plus" aria-hidden="true"></span>
      </button>${body(t)}
    </li>`;
  const freeBlock = (title, list) => list.length
    ? `<div class="xfree"><h3 class="xfree__t">${esc(title)} <span>${list.length} ${esc(x.projects)}</span></h3><ul class="xlist">${list.map((f) => row(f, false)).join('')}</ul></div>` : '';
  const blocks = jobs.map((j) => `<article class="xjob" data-reveal>
    <ul class="xlist xlist--job">${row(j, true)}</ul>
    ${freeBlock(x.during, groups.get(j.i))}
  </article>`).join('') + (solo.length ? `<article class="xjob" data-reveal>${freeBlock(x.solo, solo)}</article>` : '');

  return `<section class="exp wrap wrap--work" aria-labelledby="exp-t" data-exp>
  <h2 class="sec-title" id="exp-t" data-reveal>${accent(x.title)}</h2>
  <p class="exp__lead" data-reveal>${esc(x.lead)}</p>
  <div class="xjobs">${blocks}</div>
</section>`;
}

/* ---------- /about ---------- */
export function renderAboutPage(c) {
  const a = c.pages.about;
  const chips = [`<button type="button" class="chip-btn is-on" data-cat="*" aria-pressed="true">${esc(a.tools.all)}</button>`]
    .concat([...new Set(a.tools.items.map((t) => t.cat))].map((cat) => `<button type="button" class="chip-btn" data-cat="${esc(cat)}" aria-pressed="false">${esc(cat)}</button>`))
    .join('');
  const tools = a.tools.items
    .map((t) => `<li class="tool" data-cat="${esc(t.cat)}"><span class="tool__tile" aria-hidden="true">${esc(t.name.slice(0, 1))}</span><span class="tool__name">${esc(t.name)}</span></li>`)
    .join('');
  const plist = a.principles.items.map((x) => `<li class="plist__row" data-reveal><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join('');
  const cred = (types) => a.awards.items
    .filter((x) => types.includes(x.type))
    .map((x) => `<li class="cred__row"><span class="cred__name">${esc(x.name)}</span><span class="cred__topic">${esc(x.topic)}</span></li>`)
    .join('');
  const exp = renderExperience(a.experience);
  const fast = a.fast.text.map((t) => `<p>${esc(t)}</p>`).join('');
  return `
${bgShapes()}
<section class="ahero" aria-labelledby="page-title">
  ${logo(c)}
  <div class="ahero__inner">
    <h1 class="ahero__title" id="page-title"><span>${esc(a.h1a)}</span><span>${accent(a.h1b)}${shape('burst', 'ahero__shape')}</span></h1>
    <p class="ahero__lead">${esc(a.lead)}</p>
  </div>
  <div class="aportrait" data-aportrait data-dither="${esc(a.dither)}" data-clean="${esc(a.clean)}">
    <img class="aportrait__static" src="${esc(a.dither)}" alt="${esc(a.portraitAlt)}" width="876" height="1572" fetchpriority="high" />
    <canvas class="aportrait__canvas" aria-hidden="true"></canvas>
  </div>
</section>
<section class="afast wrap wrap--work" aria-labelledby="fast-t">
  <h2 class="sec-title" id="fast-t" data-reveal>${accent(a.fast.title)}</h2>
  <div class="afast__cols">
    <div class="afast__art" aria-hidden="true" data-reveal>${['burst', 'clover', 'star4', 'ring', 'asterisk', 'eye', 'checker', 'half'].map((s) => shape(s)).join('')}</div>
    <div class="afast__text" data-reveal style="--i:1">${fast}</div>
  </div>
</section>
<section class="tools wrap wrap--work" aria-labelledby="tools-t">
  <h2 class="sec-title" id="tools-t" data-reveal>${accent(a.tools.title)}</h2>
  <p class="tools__text" data-reveal>${esc(a.tools.text)}</p>
  <div class="tools__chips" data-reveal role="group" data-tools-filter>${chips}</div>
  <ul class="tools__grid" data-reveal>${tools}</ul>
</section>
${renderBigText(c)}
<section class="photos wrap wrap--work" aria-hidden="false">
  <figure class="photos__a" data-reveal><img src="${esc(a.photos[0].src)}" alt="${esc(a.photos[0].alt)}" loading="lazy" decoding="async" /></figure>
  <figure class="photos__b" data-reveal style="--i:1"><img src="${esc(a.photos[1].src)}" alt="${esc(a.photos[1].alt)}" loading="lazy" decoding="async" /></figure>
</section>
<section class="principles wrap wrap--work" aria-labelledby="pr-t">
  <h2 class="sec-title" id="pr-t" data-reveal>${accent(a.principles.title)}</h2>
  <ul class="plist">${plist}</ul>
</section>
${exp}
<section class="cred wrap wrap--work" aria-labelledby="aw-t">
  <h2 class="cred__title" id="aw-t" data-reveal>${accent(a.awards.title)}</h2>
  <div class="cred__cols" data-reveal>
    <div><h3 class="cred__h">${esc(a.awards.colCert)}</h3><ul class="cred__list">${cred(['cert'])}</ul></div>
    <div><h3 class="cred__h">${esc(a.awards.colMore)}</h3><ul class="cred__list">${cred(['award', 'pub'])}</ul></div>
  </div>
</section>
${renderClosing(c, true)}`;
}

/* ---------- /work/<slug> ---------- */
export function renderProjectPage(c, slug) {
  const items = c.work.items;
  const idx = items.findIndex((p) => p.slug === slug);
  const p = items[idx];
  const d = p.detail;
  const meta = (d.meta || []).map((m) => `<div><dt>${esc(m.label)}</dt><dd>${esc(m.value)}</dd></div>`).join('');
  // Trường tuỳ chọn có thể bị bỏ trống khi sửa qua trang quản trị (/admin) → luôn có giá trị mặc định
  const sections = (d.sections || [])
    .map((s) => {
      const images = (s.images || []).filter(Boolean);
      const bullets = s.bullets?.length ? `<ul class="case__bullets">${s.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : '';
      const imgs = images.map((src) => `<figure><img src="${esc(src)}" alt="" loading="lazy" decoding="async" /></figure>`).join('');
      return `
<section class="case__sec wrap wrap--work">
  <div class="case__cols" data-reveal>
    <h2 class="case__h">${accent(s.title)}</h2>
    <div><p>${esc(s.text)}</p>${bullets}</div>
  </div>
  ${images.length ? `<div class="case__imgs case__imgs--${images.length}" data-reveal>${imgs}</div>` : ''}
</section>`;
    })
    .join('');
  const next = items.filter((x) => x.status !== 'soon');
  const nextItem = next[(next.findIndex((x) => x.slug === slug) + 1) % next.length];
  return `
<section class="chero" aria-labelledby="page-title">
  ${logo(c)}
  <img class="chero__img" src="${esc(p.image)}" alt="${esc(p.alt)}" width="1200" height="700" fetchpriority="high" />
  <div class="chero__fade" aria-hidden="true"></div>
</section>
<section class="cinfo wrap wrap--work">
  <h1 class="cinfo__title" id="page-title">${esc(p.title)}</h1>
  <dl class="cinfo__meta">${meta}</dl>
  <div class="cinfo__intro" data-reveal>
    <h2 class="case__h">${accent(d.intro.title)}</h2>
    <p>${esc(d.intro.text)}</p>
  </div>
</section>
${sections}
<section class="cresult wrap wrap--work" data-reveal>
  <h2 class="sec-title">${accent(d.result.title)}</h2>
  <p>${esc(d.result.text)}</p>
</section>
<section class="cnext wrap wrap--work">
  <p class="cnext__label">${esc(c.work.next)}</p>
  <a class="cnext__link" href="${href(`/work/${nextItem.slug}/`)}" data-magnetic>${esc(nextItem.title)}<span aria-hidden="true">${icon('arrow')}</span></a>
</section>`;
}

export const pageMain = { work: renderWorkPage, services: renderServicesPage, about: renderAboutPage };
export { getContext };
