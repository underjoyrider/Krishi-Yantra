'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Please check your internet connection and try again.',
  onRetry,
  retryText = 'Try Again',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-white rounded-3xl border border-red-200 shadow-soft my-3">
      <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="text-sm font-black text-slate-900 leading-tight">
        {title}
      </h3>

      <p className="text-xs text-slate-500 max-w-xs mt-1 mb-3.5 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#065F46] text-white hover:bg-emerald-900 transition-all shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{retryText}</span>
        </button>
      )}
    </div>
  );
};
