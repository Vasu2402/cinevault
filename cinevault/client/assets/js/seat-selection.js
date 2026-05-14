/* ═══════════════════════════════════════════════════════════════
   CineVault — Seat Selection Logic
   Interactive seat grid with real-time Socket.io updates
   ═══════════════════════════════════════════════════════════════ */

let currentShowData = null;
let selectedSeats = [];
let seatData = [];

async function initSeatSelection() {
  const showId = getUrlParam('showId');
  const movieId = getUrlParam('movieId');
  if (!showId) {
    showToast('No show selected', 'error');
    return;
  }

  if (!requireAuth()) return;

  showLoading();

  try {
    // Load movie info
    if (movieId) {
      const movie = await fetchMovieById(movieId);
      if (movie) {
        document.getElementById('movieTitle').textContent = movie.title;
        document.getElementById('moviePoster').src = movie.poster;
        document.getElementById('movieGenre').textContent = movie.genre;
        document.getElementById('movieDuration').textContent = formatDuration(movie.duration);

        // Find matching show
        currentShowData = movie.shows?.find(s => String(s.id) === String(showId));
      }
    }

    if (currentShowData) {
      const el = document.getElementById('showInfo');
      if (el) {
        el.textContent = `${currentShowData.theatre?.name || 'Theatre'} • ${formatDate(currentShowData.date)} • ${currentShowData.time}`;
      }
    }

    // Load seats
    seatData = await fetchSeats(showId);
    renderSeatGrid(seatData);

    // Init Socket.io
    joinShow(showId);
    onSeatEvents({
      onLocked: handleSeatLocked,
      onReleased: handleSeatReleased,
      onConfirmed: handleSeatsConfirmed,
      onError: (data) => showToast(data.message, 'error'),
    });

  } catch (err) {
    showToast('Failed to load seats: ' + err.message, 'error');
  } finally {
    hideLoading();
  }
}

function renderSeatGrid(seats) {
  const grid = document.getElementById('seatGrid');
  if (!grid) return;

  const rows = {};
  seats.forEach(seat => {
    const row = seat.seatNumber.charAt(0);
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });

  const userId = String(getUser()?.id);

  grid.innerHTML = Object.keys(rows).sort().map(row => `
    <div class="cv-seat-row">
      <span class="cv-seat-row-label">${row}</span>
      ${rows[row].sort((a, b) => parseInt(a.seatNumber.slice(1)) - parseInt(b.seatNumber.slice(1))).map(seat => {
        let status = 'available';
        if (seat.isBooked) {
          status = 'booked';
        } else if (seat.lockedBy && seat.lockedBy !== userId) {
          const lockExpiry = seat.lockExpiry ? new Date(seat.lockExpiry) : null;
          if (lockExpiry && lockExpiry > new Date()) {
            status = 'locked';
          }
        } else if (selectedSeats.includes(seat.seatNumber)) {
          status = 'selected';
        }

        const premClass = seat.type === 'premium' ? ' premium' : '';

        return `
          <button class="cv-seat ${status}${premClass}"
                  data-seat="${seat.seatNumber}"
                  data-type="${seat.type}"
                  ${status === 'booked' || status === 'locked' ? 'disabled' : ''}
                  onclick="toggleSeat('${seat.seatNumber}', '${seat.type}')">
            ${parseInt(seat.seatNumber.slice(1))}
          </button>
        `;
      }).join('')}
      <span class="cv-seat-row-label">${row}</span>
    </div>
  `).join('');

  updateSummary();
}

function toggleSeat(seatNumber, type) {
  const showId = getUrlParam('showId');
  const idx = selectedSeats.indexOf(seatNumber);

  if (idx > -1) {
    // Deselect
    selectedSeats.splice(idx, 1);
    emitSeatUnlock(showId, seatNumber);
  } else {
    if (selectedSeats.length >= 10) {
      showToast('Maximum 10 seats per booking', 'error');
      return;
    }
    // Select
    selectedSeats.push(seatNumber);
    emitSeatLock(showId, seatNumber);
  }

  // Update UI
  const btn = document.querySelector(`[data-seat="${seatNumber}"]`);
  if (btn) {
    if (selectedSeats.includes(seatNumber)) {
      btn.className = `cv-seat selected${type === 'premium' ? ' premium' : ''}`;
      btn.classList.add('cv-seat-pop');
    } else {
      btn.className = `cv-seat available${type === 'premium' ? ' premium' : ''}`;
    }
  }

  updateSummary();
}

function updateSummary() {
  const bar = document.querySelector('.cv-summary-bar');
  const countEl = document.getElementById('selectedCount');
  const totalEl = document.getElementById('totalPrice');

  if (selectedSeats.length > 0) {
    bar?.classList.add('show');
  } else {
    bar?.classList.remove('show');
  }

  if (countEl) {
    countEl.innerHTML = `<strong>${selectedSeats.length}</strong> seat${selectedSeats.length !== 1 ? 's' : ''} selected`;
  }

  if (totalEl && currentShowData) {
    let total = 0;
    selectedSeats.forEach(sn => {
      const seat = seatData.find(s => s.seatNumber === sn);
      if (seat?.type === 'premium') {
        total += Number(currentShowData.premiumPrice);
      } else {
        total += Number(currentShowData.price);
      }
    });
    totalEl.textContent = formatCurrency(total);
  }
}

/* ── Socket.io Event Handlers ───────────────────────────── */

function handleSeatLocked(data) {
  const userId = String(getUser()?.id);
  if (data.lockedBy === userId) return; // Our own lock

  const btn = document.querySelector(`[data-seat="${data.seatNumber}"]`);
  if (btn && !selectedSeats.includes(data.seatNumber)) {
    btn.className = btn.className.replace(/available|selected/, 'locked');
    btn.disabled = true;
  }
}

function handleSeatReleased(data) {
  const btn = document.querySelector(`[data-seat="${data.seatNumber}"]`);
  if (btn && !selectedSeats.includes(data.seatNumber)) {
    const type = btn.getAttribute('data-type');
    btn.className = `cv-seat available${type === 'premium' ? ' premium' : ''}`;
    btn.disabled = false;
  }
}

function handleSeatsConfirmed(data) {
  data.seatNumbers.forEach(sn => {
    const btn = document.querySelector(`[data-seat="${sn}"]`);
    if (btn) {
      btn.className = btn.className.replace(/available|selected|locked/, 'booked');
      btn.disabled = true;
    }
    // Remove from our selection if someone else booked it
    const idx = selectedSeats.indexOf(sn);
    if (idx > -1) {
      selectedSeats.splice(idx, 1);
    }
  });
  updateSummary();
}

/* ── Proceed to Checkout ────────────────────────────────── */

function proceedToCheckout() {
  if (selectedSeats.length === 0) {
    showToast('Please select at least one seat', 'error');
    return;
  }

  const showId = getUrlParam('showId');
  const movieId = getUrlParam('movieId');

  // Store in sessionStorage for checkout page
  sessionStorage.setItem('cv_checkout', JSON.stringify({
    showId,
    movieId,
    seats: selectedSeats,
    showData: currentShowData,
    seatDetails: selectedSeats.map(sn => {
      const seat = seatData.find(s => s.seatNumber === sn);
      return { seatNumber: sn, type: seat?.type || 'standard' };
    }),
  }));

  window.location.href = '/pages/checkout.html';
}
