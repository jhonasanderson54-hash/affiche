/**
 * ══════════════════════════════════════════════════════
 *  PRISME DIGITAL — script.js
 *  Fonctionnalités :
 *    1. Loader (animation de chargement)
 *    2. Feather Icons
 *    3. Navbar sticky + hamburger mobile
 *    4. Scroll fluide (fallback pour vieux navigateurs)
 *    5. Lien actif dans la nav selon section visible
 *    6. Animations au scroll (Intersection Observer)
 *    7. Compteurs animés
 *    8. Filtres portfolio
 *    9. Formulaire de contact (validation + succès)
 *   10. Footer — année courante
 * ══════════════════════════════════════════════════════
 */

'use strict';

/* ──────────────────────────────────────
   1. LOADER
────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Cache le loader une fois la page prête
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Déclenche les animations hero après le loader
      document.querySelectorAll('[data-animate="hero"]').forEach(el => {
        el.classList.add('visible');
      });
    }, 1700); // durée alignée sur l'animation CSS de la barre
  });
})();


/* ──────────────────────────────────────
   2. FEATHER ICONS
────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (window.feather) {
    feather.replace({ 'stroke-width': 1.8 });
  }
});


/* ──────────────────────────────────────
   3. NAVBAR STICKY + HAMBURGER MOBILE
────────────────────────────────────── */
(function initNavbar() {
  const header     = document.getElementById('header');
  const hamburger  = document.getElementById('hamburger');
  const navMenu    = document.getElementById('navMenu');
  const navLinks   = document.querySelectorAll('.nav__link');

  if (!header) return;

  // Sticky : ajoute la classe "scrolled" dès qu'on défile
  function handleScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // vérification initiale

  // Hamburger : ouvre/ferme le menu mobile
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      // Empêche le défilement du body quand le menu est ouvert
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Ferme le menu quand on clique sur un lien
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Ferme le menu en cliquant en dehors (overlay)
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
})();


/* ──────────────────────────────────────
   4. SCROLL FLUIDE (fallback)
────────────────────────────────────── */
(function initSmoothScroll() {
  // Les navigateurs modernes gèrent scroll-behavior:smooth via CSS.
  // Ce fallback cible les anciens navigateurs.
  if ('scrollBehavior' in document.documentElement.style) return;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ──────────────────────────────────────
   5. LIEN ACTIF DANS LA NAV
────────────────────────────────────── */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
})();


/* ──────────────────────────────────────
   6. ANIMATIONS AU SCROLL
   (Intersection Observer API)
────────────────────────────────────── */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]:not([data-animate="hero"])');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // anime une seule fois
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────
   7. COMPTEURS ANIMÉS
────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  /**
   * Anime un compteur de 0 vers sa valeur cible.
   * @param {HTMLElement} el   - l'élément span contenant le compteur
   * @param {number}      target - valeur finale
   * @param {number}      duration - durée en ms
   */
  function animateCounter(el, target, duration = 2000) {
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing easeOutExpo pour un effet dynamique
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startValue + (target - startValue) * ease);

      el.textContent = current.toLocaleString('fr-FR');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // Déclenche les compteurs quand la section stats devient visible
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  let hasStarted = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !hasStarted) {
      hasStarted = true;
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        if (!isNaN(target)) animateCounter(counter, target);
      });
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(statsSection);
})();


/* ──────────────────────────────────────
   8. FILTRES PORTFOLIO
────────────────────────────────────── */
(function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.portfolio-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // Mise à jour des boutons actifs
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      this.classList.add('filter-btn--active');

      const filter = this.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const show     = filter === 'all' || category === filter;

        // Animation fade
        if (show) {
          card.style.display     = '';
          card.style.opacity     = '0';
          card.style.transform   = 'translateY(16px)';
          // Force le reflow avant d'animer
          card.getBoundingClientRect();
          card.style.transition  = 'opacity .35s ease, transform .35s ease';
          card.style.opacity     = '1';
          card.style.transform   = 'translateY(0)';
        } else {
          card.style.transition  = 'opacity .25s ease, transform .25s ease';
          card.style.opacity     = '0';
          card.style.transform   = 'scale(.96)';
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 280);
        }
      });
    });
  });
})();


