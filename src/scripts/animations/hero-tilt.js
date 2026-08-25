export function initHeroTilt() {
  const card = document.getElementById("heroTiltCard");
  if (!card) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const inner = card.querySelector(".tilt-card-inner");
  if (!inner) return;

  let rect = card.getBoundingClientRect();
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let animationId = null;
  let isHovered = false;

  const maxRotate = 12;

  const updateRect = () => {
    rect = card.getBoundingClientRect();
  };

  window.addEventListener("resize", updateRect, { passive: true });

  const handleMouseMove = (e) => {
    isHovered = true;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    mouseX = (x - centerX) / centerX;
    mouseY = (y - centerY) / centerY;
    targetX = mouseY * maxRotate;
    targetY = -mouseX * maxRotate;
    startLoop();
  };

  const handleMouseLeave = () => {
    isHovered = false;
    targetX = 0;
    targetY = 0;
  };

  const animate = () => {
    const currentX = parseFloat(inner.style.getPropertyValue("--rotate-x")) || 0;
    const currentY = parseFloat(inner.style.getPropertyValue("--rotate-y")) || 0;

    const ease = 0.15;
    const newX = currentX + (targetX - currentX) * ease;
    const newY = currentY + (targetY - currentY) * ease;

    inner.style.setProperty("--rotate-x", newX.toFixed(3));
    inner.style.setProperty("--rotate-y", newY.toFixed(3));
    inner.style.transform = `rotateX(${newX}deg) rotateY(${newY}deg)`;

    const diff = Math.abs(targetX - newX) + Math.abs(targetY - newY);
    if (diff < 0.01 && !isHovered) {
      inner.style.transform = "rotateX(0deg) rotateY(0deg)";
      inner.style.setProperty("--rotate-x", "0");
      inner.style.setProperty("--rotate-y", "0");
      animationId = null;
      return;
    }

    animationId = requestAnimationFrame(animate);
  };

  function startLoop() {
    if (!animationId) {
      animationId = requestAnimationFrame(animate);
    }
  }

  card.addEventListener("mousemove", handleMouseMove, { passive: true });
  card.addEventListener("mouseleave", handleMouseLeave, { passive: true });

  return () => {
    window.removeEventListener("resize", updateRect);
    card.removeEventListener("mousemove", handleMouseMove);
    card.removeEventListener("mouseleave", handleMouseLeave);
    if (animationId) cancelAnimationFrame(animationId);
  };
}