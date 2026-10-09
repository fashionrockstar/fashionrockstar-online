(() => {
  'use strict';

  const video = document.querySelector('[data-hero-video]');
  if (video) {
    const brand = video.closest('.hero__brand');
    const imageLoop = document.querySelector('[data-hero-motion-fallback]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 760px), (hover: none) and (pointer: coarse)');
    const root = document.documentElement;
    let useImageLoop = mobile.matches && !!imageLoop;
    let imageFailed = false;
    let pauseTimer = 0;
    const canRun = () => !reducedMotion.matches && !document.hidden && !root.classList.contains('entry-loading');
    const showFallback = () => {
      brand.classList.remove('is-playing', 'is-motion-fallback');
      brand.classList.add('is-fallback');
      imageLoop?.removeAttribute('src');
    };
    const showImageLoop = () => {
      if (!canRun()) return;
      useImageLoop = true;
      video.pause();
      if (!imageLoop || imageFailed) { showFallback(); return; }
      // Assign once, after entry. Repeated visibility/pageshow events must not restart the loop.
      if (!imageLoop.hasAttribute('src')) imageLoop.src = imageLoop.dataset.src;
      brand.classList.remove('is-playing', 'is-fallback');
      brand.classList.add('is-motion-fallback');
    };
    const syncPlayback = () => {
      if (!canRun()) {
        video.pause();
        if (reducedMotion.matches) showFallback();
        return;
      }
      if (useImageLoop) { showImageLoop(); return; }
      brand.classList.remove('is-fallback');
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch(error => {
        if (canRun() && error.name !== 'AbortError') showImageLoop();
      });
    };
    video.addEventListener('playing', () => {
      if (!canRun() || useImageLoop) { syncPlayback(); return; }
      brand.classList.remove('is-fallback', 'is-motion-fallback');
      brand.classList.add('is-playing');
    });
    // A native player may pause after app switching or a power-policy change.
    video.addEventListener('pause', () => {
      clearTimeout(pauseTimer);
      if (useImageLoop || !canRun()) return;
      pauseTimer = setTimeout(() => { if (canRun() && video.paused) showImageLoop(); }, 250);
    });
    video.addEventListener('ended', () => { if (canRun()) showImageLoop(); });
    video.addEventListener('error', showImageLoop);
    video.querySelector('source')?.addEventListener('error', showImageLoop);
    imageLoop?.addEventListener('error', () => { imageFailed = true; showFallback(); });
    if (root.classList.contains('entry-loading')) {
      const entryObserver = new MutationObserver(() => {
        if (!root.classList.contains('entry-loading')) {
          entryObserver.disconnect();
          syncPlayback();
        }
      });
      entryObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
    }
    mobile.addEventListener('change', () => { if (mobile.matches && imageLoop) useImageLoop = true; syncPlayback(); });
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
