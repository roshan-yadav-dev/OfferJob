import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

function RoleRoute({ children, role }) {
    const { user } = useAuth();

    if (user?.role !== role) {
        return <Navigate to="/forbidden" />;
    }

    return children;
}

export default RoleRoute;
