import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, hashAadhaar } from '@/lib/auth-crypto';

export const dynamic = 'force-dynamic';


export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { phone = '', aadhaar = '', password = '', role = 'FARMER', name } = body;

    const rawIdentifier = aadhaar || phone;
    const cleanIdentifier = String(rawIdentifier || '').replace(/\D/g, '');

    if (!cleanIdentifier) {
      return NextResponse.json({ success: false, message: 'Phone or Aadhaar number is required' }, { status: 400 });
    }

    const aHash = cleanIdentifier.length === 12 ? hashAadhaar(cleanIdentifier) : (aadhaar ? hashAadhaar(String(aadhaar).replace(/\D/g, '')) : null);

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: cleanIdentifier },
          { phoneNumber: cleanIdentifier },
          { customerId: cleanIdentifier },
          ...(aHash ? [{ aadhaarHash: aHash }] : []),
        ],
      },
      include: { farmerProfile: true },
    });

    if (user && password && user.passwordHash) {
      const isValid = verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ success: false, message: 'Invalid credentials. Please try again.' }, { status: 401 });
      }
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: cleanIdentifier,
          phoneNumber: cleanIdentifier,
          customerId: `USER${Math.floor(100000 + Math.random() * 900000)}`,
          name: name || (role === 'FARMER' ? 'Farmer User' : 'Center Staff'),
          role,
          ...(role === 'FARMER'
            ? {
                farmerProfile: {
                  create: {
                    village: 'Shivapur',
                    cropType: 'Paddy',
                    language: 'en',
                  },
                },
              }
            : {}),
        },
        include: { farmerProfile: true },
      });
    }

    return NextResponse.json({ success: true, message: 'Login successful', user });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Login failed' }, { status: 500 });
  }
}
