import { Worker, Booking, Skill, Rating, Payment, Certificate, Welfare, DemandForecast, ZoneDemand, Society } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('sahakar_token');
  const demoRole = localStorage.getItem('sahakar_demo_role');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (demoRole) {
    headers['x-demo-role'] = demoRole;
  }

  return headers;
}

export const api = {
  // Auth
  async login(phone: string, otp?: string, password?: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, password })
    });
    return res.json();
  },

  async verifyOtp(phone: string, otp: string) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    return res.json();
  },

  async register(data: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Workers
  async getWorkers(params?: Record<string, any>): Promise<{ workers: Worker[]; count: number }> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/workers${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getWorkerById(id: string): Promise<{ worker: Worker; reviews: Rating[]; certificates: Certificate[]; welfare?: any }> {
    const res = await fetch(`${API_BASE}/workers/${id}`);
    return res.json();
  },

  async getWorkerIdCard(id: string) {
    const res = await fetch(`${API_BASE}/workers/${id}/id-card`);
    return res.json();
  },

  async updateAvailability(workerId: string, status: string) {
    const res = await fetch(`${API_BASE}/workers/${workerId}/availability`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Public Worker Verification
  async verifyWorkerPublic(token: string) {
    const res = await fetch(`${API_BASE}/verify-worker/${token}`);
    return res.json();
  },

  // Services
  async getServices(): Promise<{ services: Skill[]; count: number }> {
    const res = await fetch(`${API_BASE}/services`);
    return res.json();
  },

  async getServiceById(id: string) {
    const res = await fetch(`${API_BASE}/services/${id}`);
    return res.json();
  },

  // Bookings
  async createBooking(data: any) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async createEmergencyBooking(data: any) {
    const res = await fetch(`${API_BASE}/bookings/emergency`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getBookings(status?: string): Promise<{ bookings: Booking[]; count: number }> {
    const res = await fetch(`${API_BASE}/bookings${status ? `?status=${status}` : ''}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getBookingById(id: string): Promise<{ booking: Booking; worker: Worker; payment?: Payment; rating?: Rating }> {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async updateBookingStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Payments & Invoices
  async processPayment(data: { bookingId: string; amount: number; paymentMethod: string }) {
    const res = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getPaymentByBooking(bookingId: string) {
    const res = await fetch(`${API_BASE}/payments/${bookingId}`);
    return res.json();
  },

  // Ratings
  async submitRating(data: { bookingId: string; rating: number; review: string; onTime?: boolean }) {
    const res = await fetch(`${API_BASE}/ratings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getWorkerRatings(workerId: string): Promise<{ ratings: Rating[]; count: number }> {
    const res = await fetch(`${API_BASE}/workers/${workerId}/ratings`);
    return res.json();
  },

  // Welfare
  async getWelfare(workerId: string): Promise<{ welfare: Welfare }> {
    const res = await fetch(`${API_BASE}/welfare/${workerId}`);
    return res.json();
  },

  async updateWelfare(workerId: string, data: any) {
    const res = await fetch(`${API_BASE}/welfare/${workerId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Certificates
  async getCertificates(workerId: string): Promise<{ certificates: Certificate[]; count: number }> {
    const res = await fetch(`${API_BASE}/certificates/${workerId}`);
    return res.json();
  },

  async verifyCertificatePublic(token: string) {
    const res = await fetch(`${API_BASE}/certificates/verify/${token}`);
    return res.json();
  },

  // Admin
  async getAdminAnalytics() {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getAdminWorkers(params?: any): Promise<{ workers: Worker[]; count: number }> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/workers${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async verifyWorker(workerId: string, status: string) {
    const res = await fetch(`${API_BASE}/admin/workers/${workerId}/verify`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async getFraudAlerts() {
    const res = await fetch(`${API_BASE}/admin/fraud`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getSocieties(): Promise<{ societies: Society[]; count: number }> {
    const res = await fetch(`${API_BASE}/admin/societies`);
    return res.json();
  },

  // AI Forecast & Workforce Allocation
  async getDemandForecast(): Promise<{ serviceForecasts: DemandForecast[]; zoneDemands: ZoneDemand[]; modelDetails: any }> {
    const res = await fetch(`${API_BASE}/forecast`);
    return res.json();
  },

  async getWorkforceRecommendations() {
    const res = await fetch(`${API_BASE}/workforce/recommendations`);
    return res.json();
  },

  // Notifications
  async getNotifications(userId?: string) {
    const res = await fetch(`${API_BASE}/notifications${userId ? `?userId=${userId}` : ''}`);
    return res.json();
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT'
    });
    return res.json();
  }
};
