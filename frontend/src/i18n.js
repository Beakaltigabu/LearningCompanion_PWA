// Import libraries
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import parent translation files
import enParentTranslations from './locales/en/parent.json';
import amParentTranslations from './locales/am/parent.json';

// Import child translation files
import enChildTranslations from './locales/en/child.json';
import amChildTranslations from './locales/am/child.json';

const resources = {
  en: {
    parent: enParentTranslations,
    child: enChildTranslations
  },
  am: {
    parent: amParentTranslations,
    child: amChildTranslations
  }
};

// Get initial language from localStorage
const getInitialLanguage = () => {
  try {
    const stored = localStorage.getItem('language-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.language || 'en';
    }
  } catch (error) {
    console.error('Error reading language from localStorage:', error);
  }
  return 'en';
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false
    },

    // Configure namespace and key separator
    ns: ['parent', 'child'],
    defaultNS: 'parent',
    keySeparator: '.',
    nsSeparator: ':',

    // React specific options
    react: {
      useSuspense: false
    }
  });

export default i18n;
