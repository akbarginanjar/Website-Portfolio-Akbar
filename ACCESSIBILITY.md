# ACCESSIBILITY.md

Accessibility standards for this project. This site is heavy on custom motion (GSAP, Lenis, custom cursor, Canvas/WebGL visuals), so accessibility work here is as much about *not breaking* what already exists as adding new coverage.

## Skill

**The `accessibility` skill is not installed in this environment** (checked against the local skill listing at `~/.claude/skills` and the environment's built-in skill list — see `AGENTS.md` §"Skills"). Do not claim it was used. Re-check availability before relying on it; until it's available, follow the rules below directly, and verify manually (keyboard-only pass, screen reader spot-check, `prefers-reduced-motion` toggle) rather than assuming a skill covered it.

## Semantic HTML

- Use the correct element for the job before reaching for ARIA: `<button>` for actions, `<a>` for navigation, `<nav>`, `<header>`, `<footer>`, `<main>` for landmarks (already used in `Layout.astro`/`Nav.astro`/`Footer.astro`).
- **Do not add ARIA attributes when semantic HTML already provides the correct behavior.** E.g. a real `<button>` doesn't need `role="button"`; a real `<nav aria-label="Primary">` (already present) doesn't need additional landmark roles.

## Heading hierarchy

- One `<h1>` per page (the hero title). Section titles are `<h2>` (`.section-title`, already consistent across `About.astro`, `Work.astro`, `Experience.astro`, etc.). Don't skip levels when adding new sections.

## Keyboard navigation

- Every interactive element (nav links, lang switch buttons, project cards, overlay close button, social links, contact CTA) must be reachable and operable via `Tab`/`Shift+Tab`/`Enter`/`Space` — don't build a click-only interaction (e.g. a `<div onclick>` in a new feature) when a native focusable element would do.
- The project detail overlay (`ProjectOverlay.astro` + `animations/projects.js`) is a modal-like UI: opening it must move focus into it (e.g. to the close button or title), closing it must return focus to the trigger, and `Escape` should close it. Verify this still holds whenever you touch `animations/projects.js`.
- The custom cursor (`animations/cursor.js`) is a visual/pointer-only enhancement — it must never be the only way to perceive focus or hover state; native `:focus-visible` styling must remain present for keyboard users, and the cursor is already disabled on touch devices — keep it that way.

## Focus states

- Never remove a `:focus` / `:focus-visible` outline without providing an equally visible replacement. Check `globals.css` for the existing focus treatment before styling a new interactive element and match it.

## Screen readers

- Decorative canvases (`#heroCanvas`, `#aiCanvas` from `hero-wave.js`/`ai-network.js`) are already marked `aria-hidden="true"` in the components — keep any new purely-decorative visual marked the same way.
- The scroll-progress bar, noise overlay, and custom cursor DOM nodes in `Layout.astro` are already `aria-hidden="true"` — follow that pattern for any new non-content chrome.

## ARIA usage

- Only add ARIA to fill a real gap semantic HTML can't (e.g. `aria-label` on icon-only social links in `Hero.astro`, `aria-hidden` on decorative visuals — both already done). Don't add `role`, `aria-*` attributes speculatively "for safety."

## Form accessibility

There are currently no forms in the site (contact is a `mailto:` link). If a form is added later: every input needs a associated `<label>` (not just a placeholder), errors must be announced (e.g. `aria-describedby` pointing at visible error text, not color alone), and required fields must be marked both visually and with `required`/`aria-required`.

## Button/link semantics

- Use `<a href>` for navigation (including in-page anchors like `#work`), `<button>` for actions that don't navigate (overlay close, lang switch). Don't use a styled `<a href="#">` or `<a>` with a click handler and no real destination as a fake button.

## Color contrast

- Text colors are token-driven (`--text` on `--bg`, `--text-dim` for secondary text). `--text-dim: #999999` on `--bg: #050505` is close to WCAG AA for normal text — don't introduce a *dimmer* text token or use `--text-dim` at small sizes for anything content-critical. Check contrast before introducing any new text/background color pairing, especially per-project accent tints (`tint` values in `Work.astro`) used as text or on small elements.

## Reduced motion

- `@media (prefers-reduced-motion: reduce)` is already handled globally in `globals.css`. Any new GSAP/CSS animation must be covered by that rule (or gated the same way `initHeroWave`/animation modules already check it) — don't add motion that ignores it.

## Touch targets

- Interactive elements should have a comfortably tappable area (roughly 44×44px effective hit area) on mobile — check nav links, lang switch buttons, and social icons at the `768px` breakpoint when touching their layout.

## Images and alt text

- The one content image (`akbar.webp` in `Layout.astro`'s preload / used as the profile/OG image) needs descriptive `alt` text wherever it's rendered as an `<img>`, not just referenced in meta tags. Decorative images/visuals get `alt=""` or `aria-hidden="true"`, never a missing `alt` attribute.

## Accessible navigation

- `Nav.astro`'s in-page links (`#work`, `#about`, `#services`, `#contact`) must keep working with JS disabled/failed as a baseline (they're real anchor links — don't convert them to JS-only scroll handlers without a real `href` fallback).
- The skip link (`.skip-link` → `#main` in `Layout.astro`) must remain the first focusable element on the page.

## Error messages

Not currently applicable (no forms/validation). If added: errors must be programmatically associated with their field and not conveyed by color/icon alone.

## Responsive accessibility

- Re-check focus order and touch targets at each existing breakpoint (`768px`, `860px`, `1024px`) when a change affects layout at that size — a reflow that looks fine visually can still break tab order.
