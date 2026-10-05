(() => {
  'use strict';

  const root = document.documentElement;
  const sessionKey = 'frsrBiometricAccessV2';
  const screen = document.querySelector('[data-biometric-access]');
  const main = document.querySelector('body.home > main');

  if (window.__frsrBiometricFailOpen) {
    window.clearTimeout(window.__frsrBiometricFailOpen);
    window.__frsrBiometricFailOpen = 0;
  }

  if (!screen || !main) {
    root.classList.remove('biometric-access-open', 'biometric-access-revealing');
    return;
  }

  const url = new URL(window.location.href);
  const replay = url.searchParams.get('biometric-access') === '1';
  if (replay) {
    url.searchParams.delete('biometric-access');
    window.history.replaceState(window.history.state, '', url);
  }

  let granted = false;
  try {
    granted = sessionStorage.getItem(sessionKey) === 'granted';
  } catch {
    granted = false;
  }

  const shouldShow = replay || !granted;
  if (!shouldShow) {
    screen.hidden = true;
    main.inert = false;
    root.classList.remove('biometric-access-open', 'biometric-access-revealing');
    return;
  }

  root.classList.add('biometric-access-open');
  screen.hidden = false;
  main.inert = true;

  const trigger = screen.querySelector('[data-biometric-trigger]');
  const fill = screen.querySelector('[data-biometric-fill]');
  const status = screen.querySelector('[data-biometric-status]');
  const skip = screen.querySelector('[data-biometric-skip]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!trigger || !fill || !status || !skip) {
    screen.hidden = true;
    main.inert = false;
    root.classList.remove('biometric-access-open', 'biometric-access-revealing');
    return;
  }

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const fullHeight = 196;
  let reduced = motion.matches;
  let active = false;
  let completed = false;
  let pointerId = null;
  let startedAt = 0;
  let frame = 0;
  let drainFrame = 0;
  let progress = 0;
  let finishTimer = 0;

  const setProgress = (next) => {
    progress = clamp(next);
    const activeHeight = fullHeight * progress;
    fill.setAttribute('y', String(fullHeight - activeHeight));
    fill.setAttribute('height', String(activeHeight));
    screen.style.setProperty('--scan-progress', progress.toFixed(4));
    screen.style.setProperty('--scan-y', (8 + progress * 84) + '%');
    screen.style.setProperty('--progress-light-alpha', (0.04 + progress * 0.44).toFixed(3));
    screen.style.setProperty('--progress-light-scale', (0.78 + progress * 0.32).toFixed(4));
    screen.style.setProperty('--local-scan-alpha', (0.4 + progress * 0.6).toFixed(3));
  };

  const setPointer = (clientX, clientY) => {
    const rect = screen.getBoundingClientRect();
    const sensor = trigger.getBoundingClientRect();
    const px = clamp((clientX - rect.left) / Math.max(1, rect.width));
    const py = clamp((clientY - rect.top) / Math.max(1, rect.height));
    const cx = sensor.left + sensor.width / 2;
    const cy = sensor.top + sensor.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const radius = Math.max(sensor.width, sensor.height) * 1.65;
    const proximity = clamp(1 - Math.hypot(dx, dy) / radius);

    screen.style.setProperty('--pointer-x', (px * 100).toFixed(2) + '%');
    screen.style.setProperty('--pointer-y', (py * 100).toFixed(2) + '%');
    screen.style.setProperty('--proximity', proximity.toFixed(3));
    screen.style.setProperty('--ambient-alpha', (0.015 + proximity * 0.095).toFixed(3));
    screen.style.setProperty('--ambient-mid-alpha', (0.01 + proximity * 0.045).toFixed(3));
    screen.style.setProperty('--ambient-opacity', (0.45 + proximity * 0.55).toFixed(3));
    screen.style.setProperty('--sensor-scale', (0.985 + proximity * 0.015).toFixed(4));
    screen.style.setProperty('--sensor-border-alpha', (0.045 + proximity * 0.11).toFixed(3));
    screen.style.setProperty('--sensor-ring-scale', (0.9 + proximity * 0.07).toFixed(4));
    screen.style.setProperty('--sensor-glow-alpha', (0.01 + proximity * 0.035).toFixed(3));
    screen.style.setProperty('--finger-base-alpha', (0.18 + proximity * 0.19).toFixed(3));
    screen.style.setProperty('--finger-glow-alpha', (0.04 + proximity * 0.13).toFixed(3));
    screen.style.setProperty('--tilt-x', (clamp(dx / sensor.width, -0.5, 0.5) * 8) + 'deg');
    screen.style.setProperty('--tilt-y', (clamp(dy / sensor.height, -0.5, 0.5) * -8) + 'deg');
  };

  const drain = (from = progress) => {
    window.cancelAnimationFrame(drainFrame);
    const start = performance.now();
    const duration = reduced ? 80 : 360;
    const tick = (now) => {
      const amount = clamp((now - start) / duration);
      const eased = 1 - Math.pow(1 - amount, 3);
      setProgress(from * (1 - eased));
      if (amount < 1 && !active && !completed) {
        drainFrame = requestAnimationFrame(tick);
      }
    };
    drainFrame = requestAnimationFrame(tick);
  };

  const finish = (focusHome = true) => {
    if (screen.hidden) return;
    completed = true;
    active = false;
    window.cancelAnimationFrame(frame);
    window.cancelAnimationFrame(drainFrame);
    window.clearTimeout(finishTimer);

    try {
      sessionStorage.setItem(sessionKey, 'granted');
    } catch {
      // Storage can be blocked. The experience still fails open.
    }

    screen.hidden = true;
    main.inert = false;
    root.classList.remove('biometric-access-open', 'biometric-access-revealing');
    document.dispatchEvent(new CustomEvent('frsr:biometric-access-complete'));

    if (focusHome) {
      document.querySelector('[data-home-menu-toggle]')?.focus({ preventScroll: true });
    }
  };

  const grant = () => {
    if (completed) return;
    completed = true;
    active = false;
    pointerId = null;
    window.cancelAnimationFrame(frame);
    setProgress(1);

    screen.classList.remove('is-contact', 'is-interrupted');
    screen.classList.add('is-granted');
    screen.dataset.state = 'granted';
    status.textContent = 'ACCESS GRANTED';

    try {
      sessionStorage.setItem(sessionKey, 'granted');
    } catch {
      // Fail open when storage is unavailable.
    }

    const revealDelay = reduced ? 120 : 260;
    const finishDelay = reduced ? 480 : 1420;

    window.setTimeout(() => {
      root.classList.add('biometric-access-revealing');
      screen.classList.add('is-handoff');
    }, revealDelay);

    finishTimer = window.setTimeout(() => finish(false), finishDelay);
  };

  const tick = (now) => {
    if (!active || completed) return;
    const holdMs = reduced ? 650 : 1550;
    const next = clamp((now - startedAt) / holdMs);
    setProgress(next);

    if (next >= 1) {
      grant();
      return;
    }

    frame = requestAnimationFrame(tick);
  };

  const begin = (event) => {
    if (active || completed) return;

    window.cancelAnimationFrame(drainFrame);
    active = true;
    startedAt = performance.now();
    screen.dataset.state = 'scanning';
    screen.classList.remove('is-interrupted');
    screen.classList.add('is-contact');
    status.textContent = 'BIOMETRIC SCAN IN PROGRESS';

    if (event && 'pointerId' in event) {
      pointerId = event.pointerId;
      try {
        trigger.setPointerCapture(pointerId);
      } catch {
        // Pointer capture is an enhancement, not a requirement.
      }
      setPointer(event.clientX, event.clientY);
    }

    frame = requestAnimationFrame(tick);
  };

  const interrupt = () => {
    if (!active || completed) return;

    active = false;
    pointerId = null;
    window.cancelAnimationFrame(frame);
    screen.dataset.state = 'idle';
    screen.classList.remove('is-contact');
    screen.classList.add('is-interrupted');
    status.textContent = 'SCAN INTERRUPTED';

    const from = progress;
    drain(from);
    window.setTimeout(() => {
      if (!active && !completed) {
        screen.classList.remove('is-interrupted');
        status.textContent = 'PRESS AND HOLD TO ENTER';
      }
    }, reduced ? 120 : 520);
  };

  const onPointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    event.preventDefault();
    begin(event);
  };

  trigger.addEventListener('pointerdown', onPointerDown);
  trigger.addEventListener('pointerup', interrupt);
  trigger.addEventListener('pointercancel', interrupt);
  trigger.addEventListener('lostpointercapture', () => {
    if (active && !completed) interrupt();
  });

  screen.addEventListener('pointermove', (event) => {
    setPointer(event.clientX, event.clientY);
  }, { passive: true });

  screen.addEventListener('pointerleave', () => {
    if (!active) {
      screen.style.setProperty('--proximity', '0');
      screen.style.setProperty('--ambient-alpha', '.015');
      screen.style.setProperty('--ambient-mid-alpha', '.01');
      screen.style.setProperty('--ambient-opacity', '.45');
      screen.style.setProperty('--sensor-scale', '.985');
      screen.style.setProperty('--sensor-border-alpha', '.045');
      screen.style.setProperty('--sensor-ring-scale', '.9');
      screen.style.setProperty('--sensor-glow-alpha', '.01');
      screen.style.setProperty('--finger-base-alpha', '.18');
      screen.style.setProperty('--finger-glow-alpha', '.04');
      screen.style.setProperty('--tilt-x', '0deg');
      screen.style.setProperty('--tilt-y', '0deg');
    }
  });

  trigger.addEventListener('keydown', (event) => {
    if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
      event.preventDefault();
      begin();
    }
  });

  trigger.addEventListener('keyup', (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      interrupt();
    }
  });

  skip.addEventListener('click', () => finish());

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !completed) {
      event.preventDefault();
      finish();
    }
  });

  motion.addEventListener('change', () => {
    reduced = motion.matches;
    if (reduced && active && !completed) {
      startedAt = performance.now() - progress * 650;
    }
  });

  window.addEventListener('pagehide', () => {
    if (active) window.cancelAnimationFrame(frame);
  });

  setProgress(0);
  screen.dataset.state = 'idle';
  status.textContent = 'PRESS AND HOLD TO ENTER';
  trigger.focus({ preventScroll: true });
})();
