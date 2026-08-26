# PERFORMANCE.md

Performance standards for this project. This is a static, content-light site whose real performance risk is the motion/graphics layer (GSAP, Lenis, Three.js, Canvas2D), not server response time.

## Skill

**The `performance` skill is not installed in this environment** (checked against the local skill listing and the environment's built-in skill list — see `AGENTS.md` §"Skills"). Do not claim it was used. Follow the rules below directly, and verify with the browser's Performance/Lighthouse panel or `npm run build && npm run preview` rather than assuming a skill covered it.

## JavaScript

- Minimize unnecessary JS: this site's interactivity is already consolidated into `src/scripts/main.js` and its feature modules — add new behavior as a small module wired from there, not as a new independent bundle or inline script.
- Avoid unnecessary dependencies (see `AGENTS.md` §5's dependency ladder) — GSAP, Lenis, and Three.js are already loaded; don't add a second animation or scroll library that overlaps them.
- Code splitting: Astro already ships per-page JS by default; don't defeat that by importing heavy modules (e.g. `three`) into a component that doesn't need them.

## Images

- Use `.webp` (already the convention — `public/assets/akbar.webp`) over `.png`/`.jpg` for photos.
- Set explicit `width`/`height` (or `aspect-ratio`) on images to avoid layout shift.
- The hero/profile image is already preloaded with `fetchpriority="high"` in `Layout.astro` — keep only genuinely above-the-fold images preloaded; don't preload images further down the page.
- Lazy-load below-the-fold images (`loading="lazy"`) if/when more real (non-decorative-canvas) images are added.

## Animation performance

- **Prefer `transform`/`opacity` for animations** — this is already the pattern in the reveal/nav/hero animation modules (GSAP tweening `x`/`y`/`scale`/`opacity`). Don't animate layout-triggering properties (`width`, `height`, `top`/`left`, `margin`) where a `transform` achieves the same visual result.
- Avoid layout thrashing: don't read a DOM layout property (`offsetTop`, `getBoundingClientRect`) inside a scroll/resize/rAF loop right after writing a style in the same loop — batch reads before writes, or let GSAP/ScrollTrigger (which already do this internally) own the measurement.
- ScrollTrigger instances and GSAP tweens tied to elements that can be removed/hidden (e.g. inside the project overlay) must be killed/reverted when no longer needed — check for `.kill()`/cleanup in `animations/projects.js` and follow the same pattern for new overlay-driven animation.

## DOM & event listeners

- Avoid unnecessary DOM manipulation — batch reads/writes, don't requery the same selector repeatedly inside a loop (cache the element reference, as the existing modules do with `document.getElementById`/`querySelector` at init time).
- Avoid excessive event listeners — prefer one delegated listener on a container over one listener per item when a list can grow (e.g. project cards, nav links).
- **Proper cleanup of listeners and animations**: this site has no SPA routing (`main.js` runs once on load), so most modules don't need teardown — but the project overlay's open/close cycle and any Three.js scene (`hero-wave.js`, `ai-network.js`) do need to clean up rAF loops / resize listeners if a new feature adds another canvas or overlay that can be repeatedly opened/closed, to avoid leaking listeners.

## Network

- Efficient network requests: fonts are already loaded via a single Google Fonts stylesheet with `preconnect` (in `Layout.astro`) — don't add another font source or a second font-loading strategy.
- Caching: this is a static build (`astro build` → `dist/`); ensure any new fetched resource (if a future feature fetches data) is either build-time static or has sensible cache headers at the hosting layer — don't add runtime polling/fetching for content that's actually static.

## Core Web Vitals

- **LCP**: the hero image/title is the likely LCP element — don't add render-blocking JS/CSS above it, keep the hero preload in place.
- **CLS**: reserve space for canvases (`#heroCanvas`, `#aiCanvas`) and images via CSS so their late-initializing WebGL/Canvas2D content doesn't shift layout when it mounts.
- **INP**: keep scroll-driven handlers (Lenis, ScrollTrigger callbacks) cheap — no synchronous heavy work inside a scroll callback.

## Mobile performance

- Three.js/Canvas2D geometry complexity is already reduced below `768px` per the project's own convention (see README's original notes) — keep new WebGL/canvas work following that same "reduce complexity on small/low-power devices" pattern rather than shipping the same particle/geometry count everywhere.
- Respect `prefers-reduced-motion` (already global) and treat it as also a performance lever on low-power devices, not just an accessibility one — heavy animations should actually stop, not just visually simplify.

## Bundle size awareness

- Before adding a dependency, check its install size (`npm view <pkg> dist.unpackedSize` or a bundlephobia-style check) against what it replaces. A new library that duplicates ~80% of GSAP/Three.js capability is not worth its weight for a personal portfolio site.
