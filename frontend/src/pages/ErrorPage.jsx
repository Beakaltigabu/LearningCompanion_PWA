import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Frown } from 'lucide-react';

const ErrorPage = ({ error }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
    window.location.reload(); // Force a refresh to reset app state
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-text-primary p-4">
      <Frown className="w-24 h-24 text-primary mb-6" />
      <h1 className="text-4xl font-bold text-text-primary mb-2">Oops! Something went wrong.</h1>
      <p className="text-lg text-text-secondary mb-6 text-center max-w-md">
        We're sorry, but it looks like the application has encountered an unexpected error. Please try returning to the home page.
      </p>
      
      {process.env.NODE_ENV === 'development' && error && (
        <div className="bg-base-200 p-4 rounded-lg text-left w-full max-w-2xl mb-6 overflow-auto">
          <h2 className="text-lg font-semibold mb-2">Error Details (Development Mode)</h2>
          <pre className="text-sm whitespace-pre-wrap">
            <code>{error.message || JSON.stringify(error, null, 2)}</code>
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </div>
      )}

      <button
        onClick={handleGoHome}
        className="px-6 py-3 bg-primary text-primary-content font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-opacity-50 transition-colors duration-200"
      >
        Go to Home Page
      </button>
    </div>
  );
};

export default ErrorPage;
