// Bước 1 đăng nhập trang quản trị (/admin): chuyển người dùng sang GitHub để cấp quyền.
// Cần 2 biến môi trường trên Vercel: OAUTH_GITHUB_CLIENT_ID, OAUTH_GITHUB_CLIENT_SECRET
// (lấy từ GitHub → Settings → Developer settings → OAuth Apps).
import crypto from 'node:crypto';

export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Chưa cấu hình OAUTH_GITHUB_CLIENT_ID trên Vercel.');
    return;
  }
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const state = crypto.randomBytes(16).toString('hex');
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', `https://${host}/api/callback`);
  url.searchParams.set('scope', process.env.OAUTH_GITHUB_SCOPE || 'public_repo,read:user');
  url.searchParams.set('state', state);
  res.statusCode = 302;
  res.setHeader('Set-Cookie', `decap_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Location', url.toString());
  res.end();
}
