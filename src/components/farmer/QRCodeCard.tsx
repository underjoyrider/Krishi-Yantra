'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export const QRCodeCard: React.FC<{ token: string }> = ({ token }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && token) {
      QRCode.toCanvas(
        canvasRef.current,
        `KRISHIYANTRA-TOKEN:${token}`,
        {
          width: 140,
          margin: 1,
          color: {
            dark: '#166534',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-gray-200 shadow-sm w-fit mx-auto">
      <canvas ref={canvasRef} className="rounded-lg" />
      <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wider">
        Scan at Counter Gate
      </span>
    </div>
  );
};
