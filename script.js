(() => {
  'use strict';

  /* ============================================================
     PHOTO DATA — the 10 static assets living in /images/
     Each photo = one "month". Edit captions freely; filenames
     must stay photo1.jpg ... photo10.jpg to match /images/.
     ============================================================ */
  const PHOTOS = [
    { file: 'images/photo1.jpg',  month: 1,  title: 'Where it started to feel like forever', caption: 'That close, that easy, that us.' },
    { file: 'images/photo2.jpg',  month: 2,  title: 'Golden hour, wrapped up in you',        caption: 'Your arm around me and the whole sky on fire.' },
    { file: 'images/photo3.jpg',  month: 3,  title: 'Splashing, sulking, still adorable',     caption: 'A whole pool day and you were still the best part of it.' },
    { file: 'images/photo4.jpg',  month: 4,  title: 'Lazy dinners, easy silence',             caption: 'The kind of quiet that only feels good with you.' },
    { file: 'images/photo5.jpg',  month: 5,  title: 'Backseat, golden light, one wink',       caption: 'You never take anything seriously and I love you for it.' },
    { file: 'images/photo6.jpg',  month: 6,  title: 'Red dress, whole heart',                 caption: 'You in red is a whole personality trait of mine now.' },
    { file: 'images/photo7.jpg',  month: 7,  title: 'Dinner dates and dumb hand signs',       caption: 'Every date night, same trouble, same us.' },
    { file: 'images/photo8.jpg',  month: 8,  title: 'Pouty faces, full hearts',               caption: 'We never take a normal photo and I wouldn\u2019t change it.' },
    { file: 'images/photo9.jpg',  month: 9,  title: 'Mirror selfies, main characters',        caption: 'Just us, a mirror, and way too much main-character energy.' },
    { file: 'images/photo10.jpg', month: 10, title: 'Ten months, one favourite person',       caption: 'Here\u2019s to every month after this one.' },
  ];

  const SITE_URL = 'https://nikhilamin2.github.io/Bhondu-And-meri-Anniversary/';

  /* ============================================================
     AMBIENT: floating hearts field
     ============================================================ */
  function spawnHearts() {
    const field = document.getElementById('heartsField');
    if (!field) return;
    const COUNT = window.innerWidth < 640 ? 9 : 16;
    for (let i = 0; i < COUNT; i++) {
      const h = document.createElement('span');
      h.className = 'drift-heart';
      h.innerHTML = '&#10084;';
      const size = 8 + Math.random() * 16;
      h.style.left = Math.random() * 100 + 'vw';
      h.style.fontSize = size + 'px';
      h.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      const duration = 14 + Math.random() * 16;
      h.style.animationDuration = duration + 's';
      h.style.animationDelay = (Math.random() * duration) + 's';
      field.appendChild(h);
    }
  }

  /* ============================================================
     AMBIENT: glowing particles on canvas, subtle parallax-y drift
     ============================================================ */
  function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const isMobile = window.innerWidth < 640;
    const COUNT = isMobile ? 26 : 46;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function makeParticles() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.8,
        vy: -(0.08 + Math.random() * 0.18),
        vx: (Math.random() - 0.5) * 0.12,
        alpha: 0.15 + Math.random() * 0.35,
        hue: Math.random() > 0.5 ? '201,116,143' : '207,168,118',
      }));
    }
    resize();
    makeParticles();
    window.addEventListener('resize', () => { resize(); }, { passive: true });

    let raf;
    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.hue},${p.alpha})`;
        ctx.shadowColor = `rgba(${p.hue},${p.alpha})`;
        ctx.shadowBlur = 6;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    tick();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else tick();
    });
  }

  /* ============================================================
     MUSIC TOGGLE — plays audio/our-song.mp3 if present.
     If the file is missing (user hasn't added one yet), fails
     silently and just toggles the visual state.
     ============================================================ */
  function initMusic() {
    const btn = document.getElementById('musicToggle');
    const audio = document.getElementById('bgAudio');
    const iconPlay = document.getElementById('musicIconPlay');
    const iconPause = document.getElementById('musicIconPause');
    if (!btn || !audio) return;

    let playing = false;

    btn.addEventListener('click', () => {
      if (!playing) {
        audio.volume = 0.55;
        const p = audio.play();
        if (p && p.catch) {
          p.then(() => setPlaying(true)).catch(() => {
            // No audio file yet, or autoplay blocked — just flip the icon state.
            setPlaying(false);
          });
        } else {
          setPlaying(true);
        }
      } else {
        audio.pause();
        setPlaying(false);
      }
    });

    function setPlaying(state) {
      playing = state;
      btn.classList.toggle('is-playing', state);
      btn.setAttribute('aria-label', state ? 'Pause background music' : 'Play background music');
      iconPlay.style.display = state ? 'none' : 'block';
      iconPause.style.display = state ? 'block' : 'none';
    }

    audio.addEventListener('ended', () => setPlaying(false));
  }

  /* ============================================================
     SCREEN NAVIGATION
     ============================================================ */
  const screens = {
    opening: document.getElementById('screen-opening'),
    slideshow: document.getElementById('screen-slideshow'),
    letter: document.getElementById('screen-letter'),
  };

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('is-active'));
    screens[name].classList.add('is-active');
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  /* ============================================================
     SLIDESHOW LOGIC
     ============================================================ */
  const state = {
    index: 0,
    playing: true,
    timer: null,
    intervalMs: 5500,
  };

  const els = {
    img: document.getElementById('photoImg'),
    loading: document.getElementById('frameLoading'),
    counter: document.getElementById('counterText'),
    captionMonth: document.getElementById('captionMonth'),
    captionTitle: document.getElementById('captionTitle'),
    captionText: document.getElementById('captionText'),
    progressFill: document.getElementById('progressFill'),
    constellation: document.getElementById('constellation'),
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),
    btnAutoplay: document.getElementById('btnAutoplay'),
    iconPlay: document.getElementById('iconPlay'),
    iconPause: document.getElementById('iconPause'),
    btnFullscreen: document.getElementById('btnFullscreen'),
    stageSection: document.getElementById('screen-slideshow'),
  };

  function buildConstellation() {
    els.constellation.innerHTML = '';
    PHOTOS.forEach((p, i) => {
      const item = document.createElement('button');
      item.className = 'constellation-item';
      item.setAttribute('aria-label', `Jump to month ${p.month}`);
      item.innerHTML = `<span class="constellation-line"></span><span class="star-dot"></span><span class="star-label">${p.month}</span>`;
      item.addEventListener('click', () => goTo(i, false));
      els.constellation.appendChild(item);
    });
  }

  function updateConstellation() {
    const items = els.constellation.querySelectorAll('.constellation-item');
    items.forEach((item, i) => {
      item.classList.toggle('is-active', i === state.index);
      item.classList.toggle('is-passed', i < state.index);
    });
    const activeItem = items[state.index];
    if (activeItem && activeItem.scrollIntoView) {
      activeItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  function render() {
    const p = PHOTOS[state.index];
    els.img.classList.remove('is-loaded');
    els.loading.classList.remove('is-hidden');
    els.img.src = `images/${p.file}`;
    els.img.alt = p.title;

    els.counter.textContent = `${String(state.index + 1).padStart(2, '0')} / ${String(PHOTOS.length).padStart(2, '0')}`;
    els.captionMonth.textContent = `Month ${String(p.month).padStart(2, '0')}`;
    els.captionTitle.textContent = p.title;
    els.captionText.textContent = p.caption;

    els.btnPrev.disabled = state.index === 0;
    updateConstellation();
    restartProgress();
  }

  els.img.addEventListener('load', () => {
    els.img.classList.add('is-loaded');
    els.loading.classList.add('is-hidden');
  });
  els.img.addEventListener('error', () => {
    // Graceful fallback text if a file is genuinely missing.
    els.loading.classList.add('is-hidden');
    els.captionText.textContent = 'This memory is still finding its way here \u2014 add images/' + PHOTOS[state.index].file + ' to the project.';
  });

  function goTo(i, autoplaySource) {
    if (i < 0 || i >= PHOTOS.length) return;
    state.index = i;
    render();
    if (!autoplaySource) restartProgress();
  }

  function next() {
    if (state.index < PHOTOS.length - 1) {
      goTo(state.index + 1, true);
    } else {
      // reached the end of the constellation -> the letter
      goToLetter();
    }
  }

  function prev() {
    if (state.index > 0) goTo(state.index - 1, true);
  }

  function setPlaying(playing) {
    state.playing = playing;
    els.btnAutoplay.classList.toggle('is-active', playing);
    els.btnAutoplay.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
    els.iconPlay.style.display = playing ? 'none' : 'block';
    els.iconPause.style.display = playing ? 'block' : 'none';
    if (playing) restartProgress();
    else stopProgress();
  }

  function stopProgress() {
    if (state.timer) { clearTimeout(state.timer); state.timer = null; }
    els.progressFill.style.transition = 'none';
    els.progressFill.style.width = els.progressFill.style.width || '0%';
  }

  function restartProgress() {
    if (state.timer) clearTimeout(state.timer);
    els.progressFill.style.transition = 'none';
    els.progressFill.style.width = '0%';
    if (!state.playing) return;
    // Force reflow so the transition restarts cleanly
    void els.progressFill.offsetWidth;
    requestAnimationFrame(() => {
      els.progressFill.style.transition = `width ${state.intervalMs}ms linear`;
      els.progressFill.style.width = '100%';
    });
    state.timer = setTimeout(() => { next(); }, state.intervalMs);
  }

  function goToLetter() {
    stopProgress();
    showScreen('letter');
  }

  /* ---- touch swipe ---- */
  let touchStartX = null;
  function initSwipe() {
    const stage = document.getElementById('stage');
    stage.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 45) {
        if (dx < 0) next(); else prev();
      }
      touchStartX = null;
    }, { passive: true });
  }

  /* ---- keyboard ---- */
  function initKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (!screens.slideshow.classList.contains('is-active')) return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    });
  }

  /* ---- fullscreen ---- */
  function initFullscreen() {
    els.btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        els.stageSection.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    });
  }

  /* ============================================================
     QR CODE — generated locally with qrcode.js, no runtime
     network calls. Points at the live production URL.
     ============================================================ */
  function initQR() {
    const box = document.getElementById('qrcode');
    if (!box || typeof QRCode === 'undefined') return;
    new QRCode(box, {
      text: SITE_URL,
      width: 150,
      height: 150,
      colorDark: '#0e0812',
      colorLight: '#f4e9e2',
      correctLevel: QRCode.CorrectLevel.H,
    });
  }

  /* ============================================================
     WIRE UP
     ============================================================ */
  function init() {
    spawnHearts();
    initParticles();
    initMusic();
    buildConstellation();
    render();
    initSwipe();
    initKeyboard();
    initFullscreen();
    initQR();

    document.getElementById('startJourneyBtn').addEventListener('click', () => {
      showScreen('slideshow');
      setPlaying(true);
    });
    document.getElementById('btnBackToStart').addEventListener('click', () => {
      stopProgress();
      showScreen('opening');
    });
    document.getElementById('btnPrev').addEventListener('click', prev);
    document.getElementById('btnNext').addEventListener('click', next);
    document.getElementById('btnAutoplay').addEventListener('click', () => setPlaying(!state.playing));
    document.getElementById('btnFinish').addEventListener('click', goToLetter);
    document.getElementById('btnBackToSlides').addEventListener('click', () => {
      showScreen('slideshow');
      setPlaying(true);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
