// Isolated lifecycle checks. Run alongside real-browser navigation verification.
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../..');
const source = fs.readFileSync(path.join(root, 'assets/js/cover-continuity.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/css/cover-continuity.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'work/index.html'), 'utf8');
const catalog = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/js/projects-data.js'), 'utf8'), catalog);
const cards = new Map([...html.matchAll(/<a\b[^>]*data-project-id="(\d+)"[^>]*>([\s\S]*?)<\/a>/g)].map(([_, id, body]) => [Number(id), [...body.matchAll(/<(img|video)\b([^>]*)>/g)].map(([__, tag, text]) => {
  const attrs = Object.fromEntries([...text.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
  return { type: tag === 'video' ? 'video' : 'image', src: attrs.src || attrs['data-src'], poster: attrs.poster };
})]));
const tick = () => new Promise(resolve => setImmediate(resolve));
function makeMedia(item, cold = false) {
  const listeners = new Map(); let resolveDecode;
  const media = {
    tagName: item.type === 'video' ? 'VIDEO' : 'IMG', src: item.src, poster: item.poster || '', dataset: {},
    complete: !cold, naturalWidth: cold ? 0 : 1280, readyState: cold ? 0 : 2, currentTime: cold ? 0 : 3.25,
    duration: 20, seeking: false, controls: true, muted: false, paused: true,
    getAttribute(name) { return this[name] || null; }, closest: () => null,
    getBoundingClientRect: () => ({ width: 600, height: 400, top: 100, bottom: 500 }),
    addEventListener(type, cb) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(cb); },
    removeEventListener(type, cb) { listeners.get(type)?.delete(cb); },
    decode() { return new Promise(resolve => { resolveDecode = resolve; }); },
    settle() {
      this.complete = true; this.naturalWidth = 1280; resolveDecode?.();
      this.readyState = 1; this.fire('loadedmetadata'); this.readyState = 2; this.seeking = false; this.fire('seeked');
    },
    fire(type) { [...(listeners.get(type) || [])].forEach(cb => cb({ type })); },
    play() { throw Error('Transition must not start playback'); },
    listenerCount: () => [...listeners.values()].reduce((sum, set) => sum + set.size, 0)
  };
  media.style = { removeProperty() { delete media.style.viewTransitionName; } };
  return media;
}
function page(id, kind, items, storage, options = {}) {
  const origin = 'https://preview.example', work = origin + '/work/?filter=photography', project = origin + `/project/?id=${id}`;
  const current = kind === 'work' ? work : project;
  const media = items.map(item => makeMedia(item, !!options.cold));
  const windowEvents = {}, documentEvents = {}, timers = new Set();
  const tile = { href: project, target: '', hasAttribute: () => false, querySelectorAll: () => media };
  const rootNode = { dataset: {}, hasAttribute(name) { return name === 'data-cover-waiting' && 'coverWaiting' in this.dataset; } };
  const holds = [{ animationName: 'frsr-cover-hold', finished: false, finish() { this.finished = true; } }];
  const document = {
    documentElement: rootNode, fonts: { status: 'loaded' },
    querySelector: selector => selector.startsWith('.work-tile[') && kind === 'work' ? tile : null,
    querySelectorAll(selector) {
      if (selector === '.project-hero > img, .project-hero > video') return kind === 'project' ? media : [];
      if (selector === '.work-tile video, .project-hero > video') return media.filter(m => m.tagName === 'VIDEO');
      if (selector === '[data-frsr-transition]') return media.filter(m => 'frsrTransition' in m.dataset);
      return [];
    },
    addEventListener(type, cb) { documentEvents[type] = cb; }, getAnimations: () => holds
  };
  let scrollY = 812;
  const window = { addEventListener(type, cb) { (windowEvents[type] ||= []).push(cb); }, removeEventListener() {}, scrollTo({ top }) { scrollY = top; } };
  class Poster { constructor() { this.complete = true; this.naturalWidth = 1280; } decode() { return Promise.resolve(); } }
  vm.runInNewContext(source, {
    window, document, Image: Poster, URL, Date, location: { origin, href: current }, innerHeight: 900, scrollX: 0, scrollY,
    matchMedia: () => ({ matches: !!options.reduce }),
    sessionStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    setTimeout(fn) { timers.add(fn); return fn; }, clearTimeout: fn => timers.delete(fn)
  });
  return {
    media, rootNode, holds, timers,
    click() { documentEvents.click({button: 0, target: { closest: () => tile }}); },
    swap(to) { let skipped = false; windowEvents.pageswap[0]({ activation: { entry: { url: to === 'work' ? work : project } }, viewTransition: { ready: Promise.resolve(), finished: new Promise(() => {}), skipTransition() { skipped = true; } } }); return skipped; },
    reveal() {
      let skipped = false, ready, finish;
      windowEvents.pagereveal[0]({ viewTransition: { ready: new Promise(resolve => { ready = resolve; }), finished: new Promise(resolve => { finish = resolve; }), skipTransition() { skipped = true; } } });
      return { skipped, ready, finish };
    },
    hide() { (windowEvents.pagehide || []).forEach(cb => cb()); },
    get scrollY() { return scrollY; }
  };
}
(async () => {
  let navigations = 0;
  for (const project of catalog.window.fashionrockstarProjects) {
    const items = Array.isArray(project.cover) ? project.cover : [project.cover];
    assert(cards.has(project.id), 'Project is missing from Work');
    const storage = new Map(), work = page(project.id, 'work', cards.get(project.id), storage);
    work.click(); assert.equal(work.swap('project'), false, `${project.id}: opening source`);
    const dest = page(project.id, 'project', items, storage, { cold: true }), incoming = dest.reveal();
    assert.equal(incoming.skipped, false, `${project.id}: opening destination`);
    assert.equal(new Set(dest.media.map(m => m.style.viewTransitionName)).size, items.length, 'Unique panel names');
    incoming.ready(); await tick(); assert.equal(dest.rootNode.dataset.coverMotion, 'open');
    dest.media.forEach(m => m.settle()); await tick(); incoming.finish(); await tick();
    for (const m of dest.media) { assert(m.paused); assert(m.controls); assert(!m.muted); assert.equal(m.listenerCount(), 0); }
    assert.equal(dest.timers.size, 0);
    assert.equal(dest.swap('work'), false, `${project.id}: return source`);
    const back = page(project.id, 'work', cards.get(project.id), storage, { cold: true }), outgoing = back.reveal();
    assert.equal(outgoing.skipped, false, `${project.id}: return destination`);
    outgoing.ready(); await tick(); back.media.forEach(m => m.settle()); await tick(); outgoing.finish(); await tick();
    assert.equal(back.rootNode.dataset.coverMotion, 'return'); assert.equal(back.scrollY, 812);
    assert.equal(back.timers.size, 0); assert(back.media.every(m => !('frsrTransition' in m.dataset)));
    navigations += 2;
  }
  const video = [{ type: 'video', src: '/video.mp4', poster: '/poster.jpg' }];
  const storage = new Map(), work = page(1, 'work', video, storage); work.click(); work.swap('project');
  const slow = page(1, 'project', video, storage, { cold: true }), transition = slow.reveal(); transition.ready(); await tick();
  assert.equal(slow.media[0].currentTime, 0); assert(slow.timers.size > 0);
  slow.media[0].readyState = 1; slow.media[0].fire('loadedmetadata'); assert.equal(slow.media[0].currentTime, 3.25);
  slow.hide(); assert.equal(slow.timers.size, 0); assert.equal(slow.media[0].listenerCount(), 0);
  const reduced = page(1, 'work', video, new Map(), { reduce: true }); reduced.click(); assert(reduced.swap('project'));
  assert(css.includes('frsr-cover-hold 1800ms')); assert(css.includes('::view-transition-group(frsr-cover-2)'));
  console.log(`PASS: all ${cards.size} project mappings, ${navigations} cold arrivals; unique paired panels; video seek/cancellation; playback preservation; reduced motion; scroll and snapshot cleanup.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
