import Navbar from '../components/common/Navbar';

function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-6xl mx-auto p-10">{children}</div>
        </div>
    );
}

export default MainLayout;
