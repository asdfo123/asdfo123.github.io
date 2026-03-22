# Xinye Li's Personal Academic Homepage

Based on [PRISM](https://github.com/ImYangC7/imyangc7.github.io) template (Next.js 15 + React 19 + Tailwind CSS + TypeScript).

## Requirements

- Node.js >= 22

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev
```

Visit http://localhost:3000.

## Build & Preview

```bash
# Build static files to out/
npm run build

# Preview the build locally
npx serve out -p 3000
```

## Deploy to GitHub Pages

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to GitHub Pages on every push to `main`.

**Steps:**

1. Go to your GitHub repo → Settings → Pages
2. Set Source to **GitHub Actions**
3. Push to `main` branch — the site will auto-deploy

## Project Structure

```
content/          # Site content (TOML configs, Markdown, BibTeX)
  config.toml     # Site-wide config (author, social, navigation)
  about.toml      # Homepage sections config
  bio.md          # Bio markdown content
  publications.bib# Publications in BibTeX format
  news.toml       # News items
  awards.toml     # Awards
  competitions.toml # Competitions
  cv.toml + cv.md # CV page
public/           # Static assets (avatar, paper previews, favicon)
src/              # Next.js source code
  app/            # App Router pages
  components/     # React components
  lib/            # Utilities (config parser, BibTeX parser, etc.)
  types/          # TypeScript type definitions
```

## Customization

- Edit `content/config.toml` to update personal info, social links, and navigation
- Edit `content/about.toml` to configure homepage sections
- Edit `content/bio.md` for your bio
- Edit `content/publications.bib` for publications
- Replace `public/avatar.JPG` with your photo
