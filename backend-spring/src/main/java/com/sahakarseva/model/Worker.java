package com.sahakarseva.model;

import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "workers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Worker {

    @Id
    @Column(length = 50)
    private String id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "society_id")
    private Society society;

    @Column(name = "worker_id", nullable = false, unique = true, length = 50)
    private String workerId;

    @Column(name = "government_id_type", length = 50)
    @Builder.Default
    private String governmentIdType = "Aadhaar";

    @Column(name = "government_id_verified")
    @Builder.Default
    private Boolean governmentIdVerified = true;

    @Column(name = "verification_status", length = 20)
    @Builder.Default
    private String verificationStatus = "VERIFIED";

    @Column(name = "availability_status", length = 20)
    @Builder.Default
    private String availabilityStatus = "AVAILABLE";

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    // PostGIS Spatial Point Column (SRID 4326)
    @Column(columnDefinition = "geometry(Point, 4326)")
    private Point location;

    @Column(name = "average_rating", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal averageRating = new BigDecimal("5.00");

    @Column(name = "completed_jobs")
    @Builder.Default
    private Integer completedJobs = 0;

    @Column(name = "on_time_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal onTimePercentage = new BigDecimal("100.00");

    @Column(name = "skill_score", precision = 8, scale = 2)
    @Builder.Default
    private BigDecimal skillScore = new BigDecimal("0.00");

    @Column(name = "skill_level", length = 20)
    @Builder.Default
    private String skillLevel = "BRONZE";

    @Column(name = "total_earnings", precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalEarnings = BigDecimal.ZERO;

    @Column(name = "welfare_status", length = 20)
    @Builder.Default
    private String welfareStatus = "ACTIVE";

    @Column(name = "insurance_status", length = 20)
    @Builder.Default
    private String insuranceStatus = "ACTIVE";

    @Column(length = 100)
    @Builder.Default
    private String primaryTrade = "Electrician";

    @Column(name = "created_at")
    @Builder.Default
    private ZonedDateTime createdAt = ZonedDateTime.now();
}
