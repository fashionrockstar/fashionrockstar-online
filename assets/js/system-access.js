(() => {
  'use strict';

  const root = document.documentElement;
  const key = 'frsrSystemAccess';
  const url = new URL(window.location.href);
  const replay = url.searchParams.get('system-access') === '1';
  let granted = false;
  let storageAvailable = true;
  try {
    granted = sessionStorage.getItem(key) === 'granted';
    if (!granted) {
      sessionStorage.setItem(`${key}:probe`, '1');
      sessionStorage.removeItem(`${key}:probe`);
    }
  }
  catch { storageAvailable = false; }

  // Fail open when storage is blocked, so HOME never repeatedly gates navigation.
  if (!replay && (granted || !storageAvailable)) return;
  if (replay) {
    url.searchParams.delete('system-access');
    window.history.replaceState(window.history.state, '', url);
  }
  // Run in the head, before the first paint: no flash of HOME behind the gate.
  root.classList.add('system-access-open');

  const mount = () => {
    const screen = document.querySelector('[data-system-access]');
    const main = document.querySelector('body.home > main');
    if (!screen || !main) { root.classList.remove('system-access-open'); return; }

    const initialize = screen.querySelector('[data-system-initialize]');
    const skip = screen.querySelector('[data-system-skip]');
    const status = screen.querySelector('[data-system-status]');
    const wordmark = screen.querySelector('[data-system-wordmark]');
    const sound = screen.querySelector('[data-system-sound]');
    const audio = screen.querySelector('[data-system-audio]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const letters = [...wordmark.textContent];
    const braille = [...'⠋⠁⠎⠓⠊⠕⠝⠗⠕⠉⠅⠎⠞⠁⠗'];
    const bursts = [[2260, 2370], [3180, 3270], [4620, 4730], [5940, 6050]];
    let started = false;
    let complete = false;
    let startedAt = 0;
    let frame = 0;
    let deadline = 0;
    let lastGlyphTick = -1;
    let reduced = motion.matches;
    let glyphCenters = [];

    const glyphs = letters.map((letter) => {
      const glyph = document.createElement('span');
      glyph.className = 'system-access__glyph';
      glyph.dataset.letter = letter;
      const visible = document.createElement('span');
      visible.textContent = letter;
      glyph.append(visible);
      return glyph;
    });
    wordmark.replaceChildren(...glyphs);
    const measureGlyphs = () => {
      glyphCenters = glyphs.map((glyph) => {
        const box = glyph.getBoundingClientRect();
        return box.left + box.width / 2;
      });
    };

    const stopAudio = () => {
      audio.pause();
      try { audio.currentTime = 0; } catch { /* No decoded media yet. */ }
    };

    const finish = (focusHome = true) => {
      if (complete) return;
      complete = true;
      window.clearTimeout(deadline);
      window.cancelAnimationFrame(frame);
      stopAudio();
      try { sessionStorage.setItem(key, 'granted'); } catch { /* HOME still opens. */ }
      screen.hidden = true;
      screen.dataset.state = 'complete';
      screen.classList.remove('is-corrupt', 'is-scanning', 'is-unlocking');
      main.inert = false;
      root.classList.remove('system-access-open');
      document.removeEventListener('keydown', escape);
      motion.removeEventListener('change', changeMotion);
      window.removeEventListener('resize', measureGlyphs);
      document.dispatchEvent(new Event('frsr:system-access-complete'));
      if (focusHome) document.querySelector('[data-home-menu-toggle]')?.focus({ preventScroll: true });
    };

    const setState = (state) => {
      if (screen.dataset.state === state) return;
      screen.dataset.state = state;
      if (state === 'granted') status.textContent = 'ACCESS GRANTED';
    };

    const reconstruct = (elapsed, corrupt) => {
      // Update only affected glyphs, at most 12 times/second, for a crisp translation.
      const tick = Math.floor(elapsed / 85);
      if (tick === lastGlyphTick) return;
      lastGlyphTick = tick;
      const initialPass = elapsed >= 800 && elapsed < 2050;
      const scanPosition = (-.22 + (elapsed - 4000) / 3000 * 1.44) * window.innerWidth;
      glyphs.forEach((glyph, index) => {
        const translating = initialPass && elapsed < 950 + index * 66;
        const crossedByLight = elapsed >= 4000 && elapsed < 7000 && Math.abs(glyphCenters[index] - scanPosition) < 24;
        const interrupted = corrupt && index % 4 === tick % 4;
        const data = translating || crossedByLight || interrupted;
        const character = data ? braille[index] : letters[index];
        if (glyph.firstElementChild.textContent !== character) glyph.firstElementChild.textContent = character;
        glyph.classList.toggle('is-data', data);
      });
    };

    const animate = (now) => {
      if (complete) return;
      const elapsed = now - startedAt;
      const duration = reduced ? 2000 : 10000;
      if (elapsed >= duration) { finish(); return; }
      if (reduced) {
        if (elapsed >= 950) setState('granted');
      } else {
        const corrupt = elapsed < 7200 && bursts.some(([from, to]) => elapsed >= from && elapsed < to);
        const scanning = elapsed >= 4000 && elapsed < 7000;
        const unlocking = elapsed >= 8650 && elapsed < 9520;
        screen.classList.toggle('is-corrupt', corrupt);
        screen.classList.toggle('is-scanning', scanning);
        screen.classList.toggle('is-unlocking', unlocking);
        if (scanning || unlocking) {
          const progress = scanning ? (elapsed - 4000) / 3000 : (elapsed - 8650) / 870;
          screen.style.setProperty('--scan-x', `${(-.22 + progress * 1.44) * window.innerWidth}px`);
        }
        if (elapsed < 7200) reconstruct(elapsed, corrupt);
        else if (elapsed < 9520) setState('granted');
        else if (elapsed < 9590) setState('flash');
        else setState('black');
        if (elapsed >= 9590) audio.volume = Math.max(0, (10000 - elapsed) / 410);
      }
      frame = window.requestAnimationFrame(animate);
    };

    const audioUnavailable = () => {
      if (started && !complete) {
        sound.textContent = 'AUDIO UNAVAILABLE';
        audio.setAttribute('data-unavailable', '');
      }
    };
    const start = (event) => {
      if (started || complete) return;
      started = true;
      startedAt = performance.now();
      measureGlyphs();
      initialize.hidden = true;
      skip.hidden = false;
      setState('initializing');
      status.textContent = 'INITIALIZING…';
      screen.querySelector('[data-system-request]').textContent = 'ACCESS REQUESTED';
      sound.textContent = 'AUDIO CONNECTING';
      screen.querySelector('[data-system-visual]').innerHTML = 'VISUAL SYSTEMS<br>ONLINE';
      screen.querySelector('[data-system-identity]').innerHTML = 'IDENTITY<br>LOADING';
      // Synchronous gesture call: never play on page load or outside user activation.
      try { audio.play().catch(audioUnavailable); } catch { audioUnavailable(); }
      if (event.detail === 0) skip.focus({ preventScroll: true });
      frame = window.requestAnimationFrame(animate);
      // A throttled frame or long audio file must not delay HOME access.
      deadline = window.setTimeout(() => finish(), reduced ? 2000 : 10000);
    };

    const escape = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); finish(); }
    };
    const changeMotion = () => {
      reduced = motion.matches;
      if (!reduced || !started || complete) return;
      screen.classList.remove('is-corrupt', 'is-scanning', 'is-unlocking');
      setState('granted');
      window.cancelAnimationFrame(frame);
      window.clearTimeout(deadline);
      deadline = window.setTimeout(() => finish(), Math.max(0, Math.min(700, 10000 - (performance.now() - startedAt))));
    };

    initialize.addEventListener('click', start);
    skip.addEventListener('click', () => finish());
    audio.addEventListener('error', audioUnavailable);
    audio.addEventListener('playing', () => {
      if (complete) { stopAudio(); return; }
      sound.textContent = 'AUDIO ACTIVE';
    });
    audio.addEventListener('ended', () => { if (!complete) sound.textContent = 'AUDIO COMPLETE'; });
    document.addEventListener('keydown', escape);
    motion.addEventListener('change', changeMotion);
    window.addEventListener('resize', measureGlyphs);
    window.addEventListener('pagehide', () => { if (started) finish(false); });
    window.addEventListener('pageshow', (event) => { if (event.persisted && started) finish(false); });
    main.inert = true;
    screen.hidden = false;
    initialize.focus({ preventScroll: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
