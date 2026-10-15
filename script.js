(function () {
  'use strict';

  // ---- Mobile menu ----
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function () {
    setMenu(!header.classList.contains('nav-open'));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // ---- Project filter (hidden without JS, so everything stays visible) ----
  var filterBar = document.querySelector('.filters');
  var filterButtons = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('.card');

  if (filterBar) {
    filterBar.hidden = false;
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        filterButtons.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', String(on));
        });
        cards.forEach(function (card) {
          var tags = (card.getAttribute('data-tags') || '').split(' ');
          card.hidden = !(f === 'all' || tags.indexOf(f) !== -1);
        });
      });
    });
  }

  // ---- Project videos: play only while visible, respect reduced motion ----
  var videos = document.querySelectorAll('.card-media video');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    videos.forEach(function (v) { v.controls = true; v.preload = 'metadata'; });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var v = entry.target;
      if (entry.isIntersecting) {
        var p = v.play();
        if (p && p.catch) p.catch(function () { /* autoplay blocked: poster stays */ });
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.35 });

  videos.forEach(function (v) { observer.observe(v); });
})();
