'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ArrowRight, HelpCircle } from 'lucide-react';
import { FAQItem } from '@/lib/faqs-data';

interface FAQAccordionProps {
  faqs: FAQItem[];
  onOpenReportModal?: (category?: string) => void;
  onCancelBooking?: () => void;
  activeBookingId?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  faqs,
  onOpenReportModal,
  onCancelBooking,
  activeBookingId,
}) => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    q1: true, // first question expanded by default
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-2.5">
      {faqs.map((faq) => {
        const isOpen = !!openIds[faq.id];

        return (
          <div
            key={faq.id}
            className={`rounded-2xl border transition-all overflow-hidden ${
              isOpen
                ? 'bg-white border-emerald-300 shadow-sm'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(faq.id)}
              className="w-full py-3.5 px-4 text-left flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                  ?
                </span>
                <span className="text-sm font-bold text-gray-900 leading-snug">
                  {faq.question}
                </span>
              </div>
              <div className="text-gray-400 shrink-0">
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-emerald-800" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 animate-fadeIn">
                <p>{faq.answer}</p>

                {/* Contextual Action Buttons */}
                {faq.actionText && (
                  <div className="mt-3 pt-2">
                    {faq.actionType === 'cancelBooking' ? (
                      activeBookingId ? (
                        <button
                          type="button"
                          onClick={onCancelBooking}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors"
                        >
                          <span>{faq.actionText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-semibold italic">
                          (No active cancellable booking found)
                        </span>
                      )
                    ) : faq.actionType === 'contactSupport' ? (
                      <button
                        type="button"
                        onClick={() => onOpenReportModal && onOpenReportModal(faq.categoryLabel)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <span>{faq.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <Link
                        href={faq.actionHref || '/farmer/centers'}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition-colors"
                      >
                        <span>{faq.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-800" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
