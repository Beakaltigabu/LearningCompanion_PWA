import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set, get) => ({
            _hasHydrated: false,
            isAuthenticated: false,
            user: null,
            userType: null,
            accessToken: null,
            refreshToken: null,
            login: (userData, tokens) => {
                console.log('Parent login - userData:', userData, 'tokens:', tokens);

                // Validate tokens before storing
                if (!tokens.accessToken || !tokens.refreshToken) {
                    console.error('Invalid tokens provided to login');
                    return;
                }

                set({
                    isAuthenticated: true,
                    user: userData,
                    userType: 'parent',
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                });
            },
            childLogin: (loginResult) => {
                console.log('Child login - result:', loginResult);

                // Validate tokens before storing
                if (!loginResult.accessToken || !loginResult.refreshToken) {
                    console.error('Invalid tokens provided to childLogin');
                    return;
                }

                set({
                    isAuthenticated: true,
                    user: loginResult.user,
                    userType: 'child',
                    accessToken: loginResult.accessToken,
                    refreshToken: loginResult.refreshToken,
                });
            },
            logout: () => {
                console.log('Logging out user...');
                set({
                    isAuthenticated: false,
                    user: null,
                    userType: null,
                    accessToken: null,
                    refreshToken: null,
                });

                // Clear any stored tokens from localStorage
                localStorage.removeItem('auth-storage');

                // Force redirect to login page
                const currentPath = window.location.pathname;
                if (!['/auth', '/auth/login', '/auth/register'].includes(currentPath)) {
                    console.log('Redirecting to login page...');
                    window.location.replace('/auth/login');
                }
            },
            setHasHydrated: (state) => {
                set({
                    _hasHydrated: state
                });
            },
            updateUserPreferences: (preferences) => set((state) => ({
                user: { ...state.user, ...preferences }
            })),
            // Helper method to check if tokens are valid
            hasValidTokens: () => {
                const state = get();
                return !!(state.accessToken && state.refreshToken &&
                         state.accessToken !== 'undefined' && state.refreshToken !== 'undefined');
            }
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);

export default useAuthStore;
