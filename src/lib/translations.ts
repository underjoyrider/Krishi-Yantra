export type Language = 'en' | 'hi' | 'kn';

export interface Translations {
  appName: string;
  tagline: string;
  subTagline: string;
  greeting: string;
  greetingSub: string;
  trackMyQueue: string;
  viewBooking: string;
  yourNextProcurement: string;
  nearbyCenters: string;
  viewCenter: string;
  bookSlot: string;
  open: string;
  busy: string;
  paused: string;
  closed: string;
  farmersWaiting: string;
  estimatedWait: string;
  availableSlots: string;
  distanceKm: string;
  operatingHours: string;
  centerCapacity: string;
  todaysSchedule: string;
  chooseDate: string;
  chooseTimeSlot: string;
  confirmation: string;
  confirmBooking: string;
  bookingConfirmed: string;
  yourToken: string;
  currentPosition: string;
  currentlyServing: string;
  updatedJustNow: string;
  viewDirections: string;
  addToCalendar: string;
  turnApproaching: string;
  positionsAway: string;
  proceedToCounter: string;
  beingProcessed: string;
  completedSuccess: string;
  stepConfirmed: string;
  stepCheckedIn: string;
  stepWaiting: string;
  stepProcessing: string;
  stepCompleted: string;
  searchPlaceholder: string;
  filterAll: string;
  filterOpen: string;
  filterLowWait: string;
  filterNearby: string;
  sortNearest: string;
  sortLowestWait: string;
  sortMostSlots: string;
  fullSlot: string;
  slotsLeft: string;
  navHome: string;
  navCenters: string;
  navMyBooking: string;
  navNotifications: string;
  navProfile: string;
  notificationsTitle: string;
  noNotifications: string;
  profileTitle: string;
  village: string;
  cropType: string;
  phoneNumber: string;
  languagePref: string;
  helpSupport: string;
  helpSubtitle: string;
  viewHelpCenter: string;
  searchQuestion: string;
  faqTitle: string;
  stillNeedHelp: string;
  talkToSupport: string;
  callSupport: string;
  speakWithRep: string;
  messageSupport: string;
  sendQuestion: string;
  reportProblem: string;
  mySupportRequests: string;
  submitRequest: string;
  requestSubmitted: string;
  noSupportRequests: string;
  noFaqFound: string;
  tryDifferentSearch: string;
  landingTagSub: string;
  signIn: string;
  staffPortal: string;
  liveSeasonBadge: string;
  findCenterCta: string;
  staffLoginCta: string;
  avgWaitLabel: string;
  zeroQueueLabel: string;
  predictableLabel: string;
  howItWorksLabel: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  stepFindTitle: string;
  stepFindDesc: string;
  stepBookTitle: string;
  stepBookDesc: string;
  stepTrackTitle: string;
  stepTrackDesc: string;
  stepArriveTitle: string;
  stepArriveDesc: string;
  advantagesLabel: string;
  advantagesTitle: string;
  benefitWaitTitle: string;
  benefitWaitDesc: string;
  benefitPlanTitle: string;
  benefitPlanDesc: string;
  benefitLiveTitle: string;
  benefitLiveDesc: string;
  benefitSmsTitle: string;
  benefitSmsDesc: string;
  benefitOpsTitle: string;
  benefitOpsDesc: string;
  farmerLoginFooter: string;
  staffDashboardFooter: string;
  farmerPortalLabel: string;
  farmerHeroTitle: string;
  farmerHeroDesc: string;
  liveQueueVisibilityTitle: string;
  liveQueueVisibilityDesc: string;
  secureAccountsTitle: string;
  secureAccountsDesc: string;
  farmerAccessLabel: string;
  welcomeBack: string;
  createYourAccount: string;
  logInTab: string;
  signUpTab: string;
  fullNameLabel: string;
  emailOptionalLabel: string;
  mobileNumberLabel: string;
  aadhaarNumberLabel: string;
  aadhaarConsentText: string;
  villageLabel: string;
  passwordLabel: string;
  logInSecurely: string;
  createAccountBtn: string;
  pleaseWaitBtn: string;
  useDemoFarmerAccount: string;
  switchPortal: string;
  namePlaceholder: string;
  mobilePlaceholder: string;
  aadhaarPlaceholder: string;
  villagePlaceholder: string;
  passwordPlaceholder: string;
  bookSlotTitle: string;
  bookSlotDesc: string;
  cropTypeLabel: string;
  cropQuantityLabel: string;
  procurementCentreLabel: string;
  selectCenterOption: string;
  appointmentDateLabel: string;
  availableTimeSlotLabel: string;
  selectSlotOption: string;
  skipBookingBtn: string;
  continueToConfirmationBtn: string;
  confirmingBookingBtn: string;
  liveQueueTrackerLabel: string;
  backToDashboardTitle: string;

