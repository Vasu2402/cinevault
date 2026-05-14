/* ═══════════════════════════════════════════════════════════════
   CineVault — Booking / Checkout Logic
   Summary, promo codes, booking confirmation
   ═══════════════════════════════════════════════════════════════ */

let checkoutData = null;
let appliedDiscount = 0;
let selectedPaymentMethod = 'upi';

let foodCatalog = [];
let foodSelection = {}; // { [foodItemId]: quantity }

function initCheckout() {
  if (!requireAuth()) return;

  const raw = sessionStorage.getItem('cv_checkout');
  if (!raw) {
    showToast('No booking data found', 'error');
    setTimeout(() => window.location.href = '/pages/movies.html', 1500);
    return;
  }

  checkoutData = JSON.parse(raw);
  renderCheckoutSummary();
  initFoodSection();
}

async function initFoodSection() {
  const card = document.getElementById('foodCard');
  if (!card) return;
  if (!checkoutData) return;

  const theatreId = checkoutData.showData?.theatre?.id || checkoutData.showData?.theatreId;
  if (!theatreId) {
    card.style.display = 'none';
    return;
  }

  try {
    foodCatalog = await fetchFoodItems(theatreId);
    renderFoodList();
    updateCheckoutTotal();
  } catch (e) {
    console.warn('Food items unavailable:', e);
    card.style.display = 'none';
  }
}

function getFoodSubtotal() {
  let total = 0;
  for (const [id, qty] of Object.entries(foodSelection)) {
    const item = foodCatalog.find(x => String(x.id) === String(id));
    if (!item) continue;
    total += Number(item.price) * Number(qty);
  }
  return total;
}

function getFoodQty(foodItemId) {
  return Number(foodSelection[String(foodItemId)] || 0);
}

function setFoodQty(foodItemId, nextQty) {
  const item = foodCatalog.find(x => String(x.id) === String(foodItemId));
  if (!item) return;

  let qty = Math.max(0, Math.floor(Number(nextQty || 0)));
  const avail = Math.max(0, Number(item.availableQuantity || 0));
  qty = Math.min(qty, avail);

  if (qty === 0) delete foodSelection[String(foodItemId)];
  else foodSelection[String(foodItemId)] = qty;

  renderFoodList();
  updateCheckoutTotal();
}

