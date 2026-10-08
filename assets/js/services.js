(() => {
  'use strict';

  const page = document.querySelector('.services-page');
  if (!page) return;
  const services = Array.from(page.querySelectorAll('details.service'));
  const aliases = { visuals: 'photography', video: 'videography' };

  const replaceFragment = (id) => {
    try {
      const url = new URL(window.location.href);
      url.hash = id;
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    } catch {
      // The disclosures still work when history access is unavailable.
    }
  };

  services.forEach((service) => {
    service.addEventListener('toggle', () => {
      if (service.open) {
        // Fallback for browsers without exclusive details[name] support.
        services.forEach((other) => {
          if (other !== service) other.open = false;
        });
        replaceFragment(service.id);
      } else if (window.location.hash === `#${service.id}`) {
        replaceFragment('');
      }
    });
  });

  const openFragment = () => {
    let id;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    id = aliases[id] || id;
    const target = services.find((service) => service.id === id);
    if (!target) return;
    services.forEach((service) => { service.open = service === target; });
    // Reveals deep-linked stages without animating the visitor across the page.
    window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
  };

  window.addEventListener('hashchange', openFragment);
  openFragment();
})();
