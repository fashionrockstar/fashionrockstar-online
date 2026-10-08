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

  // Touch has no hover: reveal one title on the first tap, follow its link on
  // the second. Ordinary mouse clicks, keyboard activation and modified clicks
  // keep their native link behaviour. Scrolling never starts a preview.
  let previewTile = null;
  const clearWorkPreview = () => {
    if (previewTile) previewTile.classList.remove('is-previewing');
    previewTile = null;
  };

  if (workGallery) {
    let lastPointerType = '';
    workGallery.addEventListener('pointerdown', (event) => {
      lastPointerType = event.pointerType;
    }, { passive: true });

    workGallery.addEventListener('click', (event) => {
      const tile = event.target.closest('a.work-tile');
      if (!tile || !workGallery.contains(tile)) return;
      const pointerType = event.pointerType || lastPointerType;
      const isTouch = pointerType === 'touch' || pointerType === 'pen';
      if (!isTouch || event.detail === 0 || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      if (previewTile === tile) {
        clearWorkPreview();
        return;
      }
      event.preventDefault();
      clearWorkPreview();
      previewTile = tile;
      tile.classList.add('is-previewing');
    });

    document.addEventListener('pointerdown', (event) => {
      if (previewTile && !previewTile.contains(event.target)) clearWorkPreview();
    }, { passive: true });
    workGallery.addEventListener('pointercancel', clearWorkPreview, { passive: true });
    window.addEventListener('scroll', clearWorkPreview, { passive: true });
    window.addEventListener('resize', clearWorkPreview, { passive: true });
    window.addEventListener('pagehide', clearWorkPreview);
    window.addEventListener('pageshow', clearWorkPreview);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' || event.key === 'Tab') clearWorkPreview();
    });
  }

  if (workGallery && workFilters.length) {
    const validFilters = new Set(['all', 'creative-direction', 'styling', 'photography', 'beauty']);
    const workRows = Array.from(workGallery.querySelectorAll('.work-row'));

    const applyWorkFilter = (requestedFilter, updateUrl = true) => {
      clearWorkPreview();
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
