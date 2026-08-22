/* Abhinay Tiwari — portfolio interactions */
(function () {
  'use strict';

  /* sticky nav */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* mobile menu */
  var burger = document.querySelector('.nav__burger');
  var links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      links.classList.toggle('open');
      burger.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') links.classList.remove('open');
    });
  }

  /* scroll reveal */
  var reveals = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* reading progress (case study pages) */
  var prog = document.querySelector('.cs-prog');
  if (prog) {
    var tick = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      prog.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
  }

  /* TOC scroll-spy */
  var tocLinks = document.querySelectorAll('.cs-toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    var targets = [];
    tocLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var t = document.getElementById(id);
      if (t) { map[id] = a; targets.push(t); }
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove('active'); });
          if (map[en.target.id]) map[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-92px 0px -68% 0px', threshold: 0 });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* copy-to-clipboard for contact chips */
  document.querySelectorAll('[data-copy]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var val = el.getAttribute('data-copy');
      if (!navigator.clipboard) return;
      e.preventDefault();
      navigator.clipboard.writeText(val).then(function () {
        var tgt = el.querySelector('[data-copy-label]') || el;
        var old = tgt.textContent;
        tgt.textContent = 'Copied ✓';
        setTimeout(function () { tgt.textContent = old; }, 1400);
      });
    });
  });


  /* ---------------------------------------------------------
     theme toggle (persisted; falls back to the OS preference)
     --------------------------------------------------------- */
  var root = document.documentElement;
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('at-theme', t); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#ffffff' : '#000000');
    document.querySelectorAll('.themebtn').forEach(function (b) {
      b.setAttribute('aria-label', t === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
      b.setAttribute('aria-pressed', t === 'light');
    });
    window.dispatchEvent(new CustomEvent('themechange', { detail: t }));
  }
  document.querySelectorAll('.themebtn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    });
  });
  applyTheme(root.getAttribute('data-theme') || 'dark');

  /* ---------------------------------------------------------
     cursor starfield: parallax star layers, a drifting nebula
     that trails the pointer, and constellation lines drawn
     between stars close to it
     --------------------------------------------------------- */
  (function starfield() {
    var canvas = document.querySelector('.starfield');
    if (!canvas) return;
    // Reduced motion still gets a starfield, just a still one: no drift,
    // no twinkle, no pointer reaction. Coarse pointers skip it entirely.
    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.matchMedia('(hover: none)').matches) return;

    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, stars = [], light = false, meteors = [], sinceMeteor = 0, nextMeteor = 25;
    var LINK = 170;            // px radius the pointer links stars within
    var pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, live: false };

    function palette() {
      light = root.getAttribute('data-theme') === 'light';
    }

    function build() {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var count = Math.min(260, Math.round((W * H) / 7600));
      stars = [];
      for (var i = 0; i < count; i++) {
        var depth = Math.random();                  // 0 = far, 1 = near
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          z: depth,
          r: 0.5 + depth * 1.45,
          vx: (Math.random() - 0.5) * 0.055 * (0.4 + depth),
          vy: (Math.random() - 0.5) * 0.055 * (0.4 + depth),
          tw: Math.random() * Math.PI * 2,          // twinkle phase
          ts: 0.006 + Math.random() * 0.014,        // twinkle speed
          hue: Math.random()                        // which accent it leans toward
        });
      }
    }

    function frame() {
      // pointer easing
      pointer.x += (pointer.tx - pointer.x) * 0.075;
      pointer.y += (pointer.ty - pointer.y) * 0.075;

      ctx.clearRect(0, 0, W, H);

      // nebula that trails the cursor
      if (pointer.live) {
        var R = 185;
        var g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, R);
        if (light) {
          g.addColorStop(0,    'rgba(31,158,67,.070)');
          g.addColorStop(0.30, 'rgba(70,110,200,.038)');
          g.addColorStop(0.65, 'rgba(90,80,220,.014)');
          g.addColorStop(1,    'rgba(90,80,220,0)');
        } else {
          g.addColorStop(0,    'rgba(135,228,124,.085)');
          g.addColorStop(0.30, 'rgba(140,180,220,.045)');
          g.addColorStop(0.65, 'rgba(146,146,245,.016)');
          g.addColorStop(1,    'rgba(146,146,245,0)');
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, R, 0, Math.PI * 2);
        ctx.fill();
      }

      /* --- shooting stars --- */
      if (!still) {
        sinceMeteor++;
        if (sinceMeteor > nextMeteor && meteors.length < 2) {
          sinceMeteor = 0;
          nextMeteor = 90 + Math.floor(Math.random() * 170);    // ~1.5-4.3s apart at 60fps
          // Start the head inside the viewport and aim it across, so the whole
          // streak is on-screen. Spawning off the left edge wastes most of a
          // meteor's short life travelling into view.
          var dir = Math.random() < 0.5 ? 1 : -1;
          var ang = (0.17 + Math.random() * 0.15) * Math.PI;    // ~31-58 deg
          var speed = 9 + Math.random() * 7;
          meteors.push({
            x: dir === 1 ? W * (0.02 + Math.random() * 0.42)
                         : W * (0.56 + Math.random() * 0.42),
            y: -20 + Math.random() * H * 0.34,
            vx: Math.cos(ang) * speed * dir,
            vy: Math.sin(ang) * speed,
            len: 150 + Math.random() * 130,
            life: 0,
            max: 72 + Math.random() * 38
          });
        }
        for (var m = meteors.length - 1; m >= 0; m--) {
          var mt = meteors[m];
          mt.x += mt.vx; mt.y += mt.vy; mt.life++;

          var t = mt.life / mt.max;
          // ramp in fast, hold at full for most of the flight, then fall off
          var fade = t < 0.12 ? t / 0.12 : (t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45);
          if (fade <= 0 || mt.life > mt.max || mt.y > H + 90 ||
              mt.x < -mt.len - 40 || mt.x > W + mt.len + 40) { meteors.splice(m, 1); continue; }

          var mag = Math.sqrt(mt.vx * mt.vx + mt.vy * mt.vy) || 1;
          var tx = mt.x - (mt.vx / mag) * mt.len;
          var ty = mt.y - (mt.vy / mag) * mt.len;

          var head = light ? '26,132,58'  : '235,255,232';
          var mid  = light ? '31,158,67'   : '150,235,150';
          var tail = light ? '90,80,220'   : '146,146,245';

          var tg = ctx.createLinearGradient(mt.x, mt.y, tx, ty);
          tg.addColorStop(0,    'rgba(' + head + ',' + (1.00 * fade).toFixed(3) + ')');
          tg.addColorStop(0.14, 'rgba(' + mid  + ',' + (0.78 * fade).toFixed(3) + ')');
          tg.addColorStop(0.45, 'rgba(' + tail + ',' + (0.40 * fade).toFixed(3) + ')');
          tg.addColorStop(1,    'rgba(' + tail + ',0)');

          ctx.lineCap = 'round';

          // soft wide underlay so the streak reads against the background
          ctx.beginPath();
          ctx.moveTo(mt.x, mt.y);
          ctx.lineTo(tx, ty);
          ctx.strokeStyle = tg;
          ctx.lineWidth = 4.5;
          ctx.globalAlpha = 0.35;
          ctx.stroke();

          // crisp core
          ctx.globalAlpha = 1;
          ctx.lineWidth = 1.9;
          ctx.stroke();
          ctx.lineCap = 'butt';

          // glowing head
          var hg = ctx.createRadialGradient(mt.x, mt.y, 0, mt.x, mt.y, 9);
          hg.addColorStop(0,   'rgba(' + head + ',' + (0.95 * fade).toFixed(3) + ')');
          hg.addColorStop(0.4, 'rgba(' + mid  + ',' + (0.45 * fade).toFixed(3) + ')');
          hg.addColorStop(1,   'rgba(' + mid  + ',0)');
          ctx.beginPath();
          ctx.arc(mt.x, mt.y, 9, 0, Math.PI * 2);
          ctx.fillStyle = hg;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(mt.x, mt.y, 2.1, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + head + ',' + Math.min(1, 1.1 * fade).toFixed(3) + ')';
          ctx.fill();
        }
      }

      var near = [];

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];

        // slow drift, wrapping at the edges
        s.x += s.vx; s.y += s.vy;
        if (s.x < -6) s.x = W + 6; else if (s.x > W + 6) s.x = -6;
        if (s.y < -6) s.y = H + 6; else if (s.y > H + 6) s.y = -6;

        s.tw += s.ts;

        // parallax: nearer stars lean further toward the pointer
        var px = s.x, py = s.y, dx = 0, dy = 0, d2 = Infinity;
        if (pointer.live) {
          dx = pointer.x - s.x;
          dy = pointer.y - s.y;
          d2 = dx * dx + dy * dy;
          var pull = (0.012 + s.z * 0.030);
          px = s.x + dx * pull;
          py = s.y + dy * pull;
        }

        var twinkle = 0.55 + Math.sin(s.tw) * 0.3;
        var alpha = (0.16 + s.z * 0.5) * twinkle;

        // stars near the pointer brighten and shift toward an accent
        var boost = 0;
        if (d2 < LINK * LINK) {
          boost = 1 - Math.sqrt(d2) / LINK;
          alpha += boost * 0.42;
          near.push({ x: px, y: py, w: boost });
        }

        var col;
        if (boost > 0.05) {
          col = s.hue > 0.5
            ? (light ? '31,158,67'  : '135,228,124')
            : (light ? '90,80,220'  : '146,146,245');
        } else {
          col = light ? '40,40,52' : '235,235,245';
        }

        ctx.beginPath();
        ctx.arc(px, py, s.r * (1 + boost * 0.55), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + col + ',' + Math.min(alpha, 0.95).toFixed(3) + ')';
        ctx.fill();
      }

      // spokes from the pointer out to the closest stars
      if (pointer.live) {
        for (var k = 0; k < near.length; k++) {
          var so = near[k].w * near[k].w * 0.30;
          if (so < 0.012) continue;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(near[k].x, near[k].y);
          ctx.strokeStyle = light
            ? 'rgba(31,158,67,' + so.toFixed(3) + ')'
            : 'rgba(135,228,124,' + so.toFixed(3) + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // constellation lines between the stars closest to the pointer
      for (var a = 0; a < near.length; a++) {
        for (var b = a + 1; b < near.length; b++) {
          var lx = near[a].x - near[b].x, ly = near[a].y - near[b].y;
          var dist = Math.sqrt(lx * lx + ly * ly);
          if (dist > LINK) continue;
          var o = (1 - dist / LINK) * near[a].w * near[b].w * 0.85;
          if (o < 0.012) continue;
          ctx.beginPath();
          ctx.moveTo(near[a].x, near[a].y);
          ctx.lineTo(near[b].x, near[b].y);
          ctx.strokeStyle = light
            ? 'rgba(90,80,220,' + o.toFixed(3) + ')'
            : 'rgba(146,146,245,' + o.toFixed(3) + ')';
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }

      if (!still) requestAnimationFrame(frame);
    }

    if (!still) {
      window.addEventListener('pointermove', function (e) {
        pointer.tx = e.clientX;
        pointer.ty = e.clientY;
        if (!pointer.live) { pointer.x = e.clientX; pointer.y = e.clientY; pointer.live = true; }
      }, { passive: true });
    }

    window.addEventListener('pointerleave', function () { pointer.live = false; });
    window.addEventListener('themechange', palette);

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { meteors = []; build(); if (still) frame(); }, 180);
    });

    palette();
    build();
    canvas.classList.add('ready');
    frame();   // paint the first frame synchronously; frame() re-schedules itself
  })();


  /* ---------------------------------------------------------
     an abstract blob that trails the pointer, so the page has
     something alive in it without competing with the content
     --------------------------------------------------------- */
  (function cursorOrb() {
    var orb = document.querySelector('.orb');
    if (!orb) return;
    if (window.matchMedia('(hover: none)').matches) { orb.remove(); return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { orb.remove(); return; }

    var x = -200, y = -200, tx = -200, ty = -200, shown = false, raf = null;

    function loop() {
      x += (tx - x) * 0.13;
      y += (ty - y) * 0.13;
      orb.style.transform = 'translate3d(' + (x - 19) + 'px,' + (y - 19) + 'px,0)';
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!shown) {
        shown = true; x = tx; y = ty;
        orb.classList.add('on');
        if (!raf) raf = requestAnimationFrame(loop);
      }
    }, { passive: true });

    window.addEventListener('pointerleave', function () { orb.classList.remove('on'); shown = false; });

    // grows over anything clickable
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest && e.target.closest('a,button,.work,.build,.ccard');
      orb.classList.toggle('big', !!t);
    });
  })();


  /* ---------------------------------------------------------
     vinyl button: tap the record to start, tap again to stop.
     Tries each candidate source in turn and hides itself if
     none of them can play, so the header never shows a control
     that does nothing.
     --------------------------------------------------------- */
  (function vinyl() {
    var btn = document.querySelector('.vinylbtn');
    if (!btn) return;

    var list = (btn.getAttribute('data-src') || '').split(',')
                 .map(function (x) { return x.trim(); }).filter(Boolean);
    if (!list.length) { btn.hidden = true; return; }

    var audio = new Audio();
    audio.loop = true;
    audio.preload = 'metadata';
    audio.volume = 0;

    var TARGET = 0.4, at = 0, ready = false, fadeTimer = null;
    var wantPlaying = false;   // intent, which is not the same as audio.paused

    function tryNext() {
      if (at >= list.length) { btn.hidden = true; return; }
      audio.src = list[at++];
      audio.load();
    }
    audio.addEventListener('error', function () { if (!ready) tryNext(); });
    audio.addEventListener('loadedmetadata', function () { ready = true; btn.hidden = false; });
    tryNext();

    function fadeTo(to, done) {
      clearInterval(fadeTimer);
      var step = (to - audio.volume) / 14;
      fadeTimer = setInterval(function () {
        var v = audio.volume + step;
        if (step === 0 || (step > 0 && v >= to) || (step < 0 && v <= to)) {
          audio.volume = Math.min(1, Math.max(0, to));
          clearInterval(fadeTimer);
          if (done) done();
        } else { audio.volume = Math.min(1, Math.max(0, v)); }
      }, 28);
    }

    function paint(on) {
      wantPlaying = on;
      btn.classList.toggle('is-playing', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', on ? 'Stop the music' : 'Play music while you read');
      var tip = btn.querySelector('.vinylbtn__tip');
      if (tip) tip.textContent = on ? 'Tap to stop' : 'Play music';
      try { sessionStorage.setItem('at-music', on ? '1' : '0'); } catch (e) {}
    }

    function start() {
      var p = audio.play();
      if (p && p.catch) {
        p.then(function () { paint(true); fadeTo(TARGET); })
         .catch(function () { paint(false); });     // browser refused to autoplay
      } else { paint(true); fadeTo(TARGET); }
    }
    function stop() { fadeTo(0, function () { audio.pause(); }); paint(false); }

    btn.addEventListener('click', function () {
      if (wantPlaying) stop(); else start();
    });

    // carry playback across page navigations
    try { if (sessionStorage.getItem('at-music') === '1') start(); } catch (e) {}

    // don't play into an empty room
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && !audio.paused) audio.pause();
      else if (!document.hidden && wantPlaying && audio.paused) {
        var p = audio.play(); if (p && p.catch) p.catch(function () { paint(false); });
      }
    });
  })();

  /* current year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
