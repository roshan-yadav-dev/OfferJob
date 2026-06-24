import {
    LayoutDashboard,
    Briefcase,
    FileText,
    User,
    PlusCircle,
    Users,
    Building2,
} from 'lucide-react';

export const studentNavItems = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/student/applications', label: 'Applications', icon: FileText },
    { to: '/student/profile', label: 'Profile', icon: User },
];

export const recruiterNavItems = [
    { to: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/recruiter/post-job', label: 'Post Job', icon: PlusCircle },
    { to: '/recruiter/candidates', label: 'Candidates', icon: Users },
    {
        to: '/recruiter/applications',
        label: 'Applications',
        icon: FileText,
    },
    {
        to: '/recruiter/profile',
        label: 'Company Profile',
        icon: Building2,
    },
];
