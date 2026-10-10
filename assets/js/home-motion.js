(() => {
  'use strict';
  const home = document.querySelector('body.home');
  const hero = home?.querySelector('.hero');
  const nav = home?.querySelector('.home-menu__links');
  if (!hero || !nav) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const rows = [...nav.querySelectorAll('a[href]')];
  let observer;
  let frame = 0;
  let heroHeight = hero.offsetHeight;
  const reveal = row => {
    row.classList.add('is-revealed');
    nav.classList.add('is-revealed');
    observer?.unobserve(row);
  };

  rows.forEach((row, index) => {
    const label = row.querySelector('[data-braille]');
    if (!label) return;
    row.style.setProperty('--row-delay', Math.min(index * 65, 195) + 'ms');
    const layer = document.createElement('span');
    layer.className = 'home-menu__braille';
    layer.setAttribute('aria-hidden', 'true');
    // Never regenerate or normalize the owner's approved Braille equivalents.
    [...label.dataset.braille].forEach((character, i) => {
      const span = document.createElement('span');
      span.textContent = character;
      span.style.setProperty('--character-delay', Math.min(i * 12, 144) + 'ms');
      layer.append(span);
    });
    label.append(layer);
    const activate = () => {
      row.classList.remove('is-resting');
      row.classList.add('is-braille');
      reveal(row);
    };
    row.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') activate(); });
    row.addEventListener('pointerleave', () => { if (!row.matches(':focus-visible')) row.classList.remove('is-braille'); });
    row.addEventListener('focus', activate);
    row.addEventListener('blur', () => row.classList.remove('is-braille'));
    row.addEventListener('pointerdown', activate);
    row.addEventListener('pointercancel', () => row.classList.remove('is-braille', 'is-activating'));
  });

  const observe = () => {
    observer?.disconnect();
    if (reduced.matches || !('IntersectionObserver' in window)) {
      rows.forEach(reveal);
      return;
    }
    // Observe stationary links, not translated lettering hidden by its mask.
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
    }, { threshold: .32, rootMargin: '0px 0px -10% 0px' });
    rows.filter(row => !row.classList.contains('is-revealed')).forEach(row => observer.observe(row));
  };
  home.classList.add('home-motion-ready');
  observe();

  const updateScroll = () => {
    frame = 0;
    const progress = Math.min(1, Math.max(0, scrollY / Math.max(heroHeight, 1)));
    hero.style.setProperty('--hero-scroll-opacity', reduced.matches ? '1' : String(1 - progress * .16));
    hero.style.setProperty('--cue-scroll-opacity', reduced.matches ? '1' : String(Math.max(0, 1 - progress * 3)));
    hero.style.setProperty('--hero-scroll-y', reduced.matches ? '0px' : `${-18 * progress}px`);
    hero.style.setProperty('--actions-scroll-opacity', reduced.matches ? '1' : String(Math.max(0, 1 - progress * 1.6)));
    home.classList.toggle('home-motion-paused', document.hidden || progress >= 1);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(updateScroll); };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => { heroHeight = hero.offsetHeight; schedule(); }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    // A hidden tab can suspend rAF; pause the decorative wave immediately.
    home.classList.toggle('home-motion-paused', document.hidden || scrollY >= heroHeight);
    if (!document.hidden) schedule();
  });
  reduced.addEventListener('change', () => { observe(); schedule(); });
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); frame = 0; });
  window.addEventListener('pageshow', event => {
    rows.forEach(row => {
      row.classList.remove('is-activating', 'is-braille');
      if (event.persisted) row.classList.add('is-resting');
    });
    heroHeight = hero.offsetHeight;
    observe();
    schedule();
  });
  schedule();
})();