  // Additional New Translation Keys
  noActiveBookingTitle: string;
  noActiveBookingDesc: string;
  filterNearest: string;
  filterLowestWait: string;
  filterShortestWait?: string;
  filterMostSlots: string;
  filterOpenNow?: string;
  procurementCentersTitle: string;
  procurementCentersSub: string;
  searchCentersPlaceholder: string;
  listView: string;
  mapView: string;
  listMode?: string;
  mapMode?: string;
  namaste?: string;
  quoteTitle?: string;
  quoteSub?: string;
  centersAvailableNearYou?: string;
  findProcurementCenters?: string;
  nearbyProcurementCenters?: string;
  allCaughtUp?: string;
  language?: string;
  enabled?: string;
  supportTitle?: string;
  contactSupport?: string;
  confirmed?: string;
  queuePosition?: string;
  highDemand?: string;
  farmers?: string;
  full?: string;
  inQueue: string;
  queueProgress: string;
  peopleAhead: string;
  currentServing: string;
  nextInQueue: string;
  procurementMilestones: string;
  viewDetails: string;
  viewAll: string;
  updatesAndAlerts: string;
  caughtUp: string;
  noNotificationsDesc: string;
  farmerAccount: string;
  identityVerification: string;
  verified: string;
  account: string;
  editProfile: string;
  bookingHistory: string;
  aboutApp: string;
  signOut: string;
  deleteAccount: string;
  cancelBooking: string;
  backToDashboard: string;
  slotBookedSuccess: string;
  slotReleased: string;
  bookingCancelledTitle: string;
  saveDetails: string;
  viewReceipt: string;
  downloadReceipt: string;
  backToHome: string;
  closeReceipt: string;
  bookNewSlot: string;
  clearFilters: string;
  searchAgain: string;
  noCentersFound: string;
  noCentersFoundDesc: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'KrishiYantra',
    tagline: 'Know your slot. Skip the wait.',
    subTagline: 'Turn unpredictable procurement-center waiting into a predictable appointment.',
    greeting: 'Namaste',
    greetingSub: "Good morning! Here's your next booking.",
    trackMyQueue: 'Track My Queue',
    viewBooking: 'View Booking',
    yourNextProcurement: 'Your Next Procurement',
    nearbyCenters: 'Nearby Procurement Centers',
    viewCenter: 'View Center',
    bookSlot: 'Book Slot',
    open: 'OPEN',
    busy: 'BUSY',
    paused: 'PAUSED',
    closed: 'CLOSED',
    farmersWaiting: 'farmers waiting',
    estimatedWait: 'Estimated wait',
    availableSlots: 'Available slots',
    distanceKm: 'km',
    operatingHours: 'Operating Hours',
    centerCapacity: 'Daily Capacity',
    todaysSchedule: "Today's Schedule",
    chooseDate: '1. Choose Date',
    chooseTimeSlot: '2. Choose Time Slot',
    confirmation: '3. Booking Summary',
    confirmBooking: 'Confirm Booking',
    bookingConfirmed: 'Booking Confirmed',
    yourToken: 'YOUR TOKEN',
    currentPosition: 'CURRENT POSITION',
    currentlyServing: 'CURRENTLY SERVING',
    updatedJustNow: 'Updated live just now',
    viewDirections: 'View Directions',
    addToCalendar: 'Add to Calendar',
    turnApproaching: 'Your turn is approaching',
    positionsAway: 'You are 3 positions away.',
    proceedToCounter: 'Please proceed to the procurement counter.',
    beingProcessed: 'Your procurement is being processed.',
    completedSuccess: 'Procurement completed successfully.',
    stepConfirmed: 'Booking Confirmed',
    stepCheckedIn: 'Checked In',
    stepWaiting: 'Waiting',
    stepProcessing: 'Processing',
    stepCompleted: 'Completed',
    searchPlaceholder: 'Search by center or village...',
    filterAll: 'All',
    filterOpen: 'Open Now',
    filterLowWait: 'Low Wait',
    filterNearby: 'Nearby',
    sortNearest: 'Nearest',
    sortLowestWait: 'Lowest Wait',
    sortMostSlots: 'Most Available Slots',
    fullSlot: 'FULL',
    slotsLeft: 'slots left',
    navHome: 'Home',
    navCenters: 'Centers',
    navMyBooking: 'My Booking',
    navNotifications: 'Alerts',
    navProfile: 'Profile',
    notificationsTitle: 'Notifications & Updates',
    noNotifications: "You're all caught up.",
    profileTitle: 'Farmer Profile',
    village: 'Village / Taluk',
    cropType: 'Primary Crop',
    phoneNumber: 'Mobile Number',
    languagePref: 'Preferred Language',
    helpSupport: 'Help & Support',
    helpSubtitle: 'Find quick answers to common questions or get help with your booking.',
    viewHelpCenter: 'View Help Center',
    searchQuestion: 'Search your question...',
    faqTitle: 'Frequently Asked Questions',
    stillNeedHelp: 'Still need help?',
    talkToSupport: "Talk to our support team and we'll help you with your issue.",
    callSupport: 'Call Support',
    speakWithRep: 'Speak with a support representative',
    messageSupport: 'Message Support',
    sendQuestion: 'Send us your question',
    reportProblem: 'Report a Problem',
    mySupportRequests: 'My Support Requests',
    submitRequest: 'Submit Request',
    requestSubmitted: 'Support request submitted',
    noSupportRequests: "You don't have any support requests yet.",
    noFaqFound: "We couldn't find an answer.",
    tryDifferentSearch: 'Try a different search or contact support.',
    landingTagSub: 'Agricultural Procurement Queue & Slot Platform',
    signIn: 'Sign In',
    staffPortal: 'Staff Portal',
    liveSeasonBadge: 'Now live for Kharif & Rabi procurement season',
    findCenterCta: 'Find a Procurement Center',
    staffLoginCta: 'Staff Login',
    avgWaitLabel: 'Avg wait time',
    zeroQueueLabel: 'Road bottlenecks',
    predictableLabel: 'Predictable slots',
    howItWorksLabel: 'Simple 4-Step Journey',
    howItWorksTitle: 'How KrishiYantra Works',
    howItWorksSubtitle: 'Designed for low-bandwidth phones with zero complicated paperwork.',
    stepFindTitle: 'Find',
    stepFindDesc: 'See nearby procurement centers and current waiting times.',
    stepBookTitle: 'Book',
    stepBookDesc: 'Choose a convenient procurement slot.',
    stepTrackTitle: 'Track',
    stepTrackDesc: 'Follow your token and live queue position.',
    stepArriveTitle: 'Arrive',
    stepArriveDesc: 'Get notified when your turn is approaching.',
    advantagesLabel: 'Key Advantages',
    advantagesTitle: 'Built for Farmers & Center Staff',
    benefitWaitTitle: 'Less Waiting',
    benefitWaitDesc: 'Farmers know expected waiting times before travelling, saving valuable tractor fuel and hours in heat.',
    benefitPlanTitle: 'Better Planning',
    benefitPlanDesc: 'Book a confirmed slot instead of waiting blindly overnight outside mandis.',
    benefitLiveTitle: 'Live Updates',
    benefitLiveDesc: 'Queue information updates in real time via WebSockets and automatic fallbacks.',
    benefitSmsTitle: 'Simple Notifications',
    benefitSmsDesc: 'Farmers receive automated SMS alerts when their token is 3 positions away.',
    benefitOpsTitle: 'Better Center Operations',
    benefitOpsDesc: 'Staff can control throughput, prevent overcrowding, rebalance load across mandis, and access daily operational analytics.',
    farmerLoginFooter: 'Farmer Login',
    staffDashboardFooter: 'Staff Dashboard',
    farmerPortalLabel: 'Farmer portal',
    farmerHeroTitle: 'Plan your mandi visit with confidence.',
    farmerHeroDesc: 'Book a slot, follow your token, and see live waiting times before you travel.',
    liveQueueVisibilityTitle: 'Live queue visibility',
    liveQueueVisibilityDesc: 'Updates from the counter in real time.',
    secureAccountsTitle: 'Secure local accounts',
    secureAccountsDesc: 'Credentials are stored as salted hashes.',
    farmerAccessLabel: 'Farmer access',
    welcomeBack: 'Welcome back',
    createYourAccount: 'Create your account',
    logInTab: 'Log in',
    signUpTab: 'Sign up',
    fullNameLabel: 'Full name',
    emailOptionalLabel: 'Email (optional)',
    mobileNumberLabel: 'Mobile number',
    aadhaarNumberLabel: 'Aadhaar number',
    aadhaarConsentText: 'I consent to Aadhaar identity verification.',
    villageLabel: 'Village',
    passwordLabel: 'Password',
    logInSecurely: 'Log in securely',
    createAccountBtn: 'Create account',
    pleaseWaitBtn: 'Please wait...',
    useDemoFarmerAccount: 'Use demo farmer account',
    switchPortal: 'Switch portal',
    namePlaceholder: 'Your name',
    mobilePlaceholder: '10-digit mobile number',
    aadhaarPlaceholder: '12-digit Aadhaar number',
    villagePlaceholder: 'Your village',
    passwordPlaceholder: 'At least 6 characters',
    bookSlotTitle: 'Book a procurement slot',
    bookSlotDesc: 'Enter your crop details and choose when and where you will arrive.',
    cropTypeLabel: 'Crop type',
    cropQuantityLabel: 'Crop quantity (kg)',
    procurementCentreLabel: 'Procurement centre',
    selectCenterOption: 'Select a center',
    appointmentDateLabel: 'Appointment date',
    availableTimeSlotLabel: 'Available time slot',
    selectSlotOption: 'Select a slot',
    skipBookingBtn: 'Skip booking for now',
    continueToConfirmationBtn: 'Continue to confirmation',
    confirmingBookingBtn: 'Confirming booking...',
    liveQueueTrackerLabel: 'Live Queue Tracker',
    backToDashboardTitle: 'Back to Dashboard',

