import { User } from '@/types';

export const DEMO_FARMER_PHONE = '9876543210';
export const DEMO_STAFF_PHONE = '9876543211';

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('krishiyantra_user') || localStorage.getItem('kisanqueue_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('krishiyantra_user', JSON.stringify(user));
  localStorage.setItem('kisanqueue_user', JSON.stringify(user));
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('krishiyantra_user');
  localStorage.removeItem('kisanqueue_user');
}

/**
 * Returns the signed-in farmer from localStorage, or — if nobody is
 * signed in — transparently signs in the demo farmer account (the same
 * one the "Use demo farmer account" button uses) and persists it.
 *
 * IMPORTANT: several screens previously fell back to a hardcoded literal
 * like `{ id: 'demo-ravi' }` when no user was stored. That ID was never a
 * real database row, so any write that used it (booking.create, support
 * ticket creation, etc.) failed with a foreign key constraint error. This
 * helper guarantees callers always get a real, valid user ID that exists
 * in the database before they try to write anything with it.
 */
export async function ensureFarmerUser(): Promise<User> {
  const stored = getStoredUser();
  if (stored?.id && !stored.id.startsWith('demo-')) {
    return stored;
  }

  try {
    const response = await fetch('/api/auth/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'FARMER' }),
    });
    const text = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
    if (!response.ok || !data.success || !data.user) {
      throw new Error(data.message || 'Unable to sign you in automatically. Please log in again.');
    }
    setStoredUser(data.user);
    return data.user;
  } catch (err: any) {
    console.error('ensureFarmerUser error:', err);
    throw new Error(err.message || 'Unable to verify farmer account. Please log in again.');
  }
}

