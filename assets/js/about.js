(() => {
  'use strict';

  const init = () => {
    const body = document.querySelector('.about-body');
    if (!body) return;

    const opening = document.querySelector('#about-opening');
    const stage = opening && opening.querySelector('.about-opening__stage');
    const identity = document.querySelector('#about-identity');
    const reveals = Array.from(body.querySelectorAll('[data-about-reveal]'));
    const desktop = window.matchMedia('(min-width: 901px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer = null;
    let pendingFrame = 0;
    let lastProgress = null;
    let openingExit = null;

    const show = (element) => {
      element.classList.add('is-visible');
      if (observer) observer.unobserve(element);
    };

    const showInViewport = () => {
      reveals.forEach((element) => {
        if (element.classList.contains('is-visible')) return;
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) show(element);
      });
    };

    const resetIdentity = () => {
      if (identity) {
        identity.style.removeProperty('transform');
        identity.style.removeProperty('opacity');
      }
      lastProgress = null;
      openingExit = null;
    };

    const syncOpening = () => {
      pendingFrame = 0;
      if (!opening || !stage || !identity || !desktop.matches || reducedMotion.matches) {
        resetIdentity();
        return;
      }

      // Once the opening has left, normal reading needs no further style writes.
      if (lastProgress === 1 && openingExit !== null && window.scrollY >= openingExit) return;

      const rect = opening.getBoundingClientRect();
      const travel = Math.max(opening.offsetHeight - stage.offsetHeight, 1);
      const progress = Math.round(Math.min(Math.max(-rect.top / travel, 0), 1) * 10000) / 10000;
      openingExit = window.scrollY + rect.top + travel;
      if (progress === lastProgress) return;

      identity.style.transform = `translateX(${-105 * progress}%)`;
      identity.style.opacity = String(1 - 0.45 * progress);
      lastProgress = progress;
    };

    const scheduleOpening = () => {
      if (!pendingFrame && !document.hidden) {
        pendingFrame = window.requestAnimationFrame(syncOpening);
      }
    };

    const configureReveals = () => {
      if (observer) observer.disconnect();
      observer = null;
      body.classList.remove('about-motion');

      if (reducedMotion.matches || !('IntersectionObserver' in window)) {
        reveals.forEach(show);
        return;
      }

      try {
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) show(entry.target);
          });
        }, {
          // The zero threshold also lets very tall text blocks reveal safely.
          threshold: [0, 0.12],
          rootMargin: '0px 0px -4% 0px'
        });

        // A restored scroll position must never start with hidden visible text.
        showInViewport();
        reveals.forEach((element) => {
          if (!element.classList.contains('is-visible')) observer.observe(element);
        });
        body.classList.add('about-motion');
      } catch (error) {
        if (observer) observer.disconnect();
        observer = null;
        body.classList.remove('about-motion');
        reveals.forEach(show);
      }
    };

    const configureMotion = () => {
      body.classList.toggle('about-reduced-motion', reducedMotion.matches);
      resetIdentity();
      configureReveals();
      scheduleOpening();
    };

    const onMediaChange = (query, listener) => {
      if (query.addEventListener) query.addEventListener('change', listener);
      else query.addListener(listener);
    };

    window.addEventListener('scroll', scheduleOpening, { passive: true });
    window.addEventListener('resize', () => {
      lastProgress = null;
      openingExit = null;
      showInViewport();
      scheduleOpening();
    }, { passive: true });

    window.addEventListener('pageshow', () => {
      lastProgress = null;
      openingExit = null;
      showInViewport();
      scheduleOpening();
    });

    window.addEventListener('pagehide', () => {
      if (pendingFrame) window.cancelAnimationFrame(pendingFrame);
      pendingFrame = 0;
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        showInViewport();
        scheduleOpening();
      }
    });

    body.addEventListener('focusin', (event) => {
      const target = event.target.closest('[data-about-reveal]');
      if (target) show(target);
    });

    onMediaChange(desktop, () => {
      resetIdentity();
      scheduleOpening();
    });
    onMediaChange(reducedMotion, configureMotion);
    configureMotion();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
