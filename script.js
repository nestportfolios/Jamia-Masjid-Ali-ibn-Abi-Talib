// Live clock
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const clockDisplay = document.getElementById('clock-display');
  if (clockDisplay) {
    clockDisplay.textContent = `${h}:${m}:${s} ${ampm}`;
  }
}
setInterval(updateClock, 1000);
updateClock();

const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
let activeHeroSlide = 0;

function showHeroSlide(index) {
  if (!heroSlides.length) {
    return;
  }

  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === index);
  });
  activeHeroSlide = index;
}

showHeroSlide(0);
setInterval(() => {
  if (document.hidden || !heroSlides.length) {
    return;
  }

  const nextSlide = (activeHeroSlide + 1) % heroSlides.length;
  showHeroSlide(nextSlide);
}, 3000);
document.body.dataset.theme = 'light';
document.body.classList.add('is-booting');

const preloader = document.getElementById('preloader');
document.body.classList.add('is-loading');

function hidePreloader() {
  if (!preloader || preloader.classList.contains('hidden')) {
    return;
  }

  window.setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-loaded');
  }, 200);
}

window.setTimeout(hidePreloader, 2000);

const motionObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('motion-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' })
  : null;

function registerMotion(selector, delaySpread = 0) {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add('motion-reveal');
    if (delaySpread > 0) {
      element.classList.add(`motion-reveal-delay-${(index % delaySpread) + 1}`);
    }
    if (motionObserver) {
      motionObserver.observe(element);
    } else {
      element.classList.add('motion-visible');
    }
  });
}

registerMotion('.hero-copy');
registerMotion('.section-inner > .section-label, .section-inner > .section-title, .section-inner > .section-divider', 3);
registerMotion('.imam-card, .imam-content, .prayer-strip, .prayer-table-wrap, .contact-info, .map-card', 4);
registerMotion('.service-card, .gallery-item, .prayer-cell, .footer-grid > *', 4);
registerMotion('.announcement');

const floatingWhatsApp = document.querySelector('.floating-whatsapp');
if (floatingWhatsApp) {
  floatingWhatsApp.classList.add('motion-visible');
}

// Today's date
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById('today-date').textContent = new Date().toLocaleDateString('en-PK', options);

// Highlight active prayer cell based on time
function highlightPrayer() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const times = [
    { name: 'Fajr', start: 4 * 60 + 30 },
    { name: 'Zuhr', start: 13 * 60 + 30 },
    { name: 'Asr', start: 17 * 60 + 30 },
    { name: 'Maghrib', start: 19 * 60 },
    { name: 'Isha', start: 21 * 60 }
  ];
  const cells = document.querySelectorAll('.prayer-cell');
  cells.forEach(c => c.classList.remove('active'));
  let activeIdx = 0;
  for (let i = 0; i < times.length; i++) {
    if (minutes >= times[i].start) activeIdx = i;
  }
  if (cells[activeIdx]) cells[activeIdx].classList.add('active');
}
highlightPrayer();
setInterval(highlightPrayer, 60000);

function handleSubmit(e) {
  e.preventDefault && e.preventDefault();
}

const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');
if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
}

// Contact form removed from markup; event hooks intentionally disabled.

// Lightbox / gallery modal
;(function(){
  const galleryImgs = Array.from(document.querySelectorAll('.gallery-grid a img'));
  if (!galleryImgs.length) return;

  const images = galleryImgs.map(img => ({ src: img.parentElement.getAttribute('href') || img.src, alt: img.alt || '' }));
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox && lightbox.querySelector('img');
  const lbCaption = lightbox && lightbox.querySelector('.lightbox-caption');
  const btnClose = lightbox && lightbox.querySelector('.lightbox-close');
  const btnPrev = lightbox && lightbox.querySelector('.lightbox-prev');
  const btnNext = lightbox && lightbox.querySelector('.lightbox-next');
  let current = 0;

  function openAt(i){
    current = (i + images.length) % images.length;
    if (!lightbox || !lbImg) return;
    lbImg.src = images[current].src;
    lbImg.alt = images[current].alt;
    if (lbCaption) lbCaption.textContent = images[current].alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    if (lbImg) lbImg.src = '';
  }
  function prev(){ openAt(current - 1); }
  function next(){ openAt(current + 1); }

  galleryImgs.forEach((img, idx) => {
    const a = img.parentElement;
    if (!a) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      openAt(idx);
    });
  });

  if (btnClose) btnClose.addEventListener('click', close);
  if (btnPrev) btnPrev.addEventListener('click', prev);
  if (btnNext) btnNext.addEventListener('click', next);

  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) close();
    });
  }

  window.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
})();
