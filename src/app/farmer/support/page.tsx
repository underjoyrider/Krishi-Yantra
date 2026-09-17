'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Phone,
  MessageCircle,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Send,
  CheckCircle2,
  Clock,
  Inbox,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { FAQS_DATA, FAQItem } from '@/lib/faqs-data';
import { FAQAccordion } from '@/components/farmer/FAQAccordion';
import { SupportTicketModal } from '@/components/farmer/SupportTicketModal';
import { TicketDetailsModal } from '@/components/farmer/TicketDetailsModal';
import { ensureFarmerUser } from '@/lib/auth';

export default function FarmerHelpCenterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Modals state
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketModalCategory, setTicketModalCategory] = useState('Booking problem');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    // Resolve a real, valid farmer account before creating/fetching
    // tickets under it — never a fake placeholder ID (that caused
    // foreign key errors when actually creating a ticket).
    ensureFarmerUser()
      .then((resolvedUser) => {
        setUser(resolvedUser);
        fetchTickets(resolvedUser.id);
      })
      .catch((err) => console.error('Unable to resolve farmer account:', err));
  }, []);

  const fetchTickets = async (userId?: string) => {
    if (!userId) return;
    try {
      setLoadingTickets(true);
      const res = await fetch(`/api/support/tickets?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTickets(false);
    }
  };

  const categories = [
    { id: 'ALL', label: 'All Questions' },
    { id: 'booking', label: '📅 Booking' },
    { id: 'token', label: '🎟️ Token' },
    { id: 'queue', label: '⏱️ Queue & Waiting Time' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'centers', label: '🏢 Procurement Centers' },
    { id: 'account', label: '👤 Account' },
  ];

  // Client-side search & category filtering
  const filteredFaqs = FAQS_DATA.filter((faq) => {
    const matchCat = selectedCategory === 'ALL' || faq.category === selectedCategory;
    const qLower = query.toLowerCase();
    const matchQuery =
      faq.question.toLowerCase().includes(qLower) ||
      faq.answer.toLowerCase().includes(qLower) ||
      faq.categoryLabel.toLowerCase().includes(qLower);
    return matchCat && matchQuery;
  });

  const handleOpenReport = (cat?: string) => {
    setTicketModalCategory(cat || 'Booking problem');
    setTicketModalOpen(true);
  };

  const handleCancelActiveBooking = async () => {
    if (confirm('Are you sure you want to cancel your active booking B-104?')) {
      alert('Your booking cancellation request was processed. You can now choose another slot.');
      router.push('/farmer/centers');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/farmer/profile')}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
            Farmer Support Desk
          </span>
          <h2 className="text-xl font-black text-gray-900 leading-tight">
            {t.helpSupport}
          </h2>
          <p className="text-xs text-gray-500">"How can we help you?"</p>
        </div>
      </div>

      {/* Search Field */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchQuestion || 'e.g. How do I cancel my booking?'}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-2xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-700 shadow-sm"
        />
      </div>

      {/* 6 Quick Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all border ${
              selectedCategory === c.id
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-900">{t.faqTitle}</h3>
          <span className="text-xs text-gray-500 font-semibold">
            {filteredFaqs.length} answers
          </span>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">{t.noFaqFound}</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                {t.tryDifferentSearch}
              </p>
            </div>
            <button
              onClick={() => handleOpenReport('General Question')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Contact Support
            </button>
          </div>
        ) : (
          <FAQAccordion
            faqs={filteredFaqs}
            onOpenReportModal={handleOpenReport}
            onCancelBooking={handleCancelActiveBooking}
            activeBookingId="B-104"
          />
        )}
      </div>

      {/* Still Need Help? Section */}
      <div id="contact" className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-black text-gray-900">{t.stillNeedHelp}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{t.talkToSupport}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Option 1: Call Support */}
          <a
            href="tel:18001801551"
            className="p-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200 transition-all block group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-xs font-black text-gray-900">{t.callSupport}</div>
            <div className="text-[11px] text-emerald-800 font-bold mt-0.5">
              1800-180-1551
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              Toll-free Mandi helpline (08:00 AM - 08:00 PM)
            </div>
          </a>

          {/* Option 2: Message Support */}
          <button
            type="button"
            onClick={() => handleOpenReport('General enquiry')}
            className="p-3.5 rounded-2xl bg-blue-50/60 hover:bg-blue-100/70 border border-blue-200 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="text-xs font-black text-gray-900">{t.messageSupport}</div>
            <div className="text-[10px] text-gray-600 mt-1">
              {t.sendQuestion} directly to the desk
            </div>
          </button>

          {/* Option 3: Report a Problem */}
          <button
            type="button"
            onClick={() => handleOpenReport('Booking problem')}
            className="p-3.5 rounded-2xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="text-xs font-black text-gray-900">{t.reportProblem}</div>
            <div className="text-[10px] text-gray-600 mt-1">
              Report slot errors or queue discrepancy
            </div>
          </button>
        </div>
      </div>

      {/* My Support Requests Section */}
      <div id="tickets" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-900">{t.mySupportRequests}</h3>
          <button
            onClick={() => fetchTickets(user?.id)}
            title="Refresh tickets"
            className="p-1.5 text-gray-500 hover:text-emerald-800"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-3xl border border-gray-200 text-xs text-gray-500">
            {t.noSupportRequests}
          </div>
        ) : (
          <div className="space-y-2.5">
            {tickets.map((tk) => {
              const isInProgress = tk.status === 'IN_PROGRESS';
              const isResolved = tk.status === 'RESOLVED';

              return (
                <button
                  key={tk.id}
                  type="button"
                  onClick={() => setSelectedTicket(tk)}
                  className="w-full p-4 rounded-2xl bg-white border border-gray-200 hover:border-emerald-300 shadow-xs text-left transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900 font-mono text-sm">
                        {tk.ticketNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isInProgress
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : isResolved
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}
                      >
                        {isInProgress ? '🟡 In Progress' : isResolved ? '🟢 Resolved' : 'Submitted'}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-gray-700">
                      {tk.category}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate max-w-xs">
                      {tk.description}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Creation Modal */}
      <SupportTicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        defaultCategory={ticketModalCategory}
        user={user}
        onTicketCreated={() => fetchTickets(user?.id)}
      />

      {/* Ticket Details / Thread Modal */}
      <TicketDetailsModal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
        onMessageSent={() => fetchTickets(user?.id)}
      />
    </div>
  );
}
