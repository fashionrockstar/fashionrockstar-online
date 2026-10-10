(() => {
  'use strict';
  const page = document.querySelector('.services-page');
  if (!page) return;
  const services = Array.from(page.querySelectorAll('details.service'));
  const aliases = { visuals: 'photography', video: 'videography' };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const records = services.map(service => ({ service, summary: service.querySelector('summary'), panel: service.querySelector('.service-details'), reveals: Array.from(service.querySelectorAll('.service-reveal')), videos: Array.from(service.querySelectorAll('video')), expanded: service.open, animation: null, frame: 0 }));
  const replaceFragment = id => {
    try {
      const url = new URL(window.location.href);
      url.hash = id;
      url.searchParams.delete('service');
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    } catch { /* Disclosures still work when history access is unavailable. */ }
  };
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const record = records.find(item => item.service.contains(entry.target));
      if (entry.isIntersecting && record?.expanded) {
        entry.target.classList.add('is-shown');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -4% 0px' }) : null;
  const visibleVideos = new Set();
  const syncVideo = (video, record) => {
    if (!record.expanded || reduced.matches || document.hidden || !visibleVideos.has(video)) { video.pause(); return; }
    video.muted = true;
    if (video.paused) video.play()?.catch(() => { /* The approved poster remains visible. */ });
  };
  const mediaObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleVideos.add(entry.target);
      else visibleVideos.delete(entry.target);
      syncVideo(entry.target, records.find(item => item.videos.includes(entry.target)));
    });
  }, { threshold: .05 }) : null;
  const syncMedia = () => records.forEach(record => record.videos.forEach(video => syncVideo(video, record)));
  const revealPanel = record => record.reveals.forEach(node => {
    revealObserver?.unobserve(node);
    node.classList.remove('is-shown');
    if (reduced.matches || !revealObserver) node.classList.add('is-shown');
    else revealObserver.observe(node);
  });
  const settle = record => {
    record.service.open = record.expanded;
    record.service.style.removeProperty('height');
    record.service.style.removeProperty('overflow');
    record.animation = null;
    record.service.classList.toggle('is-expanded', record.expanded);
    record.videos.forEach(video => syncVideo(video, record));
  };
  const setExpanded = (record, expanded, animate = true) => {
    const { service, summary, panel } = record;
    if (record.expanded === expanded && !record.animation) return;
    const start = service.getBoundingClientRect().height;
    record.animation?.cancel();
    record.animation = null;
    window.cancelAnimationFrame(record.frame);
    record.expanded = expanded;
    service.dataset.expanded = String(expanded);
    summary.setAttribute('aria-expanded', String(expanded));
    panel.inert = !expanded;
    panel.setAttribute('aria-hidden', String(!expanded));
    if (!expanded && panel.contains(document.activeElement)) summary.focus({ preventScroll: true });
    if (expanded) revealPanel(record);
    else {
      service.classList.remove('is-expanded');
      record.reveals.forEach(node => revealObserver?.unobserve(node));
      record.videos.forEach(video => video.pause());
    }
    if (!animate || reduced.matches || typeof service.animate !== 'function') { settle(record); return; }
    // Keep native details semantics. Reversals begin at the current measured
    // frame, and the old panel closes before its content leaves the layout.
    service.style.height = `${start}px`;
    service.style.overflow = 'clip';
    service.open = true;
    const end = summary.getBoundingClientRect().height + (expanded ? panel.offsetHeight : 0);
    const animation = service.animate([{ height: `${start}px` }, { height: `${end}px` }], { duration: 380, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'forwards' });
    record.animation = animation;
    if (expanded) record.frame = window.requestAnimationFrame(() => { if (record.expanded) service.classList.add('is-expanded'); });
    animation.finished.then(() => {
      if (record.animation !== animation) return;
      settle(record);
      animation.cancel();
      if (!expanded) return;
      const bounds = summary.getBoundingClientRect();
      if (bounds.top < 0 || bounds.bottom > window.innerHeight) service.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }).catch(() => { /* Cancellation is expected during rapid changes. */ });
  };
  const activate = (target, animate = true, updateUrl = true) => {
    records.forEach(record => setExpanded(record, record === target, animate));
    if (updateUrl) replaceFragment(target?.service.id || '');
  };
  records.forEach(record => {
    const { service, summary, panel } = record;
    // The original exclusive details[name] is the no-JavaScript fallback.
    // JavaScript retains closing content long enough to animate its height.
    service.removeAttribute('name');
    panel.id = `${service.id}-content`;
    summary.setAttribute('aria-controls', panel.id);
    summary.setAttribute('aria-expanded', String(record.expanded));
    service.dataset.expanded = String(record.expanded);
    panel.inert = !record.expanded;
    panel.setAttribute('aria-hidden', String(!record.expanded));
    summary.addEventListener('click', event => { event.preventDefault(); activate(record.expanded ? null : record); });
    service.addEventListener('toggle', () => { if (!record.animation && service.open !== record.expanded) activate(service.open ? record : null, false); });
    panel.addEventListener('focusin', event => { event.target.closest('.service-reveal')?.classList.add('is-shown'); });
    record.videos.forEach(video => mediaObserver?.observe(video));
    if (record.expanded) { service.classList.add('is-expanded'); revealPanel(record); }
  });
  page.classList.add('services-enhanced');
  const openFragment = (initial = false) => {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)) || new URLSearchParams(window.location.search).get('service'); } catch { return; }
    id = aliases[id] || id;
    const target = records.find(record => record.service.id === id);
    if (!target) return;
    activate(target, !initial);
    if (initial) window.requestAnimationFrame(() => target.service.scrollIntoView({ block: 'start', behavior: 'instant' }));
  };
  window.addEventListener('hashchange', () => openFragment());
  window.addEventListener('resize', () => records.forEach(record => { if (record.animation) { record.animation.cancel(); settle(record); } }));
  reduced.addEventListener('change', () => {
    records.forEach(record => { record.animation?.cancel(); settle(record); if (record.expanded) revealPanel(record); });
    syncMedia();
  });
  document.addEventListener('visibilitychange', syncMedia);
  window.addEventListener('pagehide', () => records.forEach(record => record.videos.forEach(video => video.pause())));
  window.addEventListener('pageshow', syncMedia);
  openFragment(true);
})();
