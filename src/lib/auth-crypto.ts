import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

/**
 * Hashes a plaintext password using Node.js native scrypt with a random 16-byte salt.
 * Returns a string formatted as "salt:hash".
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored "salt:hash" string.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (!storedHash || !storedHash.includes(':')) return false;
    const [salt, key] = storedHash.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = scryptSync(password, salt, 64);
    return timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Hashes an Aadhaar number deterministically for database indexing and secure lookup.
 */
export function hashAadhaar(aadhaar: string): string {
  const clean = (aadhaar || '').replace(/\D/g, '');
  return scryptSync(clean, 'krishiyantra_aadhaar_salt_2026', 32).toString('hex');
}
