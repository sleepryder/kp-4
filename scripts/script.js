document.addEventListener('DOMContentLoaded', () => {
  const intro     = document.getElementById('intro-overlay');
  const enterBtn  = document.getElementById('enter-btn');
  const humAudio  = document.getElementById('hum-audio');
  const bgAudio   = document.getElementById('background-audio');
  const retroCursor = document.getElementById('retro-cursor'); // если используешь кастом‑курсор

  tryPlay(humAudio);

  enterBtn.onclick = () => {
    intro.style.opacity = 0;
    setTimeout(() => intro.remove(), 1000);
    tryPlay(bgAudio);
    initRoom();
  };

  window.addEventListener('mousemove', e => {
    if (retroCursor) {
      retroCursor.style.left = e.clientX + 'px';
      retroCursor.style.top  = e.clientY + 'px';
    }
  });

  function tryPlay(a) { a?.play().catch(() => {}); }

  function initRoom() {
    document.getElementById('play-pause-btn').onclick =
      () => { bgAudio[bgAudio.paused ? 'play' : 'pause'](); };

    document.getElementById('toggle-light').onclick =
      () => document.body.classList.toggle('dark-mode');

    const canvas = document.getElementById('season-canvas');
    const ctx    = canvas.getContext('2d');
    const select = document.getElementById('season-selector');
    const sounds = {
      spring: document.getElementById('spring-audio'),
      summer: document.getElementById('summer-audio'),
      autumn: document.getElementById('autumn-audio'),
      winter: document.getElementById('winter-audio')
    };

    function resize() {
      canvas.width  = innerWidth;
      canvas.height = innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function clearSliders() {
      document.querySelectorAll('.season-slider').forEach(el => el.remove());
    }

    function setSeason(season) {
      document.body.dataset.season = season;
      clearSliders();
      Object.values(sounds).forEach(a => { a.pause(); a.currentTime = 0; });
      tryPlay(sounds[season]);
      import(`./seasons/${season}.js`).then(m => m.init(canvas, ctx));
    }
    select.addEventListener('change', () => setSeason(select.value));
    setSeason(select.value);

    setupHotspots();
  }

  /* ---- hotspots + cough sound ---- */
  function setupHotspots() {
    const coughAudio = document.getElementById('cough-sound');

    document.querySelectorAll('.hotspot').forEach(hs => {
      hs.addEventListener('click', () => {
        if (coughAudio) {
          coughAudio.currentTime = 0;
          coughAudio.play().catch(() => {});
        }

        document.querySelectorAll('.hotspot-popup').forEach(p => p.remove());

        const popup = document.createElement('div');
        popup.className = 'hotspot-popup';
        popup.innerHTML = `<span class="close-btn">&times;</span>${hs.dataset.text}`;
        document.body.appendChild(popup);

        const margin = 10;
        const r   = hs.getBoundingClientRect();
        const box = popup.getBoundingClientRect();

        let left = r.right + margin + window.scrollX;
        if (left + box.width > window.innerWidth) {
          left = r.left - box.width - margin + window.scrollX;
        }

        let top = r.top + r.height / 2 - box.height / 2 + window.scrollY;
        top = Math.max(
          window.scrollY + margin,
          Math.min(top, window.scrollY + window.innerHeight - box.height - margin)
        );

        popup.style.left = `${left}px`;
        popup.style.top  = `${top}px`;

        popup.querySelector('.close-btn').onclick = () => popup.remove();
      });
    });
  }
});   
