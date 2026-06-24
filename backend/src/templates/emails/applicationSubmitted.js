const { escapeHtml, renderBaseLayout } = require('./baseLayout');

function renderApplicationSubmittedEmail({ studentName, jobTitle, company }) {
    return renderBaseLayout({
        title: 'Application Submitted',
        preheader: `Your application for ${jobTitle} was received`,
        bodyContent: `
          <h2>Application received</h2>
          <p>Hello <strong>${escapeHtml(studentName)}</strong>,</p>
          <p>Thank you for applying. We have received your application and the recruiter has been notified.</p>
          <div class="card">
            <p style="margin:0;"><strong>Position:</strong> ${escapeHtml(jobTitle)}</p>
            <p style="margin:8px 0 0;"><strong>Company:</strong> ${escapeHtml(company)}</p>
          </div>
          <p>You can track the status of your application anytime from your dashboard.</p>
          <a class="button" href="{{FRONTEND_URL}}/student/applications">View my applications</a>
        `,
    });
}

module.exports = { renderApplicationSubmittedEmail };
