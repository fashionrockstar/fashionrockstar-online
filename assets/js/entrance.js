(() => {
  'use strict';
  const dialog = document.querySelector('[data-entrance]');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const mobile = window.matchMedia('(max-width: 760px) and (pointer: coarse)');
  const replay = new URLSearchParams(window.location.search).get('entrance') === '1';
  const storage = {
    get(key) { try { return sessionStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { sessionStorage.setItem(key, value); } catch { /* Entrance still works without storage. */ } }
  };
  if (!replay && (!mobile.matches || storage.get('frsr-entered') === '1')) return;

  const touch = dialog.querySelector('[data-entrance-touch]');
  const status = dialog.querySelector('[data-entrance-status]');
  const skip = dialog.querySelector('[data-entrance-skip]');
  const sound = dialog.querySelector('[data-entrance-sound]');
  let audioContext;
  let soundEnabled = storage.get('frsr-sound') !== 'off';
  let frame = 0;
  let exitTimer = 0;
  let startedAt = null;
  let pointerId = null;
  let keyboardKey = null;
  let complete = false;
  const holdDuration = 1100;

  const updateSound = () => {
    sound.textContent = `Sound ${soundEnabled ? 'on' : 'off'}`;
    sound.setAttribute('aria-pressed', String(soundEnabled));
  };

  // All sound starts from a visitor's gesture. This effect uses no recordings,
  // biometric APIs, microphone, or fingerprint data.
  const tone = (granted = false) => {
    if (!soundEnabled) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      audioContext ||= new Audio();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      const now = audioContext.currentTime;
      const notes = granted ? [660, 990] : [220];
      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const start = now + index * .09;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(.065, start + .008);
        gain.gain.exponentialRampToValueAtTime(.0001, start + .13);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
        oscillator.start(start);
        oscillator.stop(start + .15);
      });
    } catch { /* An unavailable sound device must never block entry. */ }
  };

  const cancelHold = () => {
    if (complete) return;
    cancelAnimationFrame(frame);
    startedAt = null;
    keyboardKey = null;
    pointerId = null;
    touch.classList.remove('is-holding');
    touch.style.setProperty('--hold-progress', '0');
    status.textContent = 'HOLD TO ENTER';
  };

  const enter = () => {
    storage.set('frsr-entered', '1');
    if (dialog.open) dialog.close();
  };

  const advance = (time) => {
    if (startedAt === null || !dialog.open) return;
    const progress = Math.min(1, (time - startedAt) / holdDuration);
    touch.style.setProperty('--hold-progress', String(progress * 100));
    if (progress < 1) {
      frame = requestAnimationFrame(advance);
      return;
    }
    complete = true;
    touch.classList.remove('is-holding');
    touch.classList.add('is-complete');
    status.textContent = 'ACCESS GRANTED';
    tone(true);
    exitTimer = window.setTimeout(enter, 400);
  };

  const startHold = () => {
    if (complete || startedAt !== null) return;
    startedAt = performance.now();
    touch.classList.add('is-holding');
    status.textContent = 'KEEP HOLDING';
    tone();
    frame = requestAnimationFrame(advance);
  };

  touch.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0 || startedAt !== null) return;
    event.preventDefault();
    pointerId = event.pointerId;
    touch.setPointerCapture(pointerId);
    startHold();
  });
  touch.addEventListener('pointermove', (event) => {
    if (event.pointerId !== pointerId) return;
    const box = touch.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) cancelHold();
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((type) => {
    touch.addEventListener(type, (event) => {
      if (event.pointerId === pointerId) cancelHold();
    });
  });
  touch.addEventListener('contextmenu', (event) => event.preventDefault());
  touch.addEventListener('keydown', (event) => {
    if (![' ', 'Enter'].includes(event.key)) return;
    event.preventDefault();
    if (!event.repeat && startedAt === null) {
      keyboardKey = event.key;
      startHold();
    }
  });
  touch.addEventListener('keyup', (event) => {
    if (event.key === keyboardKey) { event.preventDefault(); cancelHold(); }
  });
  // Assistive technology can activate the button without a pointer or hold.
  touch.addEventListener('click', (event) => { if (event.detail === 0 && startedAt === null) enter(); });
  touch.addEventListener('blur', cancelHold);
  window.addEventListener('blur', cancelHold);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelHold(); });
  skip.addEventListener('click', enter);
  sound.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    storage.set('frsr-sound', soundEnabled ? 'on' : 'off');
    updateSound();
    if (!soundEnabled && audioContext) audioContext.suspend().catch(() => {});
  });
  dialog.addEventListener('cancel', () => storage.set('frsr-entered', '1'));
  dialog.addEventListener('close', () => {
    window.clearTimeout(exitTimer);
    cancelAnimationFrame(frame);
    document.documentElement.classList.remove('entrance-open');
    if (audioContext) audioContext.close().catch(() => {});
    document.querySelector('[data-home-menu-toggle]')?.focus({ preventScroll: true });
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && dialog.open) enter();
  });
  mobile.addEventListener('change', () => { if (!mobile.matches && !replay) enter(); });

  updateSound();
  dialog.showModal();
  document.documentElement.classList.add('entrance-open');
})();
