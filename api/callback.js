// Bước 2 đăng nhập trang quản trị: GitHub gọi lại đây kèm mã, đổi mã lấy token rồi trả token
// cho cửa sổ /admin theo giao thức postMessage của Decap CMS. Chỉ gửi về đúng origin của site.

const page = (origin, status, content) => {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const js = `(function () {
  var origin = ${JSON.stringify(origin)};
  var message = ${JSON.stringify(message)};
  function receive(e) {
    if (e.origin !== origin) return;
    window.removeEventListener('message', receive, false);
    window.opener.postMessage(message, origin);
    setTimeout(function () { window.close(); }, 300);
  }
  if (!window.opener) { document.body.textContent = 'Hãy mở trang này từ nút đăng nhập ở /admin.'; return; }
  window.addEventListener('message', receive, false);
  window.opener.postMessage('authorizing:github', origin);
})();`.replace(/</g, '\\u003c');
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Đăng nhập</title></head><body><p>Đang hoàn tất đăng nhập…</p><script>${js}</script></body></html>`;
};

const readCookie = (req, name) => {
  const m = (req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
};

export default async function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const origin = `https://${host}`;
  const send = (status, content, code = 200) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Set-Cookie', 'decap_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
    res.end(page(origin, status, content));
  };

  const url = new URL(req.url, origin);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const expected = readCookie(req, 'decap_oauth_state');
  if (!code || !state || !expected || state !== expected) {
    send('error', { message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Hãy thử lại.' }, 400);
    return;
  }

  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
        client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${origin}/api/callback`,
      }),
    });
    const data = await r.json();
    if (!r.ok || !data.access_token) {
      send('error', { message: data.error_description || 'GitHub không cấp token.' }, 401);
      return;
    }
    send('success', { token: data.access_token, provider: 'github' });
  } catch {
    send('error', { message: 'Không kết nối được GitHub.' }, 502);
  }
}
