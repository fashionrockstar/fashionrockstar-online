(() => {
  'use strict';
  const portrait = document.querySelector('.about-portrait');
  const image = portrait?.querySelector('img');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!image || reduced.matches || !('IntersectionObserver' in window)) return;

  const show = () => { portrait.dataset.portraitState = 'visible'; };
  portrait.dataset.portraitState = 'pending';
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    if (image.complete) show();
    else {
      image.addEventListener('load', show, { once: true });
      image.addEventListener('error', show, { once: true });
    }
  }, { threshold: .08, rootMargin: '0px 0px -8% 0px' });
  observer.observe(portrait);

  reduced.addEventListener('change', event => {
    if (event.matches) { observer.disconnect(); show(); }
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) { observer.disconnect(); show(); }
  });
})();
