/* =========================================================
   main — page behaviour: header state, mobile menu,
   scroll spy, reveal animations, marquees.
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header background on scroll ---------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var syncHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var nav = document.querySelector('[data-nav]');
  var menuToggle = document.querySelector('[data-menu-toggle]');
  if (nav && menuToggle) {
    var setMenu = function (open) {
      nav.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    menuToggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('is-open'));
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) setMenu(false);
    });
  }

  /* ---------- Scroll spy ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var spiedSections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  if (spiedSections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle(
              'is-current',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    spiedSections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add('will-reveal');
      });

      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
      );

      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    }
  }

  /* ---------- Hero ticker (seamless loop) ---------- */
  var tickerTrack = document.querySelector('[data-ticker]');
  if (tickerTrack && !reduceMotion) {
    var tickerGroup = tickerTrack.querySelector('.ticker__group');
    if (tickerGroup) {
      var tickerClone = tickerGroup.cloneNode(true);
      tickerClone.setAttribute('aria-hidden', 'true');
      tickerTrack.appendChild(tickerClone);
      tickerTrack.classList.add('is-looping');
    }
  }

  /* ---------- Artwork marquee ---------- */
  var workViewport = document.querySelector('[data-work-viewport]');
  var workTrack = document.querySelector('[data-work-track]');

  var measureWork = function () {
    if (!workTrack) return;
    var styles = window.getComputedStyle(workTrack);
    var gap = parseFloat(styles.columnGap || styles.gap) || 0;
    var shift = (workTrack.scrollWidth + gap) / 2;
    if (!shift) return;
    workTrack.style.setProperty('--shift', shift + 'px');
    workTrack.style.setProperty('--duration', Math.max(28, Math.round(shift / 55)) + 's');
  };

  var buildWorkMarquee = function () {
    if (!workViewport || !workTrack || reduceMotion) return;

    if (!workViewport.classList.contains('is-marquee')) {
      var items = Array.prototype.slice.call(workTrack.children);
      if (!items.length) return;

      items.forEach(function (item) {
        var clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        workTrack.appendChild(clone);
      });

      workViewport.classList.add('is-marquee');
      workTrack.classList.add('is-looping');
    }

    measureWork();
  };

  if (workTrack && !reduceMotion) {
    buildWorkMarquee();
    window.addEventListener('load', measureWork);

    var resizeTimer;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measureWork, 180);
    });

    document.addEventListener('localechange', measureWork);
  }
})();
