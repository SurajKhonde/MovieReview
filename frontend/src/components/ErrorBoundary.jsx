import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-white dark:bg-primary text-center px-4">
          <div className="space-y-4 max-w-md">
            <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
              Something went wrong 😢
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              An unexpected error occurred. Please try again later or contact support.
            </p>
            <a
              href="/"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Go back to Home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
