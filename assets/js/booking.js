(() => {
  'use strict';

  const form = document.querySelector('form[name="booking"]');
  if (!form) return;

  const services = Array.from(form.querySelectorAll('input[name="project-type"]'));
  // Native radios keep the existing required-service fallback without JavaScript.
  services.forEach((service) => {
    service.type = 'checkbox';
    service.required = false;
  });
  const firstService = services[0];
  const validateServices = () => {
    if (firstService) {
      firstService.setCustomValidity(services.some((service) => service.checked)
        ? ''
        : 'SELECT AT LEAST ONE SERVICE.');
    }
  };

  const requestedService = new URLSearchParams(window.location.search).get('service');
  const matchingService = services.find((service) => service.value === requestedService);
  if (matchingService) matchingService.checked = true;
  validateServices();
  services.forEach((service) => service.addEventListener('change', validateServices));

  const status = document.querySelector('#booking-status');
  if (!status || !window.fetch || !window.AbortController) return;

  const button = form.querySelector('button[type="submit"]');
  const buttonLabel = button.querySelector('span');
  const defaultButtonLabel = button.dataset.defaultLabel || buttonLabel.textContent.trim();
  let pending = false;
  let received = false;

  const showStatus = (message, state = 'info', focus = false) => {
    status.textContent = message;
    status.dataset.state = state;
    status.hidden = false;
    if (focus) status.focus({ preventScroll: true });
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    validateServices();
    if (pending || received || !form.reportValidity()) return;

    const formData = new FormData(form);
    formData.set('project-type', formData.getAll('project-type').join(','));
    const body = new URLSearchParams(formData).toString();
    const fields = Array.from(form.querySelectorAll('input:not([type="hidden"]), select, textarea'))
      .map((field) => ({ field, disabled: field.disabled }));
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    pending = true;
    button.disabled = true;
    fields.forEach(({ field }) => { field.disabled = true; });
    buttonLabel.textContent = 'SUBMITTING…';
    form.setAttribute('aria-busy', 'true');
    showStatus('SUBMITTING INQUIRY…', 'pending');

    try {
      const response = await fetch('/booking/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: controller.signal
      });

      if (!response.ok || (response.url && new URL(response.url).origin !== window.location.origin)) {
        showStatus('YOUR INQUIRY COULD NOT BE SENT. YOUR INFORMATION IS STILL HERE. PLEASE TRY AGAIN.', 'error', true);
        return;
      }

      received = true;
      showStatus('INQUIRY RECEIVED.', 'success', true);
    } catch {
      showStatus('RECEIPT COULD NOT BE CONFIRMED. YOUR INFORMATION IS STILL HERE. CHECK YOUR CONNECTION AND TRY AGAIN.', 'error', true);
    } finally {
      window.clearTimeout(timeout);
      pending = false;
      fields.forEach(({ field, disabled }) => { field.disabled = disabled; });
      form.removeAttribute('aria-busy');
      button.disabled = received;
      buttonLabel.textContent = received ? 'INQUIRY RECEIVED' : defaultButtonLabel;
    }
  });

  form.addEventListener('input', () => {
    if (pending) return;
    if (received) {
      received = false;
      button.disabled = false;
      buttonLabel.textContent = defaultButtonLabel;
    }
    status.hidden = true;
    status.textContent = '';
    delete status.dataset.state;
  });
})();
