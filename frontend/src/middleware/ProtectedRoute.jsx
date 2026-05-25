import { Navigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { getToken } from '../services/tokenService';

function ProtectedRoute({ children }) {
    const { user } = useAuth();

    const token = getToken();

    /*
        User OR token missing
    */

    if (!user || !token) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;
