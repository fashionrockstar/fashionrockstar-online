(() => {
  'use strict';
  const covers = [...document.querySelectorAll('[data-cover-video]')];
  const films = [...document.querySelectorAll('[data-project-video]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  const load = video => {
    if (!video.hasAttribute('src')) {
      video.src = video.dataset.src;
      video.load();
    }
  };
  const update = () => covers.forEach(video => {
    const shouldPlay = visible.has(video) && !document.hidden && !reducedMotion.matches && !video.closest('[hidden]');
    if (!shouldPlay) { video.pause(); return; }
    load(video);
    video.play().catch(() => {}); // The poster stays available if autoplay is blocked.
  });
  covers.forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
  });
  if ('IntersectionObserver' in window) {
    const coverObserver = new IntersectionObserver(entries => {
      entries.forEach(({target, isIntersecting}) => isIntersecting ? visible.add(target) : visible.delete(target));
      update();
    }, {threshold: 0.05});
    covers.forEach(video => coverObserver.observe(video));
  }
  // Films use native controls and preload="none"; playback loads them on demand.
  // Without IntersectionObserver the cover stays on its static poster.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) films.forEach(video => video.pause());
    update();
  });
  reducedMotion.addEventListener('change', update);
  const gallery = document.querySelector('[data-work-gallery]');
  if (gallery) new MutationObserver(update).observe(gallery, {subtree: true, attributes: true, attributeFilter: ['hidden']});
})();
