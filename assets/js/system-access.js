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
    const audio = document.querySelector('[data-system-audio]');
    const audioControls = document.querySelector('[data-site-audio]');
    const mute = document.querySelector('[data-site-audio-toggle]');
    const screen = document.querySelector('[data-system-access]');
    const main = document.querySelector('body.home > main');
    if (!audio || !audioControls || !mute || !screen || !main) {
      root.classList.remove('system-access-open');
      return;
    }
    // The persistent root player is independent of the visual timeline.
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
    window.addEventListener('pagehide', () => { audio.pause(); audioControls.hidden = true; });
    if (!shouldShow) return;

    const initialize = screen.querySelector('[data-system-initialize]');
    const skip = screen.querySelector('[data-system-skip]');
    const status = screen.querySelector('[data-system-status]');
    const request = screen.querySelector('[data-system-request]');
    const sound = screen.querySelector('[data-system-sound]');
    const logo = screen.querySelector('[data-system-logo]');
    const primary = screen.querySelector('.logo-primary');
    const data = screen.querySelector('[data-system-data]');
    const grant = screen.querySelector('[data-system-grant]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const word = 'FASHIONROCKSTAR';
    const braille = '⠋⠁⠎⠓⠊⠕⠝⠗⠕⠉⠅⠎⠞⠁⠗';
    // Translation resolves out of order, with no change to character-cell widths.
    const resolveAt = [1220, 1870, 1460, 2210, 1340, 1940, 1650, 2410, 1550, 2080, 1730, 2570, 1820, 2290, 2660];
    const regressions = [{ time: 2185, index: 2, seen: false }, { time: 2480, index: 9, seen: false }];
    const glitchEvents = [
      { time: 2150, duration: 90, strength: .35, a: '26%', b: '73%' },
      { time: 3270, duration: 120, strength: .55, a: '41%', b: '86%' },
      { time: 4330, duration: 85, strength: .5, a: '18%', b: '63%' },
      { time: 5380, duration: 105, strength: .4, a: '54%', b: '81%' }
    ];
    for (let i = 0; i < word.length; i++) {
      const cell = document.createElement('span');
      cell.textContent = braille[i];
      cell.dataset.resolved = 'false';
      data.append(cell);
    }
    // All interference uses copies of the official asset and the same live data row.
    const copies = [...screen.querySelectorAll('[data-system-ghost], [data-system-response]')];
    for (const layer of copies) {
      layer.innerHTML = primary.innerHTML;
      layer.querySelector('[data-system-data]').removeAttribute('data-system-data');
    }
    const characterRows = [data, ...copies.map(layer => layer.querySelector('.system-access__data'))];
    for (const char of 'ACCESS GRANTED') {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00a0' : char;
      grant.append(span);
    }
    const grantLetters = [...grant.children];
    // Fixed, uneven clusters of horizontal fragments: no repeating scanline ladder.
    const grain = screen.querySelector('.system-access__scan-grain');
    const clusters = [3, 8.7, 16.4, 23.1, 31.7, 38.2, 43.8, 48.9, 56.6, 63.1, 74.8, 81.3, 89.4, 95.2];
    clusters.forEach((top, cluster) => {
      for (let n = 0; n < 3; n++) {
        const streak = document.createElement('i');
        const key = cluster * 7 + n * 13;
        streak.style.top = `${top + n * .37}%`;
        streak.style.left = `${18 + key * 11 % 62}px`;
        streak.style.width = `${22 + key * 17 % 118}px`;
        streak.style.height = `${n === 1 && cluster % 3 === 0 ? 3 : 1}px`;
        streak.style.opacity = String(.15 + (key % 7) * .08);
        grain.append(streak);
      }
    });
    let grantCenters = [];
    let logoBox;
    let started = false;
    let complete = false;
    let startedAt = 0;
    let frame = 0;
    let deadline = 0;
    let reduced = motion.matches;
    let visualTime = 0;
    let translationComplete = false;
    let activeGlitch = null;
    const effects = ['is-scanning', 'is-reading', 'is-corrupt', 'is-unlocking', 'is-exposing', 'is-flashing', 'is-start-flicker', 'is-edge-left', 'is-edge-right'];
    const measure = () => {
      logoBox = logo.getBoundingClientRect();
      grantCenters = grantLetters.map(letter => { const box = letter.getBoundingClientRect(); return box.left + box.width / 2; });
    };
    const setState = state => {
      if (screen.dataset.state === state) return;
      screen.dataset.state = state;
      if (state === 'granted') status.textContent = 'ACCESS GRANTED';
    };
    const translateData = t => {
      let regressionIndex = -1;
      for (const event of regressions) {
        if (!event.seen && t >= event.time) {
          event.seen = true;
          // One rendered-frame regression; ignore events missed by a long hitch.
          if (t < event.time + 70) regressionIndex = event.index;
        }
      }
      for (let i = 0; i < word.length; i++) {
        const resolved = t >= resolveAt[i] && i !== regressionIndex;
        const glyph = resolved ? word[i] : braille[(i + (t < 1000 ? 0 : Math.floor((t - 1000) / (97 + i * 7)))) % braille.length];
        for (const row of characterRows) {
          const cell = row.children[i];
          if (cell.textContent !== glyph) cell.textContent = glyph;
          cell.dataset.resolved = String(resolved);
        }
      }
    };
    const setScanner = (progress, readLogo, readGrant) => {
      const x = (-.08 + progress * 1.16) * window.innerWidth;
      screen.style.setProperty('--scan-x', `${x}px`);
      const localX = x - logoBox.left;
      screen.classList.toggle('is-reading', readLogo && localX > -20 && localX < logoBox.width + 20);
      logo.style.setProperty('--read-left', `${Math.max(0, localX - 20)}px`);
      logo.style.setProperty('--read-right', `${Math.max(0, logoBox.width - localX - 20)}px`);
      grantLetters.forEach((letter, i) => letter.classList.toggle('is-lit', readGrant && Math.abs(grantCenters[i] - x) < 27));
    };
    const finishVisuals = (focusHome = true) => {
      if (complete) return;
      complete = true;
      window.clearTimeout(deadline);
      window.cancelAnimationFrame(frame);
      try { sessionStorage.setItem(sessionKey, 'granted'); } catch { /* Fail open. */ }
      screen.hidden = true;
      screen.dataset.state = 'complete';
      screen.classList.remove(...effects);
      main.inert = false;
      root.classList.remove('system-access-open');
      document.removeEventListener('keydown', escape);
      motion.removeEventListener('change', changeMotion);
      window.removeEventListener('resize', measure);
      document.dispatchEvent(new Event('frsr:system-access-complete'));
      if (focusHome) document.querySelector('[data-home-menu-toggle]')?.focus({ preventScroll: true });
    };
    const animate = now => {
      if (complete) return;
      const wallTime = now - startedAt;
      if (wallTime >= (reduced ? 2000 : 9600)) { finishVisuals(); return; }
      if (reduced) {
        if (wallTime >= 950) setState('granted');
      } else {
        // Follow the voice initially, within 160 ms of the bounded visual clock.
        // The terminal sequence has reserved time even when audio buffers.
        const voiceTime = audio.currentTime * 1000;
        const clock = wallTime < 6200 && voiceTime > 0
          ? Math.min(wallTime, Math.max(wallTime - 160, voiceTime)) : wallTime;
        const t = visualTime = Math.max(visualTime, clock);
        if (t < 350) setState('boot');
        else if (t < 6200) setState('active');
        else if (t < 6800) setState('clearing');
        else if (t < 7100) setState('quiet');
        else if (t < 9020) setState('granted');
        else setState('black');
        if (!translationComplete) {
          translateData(t);
          translationComplete = t >= 2800;
        }
        const glitch = glitchEvents.find(event => t >= event.time && t < event.time + event.duration);
        screen.classList.toggle('is-corrupt', Boolean(glitch));
        if (glitch && glitch !== activeGlitch) {
          screen.style.setProperty('--strength', glitch.strength);
          screen.style.setProperty('--tear-a', glitch.a);
          screen.style.setProperty('--tear-b', glitch.b);
        }
        activeGlitch = glitch;
        const scanning = t >= 3500 && t < 6000;
        const unlocking = t >= 7200 && t < 8600;
        const exposing = t >= 8700 && t < 8820;
        screen.classList.toggle('is-scanning', scanning);
        screen.classList.toggle('is-unlocking', unlocking);
        screen.classList.toggle('is-exposing', exposing);
        screen.classList.toggle('is-flashing', t >= 8900 && t < 9020);
        screen.classList.toggle('is-start-flicker', t >= 350 && t < 400);
        screen.classList.toggle('is-edge-left', (t >= 1760 && t < 1890) || (t >= 3500 && t < 3700));
        screen.classList.toggle('is-edge-right', (t >= 5730 && t < 5910) || (t >= 8420 && t < 8560));
        if (scanning) setScanner((t - 3500) / 2500, true, false);
        else if (unlocking) setScanner((t - 7200) / 1400, false, true);
        else if (exposing) setScanner(.5, false, true);
        else {
          screen.classList.remove('is-reading');
          grantLetters.forEach(letter => letter.classList.remove('is-lit'));
        }
      }
      frame = window.requestAnimationFrame(animate);
    };
    const unavailable = () => {
      audioControls.hidden = true;
      if (!complete) sound.textContent = 'AUDIO UNAVAILABLE';
    };
    const start = event => {
      if (started || complete) return;
      started = true;
      startedAt = performance.now();
      measure();
      initialize.hidden = true;
      skip.hidden = false;
      setState(reduced ? 'active' : 'boot');
      status.textContent = 'ACCESS REQUESTED';
      request.textContent = request.dataset.echo = 'ACCESS REQUESTED';
      sound.textContent = 'AUDIO ACTIVE';
      audioControls.hidden = false;
      // One direct user-gesture play call. SKIP and HOME never touch this player.
      try { audio.play().catch(unavailable); } catch { unavailable(); }
      if (reduced) translateData(2800);
      if (event.detail === 0) skip.focus({ preventScroll: true });
      frame = window.requestAnimationFrame(animate);
      deadline = window.setTimeout(() => finishVisuals(), reduced ? 2000 : 9600);
    };
    const escape = event => {
      if (event.key === 'Escape') { event.preventDefault(); finishVisuals(); }
    };
    const changeMotion = () => {
      reduced = motion.matches;
      if (!reduced || !started || complete) return;
      screen.classList.remove(...effects);
      translateData(2800);
      grantLetters.forEach(letter => letter.classList.remove('is-lit'));
      setState('granted');
      window.cancelAnimationFrame(frame);
      window.clearTimeout(deadline);
      deadline = window.setTimeout(() => finishVisuals(), Math.max(0, Math.min(700, 9600 - (performance.now() - startedAt))));
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
    window.addEventListener('pageshow', event => { if (event.persisted && started) finishVisuals(false); });
    main.inert = true;
    screen.hidden = false;
    initialize.focus({ preventScroll: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
