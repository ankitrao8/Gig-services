package com.sahakarseva.controller;

import com.sahakarseva.dto.RatingDto;
import com.sahakarseva.model.Booking;
import com.sahakarseva.model.Rating;
import com.sahakarseva.model.Worker;
import com.sahakarseva.repository.BookingRepository;
import com.sahakarseva.repository.RatingRepository;
import com.sahakarseva.repository.WorkerRepository;
import com.sahakarseva.service.AiClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingRepository ratingRepository;
    private final BookingRepository bookingRepository;
    private final WorkerRepository workerRepository;
    private final AiClientService aiClientService;

    public RatingController(
            RatingRepository ratingRepository,
            BookingRepository bookingRepository,
            WorkerRepository workerRepository,
            AiClientService aiClientService
    ) {
        this.ratingRepository = ratingRepository;
        this.bookingRepository = bookingRepository;
        this.workerRepository = workerRepository;
        this.aiClientService = aiClientService;
    }

    @PostMapping
    public ResponseEntity<RatingDto.RatingAuditResponse> submitRating(@RequestBody RatingDto.SubmitRatingRequest req) {
        Booking booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found: " + req.getBookingId()));

        if (!"COMPLETED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException("Rating gate locked: Service must be COMPLETED before reviewing.");
        }

        Worker worker = booking.getWorker();
        String customerId = booking.getCustomer().getId();

        // Count previous ratings between this exact customer and worker
        long priorReviews = ratingRepository.countByCustomerIdAndWorkerId(customerId, worker.getId());

        // Invoke Scikit-learn IsolationForest microservice for anomaly detection
        Map<String, Object> aiResult = aiClientService.evaluateReviewAnomaly(
                worker.getId(),
                customerId,
                req.getRating(),
                req.getReview() != null ? req.getReview() : "",
                req.getJobDurationMinutes() != null ? req.getJobDurationMinutes() : 45.0,
                (int) priorReviews,
                worker.getAverageRating().doubleValue(),
                2.5
        );

        boolean isAnomaly = Boolean.TRUE.equals(aiResult.get("is_anomaly"));
        String risk = (String) aiResult.getOrDefault("risk_level", "LOW");

        Rating rating = Rating.builder()
                .id("RAT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .booking(booking)
                .customer(booking.getCustomer())
                .worker(worker)
                .rating(req.getRating())
                .review(req.getReview())
                .onTime(Boolean.TRUE.equals(req.getOnTime()))
                .isAnomaly(isAnomaly)
                .anomalyRisk(risk)
                .build();

        ratingRepository.save(rating);

        // Update worker average rating if valid
        if (!isAnomaly) {
            List<Rating> ratings = ratingRepository.findByWorkerIdOrderByCreatedAtDesc(worker.getId());
            double sum = ratings.stream().mapToInt(Rating::getRating).sum();
            double avg = sum / (double) ratings.size();
            worker.setAverageRating(BigDecimal.valueOf(avg));
            workerRepository.save(worker);
        }

        String msg = isAnomaly
                ? "Rating flagged by AI Anti-Fraud Engine (Risk: " + risk + ") and held for Primary Society review."
                : "Rating verified and published to cooperative ledger.";

        return ResponseEntity.ok(RatingDto.RatingAuditResponse.builder()
                .ratingId(rating.getId())
                .isAnomaly(isAnomaly)
                .riskLevel(risk)
                .message(msg)
                .build());
    }

    @GetMapping("/flagged")
    public ResponseEntity<List<Rating>> getFlaggedRatings() {
        return ResponseEntity.ok(ratingRepository.findByIsAnomalyTrue());
    }
}
