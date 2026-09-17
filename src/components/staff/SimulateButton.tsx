'use client';

import React, { useState } from 'react';
import { PlayCircle, Check, Loader2 } from 'lucide-react';

export const SimulateButton: React.FC<{ onSimulated?: () => void }> = ({ onSimulated }) => {
  const [loading, setLoading] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const handleSimulate = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/staff/queue/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ centerCode: 'SHIV' }),
      });
      const data = await res.json();
      if (data.success) {
        setLastMessage(data.message);
        setTimeout(() => setLastMessage(null), 4000);
        if (onSimulated) onSimulated();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSimulate}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <PlayCircle className="w-4 h-4 text-white" />
        )}
        <span>⚡ Simulate Next Farmer</span>
      </button>

      {lastMessage && (
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 animate-fadeIn">
          {lastMessage}
        </span>
      )}
    </div>
  );
};
