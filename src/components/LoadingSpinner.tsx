import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = '加载中...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-16 h-16 border-4 border-apple-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;