(() => {
  'use strict';

  const toggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');

  const closeMenu = () => {
    if (!toggle || !siteNav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu';
    siteNav.classList.remove('is-open');
    siteNav.inert = window.innerWidth <= 760;
  };

  if (toggle && siteNav) {
    closeMenu();
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.textContent = isOpen ? 'Menu' : 'Close';
      siteNav.classList.toggle('is-open', !isOpen);
      siteNav.inert = isOpen && window.innerWidth <= 760;
    });

    siteNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      closeMenu();
    });
  }

  const workVideos = document.querySelectorAll('[data-work-gallery] video');

  workVideos.forEach((video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;

    const startPlayback = () => {
      const playback = video.play();
      if (playback) playback.catch(() => {});
    };

    if (video.readyState >= 2) startPlayback();
    else video.addEventListener('canplay', startPlayback, { once: true });
  });

  const workGallery = document.querySelector('[data-work-gallery]');
  const workFilters = document.querySelectorAll('[data-work-filter]');

  if (workGallery && workFilters.length) {
    const validFilters = new Set(['all', 'creative-direction', 'styling', 'photography', 'beauty']);
    const workRows = Array.from(workGallery.querySelectorAll('.work-row'));

    const applyWorkFilter = (requestedFilter, updateUrl = true) => {
      const filter = validFilters.has(requestedFilter) ? requestedFilter : 'all';

      workFilters.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.workFilter === filter));
      });

      workRows.forEach((row) => {
        const tiles = Array.from(row.querySelectorAll('.work-tile[data-disciplines]'));
        let visibleTiles = 0;

        tiles.forEach((tile) => {
          const disciplines = tile.dataset.disciplines.split(/\s+/);
          const isVisible = filter === 'all' || disciplines.includes(filter);
          tile.hidden = !isVisible;
          if (isVisible) visibleTiles += 1;
        });

        row.hidden = visibleTiles === 0;
        row.classList.toggle('work-row--filtered-single', row.classList.contains('work-row--pair') && visibleTiles === 1);
      });

      workGallery.querySelectorAll('.work-row:not([hidden]) video').forEach((video) => {
        const playback = video.play();
        if (playback) playback.catch(() => {});
      });

      if (updateUrl) {
        const url = new URL(window.location.href);
        if (filter === 'all') url.searchParams.delete('filter');
        else url.searchParams.set('filter', filter);
        window.history.replaceState({ workFilter: filter }, '', `${url.pathname}${url.search}${url.hash}`);
      }
    };

    workFilters.forEach((button) => {
      button.addEventListener('click', () => applyWorkFilter(button.dataset.workFilter));
    });

    const initialFilter = new URLSearchParams(window.location.search).get('filter') || 'all';
    applyWorkFilter(initialFilter, false);
  }

  const projectRoot = document.querySelector('[data-project-page]');

  if (projectRoot) {
    const projects = [
      { title: 'BROKENHEART X FASHIONROCKSTAR [M.A.D 2026]', role: 'CREATIVE DIRECTOR - LEAD STYLIST', year: '2026' },
      { title: 'MICAELA GOMES [M.A.D 2026]', role: 'PHOTOGRAPHY - CREATIVE DIRECTION - SET DESIGN', year: '2026' },
      { title: 'MANSAWORLD', role: 'PHOTOGRAPHY - CREATIVE DIRECTION', year: '2026' },
      { title: 'MZRABELLE: PINK SUMMER', role: 'Photography', year: '2026' },
      { title: 'KAINE BASQUIAT [MONTREALITY X MURAL]', role: 'CREATIVE DIRECTION AND MAKEUP', year: '2026' }
    ];

    const requestedId = Number(new URLSearchParams(window.location.search).get('id') || '1');
    const id = Number.isInteger(requestedId) && requestedId >= 1 && requestedId <= projects.length ? requestedId : 1;
    const project = projects[id - 1];
    const previousId = id === 1 ? projects.length : id - 1;
    const nextId = id === projects.length ? 1 : id + 1;
    const setText = (selector, value) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = value;
    };

    const setProjectHero = () => {
      const image = document.querySelector('[data-project-image]');
      if (!image) return;

      const projectHeroes = {
        2: '/assets/images/projects/project-02/cover.jpg',
        3: '/assets/images/projects/project-03-mansaworld/fr4.jpg',
        4: '/assets/images/projects/project-04/_DSC9338-copy.jpg',
        5: '/assets/images/projects/project-05-kaine-basquiat/dsc7459-wide.jpg'
      };

      if (projectHeroes[id]) {
        const photo = document.createElement('img');
        photo.src = projectHeroes[id];
        photo.alt = `${project.title} project image`;
        image.closest('.project-hero')?.classList.add('project-hero--natural');
        image.replaceWith(photo);
        return;
      }

      const video = document.createElement('video');
      video.src = '/assets/video/project-01-cover.mp4';
      video.autoplay = true;
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('muted', '');
      video.setAttribute('aria-label', `${project.title} project video`);
      image.replaceWith(video);

      const playback = video.play();
      if (playback) playback.catch(() => {});
    };

    const setProjectDetails = () => {
      const projectMedia = {
        1: [
          { type: 'image', src: '/assets/images/projects/project-01-brokenheart/dsc6257-2.jpg', wide: true, width: 2400, height: 1600, alt: 'BROKENHEART x FASHIONROCKSTAR campaign portrait with black fabric covering the model’s face.' },
          { type: 'image', src: '/assets/images/projects/project-01-brokenheart/1111.jpg', wide: true, width: 2400, height: 1600, alt: 'BROKENHEART x FASHIONROCKSTAR campaign: a model in a black outfit seated on a transparent chair.' },
          { type: 'image', src: '/assets/images/projects/project-01-brokenheart/feet1.jpg', wide: true, width: 2400, height: 1600, alt: 'BROKENHEART x FASHIONROCKSTAR event artwork featuring black heels and clothing, with August 22, 9:30 PM, Place des Arts and M.A.D typography.' }
        ],
        2: [
          { type: 'video', src: '/assets/video/project-02-editorial.mp4', wide: true },
          { type: 'image', src: '/assets/images/projects/project-02/image-01.jpg' },
          { type: 'image', src: '/assets/images/projects/project-02/image-02.jpg' },
          { type: 'image', src: '/assets/images/projects/project-02/image-03.jpg' },
          { type: 'image', src: '/assets/images/projects/project-02/image-04.jpg' }
        ],
        3: [
          { type: 'image', src: '/assets/images/projects/project-03-mansaworld/img-1184.jpg' },
          { type: 'image', src: '/assets/images/projects/project-03-mansaworld/fr5-copy.jpg' },
          { type: 'image', src: '/assets/images/projects/project-03-mansaworld/fr2.jpg' },
          { type: 'image', src: '/assets/images/projects/project-03-mansaworld/part-1.jpg' },
          { type: 'image', src: '/assets/images/projects/project-03-mansaworld/img-1178.jpg' },
          { type: 'image', src: '/assets/images/projects/project-03-mansaworld/part-2-2.jpg' },
          { type: 'image', src: '/assets/images/projects/project-03-mansaworld/fr1.jpg' },
          { type: 'image', src: '/assets/images/projects/project-03-mansaworld/img-1163.jpg' },
          { type: 'image', src: '/assets/images/projects/project-03-mansaworld/part-3.jpg' },
          { type: 'image', src: '/assets/images/projects/project-03-mansaworld/3.jpg' },
          { type: 'image', src: '/assets/images/projects/project-03-mansaworld/5.jpg' },
          { type: 'image', src: '/assets/images/projects/project-03-mansaworld/funmi-2-1.jpg' },
          { type: 'image', src: '/assets/images/projects/project-03-mansaworld/funmi-3.jpg' },
          { type: 'image', src: '/assets/images/projects/project-03-mansaworld/funmi-4.jpg' }
        ],
        4: [
          { type: 'video', src: '/assets/video/projects/project-04/Video-by-fashionrockstar.online.mp4' },
          { type: 'video', src: '/assets/video/projects/project-04/Video-by-fashionrockstar.online.mp4' },
          { type: 'image', src: '/assets/images/projects/project-04/second-face-close-up-copy.jpg', wide: true }
        ],
        5: [
          { type: 'image', src: '/assets/images/projects/project-05-kaine-basquiat/dsc7164.jpg' },
          { type: 'image', src: '/assets/images/projects/project-05-kaine-basquiat/dsc7411.jpg' },
          { type: 'image', src: '/assets/images/projects/project-05-kaine-basquiat/dsc7449.jpg' },
          { type: 'image', src: '/assets/images/projects/project-05-kaine-basquiat/dsc7450.jpg' },
          { type: 'image', src: '/assets/images/projects/project-05-kaine-basquiat/dsc7478.jpg' },
          { type: 'image', src: '/assets/images/projects/project-05-kaine-basquiat/09.jpg' },
          { type: 'image', src: '/assets/images/projects/project-05-kaine-basquiat/stand.jpg' }
        ]
      };
      const media = projectMedia[id];

      const gallery = document.querySelector('.project-images');
      if (!gallery) return;
      gallery.hidden = !media || media.length === 0;
      if (gallery.hidden) {
        gallery.replaceChildren();
        return;
      }

      gallery.classList.add('project-images--natural');
      gallery.replaceChildren();

      media.forEach((item, index) => {
        const figure = document.createElement('figure');
        let video;
        if (item.wide) figure.className = 'project-image project-image--wide';

        if (item.type === 'video') {
          video = document.createElement('video');
          video.src = item.src;
          video.autoplay = true;
          video.muted = true;
          video.defaultMuted = true;
          video.loop = true;
          video.playsInline = true;
          video.preload = 'metadata';
          video.setAttribute('muted', '');
          video.setAttribute('aria-label', `${project.title} project video`);
          figure.appendChild(video);
        } else {
          const image = document.createElement('img');
          image.src = item.src;
          image.alt = item.alt || `${project.title} project image ${index + 1}`;
          if (item.width && item.height) {
            image.width = item.width;
            image.height = item.height;
          }
          image.loading = 'lazy';
          figure.appendChild(image);
        }

        gallery.appendChild(figure);

        if (video) {
          const playback = video.play();
          if (playback) playback.catch(() => {});
        }
      });
    };

    setText('[data-project-title]', project.title);
    setText('[data-project-role]', project.role);
    setText('[data-project-year]', project.year);
    setProjectHero();
    setProjectDetails();

    const previousLink = document.querySelector('[data-project-prev]');
    const nextLink = document.querySelector('[data-project-next]');

    if (previousLink) {
      previousLink.href = `/project/?id=${previousId}`;
      previousLink.setAttribute('aria-label', `Previous project: ${projects[previousId - 1].title}`);
    }

    if (nextLink) {
      nextLink.href = `/project/?id=${nextId}`;
      nextLink.setAttribute('aria-label', `Next project: ${projects[nextId - 1].title}`);
    }

    document.title = `${project.title} — FASHIONROCKSTAR.ONLINE`;
  }

  const projectType = document.querySelector('#project-type');

  if (projectType) {
    const requestedService = new URLSearchParams(window.location.search).get('service');
    const allowedServices = ['creative-direction', 'photography', 'styling', 'beauty'];

    if (allowedServices.includes(requestedService)) {
      projectType.value = requestedService;
    }
  }
})();
