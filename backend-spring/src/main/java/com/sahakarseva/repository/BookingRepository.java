package com.sahakarseva.repository;

import com.sahakarseva.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(String customerId);
    List<Booking> findByWorkerIdOrderByCreatedAtDesc(String workerId);
    List<Booking> findByStatus(String status);
    List<Booking> findByEmergencyTrue();
    long countByCustomerIdAndWorkerId(String customerId, String workerId);
}
