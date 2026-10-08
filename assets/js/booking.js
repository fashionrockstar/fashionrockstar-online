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
  const serviceHint = form.querySelector('.inquiry-service-hint');
  if (serviceHint) serviceHint.classList.add('is-visible');
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
  // Keep the empty live region available before its first announcement.
  status.hidden = false;
  status.classList.add('sr-only');

  const button = form.querySelector('button[type="submit"]');
  const buttonLabel = button.querySelector('.inquiry-slider__label');
  const handle = button.querySelector('.inquiry-slider__handle');
  const confirmation = document.querySelector('.inquiry-confirmation');
  const defaultButtonLabel = button.dataset.defaultLabel || buttonLabel.textContent.trim();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const slideDuration = 320;
  const endThreshold = .95;
  let pending = false;
  let received = false;
  let activating = false;
  let submissionReady = false;
  let activationTimer;
  let gesture = null;
  let progress = 0;
  let suppressPointerClick = false;

  const setProgress = (value) => {
    progress = Math.max(0, Math.min(1, value));
    const travel = Math.max(0, button.clientWidth - handle.offsetWidth - handle.offsetLeft * 2);
    button.style.setProperty('--inquiry-slide-progress', progress);
    button.style.setProperty('--inquiry-slide-x', `${travel * progress}px`);
  };

  const endGesture = () => {
    const activeGesture = gesture;
    gesture = null;
    button.classList.remove('is-dragging');
    if (activeGesture && button.hasPointerCapture(activeGesture.id)) {
      button.releasePointerCapture(activeGesture.id);
    }
  };

  const resetSlider = () => {
    window.clearTimeout(activationTimer);
    activating = false;
    submissionReady = false;
    endGesture();
    setProgress(0);
    button.disabled = false;
    button.removeAttribute('aria-disabled');
    button.dataset.state = 'idle';
    buttonLabel.textContent = defaultButtonLabel;
    button.setAttribute('aria-label', 'Slide to send inquiry');
  };

  const activate = () => {
    if (pending || received || activating || gesture) return;
    validateServices();
    if (!form.reportValidity()) {
      resetSlider();
      return;
    }

    // Lock before the animation as well as during the existing POST request.
    activating = true;
    button.dataset.state = 'activating';
    button.setAttribute('aria-disabled', 'true');
    setProgress(1);
    activationTimer = window.setTimeout(() => {
      submissionReady = true;
      // Re-run native validation if a field changed during the animation.
      if (typeof form.requestSubmit === 'function') form.requestSubmit(button);
      else if (form.reportValidity()) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }, reducedMotion.matches ? 0 : slideDuration + 50);
  };

  // A real submit button retains native click, keyboard and no-JS behavior.
  button.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.detail > 0 && suppressPointerClick) return;
    activate();
  });

  button.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    // A canceled drag stays canceled until a fresh pointer activation begins.
    if (!gesture) suppressPointerClick = false;
    if (pending || received || activating || gesture
      || !event.target.closest('.inquiry-slider__handle')) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    button.setPointerCapture(event.pointerId);
  });

  button.addEventListener('pointermove', (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const distanceX = event.clientX - gesture.x;
    const distanceY = event.clientY - gesture.y;
    if (!gesture.moved) {
      if (Math.max(Math.abs(distanceX), Math.abs(distanceY)) < 6) return;
      gesture.moved = true;
      suppressPointerClick = true;
      if (Math.abs(distanceY) > Math.abs(distanceX)) {
        resetSlider();
        return;
      }
      button.classList.add('is-dragging');
    }
    const travel = Math.max(0, button.clientWidth - handle.offsetWidth - handle.offsetLeft * 2);
    setProgress(travel ? distanceX / travel : 0);
  });

  button.addEventListener('pointerup', (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const moved = gesture.moved;
    const reachedEnd = moved && progress >= endThreshold;
    endGesture();
    if (!moved) return; // A tap on the handle uses the same native click path.
    suppressPointerClick = true;
    if (reachedEnd) activate();
    else resetSlider();
  });

  const cancelGesture = (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    suppressPointerClick = true;
    resetSlider();
  };
  button.addEventListener('pointercancel', cancelGesture);
  button.addEventListener('lostpointercapture', cancelGesture);
  form.addEventListener('invalid', () => {
    if (!pending && !received) resetSlider();
  }, true);
  window.addEventListener('resize', () => {
    if (gesture) {
      suppressPointerClick = true;
      resetSlider();
    } else setProgress(progress);
  });

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
    if (!submissionReady) {
      activate();
      return;
    }
    submissionReady = false;
    activating = false;

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
    button.dataset.state = 'sending';
    buttonLabel.textContent = 'SENDING…';
    button.setAttribute('aria-label', 'Sending inquiry');
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
      button.dataset.state = 'sent';
      buttonLabel.textContent = 'INQUIRY SENT';
      button.setAttribute('aria-label', 'Inquiry sent');
      showStatus('INQUIRY SENT.', 'success');
      window.setTimeout(() => {
        form.classList.add('is-sent');
        form.inert = true;
        window.setTimeout(() => {
          form.hidden = true;
          confirmation.hidden = false;
          confirmation.focus({ preventScroll: true });
        }, reducedMotion.matches ? 0 : 250);
      }, 900);
    } catch {
      showStatus('SUBMISSION FAILED — PLEASE TRY AGAIN.', 'error', true);
    } finally {
      window.clearTimeout(timeout);
      pending = false;
      form.removeAttribute('aria-busy');
      if (!received) {
        fields.forEach(({ field, disabled }) => { field.disabled = disabled; });
        resetSlider();
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
