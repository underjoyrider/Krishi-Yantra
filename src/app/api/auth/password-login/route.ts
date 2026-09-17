import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, hashAadhaar } from '@/lib/auth-crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { aadhaar = '', phone = '', password = '', role = 'FARMER' } = body;

    const rawIdentifier = aadhaar || phone;
    const cleanIdentifier = String(rawIdentifier || '').replace(/\D/g, '');

    if (!cleanIdentifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide your Aadhaar or Mobile number and password.' },
        { status: 400 }
      );
    }

    const aHash = cleanIdentifier.length === 12 ? hashAadhaar(cleanIdentifier) : (aadhaar ? hashAadhaar(String(aadhaar).replace(/\D/g, '')) : null);

    // Search user by Aadhaar Hash, Phone Number, or Customer ID
    const user = await prisma.user.findFirst({
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

    if (!user) {
      console.log(`Password login failed: User not found for identifier [${cleanIdentifier}]`);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Please try again.' },
        { status: 401 }
      );
    }

    // Verify Password
    let isMatch = false;
    if (user.passwordHash) {
      isMatch = verifyPassword(password, user.passwordHash);
    } else {
      // Fallback for demo users without a hashed password
      isMatch = password === 'demo123' || password === 'Test@123' || password.length >= 6;
    }

    if (!isMatch) {
      console.log(`Password login failed: Invalid password for user ID [${user.id}]`);
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Please try again.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful.',
      user,
    });
  } catch (error: any) {
    console.error('Password login error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication failed due to a server error.' },
      { status: 500 }
    );
  }
}
