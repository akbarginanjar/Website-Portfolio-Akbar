export function initAINetwork() {
  const canvas = document.getElementById("aiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const section = canvas.closest(".ai-section") || canvas;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 768;

  let w, h, dpr;
  let nodes = [];
  const NODE_COUNT = isMobile ? 30 : 65;
  const LINK_DIST = isMobile ? 100 : 130;
  let animationId = null;

  const mouse = { x: -9999, y: -9999 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6,
    }));
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  const handleMouseMove = (e) => {
    if (!visible) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  };

  window.addEventListener("mousemove", handleMouseMove, { passive: true });
  canvas.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  let visible = false;

  function step() {
    if (!visible || document.hidden) {
      animationId = null;
      return;
    }

    ctx.clearRect(0, 0, w, h);

    for (const n of nodes) {
      if (!reduceMotion) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      const dx = mouse.x - n.x;
      const dy = mouse.y - n.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 160) {
        const force = (160 - dist) / 160;
        n.x -= (dx / dist) * force * 0.6;
        n.y -= (dy / dist) * force * 0.6;
      }
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) {
          const alpha = (1 - d / LINK_DIST) * 0.35;
          ctx.strokeStyle = `rgba(91, 140, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      const distToMouse = Math.hypot(mouse.x - n.x, mouse.y - n.y);
      const glow = distToMouse < 160 ? 1 - distToMouse / 160 : 0;
      ctx.beginPath();
      ctx.fillStyle = `rgba(245, 245, 245, ${0.35 + glow * 0.5})`;
      ctx.arc(n.x, n.y, n.r + glow * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    renderCursorGlow();
    animationId = requestAnimationFrame(step);
  }

  function renderCursorGlow() {
    if (mouse.x < 0) return;
    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 160);
    gradient.addColorStop(0, "rgba(91, 140, 255, 0.12)");
    gradient.addColorStop(1, "rgba(91, 140, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 160, 0, Math.PI * 2);
    ctx.fill();
  }

  function startLoop() {
    if (!animationId && visible && !document.hidden) {
      animationId = requestAnimationFrame(step);
    }
  }

  const observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) {
      startLoop();
    } else if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }, { threshold: 0.05 });

  observer.observe(section);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    } else {
      startLoop();
    }
  });

  startLoop();

  return () => {
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", handleMouseMove);
    observer.disconnect();
    if (animationId) cancelAnimationFrame(animationId);
  };
}
