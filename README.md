# Akbar Ginanjar — Portfolio

A premium, interactive developer portfolio built with vanilla HTML/CSS/JS,
Three.js, GSAP (+ ScrollTrigger), and Lenis smooth scroll — no build step,
no framework, no bundler.

## Running locally

Browsers block ES module imports over `file://`, so serve the folder over
HTTP. From this directory, run one of:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then open `http://localhost:8080`.

## Deploying

This is a fully static site — drag the folder into Netlify/Vercel, or push
it to a GitHub repo and enable GitHub Pages. No build command needed.

## Structure

```
index.html
css/
  globals.css       variables, layout, components
  typography.css    type scale, hero title
  animations.css    keyframes, reveal base states
js/
  main.js           wires everything together
  lenis-setup.js     smooth scroll + GSAP ticker sync
  animations/
    cursor.js        custom cursor
    nav.js           nav scroll state, active link, magnetic hover
    reveal.js        scroll reveals, split-text headings, timeline, progress bar
    projects.js      project data + cinematic detail overlay
  three/
    hero-orb.js      WebGL distorted orb (custom GLSL noise shader)
    ai-network.js    Canvas2D neural network visualization
```

## Notes

- Fonts (Space Grotesk / Inter) and the three/gsap/lenis libraries load from
  Google Fonts and jsDelivr via an import map — an internet connection is
  required.
- Respects `prefers-reduced-motion`, disables the custom cursor on touch
  devices, and reduces 3D geometry complexity below 768px.
- Swap the placeholder project visuals (gradient tiles) for real screenshots
  by editing `.project-visual-inner` in `index.html` and `overlay-visual`
  handling in `js/animations/projects.js`.
