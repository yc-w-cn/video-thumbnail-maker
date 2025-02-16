import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorFallback error={this.state.error} />
        </Suspense>
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4 text-center">
      <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
        {t('error.title')}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        {t('error.description')}
      </p>
      <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto max-w-full">
        {error.message}
      </pre>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {t('error.retry')}
      </button>
    </div>
  );
};

export default ErrorBoundary;
