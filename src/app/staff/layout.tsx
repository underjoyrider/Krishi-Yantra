'use client';

import React from 'react';
import { StaffSidebar } from '@/components/staff/StaffSidebar';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F6F2] flex">
      {/* Desktop & Tablet Sidebar */}
      <div className="hidden md:block shrink-0">
        <StaffSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
