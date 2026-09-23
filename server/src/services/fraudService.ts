import { db } from '../database/store';
import { Rating } from '../types';

export class FraudService {
  /**
   * Evaluates a new rating against anti-fraud rules
   */
  public static evaluateRating(customerId: string, workerId: string, rating: number, review: string): { isSuspicious: boolean; reason?: string } {
    // 1. Check if user has submitted multiple ratings in the last 10 minutes
    const customerRatings = Array.from(db.ratings.values()).filter(r => r.customerId === customerId);
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const recentRatings = customerRatings.filter(r => new Date(r.createdAt).getTime() > tenMinutesAgo);

    if (recentRatings.length >= 3) {
      return {
        isSuspicious: true,
        reason: 'Velocity Alert: Multiple ratings submitted in a very short window (<10 min).'
      };
    }

    // 2. Check for identical review text submitted by the same user across different bookings
    const duplicateReview = customerRatings.find(r => r.review.trim().toLowerCase() === review.trim().toLowerCase() && review.trim().length > 10);
    if (duplicateReview) {
      return {
        isSuspicious: true,
        reason: 'Repetitive Content: Exact identical review text submitted across multiple bookings.'
      };
    }

    // 3. Check for spam keywords or extreme short repetitive phrases
    const spamPatterns = [/worst avoid completely/i, /scam/i, /fake/i, /(.)\1{5,}/];
    for (const pattern of spamPatterns) {
      if (pattern.test(review)) {
        return {
          isSuspicious: true,
          reason: 'Pattern Alert: Flagged repetitive character spam or high-frequency automated text.'
        };
      }
    }

    return { isSuspicious: false };
  }

  /**
   * Retrieves all flagged suspicious ratings for Admin console
   */
  public static getFlaggedRatings(): Rating[] {
    return Array.from(db.ratings.values()).filter(r => r.flaggedSuspicious);
  }
}
