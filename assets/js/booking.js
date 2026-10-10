(() => {
  'use strict';
  const form = document.querySelector('form[name="booking"]');
  if (!form) return;
  const services = Array.from(form.querySelectorAll('input[name="project-type"]'));
  const status = document.querySelector('#booking-status');
  const button = form.querySelector('#booking-send');
  const continuation = form.querySelector('#booking-continue');
  const backButtons = Array.from(form.querySelectorAll('[data-booking-back]'));
  const panels = [form.querySelector('#booking-services'), form.querySelector('#booking-project')];
  const stage = form.querySelector('.booking-stage');
  const title = form.querySelector('#booking-step-title');
  const count = form.querySelector('#booking-step-count');
  const progress = form.querySelector('.booking-progress');
  const selected = form.querySelector('#booking-selected');
  const helper = form.querySelector('#booking-service-help');
  const confirmation = document.querySelector('.inquiry-confirmation');
  const requiredFields = Array.from(form.querySelectorAll('#booking-project [required]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pending = false;
  let received = false;
  let changing = false;
  let step = 1;
  let runningAnimations = [];

  // Preserve the native required-radio POST fallback; enhance to multiple services.
  services.forEach((service) => { service.type = 'checkbox'; service.required = false; });
  const requestedService = new URLSearchParams(window.location.search).get('service');
  const matchingService = services.find((service) => service.value === requestedService);
  if (matchingService) matchingService.checked = true;
  const validateServices = () => {
    const chosen = services.filter((service) => service.checked);
    services[0].setCustomValidity(chosen.length ? '' : 'SELECT AT LEAST ONE SERVICE.');
    continuation.disabled = !chosen.length;
    helper.hidden = !!chosen.length;
    selected.replaceChildren(...chosen.map((service) => {
      const badge = document.createElement('span');
      badge.textContent = service.getAttribute('aria-label');
      return badge;
    }));
    return chosen.length > 0;
  };
  validateServices();

  const showStatus = (message, state = 'info', focus = false) => {
    status.textContent = message;
    status.dataset.state = state;
    status.classList.toggle('sr-only', state !== 'error');
    if (focus) status.focus();
  };
  const clearStatus = () => {
    status.classList.add('sr-only');
    status.textContent = '';
    delete status.dataset.state;
  };
  const showFieldError = (field, message) => {
    const error = document.getElementById(`${field.id}-error`);
    field.toggleAttribute('aria-invalid', !!message);
    if (message) field.setAttribute('aria-invalid', 'true');
    if (error) { error.textContent = message; error.hidden = !message; }
  };
  const fieldMessage = (field) => {
    if (!field.value.trim()) return 'REQUIRED';
    if (!field.validity.valid) return field.type === 'email' ? 'ENTER A VALID EMAIL' : 'CHECK THIS FIELD';
    return '';
  };

  const animate = (element, frames, options) => {
    if (reducedMotion.matches || typeof element.animate !== 'function') return Promise.resolve();
    const animation = element.animate(frames, { duration: 500, fill: 'both', easing: 'cubic-bezier(.16, 1, .3, 1)', ...options });
    runningAnimations.push(animation);
    return animation.finished.catch(() => {});
  };
  const focusStep = () => {
    title.focus({preventScroll: true});
    const top = title.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight - 80) title.scrollIntoView({block:'start', behavior:reducedMotion.matches ? 'instant' : 'smooth'});
  };
  const changeStep = async (next) => {
    if (pending || received || changing || next === step || (next === 2 && !validateServices())) return;
    changing = true;
    clearStatus();
    const outgoing = panels[step - 1];
    const incoming = panels[next - 1];
    const fromHeight = stage.getBoundingClientRect().height;
    outgoing.inert = true;
    incoming.inert = true;
    incoming.hidden = false;
    stage.style.height = `${fromHeight}px`;
    stage.classList.add('is-transitioning');
    const toHeight = incoming.getBoundingClientRect().height;
    form.dataset.step = String(next);
    count.textContent = `0${next} / 02`;
    title.textContent = next === 1 ? 'SELECT SERVICES — MULTIPLE ALLOWED' : 'YOUR PROJECT';
    progress.setAttribute('aria-valuenow', String(next));
    progress.setAttribute('aria-valuetext', `STEP ${next} OF 2`);
    stage.style.height = `${toHeight}px`;
    runningAnimations = [];
    await Promise.all([
      animate(outgoing, [{opacity:1, transform:'translateY(0)'}, {opacity:0, transform:'translateY(-16px)'}]),
      animate(incoming, [{opacity:0, transform:'translateY(20px)'}, {opacity:1, transform:'translateY(0)'}], {delay:100}),
      animate(stage, [{height:`${fromHeight}px`}, {height:`${toHeight}px`}], {duration:600})
    ]);
    outgoing.hidden = true;
    incoming.inert = false;
    runningAnimations.forEach((animation) => animation.cancel());
    runningAnimations = [];
    stage.classList.remove('is-transitioning');
    stage.style.removeProperty('height');
    step = next;
    changing = false;
    form.dataset.transition = 'settled';
    focusStep();
  };
  // Resize / changed motion preference finishes an in-flight transition cleanly.
  const finishAnimations = () => runningAnimations.forEach((animation) => { if (animation.playState === 'running') animation.finish(); });
  window.addEventListener('resize', finishAnimations);
  reducedMotion.addEventListener('change', finishAnimations);
  continuation.addEventListener('click', () => { form.dataset.transition = 'running'; changeStep(2); });
  backButtons.forEach((back) => back.addEventListener('click', () => { form.dataset.transition = 'running'; changeStep(1); }));
  services.forEach((service) => service.addEventListener('change', validateServices));

  panels[1].hidden = true;
  panels[1].inert = true;
  continuation.hidden = false;
  backButtons.forEach((back) => { back.hidden = false; });
  form.querySelector('.booking-selection').hidden = false;
  title.textContent = 'SELECT SERVICES — MULTIPLE ALLOWED';
  form.dataset.step = '1';
  form.dataset.transition = 'settled';
  form.classList.add('is-enhanced');
  // Use accessible inline errors; retain HTML required constraints for native fallback.
  form.noValidate = !!(window.fetch && window.AbortController);

  form.addEventListener('submit', async (event) => {
    if (!window.fetch || !window.AbortController) return;
    event.preventDefault();
    if (pending || received || changing) return;
    if (!validateServices()) { if (step !== 1) await changeStep(1); services[0].focus(); return; }
    if (step !== 2) { await changeStep(2); return; }
    const errors = requiredFields.map((field) => ({field, message:fieldMessage(field)}));
    errors.forEach(({field, message}) => showFieldError(field, message));
    const invalid = errors.find(({message}) => message);
    if (invalid) { showStatus('CHECK THE REQUIRED FIELDS.', 'error'); invalid.field.focus(); return; }

    // Keep the original Netlify POST encoding, timeout and same-origin response gate.
    const formData = new FormData(form);
    formData.set('project-type', formData.getAll('project-type').join(','));
    const body = new URLSearchParams(formData).toString();
    const fields = Array.from(form.querySelectorAll('input:not([type="hidden"]), select, textarea, button'))
      .map((field) => ({field, disabled:field.disabled}));
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    pending = true;
    fields.forEach(({field}) => { field.disabled = true; });
    button.dataset.state = 'sending';
    button.textContent = 'SENDING…';
    form.setAttribute('aria-busy', 'true');
    showStatus('SENDING…', 'pending');
    try {
      const response = await fetch('/booking/', {
        method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body, signal:controller.signal
      });
      if (!response.ok || (response.url && new URL(response.url).origin !== window.location.origin)) {
        showStatus('SUBMISSION FAILED — PLEASE TRY AGAIN.', 'error', true);
        return;
      }
      received = true;
      form.inert = true;
      showStatus('INQUIRY RECEIVED.', 'success');
      await animate(form, [{opacity:1, transform:'translateY(0)'}, {opacity:0, transform:'translateY(-16px)'}]);
      form.hidden = true;
      confirmation.hidden = false;
      await animate(confirmation, [{opacity:0, transform:'translateY(20px)'}, {opacity:1, transform:'translateY(0)'}]);
      document.querySelector('#inquiry-confirmation-title').focus();
    } catch {
      showStatus('SUBMISSION FAILED — PLEASE TRY AGAIN.', 'error', true);
    } finally {
      window.clearTimeout(timeout);
      pending = false;
      form.removeAttribute('aria-busy');
      if (!received) {
        fields.forEach(({field, disabled}) => { field.disabled = disabled; });
        button.dataset.state = 'idle';
        button.textContent = 'SEND INQUIRY ↗';
      }
    }
  });
  form.addEventListener('input', (event) => {
    if (pending || received) return;
    clearStatus();
    const field = event.target;
    if (requiredFields.includes(field) && field.hasAttribute('aria-invalid')) showFieldError(field, fieldMessage(field));
  });
})();
