# FASHIONROCKSTAR.ONLINE

Lightweight, multi-page editorial portfolio built with HTML, CSS and vanilla JavaScript.

## Preview locally

Serve the project root with any static server, then open `/` in a browser. The included PowerShell helper can be run with:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\work\server.ps1
```

The local preview will be available at `http://127.0.0.1:4173/`.

## Replace photography

All replaceable image assets are in `assets/images/`. Keep the existing filenames to swap photography without editing markup:

- `hero-placeholder.jpg` — contact-page editorial image
- `nav-work-placeholder.jpg` — homepage menu preview
- `issue-placeholder.jpg` — Issue 01 image
- `project-01-cover.jpg` through `project-08-cover.jpg` — work grid and reusable project pages
- `project-hero-placeholder.jpg` — reserved alternate project image

## Typography

The display and interface fonts are controlled by `--font-display` and `--font-ui` at the top of `assets/css/styles.css`. The current temporary choices are the open-source fonts Bebas Neue and Inter.
