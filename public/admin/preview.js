/* Xem trước trong trang quản trị: mô phỏng giao diện site (nền tối, Inter, chữ nhấn serif, xanh neon).
   Chạy sau decap-cms.js — dùng window.CMS và window.h (React.createElement) do Decap cung cấp. */
(function () {
  var CMS = window.CMS, h = window.h;
  if (!CMS || !h) return;

  // Bổ sung chữ tiếng Việt còn thiếu trong giao diện Decap (gói vi gốc còn để tiếng Anh vài chỗ)
  (function () {
    var base = CMS.getLocale && CMS.getLocale('vi');
    if (!base) return;
    var add = {
      collection: { collectionTop: { newButton: 'Thêm %{collectionLabel}', viewAsList: 'Xem dạng danh sách', viewAsGrid: 'Xem dạng lưới', groupBy: 'Nhóm theo' }, groups: { other: 'Khác', negateLabel: 'Không phải %{label}' } },
      editor: {
        editorControlPane: { i18n: { writingInLocale: 'Đang viết bản %{locale}', copyFromLocale: 'Chép từ bản ngôn ngữ khác', copyFromLocaleConfirm: 'Chép nội dung từ bản %{locale}?\nNội dung đang có sẽ bị ghi đè.' } },
        editorInterface: { toggleI18n: 'Bật/tắt song ngữ', togglePreview: 'Bật/tắt xem trước', toggleScrollSync: 'Cuộn đồng bộ hai bên' },
        editorWidgets: {
          list: { add: 'Thêm %{item}', addType: 'Thêm %{item}' },
          object: { expand: 'Mở', collapse: 'Thu gọn' },
          image: { chooseMultiple: 'Chọn ảnh', chooseUrl: 'Chèn từ đường dẫn', replaceUrl: 'Thay bằng đường dẫn', promptUrl: 'Nhập đường dẫn ảnh', addMore: 'Thêm ảnh', removeAll: 'Xoá tất cả ảnh' },
          file: { chooseMultiple: 'Chọn tệp', chooseUrl: 'Chèn từ đường dẫn', replaceUrl: 'Thay bằng đường dẫn', promptUrl: 'Nhập đường dẫn tệp', addMore: 'Thêm tệp', removeAll: 'Xoá tất cả tệp' },
        },
      },
      mediaLibrary: { mediaLibraryCard: { copy: 'Sao chép', copyUrl: 'Chép đường dẫn', copyPath: 'Chép đường dẫn', copyName: 'Chép tên', copied: 'Đã chép' }, mediaLibraryModal: { close: 'Đóng' } },
    };
    var merge = function (a, b) { var o = Object.assign({}, a); Object.keys(b).forEach(function (k) { o[k] = b[k] && typeof b[k] === 'object' ? merge(a && a[k] || {}, b[k]) : b[k]; }); return o; };
    CMS.registerLocale('vi', merge(base, add));
  })();

  CMS.registerPreviewStyle(
    [
      "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital@1&display=swap');",
      ':root{--bg:#121212;--elev:#1a1a1a;--text:#fff;--muted:#b8b8b8;--dim:#828282;--stroke:#4e4e4e;--accent:#6fff54}',
      'html,body{margin:0;background:var(--bg);color:var(--text);font:300 16px/1.6 Inter,system-ui,sans-serif}',
      '.pv{padding:40px 36px;max-width:980px;margin:0 auto}',
      '.pv em{font-family:"Playfair Display",Georgia,serif;font-style:italic;font-weight:400}',
      '.pv-k{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--dim);margin:0 0 8px}',
      '.pv-h1{font-size:56px;line-height:1.1;font-weight:300;margin:0 0 16px}',
      '.pv-h2{font-size:30px;line-height:1.25;font-weight:300;margin:0 0 12px}',
      '.pv-lead{color:var(--muted);max-width:60ch}',
      '.pv-tags{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 24px}',
      '.pv-tag{border:1px solid #626262;border-radius:12px;padding:4px 12px;font-size:13px}',
      '.pv-img{width:100%;border-radius:12px;background:var(--elev);border:1px solid var(--stroke);display:block;object-fit:cover;aspect-ratio:16/10}',
      '.pv-imgs{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-top:20px}',
      '.pv-ph{display:grid;place-items:center;color:var(--dim);font-size:13px}',
      '.pv-meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px 24px;border-top:1px solid var(--stroke);border-bottom:1px solid var(--stroke);padding:20px 0;margin:32px 0}',
      '.pv-meta dt{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--dim)}.pv-meta dd{margin:4px 0 0}',
      '.pv-sec{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:32px;padding:40px 0;border-top:1px solid var(--stroke)}',
      '.pv-sec ul{padding-left:18px;color:var(--muted)}.pv-sec li::marker{color:var(--accent)}',
      '.pv-card{background:var(--elev);border:1px solid var(--stroke);border-radius:16px;padding:28px}',
      '.pv-quote{font-size:22px;line-height:1.45;margin:0 0 20px}',
      '.pv-badge{display:inline-block;background:var(--accent);color:#062b0c;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:500;margin-left:8px;vertical-align:middle}',
      '.pv-soon{color:var(--accent)}',
      '.pv-note{margin-top:28px;font-size:13px;color:var(--dim)}',
    ].join('\n'),
    { raw: true }
  );

  // "*chữ*" → chữ nghiêng serif, giống quy ước của site
  function rich(text) {
    if (!text) return null;
    return String(text).split(/(\*[^*]+\*)/).map(function (part, i) {
      return /^\*[^*]+\*$/.test(part) ? h('em', { key: i }, part.slice(1, -1)) : part.replace(/__/g, '');
    });
  }
  function get(entry, path) { var v = entry.getIn(['data'].concat(path)); return v && v.toJS ? v.toJS() : v; }
  function img(getAsset, src, alt, cls) {
    if (!src) return h('div', { className: 'pv-img pv-ph ' + (cls || '') }, 'Chưa có ảnh');
    var a = getAsset(src);
    return h('img', { className: 'pv-img ' + (cls || ''), src: a ? a.toString() : src, alt: alt || '' });
  }
  function note(t) { return h('p', { className: 'pv-note' }, t); }

  CMS.registerPreviewTemplate('projects', function (props) {
    var e = props.entry, g = props.getAsset;
    var d = get(e, ['detail']) || {};
    var tags = get(e, ['tags']) || [];
    var status = get(e, ['status']);
    return h('div', { className: 'pv' },
      h('p', { className: 'pv-k' }, (get(e, ['industry']) || 'Ngành') + (status === 'soon' ? ' · ' : ''), status === 'soon' ? h('span', { className: 'pv-soon' }, 'Sắp ra mắt') : null),
      h('h1', { className: 'pv-h1' }, get(e, ['title']) || 'Tên dự án'),
      h('div', { className: 'pv-tags' }, tags.map(function (t, i) { return h('span', { className: 'pv-tag', key: i }, t); })),
      img(g, get(e, ['image']), get(e, ['alt'])),
      (d.meta && d.meta.length) ? h('dl', { className: 'pv-meta' }, d.meta.map(function (m, i) { return h('div', { key: i }, h('dt', null, m.label), h('dd', null, m.value)); })) : null,
      d.intro ? h('div', { className: 'pv-sec' }, h('h2', { className: 'pv-h2' }, rich(d.intro.title)), h('p', { className: 'pv-lead' }, d.intro.text)) : null,
      (d.sections || []).map(function (s, i) {
        return h('div', { key: i },
          h('div', { className: 'pv-sec' },
            h('h2', { className: 'pv-h2' }, rich(s.title)),
            h('div', null, h('p', { className: 'pv-lead' }, s.text), (s.bullets && s.bullets.length) ? h('ul', null, s.bullets.map(function (b, j) { return h('li', { key: j }, b); })) : null)),
          (s.images && s.images.length) ? h('div', { className: 'pv-imgs' }, s.images.map(function (src, j) { return h('div', { key: j }, img(g, src, '')); })) : null);
      }),
      d.result ? h('div', { className: 'pv-sec' }, h('h2', { className: 'pv-h2' }, rich(d.result.title)), h('p', { className: 'pv-lead' }, d.result.text)) : null,
      note('Bản xem trước gần đúng. Bấm “Xem bản hoàn chỉnh” sau khi công bố để xem trang thật.'));
  });

  CMS.registerPreviewTemplate('experience', function (props) {
    var e = props.entry;
    var from = get(e, ['from']) || '', to = get(e, ['to']);
    var fmt = function (ym) { return ym ? ym.slice(5, 7) + '/' + ym.slice(0, 4) : 'Nay'; };
    var results = get(e, ['results']) || [];
    return h('div', { className: 'pv' },
      h('div', { className: 'pv-card' },
        h('p', { className: 'pv-k' }, get(e, ['type']) === 'freelance' ? 'Freelance' : 'Hợp đồng lao động'),
        h('h2', { className: 'pv-h2' }, get(e, ['role']) || 'Vai trò'),
        h('p', { className: 'pv-lead' }, (get(e, ['org']) || 'Đơn vị') + ' · ' + fmt(from) + ' — ' + fmt(to)),
        h('p', null, get(e, ['summary'])),
        results.length ? h('ul', null, results.map(function (r, i) { return h('li', { key: i }, r); })) : null));
  });

  CMS.registerPreviewTemplate('testimonials', function (props) {
    var e = props.entry;
    return h('div', { className: 'pv' },
      h('div', { className: 'pv-card' },
        h('p', { className: 'pv-quote' }, '“' + (get(e, ['quote']) || 'Lời nhận xét') + '”'),
        h('p', { className: 'pv-lead' }, (get(e, ['name']) || 'Tên') + ' — ' + (get(e, ['role']) || 'Chức vụ'))));
  });

  CMS.registerPreviewTemplate('services', function (props) {
    var e = props.entry, g = props.getAsset;
    var items = get(e, ['deliverables']) || [];
    return h('div', { className: 'pv' },
      h('h1', { className: 'pv-h1' }, get(e, ['title']) || 'Tên dịch vụ', get(e, ['badge']) ? h('span', { className: 'pv-badge' }, get(e, ['badge'])) : null),
      h('p', { className: 'pv-lead' }, get(e, ['text'])),
      h('div', { className: 'pv-sec' },
        h('div', null, h('p', { className: 'pv-k' }, 'Bạn sẽ nhận được'), h('p', null, get(e, ['long']))),
        h('div', null, h('p', { className: 'pv-k' }, 'Trong gói gồm'), h('ul', null, items.map(function (t, i) { return h('li', { key: i }, t); })))),
      img(g, get(e, ['image']), get(e, ['imageAlt'])));
  });

  CMS.registerPreviewTemplate('partners', function (props) {
    var e = props.entry, g = props.getAsset, logo = get(e, ['logo']);
    return h('div', { className: 'pv' },
      h('div', { className: 'pv-card', style: { display: 'grid', placeItems: 'center', minHeight: '140px' } },
        logo ? h('img', { src: g(logo).toString(), alt: get(e, ['name']), style: { maxHeight: '48px', maxWidth: '70%' } }) : h('span', { style: { color: '#b8b8b8' } }, get(e, ['name']) || 'Tên đối tác')));
  });
})();
