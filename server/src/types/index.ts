export type Role = 'CUSTOMER' | 'WORKER' | 'SOCIETY_ADMIN' | 'FEDERATION_ADMIN';

export type SkillLevel = 'BRONZE' | 'SILVER' | 'GOLD' | 'MASTER';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export type BookingType = 'INSTANT' | 'SCHEDULED' | 'RECURRING' | 'EMERGENCY';

export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'WORKER_ON_WAY'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  passwordHash: string;
  role: Role;
  profilePhoto?: string;
  language: string;
  createdAt: string;
}

export interface Society {
  id: string;
  name: string;
  registrationNumber: string;
  district: string;
  state: string;
  address: string;
  adminId: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'SUSPENDED';
  memberCount?: number;
  phone?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  basePrice: number;
}

export interface WorkerSkill {
  skillId: string;
  name: string;
  experienceYears: number;
  skillLevel: SkillLevel;
}

export interface Worker {
  id: string;
  userId: string;
  societyId: string;
  societyName: string;
  workerId: string; // e.g. SKR-EL-10291
  name: string;
  phone: string;
  profilePhoto: string;
  governmentIdType: string;
  governmentIdVerified: boolean;
  verificationStatus: VerificationStatus;
  availabilityStatus: AvailabilityStatus;
  latitude: number;
  longitude: number;
  averageRating: number;
  completedJobs: number;
  onTimePercentage: number;
  skillScore: number;
  skillLevel: SkillLevel;
  totalEarnings: number;
  welfareStatus: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  insuranceStatus: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  skills: WorkerSkill[];
  startingPrice: number;
  bio?: string;
  createdAt: string;
  qrVerificationToken: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  serviceId: string;
  serviceName: string;
  bookingType: BookingType;
  status: BookingStatus;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  latitude?: number;
  longitude?: number;
  estimatedPrice: number;
  finalPrice?: number;
  emergency: boolean;
  problemDescription?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  platformFee: number;
  welfareContribution: number;
  gst: number;
  workerEarning: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  status: PaymentStatus;
  paidAt: string;
}

export interface Rating {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  workerId: string;
  rating: number;
  review: string;
  onTime: boolean;
  createdAt: string;
  flaggedSuspicious?: boolean;
  flagReason?: string;
}

export interface Certificate {
  id: string;
  workerId: string;
  workerName: string;
  certificateType: string;
  skill: string;
  level: SkillLevel;
  certificateNumber: string;
  issueDate: string;
  verificationToken: string;
  issuer: string;
}

export interface Welfare {
  id: string;
  workerId: string;
  insuranceStatus: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  insuranceProvider: string;
  policyNumber: string;
  welfareFund: number;
  accidentCoverage: 'ACTIVE' | 'INACTIVE';
  lastContribution: number;
  nextRenewal: string;
  lastUpdated: string;
  contributions: {
    date: string;
    amount: number;
    bookingId?: string;
    type: string;
  }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'WELFARE' | 'SKILL' | 'SYSTEM' | 'EMERGENCY';
  read: boolean;
  createdAt: string;
}

export interface DemandForecast {
  service: string;
  forecast: 'HIGH' | 'MEDIUM' | 'LOW';
  expectedDemand: number;
  trend: 'UPWARD' | 'STABLE' | 'DOWNWARD';
  confidence: number;
  sevenDaysPrediction: { day: string; projectedJobs: number }[];
}

export interface ZoneDemand {
  zone: string;
  demandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  activeWorkers: number;
  recommendedWorkers: { skill: string; count: number }[];
}
