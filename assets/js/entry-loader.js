(() => {
  'use strict';
  const root = document.documentElement;
  const loader = document.querySelector('[data-entry-loader]');
  if (!loader || !root.classList.contains('entry-loading')) return;
  const page = [...document.querySelectorAll('body > main, body > footer')];
  page.forEach(el => { el.inert = true; });
  // Match the artwork inside the existing video's object-fit:contain box.
  // The video itself is never paused, restarted, replaced, or resized here.
  const hero = document.querySelector('[data-hero-video]');
  const fallback = document.querySelector('.hero__fallback');
  const align = () => {
    if (!hero) return;
    const box = hero.getBoundingClientRect();
    const scale = Math.min(box.width / 3840, box.height / 2160);
    let width = 2688 * scale;
    let left = box.left + box.width / 2;
    let top = box.top + box.height / 2;
    if (hero.closest('.hero__brand')?.classList.contains('is-fallback') && fallback) {
      const still = fallback.getBoundingClientRect();
      width = still.width;
      left = still.left + still.width / 2;
      top = still.top + still.height / 2;
    }
    loader.style.setProperty('--entry-mark-width', `${width}px`);
    loader.style.setProperty('--entry-mark-left', `${left}px`);
    loader.style.setProperty('--entry-mark-top', `${top}px`);
  };
  align();
  const observer = new ResizeObserver(align);
  if (hero) observer.observe(hero);
  window.addEventListener('resize', align);
  hero?.addEventListener('loadeddata', align);
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    observer.disconnect();
    window.removeEventListener('resize', align);
    hero?.removeEventListener('loadeddata', align);
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
  setTimeout(finish, 4100);
})();
