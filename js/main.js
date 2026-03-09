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

// ─── ACTIVE NAV LINK ──────────────────────────────────────
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') || 
        (page === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ─── SCROLL ANIMATIONS ────────────────────────────────────
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
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
        if (show) {
          card.style.animation = 'fadeUp 0.4s ease forwards';
        }
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
        showToast('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
      }, 1500);
    });
  });
}

// ─── TOAST NOTIFICATION ──────────────────────────────────
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast toast-${type}`;
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ─── MATERIALS CATALOG (from JSON) ───────────────────────
async function loadMaterials() {
  const grid = document.getElementById('materialsGrid');
  if (!grid) return;

  // Определяем страницу: на главной показываем 6, на каталоге — все
  const isHomePage = window.location.pathname.endsWith('index.html') ||
                     window.location.pathname === '/' ||
                     window.location.pathname.endsWith('/');

  try {
    const stored = localStorage.getItem('manas_materials');
    let materials;

    if (stored) {
      materials = JSON.parse(stored);
    } else {
      materials = getDefaultMaterials();
      localStorage.setItem('manas_materials', JSON.stringify(materials));
    }

    // На главной — только первые 6
    if (isHomePage) {
      materials = materials.slice(0, 6);
    }

    renderMaterials(materials, grid);
    initCatalogFilters(); // вызываем ПОСЛЕ рендера карточек
  } catch(e) {
    console.error(e);
  }
}

function getDefaultMaterials() {
  return [
    { id: 1, name: "Термопанель ТП-100", category: "facade", price: "4500", unit: "м²", description: "Фасадная термопанель с клинкерной плиткой. Толщина утеплителя 100 мм.", image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop" },
    { id: 2, name: "Термопанель ТП-150", category: "facade", price: "5200", unit: "м²", description: "Усиленная термопанель с утеплителем 150 мм. Для холодного климата.", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=300&fit=crop" },
    { id: 3, name: "Термопанель «Кирпич»", category: "facade", price: "4800", unit: "м²", description: "Фасадная панель с текстурой кирпичной кладки. Лёгкий монтаж.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" },
    { id: 4, name: "Брусчатка гранитная 10x10", category: "paving", price: "3200", unit: "м²", description: "Натуральная гранитная брусчатка. Морозостойкость до -50°C.", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
    { id: 5, name: "Брусчатка вибропрессованная", category: "paving", price: "1800", unit: "м²", description: "Собственного производства. Размер 20x10x6 см, цвет на выбор.", image: "https://images.unsplash.com/photo-1558618047-f4e60cfd1e7d?w=400&h=300&fit=crop" },
    { id: 6, name: "Брусчатка «Катушка»", category: "paving", price: "2100", unit: "м²", description: "Фигурная брусчатка для пешеходных зон и площадок.", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop" },
    { id: 7, name: "Травертин натуральный", category: "travertine", price: "6500", unit: "м²", description: "Натуральный травертин для фасадов и интерьеров.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop" },
    { id: 8, name: "Травертин искусственный", category: "travertine", price: "3800", unit: "м²", description: "Высококачественный искусственный травертин.", image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=300&fit=crop" },
    { id: 9, name: "Полифасад базовый", category: "polyfacade", price: "2900", unit: "м²", description: "Система для утепления и декоративной отделки фасадов.", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop" },
    { id: 10, name: "Полифасад премиум", category: "polyfacade", price: "4200", unit: "м²", description: "Премиум система с расширенными декоративными возможностями.", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=300&fit=crop" },
    { id: 11, name: "Цементно-песчаная смесь М300", category: "other", price: "850", unit: "мешок 50кг", description: "Универсальная смесь для кладки и штукатурки.", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop" },
    { id: 12, name: "Клей для плитки", category: "other", price: "1200", unit: "мешок 25кг", description: "Профессиональный плиточный клей для внутренних и внешних работ.", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop" }
  ];
}

const categoryNames = {
  facade: 'Фасадные панели',
  paving: 'Брусчатка',
  travertine: 'Травертин',
  polyfacade: 'Полифасад',
  other: 'Другие материалы'
};

function renderMaterials(materials, grid) {
  grid.innerHTML = materials.map(m => `
    <div class="material-card" data-cat="${m.category}">
      <img class="material-card-img" src="${m.image}" alt="${m.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop'">
      <div class="material-card-body">
        <span class="material-cat-tag">${categoryNames[m.category] || m.category}</span>
        <h4>${m.name}</h4>
        <p>${m.description}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px">
          <div class="material-price">${Number(m.price).toLocaleString('ru-RU')} ₸ <span>/ ${m.unit}</span></div>
          <a href="contacts.html" class="btn btn-ghost" style="padding:8px 16px;font-size:0.78rem">Заказать</a>
        </div>
      </div>
    </div>
  `).join('');
}

// ─── ADMIN ───────────────────────────────────────────────
function initAdmin() {
  const form = document.getElementById('addMaterialForm');
  const tableBody = document.getElementById('materialsTableBody');
  if (!form) return;

  loadAdminTable();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const materials = JSON.parse(localStorage.getItem('manas_materials') || '[]');
    const fileInput = form.querySelector('[name="image"]');
    const file = fileInput.files[0];

    const addMaterial = (imageUrl) => {
      const newMat = {
        id: Date.now(),
        name: form.querySelector('[name="name"]').value,
        category: form.querySelector('[name="category"]').value,
        price: form.querySelector('[name="price"]').value,
        unit: form.querySelector('[name="unit"]').value,
        description: form.querySelector('[name="description"]').value,
        image: imageUrl
      };
      materials.push(newMat);
      localStorage.setItem('manas_materials', JSON.stringify(materials));
      form.reset();
      loadAdminTable();
      showToast('Материал добавлен!', 'success');
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => addMaterial(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      addMaterial('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop');
    }
  });
}

function loadAdminTable() {
  const tbody = document.getElementById('materialsTableBody');
  if (!tbody) return;
  const materials = JSON.parse(localStorage.getItem('manas_materials') || '[]');

  if (!materials.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-light);padding:32px">Материалы не добавлены</td></tr>';
    return;
  }

  tbody.innerHTML = materials.map(m => `
    <tr>
      <td><img class="table-img" src="${m.image}" alt="${m.name}" onerror="this.src='https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=100&h=100&fit=crop'"></td>
      <td><strong>${m.name}</strong></td>
      <td>${categoryNames[m.category] || m.category}</td>
      <td>${Number(m.price).toLocaleString('ru-RU')} ₸/${m.unit}</td>
      <td style="max-width:200px;font-size:0.8rem">${m.description}</td>
      <td><button class="btn-danger" onclick="deleteMaterial(${m.id})">Удалить</button></td>
    </tr>
  `).join('');
}

function deleteMaterial(id) {
  if (!confirm('Удалить этот материал?')) return;
  let materials = JSON.parse(localStorage.getItem('manas_materials') || '[]');
  materials = materials.filter(m => m.id !== id);
  localStorage.setItem('manas_materials', JSON.stringify(materials));
  loadAdminTable();
  showToast('Материал удалён.', 'success');
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
  initAdmin();
});
