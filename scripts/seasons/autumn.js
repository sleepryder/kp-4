export function init(canvas, ctx) {
  let drops = [];
  let intensity = 200;
  const maxDrops = 500;

  const rainSound = document.getElementById('autumn-audio');
  rainSound.loop = true;
  rainSound.volume = intensity / maxDrops;
  rainSound.play().catch(() => {});

  createSlider();
  for (let i = 0; i < intensity; i++) drops.push(createDrop());
  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(loop);

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateRain();
    balance();
    requestAnimationFrame(loop);
  }

  function createDrop() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: Math.random() * 4 + 4,
      length: Math.random() * 15 + 10,
      opacity: Math.random() * 0.5 + 0.5
    };
  }

  function updateRain() {
    for (let i = 0; i < drops.length; i++) {
      const p = drops[i];
      ctx.beginPath();
      ctx.strokeStyle = `rgba(180,180,255,${p.opacity})`;
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y + p.length);
      ctx.stroke();
      p.y += p.speed;
      if (p.y > canvas.height) {
        drops[i] = createDrop();
        drops[i].y = 0;
      }
    }
  }

  function balance() {
    while (drops.length < intensity && drops.length < maxDrops) drops.push(createDrop());
    while (drops.length > intensity) drops.pop();
  }

  function createSlider() {
    document.querySelectorAll('.season-slider').forEach(el => el.remove());
    const slider = Object.assign(document.createElement('input'), {
      type: 'range',
      className: 'season-slider',
      min: 0,
      max: maxDrops,
      value: intensity
    });
    Object.assign(slider.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '200px',
      zIndex: 10000
    });
    document.body.appendChild(slider);
    slider.addEventListener('input', () => {
      intensity = parseInt(slider.value, 10);
      rainSound.volume = intensity / maxDrops;
    });
  }
}
