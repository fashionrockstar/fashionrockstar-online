(() => {
  'use strict';

  const story = document.querySelector('.about-story');
  const tablist = story?.querySelector('.about-tabs');
  if (!tablist) return;

  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
  if (!tabs.length || panels.some((panel) => !panel)) return;

  const activate = (index, focus = false) => {
    tabs.forEach((tab, position) => {
      const selected = position === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[position].hidden = !selected;
    });
    if (focus) tabs[index].focus({ preventScroll: true });
  };

  // Reserve the tallest chapter so switching near the footer preserves scroll.
  const measurePanels = () => {
    const heights = panels.map((panel) => {
      panel.classList.add('is-measuring');
      const height = Math.ceil(panel.getBoundingClientRect().height);
      panel.classList.remove('is-measuring');
      return height;
    });
    story.style.setProperty('--about-panel-height', `${Math.max(...heights)}px`);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const directions = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      let next;
      if (Object.hasOwn(directions, event.key)) next = (index + directions[event.key] + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(next, true);
    });
  });

  activate(0);
  story.dataset.aboutTabsReady = '';
  tablist.hidden = false;
  measurePanels();
  document.fonts.ready.then(measurePanels);

  let resizeFrame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(measurePanels);
  }, { passive: true });
})();
