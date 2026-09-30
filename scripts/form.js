// Form liên hệ trong hộp thoại: mở/đóng, kiểm tra, trạng thái gửi / thành công / lỗi.
import { $, $$ } from './util.js';
import { lockScroll } from './smooth.js';
import { sendMessage } from './contact-api.js';

export function initForm() {
  const dlg = $('[data-form-dialog]');
  const form = $('[data-form]');
  if (!dlg || !form || typeof dlg.showModal !== 'function') return;
  const status = $('[data-status]', form);
  const submit = $('[data-submit]', form);
  let opener = null;

  const open = (e) => { opener = e.currentTarget; dlg.showModal(); lockScroll(true); $('input', form)?.focus(); };
  const close = () => dlg.close();
  $$('[data-open-form]').forEach((b) => b.addEventListener('click', open));
  $('[data-close-form]', form)?.addEventListener('click', close);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => { lockScroll(false); opener?.focus(); });

  const setState = (state, msg = '') => { form.dataset.state = state; status.textContent = msg; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fields = $$('input, textarea', form);
    let firstBad = null;
    fields.forEach((f) => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value.trim()));
      f.setAttribute('aria-invalid', String(bad));
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) { firstBad.focus(); setState('error', form.dataset.msgInvalid); return; }

    setState('sending', form.dataset.msgSending);
    submit.disabled = true;
    try {
      await sendMessage(Object.fromEntries(new FormData(form)));
      setState('success', form.dataset.msgSuccess);
      form.reset();
    } catch {
      setState('error', form.dataset.msgError);
    } finally {
      submit.disabled = false;
    }
  });
}
