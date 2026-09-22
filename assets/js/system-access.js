(() => {
  'use strict';
  const root = document.documentElement;
  const sessionKey = 'frsrSystemAccess';
  const url = new URL(window.location.href);
  const replay = url.searchParams.get('system-access') === '1';
  let granted = false;
  let storageAvailable = true;
  try {
    granted = sessionStorage.getItem(sessionKey) === 'granted';
    if (!granted) {
      sessionStorage.setItem(`${sessionKey}:probe`, '1');
      sessionStorage.removeItem(`${sessionKey}:probe`);
    }
  } catch { storageAvailable = false; }
  const shouldShow = replay || (!granted && storageAvailable);
  if (replay) {
    url.searchParams.delete('system-access');
    window.history.replaceState(window.history.state, '', url);
  }
  if (shouldShow) root.classList.add('system-access-open');

  const mount = () => {
    // The one player belongs to the document root, outside the disposable visuals.
    // Its lifetime and mute state never depend on the entry state machine.
    const audio = document.querySelector('[data-system-audio]');
    const audioControls = document.querySelector('[data-site-audio]');
    const mute = document.querySelector('[data-site-audio-toggle]');
    const screen = document.querySelector('[data-system-access]');
    const main = document.querySelector('body.home > main');
    if (!audio || !audioControls || !mute || !screen || !main) {
      root.classList.remove('system-access-open');
      return;
    }
    const updateMute = () => {
      mute.textContent = audio.muted ? 'UNMUTE' : 'MUTE';
      mute.setAttribute('aria-label', audio.muted ? 'Unmute narration' : 'Mute narration');
      mute.setAttribute('aria-pressed', String(audio.muted));
    };
    mute.addEventListener('click', () => { audio.muted = !audio.muted; updateMute(); });
    audio.addEventListener('volumechange', updateMute);
    audio.addEventListener('playing', () => { audioControls.hidden = false; });
    const hideAudioControls = () => {
      const restoreFocus = document.activeElement === mute;
      audioControls.hidden = true;
      if (restoreFocus) {
        const target = screen.hidden
          ? document.querySelector('[data-home-menu-toggle]')
          : screen.querySelector('[data-system-skip]:not([hidden])');
        target?.focus({ preventScroll: true });
      }
    };
    audio.addEventListener('ended', hideAudioControls);
    audio.addEventListener('error', hideAudioControls);
    // This is a multi-page site: actual document navigation unloads its player.
    // Never autoplay or restart narration when returning to HOME or its page cache.
    window.addEventListener('pagehide', () => { audio.pause(); audioControls.hidden = true; });

    if (!shouldShow) return;
    const initialize = screen.querySelector('[data-system-initialize]');
    const skip = screen.querySelector('[data-system-skip]');
    const status = screen.querySelector('[data-system-status]');
    const sound = screen.querySelector('[data-system-sound]');
    const logo = screen.querySelector('[data-system-logo]');
    const sample = screen.querySelector('[data-system-sample]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const braille = '⠋⠁⠎⠓⠊⠕⠝⠗⠕⠉⠅⠎⠞⠁⠗';
    let started = false;
    let complete = false;
    let startedAt = 0;
    let frame = 0;
    let deadline = 0;
    let reduced = motion.matches;
    let logoBox;
    let previousAudioTime = 0;
    let audioAdvancedAt = 0;
    let visualTime = 0;
    let sampleTick = -1;
    const measure = () => { logoBox = logo.getBoundingClientRect(); };

    const finishVisuals = (focusHome = true) => {
      if (complete) return;
      complete = true;
      window.clearTimeout(deadline);
      window.cancelAnimationFrame(frame);
      try { sessionStorage.setItem(sessionKey, 'granted'); } catch { /* HOME remains available. */ }
      screen.hidden = true;
      screen.dataset.state = 'complete';
      screen.classList.remove('is-scanning', 'is-reading', 'is-sampling', 'is-micro-scanning', 'is-unlocking', 'is-overexposed');
      main.inert = false;
      root.classList.remove('system-access-open');
      document.removeEventListener('keydown', escape);
      motion.removeEventListener('change', changeMotion);
      window.removeEventListener('resize', measure);
      // Deliberately no pause(), play(), currentTime or volume changes here.
      document.dispatchEvent(new Event('frsr:system-access-complete'));
      if (focusHome) document.querySelector('[data-home-menu-toggle]')?.focus({ preventScroll: true });
    };
    const setState = (state) => {
      if (screen.dataset.state === state) return;
      screen.dataset.state = state;
      if (state === 'granted') status.textContent = 'ACCESS GRANTED';
    };
    const setScanner = (progress, response = false) => {
      const x = (-.2 + progress * 1.4) * window.innerWidth;
      screen.style.setProperty('--scan-x', `${x}px`);
      const localX = x - logoBox.left;
      screen.classList.toggle('is-reading', response && localX > -24 && localX < logoBox.width + 24);
      logo.style.setProperty('--read-x', `${localX}px`);
      // Clip duplicate asset layers locally; never redraw the official letterforms.
      logo.style.setProperty('--read-left', `${Math.max(0, localX - 18)}px`);
      logo.style.setProperty('--read-right', `${Math.max(0, logoBox.width - localX - 18)}px`);
    };
    const animate = (now) => {
      if (complete) return;
      const wallTime = now - startedAt;
      if (wallTime >= (reduced ? 2000 : 10000)) { finishVisuals(); return; }
      if (reduced) {
        if (wallTime >= 950) setState('granted');
      } else {
        const audioTime = audio.currentTime * 1000;
        if (audioTime > previousAudioTime) { previousAudioTime = audioTime; audioAdvancedAt = now; }
        // Follow the recording while it advances; buffering cannot lock the site.
        const clock = audioTime > 0 && now - audioAdvancedAt < 350 ? audioTime : wallTime;
        // Reserve the final scan and black beat before the ten-second deadline,
        // even when audio decoding starts late. Playback itself stays untouched.
        visualTime = Math.max(visualTime, clock, wallTime >= 8400 ? wallTime : 0);
        const t = visualTime;
        const firstRead = t >= 850 && t < 2500;
        const silverPass = t >= 3500 && t < 6850;
        const finalPass = t >= 8400 && t < 9680;
        const sampling = (t >= 1320 && t < 1460) || (t >= 2060 && t < 2180) || (t >= 4380 && t < 4520) || (t >= 5640 && t < 5800);
        const micro = (t >= 1800 && t < 1920) || (t >= 4780 && t < 4920) || (t >= 6160 && t < 6290);
        screen.classList.toggle('is-scanning', silverPass);
        screen.classList.toggle('is-unlocking', finalPass);
        screen.classList.toggle('is-sampling', sampling);
        screen.classList.toggle('is-micro-scanning', micro);
        // One 160ms exposure near the scanner, not a full-page flash.
        screen.classList.toggle('is-overexposed', finalPass && t >= 9120 && t < 9280);
        if (firstRead) setScanner((t - 850) / 1650, true);
        else if (silverPass) setScanner((t - 3500) / 3350, true);
        else if (finalPass) setScanner((t - 8400) / 1280);
        else screen.classList.remove('is-reading');
        if (sampling && Math.floor(t / 90) !== sampleTick) {
          sampleTick = Math.floor(t / 90);
          const offset = sampleTick % (braille.length - 3);
          sample.textContent = braille.slice(offset, offset + 4);
        }
        if (t >= 7200 && t < 9680) setState('granted');
        else if (t >= 9680) setState('black');
      }
      frame = window.requestAnimationFrame(animate);
    };
    const unavailable = () => {
      audioControls.hidden = true;
      if (!complete) sound.textContent = 'AUDIO UNAVAILABLE';
    };
    const start = (event) => {
      if (started || complete) return;
      started = true;
      startedAt = performance.now();
      measure();
      initialize.hidden = true;
      skip.hidden = false;
      setState('initializing');
      status.textContent = 'INITIALIZING…';
      screen.querySelector('[data-system-request]').textContent = 'ACCESS REQUESTED';
      sound.textContent = 'AUDIO CONNECTING';
      screen.querySelector('[data-system-visual]').innerHTML = 'VISUAL SYSTEMS<br>ONLINE';
      screen.querySelector('[data-system-identity]').innerHTML = 'IDENTITY<br>LOADING';
      audioControls.hidden = false;
      // Exactly one play call, directly within the click/keyboard gesture.
      try { audio.play().catch(unavailable); } catch { unavailable(); }
      if (event.detail === 0) skip.focus({ preventScroll: true });
      frame = window.requestAnimationFrame(animate);
      deadline = window.setTimeout(() => finishVisuals(), reduced ? 2000 : 10000);
    };
    const escape = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); finishVisuals(); }
    };
    const changeMotion = () => {
      reduced = motion.matches;
      if (!reduced || !started || complete) return;
      screen.classList.remove('is-scanning', 'is-reading', 'is-sampling', 'is-micro-scanning', 'is-unlocking', 'is-overexposed');
      setState('granted');
      window.cancelAnimationFrame(frame);
      window.clearTimeout(deadline);
      deadline = window.setTimeout(() => finishVisuals(), Math.max(0, Math.min(700, 10000 - (performance.now() - startedAt))));
    };
    initialize.addEventListener('click', start);
    skip.addEventListener('click', () => finishVisuals());
    audio.addEventListener('error', unavailable);
    audio.addEventListener('playing', () => { if (!complete) sound.textContent = 'AUDIO ACTIVE'; });
    audio.addEventListener('ended', () => { if (!complete) sound.textContent = 'AUDIO COMPLETE'; });
    document.addEventListener('keydown', escape);
    motion.addEventListener('change', changeMotion);
    window.addEventListener('resize', measure);
    window.addEventListener('pagehide', () => { if (started) finishVisuals(false); });
    window.addEventListener('pageshow', (event) => { if (event.persisted && started) finishVisuals(false); });
    main.inert = true;
    screen.hidden = false;
    initialize.focus({ preventScroll: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
