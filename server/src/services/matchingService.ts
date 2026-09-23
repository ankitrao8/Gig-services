import { db } from '../database/store';
import { Worker } from '../types';

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface WorkerMatchCriteria {
  skillId?: string;
  category?: string;
  customerLat?: number;
  customerLng?: number;
  maxDistanceKm?: number;
  minRating?: number;
  maxPrice?: number;
  onlyAvailable?: boolean;
  emergency?: boolean;
}

export class MatchingService {
  public static findWorkers(criteria: WorkerMatchCriteria): (Worker & { distanceKm: number; etaMinutes: number })[] {
    const lat = criteria.customerLat || 25.3176;
    const lng = criteria.customerLng || 82.9739;
    const maxDist = criteria.maxDistanceKm || 25;

    const workers = Array.from(db.workers.values());

    const matched = workers
      .filter(w => {
        // Verification filter
        if (w.verificationStatus !== 'VERIFIED') return false;

        // Emergency requires worker to be AVAILABLE
        if (criteria.emergency && w.availabilityStatus !== 'AVAILABLE') return false;

        // Availability filter
        if (criteria.onlyAvailable && w.availabilityStatus !== 'AVAILABLE') return false;

        // Skill filter
        if (criteria.skillId) {
          const hasSkill = w.skills.some(
            s => s.skillId.toLowerCase() === criteria.skillId!.toLowerCase() || s.name.toLowerCase().includes(criteria.skillId!.toLowerCase())
          );
          if (!hasSkill) return false;
        }

        // Rating filter
        if (criteria.minRating && w.averageRating < criteria.minRating) return false;

        // Price filter
        if (criteria.maxPrice && w.startingPrice > criteria.maxPrice) return false;

        return true;
      })
      .map(w => {
        const dist = calculateDistanceKm(lat, lng, w.latitude, w.longitude);
        // ETA formula: base 5 mins + 3 mins per km
        const eta = Math.max(5, Math.round(5 + dist * 3));
        return {
          ...w,
          distanceKm: dist,
          etaMinutes: eta
        };
      })
      .filter(w => w.distanceKm <= maxDist);

    // Sorting algorithm:
    // For emergency: available + closest + verified
    // For standard: distance, rating, completed jobs weight
    if (criteria.emergency) {
      return matched.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return matched.sort((a, b) => {
      const scoreA = (a.averageRating * 20) + (a.completedJobs * 0.1) - (a.distanceKm * 2);
      const scoreB = (b.averageRating * 20) + (b.completedJobs * 0.1) - (b.distanceKm * 2);
      return scoreB - scoreA;
    });
  }
}
