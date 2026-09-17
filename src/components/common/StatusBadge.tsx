'use client';

import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = status?.toUpperCase() || 'UNKNOWN';

  let bg = 'bg-gray-100 text-gray-800 border-gray-300';
  let dot = 'bg-gray-500';
  let label = status;

  if (norm === 'OPEN') {
    bg = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    dot = 'bg-emerald-600 animate-pulse';
    label = 'OPEN';
  } else if (norm === 'BUSY') {
    bg = 'bg-amber-100 text-amber-900 border-amber-300';
    dot = 'bg-amber-600';
    label = 'BUSY';
  } else if (norm === 'PAUSED') {
    bg = 'bg-orange-100 text-orange-900 border-orange-300';
    dot = 'bg-orange-500';
    label = 'PAUSED';
  } else if (norm === 'CLOSED') {
    bg = 'bg-red-100 text-red-900 border-red-300';
    dot = 'bg-red-600';
    label = 'CLOSED';
  } else if (norm === 'WAITING' || norm === 'BOOKED' || norm === 'CHECKED_IN') {
    bg = 'bg-blue-100 text-blue-900 border-blue-300';
    dot = 'bg-blue-600';
    label = 'WAITING';
  } else if (norm === 'PROCESSING') {
    bg = 'bg-purple-100 text-purple-900 border-purple-400';
    dot = 'bg-purple-600 animate-ping';
    label = 'PROCESSING';
  } else if (norm === 'COMPLETED') {
    bg = 'bg-green-100 text-green-900 border-green-300';
    dot = 'bg-green-600';
    label = 'COMPLETED';
  } else if (norm === 'FULL') {
    bg = 'bg-red-50 text-red-700 border-red-200';
    dot = 'bg-red-500';
    label = 'FULL';
  } else if (norm === 'AVAILABLE') {
    bg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dot = 'bg-emerald-500';
    label = 'AVAILABLE';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2 font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold tracking-wide ${sizeClasses} ${bg}`}
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      <span>{label}</span>
    </span>
  );
};
