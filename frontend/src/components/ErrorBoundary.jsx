import React from 'react';
import ErrorPage from './common/ErrorPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorId: Date.now() + Math.random()
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    this.setState({ errorInfo });

    // TODO: Send to error reporting service in production
    // errorReportingService.captureException(error, {
    //   extra: errorInfo,
    //   tags: { boundary: 'global' }
    // });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          type="general"
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
