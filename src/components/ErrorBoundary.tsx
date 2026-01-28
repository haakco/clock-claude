import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error boundary component that catches JavaScript errors in the component tree
 * and displays a kid-friendly error message instead of crashing the whole app.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200 p-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
            {/* Friendly clock face icon */}
            <div className="text-8xl mb-4">⏰</div>

            {/* Kid-friendly message */}
            <h1 className="text-2xl font-bold text-blue-600 mb-3">Oops! The clock took a break!</h1>

            <p className="text-gray-600 mb-6 text-lg">
              Something unexpected happened, but don&apos;t worry! Let&apos;s try again and get back
              to learning time!
            </p>

            {/* Retry button */}
            <button
              type="button"
              onClick={this.handleRetry}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Try Again!
            </button>

            {/* Refresh hint */}
            <p className="text-sm text-gray-400 mt-4">
              If that doesn&apos;t work, ask a grown-up to refresh the page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
