# AGENTS.md

This is the **primary, project-wide instruction file** for any AI coding agent working in this repository (Claude Code, Codex, Cursor, or any other agent). Tool-specific files (e.g. `CLAUDE.md`) point back here and must not duplicate it — if a tool-specific file and this one ever disagree, this file wins on general rules; the tool-specific file may add tool-only mechanics (e.g. how to invoke a slash command) but not override project rules.

## Documentation map

```text
AGENTS.md  (this file — general rules, index)
   ├── DESIGN.md          UI/UX, visual design system, anti-slop rules
   ├── ACCESSIBILITY.md   a11y standards
   ├── PERFORMANCE.md     performance standards
   ├── SECURITY.md        security standards
   └── SPEC.md            product spec + Definition of Done
```

Tool-specific entry points (`CLAUDE.md`, etc.) sit above this file and route agents into it; they hold no independent rules of their own.

When rules conflict: prefer the **most specific technical rule** for the task at hand (e.g. a Three.js performance note in `PERFORMANCE.md` beats a generic statement here), but never at the expense of the project's overall architecture described below or the requirements in `SPEC.md`.

---

## 1. Project architecture

Astro static site, no backend, no database, no auth, no client framework (no React/Vue despite `tsconfig.json` having a leftover `jsx` compiler option — nothing in `src/` uses JSX). Deployed as a static build.

**Rendering:** `src/pages/index.astro` is the only page. It composes every section from `src/components/*.astro` inside `src/layouts/Layout.astro`, which provides the `<html>` shell, SEO/OG/Twitter meta, JSON-LD Person schema, font preconnects, and the cursor/scroll-progress/noise-overlay DOM scaffolding. Components are markup-only — data lives in small frontmatter arrays (e.g. the `projects` array in `Work.astro`, the `stack` array in `TechStack.astro`); there is no client-side framework state.

**Behavior:** all interactivity is wired imperatively by a single script, loaded once from `Layout.astro` (`<script src="../scripts/main.js">`). `src/scripts/main.js` registers GSAP's ScrollTrigger, boots Lenis synced to the GSAP ticker, then calls init functions from feature modules in sequence:
- `lenis-setup.js` — smooth scroll
- `i18n.js` — runtime EN/ID/SU text swap driven by `data-i18n` attributes and the `.lang-btn[data-lang]` control in `Nav.astro`
- `animations/cursor.js`, `nav.js`, `reveal.js`, `hero-tilt.js`, `projects.js` — custom cursor, nav state, scroll reveals/split-text/timeline/progress bar, hero tilt, project detail overlay
- `three/hero-wave.js`, `three/ai-network.js` — WebGL hero visual, Canvas2D neural-network visual

New interactive behavior belongs in this same pattern: a small module in `src/scripts/` exporting an `initX()` function, called from `main.js`, targeting `data-*` attributes on markup the `.astro` components already render (or new ones you add) — not new inline `<script>` blocks scattered across components.

**Styling:** Tailwind is configured but the site is styled almost entirely with hand-written CSS in `src/styles/globals.css` using CSS custom properties as design tokens (see `DESIGN.md`). Treat Tailwind as available-but-not-the-primary system; don't introduce a second parallel styling approach without a reason.

