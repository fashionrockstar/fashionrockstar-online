(() => {
  'use strict';

  const toggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (toggle && siteNav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.textContent = open ? 'Menu' : 'Close';
      siteNav.classList.toggle('is-open', !open);
    });
  }

  const navVisual = document.querySelector('#nav-visual');
  const editorialLinks = document.querySelectorAll('.editorial-menu [data-image]');

  if (navVisual && editorialLinks.length) {
    editorialLinks.forEach((link) => {
      const source = link.dataset.image;
      if (source) {
        const preload = new Image();
        preload.src = source;
      }

      const swapImage = () => {
        if (!source || navVisual.getAttribute('src') === source) return;
        navVisual.classList.add('is-changing');
        const next = new Image();
        next.onload = () => {
          navVisual.src = source;
          navVisual.alt = link.textContent.trim() + ' editorial image placeholder';
          requestAnimationFrame(() => navVisual.classList.remove('is-changing'));
        };
        next.src = source;
      };

      link.addEventListener('pointerenter', swapImage);
      link.addEventListener('focus', swapImage);
    });
  }

  const projectRoot = document.querySelector('[data-project-page]');
  if (projectRoot) {
    const projects = [
      { title: 'Lovepuccii', role: 'Creative Direction', year: '2026' },
      { title: 'New Silhouette', role: 'Styling', year: '2026' },
      { title: 'Afterimage', role: 'Beauty / Image', year: '2025' },
      { title: 'Run / 04', role: 'Photography', year: '2026' },
      { title: 'Nocturne', role: 'Creative Direction', year: '2025' },
      { title: 'Concrete Bloom', role: 'Photography', year: '2026' },
      { title: 'Object Study', role: 'Creative Direction', year: '2025' },
      { title: 'Gesture', role: 'Styling', year: '2026' }
    ];

    const rawId = Number.parseInt(new URLSearchParams(window.location.search).get('id') || '1', 10);
    const id = Number.isFinite(rawId) && rawId >= 1 && rawId <= projects.length ? rawId : 1;
    const project = projects[id - 1];
    const previous = id === 1 ? projects.length : id - 1;
    const next = id === projects.length ? 1 : id + 1;
    const cover = '/assets/images/project-' + String(id).padStart(2, '0') + '-cover.jpg';
    const detailIds = [next, ((id + 1) % projects.length) + 1, previous];

    const setText = (selector, value) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = value;
    };

    setText('[data-project-title]', project.title);
    setText('[data-project-role]', project.role);
    setText('[data-project-year]', project.year);

    const hero = document.querySelector('[data-project-image]');
    if (hero) {
      hero.src = cover;
      hero.alt = project.title + ' project hero placeholder';
    }

    ['one', 'two', 'three'].forEach((name, index) => {
      const image = document.querySelector('[data-project-detail-' + name + ']');
      if (!image) return;
      image.src = '/assets/images/project-' + String(detailIds[index]).padStart(2, '0') + '-cover.jpg';
      image.alt = project.title + ' additional image placeholder ' + (index + 1);
    });

    const previousLink = document.querySelector('[data-project-prev]');
    const nextLink = document.querySelector('[data-project-next]');
    if (previousLink) previousLink.href = '/project/?id=' + previous;
    if (nextLink) nextLink.href = '/project/?id=' + next;
    document.title = project.title + ' — FASHIONROCKSTAR.ONLINE';
  }
})();
