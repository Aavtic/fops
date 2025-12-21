export default function LoadingPage({message}: {message: string}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      {/* Animated Spinner */}
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      
      {/* Text Feedback */}
      <h2 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-200 animate-pulse">
        {message}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Please wait a moment.
      </p>
    </div>
  );
};
