'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Phone,
  MapPin,
  Wheat,
  Globe,
  Bell,
  LogOut,
  Edit3,
  Check,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  AlertCircle,
  FileText,
  Shield,
  ShieldCheck,
  CreditCard,
  Info,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { SupportCard } from '@/components/farmer/SupportCard';
import { SupportTicketModal } from '@/components/farmer/SupportTicketModal';
import { getStoredUser, clearStoredUser } from '@/lib/auth';

export default function FarmerProfilePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState('Booking problem');

  const [bookings, setBookings] = useState<any[]>([]);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);

  useEffect(() => {
    async function loadBookings(farmerId: string) {
      try {
        const res = await fetch(`/api/bookings/farmer/${farmerId}`);
        const data = await res.json();
        const list = data?.data?.allBookings || data?.allBookings || [];
        setBookings(list);
      } catch (e) {
        console.error(e);
      }
    }

    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      loadBookings(stored.id);
    } else {
      const defaultUser = {
        id: 'cmtmvps8e0000ovczqdhs6d17',
        name: 'Ravi Kumar',
        phone: '9876543210',
        farmerProfile: {
          village: 'Shivapur Taluk',
          cropType: 'Paddy / Rice',
          language: 'en',
        },
      };
      setUser(defaultUser);
      loadBookings(defaultUser.id);
    }
  }, []);

  const handleLogout = () => {
    clearStoredUser();
    router.push('/login');
  };

  const handleDeleteAccount = async () => {
    if (!user?.id || !window.confirm('Delete your farmer account permanently? This action cannot be undone.')) return;

    setDeletingAccount(true);
    try {
      const response = await fetch(`/api/farmers/${user.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setSavedMessage(data.message || 'Unable to delete your account.');
        return;
      }
      clearStoredUser();
      setAccountDeleted(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch {
      setSavedMessage('Unable to delete your account. Please try again.');
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleActionToast = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div>
        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
          {t.farmerAccount || 'Farmer Account'}
        </span>
        <h2 className="text-xl font-black text-gray-900">{t.profileTitle || 'Farmer Profile'}</h2>
      </div>

      {savedMessage && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-800" />
          <span>{savedMessage}</span>
        </div>
      )}

      {accountDeleted && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-800" />
          <span>Account Deleted Successfully</span>
        </div>
      )}

      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-800 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md ring-4 ring-emerald-50">
          {user?.name ? user.name[0] : 'R'}
        </div>
        <h3 className="text-lg font-black text-gray-900 mt-2">{user?.name || 'Ravi Kumar'}</h3>
        <p className="text-xs font-bold text-emerald-800">+91 {user?.phone || '98765 43210'}</p>
        <p className="text-xs font-bold text-slate-700">Customer ID: {user?.customerId || 'Not assigned'}</p>
        <p className="text-xs text-gray-500 mt-0.5">{user?.farmerProfile?.village || 'Shivapur'}</p>
      </div>

      {/* Identity Verification Card */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                {t.identityVerification || 'Identity Verification'}
              </h4>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
            <Check className="w-3 h-3 text-emerald-700" />
            <span>{t.verified || 'Verified'}</span>
          </span>
        </div>

        <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/70 space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-200/50">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              <span>Aadhaar</span>
            </span>
            <span className="font-extrabold text-slate-800 tracking-wider">
              XXXX XXXX {user?.aadhaarLast4 || '1234'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Mobile</span>
            </span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <span>+91 XXXXX {user?.phone ? user.phone.slice(-5) : '43210'}</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">✓ Verified</span>
            </span>
          </div>

        </div>

        <p className="text-[10px] text-slate-400">
          Authenticated via SIH Secure Identity Gateway • Masked for privacy
        </p>
      </div>

      {/* 2. Account Section */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.account || 'Account'}</h4>

        <div className="space-y-1 divide-y divide-gray-100 text-xs">
          <button
            type="button"
            onClick={() => handleActionToast('Profile details are synced with your registration.')}
            className="w-full py-2.5 flex items-center justify-between text-left hover:bg-gray-50/50 rounded-lg transition-colors px-1"
          >
            <span className="font-bold text-gray-800 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-gray-500" />
              <span>{t.editProfile || 'Edit Profile'}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <div className="py-2.5 flex items-center justify-between px-1">
            <span className="font-bold text-gray-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <span>{t.language || 'Language'}</span>
            </span>
            <LanguageSelector />
          </div>

          <button
            type="button"
            onClick={() => handleActionToast('SMS & push notifications enabled on your mobile.')}
            className="w-full py-2.5 flex items-center justify-between text-left hover:bg-gray-50/50 rounded-lg transition-colors px-1"
          >
            <span className="font-bold text-gray-800 flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-500" />
              <span>{t.notificationsTitle || 'Notifications'}</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-700">{t.enabled || 'Enabled'}</span>
          </button>
        </div>
      </div>

      {/* Booking History Section */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {t.bookingHistory || 'Booking History'}
          </h4>
          <span className="text-[11px] font-bold text-emerald-800">
            {bookings.length} Record{bookings.length !== 1 ? 's' : ''}
          </span>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-2.5 divide-y divide-gray-100">
            {bookings.map((b) => (
              <div key={b.id} className="pt-2.5 first:pt-0 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Token {b.tokenNumber}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        b.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : b.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Status: {b.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {b.center?.name || 'Shivapur Procurement Center'} • {b.bookingDate || 'Sep 5'}
                  </p>
                </div>
                <Link
                  href={`/farmer/booking/confirmation/${b.tokenNumber || b.id}`}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 py-1">
            No booking records yet.
          </p>
        )}
      </div>

      {/* 3. 💬 Help & Support Prominent Card */}
      <SupportCard />

      {/* 4. Support Section */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">{t.supportTitle || 'Support'}</h4>

        <div className="space-y-1 divide-y divide-gray-100 text-xs">
          <Link
            href="/farmer/support#tickets"
            className="w-full py-2.5 flex items-center justify-between text-left hover:bg-gray-50/50 rounded-lg transition-colors px-1"
          >
            <span className="font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>{t.mySupportRequests || 'My Support Requests'}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            href="/farmer/support#contact"
            className="w-full py-2.5 flex items-center justify-between text-left hover:bg-gray-50/50 rounded-lg transition-colors px-1"
          >
            <span className="font-bold text-gray-800 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-700" />
              <span>{t.contactSupport || 'Contact Support'}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <button
            type="button"
            onClick={() => {
              setReportCategory('Booking problem');
              setReportModalOpen(true);
            }}
            className="w-full py-2.5 flex items-center justify-between text-left hover:bg-gray-50/50 rounded-lg transition-colors px-1"
          >
            <span className="font-bold text-gray-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{t.reportProblem || 'Report a Problem'}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 5. About KrishiYantra */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">About KrishiYantra</h4>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-gray-600 py-1">
            <span className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-gray-400" />
              <span>Privacy Policy</span>
            </span>
            <span className="text-[11px] text-gray-400">Government APMC Standards</span>
          </div>

          <div className="flex items-center justify-between text-gray-600 py-1">
            <span className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              <span>Terms of Service</span>
            </span>
            <span className="text-[11px] text-gray-400">Procurement Guidelines</span>
          </div>

          <div className="flex items-center justify-between text-gray-600 py-1 border-t border-gray-100 pt-2">
            <span className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-gray-400" />
              <span>App Version</span>
            </span>
            <span className="font-bold text-emerald-800">1.0.0 (Hackathon Release)</span>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-2 border border-red-200 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>{t.signOut || 'Sign Out'}</span>
      </button>

      <button
        type="button"
        onClick={handleDeleteAccount}
        disabled={deletingAccount}
        className="w-full py-3.5 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-red-800 transition-colors disabled:opacity-60"
      >
        <Trash2 className="w-4 h-4" />
        <span>{deletingAccount ? 'Deleting Account...' : (t.deleteAccount || 'Delete Account')}</span>
      </button>

      {/* Support Ticket Creation Modal */}
      <SupportTicketModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        defaultCategory={reportCategory}
        user={user}
        onTicketCreated={() => handleActionToast('Support ticket logged successfully.')}
      />
    </div>
  );
}
