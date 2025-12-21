export function ErrorPage({ message, onRetry }: {message: string, onRetry: any}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        
        {/* Error Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
          <svg className="h-8 w-8 text-red-600 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Text Content */}
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Unable to load data
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {message || "Something went wrong while fetching the information. Please check your connection and try again."}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
