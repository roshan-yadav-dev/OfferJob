const { escapeHtml, renderBaseLayout } = require('./baseLayout');

function renderInterviewInviteEmail({
    studentName,
    jobTitle,
    company,
    interviewDate,
    interviewTime,
    interviewLocation,
    notes,
}) {
    const details = [
        interviewDate
            ? `<p style="margin:0;"><strong>Date:</strong> ${escapeHtml(interviewDate)}</p>`
            : '',
        interviewTime
            ? `<p style="margin:8px 0 0;"><strong>Time:</strong> ${escapeHtml(interviewTime)}</p>`
            : '',
        interviewLocation
            ? `<p style="margin:8px 0 0;"><strong>Location / Link:</strong> ${escapeHtml(interviewLocation)}</p>`
            : '',
    ]
        .filter(Boolean)
        .join('');

    const notesBlock = notes
        ? `<p style="margin:16px 0 0;"><strong>Additional notes:</strong><br/>${escapeHtml(notes)}</p>`
        : '';

    return renderBaseLayout({
        title: 'Interview Invitation',
        preheader: `You are invited to interview for ${jobTitle}`,
        bodyContent: `
          <h2>You're invited to an interview</h2>
          <p>Hello <strong>${escapeHtml(studentName)}</strong>,</p>
          <p>Congratulations! You have been invited to interview for the following role:</p>
          <div class="card">
            <p style="margin:0;"><strong>Position:</strong> ${escapeHtml(jobTitle)}</p>
            <p style="margin:8px 0 0;"><strong>Company:</strong> ${escapeHtml(company)}</p>
            ${details}
            ${notesBlock}
          </div>
          <p>Please confirm your availability and prepare any materials requested by the recruiter.</p>
          <a class="button" href="{{FRONTEND_URL}}/student/applications">View application details</a>
        `,
    });
}

module.exports = { renderInterviewInviteEmail };
