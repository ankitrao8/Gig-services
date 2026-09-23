package com.sahakarseva.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @Column(length = 50)
    private String id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "base_fare", precision = 10, scale = 2)
    private BigDecimal baseFare;

    @Column(name = "gst_amount", precision = 10, scale = 2)
    private BigDecimal gstAmount; // 18% GST

    @Column(name = "welfare_contribution", precision = 10, scale = 2)
    private BigDecimal welfareContribution; // 2% Cooperative Welfare Fund

    @Column(name = "payment_method", nullable = false, length = 30)
    @Builder.Default
    private String paymentMethod = "UPI"; // UPI, RAZORPAY, CARD, CASH

    @Column(name = "transaction_id", nullable = false, unique = true, length = 100)
    private String transactionId;

    @Column(name = "razorpay_order_id", length = 100)
    private String razorpayOrderId;

    @Column(name = "upi_vpa", length = 100)
    private String upiVpa;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "COMPLETED"; // PENDING, COMPLETED, FAILED, REFUNDED

    @Column(name = "paid_at")
    @Builder.Default
    private ZonedDateTime paidAt = ZonedDateTime.now();
}
