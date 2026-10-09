(() => {
  'use strict';

  const toggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');
  const mobileNavigation = window.matchMedia('(max-width: 760px)');
  const submenuToggle = document.querySelector('.site-submenu-toggle');
  const submenu = document.querySelector('#site-work-disciplines');

  const setSubmenu = (expanded) => {
    if (!submenuToggle || !submenu) return;
    submenuToggle.setAttribute('aria-expanded', String(expanded));
    submenuToggle.setAttribute('aria-label', `${expanded ? 'Collapse' : 'Expand'} Selected Work disciplines`);
    submenuToggle.firstElementChild.textContent = expanded ? '−' : '+';
    submenu.hidden = !expanded;
  };

  const closeMenu = () => {
    if (!toggle || !siteNav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'MENU';
    siteNav.classList.remove('is-open');
    siteNav.inert = mobileNavigation.matches;
    setSubmenu(false);
  };

  if (toggle && siteNav) {
    closeMenu();
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.textContent = isOpen ? 'MENU' : 'CLOSE';
      siteNav.classList.toggle('is-open', !isOpen);
      siteNav.inert = isOpen && mobileNavigation.matches;
      if (isOpen) setSubmenu(false);
    });

    submenuToggle?.addEventListener('click', () => {
      setSubmenu(submenuToggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.site-header')) closeMenu();
    });

    document.addEventListener('focusin', (event) => {
      if (!event.target.closest('.site-header')) closeMenu();
    });

    siteNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });

    mobileNavigation.addEventListener('change', closeMenu);
    window.addEventListener('pageshow', closeMenu);
  }

  const workVideos = document.querySelectorAll('[data-work-gallery] video:not([data-cover-video])');

  workVideos.forEach((video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;

    const startPlayback = () => {
      const playback = video.play();
      if (playback) playback.catch(() => {});
    };

    if (video.readyState >= 2) startPlayback();
    else video.addEventListener('canplay', startPlayback, { once: true });
  });

  const workGallery = document.querySelector('[data-work-gallery]');
  const workFilters = document.querySelectorAll('[data-work-filter]');

  // On touchscreens, imitate hover only after browsing pauses. Keep every
  // image clean on arrival and during movement; reveal one centred project.
  // No click handler: a project still opens with one tap.
  let refreshWorkTitles = () => {};
  if (workGallery) {
    const tiles = Array.from(workGallery.querySelectorAll('.work-tile'));
    const touchBrowsing = window.matchMedia('(hover: none), (pointer: coarse)');
    let activeTile = null;
    let revealTimer = 0;
    let lastScrollY = window.scrollY;

    const hideTitle = () => {
      window.clearTimeout(revealTimer);
      revealTimer = 0;
      if (activeTile) activeTile.classList.remove('is-browsing');
      activeTile = null;
    };

    const revealCentredTitle = () => {
      revealTimer = 0;
      if (!touchBrowsing.matches || document.hidden) return;
      const centre = window.innerHeight / 2;
      const tile = tiles.find((candidate) => {
        if (candidate.hidden) return false;
        const rect = candidate.getBoundingClientRect();
        return rect.height > 0 && rect.top <= centre && rect.bottom >= centre;
      });
      if (tile) {
        activeTile = tile;
        tile.classList.add('is-browsing');
      }
    };

    refreshWorkTitles = () => {
      hideTitle();
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', () => {
      if (window.scrollY === lastScrollY) return;
      lastScrollY = window.scrollY;
      hideTitle();
      if (touchBrowsing.matches) {
        // Wait for scrolling to settle, then use the existing hover fade.
        revealTimer = window.setTimeout(revealCentredTitle, 240);
      }
    }, { passive: true });
    touchBrowsing.addEventListener('change', refreshWorkTitles);
    window.addEventListener('resize', refreshWorkTitles, { passive: true });
    window.addEventListener('pagehide', refreshWorkTitles);
    window.addEventListener('pageshow', refreshWorkTitles);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) refreshWorkTitles();
    });
  }

  if (workGallery && workFilters.length) {
    const validFilters = new Set(['all', 'creative-direction', 'styling', 'photography', 'beauty']);
    const workRows = Array.from(workGallery.querySelectorAll('.work-row'));

    const applyWorkFilter = (requestedFilter, updateUrl = true) => {
      const filter = validFilters.has(requestedFilter) ? requestedFilter : 'all';

      workFilters.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.workFilter === filter));
      });

      workRows.forEach((row) => {
        const tiles = Array.from(row.querySelectorAll('.work-tile[data-disciplines]'));
        let visibleTiles = 0;

        tiles.forEach((tile) => {
          const disciplines = tile.dataset.disciplines.split(/\s+/);
          const isVisible = filter === 'all' || disciplines.includes(filter);
          tile.hidden = !isVisible;
          if (isVisible) visibleTiles += 1;
        });

        row.hidden = visibleTiles === 0;
        row.classList.toggle('work-row--filtered-single', row.classList.contains('work-row--pair') && visibleTiles === 1);
      });

      workGallery.querySelectorAll('.work-row:not([hidden]) video:not([data-cover-video])').forEach((video) => {
        const playback = video.play();
        if (playback) playback.catch(() => {});
      });

      refreshWorkTitles();

      if (updateUrl) {
        const url = new URL(window.location.href);
        if (filter === 'all') url.searchParams.delete('filter');
        else url.searchParams.set('filter', filter);
        window.history.replaceState({ workFilter: filter }, '', `${url.pathname}${url.search}${url.hash}`);
      }
    };

    workFilters.forEach((button) => {
      button.addEventListener('click', () => applyWorkFilter(button.dataset.workFilter));
    });

    const initialFilter = new URLSearchParams(window.location.search).get('filter') || 'all';
    applyWorkFilter(initialFilter, false);
  }

  const projectType = document.querySelector('#project-type');

  if (projectType) {
    const requestedService = new URLSearchParams(window.location.search).get('service');
    const allowedServices = ['creative-direction', 'photography', 'styling', 'beauty'];

    if (allowedServices.includes(requestedService)) {
      projectType.value = requestedService;
    }
  }
})();
