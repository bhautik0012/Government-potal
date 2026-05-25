import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Page error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-center" style={{ background: "#f8fafc", padding: "2rem" }}>
          <div className="card" style={{ maxWidth: 480, textAlign: "center" }}>
            <h2 style={{ color: "#1e3a8a" }}>Something went wrong</h2>
            <p style={{ color: "#64748b" }}>This page could not load. Try refreshing or go home.</p>
            <a href="/" className="btn btn-primary" style={{ marginTop: "1rem" }}>
              Back to Home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
