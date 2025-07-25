import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { isTokenExpired } from '../utils/tokenUtils';

const ProtectedRoute = ({ children, parentRoute = false, childRoute = false }) => {
    const { isAuthenticated, userType, accessToken, logout, hasValidTokens } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    // Check token expiration on mount and route changes
    useEffect(() => {
        const checkAuth = async () => {
            // Check if we have valid tokens
            if (!hasValidTokens()) {
                console.log('No valid tokens found, logging out...');
                logout();
                setIsChecking(false);
                return;
            }

            // Check if access token is expired
            if (isAuthenticated && accessToken && isTokenExpired(accessToken)) {
                console.log('Token expired, logging out...');
                logout();
            }
            setIsChecking(false);
        };

        checkAuth();
    }, [isAuthenticated, accessToken, logout, hasValidTokens]);

    // Show loading while checking authentication
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !hasValidTokens()) {
        const storedRole = localStorage.getItem('selectedRole');

        if (storedRole === 'parent') {
            return <Navigate to="/auth/parent-login" replace />;
        } else if (storedRole === 'child') {
            return <Navigate to="/auth/child-selection" replace />;
        }

        return <Navigate to="/role-selection" replace />;
    }

    // Handle parent-specific routes
    if (parentRoute && userType !== 'parent') {
        return <Navigate to="/select-child" replace />;
    }

    // Handle child-specific routes
    if (childRoute && userType !== 'child') {
        return <Navigate to="/select-child" replace />;
    }

    return children || <Outlet />;
};

export default ProtectedRoute;
