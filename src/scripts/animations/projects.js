const DATA = [
  {
    index: "01",
    title: "Damkar Provinsi Jawa Barat",
    tags: "WEB · GOVERNMENT",
    tint: "#1e4fa3",
    image: "/assets/projects/damkar.jpg",
    href: "https://damkar.jabarprov.go.id/",
    desc: {
      en: "Official website of Damkar Provinsi Jawa Barat (West Java Fire & Rescue Service). The portal covers institutional profile, regulations, agenda and news, public data, and a geoportal — built for clear public information and service access across the province.",
      id: "Situs resmi Damkar Provinsi Jawa Barat. Portal ini menyajikan profil lembaga, peraturan, agenda dan berita, data informasi, serta geoportal — dibangun agar informasi publik dan layanan mudah diakses masyarakat di seluruh Jawa Barat.",
      su: "Situs resmi Damkar Provinsi Jawa Barat. Portal ieu nampilkeun profil lembaga, peraturan, agenda jeung berita, data informasi, sarta geoportal — diwangun sangkan informasi publik jeung layanan gampang diaksés ku masarakat di sakuliah Jawa Barat.",
    },
    meta: {
      en: [
        "Role — Web development",
        "Stack — Web platform, CMS",
        "Client — Damkar Provinsi Jawa Barat",
        "Focus — Government public information",
      ],
      id: [
        "Peran — Pengembangan web",
        "Stack — Platform web, CMS",
        "Klien — Damkar Provinsi Jawa Barat",
        "Fokus — Informasi publik pemerintahan",
      ],
      su: [
        "Peran — Pangembangan web",
        "Stack — Platform web, CMS",
        "Klien — Damkar Provinsi Jawa Barat",
        "Fokus — Informasi publik pamaréntahan",
      ],
    },
  },
  {
    index: "02",
    title: "Matrial",
    tags: "AI · WEB · MOBILE",
    desc: "An AI-powered material marketplace paired with an intelligent construction analysis engine — helping buyers estimate needs and compare materials with data instead of guesswork.",
    tint: "#5b8cff",
    meta: ["Role — Full-stack development", "Stack — Laravel, Vue, AI Integration", "Focus — Marketplace & analysis tooling"],
  },
  {
    index: "03",
    title: "Balanja Express",
    tags: "MOBILE · COMMERCE",
    desc: "A mobile commerce ecosystem connecting customers and drivers in real time — built for speed, reliability, and clarity at every step of the order lifecycle.",
    tint: "#7a6bff",
    meta: ["Role — Mobile & backend development", "Stack — Flutter, Node.js", "Focus — Real-time order flow"],
  },
  {
    index: "04",
    title: "BPBD Jawa Barat",
    tags: "WEB · GOVERNMENT",
    desc: "A digital platform supporting regional disaster management — coordinating information between agencies and the public during critical moments.",
    tint: "#4fa8ff",
    meta: ["Role — Web development", "Stack — Laravel, MySQL", "Focus — Public coordination systems"],
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

function currentLang() {
  const lang = document.documentElement.getAttribute("lang") || localStorage.getItem("portfolio_lang") || "en";
  return ["en", "id", "su"].includes(lang) ? lang : "en";
}

function localize(value, lang) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value;
  return value[lang] || value.en || Object.values(value)[0] || "";
}

export function initProjectOverlay(gsap, lenis) {
  const overlay = document.getElementById("projectOverlay");
  const closeBtn = document.getElementById("overlayClose");
  const visual = document.getElementById("overlayVisual");
  const titleEl = document.getElementById("overlayTitle");
  const descEl = document.getElementById("overlayDesc");
  const metaEl = document.getElementById("overlayMeta");
  const linkEl = document.getElementById("overlayLink");

  let isOpen = false;

  function open(projectIndex) {
    const data = DATA[projectIndex];
    if (!data || isOpen) return;
    isOpen = true;

    const lang = currentLang();
    titleEl.textContent = data.title;
    descEl.textContent = localize(data.desc, lang);
    const meta = localize(data.meta, lang);
    metaEl.innerHTML = (Array.isArray(meta) ? meta : []).map((m) => `<span>${m}</span>`).join("");

    if (data.image) {
      visual.style.backgroundImage = `url(${data.image})`;
      visual.style.backgroundSize = "contain";
      visual.style.backgroundPosition = "center";
      visual.style.backgroundRepeat = "no-repeat";
      visual.classList.add("has-image");
    } else {
      visual.style.backgroundImage = "";
      visual.style.backgroundSize = "";
      visual.style.backgroundPosition = "";
      visual.style.backgroundRepeat = "";
      visual.classList.remove("has-image");
      visual.style.background = `radial-gradient(120% 140% at 20% 20%, color-mix(in srgb, ${data.tint} 26%, transparent), transparent 60%), linear-gradient(160deg, #0d0d10 0%, #08080a 60%)`;
    }

    if (linkEl) {
      if (data.href) {
        linkEl.href = data.href;
        linkEl.hidden = false;
        linkEl.setAttribute("aria-hidden", "false");
      } else {
        linkEl.removeAttribute("href");
        linkEl.hidden = true;
        linkEl.setAttribute("aria-hidden", "true");
      }
    }

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
