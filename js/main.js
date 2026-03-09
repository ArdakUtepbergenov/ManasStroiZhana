// ─── HEADER SCROLL ───────────────────────────────────────
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ─── MOBILE MENU ─────────────────────────────────────────
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.mobile-nav-close');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => mobileNav.classList.add('open'));
  closeBtn?.addEventListener('click', () => mobileNav.classList.remove('open'));
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

// ─── ACTIVE NAV LINK ─────────────────────────────────────
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ─── SCROLL ANIMATIONS ───────────────────────────────────
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
}

// ─── LIGHTBOX ────────────────────────────────────────────
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (!lightbox) return;

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeBtn = lightbox.querySelector('.lightbox-close');
  closeBtn?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// ─── CATALOG FILTERS ─────────────────────────────────────
function initCatalogFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.material-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;

      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.display = show ? 'block' : 'none';
      });

    });
  });
}

// ─── FORMS ───────────────────────────────────────────────
function initForms() {
  document.querySelectorAll('.contact-form').forEach(form => {

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;

      btn.textContent = 'Отправка...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        form.reset();
        showToast('Заявка отправлена! Мы свяжемся с вами.', 'success');
      }, 1500);

    });

  });
}

// ─── TOAST ───────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.className = `toast toast-${type}`;

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ─── MATERIALS FROM JSON ─────────────────────────────────
async function loadMaterials() {
  const grid = document.getElementById('materialsGrid');
  if (!grid) return;

  const isHomePage = window.location.pathname.endsWith('index.html') ||
                     window.location.pathname === '/' ||
                     window.location.pathname.endsWith('/');

  try {

    const res = await fetch('materials.json?v=' + Date.now());
    let materials = await res.json();

    if (isHomePage) {
      materials = materials.slice(0, 6);
    }

    renderMaterials(materials, grid);
    initCatalogFilters();

  } catch(e) {
    console.error("Ошибка загрузки материалов:", e);
  }
}

const categoryNames = {
  facade: 'Фасадные панели',
  paving: 'Брусчатка',
  travertine: 'Травертин',
  polyfacade: 'Полифасад',
  other: 'Другие материалы'
};

// ─── RENDER MATERIALS ────────────────────────────────────
function renderMaterials(materials, grid) {

  grid.innerHTML = materials.map(m => `
    <div class="material-card" data-cat="${m.category}">
      
      <img 
        class="material-card-img" 
        src="${m.image}" 
        alt="${m.name}" 
        loading="lazy"
      >

      <div class="material-card-body">

        <span class="material-cat-tag">
          ${categoryNames[m.category] || m.category}
        </span>

        <h4>${m.name}</h4>

        <p>${m.description}</p>

        <div style="display:flex;justify-content:space-between;margin-top:12px">

          <div class="material-price">
            ${Number(m.price).toLocaleString('ru-RU')} ₸
            <span>/ ${m.unit}</span>
          </div>

          <a href="contacts.html" class="btn btn-ghost" style="padding:8px 16px;font-size:0.78rem">
            Заказать
          </a>

        </div>

      </div>
    </div>
  `).join('');
}

// ─── INIT ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  initMobileMenu();
  setActiveNav();
  initScrollAnimations();
  initLightbox();
  initCatalogFilters();
  initForms();
  loadMaterials();

});
