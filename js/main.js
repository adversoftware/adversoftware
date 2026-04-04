/* ============================================
   adver.software — Main Interactions
   ============================================ */

(function() {
  'use strict';

  /* ---- LOADING CURTAIN ---- */
  function initLoadingSequence() {
    const tl = gsap.timeline();
    const curtainLogo = document.querySelector('.curtain-logo');
    const curtainLine = document.querySelector('.curtain-line');
    const curtainLeft = document.querySelector('.curtain-left');
    const curtainRight = document.querySelector('.curtain-right');
    const curtain = document.querySelector('.loading-curtain');

    tl.to(curtainLogo, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' })
      .to(curtainLine, { width: '200px', duration: 0.4, ease: 'power2.out' }, '-=0.1')
      .to(curtainLeft, { xPercent: -100, duration: 0.7, ease: 'power3.inOut' }, '+=0.3')
      .to(curtainRight, { xPercent: 100, duration: 0.7, ease: 'power3.inOut' }, '<')
      .to([curtainLogo, curtainLine], { opacity: 0, duration: 0.3 }, '<')
      .set(curtain, { display: 'none' })
      .call(initHeroAnimation);
  }

  /* ---- HERO ANIMATION ---- */
  function initHeroAnimation() {
    const tl = gsap.timeline();
    tl.to('.hero-label', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
      .to('.hero-title .word', { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }, '-=0.2')
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .to('.hero-cta', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.2')
      .to('.scroll-indicator', { opacity: 1, duration: 0.4 }, '-=0.2');
  }

  /* ---- CUSTOM CURSOR ---- */
  function initCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let cx = -100, cy = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', (e) => {
      cx = e.clientX;
      cy = e.clientY;
    });

    function updateCursor() {
      dot.style.left = cx + 'px';
      dot.style.top = cy + 'px';

      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';

      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    /* Hover states */
    document.querySelectorAll('a, button, .nav-hamburger, .pricing-card, .svc-card').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

    document.querySelectorAll('.project-visual').forEach((el) => {
      el.addEventListener('mouseenter', () => { ring.classList.add('view'); });
      el.addEventListener('mouseleave', () => { ring.classList.remove('view'); });
    });
  }

  /* ---- NAVIGATION ---- */
  function initNav() {
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.nav-hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu-link');

    /* Scroll state */
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      lastScroll = window.scrollY;
    }, { passive: true });

    /* Hamburger toggle */
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';

        if (isOpen) {
          mobileLinks.forEach((link, i) => {
            link.style.transitionDelay = (0.1 + i * 0.08) + 's';
          });
        } else {
          mobileLinks.forEach((link) => { link.style.transitionDelay = '0s'; });
        }
      });

      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  /* ---- MAGNETIC BUTTONS ---- */
  function initMagnetic() {
    document.querySelectorAll('.hero-cta, .cta-btn-primary, .cta-btn-secondary').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const dist = Math.sqrt(x * x + y * y);
        const maxDist = 100;

        if (dist < maxDist) {
          const strength = 1 - dist / maxDist;
          btn.style.transform = `translate(${x * strength * 0.15}px, ${y * strength * 0.15}px)`;
        }
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---- SCROLL ANIMATIONS (GSAP ScrollTrigger) ---- */
  function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    /* Standard section entrance */
    document.querySelectorAll('.section').forEach((section) => {
      const label = section.querySelector('.section-label');
      const heading = section.querySelector('.section-heading');

      if (label) {
        gsap.fromTo(label,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out',
            scrollTrigger: { trigger: label, start: 'top 85%' }
          }
        );
      }
      if (heading) {
        gsap.fromTo(heading,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
            scrollTrigger: { trigger: heading, start: 'top 85%' }
          }
        );
      }
    });

    /* Scroll Story — cinematic line-by-line reveal */
    document.querySelectorAll('[data-story]').forEach((line) => {
      /* Determine origin based on alignment */
      let fromX = 0;
      if (line.classList.contains('story-line--left')) fromX = -40;
      else if (line.classList.contains('story-line--right')) fromX = 40;

      const isHeavy = line.classList.contains('story-line--heavy');
      const isSignature = line.classList.contains('story-line--signature');
      const isDisplay = line.classList.contains('story-line--display');

      gsap.fromTo(line,
        {
          opacity: 0,
          y: isDisplay ? 40 : 25,
          x: fromX,
          scale: isDisplay ? 0.96 : 1,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: isDisplay ? 1.2 : 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: line,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
          onComplete: function() {
            /* Signature glow pulse */
            if (isSignature) {
              const glow = line.querySelector('.sig-glow');
              if (glow) glow.style.opacity = '1';
            }
          }
        }
      );
    });

    /* Services bento cards — staggered */
    gsap.fromTo('.svc-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.services-grid', start: 'top 85%' }
      }
    );

    /* Project blocks */
    document.querySelectorAll('.project-block').forEach((block) => {
      const visual = block.querySelector('.project-visual');
      const info = block.querySelector('.project-info');

      if (visual) {
        const fromX = block.classList.contains('project-block--right') ? 60 : -60;
        gsap.fromTo(visual,
          { opacity: 0, x: block.classList.contains('project-block--full') ? 0 : fromX,
            y: block.classList.contains('project-block--full') ? 40 : 0 },
          { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: block, start: 'top 85%' }
          }
        );
      }
      if (info && !block.classList.contains('project-block--full')) {
        gsap.fromTo(info,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2,
            scrollTrigger: { trigger: block, start: 'top 85%' }
        });
      }
    });

    /* Philosophy character-by-character reveal */
    const philoStatement = document.querySelector('.philosophy-statement');
    if (philoStatement) {
      const chars = philoStatement.querySelectorAll('.char');
      if (chars.length > 0) {
        gsap.to(chars, {
          color: 'var(--accent)',
          stagger: 0.02,
          scrollTrigger: {
            trigger: philoStatement,
            start: 'top 70%',
            end: 'bottom 40%',
            scrub: true,
          }
        });
      }
    }

    /* Stats count-up */
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
      const statNums = statsBar.querySelectorAll('.stat-number');
      ScrollTrigger.create({
        trigger: statsBar,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          statNums.forEach((el) => {
            const target = parseInt(el.dataset.value, 10);
            const suffix = el.querySelector('.stat-suffix');
            gsap.to({ val: 0 }, {
              val: target,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate: function() {
                el.childNodes[0].textContent = Math.round(this.targets()[0].val);
              },
              onComplete: () => {
                if (suffix) suffix.classList.add('visible');
              }
            });
          });
        }
      });
    }

    /* Pricing cards */
    gsap.fromTo('.pricing-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.pricing-grid', start: 'top 85%' }
      }
    );

    /* Testimonial cards */
    gsap.fromTo('.t-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.testimonials-wrap', start: 'top 85%' }
      }
    );

    /* CTA section */
    gsap.fromTo('.cta-headline',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-section', start: 'top 80%' }
      }
    );
  }

  /* ---- PROJECT TILT ---- */
  function initProjectTilt() {
    document.querySelectorAll('.project-visual').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      });
    });
  }

  /* ---- FAQ ACCORDION ---- */
  function initFaq() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach((item) => {
      const q = item.querySelector('.faq-q');
      const a = item.querySelector('.faq-a');
      const inner = item.querySelector('.faq-a-inner');

      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        /* Close all */
        items.forEach((other) => {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = '0';
        });

        /* Toggle current */
        if (!isOpen) {
          item.classList.add('open');
          a.style.maxHeight = inner.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---- TESTIMONIALS AUTO-SCROLL (CSS marquee) ---- */
  function initTestimonialScroll() {
    /* Auto-scroll is handled purely by CSS @keyframes t-scroll */
  }

  /* ---- PRICING TOGGLE ---- */
  function initPricingToggle() {
    document.querySelectorAll('.pricing-details-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const details = btn.previousElementSibling.parentElement.querySelector('.pricing-details') ||
                        btn.nextElementSibling;
        if (!details) return;
        const isOpen = details.classList.toggle('open');
        btn.textContent = isOpen ? 'Hide Details ↑' : 'View Details →';
      });
    });
  }

  /* ---- PHILOSOPHY TEXT SPLIT ---- */
  function splitPhilosophyText() {
    const el = document.querySelector('.philosophy-statement');
    if (!el) return;

    const html = el.innerHTML;
    /* Preserve the gradient span but split surrounding text into chars */
    const parts = html.split(/(<span class="gradient-text">.*?<\/span>)/);

    let result = '';
    parts.forEach((part) => {
      if (part.startsWith('<span class="gradient-text">')) {
        result += part;
      } else {
        /* Split text into chars, preserve line breaks */
        const chars = part.replace(/<br\s*\/?>/g, '|||BR|||').split('');
        chars.forEach((c) => {
          if (c === '|' && result.endsWith('||BR||')) {
            result = result.slice(0, -6);
            result += '<br>';
          } else if (c === '|' || c === 'B' || c === 'R') {
            /* skip partial BR marker */
            result += c;
          } else if (c === ' ') {
            result += ' ';
          } else {
            result += '<span class="char">' + c + '</span>';
          }
        });
      }
    });

    /* Simpler approach: just wrap each non-tag character */
    const simpleResult = [];
    let inTag = false;
    let inGradient = false;
    const originalText = el.textContent;

    /* Reset and use textContent approach */
    const lines = el.getAttribute('data-text') || el.textContent;
    el.innerHTML = '';

    /* Split by the gradient line */
    const textParts = lines.split('We set them.');

    if (textParts.length === 2) {
      const beforeChars = textParts[0];
      beforeChars.split('').forEach((c) => {
        if (c === '\n') {
          el.appendChild(document.createElement('br'));
        } else {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = c;
          el.appendChild(span);
        }
      });

      const gradientSpan = document.createElement('span');
      gradientSpan.className = 'gradient-text';
      'We set them.'.split('').forEach((c) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char';
        charSpan.textContent = c;
        gradientSpan.appendChild(charSpan);
      });
      el.appendChild(gradientSpan);
    } else {
      lines.split('').forEach((c) => {
        if (c === '\n') {
          el.appendChild(document.createElement('br'));
        } else {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = c;
          el.appendChild(span);
        }
      });
    }
  }

  /* ---- THEME SWITCHER ---- */
  function initThemeSwitcher() {
    const switcher = document.querySelector('.theme-switcher');
    const btn = document.querySelector('.theme-btn');
    const dropdown = document.querySelector('.theme-dropdown');
    const allOptions = document.querySelectorAll('.theme-option, .mobile-theme-opt');

    if (!btn) return;

    /* Toggle dropdown */
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      switcher.classList.toggle('open');
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (switcher && !switcher.contains(e.target)) {
        switcher.classList.remove('open');
      }
    });

    /* Apply theme */
    function setTheme(themeName) {
      const html = document.documentElement;

      if (themeName === 'greenpixel') {
        html.removeAttribute('data-theme');
      } else {
        html.setAttribute('data-theme', themeName);
      }

      /* Update active state on all option buttons */
      allOptions.forEach((opt) => {
        opt.classList.toggle('active', opt.dataset.theme === themeName);
      });

      /* Update label */
      const label = document.querySelector('.theme-btn-label');
      if (label) {
        const names = {
          greenpixel: 'GreenPixel',
          glassmorphism: 'Glass',
          neumorphism: 'Neumorph',
          luxury: 'Luxury',
          retro: 'Retro',
          brutalist: 'Brutalist'
        };
        label.textContent = names[themeName] || 'Theme';
      }

      /* Save preference */
      try { localStorage.setItem('adver-theme', themeName); } catch(e) {}

      /* Close dropdown */
      if (switcher) switcher.classList.remove('open');
    }

    /* Bind all option buttons (desktop + mobile) */
    allOptions.forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        setTheme(opt.dataset.theme);
      });
    });

    /* Restore saved theme */
    try {
      const saved = localStorage.getItem('adver-theme');
      if (saved) setTheme(saved);
    } catch(e) {}
  }

  /* ---- SMOOTH SCROLL FOR ANCHORS ---- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ---- INIT ---- */
  function init() {
    /* Set initial states for hero elements */
    gsap.set('.hero-label', { opacity: 0, y: 15 });
    gsap.set('.hero-sub', { opacity: 0, y: 15 });
    gsap.set('.hero-cta', { opacity: 0, y: 15 });
    gsap.set('.scroll-indicator', { opacity: 0 });

    splitPhilosophyText();
    initLoadingSequence();
    initCursor();
    initNav();
    initMagnetic();
    initScrollAnimations();
    initProjectTilt();
    initFaq();
    initTestimonialScroll();
    initPricingToggle();
    initThemeSwitcher();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
