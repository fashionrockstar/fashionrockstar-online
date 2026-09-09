(() => {
  'use strict';

  const video = document.querySelector('[data-hero-video]');
  const videoToggle = document.querySelector('[data-hero-video-toggle]');
  if (video && videoToggle) {
    const brand = video.closest('.hero__brand');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let userPaused = false;

    const showFallback = () => {
      brand.classList.remove('is-playing');
      videoToggle.hidden = true;
    };
    const updateVideoControl = () => {
      videoToggle.textContent = userPaused ? 'PLAY' : 'PAUSE';
      videoToggle.setAttribute('aria-label', `${userPaused ? 'Play' : 'Pause'} logo animation`);
    };
    const syncPlayback = () => {
      if (reducedMotion.matches || document.hidden || userPaused) {
        video.pause();
        if (reducedMotion.matches) showFallback();
        return;
      }
      video.muted = true;
      video.play().catch(showFallback);
    };

    video.addEventListener('playing', () => {
      if (reducedMotion.matches) return syncPlayback();
      brand.classList.add('is-playing');
      videoToggle.hidden = false;
      updateVideoControl();
    });
    video.addEventListener('error', showFallback);
    video.querySelector('source').addEventListener('error', showFallback);
    videoToggle.addEventListener('click', () => {
      userPaused = !userPaused;
      updateVideoControl();
      syncPlayback();
    });
    reducedMotion.addEventListener('change', syncPlayback);
    document.addEventListener('visibilitychange', syncPlayback);
    window.addEventListener('pageshow', syncPlayback);
    syncPlayback();
  }

  const toggle = document.querySelector('[data-home-menu-toggle]');
  const panel = document.querySelector('#home-navigation');
  if (!toggle || !panel) return;

  const close = panel.querySelector('[data-home-menu-close]');
  const submenuToggle = panel.querySelector('.home-submenu-control');
  const submenu = panel.querySelector('#home-work-disciplines');
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

  const setSubmenu = (expanded) => {
    submenuToggle.setAttribute('aria-expanded', String(expanded));
    submenuToggle.setAttribute('aria-label', `${expanded ? 'Collapse' : 'Expand'} Selected Work disciplines`);
    submenuToggle.firstElementChild.textContent = expanded ? '−' : '+';
    submenu.hidden = !expanded;
  };

  toggle.addEventListener('click', () => {
    panel.showModal();
    document.documentElement.classList.add('home-nav-open');
    toggle.setAttribute('aria-expanded', 'true');
  });

  close.addEventListener('click', () => panel.close());

  // Native dialog supplies an inert background and Escape dismissal.
  panel.addEventListener('close', () => {
    document.documentElement.classList.remove('home-nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    setSubmenu(false);
    toggle.focus({ preventScroll: true });
  });

  submenuToggle.addEventListener('click', () => {
    setSubmenu(submenuToggle.getAttribute('aria-expanded') !== 'true');
  });

  panel.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const targets = [...panel.querySelectorAll('a[href], button:not([disabled])')]
      .filter((element) => element.getClientRects().length > 0);
    const first = targets[0];
    const last = targets[targets.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Restore a closed menu when returning through the browser's page cache.
  window.addEventListener('pageshow', () => {
    if (panel.open) panel.close();
  });
})();
