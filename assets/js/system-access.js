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
    const field = screen.querySelector('[data-signal-field]');
    const logo = screen.querySelector('[data-system-logo]');
    const primary = screen.querySelector('.logo-primary');
    const data = screen.querySelector('[data-system-data]');
    const grant = screen.querySelector('[data-system-grant]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const word = 'FASHIONROCKSTAR';
    const braille = '⠋⠁⠎⠓⠊⠕⠝⠗⠕⠉⠅⠎⠞⠁⠗';
    const resolveAt = [2410, 2810, 2580, 3160, 2520, 2870, 2700, 3280, 2640, 2800, 2930, 3350, 3010, 3210, 3380];
    const regressions = [{ time: 3085, index: 2, seen: false }, { time: 3220, index: 9, seen: false }];
    const bursts = [
      { time: 1800, duration: 75, strength: .16 },
      { time: 2400, duration: 110, strength: .46 },
      { time: 2620, duration: 110, strength: .63 },
      { time: 2940, duration: 115, strength: .8 },
      { time: 3170, duration: 140, strength: .68 }
    ];
    const cuts = [[2535, 2575], [2820, 2890], [5050, 5090], [5205, 5275]];
    const clamp = (n, low = 0, high = 1) => Math.min(high, Math.max(low, n));
    const hash = n => { const value = Math.sin(n * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value); };
    for (let i = 0; i < word.length; i++) {
      const cell = document.createElement('span');
      cell.textContent = braille[i]; cell.dataset.resolved = 'false'; data.append(cell);
    }
    const copies = [...screen.querySelectorAll('[data-system-ghost], [data-system-response]')];
    for (const layer of copies) {
      layer.innerHTML = primary.innerHTML;
      layer.querySelector('[data-system-data]').removeAttribute('data-system-data');
    }
    const characterRows = [data, ...copies.map(layer => layer.querySelector('.system-access__data'))];
    for (const char of 'ACCESS GRANTED') {
      const cell = document.createElement('span'); cell.textContent = char === ' ' ? '\u00a0' : char; grant.append(cell);
    }
    const grantCopies = [...screen.querySelectorAll('[data-grant-copy]')];
    for (const layer of grantCopies) {
      const duplicate = grant.cloneNode(true); duplicate.removeAttribute('data-system-grant'); layer.append(duplicate);
    }
    const grantLetters = [...grant.children];
    const bands = screen.querySelector('.signal-bands');
    for (let i = 0; i < 22; i++) {
      const line = document.createElement('i');
      line.style.setProperty('--band-y', `${25 + hash(i + 3) * 45}%`);
      line.style.setProperty('--band-width', `${14 + hash(i + 12) * 29}%`);
      line.style.setProperty('--band-height', `${[1, 2, 1, 4, 1, 2][i % 6]}px`);
      line.style.setProperty('--band-x', `${-45 - hash(i + 8) * 75}%`);
      line.style.setProperty('--band-opacity', (.1 + hash(i + 21) * .55).toFixed(3));
      bands.append(line);
    }
    const grain = screen.querySelector('.system-access__scan-grain');
    for (let i = 0; i < 72; i++) {
      const shard = document.createElement('i');
      shard.style.setProperty('--shard-top', `${hash(i + 1) * 100}%`);
      shard.style.setProperty('--shard-x', `${30 + hash(i + 4) * 100}px`);
      shard.style.setProperty('--shard-width', `${22 + hash(i + 9) * 168}px`);
      shard.style.setProperty('--shard-height', `${i % 7 === 0 ? 5 : i % 3 === 0 ? 2 : 1}px`);
      shard.style.setProperty('--shard-alpha', (.12 + hash(i + 14) * .66).toFixed(3));
      grain.append(shard);
    }
    const fractures = [...screen.querySelectorAll('.system-access__fractures i')];
    fractures.forEach((line, i) => {
      line.style.setProperty('--fracture-width', `${[1, 2, 4, 1, 2][i]}px`);
      line.style.setProperty('--fracture-height', `${[20, 70, 100, 36, 58][i]}vh`);
      line.style.setProperty('--fracture-top', `${[28, 9, 0, 49, 14][i]}%`);
    });
    let logoBox, fieldBox, grantCenters = [];
    let started = false, complete = false, reduced = motion.matches;
    let startedAt = 0, frame = 0, deadline = 0, visualTime = 0;
    let lastTextureTick = -1, lastData = '', mobile = false;
    const effects = ['is-scanning', 'is-unlocking', 'is-reading', 'is-corrupt', 'is-overload', 'is-signal-cut', 'is-grant-corrupt', 'is-flashing', 'is-start-flicker', 'is-edge-left', 'is-edge-right'];
    const set = (name, value) => screen.style.setProperty(name, String(value));
    const measure = () => {
      logoBox = logo.getBoundingClientRect(); fieldBox = field.getBoundingClientRect();
      mobile = window.innerWidth <= 760;
      grantCenters = grantLetters.map(letter => { const box = letter.getBoundingClientRect(); return box.left + box.width / 2; });
    };
    const setState = state => {
      if (screen.dataset.state === state) return;
      screen.dataset.state = state;
      if (state === 'granted') status.textContent = 'ACCESS GRANTED';
    };
    const translateData = (t, corruption = 0) => {
      let regressionIndex = -1;
      for (const event of regressions) {
        if (!event.seen && t >= event.time) {
          event.seen = true;
          if (t < event.time + 70) regressionIndex = event.index;
        }
      }
      const values = [], resolvedCells = [];
      const tick = Math.floor(t / 43);
      for (let i = 0; i < word.length; i++) {
        const damaged = t >= 4000 && corruption > .35 && hash(tick + i * 3) < corruption * .82;
        const resolved = t >= resolveAt[i] && i !== regressionIndex && !damaged;
        const glyph = resolved ? word[i] : braille[t < 2400 ? i : (i + tick) % braille.length];
        values.push(glyph); resolvedCells.push(resolved);
      }
      const key = values.join('');
      if (lastData === key) return;
      lastData = key;
      for (const row of characterRows) for (let i = 0; i < word.length; i++) {
        row.children[i].textContent = values[i]; row.children[i].dataset.resolved = String(resolvedCells[i]);
      }
    };
    const texture = (t, intensity) => {
      const tick = Math.floor(t / 47);
      if (tick === lastTextureTick) return;
      lastTextureTick = tick;
      set('--grain-shift', `${(hash(tick) - .5) * 26 * intensity}px`);
      set('--lag', `${(-9 - hash(tick + 8) * 21) * (mobile ? .6 : 1)}px`);
      const fluctuation = .72 + hash(tick + 2) * .56;
      set('--beam-width', `${1.3 + intensity * 1.7 * fluctuation}px`);
      set('--silver-width', `${(8 + 10 * intensity * fluctuation) * (mobile ? .72 : 1)}px`);
      set('--reflection-width', `${(30 + 40 * intensity) * (mobile ? .64 : 1)}px`);
      fractures.forEach((line, i) => {
        line.style.setProperty('--fracture-x', `${(i % 2 ? -1 : 1) * (14 + hash(tick + i * 4) * 68) * (mobile ? .48 : 1)}px`);
        line.style.setProperty('--fracture-alpha', String(hash(tick + i + 20) > .37 ? .2 + hash(tick + i) * .7 : 0));
      });
    };
    const finishVisuals = (focusHome = true) => {
      if (complete) return;
      complete = true; window.clearTimeout(deadline); window.cancelAnimationFrame(frame);
      try { sessionStorage.setItem(sessionKey, 'granted'); } catch { /* Fail open. */ }
      screen.hidden = true; screen.dataset.state = 'complete'; screen.classList.remove(...effects);
      main.inert = false; root.classList.remove('system-access-open');
      document.removeEventListener('keydown', escape); motion.removeEventListener('change', changeMotion); window.removeEventListener('resize', measure);
      document.dispatchEvent(new Event('frsr:system-access-complete'));
      if (focusHome) document.querySelector('[data-home-menu-toggle]')?.focus({ preventScroll: true });
    };
    const render = t => {
      const scanning = t >= 4000 && t < 6300;
      const unlocking = t >= 7000 && t < 8700;
      const peak = t >= 5020 && t < 5420;
      const cut = cuts.some(([start, end]) => t >= start && t < end);
      const x = scanning ? (-.1 + (t - 4000) / 2300 * 1.2) * innerWidth
        : unlocking ? (-.1 + Math.min(1, (t - 7000) / 1350) * .6) * innerWidth : -300;
      const distance = Math.abs(x - (logoBox.left + logoBox.width / 2));
      const intersection = scanning ? clamp(1 - distance / (logoBox.width * .85)) : 0;
      const event = bursts.find(burst => t >= burst.time && t < burst.time + burst.duration);
      let corruption = event?.strength || 0;
      if (scanning && t < 5420) {
        const pulse = Math.floor(t / 73) % 4 !== 0;
        corruption = Math.max(corruption, peak ? Math.max(.86, intersection) : intersection * (pulse ? .78 : .2));
      }
      const grantIntersection = unlocking ? clamp(1 - Math.abs(x - innerWidth / 2) / (mobile ? 140 : 250)) : 0;
      const grantBuild = unlocking ? clamp((t - 7900) / 800) : 0;
      const grantCorruption = grantIntersection * grantBuild;
      const damage = Math.max(corruption, grantCorruption);
      const exposure = peak ? (.7 + .3 * hash(Math.floor(t / 31))) : unlocking ? Math.pow(grantBuild, 3) : corruption * .24;
      const intensity = scanning ? .45 + intersection * .55 : unlocking ? .7 + grantBuild * .3 : 0;
      const spike = (t >= 5020 && t < 5040) || (t >= 5120 && t < 5150);
      const displacement = (mobile ? 43 : 88) * damage * (hash(Math.floor(t / 41)) > .5 ? 1 : -.86);
      set('--corruption', corruption.toFixed(3)); set('--grant-corruption', grantCorruption.toFixed(3));
      set('--signal-displacement', `${displacement.toFixed(2)}px`);
      set('--slice-opacity', corruption > .06 ? Math.min(1, .55 + corruption * .55) : 0);
      set('--signal-scale', (1 + damage * 3).toFixed(3)); set('--smear', damage.toFixed(3));
      set('--smear-blur', `${(2 + damage * 8).toFixed(2)}px`);
      set('--signal-exposure', cut ? 0 : (spike ? 1 : exposure).toFixed(3));
      set('--scan-intensity', intensity.toFixed(3));
      set('--bloom-width', `${(120 + 130 * intensity) * (mobile ? .58 : 1)}px`);
      set('--beam-scale', (1 + Math.max(corruption, grantBuild) * 1.3).toFixed(3));
      set('--exposure-scale', (1 + (unlocking ? Math.pow(grantBuild, 6) * (mobile ? 3.2 : 4) : corruption * .5)).toFixed(3));
      set('--fracture-opacity', peak ? 1 : unlocking ? grantBuild : corruption * .65);
      set('--scan-x', `${x}px`);
      field.style.setProperty('--field-beam-x', `${scanning ? x - fieldBox.left : fieldBox.width * .5}px`);
      const localX = x - logoBox.left;
      logo.style.setProperty('--read-left', `${Math.max(0, localX - 46)}px`);
      logo.style.setProperty('--read-right', `${Math.max(0, logoBox.width - localX - 46)}px`);
      screen.classList.toggle('is-scanning', scanning); screen.classList.toggle('is-unlocking', unlocking);
      screen.classList.toggle('is-corrupt', corruption > .06); screen.classList.toggle('is-overload', corruption > .84);
      screen.classList.toggle('is-reading', intersection > 0);
      screen.classList.toggle('is-grant-corrupt', grantCorruption > .15);
      screen.classList.toggle('is-signal-cut', cut);
      screen.classList.toggle('is-flashing', t >= 8700 && t < 8820);
      screen.classList.toggle('is-start-flicker', t >= 400 && t < 440);
      screen.classList.toggle('is-edge-left', t >= 3700 && t < 4100);
      screen.classList.toggle('is-edge-right', t >= 6090 && t < 6290);
      if (scanning || unlocking || damage > 0) texture(t, Math.max(intensity, damage));
      grantLetters.forEach((letter, i) => letter.classList.toggle('is-lit', unlocking && Math.abs(grantCenters[i] - x) < 35 + exposure * 80));
      translateData(t, corruption);
      if (t < 600) setState('boot');
      else if (t < 6500) setState('active');
      else if (t < 6800) setState('quiet');
      else if (t < 8820) setState('granted');
      else setState('black');
    };
    const animate = now => {
      if (complete) return;
      const wallTime = now - startedAt;
      if (wallTime >= (reduced ? 2000 : 9100)) { finishVisuals(); return; }
      if (reduced) { if (wallTime >= 950) setState('granted'); }
      else {
        // Keep the early visual clock near the recording without allowing buffering to extend entry.
        const voiceTime = audio.currentTime * 1000;
        const clock = wallTime < 6300 && voiceTime > 0 ? Math.min(wallTime, Math.max(wallTime - 100, voiceTime)) : wallTime;
        visualTime = Math.max(visualTime, clock); render(visualTime);
      }
      frame = requestAnimationFrame(animate);
    };
    const unavailable = () => { audioControls.hidden = true; if (!complete) sound.textContent = 'AUDIO UNAVAILABLE'; };
    const start = event => {
      if (started || complete) return;
      started = true; startedAt = performance.now(); measure();
      initialize.hidden = true; skip.hidden = false; setState(reduced ? 'active' : 'boot');
      status.textContent = 'ACCESS REQUESTED'; request.textContent = request.dataset.echo = 'ACCESS REQUESTED'; sound.textContent = 'AUDIO ACTIVE';
      audioControls.hidden = false;
      // Exactly one gesture-initiated play call; every visual cut leaves the player untouched.
      try { audio.play().catch(unavailable); } catch { unavailable(); }
      if (reduced) translateData(6000);
      if (event.detail === 0) skip.focus({ preventScroll: true });
      frame = requestAnimationFrame(animate); deadline = setTimeout(() => finishVisuals(), reduced ? 2000 : 9100);
    };
    const escape = event => { if (event.key === 'Escape') { event.preventDefault(); finishVisuals(); } };
    const changeMotion = () => {
      reduced = motion.matches;
      if (!reduced || !started || complete) return;
      screen.classList.remove(...effects);
      ['--corruption', '--signal-exposure', '--grant-corruption', '--smear'].forEach(name => set(name, 0));
      translateData(6000); grantLetters.forEach(letter => letter.classList.remove('is-lit')); setState('granted');
      cancelAnimationFrame(frame); clearTimeout(deadline);
      deadline = setTimeout(() => finishVisuals(), Math.max(0, Math.min(700, 9100 - (performance.now() - startedAt))));
    };
    initialize.addEventListener('click', start); skip.addEventListener('click', () => finishVisuals());
    audio.addEventListener('error', unavailable);
    audio.addEventListener('playing', () => { if (!complete) sound.textContent = 'AUDIO ACTIVE'; });
    audio.addEventListener('ended', () => { if (!complete) sound.textContent = 'AUDIO COMPLETE'; });
    document.addEventListener('keydown', escape); motion.addEventListener('change', changeMotion); window.addEventListener('resize', measure);
    window.addEventListener('pagehide', () => { if (started) finishVisuals(false); });
    window.addEventListener('pageshow', event => { if (event.persisted && started) finishVisuals(false); });
    main.inert = true; screen.hidden = false; initialize.focus({ preventScroll: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