function renderFoodList() {
  const list = document.getElementById('foodList');
  const totalEl = document.getElementById('foodTotal');
  if (!list) return;

  if (!foodCatalog || foodCatalog.length === 0) {
    list.innerHTML = `<div style="font-size: 0.85rem; color: var(--cv-text-muted);">No food items available.</div>`;
    if (totalEl) totalEl.textContent = formatCurrency(0);
    return;
  }

  let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
  foodCatalog.forEach((item) => {
    const id = item.id;
    const qty = getFoodQty(id);
    const avail = Math.max(0, Number(item.availableQuantity || 0));
    const out = avail <= 0;
    const canAdd = !out && qty < avail;
    const canRemove = qty > 0;

    html += `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px; border:1px solid var(--cv-border); border-radius:12px;">
        <div style="min-width: 0;">
          <div style="font-weight: 600; line-height: 1.2;">${item.name}</div>
          <div style="font-size: 0.8rem; color: var(--cv-text-muted);">${item.description || ''}</div>
          <div style="font-size: 0.8rem; color: var(--cv-text-secondary); margin-top: 4px;">
            ${formatCurrency(Number(item.price))} • ${out ? 'Out of stock' : ('Available: ' + avail)}
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:8px; flex-shrink: 0;">
          <button class="cv-btn cv-btn-outline" style="padding: 6px 10px;" ${canRemove ? '' : 'disabled'} onclick="setFoodQty(${id}, ${qty - 1})">-</button>
          <div style="min-width: 28px; text-align: center; font-weight: 700;">${qty}</div>
          <button class="cv-btn cv-btn-outline" style="padding: 6px 10px;" ${canAdd ? '' : 'disabled'} onclick="setFoodQty(${id}, ${qty + 1})">+</button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  list.innerHTML = html;

  if (totalEl) totalEl.textContent = formatCurrency(getFoodSubtotal());
}

function renderCheckoutSummary() {
  if (!checkoutData) return;

  const show = checkoutData.showData;
  const seats = checkoutData.seatDetails;

  // Movie info
  document.getElementById('checkoutMovieTitle').textContent = '';
  document.getElementById('checkoutTheatre').textContent = show?.theatre?.name || '';
  document.getElementById('checkoutDate').textContent = formatDate(show?.date) || '';
  document.getElementById('checkoutTime').textContent = show?.time || '';

  // Fetch movie name
  fetchMovieById(checkoutData.movieId).then(movie => {
    if (movie) {
      document.getElementById('checkoutMovieTitle').textContent = movie.title;
      const posterEl = document.getElementById('checkoutPoster');
      if (posterEl) posterEl.src = movie.poster;
    }
  });

  // Seat list
  const seatList = document.getElementById('checkoutSeats');
  if (seatList) {
    seatList.textContent = checkoutData.seats.join(', ');
  }

  // Price breakdown
  let standardCount = 0, premiumCount = 0;
  let standardTotal = 0, premiumTotal = 0;

  seats.forEach(s => {
    if (s.type === 'premium') {
      premiumCount++;
      premiumTotal += Number(show.premiumPrice);
    } else {
      standardCount++;
      standardTotal += Number(show.price);
    }
  });

  const breakdownEl = document.getElementById('priceBreakdown');
  if (breakdownEl) {
    let html = '';
    if (standardCount > 0) {
      html += `
        <div class="cv-checkout-row">
          <span class="label">Standard × ${standardCount}</span>
          <span class="value">${formatCurrency(standardTotal)}</span>
        </div>
      `;
    }
    if (premiumCount > 0) {
      html += `
        <div class="cv-checkout-row">
          <span class="label">Premium × ${premiumCount}</span>
          <span class="value">${formatCurrency(premiumTotal)}</span>
        </div>
      `;
    }
    html += `
      <div class="cv-checkout-row">
        <span class="label">Convenience Fee</span>
        <span class="value">${formatCurrency(30 * checkoutData.seats.length)}</span>
      </div>
    `;
    breakdownEl.innerHTML = html;
  }

  updateCheckoutTotal();
}

function updateCheckoutTotal() {
  if (!checkoutData) return;
  const show = checkoutData.showData;
  const seats = checkoutData.seatDetails;

  let subtotal = 0;
  seats.forEach(s => {
    if (s.type === 'premium') subtotal += Number(show.premiumPrice);
    else subtotal += Number(show.price);
  });

  const convenienceFee = 30 * checkoutData.seats.length;
  const foodSubtotal = getFoodSubtotal();
  const total = subtotal + convenienceFee + foodSubtotal - appliedDiscount;

  const discountRow = document.getElementById('discountRow');
  if (discountRow) {
    if (appliedDiscount > 0) {
      discountRow.style.display = 'flex';
      discountRow.innerHTML = `
        <span class="label" style="color: #10b981;">Promo Discount</span>
        <span class="value" style="color: #10b981;">-${formatCurrency(appliedDiscount)}</span>
      `;
    } else {
      discountRow.style.display = 'none';
    }
  }

  const totalEl = document.getElementById('checkoutTotal');
  if (totalEl) {
    totalEl.textContent = formatCurrency(Math.max(0, total));
  }

  const foodTotalEl = document.getElementById('foodTotal');
  if (foodTotalEl) {
    foodTotalEl.textContent = formatCurrency(getFoodSubtotal());
  }
}

/* ── Promo Code ─────────────────────────────────────────── */

async function applyPromo() {
  const input = document.getElementById('promoInput');
  const code = input?.value?.trim();
  if (!code) {
    showToast('Please enter a promo code', 'error');
    return;
  }

  const show = checkoutData.showData;
  const seats = checkoutData.seatDetails;
  let subtotal = 0;
  seats.forEach(s => {
    if (s.type === 'premium') subtotal += Number(show.premiumPrice);
    else subtotal += Number(show.price);
  });

  try {
    const btn = document.getElementById('promoBtn');
    showButtonLoading(btn, 'Checking...');

    const result = await applyPromoCode(code, subtotal);

    if (result.valid) {
      appliedDiscount = result.discount;
      showToast(result.message, 'success');
      input.disabled = true;
      btn.textContent = '✓ Applied';
      btn.disabled = true;
      btn.style.background = 'rgba(16, 185, 129, 0.2)';
      btn.style.color = '#10b981';
      btn.style.borderColor = '#10b981';
    } else {
      showToast(result.message, 'error');
      hideButtonLoading(btn);
    }

    updateCheckoutTotal();
  } catch (err) {
    showToast(err.message, 'error');
    hideButtonLoading(document.getElementById('promoBtn'));
  }
}

function removePromo() {
  appliedDiscount = 0;
  const input = document.getElementById('promoInput');
  const btn = document.getElementById('promoBtn');
  if (input) { input.value = ''; input.disabled = false; }
  if (btn) {
    btn.textContent = 'Apply';
    btn.disabled = false;
    btn.style.background = '';
    btn.style.color = '';
    btn.style.borderColor = '';
  }
  updateCheckoutTotal();
}

/* ── Payment Method ─────────────────────────────────────── */

function selectPayment(method) {
  selectedPaymentMethod = method;
  document.querySelectorAll('.cv-payment-method').forEach(el => {
    el.classList.toggle('selected', el.dataset.method === method);
  });
}

/* ── Confirm Booking ────────────────────────────────────── */

async function confirmBooking() {
  if (!checkoutData) return;

  const btn = document.getElementById('confirmBtn');
  showButtonLoading(btn, 'Booking...');

  try {
    const promoInput = document.getElementById('promoInput');
    const promoCode = promoInput?.value?.trim() || null;

    const food = Object.entries(foodSelection).map(([foodItemId, quantity]) => ({
      foodItemId,
      quantity,
    }));

    const booking = await bookTicket(
      checkoutData.showId,
      checkoutData.seats,
      appliedDiscount > 0 ? promoCode : null,
      food.length > 0 ? food : null
    );

    // Emit socket event for real-time update
    emitSeatsBooked(checkoutData.showId, checkoutData.seats);

    // Clear checkout data
    sessionStorage.removeItem('cv_checkout');

    // Show success modal
    showBookingSuccess(booking);

  } catch (err) {
    showToast('Booking failed: ' + err.message, 'error');
    hideButtonLoading(btn);
  }
}

function showBookingSuccess(booking) {
  const modal = document.getElementById('successModal');
  if (!modal) {
    // Redirect to bookings
    showToast('Booking confirmed!', 'success');
    setTimeout(() => window.location.href = '/pages/my-bookings.html', 1500);
    return;
  }

  document.getElementById('successRef').textContent = booking.bookingRef;
  document.getElementById('successSeats').textContent =
    (typeof booking.seats === 'string' ? JSON.parse(booking.seats) : booking.seats).join(', ');
  document.getElementById('successAmount').textContent = formatCurrency(booking.totalAmount);

  modal.classList.add('show');

  // Confetti effect
  createConfetti();
}

function createConfetti() {
  const container = document.createElement('div');
  container.className = 'cv-confetti';
  document.body.appendChild(container);

  const colors = ['#e50914', '#f5c518', '#10b981', '#3b82f6', '#a855f7', '#ec4899'];
  for (let i = 0; i < 60; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: absolute;
      width: ${4 + Math.random() * 8}px;
      height: ${4 + Math.random() * 8}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      left: ${Math.random() * 100}%;
      top: -10px;
      animation: confettiFall ${2 + Math.random() * 3}s ease forwards;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    container.appendChild(dot);
  }

  // Add confetti animation
  if (!document.getElementById('confettiStyles')) {
    const style = document.createElement('style');
    style.id = 'confettiStyles';
    style.textContent = `
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0); opacity: 1; }
        100% { transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => container.remove(), 4000);
}