**i18n:** `src/scripts/i18n.js` (flat-key EN/ID/SU dictionary) is what actually drives the UI. `src/lib/i18n.ts` is a differently-shaped, unused dictionary nothing imports — do not treat it as live, and do not silently let it drift further out of sync; if you touch translated copy, either update all locales or (preferably, next time you're in the area) delete the dead one after confirming with the user.

**Known dead weight, not part of the build:**
- Root-level `index.html`, `css/`, `js/`, root `assets/`, and the root `README.md` are leftovers from a pre-Astro version of this site (vanilla HTML/CSS/JS). `astro build` only reads `src/` and `public/`. Don't edit these expecting it to affect the live site; the root `README.md`'s described structure is stale.
- `components/ui/3d-card.tsx`, `components/ui/demo.tsx`, and `lib/utils.ts` at the repo root are unused scaffolding — no React dependency is installed and nothing imports them.
- `node_modules/` and `dist/` are committed to git (no `.gitignore` exists). Expect large diffs from routine `npm install` / `npm run build` — don't treat them as meaningful changes to review, and be deliberate about what you `git add`.

## 2. Coding conventions

- Vanilla JS in `src/scripts/`: ES modules, one concern per file, one `initX(...)` export per animation/feature module, dependencies (gsap, ScrollTrigger, lenis instance) passed in as parameters from `main.js` rather than re-imported everywhere.
- Astro components: no frontmatter logic beyond plain data (arrays/objects) and prop destructuring. Behavior goes in `src/scripts/`, not inline `<script>` tags inside components, unless the behavior is truly local and trivial.
- TypeScript is available (`tsconfig.json`, `astro/tsconfigs/strict`) but the codebase is predominantly untyped `.js`. Don't introduce `.ts` for one file in an otherwise-`.js` directory without a reason; match the surrounding files.
- CSS: use the existing custom-property tokens in `src/styles/globals.css` (`--bg`, `--text`, `--accent`, `--border`, `--ease-out-2/3`, `--gutter`, `--font-display`, `--font-body`, etc.) instead of hardcoding new colors, spacing, or easing curves. See `DESIGN.md`.

## 3. Naming conventions

- Files: kebab-case for scripts (`hero-tilt.js`, `lenis-setup.js`), PascalCase for `.astro` components (`AINetworkSection.astro`).
- JS functions: `initX` for module entry points called from `main.js` (`initCursor`, `initNav`, `initHeroWave`).
- CSS: existing BEM-ish flat class names scoped by section (`.hero-title`, `.project-overlay-close`, `.timeline-fill`) — follow the section's existing prefix rather than inventing a new naming scheme per component.
- i18n keys in `src/scripts/i18n.js`: dotted lowercase (`about.p1`, `nav.work`) or short IDs for list items (`serv1`, `exp1.date`) — match the existing key shape for the section you're editing.

## 4. File organization / component organization

- One `.astro` file per page section, named after the section, mounted in `src/pages/index.astro` in visual order.
- One JS module per animation/feature concern under `src/scripts/animations/` or `src/scripts/three/`, wired centrally from `main.js`.
- Static assets go in `public/assets/`, referenced by absolute path (`/assets/...`) — not the root-level legacy `assets/` directory.
- Don't create new top-level directories for a single file; extend the existing `src/components/`, `src/scripts/`, `src/styles/`, `src/lib/` structure.

## 5. Dependency management

Apply the `ponytail` skill's ladder before adding anything (see §9): prefer an existing dependency (GSAP, Lenis, Three.js, Tailwind are already installed and cover most animation/layout needs) or a native platform feature over a new package. This is a static personal-portfolio site — dependency weight is directly user-facing load time. Before adding a package:
1. Can CSS or the platform do it (native `<dialog>`, `IntersectionObserver`, `prefers-reduced-motion`, CSS scroll animations)?
2. Does GSAP/ScrollTrigger/Lenis/Three.js already cover it?
3. Only then consider a new dependency, and say why the above didn't suffice.

Run `npm audit` after adding anything with its own dependency tree; don't add packages with known high/critical vulnerabilities.

## 6. Error handling

There's no server/API layer, so "error handling" here mostly means defensive client code:
- Guard optional browser APIs already used in the codebase as a pattern to follow (e.g. `document.fonts?.ready` in `main.js`, `prefers-reduced-motion` checks, `hover: none` media query for touch).
- Three.js/Canvas2D visuals (`hero-wave.js`, `ai-network.js`) are decorative — if WebGL or canvas context creation fails, fail silently (skip the visual) rather than throwing and breaking the rest of the page's JS.
- Don't add try/catch around code paths that can't actually throw (see `SECURITY.md` / general project philosophy — no defensive scaffolding for scenarios that can't happen).

## 7. Reusability

- Reuse existing animation primitives (`data-reveal`, `data-split`, `data-cursor`, `data-i18n` attribute conventions) instead of inventing a new attribute/JS pattern for a similar effect.
- Reuse design tokens (`DESIGN.md`) instead of one-off magic numbers/colors.
- Before writing a new utility, check `src/scripts/` and `src/lib/` for something that already does it.

## 8. Maintainability

- Keep `main.js` as the single orchestration point — new features register there, they don't self-invoke via new inline scripts in components or new `<script>` tags in `Layout.astro`.
- Keep the EN/ID/SU translation dictionary (`src/scripts/i18n.js`) and the `data-i18n` keys in components in sync; a key added to one without the other is a silent bug (missing translation or dead key).
- Favor deleting genuinely dead code (once confirmed unused) over leaving it to accumulate — but don't delete the legacy root files or `components/ui/*` speculatively as part of an unrelated task; that's a deliberate cleanup task of its own, flag it to the user instead.

## 9. Git / change discipline

- Keep diffs scoped to the requested task. Don't opportunistically reformat, rename, or refactor unrelated code in the same change.
- `dist/` and `node_modules/` are tracked — never assume a broad `git add -A` is safe; check `git status` and stage specific files.
- Follow the repository's existing commit style (see `git log`) rather than inventing a new convention.

---

## AI Agent Behavior

Every agent working in this repo must:

1. **Inspect before modifying.** Read the relevant existing component/script/style before changing it — don't guess file contents from the file name.
2. **Reuse existing components and utilities** (design tokens, animation modules, `data-*` attribute conventions, i18n dictionary) rather than reimplementing.
3. **Avoid unnecessary dependencies** — apply the dependency ladder in §5.
4. **Avoid unnecessary refactoring** — a bug fix or feature add doesn't need surrounding cleanup; don't restructure files beyond what the task requires.
5. **Never overwrite working functionality without understanding it** — read the code path end to end (all callers, all usages of a shared module) before changing shared code like `main.js`, `i18n.js`, or `globals.css` tokens.
6. **Keep changes focused** on the requested task.
7. **Follow all project documentation** — `DESIGN.md`, `ACCESSIBILITY.md`, `PERFORMANCE.md`, `SECURITY.md`, `SPEC.md`, and this file.
8. **Follow installed skills when they're relevant** to the task (see §9 below) — actually read the skill's instructions, don't just namedrop it.
9. **Verify the implementation after making changes** — for UI work this means starting the dev server and checking the page (see the `run` skill), not just eyeballing the diff.
10. **Check for accessibility, performance, security, and responsive issues** before considering a change done — see the Definition of Done in `SPEC.md`.

---

## Skills

Skills are external, packaged instruction sets. **Do not claim a skill was "used" or "applied" unless you actually invoked/read it in that session** — namedropping a skill without reading it is a documentation lie and explicitly forbidden.

### Availability (as inspected at the time this doc was written)

This environment ships with `caveman`, `find-skills`, `ponytail`, `spec-driven-development`, `spec-driven-implementation`, `impeccable` (`pbakaus/impeccable`), `ui-ux-pro-max` (`nextlevelbuilder/ui-ux-pro-max-skill`), and `emil-design-eng` (`emilkowalski/skills`) as locally installed skills — the latter three installed via `npx skills add` on 2026-08-25, symlinked at `~/.claude/skills/<name>` — plus a set of built-in skills including `design` (Artifact canvas creation — not applicable to editing this site's own source), `code-review`, `simplify`, `security-review`, and `run`.

**`accessibility`, `performance`, and `frontend-design` are not installed in this environment** (checked via the skill listing and `~/.claude/skills`). Do not reference them as if they exist. Before relying on any of them, re-check availability (the skill listing surfaced to you at session start, or the `find-skills` skill) — if one becomes available later, wire it in per the mapping below; until then, `ACCESSIBILITY.md` and `PERFORMANCE.md` carry the actual rules to follow instead.

### Mapping — use when the task's domain is relevant, not on every task

| Skill | Status | Applies to | Use for |
|---|---|---|---|
| `frontend-design` | **not installed** | `DESIGN.md` | would guide UI composition/visual judgment if available |
| `impeccable` | installed | `DESIGN.md` | polish/critique/audit pass on UI work — actually invoke it, don't just namedrop |
| `ui-ux-pro-max` | installed | `DESIGN.md`, `ACCESSIBILITY.md` | searchable local rule database (styles, palettes, typography, a11y/UX guidelines, stack-specific patterns) — query it (`--domain <domain>` / `--design-system`) when a section needs a concrete style/token/pattern decision, not a substitute for reading `DESIGN.md` first |
| `emil-design-eng` | installed | `DESIGN.md` | animation-decision and component-polish taste (Emil Kowalski's philosophy — Vercel/Linear pedigree) — apply when refining GSAP/motion work or judging whether an interaction detail feels right |
| `accessibility` | **not installed** | `ACCESSIBILITY.md` | would guide a11y implementation if available |
| `performance` | **not installed** | `PERFORMANCE.md` | would guide perf work if available |
| `ponytail` | installed | `AGENTS.md` §5, `DESIGN.md` | dependency/complexity decisions; keeping animations and visual effects to the minimum that achieves the intent (an "AI slop" guard in practice, not just prose) |
| `caveman` | installed | communication style only | terser prose in chat responses when the user invokes it — has no bearing on code, design, or architecture decisions; don't apply it to file contents |
| `code-review` / `simplify` | installed (built-in) | verification step | reviewing a diff for correctness/simplification after implementing |
| `security-review` | installed (built-in) | `SECURITY.md` | reviewing pending changes for security issues before calling a task done |
| `run` | installed (built-in) | verification step | launching the dev server to actually see a UI change work |

### Workflow

```text
User Request
   ↓
Read CLAUDE.md (tool entry point)
   ↓
Read AGENTS.md (this file)
   ↓
Read SPEC.md
   ↓
Identify relevant rule files (DESIGN / ACCESSIBILITY / PERFORMANCE / SECURITY)
   ↓
Check + read relevant skills (only ones actually relevant and actually installed)
   ↓
Plan implementation
   ↓
Implement
   ↓
Verify (run the app, check the diff)
   ↓
Check accessibility / performance / security / responsiveness
   ↓
Review against SPEC.md's Definition of Done
   ↓
Report changes
```

For UI-specific tasks:

```text
UI Task
   ↓
Read DESIGN.md
   ↓
Query ui-ux-pro-max for concrete style/token/a11y guidance while planning
   ↓
(frontend-design — not installed; apply DESIGN.md directly instead)
   ↓
Apply emil-design-eng taste to animation/interaction/polish decisions
   ↓
Apply ponytail where it curbs unnecessary visual/animation complexity
   ↓
Use impeccable (audit/critique/polish) as a final review pass
   ↓
Check ACCESSIBILITY.md
   ↓
Check PERFORMANCE.md
```

Only pull in a skill or a rule file whose domain the task actually touches — a copy-only change doesn't need a performance pass, a pure-CSS tweak doesn't need the security file.
