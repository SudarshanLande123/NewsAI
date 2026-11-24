const layout = (title, bodyHtml) => `
<div style="font-family:Arial,sans-serif;background:#f4f6fb;padding:24px;">
  <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;">
    <div style="background:#7c3aed;color:#fff;padding:20px 28px;font-size:20px;font-weight:bold;">
      ${title}
    </div>
    <div style="padding:28px;color:#333;line-height:1.6;font-size:15px;">
      ${bodyHtml}
    </div>
    <div style="padding:16px 28px;background:#f9fafb;color:#888;font-size:15px;text-align:center;">
      Developed by <strong>Sudarshan Lande</strong>
    </div>
  </div>
</div>`;

const sendEmail = async ({ to, subject, html }) => {
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        accept: 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'News App', email: process.env.EMAIL_FROM },
        to: [{ email: to }],
        subject,
        htmlContent: html
      })
    });

    if (!res.ok) {
      console.error('Email error:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

exports.sendWelcomeEmail = (user) =>
  sendEmail({
    to: user.email,
    subject: 'Welcome to News App 🎉',
    html: layout(
      'Welcome aboard!',
      `<p>Hi <strong>${user.name || 'there'}</strong>,</p>
       <p>Thanks for signing up. Your account is ready. Explore the latest news, get AI summaries and save your favorite articles.</p>
       <p>Happy reading!</p>`
    )
  });

exports.sendLoginEmail = (user) =>
  sendEmail({
    to: user.email,
    subject: 'New login to your account',
    html: layout(
      'Login detected',
      `<p>Hi <strong>${user.name || 'there'}</strong>,</p>
       <p>You just logged in on <strong>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</strong>.</p>
       <p>If this wasn't you, please change your password immediately.</p>`
    )
  });