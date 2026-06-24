import { NavLink } from 'react-router-dom';

function SidebarItem({ to, icon: Icon, label, onClick }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                [
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ease-in-out',
                    isActive
                        ? 'bg-blue-50 text-[#2563eb] font-semibold'
                        : 'text-[#64748b] font-medium hover:bg-slate-50 hover:text-[#0f172a]',
                ].join(' ')
            }
        >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
            <span>{label}</span>
        </NavLink>
    );
}

export default SidebarItem;
