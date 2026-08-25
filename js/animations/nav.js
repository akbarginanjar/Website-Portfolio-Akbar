export function initNav(gsap, ScrollTrigger) {
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const links = document.querySelectorAll(".nav-links a[data-link]");

  // background state on scroll
  ScrollTrigger.create({
    start: 40,
    end: "max",
    onUpdate: (self) => {
      nav.classList.toggle("is-scrolled", self.scroll() > 40);
    },
  });

  // active section indicator
  const sections = ["work", "about", "services", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onToggle: (self) => {
        if (!self.isActive) return;
        links.forEach((l) => l.classList.remove("is-active"));
        const match = document.querySelector(`.nav-links a[href="#${section.id}"]`);
        match?.classList.add("is-active");
      },
    });
  });

  // mobile menu
  toggle?.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.classList.toggle("is-open", !isOpen);
  });

  // magnetic hover for nav logo + links
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (!isTouch) {
    document.querySelectorAll(".nav-logo, .nav-links a").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: relX * 0.25, y: relY * 0.5, duration: 0.3, ease: "power2.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
      });
    });
  }
}
