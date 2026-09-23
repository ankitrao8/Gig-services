package com.sahakarseva.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;

@Entity
@Table(name = "welfare")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Welfare {

    @Id
    @Column(length = 50)
    private String id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id", nullable = false, unique = true)
    private Worker worker;

    @Column(name = "insurance_status", length = 20)
    @Builder.Default
    private String insuranceStatus = "ACTIVE";

    @Column(name = "insurance_provider", length = 100)
    @Builder.Default
    private String insuranceProvider = "National Insurance Cooperative Scheme (PM-SBBY)";

    @Column(name = "policy_number", length = 100)
    private String policyNumber;

    @Column(name = "welfare_fund", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal welfareFund = new BigDecimal("4250.00");

    @Column(name = "accident_coverage", length = 20)
    @Builder.Default
    private String accidentCoverage = "ACTIVE";

    @Column(name = "last_contribution", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal lastContribution = new BigDecimal("250.00");

    @Column(name = "next_renewal")
    private LocalDate nextRenewal;

    @Column(name = "last_updated")
    @Builder.Default
    private ZonedDateTime lastUpdated = ZonedDateTime.now();
}
