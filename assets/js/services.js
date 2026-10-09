(() => {
  'use strict';

  const page = document.querySelector('.services-page');
  if (!page) return;
  const services = Array.from(page.querySelectorAll('details.service'));
  const aliases = { visuals: 'photography', video: 'videography' };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const running = new WeakMap();
  const duration = (name, fallback) => {
    const value = getComputedStyle(page).getPropertyValue(name).trim();
    const amount = Number.parseFloat(value);
    return Number.isFinite(amount) ? amount * (value.endsWith('ms') ? 1 : 1000) : fallback;
  };

  const replaceFragment = (id) => {
    try {
      const url = new URL(window.location.href);
      url.hash = id || '';
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    } catch {
      // Disclosures still work if browser history is blocked.
    }
  };
  const cancel = (service) => {
    const item = running.get(service);
    if (item) {
      running.delete(service);
      item.animation.cancel();
    }
    service.style.removeProperty('height');
    service.style.removeProperty('overflow');
  };
  const animateDisclosure = (service, expand) => {
    const summary = service.querySelector('summary');
    if (!summary) return;
    const start = service.getBoundingClientRect().height;
    cancel(service);
    service.style.height = start + 'px';
    service.style.overflow = 'hidden';
    if (expand) {
      services.forEach((other) => {
        if (other === service) return;
        cancel(other);
        other.open = false;
      });
      service.open = true;
      replaceFragment(service.id);
    }
    const saved = service.style.height;
    service.style.height = 'auto';
    const openHeight = service.getBoundingClientRect().height;
    service.style.height = saved;
    const destination = expand ? openHeight : summary.getBoundingClientRect().height;
    if (Math.abs(destination - start) < 2) {
      if (!expand) service.open = false;
      cancel(service);
      return;
    }
    const animation = service.animate([
      { height: start + 'px' },
      { height: destination + 'px' }
    ], {
      duration: expand ? duration('--frsr-duration-reveal', 640) : duration('--frsr-duration-base', 320),
      easing: getComputedStyle(page).getPropertyValue('--frsr-ease').trim() || 'cubic-bezier(.22, 1, .36, 1)',
      fill: 'forwards'
    });
    running.set(service, { animation, expand });
    animation.addEventListener('finish', () => {
      if (running.get(service)?.animation !== animation) return;
      running.delete(service);
      if (!expand) service.open = false;
      animation.cancel();
      service.style.removeProperty('height');
      service.style.removeProperty('overflow');
    }, { once: true });
  };

  services.forEach((service) => {
    const summary = service.querySelector('summary');
    summary?.addEventListener('click', (event) => {
      if (reducedMotion.matches || typeof service.animate !== 'function') return;
      event.preventDefault();
      const current = running.get(service);
      const expand = current?.expand === false || (!current && !service.open);
      animateDisclosure(service, expand);
    });
    service.addEventListener('toggle', () => {
      if (service.open) {
        services.forEach((other) => {
          if (other === service || !other.open) return;
          cancel(other);
          other.open = false;
        });
        replaceFragment(service.id);
        window.requestAnimationFrame(() => {
          if (!service.open) return;
          const bounds = summary.getBoundingClientRect();
          if (bounds.top < 0 || bounds.bottom > window.innerHeight) {
            service.scrollIntoView({ block: 'start', behavior: 'instant' });
          }
        });
      } else {
        cancel(service);
        if (window.location.hash === '#' + service.id) replaceFragment('');
      }
    });
  });

  const openFragment = () => {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); }
    catch { return; }
    id = aliases[id] || id;
    const target = services.find((service) => service.id === id);
    if (!target) return;
    services.forEach((service) => {
      cancel(service);
      service.open = service === target;
    });
    window.requestAnimationFrame(() =>
      target.scrollIntoView({ block: 'start', behavior: 'instant' }));
  };
  window.addEventListener('hashchange', openFragment);
  openFragment();

  reducedMotion.addEventListener?.('change', () => {
    if (!reducedMotion.matches) return;
    services.forEach((service) => {
      const active = running.get(service);
      if (!active) return;
      const expand = active.expand;
      cancel(service);
      service.open = expand;
    });
  });
})();
