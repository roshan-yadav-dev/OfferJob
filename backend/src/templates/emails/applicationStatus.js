const { escapeHtml, renderBaseLayout } = require('./baseLayout');

function renderApplicationStatusEmail({ studentName, jobTitle, status }) {
    const normalizedStatus = String(status || '').toUpperCase();
    const isShortlisted =
        normalizedStatus === 'SHORTLISTED' || normalizedStatus === 'ACCEPTED';
    const isRejected = normalizedStatus === 'REJECTED';

    const heading = isShortlisted
        ? 'Congratulations!'
        : isRejected
          ? 'Application Update'
          : 'Application Status Update';

    const accentColor = isShortlisted
        ? '#16a34a'
        : isRejected
          ? '#dc2626'
          : '#2563eb';

    const message = isShortlisted
        ? `You have been shortlisted for <strong>${escapeHtml(jobTitle)}</strong>. Our recruitment team will contact you with next steps soon.`
        : isRejected
          ? `Thank you for your interest in <strong>${escapeHtml(jobTitle)}</strong>. After careful review, we will not be moving forward with your application at this time.`
          : `Your application status for <strong>${escapeHtml(jobTitle)}</strong> has been updated to <strong>${escapeHtml(normalizedStatus)}</strong>.`;

    return renderBaseLayout({
        title: heading,
        preheader: `Status update for ${jobTitle}`,
        bodyContent: `
          <h2 style="color:${accentColor};">${heading}</h2>
          <p>Hello <strong>${escapeHtml(studentName)}</strong>,</p>
          <p>${message}</p>
          <a class="button" href="{{FRONTEND_URL}}/student/applications">View my applications</a>
        `,
    });
}

module.exports = { renderApplicationStatusEmail };
