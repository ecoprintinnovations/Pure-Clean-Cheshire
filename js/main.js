/* ==========================================================================
   FRODSHAM BESPOKE CLEANING - MAIN JAVASCRIPT
   ========================================================================== */

(function() {
  'use strict';

  // ==========================================================================
  // UTILITY FUNCTIONS
  // ==========================================================================

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // ==========================================================================
  // MOBILE NAVIGATION
  // ==========================================================================

  function initMobileNav() {
    const navToggle = $('.nav-toggle');
    const navMenu = $('.nav-menu');
    const navLinks = $$('.nav-link');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && 
          !navMenu.contains(e.target) && 
          !navToggle.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================================================
  // HEADER SCROLL EFFECT
  // ==========================================================================

  function initHeaderScroll() {
    const header = $('.header');
    if (!header) return;

    const handleScroll = throttle(() => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // ==========================================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================================================

  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      
      const headerHeight = $('.header')?.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Focus target for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.removeAttribute('tabindex');
    });
  }

  // ==========================================================================
  // INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
  // ==========================================================================

  function initRevealAnimations() {
    const revealElements = $$('.reveal, .reveal-stagger');
    
    if (revealElements.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  // ==========================================================================
  // TESTIMONIALS SLIDER
  // ==========================================================================

  function initTestimonialsSlider() {
    const track = $('.testimonials-track');
    const prevBtn = $('.slider-btn.prev');
    const nextBtn = $('.slider-btn.next');
    const dotsContainer = $('.slider-dots');
    
    if (!track || !prevBtn || !nextBtn) return;

    const cards = $$('.testimonial-card', track);
    if (cards.length === 0) return;

    let currentIndex = 0;
    const cardsPerView = getCardsPerView();
    const maxIndex = Math.max(0, cards.length - cardsPerView);

    // Create dots
    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function getCardsPerView() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    function updateSlider() {
      const cardWidth = cards[0].offsetWidth;
      const gap = parseInt(getComputedStyle(track).gap) || 24;
      const offset = currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
      
      // Update dots
      $$('.slider-dot', dotsContainer).forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
      
      // Update button states
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;
    }

    function goToSlide(index) {
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateSlider();
    }

    function nextSlide() {
      if (currentIndex < maxIndex) {
        goToSlide(currentIndex + 1);
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
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
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    }

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newCardsPerView = getCardsPerView();
        const newMaxIndex = Math.max(0, cards.length - newCardsPerView);
        if (newMaxIndex !== maxIndex) {
          currentIndex = Math.min(currentIndex, newMaxIndex);
          createDots();
          updateSlider();
        }
      }, 250);
    });

    // Auto-advance (optional - pause on hover)
    let autoAdvanceTimer;
    const autoAdvanceDelay = 5000;

    function startAutoAdvance() {
      stopAutoAdvance();
      autoAdvanceTimer = setInterval(() => {
        if (currentIndex >= maxIndex) {
          goToSlide(0);
        } else {
          nextSlide();
        }
      }, autoAdvanceDelay);
    }

    function stopAutoAdvance() {
      clearInterval(autoAdvanceTimer);
    }

    track.addEventListener('mouseenter', stopAutoAdvance);
    track.addEventListener('mouseleave', startAutoAdvance);
    track.addEventListener('focusin', stopAutoAdvance);
    track.addEventListener('focusout', startAutoAdvance);

    // Initialize
    createDots();
    updateSlider();
    startAutoAdvance();
  }

  // ==========================================================================
  // COUNTER ANIMATION
  // ==========================================================================

  function initCounterAnimation() {
    const counters = $$('.stat-number[data-count]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-count'), 10);
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing function (easeOutQuart)
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(eased * target);
            counter.textContent = current.toLocaleString();
            
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  // ==========================================================================
  // FAQ ACCORDION
  // ==========================================================================

  function initFaqAccordion() {
    const faqItems = $$('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
      const question = $('.faq-question', item);
      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items (optional - remove for multiple open)
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
          }
        });
        
        item.classList.toggle('active');
        question.setAttribute('aria-expanded', !isActive);
      });

      // Keyboard support
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }

  // ==========================================================================
  // FORM HANDLING
  // ==========================================================================

  function initForms() {
    const forms = $$('form[data-ajax]');
    
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const messageEl = form.querySelector('.form-message');
        const formData = new FormData(form);
        
        // Validate
        if (!validateForm(form)) return;
        
        // Show loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.dataset.originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<svg class="icon spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"/></svg> Sending...';
        }
        
        if (messageEl) {
          messageEl.classList.remove('visible', 'success', 'error');
        }
        
        try {
          // Simulate API call (replace with actual endpoint)
          await simulateFormSubmit(formData);
          
          // Success
          if (messageEl) {
            messageEl.textContent = 'Thank you! We\'ll be in touch within 2 hours with your free quote.';
            messageEl.classList.add('visible', 'success');
          }
          form.reset();
          
          // Track conversion (replace with actual analytics)
          trackConversion('quote_request');
          
        } catch (error) {
          // Error
          if (messageEl) {
            messageEl.textContent = 'Something went wrong. Please try again or call us directly.';
            messageEl.classList.add('visible', 'error');
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.dataset.originalText || 'Get My Free Quote';
          }
        }
      });
    });
  }

  function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      const errorEl = field.parentNode.querySelector('.form-error');
      if (!field.value.trim()) {
        field.classList.add('error');
        if (errorEl) errorEl.textContent = 'This field is required';
        isValid = false;
      } else {
        field.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
      }
      
      // Email validation
      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          field.classList.add('error');
          if (errorEl) errorEl.textContent = 'Please enter a valid email address';
          isValid = false;
        }
      }
      
      // Phone validation (UK)
      if (field.type === 'tel' && field.value.trim()) {
        const phoneRegex = /^(\+44|0)[1-9]\d{8,9}$/;
        const cleanPhone = field.value.replace(/\s/g, '');
        if (!phoneRegex.test(cleanPhone)) {
          field.classList.add('error');
          if (errorEl) errorEl.textContent = 'Please enter a valid UK phone number';
          isValid = false;
        }
      }
    });
    
    return isValid;
  }

  function simulateFormSubmit(formData) {
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  }

  function trackConversion(eventName) {
    // Replace with actual analytics (GA4, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        'event_category': 'engagement',
        'event_label': 'quote_form'
      });
    }
    console.log('Conversion tracked:', eventName);
  }

  // ==========================================================================
  // PRICING TOGGLE (Monthly/One-off)
  // ==========================================================================

  function initPricingToggle() {
    const toggle = $('.toggle-switch');
    if (!toggle) return;

    const monthlyPrices = $$('[data-monthly]');
    const oneoffPrices = $$('[data-oneoff]');

    toggle.addEventListener('click', () => {
      const isActive = toggle.classList.toggle('active');
      
      monthlyPrices.forEach(el => {
        el.style.display = isActive ? 'none' : 'inline';
      });
      
      oneoffPrices.forEach(el => {
        el.style.display = isActive ? 'inline' : 'none';
      });
    });
  }

  // ==========================================================================
  // BACK TO TOP BUTTON
  // ==========================================================================

  function initBackToTop() {
    // Create button if not exists
    let backToTop = $('#back-to-top');
    if (!backToTop) {
      backToTop = document.createElement('button');
      backToTop.id = 'back-to-top';
      backToTop.setAttribute('aria-label', 'Back to top');
      backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>';
      document.body.appendChild(backToTop);
    }

    const showThreshold = 300;

    window.addEventListener('scroll', throttle(() => {
      if (window.scrollY > showThreshold) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, 100), { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Add back-to-top styles dynamically
  const backToTopStyles = `
    #back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-primary);
      color: var(--color-white);
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-xl);
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all var(--transition-base);
      z-index: var(--z-fixed);
    }
    #back-to-top.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    #back-to-top:hover {
      background: var(--color-primary-dark);
      transform: translateY(-2px);
    }
    #back-to-top svg {
      width: 24px;
      height: 24px;
    }
    #back-to-top .spinner {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = backToTopStyles;
  document.head.appendChild(styleSheet);

  // ==========================================================================
  // LAZY LOAD IMAGES
  // ==========================================================================

  function initLazyLoad() {
    const images = $$('img[data-src]');
    if (images.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          img.removeAttribute('data-src');
          img.removeAttribute('data-srcset');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    images.forEach(img => observer.observe(img));
  }

  // ==========================================================================
  // SERVICE CARD EXPAND (Mobile)
  // ==========================================================================

  function initServiceCards() {
    const cards = $$('.service-card');
    if (cards.length === 0) return;

    cards.forEach(card => {
      const link = $('.service-link', card);
      if (!link) return;

      link.addEventListener('click', (e) => {
        // On mobile, could expand card inline
        if (window.innerWidth < 768) {
          e.preventDefault();
          card.classList.toggle('expanded');
        }
      });
    });
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  function init() {
    // Wait for DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initMobileNav();
    initHeaderScroll();
    initSmoothScroll();
    initRevealAnimations();
    initTestimonialsSlider();
    initCounterAnimation();
    initFaqAccordion();
    initForms();
    initPricingToggle();
    initBackToTop();
    initLazyLoad();
    initServiceCards();
    registerServiceWorker();

    // Add reveal classes to elements
    addRevealClasses();
  }

  // Register service worker for PWA support
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }

  function addRevealClasses() {
    // Add reveal animations to various sections
    const revealSelectors = [
      '.service-card',
      '.trust-item',
      '.testimonial-card',
      '.value-card',
      '.team-card',
      '.area-card',
      '.pricing-card',
      '.checklist-section',
      '.sidebar-card'
    ];

    revealSelectors.forEach((selector, index) => {
      $$(selector).forEach((el, i) => {
        el.classList.add('reveal');
        // Stagger delay via CSS
        el.style.transitionDelay = `${(i * 100)}ms`;
      });
    });

    // Add reveal-stagger to grids
    $$('.services-grid, .trust-grid, .values-grid, .team-grid, .areas-grid, .pricing-cards').forEach(grid => {
      grid.classList.add('reveal-stagger');
    });
  }

  // Run init
  init();

  // ==========================================================================
  // EXPORT FOR TESTING
  // ============================================================================================================================================

  window.FrodshamCleaning = {
    initMobileNav,
    initHeaderScroll,
    initTestimonialsSlider,
    initFaqAccordion,
    validateForm
  };

})();