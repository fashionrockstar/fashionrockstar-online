(() => {
  'use strict';

  const video = document.querySelector('[data-hero-video]');
  if (video) {
    const brand = video.closest('.hero__brand');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;

    const showFallback = () => {
      brand.classList.remove('is-playing');
      brand.classList.add('is-fallback');
    };
    const syncPlayback = () => {
      if (reducedMotion.matches || document.hidden || root.classList.contains('entry-loading')) {
        video.pause();
        if (reducedMotion.matches) showFallback();
        return;
      }
      brand.classList.remove('is-fallback');
      video.muted = true;
      video.play().catch((error) => {
        // Pausing an in-flight play request is not a playback failure.
        if (error.name !== 'AbortError') showFallback();
      });
    };

    video.addEventListener('playing', () => {
      if (reducedMotion.matches || root.classList.contains('entry-loading')) return syncPlayback();
      brand.classList.remove('is-fallback');
      brand.classList.add('is-playing');
    });
    // Keep the opening movement at frame zero until the loading overlay is gone.
    // Observing the class also handles Escape, reduced motion and fail-open.
    if (root.classList.contains('entry-loading')) {
      const entryObserver = new MutationObserver(() => {
        if (!root.classList.contains('entry-loading')) {
          entryObserver.disconnect();
          syncPlayback();
        }
      });
      entryObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
    }
    video.addEventListener('error', showFallback);
    video.querySelector('source').addEventListener('error', showFallback);
    reducedMotion.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    window.addEventListener('pageshow', syncPlayback);
    syncPlayback();
  }

  const exploreLinks = document.querySelectorAll('.home-menu__links a[href]');

  exploreLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const isTouchNavigation = window.matchMedia('(hover: none), (pointer: coarse)').matches;
      const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

      if (!isTouchNavigation || isModifiedClick || event.button !== 0 || link.classList.contains('is-activating')) return;

      event.preventDefault();
      link.classList.add('is-activating');

      window.setTimeout(() => {
        window.location.assign(link.href);
      }, 260);
    });
  });

})();
