import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export const useTranslation = (explicitNamespace) => {
  const location = useLocation();
  const { t: originalT, i18n } = useI18nTranslation();

  // Determine namespace based on current route or explicit namespace
  const namespace = useMemo(() => {
    if (explicitNamespace) return explicitNamespace;

    const path = location.pathname;

    // Child routes
    if (path.startsWith('/child') ||
        path.startsWith('/pin-entry') ||
        path.startsWith('/auth/child-selection') ||
        (path === '/role-selection' && localStorage.getItem('selectedRole') === 'child')) {
      return 'child';
    }

    // Parent routes (default)
    return 'parent';
  }, [location.pathname, explicitNamespace]);

  // Create namespaced translation function
  const t = (key, options) => {
    return originalT(`${namespace}:${key}`, options);
  };

  return { t, i18n };
};
