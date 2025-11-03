import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unexpected error' };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem' }}>
          <h2>Something went wrong.</h2>
          <p style={{ color: '#6b7280' }}>{this.state.message}</p>
          <p>Please refresh the page. If the issue persists, share a screenshot of the browser console.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
