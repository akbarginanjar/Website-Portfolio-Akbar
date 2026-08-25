import * as THREE from "three";

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform vec2 uMouse;
  varying vec3 vNormal;
  varying float vDisplacement;

  // simple 3D noise (Ashima-style, condensed)
  vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normal;
    float n = snoise(position * 1.4 + uTime * 0.18);
    float mouseInfluence = (uMouse.x * position.x + uMouse.y * position.y) * 0.15;
    float displacement = n * uAmp + mouseInfluence;
    vDisplacement = displacement;
    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vNormal;
  varying float vDisplacement;

  void main() {
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.2);
    vec3 base = mix(uColorA, uColorB, clamp(vDisplacement * 1.6 + 0.5, 0.0, 1.0));
    vec3 color = base + fresnel * 0.5;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function initHeroOrb() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 768;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 4.4;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

  // NOTE: "detail" on IcosahedronGeometry grows the triangle count as 20*4^detail,
  // so this stays in the 3-6 range rather than a segment-style high number.
  const geometry = new THREE.IcosahedronGeometry(1.35, isMobile ? 3 : 6);
  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uAmp: { value: 0.16 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color("#0d1420") },
      uColorB: { value: new THREE.Color("#5b8cff") },
    },
    wireframe: false,
  });

  const orb = new THREE.Mesh(geometry, material);
  scene.add(orb);

  // thin wireframe shell for extra definition
  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.37, isMobile ? 1 : 2),
    new THREE.MeshBasicMaterial({ color: 0x5b8cff, wireframe: true, transparent: true, opacity: 0.08 })
  );
  scene.add(wire);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("mousemove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  });

  let scrollFactor = 0;
  window.addEventListener(
    "scroll",
    () => {
      scrollFactor = Math.min(window.scrollY / window.innerHeight, 1.4);
    },
    { passive: true }
  );

  let visible = true;
  const observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
  });
  observer.observe(canvas);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!visible) return;

    const t = clock.getElapsedTime();
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    material.uniforms.uTime.value = reduceMotion ? t * 0.05 : t;
    material.uniforms.uMouse.value.set(mouse.x, mouse.y);

    orb.rotation.y = t * 0.08 + mouse.x * 0.3;
    orb.rotation.x = mouse.y * 0.2 + scrollFactor * 0.5;
    wire.rotation.copy(orb.rotation);

    orb.position.y = -scrollFactor * 0.6;
    wire.position.copy(orb.position);

    orb.position.x = mouse.x * 0.25;
    wire.position.x = orb.position.x;

    renderer.render(scene, camera);
  }
  animate();
}
