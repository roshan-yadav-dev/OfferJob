const { escapeHtml, renderBaseLayout } = require('./baseLayout');

function renderPasswordResetEmail({ name, resetUrl }) {
    return renderBaseLayout({
        title: 'Reset Your Password',
        preheader: 'Use the link below to reset your password',
        bodyContent: `
          <h2>Password reset request</h2>
          <p>Hello <strong>${escapeHtml(name)}</strong>,</p>
          <p>We received a request to reset your password. Click the button below to choose a new password. This link expires in 10 minutes.</p>
          <a class="button" href="${escapeHtml(resetUrl)}">Reset password</a>
          <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          <p style="font-size:13px;color:#64748b;">If the button does not work, copy and paste this URL into your browser:<br/>${escapeHtml(resetUrl)}</p>
        `,
    });
}

module.exports = { renderPasswordResetEmail };