    // New keys
    noActiveBookingTitle: 'No Active Booking',
    noActiveBookingDesc: "You currently don't have any upcoming procurement bookings.",
    filterNearest: 'Nearest',
    filterLowestWait: 'Shortest Wait',
    filterShortestWait: 'Shortest Wait',
    filterMostSlots: 'Most Slots',
    filterOpenNow: 'Open Now',
    procurementCentersTitle: 'Procurement Centers',
    procurementCentersSub: 'Find and book slots at nearby centers',
    searchCentersPlaceholder: 'Search by name or location...',
    listView: 'List',
    mapView: 'Map',
    listMode: 'List',
    mapMode: 'Map',
    namaste: 'Namaste',
    quoteTitle: 'Better Markets. Brighter Futures.',
    quoteSub: 'Support our farmers, strengthen our nation.',
    centersAvailableNearYou: 'centers available near you',
    findProcurementCenters: 'Find Procurement Centers',
    nearbyProcurementCenters: 'Nearby Procurement Centers',
    allCaughtUp: "You're All Caught Up!",
    language: 'Language',
    enabled: 'Enabled',
    supportTitle: 'Support',
    contactSupport: 'Contact Support',
    confirmed: 'Confirmed',
    queuePosition: 'Queue Position',
    highDemand: 'HIGH DEMAND',
    farmers: 'farmers',
    full: 'FULL',
    inQueue: 'In queue',
    queueProgress: 'Queue Progress',
    peopleAhead: 'people ahead of you',
    currentServing: 'Current Serving',
    nextInQueue: 'Next in Queue',
    procurementMilestones: 'Procurement Milestones',
    viewDetails: 'View Details',
    viewAll: 'View all',
    updatesAndAlerts: 'Updates & SMS Alerts',
    caughtUp: "You're All Caught Up!",
    noNotificationsDesc: 'There are no new notifications.',
    farmerAccount: 'Farmer Account',
    identityVerification: 'Identity Verification',
    verified: 'Verified',
    account: 'Account',
    editProfile: 'Edit Profile',
    bookingHistory: 'Booking History',
    aboutApp: 'About KrishiYantra',
    signOut: 'Sign Out',
    deleteAccount: 'Delete Account',
    cancelBooking: 'Cancel Booking',
    backToDashboard: 'Back to Dashboard',
    slotBookedSuccess: 'SLOT BOOKED SUCCESSFULLY!',
    slotReleased: 'SLOT RELEASED',
    bookingCancelledTitle: 'Booking Cancelled',
    saveDetails: 'Save Details',
    viewReceipt: 'View Receipt',
    downloadReceipt: 'Download Receipt',
    backToHome: 'Back to Home',
    closeReceipt: 'Close Receipt',
    bookNewSlot: 'Book New Procurement Slot',
    clearFilters: 'Clear Filters',
    searchAgain: 'Search Again',
    noCentersFound: 'No Procurement Centers Found',
    noCentersFoundDesc: 'There are currently no procurement centers matching your selected filters.',
  },
  hi: {
    appName: 'कृषि यंत्र (KrishiYantra)',
    tagline: 'अपना स्लॉट जानें। कतार से बचें।',
    subTagline: 'खरीद केंद्र पर अनिश्चित इंतजार को एक निश्चित अपॉइंटमेंट में बदलें।',
    greeting: 'नमस्ते',
    greetingSub: 'शुभ प्रभात! यह आपकी अगली बुकिंग है।',
    trackMyQueue: 'मेरी कतार ट्रैक करें',
    viewBooking: 'बुकिंग देखें',
    yourNextProcurement: 'आपकी अगली उपज खरीद',
    nearbyCenters: 'नजदीकी खरीद केंद्र',
    viewCenter: 'केंद्र देखें',
    bookSlot: 'स्लॉट बुक करें',
    open: 'खुला है',
    busy: 'व्यस्त',
    paused: 'रुका हुआ',
    closed: 'बंद',
    farmersWaiting: 'किसान प्रतीक्षा में',
    estimatedWait: 'अनुमानित समय',
    availableSlots: 'उपलब्ध स्लॉट',
    distanceKm: 'किमी',
    operatingHours: 'कार्य समय',
    centerCapacity: 'दैनिक क्षमता',
    todaysSchedule: 'आज का समय-सारणी',
    chooseDate: '1. तारीख चुनें',
    chooseTimeSlot: '2. समय स्लॉट चुनें',
    confirmation: '3. बुकिंग विवरण',
    confirmBooking: 'बुकिंग पक्की करें',
    bookingConfirmed: 'बुकिंग पक्की हो गई',
    yourToken: 'आपका टोकन',
    currentPosition: 'वर्तमान कतार संख्या',
    currentlyServing: 'वर्तमान में चालू',
    updatedJustNow: 'अभी लाइव अपडेट हुआ',
    viewDirections: 'दिशा-निर्देश देखें',
    addToCalendar: 'कैलेंडर में जोड़ें',
    turnApproaching: 'आपकी बारी नजदीक है',
    positionsAway: 'आपकी बारी से केवल 3 किसान आगे हैं।',
    proceedToCounter: 'कृपया तुरंत खरीद काउंटर पर पहुंचें।',
    beingProcessed: 'आपकी फसल की खरीद प्रक्रिया जारी है।',
    completedSuccess: 'उपज खरीद सफलतापूर्वक पूरी हुई।',
    stepConfirmed: 'बुकिंग कन्फर्म',
    stepCheckedIn: 'चेक-इन हुआ',
    stepWaiting: 'प्रतीक्षारत',
    stepProcessing: 'प्रक्रिया जारी',
    stepCompleted: 'पूर्ण',
    searchPlaceholder: 'केंद्र या गांव के नाम से खोजें...',
    filterAll: 'सभी',
    filterOpen: 'अभी खुला है',
    filterLowWait: 'कम इंतजार',
    filterNearby: 'नजदीक',
    sortNearest: 'निकटतम',
    sortLowestWait: 'कम इंतजार',
    sortMostSlots: 'अधिकतम उपलब्ध स्लॉट',
    fullSlot: 'भर गया',
    slotsLeft: 'स्लॉट शेष',
    navHome: 'होम',
    navCenters: 'खरीद केंद्र',
    navMyBooking: 'मेरी बुकिंग',
    navNotifications: 'सूचनाएं',
    navProfile: 'प्रोफाइल',
    notificationsTitle: 'सूचनाएं और अपडेट',
    noNotifications: 'कोई नई सूचना नहीं है।',
    profileTitle: 'किसान प्रोफाइल',
    village: 'गांव / तहसील',
    cropType: 'मुख्य फसल',
    phoneNumber: 'मोबाइल नंबर',
    languagePref: 'पसंदीदा भाषा',
    helpSupport: 'सहायता और समर्थन',
    helpSubtitle: 'सामान्य सवालों के त्वरित उत्तर पाएं या अपनी बुकिंग में मदद लें।',
    viewHelpCenter: 'सहायता केंद्र देखें',
    searchQuestion: 'अपना सवाल खोजें...',
    faqTitle: 'अक्सर पूछे जाने वाले सवाल',
    stillNeedHelp: 'क्या और मदद चाहिए?',
    talkToSupport: 'हमारी सहायता टीम से बात करें, हम आपकी समस्या का समाधान करेंगे।',
    callSupport: 'कॉल सहायता',
    speakWithRep: 'सहायता प्रतिनिधि से बात करें',
    messageSupport: 'मैसेज सहायता',
    sendQuestion: 'अपना प्रश्न हमें भेजें',
    reportProblem: 'समस्या दर्ज करें',
    mySupportRequests: 'मेरे सहायता अनुरोध',
    submitRequest: 'अनुरोध भेजें',
    requestSubmitted: 'अनुरोध सफलतापूर्वक दर्ज हुआ',
    noSupportRequests: 'आपका कोई खुला सहायता अनुरोध नहीं है।',
    noFaqFound: 'हमें कोई उत्तर नहीं मिला।',
    tryDifferentSearch: 'दूसरा शब्द खोजें या सहायता टीम से संपर्क करें।',
    landingTagSub: 'कृषि खरीद कतार और स्लॉट प्लेटफ़ॉर्म',
    signIn: 'साइन इन करें',
    staffPortal: 'स्टाफ पोर्टल',
    liveSeasonBadge: 'खरीफ और रबी खरीद सीजन के लिए अभी लाइव',
    findCenterCta: 'खरीद केंद्र खोजें',
    staffLoginCta: 'स्टाफ लॉगिन',
    avgWaitLabel: 'औसत प्रतीक्षा समय',
    zeroQueueLabel: 'सड़क पर भीड़भाड़ नहीं',
    predictableLabel: 'निश्चित स्लॉट',
    howItWorksLabel: 'सरल 4-चरण यात्रा',
    howItWorksTitle: 'कृषि यंत्र कैसे काम करता है',
    howItWorksSubtitle: 'कम इंटरनेट स्पीड वाले फोन और बिना किसी जटिल कागजी कार्रवाई के लिए बनाया गया।',
    stepFindTitle: 'खोजें',
    stepFindDesc: 'नजदीकी खरीद केंद्र और वर्तमान प्रतीक्षा समय देखें।',
    stepBookTitle: 'बुक करें',
    stepBookDesc: 'अपने लिए सुविधाजनक खरीद स्लॉट चुनें।',
    stepTrackTitle: 'ट्रैक करें',
    stepTrackDesc: 'अपना टोकन और लाइव कतार स्थिति देखें।',
    stepArriveTitle: 'पहुंचें',
    stepArriveDesc: 'जब आपकी बारी नजदीक हो तो सूचना पाएं।',
    advantagesLabel: 'मुख्य लाभ',
    advantagesTitle: 'किसानों और केंद्र स्टाफ के लिए बनाया गया',
    benefitWaitTitle: 'कम प्रतीक्षा',
    benefitWaitDesc: 'किसान यात्रा से पहले ही अनुमानित प्रतीक्षा समय जान लेते हैं, जिससे ट्रैक्टर का ईंधन और धूप में लगने वाले घंटे बचते हैं।',
    benefitPlanTitle: 'बेहतर योजना',
    benefitPlanDesc: 'मंडी के बाहर रातभर बिना वजह इंतजार करने की बजाय पक्का स्लॉट बुक करें।',
    benefitLiveTitle: 'लाइव अपडेट',
    benefitLiveDesc: 'कतार की जानकारी वास्तविक समय में वेबसॉकेट और स्वचालित फॉलबैक के जरिए अपडेट होती है।',
    benefitSmsTitle: 'सरल सूचनाएं',
    benefitSmsDesc: 'जब किसान का टोकन 3 स्थान दूर रह जाता है, तब उन्हें स्वचालित SMS अलर्ट मिलता है।',
    benefitOpsTitle: 'बेहतर केंद्र संचालन',
    benefitOpsDesc: 'स्टाफ प्रवाह को नियंत्रित कर सकता है, भीड़भाड़ रोक सकता है, मंडियों में लोड संतुलित कर सकता है, और दैनिक परिचालन विश्लेषण देख सकता है।',
    farmerLoginFooter: 'किसान लॉगिन',
    staffDashboardFooter: 'स्टाफ डैशबोर्ड',
    farmerPortalLabel: 'किसान पोर्टल',
    farmerHeroTitle: 'भरोसे के साथ अपनी मंडी यात्रा की योजना बनाएं।',
    farmerHeroDesc: 'स्लॉट बुक करें, अपना टोकन देखें, और यात्रा से पहले लाइव प्रतीक्षा समय देखें।',
    liveQueueVisibilityTitle: 'लाइव कतार दृश्यता',
    liveQueueVisibilityDesc: 'काउंटर से वास्तविक समय में अपडेट।',
    secureAccountsTitle: 'सुरक्षित स्थानीय खाते',
    secureAccountsDesc: 'क्रेडेंशियल सुरक्षित रूप से एन्क्रिप्ट करके संग्रहित किए जाते हैं।',
    farmerAccessLabel: 'किसान एक्सेस',
    welcomeBack: 'वापसी पर स्वागत है',
    createYourAccount: 'अपना खाता बनाएं',
    logInTab: 'लॉग इन करें',
    signUpTab: 'साइन अप करें',
    fullNameLabel: 'पूरा नाम',
    emailOptionalLabel: 'ईमेल (वैकल्पिक)',
    mobileNumberLabel: 'मोबाइल नंबर',
    aadhaarNumberLabel: 'आधार नंबर',
    aadhaarConsentText: 'मैं आधार पहचान सत्यापन के लिए सहमति देता/देती हूं।',
    villageLabel: 'गांव',
    passwordLabel: 'पासवर्ड',
    logInSecurely: 'सुरक्षित रूप से लॉग इन करें',
    createAccountBtn: 'खाता बनाएं',
    pleaseWaitBtn: 'कृपया प्रतीक्षा करें...',
    useDemoFarmerAccount: 'डेमो किसान खाता उपयोग करें',
    switchPortal: 'पोर्टल बदलें',
    namePlaceholder: 'आपका नाम',
    mobilePlaceholder: '10-अंकों का मोबाइल नंबर',
    aadhaarPlaceholder: '12-अंकों का आधार नंबर',
    villagePlaceholder: 'आपका गांव',
    passwordPlaceholder: 'कम से कम 6 अक्षर',
    bookSlotTitle: 'खरीद स्लॉट बुक करें',
    bookSlotDesc: 'अपनी फसल का विवरण दर्ज करें और तय करें कि आप कब और कहां पहुंचेंगे।',
    cropTypeLabel: 'फसल का प्रकार',
    cropQuantityLabel: 'फसल की मात्रा (किलो)',
    procurementCentreLabel: 'खरीद केंद्र',
    selectCenterOption: 'एक केंद्र चुनें',
    appointmentDateLabel: 'नियुक्ति की तारीख',
    availableTimeSlotLabel: 'उपलब्ध समय स्लॉट',
    selectSlotOption: 'एक स्लॉट चुनें',
    skipBookingBtn: 'अभी के लिए बुकिंग छोड़ें',
    continueToConfirmationBtn: 'पुष्टि की ओर बढ़ें',
    confirmingBookingBtn: 'बुकिंग की पुष्टि हो रही है...',
    liveQueueTrackerLabel: 'लाइव कतार ट्रैकर',
    backToDashboardTitle: 'डैशबोर्ड पर वापस जाएं',

    // New keys (Hindi)
    noActiveBookingTitle: 'कोई सक्रिय बुकिंग नहीं',
    noActiveBookingDesc: 'वर्तमान में आपकी कोई आगामी खरीद बुकिंग नहीं है।',
    filterNearest: 'निकटतम',
    filterLowestWait: 'कम इंतजार',
    filterShortestWait: 'कम इंतजार',
    filterMostSlots: 'अधिकतम स्लॉट',
    filterOpenNow: 'अभी खुला है',
    procurementCentersTitle: 'खरीद केंद्र',
    procurementCentersSub: 'नजदीकी केंद्रों पर स्लॉट खोजें और बुक करें',
    searchCentersPlaceholder: 'नाम या स्थान के अनुसार खोजें...',
    listView: 'सूची',
    mapView: 'नक्शा',
    listMode: 'सूची',
    mapMode: 'नक्शा',
    namaste: 'नमस्ते',
    quoteTitle: 'बेहतर बाजार। उज्जवल भविष्य।',
    quoteSub: 'किसानों का समर्थन करें, राष्ट्र को मजबूत करें।',
    centersAvailableNearYou: 'केंद्र आपके पास उपलब्ध हैं',
    findProcurementCenters: 'खरीद केंद्र खोजें',
    nearbyProcurementCenters: 'नजदीकी खरीद केंद्र',
    allCaughtUp: 'आप पूरी तरह अपडेट हैं!',
    language: 'भाषा',
    enabled: 'सक्षम',
    supportTitle: 'सहायता',
    contactSupport: 'सहायता संपर्क करें',
    confirmed: 'पुष्टि की गई',
    queuePosition: 'कतार की स्थिति',
    highDemand: 'उच्च मांग',
    farmers: 'किसान',
    full: 'भर गया',
    inQueue: 'कतार में',
    queueProgress: 'कतार की प्रगति',
    peopleAhead: 'लोग आपसे आगे हैं',
    currentServing: 'वर्तमान सेवा',
    nextInQueue: 'कतार में अगले',
    procurementMilestones: 'खरीद के चरण',
    viewDetails: 'विवरण देखें',
    viewAll: 'सभी देखें',
    updatesAndAlerts: 'अपडेट और एसएमएस अलर्ट',
    caughtUp: 'आप पूरी तरह अपडेट हैं!',
    noNotificationsDesc: 'कोई नई सूचना नहीं है।',
    farmerAccount: 'किसान खाता',
    identityVerification: 'पहचान सत्यापन',
    verified: 'सत्यापित',
    account: 'खाता',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    bookingHistory: 'बुकिंग इतिहास',
    aboutApp: 'कृषि यंत्र के बारे में',
    signOut: 'साइन आउट',
    deleteAccount: 'खाता हटाएं',
    cancelBooking: 'बुकिंग रद्द करें',
    backToDashboard: 'डैशबोर्ड पर वापस जाएं',
    slotBookedSuccess: 'स्लॉट सफलतापूर्वक बुक हुआ!',
    slotReleased: 'स्लॉट जारी किया गया',
    bookingCancelledTitle: 'बुकिंग रद्द कर दी गई',
    saveDetails: 'विवरण सहेजें',
    viewReceipt: 'रसीद देखें',
    downloadReceipt: 'रसीद डाउनलोड करें',
    backToHome: 'मुख्य पृष्ठ पर वापस जाएं',
    closeReceipt: 'रसीद बंद करें',
    bookNewSlot: 'नया खरीद स्लॉट बुक करें',
    clearFilters: 'फ़िल्टर हटाएं',
    searchAgain: 'पुनः खोजें',
    noCentersFound: 'कोई खरीद केंद्र नहीं मिला',
    noCentersFoundDesc: 'आपके द्वारा चुने गए फ़िल्टर से मेल खाने वाला कोई खरीद केंद्र उपलब्ध नहीं है।',
  },
  kn: {
    appName: 'ಕೃಷಿ ಯಂತ್ರ (KrishiYantra)',
    tagline: 'ನಿಮ್ಮ ಸ್ಲಾಟ್ ತಿಳಿಯಿರಿ. ಸರದಿಯಲ್ಲಿ ಕಾಯುವುದನ್ನು ತಪ್ಪಿಸಿ.',
    subTagline: 'ಖರೀದಿ ಕೇಂದ್ರಗಳಲ್ಲಿನ ಅನಿಶ್ಚಿತ ಕಾಯುವಿಕೆಯನ್ನು ಯೋಜಿತ ಭೇಟಿಯಾಗಿ ಪರಿವರ್ತಿಸಿ.',
    greeting: 'ನಮಸ್ಕಾರ',
    greetingSub: 'ಶುಭೋದಯ! ಇದು ನಿಮ್ಮ ಮುಂದಿನ ಬುಕಿಂಗ್.',
    trackMyQueue: 'ನನ್ನ ಸರದಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    viewBooking: 'ಬುಕಿಂಗ್ ವೀಕ್ಷಿಸಿ',
    yourNextProcurement: 'ನಿಮ್ಮ ಮುಂದಿನ ಖರೀದಿ',
    nearbyCenters: 'ಹತ್ತಿರದ ಖರೀದಿ ಕೇಂದ್ರಗಳು',
    viewCenter: 'ಕೇಂದ್ರವನ್ನು ನೋಡಿ',
    bookSlot: 'ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ',
    open: 'ತೆರೆದಿದೆ',
    busy: 'ಕಾರ್ಯನಿರತ',
    paused: 'ತಾತ್ಕಾಲಿಕ ಸ್ಥಗಿತ',
    closed: 'ಮುಚ್ಚಲಾಗಿದೆ',
    farmersWaiting: 'ರೈತರು ಕಾಯುತ್ತಿದ್ದಾರೆ',
    estimatedWait: 'ಅಂದಾಜು ಕಾಯುವ ಸಮಯ',
    availableSlots: 'ಲಭ್ಯವಿರುವ ಸ್ಲಾಟ್‌ಗಳು',
    distanceKm: 'ಕಿ.ಮೀ',
    operatingHours: 'ಕಾರ್ಯ ನಿರ್ವಹಣಾ ಸಮಯ',
    centerCapacity: 'ದೈನಂದಿನ ಸಾಮರ್ಥ್ಯ',
    todaysSchedule: 'ಇಂದಿನ ವೇಳಾಪಟ್ಟಿ',
    chooseDate: '1. ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ',
    chooseTimeSlot: '2. ಸಮಯದ ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಿ',
    confirmation: '3. ಬುಕಿಂಗ್ ವಿವರ',
    confirmBooking: 'ಬುಕಿಂಗ್ ಖಚಿತಪಡಿಸಿ',
    bookingConfirmed: 'ಬುಕಿಂಗ್ ಖಚಿತಗೊಂಡಿದೆ',
    yourToken: 'ನಿಮ್ಮ ಟೋಕನ್',
    currentPosition: 'ಪ್ರಸ್ತುತ ಸರದಿ ಸಂಖ್ಯೆ',
    currentlyServing: 'ಈಗ ಸೇವೆ ಪಡೆಯುತ್ತಿರುವವರು',
    updatedJustNow: 'ಈಗಷ್ಟೇ ನವೀಕರಿಸಲಾಗಿದೆ',
    viewDirections: 'ದಾರಿ ವಿವರ ನೋಡಿ',
    addToCalendar: 'ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಸೇರಿಸಿ',
    turnApproaching: 'ನಿಮ್ಮ ಸರದಿ ಹತ್ತಿರ ಬರುತ್ತಿದೆ',
    positionsAway: 'ನೀವು ಕೇವಲ 3 ಸ್ಥಾನಗಳ ಹಿಂದಿದ್ದೀರಿ.',
    proceedToCounter: 'ದಯವಿಟ್ಟು ಖರೀದಿ ಕೌಂಟರ್‌ಗೆ ತೆರಳಿ.',
    beingProcessed: 'ನಿಮ್ಮ ಉತ್ಪನ್ನದ ಪರಿಶೀಲನೆ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ.',
    completedSuccess: 'ಖರೀದಿ ಪ್ರಕ್ರಿಯೆ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ.',
    stepConfirmed: 'ಬುಕಿಂಗ್ ಖಚಿತವಾಗಿದೆ',
    stepCheckedIn: 'ಚೆಕ್-ಇನ್ ಆಗಿದೆ',
    stepWaiting: 'ಕಾಯಲಾಗುತ್ತಿದೆ',
    stepProcessing: 'ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ',
    stepCompleted: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    searchPlaceholder: 'ಕೇಂದ್ರ ಅಥವಾ ಊರಿನ ಹೆಸರನ್ನು ಹುಡುಕಿ...',
    filterAll: 'ಎಲ್ಲವೂ',
    filterOpen: 'ಈಗ ತೆರೆದಿದೆ',
    filterLowWait: 'ಕಡಿಮೆ ಕಾಯುವಿಕೆ',
    filterNearby: 'ಹತ್ತಿರದವು',
    sortNearest: 'ಅತ್ಯಂತ ಹತ್ತಿರ',
    sortLowestWait: 'ಕಡಿಮೆ ಸಮಯ',
    sortMostSlots: 'ಹೆಚ್ಚು ಲಭ್ಯವಿರುವ ಸ್ಲಾಟ್‌ಗಳು',
    fullSlot: 'ಭರ್ತಿಯಾಗಿದೆ',
    slotsLeft: 'ಸ್ಲಾಟ್‌ಗಳು ಬಾಕಿ',
    navHome: 'ಮುಖಪುಟ',
    navCenters: 'ಕೇಂದ್ರಗಳು',
    navMyBooking: 'ನನ್ನ ಬುಕಿಂಗ್',
    navNotifications: 'ಅಧಿಸೂಚನೆಗಳು',
    navProfile: 'ಪ್ರೊಫೈಲ್',
    notificationsTitle: 'ಅಧಿಸೂಚನೆಗಳು ಮತ್ತು ನವೀಕರಣಗಳು',
    noNotifications: 'ಯಾವುದೇ ಹೊಸ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ.',
    profileTitle: 'ರೈತರ ಪ್ರೊಫೈಲ್',
    village: 'ಗ್ರಾಮ / ತಾಲೂಕು',
    cropType: 'ಪ್ರಮುಖ ಬೆಳೆ',
    phoneNumber: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    languagePref: 'ಆದ್ಯತೆಯ ಭಾಷೆ',
    helpSupport: 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ',
    helpSubtitle: 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳಿಗೆ ತ್ವರಿತ ಉತ್ತರಗಳನ್ನು ಪಡೆಯಿರಿ ಅಥವಾ ಸಹಾಯ ಪಡೆಯಿರಿ.',
    viewHelpCenter: 'ಸಹಾಯ ಕೇಂದ್ರವನ್ನು ನೋಡಿ',
    searchQuestion: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಹುಡುಕಿ...',
    faqTitle: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು',
    stillNeedHelp: 'ಇನ್ನೂ ಸಹಾಯ ಬೇಕೇ?',
    talkToSupport: 'ನಮ್ಮ ಬೆಂಬಲ ತಂಡದೊಂದಿಗೆ ಮಾತನಾಡಿ, ನಾವು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.',
    callSupport: 'ಕರೆ ಬೆಂಬಲ',
    speakWithRep: 'ಸಹಾಯ ಪ್ರತಿನಿಧಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ',
    messageSupport: 'ಸಂದೇಶ ಬೆಂಬಲ',
    sendQuestion: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನಮಗೆ ಕಳುಹಿಸಿ',
    reportProblem: 'ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ',
    mySupportRequests: 'ನನ್ನ ಸಹಾಯ ವಿನಂತಿಗಳು',
    submitRequest: 'ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಿ',
    requestSubmitted: 'ವಿನಂತಿಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
    noSupportRequests: 'ನಿಮಗೆ ಯಾವುದೇ ಸಕ್ರಿಯ ವಿನಂತಿಗಳಿಲ್ಲ.',
    noFaqFound: 'ಯಾವುದೇ ಉತ್ತರ ಕಂಡುಬಂದಿಲ್ಲ.',
    tryDifferentSearch: 'ಬೇರೆ ಹುಡುಕಾಟವನ್ನು ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಬೆಂಬಲವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    landingTagSub: 'ಕೃಷಿ ಖರೀದಿ ಸರದಿ ಮತ್ತು ಸ್ಲಾಟ್ ವೇದಿಕೆ',
    signIn: 'ಸೈನ್ ಇನ್ ಮಾಡಿ',
    staffPortal: 'ಸಿಬ್ಬಂದಿ ಪೋರ್ಟಲ್',
    liveSeasonBadge: 'ಖರೀಫ್ ಮತ್ತು ರಬಿ ಖರೀದಿ ಋತುವಿಗೆ ಈಗ ಲೈವ್',
    findCenterCta: 'ಖರೀದಿ ಕೇಂದ್ರವನ್ನು ಹುಡುಕಿ',
    staffLoginCta: 'ಸಿಬ್ಬಂದಿ ಲಾಗಿನ್',
    avgWaitLabel: 'ಸರಾಸರಿ ಕಾಯುವ ಸಮಯ',
    zeroQueueLabel: 'ರಸ್ತೆ ದಟ್ಟಣೆ ಇಲ್ಲ',
    predictableLabel: 'ಖಚಿತ ಸ್ಲಾಟ್‌ಗಳು',
    howItWorksLabel: 'ಸರಳ 4-ಹಂತದ ಪ್ರಯಾಣ',
    howItWorksTitle: 'ಕೃಷಿ ಯಂತ್ರ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
    howItWorksSubtitle: 'ಕಡಿಮೆ ಇಂಟರ್ನೆಟ್ ವೇಗದ ಫೋನ್‌ಗಳಿಗಾಗಿ, ಯಾವುದೇ ಸಂಕೀರ್ಣ ಕಾಗದಪತ್ರಗಳಿಲ್ಲದೆ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.',
    stepFindTitle: 'ಹುಡುಕಿ',
    stepFindDesc: 'ಹತ್ತಿರದ ಖರೀದಿ ಕೇಂದ್ರಗಳು ಮತ್ತು ಪ್ರಸ್ತುತ ಕಾಯುವ ಸಮಯವನ್ನು ನೋಡಿ.',
    stepBookTitle: 'ಬುಕ್ ಮಾಡಿ',
    stepBookDesc: 'ನಿಮಗೆ ಅನುಕೂಲಕರವಾದ ಖರೀದಿ ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಿ.',
    stepTrackTitle: 'ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    stepTrackDesc: 'ನಿಮ್ಮ ಟೋಕನ್ ಮತ್ತು ಲೈವ್ ಸರದಿ ಸ್ಥಾನವನ್ನು ಅನುಸರಿಸಿ.',
    stepArriveTitle: 'ತಲುಪಿ',
    stepArriveDesc: 'ನಿಮ್ಮ ಸರದಿ ಹತ್ತಿರ ಬಂದಾಗ ಅಧಿಸೂಚನೆ ಪಡೆಯಿರಿ.',
    advantagesLabel: 'ಪ್ರಮುಖ ಅನುಕೂಲಗಳು',
    advantagesTitle: 'ರೈತರು ಮತ್ತು ಕೇಂದ್ರ ಸಿಬ್ಬಂದಿಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ',
    benefitWaitTitle: 'ಕಡಿಮೆ ಕಾಯುವಿಕೆ',
    benefitWaitDesc: 'ರೈತರು ಪ್ರಯಾಣಿಸುವ ಮೊದಲೇ ನಿರೀಕ್ಷಿತ ಕಾಯುವ ಸಮಯವನ್ನು ತಿಳಿದುಕೊಳ್ಳುತ್ತಾರೆ, ಇದರಿಂದ ಟ್ರ್ಯಾಕ್ಟರ್ ಇಂಧನ ಮತ್ತು ಬಿಸಿಲಿನಲ್ಲಿ ಕಾಯುವ ಸಮಯ ಉಳಿತಾಯವಾಗುತ್ತದೆ.',
    benefitPlanTitle: 'ಉತ್ತಮ ಯೋಜನೆ',
    benefitPlanDesc: 'ಮಂಡಿಯ ಹೊರಗೆ ರಾತ್ರಿಯಿಡೀ ಸುಮ್ಮನೆ ಕಾಯುವ ಬದಲು ಖಚಿತ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ.',
    benefitLiveTitle: 'ಲೈವ್ ಅಪ್‌ಡೇಟ್‌ಗಳು',
    benefitLiveDesc: 'ಸರದಿಯ ಮಾಹಿತಿಯು ವೆಬ್‌ಸಾಕೆಟ್‌ಗಳು ಮತ್ತು ಸ್ವಯಂಚಾಲಿತ ಫಾಲ್‌ಬ್ಯಾಕ್‌ಗಳ ಮೂಲಕ ನೈಜ ಸಮಯದಲ್ಲಿ ನವೀಕರಣಗೊಳ್ಳುತ್ತದೆ.',
    benefitSmsTitle: 'ಸರಳ ಅಧಿಸೂಚನೆಗಳು',
    benefitSmsDesc: 'ರೈತರ ಟೋಕನ್ 3 ಸ್ಥಾನಗಳ ದೂರದಲ್ಲಿದ್ದಾಗ ಅವರಿಗೆ ಸ್ವಯಂಚಾಲಿತ SMS ಎಚ್ಚರಿಕೆ ಸಿಗುತ್ತದೆ.',
    benefitOpsTitle: 'ಉತ್ತಮ ಕೇಂದ್ರ ಕಾರ್ಯಾಚರಣೆ',
    benefitOpsDesc: 'ಸಿಬ್ಬಂದಿ ಥ್ರೂಪುಟ್ ನಿಯಂತ್ರಿಸಬಹುದು, ಜನದಟ್ಟಣೆ ತಡೆಯಬಹುದು, ಮಂಡಿಗಳಾದ್ಯಂತ ಹೊರೆಯನ್ನು ಸಮತೋಲನಗೊಳಿಸಬಹುದು ಮತ್ತು ದೈನಂದಿನ ಕಾರ್ಯಾಚರಣಾ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಪ್ರವೇಶಿಸಬಹುದು.',
    farmerLoginFooter: 'ರೈತರ ಲಾಗಿನ್',
    staffDashboardFooter: 'ಸಿಬ್ಬಂದಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    farmerPortalLabel: 'ರೈತ ಪೋರ್ಟಲ್',
    farmerHeroTitle: 'ವಿಶ್ವಾಸದಿಂದ ನಿಮ್ಮ ಮಂಡಿ ಭೇಟಿಯನ್ನು ಯೋಜಿಸಿ.',
    farmerHeroDesc: 'ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ, ನಿಮ್ಮ ಟೋಕನ್ ಅನುಸರಿಸಿ, ಮತ್ತು ಪ್ರಯಾಣಕ್ಕೂ ಮೊದಲು ಲೈವ್ ಕಾಯುವ ಸಮಯವನ್ನು ನೋಡಿ.',
    liveQueueVisibilityTitle: 'ಲೈವ್ ಸರದಿ ಗೋಚರತೆ',
    liveQueueVisibilityDesc: 'ಕೌಂಟರ್‌ನಿಂದ ನೈಜ ಸಮಯದ ಅಪ್‌ಡೇಟ್‌ಗಳು.',
    secureAccountsTitle: 'ಸುರಕ್ಷಿತ ಸ್ಥಳೀಯ ಖಾತೆಗಳು',
    secureAccountsDesc: 'ರುಜುವಾತುಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಿ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ.',
    farmerAccessLabel: 'ರೈತ ಪ್ರವೇಶ',
    welcomeBack: 'ಮತ್ತೆ ಸ್ವಾಗತ',
    createYourAccount: 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ',
    logInTab: 'ಲಾಗಿನ್ ಮಾಡಿ',
    signUpTab: 'ಸೈನ್ ಅಪ್ ಮಾಡಿ',
    fullNameLabel: 'ಪೂರ್ಣ ಹೆಸರು',
    emailOptionalLabel: 'ಇಮೇಲ್ (ಐಚ್ಛಿಕ)',
    mobileNumberLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    aadhaarNumberLabel: 'ಆಧಾರ್ ಸಂಖ್ಯೆ',
    aadhaarConsentText: 'ನಾನು ಆಧಾರ್ ಗುರುತಿನ ಪರಿಶೀಲನೆಗೆ ಒಪ್ಪುತ್ತೇನೆ.',
    villageLabel: 'ಗ್ರಾಮ',
    passwordLabel: 'ಪಾಸ್‌ವರ್ಡ್',
    logInSecurely: 'ಸುರಕ್ಷಿತವಾಗಿ ಲಾಗಿನ್ ಮಾಡಿ',
    createAccountBtn: 'ಖಾತೆ ರಚಿಸಿ',
    pleaseWaitBtn: 'ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...',
    useDemoFarmerAccount: 'ಡೆಮೊ ರೈತ ಖಾತೆ ಬಳಸಿ',
    switchPortal: 'ಪೋರ್ಟಲ್ ಬದಲಿಸಿ',
    namePlaceholder: 'ನಿಮ್ಮ ಹೆಸರು',
    mobilePlaceholder: '10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    aadhaarPlaceholder: '12-ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆ',
    villagePlaceholder: 'ನಿಮ್ಮ ಗ್ರಾಮ',
    passwordPlaceholder: 'ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು',
    bookSlotTitle: 'ಖರೀದಿ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ',
    bookSlotDesc: 'ನಿಮ್ಮ ಬೆಳೆಯ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ಮತ್ತು ನೀವು ಯಾವಾಗ ಮತ್ತು ಎಲ್ಲಿ ತಲುಪುತ್ತೀರಿ ಎಂಬುದನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    cropTypeLabel: 'ಬೆಳೆ ಪ್ರಕಾರ',
    cropQuantityLabel: 'ಬೆಳೆ ಪ್ರಮಾಣ (ಕೆಜಿ)',
    procurementCentreLabel: 'ಖರೀದಿ ಕೇಂದ್ರ',
    selectCenterOption: 'ಒಂದು ಕೇಂದ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    appointmentDateLabel: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ದಿನಾಂಕ',
    availableTimeSlotLabel: 'ಲಭ್ಯವಿರುವ ಸಮಯ ಸ್ಲಾಟ್',
    selectSlotOption: 'ಒಂದು ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಿ',
    skipBookingBtn: 'ಈಗ ಬುಕಿಂಗ್ ಬಿಟ್ಟುಬಿಡಿ',
    continueToConfirmationBtn: 'ದೃಢೀಕರಣಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ',
    confirmingBookingBtn: 'ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಲಾಗುತ್ತಿದೆ...',
    liveQueueTrackerLabel: 'ಲೈವ್ ಸರದಿ ಟ್ರ್ಯಾಕರ್',
    backToDashboardTitle: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ',

    // New keys (Kannada)
    noActiveBookingTitle: 'ಯಾವುದೇ ಸಕ್ರಿಯ ಬುಕಿಂಗ್ ಇಲ್ಲ',
    noActiveBookingDesc: 'ನಿಮಗೆ ಪ್ರಸ್ತುತ ಯಾವುದೇ ಮುಂಬರುವ ಖರೀದಿ ಬುಕಿಂಗ್ ಇಲ್ಲ.',
    filterNearest: 'ಅತ್ಯಂತ ಹತ್ತಿರ',
    filterLowestWait: 'ಕಡಿಮೆ ಕಾಯುವಿಕೆ',
    filterShortestWait: 'ಕಡಿಮೆ ಕಾಯುವಿಕೆ',
    filterMostSlots: 'ಹೆಚ್ಚು ಸ್ಲಾಟ್‌ಗಳು',
    filterOpenNow: 'ಈಗ ತೆರೆದಿದೆ',
    procurementCentersTitle: 'ಖರೀದಿ ಕೇಂದ್ರಗಳು',
    procurementCentersSub: 'ಹತ್ತಿರದ ಕೇಂದ್ರಗಳಲ್ಲಿ ಸ್ಲಾಟ್‌ಗಳನ್ನು ಹುಡುಕಿ ಮತ್ತು ಬುಕ್ ಮಾಡಿ',
    searchCentersPlaceholder: 'ಹೆಸರು ಅಥವಾ ಸ್ಥಳದ ಮೂಲಕ ಹುಡುಕಿ...',
    listView: 'ಪಟ್ಟಿ',
    mapView: 'ನಕ್ಷೆ',
    listMode: 'ಪಟ್ಟಿ',
    mapMode: 'ನಕ್ಷೆ',
    namaste: 'ನಮಸ್ಕಾರ',
    quoteTitle: 'ಉತ್ತಮ ಮಾರುಕಟ್ಟೆ. ಉಜ್ವಲ ಭವಿಷ್ಯ.',
    quoteSub: 'ರೈತರನ್ನು ಬೆಂಬಲಿಸಿ, ದೇಶವನ್ನು ಬಲಪಡಿಸಿ.',
    centersAvailableNearYou: 'ಕೇಂದ್ರಗಳು ನಿಮ್ಮ ಹತ್ತಿರ ಲಭ್ಯವಿದೆ',
    findProcurementCenters: 'ಖರೀದಿ ಕೇಂದ್ರಗಳನ್ನು ಹುಡುಕಿ',
    nearbyProcurementCenters: 'ಹತ್ತಿರದ ಖರೀದಿ ಕೇಂದ್ರಗಳು',
    allCaughtUp: 'ನೀವು ಸಂಪೂರ್ಣ ನವೀಕರಿಸಲ್ಪಟ್ಟಿದ್ದೀರಿ!',
    language: 'ಭಾಷೆ',
    enabled: 'ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ',
    supportTitle: 'ಬೆಂಬಲ',
    contactSupport: 'ಬೆಂಬಲವನ್ನು ಸಂಪರ್ಕಿಸಿ',
    confirmed: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    queuePosition: 'ಸರದಿಯ ಸ್ಥಾನ',
    highDemand: 'ಹೆಚ್ಚಿನ ಬೇಡಿಕೆ',
    farmers: 'ರೈತರು',
    full: 'ಭರ್ತಿಯಾಗಿದೆ',
    inQueue: 'ಸರದಿಯಲ್ಲಿದ್ದಾರೆ',
    queueProgress: 'ಸರದಿಯ ಪ್ರಗತಿ',
    peopleAhead: 'ಜನರು ನಿಮಗಿಂತ ಮುಂದಿದ್ದಾರೆ',
    currentServing: 'ಪ್ರಸ್ತುತ ಸೇವೆ',
    nextInQueue: 'ಸರದಿಯಲ್ಲಿ ಮುಂದಿನವರು',
    procurementMilestones: 'ಖರೀದಿಯ ಹಂತಗಳು',
    viewDetails: 'ವಿವರಗಳನ್ನು ನೋಡಿ',
    viewAll: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ',
    updatesAndAlerts: 'ಅಪ್‌ಡೇಟ್‌ಗಳು ಮತ್ತು ಎಸ್‌ಎಂಎಸ್‌ ಎಚ್ಚರಿಕೆಗಳು',
    caughtUp: 'ನೀವು ಸಂಪೂರ್ಣವಾಗಿ ನವೀಕರಿಸಲ್ಪಟ್ಟಿದ್ದೀರಿ!',
    noNotificationsDesc: 'ಯಾವುದೇ ಹೊಸ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ.',
    farmerAccount: 'ರೈತರ ಖಾತೆ',
    identityVerification: 'ಗುರುತಿನ ಪರಿಶೀಲನೆ',
    verified: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    account: 'ಖಾತೆ',
    editProfile: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ',
    bookingHistory: 'ಬುಕಿಂಗ್ ಇತಿಹಾಸ',
    aboutApp: 'ಕೃಷಿ ಯಂತ್ರ ಕುರಿತು',
    signOut: 'ಸೈನ್ ಔಟ್ ಮಾಡಿ',
    deleteAccount: 'ಖಾತೆಯನ್ನು ಅಳಿಸಿ',
    cancelBooking: 'ಬುಕಿಂಗ್ ರದ್ದುಗೊಳಿಸಿ',
    backToDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ',
    slotBookedSuccess: 'ಸ್ಲಾಟ್ ಯಶಸ್ವಿಯಾಗಿ ಬುಕ್ ಆಗಿದೆ!',
    slotReleased: 'ಸ್ಲಾಟ್ ಬಿಡುಗಡೆ ಮಾಡಲಾಗಿದೆ',
    bookingCancelledTitle: 'ಬುಕಿಂಗ್ ರದ್ದುಗೊಂಡಿದೆ',
    saveDetails: 'ವಿವರಗಳನ್ನು ಉಳಿಸಿ',
    viewReceipt: 'ರಸೀದಿಯನ್ನು ನೋಡಿ',
    downloadReceipt: 'ರಸೀದಿಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    backToHome: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    closeReceipt: 'ರಸೀದಿಯನ್ನು ಮುಚ್ಚಿ',
    bookNewSlot: 'ಹೊಸ ಖರೀದಿ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ',
    clearFilters: 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ',
    searchAgain: 'ಮತ್ತೆ ಹುಡುಕಿ',
    noCentersFound: 'ಯಾವುದೇ ಖರೀದಿ ಕೇಂದ್ರಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    noCentersFoundDesc: 'ನಿಮ್ಮ ಫಿಲ್ಟರ್‌ಗೆ ಹೊಂದುವ ಯಾವುದೇ ಖರೀದಿ ಕೇಂದ್ರಗಳು ಲಭ್ಯವಿಲ್ಲ.',
  }
};
