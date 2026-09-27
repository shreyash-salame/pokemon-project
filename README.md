# Pokemon Explorer

A Pokemon browser built with **Next.js (App Router)**, **TypeScript** and **Tailwind CSS**, using live data from [PokeAPI](https://pokeapi.co/).

Browse the first 151 Pokemon, search by name, and open a detail page for stats, types, abilities and moves.

## Features

- Homepage listing Pokemon with pagination (20 per page)
- Live search by name, filtered on the client
- Detail page (`/pokemon/[id]`) with image, types, abilities, stats and moves
- Responsive grid layout, from 2 columns on mobile up to 5 on desktop
- Static Site Generation with Incremental Static Regeneration (ISR)
- Optimized images via `next/image`
- Forced light theme, so the layout looks the same regardless of the device's dark mode setting

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PokeAPI](https://pokeapi.co/) as the data source

## Project structure

```
app/
  layout.tsx                 Root layout and metadata
  globals.css                Global styles, Tailwind import, light theme
  page.tsx                   Homepage: fetches the Pokemon list
  components/
    PokemonList.tsx           Search bar, grid, pagination (client component)
  pokemon/
    [id]/
      page.tsx                Detail page for a single Pokemon
next.config.ts                Allows images from PokeAPI's sprite host
```

## How to run locally

**Requirements:** Node.js 18 or higher.

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd pokemon-explorer

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
npm start
```

Running `npm run build` prints a route table showing how each page is rendered (static vs dynamic).

## How data fetching and rendering work

**Homepage (`app/page.tsx`)**
Fetches the full list of Pokemon at build time with `fetch(...)`. The response is cached and automatically re-fetched at most once an hour (`revalidate: 3600`), which is Next.js's ISR pattern: pages stay static and fast, but data doesn't go stale forever.

**Detail page (`app/pokemon/[id]/page.tsx`)**
`generateStaticParams` pre-builds the first 151 Pokemon pages at build time, so opening any of them is instant, no live API call needed. Any id outside that range is built on its first visit, then cached the same way. Data is refreshed at most once a day (`revalidate: 86400`).

**Search and pagination**
The homepage fetches the full list once. Filtering by search and slicing by page both happen entirely in the browser (`PokemonList.tsx`), so typing in the search box or switching pages never triggers a new network request.

## Performance choices

- **SSG + ISR** for both the homepage and detail pages, so pages are served pre-built instead of waiting on PokeAPI per request.
- **`next/image`** resizes, compresses and lazy-loads Pokemon artwork instead of using plain `<img>` tags.
- **Client-side pagination** keeps each page render small (20 cards) instead of rendering all 151 at once.
- **Trimmed fetch scope**: the homepage only requests the list endpoint; full Pokemon details are only fetched on the page that needs them.

## Notes

- Only the first 151 Pokemon (Generation 1) are pre-rendered at build time; the search and pagination work within that set.
- The layout is intentionally kept simple and readable rather than feature-heavy, in line with the assignment's evaluation criteria on code structure and readability.
