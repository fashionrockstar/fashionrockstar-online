(() => {
  'use strict';

  const video = document.querySelector('[data-hero-video]');
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (video) {
    const brand = video.closest('.hero__brand');
    let preparing = false;
    let readyTimer = 0;
    let frameTimer = 0;
    let videoFrame = 0;
    const announceReady = () => {
      clearTimeout(readyTimer);
      readyTimer = 0;
      brand.classList.add('is-ready');
      document.dispatchEvent(new CustomEvent('frsr:hero-ready'));
    };
    const showFallback = () => {
      brand.classList.remove('is-playing');
      brand.classList.add('is-fallback');
      announceReady();
    };
    const canRun = () => !reducedMotion.matches && !document.hidden
      && (preparing || !root.classList.contains('biometric-access-open')
        || root.classList.contains('biometric-access-revealing'));
    const revealVideo = () => {
      if (!canRun() || video.paused || video.readyState < 2) return;
      clearTimeout(frameTimer);
      brand.classList.remove('is-fallback');
      brand.classList.add('is-playing');
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
        video.pause();
        if (reducedMotion.matches) showFallback();
        return;
      }
      video.muted = true;
      video.defaultMuted = true;
      video.play().then(() => {
        if (!video.paused && video.readyState >= 2 && !brand.classList.contains('is-playing')) onPlaying();
      }).catch(error => {
        if (canRun() && error.name !== 'AbortError') showFallback();
      });
      if (!brand.classList.contains('is-ready') && !readyTimer) {
        readyTimer = setTimeout(() => {
          readyTimer = 0;
          if (canRun() && (video.paused || video.readyState < 2)) showFallback();
        }, 8000);
      }
    };
    video.addEventListener('playing', onPlaying);
    video.addEventListener('canplay', syncPlayback);
    video.addEventListener('error', showFallback);
    video.querySelector('source')?.addEventListener('error', showFallback);
    document.addEventListener('frsr:biometric-access-prepare', () => { preparing = true; syncPlayback(); });
    document.addEventListener('frsr:biometric-access-complete', () => { preparing = false; syncPlayback(); });
    document.addEventListener('frsr:hero-fallback', showFallback);
    new MutationObserver(syncPlayback).observe(root, { attributes: true, attributeFilter: ['class'] });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting) && video.paused) syncPlayback();
      }, { threshold: .2 }).observe(video);
    }
    reducedMotion.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    window.addEventListener('pageshow', syncPlayback);
    window.addEventListener('pagehide', () => {
      clearTimeout(readyTimer);
      clearTimeout(frameTimer);
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
