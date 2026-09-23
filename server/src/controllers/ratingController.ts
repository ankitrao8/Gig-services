import { Request, Response } from 'express';
import { db, calculateSkillScore } from '../database/store';
import { FraudService } from '../services/fraudService';
import { AuthenticatedRequest } from '../middleware/auth';
import { Rating } from '../types';

export class RatingController {
  public static async submitRating(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { bookingId, rating, review, onTime } = req.body;
    const customer = req.user;

    if (!customer) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!bookingId || !rating) {
      res.status(400).json({ success: false, message: 'Booking ID and rating (1-5) are required' });
      return;
    }

    const numRating = parseInt(rating, 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5' });
      return;
    }

    const booking = db.bookings.get(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    // CRITICAL: Customer must only be able to rate a booking after it is marked COMPLETED
    if (booking.status !== 'COMPLETED') {
      res.status(400).json({
        success: false,
        message: 'Ratings are only permitted after service is marked COMPLETED to prevent fraudulent reviews.'
      });
      return;
    }

    // Check if already rated
    const existingRating = Array.from(db.ratings.values()).find(r => r.bookingId === bookingId);
    if (existingRating) {
      res.status(400).json({ success: false, message: 'You have already rated this booking.' });
      return;
    }

    // Evaluate anti-fraud rules
    const fraudCheck = FraudService.evaluateRating(customer.id, booking.workerId, numRating, review || '');

    const newRating: Rating = {
      id: `rat-${Date.now()}`,
      bookingId,
      customerId: customer.id,
      customerName: customer.name,
      workerId: booking.workerId,
      rating: numRating,
      review: review || 'Great service!',
      onTime: onTime !== undefined ? !!onTime : true,
      createdAt: new Date().toISOString(),
      flaggedSuspicious: fraudCheck.isSuspicious,
      flagReason: fraudCheck.reason
    };

    db.ratings.set(newRating.id, newRating);

    // Recalculate Worker's Average Rating, onTime %, and Skill Score
    const worker = db.workers.get(booking.workerId);
    if (worker) {
      const allWorkerRatings = Array.from(db.ratings.values()).filter(
        r => r.workerId === worker.id && !r.flaggedSuspicious
      );

      const totalStars = allWorkerRatings.reduce((sum, r) => sum + r.rating, 0);
      worker.averageRating = Math.round((totalStars / allWorkerRatings.length) * 100) / 100;

      const onTimeCount = allWorkerRatings.filter(r => r.onTime).length;
      worker.onTimePercentage = Math.round((onTimeCount / allWorkerRatings.length) * 100);

      const { score, level } = calculateSkillScore(
        worker.completedJobs,
        worker.averageRating,
        worker.onTimePercentage
      );
      worker.skillScore = score;
      worker.skillLevel = level;
    }

    res.status(201).json({
      success: true,
      message: fraudCheck.isSuspicious
        ? 'Rating submitted for cooperative audit review due to unusual pattern detection.'
        : 'Thank you! Your verified rating has been submitted.',
      rating: newRating,
      flagged: fraudCheck.isSuspicious
    });
  }

  public static async getWorkerRatings(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const ratings = Array.from(db.ratings.values()).filter(
      r => r.workerId === id && !r.flaggedSuspicious
    );

    res.json({
      success: true,
      count: ratings.length,
      ratings
    });
  }
}
