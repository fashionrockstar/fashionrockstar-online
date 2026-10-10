(() => {
  'use strict';

  const video = document.querySelector('[data-hero-video]');
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const entry = document.querySelector('[data-entry-loader]');
  const rememberEntry = () => {
    if (entry && !root.classList.contains('entry-loading')) {
      try { sessionStorage.setItem('frsrSimpleEntryV1', 'seen'); } catch { /* Entry remains fail-open. */ }
    }
  };
  rememberEntry();
  if (video) {
    const brand = video.closest('.hero__brand');
    let pageActive = true;
    let playPending = false;
    let playAttempt = 0;
    let playTimer = 0;
    let autoplayBlocked = false;
    let preparing = false;
    let readyTimer = 0;
    let frameTimer = 0;
    let videoFrame = 0;
    let entryReadyTimer = 0;
    // Fresh internal returns resume the same approved loop; bfcache keeps its player.
    const returnTime = window.FRSRMotion?.homeTime;
    const resumeReturn = () => {
      if (Number.isFinite(returnTime) && returnTime > 0 && Number.isFinite(video.duration) && video.duration > 0) video.currentTime = returnTime % video.duration;
    };
    if (video.readyState >= 1) resumeReturn();
    else video.addEventListener('loadedmetadata', resumeReturn, { once: true });
    const announceReady = () => {
      clearTimeout(readyTimer);
      readyTimer = 0;
      brand.classList.add('is-ready');
      document.dispatchEvent(new CustomEvent('frsr:hero-ready'));
    };
    const showFallback = () => {
      brand.classList.remove('is-playing');
      brand.classList.add('is-fallback');
      // The original loader aligns to the video or the approved still fallback.
      // Keep that exact handoff aligned if decoding fails during the loader.
      const loader = document.querySelector('[data-entry-loader]');
      if (root.classList.contains('entry-loading') && loader) {
        const box = brand.querySelector('.hero__fallback').getBoundingClientRect();
        loader.style.setProperty('--entry-mark-width', `${box.width}px`);
        loader.style.setProperty('--entry-mark-left', `${box.left + box.width / 2}px`);
        loader.style.setProperty('--entry-mark-top', `${box.top + box.height / 2}px`);
      }
      announceReady();
    };
    const canRun = () => pageActive && !reducedMotion.matches && !document.hidden
      && (preparing || !root.classList.contains('biometric-access-open')
        || root.classList.contains('biometric-access-revealing'));
    const revealVideo = () => {
      if (!canRun() || video.paused || video.readyState < 2) return;
      clearTimeout(frameTimer);
      brand.classList.remove('is-fallback');
      brand.classList.add('is-playing');
      autoplayBlocked = false;
      announceReady();
    };
    const onPlaying = () => {
      if (!canRun()) return video.pause();
      if (video.requestVideoFrameCallback) {
        if (videoFrame) video.cancelVideoFrameCallback?.(videoFrame);
        videoFrame = video.requestVideoFrameCallback(() => { videoFrame = 0; revealVideo(); });
        // Hidden-stage compositors can suspend callbacks despite a decoded frame.
        clearTimeout(frameTimer);
        frameTimer = setTimeout(revealVideo, 180);
      } else revealVideo();
    };
    const syncPlayback = () => {
      if (!canRun()) {
        playAttempt += 1;
        playPending = false;
        clearTimeout(playTimer);
        video.pause();
        if (reducedMotion.matches) showFallback();
        return;
      }
      // Respect policy rejections; retry only on a later visibility/return event.
      if (playPending || autoplayBlocked) return;
      video.muted = true;
      video.defaultMuted = true;
      if (!video.paused && video.readyState >= 2) {
        if (!brand.classList.contains('is-playing')) onPlaying();
        return;
      }
      playPending = true;
      const attempt = ++playAttempt;
      clearTimeout(playTimer);
      playTimer = setTimeout(() => {
        if (attempt !== playAttempt || !playPending || !canRun()) return;
        if (!video.paused && video.readyState >= 2) {
          playPending = false;
          return;
        }
        // Some browsers leave play() pending when every <source> fails.
        playAttempt += 1;
        playPending = false;
        autoplayBlocked = true;
        video.pause();
        showFallback();
      }, 8000);
      video.play().then(() => {
        if (attempt !== playAttempt) return;
        if (!video.paused && video.readyState >= 2 && !brand.classList.contains('is-playing')) onPlaying();
      }).catch(error => {
        if (attempt !== playAttempt) return;
        if (canRun() && error.name !== 'AbortError') {
          autoplayBlocked = true;
          showFallback();
        }
      }).finally(() => {
        if (attempt !== playAttempt) return;
        clearTimeout(playTimer);
        playPending = false;
      });
      if (!brand.classList.contains('is-ready') && !readyTimer) {
        readyTimer = setTimeout(() => {
          readyTimer = 0;
          if (canRun() && (video.paused || video.readyState < 2)) showFallback();
        }, 8000);
      }
    };
    video.addEventListener('playing', onPlaying);
    video.addEventListener('canplay', () => syncPlayback());
    video.addEventListener('pause', () => {
      // Safari can stop inline playback when it leaves view or policy changes.
      if (canRun() && !playPending && brand.classList.contains('is-playing')) {
        showFallback();
      }
    });
    video.addEventListener('error', () => { autoplayBlocked = true; showFallback(); });
    document.addEventListener('frsr:biometric-access-prepare', () => { preparing = true; syncPlayback(); });
    document.addEventListener('frsr:biometric-access-complete', () => { preparing = false; syncPlayback(); });
    document.addEventListener('frsr:hero-fallback', () => showFallback());
    if (root.classList.contains('entry-loading')) {
      // Put a real frame or the original still beneath the loader before its fade.
      entryReadyTimer = setTimeout(() => {
        if (!brand.classList.contains('is-ready')) showFallback();
      }, 2450);
    }
    new MutationObserver(() => { rememberEntry(); syncPlayback(); }).observe(root, { attributes: true, attributeFilter: ['class'] });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting) && video.paused) syncPlayback();
      }, { threshold: .2 }).observe(video);
    }
    const resumePlayback = () => { autoplayBlocked = false; syncPlayback(); };
    reducedMotion.addEventListener('change', resumePlayback);
    document.addEventListener('visibilitychange', resumePlayback);
    window.addEventListener('pageshow', () => { pageActive = true; resumePlayback(); });
    window.addEventListener('pagehide', () => {
      pageActive = false;
      playAttempt += 1;
      playPending = false;
      clearTimeout(playTimer);
      clearTimeout(readyTimer);
      clearTimeout(frameTimer);
      clearTimeout(entryReadyTimer);
      readyTimer = 0;
      if (videoFrame) video.cancelVideoFrameCallback?.(videoFrame);
      videoFrame = 0;
      video.pause();
    });
    syncPlayback();
  }

  let navigationTimer = 0;
  const links = [...document.querySelectorAll('.home-menu__links a[href]')];
  links.forEach(link => {
    link.addEventListener('click', event => {
      const touch = matchMedia('(hover: none), (pointer: coarse)').matches;
      if (!touch || event.detail === 0 || reducedMotion.matches || event.metaKey || event.ctrlKey || event.shiftKey
        || event.altKey || event.button !== 0 || event.defaultPrevented) return;
      event.preventDefault();
      clearTimeout(navigationTimer);
      links.forEach(row => row.classList.remove('is-activating'));
      link.classList.add('is-activating');
      navigationTimer = setTimeout(() => location.assign(link.href), 160);
    });
  });
  window.addEventListener('pagehide', () => clearTimeout(navigationTimer));
  const cue = document.querySelector('.scroll-cue');
  cue?.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const explore = document.querySelector(cue.getAttribute('href'));
    if (!explore) return;
    event.preventDefault();
    if (location.hash !== '#explore') history.pushState(null, '', '#explore');
    explore.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  });

})();
