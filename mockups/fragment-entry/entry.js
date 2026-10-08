(() => {
  'use strict';
  const root = document.documentElement;
  const gate = document.querySelector('[data-fragment-entry]');
  const canvas = document.querySelector('[data-entry-canvas]');
  const ctx = canvas?.getContext('2d', { alpha: true });
  const enter = document.querySelector('[data-entry-enter]');
  const skip = document.querySelector('[data-entry-skip]');
  const caption = document.querySelector('[data-entry-caption]');
  const film = document.querySelector('[data-entry-film]');
  const voice = document.querySelector('[data-entry-voice]');
  const hero = document.querySelector('[data-hero-video]');
  const review = document.querySelector('[data-entry-review]');
  const replay = document.querySelector('[data-entry-replay]');
  const sound = document.querySelector('[data-entry-sound]');
  const page = [...document.querySelectorAll('body > main, body > footer')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'frsrFragmentEntryV1';
  const duration = 6800;
  let raf = 0, failsafe = 0, started = 0, lastPaint = 0;
  let playing = false, complete = false, visible = false, heroStarted = false;
  let width = 0, height = 0, analyser, audioContext, samples;
  let energy = 0;
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const noise = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const buffer = document.createElement('canvas');
  const scene = buffer.getContext('2d');
  const logo = new Image();
  logo.src = '/assets/images/hero-logo-white.png';

  const unlock = () => {
    root.classList.remove('fragment-entry-open');
    page.forEach(el => { el.inert = false; });
  };
  if (!gate || !ctx || !scene || !enter || !film || !voice || !hero) {
    unlock();
    return;
  }
  clearTimeout(window.__frsrEntryFailOpen);

  const resize = () => {
    width = innerWidth;
    height = innerHeight;
    // Keep video compositing affordable on phones and high-density displays.
    const dpr = Math.min(devicePixelRatio || 1, 1.5, 1600 / Math.max(width, height));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buffer.width = Math.round(width);
    buffer.height = Math.round(height);
    if (!playing && visible) idle();
  };

  const idle = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    // A single incomplete registration line keeps the idle frame quiet.
    ctx.fillStyle = '#292929';
    ctx.fillRect(width * .5 - 12, height * .24, 24, 1);
  };

  const syncSound = () => {
    const on = !voice.paused && !voice.muted;
    sound.textContent = on ? 'SOUND ON' : 'SOUND OFF';
    sound.setAttribute('aria-pressed', String(on));
  };
  const setupSound = () => {
    try {
      if (!audioContext) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        audioContext = new Audio();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        audioContext.createMediaElementSource(voice).connect(analyser);
        analyser.connect(audioContext.destination);
        samples = new Uint8Array(analyser.frequencyBinCount);
      }
      audioContext.resume().catch(() => {});
    } catch { /* Voice can still play when analysis is unavailable. */ }
  };
  const measureVoice = () => {
    if (!analyser || voice.paused || voice.muted) return energy *= .88;
    analyser.getByteFrequencyData(samples);
    let sum = 0;
    for (let i = 3; i < 70; i++) sum += samples[i];
    energy = energy * .62 + (sum / (67 * 255)) * .38;
    return energy;
  };

  const finish = (stopSound = false, focusHome = true) => {
    if (complete && !visible) return;
    complete = true;
    playing = false;
    visible = false;
    cancelAnimationFrame(raf);
    clearTimeout(failsafe);
    film.pause();
    if (stopSound) voice.pause();
    gate.hidden = true;
    gate.dataset.state = 'complete';
    unlock();
    try {
      sessionStorage.setItem(key, 'seen');
      // Returning to the existing preview homepage should not show its old gate.
      sessionStorage.setItem('frsrBiometricAccessV2', 'granted');
    } catch {}
    review.hidden = false;
    syncSound();
    if (focusHome) document.querySelector('.scroll-cue')?.focus({ preventScroll: true });
  };

  const sourceScene = () => {
    scene.fillStyle = '#000';
    scene.fillRect(0, 0, width, height);
    if (film.readyState < 2) return false;
    const h = height * 1.17;
    const w = h * film.videoWidth / film.videoHeight;
    scene.drawImage(film, (width - w) / 2, height - h, w, h);
    return true;
  };
  const logoScene = () => {
    scene.fillStyle = '#000';
    scene.fillRect(0, 0, width, height);
    if (hero.readyState >= 2) {
      const box = hero.getBoundingClientRect();
      const scale = Math.min(box.width / hero.videoWidth, box.height / hero.videoHeight);
      const w = hero.videoWidth * scale, h = hero.videoHeight * scale;
      scene.drawImage(hero, box.left + (box.width - w) / 2, box.top + (box.height - h) / 2, w, h);
    } else if (logo.complete && logo.naturalWidth) {
      const w = Math.min(width * .72, 1152), h = w * logo.naturalHeight / logo.naturalWidth;
      scene.drawImage(logo, (width - w) / 2, (height - h) / 2, w, h);
    }
  };

  const fragments = (t, amount, reveal, body) => {
    const tick = Math.floor(t * 18);
    const cols = width < 600 ? 22 : 46;
    const unit = width / cols;
    // Strips carry pieces of the actual source frame, rather than random footage.
    for (let i = 0; i < cols; i++) {
      const r = noise(i * 1.91 + tick);
      const x = i * unit;
      if (noise(i * 6.4) > reveal) continue;
      const offset = (r - .5) * amount * width * .15;
      const y = (noise(i * 2.3 + tick) - .5) * amount * height * .12;
      ctx.drawImage(buffer, x, 0, unit + 1, height, x + offset, y, unit + 1, height);
    }
    if (amount < .025) return;
    // Local block displacement interrupts the portrait in short, voiced bursts.
    for (let i = 0; i < 18; i++) {
      const r = noise(tick * 3.7 + i);
      const y = noise(i * 13.4 + tick) * height;
      const h = 3 + noise(i * 8.2) * height * .06;
      const x = body ? width * (.28 + noise(i * 3.2) * .35) : noise(i * 9) * width;
      const w = Math.min(width - x, width * (.025 + r * .16));
      if (r < .28) {
        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, w, h);
      } else {
        ctx.drawImage(buffer, x, y, w, Math.min(h, height - y), x + (r - .5) * amount * 130, y, w, h);
      }
    }
    // Sparse white bars sit beside the body; never a full-screen strobe.
    for (let i = 0; i < 9; i++) {
      if (noise(i + tick * .7) > amount * .58) continue;
      const x = width * (.19 + noise(i * 4 + tick) * .62);
      const y = height * (.12 + noise(i * 7 + tick) * .74);
      ctx.fillStyle = `rgba(235,235,235,${.22 + amount * .35})`;
      ctx.fillRect(x, y, 2 + noise(i * 5) * 12, 3 + noise(i * 8) * 26);
    }
  };

  const paint = now => {
    if (!playing) return;
    raf = requestAnimationFrame(paint);
    if (now - lastPaint < 1000 / 30) return;
    lastPaint = now;
    const t = (now - started) / 1000;
    const voiceEnergy = measureVoice();
    if (t >= duration / 1000) return finish();
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    if (t < 4.35) {
      const ready = sourceScene();
      const arrival = ease(t / 1.2);
      const departure = 1 - ease((t - 3.8) / .55);
      const pulse = (.28 + voiceEnergy * 1.4) * (.72 + Math.sin(t * 5) * .18);
      ctx.globalAlpha = arrival * departure;
      if (ready) fragments(t, pulse, .2 + arrival * .8, true);
      else {
        logoScene();
        fragments(t, pulse * .6, .3 + arrival * .7, false);
      }
      ctx.globalAlpha = 1;
      caption.textContent = t > .7 && t < 3.9 ? 'NOT FOR MAINSTREAM CONSUMPTION' : '';
    }
    if (t > 3.85) {
      if (!heroStarted) {
        heroStarted = true;
        hero.currentTime = 0;
        hero.play().catch(() => {});
      }
      const settle = ease((t - 4.05) / 1.35);
      logoScene();
      ctx.globalAlpha = ease((t - 3.85) / .55);
      fragments(t, (1 - settle) * .65, .16 + settle * .84, false);
      ctx.globalAlpha = 1;
    }
    if (t > 5.25) {
      gate.dataset.state = 'revealing';
      const progress = ease((t - 5.25) / 1.35);
      const cols = width < 600 ? 16 : 32;
      // Transparent slots expose the very same playing hero video underneath.
      for (let i = 0; i < cols; i++) {
        const local = ease((progress - noise(i * 3.7) * .34) / .66);
        const w = width / cols;
        ctx.clearRect(i * w, (1 - local) * height / 2, w + 1, height * local);
      }
    }
    gate.dataset.phase = t < 1.2 ? 'acquire' : t < 3.85 ? 'fragment' : t < 5.25 ? 'resolve' : 'home';
  };

  const begin = () => {
    if (playing) return;
    playing = true;
    complete = false;
    heroStarted = false;
    gate.dataset.state = 'playing';
    enter.disabled = true;
    skip.focus({ preventScroll: true });
    setupSound();
    voice.currentTime = 0;
    voice.muted = false;
    voice.play().then(syncSound).catch(syncSound);
    if (reduced.matches) return finish(false);
    film.currentTime = 0;
    film.play().catch(() => {});
    started = performance.now();
    lastPaint = 0;
    failsafe = setTimeout(() => finish(), duration + 1200);
    raf = requestAnimationFrame(paint);
  };
  const show = () => {
    clearTimeout(failsafe);
    cancelAnimationFrame(raf);
    voice.pause();
    hero.pause();
    complete = false;
    playing = false;
    visible = true;
    gate.hidden = false;
    gate.dataset.state = 'idle';
    delete gate.dataset.phase;
    caption.textContent = '';
    enter.disabled = false;
    review.hidden = true;
    root.classList.add('fragment-entry-open');
    page.forEach(el => { el.inert = true; });
    window.scrollTo({ top: 0, behavior: 'instant' });
    resize();
    enter.focus({ preventScroll: true });
  };
  enter.addEventListener('click', begin);
  skip.addEventListener('click', () => { hero.play().catch(() => {}); finish(true); });
  replay.addEventListener('click', show);
  sound.addEventListener('click', () => {
    if (!voice.paused && !voice.muted) { voice.muted = true; syncSound(); }
    else { setupSound(); voice.muted = false; voice.play().then(syncSound).catch(syncSound); }
  });
  voice.addEventListener('ended', syncSound);
  gate.addEventListener('keydown', event => {
    if (event.key === 'Escape') { hero.play().catch(() => {}); finish(true); }
    if (event.key === 'Tab') {
      const controls = playing ? [skip] : [enter, skip];
      const current = controls.indexOf(document.activeElement);
      event.preventDefault();
      controls[(current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
    }
  });
  reduced.addEventListener('change', () => { if (reduced.matches && playing) finish(); });
  window.addEventListener('resize', resize);
  window.addEventListener('pagehide', () => { if (visible) finish(true, false); voice.pause(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) finish(true, false);
    if (document.hidden) voice.pause();
    syncSound();
  });
  let showOnLoad = root.classList.contains('fragment-entry-open');
  const url = new URL(location.href);
  if (url.searchParams.get('replay') === '1') {
    showOnLoad = true;
    url.searchParams.delete('replay');
    history.replaceState(history.state, '', url);
  }
  if (showOnLoad) show();
  else { gate.hidden = true; unlock(); review.hidden = false; syncSound(); }
})();
