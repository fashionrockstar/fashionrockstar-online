(() => {
  'use strict';

  const form = document.querySelector('form[name="booking"]');
  const status = document.querySelector('#booking-status');
  if (!form || !status || !window.fetch) return;

  const button = form.querySelector('button[type="submit"]');
  const buttonLabel = button.querySelector('span');
  let pending = false;
  let received = false;

  const showStatus = (message, focus = false) => {
    status.textContent = message;
    status.hidden = false;
    if (focus) status.focus({ preventScroll: true });
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending || received || !form.reportValidity()) return;

    const body = new URLSearchParams(new FormData(form)).toString();
    const fields = Array.from(form.querySelectorAll('input:not([type="hidden"]), select, textarea'))
      .map((field) => ({ field, disabled: field.disabled }));
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    pending = true;
    button.disabled = true;
    fields.forEach(({ field }) => { field.disabled = true; });
    buttonLabel.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    showStatus('Sending your inquiry…');

    try {
      const response = await fetch('/book/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: controller.signal
      });

      // A login redirect must never be mistaken for an accepted inquiry.
      if (!response.ok || (response.url && new URL(response.url).origin !== window.location.origin)) {
        showStatus('Your inquiry could not be sent. Your information is still here. Please try again.', true);
        return;
      }

      received = true;
      showStatus('Your inquiry has been received.', true);
    } catch {
      // A lost connection can leave receipt uncertain; do not silently retry.
      showStatus('We couldn’t confirm receipt of your inquiry. Your information is still here. Please check your connection and try again.', true);
    } finally {
      window.clearTimeout(timeout);
      pending = false;
      fields.forEach(({ field, disabled }) => { field.disabled = disabled; });
      form.removeAttribute('aria-busy');
      button.disabled = received;
      buttonLabel.textContent = received ? 'Sent' : 'Submit';
    }
  });

  // Keep submitted values available, and allow a new inquiry after an edit.
  form.addEventListener('input', () => {
    if (pending) return;
    if (received) {
      received = false;
      button.disabled = false;
      buttonLabel.textContent = 'Submit';
    }
    status.hidden = true;
    status.textContent = '';
  });
})();
