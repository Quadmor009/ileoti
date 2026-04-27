import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center lato">
          <p className="text-4xl">😕</p>
          <h1 className="text-xl font-bold text-black">Something went wrong</h1>
          <p className="text-[#585858] max-w-sm">
            An unexpected error occurred. Please refresh the page to continue.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 rounded-full bg-[#80011D] px-8 py-3 text-sm font-semibold text-white hover:bg-[#66001D]"
          >
            Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
