export const translations = {
  en: {
    "nav.work": "WORK",
    "nav.about": "ABOUT",
    "nav.services": "SERVICES",
    "nav.contact": "CONTACT",
    "hero.eyebrow": "WEB · MOBILE · AI",
    "hero.sub": "Web & Mobile Developer crafting modern digital products with Flutter, Laravel, Node.js — and the intelligence to make them think.",
    "hero.viewWork": "View Selected Work",
    "hero.letsTalk": "Let's Talk",
    "hero.status": "Available for selected projects",
    "hero.scroll": "SCROLL",
    "statement": "I build digital products that combine thoughtful design, robust engineering and intelligent technology.",
    "about.title": "About",
    "about.p1": "I'm Akbar Ginanjar, a developer focused on building modern web and mobile applications. I work across frontend, backend and mobile ecosystems, and spend increasing amounts of time exploring how AI can make digital products more intelligent — not louder, just smarter.",
    "about.p2": "My work spans government platforms, mobile commerce, and disaster response systems — projects where reliability and clarity matter as much as polish.",
    "about.l1": "Web Development",
    "about.l2": "Mobile Development",
    "about.l3": "Backend Engineering",
    "about.l4": "AI Integration",
    "about.l5": "Intelligent Applications",
    "stack.title": "Technologies",
    "work.title": "Selected Work",
    "experience.title": "Experience",
    "exp1.date": "2024 — Present",
    "exp1.role": "Web & Mobile Developer",
    "exp1.comp": "PT Icommits",
    "exp2.date": "2023 — 2024",
    "exp2.role": "Frontend & Mobile Development",
    "exp2.comp": "Various digital projects",
    "exp3.date": "2022 — 2023",
    "exp3.role": "Junior Web Developer",
    "exp3.comp": "Freelance & contract work",
    "services.title": "What I Do",
    "serv1": "Web Development",
    "serv2": "Mobile Development",
    "serv3": "Backend Development",
    "serv4": "AI Integration",
    "serv5": "Intelligent Application Development",
    "serv6": "Interactive Web Experiences",
    "ai.title": "Building With AI",
    "ai.desc": "I explore how artificial intelligence can transform ordinary applications into intelligent experiences — systems that read context, not just input.",
    "contact.title": "LET'S BUILD<br>SOMETHING<br>GREAT.",
    "contact.sub": "Have an idea, product or project in mind? Let's turn it into something meaningful.",
    "contact.btn": "Start a Conversation",
    "footer.mid": "Web Developer · Mobile Developer · AI",
  },
  id: {
    "nav.work": "KARYA",
    "nav.about": "TENTANG",
    "nav.services": "LAYANAN",
    "nav.contact": "KONTAK",
    "hero.eyebrow": "WEB · MOBILE · AI",
    "hero.sub": "Web & Mobile Developer merancang produk digital modern dengan Flutter, Laravel, Node.js — serta kecerdasan AI untuk membuat aplikasi berpikir.",
    "hero.viewWork": "Lihat Karya Pilihan",
    "hero.letsTalk": "Mari Berdiskusi",
    "hero.status": "Tersedia untuk proyek pilihan",
    "hero.scroll": "GULIR",
    "statement": "Saya membangun produk digital yang menggabungkan desain matang, rekayasa yang anjal, dan teknologi cerdas.",
    "about.title": "Tentang Saya",
    "about.p1": "Saya Akbar Ginanjar, pengembang yang berfokus pada pembuatan aplikasi web dan mobile modern. Saya bekerja di ekosistem frontend, backend, dan mobile, serta mengeksplorasi bagaimana AI dapat membuat produk digital lebih cerdas — tidak berisik, hanya lebih pintar.",
    "about.p2": "Karya saya mencakup platform pemerintah, e-commerce mobile, dan sistem tanggap bencana — proyek di mana keandalan dan kejelasan sangat diutamakan.",
    "about.l1": "Pengembangan Web",
    "about.l2": "Pengembangan Mobile",
    "about.l3": "Rekayasa Backend",
    "about.l4": "Integrasi AI",
    "about.l5": "Aplikasi Cerdas",
    "stack.title": "Teknologi",
    "work.title": "Karya Pilihan",
    "experience.title": "Pengalaman",
    "exp1.date": "2024 — Sekarang",
    "exp1.role": "Web & Mobile Developer",
    "exp1.comp": "PT Icommits",
    "exp2.date": "2023 — 2024",
    "exp2.role": "Pengembangan Frontend & Mobile",
    "exp2.comp": "Berbagai proyek digital",
    "exp3.date": "2022 — 2023",
    "exp3.role": "Junior Web Developer",
    "exp3.comp": "Freelance & proyek kontrak",
    "services.title": "Layanan Saya",
    "serv1": "Pengembangan Web",
    "serv2": "Pengembangan Mobile",
    "serv3": "Pengembangan Backend",
    "serv4": "Integrasi AI",
    "serv5": "Pengembangan Aplikasi Cerdas",
    "serv6": "Pengalaman Web Interaktif",
    "ai.title": "Membangun Dengan AI",
    "ai.desc": "Saya mengeksplorasi bagaimana kecerdasan buatan dapat mengubah aplikasi biasa menjadi pengalaman cerdas — sistem yang memahami konteks, bukan hanya masukan data.",
    "contact.title": "MARI BANGUN<br>SESUATU YANG<br>HEBAT.",
    "contact.sub": "Punya ide, produk, atau proyek yang ingin dibuat? Mari ubah menjadi sesuatu yang berdampak nyata.",
    "contact.btn": "Mulai Diskusi",
    "footer.mid": "Web Developer · Mobile Developer · AI",
  },
};

export function initI18n() {
  const currentLang = localStorage.getItem("portfolio_lang") || "en";

  function setLanguage(lang) {
    localStorage.setItem("portfolio_lang", lang);
    document.documentElement.setAttribute("lang", lang);

    // Update active UI toggle buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const btnLang = btn.dataset.lang;
      if (btnLang === lang) {
        btn.classList.add("is-active");
      } else {
        btn.classList.remove("is-active");
      }
    });

    // Update DOM elements with data-i18n attribute
    const dict = translations[lang] || translations.en;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const text = dict[key];
      if (text) {
        if (el.dataset.i18nHtml !== undefined) {
          el.innerHTML = text;
        } else if (el.querySelector("span") && !el.dataset.i18nDirect) {
          const span = el.querySelector("span");
          span.textContent = text;
        } else {
          el.textContent = text;
        }
      }
    });
  }

  // Bind click handlers to language switch buttons
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      if (lang) setLanguage(lang);
    });
  });

  // Set initial language state
  setLanguage(currentLang);
}
