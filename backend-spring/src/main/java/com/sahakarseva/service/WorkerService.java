package com.sahakarseva.service;

import com.sahakarseva.model.Worker;
import com.sahakarseva.repository.WorkerRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;

    public WorkerService(WorkerRepository workerRepository) {
        this.workerRepository = workerRepository;
    }

    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }

    public Optional<Worker> getWorkerById(String id) {
        return workerRepository.findById(id);
    }

    public Optional<Worker> getWorkerByToken(String workerToken) {
        return workerRepository.findByWorkerId(workerToken);
    }

    /**
     * Finds nearby workers using PostGIS ST_DWithin query with Haversine fallback.
     */
    public List<Worker> findNearbyWorkers(double lat, double lon, double radiusMeters, String trade) {
        try {
            List<Worker> spatialMatches = workerRepository.findNearbyWorkersPostGis(lat, lon, radiusMeters, trade);
            if (!spatialMatches.isEmpty()) {
                return spatialMatches;
            }
        } catch (Exception ignored) {
            // PostGIS spatial fallback to in-memory Haversine formula
        }

        List<Worker> allAvailable = (trade != null && !trade.isBlank())
                ? workerRepository.findByPrimaryTradeAndAvailabilityStatus(trade, "AVAILABLE")
                : workerRepository.findByAvailabilityStatus("AVAILABLE");

        return allAvailable.stream()
                .filter(w -> calculateHaversineDistance(lat, lon, w.getLatitude().doubleValue(), w.getLongitude().doubleValue()) <= (radiusMeters / 1000.0))
                .sorted(Comparator.comparingDouble(w -> calculateHaversineDistance(lat, lon, w.getLatitude().doubleValue(), w.getLongitude().doubleValue())))
                .collect(Collectors.toList());
    }

    /**
     * Compute Open Cooperative Skill Tier Formula:
     * Skill Score = (Completed Jobs * 0.4) + (Average Rating * 12) + (OnTime% * 0.2)
     */
    public BigDecimal calculateSkillScore(int jobs, double rating, double onTimePct) {
        double score = (jobs * 0.4) + (rating * 12.0) + (onTimePct * 0.2);
        return BigDecimal.valueOf(Math.min(100.0, score)).setScale(2, RoundingMode.HALF_UP);
    }

    public String determineSkillLevel(BigDecimal skillScore) {
        double val = skillScore.doubleValue();
        if (val >= 90.0) return "MASTER";
        if (val >= 80.0) return "GOLD";
        if (val >= 65.0) return "SILVER";
        return "BRONZE";
    }

    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
