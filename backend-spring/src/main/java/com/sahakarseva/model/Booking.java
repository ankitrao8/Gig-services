package com.sahakarseva.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id")
    private Worker worker;

    @Column(name = "service_name", length = 100)
    private String serviceName;

    @Column(name = "booking_type", nullable = false, length = 20)
    @Builder.Default
    private String bookingType = "INSTANT"; // INSTANT, SCHEDULED, RECURRING, EMERGENCY

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "REQUESTED"; // REQUESTED, ACCEPTED, WORKER_ON_WAY, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Column(name = "scheduled_time", nullable = false, length = 30)
    private String scheduledTime;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "estimated_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal estimatedPrice;

    @Column(name = "final_price", precision = 10, scale = 2)
    private BigDecimal finalPrice;

    @Column
    @Builder.Default
    private Boolean emergency = false;

    @Column(name = "problem_description", columnDefinition = "TEXT")
    private String problemDescription;

    @Column(name = "created_at")
    @Builder.Default
    private ZonedDateTime createdAt = ZonedDateTime.now();
}
