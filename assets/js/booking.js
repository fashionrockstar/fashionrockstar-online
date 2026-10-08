(() => {
  'use strict';

  const form = document.querySelector('form[name="booking"]');
  if (!form) return;
  const services = Array.from(form.querySelectorAll('input[name="project-type"]'));
  // Preserve the existing native required-service fallback without JavaScript.
  services.forEach((service) => {
    service.type = 'checkbox';
    service.required = false;
  });
  form.querySelector('.inquiry-service-hint')?.classList.add('is-visible');
  const firstService = services[0];
  const validateServices = () => {
    firstService?.setCustomValidity(services.some((service) => service.checked)
      ? '' : 'SELECT AT LEAST ONE SERVICE.');
  };
  const requestedService = new URLSearchParams(window.location.search).get('service');
  const matchingService = services.find((service) => service.value === requestedService);
  if (matchingService) matchingService.checked = true;
  validateServices();
  services.forEach((service) => service.addEventListener('change', validateServices));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const project = form.querySelector('.inquiry-project');
  let observer;
  const revealProject = () => {
    project.classList.add('is-revealed');
    project.classList.remove('is-reveal-pending');
    observer?.disconnect();
  };
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    project.classList.add('is-reveal-pending');
    observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) revealProject();
    }, { threshold: 0.05 });
    observer.observe(project);
    // Keyboard focus must never land in an invisible form.
    project.addEventListener('focusin', revealProject, { once: true });
  }
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) revealProject();
  });

  const extras = form.querySelector('.inquiry-extras');
  const summary = extras.querySelector('summary');
  const extrasBody = extras.querySelector('.inquiry-extras__body');
  let detailsAnimation;
  let detailsExpanded = extras.open;
  summary.addEventListener('click', (event) => {
    if (reducedMotion.matches || !extrasBody.animate) return;
    event.preventDefault();
    const startHeight = extras.open ? extrasBody.getBoundingClientRect().height : 0;
    const startOpacity = extras.open ? getComputedStyle(extrasBody).opacity : 0;
    detailsAnimation?.cancel();
    detailsExpanded = !detailsExpanded;
    extras.open = true;
    summary.setAttribute('aria-expanded', String(detailsExpanded));
    extrasBody.inert = !detailsExpanded;
    detailsAnimation = extrasBody.animate([
      { height: startHeight + 'px', opacity: startOpacity },
      { height: (detailsExpanded ? extrasBody.scrollHeight : 0) + 'px', opacity: detailsExpanded ? 1 : 0 }
    ], { duration: 300, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    detailsAnimation.onfinish = () => {
      extras.open = detailsExpanded;
      detailsAnimation = null;
      summary.removeAttribute('aria-expanded');
      extrasBody.inert = false;
    };
  });
  extras.addEventListener('toggle', () => {
    if (!detailsAnimation) detailsExpanded = extras.open;
  });
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches || !detailsAnimation) return;
    detailsAnimation.cancel();
    detailsAnimation = null;
    extras.open = detailsExpanded;
    summary.removeAttribute('aria-expanded');
    extrasBody.inert = false;
  });

  const status = document.querySelector('#booking-status');
  if (!status || !window.fetch || !window.AbortController) return;
  status.hidden = false;
  status.classList.add('sr-only');
  const button = form.querySelector('button[type="submit"]');
  const buttonLabel = button.querySelector('.inquiry-send__label');
  const confirmation = form.querySelector('.inquiry-confirmation');
  let pending = false;
  let received = false;
  const showStatus = (message, state = 'info', focus = false) => {
    status.textContent = message;
    status.dataset.state = state;
    status.classList.toggle('sr-only', state !== 'error');
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
    buttonLabel.textContent = 'SENDING…';
    form.setAttribute('aria-busy', 'true');
    showStatus('SENDING…', 'pending');

    try {
      const response = await fetch('/booking/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: controller.signal
      });
      if (!response.ok || (response.url && new URL(response.url).origin !== window.location.origin)) {
        showStatus('SUBMISSION FAILED — PLEASE TRY AGAIN.', 'error', true);
        return;
      }
      received = true;
      buttonLabel.textContent = 'INQUIRY SENT';
      showStatus('INQUIRY SENT.', 'success');
      project.classList.add('is-sent');
      project.inert = true;
      window.setTimeout(() => {
        project.hidden = true;
        confirmation.hidden = false;
        confirmation.focus({ preventScroll: true });
      }, reducedMotion.matches ? 0 : 350);
    } catch {
      showStatus('SUBMISSION FAILED — PLEASE TRY AGAIN.', 'error', true);
    } finally {
      window.clearTimeout(timeout);
      pending = false;
      form.removeAttribute('aria-busy');
      if (!received) {
        fields.forEach(({ field, disabled }) => { field.disabled = disabled; });
        button.disabled = false;
        buttonLabel.textContent = 'SEND INQUIRY';
      }
    }
  });
  form.addEventListener('input', () => {
    if (pending || received) return;
    status.classList.add('sr-only');
    status.textContent = '';
    delete status.dataset.state;
  });
})();
