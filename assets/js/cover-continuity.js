(() => {
  'use strict';

  const journeyKey = 'frsr:cover-journey:v2';
  const transitionKey = 'frsr:cover-transition:v2';
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
  const mediaInWork = id => {
    const tile = /^\d+$/.test(id || '') && document.querySelector(`.work-tile[data-project-id="${id}"]:not([hidden])`);
    return tile ? [...tile.querySelectorAll('img, video')] : [];
  };
  const heroMedia = () => [...document.querySelectorAll('.project-hero > img, .project-hero > video')];
  const isVideo = media => media.tagName === 'VIDEO';
  const mediaPath = value => {
    try {
      const source = new URL(value, location.href);
      return value && source.origin === location.origin ? source.pathname : null;
    } catch { return null; }
  };
  const describe = media => ({
    kind: isVideo(media) ? 'video' : 'image',
    path: mediaPath(media.getAttribute('src') || media.dataset.src),
    poster: isVideo(media) ? mediaPath(media.poster) : null,
    time: isVideo(media) && Number.isFinite(media.currentTime) ? media.currentTime : 0
  });
  const sameMedia = (a, b) => Boolean(a?.path && b?.path && (
    a.kind === b.kind && a.path === b.path
    || a.kind === 'video' && b.kind === 'image' && a.poster === b.path
    || b.kind === 'video' && a.kind === 'image' && b.poster === a.path
  ));
  const matchingMedia = (media, saved) => Array.isArray(saved) && media.length > 0
    && media.length === saved.length && media.every((node, i) => sameMedia(describe(node), saved[i]));
  const readyImage = image => image?.complete && image.naturalWidth > 0;
  const posters = new WeakMap();
  const posterFor = video => {
    if (!video.poster) return null;
    if (!posters.has(video)) {
      const image = new Image();
      image.src = video.poster;
      posters.set(video, image);
    }
    return posters.get(video);
  };
  const readyMedia = media => isVideo(media)
    ? media.readyState >= 2 || readyImage(posterFor(media)) : readyImage(media);
  const visible = media => {
    if (!media || media.closest('[hidden]')) return false;
    const rect = media.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight;
  };
  const transitionName = index => index === 0 ? 'frsr-cover' : `frsr-cover-${index + 1}`;
  const primeMedia = media => {
    if (isVideo(media)) { posterFor(media); return; }
    media.loading = 'eager';
    media.decoding = 'sync';
    media.fetchPriority = 'high';
  };

  // Only videos actually participating in a transition are loaded or sought.
  // Project players keep their existing controls, mute and play/pause behavior.
  let cancelMediaHandoff = () => {};
  const prepareMedia = (media, previous, cancellations) => {
    primeMedia(media);
    if (!isVideo(media)) return media.decode().catch(() => {});
    const source = describe(media);
    const carryTime = previous?.kind === 'video' && source.path === previous.path
      && Number.isFinite(previous.time) && previous.time > 0;
    if (!carryTime) {
      if (media.readyState >= 2) return Promise.resolve();
      return posterFor(media)?.decode().catch(() => {}) || Promise.resolve();
    }
    return new Promise(resolve => {
      let done = false;
      let sought = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        ['loadedmetadata', 'loadeddata', 'seeked', 'error'].forEach(type => media.removeEventListener(type, update));
        resolve();
      };
      const update = event => {
        if (done) return;
        if (event?.type === 'error' || media.error) { finish(); return; }
        if (!sought && media.readyState >= 1) {
          sought = true;
          const end = Number.isFinite(media.duration) ? Math.max(0, media.duration - .05) : previous.time;
          try { media.currentTime = Math.min(previous.time, end); } catch { finish(); return; }
        }
        if (sought && !media.seeking && media.readyState >= 2) finish();
      };
      const timer = setTimeout(finish, 1800);
      cancellations.push(finish);
      ['loadedmetadata', 'loadeddata', 'seeked', 'error'].forEach(type => media.addEventListener(type, update));
      if (!media.getAttribute('src') && media.dataset.src) media.src = media.dataset.src;
      media.preload = 'auto';
      update();
    });
  };
  document.querySelectorAll('.work-tile video, .project-hero > video').forEach(posterFor);
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
      && Array.isArray(journey.media) && journey.media.length > 0
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
      const media = id ? mediaInWork(id) : [];
      if (!media.length) return;
      write(journeyKey, {
        id, workUrl: location.href, projectUrl: destination.href,
        media: media.map(describe),
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
    cancelMediaHandoff();
    clearNames();
    delete document.documentElement.dataset.coverMotion;
    delete document.documentElement.dataset.coverPanels;
    delete document.documentElement.dataset.coverWaiting;
    const current = currentURL();
    const destination = url(event.activation?.entry?.url);
    const route = pair(current, destination);
    const journey = validJourney();
    const media = route?.direction === 'open' ? mediaInWork(route.id) : heroMedia();
    const matches = Boolean(route && journey && journey.id === route.id && matchingMedia(media, journey.media));
    const indices = matches ? media.flatMap((node, i) => readyMedia(node) && visible(node) ? [i] : []) : [];
    const eligible = indices.length > 0;
    // Even without motion, the arrival can restore the list's scroll position.
    write(transitionKey, route && matches ? {
      ...route, from: current.href, to: destination.href, savedAt: Date.now(), eligible,
      indices, media: media.map(describe)
    } : null);
    if (!event.viewTransition) return;
    if (!eligible || reducedMotion.matches) {
      event.viewTransition.skipTransition();
      return;
    }
    indices.forEach(i => name(media[i], transitionName(i)));
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
    mediaInWork(arrival.id).forEach(primeMedia);
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
    const media = pending.direction === 'return' ? mediaInWork(pending.id) : heroMedia();
    const indices = Array.isArray(pending.indices) ? pending.indices.filter(i => Number.isInteger(i) && i >= 0 && i < media.length) : [];
    if (!event.viewTransition) return;
    if (reducedMotion.matches || !pending.eligible || journey?.id !== pending.id
        || !matchingMedia(media, pending.media) || !matchingMedia(media, journey.media)
        || !indices.some(i => visible(media[i]))) {
      event.viewTransition.skipTransition();
      return;
    }
    // Animate each captured frame into its matching panel, including when the
    // project stacks a paired cover on mobile. Hidden panels stay in normal flow.
    const cancellations = [];
    let cancelled = false;
    const waits = indices.map(i => prepareMedia(media[i], pending.media[i], cancellations));
    document.documentElement.dataset.coverWaiting = '';
    cancelMediaHandoff = () => {
      cancelled = true;
      cancellations.forEach(cancel => cancel());
      delete document.documentElement.dataset.coverWaiting;
    };
    indices.forEach(i => name(media[i], transitionName(i)));
    if (pending.direction === 'open') {
      const title = document.querySelector('[data-project-title]');
      if (title) name(title, 'frsr-project-title');
    }
    // Snapshot names must not survive in the back/forward cache.
    event.viewTransition.ready.then(() => {
      // Expose successful native capture for preview QA; this has no visual effect.
      document.documentElement.dataset.coverMotion = pending.direction;
      document.documentElement.dataset.coverPanels = String(indices.length);
      clearNames();
      // The CSS hold keeps the captured cover solid for at most 1.8 seconds.
      // Finish only that hold when the destination decodes; the 680 ms
      // movement and the title animation retain their approved timing.
      if (document.documentElement.hasAttribute('data-cover-waiting')) {
        const holds = document.getAnimations().filter(animation =>
          animation.animationName === 'frsr-cover-hold');
        const release = () => holds.forEach(animation => {
          try { animation.finish(); } catch { /* Navigation may have ended. */ }
        });
        Promise.all(waits).then(() => { if (!cancelled) release(); });
      }
    }, clearNames);
    event.viewTransition.finished.then(cancelMediaHandoff, cancelMediaHandoff);
  });

  window.addEventListener('pagehide', () => cancelMediaHandoff());

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
