// Hỗ trợ build-docs: nạp nội dung và đặt ngữ cảnh render (ngôn ngữ, trang hiện tại).
import { loadContent as load } from './site.js';
import { setContext } from './render.js';

export const loadContent = (lang = 'vi') => load(lang);
export const setContextFor = (lang, page = 'home') => setContext({ lang, prefix: lang === 'vi' ? '' : `/${lang}`, page, alt: { lang: lang === 'vi' ? 'en' : 'vi', path: lang === 'vi' ? '/en/' : '/' } });
