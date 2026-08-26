const DATA = [
  {
    index: "01",
    title: "Matrial",
    tags: "AI · WEB · MOBILE",
    desc: "An AI-powered material marketplace paired with an intelligent construction analysis engine — helping buyers estimate needs and compare materials with data instead of guesswork.",
    tint: "#5b8cff",
    meta: ["Role — Full-stack development", "Stack — Laravel, Vue, AI Integration", "Focus — Marketplace & analysis tooling"],
  },
  {
    index: "02",
    title: "Balanja Express",
    tags: "MOBILE · COMMERCE",
    desc: "A mobile commerce ecosystem connecting customers and drivers in real time — built for speed, reliability, and clarity at every step of the order lifecycle.",
    tint: "#7a6bff",
    meta: ["Role — Mobile & backend development", "Stack — Flutter, Node.js", "Focus — Real-time order flow"],
  },
  {
    index: "03",
    title: "BPBD Jawa Barat",
    tags: "WEB · GOVERNMENT",
    desc: "A digital platform supporting regional disaster management — coordinating information between agencies and the public during critical moments.",
    tint: "#4fa8ff",
    meta: ["Role — Web development", "Stack — Laravel, MySQL", "Focus — Public coordination systems"],
  },
  {
    index: "04",
    title: "Damkar Jawa Barat",
    tags: "WEB · PUBLIC INFO",
    desc: "An emergency response and public information platform for the regional fire and rescue service, designed for clarity under pressure.",
    tint: "#5b8cff",
    meta: ["Role — Web development", "Stack — Laravel, REST API", "Focus — Emergency information systems"],
  },
  {
    index: "05",
    title: "Barata",
    tags: "MOBILE · DISASTER MGMT",
    desc: "A mobile application supporting field teams during disaster response operations, built to work reliably under unpredictable conditions.",
    tint: "#6c9cff",
    meta: ["Role — Mobile development", "Stack — Flutter", "Focus — Field operations tooling"],
  },
  {
    index: "06",
    title: "E-Course",
    tags: "WEB · EDUCATION",
    desc: "A digital learning platform for structured, self-paced online courses — from content delivery to progress tracking.",
    tint: "#5b8cff",
    meta: ["Role — Full-stack development", "Stack — Laravel, Vue", "Focus — Learning experience design"],
  },
];

export function initProjectOverlay(gsap, lenis) {
  const overlay = document.getElementById("projectOverlay");
  const closeBtn = document.getElementById("overlayClose");
  const visual = document.getElementById("overlayVisual");
  const titleEl = document.getElementById("overlayTitle");
  const descEl = document.getElementById("overlayDesc");
  const metaEl = document.getElementById("overlayMeta");

  let isOpen = false;

  function open(projectIndex) {
    const data = DATA[projectIndex];
    if (!data || isOpen) return;
    isOpen = true;

    titleEl.textContent = data.title;
    descEl.textContent = data.desc;
    metaEl.innerHTML = data.meta.map((m) => `<span>${m}</span>`).join("");
    visual.style.background = `radial-gradient(120% 140% at 20% 20%, color-mix(in srgb, ${data.tint} 26%, transparent), transparent 60%), linear-gradient(160deg, #0d0d10 0%, #08080a 60%)`;

    lenis?.stop();
    document.body.style.overflow = "hidden";

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");

    gsap.set(overlay, { clipPath: "inset(0% 0% 100% 0%)" });
    gsap.set(".overlay-visual, .overlay-content > *", { opacity: 0, y: 30 });

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(overlay, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 })
      .to(".overlay-visual", { opacity: 1, y: 0, duration: 0.8 }, 0.35)
      .to(".overlay-content > *", { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.5);

    closeBtn.focus();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        lenis?.start();
      },
    });
    tl.to(".overlay-content > *, .overlay-visual", { opacity: 0, y: 20, duration: 0.4, stagger: 0.03 }).to(
      overlay,
      { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7 },
      0.1
    );
  }

  document.querySelectorAll(".project").forEach((el) => {
    el.addEventListener("click", () => open(Number(el.dataset.project)));
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(Number(el.dataset.project));
      }
    });
  });

  closeBtn.addEventListener("click", close);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}
