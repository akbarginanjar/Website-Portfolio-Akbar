function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words
    .map((w) => `<span class="split-word" style="overflow:hidden;display:inline-block;"><span style="display:inline-block;">${w}</span></span>`)
    .join(" ");
  return el.querySelectorAll(".split-word > span");
}

export function initHeroEntrance(gsap) {
  const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "expo.out" } });

  document.querySelectorAll("[data-hero-line]").forEach((line) => {
    const text = line.textContent;
    line.innerHTML = `<span style="display:block;">${text}</span>`;
    gsap.set(line.firstElementChild, { yPercent: 110 });
  });

  tl.to(
    "[data-hero-line] > span",
    { yPercent: 0, duration: 1.3, stagger: 0.09 },
    0.1
  ).to(
    [".hero-sub", ".hero-socials", ".hero-cta"],
    { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
    0.55
  ).to(
    ".hero-photo",
    { opacity: 1, y: 0, duration: 1.0 },
    0.6
  );

  return tl;
}

export function initSectionTitles(gsap, ScrollTrigger) {
  document.querySelectorAll("[data-split]").forEach((el) => {
    const spans = splitWords(el);
    gsap.set(spans, { yPercent: 110 });
    gsap.to(spans, {
      yPercent: 0,
      duration: 1,
      ease: "expo.out",
      stagger: 0.06,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
      },
    });
  });
}

export function initGenericReveals(gsap, ScrollTrigger) {
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    // hero elements handled by hero entrance timeline
    if (el.closest(".hero")) return;
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
      },
    });
  });
}

export function initStatementReveal(gsap, ScrollTrigger) {
  const el = document.getElementById("statementText");
  if (!el) return;
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(" ");

  gsap.set(el.querySelectorAll(".word"), { opacity: 0 });
  gsap.to(el.querySelectorAll(".word"), {
    opacity: 1,
    stagger: 0.04,
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top 75%",
      end: "bottom 55%",
      scrub: 0.6,
    },
  });
}

export function initTimelineFill(gsap, ScrollTrigger) {
  const fill = document.getElementById("timelineFill");
  const track = document.querySelector(".timeline");
  if (!fill || !track) return;
  gsap.to(fill, {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: track,
      start: "top 70%",
      end: "bottom 70%",
      scrub: 0.5,
    },
  });
}

export function initScrollProgress(gsap, ScrollTrigger) {
  const bar = document.getElementById("scrollProgressBar");
  if (!bar) return;
  gsap.to(bar, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      start: 0,
      end: "max",
      scrub: 0.2,
    },
  });
  gsap.set(bar, { scaleX: 0, transformOrigin: "left" });
}

export function initOverlapSection(ScrollTrigger, pinnedSelector, revealSelector) {
  const pinned = document.querySelector(pinnedSelector);
  const reveal = document.querySelector(revealSelector);
  if (!pinned || !reveal) return;

  ScrollTrigger.create({
    trigger: pinned,
    start: "top top",
    endTrigger: reveal,
    end: "top top",
    pin: true,
    pinSpacing: false,
  });
}

export function initParallaxProjects(gsap, ScrollTrigger) {
  gsap.utils.toArray(".project-visual-inner").forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 1.08, y: -20 },
      {
        scale: 1,
        y: 20,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      }
    );
  });
}
