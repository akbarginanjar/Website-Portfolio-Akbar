export const translations = {
  en: {
    "nav.work": "WORK",
    "nav.about": "ABOUT",
    "nav.services": "SERVICES",
    "nav.contact": "CONTACT",
    "hero.sub": "Web & Mobile Developer crafting modern digital products with Flutter, Laravel, Node.js — and the intelligence to make them think.",
    "hero.viewWork": "View Selected Work",
    "hero.letsTalk": "Let's Talk",
    "hero.scroll": "SCROLL",
    "statement": "I design and build digital products that combine meaningful design, solid engineering, and intelligent technology to create digital experiences that are relevant and impactful.",
    "about.title": "About",
    "about.p1": "I'm Akbar Ginanjar, a developer focused on building modern web and mobile applications. I work across frontend, backend and mobile ecosystems, and spend increasing amounts of time exploring how AI can make digital products more intelligent.",
    "about.p2": "My work spans a range of digital products, from government platforms, mobile commerce, and disaster response systems, to ERP platforms and e-course systems, with a focus on solutions that are functional, modern, and deliver a great user experience.",
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
    "about.cava.label": "Owner · CAVA Perfume",
    "about.cava.desc": "A luxury fragrance brand — crafting distinctive, premium scents with a modern sensibility.",
    "about.cava.btn": "Visit",
    "footer.mid": "Web Developer · Mobile Developer · AI",
  },
  id: {
    "nav.work": "KARYA",
    "nav.about": "TENTANG",
    "nav.services": "LAYANAN",
    "nav.contact": "KONTAK",
    "hero.sub": "Web & Mobile Developer dan Digital Designer yang memadukan teknologi, desain, dan AI untuk menciptakan produk digital modern dan cerdas.",
    "hero.viewWork": "Lihat Karya Pilihan",
    "hero.letsTalk": "Mari Berdiskusi",
    "hero.scroll": "GULIR",
    "statement": "Saya merancang dan membangun produk digital yang memadukan desain yang bermakna, engineering yang solid, dan teknologi cerdas untuk menciptakan pengalaman digital yang relevan dan berdampak.",
    "about.title": "Tentang Saya",
    "about.p1": "Saya Akbar Ginanjar, seorang pengembang dan desainer digital yang berfokus pada pembuatan produk digital modern, mulai dari website dan aplikasi mobile hingga desain antarmuka dan visual. Saya bekerja di ekosistem frontend, backend, dan mobile, sekaligus mengembangkan UI/UX serta desain grafis untuk menciptakan pengalaman digital yang menarik, fungsional, dan berkarakter. Saya juga mengeksplorasi bagaimana AI dapat diintegrasikan untuk membuat produk digital lebih cerdas, inovatif, dan adaptif.",
    "about.p2": "Karya saya mencakup berbagai produk digital, mulai dari platform pemerintahan, e-commerce mobile, sistem tanggap bencana, hingga platform ERP dan e-course, dengan fokus pada solusi yang fungsional, modern, dan memberikan pengalaman pengguna yang baik.",
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
    "about.cava.label": "Owner · CAVA Perfume",
    "about.cava.desc": "Brand wewangian mewah — meracik aroma premium yang khas dengan sensibilitas modern.",
    "about.cava.btn": "Kunjungi",
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
        } else if (el.querySelector("span") && el.dataset.i18nDirect === undefined) {
          const span = el.querySelector("span");
          span.textContent = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Skill card name translations (data-i18n-skill-en / data-i18n-skill-id)
    document.querySelectorAll("[data-i18n-skill-en]").forEach((el) => {
      el.textContent = lang === "id" ? el.dataset.i18nSkillId : el.dataset.i18nSkillEn;
    });

    // Skill card desc translations (data-i18n-desc-en / data-i18n-desc-id)
    document.querySelectorAll("[data-i18n-desc-en]").forEach((el) => {
      el.textContent = lang === "id" ? el.dataset.i18nDescId : el.dataset.i18nDescEn;
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
