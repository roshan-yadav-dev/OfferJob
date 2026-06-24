import { AppShellSkeleton } from './components/common/Skeleton';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './context/AuthContext';

function App() {
    const { loading } = useAuth();

    if (loading) {
        return <AppShellSkeleton />;
    }

    return <AppRoutes />;
}

export default App;
