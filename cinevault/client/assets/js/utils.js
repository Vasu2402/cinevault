/* ═══════════════════════════════════════════════════════════════
   CineVault — Utility Functions
   Toasts, loading states, formatters, scroll animations
   ═══════════════════════════════════════════════════════════════ */

/* ── Toast Notifications ────────────────────────────────── */

function showToast(message, type = 'info', duration = 3500) {
  let container = document.querySelector('.cv-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'cv-toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '<i class="bi bi-check-circle-fill"></i>',
    error: '<i class="bi bi-exclamation-triangle-fill"></i>',
    info: '<i class="bi bi-info-circle-fill"></i>',
  };

  const toast = document.createElement('div');
  toast.className = `cv-toast cv-toast-${type}`;
  toast.innerHTML = `${icons[type] || icons.info} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('cv-toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── Loading States ─────────────────────────────────────── */

function showLoading(targetEl = null) {
  if (targetEl) {
    targetEl.setAttribute('data-original', targetEl.innerHTML);
    targetEl.innerHTML = '<div class="cv-loading-spinner" style="margin: 0 auto;"></div>';
    targetEl.disabled = true;
  } else {
    const overlay = document.createElement('div');
    overlay.className = 'cv-loading-overlay';
    overlay.id = 'globalLoading';
    overlay.innerHTML = `
      <div style="text-align: center;">
        <div class="cv-loading-spinner" style="margin: 0 auto 16px;"></div>
        <p style="color: var(--cv-text-secondary); font-size: 0.9rem;">Loading...</p>
      </div>
    `;
    document.body.appendChild(overlay);
  }
}

function hideLoading(targetEl = null) {
  if (targetEl) {
    const original = targetEl.getAttribute('data-original');
    if (original) targetEl.innerHTML = original;
    targetEl.disabled = false;
  } else {
    document.getElementById('globalLoading')?.remove();
  }
}

function showButtonLoading(btn, text = 'Processing...') {
  btn.setAttribute('data-original-text', btn.innerHTML);
  btn.innerHTML = `<div class="cv-loading-spinner" style="width:18px;height:18px;border-width:2px;"></div> ${text}`;
  btn.disabled = true;
}

function hideButtonLoading(btn) {
  const original = btn.getAttribute('data-original-text');
  if (original) btn.innerHTML = original;
  btn.disabled = false;
}

/* ── Skeleton Loaders ───────────────────────────────────── */

function createMovieCardSkeleton() {
  return `
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div class="cv-card">
        <div class="cv-skeleton" style="aspect-ratio: 2/3;"></div>
        <div style="padding: 16px;">
          <div class="cv-skeleton" style="height: 18px; width: 80%; margin-bottom: 8px;"></div>
          <div class="cv-skeleton" style="height: 14px; width: 50%;"></div>
        </div>
      </div>
    </div>
  `;
}

function showSkeletons(container, count = 8) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    container.innerHTML += createMovieCardSkeleton();
  }
}

/* ── Star Rating Generator ──────────────────────────────── */

function generateStars(rating) {
  const stars = Math.round(rating / 2);
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= stars) {
      html += '<i class="bi bi-star-fill"></i>';
    } else {
      html += '<i class="bi bi-star empty"></i>';
    }
  }
  return html;
}

/* ── Formatters ─────────────────────────────────────────── */

function formatDuration(mins) {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${hours}h ${minutes}m`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 0 });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString('en-US', { weekday: 'short' }),
    num: d.getDate(),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
  };
}

function getRelativeTime(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* ── URL Param Helpers ──────────────────────────────────── */

function getUrlParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function setUrlParam(key, value) {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
}

/* ── Scroll Reveal Animation ────────────────────────────── */

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
}

/* ── Navbar Scroll Effect ───────────────────────────────── */

function initNavbarScroll() {
  const navbar = document.querySelector('.cv-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ── Mobile Nav Toggle ──────────────────────────────────── */

function initMobileNav() {
  const toggle = document.querySelector('.cv-nav-toggle');
  const links = document.querySelector('.cv-nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ── Init Common ────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileNav();
  initScrollReveal();
});
