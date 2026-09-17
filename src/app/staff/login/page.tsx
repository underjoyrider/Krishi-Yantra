'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ArrowRight, Shield, Tractor } from 'lucide-react';
import { setStoredUser } from '@/lib/auth';

export default function StaffLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safe JSON response parser
  const parseJsonResponse = async (res: Response) => {
    try {
      const text = await res.text();
      return text ? JSON.parse(text) : {};
    } catch {
      return {};
    }
  };

  const handleDemoStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'STAFF' }),
      });
      const data = await parseJsonResponse(res);
      if (res.ok && data.success && data.user) {
        setStoredUser(data.user);
        router.push('/staff/dashboard');
      } else {
        setError(data.message || data.error || 'Authentication failed. Please try again.');
      }
    } catch (e: any) {
      setError(e.message || 'Error communicating with authentication service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#143d22] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-emerald-900/20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
          <Building2 className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-gray-900">KrishiYantra Staff Desk</h2>
          <p className="text-xs text-gray-500 mt-1">
            Access live queue counters, schedule allocations, and mandi operational dashboard.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-bold">
            {error}
          </div>
        )}

        <button
          onClick={handleDemoStaff}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-extrabold text-sm shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2"
        >
          <span>Authenticate as Shivapur Staff Operator</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => router.push('/login')}
            className="text-xs font-bold text-gray-500 hover:text-gray-800"
          >
            Switch to Farmer Portal
          </button>
        </div>
      </div>
    </div>
  );
}
