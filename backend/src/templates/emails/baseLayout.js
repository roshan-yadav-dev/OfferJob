const env = require('../../config/env');

const brandColor = '#2563eb';
const brandColorDark = '#1d4ed8';
const mutedColor = '#64748b';
const surfaceColor = '#f8fafc';

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderBaseLayout({ title, preheader, bodyContent }) {
  const appName = escapeHtml(env.APP_NAME);
  const frontendUrl = escapeHtml(env.FRONTEND_URL);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { margin: 0; padding: 0; background-color: ${surfaceColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; }
    .wrapper { width: 100%; background-color: ${surfaceColor}; padding: 24px 12px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08); }
    .header { background: linear-gradient(135deg, ${brandColor}, ${brandColorDark}); padding: 28px 32px; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
    .header p { margin: 8px 0 0; color: rgba(255,255,255,0.88); font-size: 14px; }
    .content { padding: 32px; line-height: 1.6; font-size: 15px; }
    .content h2 { margin: 0 0 16px; font-size: 20px; color: #0f172a; }
    .content p { margin: 0 0 16px; color: #334155; }
    .button { display: inline-block; background: ${brandColor}; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 8px 0 20px; }
  .card { background: ${surfaceColor}; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 18px; margin: 16px 0 20px; }
  .card strong { color: #0f172a; }
    .footer { padding: 20px 32px 28px; border-top: 1px solid #e2e8f0; font-size: 12px; color: ${mutedColor}; text-align: center; }
    .footer a { color: ${brandColor}; text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .content, .header, .footer { padding-left: 20px !important; padding-right: 20px !important; }
      .content { padding-top: 24px !important; padding-bottom: 24px !important; }
    }
  </style>
</head>
<body>
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader || title)}</span>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>${appName}</h1>
        <p>Your career journey, powered by smart matching</p>
      </div>
      <div class="content">
        ${bodyContent}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
        <p><a href="${frontendUrl}">Visit the portal</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

module.exports = {
    escapeHtml,
    renderBaseLayout,
};