/* ── My Bookings ────────────────────────────────────────── */

async function loadMyBookings() {
  const container = document.getElementById('bookingsList');
  if (!container) return;

  if (!requireAuth()) return;

  showLoading(container);

  try {
    const bookings = await fetchMyBookings();

    if (!bookings || bookings.length === 0) {
      container.innerHTML = `
        <div class="cv-empty-state">
          <div class="icon">🎟️</div>
          <h3>No bookings yet</h3>
          <p>Your movie tickets will appear here</p>
          <a href="/pages/movies.html" class="cv-btn cv-btn-primary">
            <i class="bi bi-film"></i> Browse Movies
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = bookings.map(booking => {
      const seats = typeof booking.seats === 'string' ? JSON.parse(booking.seats) : booking.seats;
      const show = booking.show;
      const movie = show?.movie;
      const theatre = show?.theatre;

      const statusClass = booking.status === 'confirmed' ? 'cv-badge-success' :
                          booking.status === 'cancelled' ? 'cv-badge-primary' : 'cv-badge-muted';

      return `
        <div class="cv-booking-card cv-fade-in-up" data-animate>
          <img class="poster-thumb" src="${movie?.poster || ''}" alt="${movie?.title || ''}"
               onerror="this.src='https://images.unsplash.com/photo-1489599849927-2ee91cde69a0?w=400&h=600&fit=crop'">
          <div class="booking-info">
            <h4>${movie?.title || 'Unknown Movie'}</h4>
            <div class="booking-meta">
              <span><i class="bi bi-calendar3"></i> ${formatDate(show?.date)}</span>
              <span><i class="bi bi-clock"></i> ${show?.time}</span>
              <span><i class="bi bi-geo-alt"></i> ${theatre?.name || ''}</span>
            </div>
            <div style="margin-bottom: 8px;">
              <span class="cv-badge ${statusClass}">${booking.status.toUpperCase()}</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--cv-text-secondary); margin-bottom: 4px;">
              <strong>Seats:</strong> ${seats.join(', ')}
            </div>
            <div class="booking-ref">REF: ${booking.bookingRef || 'N/A'}</div>
            <div class="booking-amount">${formatCurrency(booking.totalAmount)}</div>
            ${booking.discount > 0 ? `<div style="font-size: 0.75rem; color: #10b981;">Saved ${formatCurrency(booking.discount)} with ${booking.promoCode}</div>` : ''}
          </div>
          ${booking.status === 'confirmed' ? `
            <div style="align-self: flex-start;">
              <button class="cv-btn cv-btn-outline cv-btn-sm" onclick="handleCancelBooking(${booking.id})"
                      style="color: #ef4444; border-color: rgba(239,68,68,0.3);">
                Cancel
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    initScrollReveal();

  } catch (err) {
    container.innerHTML = `
      <div class="cv-empty-state">
        <div class="icon">⚠️</div>
        <h3>Failed to load bookings</h3>
        <p>${err.message}</p>
        <button class="cv-btn cv-btn-primary" onclick="loadMyBookings()">Retry</button>
      </div>
    `;
  }
}

async function handleCancelBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;

  try {
    await cancelBookingAPI(bookingId);
    showToast('Booking cancelled successfully', 'success');
    loadMyBookings();
  } catch (err) {
    showToast('Failed to cancel: ' + err.message, 'error');
  }
}
