import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { _prisma: PrismaClient };

// Use a Proxy to lazily instantiate PrismaClient only when it's actually accessed.
// This prevents Next.js from crashing on Vercel during build-time route collection
// when it imports API routes that import this file, because the SQLite database
// may not be available or fully initialized in the Vercel build environment.
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!globalForPrisma._prisma) {
      globalForPrisma._prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });
    }
    return (globalForPrisma._prisma as any)[prop];
  }
});

if (process.env.NODE_ENV !== 'production') {
  // Store the proxy in global so it persists across HMR, but the underlying
  // PrismaClient still won't be created until first use.
  (global as any).prisma = prisma;
}

export default prisma;
