(() => {
  'use strict';
  const root = document.documentElement;
  const loader = document.querySelector('[data-entry-loader]');
  if (!loader || !root.classList.contains('entry-loading')) return;
  const page = [...document.querySelectorAll('body > main, body > footer')];
  page.forEach(el => { el.inert = true; });
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(window.__frsrEntryDeadline);
    root.classList.remove('entry-loading');
    page.forEach(el => { el.inert = false; });
    try { sessionStorage.setItem('frsrSimpleEntryV1', 'seen'); } catch {}
  };
  loader.addEventListener('animationend', event => {
    if (event.animationName === 'entry-arrive') finish();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') finish();
  });
  window.addEventListener('pagehide', finish, { once: true });
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => {
    if (event.matches) finish();
  });
  // Also releases input if animation events are unavailable or already elapsed.
  setTimeout(finish, 2800);
})();
