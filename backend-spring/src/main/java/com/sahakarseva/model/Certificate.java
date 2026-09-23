package com.sahakarseva.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "certificates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @Column(name = "certificate_type", nullable = false, length = 150)
    @Builder.Default
    private String certificateType = "Platform-issued Skill Recognition Certificate";

    @Column(nullable = false, length = 100)
    private String skill;

    @Column(nullable = false, length = 20)
    private String level;

    @Column(name = "certificate_number", nullable = false, unique = true, length = 100)
    private String certificateNumber;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "verification_token", nullable = false, unique = true, length = 150)
    private String verificationToken;

    @Column(name = "pdf_url", length = 255)
    private String pdfUrl;
}
