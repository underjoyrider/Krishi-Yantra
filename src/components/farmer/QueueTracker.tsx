'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Users,
  ArrowRight,
  BellRing,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Receipt,
  Download,
  Building2,
  CreditCard,
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { formatWaitTime } from '@/lib/eta';

export interface QueueTrackerProps {
  tokenNumber: string;
  queuePosition: number;
  estimatedWait: number;
  currentlyServingToken: string;
  status: string;
  movementHistory?: number[];
  centerName?: string;
  slotTime?: string;
}

export const QueueTracker: React.FC<QueueTrackerProps> = ({
  tokenNumber = 'B-104',
  queuePosition = 8,
  estimatedWait = 10,
  currentlyServingToken = 'B-096',
  status = 'WAITING',
  movementHistory = [14, 11, 8],
  centerName = 'Shivapur Procurement Center',
  slotTime = '10:00 AM – 11:00 AM',
}) => {
  const { t } = useLanguage();
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [activeStageOverride, setActiveStageOverride] = useState<string | null>(null);

  // Allow testing milestone transitions if desired
  const currentEffectiveStatus = activeStageOverride || status;

  // Extract token numbers to simulate queue sequence between serving and user
  const parseTokenNum = (token: string) => {
    const num = parseInt(token.replace(/\D/g, ''), 10);
    return isNaN(num) ? 96 : num;
  };

  const servingNum = parseTokenNum(currentlyServingToken);
  const userNum = parseTokenNum(tokenNumber);
  const peopleAhead = Math.max(0, queuePosition);
  const farmersServedCount = Math.max(0, userNum - servingNum);

  // Generate intermediate tokens for "Next in Queue"
  const intermediateTokens: string[] = [];
  for (let i = 1; i <= Math.min(3, Math.max(1, userNum - servingNum - 1)); i++) {
    const nextNum = servingNum + i;
    if (nextNum < userNum) {
      intermediateTokens.push(`B-${nextNum.toString().padStart(3, '0')}`);
    }
  }
  if (intermediateTokens.length === 0 && userNum > servingNum) {
    intermediateTokens.push(`B-${(servingNum + 1).toString().padStart(3, '0')}`);
  }

  // Determine which milestone stage is active (0 to 7)
  // Stages:
  // 0: Booking Confirmed
  // 1: Yard Check-in
  // 2: Waiting in Queue
  // 3: Weighing
  // 4: Quality Check
  // 5: Procurement Approved
  // 6: Payment Processing
  // 7: Payment Completed
  const getActiveStageIndex = (st: string) => {
    switch (st) {
      case 'BOOKED':
        return 0;
      case 'CHECKED_IN':
        return 1;
      case 'WAITING':
        return 2;
      case 'WEIGHING':
        return 3;
      case 'QUALITY_CHECK':
        return 4;
      case 'APPROVED':
        return 5;
      case 'PROCESSING':
      case 'PAYMENT_PROCESSING':
        return 6;
      case 'COMPLETED':
      case 'PAYMENT_COMPLETED':
        return 7;
      default:
        return 2;
    }
  };

  const activeStageIdx = getActiveStageIndex(currentEffectiveStatus);
  const isCompleted = activeStageIdx >= 7;
  const isProcessing = activeStageIdx >= 3 && activeStageIdx < 7;
  const isApproaching = queuePosition <= 3 && queuePosition > 1 && !isProcessing && !isCompleted;
  const isNext = queuePosition === 1 && !isProcessing && !isCompleted;

  const milestones = [
    {
      id: 'booking_confirmed',
      label: 'Booking Confirmed',
      desc: 'Slot allocated and verified.',
    },
    {
      id: 'yard_checkin',
      label: 'Yard Check-in',
      desc: 'Truck entered the assigned APMC gate.',
    },
    {
      id: 'waiting_queue',
      label: 'Waiting in Queue',
      desc: 'Waiting for the procurement process.',
    },
    {
      id: 'weighing',
      label: 'Weighing',
      desc: 'Produce is being weighed at Weighbridge #1.',
    },
    {
      id: 'quality_check',
      label: 'Quality Check',
      desc: 'Produce quality is being inspected.',
    },
    {
      id: 'procurement_approved',
      label: 'Procurement Approved',
      desc: 'The procurement has been approved by Mandi Officer.',
    },
    {
      id: 'payment_processing',
      label: 'Payment Processing',
      desc: 'Payment is being initiated via Direct Benefit Transfer.',
    },
    {
      id: 'payment_completed',
      label: 'Payment Completed',
      desc: 'Payment has been successfully transferred to registered bank account.',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Simulation / Stage Switcher for Demonstration */}
      <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
        <span>Current Journey State:</span>
        <select
          value={activeStageOverride || (isCompleted ? 'COMPLETED' : status)}
          onChange={(e) => setActiveStageOverride(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-emerald-900 text-xs shadow-2xs focus:outline-none cursor-pointer"
        >
          <option value="WAITING">Stage 3: Waiting in Queue</option>
          <option value="WEIGHING">Stage 4: Weighing</option>
          <option value="QUALITY_CHECK">Stage 5: Quality Check</option>
          <option value="APPROVED">Stage 6: Procurement Approved</option>
          <option value="PAYMENT_PROCESSING">Stage 7: Payment Processing</option>
          <option value="COMPLETED">Stage 8: Payment Completed (Full Success)</option>
        </select>
      </div>

      {/* Dynamic Status Alert Banner */}
      {isCompleted ? (
        <div className="p-4 bg-[#065F46] text-white rounded-3xl shadow-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Procurement Successful</h4>
            <p className="text-xs text-emerald-100 mt-0.5">
              Receipt generated and verified by the center mandi officer.
            </p>
          </div>
        </div>
      ) : activeStageIdx === 6 ? (
        <div className="p-4 bg-emerald-800 text-white rounded-3xl shadow-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Payment Processing via DBT</h4>
            <p className="text-xs text-emerald-100 mt-0.5">
              Approved amount is being initiated to your registered bank account.
            </p>
          </div>
        </div>
      ) : activeStageIdx >= 3 ? (
        <div className="p-4 bg-purple-800 text-white rounded-3xl shadow-card flex items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">
              {activeStageIdx === 3 ? 'Now Weighing Produce' : activeStageIdx === 4 ? 'Quality Check in Progress' : 'Procurement Approved'}
            </h4>
            <p className="text-xs text-purple-100 mt-0.5">
              Active processing at Mandi Counter #1. Please remain near the weighbridge.
            </p>
          </div>
        </div>
      ) : isNext ? (
        <div className="p-4 bg-emerald-600 text-white rounded-3xl shadow-card flex items-center gap-3 animate-bounce">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <BellRing className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Please Proceed to Counter!</h4>
            <p className="text-xs text-emerald-100 mt-0.5">
              You are next! Please have your token slip ready.
            </p>
          </div>
        </div>
      ) : isApproaching ? (
        <div className="p-4 bg-amber-600 text-white rounded-3xl shadow-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <BellRing className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Your Turn is Approaching</h4>
            <p className="text-xs text-amber-100 mt-0.5">
              Only {peopleAhead} people ahead of you in queue.
            </p>
          </div>
        </div>
      ) : null}

      {/* Main Token & Status Card */}
      <div className="bg-[#065F46] text-white rounded-3xl p-5 shadow-card relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Header with Live Status */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-700/60 mb-3">
          <div>
            <span className="text-[10px] font-extrabold text-emerald-300 tracking-wider uppercase">
              {centerName}
            </span>
            <div className="text-xs text-emerald-200 mt-0.5">Today • {slotTime}</div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-bold text-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>Live Queue</span>
          </div>
        </div>

        {/* Big Token Display */}
        <div className="text-center my-2">
          <span className="text-[11px] font-bold text-emerald-300/90 tracking-widest uppercase">
            YOUR TOKEN
          </span>
          <div className="text-5xl font-black text-white tracking-wider my-1 drop-shadow-xs">
            {tokenNumber}
          </div>
        </div>

        {/* 3 Metric Columns */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-700/60 text-center">
          <div className="bg-emerald-900/40 rounded-2xl p-2.5 border border-emerald-700/40">
            <div className="text-[10px] uppercase font-bold text-emerald-300/90">
              Your Position
            </div>
            <div className="text-2xl font-black text-amber-300 mt-0.5">
              {isCompleted ? '✓' : isProcessing ? 'NOW' : `#${queuePosition}`}
            </div>
          </div>

          <div className="bg-emerald-900/40 rounded-2xl p-2.5 border border-emerald-700/40">
            <div className="text-[10px] uppercase font-bold text-emerald-300/90">
              Estimated Wait
            </div>
            <div className="text-2xl font-black text-white mt-0.5">
              {isCompleted ? '0m' : `~${formatWaitTime(estimatedWait)}`}
            </div>
          </div>

          <div className="bg-emerald-900/40 rounded-2xl p-2.5 border border-emerald-700/40">
            <div className="text-[10px] uppercase font-bold text-emerald-300/90">
              Serving
            </div>
            <div className="text-2xl font-black text-emerald-200 mt-0.5 truncate">
              {currentlyServingToken || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: IMPROVED QUEUE PROGRESS VISUALIZATION */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Queue Progress</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              Live progression flow toward counter
            </p>
          </div>
          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            {peopleAhead} people ahead of you
          </span>
        </div>

        {/* Clear Step-by-Step Flow: Current Serving ↓ Next in Queue ↓ Your Token */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-3">
          {/* Current Serving Row */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Current Serving
                </div>
                <div className="text-base font-black text-slate-900">
                  {currentlyServingToken}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              At Counter
            </span>
          </div>

          {/* Down Arrow Indicator */}
          <div className="flex items-center justify-center text-slate-400 font-bold text-xs">
            <span>↓</span>
          </div>

          {/* Next in Queue Tokens */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
              Next in Queue
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {intermediateTokens.map((tkn) => (
                <span
                  key={tkn}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
                >
                  {tkn}
                </span>
              ))}
              {peopleAhead > 3 && (
                <span className="text-xs text-slate-400 font-medium">
                  + {peopleAhead - intermediateTokens.length} more
                </span>
              )}
            </div>
          </div>

          {/* Down Arrow Indicator */}
          <div className="flex items-center justify-center text-slate-400 font-bold text-xs">
            <span>↓</span>
          </div>

          {/* Your Token - Highly Prominent */}
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-emerald-100/60 p-3.5 rounded-xl border-2 border-emerald-700 shadow-xs">
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                Your Token
              </div>
              <div className="text-2xl font-black text-[#065F46] tracking-wide">
                {tokenNumber}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#065F46] text-white text-[11px] font-black shadow-xs">
                Your Position #{queuePosition}
              </span>
              <div className="text-[10px] text-emerald-800 font-semibold mt-1">
                ~{formatWaitTime(estimatedWait)} wait
              </div>
            </div>
          </div>
        </div>

        {/* Visual Progress Line Timeline */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1.5 px-1">
            <span>Position Progression</span>
            <span className="text-emerald-800 font-extrabold">
              {farmersServedCount > 0
                ? `${farmersServedCount} farmers served since you joined`
                : 'Queue actively moving'}
            </span>
          </div>

          {/* Visual Progress Bar with milestones */}
          <div className="relative pt-3 pb-1">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(15, 100 - (peopleAhead / 12) * 100))}%`,
                }}
              />
            </div>

            {/* Position Markers */}
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2 px-0.5">
              <span>#0 (Served)</span>
              <span>#2</span>
              <span>#4</span>
              <span>#6</span>
              <span className="text-emerald-800 font-extrabold flex items-center gap-0.5">
                <span>#{queuePosition}</span>
                <span className="text-[9px] text-emerald-700">(You)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 & 3: IMPROVED PROCUREMENT MILESTONE STATES WITH PAYMENT */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Procurement Milestones
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              8-stage complete procurement journey
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            Stage {Math.min(8, activeStageIdx + 1)} of 8
          </span>
        </div>

        <div className="space-y-4 relative pl-1">
          {milestones.map((m, idx) => {
            const isDone = idx < activeStageIdx;
            const isActive = idx === activeStageIdx;
            const isUpcoming = idx > activeStageIdx;

            return (
              <div key={m.id} className="flex items-start gap-3 relative">
                {/* Subtle Connecting vertical line */}
                {idx < milestones.length - 1 && (
                  <div
                    className={`absolute left-[13px] top-7 bottom-0 w-0.5 transition-colors ${
                      isDone ? 'bg-emerald-600' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Circle Icon: 3 distinct visual states */}
                {isDone ? (
                  // State 1: COMPLETED (Green circle with checkmark)
                  <div className="w-7 h-7 rounded-full bg-[#065F46] text-white flex items-center justify-center shrink-0 z-10 shadow-2xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : isActive ? (
                  // State 2: CURRENTLY ACTIVE (Highlighted green/amber with pulsing ring)
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white ring-4 ring-emerald-100 flex items-center justify-center shrink-0 z-10 font-black text-xs animate-pulse">
                    <span>●</span>
                  </div>
                ) : (
                  // State 3: UPCOMING (Muted grey / outlined circle)
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-400 flex items-center justify-center shrink-0 z-10 text-xs">
                    <span>○</span>
                  </div>
                )}

                {/* Milestone Details */}
                <div className="pt-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs font-bold transition-colors ${
                        isDone
                          ? 'text-slate-900'
                          : isActive
                          ? 'text-emerald-900 font-extrabold'
                          : 'text-slate-400'
                      }`}
                    >
                      {m.label}
                    </h4>

                    {isActive && (
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        In Progress
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[10px] font-semibold text-emerald-700">
                        Completed
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="text-[10px] text-slate-400">
                        Pending
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-[11px] mt-0.5 transition-colors ${
                      isDone
                        ? 'text-slate-500'
                        : isActive
                        ? 'text-emerald-800 font-medium'
                        : 'text-slate-400'
                    }`}
                  >
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 9 & 10: PROCUREMENT COMPLETION & PAYMENT STATUS EXPERIENCE */}
      {isCompleted && (
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-600 shadow-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-[#065F46]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest">
                Procurement Successful
              </span>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                Mandya APMC Official Receipt
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600">
            Your procurement has been completed successfully. Receipt generated and verified by center mandi officer.
          </p>

          {/* Produce & Grading Summary Grid */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Center</span>
              <div className="font-bold text-slate-900 truncate">{centerName}</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Token Number</span>
              <div className="font-bold text-emerald-800">{tokenNumber}</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Gross Produce</span>
              <div className="font-bold text-slate-900">2,500 kg (Paddy)</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Quality Grade</span>
              <div className="font-bold text-emerald-800">Grade A (11.4% moisture)</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Final Approved Net</span>
              <div className="font-black text-slate-900">2,485 kg</div>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">MSP Base Rate</span>
              <div className="font-bold text-slate-900">₹2,200 / quintal</div>
            </div>
          </div>

          {/* Payment Status Card */}
          <div className="p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900">
                PAYMENT STATUS
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold">
                ✓ Completed
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xs text-slate-600">Approved Amount:</span>
              <span className="text-2xl font-black text-[#065F46]">₹54,670</span>
            </div>

            <div className="text-xs space-y-1 pt-1 border-t border-emerald-200/70 text-slate-600">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <strong className="text-slate-900">Direct Benefit Transfer (DBT)</strong>
              </div>
              <div className="flex justify-between">
                <span>Transaction Status:</span>
                <strong className="text-emerald-800">Successful</strong>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <strong className="text-slate-900 font-mono text-[11px]">TXN-KQ-984729184</strong>
              </div>
              <div className="flex justify-between">
                <span>Credited Account:</span>
                <strong className="text-slate-900">State Bank of India (••4102)</strong>
              </div>
            </div>

            <p className="text-[10px] text-emerald-800 pt-1 italic">
              Payment has been credited to your registered Aadhaar-linked bank account.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowReceiptModal(true)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#065F46] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all text-center"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>View Receipt</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Procurement receipt downloaded to your device.')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-colors text-center"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Receipt</span>
            </button>
          </div>

          <Link
            href="/farmer/dashboard"
            className="block text-center text-xs font-bold text-emerald-800 hover:text-emerald-950 pt-1"
          >
            ← Back to Home
          </Link>
        </div>
      )}

      {/* Modal for View Receipt */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center pb-2 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                <Receipt className="w-5 h-5 text-[#065F46]" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                Government Procurement Receipt
              </h3>
              <p className="text-[11px] text-slate-500">
                Department of Agriculture & Mandi Board
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-mono font-bold">KQ-REC-2026-095</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Center:</span>
                <span className="font-bold">{centerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Farmer:</span>
                <span className="font-bold">Ravi Kumar (Token {tokenNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-bold">Sep 5, 2026 • 10:45 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Crop Type:</span>
                <span className="font-bold">Paddy / Rice</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gross Weight:</span>
                <span className="font-bold">2,500 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tare / Moisture Deduction:</span>
                <span className="font-bold">15 kg (Grade A)</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 font-extrabold text-slate-900">
                <span>Net Procured:</span>
                <span>2,485 kg</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 font-black text-[#065F46] text-sm">
                <span>Total DBT Payout:</span>
                <span>₹54,670</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400">
              Verified by Mandi Officer Signature • Gate 2 Weighbridge
            </div>

            <button
              type="button"
              onClick={() => setShowReceiptModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#065F46] text-white font-bold text-xs hover:bg-emerald-900 transition-colors shadow-xs"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
