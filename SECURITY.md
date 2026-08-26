# SECURITY.md

Security rules for this project. Today this is a **static site with no backend, no database, no authentication, and no server-side secrets** — most categories below are "keep it that way" guardrails for if/when that changes, not active gaps. Right-size effort accordingly: don't invent a login system's worth of threat modeling for a static portfolio, but don't skip the checks that do apply now.

## Skill

The built-in `security-review` skill ("Complete a security review of the pending changes on the current branch") **is installed** in this environment — use it as a review pass before calling security-sensitive work done, rather than a manual ad hoc check.

## Input validation

Not currently applicable — there are no forms or user-submitted data. If a contact form or any input is added: validate on submission, never trust client-side validation alone if there's ever a server endpoint behind it.

## Output sanitization / XSS prevention

- Astro escapes expressions by default (`{expr}`); this is the correct default and should not be bypassed casually.
- `set:html` is used once today, in `Layout.astro`, to inject the JSON-LD `<script type="application/ld+json">` — the value is `JSON.stringify()` of a server-defined object with **no user input**, which is safe. **Never use `set:html` with any value derived from user input, query params, or an external API response without sanitizing it first.** If you add a new `set:html` usage, justify why `{expr}` escaping isn't sufficient.
- No `innerHTML`/`dangerouslySetInnerHTML`-equivalent should be introduced in the vanilla JS modules (`src/scripts/`) for anything but fully static, developer-authored strings.

## Authentication and authorization

Not applicable — no user accounts, sessions, or protected routes exist. Don't add auth scaffolding speculatively.

## Secrets management / environment variables

- **Never hardcode secrets into source code**: no API keys, tokens, passwords, or private credentials committed to any file.
- There is currently no `.env` usage in this repo. If one is introduced, it must be added to `.gitignore` immediately (note: **this repo currently has no `.gitignore` at all** — see `AGENTS.md`; creating one that excludes `.env*` is a prerequisite the moment any secret-bearing config is added).
- Astro exposes only variables prefixed `PUBLIC_` to client code by design — never rename a secret to carry that prefix to "make it work" client-side.

## API security

Not currently applicable — the site makes no runtime API calls (Google Fonts is a static stylesheet load, not a data API). If a future feature adds an API call (e.g. a contact form backend, an analytics endpoint): use HTTPS only, never embed a private/secret API key in client-shipped JS (only truly public keys, e.g. a publishable key, belong there), and validate/sanitize any response before rendering it.

## CSRF protection

Not applicable while there is no server-side state-changing endpoint. Revisit if a form with a backend is added.

## SQL injection prevention

Not applicable — no database exists in this project.

## Dependency security

- Run `npm audit` after adding or updating dependencies; don't introduce a package with a known unpatched high/critical vulnerability.
- Prefer the already-installed dependencies (GSAP, Lenis, Three.js, Tailwind, Astro) over new ones per `AGENTS.md` §5 — fewer dependencies is directly fewer supply-chain exposure points.
- Don't install packages from unverified/low-adoption sources for something the standard library or an existing dependency already covers.

## Secure HTTP requests

- Any external resource load (fonts, future scripts) must use `https://`, not `http://`.
- Add `rel="noopener"` on `target="_blank"` links (already done for the social links in `Hero.astro`/`Contact.astro`) to prevent reverse-tabnabbing — keep this on any new external link.

## Error handling

- Don't surface internal implementation details (stack traces, file paths, library internals) in any user-facing UI. Not currently a live risk (no server errors reach the client), but applies to any future error UI.

## Sensitive data handling

- Nothing in this project currently collects or stores user data. If analytics, a form, or any data collection is added, keep the minimum necessary and be explicit with the user about what's being added and why before wiring it in.

## Client-side security

- Content is public by nature (it's a portfolio); the concern here is integrity, not confidentiality — don't let third-party embeds/scripts run with more trust than needed. The site currently loads only Google Fonts as a third-party origin.

## Server-side security

Not applicable — fully static hosting, no server code in this repository.
