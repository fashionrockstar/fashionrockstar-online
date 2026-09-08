(() => {
  'use strict';

  const toggle = document.querySelector('[data-home-menu-toggle]');
  const panel = document.querySelector('#home-navigation');
  if (!toggle || !panel) return;

  const close = panel.querySelector('[data-home-menu-close]');
  const submenuToggle = panel.querySelector('.home-submenu-control');
  const submenu = panel.querySelector('#home-work-disciplines');

  const setSubmenu = (expanded) => {
    submenuToggle.setAttribute('aria-expanded', String(expanded));
    submenuToggle.setAttribute('aria-label', `${expanded ? 'Collapse' : 'Expand'} Selected Work disciplines`);
    submenuToggle.firstElementChild.textContent = expanded ? '−' : '+';
    submenu.hidden = !expanded;
  };

  toggle.addEventListener('click', () => {
    panel.showModal();
    document.documentElement.classList.add('home-nav-open');
    toggle.setAttribute('aria-expanded', 'true');
  });

  close.addEventListener('click', () => panel.close());

  // Native dialog supplies an inert background and Escape dismissal.
  panel.addEventListener('close', () => {
    document.documentElement.classList.remove('home-nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    setSubmenu(false);
    toggle.focus({ preventScroll: true });
  });

  submenuToggle.addEventListener('click', () => {
    setSubmenu(submenuToggle.getAttribute('aria-expanded') !== 'true');
  });

  panel.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const targets = [...panel.querySelectorAll('a[href], button:not([disabled])')]
      .filter((element) => element.getClientRects().length > 0);
    const first = targets[0];
    const last = targets[targets.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Restore a closed menu when returning through the browser's page cache.
  window.addEventListener('pageshow', () => {
    if (panel.open) panel.close();
  });
})();
