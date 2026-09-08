/* Contact hover/focus preview. The homepage theme and hero stay unchanged. */
(() => {
  'use strict';
  const root = document.documentElement;
  const hero = document.querySelector('.home .home-menu__preview');
  const contact = document.querySelector('.home-menu__links a[href="/contact/"]');
  if (!hero || !contact) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const layer = document.createElement('div');
  layer.className = 'face-apparition';
  layer.setAttribute('aria-hidden', 'true');
  layer.hidden = true;
  const canvas = document.createElement('canvas');
  layer.append(canvas);
  hero.prepend(layer);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'face-motion-control';
  button.textContent = 'Pause animation';
  button.hidden = true;
  hero.append(button);

  const duration = 2000;
  const quiet = 8000;
  let frame = 0, timer = 0, visible = false, paused = false;
  let ready = false, failed = false, loading = false, start = 0;
  let active = false;
  let negative, xray, composite, ctx;
  const smooth = (a, b, t) => {
    const n = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return n * n * (3 - 2 * n);
  };
  const canRun = () => active && ready && !failed && !paused && !motion.matches &&
    visible && !document.hidden && !root.classList.contains('home-nav-open');

  function stop() {
    cancelAnimationFrame(frame);
    clearTimeout(timer);
    frame = timer = 0;
    layer.hidden = true;
    layer.dataset.phase = 'suspended';
  }

  function schedule(delay = 650) {
    stop();
    if (!canRun()) return;
    layer.dataset.phase = 'quiet';
    timer = setTimeout(() => {
      if (!canRun()) return;
      start = performance.now();
      layer.hidden = false;
      frame = requestAnimationFrame(tick);
    }, delay);
  }

  function prepare(image, width, height) {
    const result = document.createElement('canvas');
    result.width = width;
    result.height = height;
    const c = result.getContext('2d');
    if (!c) throw new Error('Canvas unavailable');
    c.drawImage(image, 0, 0, width, height);
    // Hairline, eyes and chin were checked at equal normalized coordinates.
    // The supplied pair already registers; no anatomical warping is necessary.
    c.globalCompositeOperation = 'destination-in';
    const fade = c.createLinearGradient(0, 0, 0, height);
    fade.addColorStop(0, 'transparent');
    fade.addColorStop(.065, '#000');
    fade.addColorStop(.61, '#000');
    fade.addColorStop(.87, 'transparent');
    c.fillStyle = fade;
    c.fillRect(0, 0, width, height);
    const edges = c.createLinearGradient(0, 0, width, 0);
    edges.addColorStop(0, 'transparent');
    edges.addColorStop(.16, '#000');
    edges.addColorStop(.84, '#000');
    edges.addColorStop(1, 'transparent');
    c.fillStyle = edges;
    c.fillRect(0, 0, width, height);
    return result;
  }

  function draw(t) {
    const w = canvas.width, h = canvas.height;
    const c = composite.getContext('2d');
    c.clearRect(0, 0, w, h);
    c.drawImage(negative, 0, 0);
    // A broad, feathered travelling window reveals the existing X-ray artwork.
    const scan = smooth(.36, 1.50, t) * 1.3 - .25;
    const windowMask = c.createLinearGradient(0, (scan - .22) * h, 0, (scan + .22) * h);
    windowMask.addColorStop(0, 'transparent');
    windowMask.addColorStop(.3, '#000');
    windowMask.addColorStop(.7, '#000');
    windowMask.addColorStop(1, 'transparent');
    const reveal = xray.getContext('2d');
    reveal.clearRect(0, 0, w, h);
    reveal.globalCompositeOperation = 'source-over';
    reveal.drawImage(xray.artwork, 0, 0);
    reveal.globalCompositeOperation = 'destination-in';
    reveal.fillStyle = windowMask;
    reveal.fillRect(0, 0, w, h);
    c.drawImage(xray, 0, 0);

    ctx.clearRect(0, 0, w, h);
    const bands = 18;
    for (let i = 0; i < bands; i++) {
      const y = Math.round(i * h / bands);
      const bh = Math.round((i + 1) * h / bands) - y;
      const order = (i * 7) % bands;
      const resolve = smooth(order * .011, .38 + order * .011, t);
      const depart = 1 - smooth(1.42 + order * .010, 1.78 + order * .012, t);
      const alpha = resolve * depart;
      if (alpha <= 0) continue;
      // One out-and-back displacement per selected strip, not repeated jitter.
      const local = [5, 7, 10].includes(i);
      const slip = local ? Math.sin(Math.PI * smooth(.86 + i * .018, 1.34 + i * .018, t)) : 0;
      const offset = (i % 2 ? -1 : 1) * w * (.026 * slip + .014 * (1 - resolve));
      ctx.globalAlpha = alpha;
      ctx.drawImage(composite, 0, y, w, bh, offset, y, w, bh);
      // Single low-contrast remnant, limited to the displaced sections.
      if (local) {
        ctx.globalAlpha = .14 * alpha * smooth(1.18, 1.43, t);
        ctx.drawImage(negative, 0, y, w, bh, -w * .018, y + h * .002, w, bh);
      }
    }
    ctx.globalAlpha = 1;
  }

  function tick(now) {
    if (!canRun()) { stop(); return; }
    const elapsed = now - start;
    if (elapsed >= duration) { schedule(quiet); return; }
    try {
      draw(elapsed / 1000);
      const phase = elapsed < 600 ? 'resolving' : elapsed < 1420 ? 'scan' : 'departing';
      if (layer.dataset.phase !== phase) layer.dataset.phase = phase;
      frame = requestAnimationFrame(tick);
    } catch { fallback(); }
  }

  function fallback() {
    stop();
    failed = true;
    button.hidden = true;
    hero.removeAttribute('data-face-ready');
    // The existing Contact preview image supplies the static fallback.
  }

  async function load() {
    if (!active || loading || ready || failed || motion.matches) return;
    loading = true;
    try {
      // Render at <= 960px, never at TIFF resolution. Smaller phones use 480px.
      const box = hero.getBoundingClientRect();
      const estimate = Math.min(box.width, box.height * 2 / 3);
      const size = estimate * Math.min(devicePixelRatio || 1, 1.5) <= 480 ? 480 : 960;
      const images = await Promise.all(['negative', 'xray'].map(name => new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = `/assets/images/face-preview/${name}-${size}.jpg`;
      })));
      canvas.width = size;
      canvas.height = size * 1.5;
      ctx = canvas.getContext('2d');
      negative = prepare(images[0], canvas.width, canvas.height);
      if (!ctx) throw new Error('Canvas unavailable');
      xray = document.createElement('canvas');
      composite = document.createElement('canvas');
      for (const surface of [xray, composite]) {
        surface.width = canvas.width;
        surface.height = canvas.height;
        if (!surface.getContext('2d')) throw new Error('Canvas unavailable');
      }
      xray.artwork = prepare(images[1], canvas.width, canvas.height);
      ready = true;
      reconcile();
    } catch { fallback(); }
  }

  function reconcile() {
    button.hidden = !active || !ready || failed || motion.matches;
    hero.toggleAttribute('data-face-ready', active && ready && !failed && !paused && !motion.matches);
    if (failed) {
      layer.hidden = true;
      return;
    }
    if (!motion.matches) load();
    schedule();
  }
  button.addEventListener('click', () => {
    paused = !paused;
    button.textContent = paused ? 'Resume animation' : 'Pause animation';
    reconcile();
  });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    reconcile();
  }, { threshold: 0 }).observe(hero);
  new MutationObserver(reconcile).observe(root, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', reconcile);
  motion.addEventListener('change', reconcile);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', reconcile);
  document.querySelectorAll('.home-menu__links a[data-preview]').forEach(link => {
    const select = () => {
      active = link === contact;
      hero.toggleAttribute('data-contact-face', active);
      reconcile();
    };
    link.addEventListener('pointerenter', select);
    link.addEventListener('focus', select);
  });
  reconcile();
})();
