(() => {
  'use strict';
  if (!document.querySelector('[data-project-page]')) return;
  const projects = window.fashionrockstarProjects;
  const requestedId = new URLSearchParams(location.search).get('id');
  const index = projects?.findIndex(project => String(project.id) === requestedId) ?? -1;
  // Retired numeric IDs and unknown URLs must never open the first new project.
  if (index < 0) {
    location.replace('/work/');
    return;
  }
  const project = projects[index];
  document.body.classList.toggle('project-imported', Boolean(project.imported));
  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    node.textContent = value || '';
    node.hidden = !value;
  };
  setText('[data-project-title]', project.title);
  document.querySelector('.project-head').classList.toggle('project-head--long-title', project.title.length > 32);
  document.querySelector('.project-head').classList.toggle('project-head--wide-word', project.title.split(/\s+/).some(word => word.length > 16));
  document.querySelector('.project-head').classList.toggle('project-head--stacked', Boolean(project.stackedHeading || project.titleBreakAfter));
  // Allow an editorial line break without changing the title's text.
  if (project.titleBreakAfter && project.title.startsWith(project.titleBreakAfter)) {
    document.querySelector('[data-project-title]').replaceChildren(
      document.createTextNode(project.titleBreakAfter),
      document.createElement('wbr'),
      document.createTextNode(project.title.slice(project.titleBreakAfter.length))
    );
  }
  setText('[data-project-role]', project.role);
  setText('[data-project-year]', project.year);
  const filmLink = document.querySelector('[data-project-film-link]');
  if (filmLink && project.youtubeUrl) {
    const link = document.createElement('a');
    link.href = project.youtubeUrl;
    link.textContent = 'WATCH ON YOUTUBE →';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Watch ${project.title} on YouTube (opens in a new tab)`);
    filmLink.replaceChildren(link);
    filmLink.hidden = false;
  }
  const credits = document.querySelector('[data-project-credits]');
  if (project.credits?.length) {
    credits.hidden = false;
    project.credits.forEach(credit => {
      const line = document.createElement('p');
      line.textContent = credit;
      credits.append(line);
    });
  }

  const createMedia = (item, position, hero = false) => {
    if (item.type === 'instagram') {
      const film = document.createElement('div');
      film.className = 'project-social-film';
      film.setAttribute('role', 'group');
      film.setAttribute('aria-label', `${project.title} — film`);
      const embed = document.createElement('blockquote');
      embed.className = 'instagram-media';
      embed.dataset.instgrmPermalink = item.src;
      embed.dataset.instgrmVersion = '14';
      const makeLink = (href, text) => {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = text;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        return link;
      };
      embed.append(makeLink(item.src, 'VIEW THE FILM ON INSTAGRAM'));
      const links = document.createElement('p');
      links.className = 'project-social-film__links';
      links.append(makeLink(item.src, 'WATCH ON INSTAGRAM'));
      if (item.alternateUrl) links.append(makeLink(item.alternateUrl, 'WATCH ON TIKTOK'));
      film.append(embed, links);
      return film;
    }
    const media = document.createElement(item.type === 'video' ? 'video' : 'img');
    if (item.sourceFile) media.dataset.sourceFile = item.sourceFile;
    if (item.width && item.height) {
      media.width = item.width;
      media.height = item.height;
    }
    if (item.type === 'video') {
      media.playsInline = true;
      media.setAttribute('aria-label', `${project.title} — ${hero ? 'project film' : 'film'} ${position + 1}`);
      if (project.imported) {
        media.controls = item.controls !== false;
        media.preload = 'none';
        media.dataset.projectVideo = '';
        media.loop = Boolean(item.loop);
        if (item.autoplay) {
          media.dataset.autoplayVideo = '';
          media.muted = true;
          media.defaultMuted = true;
        }
        media.src = item.src;
        if (item.poster) media.poster = item.poster;
      } else {
        // Preserve the established galleries outside this import.
        media.src = item.src;
        media.autoplay = true;
        media.muted = true;
        media.defaultMuted = true;
        media.loop = true;
        media.preload = 'metadata';
      }
    } else {
      media.src = item.src;
      media.alt = item.alt || `${project.title} — photograph ${position + 1}`;
      media.loading = hero ? 'eager' : 'lazy';
      media.decoding = 'async';
      if (hero) media.fetchPriority = 'high';
      if (item.srcset) {
        media.srcset = item.srcset;
        media.sizes = hero || item.wide ? '(max-width: 760px) 100vw, 92vw' : '(max-width: 760px) 100vw, 46vw';
      }
    }
    return media;
  };
  const hero = document.querySelector('.project-hero');
  hero.classList.add('project-hero--natural');
  const covers = Array.isArray(project.cover) ? project.cover : [project.cover];
  hero.classList.toggle('project-hero--pair', covers.length > 1);
  hero.replaceChildren(...covers.map((item, position) => createMedia(item, position, true)));
  // Header media appears once, including responsive versions of the same image.
  const mediaKeys = item => [item.src, ...(item.srcset || '').split(',').map(candidate => candidate.trim().split(/\s+/)[0])]
    .filter(Boolean)
    .map(src => `${item.type}:${new URL(src, location.href).href}`);
  const headerMedia = new Set(covers.flatMap(mediaKeys));
  const galleryItems = project.gallery.filter(item => !mediaKeys(item).some(key => headerMedia.has(key)));
  const gallery = document.querySelector('.project-images');
  gallery.classList.add('project-images--natural');
  gallery.hidden = !galleryItems.length;
  gallery.replaceChildren();
  let portraitPending = false;
  galleryItems.forEach((item, position) => {
    const figure = document.createElement('figure');
    figure.className = 'project-image';
    if (item.wide) {
      figure.classList.add('project-image--wide');
      portraitPending = false;
    } else if (project.imported) {
      const next = galleryItems[position + 1];
      if (!portraitPending && (!next || next.wide)) figure.classList.add('project-image--centered');
      else portraitPending = !portraitPending;
    }
    figure.append(createMedia(item, position));
    gallery.append(figure);
  });
  if (galleryItems.some(item => item.type === 'instagram')) {
    const renderInstagram = () => window.instgrm?.Embeds?.process();
    if (window.instgrm?.Embeds) renderInstagram();
    else {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.addEventListener('load', renderInstagram, { once: true });
      // The direct links remain usable if the embed is blocked or unavailable.
      document.body.append(script);
    }
  }
  for (const [direction, offset] of [['prev', -1], ['next', 1]]) {
    const link = document.querySelector(`[data-project-${direction}]`);
    link.hidden = projects.length < 2;
    if (link.hidden) {
      link.removeAttribute('href');
      continue;
    }
    const destination = projects[(index + offset + projects.length) % projects.length];
    link.href = `/project/?id=${destination.id}`;
    link.setAttribute('aria-label', `${direction === 'prev' ? 'Previous' : 'Next'} project: ${destination.title}`);
  }
  document.title = `${project.title} — FASHIONROCKSTAR.ONLINE`;
})();
