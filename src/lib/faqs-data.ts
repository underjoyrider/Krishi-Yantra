export interface FAQItem {
  id: string;
  category: 'booking' | 'token' | 'queue' | 'notifications' | 'centers' | 'account';
  categoryLabel: string;
  question: string;
  answer: string;
  actionText?: string;
  actionHref?: string;
  actionType?: 'navigate' | 'cancelBooking' | 'contactSupport';
}

export const FAQS_DATA: FAQItem[] = [
  {
    id: 'q1',
    category: 'booking',
    categoryLabel: '📅 Booking',
    question: 'How do I book a procurement slot?',
    answer:
      'Open Find Centers, choose a procurement center, select an available date and time slot, and confirm your booking. You will receive a token number after successful booking.',
    actionText: 'Find Centers',
    actionHref: '/farmer/centers',
    actionType: 'navigate',
  },
  {
    id: 'q2',
    category: 'token',
    categoryLabel: '🎟️ Token',
    question: 'Where can I see my token number?',
    answer:
      'Your token number is available under My Booking. You can also open your booking confirmation to view your token and appointment details.',
    actionText: 'View My Booking',
    actionHref: '/farmer/dashboard',
    actionType: 'navigate',
  },
  {
    id: 'q3',
    category: 'queue',
    categoryLabel: '⏱️ Queue & Waiting Time',
    question: 'How can I check my position in the queue?',
    answer:
      'Open your active booking and select Track My Queue. You can see your current position, the token currently being served, and your estimated waiting time.',
    actionText: 'Track Queue',
    actionHref: '/farmer/dashboard',
    actionType: 'navigate',
  },
  {
    id: 'q4',
    category: 'booking',
    categoryLabel: '📅 Booking',
    question: 'Can I cancel my booking?',
    answer:
      'Yes. Open My Booking, select the booking you want to cancel, and choose Cancel Booking. Cancellation may depend on the center’s current policy.',
    actionText: 'Cancel My Booking',
    actionType: 'cancelBooking',
  },
  {
    id: 'q5',
    category: 'booking',
    categoryLabel: '📅 Booking',
    question: 'Can I change my booking time?',
    answer:
      'Yes, if another slot is available. Cancel your existing booking and select a new available slot.',
    actionText: 'Reschedule Booking',
    actionHref: '/farmer/centers',
    actionType: 'navigate',
  },
  {
    id: 'q6',
    category: 'queue',
    categoryLabel: '⏱️ Queue & Waiting Time',
    question: 'Why has my estimated waiting time changed?',
    answer:
      'Your estimated waiting time changes based on the number of farmers ahead of you, processing speed at the center, and the number of active counters.',
  },
  {
    id: 'q7',
    category: 'queue',
    categoryLabel: '⏱️ Queue & Waiting Time',
    question: 'What happens if I am late for my slot?',
    answer:
      'If you arrive after your scheduled time, the center staff may move your booking to a later position or mark it as a no-show. Please check your notifications and contact the center if you are delayed.',
  },
  {
    id: 'q8',
    category: 'centers',
    categoryLabel: '🏢 Procurement Centers',
    question: 'Why is a procurement center showing as closed?',
    answer:
      'The center may be outside operating hours, temporarily paused, or closed by staff due to operational conditions. Please check another nearby center or try again later.',
    actionText: 'View Other Centers',
    actionHref: '/farmer/centers',
    actionType: 'navigate',
  },
  {
    id: 'q9',
    category: 'notifications',
    categoryLabel: '🔔 Notifications',
    question: 'I did not receive a notification. What should I do?',
    answer:
      'Check your notification settings and make sure your registered mobile number is correct. You can always check your booking status directly in the app.',
    actionText: 'Check Notification Settings',
    actionHref: '/farmer/profile',
    actionType: 'navigate',
  },
  {
    id: 'q10',
    category: 'centers',
    categoryLabel: '🏢 Procurement Centers',
    question: 'Can I visit another procurement center?',
    answer:
      'Yes. You can view nearby procurement centers and compare their current queue, estimated waiting time, and available slots before booking.',
    actionText: 'Find Nearby Centers',
    actionHref: '/farmer/centers',
    actionType: 'navigate',
  },
  {
    id: 'q11',
    category: 'account',
    categoryLabel: '👤 Account',
    question: 'What should I bring to the procurement center?',
    answer:
      'Please remember to bring the relevant identification documents, crop registration slip, and materials required by your procurement center. Requirements may vary by location.',
  },
  {
    id: 'q12',
    category: 'booking',
    categoryLabel: '📅 Booking',
    question: 'My booking is not showing. What should I do?',
    answer:
      'Please refresh your booking page and check your internet connection. If the booking still does not appear, contact support using the options below.',
    actionText: 'Contact Support',
    actionType: 'contactSupport',
  },
];
