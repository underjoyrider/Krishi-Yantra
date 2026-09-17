export type Role = 'FARMER' | 'VENDOR' | 'STAFF' | 'ADMIN';

export type CenterStatus = 'OPEN' | 'BUSY' | 'PAUSED' | 'CLOSED';

export type SlotStatus = 'AVAILABLE' | 'FULL' | 'DISABLED';

export type BookingStatus =
  | 'BOOKED'
  | 'CHECKED_IN'
  | 'WAITING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface User {
  id: string;
  name: string;
  phone: string;
  customerId?: string;
  role: Role;
  createdAt: string;
  farmerProfile?: FarmerProfile;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  village: string;
  cropType: string;
  language: string;
}

export interface ProcurementCenter {
  id: string;
  name: string;
  code: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  activeCounters: number;
  avgProcessMins: number;
  status: CenterStatus;
  openingTime: string;
  closingTime: string;
  distanceKm?: number;
  currentQueue?: number;
  estimatedWaitMins?: number;
  availableSlotsCount?: number;
}

export interface Slot {
  id: string;
  centerId: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  status: SlotStatus;
}

export interface Booking {
  id: string;
  farmerId: string;
  centerId: string;
  slotId: string;
  tokenNumber: string;
  status: BookingStatus;
  estimatedWait: number;
  queuePosition: number;
  cropType?: string;
  quantityKg?: number;
  createdAt: string;
  updatedAt: string;
  center?: ProcurementCenter;
  slot?: Slot;
  user?: User;
}

export interface NotificationItem {
  id: string;
  userId: string;
  bookingId?: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'QUEUE' | 'DELAY' | 'COMPLETION' | 'CLOSURE';
  read: boolean;
  createdAt: string;
}
