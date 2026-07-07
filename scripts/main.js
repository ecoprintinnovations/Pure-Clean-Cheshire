/**
 * Pure Clean Cheshire - Main JavaScript
 * Vanilla JS, no dependencies, progressive enhancement
 */

(function() {
  'use strict';

  // ============================================================
  // UTILITIES
  // ============================================================
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const onReady = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  const prefersReducedMotion = () => 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================================
  // MOBILE NAVIGATION
  // ============================================================
  function initMobileNav() {
    const toggle = $('.nav-toggle');
    const menu = $('#nav-menu');
    if (!toggle || !menu) return;

    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenu() : openMenu();
    });

    // Close on link click
    $$('.nav-link', menu).forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('open') && 
          !menu.contains(e.target) && 
          !toggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // ============================================================
  // HEADER SCROLL STATE
  // ============================================================
  function initHeaderScroll() {
    const header = $('.header');
    if (!header) return;

    let lastScroll = 0;
    const threshold = 50;

    const onScroll = () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > threshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check
  }

  // ============================================================
  // COUNTER ANIMATION (Hero Stats)
  // ============================================================
  function initCounters() {
    const counters = $$('.stat-number[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const startTime = performance.now();

    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.floor(target * eased);
      el.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(update);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // ============================================================
  // TESTIMONIAL SLIDER
  // ============================================================
  function initTestimonialSlider() {
    const track = $('.testimonials-track');
    const prevBtn = $('.slider-btn.prev');
    const nextBtn = $('.slider-btn.next');
    const dotsContainer = $('.slider-dots');
    if (!track || !prevBtn || !nextBtn) return;

    const cards = $$('.testimonial-card', track);
    if (cards.length <= 1) return;

    let currentIndex = 0;
    const cardWidth = 100 / getCardsPerView();
    let autoSlideTimer;

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = $$('.slider-dot', dotsContainer);

    function getCardsPerView() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    function updateSlider() {
      const offset = -currentIndex * cardWidth;
      track.style.transform = `translateX(${offset}%)`;
      
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= cards.length - getCardsPerView();
    }

    function goToSlide(index) {
      const maxIndex = cards.length - getCardsPerView();
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateSlider();
      resetAutoSlide();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoSlide() {
      if (prefersReducedMotion()) return;
      autoSlideTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideTimer);
      startAutoSlide();
    }

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextSlide() : prevSlide();
      }
    }, { passive: true });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newCardWidth = 100 / getCardsPerView();
        if (newCardWidth !== cardWidth) {
          // Recalculate - simplified for now
          updateSlider();
        }
      }, 250);
    });

    // Init
    updateSlider();
    startAutoSlide();

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
    track.addEventListener('mouseleave', startAutoSlide);
  }

  // ============================================================
  // FAQ ACCORDION
  // ============================================================
  function initFaqAccordion() {
    const questions = $$('.faq-question');
    if (!questions.length) return;

    questions.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');
        
        // Close all others
        $$('.faq-item').forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
        
        // Toggle current
        item.classList.toggle('active');
        
        // Update aria
        btn.setAttribute('aria-expanded', !isActive);
      });
    });
  }

  // ============================================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================================
  function initScrollReveal() {
    if (prefersReducedMotion()) {
      $$('.reveal').forEach(el => el.classList.add('active'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    $$('.reveal').forEach(el => observer.observe(el));

    // Staggered children
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    $$('.reveal-stagger').forEach(el => staggerObserver.observe(el));
  }

  // ============================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = $(targetId);
        if (target) {
          e.preventDefault();
          const header = $('.header');
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  // ============================================================
  // FORM ENHANCEMENT (Netlify Forms)
  // ============================================================
  function initForms() {
    const forms = $$('form[data-netlify="true"]');
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }
        // Let Netlify handle the actual submission
      });
    });
  }

  // ============================================================
  // INITIALIZE ALL
  // ============================================================
  onReady(() => {
    initMobileNav();
    initHeaderScroll();
    initCounters();
    initTestimonialSlider();
    initFaqAccordion();
    initScrollReveal();
    initSmoothScroll();
    initForms();
    
    // Mark body as JS-enabled for any CSS fallbacks
    document.body.classList.add('js-enabled');
  });

})();