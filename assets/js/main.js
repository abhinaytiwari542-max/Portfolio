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

  /* current year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
