import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLanguageStore = create(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => {
        set({ language: lang });
        // Don't call i18n.changeLanguage here - let components handle it
      },
    }),
    {
      name: 'language-storage',
    }
  )
);

export { useLanguageStore };
