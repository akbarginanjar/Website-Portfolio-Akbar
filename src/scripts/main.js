import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { initLenis } from "./lenis-setup.js";
import { initCursor } from "./animations/cursor.js";
import { initNav } from "./animations/nav.js";
import {
  initHeroEntrance,
  initSectionTitles,
  initGenericReveals,
  initStatementReveal,
  initTimelineFill,
  initScrollProgress,
  initParallaxProjects,
  initOverlapAbout,
} from "./animations/reveal.js";
import { initProjectOverlay } from "./animations/projects.js";
import { initHeroTilt } from "./animations/hero-tilt.js";
import { initHeroWave } from "./three/hero-wave.js";
import { initAINetwork } from "./three/ai-network.js";
import { initI18n } from "./i18n.js";

gsap.registerPlugin(ScrollTrigger);

document.documentElement.classList.add("js-ready");

const lenis = initLenis(gsap, ScrollTrigger);

initI18n();
initCursor(gsap);
initNav(gsap, ScrollTrigger);
initHeroEntrance(gsap);
initSectionTitles(gsap, ScrollTrigger);
initGenericReveals(gsap, ScrollTrigger);
initStatementReveal(gsap, ScrollTrigger);
initOverlapAbout(ScrollTrigger);
initTimelineFill(gsap, ScrollTrigger);
initScrollProgress(gsap, ScrollTrigger);
initParallaxProjects(gsap, ScrollTrigger);
initProjectOverlay(gsap, lenis);

initHeroWave();
initHeroTilt();
initAINetwork();

// keep ScrollTrigger accurate after fonts / late layout shifts
window.addEventListener("load", () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
