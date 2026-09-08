(() => {
  'use strict';

  const toggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');

  const closeMenu = () => {
    if (!toggle || !siteNav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu';
    siteNav.classList.remove('is-open');
  };

  if (toggle && siteNav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.textContent = isOpen ? 'Menu' : 'Close';
      siteNav.classList.toggle('is-open', !isOpen);
    });

    siteNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  const preview = document.querySelector('#nav-preview');
  const previewLinks = document.querySelectorAll('[data-preview]');

  if (preview && previewLinks.length) {
    previewLinks.forEach((link) => {
      const source = link.dataset.preview;
      if (!source) return;

      const preload = new Image();
      preload.src = source;

      const showPreview = () => {
        if (preview.getAttribute('src') === source) return;
        preview.classList.add('is-changing');

        const nextImage = new Image();
        nextImage.onload = () => {
          preview.src = source;
          preview.alt = `${link.textContent.trim()} preview`;
          requestAnimationFrame(() => preview.classList.remove('is-changing'));
        };
        nextImage.src = source;
      };

      link.addEventListener('pointerenter', showPreview);
      link.addEventListener('focus', showPreview);
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

  const projectRoot = document.querySelector('[data-project-page]');

  if (projectRoot) {
    const projects = [
      { title: 'BROKENHEARTXFASHIONROCKSTAR [M.A.D 2026]', role: 'CREATIVE DIRECTOR - LEAD STYLIST', year: '2026' },
      { title: 'MICAELA GOMES [M.A.D 2026]', role: 'PHOTOGRAPHY - CREATIVE DIRECTION - SET DESIGN', year: '2026' },
      { title: 'MANSAWORLD', role: 'PHOTOGRAPHY - CREATIVE DIRECTION', year: '2026' },
      { title: 'MZRABELLE: PINK SUMMER', role: 'Photography', year: '2026' },
      { title: 'KAINE BASQUIAT [MONTREALITY X MURAL]', role: 'CREATIVE DIRECTION AND MAKEUP', year: '2026' },
      { title: 'Concrete Bloom', role: 'Photography', year: '2026' },
      { title: 'Object Study', role: 'Creative Direction', year: '2025' },
      { title: 'Gesture', role: 'Styling', year: '2026' }
    ];

    const requestedId = Number.parseInt(new URLSearchParams(window.location.search).get('id') || '1', 10);
    const id = Number.isInteger(requestedId) && requestedId >= 1 && requestedId <= projects.length ? requestedId : 1;
    const project = projects[id - 1];
    const previousId = id === 1 ? projects.length : id - 1;
    const nextId = id === projects.length ? 1 : id + 1;
    const detailIds = [
      nextId,
      ((id + 1) % projects.length) + 1,
      previousId
    ];

    const setText = (selector, value) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = value;
    };

    const setProjectImage = (selector, imageId) => {
      const image = document.querySelector(selector);
      if (!image) return;
      image.src = `/assets/images/project-${String(imageId).padStart(2, '0')}-cover.jpg`;
      image.alt = `${project.title} project image`;
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
        image.src = projectHeroes[id];
        image.alt = `${project.title} project image`;
        image.closest('.project-hero')?.classList.add('project-hero--natural');
        return;
      }

      if (id !== 1) {
        setProjectImage('[data-project-image]', id);
        return;
      }

      const video = document.createElement('video');
      video.src = '/assets/video/project-01-cover.mp4';
      video.autoplay = true;
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.setAttribute('muted', '');
      video.setAttribute('aria-label', `${project.title} project video`);
      image.replaceWith(video);

      const playback = video.play();
      if (playback) playback.catch(() => {});
    };

    const setProjectDetails = () => {
      const projectMedia = {
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

      if (!media) {
        setProjectImage('[data-project-detail-one]', detailIds[0]);
        setProjectImage('[data-project-detail-two]', detailIds[1]);
        setProjectImage('[data-project-detail-three]', detailIds[2]);
        return;
      }

      const gallery = document.querySelector('.project-images');
      if (!gallery) return;

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
          video.preload = 'auto';
          video.setAttribute('muted', '');
          video.setAttribute('aria-label', `${project.title} project video`);
          figure.appendChild(video);
        } else {
          const image = document.createElement('img');
          image.src = item.src;
          image.alt = `${project.title} project image ${index}`;
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
