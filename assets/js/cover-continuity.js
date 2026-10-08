(() => {
  'use strict';

  const journeyKey = 'frsr:cover-journey:v1';
  const transitionKey = 'frsr:cover-transition:v1';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const currentURL = () => new URL(location.href);
  const isWork = url => url?.origin === location.origin && /^\/work\/?$/.test(url.pathname);
  const projectId = url => url?.origin === location.origin && /^\/project\/?$/.test(url.pathname)
    && /^\d+$/.test(url.searchParams.get('id') || '') ? url.searchParams.get('id') : null;
  const read = key => {
    try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; }
  };
  const write = (key, value) => {
    try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* Navigation remains usable. */ }
  };
  const url = value => {
    try { return new URL(value); } catch { return null; }
  };
  const ordinaryClick = event => event.button === 0 && !event.metaKey && !event.ctrlKey
    && !event.shiftKey && !event.altKey && !event.defaultPrevented;
  const imageInWork = id => /^\d+$/.test(id || '')
    ? document.querySelector(`.work-tile[data-project-id="${id}"]:not([hidden]) > img`) : null;
  const heroImage = () => document.querySelector('.project-hero:not(.project-hero--pair) > img:only-child');
  const readyImage = image => image?.complete && image.naturalWidth > 0;
  const visible = image => {
    if (!image || image.closest('[hidden]')) return false;
    const rect = image.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight;
  };
  const clearNames = () => {
    document.querySelectorAll('[data-frsr-transition]').forEach(node => {
      node.style.removeProperty('view-transition-name');
      delete node.dataset.frsrTransition;
    });
  };
  const name = (node, value) => {
    node.style.viewTransitionName = value;
    node.dataset.frsrTransition = '';
  };
  const validJourney = () => {
    const journey = read(journeyKey);
    return journey && /^\d+$/.test(journey.id) && isWork(url(journey.workUrl))
      && projectId(url(journey.projectUrl)) === journey.id
      && Date.now() - journey.savedAt < 30 * 60 * 1000 ? journey : null;
  };

  // Remember the real list state; do not intercept links or modifier clicks.
  if (isWork(currentURL())) {
    document.addEventListener('click', event => {
      if (!ordinaryClick(event)) return;
      const tile = event.target.closest('a.work-tile[data-project-id]');
      if (!tile || tile.target || tile.hasAttribute('download')) return;
      const destination = url(tile.href);
      const id = projectId(destination);
      const image = id && imageInWork(id);
      if (!readyImage(image)) return;
      write(journeyKey, {
        id, workUrl: location.href, projectUrl: destination.href,
        coverPath: new URL(image.src).pathname,
        scrollX, scrollY, savedAt: Date.now()
      });
    });
  } else if (projectId(currentURL())) {
    const journey = validJourney();
    if (journey?.id === projectId(currentURL())) {
      // The explicit return links retain the originating discipline filter.
      document.querySelectorAll('.back-link, .project-nav__grid').forEach(link => {
        link.href = journey.workUrl;
      });
    }
  }

  const pair = (from, to) => {
    if (isWork(from) && projectId(to)) return { id: projectId(to), direction: 'open' };
    if (projectId(from) && isWork(to)) return { id: projectId(from), direction: 'return' };
    return null;
  };

  window.addEventListener('pageswap', event => {
    // Skipping or timing out rejects ready; this is an expected fallback.
    event.viewTransition?.ready.catch(() => {});
    clearNames();
    const current = currentURL();
    const destination = url(event.activation?.entry?.url);
    const route = pair(current, destination);
    const journey = validJourney();
    const image = route?.direction === 'open' ? imageInWork(route.id) : heroImage();
    const matches = Boolean(route && journey && journey.id === route.id && image
      && new URL(image.src).pathname === journey.coverPath);
    const eligible = matches && readyImage(image) && visible(image);
    // Even without motion, the arrival can restore the list's scroll position.
    write(transitionKey, route && matches ? {
      ...route, from: current.href, to: destination.href, savedAt: Date.now(), eligible
    } : null);
    if (!event.viewTransition) return;
    if (!eligible || reducedMotion.matches) {
      event.viewTransition.skipTransition();
      return;
    }
    name(image, 'frsr-cover');
    if (route.direction === 'return') {
      const title = document.querySelector('[data-project-title]');
      if (title) name(title, 'frsr-project-title');
    }
    event.viewTransition.finished.then(clearNames, clearNames);
  });

  let cancelPositionRestore = () => {};
  function restoreWorkPosition(pending, journey) {
    const current = currentURL();
    if (pending?.direction !== 'return' || !isWork(current) || journey?.id !== pending.id
        || journey.workUrl !== current.href) return;
    if (Number.isFinite(journey.scrollY) && Number.isFinite(journey.scrollX)) {
      cancelPositionRestore();
      window.scrollTo({ left: journey.scrollX, top: journey.scrollY, behavior: 'instant' });
      // A late font swap can move the list through scroll anchoring. Correct
      // that shift once, unless the visitor has already started interacting.
      if (document.fonts?.status !== 'loading') return;
      let cancelled = false;
      const stopEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'pagehide'];
      const cancel = () => {
        cancelled = true;
        stopEvents.forEach(type => window.removeEventListener(type, cancel, true));
      };
      cancelPositionRestore = cancel;
      stopEvents.forEach(type => window.addEventListener(type, cancel, { capture: true, passive: true }));
      document.fonts.ready.then(() => {
        if (!cancelled && location.href === current.href) {
          window.scrollTo({ left: journey.scrollX, top: journey.scrollY, behavior: 'instant' });
        }
        cancel();
      });
    }
  }

  // A return cover may sit far below the fold. Start its cached image before
  // the first render, instead of waiting for lazy loading after restoration.
  const arrival = read(transitionKey);
  if (isWork(currentURL()) && arrival?.direction === 'return' && arrival.to === location.href
      && Date.now() - arrival.savedAt < 30000) {
    const image = imageInWork(arrival.id);
    if (image) {
      image.loading = 'eager';
      image.decoding = 'sync';
      image.fetchPriority = 'high';
    }
    restoreWorkPosition(arrival, validJourney());
  }

  window.addEventListener('pagereveal', event => {
    event.viewTransition?.ready.catch(() => {});
    clearNames();
    const pending = read(transitionKey);
    write(transitionKey, null);
    const journey = validJourney();
    const fresh = pending?.to === location.href && Date.now() - pending.savedAt < 30000;
    if (!fresh) {
      event.viewTransition?.skipTransition();
      return;
    }
    restoreWorkPosition(pending, journey);
    const image = pending.direction === 'return' ? imageInWork(pending.id) : heroImage();
    if (!event.viewTransition) return;
    if (reducedMotion.matches || !pending.eligible || journey?.id !== pending.id
        || !readyImage(image) || !visible(image)
        || new URL(image.src).pathname !== journey.coverPath) {
      event.viewTransition.skipTransition();
      return;
    }
    name(image, 'frsr-cover');
    if (pending.direction === 'open') {
      const title = document.querySelector('[data-project-title]');
      if (title) name(title, 'frsr-project-title');
    }
    // Snapshot names must not survive in the back/forward cache.
    event.viewTransition.ready.then(clearNames, clearNames);
  });

  // Older browsers keep native navigation; explicit return links still restore position.
  window.addEventListener('pageshow', () => {
    if ('onpagereveal' in window) return;
    const journey = validJourney();
    const from = url(document.referrer);
    if (journey && isWork(currentURL()) && projectId(from) === journey.id) {
      restoreWorkPosition({ direction: 'return', id: journey.id }, journey);
    }
  });
})();
