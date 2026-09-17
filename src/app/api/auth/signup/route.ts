import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, hashAadhaar } from '@/lib/auth-crypto';

export const dynamic = 'force-dynamic';


export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name = '', phone = '', aadhaar = '', password = '', village = '', email = '', role = 'FARMER' } = body;

    const isFarmer = role === 'FARMER';
    const cleanAadhaar = aadhaar ? String(aadhaar).replace(/\D/g, '') : '';
    const cleanPhone = phone ? String(phone).replace(/\D/g, '') : '';

    // Basic Validation
    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (isFarmer && !cleanAadhaar && !cleanPhone) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid 12-digit Aadhaar number.' },
        { status: 400 }
      );
    }

    if (!isFarmer && !cleanPhone) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    const aHash = cleanAadhaar ? hashAadhaar(cleanAadhaar) : null;

    // Check for existing account
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(cleanPhone ? [{ phone: cleanPhone }, { phoneNumber: cleanPhone }] : []),
          ...(aHash ? [{ aadhaarHash: aHash }] : []),
          ...(cleanAadhaar ? [{ phone: cleanAadhaar }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account already exists with these credentials. Please log in.' },
        { status: 400 }
      );
    }

    const phoneVal = cleanPhone || cleanAadhaar || `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    const customerId = isFarmer
      ? `FARM${Math.floor(100000 + Math.random() * 900000)}`
      : `VEND${Math.floor(100000 + Math.random() * 900000)}`;

    const user = await prisma.user.create({
      data: {
        name: name.trim() || (isFarmer ? 'Farmer User' : 'Vendor Operator'),
        phone: phoneVal,
        phoneNumber: phoneVal,
        customerId,
        email: email ? email.trim() : null,
        village: village ? village.trim() : 'Shivapur',
        district: 'Mandya',
        state: 'Karnataka',
        role,
        passwordHash: hashPassword(password),
        aadhaarHash: aHash,
        aadhaarLast4: cleanAadhaar ? cleanAadhaar.slice(-4) : '1234',
        aadhaarVerified: !!cleanAadhaar,
        mobileVerified: true,
        verificationStatus: 'VERIFIED',
        ...(isFarmer
          ? {
              farmerProfile: {
                create: {
                  village: village ? village.trim() : 'Shivapur',
                  district: 'Mandya',
                  state: 'Karnataka',
                  cropType: 'Paddy / Rice',
                  language: 'en',
                },
              },
            }
          : {}),
      },
      include: { farmerProfile: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully.',
      user,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Signup failed due to a server error.' },
      { status: 500 }
    );
  }
}
