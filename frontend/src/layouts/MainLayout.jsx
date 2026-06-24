import Navbar from '../components/common/Navbar';

function MainLayout({ children, fullWidth = false }) {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans">
            <Navbar />

            {fullWidth ? (
                children
            ) : (
                <div className="mx-auto max-w-6xl p-6 sm:p-10">{children}</div>
            )}
        </div>
    );
}

export default MainLayout;
