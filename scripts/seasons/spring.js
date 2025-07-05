export function init(canvas, ctx) {
  const petalImg = document.getElementById('spring-petal');
  const heartImg = document.getElementById('spring-heart');
  const springAudio = document.getElementById('spring-audio');

  let petals = [];
  let hearts = [];
  let intensity = 100;
  const maxPetals = 300;
  let volume = intensity / maxPetals;

  if (springAudio) {
    springAudio.loop = true;
    springAudio.volume = volume;
    springAudio.play().catch(() => {});
  }

  createSlider();
  for (let i = 0; i < intensity; i++) petals.push(createPetal());
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    hearts.push(createHeart(e.clientX - r.left, e.clientY - r.top));
  });
  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(loop);

  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePetals();
    updateHearts();
    requestAnimationFrame(loop);
  }

  function createPetal() {
    return { x: Math.random() * canvas.width, y: -Math.random() * canvas.height, vx: Math.random() * 0.6 - 0.3, vy: Math.random() * 1 + 0.8, rot: Math.random() * Math.PI * 2, alpha: 1 };
  }

  function createHeart(x, y) {
    const a = Math.random() * Math.PI * 2, s = Math.random() * 2 + 1;
    return { x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, alpha: 1 };
  }

  function updatePetals() {
    while (petals.length < intensity && petals.length < maxPetals) petals.push(createPetal());
    while (petals.length > intensity) petals.pop();
    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.x += p.vx; p.y += p.vy; p.rot += 0.01; p.alpha -= 0.0015;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.alpha;
      ctx.drawImage(petalImg, -15, -15, 30, 30); ctx.restore();
      if (p.y > canvas.height || p.alpha <= 0) petals[i] = createPetal();
    }
  }

  function updateHearts() {
    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.x += h.vx; h.y += h.vy; h.alpha -= 0.02;
      ctx.globalAlpha = h.alpha;
      ctx.drawImage(heartImg, h.x - 10, h.y - 10, 20, 20);
      ctx.globalAlpha = 1;
      if (h.alpha <= 0) hearts.splice(i, 1);
    }
  }

  function createSlider() {
    document.querySelectorAll('.season-slider').forEach(el => el.remove());
    const slider = Object.assign(document.createElement('input'), { type: 'range', className: 'season-slider', min: 0, max: maxPetals, value: intensity });
    Object.assign(slider.style, { position: 'fixed', top: '20px', right: '20px', width: '200px', zIndex: 10000 });
    document.body.appendChild(slider);
    slider.addEventListener('input', () => {
      intensity = parseInt(slider.value, 10);
      volume = intensity / maxPetals;
      if (springAudio) springAudio.volume = volume;
    });
  }
}