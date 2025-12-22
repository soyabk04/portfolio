const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* ---------- mouse ---------- */
const mouse = { x: 0, y: 0, active: false };
canvas.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
});
canvas.addEventListener("mouseleave", () => mouse.active = false);

/* ---------- config ---------- */
const isMobile = window.innerWidth < 768;

ctx.lineWidth = isMobile ? 0.3 : 0.6;


/* ---------- config ---------- */
const COUNT = isMobile ? 40 : 100;
const LINK_DIST = isMobile ? 80 : 150;
const FIELD_RADIUS = isMobile ? 140 : 220;
const FORCE_MOUSE = isMobile ? 0.15 : 0.3;

const RANDOM_FORCE = isMobile ? 0.025 : 0.04;
const DAMPING = 0.95;
const MAX_SPEED = isMobile ? 1.2 : 2.0;
const RADIUS = isMobile ? 1.6 : 2.2;


/* ---------- particles ---------- */
const particles = Array.from({ length: COUNT }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  vx: 0,
  vy: 0
}));

function draw() {
  ctx.clearRect(0, 0, w, h);

  /* ---------- update ---------- */
  for (const p of particles) {

    /* true random motion (Brownian) */
    p.vx += (Math.random() - 0.5) * RANDOM_FORCE;
    p.vy += (Math.random() - 0.5) * RANDOM_FORCE;

    /* mouse repulsion */
    if (mouse.active) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d = Math.hypot(dx, dy) || 1;

      if (d < FIELD_RADIUS) {
        const f = (1 - d / FIELD_RADIUS) * FORCE_MOUSE;
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
      }
    }

    /* speed clamp */
    const speed = Math.hypot(p.vx, p.vy);
    if (speed > MAX_SPEED) {
      p.vx = (p.vx / speed) * MAX_SPEED;
      p.vy = (p.vy / speed) * MAX_SPEED;
    }

    /* integrate */
    p.x += p.vx;
    p.y += p.vy;

    /* damping */
    p.vx *= DAMPING;
    p.vy *= DAMPING;

    /* bounds */
    if (p.x < RADIUS) { p.x = RADIUS; p.vx *= -1; }
    if (p.x > w - RADIUS) { p.x = w - RADIUS; p.vx *= -1; }
    if (p.y < RADIUS) { p.y = RADIUS; p.vy *= -1; }
    if (p.y > h - RADIUS) { p.y = h - RADIUS; p.vy *= -1; }
  }

  /* ---------- draw lines ---------- */
  ctx.lineWidth = 0.6;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);

      if (d < LINK_DIST) {
        ctx.strokeStyle = `rgba(255,255,255,${1 - d / LINK_DIST})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  /* ---------- draw particles ---------- */
  ctx.fillStyle = "#ffffff";
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

draw();