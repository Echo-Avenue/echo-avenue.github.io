/* ============================================
   Echo Avenue — Scroll & Interaction Scripts
   ============================================ */

(function () {
  'use strict';

  // --- Cursor Glow ---
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // --- Navigation Scroll ---
  var nav = document.getElementById('nav');
  var progressBar = document.getElementById('progressBar');

  function updateNav() {
    var scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Progress bar
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  // --- Hero Background Zoom ---
  var heroBgImg = document.querySelector('.hero-bg-img');
  if (heroBgImg) {
    if (heroBgImg.complete) {
      heroBgImg.classList.add('loaded');
    } else {
      heroBgImg.addEventListener('load', function () {
        heroBgImg.classList.add('loaded');
      });
    }
  }

  // --- Hero Reveal Animations ---
  var heroReveals = document.querySelectorAll('.reveal');
  setTimeout(function () {
    heroReveals.forEach(function (el) {
      var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(function () {
        el.classList.add('visible');
      }, delay);
    });
  }, 300);

  // --- Scroll Reveal (Intersection Observer) ---
  var scrollRevealElements = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    scrollRevealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    scrollRevealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Parallax Effect on Hero ---
  var hero = document.getElementById('hero');
  function updateParallax() {
    if (!hero) return;
    var scrollY = window.scrollY;
    var heroHeight = hero.offsetHeight;
    if (scrollY < heroHeight) {
      var translateY = scrollY * 0.3;
      var opacity = 1 - scrollY / heroHeight;
      var heroContent = hero.querySelector('.hero-content');
      if (heroContent) {
        heroContent.style.transform = 'translateY(' + translateY + 'px)';
        heroContent.style.opacity = Math.max(0, opacity);
      }
    }
  }

  // --- Smooth Anchor Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  // --- Gallery Image Parallax ---
  var galleryImages = document.querySelectorAll('.gallery-img-wrapper img');

  function updateGalleryParallax() {
    galleryImages.forEach(function (img) {
      var rect = img.getBoundingClientRect();
      var windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        var progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        var translateY = (progress - 0.5) * 20;
        img.style.transform = 'translateY(' + translateY + 'px)';
      }
    });
  }

  // --- Scroll Event Handler (throttled) ---
  var ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateNav();
        updateParallax();
        updateGalleryParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial call
  updateNav();
  updateParallax();
})();
