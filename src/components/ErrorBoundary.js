import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Keep logging lightweight but visible during debugging.
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ padding: '1rem' }}>
          Something went wrong while rendering this page.
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
