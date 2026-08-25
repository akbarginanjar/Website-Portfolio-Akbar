import Lenis from "lenis";

export function initLenis(gsap, ScrollTrigger) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const lenis = new Lenis({
    duration: reduceMotion ? 0 : 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reduceMotion,
    wheelMultiplier: 1,
    touchMultiplier: 1.1,
    autoRaf: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(500, 33);

  // smooth anchor navigation
  document.querySelectorAll("[data-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -20, duration: 1.2 });
      document.getElementById("mobileMenu")?.classList.remove("is-open");
      document.getElementById("navToggle")?.setAttribute("aria-expanded", "false");
    });
  });

  return lenis;
}
