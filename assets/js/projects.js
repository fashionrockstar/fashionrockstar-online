(() => {
  'use strict';
  if (!document.querySelector('[data-project-page]')) return;
  const projects = window.fashionrockstarProjects;
  if (!projects?.length) return;
  const requestedId = Number(new URLSearchParams(location.search).get('id') || 1);
  const index = Math.max(0, projects.findIndex(project => project.id === requestedId));
  const project = projects[index];
  document.body.classList.toggle('project-imported', Boolean(project.imported));
  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    node.textContent = value || '';
    node.hidden = !value;
  };
  setText('[data-project-title]', project.title);
  // Allow an editorial line break without changing the title's text.
  if (project.titleBreakAfter && project.title.startsWith(project.titleBreakAfter)) {
    document.querySelector('.project-head').classList.add('project-head--stacked');
    document.querySelector('[data-project-title]').replaceChildren(
      document.createTextNode(project.titleBreakAfter),
      document.createElement('wbr'),
      document.createTextNode(project.title.slice(project.titleBreakAfter.length))
    );
  }
  setText('[data-project-role]', project.role);
  setText('[data-project-year]', project.year);
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
      embed.append(makeLink(item.src, 'View the film on Instagram'));
      const links = document.createElement('p');
      links.className = 'project-social-film__links';
      links.append(makeLink(item.src, 'Watch on Instagram'));
      if (item.alternateUrl) links.append(makeLink(item.alternateUrl, 'Watch on TikTok'));
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
        media.controls = true;
        media.preload = 'none';
        media.dataset.projectVideo = '';
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
  const gallery = document.querySelector('.project-images');
  gallery.classList.add('project-images--natural');
  gallery.hidden = !project.gallery.length;
  gallery.replaceChildren();
  let portraitPending = false;
  project.gallery.forEach((item, position) => {
    const figure = document.createElement('figure');
    figure.className = 'project-image';
    if (item.wide) {
      figure.classList.add('project-image--wide');
      portraitPending = false;
    } else if (project.imported) {
      const next = project.gallery[position + 1];
      if (!portraitPending && (!next || next.wide)) figure.classList.add('project-image--centered');
      else portraitPending = !portraitPending;
    }
    figure.append(createMedia(item, position));
    gallery.append(figure);
  });
  if (project.gallery.some(item => item.type === 'instagram')) {
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
    const destination = projects[(index + offset + projects.length) % projects.length];
    const link = document.querySelector(`[data-project-${direction}]`);
    link.href = `/project/?id=${destination.id}`;
    link.setAttribute('aria-label', `${direction === 'prev' ? 'Previous' : 'Next'} project: ${destination.title}`);
  }
  document.title = `${project.title} — FASHIONROCKSTAR.ONLINE`;
})();
