'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-slate-200/90 shadow-soft my-3">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 mb-3 shadow-2xs">
        <Icon className="w-7 h-7 stroke-[1.8]" />
      </div>

      <h3 className="text-base font-black text-slate-900 leading-tight">
        {title}
      </h3>

      {description && (
        <p className="text-xs text-slate-500 max-w-xs mt-1.5 mb-4 leading-relaxed font-medium">
          {description}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap justify-center">
        {actionText && actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl bg-[#065F46] text-white hover:bg-emerald-900 transition-colors shadow-xs"
          >
            {actionText}
          </Link>
        )}

        {actionText && onAction && !actionHref && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl bg-[#065F46] text-white hover:bg-emerald-900 transition-colors shadow-xs"
          >
            {actionText}
          </button>
        )}

        {secondaryActionText && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="inline-flex items-center px-3.5 py-2 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
};
