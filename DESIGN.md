# DESIGN.md

UI/UX design rules for this project. `AGENTS.md` §"Skills" governs which skills apply here — read that before starting UI work.

## Design direction

Modern, premium, minimal, intentional. This is a personal developer portfolio, not a SaaS marketing site — every element should read as deliberate, not templated. Prioritize:

- **Strong visual hierarchy** — one clear focal point per section, generous negative space around it.
- **Good typography** — this site already uses a two-font system (`--font-display`: Space Grotesk, `--font-body`: Inter). Don't introduce a third typeface. Lean on size/weight/tracking contrast for hierarchy before reaching for color or decoration.
- **Consistent spacing and design tokens** — use the CSS custom properties already defined in `src/styles/globals.css` (`--bg`, `--bg-raise`, `--text`, `--text-dim`, `--accent`, `--accent-dim`, `--border`, `--border-strong`, `--ease-out-2`, `--ease-out-3`, `--gutter`, `--nav-h`, `--font-display`, `--font-body`). New spacing/color values should extend this token set, not bypass it with hardcoded hex values or magic pixel numbers.
- **Responsive layouts** — the existing breakpoints are `768px`, `860px`, and `1024px`, plus `clamp()`-based fluid sizing (see `--gutter`). Match this approach rather than adding a new breakpoint scheme.
- **Accessible interactions** — see `ACCESSIBILITY.md`; a design isn't done until it's accessible.
- **Meaningful animation** — this site already has a strong, intentional motion language (GSAP scroll reveals, split-text headings, a custom cursor, Lenis smooth scroll, `prefers-reduced-motion` handling). New motion should extend that language purposefully — reinforcing scroll narrative, hierarchy, or feedback — not decorate for its own sake.
- **Good visual rhythm** — consistent section padding/gutter, consistent reveal timing/easing across sections, consistent treatment of section titles (`data-split`) and body reveals (`data-reveal`).

The current palette is intentionally restrained: a near-black background (`--bg: #050505`), off-white text, a single accent blue (`--accent: #5b8cff`), and low-opacity white borders. This restraint is a feature, not a placeholder — don't expand the palette without a specific reason tied to the content (e.g. a project's brand tint, already handled per-project via inline `tint` values in `Work.astro`).

## Explicitly prevent AI slop

Avoid, unless the task specifically calls for it:

- Generic AI-generated layouts (centered hero + 3-column feature grid + testimonial carousel — the default template shape).
- Excessive gradients (this site uses flat color + one accent; don't introduce rainbow/mesh gradients).
- Excessive glassmorphism (frosted-glass panels, blur-everything).
- Excessive rounded cards — check existing corner-radius usage before adding a new rounded container; don't default every box to a heavily rounded card.
- Random colorful blobs / decorative shapes with no relation to content.
- Excessive shadows (this site's depth cues come from contrast and borders, not drop shadows — match that).
- Unnecessary icons — an icon should replace or reinforce a specific piece of meaning, not fill visual space. The existing icon usage (social links in `Hero.astro`) is functional, not decorative.
- Excessive animation — if a reveal, hover, or transition doesn't communicate hierarchy, state, or feedback, don't add it. `prefers-reduced-motion` must always be respected (already handled globally; new motion must not bypass it).
- Repetitive card grids — this site favors distinct, purposeful section layouts (a timeline for experience, a numbered list for services, a marquee for tech tags) over a generic uniform grid for everything.
- Generic SaaS layout patterns (pricing-table look, feature-icon-grid look) — this is a portfolio, not a product marketing page.
- Decorative elements without purpose — every visual element should serve hierarchy, meaning, or feedback. If you can't state what it does, don't add it.

## Skill application

Per `AGENTS.md` §"Skills":

- **`impeccable`** (installed — `pbakaus/impeccable`, symlinked at `~/.claude/skills/impeccable`) is the primary polish/critique pass for this site: use its `audit`/`critique`/`polish` subcommands on a section after implementing it against the rules above, before calling UI work done. It's a genuine review layer, not a substitute for reading this file first.
- **`frontend-design` is not installed in this environment.** Do not reference it as though applied — re-check availability (`find-skills`) before relying on it; until then, `impeccable` plus the rules above are the working substitute for visual-composition judgment.
- **`ponytail`** (installed) is genuinely relevant here beyond code: its ladder — does this need to exist, does an existing pattern already cover it, does the platform (CSS) cover it before JS — is a direct anti-slop check for visual/animation decisions too. Before adding a new visual effect, ask whether an existing token, animation module, or CSS feature already produces the intended effect.
- **`caveman`** only affects chat prose, not design decisions — don't apply it to markup, CSS, or copy.

When implementing UI, the practical order is: understand the section's existing pattern (layout, tokens, reveal/animation conventions already used by sibling sections) → apply the rules in this file → check `ACCESSIBILITY.md` → check `PERFORMANCE.md` → verify by running the site.
