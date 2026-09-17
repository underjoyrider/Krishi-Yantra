const prisma = require('../prisma');

const FAQS_DATA = [
  {
    id: '1',
    category: 'Booking & Slots',
    question: 'How do I book a procurement slot?',
    answer: 'Select your preferred procurement center from the Centers tab, choose an available date and time slot, enter your crop details and expected harvest quantity, then confirm your booking.',
  },
  {
    id: '2',
    category: 'Booking & Slots',
    question: 'Can I reschedule or cancel my booking?',
    answer: 'Yes, you can cancel an active booking from your Farmer Dashboard or contact support at least 2 hours before your allocated time window.',
  },
  {
    id: '3',
    category: 'Queue & Live Tracking',
    question: 'How does the digital queue token work?',
    answer: 'Once you book a slot, an encrypted digital token (e.g., B-104) is generated. You can monitor your live queue position and estimated arrival time in real-time from the Queue page.',
  },
  {
    id: '4',
    category: 'Procurement & Payment',
    question: 'What documents do I need to bring?',
    answer: 'Please bring your Aadhaar Card, Land Record (RTC / Pahani), active Bank Passbook copy, and your KrishiYantra Digital Token QR code.',
  },
];

async function getFaqs(req, res) {
  return res.status(200).json({
    success: true,
    faqs: FAQS_DATA,
  });
}

async function getTickets(req, res) {
  try {
    const { userId, status } = req.query;
    const where = {};
    if (userId) where.userId = userId;
    if (status && status !== 'ALL') where.status = status;

    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        booking: { include: { center: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    return res.status(200).json({ success: true, tickets });
  } catch (err) {
    console.error('[Support Error] getTickets:', err);
    return res.status(500).json({ success: false, message: err.message || 'Error fetching tickets' });
  }
}

async function createTicket(req, res) {
  try {
    const { userId, bookingId, category, description, senderName } = req.body || {};

    if (!userId || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, category, description',
      });
    }

    const count = await prisma.supportTicket.count();
    const ticketNumber = `KQ-${10480 + count + 1}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId,
        bookingId: bookingId || null,
        category,
        description,
        status: 'SUBMITTED',
        messages: {
          create: {
            senderType: 'FARMER',
            senderName: senderName || 'Farmer',
            message: description,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return res.status(201).json({ success: true, ticket });
  } catch (err) {
    console.error('[Support Error] createTicket:', err);
    return res.status(500).json({ success: false, message: err.message || 'Error creating ticket' });
  }
}

module.exports = {
  getFaqs,
  getTickets,
  createTicket,
};
