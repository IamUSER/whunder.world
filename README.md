# WhunderWorld

A whimsical, static fan site for the WhunderWorld Terraria server.

## What is included

- a responsive pixel-art home page
- animated grass, flowers, trees, clouds, gems, and a campfire
- an original cat-blade cursor with a rainbow magic trail
- announcements that are easy to edit in `app/page.tsx`
- a Campfire Notes coming-soon board for a future shared shoutbox
- a World Vault ready for real map archives
- static export support for GitHub Pages
- Sites hosting support with no database or object storage

## Add real map downloads

1. Put each compressed map in `public/downloads/`.
2. Add its title, metadata, and relative file path to the World Vault in `app/page.tsx`.
3. Keep each Git file under GitHub's single-file limit. Use GitHub Release assets for very large archives.

The included archive manifest is a real download, but it is not a Terraria world file.

## Local preview

```bash
npm ci
npm run dev
```

## Production builds

```bash
npm run build
```

The Sites package is emitted in `dist/`. The static GitHub Pages artifact is emitted in `dist/client/`.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes `dist/client/` after every push to `main`.
Enable GitHub Actions as the Pages source in the repository settings. Configure `www.whunder.world` as the custom domain in the same settings when DNS is ready.

## Community note

Campfire Notes are currently a coming-soon preview. A future shared shoutbox will use a hosted community service or external community platform.
