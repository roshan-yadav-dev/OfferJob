const { escapeHtml, renderBaseLayout } = require('./baseLayout');

function renderRecruiterNotificationEmail({
    recruiterName,
    studentName,
    jobTitle,
    company,
}) {
    return renderBaseLayout({
        title: 'New Job Application',
        preheader: `${studentName} applied for ${jobTitle}`,
        bodyContent: `
          <h2>New application received</h2>
          <p>Hello <strong>${escapeHtml(recruiterName)}</strong>,</p>
          <p>A candidate has submitted a new application for one of your job postings.</p>
          <div class="card">
            <p style="margin:0;"><strong>Candidate:</strong> ${escapeHtml(studentName)}</p>
            <p style="margin:8px 0 0;"><strong>Position:</strong> ${escapeHtml(jobTitle)}</p>
            <p style="margin:8px 0 0;"><strong>Company:</strong> ${escapeHtml(company)}</p>
          </div>
          <p>Review the application and take action from your recruiter dashboard.</p>
          <a class="button" href="{{FRONTEND_URL}}/recruiter/applications">Review applications</a>
        `,
    });
}

module.exports = { renderRecruiterNotificationEmail };
