export function initHeroWave() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const ctx = canvas.getContext("2d");
  const heroSection = canvas.closest(".hero") || canvas;

  let width, height, imageData, data;
  const isMobile = window.innerWidth < 768;
  const SCALE = isMobile ? 5 : 4;
  const ITERATIONS = isMobile ? 2 : 2;
  let animationId = null;
  let lastFrameTime = 0;
  let isVisible = true;
  const targetFPS = isMobile ? 30 : 45;
  const frameInterval = 1000 / targetFPS;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    width = Math.floor(canvas.width / SCALE);
    height = Math.floor(canvas.height / SCALE);
    imageData = ctx.createImageData(width, height);
    data = imageData.data;
  };

  window.addEventListener("resize", resizeCanvas, { passive: true });
  resizeCanvas();

  const startTime = Date.now();

  const SIN_TABLE = new Float32Array(1024);
  const COS_TABLE = new Float32Array(1024);
  for (let i = 0; i < 1024; i++) {
    const angle = (i / 1024) * Math.PI * 2;
    SIN_TABLE[i] = Math.sin(angle);
    COS_TABLE[i] = Math.cos(angle);
  }

  const fastSin = (x) => {
    const index = Math.floor(((x % (Math.PI * 2)) / (Math.PI * 2)) * 1024) & 1023;
    return SIN_TABLE[index];
  };

  const fastCos = (x) => {
    const index = Math.floor(((x % (Math.PI * 2)) / (Math.PI * 2)) * 1024) & 1023;
    return COS_TABLE[index];
  };

  const render = (currentTime) => {
    if (!isVisible || document.hidden) {
      animationId = null;
      return;
    }

    if (currentTime - lastFrameTime < frameInterval) {
      animationId = requestAnimationFrame(render);
      return;
    }
    lastFrameTime = currentTime;

    const time = (Date.now() - startTime) * 0.001;

    for (let y = 0; y < height; y++) {
      const u_y = (2 * y - height) / height;
      const rowOffset = y * width * 4;

      for (let x = 0; x < width; x++) {
        const u_x = (2 * x - width) / height;

        let a = 0;
        let d = 0;

        for (let i = 0; i < ITERATIONS; i++) {
          a += fastCos(i - d + time * 0.5 - a * u_x);
          d += fastSin(i * u_y + a);
        }

        const wave = (fastSin(a) + fastCos(d)) * 0.5;
        const intensity = 0.3 + 0.4 * wave;
        const baseVal = 0.1 + 0.15 * fastCos(u_x + u_y + time * 0.3);
        const blueAccent = 0.2 * fastSin(a * 1.5 + time * 0.2);
        const purpleAccent = 0.15 * fastCos(d * 2 + time * 0.1);

        const r = Math.max(0, Math.min(1, baseVal + purpleAccent * 0.8)) * intensity;
        const g = Math.max(0, Math.min(1, baseVal + blueAccent * 0.6)) * intensity;
        const b = Math.max(0, Math.min(1, baseVal + blueAccent * 1.2 + purpleAccent * 0.4)) * intensity;

        const index = rowOffset + x * 4;
        data[index] = r * 255;
        data[index + 1] = g * 255;
        data[index + 2] = b * 255;
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    if (SCALE > 1) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(canvas, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
    }

    animationId = requestAnimationFrame(render);
  };

  const startLoop = () => {
    if (!animationId && isVisible && !document.hidden) {
      animationId = requestAnimationFrame(render);
    }
  };

  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible) {
      startLoop();
    }
  }, { threshold: 0.05 });

  observer.observe(heroSection);

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
    window.removeEventListener("resize", resizeCanvas);
    observer.disconnect();
    if (animationId) cancelAnimationFrame(animationId);
  };
}