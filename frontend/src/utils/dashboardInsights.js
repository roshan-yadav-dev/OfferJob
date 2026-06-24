export function countApplicationsThisWeek(applications = []) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return applications.filter(
        (app) => new Date(app.createdAt) >= weekAgo,
    ).length;
}

export function formatWeeklyInsight(count) {
    if (count <= 0) return 'No new activity this week';
    return `+${count} this week`;
}

export function formatConversionRate(numerator, denominator) {
    if (!denominator) return 'No applications yet';
    return `${Math.round((numerator / denominator) * 100)}% conversion rate`;
}

export function formatRejectedInsight(count) {
    return count > 0 ? 'Needs attention' : 'All clear';
}

export function calculateAverageAtsScore(atsScores = []) {
    if (!atsScores.length) return null;

    const total = atsScores.reduce(
        (sum, app) => sum + (app.aiScore ?? 0) * 100,
        0,
    );

    return Math.round(total / atsScores.length);
}

export function formatAtsInsight(score) {
    if (score < 40) return 'Below target — improve resume';
    if (score <= 70) return 'Room for improvement';
    return 'Strong match quality';
}
