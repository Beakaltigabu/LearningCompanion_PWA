import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'sunshine', // Default theme
      userType: 'child', // Track user type for theme context

      setUserType: (userType) => {
        set({ userType });
        // Auto-set appropriate default theme based on user type
        const currentTheme = get().theme;
        if (userType === 'parent' && (currentTheme === 'sunshine' || currentTheme === 'moon')) {
          set({ theme: 'light' });
        } else if (userType === 'child' && (currentTheme === 'light' || currentTheme === 'dark')) {
          set({ theme: 'sunshine' });
        }
      },

      setTheme: (theme) => set({ theme }),

      toggleTheme: () => {
        const { theme, userType } = get();
        let newTheme;

        if (userType === 'child') {
          // Child themes: sunshine <-> moon
          newTheme = theme === 'sunshine' ? 'moon' : 'sunshine';
        } else {
          // Parent themes: light <-> dark
          newTheme = theme === 'light' ? 'dark' : 'light';
        }

        set({ theme: newTheme });

        // Apply theme to document
        const root = document.documentElement;
        root.className = root.className.replace(/theme-\w+/g, '');

        if (userType === 'child') {
          root.classList.add(`theme-${newTheme}`);
        } else {
          root.classList.add(`theme-admin-${newTheme}`);
        }
      },

      // Initialize theme on app load
      initializeTheme: () => {
        const { theme, userType } = get();
        const root = document.documentElement;
        root.className = root.className.replace(/theme-\w+/g, '');

        if (userType === 'child') {
          root.classList.add(`theme-${theme}`);
        } else {
          root.classList.add(`theme-admin-${theme}`);
        }
      }
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        theme: state.theme,
        userType: state.userType
      }),
    }
  )
);
