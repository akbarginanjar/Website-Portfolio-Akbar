export function initCursor(gsap) {
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (isTouch) return;

  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const label = document.getElementById("cursorLabel");
  if (!dot || !ring) return;

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  const dotX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3.out" });
  const dotY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3.out" });
  const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
  const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

  window.addEventListener("mousemove", (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    dotX(e.clientX);
    dotY(e.clientY);
    ringX(e.clientX);
    ringY(e.clientY);
  });

  const interactive = "a, button, [data-cursor]";

  document.addEventListener("mouseover", (e) => {
    const el = e.target.closest(interactive);
    if (!el) return;
    const isProject = el.closest(".project");
    const text = isProject ? "VIEW" : el.dataset.cursorText || "";

    gsap.to(ring, { scale: text ? 2.6 : 1.6, duration: 0.4, ease: "power3.out" });
    if (text) {
      label.textContent = text;
      gsap.to(label, { opacity: 1, scale: 1, duration: 0.25, delay: 0.1 });
    }
  });

  document.addEventListener("mouseout", (e) => {
    const el = e.target.closest(interactive) || e.target.closest(".project");
    if (!el) return;
    gsap.to(ring, { scale: 1, duration: 0.4, ease: "power3.out" });
    gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2 });
  });

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(".project")) {
      label.textContent = "VIEW";
      gsap.to(ring, { scale: 2.8, duration: 0.4, ease: "power3.out" });
      gsap.to(label, { opacity: 1, scale: 1, duration: 0.25 });
    }
  });

  window.addEventListener("mousedown", () => gsap.to(dot, { scale: 0.6, duration: 0.2 }));
  window.addEventListener("mouseup", () => gsap.to(dot, { scale: 1, duration: 0.2 }));

  document.documentElement.addEventListener("mouseleave", () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
  });
  document.documentElement.addEventListener("mouseenter", () => {
    gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
  });
}
