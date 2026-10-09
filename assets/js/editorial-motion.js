(() => {
  'use strict';

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const tokens = getComputedStyle(document.documentElement);
  const durationValue = tokens.getPropertyValue('--frsr-duration-reveal').trim();
  const durationNumber = Number.parseFloat(durationValue);
  const duration = Number.isFinite(durationNumber)
    ? durationNumber * (durationValue.endsWith('ms') ? 1 : 1000)
    : 640;
  const easing = tokens.getPropertyValue('--frsr-ease').trim() || 'cubic-bezier(.22, 1, .36, 1)';
  const observed = new WeakSet();
  const completed = new WeakSet();
  const animations = new Map();
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -5% 0px' })
    : null;

  function reveal(element) {
    if (completed.has(element)) return;
    completed.add(element);
    observer?.unobserve(element);
    // The default document is fully visible. Effects are added only when a
    // section is actually in view, so failed JavaScript cannot hide content.
    if (motion.matches || !element.animate || element.matches(':focus-within')) return;
    const title = element.dataset.editorialReveal === 'title';
    const frames = title
      ? [
          { opacity: .2, transform: 'translateY(.16em)', clipPath: 'inset(0 0 75% 0)' },
          { opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' }
        ]
      : [
          { opacity: .2, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ];
    const animation = element.animate(frames, {
      duration,
      easing
    });
    animations.set(element, animation);
    const release = () => animations.delete(element);
    animation.finished.then(release, release);
  }

  function observe(root = document) {
    if (!root?.querySelectorAll) return;
    const targets = [...root.querySelectorAll('[data-editorial-reveal]')];
    if (root.matches?.('[data-editorial-reveal]')) targets.unshift(root);
    targets.forEach(element => {
      if (observed.has(element)) return;
      observed.add(element);
      if (motion.matches || !observer) completed.add(element);
      else observer.observe(element);
    });
  }

  const cancel = element => {
    animations.get(element)?.cancel();
    animations.delete(element);
  };
  document.addEventListener('focusin', event => {
    const target = event.target.closest('[data-editorial-reveal]');
    if (!target) return;
    completed.add(target);
    observer?.unobserve(target);
    cancel(target);
  });
  motion.addEventListener('change', event => {
    if (!event.matches) return;
    animations.forEach(animation => animation.cancel());
    animations.clear();
    document.querySelectorAll('[data-editorial-reveal]').forEach(element => {
      completed.add(element);
      observer?.unobserve(element);
    });
  });
  window.addEventListener('pagehide', () => {
    animations.forEach(animation => animation.cancel());
    animations.clear();
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) observe();
  });
  window.FRSRMotion = Object.freeze({ observe });
  observe();
})();
