(() => {
  'use strict';

  const page = document.querySelector('.contact-editorial .contact-page');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!page || reducedMotion.matches || !('IntersectionObserver' in window)) return;

  // Content is visible by default. Motion never gates reading or using a link.
  const revealed = new WeakSet();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || revealed.has(entry.target)) return;
      revealed.add(entry.target);
      entry.target.classList.add('contact-reveal');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });

  page.querySelectorAll('.contact-entry, .contact-wordmark, .contact-booking, .contact-footer')
    .forEach((section) => observer.observe(section));

  page.addEventListener('focusin', (event) => {
    const section = event.target.closest('.contact-entry, .contact-booking, .contact-footer');
    if (!section) return;
    revealed.add(section);
    observer.unobserve(section);
    section.classList.remove('contact-reveal');
  });

  // Respect a preference change while the page is already open.
  reducedMotion.addEventListener('change', (event) => {
    if (!event.matches) return;
    observer.disconnect();
    page.querySelectorAll('.contact-reveal').forEach((section) => {
      section.classList.remove('contact-reveal');
    });
  });
})();
