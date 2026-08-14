/* ═══════════════════════════════════════════════════
   VEERAJ H. BAGMAR — Portfolio Script
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Check reduced motion preference ───
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── NAVBAR: Scroll effect & active link ───
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links li a');
  const sections = document.querySelectorAll('section');

  function handleScroll() {
    // Add/remove scrolled class
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active nav link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial call

  // ─── HAMBURGER MENU ───
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isExpanded = navMenu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);

    // Change icon
    if (isExpanded) {
      hamburger.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
    } else {
      hamburger.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>';
    }
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>';
    });
  });

  // ─── SOCIAL ICONS: Staggered pop-in ───
  const socialIcons = document.querySelectorAll('.social-icon');
  socialIcons.forEach((icon, i) => {
    if (prefersReducedMotion) {
      icon.style.opacity = '1';
      icon.style.transform = 'scale(1)';
      return;
    }
    setTimeout(() => {
      icon.style.transition = 'opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      icon.style.opacity = '1';
      icon.style.transform = 'scale(1)';
    }, 1200 + i * 200);
  });

  // ─── INTERSECTION OBSERVER: Scroll animations ───
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // Animate skill bars inside this element
        const skillBars = entry.target.querySelectorAll('.skill-bar');
        skillBars.forEach(bar => {
          const width = bar.getAttribute('data-width');
          if (width) {
            setTimeout(() => {
              bar.style.width = width + '%';
            }, 300);
          }
        });

        // Animate skill percentages
        const skillPercents = entry.target.querySelectorAll('.skill-percent');
        skillPercents.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'));
          if (target && !el.dataset.animated) {
            el.dataset.animated = 'true';
            animateCounter(el, 0, target, 1200, '%');
          }
        });

        // Animate stat counters
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'));
          if (target && !el.dataset.animated) {
            el.dataset.animated = 'true';
            animateCounter(el, 0, target, 1000, '+');
          }
        });

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // ─── COUNTER ANIMATION ───
  function animateCounter(el, start, end, duration, suffix = '') {
    if (prefersReducedMotion) {
      el.textContent = end + suffix;
      return;
    }
    const startTime = performance.now();
    const range = end - start;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + range * easeOut);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // ─── CERTIFICATE CARD TILT ───
  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (prefersReducedMotion) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });

  // ─── CONTACT FORM HANDLING ───
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const btn = this.querySelector('.btn-submit');
      btn.textContent = 'Sending...';
      btn.style.opacity = '0.7';
      btn.disabled = true;
      // The form submits to formsubmit.co via standard POST
      // On success, formsubmit.co will show a confirmation page
    });
  }

  // ─── SEND BUTTON PULSE on load ───
  const submitBtn = document.querySelector('.btn-submit');
  if (submitBtn && !prefersReducedMotion) {
    setTimeout(() => {
      submitBtn.style.animation = 'pulse 1s ease';
      submitBtn.addEventListener('animationend', () => {
        submitBtn.style.animation = '';
      }, { once: true });
    }, 2000);
  }

  // ─── SMOOTH SCROLL for all anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

});
