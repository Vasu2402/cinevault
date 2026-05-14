function formatCurrency(amount) {
  const n = Number(amount || 0);
  return `₹${n.toFixed(2)}`;
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildBookingEmail({ userName, booking }) {
  const movieTitle = booking?.show?.movie?.title || 'Movie';
  const theatreName = booking?.show?.theatre?.name || 'Theatre';
  const theatreLocation = booking?.show?.theatre?.location || '';
  const showDate = booking?.show?.date || '';
  const showTime = booking?.show?.time || '';
  const seats = (Array.isArray(booking?.seats) ? booking.seats : [])
    .map((x) => String(x))
    .join(', ');

  const foodItems = booking?.foodOrder?.items || [];
  const foodLines = foodItems
    .map((it) => {
      const name = it?.foodItem?.name || 'Item';
      return `${name} × ${it.quantity} — ${formatCurrency(it.lineTotal)}`;
    });

  const subject = `CineVault Booking Confirmed — ${booking.bookingRef || ''} ${movieTitle}`.trim();

  const text = [
    `Hi ${userName || 'there'},`,
    '',
    `Your booking is confirmed!`,
    `Booking Ref: ${booking.bookingRef || '-'}`,
    `Movie: ${movieTitle}`,
    `Theatre: ${theatreName}${theatreLocation ? ' — ' + theatreLocation : ''}`,
    `Show: ${showDate} ${showTime}`,
    `Seats: ${seats || '-'}`,
    '',
    foodLines.length ? 'Food & Beverages:' : null,
    ...foodLines,
    foodLines.length ? `Food Total: ${formatCurrency(booking?.foodOrder?.totalAmount)}` : null,
    '',
    `Total Paid: ${formatCurrency(booking.totalAmount)}`,
    '',
    'Thanks for choosing CineVault!',
  ].filter(Boolean).join('\n');

  const foodHtml = foodLines.length
    ? `
      <h3 style="margin: 18px 0 8px;">Food &amp; Beverages</h3>
      <ul style="margin: 0 0 8px; padding-left: 18px;">
        ${foodItems.map((it) => {
          const name = escapeHtml(it?.foodItem?.name || 'Item');
          return `<li>${name} × ${it.quantity} — <b>${escapeHtml(formatCurrency(it.lineTotal))}</b></li>`;
        }).join('')}
      </ul>
      <div><b>Food Total:</b> ${escapeHtml(formatCurrency(booking?.foodOrder?.totalAmount))}</div>
    `
    : '';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.45; color: #111;">
      <h2 style="margin: 0 0 8px;">Booking Confirmed</h2>
      <p style="margin: 0 0 16px;">Hi ${escapeHtml(userName || 'there')}, your CineVault booking is confirmed.</p>

      <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px;">
        <div><b>Booking Ref:</b> ${escapeHtml(booking.bookingRef || '-')}</div>
        <div><b>Movie:</b> ${escapeHtml(movieTitle)}</div>
        <div><b>Theatre:</b> ${escapeHtml(theatreName)}${theatreLocation ? ` — ${escapeHtml(theatreLocation)}` : ''}</div>
        <div><b>Show:</b> ${escapeHtml(showDate)} ${escapeHtml(showTime)}</div>
        <div><b>Seats:</b> ${escapeHtml(seats || '-')}</div>
        ${foodHtml}
        <div style="margin-top: 14px; font-size: 16px;"><b>Total Paid:</b> ${escapeHtml(formatCurrency(booking.totalAmount))}</div>
      </div>

      <p style="margin: 16px 0 0; color: #374151;">Thanks for choosing CineVault.</p>
    </div>
  `;

  return { subject, html, text };
}

module.exports = { buildBookingEmail };
