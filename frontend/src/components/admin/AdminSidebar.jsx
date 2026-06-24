import { Link, useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import SidebarItem from '../dashboard/SidebarItem';
import { adminNavItems } from './adminNavConfig';

function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
        parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
}

function AdminSidebar({ isOpen = false, onClose }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNavClick = () => {
        if (onClose) onClose();
    };

    return (
        <>
            <div
                className={[
                    'fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200 ease-in-out lg:hidden',
                    isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                ].join(' ')}
                onClick={onClose}
                aria-hidden={!isOpen}
            />

            <aside
                className={[
                    'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#e2e8f0] bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                ].join(' ')}
            >
                <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-4">
                    <Link
                        to="/admin/dashboard"
                        className="text-lg font-semibold tracking-tight text-[#2563eb]"
                        onClick={handleNavClick}
                    >
                        Admin Portal
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="focus-ring rounded-xl p-2 text-[#64748b] transition-all duration-200 hover:bg-slate-50 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="border-b border-[#e2e8f0] px-5 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-[#2563eb]">
                            {getInitials(user?.name)}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#0f172a]">
                                {user?.name || 'Admin'}
                            </p>
                            <p className="truncate text-xs text-[#64748b]">
                                Administrator
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                    {adminNavItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            label={item.label}
                            onClick={handleNavClick}
                        />
                    ))}
                </nav>

                <div className="border-t border-[#e2e8f0] p-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm font-medium text-[#64748b] transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut className="h-4 w-4" strokeWidth={1.75} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}

export default AdminSidebar;
