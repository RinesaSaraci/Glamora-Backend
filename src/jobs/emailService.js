const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReservationConfirmation = async (reservation) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

  const { customer, service, employee, salon, date, startTime, endTime } = reservation;

  await transporter.sendMail({
    from: `"Glamora" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: "Rezervimi juaj u konfirmua — Glamora",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:24px">
        <h2 style="color:#7c3aed">Rezervimi juaj u krye! ✅</h2>
        <p>Përshëndetje <strong>${customer.name}</strong>,</p>
        <p>Rezervimi juaj në <strong>${salon.name}</strong> u konfirmua me sukses.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px;color:#6b7280">Shërbimi</td><td style="padding:8px;font-weight:600">${service.name}</td></tr>
          <tr style="background:#f9fafb"><td style="padding:8px;color:#6b7280">Punëtori</td><td style="padding:8px;font-weight:600">${employee.name}</td></tr>
          <tr><td style="padding:8px;color:#6b7280">Data</td><td style="padding:8px;font-weight:600">${new Date(date).toLocaleDateString("sq-AL")}</td></tr>
          <tr style="background:#f9fafb"><td style="padding:8px;color:#6b7280">Ora</td><td style="padding:8px;font-weight:600">${startTime} – ${endTime}</td></tr>
          <tr><td style="padding:8px;color:#6b7280">Saloni</td><td style="padding:8px;font-weight:600">${salon.name}, ${salon.city}</td></tr>
        </table>
        <p style="color:#6b7280;font-size:14px">Nëse dëshironi të anuloni, mund ta bëni nga aplikacioni.</p>
        <p style="color:#7c3aed;font-weight:600">Glamora Team 💜</p>
      </div>
    `,
  });

  console.log(`[Email] Konfirmim u dërgua te ${customer.email}`);
};

// Background job — fire and forget, nuk e pret requesti
const sendConfirmationInBackground = (reservation) => {
  setImmediate(() => {
    sendReservationConfirmation(reservation).catch((err) =>
      console.error("[Email] Gabim:", err.message)
    );
  });
};

module.exports = { sendConfirmationInBackground };
