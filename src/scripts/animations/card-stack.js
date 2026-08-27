/**
 * Fan card stack + lightbox preview for Certificates.
 */
export function initCardStack(gsap) {
  const roots = document.querySelectorAll("[data-card-stack]");
  if (!roots.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  roots.forEach((root) => {
    const items = [...root.querySelectorAll("[data-card-stack-item]")];
    const dots = [...root.querySelectorAll("[data-card-stack-dot]")];
    const stage = root.querySelector("[data-card-stack-stage]");
    const status = root.querySelector("[data-card-stack-status]");
    const prevBtn = root.querySelector("[data-card-stack-prev]");
    const nextBtn = root.querySelector("[data-card-stack-next]");
    const preview = root.closest(".certificates")?.querySelector("[data-cert-preview]");
    const previewImg = preview?.querySelector("[data-cert-preview-img]");
    const len = items.length;
    if (!len || !stage) return;

    let active = 0;
    let hovering = false;
    let pointerId = null;
    let startX = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let dragging = false;
    let dragMoved = false;
    let previewTrigger = null;

    const maxOffset = 3;

    function cardWidth() {
      return Math.min(540, Math.max(260, stage.clientWidth * 0.7));
    }

    function signedOffset(i, a) {
      const raw = i - a;
      const alt = raw > 0 ? raw - len : raw + len;
      return Math.abs(alt) < Math.abs(raw) ? alt : raw;
    }

    function poseFor(i, a, dragX = 0) {
      const w = cardWidth();
      const spacing = Math.round(w * 0.48);
      const stepDeg = 14;
      const off = signedOffset(i, a);
      const abs = Math.abs(off);
      const isActive = off === 0;
      const dragInfluence = isActive ? 1 : Math.max(0, 1 - abs * 0.35);

      return {
        visible: abs <= maxOffset,
        isActive,
        abs,
        x: off * spacing + dragX * dragInfluence,
        y: abs * 12 + (isActive ? -22 : 0) + Math.abs(dragX) * 0.04 * dragInfluence,
        rotateZ: off * stepDeg + (dragX / w) * 10 * dragInfluence,
        rotateX: isActive ? 0 : 8,
        scale: isActive ? 1.05 : 0.92 - abs * 0.015,
        zIndex: 100 - abs,
        opacity: abs > maxOffset ? 0 : 1 - abs * 0.08,
        filter: abs === 0 ? "blur(0px)" : `blur(${Math.min(2.5, abs * 0.6)}px)`,
        z: -abs * 120,
      };
    }

    function layout(immediate = false, dragX = 0) {
      items.forEach((el, i) => {
        const pose = poseFor(i, active, dragX);
        const card = el.querySelector(".cert-card");

        el.style.visibility = pose.visible ? "visible" : "hidden";
        el.style.pointerEvents = pose.visible ? "auto" : "none";
        el.setAttribute("aria-hidden", pose.visible ? "false" : "true");
        if (card) card.dataset.active = pose.isActive ? "true" : "false";
        if (!pose.visible) return;

        if (card) card.style.setProperty("--card-z", `${pose.z}px`);

        const props = {
          x: pose.x,
          y: pose.y,
          rotateZ: pose.rotateZ,
          rotateX: pose.rotateX,
          scale: pose.scale,
          opacity: pose.opacity,
          zIndex: pose.zIndex,
          filter: reduceMotion ? "none" : pose.filter,
          duration: reduceMotion || immediate ? 0 : dragging ? 0.12 : 0.7,
          ease: dragging ? "power2.out" : "power4.out",
          overwrite: "auto",
        };

        gsap.to(el, props);
      });

      dots.forEach((dot, i) => {
        const on = i === active;
        dot.classList.toggle("is-active", on);
        dot.setAttribute("aria-selected", on ? "true" : "false");
      });

      const title = items[active]?.dataset.previewTitle || "";
      if (status) status.textContent = title;
    }

    function go(index) {
      active = ((index % len) + len) % len;
      layout();
    }

    function next() {
      go(active + 1);
    }

    function prev() {
      go(active - 1);
    }

    function openPreview(item) {
      if (!preview || !previewImg || !item) return;
      const src = item.dataset.previewSrc;
      const title = item.dataset.previewTitle || "Certificate";
      if (!src) return;

      previewTrigger = document.activeElement;
      previewImg.src = src;
      previewImg.alt = title;
      preview.hidden = false;
      preview.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("cert-preview-open");

      const panel = preview.querySelector(".cert-preview__panel");
      const closeBtn = preview.querySelector(".cert-preview__close");

      if (reduceMotion) {
        gsap.set(preview, { opacity: 1 });
        gsap.set(panel, { opacity: 1, scale: 1, y: 0 });
      } else {
        gsap.fromTo(preview, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power2.out" });
        gsap.fromTo(
          panel,
          { opacity: 0, scale: 0.92, y: 24 },
          { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "power4.out" },
        );
      }
      closeBtn?.focus();
    }

    function closePreview() {
      if (!preview || preview.hidden) return;
      const panel = preview.querySelector(".cert-preview__panel");

      const finish = () => {
        preview.hidden = true;
        preview.setAttribute("aria-hidden", "true");
        document.documentElement.classList.remove("cert-preview-open");
        if (previewImg) {
          previewImg.removeAttribute("src");
          previewImg.alt = "";
        }
        previewTrigger?.focus?.();
        previewTrigger = null;
      };

      if (reduceMotion) {
        finish();
        return;
      }

      gsap.to(panel, { opacity: 0, scale: 0.96, y: 12, duration: 0.22, ease: "power2.in" });
      gsap.to(preview, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: finish,
      });
    }

    prevBtn?.addEventListener("click", prev);
    nextBtn?.addEventListener("click", next);
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const i = Number(dot.dataset.index);
        if (!Number.isNaN(i)) go(i);
      });
    });

    items.forEach((el, i) => {
      const card = el.querySelector(".cert-card");
      card?.addEventListener("click", () => {
        if (dragMoved) return;
        if (i !== active) {
          go(i);
          return;
        }
        openPreview(el);
      });
    });

    preview?.querySelectorAll("[data-cert-preview-close]").forEach((btn) => {
      btn.addEventListener("click", closePreview);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closePreview();
    });

    stage.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPreview(items[active]);
      }
    });

    root.addEventListener("mouseenter", () => {
      hovering = true;
    });
    root.addEventListener("mouseleave", () => {
      hovering = false;
    });

    stage.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".card-stack__controls")) return;
      if (e.button != null && e.button !== 0) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      lastX = e.clientX;
      lastT = performance.now();
      velocity = 0;
      dragging = true;
      dragMoved = false;
      stage.setPointerCapture?.(pointerId);
      stage.classList.add("is-dragging");
    });

    stage.addEventListener("pointermove", (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const now = performance.now();
      const dx = e.clientX - startX;
      const dt = Math.max(1, now - lastT);
      velocity = ((e.clientX - lastX) / dt) * 1000;
      lastX = e.clientX;
      lastT = now;

      if (Math.abs(dx) > 6) dragMoved = true;
      layout(false, dx);
    });

    function endDrag(e) {
      if (!dragging || (e && e.pointerId !== pointerId)) return;
      const dx = (e?.clientX ?? lastX) - startX;
      dragging = false;
      pointerId = null;
      stage.classList.remove("is-dragging");

      const w = cardWidth();
      const distanceThreshold = Math.min(90, w * 0.14);
      const velocityThreshold = 450;

      if (dx > distanceThreshold || velocity > velocityThreshold) prev();
      else if (dx < -distanceThreshold || velocity < -velocityThreshold) next();
      else layout();

      // allow click only if almost no movement
      window.setTimeout(() => {
        dragMoved = false;
      }, 40);
    }

    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    if (!reduceMotion) {
      window.setInterval(() => {
        if (hovering || document.hidden || dragging || !preview?.hidden) return;
        next();
      }, 3800);
    }

    layout(true);
    const ro = new ResizeObserver(() => layout(true));
    ro.observe(stage);
  });
}
