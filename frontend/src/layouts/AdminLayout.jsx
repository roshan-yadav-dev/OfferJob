import { useState } from 'react';
import { Menu } from 'lucide-react';

import AdminSidebar from '../components/admin/AdminSidebar';

function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#e2e8f0] bg-white px-4 py-3 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="focus-ring rounded-xl p-2 text-[#64748b] hover:bg-slate-50"
                        aria-label="Open sidebar"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <span className="text-base font-semibold text-[#0f172a]">
                        Admin Portal
                    </span>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}

export default AdminLayout;
