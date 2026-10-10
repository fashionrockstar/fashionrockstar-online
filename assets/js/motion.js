(() => {
  'use strict';

  const EASE = 'cubic-bezier(.16, 1, .3, 1)';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const records = new Map();
  const active = new Map();
  let arrival = Promise.resolve();
  let restoring = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
  const read = key => { try { return JSON.parse(sessionStorage.getItem(key)); } catch { return null; } };
  const write = (key, value) => { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* Native navigation remains available. */ } };
  const visible = node => {
    if (!node?.isConnected || node.closest('[hidden], [inert]')) return false;
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.top < innerHeight * .96 && rect.bottom > 0;
  };
  const remember = (node, animation, cleanup = () => {}) => {
    if (!active.has(node)) active.set(node, new Set());
    const item = { animation, cleanup };
    active.get(node).add(item);
    const finish = () => {
      cleanup();
      animation.cancel();
      active.get(node)?.delete(item);
      if (!active.get(node)?.size) active.delete(node);
    };
    animation.finished.then(finish, finish);
    return animation;
  };
  const stop = root => {
    active.forEach((items, node) => {
      if (root && root !== node && !root.contains(node)) return;
      items.forEach(item => { item.cleanup(); item.animation.cancel(); });
      active.delete(node);
    });
  };
  const animate = (node, frames, options = {}) => {
    if (reduced.matches || !node?.animate) return null;
    return remember(node, node.animate(frames, { duration: 780, easing: EASE, ...options }));
  };

  // Original text remains the sizing, selection and accessible content layer.
  // Temporary line masks copy its measured wrapping instead of reflowing words.
  const heading = (node, { duration = 950, delay = 0 } = {}) => {
    if (!node || reduced.matches || !node.animate || !visible(node)) return;
    stop(node);
    const layers = [];
    const oldPosition = node.style.position;
    const cleanup = () => { layers.forEach(layer => layer.remove()); node.style.position = oldPosition; };
    try {
      const bounds = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const range = document.createRange();
      const lines = [];
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      const rects = [];
      while (walker.nextNode()) {
        if (!walker.currentNode.textContent.trim()) continue;
        range.selectNodeContents(walker.currentNode);
        rects.push(...range.getClientRects());
      }
      rects.filter(rect => rect.width > 0 && rect.height > 0).forEach(rect => {
        const top = rect.top - bounds.top;
        const found = lines.find(line => Math.abs(line.top - top) < 3);
        if (found) found.bottom = Math.max(found.bottom, rect.bottom - bounds.top);
        else lines.push({ top, bottom: rect.bottom - bounds.top });
      });
      if (!lines.length || lines.length > 8) throw new Error('Use a single mask for this heading.');
      if (style.position === 'static') node.style.position = 'relative';
      const top = Math.min(0, ...lines.map(line => line.top - 2));
      const height = Math.max(bounds.height, ...lines.map(line => line.bottom + 2)) - top;
      lines.sort((a, b) => a.top - b.top).forEach((line, index) => {
        const mask = document.createElement('div');
        mask.className = 'motion-text-mask';
        mask.setAttribute('aria-hidden', 'true');
        Object.assign(mask.style, { top: `${top}px`, height: `${height}px`, clipPath: `inset(${Math.max(0, line.top - top - 2)}px 0 ${Math.max(0, height - (line.bottom - top + 2))}px 0)` });
        const clone = node.cloneNode(true);
        clone.querySelectorAll('.motion-text-mask').forEach(child => child.remove());
        [clone, ...clone.querySelectorAll('[id]')].forEach(child => child.removeAttribute('id'));
        clone.removeAttribute('tabindex');
        clone.removeAttribute('aria-labelledby');
        [clone, ...clone.querySelectorAll('[data-motion-kind]')].forEach(child => {
          child.removeAttribute('data-motion-kind');
          child.removeAttribute('data-motion-state');
        });
        clone.classList.add('motion-text-copy');
        clone.setAttribute('aria-hidden', 'true');
        Object.assign(clone.style, { top: `${-top}px`, margin: '0', width: '100%', maxWidth: 'none', height: `${bounds.height}px`, font: style.font, lineHeight: style.lineHeight, letterSpacing: style.letterSpacing, color: style.color, textAlign: style.textAlign, textWrap: style.textWrap, padding: style.padding });
        mask.append(clone);
        layers.push(mask);
        node.append(mask);
        animate(clone, [{ transform: `translateY(${line.bottom - line.top + 5}px)` }, { transform: 'translateY(0)' }], { duration, delay: delay + index * 70, fill: 'backwards' });
      });
      remember(node, node.animate([{ color: 'transparent' }, { color: 'transparent' }], { duration: duration + (lines.length - 1) * 70, delay, fill: 'backwards' }), cleanup);
    } catch {
      cleanup();
      animate(node, [{ clipPath: 'inset(100% 0 0)', transform: 'translateY(12px)' }, { clipPath: 'inset(-.15em 0)', transform: 'translateY(0)' }], { duration, delay, fill: 'backwards' });
    }
  };

  const show = record => {
    const { node, kind, options } = record;
    record.done = true;
    node.dataset.motionState = 'shown';
    observer?.unobserve(node);
    if (kind === 'rule') { node.classList.add('motion-rule-visible'); return; }
    if (kind === 'divider') { node.classList.add('motion-divider-visible'); return; }
    if (reduced.matches || restoring || node.contains(document.activeElement)) return;
    const delay = options.delay || 0;
    node.dataset.motionState = 'revealing';
    if (kind === 'heading') heading(node, options);
    else if (kind === 'image') {
      // Animate the photographs, never the link's hit area or a video player.
      node.classList.add('motion-image-frame');
      [...node.querySelectorAll('img')].filter(image => !image.classList.contains('motion-cover-bridge') && !image.closest('.work-tile__slideshow')).forEach((image, index) => {
        animate(image, [{ clipPath: 'inset(0 0 18% 0)', scale: '1.04' }, { clipPath: 'inset(0)', scale: '1' }], { duration: 1000, delay: delay + Math.min(index * 65, 130), fill: 'backwards' });
      });
    } else {
      const opacity = Number.parseFloat(getComputedStyle(node).opacity) || 1;
      const frames = kind === 'copy' ? [{ opacity: opacity * .5 }, { opacity }]
        : [{ opacity: 0, transform: `translateY(${kind === 'number' ? 18 : 12}px)` }, { opacity, transform: 'translateY(0)' }];
      animate(node, frames, { duration: kind === 'number' ? 1000 : 760, delay, fill: 'backwards' });
    }
    setTimeout(() => { if (node.isConnected) node.dataset.motionState = 'shown'; }, 1300 + delay);
  };
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const record = records.get(entry.target);
      if (!entry.isIntersecting || !record || record.done) return;
      arrival.then(() => {
        if (!record.done && visible(record.node)) show(record);
      });
    });
  }, { threshold: 0, rootMargin: '0px 0px -6% 0px' }) : null;
  const watch = (node, kind = 'rise', options = {}) => {
    if (!node) return;
    if (records.has(node) && !options.reset) return;
    stop(node);
    const record = { node, kind, options, done: false };
    records.set(node, record);
    node.dataset.motionKind = kind;
    node.dataset.motionState = 'waiting';
    if (kind === 'rule') {
      const style = getComputedStyle(node);
      if (Number.parseFloat(style[options.top ? 'borderTopWidth' : 'borderBottomWidth']) === 0) { records.delete(node); return; }
      if (!node.classList.contains('motion-rule')) node.style.setProperty('--motion-rule-color', style[options.top ? 'borderTopColor' : 'borderBottomColor']);
      node.classList.add('motion-rule', options.top ? 'motion-rule--top' : 'motion-rule--bottom');
      node.classList.remove('motion-rule-visible');
    }
    if (kind === 'divider') node.classList.add('motion-divider');
    if (reduced.matches || !observer) show(record);
    else observer.observe(node);
  };
  const watchAll = (selector, kind, stagger = 0) => document.querySelectorAll(selector).forEach((node, index) => watch(node, kind, { delay: Math.min(index * stagger, 180) }));
  const refresh = root => arrival.then(() => records.forEach(record => {
    if (!record.done && (!root || root.contains(record.node)) && visible(record.node)) show(record);
  }));
  const forget = root => {
    stop(root);
    records.forEach((record, node) => {
      if (!root.contains(node)) return;
      observer?.unobserve(node);
      records.delete(node);
      delete node.dataset.motionKind;
      delete node.dataset.motionState;
    });
  };
  const releaseRestoration = () => requestAnimationFrame(() => requestAnimationFrame(() => {
    records.forEach(record => { if (!record.done && visible(record.node)) show(record); });
    restoring = false;
  }));

  // Extend the existing native handoff. Links, history and playback keep their owners.
  const journeyKey = 'frsr:motion-work-journey:v1';
  const pendingKey = 'frsr:motion-navigation:v1';
  const isWork = url => /^\/work\/?$/.test(url?.pathname || '');
  const projectId = url => /^\/project\/?$/.test(url?.pathname || '') ? url.searchParams.get('id') : null;
  const parseURL = value => { if (typeof value !== 'string' || !value) return null; try { return new URL(value, location.href); } catch { return null; } };
  const mediaURL = value => {
    const url = parseURL(value);
    return url?.origin === location.origin && url.pathname.startsWith('/assets/') ? url.pathname : null;
  };
  const current = parseURL(location.href);
  const journey = read(journeyKey);
  const recentJourney = saved => saved?.savedAt > Date.now() - 1800000 && isWork(parseURL(saved.workURL)) && parseURL(saved.workURL)?.origin === location.origin;
  const validJourney = recentJourney(journey);
  const tileFor = id => [...document.querySelectorAll('.work-tile[data-project-id]')].find(node => node.dataset.projectId === id && !node.hidden);
  const workMedia = id => [...(tileFor(id)?.querySelectorAll('img, video') || [])].filter(node => !node.classList.contains('motion-cover-bridge') && (!node.closest('.work-tile__slideshow') || node.classList.contains('is-active')));
  const projectMedia = () => [...document.querySelectorAll('.project-hero > img:not(.motion-cover-bridge), .project-hero > video')];
  const keys = node => [node.getAttribute('src'), node.dataset.src, node.getAttribute('poster')].map(mediaURL).filter(Boolean);
  const matches = (node, cover) => cover?.keys?.some(key => keys(node).includes(key));
  const reserveMedia = pending => {
    if (!['open', 'return'].includes(pending?.direction)) return;
    const media = pending.direction === 'return' ? workMedia(pending.id) : projectMedia();
    media.forEach((node, index) => {
      const cover = pending.covers?.[index];
      if (matches(node, cover) && !node.hasAttribute('width') && cover.width && cover.height) {
        node.width = cover.width; node.height = cover.height;
      }
    });
  };
  const ready = node => node?.tagName === 'VIDEO' ? node.readyState >= 2 : node?.complete && node.naturalWidth > 0;
  const warmed = new Map();
  const frames = new WeakMap();
  const snapshot = (node, source = node) => {
    const width = source?.videoWidth || source?.naturalWidth;
    const height = source?.videoHeight || source?.naturalHeight;
    if (!width || !height || !ready(source)) return;
    try {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 1800 / width);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
      frames.set(node, canvas.toDataURL('image/jpeg', .94));
    } catch { /* Unavailable frames retain native navigation. */ }
  };
  const warm = node => {
    const src = node.tagName === 'VIDEO' ? node.poster : node.currentSrc || node.src;
    if (!mediaURL(src)) return;
    let image = warmed.get(src);
    if (!image) { image = new Image(); image.src = src; warmed.set(src, image); }
    image.decode?.().then(() => snapshot(node, image)).catch(() => {});
  };
  const capture = node => {
    const poster = warmed.get(node.poster);
    const source = ready(node) ? node : poster?.complete && poster.naturalWidth ? poster : null;
    const width = source?.videoWidth || source?.naturalWidth || Number(node.getAttribute('width'));
    const height = source?.videoHeight || source?.naturalHeight || Number(node.getAttribute('height'));
    // Prepare pixels before pageswap freezes the outgoing compositor.
    return { keys: keys(node), width, height, frame: frames.get(node) || null };
  };
  const clearNames = () => document.querySelectorAll('[data-motion-cover]').forEach(node => {
    node.style.removeProperty('view-transition-name'); delete node.dataset.motionCover;
  });
  const name = (node, value) => { node.style.viewTransitionName = value; node.dataset.motionCover = ''; };
  const coverName = index => index ? 'frsr-cover-2' : 'frsr-cover';
  const clearFrames = () => {
    delete document.documentElement.dataset.motionFrames;
    [1, 2].forEach(index => document.documentElement.style.removeProperty(`--motion-cover-frame-${index}`));
  };
  const paintFrames = covers => {
    const indices = [];
    covers.forEach((cover, index) => {
      if (!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(cover.frame || '')) return;
      document.documentElement.style.setProperty(`--motion-cover-frame-${index + 1}`, `url("${cover.frame}")`);
      indices.push(index + 1);
    });
    document.documentElement.dataset.motionFrames = indices.join(' ');
  };
  const bridges = new Set();
  const bridgeHosts = new Map();
  const clearBridges = () => bridges.forEach(cleanup => cleanup(true));
  const bridge = (node, cover) => {
    if (!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(cover.frame || '')) return node;
    // This is only the outgoing visual frame, never a replacement media asset.
    const holder = node.parentElement;
    if (!bridgeHosts.has(holder)) bridgeHosts.set(holder, { position: holder.style.position, count: 0 });
    const host = bridgeHosts.get(holder);
    host.count++;
    const oldVisibility = node.style.visibility;
    if (getComputedStyle(holder).position === 'static') holder.style.position = 'relative';
    const image = document.createElement('img');
    image.className = 'motion-cover-bridge';
    image.alt = '';
    image.setAttribute('aria-hidden', 'true');
    image.src = cover.frame;
    const place = () => {
      const box = node.getBoundingClientRect(), parent = holder.getBoundingClientRect();
      Object.assign(image.style, { left: `${box.left - parent.left}px`, top: `${box.top - parent.top}px`, width: `${box.width}px`, height: `${box.height}px` });
    };
    holder.append(image);
    place();
    node.style.visibility = 'hidden';
    const resize = new ResizeObserver(place);
    resize.observe(node);
    let done = false, removed = false, timer, fade, fadeDeadline;
    const remove = () => {
      if (removed) return;
      removed = true;
      clearTimeout(fadeDeadline);
      fade?.cancel();
      image.remove();
      bridges.delete(cleanup);
      if (--host.count === 0) { holder.style.position = host.position; bridgeHosts.delete(holder); }
    };
    const cleanup = immediate => {
      if (done) { if (immediate) remove(); return; }
      done = true;
      clearTimeout(timer);
      resize.disconnect();
      node.removeEventListener('load', release);
      node.removeEventListener('error', onError);
      node.removeEventListener('playing', release);
      node.style.visibility = oldVisibility;
      if (!immediate && !reduced.matches && image.animate) {
        fade = image.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: EASE });
        fade.finished.then(remove, remove);
        // Background/bfcache compositors can suspend animation promises.
        fadeDeadline = setTimeout(remove, 300);
      } else remove();
    };
    const release = () => {
      if (node.tagName !== 'VIDEO' && !ready(node)) return;
      arrival.then(() => cleanup(false));
    };
    const onError = () => cleanup(false);
    bridges.add(cleanup);
    if (node.tagName === 'VIDEO' || ready(node)) {
      arrival.then(() => cleanup(false));
      timer = setTimeout(() => cleanup(false), 1200);
    }
    else {
      node.addEventListener('load', release, { once: true });
      node.addEventListener('error', onError, { once: true });
      timer = setTimeout(() => cleanup(false), 5000);
    }
    return image;
  };
  const restorePosition = pending => {
    const saved = read(journeyKey);
    if (!recentJourney(saved) || !isWork(current) || pending?.direction !== 'return' || saved.workURL !== location.href || !Number.isFinite(saved.scrollX) || !Number.isFinite(saved.scrollY)) return;
    restoring = true;
    const restore = () => scrollTo({ left: saved.scrollX, top: saved.scrollY, behavior: 'instant' });
    restore();
    if (document.fonts?.status !== 'loading') return;
    let cancelled = false;
    const events = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'pagehide'];
    const cancel = () => { cancelled = true; events.forEach(type => removeEventListener(type, cancel, true)); };
    events.forEach(type => addEventListener(type, cancel, { capture: true, passive: true }));
    document.fonts.ready.then(() => { if (!cancelled) restore(); cancel(); });
  };
  const incoming = read(pendingKey);
  incoming?.covers?.forEach(cover => {
    if (!cover.frame) return;
    const image = new Image(); image.src = cover.frame;
    image.decode?.().catch(() => {});
  });
  let nativeArrival = false;
  const guardTransition = transition => {
    if (!transition) return;
    [transition.ready, transition.updateCallbackDone, transition.finished].forEach(promise => promise?.catch(() => {}));
  };
  const directionTo = (to, link) => to?.origin !== location.origin ? null
    : isWork(current) && projectId(to) ? 'open'
    : projectId(current) && isWork(to) ? 'return'
    : projectId(current) && projectId(to) ? link?.hasAttribute('data-project-prev') ? 'previous' : 'next' : null;
  let clickedDirection = null;
  document.addEventListener('pointerover', event => {
    const tile = event.target.closest('.work-tile');
    tile?.querySelectorAll('img, video').forEach(warm);
  }, { passive: true });
  document.addEventListener('focusin', event => event.target.closest('.work-tile')?.querySelectorAll('img, video').forEach(warm));
  document.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const to = parseURL(link.href);
    clickedDirection = directionTo(to, link);
    if (!clickedDirection) return;
    if (clickedDirection === 'open') {
      const tile = link.closest('.work-tile[data-project-id]');
      if (!tile) return;
      write(journeyKey, { id: tile.dataset.projectId, workURL: location.href, scrollX, scrollY, savedAt: Date.now() });
    }
    if (clickedDirection === 'open' || clickedDirection === 'return') {
      const media = clickedDirection === 'open' ? workMedia(projectId(to)) : projectMedia();
      media.forEach(node => snapshot(node, ready(node) ? node : warmed.get(node.poster)));
    }
    // Also gives unsupported browsers a coordinated, nonblocking page arrival.
    const media = clickedDirection === 'open' ? workMedia(projectId(to)) : clickedDirection === 'return' ? projectMedia() : [];
    write(pendingKey, { to: to.href, direction: clickedDirection, id: projectId(to) || projectId(current), shared: false, covers: media.map(capture), savedAt: Date.now() });
  });
  addEventListener('pageswap', event => {
    guardTransition(event.viewTransition);
    stop(); clearNames(); clearBridges(); clearFrames();
    const to = parseURL(event.activation?.entry?.url);
    const direction = directionTo(to) === 'next' ? event.activation?.navigationType === 'traverse'
      ? event.activation?.entry?.index < event.activation?.from?.index ? 'previous' : 'next'
      : clickedDirection || 'next' : directionTo(to);
    const id = direction === 'open' ? projectId(to) : projectId(current);
    const saved = read(journeyKey);
    const media = direction === 'open' ? workMedia(id) : direction === 'return' ? projectMedia() : [];
    const covers = media.map(capture);
    const shared = !!(event.viewTransition && !reduced.matches && ['open', 'return'].includes(direction)
      && recentJourney(saved) && saved.id === id && media.length > 0 && media.length <= 2
      && media.every(visible) && covers.every(cover => cover.keys.length && cover.width && cover.height));
    const pending = { to: to?.href, direction, id, shared, covers, savedAt: Date.now() };
    write(pendingKey, pending);
    if (direction) document.documentElement.dataset.motionNavigation = direction;
    if (shared) { paintFrames(covers); media.forEach((node, index) => name(node, coverName(index))); }
    const cleanup = () => { clearNames(); clearFrames(); delete document.documentElement.dataset.motionNavigation; };
    event.viewTransition?.finished.then(cleanup, cleanup);
  });
  addEventListener('pagereveal', event => {
    guardTransition(event.viewTransition);
    clearNames();
    const pending = read(pendingKey);
    write(pendingKey, null);
    if (pending?.to !== location.href || pending.savedAt < Date.now() - 30000) return;
    restorePosition(pending);
    reserveMedia(pending);
    if (reduced.matches) { event.viewTransition?.skipTransition(); return; }
    if (!event.viewTransition) return;
    nativeArrival = true;
    document.documentElement.dataset.motionNavigation = pending.direction || '';
    arrival = event.viewTransition.finished.catch(() => {});
    const media = pending.direction === 'return' ? workMedia(pending.id) : projectMedia();
    if (pending.shared && media.length === pending.covers?.length && media.every((node, index) => matches(node, pending.covers[index]))) {
      if (media.every(visible)) {
        paintFrames(pending.covers);
        media.forEach((node, index) => name(bridge(node, pending.covers[index]), coverName(index)));
      }
    }
    if (projectId(current) && ['open', 'next', 'previous'].includes(pending.direction)) {
      // Native regions own the initial assembly; do not replay scroll entrances.
      document.querySelectorAll('.project-head h1, .project-head > p, .project-credits, .project-hero').forEach(node => {
        stop(node);
        const record = records.get(node);
        if (record) { record.done = true; observer?.unobserve(node); node.dataset.motionState = 'shown'; }
      });
      name(document.querySelector('.project-head'), 'frsr-project-heading');
      const credits = document.querySelector('.project-credits:not([hidden])');
      if (credits) name(credits, 'frsr-project-credits');
    }
    const cleanup = () => { clearNames(); clearFrames(); delete document.documentElement.dataset.motionNavigation; };
    event.viewTransition.ready.then(clearNames, cleanup);
    event.viewTransition.finished.then(cleanup, cleanup);
  });


  const homeKey = 'frsr:motion-home:v1';
  const previousHome = read(homeKey);
  const referrer = parseURL(document.referrer);
  const returningHome = !!(current.pathname === '/' && previousHome?.savedAt > Date.now() - 1800000 && (restoring || referrer?.origin === location.origin && referrer.pathname !== '/'));
  window.FRSRMotion = { EASE, reduced, watch, refresh, forget, heading, animate, stop, returningHome, homeTime: returningHome ? previousHome?.time : null };

  const boot = () => {
    try {
      if (returningHome) document.body.classList.add('home-motion-returning');
      if (nativeArrival) {
        document.querySelector('.project-head h1')?.setAttribute('data-motion-native', '');
      }
      document.querySelectorAll('.work-tile video').forEach(warm);
      projectMedia().forEach(warm);
      if (incoming?.to === location.href && incoming.savedAt > Date.now() - 30000) reserveMedia(incoming);
      if (incoming?.to === location.href && incoming.savedAt > Date.now() - 30000) restorePosition(incoming);
      if (projectId(current) && validJourney) document.querySelectorAll('.back-link, .project-nav__grid').forEach(link => { link.href = journey.workURL; });
      watchAll('.work-page .page-title, .project-head h1:not([data-motion-native]), .services-intro .page-title, .booking-header h1, .about-lead, .about-founder h2, .about-publication h2, .about-publication-lead, .issue-page .page-title, .contact-page .page-title', 'heading');
      watchAll('.work-tile', 'image');
      watchAll('.project-image, .about-image > a', 'image', 45);
      if (!incoming?.shared && !nativeArrival) watchAll('.project-hero', 'image');
      if (!nativeArrival) watchAll('.project-head > p, .project-credits', 'rise', 35);
      watchAll('.project-nav, .services-intro__copy, .services-closing, .booking-meta, .booking-step-meta, .about-intro-note, .about-narrative p:first-child, .about-publication-copy > p:not(.about-publication-lead), .issue-meta', 'rise', 35);
      watchAll('.about-narrative p:not(:first-child)', 'copy', 40);
      watchAll('.booking-field', 'copy', 25);
      document.querySelectorAll('.about-kicker, .about-footer-bottom').forEach(node => watch(node, 'rule', { top: true }));
      document.querySelectorAll('.about-founder').forEach(node => watch(node, 'divider'));
      document.querySelectorAll('.service').forEach(node => watch(node, 'rule'));
      document.documentElement.dataset.motionReady = 'true';
      if (restoring) { restorePosition(incoming); releaseRestoration(); }
    } catch {
      stop();
      records.forEach(record => { record.node.dataset.motionState = 'shown'; record.node.classList.add('motion-rule-visible'); });
      observer?.disconnect();
    }
  };
  document.addEventListener('DOMContentLoaded', boot, { once: true });
  document.addEventListener('focusin', event => {
    const node = event.target.closest('[data-motion-kind]');
    const record = records.get(node);
    if (record) { stop(node); record.done = true; node.dataset.motionState = 'shown'; observer?.unobserve(node); }
  });
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    stop();
    clearBridges();
    clearFrames();
    records.forEach(show);
  });
  addEventListener('resize', () => stop());
  document.fonts?.addEventListener('loadingdone', () => records.forEach(record => { if (record.kind === 'heading') stop(record.node); }));
  addEventListener('pagehide', () => {
    clickedDirection = null;
    const video = document.querySelector('[data-hero-video]');
    if (video) write(homeKey, { time: video.currentTime, savedAt: Date.now() });
    stop();
    clearNames();
    clearBridges();
    clearFrames();
  });
  addEventListener('pageshow', event => {
    if (!event.persisted) return;
    restoring = true;
    stop();
    clearNames();
    clearBridges();
    clearFrames();
    if (document.body.classList.contains('home')) document.body.classList.add('home-motion-returning');
    records.forEach(record => { if (visible(record.node)) show(record); });
    releaseRestoration();
  });
})();
