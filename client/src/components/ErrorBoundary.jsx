import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-shell flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="error-boundary-title">Something went wrong</h1>
          <p className="text-ink-muted">This page hit an unexpected error.</p>
          <button onClick={this.handleReset} className="btn-primary">Back to Dashboard</button>
        </div>
      );
    }
    return this.props.children;
  }
}