import { Bell, Briefcase, FileText, Search } from 'lucide-react';

export const emptyStates = {
    jobs: {
        title: 'No jobs found',
        message:
            'No jobs are available right now. Check back again later for new opportunities.',
        icon: Briefcase,
    },
    searchResults: {
        title: 'No matching jobs',
        message:
            'Try adjusting your search terms or filters to discover more roles.',
        icon: Search,
    },
    applications: {
        title: 'No applications yet',
        message:
            "You haven't applied to any jobs yet. Browse open roles and submit your first application.",
        icon: FileText,
        actionLabel: 'Browse Jobs',
        actionTo: '/student/jobs',
    },
    notifications: {
        title: 'No notifications',
        message:
            "You're all caught up. We'll notify you about application updates and new matches here.",
        icon: Bell,
    },
};
