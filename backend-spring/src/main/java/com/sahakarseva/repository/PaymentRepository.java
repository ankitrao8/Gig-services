package com.sahakarseva.repository;

import com.sahakarseva.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    Optional<Payment> findByBookingId(String bookingId);
    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
}
