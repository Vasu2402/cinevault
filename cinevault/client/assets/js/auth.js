/* ═══════════════════════════════════════════════════════════════
   CineVault — Auth Module
   JWT token management, login/signup logic
   ═══════════════════════════════════════════════════════════════ */

const AUTH_KEYS = {
  TOKEN: 'cv_token',
  USER: 'cv_user',
};

/* ── Token Management ───────────────────────────────────── */

function saveAuth(token, user) {
  localStorage.setItem(AUTH_KEYS.TOKEN, token);
  localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
}

function getToken() {
  return localStorage.getItem(AUTH_KEYS.TOKEN);
}

function getUser() {
  const raw = localStorage.getItem(AUTH_KEYS.USER);
  return raw ? JSON.parse(raw) : null;
}

function isLoggedIn() {
  const token = getToken();
  if (!token) return false;
  // Basic JWT expiry check
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function logout() {
  localStorage.removeItem(AUTH_KEYS.TOKEN);
  localStorage.removeItem(AUTH_KEYS.USER);
  window.location.href = '/pages/auth.html';
}

/* ── Auth Guard ─────────────────────────────────────────── */

function requireAuth() {
  if (!isLoggedIn()) {
    showToast('Please log in to continue', 'error');
    setTimeout(() => {
      window.location.href = '/pages/auth.html?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
    }, 1000);
    return false;
  }
  return true;
}

/* ── Navbar Auth State ──────────────────────────────────── */

function updateNavbarAuth() {
  const navRight = document.querySelector('.cv-nav-right');
  if (!navRight) return;

  if (isLoggedIn()) {
    const user = getUser();
    const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';
    navRight.innerHTML = `
      <div style="position: relative;">
        <div class="cv-nav-avatar" id="avatarBtn">${initial}</div>
        <div class="cv-nav-user-dropdown" id="userDropdown">
          <div style="padding: 12px 14px; border-bottom: 1px solid var(--cv-border);">
            <div style="font-weight: 600; font-size: 0.9rem;">${user?.name || 'User'}</div>
            <div style="font-size: 0.78rem; color: var(--cv-text-muted);">${user?.email || ''}</div>
          </div>
          <a href="/pages/my-bookings.html"><i class="bi bi-ticket-perforated"></i> My Bookings</a>
          <div class="divider"></div>
          <a href="#" onclick="logout(); return false;" style="color: #ef4444;"><i class="bi bi-box-arrow-right"></i> Logout</a>
        </div>
      </div>
    `;

    // Toggle dropdown
    document.getElementById('avatarBtn')?.addEventListener('click', () => {
      document.getElementById('userDropdown')?.classList.toggle('show');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.cv-nav-right')) {
        document.getElementById('userDropdown')?.classList.remove('show');
      }
    });
  } else {
    navRight.innerHTML = `
      <a href="/pages/auth.html" class="cv-btn cv-btn-primary cv-btn-sm">
        <i class="bi bi-person"></i> Sign In
      </a>
    `;
  }
}

/* ── Init on page load ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', updateNavbarAuth);
