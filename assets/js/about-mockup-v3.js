(() => {
  'use strict';

  const sections = document.querySelectorAll('.reveal-section');
  if (!sections.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.12
  });

  sections.forEach((section) => observer.observe(section));
})();