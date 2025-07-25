import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import PinEntry from '../pages/PinEntry';
import ChildSelection from '../pages/ChildSelection';
import RoleSelection from '../pages/RoleSelection';
import ChildDashboard from '../pages/child/ChildDashboard';
import ChildProfile from '../pages/child/ChildProfile';
import AdminDashboard from '../pages/admin/Dashboard';
import ChildManagement from '../pages/admin/ChildManagement';
import AdminSettings from '../pages/AdminSettingsPage';
import ErrorPage from '../pages/ErrorPage';
import NotFound from '../pages/NotFound';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import ChildLayout from '../layouts/ChildLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Check for stored role preference
  const getStoredRole = () => localStorage.getItem('selectedRole');
  const storedRole = getStoredRole();

  // Determine initial route based on auth state and stored role
  const getInitialRoute = () => {
    if (isAuthenticated) {
      return user?.role === 'parent' ? '/admin' : '/child';
    }

    if (storedRole === 'parent') {
      return '/auth/parent-login';
    } else if (storedRole === 'child') {
      return '/auth/child-selection';
    }

    return '/role-selection';
  };

  return (
    <Routes>
      {/* Role Selection */}
      <Route path="/role-selection" element={<RoleSelection />} />

      {/* Auth routes with layout */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="parent-login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Child auth flow */}
      <Route path="/auth/child-selection" element={<ChildSelection />} />
      <Route path="/pin-entry/:childId" element={<PinEntry />} />

      {/* Error pages */}
      <Route path="/error" element={<ErrorPage />} />

      {/* Child routes */}
      <Route path="/child" element={
        <ProtectedRoute childRoute>
          <ChildLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ChildDashboard />} />
        <Route path="profile" element={<ChildProfile />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute parentRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="children" element={<ChildManagement />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={getInitialRoute()} replace />} />

      {/* Legacy redirects */}
      <Route path="/login" element={<Navigate to="/auth/parent-login" replace />} />
      <Route path="/register" element={<Navigate to="/auth/register" replace />} />
      <Route path="/select-child" element={<Navigate to="/auth/child-selection" replace />} />

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
