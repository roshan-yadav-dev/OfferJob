export function getCompanyInitials(company) {
    if (!company) return '?';

    const parts = company.trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

export function formatRelativeDate(date) {
    if (!date) return 'Recently';

    const now = new Date();
    const target = new Date(date);
    const diffMs = now - target;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }

    return target.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export function formatDisplayDate(date) {
    if (!date) return 'N/A';

    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export function normalizeAtsScore(score) {
    if (score == null) return null;

    const value = score <= 1 ? score * 100 : score;
    return Math.round(value);
}
