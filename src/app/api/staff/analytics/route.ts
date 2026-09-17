import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dailyServed = [
      { date: 'Aug 30', count: 98, avgWait: 42 },
      { date: 'Aug 31', count: 112, avgWait: 38 },
      { date: 'Sep 01', count: 120, avgWait: 36 },
      { date: 'Sep 02', count: 115, avgWait: 34 },
      { date: 'Sep 03', count: 130, avgWait: 37 },
      { date: 'Sep 04', count: 124, avgWait: 33 },
      { date: 'Sep 05', count: 127, avgWait: 35 },
    ];

    const hourlyQueue = [
      { hour: '08:00 AM', queueLength: 14, waitMins: 25 },
      { hour: '09:00 AM', queueLength: 28, waitMins: 45 },
      { hour: '10:00 AM', queueLength: 42, waitMins: 55 },
      { hour: '11:00 AM', queueLength: 36, waitMins: 48 },
      { hour: '12:00 PM', queueLength: 22, waitMins: 30 },
      { hour: '01:00 PM', queueLength: 12, waitMins: 15 },
      { hour: '02:00 PM', queueLength: 25, waitMins: 35 },
      { hour: '03:00 PM', queueLength: 31, waitMins: 40 },
      { hour: '04:00 PM', queueLength: 18, waitMins: 22 },
    ];

    const processingTimes = [
      { crop: 'Paddy / Rice', avgMinutes: 4.8, count: 62 },
      { crop: 'Wheat', avgMinutes: 5.2, count: 35 },
      { crop: 'Maize', avgMinutes: 4.5, count: 18 },
      { crop: 'Soybean', avgMinutes: 5.6, count: 12 },
    ];

    return NextResponse.json({
      success: true,
      kpis: {
        dailyCapacity: 150,
        farmersServed: 127,
        utilizationPct: 84.7,
        avgWaitMins: 35,
        avgProcessMins: 5,
        noShowRatePct: 7,
        peakWindow: '10:00 AM - 11:30 AM',
      },
      dailyServed,
      hourlyQueue,
      processingTimes,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
