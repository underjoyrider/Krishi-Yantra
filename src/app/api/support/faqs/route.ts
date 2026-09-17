export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { FAQS_DATA } from '@/lib/faqs-data';

export async function GET() {
  return NextResponse.json({ success: true, faqs: FAQS_DATA });
}
