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

  const projectRoot = document.querySelector('[data-project-page]');

  if (projectRoot) {
    const projects = [
      { title: 'BROKENHEART X FASHIONROCKSTAR [M.A.D 2026]', role: 'CREATIVE DIRECTOR - LEAD STYLIST', year: '2026' },
      { title: 'MICAELA GOMEZ', role: 'PHOTOGRAPHY - CREATIVE DIRECTION - SET DESIGN', year: '2026' },
      { title: 'Afterimage', role: 'Beauty', year: '2025' },
      { title: 'Run / 04', role: 'Photography', year: '2026' },
      { title: 'Nocturne', role: 'Creative Direction', year: '2025' },
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

      if (id === 2) {
        image.src = '/assets/images/projects/project-02/cover.jpg';
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
      if (id !== 2) {
        setProjectImage('[data-project-detail-one]', detailIds[0]);
        setProjectImage('[data-project-detail-two]', detailIds[1]);
        setProjectImage('[data-project-detail-three]', detailIds[2]);
        return;
      }

      const gallery = document.querySelector('.project-images');
      if (!gallery) return;

      const media = [
        { type: 'video', src: '/assets/video/project-02-editorial.mp4' },
        { type: 'image', src: '/assets/images/projects/project-02/image-01.jpg' },
        { type: 'image', src: '/assets/images/projects/project-02/image-02.jpg' },
        { type: 'image', src: '/assets/images/projects/project-02/image-03.jpg' },
        { type: 'image', src: '/assets/images/projects/project-02/image-04.jpg' }
      ];

      gallery.classList.add('project-images--natural');
      gallery.replaceChildren();

      media.forEach((item, index) => {
        const figure = document.createElement('figure');
        let video;
        if (index === 0) figure.className = 'project-image project-image--wide';

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
