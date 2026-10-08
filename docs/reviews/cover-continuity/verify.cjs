const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium, firefox, webkit } = require('playwright');
const root = path.resolve(__dirname, '../../..');
const output = process.env.COVER_OUTPUT ? path.resolve(process.env.COVER_OUTPUT) : __dirname;
fs.mkdirSync(output, { recursive: true });
const mime = { html: 'text/html', css: 'text/css', js: 'application/javascript', png: 'image/png', webp: 'image/webp', jpg: 'image/jpeg', mp4: 'video/mp4', svg: 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = path.join(root, decodeURIComponent(url.pathname));
  if (url.pathname.endsWith('/')) file = path.join(file, 'index.html');
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404).end('Missing'); return; }
    res.setHeader('Content-Type', mime[path.extname(file).slice(1)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]), end = range[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;
      res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1 });
      fs.createReadStream(file, { start, end }).pipe(res);
    } else { res.setHeader('Content-Length', stat.size); fs.createReadStream(file).pipe(res); }
  });
});
const selected = process.env.COVER_CASES?.split(',');
const reports = selected && fs.existsSync(path.join(output, 'validation-2026-10-08.json')) ? JSON.parse(fs.readFileSync(path.join(output, 'validation-2026-10-08.json'), 'utf8')).filter(r => !selected.includes(r.name)) : [];
let base;
const settle = p => p.waitForTimeout(950);
const imageReady = p => p.locator('[data-project-id="13"] > img').evaluate(i => i.decode());
async function prepare(p) {
  await p.goto(base + '/work/');
  await p.locator('[data-work-filter="photography"]').click();
  const tile = p.locator('[data-project-id="13"]');
  await tile.scrollIntoViewIfNeeded();
  await imageReady(p);
  await p.waitForTimeout(300);
  return { tile, before: await p.evaluate(() => scrollY) };
}
async function run(browser, name, options, test) {
  if (selected && !selected.includes(name)) return;
  const events = [], errors = [];
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ...options });
  await ctx.exposeBinding('traceCover', (_, e) => events.push(e));
  await ctx.addInitScript(() => {
    window.addEventListener('pagereveal', e => {
      const report = state => traceCover({ url: location.pathname + location.search, state,
        animations: document.getAnimations().map(a => ({ name: a.animationName, duration: a.effect?.getTiming().duration, easing: a.effect?.getTiming().easing })).filter(a => a.name) });
      if (e.viewTransition) e.viewTransition.ready.then(() => report('ready'), () => report('skipped'));
      else report('none');
    });
  });
  const p = await ctx.newPage();
  p.setDefaultTimeout(12000);
  p.on('pageerror', e => errors.push(e.message));
  const result = { name, browser: browser.version(), events, errors };
  try {
    result.details = await test(p, ctx, events);
    assert.deepEqual(errors, [], 'JavaScript page errors');
    assert.equal(await p.locator('[data-frsr-transition]').count(), 0, 'Transition names leaked');
    result.pass = true;
  } catch (e) { result.pass = false; result.failure = e.stack; result.state = await p.evaluate(() => ({ url: location.href, scrollY, journey: sessionStorage.getItem('frsr:cover-journey:v1'), pending: sessionStorage.getItem('frsr:cover-transition:v1') })).catch(() => null); await p.screenshot({ path: path.join(output, name + '-failure.png') }).catch(() => {}); }
  await ctx.close();
  reports.push(result);
  console.log(JSON.stringify({ name, pass: result.pass, details: result.details, failure: result.failure }));
  fs.writeFileSync(path.join(output, 'validation-2026-10-08.json'), JSON.stringify(reports, null, 2) + '\n');
}
async function journey(p, ctx, events, expectMotion, touch = false) {
  const { tile, before: preparedScroll } = await prepare(p);
  if (touch) await tile.tap(); else await tile.click();
  await p.waitForURL('**/project/?id=13'); await settle(p);
  const before = await p.evaluate(() => JSON.parse(sessionStorage.getItem('frsr:cover-journey:v1')).scrollY);
  assert.equal(await p.locator('[data-project-title]').innerText(), 'CALL HER ANGELINA');
  assert((await p.locator('.back-link').getAttribute('href')).endsWith('/work/?filter=photography'));
  assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await p.locator('.back-link').click(); await p.waitForURL('**/work/?filter=photography'); await settle(p);
  const after = await p.evaluate(() => scrollY);
  assert(Math.abs(before - after) < 3, `Explicit return lost scroll: ${before} -> ${after}`);
  assert.equal(await p.locator('[data-work-filter="photography"]').getAttribute('aria-pressed'), 'true');
  const motion = events.filter(e => e.state === 'ready' && e.animations.some(a => a.name.includes('frsr-cover'))).length;
  if (expectMotion !== null) assert.equal(motion, expectMotion ? 2 : 0, 'Opening and return cover animations');
  await tile.click(); await p.waitForURL('**/project/?id=13'); await settle(p);
  await p.evaluate(() => history.back()); await p.waitForURL('**/work/?filter=photography', { waitUntil: 'commit' }); await settle(p);
  assert(Math.abs(before - await p.evaluate(() => scrollY)) < 3, 'Browser Back lost scroll');
  await p.evaluate(() => history.forward()); await p.waitForURL('**/project/?id=13', { waitUntil: 'commit' }); await settle(p);
  return { preparedScroll, before, after, motion, backForward: true };
}
async function main() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ channel: 'chrome', headless: true, ignoreDefaultArgs: ['--disable-back-forward-cache'] });
  try {
    await run(browser, 'chromium-desktop', {}, (p, c, e) => journey(p, c, e, true));
    await run(browser, 'chromium-mobile', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, (p, c, e) => journey(p, c, e, true, true));
    await run(browser, 'reduced-motion', { reducedMotion: 'reduce' }, (p, c, e) => journey(p, c, e, false));
    await run(browser, 'disabled-transition', {}, async (p, c, e) => {
      await c.route('**/cover-continuity.css', r => r.fulfill({ contentType: 'text/css', body: '@view-transition { navigation: none; }' }));
      if (process.env.COVER_DEBUG) await c.addInitScript(() => {
        const log = label => traceCover({ label, url: location.pathname + location.search, y: scrollY, height: document.documentElement?.scrollHeight, coverTop: document.querySelector('[data-project-id="13"]')?.getBoundingClientRect().top, font: document.fonts.status });
        for (const event of ['DOMContentLoaded', 'load', 'pageshow', 'pagereveal', 'scroll']) window.addEventListener(event, () => log(event));
        document.fonts.ready.then(() => log('fonts-ready'));
      });
      return journey(p, c, e, false);
    });
    await run(browser, 'keyboard-modifiers', {}, async (p, c, e) => {
      const { tile } = await prepare(p);
      const original = p.url();
      const popupPromise = c.waitForEvent('page');
      await tile.click({ modifiers: ['Control'] });
      const popup = await popupPromise; await popup.waitForLoadState();
      assert.equal(p.url(), original);
      assert.equal(await p.evaluate(() => sessionStorage.getItem('frsr:cover-journey:v1')), null);
      await popup.close();
      const middlePromise = c.waitForEvent('page');
      await tile.click({ button: 'middle' });
      const middle = await middlePromise; await middle.waitForLoadState(); await middle.close();
      assert.equal(p.url(), original);
      await tile.focus(); await p.keyboard.press('Enter');
      await p.waitForURL('**/project/?id=13'); await settle(p);
      assert(e.some(v => v.state === 'ready'), 'Keyboard activation did not animate');
      return { controlClick: true, middleClick: true, enter: true };
    });
    await run(browser, 'direct-entry', {}, async (p) => {
      await p.goto(base + '/project/?id=13'); await settle(p);
      await p.locator('.back-link').click(); await p.waitForURL('**/work/'); await settle(p);
      assert.equal(await p.evaluate(() => scrollY), 0);
      await p.goto(base + '/project/?id=13'); await p.locator('.site-nav > a[href="/services/"]').click();
      await p.waitForURL('**/services/');
      return { work: true, unrelatedNavigation: true };
    });
    await run(browser, 'video-pair-fallback', {}, async (p, c, e) => {
      for (const id of [1, 6, 11]) {
        await p.goto(base + '/work/'); await p.locator(`[data-project-id="${id}"]`).click();
        await p.waitForURL(`**/project/?id=${id}`); await settle(p);
      }
      assert(!e.some(v => v.state === 'ready'), 'Fallback media animated');
      return { projects: [1, 6, 11] };
    });
    await run(browser, 'mismatched-and-offscreen', {}, async (p, c, e) => {
      const { tile, before } = await prepare(p);
      await tile.click(); await p.waitForURL('**/project/?id=13'); await settle(p);
      const count = e.filter(v => v.state === 'ready').length;
      await p.evaluate(() => scrollTo(0, document.body.scrollHeight));
      await p.locator('.project-nav__grid').click(); await p.waitForURL('**/work/?filter=photography'); await settle(p);
      assert.equal(e.filter(v => v.state === 'ready').length, count, 'Offscreen hero animated');
      assert(Math.abs(before - await p.evaluate(() => scrollY)) < 3);
      await p.route('**/projects-data.js', async r => {
        const response = await r.fetch();
        await r.fulfill({ response, body: (await response.text()) + '\nwindow.fashionrockstarProjects.find(p=>p.id===13).cover.src="/assets/images/projects/project-03-mansaworld/fr4.jpg";' });
      });
      await tile.click(); await p.waitForURL('**/project/?id=13'); await settle(p);
      assert.equal(e.filter(v => v.state === 'ready').length, count, 'Mismatched hero animated');
      return { offscreenFallback: true, mismatchFallback: true };
    });
    await run(browser, 'slow-unloaded-images', {}, async (p, c, e) => {
      await c.route('**/call-her-angelina/*', async r => { await new Promise(resolve => setTimeout(resolve, 1800)); await r.continue().catch(() => {}); });
      await p.goto(base + '/work/', { waitUntil: 'domcontentloaded' });
      await p.locator('[data-project-id="13"]').click();
      await p.waitForURL('**/project/?id=13'); await settle(p);
      assert.equal(await p.locator('[data-project-title]').innerText(), 'CALL HER ANGELINA');
      assert(!e.some(v => v.state === 'ready'), 'Unloaded image animated');
      return { nativeNavigation: true };
    });
    await run(browser, 'slow-destination-image', {}, async (p, c, e) => {
      const { tile } = await prepare(p);
      await c.route('**/call-her-angelina/*', async r => { await new Promise(resolve => setTimeout(resolve, 1800)); await r.continue().catch(() => {}); });
      await tile.click(); await p.waitForURL('**/project/?id=13', { waitUntil: 'domcontentloaded' }); await settle(p);
      assert(!e.some(v => v.state === 'ready'), 'Slow destination image animated');
      assert.equal(await p.locator('[data-project-title]').innerText(), 'CALL HER ANGELINA');
      return { nativeNavigation: true };
    });
    await run(browser, 'font-correction-cancels-on-input', {}, async (p, c) => {
      await c.addInitScript(() => {
        if (location.pathname === '/work/' && location.search) {
          const loaded = document.fonts.ready;
          let release;
          const held = new Promise(resolve => { release = resolve; });
          Object.defineProperty(document.fonts, 'status', { configurable: true, get: () => 'loading' });
          Object.defineProperty(document.fonts, 'ready', { configurable: true, get: () => loaded.then(() => held) });
          window.releaseFonts = release;
        }
      });
      const { tile } = await prepare(p);
      await tile.click(); await p.waitForURL('**/project/?id=13'); await settle(p);
      await p.locator('.back-link').click(); await p.waitForURL('**/work/?filter=photography'); await settle(p);
      await p.mouse.wheel(0, 450); await p.waitForTimeout(500);
      const chosenPosition = await p.evaluate(() => scrollY);
      await p.evaluate(() => window.releaseFonts()); await p.waitForTimeout(300);
      assert.equal(await p.evaluate(() => scrollY), chosenPosition, 'Late fonts overrode visitor scrolling');
      return { chosenPosition, preserved: true };
    });
    await run(browser, 'legacy-event-fallback', {}, async (p, c, e) => {
      await c.route('**/cover-continuity.css', r => r.fulfill({ contentType: 'text/css', body: '@view-transition { navigation: none; }' }));
      await c.addInitScript(() => {
        let object = window;
        while (object) { if (Object.hasOwn(object, 'onpagereveal')) delete object.onpagereveal; object = Object.getPrototypeOf(object); }
        for (const type of ['pageswap', 'pagereveal']) window.addEventListener(type, event => event.stopImmediatePropagation());
      });
      return journey(p, c, e, false);
    });
    await run(browser, 'blocked-storage', {}, async (p, c, e) => {
      await c.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('blocked', 'SecurityError'); }; });
      const { tile } = await prepare(p); await tile.click(); await p.waitForURL('**/project/?id=13'); await settle(p);
      await p.locator('.back-link').click(); await p.waitForURL('**/work/'); await settle(p);
      assert(!e.some(v => v.state === 'ready'));
      return { nativeNavigation: true };
    });
  } finally { await browser.close(); }
  for (const [engine, type] of [['webkit', webkit], ['firefox', firefox]]) {
    if (selected && !selected.some(name => name.startsWith(engine))) continue;
    let b;
    try {
      b = await type.launch({ headless: true });
      await run(b, engine + '-desktop', {}, (p,c,e) => journey(p,c,e,null));
      if (engine === 'webkit') await run(b, 'webkit-mobile', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, (p,c,e) => journey(p,c,e,null,true));
    } catch (e) { reports.push({ name: engine, unavailable: e.message.split('\n')[0] }); console.log(engine, e.message); }
    finally { await b?.close(); }
  }
  fs.writeFileSync(path.join(output, 'validation-2026-10-08.json'), JSON.stringify(reports, null, 2) + '\n');
  server.close();
  if (reports.some(r => r.pass === false)) process.exitCode = 1;
}
if (require.main === module) main().catch(e => { console.error(e); server.close(); process.exitCode = 1; });
module.exports = { server, root };
