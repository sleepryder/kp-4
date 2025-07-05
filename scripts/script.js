document.getElementById('enter-btn')?.addEventListener('click', () => {
  document.body.classList.add('entered');
  document.getElementById('intro-overlay').style.display = 'none';
});
document.addEventListener('DOMContentLoaded', () => {
  const intro     = document.getElementById('intro-overlay');
  const enterBtn  = document.getElementById('enter-btn');
  const humAudio  = document.getElementById('hum-audio');       
  const bgAudio   = document.getElementById('background-audio');

  tryPlay(humAudio);                                            

  enterBtn.onclick = () => {
    intro.style.opacity = 0;
    setTimeout(() => intro.remove(), 1000);
    tryPlay(bgAudio);                                          
    initRoom();
  };

window.addEventListener('mousemove', e => {
  retroCursor.style.left = e.clientX + 'px';
  retroCursor.style.top = e.clientY + 'px';
});


  function tryPlay(a) { a.play().catch(() => {}); }

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

    resize();
    window.addEventListener('resize', resize);

    select.onchange = e => setSeason(e.target.value);
    setSeason(select.value);

    function resize() {
      canvas.width  = innerWidth;
      canvas.height = innerHeight;
    }

    function clearSeasonSliders() {
      document.querySelectorAll('.season-slider').forEach(el => el.remove());
    }

    function setSeason(season) {
      document.body.dataset.season = season;
      clearSeasonSliders();                                     
      Object.values(sounds).forEach(a => { a.pause(); a.currentTime = 0; });
      tryPlay(sounds[season]);
      import(`./seasons/${season}.js`).then(m => m.init(canvas, ctx));
    }

    setupHotspots();
  }

  function setupHotspots() {
    document.querySelectorAll('.hotspot').forEach(hs => {
      hs.addEventListener('click', () => {
        const text = hs.dataset.text;
        if (!text) return;

        document.querySelectorAll('.hotspot-popup').forEach(p => p.remove());

        const popup = document.createElement('div');
        popup.className = 'hotspot-popup';
        popup.innerHTML =
          '<div class="close-btn">&times;</div>' +
          `<div class="popup-content">${text}</div>`;
        document.body.appendChild(popup);

        const r = hs.getBoundingClientRect();
        popup.style.left = `${r.right + 10}px`;
        popup.style.top  = `${r.top}px`;
        popup.querySelector('.close-btn').onclick = () => popup.remove();
      });
    });
  }
});
