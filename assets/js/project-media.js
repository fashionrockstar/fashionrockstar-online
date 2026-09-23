(() => {
  'use strict';
  const covers = [...document.querySelectorAll('[data-cover-video]')];
  const films = [...document.querySelectorAll('[data-project-video]')];
  const automaticFilms = films.filter(video => video.hasAttribute('data-autoplay-video'));
  const automatic = [...covers, ...automaticFilms];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  const manuallyPaused = new WeakSet();
  const controllerPaused = new WeakSet();
  const pause = video => {
    if (!video.paused) {
      controllerPaused.add(video);
      video.pause();
    }
  };
  const load = video => {
    if (!video.hasAttribute('src')) {
      video.src = video.dataset.src;
      video.load();
    }
  };
  const update = () => automatic.forEach(video => {
    const shouldPlay = visible.has(video) && !document.hidden && !reducedMotion.matches && !video.closest('[hidden]') && !manuallyPaused.has(video);
    if (video.hasAttribute('data-autoplay-video')) video.autoplay = shouldPlay;
    if (!shouldPlay) { pause(video); return; }
    load(video);
    video.play().catch(() => {}); // The poster stays available if autoplay is blocked.
  });
  covers.forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
  });
  automaticFilms.forEach(video => {
    const updateLabel = () => {
      if (!video.controls) video.setAttribute('aria-label', video.paused ? 'Play project film' : 'Pause project film');
    };
    video.addEventListener('pause', () => {
      updateLabel();
      if (controllerPaused.delete(video)) return;
      manuallyPaused.add(video);
    });
    video.addEventListener('play', () => {
      manuallyPaused.delete(video);
      updateLabel();
    });
    if (!video.controls) {
      // Keep pause/play available without displaying a player toolbar.
      video.tabIndex = 0;
      video.setAttribute('role', 'button');
      updateLabel();
      const toggle = () => video.paused ? video.play().catch(() => {}) : video.pause();
      video.addEventListener('click', toggle);
      video.addEventListener('keydown', event => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          toggle();
        }
      });
    }
  });
  if ('IntersectionObserver' in window) {
    const coverObserver = new IntersectionObserver(entries => {
      entries.forEach(({target, isIntersecting}) => isIntersecting ? visible.add(target) : visible.delete(target));
      update();
    }, {threshold: 0.05});
    automatic.forEach(video => coverObserver.observe(video));
  }
  // Autoplay films start muted while visible; optional controls remain project-specific.
  // Without IntersectionObserver posters and manual play/pause remain available.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) films.forEach(pause);
    update();
  });
  reducedMotion.addEventListener('change', update);
  const gallery = document.querySelector('[data-work-gallery]');
  if (gallery) new MutationObserver(update).observe(gallery, {subtree: true, attributes: true, attributeFilter: ['hidden']});
})();
