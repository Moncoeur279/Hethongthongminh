// Backend/services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

async function sendVerificationEmail(to, code) {
  const html = `
    <div style="font-family:sans-serif">
      <h2>Verify your email</h2>
      <p>Your code:</p>
      <div style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</div>
      <p>This code expires in 10 minutes.</p>
    </div>`;
  await transporter.sendMail({
    from: `"Auth Service" <${process.env.SMTP_USER}>`,
    to,
    subject: "Email verification code",
    html,
  });
}

module.exports = { sendVerificationEmail };
