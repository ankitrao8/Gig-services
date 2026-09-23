import { Request, Response } from 'express';
import { db, calculateSkillScore } from '../database/store';
import { MatchingService } from '../services/matchingService';
import { AuthenticatedRequest } from '../middleware/auth';
import { Booking, BookingStatus } from '../types';

export class BookingController {
  public static async createBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
    const {
      workerId,
      serviceId,
      bookingType,
      scheduledDate,
      scheduledTime,
      address,
      latitude,
      longitude,
      problemDescription,
      imageUrl,
      emergency
    } = req.body;

    const customer = req.user;
    if (!customer) {
      res.status(401).json({ success: false, message: 'Authentication required to create booking' });
      return;
    }

    const worker = db.workers.get(workerId);
    if (!worker) {
      res.status(404).json({ success: false, message: 'Worker not found' });
      return;
    }

    const skill = db.skills.get(serviceId) || worker.skills[0];
    const serviceName = skill ? skill.name : 'General Cooperative Service';
    const estimatedPrice = worker.startingPrice + (emergency ? 100 : 0);

    const bookingId = `BK-${Date.now().toString().slice(-6)}`;
    const newBooking: Booking = {
      id: bookingId,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      workerId: worker.id,
      workerName: worker.name,
      workerPhone: worker.phone,
      serviceId: (skill && 'id' in skill) ? skill.id : (skill ? (skill as any).skillId : 'sk-elec'),
      serviceName,
      bookingType: emergency ? 'EMERGENCY' : (bookingType || 'SCHEDULED'),
      status: emergency ? 'ACCEPTED' : 'REQUESTED',
      scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: scheduledTime || '10:00 AM',
      address: address || 'Dashashwamedh Ghat Road, Varanasi',
      latitude: latitude || 25.3176,
      longitude: longitude || 82.9739,
      estimatedPrice,
      finalPrice: estimatedPrice,
      emergency: !!emergency,
      problemDescription,
      imageUrl,
      createdAt: new Date().toISOString()
    };

    db.bookings.set(newBooking.id, newBooking);

    // Notify worker
    db.notifications.set(`notif-${Date.now()}`, {
      id: `notif-${Date.now()}`,
      userId: worker.userId,
      title: emergency ? '🚨 EMERGENCY Booking Assigned!' : 'New Booking Request',
      message: `${customer.name} booked ${serviceName} for ${newBooking.scheduledDate} at ${newBooking.scheduledTime}.`,
      type: emergency ? 'EMERGENCY' : 'BOOKING',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: emergency ? 'Emergency service dispatched!' : 'Booking created successfully',
      booking: newBooking
    });
  }

  public static async createEmergencyBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { serviceId, address, latitude, longitude, problemDescription } = req.body;
    const customer = req.user;

    const lat = latitude || 25.3176;
    const lng = longitude || 82.9739;

    // Find nearest available verified worker
    const matchedWorkers = MatchingService.findWorkers({
      skillId: serviceId,
      customerLat: lat,
      customerLng: lng,
      emergency: true,
      onlyAvailable: true
    });

    if (matchedWorkers.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No available verified cooperative workers found within your immediate radius. Please try another category or scheduled booking.'
      });
      return;
    }

    const assignedWorker = matchedWorkers[0];
    const skill = db.skills.get(serviceId) || assignedWorker.skills[0];
    const serviceName = skill ? skill.name : 'Emergency Service';

    const bookingId = `BK-EMG-${Date.now().toString().slice(-5)}`;
    const newBooking: Booking = {
      id: bookingId,
      customerId: customer ? customer.id : 'usr-cust-1',
      customerName: customer ? customer.name : 'Sunita Sharma',
      customerPhone: customer ? customer.phone : '9999999999',
      workerId: assignedWorker.id,
      workerName: assignedWorker.name,
      workerPhone: assignedWorker.phone,
      serviceId: (skill && 'id' in skill) ? skill.id : (skill ? (skill as any).skillId : 'sk-elec'),
      serviceName,
      bookingType: 'EMERGENCY',
      status: 'ACCEPTED',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: 'Immediate (Within 15 mins)',
      address: address || 'Current Detected Location, Varanasi',
      latitude: lat,
      longitude: lng,
      estimatedPrice: assignedWorker.startingPrice + 100, // emergency fee
      finalPrice: assignedWorker.startingPrice + 100,
      emergency: true,
      problemDescription: problemDescription || 'Urgent repair assistance requested.',
      createdAt: new Date().toISOString()
    };

    db.bookings.set(newBooking.id, newBooking);

    res.status(201).json({
      success: true,
      message: `Emergency booking confirmed! Worker ${assignedWorker.name} has been assigned.`,
      booking: newBooking,
      worker: {
        name: assignedWorker.name,
        phone: assignedWorker.phone,
        rating: assignedWorker.averageRating,
        distanceKm: assignedWorker.distanceKm,
        etaMinutes: assignedWorker.etaMinutes,
        society: assignedWorker.societyName
      }
    });
  }

  public static async getBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { status, role } = req.query;
    let list = Array.from(db.bookings.values());

    const user = req.user;
    if (user) {
      if (user.role === 'CUSTOMER') {
        list = list.filter(b => b.customerId === user.id);
      } else if (user.role === 'WORKER') {
        const worker = Array.from(db.workers.values()).find(w => w.userId === user.id);
        if (worker) {
          list = list.filter(b => b.workerId === worker.id);
        }
      }
    }

    if (status) {
      list = list.filter(b => b.status === status);
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      count: list.length,
      bookings: list
    });
  }

  public static async getBookingById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const booking = db.bookings.get(id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    const worker = db.workers.get(booking.workerId);
    const payment = Array.from(db.payments.values()).find(p => p.bookingId === booking.id);
    const rating = Array.from(db.ratings.values()).find(r => r.bookingId === booking.id);

    res.json({
      success: true,
      booking,
      worker,
      payment,
      rating
    });
  }

  public static async updateBookingStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { status } = req.body as { status: BookingStatus };

    const booking = db.bookings.get(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    const validStatuses: BookingStatus[] = [
      'REQUESTED',
      'ACCEPTED',
      'WORKER_ON_WAY',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED'
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid booking status' });
      return;
    }

    booking.status = status;
    booking.updatedAt = new Date().toISOString();

    // If completed, update worker jobs count and recalculate skill score
    if (status === 'COMPLETED') {
      const worker = db.workers.get(booking.workerId);
      if (worker) {
        worker.completedJobs += 1;
        worker.totalEarnings += booking.finalPrice || booking.estimatedPrice;

        const { score, level } = calculateSkillScore(
          worker.completedJobs,
          worker.averageRating,
          worker.onTimePercentage
        );
        worker.skillScore = score;
        worker.skillLevel = level;

        // Add ₹25 to worker welfare fund
        const welfare = db.welfareRecords.get(worker.id);
        if (welfare) {
          welfare.welfareFund += 25;
          welfare.contributions.unshift({
            date: new Date().toISOString().split('T')[0],
            amount: 25,
            bookingId: booking.id,
            type: 'Booking Welfare Contribution'
          });
        }
      }
    }

    // Send notifications to customer
    db.notifications.set(`notif-${Date.now()}`, {
      id: `notif-${Date.now()}`,
      userId: booking.customerId,
      title: `Booking Update: ${status}`,
      message: `Your booking ${booking.id} status changed to ${status}.`,
      type: 'BOOKING',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Booking status changed to ${status}`,
      booking
    });
  }
}
