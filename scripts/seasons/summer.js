export function init(canvas, ctx) {
  let fireflies = [];
  let intensity = 120;
  const maxFlies = 300;
  const summerAudio = document.getElementById('summer-audio');
  if (summerAudio) { summerAudio.loop = true; summerAudio.play().catch(() => {}); }

  createSlider();
  for (let i = 0; i < intensity; i++) fireflies.push(createFly());
  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(loop);

  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,180,0.7)';
    for (const f of fireflies) { ctx.beginPath(); ctx.arc(f.x, f.y, 2, 0, 2 * Math.PI); ctx.fill(); f.x += f.vx; f.y += f.vy; if (f.x < 0 || f.x > canvas.width) f.vx *= -1; if (f.y < 0 || f.y > canvas.height) f.vy *= -1; }
    balance();
    requestAnimationFrame(loop);
  }

  function createFly() { return { x: Math.random()*canvas.width, y: Math.random()*canvas.height, vx: Math.random()*0.6-0.3, vy: Math.random()*0.6-0.3 }; }

  function balance() { while (fireflies.length < intensity && fireflies.length < maxFlies) fireflies.push(createFly()); while (fireflies.length > intensity) fireflies.pop(); }

  function createSlider() {
    document.querySelectorAll('.season-slider').forEach(el => el.remove());
    const slider = Object.assign(document.createElement('input'), { type: 'range', className: 'season-slider', min: 0, max: maxFlies, value: intensity });
    Object.assign(slider.style, { position: 'fixed', top: '20px', right: '20px', width: '200px', zIndex: 10000 });
    document.body.appendChild(slider);
    slider.addEventListener('input', () => { intensity = parseInt(slider.value, 10); });
  }
}
