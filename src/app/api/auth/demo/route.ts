import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEMO_FARMER_PHONE, DEMO_STAFF_PHONE } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const role = body.role || 'FARMER';

    const targetPhone = role === 'STAFF' ? DEMO_STAFF_PHONE : DEMO_FARMER_PHONE;

    let user: any = await prisma.user.findUnique({
      where: { phone: targetPhone },
      include: { farmerProfile: true },
    });

    if (!user) {
      if (role === 'STAFF') {
        user = await prisma.user.create({
          data: {
            name: 'Shivapur Center Operator',
            phone: DEMO_STAFF_PHONE,
            phoneNumber: DEMO_STAFF_PHONE,
            email: 'operator.shivapur@krishiyantra.gov.in',
            village: 'Shivapur',
            district: 'Mandya',
            state: 'Karnataka',
            role: 'STAFF',
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            name: 'Ravi Kumar',
            phone: DEMO_FARMER_PHONE,
            phoneNumber: DEMO_FARMER_PHONE,
            email: 'ravi.kumar@krishiyantra.gov.in',
            village: 'Shivapur Taluk',
            district: 'Mandya',
            state: 'Karnataka',
            role: 'FARMER',
            farmerProfile: {
              create: {
                village: 'Shivapur Taluk',
                district: 'Mandya',
                state: 'Karnataka',
                cropType: 'Paddy / Rice',
                language: 'en',
              },
            },
          },
          include: { farmerProfile: true },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Demo login successful', user });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Demo authentication failed' }, { status: 500 });
  }
}
