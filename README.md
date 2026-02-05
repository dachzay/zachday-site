# Martin Personal Website

A Stripe-quality personal operating system and portfolio site.

## Tech Stack
- HTML5
- CSS3 (Variables, Grid, Flexbox)
- Vanilla JavaScript
- Cloudflare Pages (or Netlify/Vercel)

## Development
- Open `index.html` in your browser (or use a local server).
- No build step: the repo is static HTML/CSS.

## Deploy (one command)

```bash
npm run deploy
```

This stages all changes, commits with message `deploy: update site`, and pushes. **Cloudflare Pages** is connected to **dachzay/zachday-site**, so every push triggers a deploy — no manual "update Cloudflare" needed.

### Repo

- **GitHub**: [dachzay/zachday-site](https://github.com/dachzay/zachday-site)
- Cloudflare Pages is connected; push = deploy.
