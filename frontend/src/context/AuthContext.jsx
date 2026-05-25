/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from 'react';

import { getToken, removeToken } from '../services/tokenService';

import { getCurrentUser } from '../api/authApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Restore user from localStorage initially
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');

        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    // Login user
    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);

        setError(null);
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('user');

        removeToken();

        setUser(null);

        setError(null);
    };

    // Restore auth session on app load
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                setLoading(true);

                setError(null);

                // Check token before calling backend
                const token = getToken();

                if (!token) {
                    setLoading(false);

                    return;
                }

                // Fetch current authenticated user
                const data = await getCurrentUser();

                // Support both:
                // { user: {...} }
                // OR direct user object
                login(data.user || data);
            } catch (err) {
                console.error(err);

                // Token invalid or expired
                logout();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
