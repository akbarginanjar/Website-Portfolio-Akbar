# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**This file is an entry point, not a replacement for `AGENTS.md`.** All project architecture, coding conventions, and AI-agent behavior rules live in `AGENTS.md`. Read it before doing any work here.

```text
CLAUDE.md (this file)
   ↓
AGENTS.md
   ↓
DESIGN.md · ACCESSIBILITY.md · PERFORMANCE.md · SECURITY.md · SPEC.md
```

## Before working on anything in this repo, Claude must

1. Read `AGENTS.md` — project architecture, conventions, and the AI Agent Behavior rules that apply to every change.
2. Read `SPEC.md` — what this project is, who it's for, and the Definition of Done a change must satisfy.
3. For UI work, read `DESIGN.md` and follow it.
4. For anything touching interactive elements, forms, navigation, or motion, read `ACCESSIBILITY.md`.
5. For anything touching scripts, assets, animations, or bundle size, read `PERFORMANCE.md`.
6. For anything touching dependencies, external requests, or data handling, read `SECURITY.md`.
7. Use the skill mapping and workflow defined in `AGENTS.md` §"Skills" — check what's actually installed before relying on a named skill, and actually read a skill's instructions before claiming to have applied it. `caveman`, `ponytail`, `impeccable`, `ui-ux-pro-max`, and `emil-design-eng` are installed locally as of this writing; `frontend-design`, `accessibility`, and `performance` are not — don't reference them as if they exist without re-checking.

If a rule here ever conflicts with `AGENTS.md`, `AGENTS.md` wins — this file only adds Claude-Code-specific mechanics (e.g. which slash commands/skills to invoke), never independent project rules.

## Commands

```bash
npm run dev      # astro dev — local dev server with HMR
npm run build    # astro build — outputs static site to dist/
npm run preview  # astro preview — serve the production build locally
npm run astro    # raw astro CLI passthrough (e.g. `npm run astro -- check`)
```

There is no test suite, linter, or formatter configured in this repo. Verify UI changes by running `npm run dev` and checking the page (the `run` skill can drive this), not by inspection alone.
