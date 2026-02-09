# Martin Personal Website

A Stripe-quality personal operating system and portfolio site.

## Tech Stack
- HTML5
- CSS3 (Variables, Grid, Flexbox)
- Vanilla JavaScript
- Cloudflare Pages (or Netlify/Vercel)

## Development
- No build step: the repo is static HTML/CSS.
- Local preview (Cloudflare Pages dev): `npm run dev` then open `http://localhost:8788`.
- First-time setup for Cloudflare CLI: `npx wrangler login`.

## Deploy (one command)

```bash
npm run deploy
```

This stages all changes, commits with message `deploy: update site`, and pushes. **Cloudflare Pages** is connected to **dachzay/zachday-site** and deploys **production from `main`**. Preview locally with `npm run dev` before pushing to `main`.

### Repo

- **GitHub**: [dachzay/zachday-site](https://github.com/dachzay/zachday-site)
- Cloudflare Pages is connected; push = deploy.
