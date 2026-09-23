package com.sahakarseva.repository;

import com.sahakarseva.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, String> {
    List<Rating> findByWorkerIdOrderByCreatedAtDesc(String workerId);
    Optional<Rating> findByBookingId(String bookingId);
    long countByCustomerIdAndWorkerId(String customerId, String workerId);
    List<Rating> findByIsAnomalyTrue();
}
