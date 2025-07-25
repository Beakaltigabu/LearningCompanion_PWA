import React, { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

const ThemeProvider = ({ children }) => {
    const { theme } = useThemeStore();

    useEffect(() => {
        // This ensures the class is on the body, which is often better for global styles
        // and modals that might portal outside the main app div.
        document.body.className = `theme-${theme}`;
    }, [theme]);

    // The component itself doesn't need to render a div, as it's controlling the body class.
    return <>{children}</>;
};

export default ThemeProvider;
