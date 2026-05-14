/* ═══════════════════════════════════════════════════════════════
   CineVault — Movies Page Logic
   Grid rendering, genre filtering, search
   ═══════════════════════════════════════════════════════════════ */

let allMovies = [];
let currentGenre = 'All';

async function loadMovies() {
  const grid = document.getElementById('moviesGrid');
  if (!grid) return;

  showSkeletons(grid, 8);

  try {
    allMovies = await fetchMovies();
    renderMovies(allMovies);
    buildGenreFilters();
  } catch (err) {
    grid.innerHTML = `
      <div class="col-12 cv-empty-state">
        <div class="icon">🎬</div>
        <h3>Failed to load movies</h3>
        <p>${err.message}</p>
        <button class="cv-btn cv-btn-primary" onclick="loadMovies()">Retry</button>
      </div>
    `;
  }
}

function renderMovies(movies) {
  const grid = document.getElementById('moviesGrid');
  if (!grid) return;

  if (movies.length === 0) {
    grid.innerHTML = `
      <div class="col-12 cv-empty-state">
        <div class="icon">🔍</div>
        <h3>No movies found</h3>
        <p>Try adjusting your filters</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = movies.map((movie, i) => `
    <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 mb-4 cv-fade-in-up" style="animation-delay: ${i * 0.05}s;">
      <div class="cv-movie-card" onclick="window.location.href='/pages/movie-detail.html?id=${movie.id}'">
        <div class="poster-wrapper">
          <img class="poster" src="${movie.poster}" alt="${movie.title}" loading="lazy"
               onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cde69a0?w=400&h=600&fit=crop'">
          <div class="rating-badge">
            <i class="bi bi-star-fill"></i> ${movie.rating}
          </div>
          ${movie.status === 'upcoming'
            ? '<div style="position:absolute;top:12px;left:12px;background:rgba(139,92,246,.9);color:#fff;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;letter-spacing:.5px;">COMING SOON</div>'
            : '<div style="position:absolute;top:12px;left:12px;background:rgba(16,185,129,.9);color:#fff;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;letter-spacing:.5px;">NOW SHOWING</div>'
          }
          <div class="poster-overlay">
            <button class="cv-btn cv-btn-primary cv-btn-sm cv-ripple">
              <i class="bi bi-ticket-perforated"></i> Book Now
            </button>
          </div>
        </div>
        <div class="card-body">
          <h3>${movie.title}</h3>
          <div class="card-meta">
            <span class="genre-tag">${movie.genre}</span>
            <span><i class="bi bi-clock"></i> ${formatDuration(movie.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function buildGenreFilters() {
  const container = document.getElementById('genreFilters');
  if (!container) return;

  const genres = ['All', ...new Set(allMovies.map(m => m.genre))];
  container.innerHTML = genres.map(g => `
    <button class="cv-genre-pill ${g === currentGenre ? 'active' : ''}"
            onclick="filterByGenre('${g}')">${g}</button>
  `).join('');
}

function filterByGenre(genre) {
  currentGenre = genre;
  const filtered = genre === 'All' ? allMovies : allMovies.filter(m => m.genre === genre);
  renderMovies(filtered);
  buildGenreFilters();
}

function searchMovies(query) {
  const q = query.toLowerCase();
  let filtered = allMovies.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.genre.toLowerCase().includes(q) ||
    (m.cast && m.cast.toLowerCase().includes(q)) ||
    (m.director && m.director.toLowerCase().includes(q))
  );
  if (currentGenre !== 'All') {
    filtered = filtered.filter(m => m.genre === currentGenre);
  }
  renderMovies(filtered);
}

/* ── Home page specific ─────────────────────────────────── */

async function loadFeaturedMovies() {
  const container = document.getElementById('featuredMovies');
  if (!container) return;

  try {
    const movies = await fetchMovies();
    container.innerHTML = movies.slice(0, 8).map((movie) => `
      <div class="cv-movie-card" onclick="window.location.href='/pages/movie-detail.html?id=${movie.id}'">
        <div class="poster-wrapper">
          <img class="poster" src="${movie.poster}" alt="${movie.title}" loading="lazy"
               onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cde69a0?w=400&h=600&fit=crop'">
          <div class="rating-badge">
            <i class="bi bi-star-fill"></i> ${movie.rating}
          </div>
          <div class="poster-overlay">
            <button class="cv-btn cv-btn-primary cv-btn-sm cv-ripple">
              <i class="bi bi-ticket-perforated"></i> Book Now
            </button>
          </div>
        </div>
        <div class="card-body">
          <h3>${movie.title}</h3>
          <div class="card-meta">
            <span class="genre-tag">${movie.genre}</span>
            <span><i class="bi bi-clock"></i> ${formatDuration(movie.duration)}</span>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    container.innerHTML = '<p style="color: var(--cv-text-muted); text-align: center;">Failed to load movies</p>';
  }
}

/* ── Hero Slider ────────────────────────────────────────── */

let heroSlideIndex = 0;
let heroSlideTimer = null;

async function initHeroSlider() {
  const sliderContainer = document.getElementById('heroSlider');
  const dotsContainer = document.getElementById('heroDots');
  if (!sliderContainer) return;

  try {
    const movies = await fetchMovies();
    const heroMovies = movies.slice(0, 4);

    sliderContainer.innerHTML = heroMovies.map((movie, i) => `
      <div class="cv-hero-slide ${i === 0 ? 'active' : ''}">
        <div class="cv-hero-bg" style="background-image: url('${movie.poster}');"></div>
        <div class="cv-hero-overlay"></div>
        <div class="cv-hero-content">
          <div class="tag">🎬 Now Showing</div>
          <h1>${movie.title}</h1>
          <div class="meta">
            <span class="cv-rating-badge"><i class="bi bi-star-fill"></i> ${movie.rating}/10</span>
            <span class="dot"></span>
            <span><i class="bi bi-clock"></i> ${formatDuration(movie.duration)}</span>
            <span class="dot"></span>
            <span>${movie.genre}</span>
            <span class="dot"></span>
            <span>${movie.language}</span>
          </div>
          <p class="description">${movie.description || ''}</p>
          <div class="cv-hero-actions">
            <a href="/pages/movie-detail.html?id=${movie.id}" class="cv-btn cv-btn-primary cv-btn-lg cv-ripple">
              <i class="bi bi-ticket-perforated"></i> Book Tickets
            </a>
            <button class="cv-btn cv-btn-outline cv-btn-lg" onclick="window.location.href='/pages/movie-detail.html?id=${movie.id}'">
              <i class="bi bi-info-circle"></i> Details
            </button>
          </div>
        </div>
      </div>
    `).join('');

    if (dotsContainer) {
      dotsContainer.innerHTML = heroMovies.map((_, i) => `
        <button class="cv-hero-dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></button>
      `).join('');
    }

    heroSlideTimer = setInterval(() => goToSlide((heroSlideIndex + 1) % heroMovies.length), 6000);
  } catch (err) {
    sliderContainer.innerHTML = `
      <div class="cv-hero-slide active" style="background: var(--cv-gradient-hero);">
        <div class="cv-hero-content" style="bottom: 30%; text-align: center; left: 50%; transform: translateX(-50%);">
          <h1>Welcome to <span class="cv-text-gradient">CineVault</span></h1>
          <p class="description">Your premium movie ticket booking experience</p>
          <div class="cv-hero-actions" style="justify-content: center;">
            <a href="/pages/movies.html" class="cv-btn cv-btn-primary cv-btn-lg">Browse Movies</a>
          </div>
        </div>
      </div>
    `;
  }
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.cv-hero-slide');
  const dots = document.querySelectorAll('.cv-hero-dot');
  if (!slides.length) return;

  slides[heroSlideIndex]?.classList.remove('active');
  dots[heroSlideIndex]?.classList.remove('active');

  heroSlideIndex = index;

  slides[heroSlideIndex]?.classList.add('active');
  dots[heroSlideIndex]?.classList.add('active');
}
