import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './i18n'; // Import i18n configuration first
import App from './App.jsx';
import ThemeProvider from './components/ThemeProvider';
import ErrorBoundary from './components/ErrorBoundary';

// Ensure i18n is ready before rendering
const renderApp = () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>
  );
};

// Wait for i18n to be ready
import('./i18n').then(() => {
  renderApp();
}).catch(() => {
  // Fallback if i18n fails to load
  renderApp();
});
