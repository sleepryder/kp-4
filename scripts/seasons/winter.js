export function init(canvas, ctx) {
  let flakes = [];
  let intensity = 150;
  const maxFlakes = 400;
  let snowVolume = intensity / maxFlakes;

  const snowSound = document.getElementById('winter-audio');
  if (snowSound) {
    snowSound.loop = true;
    snowSound.volume = snowVolume;
    snowSound.play().catch(() => {});
  }

  createSliderUI();
  for (let i = 0; i < intensity; i++) flakes.push(createFlake());
  requestAnimationFrame(loop);

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnow();
    requestAnimationFrame(loop);
  }

  function createFlake() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5,
      drift: Math.random() * 0.5 + 0.3,
      angle: Math.random() * Math.PI * 2
    };
  }

  function drawSnow() {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    for (const f of flakes) {
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    }
    ctx.fill();
    updateSnow();
    balanceArray();
  }

  function updateSnow() {
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.angle += 0.01;
      f.x += Math.sin(f.angle) * f.drift;
      f.y += f.speed;

      if (f.y > canvas.height) {
        flakes[i] = createFlake();
        flakes[i].y = 0;
      }
      if (f.x > canvas.width) f.x = 0;
      if (f.x < 0) f.x = canvas.width;
    }
  }

  function balanceArray() {
    while (flakes.length < intensity && flakes.length < maxFlakes)
      flakes.push(createFlake());
    while (flakes.length > intensity)
      flakes.pop();
  }

  function createSliderUI() {
    document.querySelectorAll('.season-slider').forEach(el => el.remove());
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'season-slider';
    slider.min = 0;
    slider.max = maxFlakes;
    slider.value = intensity;
    Object.assign(slider.style, {
      position: 'fixed', top: '20px', right: '20px', width: '200px', zIndex: 10000
    });
    document.body.appendChild(slider);
    slider.addEventListener('input', () => {
      intensity = Math.max(0, parseInt(slider.value, 10));
      snowVolume = intensity / maxFlakes;
      if (snowSound) snowSound.volume = snowVolume;
      balanceArray();
    });
  }
}