/* ──────────────────────────────────────
   9. FORMULAIRE DE CONTACT
   (Validation + Feedback)
────────────────────────────────────── */
(function initContactForm() {
  const form        = document.getElementById('contactForm');
  const successMsg  = document.getElementById('formSuccess');
  if (!form) return;

  /**
   * Valide un champ et applique les styles d'erreur.
   * @returns {boolean} vrai si le champ est valide
   */
  function validateField(field) {
    const value = field.value.trim();
    let valid   = true;

    if (field.hasAttribute('required') && !value) {
      valid = false;
    }
    if (field.type === 'email' && value) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    field.classList.toggle('error', !valid);
    return valid;
  }

  // Validation en temps réel (retire l'erreur dès que l'utilisateur corrige)
  form.querySelectorAll('.form__input').forEach(field => {
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        validateField(field);
      }
    });
  });

  // Soumission du formulaire
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fields = this.querySelectorAll('.form__input[required]');
    let   allValid = true;

    fields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) return;

    // Récupère les données du formulaire
    const name    = this.querySelector('#name').value.trim();
    const email   = this.querySelector('#email').value.trim();
    const service = this.querySelector('#service');
    const serviceName = service.options[service.selectedIndex].text;
    const message = this.querySelector('#message').value.trim();

    // Construit le message WhatsApp formaté
    const whatsappMessage = 
      `🌐 *Nouveau message depuis le site Prisme Digital*\n\n` +
      `👤 *Nom :* ${name}\n` +
      `📧 *Email :* ${email}\n` +
      `🎯 *Service :* ${serviceName}\n\n` +
      `💬 *Message :*\n${message}`;

    // Encode et ouvre WhatsApp
    const whatsappURL = `https://wa.me/22677854630?text=${encodeURIComponent(whatsappMessage)}`;

    // Animation de feedback avant redirection
    const submitBtn = this.querySelector('[type="submit"]');
    submitBtn.textContent = 'Redirection vers WhatsApp…';
    submitBtn.disabled    = true;

    setTimeout(() => {
      // Ouvre WhatsApp dans un nouvel onglet
      window.open(whatsappURL, '_blank');

      // Affiche le message de succès
      form.style.display = 'none';
      if (successMsg) {
        successMsg.classList.add('visible');
        if (window.feather) feather.replace({ 'stroke-width': 1.8 });
      }
    }, 800);
  });
})();


/* ──────────────────────────────────────
   10. FOOTER — ANNÉE COURANTE
────────────────────────────────────── */
(function setFooterYear() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
})();


/* ──────────────────────────────────────
   BONUS : Effet de curseur personnalisé
   (désactivé sur mobile/tactile)
────────────────────────────────────── */
(function initCursorEffect() {
  // Seulement sur desktop avec souris
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.id    = 'custom-cursor';
  Object.assign(cursor.style, {
    position:        'fixed',
    top:             '0',
    left:            '0',
    width:           '10px',
    height:          '10px',
    borderRadius:    '50%',
    background:      'var(--clr-gold)',
    pointerEvents:   'none',
    zIndex:          '99999',
    transform:       'translate(-50%,-50%)',
    transition:      'transform .15s ease, opacity .3s ease, width .2s ease, height .2s ease',
    opacity:         '0',
    mixBlendMode:    'difference',
  });
  document.body.appendChild(cursor);

  const ring = document.createElement('div');
  ring.id    = 'cursor-ring';
  Object.assign(ring.style, {
    position:      'fixed',
    top:           '0',
    left:          '0',
    width:         '36px',
    height:        '36px',
    borderRadius:  '50%',
    border:        '1px solid rgba(244,167,36,.5)',
    pointerEvents: 'none',
    zIndex:        '99998',
    transform:     'translate(-50%,-50%)',
    transition:    'transform .35s cubic-bezier(.4,0,.2,1), opacity .3s ease',
    opacity:       '0',
  });
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let visible = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      cursor.style.opacity = '1';
      ring.style.opacity   = '1';
      visible = true;
    }
    cursor.style.left = `${mouseX}px`;
    cursor.style.top  = `${mouseY}px`;
  });

  // Animation fluide de l'anneau
  function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.left = `${ringX}px`;
    ring.style.top  = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Agrandissement au survol des éléments interactifs
  const hoverTargets = 'a, button, .service-card, .portfolio-card, .filter-btn, input, textarea, select';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      ring.style.transform   = 'translate(-50%,-50%) scale(1.5)';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.transform   = 'translate(-50%,-50%) scale(1)';
    }
  });

  // Masque le curseur quand il quitte la fenêtre
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    ring.style.opacity   = '0';
    visible = false;
  });
})();
