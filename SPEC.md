# SPEC.md

Product and implementation specification for this project. This is the source of truth for *what the site is for*; `AGENTS.md` and the other rule files are the source of truth for *how to build it*.

## Project goals

A personal portfolio site for Akbar Ginanjar, a web & mobile developer, that:

- Presents his work, experience, and skills as a premium, intentional, memorable digital product — not a generic template.
- Communicates his cross-stack range (web, mobile, backend, and increasingly AI-integrated applications) through both the copy and the craft of the site itself.
- Drives visitors toward contact ("Start a Conversation") as the primary conversion action.
- Is trilingual (English / Indonesian / Sundanese), reflecting an international audience and West Java local audiences.

## Target users

- Potential clients / employers evaluating Akbar's work (agencies, companies, government/public-sector contacts — several showcased projects are Indonesian government platforms).
- Recruiters or collaborators looking for evidence of technical range and design sensibility.
- Indonesian-speaking visitors, served via the `id` locale.
- Sundanese-speaking visitors, served via the `su` locale.

## Core features

- **Hero** — name, role statement, entry points to work/contact, animated WebGL visual.
- **Statement** — single-line positioning statement.
- **About** — bio, focus areas, cross-domain summary.
- **Tech stack** — the technologies used (Flutter, Laravel, Node.js, Vue/Nuxt, React/Astro, TypeScript, PostgreSQL/MySQL, AI integration, Three.js/GSAP).
- **Certificates** — a fan-style card stack of credentials / course certificates below Skills, with keyboard, swipe, and dots navigation.
- **Selected work** — a curated project list (currently: Matrial — AI material marketplace; Balanja Express — mobile commerce; BPBD Jawa Barat — regional disaster-management government platform; Damkar Jawa Barat — fire & rescue public info platform; Barata — disaster-response field app; E-Course — online learning platform), each with tags, a title, and a short description, expandable into a detail overlay.
- **Experience** — a reverse-chronological timeline of roles.
- **Services** — a list of service offerings (web, mobile, backend, AI integration, intelligent applications, interactive web experiences).
- **"Building With AI"** — a dedicated section positioning AI integration as a core capability, paired with a generative/neural-network-style visual.
- **Tech marquee** — a scrolling ticker reinforcing the stack/keywords.
- **Contact** — a direct call to action (`mailto:`) plus social links (GitHub, Instagram, LinkedIn).
- **Language switch** — EN/ID/SU toggle affecting all `data-i18n`-tagged copy site-wide.

## UX principles

- The site should feel **crafted, not assembled** — motion, spacing, and typography choices should read as deliberate design decisions, not defaults. See `DESIGN.md`.
- **Scroll is the primary interaction model** — Lenis smooth scroll + GSAP ScrollTrigger reveals drive the experience; the site should feel like a guided narrative down the page, not a stack of independent boxes.
- **Motion has meaning** — reveals, the custom cursor, and the timeline fill should reinforce what the user is looking at and where they are in the page, and must degrade gracefully (respecting `prefers-reduced-motion`, disabling the cursor on touch).
- **Locale parity** — English, Indonesian, and Sundanese content must stay equivalent in meaning and completeness; no locale should lag behind in copy updates.
- **Fast and light** — as a portfolio, the site itself is a demonstration of engineering judgment; a slow or janky site undermines the pitch as much as bad copy would. See `PERFORMANCE.md`.

## Technical constraints

- **Framework**: Astro (static output), no client-side UI framework (no React/Vue runtime) despite `jsx` being configured in `tsconfig.json` — don't introduce one without discussing it with the user first, it's a significant architectural shift.
- **Styling**: Tailwind is configured but the actual styling approach is hand-written CSS with custom-property design tokens (`src/styles/globals.css`). New styling work should follow the existing token-based CSS approach; see `DESIGN.md`.
- **Animation stack**: GSAP + ScrollTrigger, Lenis (smooth scroll), Three.js (WebGL hero visual), Canvas2D (AI network visual) — these are the established toolkit; prefer extending usage of these over adding a new animation/graphics library.
- **i18n**: runtime, attribute-driven (`data-i18n`), dictionary in `src/scripts/i18n.js`. `src/lib/i18n.ts` is a dead duplicate — see `AGENTS.md`.
- **No backend**: no database, no auth, no server-rendered dynamic data. Contact is handled via `mailto:`, not a form submission endpoint, unless/until the user asks to change that.
- **Deployment**: static build (`astro build` → `dist/`) targeting `https://akbarginanjar.vercel.app` (see `astro.config.mjs`).
- **Legacy files**: the root-level `index.html`/`css/`/`js/`/`assets/`/`README.md` and the root `components/ui/*.tsx`/`lib/utils.ts` are pre-migration/unused artifacts, not part of the current architecture — see `AGENTS.md` for details. Don't build new features on top of them.

## Definition of Done

A feature or change is not complete until:

- [ ] It works correctly (verified by actually running `npm run dev` / `npm run build` + `npm run preview`, not just read).
- [ ] It follows the project architecture in `AGENTS.md` (single `main.js` orchestration pattern, token-driven CSS, markup-only Astro components, etc.).
- [ ] It follows `DESIGN.md` (visual direction, anti-slop rules, token usage).
- [ ] It follows `ACCESSIBILITY.md` (keyboard operability, focus handling, semantics, reduced motion, contrast).
- [ ] It follows `PERFORMANCE.md` (no unnecessary JS/deps, transform/opacity-based animation, no layout thrashing, Core Web Vitals unaffected).
- [ ] It follows `SECURITY.md` (no hardcoded secrets, no unsafe `set:html`/injection, dependency hygiene).
- [ ] It is responsive at the existing breakpoints (`768px`, `860px`, `1024px`) where applicable.
- [ ] No unnecessary dependencies were introduced (per `AGENTS.md` §5's dependency ladder).
- [ ] No obvious console errors remain (check the browser console after the change).
- [ ] Existing functionality is not broken — scroll reveals, smooth scroll, custom cursor, project overlay, and the language switch all still work after the change.
- [ ] `en`, `id`, and `su` copy are updated together if any user-facing text changed.
