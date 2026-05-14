const nodemailer = require('nodemailer');

function isMailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  const host = process.env.SMTP_HOST;

  // Gmail app passwords are often displayed with spaces (e.g. "xxxx xxxx xxxx xxxx").
  // If users paste them with spaces, Gmail treats it as a different password.
  const rawPass = process.env.SMTP_PASS;
  const pass = host && host.includes('gmail') && typeof rawPass === 'string'
    ? rawPass.replace(/\s+/g, '')
    : rawPass;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass,
    },
  });
}

async function sendBookingConfirmationEmail({ to, subject, html, text }) {
  if (!isMailConfigured()) {
    return { skipped: true, reason: 'SMTP not configured' };
  }

  const from = process.env.SMTP_FROM || `CineVault <${process.env.SMTP_USER}>`;
  const transporter = createTransport();

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return { skipped: false, messageId: info.messageId };
}

async function verifySmtpConnection() {
  if (!isMailConfigured()) {
    return { skipped: true, reason: 'SMTP not configured' };
  }

  try {
    const transporter = createTransport();
    await transporter.verify();
    return { skipped: false, ok: true };
  } catch (err) {
    return { skipped: false, ok: false, error: err?.message || String(err) };
  }
}

module.exports = {
  isMailConfigured,
  sendBookingConfirmationEmail,
  verifySmtpConnection,
};
