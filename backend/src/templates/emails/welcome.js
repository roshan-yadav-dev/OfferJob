const { escapeHtml, renderBaseLayout } = require('./baseLayout');

function renderWelcomeEmail({ name }) {
    const safeName = escapeHtml(name);

    return renderBaseLayout({
        title: 'Welcome to the platform',
        preheader: `Welcome aboard, ${safeName}!`,
        bodyContent: `
          <h2>Welcome aboard, ${safeName}!</h2>
          <p>Your account has been created successfully. You can now explore job opportunities, build your profile, and track applications in one place.</p>
          <p>Complete your profile to get better AI-powered job matches tailored to your skills and experience.</p>
          <a class="button" href="{{FRONTEND_URL}}/login">Go to your dashboard</a>
          <p>If you did not create this account, you can safely ignore this email.</p>
        `,
    });
}

module.exports = { renderWelcomeEmail };
