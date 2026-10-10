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
      [...node.querySelectorAll('img')].filter(image => !image.closest('.work-tile__slideshow')).forEach((image, index) => {
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

  // Native cross-document transitions add no click delays or routing layer.
  const journeyKey = 'frsr:motion-work-journey:v1';
  const pendingKey = 'frsr:motion-navigation:v1';
  const isWork = url => /^\/work\/?$/.test(url?.pathname || '');
  const projectId = url => /^\/project\/?$/.test(url?.pathname || '') ? url.searchParams.get('id') : null;
  const parseURL = value => { if (typeof value !== 'string' || !value) return null; try { return new URL(value, location.href); } catch { return null; } };
  const path = node => parseURL(node?.getAttribute('src'))?.pathname;
  const workCover = id => {
    const tile = [...document.querySelectorAll('.work-tile[data-project-id]')].find(node => node.dataset.projectId === id && !node.hidden);
    const media = tile?.querySelectorAll('img, video');
    return media?.length === 1 && media[0].tagName === 'IMG' ? media[0] : null;
  };
  const projectCover = () => {
    const media = document.querySelectorAll('.project-hero > img, .project-hero > video');
    return media.length === 1 && media[0].tagName === 'IMG' ? media[0] : null;
  };
  const ready = image => image?.complete && image.naturalWidth > 0 && visible(image);
  const clearNames = () => document.querySelectorAll('[data-motion-cover]').forEach(node => { node.style.removeProperty('view-transition-name'); delete node.dataset.motionCover; });
  const nameCover = node => { node.style.viewTransitionName = 'frsr-cover'; node.dataset.motionCover = ''; };
  const current = parseURL(location.href);
  const journey = read(journeyKey);
  const recentJourney = saved => saved?.savedAt > Date.now() - 1800000 && isWork(parseURL(saved.workURL)) && parseURL(saved.workURL)?.origin === location.origin;
  const validJourney = recentJourney(journey);
  if (isWork(current)) {
    document.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
      const tile = event.target.closest('a.work-tile[data-project-id]');
      if (!tile || tile.target || tile.hasAttribute('download')) return;
      write(journeyKey, { id: tile.dataset.projectId, workURL: location.href, cover: path(workCover(tile.dataset.projectId)), scrollX, scrollY, savedAt: Date.now() });
    });
  }
  const restorePosition = pending => {
    const saved = read(journeyKey);
    if (!recentJourney(saved) || !isWork(current) || pending?.direction !== 'return' || pending.id !== saved?.id || saved.workURL !== location.href || !Number.isFinite(saved.scrollX) || !Number.isFinite(saved.scrollY)) return;
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
  const guardTransition = transition => {
    if (!transition) return;
    // Skips, changed preferences and page restoration can reject any stage.
    [transition.ready, transition.updateCallbackDone, transition.finished].forEach(promise => promise?.catch(() => {}));
  };
  addEventListener('pageswap', event => {
    guardTransition(event.viewTransition);
    stop();
    clearNames();
    const to = parseURL(event.activation?.entry?.url);
    const saved = read(journeyKey);
    const direction = to?.origin !== location.origin ? null : isWork(current) && projectId(to) ? 'open' : projectId(current) && isWork(to) ? 'return' : null;
    const id = direction === 'open' ? projectId(to) : projectId(current);
    const media = direction === 'open' ? workCover(id) : projectCover();
    const shared = !!(direction && recentJourney(saved) && saved.id === id && saved.cover && path(media) === saved.cover && ready(media) && !reduced.matches);
    write(pendingKey, { to: to?.href, direction, id, shared, cover: saved?.cover, savedAt: Date.now() });
    if (shared && event.viewTransition) nameCover(media);
    event.viewTransition?.finished.then(clearNames, clearNames);
  });
  addEventListener('pagereveal', event => {
    guardTransition(event.viewTransition);
    clearNames();
    const pending = read(pendingKey);
    write(pendingKey, null);
    if (pending?.to !== location.href || pending.savedAt < Date.now() - 30000) return;
    restorePosition(pending);
    if (!event.viewTransition) return;
    arrival = event.viewTransition.finished.catch(() => {});
    if (!pending.shared) return;
    const image = pending.direction === 'return' ? workCover(pending.id) : projectCover();
    if (!ready(image) || path(image) !== pending.cover || reduced.matches) { event.viewTransition.skipTransition(); return; }
    nameCover(image);
    event.viewTransition.ready.then(() => { document.documentElement.dataset.motionCoverDirection = pending.direction; clearNames(); }, clearNames);
    event.viewTransition.finished.then(clearNames, clearNames);
  });

  const homeKey = 'frsr:motion-home:v1';
  const previousHome = read(homeKey);
  const referrer = parseURL(document.referrer);
  const returningHome = !!(current.pathname === '/' && !current.searchParams.has('biometric-access') && previousHome?.savedAt > Date.now() - 1800000 && (restoring || referrer?.origin === location.origin && referrer.pathname !== '/'));
  window.FRSRMotion = { EASE, reduced, watch, refresh, forget, heading, animate, stop, returningHome, homeTime: returningHome ? previousHome?.time : null };

  const boot = () => {
    try {
      if (returningHome) document.body.classList.add('home-motion-returning');
      if (incoming?.to === location.href && incoming.savedAt > Date.now() - 30000) restorePosition(incoming);
      if (projectId(current) && validJourney && journey.id === projectId(current)) document.querySelectorAll('.back-link, .project-nav__grid').forEach(link => { link.href = journey.workURL; });
      watchAll('.work-page .page-title, .project-head h1, .services-intro .page-title, .booking-header h1, .about-lead, .about-founder h2, .about-publication h2, .about-publication-lead, .issue-page .page-title, .contact-page .page-title', 'heading');
      watchAll('.work-tile', 'image');
      watchAll('.project-image, .about-image > a', 'image', 45);
      if (!incoming?.shared) watchAll('.project-hero', 'image');
      watchAll('.project-head > p, .project-credits, .project-nav, .services-intro__copy, .services-closing, .booking-meta, .booking-step-meta, .about-intro-note, .about-narrative p:first-child, .about-publication-copy > p:not(.about-publication-lead), .issue-meta', 'rise', 35);
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
    records.forEach(show);
  });
  addEventListener('resize', () => stop());
  document.fonts?.addEventListener('loadingdone', () => records.forEach(record => { if (record.kind === 'heading') stop(record.node); }));
  addEventListener('pagehide', () => {
    const video = document.querySelector('[data-hero-video]');
    if (video) write(homeKey, { time: video.currentTime, savedAt: Date.now() });
    stop();
    clearNames();
  });
  addEventListener('pageshow', event => {
    if (!event.persisted) return;
    restoring = true;
    stop();
    clearNames();
    if (document.body.classList.contains('home')) document.body.classList.add('home-motion-returning');
    records.forEach(record => { if (visible(record.node)) show(record); });
    releaseRestoration();
  });
})();
