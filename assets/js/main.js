(() => {
  'use strict';

  const toggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');

  const closeMenu = () => {
    if (!toggle || !siteNav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu';
    siteNav.classList.remove('is-open');
    siteNav.inert = window.innerWidth <= 760;
  };

  if (toggle && siteNav) {
    closeMenu();
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.textContent = isOpen ? 'Menu' : 'Close';
      siteNav.classList.toggle('is-open', !isOpen);
      siteNav.inert = isOpen && window.innerWidth <= 760;
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

    window.addEventListener('resize', () => {
      closeMenu();
    });
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
