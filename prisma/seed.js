const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.supportMessage.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.queueEvent.deleteMany({});
  await prisma.queueEntry.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.slot.deleteMany({});
  await prisma.procurementCenter.deleteMany({});
  await prisma.farmerProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding Users...');
  // Demo Farmer: Ravi Kumar
  const ravi = await prisma.user.create({
    data: {
      name: 'Ravi Kumar',
      phone: '9876543210',
      phoneNumber: '9876543210',
      email: 'ravi.kumar@krishiyantra.gov.in',
      village: 'Shivapur Taluk',
      district: 'Mandya',
      state: 'Karnataka',
      role: 'FARMER',
      aadhaarLast4: '1234',
      aadhaarVerified: true,
      mobileVerified: true,
      verificationStatus: 'VERIFIED',
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
  });

  // Demo Staff: Shivapur Center Operator
  const staff = await prisma.user.create({
    data: {
      name: 'Shivapur Center Operator',
      phone: '9876543211',
      phoneNumber: '9876543211',
      email: 'operator.shivapur@krishiyantra.gov.in',
      village: 'Shivapur',
      district: 'Mandya',
      state: 'Karnataka',
      role: 'STAFF',
      aadhaarLast4: '9876',
      aadhaarVerified: true,
      mobileVerified: true,
      verificationStatus: 'VERIFIED',
    },
  });

  // 35 realistic Indian farmers
  const farmerNames = [
    'Suresh Patil', 'Kumar Gowda', 'Anil Sharma', 'Ramesh Yadav', 'Rajesh Verma',
    'Prakash Hegde', 'Vijay Kumar', 'Manjunath B', 'Devendra Singh', 'Gopal Krishnan',
    'Mahesh Kulkarni', 'Sunil Deshmukh', 'Ashok Reddy', 'Chandrashekhar R', 'Harish Babu',
    'Basavaraj M', 'Santosh Pawar', 'Arun Joshi', 'Dharmendra Yadav', 'Naveen Shetty',
    'Prashant More', 'Kiran Patel', 'Subhash Chandra', 'Girish Prasad', 'Nagaraj Shenoy',
    'Balram Meena', 'Ranganath Swamy', 'Shivanandappa', 'Umesh Nayak', 'Jagadishwar Rao',
    'Venkatesh Rao', 'Someshwar Hegde', 'Gundappa Gowda', 'Mallikarjun H', 'Bhimappa K'
  ];

  const crops = ['Paddy / Rice', 'Wheat', 'Maize', 'Soybean', 'Cotton', 'Sugarcane', 'Millets', 'Tur Dal'];
  const villages = ['Shivapur', 'Ramanagara', 'Kolar', 'Maddur', 'Malavalli', 'Mandya', 'Srirangapatna', 'Nagamangala', 'Pandavapura', 'Chikkaballapur'];

  const createdFarmers = [];
  for (let i = 0; i < farmerNames.length; i++) {
    const v = villages[i % villages.length];
    const u = await prisma.user.create({
      data: {
        name: farmerNames[i],
        phone: `98765000${(i + 1).toString().padStart(2, '0')}`,
        phoneNumber: `98765000${(i + 1).toString().padStart(2, '0')}`,
        email: `${farmerNames[i].toLowerCase().replace(/\s+/g, '.')}@farm.in`,
        village: v,
        district: i % 3 === 0 ? 'Mandya' : i % 3 === 1 ? 'Ramanagara' : 'Kolar',
        state: 'Karnataka',
        role: 'FARMER',
        farmerProfile: {
          create: {
            village: v,
            district: i % 3 === 0 ? 'Mandya' : i % 3 === 1 ? 'Ramanagara' : 'Kolar',
            state: 'Karnataka',
            cropType: crops[i % crops.length],
            language: i % 3 === 0 ? 'kn' : i % 3 === 1 ? 'hi' : 'en',
          },
        },
      },
    });
    createdFarmers.push(u);
  }

  console.log('Seeding 10 Procurement Centers across Karnataka...');
  const centerDefinitions = [
    {
      name: 'Shivapur Procurement Center',
      code: 'SHIV',
      address: 'Shivapur Main Road, Mandya District',
      village: 'Shivapur',
      district: 'Mandya',
      latitude: 12.5234,
      longitude: 76.8967,
      capacity: 135,
      dailyCapacity: 135,
      activeCounters: 4,
      avgProcessMins: 6,
      averageProcessingTime: 6,
      status: 'OPEN',
      openingTime: '08:00 AM',
      closingTime: '05:00 PM',
      targetSlotsLeft: 63,
      targetQueueCount: 12,
    },
    {
      name: 'Ramanagara Procurement Center',
      code: 'RAM',
      address: 'Ram Nagar Market Road, Ramanagara',
      village: 'Ramanagara Town',
      district: 'Ramanagara',
      latitude: 12.7156,
      longitude: 77.2812,
      capacity: 135,
      dailyCapacity: 135,
      activeCounters: 4,
      avgProcessMins: 6,
      averageProcessingTime: 6,
      status: 'BUSY',
      openingTime: '08:00 AM',
      closingTime: '05:00 PM',
      targetSlotsLeft: 35,
      targetQueueCount: 28,
    },
    {
      name: 'Kolar Procurement Center',
      code: 'KOL',
      address: 'Kolar Agricultural Market Yard, Kolar',
      village: 'Kolar APMC',
      district: 'Kolar',
      latitude: 13.1367,
      longitude: 78.1342,
      capacity: 135,
      dailyCapacity: 135,
      activeCounters: 3,
      avgProcessMins: 5,
      averageProcessingTime: 5,
      status: 'OPEN',
      openingTime: '08:30 AM',
      closingTime: '04:30 PM',
      targetSlotsLeft: 82,
      targetQueueCount: 7,
    },
    {
      name: 'Maddur Procurement Center',
      code: 'MAD',
      address: 'APMC Yard, Maddur Bus Stand Road, Mandya',
      village: 'Maddur',
      district: 'Mandya',
      latitude: 12.5842,
      longitude: 77.0428,
      capacity: 135,
      dailyCapacity: 135,
      activeCounters: 2,
      avgProcessMins: 5,
      averageProcessingTime: 5,
      status: 'OPEN',
      openingTime: '08:00 AM',
      closingTime: '05:00 PM',
      targetSlotsLeft: 58,
      targetQueueCount: 9,
    },
    {
      name: 'Malavalli Procurement Center',
      code: 'MAL',
      address: 'Kanakapura Main Road, Malavalli',
      village: 'Malavalli',
      district: 'Mandya',
      latitude: 12.3865,
      longitude: 77.0583,
      capacity: 135,
      dailyCapacity: 135,
      activeCounters: 3,
      avgProcessMins: 5,
      averageProcessingTime: 5,
      status: 'BUSY',
      openingTime: '08:00 AM',
      closingTime: '05:00 PM',
      targetSlotsLeft: 25,
      targetQueueCount: 22,
    },
    {
      name: 'Mandya Agricultural Market Center',
      code: 'MKT',
      address: 'Central Mandi Complex, Mandya City',
      village: 'Mandya City',
      district: 'Mandya',
      latitude: 12.5238,
      longitude: 76.8988,
      capacity: 135,
      dailyCapacity: 135,
      activeCounters: 3,
      avgProcessMins: 6,
      averageProcessingTime: 6,
      status: 'HIGH_DEMAND',
      openingTime: '08:00 AM',
      closingTime: '05:00 PM',
      targetSlotsLeft: 8,
      targetQueueCount: 42,
    },
    {
      name: 'Srirangapatna Procurement Center',
      code: 'SRI',
      address: 'Mysuru-Bengaluru Highway, Srirangapatna',
      village: 'Srirangapatna',
      district: 'Mandya',
      latitude: 12.4215,
      longitude: 76.6932,
      capacity: 135,
      dailyCapacity: 135,
      activeCounters: 2,
      avgProcessMins: 6,
      averageProcessingTime: 6,
      status: 'OPEN',
      openingTime: '08:00 AM',
      closingTime: '05:00 PM',
      targetSlotsLeft: 74,
      targetQueueCount: 5,
    },
    {
      name: 'Nagamangala Procurement Center',
      code: 'NAG',
      address: 'Bellur Cross Road, Nagamangala',
      village: 'Nagamangala',
      district: 'Mandya',
      latitude: 12.8184,
      longitude: 76.7584,
      capacity: 135,
      dailyCapacity: 135,
      activeCounters: 2,
      avgProcessMins: 5,
      averageProcessingTime: 5,
      status: 'OPEN',
      openingTime: '08:30 AM',
      closingTime: '04:30 PM',
      targetSlotsLeft: 52,
      targetQueueCount: 10,
    },
    {
      name: 'Pandavapura Procurement Center',
      code: 'PAN',
      address: 'Sugar Factory Road, Pandavapura',
      village: 'Pandavapura',
      district: 'Mandya',
      latitude: 12.4962,
      longitude: 76.6711,
      capacity: 135,
      dailyCapacity: 135,
      activeCounters: 2,
      avgProcessMins: 5,
      averageProcessingTime: 5,
      status: 'OPEN',
      openingTime: '08:00 AM',
      closingTime: '05:00 PM',
      targetSlotsLeft: 60,
      targetQueueCount: 8,
    },
    {
      name: 'Chikkaballapur Procurement Center',
      code: 'CHK',
      address: 'Sidlaghatta Road, Chikkaballapur',
      village: 'Chikkaballapur Town',
      district: 'Chikkaballapur',
      latitude: 13.4325,
      longitude: 77.7275,
      capacity: 135,
      dailyCapacity: 135,
      activeCounters: 3,
      avgProcessMins: 5,
      averageProcessingTime: 5,
      status: 'BUSY',
      openingTime: '08:00 AM',
      closingTime: '05:00 PM',
      targetSlotsLeft: 28,
      targetQueueCount: 25,
    },
  ];

  const createdCenters = [];
  for (const cDef of centerDefinitions) {
    const c = await prisma.procurementCenter.create({
      data: {
        name: cDef.name,
        code: cDef.code,
        address: cDef.address,
        village: cDef.village,
        district: cDef.district,
        state: 'Karnataka',
        latitude: cDef.latitude,
        longitude: cDef.longitude,
        capacity: cDef.capacity,
        dailyCapacity: cDef.dailyCapacity,
        activeCounters: cDef.activeCounters,
        avgProcessMins: cDef.avgProcessMins,
        averageProcessingTime: cDef.averageProcessingTime,
        status: cDef.status,
        openingTime: cDef.openingTime,
        closingTime: cDef.closingTime,
        currentQueueCount: cDef.targetQueueCount,
      },
    });
    createdCenters.push({ ...c, ...cDef });
  }

  console.log('Seeding 1-Hour Time Slots (08:00 AM - 05:00 PM)...');
  const timeSlots = [
    { start: '08:00 AM', end: '09:00 AM' },
    { start: '09:00 AM', end: '10:00 AM' },
    { start: '10:00 AM', end: '11:00 AM' },
    { start: '11:00 AM', end: '12:00 PM' },
    { start: '12:00 PM', end: '01:00 PM' },
    { start: '01:00 PM', end: '02:00 PM' },
    { start: '02:00 PM', end: '03:00 PM' },
    { start: '03:00 PM', end: '04:00 PM' },
    { start: '04:00 PM', end: '05:00 PM' },
  ];

  const todayStr = '2026-09-05';
  const dates = [todayStr, '2026-09-06', '2026-09-07', '2026-09-08'];
  const centerSlots = {};

  for (const center of createdCenters) {
    centerSlots[center.id] = [];
    const totalSlotsBookedNeeded = 135 - center.targetSlotsLeft;

    // Distribute totalSlotsBookedNeeded across 9 slots realistically
    let remainingToBook = totalSlotsBookedNeeded;
    const bookedPerSlot = [];

    for (let idx = 0; idx < 9; idx++) {
      if (idx === 8) {
        bookedPerSlot.push(Math.min(15, Math.max(0, remainingToBook)));
      } else {
        const portion = Math.min(15, Math.min(remainingToBook, Math.ceil(remainingToBook / (9 - idx))));
        bookedPerSlot.push(portion);
        remainingToBook -= portion;
      }
    }

    for (const d of dates) {
      for (let idx = 0; idx < timeSlots.length; idx++) {
        const ts = timeSlots[idx];
        const booked = d === todayStr ? bookedPerSlot[idx] : Math.min(15, Math.floor(bookedPerSlot[idx] * 0.4));
        const status = booked >= 15 ? 'FULL' : 'AVAILABLE';

        const slot = await prisma.slot.create({
          data: {
            centerId: center.id,
            date: d,
            startTime: ts.start,
            endTime: ts.end,
            capacity: 15,
            bookedCount: booked,
            status,
          },
        });
        centerSlots[center.id].push(slot);
      }
    }
  }

  console.log('Seeding Actual Bookings and Queue Entries for all centers...');

  // Center 1: Shivapur (12 active in queue, including Ravi B-104 + 64 completed)
  const shivapur = createdCenters.find((c) => c.code === 'SHIV');
  const shivTodaySlots = centerSlots[shivapur.id].filter((s) => s.date === todayStr);

  // Completed history
  for (let i = 1; i <= 64; i++) {
    const f = createdFarmers[(i - 1) % createdFarmers.length];
    await prisma.booking.create({
      data: {
        farmerId: f.id,
        centerId: shivapur.id,
        slotId: shivTodaySlots[0].id,
        bookingDate: todayStr,
        slotStartTime: '08:00 AM',
        slotEndTime: '09:00 AM',
        tokenNumber: `B-${i.toString().padStart(3, '0')}`,
        status: 'COMPLETED',
        estimatedWait: 0,
        queuePosition: 0,
        cropType: 'Paddy / Rice',
        quantityKg: 1200 + i * 20,
      },
    });
  }

  // Active queue: 12 farmers (1 processing + 11 waiting)
  for (let j = 1; j <= 12; j++) {
    const isRavi = j === 4;
    const farmer = isRavi ? ravi : createdFarmers[(j - 1) % createdFarmers.length];
    const token = `B-${(100 + j).toString()}`;
    const status = j === 1 ? 'PROCESSING' : 'WAITING';
    const etaMins = j === 1 ? 0 : Math.ceil((j * 6) / 4);

    const booking = await prisma.booking.create({
      data: {
        farmerId: farmer.id,
        centerId: shivapur.id,
        slotId: shivTodaySlots[Math.min(j - 1, shivTodaySlots.length - 1)].id,
        bookingDate: todayStr,
        slotStartTime: isRavi ? '10:00 AM' : shivTodaySlots[Math.min(j - 1, 8)].startTime,
        slotEndTime: isRavi ? '11:00 AM' : shivTodaySlots[Math.min(j - 1, 8)].endTime,
        tokenNumber: token,
        status,
        estimatedWait: etaMins,
        queuePosition: j,
        cropType: 'Paddy / Rice',
        quantityKg: 1500 + j * 100,
      },
    });

    await prisma.queueEntry.create({
      data: {
        centerId: shivapur.id,
        farmerId: farmer.id,
        bookingId: booking.id,
        queuePosition: j,
        status,
        estimatedWaitTime: etaMins,
        checkInTime: new Date(Date.now() - (13 - j) * 300000),
      },
    });

    await prisma.queueEvent.create({
      data: {
        bookingId: booking.id,
        oldStatus: 'NONE',
        newStatus: status,
        note: `Token ${token} checked into Shivapur queue at position #${j}`,
      },
    });
  }

  // Seed active queues for the remaining 9 centers
  for (const center of createdCenters) {
    if (center.code === 'SHIV') continue;
    const cSlots = centerSlots[center.id].filter((s) => s.date === todayStr);
    const count = center.targetQueueCount;

    for (let q = 1; q <= count; q++) {
      const f = createdFarmers[(q + center.name.length) % createdFarmers.length];
      const token = `${center.code}-${(100 + q).toString()}`;
      const status = q === 1 ? 'PROCESSING' : 'WAITING';
      const etaMins = q === 1 ? 0 : Math.ceil((q * center.avgProcessMins) / center.activeCounters);
      const slotIdx = Math.min(Math.floor(q / 4), cSlots.length - 1);

      const booking = await prisma.booking.create({
        data: {
          farmerId: f.id,
          centerId: center.id,
          slotId: cSlots[slotIdx].id,
          bookingDate: todayStr,
          slotStartTime: cSlots[slotIdx].startTime,
          slotEndTime: cSlots[slotIdx].endTime,
          tokenNumber: token,
          status,
          estimatedWait: etaMins,
          queuePosition: q,
          cropType: crops[q % crops.length],
          quantityKg: 1000 + q * 50,
        },
      });

      await prisma.queueEntry.create({
        data: {
          centerId: center.id,
          farmerId: f.id,
          bookingId: booking.id,
          queuePosition: q,
          status,
          estimatedWaitTime: etaMins,
          checkInTime: new Date(Date.now() - (count - q) * 180000),
        },
      });
    }
  }

  console.log('Seeding Notifications for Ravi Kumar...');
  await prisma.notification.create({
    data: {
      userId: ravi.id,
      title: 'Booking Confirmed: Token B-104',
      message: 'Your procurement slot B-104 at Shivapur Center is confirmed for September 5, 2026 at 10:00 AM – 11:00 AM.',
      type: 'BOOKING_CONFIRMATION',
      read: true,
      isRead: true,
      createdAt: new Date(Date.now() - 3600000),
    },
  });

  await prisma.notification.create({
    data: {
      userId: ravi.id,
      title: 'Queue Live Update',
      message: 'Shivapur Center has started processing Token B-101. 3 farmers are currently ahead of you.',
      type: 'QUEUE_UPDATE',
      read: false,
      isRead: false,
      createdAt: new Date(Date.now() - 900000),
    },
  });

  await prisma.notification.create({
    data: {
      userId: ravi.id,
      title: 'Recommended Arrival Reminder',
      message: 'Your recommended arrival time at APMC Gate 2 is 09:45 AM. Weighbridge Counter #1 is active.',
      type: 'REMINDER',
      read: false,
      isRead: false,
      createdAt: new Date(Date.now() - 300000),
    },
  });

  console.log('Seeding Support Tickets for Ravi...');
  await prisma.supportTicket.create({
    data: {
      ticketNumber: 'KQ-10482',
      userId: ravi.id,
      category: 'Booking problem',
      description: 'Need confirmation on weighbridge token slip for Gate 2.',
      status: 'RESOLVED',
      createdAt: new Date(Date.now() - 7200000),
      messages: {
        create: [
          {
            senderType: 'FARMER',
            senderName: 'Ravi Kumar',
            message: 'Need confirmation on weighbridge token slip for Gate 2.',
            createdAt: new Date(Date.now() - 7200000),
          },
          {
            senderType: 'SUPPORT',
            senderName: 'Shivapur APMC Desk',
            message: 'Token B-104 is confirmed for Gate 2 weighbridge entry. Please show digital slip at gate.',
            createdAt: new Date(Date.now() - 3600000),
          },
        ],
      },
    },
  });

  console.log('✅ Database seeded successfully with 10 centers, realistic queues, and full-stack records!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
