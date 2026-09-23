import { Request, Response } from 'express';
import { db } from '../database/store';
import { FraudService } from '../services/fraudService';
import { Worker, VerificationStatus } from '../types';

export class AdminController {
  public static async getAnalytics(req: Request, res: Response): Promise<void> {
    const workers = Array.from(db.workers.values());
    const bookings = Array.from(db.bookings.values());
    const payments = Array.from(db.payments.values());
    const users = Array.from(db.users.values());
    const ratings = Array.from(db.ratings.values());

    const totalWorkers = workers.length;
    const activeWorkers = workers.filter(w => w.verificationStatus === 'VERIFIED' && w.availabilityStatus === 'AVAILABLE').length;
    const pendingVerification = workers.filter(w => w.verificationStatus === 'PENDING').length;
    const totalCustomers = users.filter(u => u.role === 'CUSTOMER').length;

    const totalBookings = bookings.length;
    const completedJobs = bookings.filter(b => b.status === 'COMPLETED').length;
    const cancelledJobs = bookings.filter(b => b.status === 'CANCELLED').length;
    const cancellationRate = totalBookings > 0 ? Math.round((cancelledJobs / totalBookings) * 100) : 0;

    const totalTransactionValue = payments.reduce((sum, p) => sum + p.amount, 0);
    const workerEarnings = payments.reduce((sum, p) => sum + p.workerEarning, 0);
    const welfareContributions = payments.reduce((sum, p) => sum + p.welfareContribution, 0);

    const validRatings = ratings.filter(r => !r.flaggedSuspicious);
    const averageRating = validRatings.length > 0
      ? Math.round((validRatings.reduce((sum, r) => sum + r.rating, 0) / validRatings.length) * 10) / 10
      : 4.8;

    const welfareActiveCount = Array.from(db.welfareRecords.values()).filter(w => w.insuranceStatus === 'ACTIVE').length;
    const welfareCoverage = totalWorkers > 0 ? Math.round((welfareActiveCount / totalWorkers) * 100) : 95;

    // Service demand breakdown
    const serviceCounts: Record<string, number> = {};
    bookings.forEach(b => {
      serviceCounts[b.serviceName] = (serviceCounts[b.serviceName] || 0) + 1;
    });
    const serviceDemandData = Object.entries(serviceCounts).map(([name, count]) => ({ name, count }));

    // Monthly bookings trend (Sample for Recharts)
    const monthlyTrend = [
      { month: 'Oct 2025', bookings: 42, revenue: 16800 },
      { month: 'Nov 2025', bookings: 68, revenue: 27200 },
      { month: 'Dec 2025', bookings: 85, revenue: 34000 },
      { month: 'Jan 2026', bookings: 110, revenue: 44000 },
      { month: 'Feb 2026', bookings: 135, revenue: 54000 },
      { month: 'Mar 2026', bookings: 162, revenue: 64800 }
    ];

    // Skill distribution
    const skillDistribution = [
      { name: 'Electrician', value: workers.filter(w => w.skills.some(s => s.skillId === 'sk-elec')).length },
      { name: 'Plumber', value: workers.filter(w => w.skills.some(s => s.skillId === 'sk-plumb')).length },
      { name: 'AC Technician', value: workers.filter(w => w.skills.some(s => s.skillId === 'sk-ac')).length },
      { name: 'Cleaner', value: workers.filter(w => w.skills.some(s => s.skillId === 'sk-clean')).length },
      { name: 'Driver', value: workers.filter(w => w.skills.some(s => s.skillId === 'sk-driv')).length },
      { name: 'Caregiver', value: workers.filter(w => w.skills.some(s => s.skillId === 'sk-care')).length }
    ];

    res.json({
      success: true,
      stats: {
        totalWorkers,
        activeWorkers,
        pendingVerification,
        totalCustomers,
        totalBookings,
        completedJobs,
        cancellationRate,
        averageRating,
        totalTransactionValue,
        workerEarnings,
        welfareContributions,
        welfareCoverage
      },
      charts: {
        monthlyTrend,
        serviceDemandData,
        skillDistribution
      }
    });
  }

  public static async getWorkersList(req: Request, res: Response): Promise<void> {
    const { status, societyId } = req.query;
    let list = Array.from(db.workers.values());

    if (status) {
      list = list.filter(w => w.verificationStatus === status);
    }
    if (societyId) {
      list = list.filter(w => w.societyId === societyId);
    }

    res.json({
      success: true,
      count: list.length,
      workers: list
    });
  }

  public static async verifyWorker(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { status } = req.body as { status: VerificationStatus };

    const worker = db.workers.get(id);
    if (!worker) {
      res.status(404).json({ success: false, message: 'Worker not found' });
      return;
    }

    if (!['VERIFIED', 'REJECTED', 'SUSPENDED', 'PENDING'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid verification status' });
      return;
    }

    worker.verificationStatus = status;
    worker.governmentIdVerified = status === 'VERIFIED';
    if (status === 'VERIFIED') {
      worker.qrVerificationToken = `${worker.workerId}-VERIFIED`;
      worker.welfareStatus = 'ACTIVE';
      worker.insuranceStatus = 'ACTIVE';
    }

    // Notify worker
    db.notifications.set(`notif-${Date.now()}`, {
      id: `notif-${Date.now()}`,
      userId: worker.userId,
      title: status === 'VERIFIED' ? 'Cooperative Verification Approved!' : `Status Update: ${status}`,
      message: status === 'VERIFIED'
        ? `Congratulations! Your membership in ${worker.societyName} has been verified. You can now accept public bookings.`
        : `Your verification status has been set to ${status}. Contact your society secretary.`,
      type: 'SYSTEM',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Worker verification status updated to ${status}`,
      worker
    });
  }

  public static async getFraudAlerts(req: Request, res: Response): Promise<void> {
    const flagged = FraudService.getFlaggedRatings();
    res.json({
      success: true,
      count: flagged.length,
      fraudAlerts: flagged
    });
  }

  public static async getSocieties(req: Request, res: Response): Promise<void> {
    const societies = Array.from(db.societies.values());
    res.json({
      success: true,
      count: societies.length,
      societies
    });
  }
}
