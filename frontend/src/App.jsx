import { useAuth } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="mb-4 inline-block">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return <AppRoutes />;
}

export default App;
