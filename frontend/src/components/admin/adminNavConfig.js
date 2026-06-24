import {
    LayoutDashboard,
    Briefcase,
    Building2,
    GraduationCap,
    BarChart3,
} from 'lucide-react';

export const adminNavItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/admin/recruiters', label: 'Recruiters', icon: Building2 },
    { to: '/admin/students', label: 'Students', icon: GraduationCap },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];
